<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PendaftaranController extends Controller
{
    /**
     * Display listing of pendaftarans with search, filtering, and stats.
     */
    public function index(Request $request)
    {
        $query = Pendaftaran::query()->with('santri');

        // Search query
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                  ->orWhere('nama_ortu', 'like', "%{$search}%")
                  ->orWhere('no_hp_ortu', 'like', "%{$search}%")
                  ->orWhere('alamat_domisili', 'like', "%{$search}%")
                  ->orWhere('alamat_ortu', 'like', "%{$search}%")
                  ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->input('status') !== 'Semua') {
            $query->where('status', $request->input('status'));
        }

        // Program filter
        if ($request->filled('program') && $request->input('program') !== 'Semua') {
            $query->where('jenis_maktab', $request->input('program'));
        }

        // Gender filter
        if ($request->filled('gender') && $request->input('gender') !== 'Semua') {
            $query->where('jenis_kelamin', $request->input('gender'));
        }

        // Sort order
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $pendaftarans = $query->get()->map(function ($p) {
            $hasFoto = !empty($p->foto_santri);
            $hasKK = !empty($p->kartu_keluarga);
            $hasKtp = !empty($p->ktp_ortu);
            $docCount = ($hasFoto ? 1 : 0) + ($hasKK ? 1 : 0) + ($hasKtp ? 1 : 0);

            return [
                'id' => $p->id,
                'no_pendaftaran' => $p->no_pendaftaran,
                'nama_lengkap' => $p->nama_lengkap,
                'jenis_maktab' => $p->jenis_maktab,
                'tempat_lahir' => $p->tempat_lahir,
                'tanggal_lahir' => $p->tanggal_lahir ? $p->tanggal_lahir->format('Y-m-d') : null,
                'tanggal_lahir_formatted' => $p->tanggal_lahir ? $p->tanggal_lahir->translatedFormat('d F Y') : null,
                'umur' => $p->tanggal_lahir ? $p->tanggal_lahir->age : null,
                'jenis_kelamin' => $p->jenis_kelamin,
                'alamat_domisili' => $p->alamat_domisili,
                'nama_ortu' => $p->nama_ortu,
                'no_hp_ortu' => $p->no_hp_ortu,
                'pekerjaan_ortu' => $p->pekerjaan_ortu,
                'alamat_ortu' => $p->alamat_ortu,
                'keterangan_tambahan' => $p->keterangan_tambahan,
                'foto_santri' => $p->foto_santri,
                'kartu_keluarga' => $p->kartu_keluarga,
                'ktp_ortu' => $p->ktp_ortu,
                'has_foto' => $hasFoto,
                'has_kk' => $hasKK,
                'has_ktp' => $hasKtp,
                'doc_count' => $docCount,
                'doc_complete' => $docCount === 3,
                'status' => $p->status,
                'catatan_admin' => $p->catatan_admin,
                'santri_id' => $p->santri_id,
                'santri' => $p->santri ? [
                    'id' => $p->santri->id,
                    'nis' => $p->santri->nis,
                    'nama_lengkap' => $p->santri->nama_lengkap,
                ] : null,
                'tanggal_verifikasi' => $p->tanggal_verifikasi ? $p->tanggal_verifikasi->translatedFormat('d M Y, H:i') : null,
                'created_at' => $p->created_at ? $p->created_at->translatedFormat('d M Y, H:i') : null,
                'created_date' => $p->created_at ? $p->created_at->format('Y-m-d') : null,
            ];
        });

        // Compute statistics for top cards
        $stats = [
            'total' => Pendaftaran::count(),
            'menunggu' => Pendaftaran::where('status', 'Menunggu Verifikasi')->count(),
            'diproses' => Pendaftaran::where('status', 'Diproses')->count(),
            'lulus' => Pendaftaran::where('status', 'Lulus')->count(),
            'ditolak' => Pendaftaran::where('status', 'Ditolak')->count(),
            'maktab_tuli' => Pendaftaran::where('jenis_maktab', 'Maktab Tuli As-Sami')->count(),
            'maktab_autis' => Pendaftaran::where('jenis_maktab', 'Maktab Autis')->count(),
            'dokumen_lengkap' => Pendaftaran::whereNotNull('foto_santri')->whereNotNull('kartu_keluarga')->whereNotNull('ktp_ortu')->count(),
            'next_nis' => Santri::generateNis(),
        ];

        return Inertia::render('Admin/Pendaftaran', [
            'pendaftarans' => $pendaftarans,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'Semua'),
                'program' => $request->input('program', 'Semua'),
                'gender' => $request->input('gender', 'Semua'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Store manual registration (offline / walk-in).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jenis_maktab' => 'required|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat_domisili' => 'nullable|string',
            'nama_ortu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:30',
            'pekerjaan_ortu' => 'nullable|string|max:150',
            'alamat_ortu' => 'nullable|string',
            'keterangan_tambahan' => 'nullable|string',
            'status' => 'nullable|string',
            'catatan_admin' => 'nullable|string',
            'foto_santri' => 'nullable',
            'kartu_keluarga' => 'nullable',
            'ktp_ortu' => 'nullable',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_santri')) {
            $path = $request->file('foto_santri')->store('santri', 'public');
            $fotoPath = '/storage/' . $path;
        }

        $kkPath = null;
        if ($request->hasFile('kartu_keluarga')) {
            $path = $request->file('kartu_keluarga')->store('berkas', 'public');
            $kkPath = '/storage/' . $path;
        }

        $ktpPath = null;
        if ($request->hasFile('ktp_ortu')) {
            $path = $request->file('ktp_ortu')->store('berkas', 'public');
            $ktpPath = '/storage/' . $path;
        }

        $pendaftaran = Pendaftaran::create([
            'no_pendaftaran' => Pendaftaran::generateNoPendaftaran(),
            'nama_lengkap' => $validated['nama_lengkap'],
            'jenis_maktab' => $validated['jenis_maktab'],
            'tempat_lahir' => $validated['tempat_lahir'] ?? null,
            'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'alamat_domisili' => $validated['alamat_domisili'] ?? null,
            'nama_ortu' => $validated['nama_ortu'],
            'no_hp_ortu' => $validated['no_hp_ortu'],
            'pekerjaan_ortu' => $validated['pekerjaan_ortu'] ?? null,
            'alamat_ortu' => $validated['alamat_ortu'] ?? null,
            'keterangan_tambahan' => $validated['keterangan_tambahan'] ?? null,
            'foto_santri' => $fotoPath,
            'kartu_keluarga' => $kkPath,
            'ktp_ortu' => $ktpPath,
            'status' => $validated['status'] ?? 'Menunggu Verifikasi',
            'catatan_admin' => $validated['catatan_admin'] ?? null,
        ]);

        return redirect()->back()->with('success', "Pendaftaran calon santri {$pendaftaran->nama_lengkap} berhasil ditambahkan!");
    }

    /**
     * Update pendaftaran data.
     */
    public function update(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jenis_maktab' => 'required|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat_domisili' => 'nullable|string',
            'nama_ortu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:30',
            'pekerjaan_ortu' => 'nullable|string|max:150',
            'alamat_ortu' => 'nullable|string',
            'keterangan_tambahan' => 'nullable|string',
            'status' => 'nullable|string',
            'catatan_admin' => 'nullable|string',
        ]);

        if ($request->hasFile('foto_santri')) {
            $path = $request->file('foto_santri')->store('santri', 'public');
            $validated['foto_santri'] = '/storage/' . $path;
        }

        if ($request->hasFile('kartu_keluarga')) {
            $path = $request->file('kartu_keluarga')->store('berkas', 'public');
            $validated['kartu_keluarga'] = '/storage/' . $path;
        }

        if ($request->hasFile('ktp_ortu')) {
            $path = $request->file('ktp_ortu')->store('berkas', 'public');
            $validated['ktp_ortu'] = '/storage/' . $path;
        }

        $pendaftaran->update($validated);

        return redirect()->back()->with('success', "Data pendaftaran {$pendaftaran->nama_lengkap} berhasil diperbarui!");
    }

    /**
     * Update status & admin notes.
     */
    public function updateStatus(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:Menunggu Verifikasi,Diproses,Lulus,Ditolak',
            'catatan_admin' => 'nullable|string',
        ]);

        if ($validated['status'] === 'Lulus') {
            return $this->luluskan($request, $id);
        }

        $pendaftaran->update([
            'status' => $validated['status'],
            'catatan_admin' => $validated['catatan_admin'] ?? $pendaftaran->catatan_admin,
            'tanggal_verifikasi' => now(),
        ]);

        return redirect()->back()->with('success', "Status pendaftaran {$pendaftaran->nama_lengkap} berhasil diubah menjadi {$validated['status']}!");
    }

    /**
     * Declare applicant as LULUS (admitted) and transfer to Santri Management.
     */
    public function luluskan(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        $inputNis = trim($request->input('nis', ''));
        // If empty or already exists, generate a guaranteed unique NIS
        if (empty($inputNis) || Santri::where('nis', $inputNis)->where('id', '!=', $pendaftaran->santri_id ?? 0)->exists()) {
            $nis = Santri::generateNis();
        } else {
            $nis = $inputNis;
        }

        $tanggalMasuk = $request->input('tanggal_masuk') ?: now()->toDateString();
        $namaPanggilan = $request->input('nama_panggilan') ?: (explode(' ', trim($pendaftaran->nama_lengkap))[0] ?? 'Santri');
        $program = $request->input('program') ?: $pendaftaran->jenis_maktab;

        // Check if santri already exists
        if ($pendaftaran->santri_id && $santri = Santri::find($pendaftaran->santri_id)) {
            $santri->update([
                'nis' => $nis,
                'status' => 'Aktif',
                'program' => $program,
                'tanggal_masuk' => $tanggalMasuk,
                'nama_lengkap' => $pendaftaran->nama_lengkap,
                'nama_panggilan' => $namaPanggilan,
                'jenis_kelamin' => $pendaftaran->jenis_kelamin,
                'tempat_lahir' => $pendaftaran->tempat_lahir,
                'tanggal_lahir' => $pendaftaran->tanggal_lahir,
                'nama_ortu' => $pendaftaran->nama_ortu,
                'no_hp_ortu' => $pendaftaran->no_hp_ortu,
                'pekerjaan_ortu' => $pendaftaran->pekerjaan_ortu,
                'alamat' => $pendaftaran->alamat_domisili ?: $pendaftaran->alamat_ortu,
                'keterangan' => $pendaftaran->keterangan_tambahan,
                'foto' => $pendaftaran->foto_santri,
                'kartu_keluarga' => $pendaftaran->kartu_keluarga,
                'ktp_ortu' => $pendaftaran->ktp_ortu,
            ]);
        } else {
            $santri = Santri::create([
                'nis' => $nis,
                'nama_lengkap' => $pendaftaran->nama_lengkap,
                'nama_panggilan' => $namaPanggilan,
                'program' => $program,
                'jenis_kelamin' => $pendaftaran->jenis_kelamin,
                'tempat_lahir' => $pendaftaran->tempat_lahir,
                'tanggal_lahir' => $pendaftaran->tanggal_lahir,
                'tanggal_masuk' => $tanggalMasuk,
                'status' => 'Aktif',
                'nama_ortu' => $pendaftaran->nama_ortu,
                'no_hp_ortu' => $pendaftaran->no_hp_ortu,
                'pekerjaan_ortu' => $pendaftaran->pekerjaan_ortu,
                'alamat' => $pendaftaran->alamat_domisili ?: $pendaftaran->alamat_ortu,
                'keterangan' => $pendaftaran->keterangan_tambahan,
                'foto' => $pendaftaran->foto_santri,
                'kartu_keluarga' => $pendaftaran->kartu_keluarga,
                'ktp_ortu' => $pendaftaran->ktp_ortu,
            ]);
        }

        $pendaftaran->update([
            'status' => 'Lulus',
            'santri_id' => $santri->id,
            'tanggal_verifikasi' => now(),
            'catatan_admin' => $request->input('catatan_admin') ?: 'Dinyatakan LULUS dan dipindahkan ke Santri Management.',
        ]);

        return redirect()->back()->with('success', "Alhamdulillah! Calon santri {$pendaftaran->nama_lengkap} telah dinyatakan LULUS dan resmi dipindahkan ke Santri Management dengan NIS: {$santri->nis}.");
    }

    /**
     * Delete pendaftaran record.
     */
    public function destroy($id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $nama = $pendaftaran->nama_lengkap;
        $pendaftaran->delete();

        return redirect()->back()->with('success', "Data pendaftaran {$nama} berhasil dihapus.");
    }

    /**
     * Bulk actions (delete, luluskan, status update).
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:delete,lulus,diproses,tolak',
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:pendaftarans,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        if ($action === 'delete') {
            Pendaftaran::whereIn('id', $ids)->delete();
            return redirect()->back()->with('success', "Berhasil menghapus {$count} data pendaftaran terpilih.");
        }

        if ($action === 'lulus') {
            $pendaftarans = Pendaftaran::whereIn('id', $ids)->get();
            $lulusCount = 0;
            foreach ($pendaftarans as $p) {
                if ($p->status !== 'Lulus') {
                    $nis = Santri::generateNis();
                    $namaPanggilan = explode(' ', trim($p->nama_lengkap))[0];
                    $santri = Santri::create([
                        'nis' => $nis,
                        'nama_lengkap' => $p->nama_lengkap,
                        'nama_panggilan' => $namaPanggilan,
                        'program' => $p->jenis_maktab,
                        'jenis_kelamin' => $p->jenis_kelamin,
                        'tempat_lahir' => $p->tempat_lahir,
                        'tanggal_lahir' => $p->tanggal_lahir,
                        'tanggal_masuk' => now()->toDateString(),
                        'status' => 'Aktif',
                        'nama_ortu' => $p->nama_ortu,
                        'no_hp_ortu' => $p->no_hp_ortu,
                        'pekerjaan_ortu' => $p->pekerjaan_ortu,
                        'alamat' => $p->alamat_domisili ?: $p->alamat_ortu,
                        'keterangan' => $p->keterangan_tambahan,
                        'foto' => $p->foto_santri,
                        'kartu_keluarga' => $p->kartu_keluarga,
                        'ktp_ortu' => $p->ktp_ortu,
                    ]);

                    $p->update([
                        'status' => 'Lulus',
                        'santri_id' => $santri->id,
                        'tanggal_verifikasi' => now(),
                    ]);
                    $lulusCount++;
                }
            }
            return redirect()->back()->with('success', "Berhasil meluluskan dan memindahkan {$lulusCount} santri ke Santri Management.");
        }

        if ($action === 'diproses') {
            Pendaftaran::whereIn('id', $ids)->update([
                'status' => 'Diproses',
                'tanggal_verifikasi' => now(),
            ]);
            return redirect()->back()->with('success', "Status {$count} pendaftaran diubah menjadi Sedang Diproses.");
        }

        if ($action === 'tolak') {
            Pendaftaran::whereIn('id', $ids)->update([
                'status' => 'Ditolak',
                'tanggal_verifikasi' => now(),
            ]);
            return redirect()->back()->with('success', "Status {$count} pendaftaran diubah menjadi Ditolak.");
        }

        return redirect()->back();
    }

    /**
     * Export pendaftaran dataset to CSV.
     */
    public function export(Request $request)
    {
        $pendaftarans = Pendaftaran::orderBy('id', 'desc')->get();

        $filename = 'data_pendaftaran_santri_mtas_' . date('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($pendaftarans) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel
            fputs($file, "\xEF\xBB\xBF");

            // CSV Header with all registration inputs
            fputcsv($file, [
                'No',
                'No. Registrasi',
                'Nama Lengkap Santri',
                'Program / Maktab',
                'Jenis Kelamin',
                'Tempat Lahir',
                'Tanggal Lahir',
                'Usia',
                'Alamat Domisili',
                'Nama Orang Tua / Wali',
                'No. HP / WhatsApp Wali',
                'Pekerjaan Orang Tua',
                'Alamat Orang Tua',
                'Keterangan Tambahan / Riwayat Medis',
                'Status Pendaftaran',
                'Foto Terunggah',
                'KK Terunggah',
                'KTP Terunggah',
                'Catatan Admin',
                'Tanggal Mendaftar',
                'Tanggal Diverifikasi',
            ]);

            $no = 1;
            foreach ($pendaftarans as $p) {
                fputcsv($file, [
                    $no++,
                    $p->no_pendaftaran,
                    $p->nama_lengkap,
                    $p->jenis_maktab,
                    $p->jenis_kelamin,
                    $p->tempat_lahir ?? '-',
                    $p->tanggal_lahir ? $p->tanggal_lahir->format('Y-m-d') : '-',
                    $p->tanggal_lahir ? $p->tanggal_lahir->age . ' thn' : '-',
                    $p->alamat_domisili ?? '-',
                    $p->nama_ortu,
                    $p->no_hp_ortu,
                    $p->pekerjaan_ortu ?? '-',
                    $p->alamat_ortu ?? '-',
                    $p->keterangan_tambahan ?? '-',
                    $p->status,
                    $p->foto_santri ? 'Ada' : 'Belum Ada',
                    $p->kartu_keluarga ? 'Ada' : 'Belum Ada',
                    $p->ktp_ortu ? 'Ada' : 'Belum Ada',
                    $p->catatan_admin ?? '-',
                    $p->created_at ? $p->created_at->format('Y-m-d H:i:s') : '-',
                    $p->tanggal_verifikasi ? $p->tanggal_verifikasi->format('Y-m-d H:i:s') : '-',
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
