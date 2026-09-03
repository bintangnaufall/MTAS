<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Pesan;

class PesanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'nama' => 'Ahmad Fadhil Prasetya',
                'email' => 'fadhil.ahmad@gmail.com',
                'telepon' => '081345678901',
                'subjek' => 'Pendaftaran Santri Baru Maktab Tuli 2026',
                'pesan' => 'Assalamu\'alaikum wr. wb. Saya ingin menanyakan prosedur dan persyaratan pendaftaran untuk adik saya yang berusia 9 tahun dengan tunarungu untuk masuk Maktab Tuli As-Sami. Mohon informasinya ustadz.',
                'status' => 'unread',
                'catatan_admin' => null,
                'ip_address' => '180.252.164.21',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'created_at' => now()->subMinutes(25),
            ],
            [
                'nama' => 'Siti Nurhaliza Dewi',
                'email' => 'siti.nurhaliza.d@yahoo.com',
                'telepon' => '082198765432',
                'subjek' => 'Konsultasi Terapi Anak Autis (Maktab Autis)',
                'pesan' => 'Halo Yayasan Bhakti Arumi Delangga, apakah ada jadwal konsultasi atau asesmen awal untuk anak saya (usia 6 tahun, spektrum autisme)? Apakah bisa datang langsung di hari Sabtu?',
                'status' => 'unread',
                'catatan_admin' => null,
                'ip_address' => '114.125.88.45',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
                'created_at' => now()->subHours(2),
            ],
            [
                'nama' => 'Drs. Hendra Gunawan, M.Pd.',
                'email' => 'hendra.gunawan@kemdikbud.go.id',
                'telepon' => '085277889900',
                'subjek' => 'Tawaran Kerjasama Pelatihan Guru SLB & Relawan',
                'pesan' => 'Salam hormat. Kami dari Komunitas Pendidik Inklusi Pontianak tertarik untuk menjalin kerjasama pelatihan metode pembelajaran isyarat Al-Qur\'an bagi guru-guru di Pontianak. Mohon kontak person yang bisa kami hubungi untuk diskusi teknis.',
                'status' => 'read',
                'catatan_admin' => 'Sudah diteruskan ke Divisi Program & Kemitraan (Ustadz Ridwan).',
                'ip_address' => '103.111.201.12',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => now()->subHours(8),
            ],
            [
                'nama' => 'Rina Kartikasari',
                'email' => 'rinakartika@gmail.com',
                'telepon' => '081234509876',
                'subjek' => 'Permohonan Kunjungan Edukasi & Belajar Isyarat',
                'pesan' => 'Assalamu\'alaikum, kami dari komunitas mahasiswa ingin mengadakan kunjungan silaturahmi dan belajar pengenalan bahasa isyarat bersama santri Maktab Tuli. Mohon arahan prosedurnya. Terima kasih yayasan.',
                'status' => 'replied',
                'catatan_admin' => 'Sudah dibalas via WhatsApp dan email surat balasan izin kunjungan terlampir.',
                'ip_address' => '36.85.102.77',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36',
                'created_at' => now()->subDays(1),
            ],
            [
                'nama' => 'Budi Santoso',
                'email' => 'budisantoso99@gmail.com',
                'telepon' => '089612345678',
                'subjek' => 'Lokasi dan Jam Buka Kantor Yayasan',
                'pesan' => 'Selamat siang, apakah kantor yayasan buka di hari Minggu untuk kunjungan orang tua santri? Terima kasih atas infonya.',
                'status' => 'replied',
                'catatan_admin' => 'Sudah diinformasikan bahwa kunjungan hari Minggu dengan janji temu terlebih dahulu.',
                'ip_address' => '182.2.140.91',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'created_at' => now()->subDays(2),
            ],
        ];

        foreach ($messages as $msg) {
            Pesan::create($msg);
        }
    }
}
