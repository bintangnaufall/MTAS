<?php

namespace Tests\Feature\Admin;

use App\Models\Berita;
use App\Models\Galeri;
use App\Models\Pendaftaran;
use App\Models\Pesan;
use App\Models\Santri;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_is_redirected_from_dashboard(): void
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_admin_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'name' => 'Bintang Naufal',
            'email' => 'bintang7735@gmail.com',
            'role' => 'super_admin',
        ]);

        Santri::create([
            'nis' => 'MTAS-2026-001',
            'nama_lengkap' => 'Ahmad Santri',
            'nama_panggilan' => 'Ahmad',
            'program' => 'Maktab Tuli',
            'status' => 'Aktif',
            'jenis_kelamin' => 'Laki-laki',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2015-05-10',
            'nama_ortu' => 'Bpk. Ridwan',
            'no_hp_ortu' => '081234567890',
            'alamat' => 'Jl. Bhakti Arumi No. 10',
        ]);

        Berita::create([
            'judul' => 'Kegiatan Pembelajaran Berita',
            'slug' => 'kegiatan-pembelajaran-berita',
            'status' => 'Published',
            'kategori' => 'Pendidikan',
            'ringkasan' => 'Ringkasan artikel berita',
            'paragraf1' => 'Konten paragraf 1',
        ]);

        Pesan::create([
            'nama' => 'Wali Santri Test',
            'email' => 'wali@gmail.com',
            'subjek' => 'Info Pendaftaran',
            'pesan' => 'Mohon info pendaftaran santri baru',
            'status' => 'unread',
        ]);

        $response = $this->actingAs($user)->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Dashboard')
                ->has('stats')
                ->has('activities')
                ->has('priorityAlerts')
                ->has('weeklyData')
                ->has('accounts')
        );
    }
}
