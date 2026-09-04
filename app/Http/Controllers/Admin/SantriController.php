<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Santri;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Display a listing of santris with search, filter, and statistics.
     */
    public function index(Request $request)
    {
        $query = Santri::query()->where(function ($q) {
            $q->where('status', 'Aktif')
              ->orWhere('status', 'Lulus')
              ->orWhereNull('status');
        });

        // Search filter (name, nickname, NIS, parent name, parent phone, address)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nama_panggilan', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nama_ortu', 'like', "%{$search}%")
                  ->orWhere('no_hp_ortu', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Gender filter
        if ($request->filled('gender') && $request->input('gender') !== 'Semua') {
            $query->where('jenis_kelamin', $request->input('gender'));
        }

        // Sort order
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $santris = $query->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'nis' => $s->nis,
                'nama_lengkap' => $s->nama_lengkap,
                'nama_panggilan' => $s->nama_panggilan,
                'program' => $s->program,
                'jenis_kelamin' => $s->jenis_kelamin,
                'tempat_lahir' => $s->tempat_lahir,
                'tanggal_lahir' => $s->tanggal_lahir ? $s->tanggal_lahir->format('Y-m-d') : null,
                'tanggal_lahir_formatted' => $s->tanggal_lahir ? $s->tanggal_lahir->translatedFormat('d M Y') : null,
                'umur' => $s->tanggal_lahir ? $s->tanggal_lahir->age : null,
                'tanggal_masuk' => $s->tanggal_masuk ? $s->tanggal_masuk->format('Y-m-d') : null,
                'tanggal_masuk_formatted' => $s->tanggal_masuk ? $s->tanggal_masuk->translatedFormat('d M Y') : null,
                'status' => 'Aktif',
                'nama_ortu' => $s->nama_ortu,
                'no_hp_ortu' => $s->no_hp_ortu,
                'pekerjaan_ortu' => $s->pekerjaan_ortu,
                'alamat' => $s->alamat,
                'keterangan' => $s->keterangan,
                'foto' => $s->foto,
                'created_at' => $s->created_at ? $s->created_at->translatedFormat('d M Y, H:i') : null,
            ];
        });

        // Compute statistics for header cards
        $stats = [
            'total' => Santri::where(function($q) { $q->where('status', 'Aktif')->orWhereNull('status'); })->count(),
            'laki_laki' => Santri::where('jenis_kelamin', 'Laki-laki')->where(function($q) { $q->where('status', 'Aktif')->orWhereNull('status'); })->count(),
            'perempuan' => Santri::where('jenis_kelamin', 'Perempuan')->where(function($q) { $q->where('status', 'Aktif')->orWhereNull('status'); })->count(),
            'tahun_ini' => Santri::whereYear('tanggal_masuk', date('Y'))->count(),
            'total_wali' => Santri::whereNotNull('nama_ortu')->where('nama_ortu', '!=', '')->count(),
            'pending_pendaftaran' => Pendaftaran::where('status', 'Menunggu Verifikasi')->count(),
        ];

        return Inertia::render('Admin/Santri', [
            'santris' => $santris,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search', ''),
                'gender' => $request->input('gender', 'Semua'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Store a newly created santri in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'nullable|string|max:100',
            'nis' => 'nullable|string|max:50|unique:santris,nis',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'tanggal_masuk' => 'nullable|date',
            'nama_ortu' => 'nullable|string|max:255',
            'no_hp_ortu' => 'nullable|string|max:30',
            'pekerjaan_ortu' => 'nullable|string|max:150',
            'alamat' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        // Auto-generate NIS if empty
        if (empty($validated['nis'])) {
            $validated['nis'] = Santri::generateNis();
        }

        // Set default values
        $validated['status'] = 'Aktif';
        $validated['program'] = 'Maktab Tuli As-Sami & Inklusi';
        if (empty($validated['nama_ortu'])) {
            $validated['nama_ortu'] = '-';
        }
        if (empty($validated['no_hp_ortu'])) {
            $validated['no_hp_ortu'] = '-';
        }

        if (empty($validated['tanggal_masuk'])) {
            $validated['tanggal_masuk'] = now()->toDateString();
        }

        // Handle foto upload if uploaded file
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('santri', 'public');
            $validated['foto'] = '/storage/' . $path;
        }

        Santri::create($validated);

        return redirect()->back()->with('success', 'Data santri ' . $validated['nama_lengkap'] . ' berhasil ditambahkan!');
    }

    /**
     * Update the specified santri in storage.
     */
    public function update(Request $request, $id)
    {
        $santri = Santri::findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'nullable|string|max:100',
            'nis' => 'nullable|string|max:50|unique:santris,nis,' . $santri->id,
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'tanggal_masuk' => 'nullable|date',
            'nama_ortu' => 'nullable|string|max:255',
            'no_hp_ortu' => 'nullable|string|max:30',
            'pekerjaan_ortu' => 'nullable|string|max:150',
            'alamat' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'foto' => 'nullable',
        ]);

        $validated['status'] = 'Aktif';
        if (empty($validated['nama_ortu'])) {
            $validated['nama_ortu'] = '-';
        }
        if (empty($validated['no_hp_ortu'])) {
            $validated['no_hp_ortu'] = '-';
        }

        // Handle photo upload
        if ($request->hasFile('foto')) {
            // Delete old photo if stored in storage
            if ($santri->foto && str_starts_with($santri->foto, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $santri->foto);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto')->store('santri', 'public');
            $validated['foto'] = '/storage/' . $path;
        } elseif ($request->input('remove_foto') === 'true' || $request->input('remove_foto') === true || $request->input('remove_foto') === '1' || $request->input('foto') === '') {
            if ($santri->foto && str_starts_with($santri->foto, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $santri->foto);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['foto'] = null;
        } elseif ($request->input('foto') === null && $santri->foto) {
            // Keep existing photo if not changed
            unset($validated['foto']);
        }

        $santri->update($validated);

        return redirect()->back()->with('success', 'Data santri ' . $santri->nama_lengkap . ' berhasil diperbarui!');
    }

    /**
     * Remove the specified santri from storage.
     */
    public function destroy($id)
    {
        $santri = Santri::findOrFail($id);
        $name = $santri->nama_lengkap;

        if ($santri->foto && str_starts_with($santri->foto, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $santri->foto);
            Storage::disk('public')->delete($oldPath);
        }

        $santri->delete();

        return redirect()->back()->with('success', 'Data santri ' . $name . ' berhasil dihapus dari sistem.');
    }

    /**
     * Bulk actions for multiple santri records.
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:santris,id',
            'action' => 'required|string|in:delete',
        ]);

        $ids = $request->input('ids');
        $count = count($ids);

        Santri::whereIn('id', $ids)->delete();
        $msg = "{$count} data santri berhasil dihapus.";

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Export all santri data to CSV / Excel compatible format.
     */
    public function export(Request $request)
    {
        $santris = Santri::orderBy('id', 'asc')->get();
        $filename = 'data_santri_bhakti_arumi_' . date('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($santris) {
            $file = fopen('php://output', 'w');
            // Write UTF-8 BOM so Excel opens indonesian characters and accents properly
            fputs($file, "\xEF\xBB\xBF");

            // CSV Header
            fputcsv($file, [
                'ID',
                'NIS',
                'Nama Lengkap',
                'Nama Panggilan',
                'Jenis Kelamin',
                'Tempat Lahir',
                'Tanggal Lahir',
                'Usia',
                'Tanggal Daftar',
                'Status',
                'Nama Orang Tua / Wali',
                'No. HP / WhatsApp Wali',
                'Pekerjaan Wali',
                'Alamat Domisili',
                'Catatan Khusus'
            ], ';');

            foreach ($santris as $s) {
                fputcsv($file, [
                    $s->id,
                    $s->nis ?: '-',
                    $s->nama_lengkap,
                    $s->nama_panggilan ?: '-',
                    $s->jenis_kelamin,
                    $s->tempat_lahir ?: '-',
                    $s->tanggal_lahir ? $s->tanggal_lahir->format('d/m/Y') : '-',
                    $s->tanggal_lahir ? $s->tanggal_lahir->age . ' Tahun' : '-',
                    $s->tanggal_masuk ? $s->tanggal_masuk->format('d/m/Y') : '-',
                    'Aktif',
                    $s->nama_ortu ?: '-',
                    $s->no_hp_ortu ?: '-',
                    $s->pekerjaan_ortu ?: '-',
                    $s->alamat ?: '-',
                    $s->keterangan ?: '-'
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
