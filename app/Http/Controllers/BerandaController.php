<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BerandaController extends Controller
{
    /**
     * Tampilkan halaman Beranda (Homepage).
     */
    public function index()
    {
        $beritas = Berita::where('status', 'Published')
            ->orderBy('is_featured', 'desc')
            ->orderBy('id', 'desc')
            ->take(3)
            ->get()
            ->map(function ($b) {
                return [
                    'id'          => $b->id,
                    'slug'        => $b->slug,
                    'kategori'    => $b->kategori,
                    'tagBg'       => $b->tag_bg,
                    'judul'       => $b->judul,
                    'deskripsi'   => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 120),
                    'tanggal'     => $b->tanggal ?: ($b->created_at ? $b->created_at->translatedFormat('d M Y') : date('d M Y')),
                    'image'       => $b->image ?: '/images/berita_utama.png',
                    'is_featured' => (bool) $b->is_featured,
                ];
            });

        return Inertia::render('Beranda', [
            'beritaList' => $beritas,
        ]);
    }
}
