<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriController extends Controller
{
    /**
     * Tampilkan halaman Galeri untuk pengunjung website.
     */
    public function index()
    {
        $allGalleries = Galeri::where('status', 'Published')
            ->orderBy('is_featured', 'desc')
            ->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($g) {
                return [
                    'id'          => $g->id,
                    'judul'       => $g->judul,
                    'title'       => $g->judul,
                    'kategori'    => $g->kategori,
                    'category'    => $g->kategori,
                    'tipe'        => $g->tipe ?: 'foto',
                    'type'        => $g->tipe ?: 'foto',
                    'image'       => $g->image ?: '/images/image6.png',
                    'video_url'   => $g->video_url,
                    'embed_url'   => $g->embed_url,
                    'duration'    => $g->duration,
                    'tanggal'     => $g->tanggal ? date('d M Y', strtotime($g->tanggal)) : ($g->created_at ? $g->created_at->translatedFormat('d M Y') : date('d M Y')),
                    'raw_date'    => $g->tanggal ?: ($g->created_at ? $g->created_at->format('Y-m-d') : date('Y-m-d')),
                    'deskripsi'   => $g->deskripsi,
                    'is_featured' => (bool) $g->is_featured,
                    'tagBg'       => $g->tag_bg,
                ];
            });

        // Filter Photos
        $photos = $allGalleries->filter(fn($item) => $item['tipe'] === 'foto')->values();

        // Filter Videos
        $videos = $allGalleries->filter(fn($item) => $item['tipe'] === 'video')->values();

        // Featured Event Item (Kegiatan Utama)
        $featuredItem = $allGalleries->firstWhere('is_featured', true) ?: $photos->first() ?: $allGalleries->first();

        // Categories list
        $categories = [
            'Semua',
            'Maktab Tuli',
            'Maktab Autis',
            'Kegiatan Yayasan',
            'Pembelajaran',
            'Acara Sosial',
        ];

        return Inertia::render('Galeri', [
            'galleries'    => $allGalleries,
            'photos'       => $photos,
            'videos'       => $videos,
            'featuredItem' => $featuredItem,
            'categories'   => $categories,
        ]);
    }
}
