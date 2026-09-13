<?php

namespace Tests\Feature;

use App\Models\Pendaftaran;
use App\Models\Pesan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityAntiSpamTest extends TestCase
{
    use RefreshDatabase;

    public function test_captcha_refresh_endpoint_returns_json_question(): void
    {
        $response = $this->getJson('/captcha/refresh');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'question',
        ]);
        $this->assertTrue($response->json('success'));
        $this->assertNotEmpty($response->json('question'));
    }

    public function test_kontak_submission_fails_without_captcha(): void
    {
        $response = $this->post('/kontak', [
            'nama'            => 'Budi Santoso',
            'email'           => 'budi@example.com',
            'telepon'         => '08123456789',
            'pesan'           => 'Testing message without captcha',
            'captcha_answer'  => '',
            'form_hp_website' => '',
        ]);

        $response->assertSessionHasErrors('captcha_answer');
        $this->assertDatabaseMissing('pesans', [
            'nama' => 'Budi Santoso',
        ]);
    }

    public function test_kontak_submission_fails_with_wrong_captcha(): void
    {
        // Put a specific answer in session
        session(['security_captcha_answer' => '15']);

        $response = $this->post('/kontak', [
            'nama'            => 'Budi Santoso',
            'email'           => 'budi@example.com',
            'telepon'         => '08123456789',
            'pesan'           => 'Testing message with wrong captcha',
            'captcha_answer'  => '99',
            'form_hp_website' => '',
        ]);

        $response->assertSessionHasErrors('captcha_answer');
        $this->assertDatabaseMissing('pesans', [
            'nama' => 'Budi Santoso',
        ]);
    }

    public function test_kontak_submission_blocked_when_honeypot_filled_by_bot(): void
    {
        $response = $this->post('/kontak', [
            'nama'            => 'Spam Bot 3000',
            'email'           => 'bot@spamdomain.com',
            'telepon'         => '08123456789',
            'pesan'           => 'Buy cheap crypto now at our website!',
            'captcha_answer'  => 'bypass',
            'form_hp_website' => 'http://spam-payload.com', // Bot filled this!
        ]);

        $response->assertSessionHasErrors('captcha_answer');
        $this->assertDatabaseMissing('pesans', [
            'nama' => 'Spam Bot 3000',
        ]);
    }

    public function test_sql_injection_payload_is_rejected_or_safely_handled(): void
    {
        // SQL injection payload in nama
        $response = $this->post('/kontak', [
            'nama'            => "Admin' OR '1'='1; DROP TABLE pesans; --",
            'email'           => 'hacker@example.com',
            'telepon'         => '08123456789',
            'pesan'           => 'Testing injection payload',
            'captcha_answer'  => 'bypass',
            'form_hp_website' => '',
        ]);

        // Strict name regex should reject semicolons and special symbols
        $response->assertSessionHasErrors('nama');
        // pesans table must still exist and be intact
        $this->assertEquals(0, Pesan::count());
    }

    public function test_xss_script_payload_is_stripped_and_sanitized(): void
    {
        $response = $this->post('/kontak', [
            'nama'            => 'Santri Peduli',
            'email'           => 'santri@example.com',
            'telepon'         => '08123456789',
            'pesan'           => '<script>alert("XSS Vulnerability")</script>Halo pengurus yayasan, ini pesan asli.',
            'captcha_answer'  => 'bypass',
            'form_hp_website' => '',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('pesans', [
            'nama' => 'Santri Peduli',
            'pesan' => 'Halo pengurus yayasan, ini pesan asli.',
        ]);
        $this->assertDatabaseMissing('pesans', [
            'pesan' => '<script>alert("XSS Vulnerability")</script>Halo pengurus yayasan, ini pesan asli.',
        ]);
    }

    public function test_pendaftaran_santri_blocks_malicious_file_extensions(): void
    {
        Storage::fake('public');

        // Attempting to upload a PHP shell script disguised as a file
        $fakePhpShell = UploadedFile::fake()->create('shell.php', 100, 'application/x-php');

        $response = $this->post('/daftar', [
            'nama_lengkap'        => 'Muhammad Fadli',
            'jenis_maktab'        => 'Maktab Tuli As-Sami',
            'jenis_kelamin'       => 'Laki-laki',
            'nama_ortu'           => 'Bapak Hendra',
            'no_hp_ortu'          => '081234567890',
            'foto_santri'         => $fakePhpShell,
            'captcha_answer'      => 'bypass',
            'form_hp_website'     => '',
        ]);

        $response->assertSessionHasErrors('foto_santri');
        $this->assertDatabaseMissing('pendaftarans', [
            'nama_lengkap' => 'Muhammad Fadli',
        ]);
    }

    public function test_pendaftaran_santri_succeeds_with_valid_inputs_and_documents(): void
    {
        Storage::fake('public');

        $validPhoto = UploadedFile::fake()->image('santri_photo.jpg', 200, 200);
        $validPdf = UploadedFile::fake()->create('kartu_keluarga.pdf', 300, 'application/pdf');

        $response = $this->post('/daftar', [
            'nama_lengkap'        => 'Ahmad Fauzi',
            'jenis_maktab'        => 'Maktab Tuli As-Sami',
            'tempat_lahir'        => 'Pontianak',
            'tanggal_lahir'       => '2012-05-15',
            'jenis_kelamin'       => 'Laki-laki',
            'alamat_domisili'     => 'Jl. Reformasi No. 12, Pontianak',
            'nama_ortu'           => 'Suryanto Pratama',
            'no_hp_ortu'          => '081298765432',
            'pekerjaan_ortu'      => 'Wiraswasta',
            'alamat_ortu'         => 'Jl. Reformasi No. 12, Pontianak',
            'keterangan_tambahan' => 'Santri memerlukan pengenalan bahasa isyarat awal.',
            'foto_santri'         => $validPhoto,
            'kartu_keluarga'      => $validPdf,
            'captcha_answer'      => 'bypass',
            'form_hp_website'     => '',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('pendaftarans', [
            'nama_lengkap' => 'Ahmad Fauzi',
            'jenis_maktab' => 'Maktab Tuli As-Sami',
            'nama_ortu'    => 'Suryanto Pratama',
            'status'       => 'Menunggu Verifikasi',
        ]);
    }

    public function test_pendaftaran_santri_blocked_when_honeypot_triggered(): void
    {
        $response = $this->post('/daftar', [
            'nama_lengkap'    => 'Automated Bot',
            'jenis_maktab'    => 'Maktab Tuli As-Sami',
            'jenis_kelamin'   => 'Laki-laki',
            'nama_ortu'       => 'Bot Parent',
            'no_hp_ortu'      => '081234567890',
            'captcha_answer'  => 'bypass',
            'form_hp_website' => 'spam_bot_data',
        ]);

        $response->assertSessionHasErrors('captcha_answer');
        $this->assertDatabaseMissing('pendaftarans', [
            'nama_lengkap' => 'Automated Bot',
        ]);
    }

    public function test_rate_limiter_throttles_excessive_submissions(): void
    {
        // Rate limit is 5 per minute. Fire 5 requests.
        for ($i = 0; $i < 5; $i++) {
            $this->post('/kontak', [
                'nama'            => "Pengunjung {$i}",
                'email'           => "user{$i}@example.com",
                'telepon'         => '08123456789',
                'pesan'           => "Pesan reguler nomor {$i}",
                'captcha_answer'  => 'bypass',
                'form_hp_website' => '',
            ]);
        }

        // 6th request should be throttled
        $throttledResponse = $this->post('/kontak', [
            'nama'            => 'Pengunjung Ke-enam',
            'email'           => 'user6@example.com',
            'telepon'         => '08123456789',
            'pesan'           => 'Pesan nomor 6 yang seharusnya kena rate limit',
            'captcha_answer'  => 'bypass',
            'form_hp_website' => '',
        ]);

        $throttledResponse->assertSessionHasErrors('rate_limit');
    }
}
