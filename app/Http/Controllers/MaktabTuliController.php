<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaktabTuliController extends Controller
{
    /**
     * Tampilkan halaman profil Maktab Tuli As-Sami.
     */
    public function index()
    {
        $galeris = Galeri::where('status', 'Published')
            ->orderBy('is_featured', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->take(6)
            ->get()
            ->map(function ($g) {
                return [
                    'id'        => $g->id,
                    'judul'     => $g->judul,
                    'kategori'  => $g->kategori,
                    'tipe'      => $g->tipe ?: 'foto',
                    'image'     => $g->image ?: '/images/image6.png',
                    'video_url' => $g->video_url,
                    'embed_url' => $g->embed_url,
                    'deskripsi' => $g->deskripsi,
                    'tagBg'     => $g->tag_bg,
                ];
            });

        return Inertia::render('MaktabTuli', [
            'galeris' => $galeris,
        ]);
    }
}
