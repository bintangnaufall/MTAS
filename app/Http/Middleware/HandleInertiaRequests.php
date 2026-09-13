<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $adminNotifs = [];
        if ($request->user()) {
            $adminNotifs = $this->getAdminNotifications();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'siteSettings' => \App\Models\SiteSetting::getAllGrouped(),
            'adminNotifications' => $adminNotifs,
        ];
    }

    /**
     * Get real-time admin notifications from the database
     */
    protected function getAdminNotifications(): array
    {
        $notifs = [];

        try {
            $dismissedIds = session('dismissed_admin_notifs', []);
            $readIds = session('read_admin_notifs', []);

            // 1. Pending Registrations
            $pendingPendaftarans = \App\Models\Pendaftaran::whereIn('status', ['Menunggu Verifikasi', 'Pending'])
                ->latest()
                ->take(10)
                ->get();

            foreach ($pendingPendaftarans as $p) {
                $notifId = 'pendaftaran-' . $p->id;
                if (in_array($notifId, $dismissedIds)) {
                    continue;
                }

                $notifs[] = [
                    'id' => $notifId,
                    'type' => 'warning',
                    'icon' => 'person_add',
                    'title' => 'Pendaftaran Santri Baru',
                    'desc' => $p->nama_lengkap . ' mendaftar program ' . ($p->jenis_maktab ?: 'Maktab Tuli') . ' (' . ($p->no_pendaftaran ?: 'REG-' . $p->id) . '). Menunggu verifikasi.',
                    'time' => $p->created_at ? $p->created_at->diffForHumans() : 'Baru saja',
                    'url' => '/admin/pendaftaran',
                    'unread' => !in_array($notifId, $readIds),
                    'category' => 'Pendaftaran'
                ];
            }

            // 2. New / Unread Contact Messages
            $newPesans = \App\Models\Pesan::where(function ($query) {
                    $query->whereIn('status', ['unread', 'Baru'])
                          ->orWhereNull('status');
                })
                ->latest()
                ->take(10)
                ->get();

            foreach ($newPesans as $msg) {
                $notifId = 'pesan-' . $msg->id;
                if (in_array($notifId, $dismissedIds)) {
                    continue;
                }

                $notifs[] = [
                    'id' => $notifId,
                    'type' => 'info',
                    'icon' => 'mark_chat_unread',
                    'title' => 'Pesan Masuk: ' . $msg->nama,
                    'desc' => \Illuminate\Support\Str::limit(($msg->subjek ? $msg->subjek . ' - ' : '') . $msg->pesan, 80),
                    'time' => $msg->created_at ? $msg->created_at->diffForHumans() : 'Baru saja',
                    'url' => '/admin/pesan',
                    'unread' => !in_array($notifId, $readIds),
                    'category' => 'Pesan Kontak'
                ];
            }
        } catch (\Throwable $e) {
            // Silently fail if database is not ready
        }

        return $notifs;
    }
}
