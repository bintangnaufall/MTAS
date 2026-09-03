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
            // 1. Pending Registrations
            $pendingPendaftarans = \App\Models\Pendaftaran::where('status', 'Pending')
                ->latest()
                ->take(5)
                ->get();

            foreach ($pendingPendaftarans as $p) {
                $notifs[] = [
                    'id' => 'pendaftaran-' . $p->id,
                    'type' => 'warning',
                    'icon' => 'person_add',
                    'title' => 'Pendaftaran Santri Baru',
                    'desc' => $p->nama_lengkap . ' mendaftar program ' . ($p->jenis_maktab ?: 'Maktab Tuli') . ' (' . ($p->no_pendaftaran ?: 'REG-' . $p->id) . '). Menunggu verifikasi.',
                    'time' => $p->created_at ? $p->created_at->diffForHumans() : 'Baru saja',
                    'url' => '/admin/pendaftaran',
                    'unread' => true,
                    'category' => 'Pendaftaran'
                ];
            }

            // 2. New Contact Messages
            $newPesans = \App\Models\Pesan::where('status', 'Baru')
                ->orWhereNull('status')
                ->latest()
                ->take(5)
                ->get();

            foreach ($newPesans as $msg) {
                $notifs[] = [
                    'id' => 'pesan-' . $msg->id,
                    'type' => 'info',
                    'icon' => 'mark_chat_unread',
                    'title' => 'Pesan Masuk: ' . $msg->nama,
                    'desc' => \Illuminate\Support\Str::limit(($msg->subjek ? $msg->subjek . ' - ' : '') . $msg->pesan, 80),
                    'time' => $msg->created_at ? $msg->created_at->diffForHumans() : 'Baru saja',
                    'url' => '/admin/pesan',
                    'unread' => true,
                    'category' => 'Pesan Kontak'
                ];
            }

            // 3. Draft News / Articles
            $draftBeritas = \App\Models\Berita::where('status', 'Draft')
                ->latest()
                ->take(3)
                ->get();

            foreach ($draftBeritas as $b) {
                $notifs[] = [
                    'id' => 'berita-' . $b->id,
                    'type' => 'secondary',
                    'icon' => 'newspaper',
                    'title' => 'Draft Berita Belum Tayang',
                    'desc' => '"' . \Illuminate\Support\Str::limit($b->judul, 45) . '" masih berstatus draft.',
                    'time' => $b->updated_at ? $b->updated_at->diffForHumans() : 'Baru saja',
                    'url' => '/admin/berita',
                    'unread' => false,
                    'category' => 'Berita'
                ];
            }
        } catch (\Throwable $e) {
            // Silently fail if database is not ready
        }

        return $notifs;
    }
}
