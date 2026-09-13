<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KontakController extends Controller
{
    /**
     * Tampilkan halaman kontak publik.
     */
    public function index()
    {
        return Inertia::render('Kontak');
    }

    /**
     * Simpan pesan baru dari formulir kontak publik.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'telepon' => 'nullable|string|max:25',
            'subjek'  => 'nullable|string|max:200',
            'pesan'   => 'required|string|max:3000',
        ], [
            'nama.required'    => 'Nama lengkap wajib diisi.',
            'email.required'   => 'Alamat email wajib diisi.',
            'email.email'      => 'Format alamat email tidak valid.',
            'pesan.required'   => 'Isi pesan wajib diisi.',
        ]);

        $subjek = !empty($validated['subjek'])
            ? trim($validated['subjek'])
            : (str_contains($validated['pesan'], 'Juru Bahasa Isyarat') || str_contains($validated['pesan'], 'JBI')
                ? 'Permohonan Jasa JBI'
                : 'Pesan Umum');

        Pesan::create([
            'nama'          => trim($validated['nama']),
            'email'         => trim($validated['email']),
            'telepon'       => !empty($validated['telepon']) ? trim($validated['telepon']) : null,
            'subjek'        => $subjek,
            'pesan'         => trim($validated['pesan']),
            'status'        => 'unread',
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Pesan Anda telah berhasil dikirim! Tim Yayasan Bhakti Arumi Delangga akan segera merespons.');
    }
}
