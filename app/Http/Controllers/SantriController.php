<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Show the public santri registration page.
     */
    public function create()
    {
        return Inertia::render('Daftar');
    }

    /**
     * Store a new santri registration submitted from the public form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jenis_maktab' => 'required|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|string',
            'alamat_domisili' => 'nullable|string',
            'nama_ortu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:30',
            'pekerjaan_ortu' => 'nullable|string|max:150',
            'alamat_ortu' => 'nullable|string',
            'keterangan_tambahan' => 'nullable|string',
            'foto_santri' => 'nullable|file|max:10240',
            'kartu_keluarga' => 'nullable|file|max:10240',
            'ktp_ortu' => 'nullable|file|max:10240',
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

        // Map jenis kelamin if L/P or Laki-laki/Perempuan
        $jk = $validated['jenis_kelamin'];
        if ($jk === 'L' || $jk === 'Laki-laki') {
            $jk = 'Laki-laki';
        } else {
            $jk = 'Perempuan';
        }

        $pendaftaran = Pendaftaran::create([
            'no_pendaftaran' => Pendaftaran::generateNoPendaftaran(),
            'nama_lengkap' => $validated['nama_lengkap'],
            'jenis_maktab' => $validated['jenis_maktab'],
            'jenis_kelamin' => $jk,
            'tempat_lahir' => $validated['tempat_lahir'] ?? null,
            'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
            'alamat_domisili' => $validated['alamat_domisili'] ?? null,
            'nama_ortu' => $validated['nama_ortu'],
            'no_hp_ortu' => $validated['no_hp_ortu'],
            'pekerjaan_ortu' => $validated['pekerjaan_ortu'] ?? null,
            'alamat_ortu' => $validated['alamat_ortu'] ?? null,
            'keterangan_tambahan' => $validated['keterangan_tambahan'] ?? null,
            'foto_santri' => $fotoPath,
            'kartu_keluarga' => $kkPath,
            'ktp_ortu' => $ktpPath,
            'status' => 'Menunggu Verifikasi',
        ]);

        return redirect()->back()->with('success', 'Pendaftaran santri berhasil dikirim! Tim kami akan menghubungi kontak Anda untuk proses verifikasi.');
    }
}
