<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AkunController extends Controller
{
    /**
     * Daftar peran (role) yang tersedia di sistem beserta deskripsi & hak aksesnya.
     */
    public static function getAvailableRoles(): array
    {
        return [
            [
                'key' => 'super_admin',
                'name' => 'Super Admin',
                'description' => 'Akses penuh ke seluruh modul sistem, konfigurasi, audit log, dan manajemen peran akun.',
                'badge' => [
                    'bg' => 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    'color' => '#7e22ce',
                    'icon' => 'shield_person',
                ],
                'permissions' => ['Akses Penuh', 'Kelola Akun & Peran', 'Kelola Berita', 'Kelola Galeri', 'Kelola Pesan', 'Akses Pengaturan']
            ],
            [
                'key' => 'admin',
                'name' => 'Administrator',
                'description' => 'Mengelola operasional harian: berita, galeri, pesan masuk, dan monitoring santri.',
                'badge' => [
                    'bg' => 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    'color' => '#047857',
                    'icon' => 'admin_panel_settings',
                ],
                'permissions' => ['Kelola Berita', 'Kelola Galeri', 'Kelola Pesan', 'Monitoring Santri']
            ],
            [
                'key' => 'editor',
                'name' => 'Editor Konten',
                'description' => 'Membuat, menyunting, dan menerbitkan konten publikasi berita dan dokumentasi galeri.',
                'badge' => [
                    'bg' => 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    'color' => '#1d4ed8',
                    'icon' => 'edit_note',
                ],
                'permissions' => ['Buat & Edit Berita', 'Upload & Edit Galeri', 'Lihat Pesan']
            ],
            [
                'key' => 'staff',
                'name' => 'Staff Pengurus',
                'description' => 'Melihat data informasi yayasan, meninjau pesan masuk, dan membuat draft konten.',
                'badge' => [
                    'bg' => 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    'color' => '#b45309',
                    'icon' => 'badge',
                ],
                'permissions' => ['Lihat Pesan Masuk', 'Draft Berita', 'Lihat Galeri']
            ],
        ];
    }

    /**
     * Tampilkan halaman manajemen akun admin.
     */
    public function index(Request $request)
    {
        $query = User::latest('id');

        // Filter search query
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role = $request->input('role')) {
            if (in_array($role, ['super_admin', 'admin', 'editor', 'staff'])) {
                $query->where('role', $role);
            }
        }

        $users = $query->get()->map(function ($u) {
            $initials = collect(explode(' ', $u->name))
                ->map(fn($segment) => mb_substr($segment, 0, 1))
                ->take(2)
                ->implode('');

            return [
                'id' => $u->id,
                'name' => $u->name,
                'username' => $u->username ?: '-',
                'email' => $u->email,
                'role' => $u->role ?: 'staff',
                'role_label' => $u->role_label,
                'role_badge' => $u->role_badge,
                'initials' => strtoupper($initials ?: 'US'),
                'avatar' => $u->avatar,
                'email_verified_at' => $u->email_verified_at?->toIso8601String(),
                'created_at' => $u->created_at?->toIso8601String(),
                'formatted_created' => $u->created_at ? $u->created_at->translatedFormat('d M Y') : '-',
                'is_current_user' => auth()->id() === $u->id,
            ];
        });

        // Compute role statistics
        $stats = [
            'total' => User::count(),
            'super_admin' => User::where('role', 'super_admin')->count(),
            'admin' => User::where('role', 'admin')->count(),
            'editor' => User::where('role', 'editor')->count(),
            'staff' => User::where('role', 'staff')->count(),
        ];

        return Inertia::render('Admin/Akun', [
            'users' => $users,
            'stats' => $stats,
            'rolesList' => self::getAvailableRoles(),
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', 'all'),
            ],
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Simpan akun pengguna baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'string', Rule::in(['super_admin', 'admin', 'editor', 'staff'])],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar di sistem.',
            'username.unique' => 'Username ini sudah digunakan.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'role.required' => 'Peran akun wajib dipilih.',
            'role.in' => 'Peran akun yang dipilih tidak valid.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username ?: null,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', "Akun '{$user->name}' dengan peran '{$user->role_label}' berhasil dibuat.");
    }

    /**
     * Perbarui data akun pengguna.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['super_admin', 'admin', 'editor', 'staff'])],
            'password' => ['nullable', 'string', 'min:6'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah digunakan oleh pengguna lain.',
            'username.unique' => 'Username ini sudah digunakan.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'role.required' => 'Peran akun wajib dipilih.',
        ]);

        // Guard: Prevent reducing the only super_admin to another role
        if ($user->role === 'super_admin' && $request->role !== 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->with('error', 'Tidak dapat mengubah peran satu-satunya Super Admin dalam sistem.');
            }
        }

        $user->name = $request->name;
        $user->username = $request->username ?: null;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->back()->with('success', "Data akun '{$user->name}' berhasil diperbarui.");
    }

    /**
     * Perbarui peran (role) pengguna secara cepat.
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => ['required', 'string', Rule::in(['super_admin', 'admin', 'editor', 'staff'])],
        ]);

        $user = User::findOrFail($id);

        if ($user->role === 'super_admin' && $request->role !== 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->with('error', 'Tidak dapat mengubah peran satu-satunya Super Admin.');
            }
        }

        $user->role = $request->role;
        $user->save();

        return redirect()->back()->with('success', "Peran '{$user->name}' berhasil diubah menjadi '{$user->role_label}'.");
    }

    /**
     * Reset kata sandi pengguna oleh Super Admin / Admin.
     */
    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:6'],
        ], [
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('success', "Kata sandi untuk '{$user->name}' berhasil diperbarui.");
    }

    /**
     * Hapus akun pengguna dari sistem.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Guard 1: Cannot delete self
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
        }

        // Guard 2: Cannot delete the only super_admin
        if ($user->role === 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->with('error', 'Tidak dapat menghapus satu-satunya Super Admin dalam sistem.');
            }
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Akun '{$userName}' berhasil dihapus dari sistem.");
    }
}
