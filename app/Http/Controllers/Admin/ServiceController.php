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

        // Process any uploaded image file dynamically
        foreach ($request->allFiles() as $fileKey => $file) {
            if ($file && $file->isValid()) {
                $request->validate([
                    $fileKey => 'nullable|image|mimes:jpeg,png,jpg,webp,svg,gif|max:10240',
                ]);
                $path = $file->store('settings', 'public');
                $data[$fileKey] = '/storage/' . $path;
            }
        }

        // Save all text and uploaded image values
        foreach ($data as $key => $val) {
            if ($val !== null) {
                $group = 'general';
                if (str_starts_with($key, 'hero_') || str_starts_with($key, 'about_') || str_starts_with($key, 'stat') || str_starts_with($key, 'service') || str_starts_with($key, 'why_')) {
                    $group = 'beranda';
                } elseif (str_starts_with($key, 'maktab_')) {
                    $group = 'maktabtuli';
                } elseif (str_starts_with($key, 'berita_')) {
                    $group = 'berita';
                } elseif (str_starts_with($key, 'galeri_')) {
                    $group = 'galeri';
                } elseif (str_starts_with($key, 'contact_')) {
                    $group = 'kontak';
                } elseif (str_starts_with($key, 'footer_')) {
                    $group = 'footer';
                }

                $type = 'text';
                if (str_contains($key, 'desc') || str_contains($key, 'visi') || str_contains($key, 'misi') || str_contains($key, 'address') || str_ends_with($key, '_a')) {
                    $type = 'textarea';
                } elseif (str_contains($key, 'image')) {
                    $type = 'image';
                } elseif (str_contains($key, 'link') || str_contains($key, 'url') || str_contains($key, 'embed') || str_contains($key, 'instagram') || str_contains($key, 'tiktok') || str_contains($key, 'youtube') || str_contains($key, 'facebook')) {
                    $type = 'link';
                }

                SiteSetting::set($key, (string) $val, $group, $type);
            }
        }

        return redirect()->back()->with('success', 'Alhamdulillah! Pengaturan dan konten seluruh halaman website berhasil diperbarui.');
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
