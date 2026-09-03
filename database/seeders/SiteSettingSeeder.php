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
            'contact' => ['contact_nama_yayasan', 'contact_tagline', 'contact_address', 'contact_phone', 'contact_whatsapp', 'contact_email', 'contact_hours', 'contact_maps_embed', 'contact_maps_link', 'contact_instagram', 'contact_tiktok', 'contact_youtube', 'contact_facebook'],
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
