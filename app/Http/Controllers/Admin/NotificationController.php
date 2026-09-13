<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Pesan;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark a specific notification as read.
     */
    public function markRead(Request $request, $id = null)
    {
        $targetId = $id ?: $request->input('id');

        if ($targetId) {
            if (str_starts_with($targetId, 'pesan-')) {
                $pesanId = (int) str_replace('pesan-', '', $targetId);
                Pesan::where('id', $pesanId)->update(['status' => 'read']);
            }

            $readNotifs = session('read_admin_notifs', []);
            if (!in_array($targetId, $readNotifs)) {
                $readNotifs[] = $targetId;
                session(['read_admin_notifs' => $readNotifs]);
            }
        }

        return redirect()->back()->with('success', 'Notifikasi berhasil ditandai sebagai dibaca.');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(Request $request)
    {
        // 1. Mark all unread contact messages as 'read' in database
        Pesan::where(function ($query) {
            $query->whereIn('status', ['unread', 'Baru'])
                  ->orWhereNull('status');
        })->update(['status' => 'read']);

        // 2. Add all current pending registration notification IDs to read list in session
        $pendingPendaftarans = Pendaftaran::whereIn('status', ['Menunggu Verifikasi', 'Pending'])->pluck('id');
        $readIds = session('read_admin_notifs', []);

        foreach ($pendingPendaftarans as $pId) {
            $readIds[] = 'pendaftaran-' . $pId;
        }

        session(['read_admin_notifs' => array_unique($readIds)]);

        return redirect()->back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    /**
     * Dismiss a single notification so it won't appear anymore.
     */
    public function dismiss(Request $request, $id)
    {
        if (str_starts_with($id, 'pesan-')) {
            $pesanId = (int) str_replace('pesan-', '', $id);
            Pesan::where('id', $pesanId)->update(['status' => 'read']);
        }

        $dismissedIds = session('dismissed_admin_notifs', []);
        if (!in_array($id, $dismissedIds)) {
            $dismissedIds[] = $id;
            session(['dismissed_admin_notifs' => $dismissedIds]);
        }

        return redirect()->back()->with('success', 'Notifikasi berhasil dibersihkan dari daftar.');
    }

    /**
     * Clear / dismiss all notifications so they are completely cleaned from display.
     */
    public function clearAll(Request $request)
    {
        // 1. Mark unread messages as read
        Pesan::where(function ($query) {
            $query->whereIn('status', ['unread', 'Baru'])
                  ->orWhereNull('status');
        })->update(['status' => 'read']);

        // 2. Gather all current pending registration and message IDs
        $pendingPendaftarans = Pendaftaran::whereIn('status', ['Menunggu Verifikasi', 'Pending'])->pluck('id');
        $pesanIds = Pesan::pluck('id');

        $dismissedIds = session('dismissed_admin_notifs', []);

        foreach ($pendingPendaftarans as $pId) {
            $dismissedIds[] = 'pendaftaran-' . $pId;
        }
        foreach ($pesanIds as $mId) {
            $dismissedIds[] = 'pesan-' . $mId;
        }

        session([
            'dismissed_admin_notifs' => array_unique($dismissedIds),
            'read_admin_notifs' => array_unique(array_merge(session('read_admin_notifs', []), $dismissedIds)),
        ]);

        return redirect()->back()->with('success', 'Semua notifikasi telah dibersihkan.');
    }
}
