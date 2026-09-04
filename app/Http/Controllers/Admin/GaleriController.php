<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GaleriController extends Controller
{
    /**
     * Tampilkan halaman utama Admin Manajemen Galeri & daftar seluruh item.
     */
    public function index()
    {
        $galeris = Galeri::latest('id')->get()->map(function ($g) {
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
                'tanggal'     => $g->tanggal ?: ($g->created_at ? $g->created_at->format('Y-m-d') : date('Y-m-d')),
                'date'        => $g->tanggal ?: ($g->created_at ? $g->created_at->format('Y-m-d') : date('Y-m-d')),
                'deskripsi'   => $g->deskripsi ?: '',
                'description' => $g->deskripsi ?: '',
                'is_featured' => (bool) $g->is_featured,
                'status'      => $g->status ?: 'Published',
                'order'       => $g->order ?: 0,
                'tagBg'       => $g->tag_bg,
                'created_at'  => $g->created_at?->toIso8601String(),
                'updated_at'  => $g->updated_at?->toIso8601String(),
            ];
        });

        // Compute Quick Statistics
        $stats = [
            'total'     => $galeris->count(),
            'foto'      => $galeris->where('tipe', 'foto')->count(),
            'video'     => $galeris->where('tipe', 'video')->count(),
            'published' => $galeris->where('status', 'Published')->count(),
            'draft'     => $galeris->where('status', 'Draft')->count(),
            'featured'  => $galeris->where('is_featured', true)->count(),
        ];

        return Inertia::render('Admin/Galeri', [
            'galeriData' => $galeris,
            'stats'      => $stats,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Simpan item galeri baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul'       => 'required|string|max:255',
            'kategori'    => 'required|string|max:100',
            'tipe'        => 'required|in:foto,video',
            'image'       => 'nullable',
            'image_file'  => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
            'video_url'   => 'nullable|string|max:500',
            'duration'    => 'nullable|string|max:50',
            'tanggal'     => 'nullable|string|max:50',
            'deskripsi'   => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'status'      => 'required|in:Published,Draft',
        ]);

        $tipe = $request->input('tipe', 'foto');
        $videoUrl = $request->input('video_url');

        // Handle Image Upload / Auto Thumbnail
        $imagePath = $this->handleImageUpload($request, $tipe === 'video' ? '/images/image1.png' : '/images/image6.png');

        // If Video and no custom image uploaded, auto extract YouTube thumbnail if possible
        if ($tipe === 'video' && (!request()->hasFile('image_file') && empty($request->input('image'))) && !empty($videoUrl)) {
            $ytThumb = $this->extractYoutubeThumbnail($videoUrl);
            if ($ytThumb) {
                $imagePath = $ytThumb;
            }
        }

        // If marked as featured, optionally unset other featured if single featured is preferred or keep
        if ($request->boolean('is_featured', false)) {
            Galeri::where('is_featured', true)->update(['is_featured' => false]);
        }

        Galeri::create([
            'judul'       => $request->input('judul'),
            'kategori'    => $request->input('kategori'),
            'tipe'        => $tipe,
            'image'       => $imagePath,
            'video_url'   => $videoUrl,
            'duration'    => $request->input('duration'),
            'tanggal'     => $request->input('tanggal') ?: date('Y-m-d'),
            'deskripsi'   => $request->input('deskripsi'),
            'is_featured' => $request->boolean('is_featured', false),
            'status'      => $request->input('status', 'Published'),
            'order'       => Galeri::max('order') + 1,
        ]);

        return redirect()->back()->with('success', 'Item galeri berhasil ditambahkan ke database!');
    }

    /**
     * Perbarui item galeri di database.
     */
    public function update(Request $request, $id)
    {
        $galeri = Galeri::findOrFail($id);

        $request->validate([
            'judul'       => 'required|string|max:255',
            'kategori'    => 'required|string|max:100',
            'tipe'        => 'required|in:foto,video',
            'image'       => 'nullable',
            'image_file'  => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
            'video_url'   => 'nullable|string|max:500',
            'duration'    => 'nullable|string|max:50',
            'tanggal'     => 'nullable|string|max:50',
            'deskripsi'   => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'status'      => 'required|in:Published,Draft',
        ]);

        $tipe = $request->input('tipe', $galeri->tipe);
        $videoUrl = $request->input('video_url', $galeri->video_url);

        // Process uploaded image if new one provided, otherwise keep existing
        $imagePath = $this->handleImageUpload($request, $galeri->image);

        if ($request->has('is_featured') && $request->boolean('is_featured')) {
            Galeri::where('id', '!=', $id)->where('is_featured', true)->update(['is_featured' => false]);
            $galeri->is_featured = true;
        } elseif ($request->has('is_featured')) {
            $galeri->is_featured = false;
        }

        $galeri->judul       = $request->input('judul');
        $galeri->kategori    = $request->input('kategori');
        $galeri->tipe        = $tipe;
        $galeri->image       = $imagePath;
        $galeri->video_url   = $videoUrl;
        $galeri->duration    = $request->input('duration', $galeri->duration);
        $galeri->tanggal     = $request->input('tanggal') ?: $galeri->tanggal;
        $galeri->deskripsi   = $request->input('deskripsi');
        $galeri->status      = $request->input('status', $galeri->status);

        $galeri->save();

        return redirect()->back()->with('success', 'Item galeri berhasil diperbarui!');
    }

    /**
     * Hapus item galeri.
     */
    public function destroy($id)
    {
        $galeri = Galeri::findOrFail($id);

        // Delete uploaded local file if exists
        if ($galeri->image && str_starts_with($galeri->image, '/images/galeri/')) {
            $fullPath = public_path(ltrim($galeri->image, '/'));
            if (file_exists($fullPath)) {
                @unlink($fullPath);
            }
        }

        $galeri->delete();

        return redirect()->back()->with('success', 'Item galeri berhasil dihapus dari database!');
    }

    /**
     * Toggle status Published <-> Draft.
     */
    public function toggleStatus($id)
    {
        $galeri = Galeri::findOrFail($id);
        $galeri->status = $galeri->status === 'Published' ? 'Draft' : 'Published';
        $galeri->save();

        return redirect()->back()->with('success', 'Status galeri berhasil diubah!');
    }

    /**
     * Toggle status Featured (Kegiatan Utama / Bintang).
     */
    public function toggleFeatured($id)
    {
        $galeri = Galeri::findOrFail($id);

        if (!$galeri->is_featured) {
            Galeri::where('is_featured', true)->update(['is_featured' => false]);
            $galeri->is_featured = true;
            $galeri->save();

            return redirect()->back()->with('success', 'Galeri berhasil dijadikan Kegiatan Utama (Featured ⭐)!');
        } else {
            $galeri->is_featured = false;
            $galeri->save();

            return redirect()->back()->with('success', 'Status Kegiatan Utama (Featured) berhasil dicopot.');
        }
    }

    /**
     * Helper to process image input (uploaded file, base64 data, or string URL).
     */
    private function handleImageUpload(Request $request, $currentImage = '/images/image6.png')
    {
        $targetDir = public_path('images/galeri');
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Case 1: Uploaded file
        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($targetDir, $filename);
            return '/images/galeri/' . $filename;
        }

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($targetDir, $filename);
            return '/images/galeri/' . $filename;
        }

        // Case 2: Base64 data string
        $rawImage = $request->input('image');
        if (is_string($rawImage) && preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/s', $rawImage, $matches)) {
            try {
                $mimeSubtype = strtolower($matches[1]);
                $base64Data = $matches[2];
                $decodedData = base64_decode($base64Data);
                if ($decodedData !== false) {
                    $extension = match ($mimeSubtype) {
                        'jpeg' => 'jpg',
                        'png'  => 'png',
                        'webp' => 'webp',
                        'gif'  => 'gif',
                        'svg+xml' => 'svg',
                        default => 'jpg'
                    };
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    file_put_contents($targetDir . '/' . $filename, $decodedData);
                    return '/images/galeri/' . $filename;
                }
            } catch (\Exception $e) {
                // Fallback
            }
        }

        // Case 3: URL / Relative path
        if (is_string($rawImage) && !empty($rawImage) && !str_starts_with($rawImage, 'data:') && !str_starts_with($rawImage, 'blob:')) {
            return $rawImage;
        }

        return $currentImage ?: '/images/image6.png';
    }

    /**
     * Extract YouTube high-res thumbnail URL if YouTube video link provided.
     */
    private function extractYoutubeThumbnail($url)
    {
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $url, $matches)) {
            $videoId = $matches[1];
            return "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";
        }
        return null;
    }
}
