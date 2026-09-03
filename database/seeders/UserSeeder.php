<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Bintang Naufal',
                'username' => 'bintang7735',
                'email' => 'bintang7735@gmail.com',
                'password' => Hash::make('12345678'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ahmad Fauzi',
                'username' => 'ahmad.fauzi',
                'email' => 'admin@bhaktiarumi.org',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Siti Rahmah',
                'username' => 'siti.rahmah',
                'email' => 'editor@bhaktiarumi.org',
                'password' => Hash::make('12345678'),
                'role' => 'editor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ustadz Hasan Basri',
                'username' => 'hasan.basri',
                'email' => 'staff@bhaktiarumi.org',
                'password' => Hash::make('12345678'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dian Sastrowardoyo',
                'username' => 'dian.sastro',
                'email' => 'dian.sastro@bhaktiarumi.org',
                'password' => Hash::make('12345678'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
