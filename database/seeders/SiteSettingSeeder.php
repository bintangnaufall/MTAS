<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = SiteSetting::defaults();

        $groups = [
            'hero' => ['hero_badge', 'hero_title_line1', 'hero_title_line2', 'hero_description', 'hero_btn1_text', 'hero_btn1_link', 'hero_btn2_text', 'hero_btn2_link', 'hero_image'],
            'about' => ['about_title', 'about_description', 'about_image1', 'about_image2', 'about_image3', 'about_image4', 'about_sejarah_title', 'about_sejarah_desc', 'about_visi', 'about_misi'],
            'services' => ['service1_title', 'service1_tag', 'service1_desc', 'service1_image', 'service1_link', 'service2_title', 'service2_tag', 'service2_desc', 'service2_image', 'service2_link', 'service3_title', 'service3_tag', 'service3_desc', 'service3_image', 'service3_link'],
            'contact' => ['contact_nama_yayasan', 'contact_tagline', 'contact_address', 'contact_phone', 'contact_whatsapp', 'contact_email', 'contact_hours', 'contact_maps_badge', 'contact_maps_title', 'contact_maps_desc', 'contact_maps_copy_btn', 'contact_maps_btn', 'contact_maps_embed', 'contact_maps_link', 'contact_instagram', 'contact_tiktok', 'contact_youtube', 'contact_facebook'],
            'footer' => [
                'footer_nama_yayasan', 'footer_deskripsi', 'footer_instagram', 'footer_tiktok', 'footer_youtube', 'footer_facebook',
                'footer_links_title', 'footer_link1_text', 'footer_link1_url', 'footer_link2_text', 'footer_link2_url', 'footer_link3_text', 'footer_link3_url', 'footer_link4_text', 'footer_link4_url', 'footer_link5_text', 'footer_link5_url',
                'footer_program_title', 'footer_prog1_text', 'footer_prog1_url', 'footer_prog2_text', 'footer_prog2_url', 'footer_prog3_text', 'footer_prog3_url', 'footer_prog4_text', 'footer_prog4_url',
                'footer_cta_title', 'footer_cta_desc', 'footer_cta_btn_text', 'footer_cta_btn_link',
                'footer_copyright', 'footer_slogan'
            ],
        ];

        foreach ($defaults as $key => $val) {
            $group = 'general';
            foreach ($groups as $gName => $keys) {
                if (in_array($key, $keys)) {
                    $group = $gName;
                    break;
                }
            }

            $type = 'text';
            if (str_contains($key, 'desc') || str_contains($key, 'visi') || str_contains($key, 'misi') || str_contains($key, 'address')) {
                $type = 'textarea';
            } elseif (str_contains($key, 'image')) {
                $type = 'image';
            } elseif (str_contains($key, 'link') || str_contains($key, 'embed') || str_contains($key, 'instagram') || str_contains($key, 'tiktok') || str_contains($key, 'youtube') || str_contains($key, 'facebook')) {
                $type = 'link';
            }

            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $val,
                    'group' => $group,
                    'type' => $type,
                ]
            );
        }
    }
}
