<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Services\SecurityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Tampilkan halaman formulir pendaftaran santri dengan tantangan keamanan captcha.
     */
    public function create(SecurityService $security)
    {
        $captcha = $security->generateCaptcha();

        return Inertia::render('Daftar', [
            'captcha' => $captcha,
        ]);
    }

    /**
     * Simpan pendaftaran santri baru dengan proteksi anti-spam, upload aman, & sanitasi input.
     */
    public function store(Request $request, SecurityService $security)
    {
        // 1. Validasi Honeypot (bot trap)
        if ($security->isHoneypotTriggered($request)) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Pendaftaran ditolak karena aktivitas bot spam terdeteksi.'
            ])->withInput();
        }

        // 2. Validasi Kecepatan Pengisian (time trap)
        if ($security->isTooFast($request)) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Pengisian formulir terlalu cepat. Mohon luangkan waktu beberapa detik sebelum mengirim.'
            ])->withInput();
        }

        // 3. Validasi Captcha Keamanan
        if (!$security->verifyCaptcha($request->input('captcha_answer'))) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Jawaban verifikasi keamanan (anti-bot) salah atau sudah kadaluarsa. Silakan hitung kembali.'
            ])->withInput();
        }

        // 4. Validasi Format & Integritas Input (Strict Rules)
        $validated = $request->validate([
            'nama_lengkap'        => ['required', 'string', 'min:2', 'max:150', 'regex:/^[\pL\s\.\',\-]+$/u'],
            'jenis_maktab'        => ['required', 'string', 'in:Maktab Tuli As-Sami,Maktab Autis'],
            'tempat_lahir'        => ['nullable', 'string', 'max:100', 'regex:/^[\pL\s\.\',\-]+$/u'],
            'tanggal_lahir'       => ['nullable', 'date', 'before:today'],
            'jenis_kelamin'       => ['required', 'string', 'in:Laki-laki,Perempuan,L,P'],
            'alamat_domisili'     => ['nullable', 'string', 'max:500'],
            'nama_ortu'           => ['required', 'string', 'min:2', 'max:150', 'regex:/^[\pL\s\.\',\-]+$/u'],
            'no_hp_ortu'          => ['required', 'string', 'max:25', 'regex:/^[0-9+\s\-()]{8,25}$/'],
            'pekerjaan_ortu'      => ['nullable', 'string', 'max:150'],
            'alamat_ortu'         => ['nullable', 'string', 'max:500'],
            'keterangan_tambahan' => ['nullable', 'string', 'max:2000'],
            'foto_santri'         => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'kartu_keluarga'      => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
            'ktp_ortu'            => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
            'captcha_answer'      => ['required', 'string', 'max:10'],
            'form_hp_website'     => ['nullable', 'max:0'],
        ], [
            'nama_lengkap.required'    => 'Nama lengkap santri wajib diisi.',
            'nama_lengkap.regex'       => 'Nama lengkap hanya boleh berisi huruf, spasi, dan tanda baca umum.',
            'jenis_maktab.required'    => 'Pilihan program maktab wajib dipilih.',
            'jenis_maktab.in'          => 'Pilihan program maktab tidak valid.',
            'nama_ortu.required'       => 'Nama orang tua/wali wajib diisi.',
            'nama_ortu.regex'          => 'Nama orang tua hanya boleh berisi huruf, spasi, dan tanda baca umum.',
            'no_hp_ortu.required'      => 'Nomor telepon/WhatsApp orang tua wajib diisi.',
            'no_hp_ortu.regex'         => 'Nomor kontak tidak valid. Gunakan format nomor telepon yang benar (8-25 digit).',
            'foto_santri.mimes'        => 'Format foto santri harus berupa JPG, JPEG, PNG, atau WEBP.',
            'foto_santri.max'          => 'Ukuran file foto santri maksimal 5MB.',
            'kartu_keluarga.mimes'     => 'Format berkas Kartu Keluarga harus berupa PDF, JPG, JPEG, atau PNG.',
            'kartu_keluarga.max'       => 'Ukuran file Kartu Keluarga maksimal 5MB.',
            'ktp_ortu.mimes'           => 'Format berkas KTP harus berupa PDF, JPG, JPEG, atau PNG.',
            'ktp_ortu.max'             => 'Ukuran file KTP maksimal 5MB.',
            'captcha_answer.required'  => 'Jawaban verifikasi anti-bot wajib diisi.',
        ]);

        // 5. Upload File Secara Aman dengan Hashing Random Otomatis
        $fotoPath = null;
        if ($request->hasFile('foto_santri') && $request->file('foto_santri')->isValid()) {
            $path = $request->file('foto_santri')->store('santri', 'public');
            $fotoPath = '/storage/' . $path;
        }

        $kkPath = null;
        if ($request->hasFile('kartu_keluarga') && $request->file('kartu_keluarga')->isValid()) {
            $path = $request->file('kartu_keluarga')->store('berkas', 'public');
            $kkPath = '/storage/' . $path;
        }

        $ktpPath = null;
        if ($request->hasFile('ktp_ortu') && $request->file('ktp_ortu')->isValid()) {
            $path = $request->file('ktp_ortu')->store('berkas', 'public');
            $ktpPath = '/storage/' . $path;
        }

        // 6. Normalisasi Jenis Kelamin
        $jk = in_array($validated['jenis_kelamin'], ['L', 'Laki-laki']) ? 'Laki-laki' : 'Perempuan';

        // 7. Sanitasi Input Teks (Proteksi XSS, null-bytes, & HTML injection)
        $namaLengkapClean   = $security->sanitizeText($validated['nama_lengkap']);
        $tempatLahirClean   = !empty($validated['tempat_lahir']) ? $security->sanitizeText($validated['tempat_lahir']) : null;
        $alamatDomisiliClean= !empty($validated['alamat_domisili']) ? $security->sanitizeText($validated['alamat_domisili']) : null;
        $namaOrtuClean      = $security->sanitizeText($validated['nama_ortu']);
        $noHpOrtuClean      = $security->sanitizeText($validated['no_hp_ortu']);
        $pekerjaanOrtuClean = !empty($validated['pekerjaan_ortu']) ? $security->sanitizeText($validated['pekerjaan_ortu']) : null;
        $alamatOrtuClean    = !empty($validated['alamat_ortu']) ? $security->sanitizeText($validated['alamat_ortu']) : null;
        $keteranganClean    = !empty($validated['keterangan_tambahan']) ? $security->sanitizeText($validated['keterangan_tambahan']) : null;

        // 8. Simpan ke Database via Eloquent ORM (Parameterized Binding)
        Pendaftaran::create([
            'no_pendaftaran'      => Pendaftaran::generateNoPendaftaran(),
            'nama_lengkap'        => $namaLengkapClean,
            'jenis_maktab'        => $validated['jenis_maktab'],
            'jenis_kelamin'       => $jk,
            'tempat_lahir'        => $tempatLahirClean,
            'tanggal_lahir'       => $validated['tanggal_lahir'] ?? null,
            'alamat_domisili'     => $alamatDomisiliClean,
            'nama_ortu'           => $namaOrtuClean,
            'no_hp_ortu'          => $noHpOrtuClean,
            'pekerjaan_ortu'      => $pekerjaanOrtuClean,
            'alamat_ortu'         => $alamatOrtuClean,
            'keterangan_tambahan' => $keteranganClean,
            'foto_santri'         => $fotoPath,
            'kartu_keluarga'      => $kkPath,
            'ktp_ortu'            => $ktpPath,
            'status'              => 'Menunggu Verifikasi',
        ]);

        return redirect()->back()->with('success', 'Pendaftaran santri berhasil dikirim! Tim kami akan menghubungi kontak Anda untuk proses verifikasi.');
    }
}
