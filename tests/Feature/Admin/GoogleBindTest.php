<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GoogleBindTest extends TestCase
{
    use RefreshDatabase;

    public function test_binding_google_account_updates_email_in_database_and_invalidates_old_email_login(): void
    {
        $user = User::factory()->create([
            'name' => 'Bintang Test',
            'email' => 'lama@example.com',
            'password' => Hash::make('password123'),
            'google_id' => 'google-old-123',
        ]);

        $mockGoogleUser = Mockery::mock('Laravel\Socialite\Two\User');
        $mockGoogleUser->shouldReceive('getId')->andReturn('google-new-456');
        $mockGoogleUser->shouldReceive('getEmail')->andReturn('baru@example.com');
        $mockGoogleUser->shouldReceive('getName')->andReturn('Bintang New');
        $mockGoogleUser->shouldReceive('getAvatar')->andReturn('https://google.com/avatar.jpg');

        $mockDriver = Mockery::mock('Laravel\Socialite\Two\AbstractProvider');
        $mockDriver->shouldReceive('user')->andReturn($mockGoogleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($mockDriver);

        // Simulasi binding Google saat user sedang login
        $response = $this->actingAs($user)
            ->withSession([
                'google_oauth_action' => 'bind',
                'google_bind_user_id' => $user->id,
            ])
            ->get(route('auth.google.callback'));

        $response->assertRedirect(route('admin.pengaturan-akun'));
        $response->assertSessionHas('success');

        // Pastikan email di database BERUBAH ke akun Google baru
        $user->refresh();
        $this->assertEquals('baru@example.com', $user->email);
        $this->assertEquals('google-new-456', $user->google_id);

        // Logout dan coba login dengan EMAIL LAMA -> harus GAGAL
        $this->post('/logout');

        $loginOldResponse = $this->post(route('login.post'), [
            'email' => 'lama@example.com',
            'password' => 'password123',
        ]);
        $loginOldResponse->assertSessionHasErrors('email');
        $this->assertGuest();

        // Coba login dengan EMAIL BARU -> harus BERHASIL
        $loginNewResponse = $this->post(route('login.post'), [
            'email' => 'baru@example.com',
            'password' => 'password123',
        ]);
        $loginNewResponse->assertRedirect(route('admin.dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
    }

    public function test_unregistered_google_account_cannot_login(): void
    {
        $mockGoogleUser = Mockery::mock('Laravel\Socialite\Two\User');
        $mockGoogleUser->shouldReceive('getId')->andReturn('google-unknown-999');
        $mockGoogleUser->shouldReceive('getEmail')->andReturn('unknown@example.com');
        $mockGoogleUser->shouldReceive('getName')->andReturn('Unknown Person');
        $mockGoogleUser->shouldReceive('getAvatar')->andReturn('https://google.com/avatar.jpg');

        $mockDriver = Mockery::mock('Laravel\Socialite\Two\AbstractProvider');
        $mockDriver->shouldReceive('user')->andReturn($mockGoogleUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($mockDriver);

        $response = $this->withSession([
            'google_oauth_action' => 'login',
        ])->get(route('auth.google.callback'));

        $response->assertRedirect(route('admin.login'));
        $response->assertSessionHasErrors('google');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', [
            'email' => 'unknown@example.com',
        ]);
    }
}
