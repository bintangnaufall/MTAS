<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Default fallback values for all settings
     */
    public static function defaults(): array
    {
        return [
            // HERO SECTION
            'hero_badge' => 'Pusat Pendidikan & Perlindungan Inklusif',
            'hero_title_line1' => 'Yayasan Bhakti',
            'hero_title_line2' => 'Arumi Delangga',
            'hero_description' => 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
            'hero_btn1_text' => 'Tentang Yayasan',
            'hero_btn1_link' => '/maktabtuli',
            'hero_btn2_text' => 'Daftar Santri',
            'hero_btn2_link' => '/daftar',
            'hero_image' => '/images/hero_foto.png',
            'hero_floating_title' => 'Santri Inklusif',
            'hero_floating_subtitle' => 'Aktif belajar bersama di MTAS',

            // TENTANG YAYASAN SECTION
            'about_title' => 'Dedikasi untuk Inklusi dan Spiritualitas',
            'about_description' => 'Didirikan dengan semangat kasih sayang, Yayasan Bhakti Arumi Delangga hadir sebagai jembatan bagi anak-anak berkebutuhan khusus, khususnya teman Tuli dan Autis, untuk mendapatkan hak pendidikan agama dan umum yang setara.',
            'about_image1' => '/images/image1.png',
            'about_image2' => '/images/image2.png',
            'about_image3' => '/images/image3.png',
            'about_image4' => '/images/image4.png',
            'about_sejarah_title' => 'Sejarah Singkat & Komitmen',
            'about_sejarah_desc' => 'Didirikan sejak tahun 2020 sebagai ikhtiar memperluas akses pembelajaran Al-Qur\'an bahasa isyarat di Pontianak, Kalimantan Barat.',
            'about_visi' => 'Menjadi pusat unggulan pendidikan Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli & Autis yang berakhlak mulia dan mandiri.',
            'about_misi_title' => 'Komitmen & Misi Utama',
            'about_misi' => 'Membangun kurikulum tahfidz isyarat, menyelenggarakan terapi kemandirian sensori, dan membina keluarga santri.',

            // PROGRAM & LAYANAN (SERVICES)
            'service1_title' => 'Maktab Tuli As-Sami',
            'service1_tag' => 'Pendidikan Al-Qur\'an Isyarat',
            'service1_desc' => 'Pusat pembelajaran Al-Qur\'an, tajwid isyarat, fiqih ibadah praktis, dan pembinaan akhlak khusus Teman Tuli dengan metode visual terpadu.',
            'service1_image' => '/images/image6.png',
            'service1_link' => '/maktabtuli',
            'service2_title' => 'Maktab Autis & Kemandirian',
            'service2_tag' => 'Terapi & Kemandirian Ibadah',
            'service2_desc' => 'Pendampingan sensori motorik, pengenalan rukun Islam, dan pelatihan kemandirian harian agar santri mampu beribadah mandiri.',
            'service2_image' => '/images/image7.png',
            'service2_link' => '/daftar',
            'service3_title' => 'Konseling & Parenting Inklusif',
            'service3_tag' => 'Pendampingan Keluarga',
            'service3_desc' => 'Sesi bimbingan berkala bagi para orang tua dan wali santri guna memperkuat ketahanan keluarga dalam mendampingi anak istimewa.',
            'service3_image' => '/images/image8.png',
            'service3_link' => '/kontak',

            // STATISTIK DAMPAK (HALAMAN BERANDA)
            'stat1_value' => '120+',
            'stat1_label' => 'Santri Inklusif Dibina',
            'stat1_desc' => 'Santri Teman Tuli & Autis aktif belajar di lingkungan ramah disabilitas',
            'stat2_value' => '100%',
            'stat2_label' => 'Beasiswa Dhuafa & Yatim',
            'stat2_desc' => 'Komitmen pendidikan agama berkualitas tanpa membebani keluarga pra-sejahtera',
            'stat3_value' => '15+',
            'stat3_label' => 'Ustadz & Terapis Ahli',
            'stat3_desc' => 'Pengajar berdedikasi dengan keahlian bahasa isyarat dan stimulasi sensori',
            'stat4_value' => '4+',
            'stat4_label' => 'Tahun Berkhidmat',
            'stat4_desc' => 'Menjalin silaturahmi, pengabdian sosial, dan advokasi disabilitas berkelanjutan',

            // KENAPA MEMILIH KAMI / NILAI UTAMA (HALAMAN BERANDA)
            'why_badge' => 'Kenapa Memilih Kami',
            'why_title' => 'Mewujudkan Hak Ibadah & Belajar Setara Bagi Setiap Anak',
            'why_description' => 'Yayasan Bhakti Arumi Delangga berkomitmen menghadirkan ruang tumbuh yang aman, mengasihi, dan memberdayakan potensi santri berkebutuhan khusus dengan metodologi modern.',
            'why_btn1_text' => 'Profil Maktab Tuli',
            'why_btn1_link' => '/maktabtuli',
            'why_btn2_text' => 'Galeri Santri',
            'why_btn2_link' => '/galeri',
            'why_card1_title' => 'Mushaf Isyarat Terstandar',
            'why_card1_desc' => 'Pembelajaran tilawah dan hafalan Al-Qur\'an mengacu pada standarisasi mushaf isyarat resmi dan metode visual terarah.',
            'why_card2_title' => 'Pendekatan Holistik & Terapi',
            'why_card2_desc' => 'Menyelaraskan pendidikan keislaman, terapi sensori motorik, dan bimbingan psikologis agar santri berkembang optimal.',
            'why_card3_title' => 'Pendidikan Formal Berijazah',
            'why_card3_desc' => 'Dukungan kesetaraan ijazah Paket A, B, dan C resmi negara agar santri memiliki bekal melanjutkan pendidikan ke perguruan tinggi.',
            'why_card4_title' => 'Kemandirian Santri & Kriya',
            'why_card4_desc' => 'Pelatihan seni kaligrafi, kriya tangan, dan literasi digital di sanggar kreatif demi membangun kemandirian ekonomi santri.',

            // ════════════════════════════════════════════════════════════
            // 2. HALAMAN MAKTAB TULI
            // ════════════════════════════════════════════════════════════
            'maktab_hero_badge' => 'Pendidikan Inklusif Berkelanjutan',
            'maktab_hero_title' => 'Maktab Tuli As-Sami',
            'maktab_hero_desc' => 'Pusat pendidikan Al-Qur\'an dan bimbingan agama Islam khusus bagi Teman Tuli, membangun kemandirian spiritual dan intelektual melalui bahasa isyarat serta metode visual terpadu.',
            'maktab_profile_image' => '/images/image5.png',
            'maktab_profile_badge' => 'Profil Lembaga',
            'maktab_profile_title' => 'Membuka Jendela Dunia Melalui Cahaya Iman',
            'maktab_profile_desc1' => 'Maktab Tuli As-Sami didirikan dengan tekad untuk menjembatani kesenjangan akses pendidikan agama bagi saudara-saudara kita yang mengalami kendala pendengaran. Kami percaya bahwa Al-Qur\'an adalah rahmat bagi semesta alam, tanpa terkecuali.',
            'maktab_profile_desc2' => 'Berawal dari kelompok belajar kecil, kini kami bertumbuh menjadi institusi yang mengintegrasikan kurikulum agama tradisional dengan pendekatan teknologi visual modern, memastikan setiap santri dapat memahami esensi Islam dengan cara yang paling efektif bagi mereka.',
            'maktab_poin1_title' => 'Kurikulum Visual',
            'maktab_poin1_desc' => 'Disusun sistematis dengan infografis, video interaktif, dan kamus isyarat Al-Qur\'an standar.',
            'maktab_poin2_title' => 'Kemandirian Berdikari',
            'maktab_poin2_desc' => 'Membekali santri dengan ijazah formal kesetaraan, keterampilan seni, dan kesiapan masuk dunia kerja/kuliah.',
            'maktab_visimisi_badge' => 'Arah & Komitmen Lembaga',
            'maktab_visimisi_title' => 'Visi & Misi Maktab Tuli',
            'maktab_visimisi_desc' => 'Pondasi nilai dan langkah nyata kami dalam membimbing santri Tuli menuju kemuliaan akhlak dan kemandirian hidup.',
            'maktab_visi_badge' => 'Tujuan Jangka Panjang',
            'maktab_visi_title' => 'Visi Utama',
            'maktab_visi_text' => 'Menjadi pusat unggulan pembelajaran Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli di Indonesia yang berakhlak mulia, berilmu amaliah, dan mandiri secara peradaban.',
            'maktab_visi_poin1' => 'Pusat rujukan terdepan dalam standarisasi pembelajaran Al-Qur\'an dan Hadits berbasis isyarat visual.',
            'maktab_visi_poin2' => 'Mewujudkan ruang tumbuh kembang yang aman, berdaya, dan setara bagi santri disabilitas rungu.',
            'maktab_visi_poin3' => 'Membangun generasi muslim Tuli yang percaya diri, mandiri secara ekonomi, dan berkontribusi di masyarakat.',
            'maktab_misi_badge' => 'Langkah Strategis',
            'maktab_misi_title' => 'Misi Lembaga',
            'maktab_misi_intro' => 'Mewujudkan layanan pendidikan Islam terpadu, kesetaraan akademik, dan vokasi terapan melalui tiga pilar utama:',
            'maktab_misi_poin1_title' => 'Pendidikan Agama',
            'maktab_misi_poin1_desc' => 'Menyelenggarakan tilawah Al-Qur\'an, Hadits, dan Fiqih berbasis isyarat baku (BISINDO) serta media interaktif.',
            'maktab_misi_poin2_title' => 'Kesetaraan Formal',
            'maktab_misi_poin2_desc' => 'Memfasilitasi program PKBM berijazah resmi negara serta bimbingan intensif persiapan masuk universitas.',
            'maktab_misi_poin3_title' => 'Kemandirian Vokasi',
            'maktab_misi_poin3_desc' => 'Mengembangkan bakat sanggar seni, kriya, teknologi digital, dan wirausaha kreatif santri.',
            'maktab_misi_text' => "1. Mengembangkan kurikulum tahfidz dan tafsir Al-Qur'an berbasis isyarat visual standar nusantara.\n2. Memberikan pembinaan akhlak mulia dan akidah shahihah sesuai tuntunan Rasulullah SAW.\n3. Menyelenggarakan pendidikan akademik formal kesetaraan Paket A, B, dan C berijazah negara.\n4. Melatih keterampilan hidup, kriya mandiri, dan literasi digital agar santri mandiri berdaya.",
            'maktab_program_badge' => 'Kurikulum Terstruktur',
            'maktab_program_title' => '7 Program Belajar Utama',
            'maktab_program_desc' => 'Dirancang komprehensif memadukan studi keislaman, penguatan akademis, dan kesiapan kemandirian masa depan santri.',
            'maktab_prog1_title' => 'Quran Isyarat',
            'maktab_prog1_badge' => 'Program Utama',
            'maktab_prog1_desc' => "Pembelajaran tilawah, tajwid visual, dan tahfidz Al-Qur'an menggunakan standarisasi mushaf bahasa isyarat.",
            'maktab_prog1_btn' => 'Program Aktif MTAS',
            'maktab_prog2_title' => 'Hadist Isyarat',
            'maktab_prog2_badge' => 'Studi Islam',
            'maktab_prog2_desc' => 'Pemahaman matan hadits-hadits shahih pilihan dan pengamalan adab nabawi harian melalui bahasa isyarat visual.',
            'maktab_prog2_btn' => 'Program Aktif MTAS',
            'maktab_prog3_title' => 'Fiqih Isyarat',
            'maktab_prog3_badge' => 'Ibadah Praktis',
            'maktab_prog3_desc' => 'Bimbingan tata cara thaharah, shalat, puasa, dan hukum-hukum muamalah Islam secara aplikatif dan terstruktur.',
            'maktab_prog3_btn' => 'Program Aktif MTAS',
            'maktab_prog4_title' => 'Pelajaran Umum',
            'maktab_prog4_badge' => 'Akademik Dasar',
            'maktab_prog4_desc' => 'Penguatan literasi, numerasi, sains terapan, dan wawasan kebangsaan guna memperluas cakrawala berpikir santri.',
            'maktab_prog4_btn' => 'Program Aktif MTAS',
            'maktab_prog5_title' => 'PKBM Ijazah Paket',
            'maktab_prog5_badge' => 'Pendidikan Formal',
            'maktab_prog5_desc' => 'Program pendidikan kesetaraan Paket A (SD), B (SMP), dan C (SMA) berijazah resmi negara untuk masa depan santri.',
            'maktab_prog5_btn' => 'Program Aktif MTAS',
            'maktab_prog6_title' => 'Persiapan Kuliah',
            'maktab_prog6_badge' => 'Lanjutan Studi',
            'maktab_prog6_desc' => 'Bimbingan seleksi masuk perguruan tinggi inklusif, pendampingan beasiswa, dan penguatan kemandirian akademis tinggi.',
            'maktab_prog6_btn' => 'Program Aktif MTAS',
            'maktab_prog7_title' => 'Sanggar Seni',
            'maktab_prog7_badge' => 'Kreativitas & Kriya',
            'maktab_prog7_desc' => 'Wadah kreasi seni lukis, kaligrafi Islam, desain grafis, fotografi, dan kriya tangan untuk kemandirian berwirausaha.',
            'maktab_prog7_btn' => 'Program Aktif MTAS',
            'maktab_fasilitas_badge' => 'SARANA & PRASARANA',
            'maktab_fasilitas_title' => 'Fasilitas Pendukung Belajar',
            'maktab_fasilitas_desc' => 'Kenyamanan dan kelengkapan fasilitas adalah prioritas utama kami demi mendukung proses belajar santri yang optimal.',
            'maktab_fac1_title' => 'Ruang Kelas Multimedia',
            'maktab_fac1_desc' => 'Dilengkapi proyektor resolusi tinggi, monitor interaktif, dan pencahayaan optimal untuk kenyamanan visual santri.',
            'maktab_fac2_title' => 'Media Belajar Digital',
            'maktab_fac2_desc' => 'Aplikasi kamus isyarat agama, video pembelajaran animasi, dan modul visual yang dapat diulang kapan pun.',
            'maktab_fac3_title' => 'Konseling & Bimbingan',
            'maktab_fac3_desc' => 'Pendampingan psikologis dan bimbingan kepribadian ramah Tuli guna memperkuat ketangguhan mental dan spiritual.',
            'maktab_fac4_title' => 'Perpustakaan Visual',
            'maktab_fac4_desc' => 'Koleksi buku bertutur visual, literasi sejarah Islam infografis, dan referensi akademik ramah disabilitas rungu.',
            'maktab_fac5_title' => 'Area Sosialisasi & Asrama',
            'maktab_fac5_desc' => 'Lingkungan asrama dan ruang komunal yang nyaman, bersih, dan aman untuk membangun kebersamaan antarsantri.',
            'maktab_fac6_title' => 'Akses Internet Cepat',
            'maktab_fac6_desc' => 'Jaringan Wi-Fi berkecepatan tinggi untuk menunjang video conference bahasa isyarat dan riset pembelajaran digital.',

            // ════════════════════════════════════════════════════════════
            // 3. HALAMAN BERITA
            // ════════════════════════════════════════════════════════════
            'berita_header_badge' => 'Kabar & Informasi Terkini',
            'berita_header_title' => 'Berita Yayasan',
            'berita_header_desc' => 'Informasi, agenda kegiatan, dan kabar terkini seputar program pendidikan dan sosial Yayasan Bhakti Arumi Delangga.',

            // ════════════════════════════════════════════════════════════
            // 4. HALAMAN GALERI
            // ════════════════════════════════════════════════════════════
            'galeri_header_badge' => 'Dokumentasi & Arsip Kegiatan',
            'galeri_header_title' => 'Galeri Yayasan',
            'galeri_header_desc' => 'Dokumentasi penuh makna dari setiap langkah dan senyuman adik-adik santri Yayasan Bhakti Arumi Delangga dalam mewujudkan pendidikan inklusif yang berkelanjutan.',

            // ════════════════════════════════════════════════════════════
            // 5. HALAMAN KONTAK (4 Kartu Kontak Utama)
            // ════════════════════════════════════════════════════════════
            'contact_header_badge' => 'Pusat Layanan & Informasi',
            'contact_header_title' => 'Kontak Yayasan Bhakti Arumi',
            'contact_header_desc' => 'Kami siap mendengar, berdiskusi, dan membantu menjawab pertanyaan seputar program pendidikan serta pendaftaran santri.',

            // Kartu 1: Alamat Kantor
            'contact_card1_badge' => 'Kantor & Asrama',
            'contact_card1_title' => 'Alamat Kantor',
            'contact_address' => 'Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124',
            'contact_card1_btn' => 'Lihat di Peta',

            // Section Lokasi & Akses Yayasan (Peta Google Maps)
            'contact_maps_badge' => 'Lokasi Fisik',
            'contact_maps_title' => 'Lokasi & Akses Yayasan',
            'contact_maps_desc' => 'Kunjungi langsung asrama dan kantor Maktab Tuli As-Sami / Yayasan Bhakti Arumi Delangga di Pontianak.',
            'contact_maps_copy_btn' => 'Salin Alamat',
            'contact_maps_btn' => 'Buka di Google Maps',
            'contact_maps_link' => 'https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak',
            'contact_maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid',

            // Kartu 2: Telepon & WhatsApp
            'contact_card2_badge' => 'Senin - Sabtu: 08:00 - 16:30 WIB',
            'contact_card2_title' => 'Telepon & WhatsApp',
            'contact_phone' => '+62 812-3456-7890',
            'contact_whatsapp' => '081234567890',
            'contact_hours' => 'Senin - Sabtu: 08:00 - 16:30 WIB',
            'contact_card2_btn' => 'Chat WhatsApp',

            // Kartu 3: Email Resmi
            'contact_card3_badge' => 'Respon Cepat',
            'contact_card3_title' => 'Email Resmi',
            'contact_email' => 'info@bhaktiarumi.org',
            'contact_card3_btn' => 'Kirim Email',

            // Kartu 4: Instagram Resmi
            'contact_card4_badge' => 'Dokumentasi',
            'contact_card4_title' => 'Instagram Resmi',
            'contact_instagram_handle' => '@maktabtuliassami.id',
            'contact_instagram' => 'https://www.instagram.com/maktabtuliassami.id/',
            'contact_card4_btn' => 'Buka Instagram',

            // Layanan Juru Bahasa Isyarat (JBI)
            'contact_jbi_badge' => 'Aksesibilitas & Inklusi Komunikasi',
            'contact_jbi_title' => 'Jasa Layanan Juru Bahasa Isyarat (JBI)',
            'contact_jbi_desc' => 'Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional untuk menjembatani komunikasi yang setara dan inklusif antara Teman Dengar dan Teman Tuli dalam berbagai agenda resmi, keagamaan, pendidikan, maupun publik.',
            'contact_jbi_btn_wa' => 'Reservasi via WhatsApp',
            'contact_jbi_btn_form' => 'Isi Form Permohonan',
            'contact_jbi_item1_title' => 'Seminar & Konferensi',
            'contact_jbi_item1_desc' => 'Penerjemahan langsung untuk webinar, seminar nasional, rapat dinas, dan pelatihan korporasi.',
            'contact_jbi_item2_title' => 'Kajian & Keagamaan',
            'contact_jbi_item2_desc' => "Penerjemahan khutbah Jum'at, pengajian akbar, kajian tematik Islam, akad nikah, dan tabligh.",
            'contact_jbi_item3_title' => 'Formal & Pendampingan',
            'contact_jbi_item3_desc' => 'Pendampingan sidang akademik/skripsi, konsultasi medis di faskes, serta urusan kedinasan.',
            'contact_jbi_item4_title' => 'Media & Konten Digital',
            'contact_jbi_item4_desc' => 'Penerjemah visual PIP (Picture-in-Picture) video promosi, siaran TV/streaming, dan takarir isyarat.',
            'contact_jbi_point1' => 'Standar BISINDO & Bahasa Isyarat Agama',
            'contact_jbi_point2' => 'Tersedia Format Luring & Daring (Zoom / Live)',
            'contact_jbi_point3' => 'Penerjemah Berpengalaman & Beretika',

            // FAQ (Pertanyaan Sering Diajukan)
            'contact_faq_title' => 'Pertanyaan Sering Diajukan',
            'contact_faq1_q' => 'Bagaimana prosedur pemesanan Jasa Juru Bahasa Isyarat (JBI)?',
            'contact_faq1_a' => 'Pemesanan JBI disarankan diajukan minimal H-3 atau H-7 sebelum hari kegiatan agar tim kami dapat mengonfirmasi jadwal ketersediaan JBI dan mempelajari materi acara. Layanan tersedia secara luring (tatap muka di Pontianak & sekitarnya) maupun daring (Zoom/Live Streaming seluruh Indonesia). Anda dapat mengajukan permohonan melalui formulir di halaman ini atau langsung menghubungi admin WhatsApp kami.',
            'contact_faq2_q' => 'Bagaimana alur pendaftaran santri baru Maktab Tuli & Maktab Autis?',
            'contact_faq2_a' => 'Pendaftaran dapat dilakukan secara online melalui menu \'Daftar\' di bagian atas situs ini atau datang langsung ke kantor yayasan. Setelah pengisian formulir, tim kami akan menjadwalkan sesi observasi/asesmen awal serta konsultasi bersama orang tua calon santri.',
            'contact_faq3_q' => 'Program maktab apa saja yang tersedia di yayasan?',
            'contact_faq3_a' => 'Kami menyelenggarakan Program Pembelajaran Al-Qur\'an Isyarat, Kelas Bahasa Isyarat (BISINDO), Bimbingan Fiqih & Tauhid, Terapi Perkembangan & Kemandirian untuk Anak Autis, serta Pelatihan Kewirausahaan/Karya Inklusi.',
            'contact_faq4_q' => 'Apakah tersedia program beasiswa / bantuan bagi santri prasejahtera?',
            'contact_faq4_a' => 'Ya, Yayasan Bhakti Arumi Delangga memiliki program beasiswa penuh maupun subsidi pendidikan bagi keluarga prasejahtera dan yatim piatu yang didukung oleh program kepedulian sosial yayasan.',
            'contact_faq5_q' => 'Bagaimana jika ingin berkunjung atau menjalin kemitraan sosial?',
            'contact_faq5_a' => 'Kami sangat terbuka untuk kunjungan silaturahmi, studi banding, relawan, maupun kolaborasi CSR instansi. Silakan kirimkan permohonan melalui formulir kontak ini atau hubungi admin WhatsApp kami untuk konfirmasi jadwal.',

            // Identitas Lembaga & Media Sosial Tambahan
            'contact_nama_yayasan' => 'Yayasan Bhakti Arumi Delangga',
            'contact_tagline' => 'Maktab Tuli As-Sami & Maktab Autis',
            'contact_tiktok' => 'https://www.tiktok.com/@maktabtuliassami.id',
            'contact_youtube' => 'https://www.youtube.com/@MaktabTuliAsSami',
            'contact_facebook' => 'https://facebook.com/maktabtuliassami',

            // ── FOOTER WEBSITE ──
            // Kolom 1: Identitas & Media Sosial
            'footer_nama_yayasan' => 'Yayasan Bhakti Arumi Delangga',
            'footer_deskripsi' => 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
            'footer_instagram' => 'https://www.instagram.com/maktabtuliassami.id/',
            'footer_tiktok' => 'https://www.tiktok.com/@maktabtuliassami.id',
            'footer_youtube' => 'https://www.youtube.com/@MaktabTuliAsSami',
            'footer_facebook' => 'https://facebook.com/maktabtuliassami',

            // Kolom 2: Tautan Cepat
            'footer_links_title' => 'Tautan Cepat',
            'footer_link1_text' => 'Beranda',
            'footer_link1_url' => '/',
            'footer_link2_text' => 'Maktab Tuli',
            'footer_link2_url' => '/maktabtuli',
            'footer_link3_text' => 'Berita & Artikel',
            'footer_link3_url' => '/berita',
            'footer_link4_text' => 'Galeri Dokumentasi',
            'footer_link4_url' => '/galeri',
            'footer_link5_text' => 'Kontak Kami',
            'footer_link5_url' => '/kontak',

            // Kolom 3: Program Utama
            'footer_program_title' => 'Program Utama',
            'footer_prog1_text' => 'Maktab Tuli As-Sami',
            'footer_prog1_url' => '/maktabtuli',
            'footer_prog2_text' => 'Maktab Autis & Khusus',
            'footer_prog2_url' => '/daftar',
            'footer_prog3_text' => 'Konseling Parenting Inklusif',
            'footer_prog3_url' => '/kontak',
            'footer_prog4_text' => 'Penerimaan Santri Baru (PSB)',
            'footer_prog4_url' => '/daftar',

            // Kolom 4: Kartu Pendaftaran Santri Baru (CTA)
            'footer_cta_title' => 'Pendaftaran Santri Baru',
            'footer_cta_desc' => 'Pendaftaran santri baru program Maktab Tuli dan Autis kini dibuka secara daring.',
            'footer_cta_btn_text' => 'Isi Formulir Online',
            'footer_cta_btn_link' => '/daftar',

            // Bar Bawah (Bottom Bar)
            'footer_copyright' => '© 2026 Yayasan Bhakti Arumi Delangga. All rights reserved.',
            'footer_slogan' => 'Pusat Pendidikan Islam & Kemandirian Disabilitas Sensorik',
        ];
    }

    /**
     * Get a setting by key with fallback
     */
    public static function get(string $key, $default = null)
    {
        $defaults = self::defaults();
        $fallback = $default ?? ($defaults[$key] ?? null);

        try {
            $setting = self::where('key', $key)->first();
            return ($setting && $setting->value !== null && $setting->value !== '') ? $setting->value : $fallback;
        } catch (\Throwable $e) {
            return $fallback;
        }
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $group = 'general', string $type = 'text'): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
            ]
        );
    }

    /**
     * Get all settings merged with defaults
     */
    public static function getAllGrouped(): array
    {
        $defaults = self::defaults();

        try {
            $saved = self::all()->pluck('value', 'key')->toArray();
        } catch (\Throwable $e) {
            $saved = [];
        }

        $merged = array_merge($defaults, array_filter($saved, function ($val) {
            return $val !== null && $val !== '';
        }));

        return $merged;
    }
}
