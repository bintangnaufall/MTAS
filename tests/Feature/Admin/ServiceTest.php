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
            'contact_phone' => '+62 899-9999-9999',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Pusat Pendidikan Inklusif Update', SiteSetting::get('hero_badge'));
        $this->assertEquals('Yayasan Bhakti Utama', SiteSetting::get('hero_title_line1'));
        $this->assertEquals('+62 899-9999-9999', SiteSetting::get('contact_phone'));
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
