<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Galeri;
use App\Models\Pesan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PengaturanAkunController extends Controller
{
    /**
     * Tampilkan halaman Pengaturan Akun & Profil Pengguna.
     */
    public function index(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        // 1. Data sesi aktif dari tabel sessions jika ada
        $sessions = [];
        if (Schema::hasTable('sessions')) {
            $rawSessions = DB::table('sessions')
                ->where('user_id', $user->id)
                ->orderBy('last_activity', 'desc')
                ->get();

            $currentSessionId = $request->session()->getId();

            foreach ($rawSessions as $s) {
                $userAgent = $s->user_agent ?? '';
                $parsed = $this->parseUserAgent($userAgent);

                $sessions[] = [
                    'id' => $s->id,
                    'ip_address' => $s->ip_address ?: '127.0.0.1',
                    'is_current' => $s->id === $currentSessionId,
                    'browser' => $parsed['browser'],
                    'os' => $parsed['os'],
                    'device_type' => $parsed['device_type'],
                    'device_icon' => $parsed['device_icon'],
                    'last_active' => date('d M Y, H:i', $s->last_activity),
                    'last_active_human' => \Carbon\Carbon::createFromTimestamp($s->last_activity)->diffForHumans(),
                ];
            }
        }

        // Fallback jika tidak ada data tabel sessions
        if (empty($sessions)) {
            $userAgent = $request->header('User-Agent') ?? '';
            $parsed = $this->parseUserAgent($userAgent);
            $sessions[] = [
                'id' => 'current',
                'ip_address' => $request->ip() ?: '127.0.0.1',
                'is_current' => true,
                'browser' => $parsed['browser'],
                'os' => $parsed['os'],
                'device_type' => $parsed['device_type'],
                'device_icon' => $parsed['device_icon'],
                'last_active' => now()->translatedFormat('d M Y, H:i'),
                'last_active_human' => 'Sedang aktif sekarang',
            ];
        }

        // 2. Statistik kontribusi akun
        $userStats = [
            'total_berita' => Berita::where('penulis', $user->name)->count(),
            'total_galeri' => Galeri::count(),
            'account_age_days' => $user->created_at ? max(1, (int) $user->created_at->diffInDays(now())) : 1,
            'joined_date' => $user->created_at ? $user->created_at->translatedFormat('d F Y') : '17 Agustus 2026',
            'last_login_formatted' => $user->last_login_at ? $user->last_login_at->translatedFormat('d M Y, H:i') : ($user->updated_at ? $user->updated_at->translatedFormat('d M Y, H:i') : 'Hari ini'),
            'has_password' => !empty($user->password),
            'has_google' => !empty($user->google_id),
        ];

        // 3. Hak akses role
        $roleDetails = AkunController::getAvailableRoles();
        $currentRoleInfo = collect($roleDetails)->firstWhere('key', $user->role) ?? [
            'key' => $user->role,
            'name' => $user->role_label,
            'description' => 'Pengguna terdaftar sistem MTAS Bhakti Arumi.',
            'badge' => $user->role_badge,
            'permissions' => ['Akses Dashboard', 'Lihat Informasi Yayasan']
        ];

        // 4. Default preferences
        $defaultPreferences = [
            'notifications' => [
                'pendaftaran_baru' => true,
                'pesan_masuk' => true,
                'laporan_mingguan' => false,
                'keamanan_login' => true,
                'email_digest' => true,
            ],
            'interface' => [
                'theme' => 'light',
                'font_size' => 'normal',
                'sidebar_collapsed' => false,
                'compact_tables' => false,
            ],
        ];

        $userPreferences = array_replace_recursive($defaultPreferences, (array) ($user->preferences ?? []));

        return Inertia::render('Admin/PengaturanAkun', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username ?: '',
                'email' => $user->email,
                'phone' => $user->phone ?: '',
                'jabatan' => $user->jabatan ?: '',
                'bio' => $user->bio ?: '',
                'avatar' => $user->avatar,
                'role' => $user->role,
                'role_label' => $user->role_label,
                'role_badge' => $user->role_badge,
                'initials' => $user->initials,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'google_id' => $user->google_id,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'last_login_ip' => $user->last_login_ip ?: $request->ip(),
                'created_at' => $user->created_at?->toIso8601String(),
            ],
            'userStats' => $userStats,
            'roleInfo' => $currentRoleInfo,
            'sessions' => $sessions,
            'preferences' => $userPreferences,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Perbarui data profil pengguna (Nama, Email, Username, No Telepon, Jabatan, Bio, Avatar).
     */
    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[a-zA-Z0-9_\-\.]+$/',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:500'],
            'avatar_file' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'avatar_data' => ['nullable', 'string'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
            'username.unique' => 'Username ini sudah digunakan oleh akun lain.',
            'username.regex' => 'Username hanya boleh memuat huruf, angka, garis bawah, titik, atau tanda hubung.',
            'avatar_file.image' => 'File foto profil harus berformat gambar.',
            'avatar_file.max' => 'Ukuran foto profil maksimal 3MB.',
        ]);

        // Handle Avatar upload
        $avatarPath = $user->avatar;

        if ($request->hasFile('avatar_file')) {
            $avatarDir = public_path('images/avatars');
            if (!file_exists($avatarDir)) {
                mkdir($avatarDir, 0755, true);
            }

            $file = $request->file('avatar_file');
            $filename = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($avatarDir, $filename);
            $avatarPath = '/images/avatars/' . $filename;
        } elseif ($request->filled('avatar_data') && str_starts_with($request->avatar_data, 'data:image')) {
            $avatarDir = public_path('images/avatars');
            if (!file_exists($avatarDir)) {
                mkdir($avatarDir, 0755, true);
            }

            if (preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/s', $request->avatar_data, $matches)) {
                $ext = match (strtolower($matches[1])) {
                    'jpeg', 'jpg' => 'jpg',
                    'png' => 'png',
                    'webp' => 'webp',
                    default => 'jpg'
                };
                $decoded = base64_decode($matches[2]);
                if ($decoded !== false) {
                    $filename = 'avatar_' . $user->id . '_' . time() . '.' . $ext;
                    file_put_contents($avatarDir . '/' . $filename, $decoded);
                    $avatarPath = '/images/avatars/' . $filename;
                }
            }
        }

        $user->name = $request->name;
        $user->username = $request->username ?: null;
        $user->email = $request->email;
        $user->phone = $request->phone ?: null;
        $user->jabatan = $request->jabatan ?: null;
        $user->bio = $request->bio ?: null;
        $user->avatar = $avatarPath;

        $user->save();

        return redirect()->back()->with('success', 'Informasi profil Anda berhasil diperbarui!');
    }

    /**
     * Perbarui kata sandi akun pengguna.
     */
    public function updatePassword(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $rules = [
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];

        // Jika user memiliki password (bukan Google OAuth murni), harus verifikasi password lama
        if (!empty($user->password)) {
            $rules['current_password'] = ['required', 'current_password'];
        }

        $messages = [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok dengan data sistem.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ];

        $request->validate($rules, $messages);

        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('success', 'Kata sandi akun Anda berhasil diperbarui!');
    }

    /**
     * Perbarui preferensi notifikasi dan antarmuka.
     */
    public function updatePreferences(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $preferences = $request->input('preferences', []);
        
        $currentPrefs = (array) ($user->preferences ?? []);
        $mergedPrefs = array_replace_recursive($currentPrefs, $preferences);

        $user->preferences = $mergedPrefs;
        $user->save();

        return redirect()->back()->with('success', 'Preferensi akun berhasil disimpan!');
    }

    /**
     * Hapus foto profil pengguna dan kembali ke avatar inisial.
     */
    public function deleteAvatar(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->avatar && str_starts_with($user->avatar, '/images/avatars/')) {
            $filePath = public_path(ltrim($user->avatar, '/'));
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        $user->avatar = null;
        $user->save();

        return redirect()->back()->with('success', 'Foto profil berhasil dihapus. Inisial akun kini digunakan.');
    }

    /**
     * Hapus sesi perangkat tertentu.
     */
    public function destroySession(Request $request, $sessionId)
    {
        /** @var User $user */
        $user = $request->user();

        if (Schema::hasTable('sessions')) {
            DB::table('sessions')
                ->where('user_id', $user->id)
                ->where('id', $sessionId)
                ->delete();
        }

        return redirect()->back()->with('success', 'Sesi perangkat berhasil dinonaktifkan.');
    }

    /**
     * Helper parsing User-Agent string.
     */
    private function parseUserAgent(string $userAgent): array
    {
        $browser = 'Web Browser';
        $os = 'Sistem Operasi';
        $deviceType = 'Desktop';
        $deviceIcon = 'computer';

        // Detect OS
        if (preg_match('/windows|win32/i', $userAgent)) {
            $os = 'Windows OS';
            $deviceIcon = 'computer';
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $os = 'macOS';
            $deviceIcon = 'laptop_mac';
        } elseif (preg_match('/android/i', $userAgent)) {
            $os = 'Android OS';
            $deviceType = 'Mobile';
            $deviceIcon = 'smartphone';
        } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            $os = 'iOS Apple';
            $deviceType = 'Mobile';
            $deviceIcon = 'phone_iphone';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $os = 'Linux';
            $deviceIcon = 'terminal';
        }

        // Detect Browser
        if (preg_match('/edg/i', $userAgent)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/chrome|crios/i', $userAgent)) {
            $browser = 'Google Chrome';
        } elseif (preg_match('/firefox|fxios/i', $userAgent)) {
            $browser = 'Mozilla Firefox';
        } elseif (preg_match('/safari/i', $userAgent)) {
            $browser = 'Apple Safari';
        } elseif (preg_match('/opera|opr/i', $userAgent)) {
            $browser = 'Opera';
        }

        return [
            'browser' => $browser,
            'os' => $os,
            'device_type' => $deviceType,
            'device_icon' => $deviceIcon,
        ];
    }
}
