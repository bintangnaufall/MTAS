<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Tampilkan halaman utama admin berita & daftar data dari tabel beritas.
     */
    public function index()
    {
        $beritas = Berita::latest('id')->get()->map(function ($b) {
            return [
                'id'                => $b->id,
                'judul'             => $b->judul,
                'title'             => $b->judul,
                'slug'              => $b->slug,
                'kategori'          => $b->kategori,
                'category'          => $b->kategori,
                'tagBg'             => $b->tag_bg,
                'image'             => $b->image ?: '/images/berita_utama.png',
                'penulis'           => $b->penulis ?: 'Admin Yayasan',
                'author'            => $b->penulis ?: 'Admin Yayasan',
                'authorInitials'    => $b->author_initials,
                'authorBg'          => $b->author_bg,
                'tanggal'           => $b->tanggal ?: ($b->created_at ? $b->created_at->format('Y-m-d') : date('Y-m-d')),
                'date'              => $b->tanggal ?: ($b->created_at ? $b->created_at->format('Y-m-d') : date('Y-m-d')),
                'status'            => $b->status ?: 'Published',
                'ringkasan'         => $b->ringkasan ?: '',
                'summary'           => $b->ringkasan ?: '',
                'blockquote'        => $b->blockquote ?: '',
                'paragraf1'         => $b->paragraf1 ?: '',
                'subheading'        => $b->subheading ?: '',
                'paragraf2'         => $b->paragraf2 ?: '',
                'blue_quote'        => $b->blue_quote ?: '',
                'blueQuote'         => $b->blue_quote ?: '',
                'blue_quote_author' => $b->blue_quote_author ?: '',
                'blueQuoteAuthor'   => $b->blue_quote_author ?: '',
                'paragraf3'         => $b->paragraf3 ?: '',
                'is_featured'       => (bool) $b->is_featured,
                'dokumentasi'       => $b->dokumentasi ?: [],
                'created_at'        => $b->created_at?->toIso8601String(),
                'updated_at'        => $b->updated_at?->toIso8601String(),
            ];
        });

        return Inertia::render('Admin/Berita', [
            'articlesData' => $beritas,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Simpan berita baru ke tabel beritas.
     */
    public function store(Request $request)
    {
        $judul = $request->input('judul') ?? $request->input('title');
        $kategori = $request->input('kategori') ?? $request->input('category', 'PENDIDIKAN');
        $penulis = $request->input('penulis') ?? $request->input('author', auth()->user()?->name ?? 'Admin Yayasan');
        $tanggal = $request->input('tanggal') ?? $request->input('date', date('Y-m-d'));
        $ringkasan = $request->input('ringkasan') ?? $request->input('summary');
        $blueQuote = $request->input('blue_quote') ?? $request->input('blueQuote');
        $blueQuoteAuthor = $request->input('blue_quote_author') ?? $request->input('blueQuoteAuthor');

        $request->validate([
            'judul'             => 'nullable|string|max:255',
            'title'             => 'nullable|string|max:255',
            'kategori'          => 'nullable|string|max:50',
            'category'          => 'nullable|string|max:50',
            'image'             => 'nullable',
            'image_file'        => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
            'penulis'           => 'nullable|string|max:255',
            'author'            => 'nullable|string|max:255',
            'tanggal'           => 'nullable|string|max:50',
            'date'              => 'nullable|string|max:50',
            'status'            => 'required|in:Published,Draft',
            'ringkasan'         => 'nullable|string',
            'summary'           => 'nullable|string',
            'blockquote'        => 'nullable|string',
            'paragraf1'         => 'nullable|string',
            'subheading'        => 'nullable|string|max:255',
            'paragraf2'         => 'nullable|string',
            'blue_quote'        => 'nullable|string',
            'blueQuote'         => 'nullable|string',
            'blue_quote_author' => 'nullable|string|max:255',
            'blueQuoteAuthor'   => 'nullable|string|max:255',
            'paragraf3'         => 'nullable|string',
            'is_featured'       => 'nullable|boolean',
            'dokumentasi'       => 'nullable',
            'dokumentasi_files' => 'nullable|array',
            'dokumentasi_files.*' => 'nullable|file|max:51200',
        ]);

        if (empty($judul)) {
            return redirect()->back()->withErrors(['judul' => 'Judul berita wajib diisi.']);
        }

        // Generate slug unik dari judul
        $slug = Str::slug($judul);
        $originalSlug = $slug;
        $count = 1;
        while (Berita::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        // Process image upload from computer / base64 / URL
        $imagePath = $this->handleImageUpload($request, '/images/berita_utama.png');

        // Process documentation photos & videos (max 6 items)
        $dokumentasi = $this->handleDokumentasiUpload($request, []);

        if ($request->boolean('is_featured', false)) {
            Berita::where('is_featured', true)->update(['is_featured' => false]);
        }

        $berita = Berita::create([
            'judul'             => $judul,
            'slug'              => $slug,
            'kategori'          => $kategori ?: 'PENDIDIKAN',
            'image'             => $imagePath,
            'penulis'           => $penulis ?: (auth()->user()?->name ?? 'Admin Yayasan'),
            'tanggal'           => $tanggal ?: date('Y-m-d'),
            'status'            => $request->input('status', 'Published'),
            'ringkasan'         => $ringkasan ?: $judul,
            'blockquote'        => $request->input('blockquote'),
            'paragraf1'         => $request->input('paragraf1') ?: $ringkasan ?: $judul,
            'subheading'        => $request->input('subheading'),
            'paragraf2'         => $request->input('paragraf2'),
            'blue_quote'        => $blueQuote,
            'blue_quote_author' => $blueQuoteAuthor,
            'paragraf3'         => $request->input('paragraf3'),
            'is_featured'       => $request->boolean('is_featured', false),
            'dokumentasi'       => $dokumentasi,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil ditambahkan ke database!');
    }

    /**
     * Perbarui data berita di tabel beritas.
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $judul = $request->input('judul') ?? $request->input('title', $berita->judul);
        $kategori = $request->input('kategori') ?? $request->input('category', $berita->kategori);
        $penulis = $request->input('penulis') ?? $request->input('author', $berita->penulis);
        $tanggal = $request->input('tanggal') ?? $request->input('date', $berita->tanggal);
        $ringkasan = $request->input('ringkasan') ?? $request->input('summary', $berita->ringkasan);
        $blueQuote = $request->input('blue_quote') ?? $request->input('blueQuote', $berita->blue_quote);
        $blueQuoteAuthor = $request->input('blue_quote_author') ?? $request->input('blueQuoteAuthor', $berita->blue_quote_author);

        $request->validate([
            'judul'             => 'nullable|string|max:255',
            'title'             => 'nullable|string|max:255',
            'kategori'          => 'nullable|string|max:50',
            'category'          => 'nullable|string|max:50',
            'image'             => 'nullable',
            'image_file'        => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
            'penulis'           => 'nullable|string|max:255',
            'author'            => 'nullable|string|max:255',
            'tanggal'           => 'nullable|string|max:50',
            'date'              => 'nullable|string|max:50',
            'status'            => 'required|in:Published,Draft',
            'ringkasan'         => 'nullable|string',
            'summary'           => 'nullable|string',
            'blockquote'        => 'nullable|string',
            'paragraf1'         => 'nullable|string',
            'subheading'        => 'nullable|string|max:255',
            'paragraf2'         => 'nullable|string',
            'blue_quote'        => 'nullable|string',
            'blueQuote'         => 'nullable|string',
            'blue_quote_author' => 'nullable|string|max:255',
            'blueQuoteAuthor'   => 'nullable|string|max:255',
            'paragraf3'         => 'nullable|string',
            'is_featured'       => 'nullable|boolean',
            'dokumentasi'       => 'nullable',
            'dokumentasi_files' => 'nullable|array',
            'dokumentasi_files.*' => 'nullable|file|max:51200',
        ]);

        // Re-generate slug jika judul berubah
        if ($berita->judul !== $judul && !empty($judul)) {
            $slug = Str::slug($judul);
            $originalSlug = $slug;
            $count = 1;
            while (Berita::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }
            $berita->slug = $slug;
        }

        // Process uploaded image if new one provided, otherwise keep existing
        $imagePath = $this->handleImageUpload($request, $berita->image);

        // Process documentation photos & videos (max 6 items)
        $dokumentasi = $this->handleDokumentasiUpload($request, $berita->dokumentasi ?: []);

        if ($request->has('is_featured') && $request->boolean('is_featured')) {
            Berita::where('id', '!=', $id)->where('is_featured', true)->update(['is_featured' => false]);
            $berita->is_featured = true;
        } elseif ($request->has('is_featured')) {
            $berita->is_featured = false;
        }

        $berita->judul = $judul ?: $berita->judul;
        $berita->kategori = $kategori ?: $berita->kategori;
        $berita->image = $imagePath;
        $berita->penulis = $penulis ?: $berita->penulis;
        $berita->tanggal = $tanggal ?: $berita->tanggal;
        $berita->status = $request->input('status', $berita->status);
        $berita->ringkasan = $ringkasan;
        $berita->blockquote = $request->input('blockquote', $berita->blockquote);
        $berita->paragraf1 = $request->input('paragraf1', $berita->paragraf1);
        $berita->subheading = $request->input('subheading', $berita->subheading);
        $berita->paragraf2 = $request->input('paragraf2', $berita->paragraf2);
        $berita->blue_quote = $blueQuote;
        $berita->blue_quote_author = $blueQuoteAuthor;
        $berita->paragraf3 = $request->input('paragraf3', $berita->paragraf3);
        $berita->dokumentasi = $dokumentasi;

        $berita->save();

        return redirect()->back()->with('success', 'Berita berhasil diperbarui di database!');
    }

    /**
     * Hapus berita dari tabel beritas.
     */
    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);
        $berita->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus dari database!');
    }

    /**
     * Switch status Published <-> Draft.
     */
    public function toggleStatus($id)
    {
        $berita = Berita::findOrFail($id);
        $berita->status = $berita->status === 'Published' ? 'Draft' : 'Published';
        $berita->save();

        return redirect()->back()->with('success', 'Status berita berhasil diubah!');
    }

    /**
     * Switch is_featured (Bintang Berita Utama).
     */
    public function toggleFeatured($id)
    {
        $berita = Berita::findOrFail($id);

        if (!$berita->is_featured) {
            // Set all other articles to false so only this one is featured headline
            Berita::where('is_featured', true)->update(['is_featured' => false]);
            $berita->is_featured = true;
            $berita->save();

            return redirect()->back()->with('success', 'Berita berhasil dijadikan Berita Utama (Bintang ⭐)!');
        } else {
            $berita->is_featured = false;
            $berita->save();

            return redirect()->back()->with('success', 'Status Berita Utama (Bintang) berhasil dicopot.');
        }
    }

    /**
     * Helper to process image input (uploaded file, base64 data, or string URL).
     */
    private function handleImageUpload(Request $request, $currentImage = '/images/berita_utama.png')
    {
        $targetDir = public_path('images/berita');
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Case 1: Uploaded file from multipart form ('image_file' or 'image')
        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($targetDir, $filename);
            return '/images/berita/' . $filename;
        }

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($targetDir, $filename);
            return '/images/berita/' . $filename;
        }

        // Case 2: Base64 data string (e.g. data:image/png;base64,....)
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
                    return '/images/berita/' . $filename;
                }
            } catch (\Exception $e) {
                // Fallback to current image on error
            }
        }

        // Case 3: Normal URL / relative file path (ensure not blob: or data:)
        if (is_string($rawImage) && !empty($rawImage) && !str_starts_with($rawImage, 'data:') && !str_starts_with($rawImage, 'blob:')) {
            return $rawImage;
        }

        return $currentImage ?: '/images/berita_utama.png';
    }

    /**
     * Helper to process multiple documentation photos & videos (max 6 items)
     */
    private function handleDokumentasiUpload(Request $request, $existingDokumentasi = [])
    {
        $dokumentasiDirImages = public_path('images/berita/dokumentasi');
        $dokumentasiDirVideos = public_path('videos/berita/dokumentasi');

        if (!file_exists($dokumentasiDirImages)) {
            mkdir($dokumentasiDirImages, 0755, true);
        }
        if (!file_exists($dokumentasiDirVideos)) {
            mkdir($dokumentasiDirVideos, 0755, true);
        }

        $items = [];

        // 1. Process raw existing/passed JSON or array items from request
        $rawDokumentasi = $request->input('dokumentasi');
        if (is_string($rawDokumentasi)) {
            $decoded = json_decode($rawDokumentasi, true);
            if (is_array($decoded)) {
                $rawDokumentasi = $decoded;
            }
        }

        if (is_array($rawDokumentasi)) {
            foreach ($rawDokumentasi as $item) {
                if (is_string($item) && !empty($item)) {
                    if (preg_match('/^data:(image|video)\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/s', $item, $matches)) {
                        $mediaType = $matches[1];
                        $mimeSubtype = strtolower($matches[2]);
                        $decodedData = base64_decode($matches[3]);
                        if ($decodedData !== false) {
                            $ext = match ($mimeSubtype) {
                                'jpeg', 'jpg' => 'jpg',
                                'png' => 'png',
                                'webp' => 'webp',
                                'mp4' => 'mp4',
                                'webm' => 'webm',
                                default => ($mediaType === 'video' ? 'mp4' : 'jpg')
                            };
                            $targetDir = $mediaType === 'video' ? $dokumentasiDirVideos : $dokumentasiDirImages;
                            $publicPrefix = $mediaType === 'video' ? '/videos/berita/dokumentasi/' : '/images/berita/dokumentasi/';
                            $filename = time() . '_' . uniqid() . '.' . $ext;
                            file_put_contents($targetDir . '/' . $filename, $decodedData);
                            $items[] = [
                                'type' => $mediaType,
                                'url' => $publicPrefix . $filename,
                            ];
                        }
                    } else if (!str_starts_with($item, 'blob:')) {
                        $isVideo = preg_match('/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i', $item) || str_contains($item, 'youtube.com') || str_contains($item, 'youtu.be') || str_contains($item, 'vimeo.com');
                        $items[] = [
                            'type' => $isVideo ? 'video' : 'image',
                            'url' => $item,
                        ];
                    }
                } elseif (is_array($item) && !empty($item['url'])) {
                    $url = $item['url'];
                    if (preg_match('/^data:(image|video)\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/s', $url, $matches)) {
                        $mediaType = $matches[1];
                        $mimeSubtype = strtolower($matches[2]);
                        $decodedData = base64_decode($matches[3]);
                        if ($decodedData !== false) {
                            $ext = match ($mimeSubtype) {
                                'jpeg', 'jpg' => 'jpg',
                                'png' => 'png',
                                'webp' => 'webp',
                                'mp4' => 'mp4',
                                'webm' => 'webm',
                                default => ($mediaType === 'video' ? 'mp4' : 'jpg')
                            };
                            $targetDir = $mediaType === 'video' ? $dokumentasiDirVideos : $dokumentasiDirImages;
                            $publicPrefix = $mediaType === 'video' ? '/videos/berita/dokumentasi/' : '/images/berita/dokumentasi/';
                            $filename = time() . '_' . uniqid() . '.' . $ext;
                            file_put_contents($targetDir . '/' . $filename, $decodedData);
                            $items[] = [
                                'type' => $mediaType,
                                'url' => $publicPrefix . $filename,
                                'caption' => $item['caption'] ?? '',
                            ];
                        }
                    } else if (!str_starts_with($url, 'blob:')) {
                        $type = $item['type'] ?? (preg_match('/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i', $url) || str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be') ? 'video' : 'image');
                        $items[] = [
                            'type' => $type,
                            'url' => $url,
                            'caption' => $item['caption'] ?? '',
                        ];
                    }
                }
            }
        }

        // 2. Process uploaded multipart files ('dokumentasi_files') if not already handled via Base64/metadata
        if ($request->hasFile('dokumentasi_files') && count($items) < 6) {
            $files = $request->file('dokumentasi_files');
            if (!is_array($files)) {
                $files = [$files];
            }
            if (empty($rawDokumentasi) || count($items) === 0) {
                foreach ($files as $file) {
                    if ($file && $file->isValid() && count($items) < 6) {
                        $mime = $file->getMimeType();
                        $isVideo = str_starts_with($mime, 'video/');
                        $targetDir = $isVideo ? $dokumentasiDirVideos : $dokumentasiDirImages;
                        $publicPrefix = $isVideo ? '/videos/berita/dokumentasi/' : '/images/berita/dokumentasi/';

                        $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                        $file->move($targetDir, $filename);

                        $items[] = [
                            'type' => $isVideo ? 'video' : 'image',
                            'url' => $publicPrefix . $filename,
                            'caption' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                        ];
                    }
                }
            }
        }

        // Limit to maximum 6 items
        return array_slice($items, 0, 6);
    }
}