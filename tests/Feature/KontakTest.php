<?php

namespace Tests\Feature;

use App\Models\Pesan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontakTest extends TestCase
{
    use RefreshDatabase;

    public function test_kontak_screen_can_be_rendered(): void
    {
        $response = $this->get('/kontak');

        $response->assertStatus(200);
    }

    public function test_user_can_submit_message_without_subjek(): void
    {
        $response = $this->post('/kontak', [
            'nama'    => 'Ahmad Hidayat',
            'email'   => 'ahmad@example.com',
            'telepon' => '081234567890',
            'pesan'   => 'Halo, saya ingin bertanya seputar kegiatan belajar di yayasan.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('pesans', [
            'nama'   => 'Ahmad Hidayat',
            'email'  => 'ahmad@example.com',
            'subjek' => 'Pesan Umum',
            'pesan'  => 'Halo, saya ingin bertanya seputar kegiatan belajar di yayasan.',
        ]);
    }

    public function test_user_can_submit_jbi_inquiry(): void
    {
        $response = $this->post('/kontak', [
            'nama'    => 'Siti Rahma',
            'email'   => 'siti@example.com',
            'telepon' => '08987654321',
            'subjek'  => 'Permohonan Jasa Juru Bahasa Isyarat (JBI)',
            'pesan'   => 'Halo, saya butuh JBI untuk acara seminar.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('pesans', [
            'nama'   => 'Siti Rahma',
            'subjek' => 'Permohonan Jasa Juru Bahasa Isyarat (JBI)',
        ]);
    }
}
