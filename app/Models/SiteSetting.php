<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Default fallback values for all settings
     */
    public static function defaults(): array
    {
        return [
            // HERO SECTION
            'hero_badge' => 'Pusat Pendidikan & Perlindungan Inklusif',
            'hero_title_line1' => 'Yayasan Bhakti',
            'hero_title_line2' => 'Arumi Delangga',
            'hero_description' => 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
            'hero_btn1_text' => 'Tentang Yayasan',
            'hero_btn1_link' => '/maktabtuli',
            'hero_btn2_text' => 'Daftar Santri',
            'hero_btn2_link' => '/daftar',
            'hero_image' => '/images/hero_foto.png',

            // TENTANG YAYASAN SECTION
            'about_title' => 'Dedikasi untuk Inklusi dan Spiritualitas',
            'about_description' => 'Didirikan dengan semangat kasih sayang, Yayasan Bhakti Arumi Delangga hadir sebagai jembatan bagi anak-anak berkebutuhan khusus, khususnya teman Tuli dan Autis, untuk mendapatkan hak pendidikan agama dan umum yang setara.',
            'about_image1' => '/images/image1.png',
            'about_image2' => '/images/image2.png',
            'about_image3' => '/images/image3.png',
            'about_image4' => '/images/image4.png',
            'about_sejarah_title' => 'Sejarah Singkat & Komitmen',
            'about_sejarah_desc' => 'Didirikan sejak tahun 2020 sebagai ikhtiar memperluas akses pembelajaran Al-Qur\'an bahasa isyarat di Pontianak, Kalimantan Barat.',
            'about_visi' => 'Menjadi pusat unggulan pendidikan Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli & Autis yang berakhlak mulia dan mandiri.',
            'about_misi' => 'Membangun kurikulum tahfidz isyarat, menyelenggarakan terapi kemandirian sensori, dan membina keluarga santri.',

            // PROGRAM & LAYANAN (SERVICES)
            'service1_title' => 'Maktab Tuli As-Sami',
            'service1_tag' => 'Pendidikan Al-Qur\'an Isyarat',
            'service1_desc' => 'Pusat pembelajaran Al-Qur\'an, tajwid isyarat, fiqih ibadah praktis, dan pembinaan akhlak khusus Teman Tuli dengan metode visual terpadu.',
            'service1_image' => '/images/image6.png',
            'service1_link' => '/maktabtuli',
            'service2_title' => 'Maktab Autis & Kemandirian',
            'service2_tag' => 'Terapi & Kemandirian Ibadah',
            'service2_desc' => 'Pendampingan sensori motorik, pengenalan rukun Islam, dan pelatihan kemandirian harian agar santri mampu beribadah mandiri.',
            'service2_image' => '/images/image7.png',
            'service2_link' => '/daftar',
            'service3_title' => 'Konseling & Parenting Inklusif',
            'service3_tag' => 'Pendampingan Keluarga',
            'service3_desc' => 'Sesi bimbingan berkala bagi para orang tua dan wali santri guna memperkuat ketahanan keluarga dalam mendampingi anak istimewa.',
            'service3_image' => '/images/image8.png',
            'service3_link' => '/kontak',

            // KONTAK, MAPS & MEDIA SOSIAL
            'contact_nama_yayasan' => 'Yayasan Bhakti Arumi Delangga',
            'contact_tagline' => 'Maktab Tuli As-Sami & Maktab Autis',
            'contact_address' => 'Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124',
            'contact_phone' => '+62 812-3456-7890',
            'contact_whatsapp' => '081234567890',
            'contact_email' => 'info@bhaktiarumi.org',
            'contact_hours' => 'Senin - Sabtu: 08:00 - 16:30 WIB',
            'contact_maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid',
            'contact_maps_link' => 'https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak',
            'contact_instagram' => 'https://www.instagram.com/maktabtuliassami.id/',
            'contact_tiktok' => 'https://www.tiktok.com/@maktabtuliassami.id',
            'contact_youtube' => 'https://www.youtube.com/@MaktabTuliAsSami',
            'contact_facebook' => 'https://facebook.com/maktabtuliassami',
        ];
    }

    /**
     * Get a setting by key with fallback
     */
    public static function get(string $key, $default = null)
    {
        $defaults = self::defaults();
        $fallback = $default ?? ($defaults[$key] ?? null);

        try {
            $setting = self::where('key', $key)->first();
            return ($setting && $setting->value !== null && $setting->value !== '') ? $setting->value : $fallback;
        } catch (\Throwable $e) {
            return $fallback;
        }
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $group = 'general', string $type = 'text'): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
            ]
        );
    }

    /**
     * Get all settings merged with defaults
     */
    public static function getAllGrouped(): array
    {
        $defaults = self::defaults();

        try {
            $saved = self::all()->pluck('value', 'key')->toArray();
        } catch (\Throwable $e) {
            $saved = [];
        }

        $merged = array_merge($defaults, array_filter($saved, function ($val) {
            return $val !== null && $val !== '';
        }));

        return $merged;
    }
}
