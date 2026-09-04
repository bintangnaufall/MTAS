<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Helper to format dates for public display
     */
    private function formatDisplayDate($dateStr)
    {
        if (empty($dateStr)) {
            return now()->translatedFormat('d M Y');
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
            try {
                return \Carbon\Carbon::parse($dateStr)->translatedFormat('d M Y');
            } catch (\Exception $e) {
                return $dateStr;
            }
        }

        return $dateStr;
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
                // Fallback on error
            }
        }

        // Case 3: Normal URL / relative file path (ensure not blob: or data:)
        if (is_string($rawImage) && !empty($rawImage) && !str_starts_with($rawImage, 'data:') && !str_starts_with($rawImage, 'blob:')) {
            return $rawImage;
        }

        return $currentImage ?: '/images/berita_utama.png';
    }

    /**
     * Helper to compute relative time string ("HARI INI", "2 HARI LALU", etc.)
     */
    private function formatTimeAgo($b)
    {
        if (is_object($b) && method_exists($b, 'getTimeAgoAttribute')) {
            return $b->time_ago;
        }

        $date = null;
        if (!empty($b->created_at)) {
            $date = \Carbon\Carbon::parse($b->created_at);
        } elseif (!empty($b->tanggal)) {
            try {
                $date = \Carbon\Carbon::parse($b->tanggal);
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

    /**
     * Public News List Page
     */
    public function index(Request $request)
    {
        $query = Berita::where('status', 'Published')
            ->orderBy('is_featured', 'desc')
            ->orderBy('id', 'desc');

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('ringkasan', 'like', "%{$search}%")
                  ->orWhere('penulis', 'like', "%{$search}%");
            });
        }

        $allBerita = $query->get()->map(function ($b) {
            return [
                'id' => $b->id,
                'slug' => $b->slug,
                'kategori' => $b->kategori,
                'tagBg' => $b->tag_bg,
                'judul' => $b->judul,
                'deskripsi' => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 120),
                'tanggal' => $this->formatDisplayDate($b->tanggal),
                'image' => $b->image ?: '/images/berita_utama.png',
                'penulis' => $b->penulis,
                'is_featured' => (bool) $b->is_featured,
                'created_at' => $b->created_at?->toIso8601String(),
                'time_ago' => $this->formatTimeAgo($b),
            ];
        });

        // Featured headline article: Prioritize marked is_featured = true, fallback to newest published
        $featured = Berita::where('status', 'Published')
            ->where('is_featured', true)
            ->latest('updated_at')
            ->first() ?? Berita::where('status', 'Published')->latest('id')->first();

        $featuredData = $featured ? [
            'id' => $featured->id,
            'slug' => $featured->slug,
            'kategori' => $featured->kategori,
            'tagBg' => $featured->tag_bg,
            'judul' => $featured->judul,
            'deskripsi' => $featured->ringkasan ?: Str::limit(strip_tags($featured->paragraf1), 180),
            'image' => $featured->image ?: '/images/berita_utama.png',
            'tanggal' => $this->formatDisplayDate($featured->tanggal),
            'penulis' => $featured->penulis,
            'is_featured' => (bool) $featured->is_featured,
            'created_at' => $featured->created_at?->toIso8601String(),
            'time_ago' => $this->formatTimeAgo($featured),
        ] : null;

        // 3 Berita Terbaru untuk Sidebar Aktivitas Terbaru (tampilkan gambar, ringkasan, dan time ago)
        $aktivitasTerbaru = Berita::where('status', 'Published')
            ->latest('id')
            ->take(3)
            ->get()
            ->map(function ($b, $index) {
                return [
                    'id' => $b->id,
                    'slug' => $b->slug,
                    'kategori' => $b->kategori,
                    'tagBg' => $b->tag_bg,
                    'judul' => $b->judul,
                    'title' => $b->judul,
                    'ringkasan' => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 100),
                    'desc' => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 100),
                    'image' => $b->image ?: '/images/berita_utama.png',
                    'time' => $this->formatTimeAgo($b),
                    'time_ago' => $this->formatTimeAgo($b),
                    'tanggal' => $this->formatDisplayDate($b->tanggal),
                    'isActive' => $index === 0,
                ];
            });

        return Inertia::render('Berita', [
            'beritaList' => $allBerita,
            'featuredBerita' => $featuredData,
            'aktivitasTerbaru' => $aktivitasTerbaru,
            'filters' => [
                'kategori' => $request->kategori ?? 'Semua',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Public News Detail Page
     */
    public function show($id)
    {
        if ($id === 'featured') {
            $berita = Berita::where('is_featured', true)->where('status', 'Published')->first() 
                ?? Berita::where('status', 'Published')->firstOrFail();
        } elseif (is_numeric($id)) {
            $berita = Berita::find($id) ?? Berita::where('slug', $id)->firstOrFail();
        } else {
            $berita = Berita::where('slug', $id)->first() ?? Berita::where('id', $id)->firstOrFail();
        }

        // Recent news for the sidebar widget
        $recent = Berita::where('status', 'Published')
            ->where('id', '!=', $berita->id)
            ->latest('id')
            ->take(4)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'slug' => $b->slug,
                    'kategori' => $b->kategori,
                    'tagBg' => $b->tag_bg,
                    'judul' => $b->judul,
                    'ringkasan' => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 80),
                    'tanggal' => $this->formatDisplayDate($b->tanggal),
                    'image' => $b->image ?: '/images/berita_utama.png',
                    'author' => $b->penulis,
                    'time_ago' => $this->formatTimeAgo($b),
                ];
            });

        // Related news with the exact same category
        $terkait = Berita::where('status', 'Published')
            ->where('id', '!=', $berita->id)
            ->where('kategori', $berita->kategori)
            ->latest('id')
            ->take(4)
            ->get();
        
        if ($terkait->isEmpty()) {
            $terkait = Berita::where('status', 'Published')
                ->where('id', '!=', $berita->id)
                ->latest('id')
                ->take(4)
                ->get();
        }

        $terkaitData = $terkait->map(function ($b) {
            return [
                'id' => $b->id,
                'slug' => $b->slug,
                'kategori' => $b->kategori,
                'tagBg' => $b->tag_bg,
                'judul' => $b->judul,
                'ringkasan' => $b->ringkasan ?: Str::limit(strip_tags($b->paragraf1), 80),
                'tanggal' => $this->formatDisplayDate($b->tanggal),
                'image' => $b->image ?: '/images/berita_utama.png',
                'author' => $b->penulis,
                'time_ago' => $this->formatTimeAgo($b),
                'href' => route('berita.detail', ['id' => $b->slug ?: $b->id]),
            ];
        });

        return Inertia::render('DetailBerita', [
            'berita' => [
                'id' => $berita->id,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'tagBg' => $berita->tag_bg,
                'judul' => $berita->judul,
                'tanggal' => $this->formatDisplayDate($berita->tanggal),
                'author' => $berita->penulis,
                'image' => $berita->image ?: '/images/berita_utama.png',
                'blockquote' => $berita->blockquote,
                'paragraf1' => $berita->paragraf1,
                'subheading' => $berita->subheading,
                'paragraf2' => $berita->paragraf2,
                'blueQuote' => $berita->blue_quote,
                'blueQuoteAuthor' => $berita->blue_quote_author,
                'paragraf3' => $berita->paragraf3,
                'is_featured' => (bool) $berita->is_featured,
                'time_ago' => $this->formatTimeAgo($berita),
                'dokumentasi' => $berita->dokumentasi ?: [],
            ],
            'recentBerita' => $recent,
            'beritaTerkait' => $terkaitData,
        ]);
    }

    /**
     * Admin News Management Page
     */
    public function adminIndex()
    {
        $articles = Berita::orderBy('id', 'desc')->get()->map(function ($b) {
            return [
                'id' => $b->id,
                'title' => $b->judul,
                'category' => $b->kategori,
                'image' => $b->image ?: '/images/berita_utama.png',
                'author' => $b->penulis,
                'authorInitials' => $b->author_initials,
                'authorBg' => $b->author_bg,
                'date' => $b->tanggal,
                'status' => $b->status,
                'summary' => $b->ringkasan,
                'blockquote' => $b->blockquote,
                'paragraf1' => $b->paragraf1,
                'subheading' => $b->subheading,
                'paragraf2' => $b->paragraf2,
                'blueQuote' => $b->blue_quote,
                'blueQuoteAuthor' => $b->blue_quote_author,
                'paragraf3' => $b->paragraf3,
            ];
        });

        return Inertia::render('Admin/Berita', [
            'articlesData' => $articles,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'judul' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:50',
            'kategori' => 'nullable|string|max:50',
            'author' => 'nullable|string|max:100',
            'penulis' => 'nullable|string|max:100',
            'date' => 'nullable|string|max:50',
            'tanggal' => 'nullable|string|max:50',
            'status' => 'required|in:Published,Draft',
            'summary' => 'nullable|string',
            'ringkasan' => 'nullable|string',
            'blockquote' => 'nullable|string',
            'paragraf1' => 'nullable|string',
            'subheading' => 'nullable|string|max:255',
            'paragraf2' => 'nullable|string',
            'blue_quote' => 'nullable|string',
            'blueQuote' => 'nullable|string',
            'blue_quote_author' => 'nullable|string|max:150',
            'blueQuoteAuthor' => 'nullable|string|max:150',
            'paragraf3' => 'nullable|string',
            'image' => 'nullable',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        $judul = $request->input('judul') ?? $request->input('title');
        $imagePath = $this->handleImageUpload($request, '/images/berita_utama.png');

        $berita = Berita::create([
            'judul' => $judul,
            'kategori' => $request->input('kategori') ?? $request->input('category', 'PENDIDIKAN'),
            'penulis' => $request->input('penulis') ?? $request->input('author', auth()->user()?->name ?? 'Admin Yayasan'),
            'tanggal' => $request->input('tanggal') ?? $request->input('date', date('Y-m-d')),
            'status' => $request->input('status', 'Published'),
            'ringkasan' => $request->input('ringkasan') ?? $request->input('summary'),
            'blockquote' => $request->input('blockquote'),
            'paragraf1' => $request->input('paragraf1') ?: ($request->input('ringkasan') ?? $request->input('summary')),
            'subheading' => $request->input('subheading'),
            'paragraf2' => $request->input('paragraf2'),
            'blue_quote' => $request->input('blue_quote') ?? $request->input('blueQuote'),
            'blue_quote_author' => $request->input('blue_quote_author') ?? $request->input('blueQuoteAuthor'),
            'paragraf3' => $request->input('paragraf3'),
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil disimpan dan diterbitkan!');
    }

    /**
     * Update an existing article
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'judul' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:50',
            'kategori' => 'nullable|string|max:50',
            'author' => 'nullable|string|max:100',
            'penulis' => 'nullable|string|max:100',
            'date' => 'nullable|string|max:50',
            'tanggal' => 'nullable|string|max:50',
            'status' => 'required|in:Published,Draft',
            'summary' => 'nullable|string',
            'ringkasan' => 'nullable|string',
            'blockquote' => 'nullable|string',
            'paragraf1' => 'nullable|string',
            'subheading' => 'nullable|string|max:255',
            'paragraf2' => 'nullable|string',
            'blue_quote' => 'nullable|string',
            'blueQuote' => 'nullable|string',
            'blue_quote_author' => 'nullable|string|max:150',
            'blueQuoteAuthor' => 'nullable|string|max:150',
            'paragraf3' => 'nullable|string',
            'image' => 'nullable',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        $imagePath = $this->handleImageUpload($request, $berita->image);
        $judul = $request->input('judul') ?? $request->input('title', $berita->judul);

        $berita->update([
            'judul' => $judul,
            'kategori' => $request->input('kategori') ?? $request->input('category', $berita->kategori),
            'penulis' => $request->input('penulis') ?? $request->input('author', $berita->penulis),
            'tanggal' => $request->input('tanggal') ?? $request->input('date', $berita->tanggal),
            'status' => $request->input('status', $berita->status),
            'ringkasan' => $request->input('ringkasan') ?? $request->input('summary', $berita->ringkasan),
            'blockquote' => $request->input('blockquote', $berita->blockquote),
            'paragraf1' => $request->input('paragraf1', $berita->paragraf1),
            'subheading' => $request->input('subheading', $berita->subheading),
            'paragraf2' => $request->input('paragraf2', $berita->paragraf2),
            'blue_quote' => $request->input('blue_quote') ?? $request->input('blueQuote', $berita->blue_quote),
            'blue_quote_author' => $request->input('blue_quote_author') ?? $request->input('blueQuoteAuthor', $berita->blue_quote_author),
            'paragraf3' => $request->input('paragraf3', $berita->paragraf3),
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui!');
    }

    /**
     * Delete an article
     */
    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);
        $berita->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus!');
    }

    /**
     * Toggle Published / Draft status
     */
    public function toggleStatus($id)
    {
        $berita = Berita::findOrFail($id);
        $berita->status = $berita->status === 'Published' ? 'Draft' : 'Published';
        $berita->save();

        return redirect()->back()->with('success', 'Status berita berhasil diperbarui!');
    }
}
