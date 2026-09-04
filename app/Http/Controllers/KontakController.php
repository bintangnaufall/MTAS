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
            'subjek'  => 'required|string|max:200',
            'pesan'   => 'required|string|max:3000',
        ], [
            'nama.required'    => 'Nama lengkap wajib diisi.',
            'email.required'   => 'Alamat email wajib diisi.',
            'email.email'      => 'Format alamat email tidak valid.',
            'subjek.required'  => 'Subjek pesan wajib diisi.',
            'pesan.required'   => 'Isi pesan wajib diisi.',
        ]);

        Pesan::create([
            'nama'          => trim($validated['nama']),
            'email'         => trim($validated['email']),
            'telepon'       => !empty($validated['telepon']) ? trim($validated['telepon']) : null,
            'subjek'        => trim($validated['subjek']),
            'pesan'         => trim($validated['pesan']),
            'status'        => 'unread',
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Pesan Anda telah berhasil dikirim! Tim Yayasan Bhakti Arumi Delangga akan segera merespons.');
    }
}
