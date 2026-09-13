<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\BerandaController;
use App\Http\Controllers\MaktabTuliController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\BeritaController as AdminBeritaController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\Admin\PesanController as AdminPesanController;
use App\Http\Controllers\Admin\AkunController as AdminAkunController;
use App\Http\Controllers\Admin\PengaturanAkunController as AdminPengaturanAkunController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\Admin\SantriController as AdminSantriController;
use App\Http\Controllers\Admin\PendaftaranController as AdminPendaftaranController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\SecurityController;

// Route Halaman Utama & Profil Lembaga Publik
Route::get('/', [BerandaController::class, 'index'])->name('beranda');
Route::redirect('/beranda', '/');
Route::get('/maktabtuli', [MaktabTuliController::class, 'index'])->name('maktabtuli');

// Route Keamanan & Refresh Captcha Anti-Bot
Route::get('/captcha/refresh', [SecurityController::class, 'refreshCaptcha'])->name('captcha.refresh');

// Route Berita Publik
Route::get('/berita', [BeritaController::class, 'index'])->name('berita');
Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.detail');

// Route Kontak Publik
Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');
Route::post('/kontak', [KontakController::class, 'store'])->middleware(['throttle:public-forms'])->name('kontak.store');

Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri');

// Route Pendaftaran Santri Publik
Route::get('/daftar', [SantriController::class, 'create'])->name('daftar');
Route::post('/daftar', [SantriController::class, 'store'])->middleware(['throttle:public-forms'])->name('daftar.store');

// Protected Admin Routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Route Admin Pendaftaran Santri (menggunakan AdminPendaftaranController)
    Route::get('/pendaftaran/export', [AdminPendaftaranController::class, 'export'])->name('admin.pendaftaran.export');
    Route::get('/pendaftaran', [AdminPendaftaranController::class, 'index'])->name('admin.pendaftaran.index');
    Route::post('/pendaftaran', [AdminPendaftaranController::class, 'store'])->name('admin.pendaftaran.store');
    Route::match(['put', 'post'], '/pendaftaran/{id}', [AdminPendaftaranController::class, 'update'])->name('admin.pendaftaran.update');
    Route::patch('/pendaftaran/{id}/status', [AdminPendaftaranController::class, 'updateStatus'])->name('admin.pendaftaran.status');
    Route::post('/pendaftaran/{id}/luluskan', [AdminPendaftaranController::class, 'luluskan'])->name('admin.pendaftaran.luluskan');
    Route::delete('/pendaftaran/{id}', [AdminPendaftaranController::class, 'destroy'])->name('admin.pendaftaran.destroy');
    Route::post('/pendaftaran/bulk', [AdminPendaftaranController::class, 'bulkAction'])->name('admin.pendaftaran.bulk');

    // Route Admin Santri Management (menggunakan AdminSantriController)
    Route::get('/santri/export', [AdminSantriController::class, 'export'])->name('admin.santri.export');
    Route::get('/santri', [AdminSantriController::class, 'index'])->name('admin.santri.index');
    Route::post('/santri', [AdminSantriController::class, 'store'])->name('admin.santri.store');
    Route::match(['put', 'post'], '/santri/{id}', [AdminSantriController::class, 'update'])->name('admin.santri.update');
    Route::delete('/santri/{id}', [AdminSantriController::class, 'destroy'])->name('admin.santri.destroy');
    Route::patch('/santri/{id}/status', [AdminSantriController::class, 'updateStatus'])->name('admin.santri.status');
    Route::post('/santri/bulk', [AdminSantriController::class, 'bulkAction'])->name('admin.santri.bulk');

    // Route Admin Berita (menggunakan AdminBeritaController)
    Route::get('/berita', [AdminBeritaController::class, 'index'])->name('admin.berita.index');
    Route::post('/berita', [AdminBeritaController::class, 'store'])->name('admin.berita.store');
    Route::match(['put', 'post'], '/berita/{id}', [AdminBeritaController::class, 'update'])->name('admin.berita.update');
    Route::delete('/berita/{id}', [AdminBeritaController::class, 'destroy'])->name('admin.berita.destroy');
    Route::patch('/berita/{id}/toggle-status', [AdminBeritaController::class, 'toggleStatus'])->name('admin.berita.toggle-status');
    Route::patch('/berita/{id}/toggle-featured', [AdminBeritaController::class, 'toggleFeatured'])->name('admin.berita.toggle-featured');

    // Route Admin Galeri (menggunakan AdminGaleriController)
    Route::get('/galeri', [AdminGaleriController::class, 'index'])->name('admin.galeri.index');
    Route::post('/galeri', [AdminGaleriController::class, 'store'])->name('admin.galeri.store');
    Route::match(['put', 'post'], '/galeri/{id}', [AdminGaleriController::class, 'update'])->name('admin.galeri.update');
    Route::delete('/galeri/{id}', [AdminGaleriController::class, 'destroy'])->name('admin.galeri.destroy');
    Route::patch('/galeri/{id}/toggle-status', [AdminGaleriController::class, 'toggleStatus'])->name('admin.galeri.toggle-status');
    Route::patch('/galeri/{id}/toggle-featured', [AdminGaleriController::class, 'toggleFeatured'])->name('admin.galeri.toggle-featured');

    // Route Admin Pesan / Monitoring Kontak (menggunakan AdminPesanController)
    Route::get('/pesan', [AdminPesanController::class, 'index'])->name('admin.pesan.index');
    Route::patch('/pesan/{id}/status', [AdminPesanController::class, 'updateStatus'])->name('admin.pesan.status');
    Route::patch('/pesan/{id}/catatan', [AdminPesanController::class, 'updateCatatan'])->name('admin.pesan.catatan');
    Route::delete('/pesan/{id}', [AdminPesanController::class, 'destroy'])->name('admin.pesan.destroy');
    Route::post('/pesan/bulk', [AdminPesanController::class, 'bulkAction'])->name('admin.pesan.bulk');

    // Route Admin Manajemen Akun & Peran (menggunakan AdminAkunController)
    Route::get('/akun', [AdminAkunController::class, 'index'])->name('admin.akun.index');
    Route::post('/akun', [AdminAkunController::class, 'store'])->name('admin.akun.store');
    Route::match(['put', 'post'], '/akun/{id}', [AdminAkunController::class, 'update'])->name('admin.akun.update');
    Route::delete('/akun/{id}', [AdminAkunController::class, 'destroy'])->name('admin.akun.destroy');
    Route::patch('/akun/{id}/role', [AdminAkunController::class, 'updateRole'])->name('admin.akun.role');
    Route::post('/akun/{id}/reset-password', [AdminAkunController::class, 'resetPassword'])->name('admin.akun.reset-password');

    // Route Admin Layanan & Manajemen Konten Halaman Depan (menggunakan AdminServiceController)
    Route::get('/services', [AdminServiceController::class, 'index'])->name('admin.services.index');
    Route::post('/services', [AdminServiceController::class, 'update'])->name('admin.services.update');
    Route::post('/services/reset', [AdminServiceController::class, 'resetDefaults'])->name('admin.services.reset');

    // Route Admin Pengaturan Akun & Profil Pengguna (menggunakan AdminPengaturanAkunController)
    Route::get('/pengaturan-akun', [AdminPengaturanAkunController::class, 'index'])->name('admin.pengaturan-akun');
    Route::post('/pengaturan-akun/profil', [AdminPengaturanAkunController::class, 'updateProfile'])->name('admin.pengaturan-akun.profil');
    Route::post('/pengaturan-akun/password', [AdminPengaturanAkunController::class, 'updatePassword'])->name('admin.pengaturan-akun.password');
    Route::post('/pengaturan-akun/preferensi', [AdminPengaturanAkunController::class, 'updatePreferences'])->name('admin.pengaturan-akun.preferensi');
    Route::delete('/pengaturan-akun/avatar', [AdminPengaturanAkunController::class, 'deleteAvatar'])->name('admin.pengaturan-akun.avatar.delete');
    Route::delete('/pengaturan-akun/session/{id}', [AdminPengaturanAkunController::class, 'destroySession'])->name('admin.pengaturan-akun.session.destroy');

    // Route Notifikasi Admin
    Route::post('/notifications/mark-read/{id?}', [AdminNotificationController::class, 'markRead'])->name('admin.notifications.mark-read');
    Route::post('/notifications/mark-all-read', [AdminNotificationController::class, 'markAllRead'])->name('admin.notifications.mark-all-read');
    Route::post('/notifications/dismiss/{id}', [AdminNotificationController::class, 'dismiss'])->name('admin.notifications.dismiss');
    Route::post('/notifications/clear-all', [AdminNotificationController::class, 'clearAll'])->name('admin.notifications.clear-all');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return redirect()->route('admin.pengaturan-akun');
    })->name('profile.edit');
    Route::get('/admin/profile', function () {
        return redirect()->route('admin.pengaturan-akun');
    });
});

require __DIR__.'/auth.php';