<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_services_page(): void
    {
        $response = $this->get('/admin/services');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_admin_can_access_services_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/services');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Services')
            ->has('settings')
        );
    }

    public function test_authenticated_admin_can_update_site_settings(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->post('/admin/services', [
            'hero_badge' => 'Pusat Pendidikan Inklusif Update',
            'hero_title_line1' => 'Yayasan Bhakti Utama',
            'hero_floating_title' => 'Santri Hebat',
            'hero_floating_subtitle' => 'Belajar Al-Quran Bersama',
            'why_badge' => 'Nilai Keunggulan',
            'why_title' => 'Mewujudkan Kesetaraan Pendidikan Santri',
            'why_card1_title' => 'Mushaf Isyarat Digital',
            'contact_phone' => '+62 899-9999-9999',
            'contact_card1_badge' => 'Kantor Pusat Baru',
            'contact_card1_title' => 'Alamat MTAS',
            'contact_card2_title' => 'Kontak Layanan Cepat',
            'contact_card3_title' => 'Email Yayasan',
            'contact_card4_title' => 'Instagram Resmi Kami',
            'contact_card4_btn' => 'Kunjungi Profil',
            'maktab_visimisi_badge' => 'Arah Strategis Baru',
            'maktab_visimisi_title' => 'Visi & Misi MTAS',
            'maktab_visimisi_desc' => 'Deskripsi arah dan komitmen lembaga diperbarui.',
            'maktab_visi_badge' => 'Jangka Panjang Baru',
            'maktab_visi_title' => 'Visi Kami',
            'maktab_visi_text' => 'Teks visi utama baru yang diperbarui.',
            'maktab_visi_poin1' => 'Poin visi pertama baru.',
            'maktab_misi_badge' => 'Langkah Strategis Baru',
            'maktab_misi_title' => 'Misi Kami',
            'maktab_misi_intro' => 'Pengantar misi baru.',
            'maktab_misi_poin1_title' => 'Pendidikan Keagamaan',
            'maktab_misi_poin1_desc' => 'Uraian pendidikan keagamaan baru.',
            'maktab_program_title' => '7 Program Unggulan Kami',
            'maktab_prog1_title' => 'Quran Isyarat MTAS',
            'maktab_prog1_badge' => 'Pilar Pokok',
            'maktab_fasilitas_title' => 'Fasilitas Unggulan Santri',
            'maktab_fac1_title' => 'Ruang Kelas Multimedia Modern',
            'contact_jbi_badge' => 'Inklusi Komunikasi Unggulan',
            'contact_jbi_title' => 'Jasa Juru Bahasa Isyarat Profesional',
            'contact_jbi_btn_wa' => 'Hubungi via WhatsApp',
            'contact_jbi_item1_title' => 'Webinar & Konferensi Nasional',
            'contact_jbi_point1' => 'Standar BISINDO Bersertifikat',
            'contact_faq_title' => 'Pertanyaan & Jawaban Populer',
            'contact_faq1_q' => 'Bagaimana cara mendaftar JBI?',
            'contact_faq1_a' => 'Cukup kirimkan formulir kontak atau hubungi admin kami.',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Pertanyaan & Jawaban Populer', SiteSetting::get('contact_faq_title'));
        $this->assertEquals('Bagaimana cara mendaftar JBI?', SiteSetting::get('contact_faq1_q'));
        $this->assertEquals('Cukup kirimkan formulir kontak atau hubungi admin kami.', SiteSetting::get('contact_faq1_a'));
        $this->assertEquals('Pusat Pendidikan Inklusif Update', SiteSetting::get('hero_badge'));
        $this->assertEquals('Yayasan Bhakti Utama', SiteSetting::get('hero_title_line1'));
        $this->assertEquals('Santri Hebat', SiteSetting::get('hero_floating_title'));
        $this->assertEquals('Belajar Al-Quran Bersama', SiteSetting::get('hero_floating_subtitle'));
        $this->assertEquals('Nilai Keunggulan', SiteSetting::get('why_badge'));
        $this->assertEquals('Mewujudkan Kesetaraan Pendidikan Santri', SiteSetting::get('why_title'));
        $this->assertEquals('Mushaf Isyarat Digital', SiteSetting::get('why_card1_title'));
        $this->assertEquals('+62 899-9999-9999', SiteSetting::get('contact_phone'));
        $this->assertEquals('Kantor Pusat Baru', SiteSetting::get('contact_card1_badge'));
        $this->assertEquals('Alamat MTAS', SiteSetting::get('contact_card1_title'));
        $this->assertEquals('Kontak Layanan Cepat', SiteSetting::get('contact_card2_title'));
        $this->assertEquals('Email Yayasan', SiteSetting::get('contact_card3_title'));
        $this->assertEquals('Instagram Resmi Kami', SiteSetting::get('contact_card4_title'));
        $this->assertEquals('Kunjungi Profil', SiteSetting::get('contact_card4_btn'));
        $this->assertEquals('Inklusi Komunikasi Unggulan', SiteSetting::get('contact_jbi_badge'));
        $this->assertEquals('Jasa Juru Bahasa Isyarat Profesional', SiteSetting::get('contact_jbi_title'));
        $this->assertEquals('Hubungi via WhatsApp', SiteSetting::get('contact_jbi_btn_wa'));
        $this->assertEquals('Webinar & Konferensi Nasional', SiteSetting::get('contact_jbi_item1_title'));
        $this->assertEquals('Standar BISINDO Bersertifikat', SiteSetting::get('contact_jbi_point1'));
        $this->assertEquals('Arah Strategis Baru', SiteSetting::get('maktab_visimisi_badge'));
        $this->assertEquals('Visi & Misi MTAS', SiteSetting::get('maktab_visimisi_title'));
        $this->assertEquals('Deskripsi arah dan komitmen lembaga diperbarui.', SiteSetting::get('maktab_visimisi_desc'));
        $this->assertEquals('Jangka Panjang Baru', SiteSetting::get('maktab_visi_badge'));
        $this->assertEquals('Visi Kami', SiteSetting::get('maktab_visi_title'));
        $this->assertEquals('Teks visi utama baru yang diperbarui.', SiteSetting::get('maktab_visi_text'));
        $this->assertEquals('Poin visi pertama baru.', SiteSetting::get('maktab_visi_poin1'));
        $this->assertEquals('Langkah Strategis Baru', SiteSetting::get('maktab_misi_badge'));
        $this->assertEquals('Misi Kami', SiteSetting::get('maktab_misi_title'));
        $this->assertEquals('Pengantar misi baru.', SiteSetting::get('maktab_misi_intro'));
        $this->assertEquals('Pendidikan Keagamaan', SiteSetting::get('maktab_misi_poin1_title'));
        $this->assertEquals('Uraian pendidikan keagamaan baru.', SiteSetting::get('maktab_misi_poin1_desc'));
        $this->assertEquals('7 Program Unggulan Kami', SiteSetting::get('maktab_program_title'));
        $this->assertEquals('Quran Isyarat MTAS', SiteSetting::get('maktab_prog1_title'));
        $this->assertEquals('Pilar Pokok', SiteSetting::get('maktab_prog1_badge'));
        $this->assertEquals('Fasilitas Unggulan Santri', SiteSetting::get('maktab_fasilitas_title'));
        $this->assertEquals('Ruang Kelas Multimedia Modern', SiteSetting::get('maktab_fac1_title'));
    }

    public function test_authenticated_admin_can_reset_site_settings(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        SiteSetting::set('hero_badge', 'Custom Custom');

        $response = $this->actingAs($admin)->post('/admin/services/reset');

        $response->assertRedirect();
        $this->assertEquals('Pusat Pendidikan & Perlindungan Inklusif', SiteSetting::get('hero_badge'));
    }
}
