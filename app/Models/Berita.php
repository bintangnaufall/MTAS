<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Berita extends Model
{
    use HasFactory;

    protected $table = 'beritas';

    protected $fillable = [
        'judul',
        'slug',
        'kategori',
        'image',
        'penulis',
        'tanggal',
        'status',
        'ringkasan',
        'blockquote',
        'paragraf1',
        'subheading',
        'paragraf2',
        'blue_quote',
        'blue_quote_author',
        'paragraf3',
        'is_featured',
        'dokumentasi',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'dokumentasi' => 'array',
    ];

    /**
     * Auto generate slug on create/update if not provided
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug = Str::slug($berita->judul) . '-' . Str::random(5);
            }
            if (empty($berita->tanggal)) {
                $berita->tanggal = now()->translatedFormat('d M Y');
            }
        });
    }

    /**
     * Accessor for Category Tag Styling
     */
    public function getTagBgAttribute(): string
    {
        return match (strtoupper($this->kategori ?? '')) {
            'PENDIDIKAN' => 'bg-[#FFF3E3] text-[#D38B1D] border-[#FFE2BC]',
            'KEGIATAN' => 'bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]',
            'PENGUMUMAN' => 'bg-[#FDF2F8] text-[#BE185D] border-[#FCE7F3]',
            'MAKTAB TULI' => 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
            'KAJIAN' => 'bg-purple-100 text-purple-700 border-purple-200',
            default => 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }

    /**
     * Accessor for Author Initials
     */
    public function getAuthorInitialsAttribute(): string
    {
        $words = explode(' ', trim($this->penulis));
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper(mb_substr($w, 0, 1));
        }
        return $initials ?: 'AD';
    }

    /**
     * Accessor for Author Badge Background Color
     */
    public function getAuthorBgAttribute(): string
    {
        return match (strtoupper($this->kategori)) {
            'PENDIDIKAN' => 'bg-[#FFF3E3] text-[#D38B1D]',
            'KEGIATAN' => 'bg-[#E6EFFB] text-[#025EDB]',
            'PENGUMUMAN' => 'bg-[#FDF2F8] text-[#BE185D]',
            'MAKTAB TULI' => 'bg-[#E0F2FE] text-[#0369A1]',
            default => 'bg-blue-100 text-blue-700',
        };
    }

    /**
     * Accessor for Relative Upload Time ("HARI INI", "2 HARI LALU", "MINGGU LALU", etc.)
     */
    public function getTimeAgoAttribute(): string
    {
        $date = null;
        if (!empty($this->created_at)) {
            $date = \Carbon\Carbon::parse($this->created_at);
        } elseif (!empty($this->tanggal)) {
            try {
                $date = \Carbon\Carbon::parse($this->tanggal);
            } catch (\Exception $e) {
                $date = null;
            }
        }

        if (!$date) {
            return 'HARI INI';
        }

        $now = \Carbon\Carbon::now()->startOfDay();
        $target = $date->copy()->startOfDay();
        $diffDays = $target->diffInDays($now, false);

        if ($diffDays <= 0) {
            return 'HARI INI';
        } elseif ($diffDays === 1) {
            return '1 HARI LALU';
        } elseif ($diffDays < 7) {
            return $diffDays . ' HARI LALU';
        } elseif ($diffDays < 14) {
            return 'MINGGU LALU';
        } elseif ($diffDays < 30) {
            $weeks = (int) floor($diffDays / 7);
            return $weeks . ' MINGGU LALU';
        } elseif ($diffDays < 60) {
            return '1 BULAN LALU';
        } elseif ($diffDays < 365) {
            $months = (int) floor($diffDays / 30);
            return $months . ' BULAN LALU';
        } else {
            $years = (int) floor($diffDays / 365);
            return $years . ' TAHUN LALU';
        }
    }
}
