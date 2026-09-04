<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display the Services & Landing Page Content Management page.
     */
    public function index(Request $request)
    {
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('Admin/Services', [
            'settings' => $settings,
            'status' => session('status'),
            'success' => session('success'),
        ]);
    }

    /**
     * Update settings and upload new images.
     */
    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        $imageKeys = [
            'hero_image',
            'about_image1',
            'about_image2',
            'about_image3',
            'about_image4',
            'service1_image',
            'service2_image',
            'service3_image',
        ];

        // Process file uploads
        foreach ($imageKeys as $imgKey) {
            if ($request->hasFile($imgKey)) {
                $request->validate([
                    $imgKey => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
                ]);

                $file = $request->file($imgKey);
                $path = $file->store('settings', 'public');
                $data[$imgKey] = '/storage/' . $path;
            }
        }

        // Save all text and uploaded image values
        foreach ($data as $key => $val) {
            if ($val !== null) {
                $group = 'general';
                if (str_starts_with($key, 'hero_')) {
                    $group = 'hero';
                } elseif (str_starts_with($key, 'about_')) {
                    $group = 'about';
                } elseif (str_starts_with($key, 'service')) {
                    $group = 'services';
                } elseif (str_starts_with($key, 'contact_')) {
                    $group = 'contact';
                }

                $type = 'text';
                if (str_contains($key, 'desc') || str_contains($key, 'visi') || str_contains($key, 'misi') || str_contains($key, 'address')) {
                    $type = 'textarea';
                } elseif (in_array($key, $imageKeys)) {
                    $type = 'image';
                } elseif (str_contains($key, 'link') || str_contains($key, 'embed') || str_contains($key, 'instagram') || str_contains($key, 'tiktok') || str_contains($key, 'youtube') || str_contains($key, 'facebook')) {
                    $type = 'link';
                }

                SiteSetting::set($key, (string) $val, $group, $type);
            }
        }

        return redirect()->back()->with('success', 'Alhamdulillah! Konten tampilan dan pengaturan website berhasil diperbarui secara langsung.');
    }

    /**
     * Reset settings to default values.
     */
    public function resetDefaults(Request $request)
    {
        $defaults = SiteSetting::defaults();
        foreach ($defaults as $key => $val) {
            SiteSetting::set($key, $val);
        }

        return redirect()->back()->with('success', 'Pengaturan tampilan berhasil dikembalikan ke standar awal.');
    }
}
