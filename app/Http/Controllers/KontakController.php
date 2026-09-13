<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Services\SecurityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KontakController extends Controller
{
    /**
     * Tampilkan halaman kontak publik dengan tantangan keamanan captcha.
     */
    public function index(SecurityService $security)
    {
        $captcha = $security->generateCaptcha();

        return Inertia::render('Kontak', [
            'captcha' => $captcha,
        ]);
    }

    /**
     * Simpan pesan baru dari formulir kontak publik dengan proteksi anti-spam & anti-injection.
     */
    public function store(Request $request, SecurityService $security)
    {
        // 1. Validasi Honeypot (bot trap)
        if ($security->isHoneypotTriggered($request)) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Pengiriman ditolak karena aktivitas otomatis (bot spam) terdeteksi.'
            ])->withInput();
        }

        // 2. Validasi Kecepatan Pengisian (time trap)
        if ($security->isTooFast($request)) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Pengiriman terlalu cepat. Mohon luangkan waktu beberapa detik sebelum mengirim.'
            ])->withInput();
        }

        // 3. Validasi Captcha Keamanan
        if (!$security->verifyCaptcha($request->input('captcha_answer'))) {
            return redirect()->back()->withErrors([
                'captcha_answer' => 'Jawaban verifikasi keamanan (anti-bot) salah atau sudah kadaluarsa. Silakan coba kembali.'
            ])->withInput();
        }

        // 4. Validasi Format & Integritas Input (Strict Rules)
        $validated = $request->validate([
            'nama'            => ['required', 'string', 'min:2', 'max:100', 'regex:/^[\pL\s\.\',\-]+$/u'],
            'email'           => ['required', 'string', 'email:rfc,filter', 'max:150'],
            'telepon'         => ['nullable', 'string', 'max:25', 'regex:/^[0-9+\s\-()]{8,25}$/'],
            'subjek'          => ['nullable', 'string', 'max:200'],
            'pesan'           => ['required', 'string', 'min:5', 'max:3000'],
            'captcha_answer'  => ['required', 'string', 'max:10'],
            'form_hp_website' => ['nullable', 'max:0'],
        ], [
            'nama.required'    => 'Nama lengkap wajib diisi.',
            'nama.regex'       => 'Nama hanya boleh berisi huruf, spasi, dan tanda baca standar.',
            'email.required'   => 'Alamat email wajib diisi.',
            'email.email'      => 'Format alamat email tidak valid.',
            'telepon.regex'    => 'Nomor telepon hanya boleh memuat angka, tanda tambah (+), spasi, tanda kurung, atau tanda hubung.',
            'pesan.required'   => 'Isi pesan wajib diisi.',
            'pesan.min'        => 'Isi pesan minimal 5 karakter.',
            'pesan.max'        => 'Isi pesan maksimal 3000 karakter.',
            'captcha_answer.required' => 'Jawaban verifikasi anti-bot wajib diisi.',
        ]);

        // 5. Sanitasi Input (Proteksi XSS, null-bytes, & HTML injection)
        $namaClean    = $security->sanitizeText($validated['nama']);
        $emailClean   = $security->sanitizeText($validated['email']);
        $teleponClean = !empty($validated['telepon']) ? $security->sanitizeText($validated['telepon']) : null;
        $pesanClean   = $security->sanitizeText($validated['pesan']);

        $rawSubjek    = !empty($validated['subjek']) ? $security->sanitizeText($validated['subjek']) : '';
        $subjek = !empty($rawSubjek)
            ? $rawSubjek
            : (str_contains($pesanClean, 'Juru Bahasa Isyarat') || str_contains($pesanClean, 'JBI')
                ? 'Permohonan Jasa JBI'
                : 'Pesan Umum');

        // 6. Simpan secara aman menggunakan Eloquent ORM (Prepared Parameter Binding)
        Pesan::create([
            'nama'          => $namaClean,
            'email'         => $emailClean,
            'telepon'       => $teleponClean,
            'subjek'        => $subjek,
            'pesan'         => $pesanClean,
            'status'        => 'unread',
            'ip_address'    => $request->ip(),
            'user_agent'    => $security->sanitizeText($request->userAgent()),
        ]);

        return redirect()->back()->with('success', 'Pesan Anda telah berhasil dikirim! Tim Yayasan Bhakti Arumi Delangga akan segera merespons.');
    }
}
