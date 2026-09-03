<?php

namespace Database\Seeders;

use App\Models\Galeri;
use Illuminate\Database\Seeder;

class GaleriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records to avoid duplicates
        Galeri::truncate();

        $items = [
            // Foto Dokumentasi
            [
                'judul' => 'Belajar Bahasa Isyarat',
                'kategori' => 'Maktab Tuli',
                'tipe' => 'foto',
                'image' => '/images/image6.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2023-10-12',
                'deskripsi' => 'Sesi pembelajaran bahasa isyarat santri Maktab Tuli bersama para pengajar berpengalaman untuk melatih komunikasi yang aktif dan mandiri.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 1,
            ],
            [
                'judul' => 'Aksi Tanam Pohon',
                'kategori' => 'Acara Sosial',
                'tipe' => 'foto',
                'image' => '/images/image5.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2023-11-05',
                'deskripsi' => 'Kegiatan penghijauan dan aksi tanam pohon oleh santri yayasan bersama komunitas relawan lokal untuk menanamkan kepedulian lingkungan.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 2,
            ],
            [
                'judul' => 'Diskusi Kelompok',
                'kategori' => 'Pembelajaran',
                'tipe' => 'foto',
                'image' => '/images/image7.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2023-11-20',
                'deskripsi' => 'Diskusi interaktif santri dalam memecahkan soal dan melatih kemampuan berpikir kritis serta kolaborasi antar santri.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 3,
            ],
            [
                'judul' => 'Terapi Sensori Mandiri',
                'kategori' => 'Maktab Autis',
                'tipe' => 'foto',
                'image' => '/images/image10.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2024-01-10',
                'deskripsi' => 'Latihan terapi sensori mandiri bagi santri Maktab Autis didampingi terapis profesional untuk mengasah motorik halus.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 4,
            ],
            [
                'judul' => 'Ramah Tamah Tahunan',
                'kategori' => 'Kegiatan Yayasan',
                'tipe' => 'foto',
                'image' => '/images/image8.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2023-12-15',
                'deskripsi' => 'Pertemuan silaturahmi tahunan antara jajaran pengurus yayasan, wali santri, donatur, dan masyarakat sekitar.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 5,
            ],
            [
                'judul' => 'Bakti Sosial Ramadan',
                'kategori' => 'Kegiatan Yayasan',
                'tipe' => 'foto',
                'image' => '/images/image9.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2024-03-18',
                'deskripsi' => 'Penyaluran bantuan sembako dan santunan paket Ramadan bagi warga yang membutuhkan di sekitar lingkungan yayasan.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 6,
            ],

            // Kegiatan Utama / Featured Event
            [
                'judul' => 'Perayaan Milad Yayasan Bhakti Arumi Delangga',
                'kategori' => 'Kegiatan Yayasan',
                'tipe' => 'foto',
                'image' => '/images/image4.png',
                'video_url' => null,
                'duration' => null,
                'tanggal' => '2024-02-14',
                'deskripsi' => 'Momentum bersejarah dalam merayakan perjalanan pengabdian kami. Acara ini dihadiri oleh seluruh santri Maktab Tuli dan Autis, para orang tua, serta tokoh masyarakat setempat untuk mempererat silaturahmi.',
                'is_featured' => true,
                'status' => 'Published',
                'order' => 0,
            ],

            // Video Dokumentasi
            [
                'judul' => 'Profil Maktab Tuli Arumi',
                'kategori' => 'Maktab Tuli',
                'tipe' => 'video',
                'image' => '/images/image1.png',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => '04:25',
                'tanggal' => '2024-02-01',
                'deskripsi' => 'Video profil pengenalan program Maktab Tuli Yayasan Bhakti Arumi Delangga, fasilitas, serta metode pembelajarannya.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 7,
            ],
            [
                'judul' => 'Metode Terapi Maktab Autis',
                'kategori' => 'Maktab Autis',
                'tipe' => 'video',
                'image' => '/images/image3.png',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => '12:10',
                'tanggal' => '2024-01-15',
                'deskripsi' => 'Penjelasan mendalam tentang pendekatan terapi sensorik dan motorik bagi anak berkebutuhan khusus di Maktab Autis.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 8,
            ],
            [
                'judul' => 'Dokumentasi Ramadhan 1445H',
                'kategori' => 'Kegiatan Yayasan',
                'tipe' => 'video',
                'image' => '/images/image7.png',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => '08:45',
                'tanggal' => '2024-03-25',
                'deskripsi' => 'Rangkaian kegiatan santri selama bulan suci Ramadan mulai dari tadarus bersama, kajian isyarat, hingga buka puasa bersama.',
                'is_featured' => false,
                'status' => 'Published',
                'order' => 9,
            ],
        ];

        foreach ($items as $item) {
            Galeri::create($item);
        }
    }
}
