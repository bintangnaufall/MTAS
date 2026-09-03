<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    use HasFactory;

    protected $table = 'galeris';

    protected $fillable = [
        'judul',
        'kategori',
        'tipe',
        'image',
        'video_url',
        'duration',
        'tanggal',
        'deskripsi',
        'is_featured',
        'status',
        'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Tag styling helper for frontend and admin.
     */
    public function getTagBgAttribute(): string
    {
        return match (strtoupper($this->kategori ?? '')) {
            'MAKTAB TULI' => 'bg-[#E6EFFB] text-[#025EDB]',
            'MAKTAB AUTIS' => 'bg-[#FDF2F8] text-[#BE185D]',
            'ACARA SOSIAL' => 'bg-[#FFF3E3] text-[#D38B1D]',
            'PEMBELAJARAN' => 'bg-[#E0F2FE] text-[#0369A1]',
            'KEGIATAN YAYASAN' => 'bg-[#F3F4F6] text-[#4B5563]',
            'KAJIAN' => 'bg-purple-100 text-purple-700',
            default => 'bg-[#E6EFFB] text-[#025EDB]',
        };
    }

    /**
     * Format embed URL for YouTube and other video links.
     */
    public function getEmbedUrlAttribute(): ?string
    {
        if (empty($this->video_url)) {
            return null;
        }

        $url = trim($this->video_url);

        // Already an embed URL
        if (str_contains($url, 'youtube.com/embed/')) {
            return $url;
        }

        // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        // Standard YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
        if (preg_match('/youtube\.com\/shorts\/([^"&?\/\s]+)/i', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        // Vimeo: https://vimeo.com/VIDEO_ID
        if (preg_match('/vimeo\.com\/(\d+)/i', $url, $matches)) {
            return 'https://player.vimeo.com/video/' . $matches[1];
        }

        return $url;
    }
}
