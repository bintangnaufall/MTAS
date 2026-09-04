<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesanController extends Controller
{
    /**
     * Tampilkan halaman monitoring pesan masuk di admin.
     */
    public function index(Request $request)
    {
        $query = Pesan::latest('id');

        // Optional filtering by search query
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('telepon', 'like', "%{$search}%")
                  ->orWhere('subjek', 'like', "%{$search}%")
                  ->orWhere('pesan', 'like', "%{$search}%");
            });
        }

        // Optional filtering by status
        if ($status = $request->input('status')) {
            if (in_array($status, ['unread', 'read', 'replied'])) {
                $query->where('status', $status);
            }
        }

        $pesanList = $query->get()->map(function ($p) {
            return [
                'id'              => $p->id,
                'nama'            => $p->nama,
                'email'           => $p->email,
                'telepon'         => $p->telepon,
                'whatsapp_number' => $p->whatsapp_number,
                'subjek'          => $p->subjek,
                'pesan'           => $p->pesan,
                'status'          => $p->status,
                'catatan_admin'   => $p->catatan_admin ?: '',
                'ip_address'      => $p->ip_address,
                'user_agent'      => $p->user_agent,
                'created_at'      => $p->created_at?->toIso8601String(),
                'formatted_date'  => $p->created_at ? $p->created_at->translatedFormat('d M Y, H:i') : '-',
                'relative_time'   => $p->created_at ? $p->created_at->diffForHumans() : '-',
            ];
        });

        // Compute statistics for overview cards
        $stats = [
            'total'   => Pesan::count(),
            'unread'  => Pesan::where('status', 'unread')->count(),
            'read'    => Pesan::where('status', 'read')->count(),
            'replied' => Pesan::where('status', 'replied')->count(),
            'today'   => Pesan::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('Admin/Pesan', [
            'pesanList' => $pesanList,
            'stats'     => $stats,
            'filters'   => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Perbarui status pesan (unread / read / replied).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:unread,read,replied',
        ]);

        $pesan = Pesan::findOrFail($id);
        $pesan->status = $request->input('status');
        $pesan->save();

        $statusLabel = match ($pesan->status) {
            'read'    => 'Sudah Dibaca',
            'replied' => 'Sudah Dibalas',
            'unread'  => 'Belum Dibaca',
            default   => $pesan->status,
        };

        return redirect()->back()->with('success', "Status pesan diubah menjadi '{$statusLabel}'.");
    }

    /**
     * Simpan catatan internal admin untuk pesan tertentu.
     */
    public function updateCatatan(Request $request, $id)
    {
        $request->validate([
            'catatan_admin' => 'nullable|string|max:2000',
        ]);

        $pesan = Pesan::findOrFail($id);
        $pesan->catatan_admin = $request->input('catatan_admin');
        $pesan->save();

        return redirect()->back()->with('success', 'Catatan admin berhasil disimpan.');
    }

    /**
     * Hapus pesan dari database.
     */
    public function destroy($id)
    {
        $pesan = Pesan::findOrFail($id);
        $pesan->delete();

        return redirect()->back()->with('success', 'Pesan berhasil dihapus dari database.');
    }

    /**
     * Aksi massal (bulk action) untuk banyak pesan sekaligus.
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:mark_read,mark_unread,mark_replied,delete',
            'ids'    => 'required|array|min:1',
            'ids.*'  => 'integer|exists:pesans,id',
        ]);

        $action = $request->input('action');
        $ids = $request->input('ids');
        $count = count($ids);

        switch ($action) {
            case 'mark_read':
                Pesan::whereIn('id', $ids)->update(['status' => 'read']);
                $msg = "{$count} pesan berhasil ditandai sebagai 'Sudah Dibaca'.";
                break;
            case 'mark_unread':
                Pesan::whereIn('id', $ids)->update(['status' => 'unread']);
                $msg = "{$count} pesan berhasil ditandai sebagai 'Belum Dibaca'.";
                break;
            case 'mark_replied':
                Pesan::whereIn('id', $ids)->update(['status' => 'replied']);
                $msg = "{$count} pesan berhasil ditandai sebagai 'Sudah Dibalas'.";
                break;
            case 'delete':
                Pesan::whereIn('id', $ids)->delete();
                $msg = "{$count} pesan berhasil dihapus secara permanen.";
                break;
            default:
                $msg = "Aksi berhasil diproses.";
        }

        return redirect()->back()->with('success', $msg);
    }
}
