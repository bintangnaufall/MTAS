<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth provider with account chooser prompt.
     */
    public function redirectToGoogle(Request $request): RedirectResponse
    {
        $action = $request->query('action');
        if ($action === 'bind' || Auth::check()) {
            if (!Auth::check()) {
                return redirect()->route('admin.login')->withErrors([
                    'google' => 'Silakan login terlebih dahulu sebelum menghubungkan akun Google.',
                ])->with('error', 'Silakan login terlebih dahulu.');
            }

            session([
                'google_oauth_action' => 'bind',
                'google_bind_user_id' => Auth::id(),
            ]);
        } else {
            session([
                'google_oauth_action' => 'login',
            ]);
        }

        try {
            $clientId = config('services.google.client_id');
            $clientSecret = config('services.google.client_secret');

            // Cek apakah kredensial Google di .env masih placeholder atau kosong
            if (empty($clientId) || empty($clientSecret) || Str::contains($clientId, 'your-google-client-id')) {
                $isBinding = session('google_oauth_action') === 'bind';
                $redirectUrl = $isBinding ? route('admin.pengaturan-akun') : route('admin.login');

                return redirect($redirectUrl)->withErrors([
                    'google' => 'Kredensial Google OAuth belum dikonfigurasi pada file .env (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET). Silakan isi Client ID dan Client Secret dari Google Cloud Console.',
                ])->with('error', 'Google OAuth belum dikonfigurasi di file .env.');
            }

            // Arahkan ke Google dengan parameter prompt=select_account agar pengguna selalu dapat memilih akun Google mana yang ingin digunakan
            return Socialite::driver('google')
                ->with(['prompt' => 'select_account'])
                ->redirect();
        } catch (Exception $e) {
            Log::error('Google OAuth Redirect Error: ' . $e->getMessage());
            $isBinding = session('google_oauth_action') === 'bind';
            $redirectUrl = $isBinding ? route('admin.pengaturan-akun') : route('admin.login');

            return redirect($redirectUrl)->withErrors([
                'google' => 'Gagal membuka otentikasi Google: ' . $e->getMessage(),
            ])->with('error', 'Gagal membuka Google OAuth.');
        }
    }

    /**
     * Handle callback from Google OAuth.
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        $action = session('google_oauth_action', 'login');
        $bindUserId = session('google_bind_user_id');

        // Jika otentikasi dibatalkan oleh pengguna di Google
        if ($request->has('error')) {
            $isBinding = $action === 'bind' || Auth::check();
            $redirectTarget = $isBinding ? route('admin.pengaturan-akun') : route('admin.login');
            session()->forget(['google_oauth_action', 'google_bind_user_id']);

            return redirect($redirectTarget)->withErrors([
                'google' => 'Otentikasi Google dibatalkan oleh pengguna.',
            ])->with('error', 'Otentikasi Google dibatalkan.');
        }

        try {
            // Ambil data user dari Google Socialite (dengan fallback stateless jika state session gagal)
            try {
                $googleUser = Socialite::driver('google')->user();
            } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
                $googleUser = Socialite::driver('google')->stateless()->user();
            }

            $googleId = (string) $googleUser->getId();
            $googleEmail = $googleUser->getEmail();
            $googleName = $googleUser->getName();
            $googleAvatar = $googleUser->getAvatar();

            // ── KASUS 1: BINDING / MENGHUBUNGKAN KE AKUN YANG SEDANG AKTIF ──
            if ($action === 'bind' || Auth::check()) {
                $currentUser = Auth::user() ?? User::find($bindUserId);

                if (!$currentUser) {
                    session()->forget(['google_oauth_action', 'google_bind_user_id']);
                    return redirect()->route('admin.login')->withErrors([
                        'email' => 'Sesi login telah berakhir. Silakan login kembali sebelum menghubungkan akun Google.',
                    ]);
                }

                // Cek apakah akun Google ini sudah pernah di-bind ke user lain (google_id)
                $alreadyLinked = User::where('google_id', $googleId)
                    ->where('id', '!=', $currentUser->id)
                    ->first();

                if ($alreadyLinked) {
                    session()->forget(['google_oauth_action', 'google_bind_user_id']);
                    return redirect()->route('admin.pengaturan-akun')->withErrors([
                        'google' => "Akun Google ({$googleEmail}) sudah terhubung ke pengguna lain ({$alreadyLinked->name}). Silakan pilih akun Google yang berbeda.",
                    ])->with('error', "Akun Google ({$googleEmail}) sudah dipakai pengguna lain.");
                }

                // Cek apakah alamat email Google ini sudah digunakan oleh user lain di database
                $emailAlreadyTaken = User::where('email', $googleEmail)
                    ->where('id', '!=', $currentUser->id)
                    ->first();

                if ($emailAlreadyTaken) {
                    session()->forget(['google_oauth_action', 'google_bind_user_id']);
                    return redirect()->route('admin.pengaturan-akun')->withErrors([
                        'google' => "Alamat email ({$googleEmail}) dari akun Google ini sudah terdaftar pada pengguna lain ({$emailAlreadyTaken->name}). Silakan gunakan akun Google yang berbeda.",
                    ])->with('error', "Email ({$googleEmail}) sudah terdaftar pada pengguna lain.");
                }

                $oldEmail = $currentUser->email;

                // Simpan tautan Google ID dan email Google di preferensi user
                $prefs = (array) ($currentUser->preferences ?? []);
                $prefs['google_email'] = $googleEmail;

                // Tentukan avatar: gunakan avatar baru Google jika user belum upload foto kustom
                $avatar = $currentUser->avatar;
                if (empty($avatar) || !str_starts_with($avatar, '/images/avatars/')) {
                    $avatar = $googleAvatar;
                }

                // Perbarui email akun di database ke email akun Google yang baru di-bind
                $updateData = [
                    'email' => $googleEmail,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'preferences' => $prefs,
                ];

                if (empty($currentUser->email_verified_at)) {
                    $updateData['email_verified_at'] = now();
                }

                $currentUser->update($updateData);

                session()->forget(['google_oauth_action', 'google_bind_user_id']);

                Log::info("Google Auth Bind: User ID {$currentUser->id} berhasil memperbarui email dari '{$oldEmail}' menjadi '{$googleEmail}' (Google ID: {$googleId})");

                return redirect()->route('admin.pengaturan-akun')->with('success', "Alhamdulillah! Akun Google ({$googleEmail}) berhasil dihubungkan. Email akun login Anda kini telah diperbarui ke {$googleEmail}.");
            }

            // ── KASUS 2: LOGIN MENGGUNAKAN GOOGLE ──
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $googleEmail)
                ->first();

            if ($user) {
                $prefs = (array) ($user->preferences ?? []);
                $prefs['google_email'] = $googleEmail;

                $updateData = [
                    'google_id' => $googleId,
                    'last_login_at' => now(),
                    'last_login_ip' => $request->ip(),
                    'preferences' => $prefs,
                ];

                // Jika user login dengan email Google yang cocok, sinkronkan email di database jika berbeda dan tidak bentrok
                if ($user->email !== $googleEmail) {
                    $conflict = User::where('email', $googleEmail)->where('id', '!=', $user->id)->exists();
                    if (!$conflict) {
                        $updateData['email'] = $googleEmail;
                    }
                }

                if (empty($user->avatar) || !str_starts_with($user->avatar, '/images/avatars/')) {
                    $updateData['avatar'] = $googleAvatar;
                }

                $user->update($updateData);

                Auth::login($user, true);
                $request->session()->regenerate();
                session()->forget(['google_oauth_action', 'google_bind_user_id']);

                Log::info("Google Auth Login: Pengguna {$user->email} berhasil masuk via Google OAuth dari IP: {$request->ip()}");

                return redirect()->intended(route('admin.dashboard'))->with('success', "Selamat datang, {$user->name}! Berhasil masuk menggunakan Google ({$googleEmail}).");
            }

            // Jika akun Google tidak cocok dengan pengguna mana pun yang terdaftar di database MTAS
            session()->forget(['google_oauth_action', 'google_bind_user_id']);
            Log::warning("Google Auth Unauthorized: Akun Google {$googleEmail} (ID: {$googleId}) mencoba login namun tidak terdaftar di sistem.");

            return redirect()->route('admin.login')->withErrors([
                'google' => "Akun Google ({$googleEmail}) tidak terdaftar dalam sistem MTAS. Silakan hubungi Super Admin untuk pendaftaran akun.",
            ])->with('error', "Akun Google ({$googleEmail}) belum terdaftar di sistem MTAS.");
        } catch (Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());

            $isBinding = $action === 'bind' || Auth::check();
            $redirectTarget = $isBinding ? route('admin.pengaturan-akun') : route('admin.login');

            return redirect($redirectTarget)->withErrors([
                'google' => 'Otentikasi Google gagal: ' . $e->getMessage(),
            ])->with('error', 'Otentikasi Google gagal atau dibatalkan.');
        }
    }

    /**
     * Putuskan tautan akun Google dari profil pengguna.
     */
    public function disconnectGoogle(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('admin.login');
        }

        // Validasi keamanan: Pastikan pengguna memiliki password lokal sebelum memutuskan Google
        if (empty($user->password)) {
            return redirect()->back()->withErrors([
                'google' => 'Anda belum mengatur kata sandi lokal untuk akun ini. Silakan buat kata sandi di tab Keamanan terlebih dahulu sebelum memutuskan tautan Google agar Anda tidak kehilangan akses masuk.',
            ])->with('error', 'Gagal: Buat kata sandi akun terlebih dahulu.');
        }

        $prefs = (array) ($user->preferences ?? []);
        unset($prefs['google_email']);

        $user->update([
            'google_id' => null,
            'preferences' => $prefs,
        ]);

        Log::info("Google Auth Disconnect: User {$user->email} memutuskan tautan akun Google.");

        return redirect()->back()->with('success', 'Tautan akun Google berhasil diputuskan. Akun Anda kini menggunakan autentikasi kata sandi lokal.');
    }
}
