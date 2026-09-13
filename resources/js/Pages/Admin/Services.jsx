import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Elements/Sidebar';
import TopBar from '@/Components/Elements/TopBar';

// Helper Component untuk Upload Gambar dengan Live Preview
function ImageUploadBox({ label, desc, fieldName, value, previewUrl, onFileChange, onUrlChange, fallback = '/images/hero_foto.png', tip, height = 'h-48' }) {
    return (
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-xs flex flex-col justify-between space-y-3">
            <div>
                <div className="border-b border-outline-variant/60 pb-2 mb-3">
                    <h4 className="font-headline text-sm font-bold text-on-surface">{label}</h4>
                    {desc && <p className="text-[11px] text-outline mt-0.5">{desc}</p>}
                </div>
                <div className={`relative rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/80 bg-surface-container-low group ${height}`}>
                    <img
                        src={previewUrl || value || fallback}
                        alt={label}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = fallback; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                        <label className="bg-white text-primary px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary hover:text-white transition-colors shadow-md">
                            Pilih Foto Baru
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => onFileChange(e, fieldName)}
                            />
                        </label>
                    </div>
                </div>
                <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-outline mb-1">
                        Atau URL / Path Gambar:
                    </label>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onUrlChange(fieldName, e.target.value)}
                        placeholder={fallback}
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-low focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            {tip && (
                <p className="text-[10px] text-outline bg-surface-container-high/60 px-2.5 py-1.5 rounded-lg leading-relaxed">
                    💡 {tip}
                </p>
            )}
        </div>
    );
}

// 7 Program Belajar Utama Maktab Tuli
const PROGRAM_ITEMS = [
    { num: 1, title: 'Quran Isyarat', badge: 'Program Utama', icon: 'auto_stories', defaultDesc: "Pembelajaran tilawah, tajwid visual, dan tahfidz Al-Qur'an menggunakan standarisasi mushaf bahasa isyarat." },
    { num: 2, title: 'Hadist Isyarat', badge: 'Studi Islam', icon: 'forum', defaultDesc: 'Pemahaman matan hadits-hadits shahih pilihan dan pengamalan adab nabawi harian melalui bahasa isyarat visual.' },
    { num: 3, title: 'Fiqih Isyarat', badge: 'Ibadah Praktis', icon: 'balance', defaultDesc: 'Bimbingan tata cara thaharah, shalat, puasa, dan hukum-hukum muamalah Islam secara aplikatif dan terstruktur.' },
    { num: 4, title: 'Pelajaran Umum', badge: 'Akademik Dasar', icon: 'lightbulb', defaultDesc: 'Penguatan literasi, numerasi, sains terapan, dan wawasan kebangsaan guna memperluas cakrawala berpikir santri.' },
    { num: 5, title: 'PKBM Ijazah Paket', badge: 'Pendidikan Formal', icon: 'verified', defaultDesc: 'Program pendidikan kesetaraan Paket A (SD), B (SMP), dan C (SMA) berijazah resmi negara untuk masa depan santri.' },
    { num: 6, title: 'Persiapan Kuliah', badge: 'Lanjutan Studi', icon: 'school', defaultDesc: 'Bimbingan seleksi masuk perguruan tinggi inklusif, pendampingan beasiswa, dan penguatan kemandirian akademis tinggi.' },
    { num: 7, title: 'Sanggar Seni', badge: 'Kreativitas & Kriya', icon: 'palette', defaultDesc: 'Wadah kreasi seni lukis, kaligrafi Islam, desain grafis, fotografi, dan kriya tangan untuk kemandirian berwirausaha.' },
];

// 6 Fasilitas Pendukung Belajar Maktab Tuli
const FACILITY_ITEMS = [
    { num: 1, title: 'Ruang Kelas Multimedia', icon: 'desktop_windows', defaultDesc: 'Dilengkapi proyektor resolusi tinggi, monitor interaktif, dan pencahayaan optimal untuk kenyamanan visual santri.' },
    { num: 2, title: 'Media Belajar Digital', icon: 'smartphone', defaultDesc: 'Aplikasi kamus isyarat agama, video pembelajaran animasi, dan modul visual yang dapat diulang kapan pun.' },
    { num: 3, title: 'Konseling & Bimbingan', icon: 'favorite', defaultDesc: 'Pendampingan psikologis dan bimbingan kepribadian ramah Tuli guna memperkuat ketangguhan mental dan spiritual.' },
    { num: 4, title: 'Perpustakaan Visual', icon: 'account_balance', defaultDesc: 'Koleksi buku bertutur visual, literasi sejarah Islam infografis, dan referensi akademik ramah disabilitas rungu.' },
    { num: 5, title: 'Area Sosialisasi & Asrama', icon: 'apartment', defaultDesc: 'Lingkungan asrama dan ruang komunal yang nyaman, bersih, dan aman untuk membangun kebersamaan antarsantri.' },
    { num: 6, title: 'Akses Internet Cepat', icon: 'wifi', defaultDesc: 'Jaringan Wi-Fi berkecepatan tinggi untuk menunjang video conference bahasa isyarat dan riset pembelajaran digital.' },
];

export default function Services({ auth, settings = {}, success, status }) {
    const user = auth?.user || { name: 'Admin Utama', email: 'admin@bhaktiarumi.org', role: 'Super Admin' };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // 5 Tab untuk 5 Halaman Publik
    const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'maktabtuli' | 'berita' | 'galeri' | 'kontak'
    const [isSaving, setIsSaving] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(success || status || '');

    // Form State untuk seluruh 5 Halaman Publik
    const [form, setForm] = useState({
        // ── 1. HALAMAN BERANDA ──
        hero_badge: settings.hero_badge || 'Pusat Pendidikan & Perlindungan Inklusif',
        hero_title_line1: settings.hero_title_line1 || 'Yayasan Bhakti',
        hero_title_line2: settings.hero_title_line2 || 'Arumi Delangga',
        hero_description: settings.hero_description || 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
        hero_btn1_text: settings.hero_btn1_text || 'Tentang Yayasan',
        hero_btn1_link: settings.hero_btn1_link || '/maktabtuli',
        hero_btn2_text: settings.hero_btn2_text || 'Daftar Santri',
        hero_btn2_link: settings.hero_btn2_link || '/daftar',
        hero_image: settings.hero_image || '/images/hero_foto.png',
        hero_floating_title: settings.hero_floating_title || 'Santri Inklusif',
        hero_floating_subtitle: settings.hero_floating_subtitle || 'Aktif belajar bersama di MTAS',

        about_title: settings.about_title || 'Dedikasi untuk Inklusi dan Spiritualitas',
        about_description: settings.about_description || 'Didirikan dengan semangat kasih sayang, Yayasan Bhakti Arumi Delangga hadir sebagai jembatan bagi anak-anak berkebutuhan khusus, khususnya teman Tuli dan Autis, untuk mendapatkan hak pendidikan agama dan umum yang setara.',
        about_image1: settings.about_image1 || '/images/image1.png',
        about_image2: settings.about_image2 || '/images/image2.png',
        about_image3: settings.about_image3 || '/images/image3.png',
        about_image4: settings.about_image4 || '/images/image4.png',
        about_sejarah_title: settings.about_sejarah_title || 'Sejarah Singkat & Komitmen',
        about_sejarah_desc: settings.about_sejarah_desc || 'Didirikan sejak tahun 2020 sebagai ikhtiar memperluas akses pembelajaran Al-Qur\'an bahasa isyarat di Pontianak, Kalimantan Barat.',
        about_visi: settings.about_visi || 'Menjadi pusat unggulan pendidikan Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli & Autis yang berakhlak mulia dan mandiri.',
        about_misi_title: settings.about_misi_title || 'Komitmen & Misi Utama',
        about_misi: settings.about_misi || 'Membangun kurikulum tahfidz isyarat, menyelenggarakan terapi kemandirian sensori, dan membina keluarga santri.',

        service1_title: settings.service1_title || 'Maktab Tuli As-Sami',
        service1_tag: settings.service1_tag || 'Pendidikan Al-Qur\'an Isyarat',
        service1_desc: settings.service1_desc || 'Pusat pembelajaran Al-Qur\'an, tajwid isyarat, fiqih ibadah praktis, dan pembinaan akhlak khusus Teman Tuli dengan metode visual terpadu.',
        service1_image: settings.service1_image || '/images/image6.png',
        service1_link: settings.service1_link || '/maktabtuli',

        service2_title: settings.service2_title || 'Maktab Autis & Kemandirian',
        service2_tag: settings.service2_tag || 'Terapi & Kemandirian Ibadah',
        service2_desc: settings.service2_desc || 'Pendampingan sensori motorik, pengenalan rukun Islam, dan pelatihan kemandirian harian agar santri mampu beribadah mandiri.',
        service2_image: settings.service2_image || '/images/image7.png',
        service2_link: settings.service2_link || '/daftar',

        service3_title: settings.service3_title || 'Konseling & Parenting Inklusif',
        service3_tag: settings.service3_tag || 'Pendampingan Keluarga',
        service3_desc: settings.service3_desc || 'Sesi bimbingan berkala bagi para orang tua dan wali santri guna memperkuat ketahanan keluarga dalam mendampingi anak istimewa.',
        service3_image: settings.service3_image || '/images/image8.png',
        service3_link: settings.service3_link || '/kontak',

        stat1_value: settings.stat1_value || '120+',
        stat1_label: settings.stat1_label || 'Santri Inklusif Dibina',
        stat1_desc: settings.stat1_desc || 'Santri Teman Tuli & Autis aktif belajar di lingkungan ramah disabilitas',
        stat2_value: settings.stat2_value || '100%',
        stat2_label: settings.stat2_label || 'Beasiswa Dhuafa & Yatim',
        stat2_desc: settings.stat2_desc || 'Komitmen pendidikan agama berkualitas tanpa membebani keluarga pra-sejahtera',
        stat3_value: settings.stat3_value || '15+',
        stat3_label: settings.stat3_label || 'Ustadz & Terapis Ahli',
        stat3_desc: settings.stat3_desc || 'Pengajar berdedikasi dengan keahlian bahasa isyarat dan stimulasi sensori',
        stat4_value: settings.stat4_value || '4+',
        stat4_label: settings.stat4_label || 'Tahun Berkhidmat',
        stat4_desc: settings.stat4_desc || 'Menjalin silaturahmi, pengabdian sosial, dan advokasi disabilitas berkelanjutan',

        why_badge: settings.why_badge || 'Kenapa Memilih Kami',
        why_title: settings.why_title || 'Mewujudkan Hak Ibadah & Belajar Setara Bagi Setiap Anak',
        why_description: settings.why_description || 'Yayasan Bhakti Arumi Delangga berkomitmen menghadirkan ruang tumbuh yang aman, mengasihi, dan memberdayakan potensi santri berkebutuhan khusus dengan metodologi modern.',
        why_btn1_text: settings.why_btn1_text || 'Profil Maktab Tuli',
        why_btn1_link: settings.why_btn1_link || '/maktabtuli',
        why_btn2_text: settings.why_btn2_text || 'Galeri Santri',
        why_btn2_link: settings.why_btn2_link || '/galeri',
        why_card1_title: settings.why_card1_title || 'Mushaf Isyarat Terstandar',
        why_card1_desc: settings.why_card1_desc || 'Pembelajaran tilawah dan hafalan Al-Qur\'an mengacu pada standarisasi mushaf isyarat resmi dan metode visual terarah.',
        why_card2_title: settings.why_card2_title || 'Pendekatan Holistik & Terapi',
        why_card2_desc: settings.why_card2_desc || 'Menyelaraskan pendidikan keislaman, terapi sensori motorik, dan bimbingan psikologis agar santri berkembang optimal.',
        why_card3_title: settings.why_card3_title || 'Pendidikan Formal Berijazah',
        why_card3_desc: settings.why_card3_desc || 'Dukungan kesetaraan ijazah Paket A, B, dan C resmi negara agar santri memiliki bekal melanjutkan pendidikan ke perguruan tinggi.',
        why_card4_title: settings.why_card4_title || 'Kemandirian Santri & Kriya',
        why_card4_desc: settings.why_card4_desc || 'Pelatihan seni kaligrafi, kriya tangan, dan literasi digital di sanggar kreatif demi membangun kemandirian ekonomi santri.',

        // ── 2. HALAMAN MAKTAB TULI ──
        maktab_hero_badge: settings.maktab_hero_badge || 'Pendidikan Inklusif Berkelanjutan',
        maktab_hero_title: settings.maktab_hero_title || 'Maktab Tuli As-Sami',
        maktab_hero_desc: settings.maktab_hero_desc || 'Pusat pendidikan Al-Qur\'an dan bimbingan agama Islam khusus bagi Teman Tuli, membangun kemandirian spiritual dan intelektual melalui bahasa isyarat serta metode visual terpadu.',
        maktab_profile_image: settings.maktab_profile_image || '/images/image5.png',
        maktab_profile_badge: settings.maktab_profile_badge || 'Profil Lembaga',
        maktab_profile_title: settings.maktab_profile_title || 'Membuka Jendela Dunia Melalui Cahaya Iman',
        maktab_profile_desc1: settings.maktab_profile_desc1 || 'Maktab Tuli As-Sami didirikan dengan tekad untuk menjembatani kesenjangan akses pendidikan agama bagi saudara-saudara kita yang mengalami kendala pendengaran. Kami percaya bahwa Al-Qur\'an adalah rahmat bagi semesta alam, tanpa terkecuali.',
        maktab_profile_desc2: settings.maktab_profile_desc2 || 'Berawal dari kelompok belajar kecil, kini kami bertumbuh menjadi institusi yang mengintegrasikan kurikulum agama tradisional dengan pendekatan teknologi visual modern, memastikan setiap santri dapat memahami esensi Islam dengan cara yang paling efektif bagi mereka.',
        maktab_poin1_title: settings.maktab_poin1_title || 'Kurikulum Visual',
        maktab_poin1_desc: settings.maktab_poin1_desc || 'Disusun sistematis dengan infografis, video interaktif, dan kamus isyarat Al-Qur\'an standar.',
        maktab_poin2_title: settings.maktab_poin2_title || 'Kemandirian Berdikari',
        maktab_poin2_desc: settings.maktab_poin2_desc || 'Membekali santri dengan ijazah formal kesetaraan, keterampilan seni, dan kesiapan masuk dunia kerja/kuliah.',
        maktab_visi_badge: settings.maktab_visi_badge || 'Tujuan Jangka Panjang',
        maktab_visi_title: settings.maktab_visi_title || 'Visi Utama',
        maktab_visi_text: settings.maktab_visi_text || 'Menjadi pusat unggulan pembelajaran Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli di Indonesia yang berakhlak mulia, berilmu amaliah, dan mandiri secara peradaban.',
        maktab_visi_poin1: settings.maktab_visi_poin1 || 'Pusat rujukan terdepan dalam standarisasi pembelajaran Al-Qur\'an dan Hadits berbasis isyarat visual.',
        maktab_visi_poin2: settings.maktab_visi_poin2 || 'Mewujudkan ruang tumbuh kembang yang aman, berdaya, dan setara bagi santri disabilitas rungu.',
        maktab_visi_poin3: settings.maktab_visi_poin3 || 'Membangun generasi muslim Tuli yang percaya diri, mandiri secara ekonomi, dan berkontribusi di masyarakat.',
        maktab_misi_badge: settings.maktab_misi_badge || 'Langkah Strategis',
        maktab_misi_title: settings.maktab_misi_title || 'Misi Lembaga',
        maktab_misi_intro: settings.maktab_misi_intro || 'Mewujudkan layanan pendidikan Islam terpadu, kesetaraan akademik, dan vokasi terapan melalui tiga pilar utama:',
        maktab_misi_poin1_title: settings.maktab_misi_poin1_title || 'Pendidikan Agama',
        maktab_misi_poin1_desc: settings.maktab_misi_poin1_desc || 'Menyelenggarakan tilawah Al-Qur\'an, Hadits, dan Fiqih berbasis isyarat baku (BISINDO) serta media interaktif.',
        maktab_misi_poin2_title: settings.maktab_misi_poin2_title || 'Kesetaraan Formal',
        maktab_misi_poin2_desc: settings.maktab_misi_poin2_desc || 'Memfasilitasi program PKBM berijazah resmi negara serta bimbingan intensif persiapan masuk universitas.',
        maktab_misi_poin3_title: settings.maktab_misi_poin3_title || 'Kemandirian Vokasi',
        maktab_misi_poin3_desc: settings.maktab_misi_poin3_desc || 'Mengembangkan bakat sanggar seni, kriya, teknologi digital, dan wirausaha kreatif santri.',
        maktab_misi_text: settings.maktab_misi_text || "1. Mengembangkan kurikulum tahfidz dan tafsir Al-Qur'an berbasis isyarat visual standar nusantara.\n2. Memberikan pembinaan akhlak mulia dan akidah shahihah sesuai tuntunan Rasulullah SAW.\n3. Menyelenggarakan pendidikan akademik formal kesetaraan Paket A, B, dan C berijazah negara.\n4. Melatih keterampilan hidup, kriya mandiri, dan literasi digital agar santri mandiri berdaya.",
        maktab_program_badge: settings.maktab_program_badge || 'KURIKULUM TERSTRUKTUR',
        maktab_program_title: settings.maktab_program_title || '7 Program Belajar Utama',
        maktab_program_desc: settings.maktab_program_desc || 'Dirancang komprehensif memadukan studi keislaman, penguatan akademis, dan kesiapan kemandirian masa depan santri.',
        maktab_prog1_title: settings.maktab_prog1_title || 'Quran Isyarat',
        maktab_prog1_badge: settings.maktab_prog1_badge || 'Program Utama',
        maktab_prog1_desc: settings.maktab_prog1_desc || "Pembelajaran tilawah, tajwid visual, dan tahfidz Al-Qur'an menggunakan standarisasi mushaf bahasa isyarat.",
        maktab_prog1_btn: settings.maktab_prog1_btn || 'Program Aktif MTAS',
        maktab_prog2_title: settings.maktab_prog2_title || 'Hadist Isyarat',
        maktab_prog2_badge: settings.maktab_prog2_badge || 'Studi Islam',
        maktab_prog2_desc: settings.maktab_prog2_desc || 'Pemahaman matan hadits-hadits shahih pilihan dan pengamalan adab nabawi harian melalui bahasa isyarat visual.',
        maktab_prog2_btn: settings.maktab_prog2_btn || 'Program Aktif MTAS',
        maktab_prog3_title: settings.maktab_prog3_title || 'Fiqih Isyarat',
        maktab_prog3_badge: settings.maktab_prog3_badge || 'Ibadah Praktis',
        maktab_prog3_desc: settings.maktab_prog3_desc || 'Bimbingan tata cara thaharah, shalat, puasa, dan hukum-hukum muamalah Islam secara aplikatif dan terstruktur.',
        maktab_prog3_btn: settings.maktab_prog3_btn || 'Program Aktif MTAS',
        maktab_prog4_title: settings.maktab_prog4_title || 'Pelajaran Umum',
        maktab_prog4_badge: settings.maktab_prog4_badge || 'Akademik Dasar',
        maktab_prog4_desc: settings.maktab_prog4_desc || 'Penguatan literasi, numerasi, sains terapan, dan wawasan kebangsaan guna memperluas cakrawala berpikir santri.',
        maktab_prog4_btn: settings.maktab_prog4_btn || 'Program Aktif MTAS',
        maktab_prog5_title: settings.maktab_prog5_title || 'PKBM Ijazah Paket',
        maktab_prog5_badge: settings.maktab_prog5_badge || 'Pendidikan Formal',
        maktab_prog5_desc: settings.maktab_prog5_desc || 'Program pendidikan kesetaraan Paket A (SD), B (SMP), dan C (SMA) berijazah resmi negara untuk masa depan santri.',
        maktab_prog5_btn: settings.maktab_prog5_btn || 'Program Aktif MTAS',
        maktab_prog6_title: settings.maktab_prog6_title || 'Persiapan Kuliah',
        maktab_prog6_badge: settings.maktab_prog6_badge || 'Lanjutan Studi',
        maktab_prog6_desc: settings.maktab_prog6_desc || 'Bimbingan seleksi masuk perguruan tinggi inklusif, pendampingan beasiswa, dan penguatan kemandirian akademis tinggi.',
        maktab_prog6_btn: settings.maktab_prog6_btn || 'Program Aktif MTAS',
        maktab_prog7_title: settings.maktab_prog7_title || 'Sanggar Seni',
        maktab_prog7_badge: settings.maktab_prog7_badge || 'Kreativitas & Kriya',
        maktab_prog7_desc: settings.maktab_prog7_desc || 'Wadah kreasi seni lukis, kaligrafi Islam, desain grafis, fotografi, dan kriya tangan untuk kemandirian berwirausaha.',
        maktab_fasilitas_badge: settings.maktab_fasilitas_badge || 'SARANA & PRASARANA',
        maktab_fasilitas_title: settings.maktab_fasilitas_title || 'Fasilitas Pendukung Belajar',
        maktab_fasilitas_desc: settings.maktab_fasilitas_desc || 'Kenyamanan dan kelengkapan fasilitas adalah prioritas utama kami demi mendukung proses belajar santri yang optimal.',
        maktab_fac1_title: settings.maktab_fac1_title || 'Ruang Kelas Multimedia',
        maktab_fac1_desc: settings.maktab_fac1_desc || 'Dilengkapi proyektor resolusi tinggi, monitor interaktif, dan pencahayaan optimal untuk kenyamanan visual santri.',
        maktab_fac2_title: settings.maktab_fac2_title || 'Media Belajar Digital',
        maktab_fac2_desc: settings.maktab_fac2_desc || 'Aplikasi kamus isyarat agama, video pembelajaran animasi, dan modul visual yang dapat diulang kapan pun.',
        maktab_fac3_title: settings.maktab_fac3_title || 'Konseling & Bimbingan',
        maktab_fac3_desc: settings.maktab_fac3_desc || 'Pendampingan psikologis dan bimbingan kepribadian ramah Tuli guna memperkuat ketangguhan mental dan spiritual.',
        maktab_fac4_title: settings.maktab_fac4_title || 'Perpustakaan Visual',
        maktab_fac4_desc: settings.maktab_fac4_desc || 'Koleksi buku bertutur visual, literasi sejarah Islam infografis, dan referensi akademik ramah disabilitas rungu.',
        maktab_fac5_title: settings.maktab_fac5_title || 'Area Sosialisasi & Asrama',
        maktab_fac5_desc: settings.maktab_fac5_desc || 'Lingkungan asrama dan ruang komunal yang nyaman, bersih, dan aman untuk membangun kebersamaan antarsantri.',
        maktab_fac6_title: settings.maktab_fac6_title || 'Akses Internet Cepat',
        maktab_fac6_desc: settings.maktab_fac6_desc || 'Jaringan Wi-Fi berkecepatan tinggi untuk menunjang video conference bahasa isyarat dan riset pembelajaran digital.',

        // ── 3. HALAMAN BERITA ──
        berita_header_badge: settings.berita_header_badge || 'Kabar & Informasi Terkini',
        berita_header_title: settings.berita_header_title || 'Berita Yayasan',
        berita_header_desc: settings.berita_header_desc || 'Informasi, agenda kegiatan, dan kabar terkini seputar program pendidikan dan sosial Yayasan Bhakti Arumi Delangga.',

        // ── 4. HALAMAN GALERI ──
        galeri_header_badge: settings.galeri_header_badge || 'Dokumentasi & Arsip Kegiatan',
        galeri_header_title: settings.galeri_header_title || 'Galeri Yayasan',
        galeri_header_desc: settings.galeri_header_desc || 'Dokumentasi penuh makna dari setiap langkah dan senyuman adik-adik santri Yayasan Bhakti Arumi Delangga dalam mewujudkan pendidikan inklusif yang berkelanjutan.',

        // ── 5. HALAMAN KONTAK (4 KARTU KONTAK UTAMA) ──
        contact_header_badge: settings.contact_header_badge || 'Pusat Layanan & Informasi',
        contact_header_title: settings.contact_header_title || 'Kontak Yayasan Bhakti Arumi',
        contact_header_desc: settings.contact_header_desc || 'Kami siap mendengar, berdiskusi, dan membantu menjawab pertanyaan seputar program pendidikan serta pendaftaran santri.',

        // Kartu 1: Alamat Kantor
        contact_card1_badge: settings.contact_card1_badge || 'Kantor & Asrama',
        contact_card1_title: settings.contact_card1_title || 'Alamat Kantor',
        contact_card1_btn: settings.contact_card1_btn || 'Lihat di Peta',
        contact_address: settings.contact_address || 'Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124',

        // Section Lokasi & Peta Google Maps
        contact_maps_badge: settings.contact_maps_badge || 'Lokasi Fisik',
        contact_maps_title: settings.contact_maps_title || 'Lokasi & Akses Yayasan',
        contact_maps_desc: settings.contact_maps_desc || 'Kunjungi langsung asrama dan kantor Maktab Tuli As-Sami / Yayasan Bhakti Arumi Delangga di Pontianak.',
        contact_maps_copy_btn: settings.contact_maps_copy_btn || 'Salin Alamat',
        contact_maps_btn: settings.contact_maps_btn || 'Buka di Google Maps',
        contact_maps_link: settings.contact_maps_link || 'https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak',
        contact_maps_embed: settings.contact_maps_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid',

        // Kartu 2: Telepon & WhatsApp
        contact_card2_badge: settings.contact_card2_badge || 'Senin - Sabtu: 08:00 - 16:30 WIB',
        contact_card2_title: settings.contact_card2_title || 'Telepon & WhatsApp',
        contact_card2_btn: settings.contact_card2_btn || 'Chat WhatsApp',
        contact_phone: settings.contact_phone || '+62 812-3456-7890',
        contact_whatsapp: settings.contact_whatsapp || '081234567890',
        contact_hours: settings.contact_hours || 'Senin - Sabtu: 08:00 - 16:30 WIB',

        // Kartu 3: Email Resmi
        contact_card3_badge: settings.contact_card3_badge || 'Respon Cepat',
        contact_card3_title: settings.contact_card3_title || 'Email Resmi',
        contact_card3_btn: settings.contact_card3_btn || 'Kirim Email',
        contact_email: settings.contact_email || 'info@bhaktiarumi.org',

        // Kartu 4: Instagram Resmi
        contact_card4_badge: settings.contact_card4_badge || 'Dokumentasi',
        contact_card4_title: settings.contact_card4_title || 'Instagram Resmi',
        contact_card4_btn: settings.contact_card4_btn || 'Buka Instagram',
        contact_instagram_handle: settings.contact_instagram_handle || '@maktabtuliassami.id',
        contact_instagram: settings.contact_instagram || 'https://www.instagram.com/maktabtuliassami.id/',

        // Identitas Lembaga & Media Sosial Lainnya
        contact_nama_yayasan: settings.contact_nama_yayasan || 'Yayasan Bhakti Arumi Delangga',
        contact_tagline: settings.contact_tagline || 'Maktab Tuli As-Sami & Maktab Autis',
        contact_tiktok: settings.contact_tiktok || 'https://www.tiktok.com/@maktabtuliassami.id',
        contact_youtube: settings.contact_youtube || 'https://www.youtube.com/@MaktabTuliAsSami',
        contact_facebook: settings.contact_facebook || 'https://facebook.com/maktabtuliassami',

        // Layanan Juru Bahasa Isyarat (JBI)
        contact_jbi_badge: settings.contact_jbi_badge || 'Aksesibilitas & Inklusi Komunikasi',
        contact_jbi_title: settings.contact_jbi_title || 'Jasa Layanan Juru Bahasa Isyarat (JBI)',
        contact_jbi_desc: settings.contact_jbi_desc || 'Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional untuk menjembatani komunikasi yang setara dan inklusif antara Teman Dengar dan Teman Tuli dalam berbagai agenda resmi, keagamaan, pendidikan, maupun publik.',
        contact_jbi_btn_wa: settings.contact_jbi_btn_wa || 'Reservasi via WhatsApp',
        contact_jbi_btn_form: settings.contact_jbi_btn_form || 'Isi Form Permohonan',
        contact_jbi_item1_title: settings.contact_jbi_item1_title || 'Seminar & Konferensi',
        contact_jbi_item1_desc: settings.contact_jbi_item1_desc || 'Penerjemahan langsung untuk webinar, seminar nasional, rapat dinas, dan pelatihan korporasi.',
        contact_jbi_item2_title: settings.contact_jbi_item2_title || 'Kajian & Keagamaan',
        contact_jbi_item2_desc: settings.contact_jbi_item2_desc || "Penerjemahan khutbah Jum'at, pengajian akbar, kajian tematik Islam, akad nikah, dan tabligh.",
        contact_jbi_item3_title: settings.contact_jbi_item3_title || 'Formal & Pendampingan',
        contact_jbi_item3_desc: settings.contact_jbi_item3_desc || 'Pendampingan sidang akademik/skripsi, konsultasi medis di faskes, serta urusan kedinasan.',
        contact_jbi_item4_title: settings.contact_jbi_item4_title || 'Media & Konten Digital',
        contact_jbi_item4_desc: settings.contact_jbi_item4_desc || 'Penerjemah visual PIP (Picture-in-Picture) video promosi, siaran TV/streaming, dan takarir isyarat.',
        contact_jbi_point1: settings.contact_jbi_point1 || 'Standar BISINDO & Bahasa Isyarat Agama',
        contact_jbi_point2: settings.contact_jbi_point2 || 'Tersedia Format Luring & Daring (Zoom / Live)',
        contact_jbi_point3: settings.contact_jbi_point3 || 'Penerjemah Berpengalaman & Beretika',

        // 5. Kontak - FAQ Accordion
        contact_faq_title: settings.contact_faq_title || 'Pertanyaan Sering Diajukan',
        contact_faq1_q: settings.contact_faq1_q || 'Bagaimana prosedur pemesanan Jasa Juru Bahasa Isyarat (JBI)?',
        contact_faq1_a: settings.contact_faq1_a || 'Pemesanan JBI disarankan diajukan minimal H-3 atau H-7 sebelum hari kegiatan agar tim kami dapat mengonfirmasi jadwal ketersediaan JBI dan mempelajari materi acara. Layanan tersedia secara luring (tatap muka di Pontianak & sekitarnya) maupun daring (Zoom/Live Streaming seluruh Indonesia). Anda dapat mengajukan permohonan melalui formulir di halaman ini atau langsung menghubungi admin WhatsApp kami.',
        contact_faq2_q: settings.contact_faq2_q || 'Bagaimana alur pendaftaran santri baru Maktab Tuli & Maktab Autis?',
        contact_faq2_a: settings.contact_faq2_a || 'Pendaftaran dapat dilakukan secara online melalui menu \'Daftar\' di bagian atas situs ini atau datang langsung ke kantor yayasan. Setelah pengisian formulir, tim kami akan menjadwalkan sesi observasi/asesmen awal serta konsultasi bersama orang tua calon santri.',
        contact_faq3_q: settings.contact_faq3_q || 'Program maktab apa saja yang tersedia di yayasan?',
        contact_faq3_a: settings.contact_faq3_a || 'Kami menyelenggarakan Program Pembelajaran Al-Qur\'an Isyarat, Kelas Bahasa Isyarat (BISINDO), Bimbingan Fiqih & Tauhid, Terapi Perkembangan & Kemandirian untuk Anak Autis, serta Pelatihan Kewirausahaan/Karya Inklusi.',
        contact_faq4_q: settings.contact_faq4_q || 'Apakah tersedia program beasiswa / bantuan bagi santri prasejahtera?',
        contact_faq4_a: settings.contact_faq4_a || 'Ya, Yayasan Bhakti Arumi Delangga memiliki program beasiswa penuh maupun subsidi pendidikan bagi keluarga prasejahtera dan yatim piatu yang didukung oleh program kepedulian sosial yayasan.',
        contact_faq5_q: settings.contact_faq5_q || 'Bagaimana jika ingin berkunjung atau menjalin kemitraan sosial?',
        contact_faq5_a: settings.contact_faq5_a || 'Kami sangat terbuka untuk kunjungan silaturahmi, studi banding, relawan, maupun kolaborasi CSR instansi. Silakan kirimkan permohonan melalui formulir kontak ini atau hubungi admin WhatsApp kami untuk konfirmasi jadwal.',

        // ── 6. FOOTER WEBSITE ──
        // Kolom 1: Identitas Lembaga & Media Sosial
        footer_nama_yayasan: settings.footer_nama_yayasan || settings.contact_nama_yayasan || 'Yayasan Bhakti Arumi Delangga',
        footer_deskripsi: settings.footer_deskripsi || 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
        footer_instagram: settings.footer_instagram || settings.contact_instagram || 'https://www.instagram.com/maktabtuliassami.id/',
        footer_tiktok: settings.footer_tiktok || settings.contact_tiktok || 'https://www.tiktok.com/@maktabtuliassami.id',
        footer_youtube: settings.footer_youtube || settings.contact_youtube || 'https://www.youtube.com/@MaktabTuliAsSami',
        footer_facebook: settings.footer_facebook || settings.contact_facebook || 'https://facebook.com/maktabtuliassami',

        // Kolom 2: Tautan Cepat
        footer_links_title: settings.footer_links_title || 'Tautan Cepat',
        footer_link1_text: settings.footer_link1_text || 'Beranda',
        footer_link1_url: settings.footer_link1_url || '/',
        footer_link2_text: settings.footer_link2_text || 'Maktab Tuli',
        footer_link2_url: settings.footer_link2_url || '/maktabtuli',
        footer_link3_text: settings.footer_link3_text || 'Berita & Artikel',
        footer_link3_url: settings.footer_link3_url || '/berita',
        footer_link4_text: settings.footer_link4_text || 'Galeri Dokumentasi',
        footer_link4_url: settings.footer_link4_url || '/galeri',
        footer_link5_text: settings.footer_link5_text || 'Kontak Kami',
        footer_link5_url: settings.footer_link5_url || '/kontak',

        // Kolom 3: Program Utama
        footer_program_title: settings.footer_program_title || 'Program Utama',
        footer_prog1_text: settings.footer_prog1_text || 'Maktab Tuli As-Sami',
        footer_prog1_url: settings.footer_prog1_url || '/maktabtuli',
        footer_prog2_text: settings.footer_prog2_text || 'Maktab Autis & Khusus',
        footer_prog2_url: settings.footer_prog2_url || '/daftar',
        footer_prog3_text: settings.footer_prog3_text || 'Konseling Parenting Inklusif',
        footer_prog3_url: settings.footer_prog3_url || '/kontak',
        footer_prog4_text: settings.footer_prog4_text || 'Penerimaan Santri Baru (PSB)',
        footer_prog4_url: settings.footer_prog4_url || '/daftar',

        // Kolom 4: Kartu Pendaftaran Santri Baru (CTA)
        footer_cta_title: settings.footer_cta_title || 'Pendaftaran Santri Baru',
        footer_cta_desc: settings.footer_cta_desc || 'Pendaftaran santri baru program Maktab Tuli dan Autis kini dibuka secara daring.',
        footer_cta_btn_text: settings.footer_cta_btn_text || 'Isi Formulir Online',
        footer_cta_btn_link: settings.footer_cta_btn_link || '/daftar',

        // Bar Bawah (Bottom Bar)
        footer_copyright: settings.footer_copyright || '© 2026 Yayasan Bhakti Arumi Delangga. All rights reserved.',
        footer_slogan: settings.footer_slogan || 'Pusat Pendidikan Islam & Kemandirian Disabilitas Sensorik',
    });

    // File preview states for newly selected files
    const [fileUploads, setFileUploads] = useState({});
    const [previewUrls, setPreviewUrls] = useState({});

    // Handle text input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle direct URL input for images
    const handleUrlChange = (fieldName, value) => {
        setForm(prev => ({ ...prev, [fieldName]: value }));
    };

    // Handle image file selection
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFileUploads(prev => ({ ...prev, [fieldName]: file }));
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({ ...prev, [fieldName]: url }));
        }
    };

    // Submit all settings
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        // Append text fields
        Object.keys(form).forEach(key => {
            formData.append(key, form[key] || '');
        });

        // Append file uploads
        Object.keys(fileUploads).forEach(key => {
            if (fileUploads[key]) {
                formData.append(key, fileUploads[key]);
            }
        });

        router.post('/admin/services', formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsSaving(false);
                setToastMessage('Alhamdulillah! Seluruh pengaturan foto dan tulisan 5 halaman berhasil disimpan.');
                setTimeout(() => setToastMessage(''), 5000);
            },
            onError: () => {
                setIsSaving(false);
                alert('Terjadi kesalahan saat menyimpan pengaturan. Pastikan format file gambar sesuai (Maks 10MB).');
            }
        });
    };

    // Reset to defaults
    const handleResetDefaults = () => {
        setIsSaving(true);
        router.post('/admin/services/reset', {}, {
            onSuccess: () => {
                setIsSaving(false);
                setShowResetModal(false);
                window.location.reload();
            }
        });
    };

    // 6 Tab: 5 Halaman Publik + Footer
    const tabs = [
        { id: 'beranda', name: '1. Beranda', icon: 'home', pageUrl: '/', desc: 'Hero banner, tentang yayasan, 4 foto kolase & statistik dampak' },
        { id: 'maktabtuli', name: '2. Maktab Tuli', icon: 'hearing', pageUrl: '/maktabtuli', desc: 'Hero banner, foto profil lembaga, visi & misi, kurikulum' },
        { id: 'berita', name: '3. Berita', icon: 'newspaper', pageUrl: '/berita', desc: 'Header banner berita, badge, judul & deskripsi pengantar' },
        { id: 'galeri', name: '4. Galeri', icon: 'photo_library', pageUrl: '/galeri', desc: 'Header banner galeri & foto acara sorotan utama (featured)' },
        { id: 'kontak', name: '5. Kontak', icon: 'contact_support', pageUrl: '/kontak', desc: 'Header, 4 kartu kontak, Layanan JBI, FAQ Accordion, maps & medsos' },
        { id: 'footer', name: '6. Footer', icon: 'dock_to_bottom', pageUrl: '/', desc: 'Identitas profil, media sosial, tautan cepat, program & banner pendaftaran' },
    ];

    return (
        <>
            <Head title="Manajemen Konten Website & Footer - Admin Bhakti Arumi" />

            <div className="flex h-screen overflow-hidden bg-surface font-sans text-on-surface antialiased">
                {/* Sidebar */}
                <Sidebar
                    activeNav="Services"
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* TopBar */}
                    <TopBar
                        user={user}
                        title="Pengaturan Konten 5 Halaman"
                        setMobileMenuOpen={setMobileMenuOpen}
                    />

                    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                        
                        {/* Notification Toast */}
                        {toastMessage && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-xs transition-all animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                                    <p className="font-semibold text-sm">{toastMessage}</p>
                                </div>
                                <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900 p-1">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}

                        {/* Page Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">view_quilt</span>
                                </div>
                                <div>
                                    <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                                        Pengaturan Konten 5 Halaman Website
                                    </h1>
                                    <p className="text-xs sm:text-sm text-outline mt-0.5">
                                        Setiap foto, tulisan, judul, dan tautan di 5 halaman publik dapat Anda ubah secara langsung di sini.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                <a
                                    href={tabs.find(t => t.id === activeTab)?.pageUrl || '/'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant transition-all shadow-2xs"
                                >
                                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    <span>Buka Halaman Ini</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10 border border-error/20 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                    <span>Reset Standar</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {isSaving ? 'sync' : 'save'}
                                    </span>
                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Halaman'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs: 6 Tab (5 Halaman + 1 Footer) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-white text-primary font-bold shadow-xs border border-outline-variant/60'
                                                : 'text-outline hover:text-on-surface hover:bg-white/50'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`}>
                                            {tab.icon}
                                        </span>
                                        <div className="truncate">
                                            <p className="text-xs truncate font-semibold">{tab.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 1: HALAMAN BERANDA                                          */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'beranda' && (
                            <div className="space-y-6">
                                {/* Hero Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                    <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                        <div className="border-b border-outline-variant/60 pb-3">
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                                                Teks &amp; Tombol Aksi Hero (Bagian Atas Beranda)
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Informasi utama yang pertama kali dilihat oleh pengunjung website yayasan.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Badge Kecil
                                            </label>
                                            <input
                                                type="text"
                                                name="hero_badge"
                                                value={form.hero_badge}
                                                onChange={handleChange}
                                                placeholder="Contoh: Pusat Pendidikan & Perlindungan Inklusif"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Baris 1 (Oranye/Gelap)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="hero_title_line1"
                                                    value={form.hero_title_line1}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: Yayasan Bhakti"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Baris 2 (Biru Utama)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="hero_title_line2"
                                                    value={form.hero_title_line2}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: Arumi Delangga"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Paragraf Deskripsi Hero
                                            </label>
                                            <textarea
                                                rows={3}
                                                name="hero_description"
                                                value={form.hero_description}
                                                onChange={handleChange}
                                                placeholder="Tuliskan visi singkat yang ditampilkan di bagian atas..."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary leading-relaxed"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-primary">Tombol Utama 1 (Biru)</p>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Label Tombol</label>
                                                    <input
                                                        type="text"
                                                        name="hero_btn1_text"
                                                        value={form.hero_btn1_text}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Tautan / URL Tujuan</label>
                                                    <input
                                                        type="text"
                                                        name="hero_btn1_link"
                                                        value={form.hero_btn1_link}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-slate-800">Tombol Kedua 2 (Outline)</p>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Label Tombol</label>
                                                    <input
                                                        type="text"
                                                        name="hero_btn2_text"
                                                        value={form.hero_btn2_text}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Tautan / URL Tujuan</label>
                                                    <input
                                                        type="text"
                                                        name="hero_btn2_link"
                                                        value={form.hero_btn2_link}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge Melayang Foto Hero (Disatukan di kartu hero) */}
                                        <div className="pt-4 border-t border-outline-variant/60 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">diversity_3</span>
                                                    Badge Melayang Foto Hero
                                                </h4>
                                                <span className="text-[11px] text-outline">
                                                    Kartu badge yang mengambang di sudut bawah foto hero beranda
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                                <div className="space-y-2.5">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                            Judul Badge
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="hero_floating_title"
                                                            value={form.hero_floating_title}
                                                            onChange={handleChange}
                                                            placeholder="Santri Inklusif"
                                                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                            Keterangan / Subjudul Badge
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="hero_floating_subtitle"
                                                            value={form.hero_floating_subtitle}
                                                            onChange={handleChange}
                                                            placeholder="Aktif belajar bersama di MTAS"
                                                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Live Preview Badge */}
                                                <div className="p-3.5 rounded-xl border border-dashed border-outline-variant bg-surface-container-low flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
                                                        Pratinjau Tampilan:
                                                    </p>
                                                    <div className="inline-flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-md border border-slate-100 w-full">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#025EDB] flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-[22px]">diversity_3</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-black text-[#025EDB] truncate leading-tight">
                                                                {form.hero_floating_title || 'Santri Inklusif'}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                                                {form.hero_floating_subtitle || 'Aktif belajar bersama di MTAS'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Foto Hero */}
                                    <ImageUploadBox
                                        label="Foto Utama Hero"
                                        desc="Foto santri/kegiatan yang tampil di sisi kanan banner beranda."
                                        fieldName="hero_image"
                                        value={form.hero_image}
                                        previewUrl={previewUrls.hero_image}
                                        onFileChange={handleFileChange}
                                        onUrlChange={handleUrlChange}
                                        fallback="/images/hero_foto.png"
                                        height="h-64 sm:h-72"
                                        tip="Gunakan foto portrait atau landscape dengan rasio 4:3 / 1:1 resolusi minimal 800x800px (format PNG/JPG)."
                                    />
                                </div>

                                {/* Tentang Yayasan & Kolase */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                                            Profil &amp; Narasi Tentang Yayasan (Beranda)
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Teks perkenalan, sejarah, dan visi misi pada section kedua beranda.
                                        </p>
                                    </div>

                                    {/* 1. Judul Utama (Full Width) */}
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Judul Utama Tentang Yayasan
                                        </label>
                                        <input
                                            type="text"
                                            name="about_title"
                                            value={form.about_title}
                                            onChange={handleChange}
                                            placeholder="Contoh: Dedikasi untuk Inklusi dan Spiritualitas"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    {/* 2. Paragraf Narasi Utama (Full Width) */}
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Paragraf Narasi Utama
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="about_description"
                                            value={form.about_description}
                                            onChange={handleChange}
                                            placeholder="Tuliskan narasi perkenalan dan komitmen yayasan..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary leading-relaxed"
                                        ></textarea>
                                    </div>

                                    {/* 3. 2 Input Judul Sub (Grid 2 Kolom) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Sub 1 (Sejarah Singkat)
                                            </label>
                                            <input
                                                type="text"
                                                name="about_sejarah_title"
                                                value={form.about_sejarah_title}
                                                onChange={handleChange}
                                                placeholder="Contoh: Sejarah Singkat & Komitmen"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Sub 2 (Komitmen / Misi Utama)
                                            </label>
                                            <input
                                                type="text"
                                                name="about_misi_title"
                                                value={form.about_misi_title}
                                                onChange={handleChange}
                                                placeholder="Contoh: Komitmen & Misi Utama"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* 4. 2 Input Deskripsi untuk 2 Judul Sub di atas (Grid 2 Kolom) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Deskripsi Sub 1 (Sejarah Singkat)
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="about_sejarah_desc"
                                                value={form.about_sejarah_desc}
                                                onChange={handleChange}
                                                placeholder="Tuliskan sejarah berdirinya yayasan..."
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary leading-relaxed"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Deskripsi Sub 2 (Komitmen / Misi Utama)
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="about_misi"
                                                value={form.about_misi}
                                                onChange={handleChange}
                                                placeholder="Tuliskan komitmen atau misi utama yayasan..."
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary leading-relaxed"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* 4 Kolase Foto */}
                                    <div className="pt-4 border-t border-outline-variant/60">
                                        <h4 className="font-headline text-sm font-bold text-on-surface mb-3">
                                            4 Foto Kolase Tentang Yayasan
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <ImageUploadBox
                                                label="Kolase 1 (Kiri Atas - Biru)"
                                                fieldName="about_image1"
                                                value={form.about_image1}
                                                previewUrl={previewUrls.about_image1}
                                                onFileChange={handleFileChange}
                                                onUrlChange={handleUrlChange}
                                                fallback="/images/image1.png"
                                                height="h-36"
                                            />
                                            <ImageUploadBox
                                                label="Kolase 2 (Kiri Bawah - Oranye)"
                                                fieldName="about_image2"
                                                value={form.about_image2}
                                                previewUrl={previewUrls.about_image2}
                                                onFileChange={handleFileChange}
                                                onUrlChange={handleUrlChange}
                                                fallback="/images/image2.png"
                                                height="h-36"
                                            />
                                            <ImageUploadBox
                                                label="Kolase 3 (Kanan Atas)"
                                                fieldName="about_image3"
                                                value={form.about_image3}
                                                previewUrl={previewUrls.about_image3}
                                                onFileChange={handleFileChange}
                                                onUrlChange={handleUrlChange}
                                                fallback="/images/image3.png"
                                                height="h-36"
                                            />
                                            <ImageUploadBox
                                                label="Kolase 4 (Kanan Bawah)"
                                                fieldName="about_image4"
                                                value={form.about_image4}
                                                previewUrl={previewUrls.about_image4}
                                                onFileChange={handleFileChange}
                                                onUrlChange={handleUrlChange}
                                                fallback="/images/image4.png"
                                                height="h-36"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Statistik Dampak Beranda */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                                            4 Angka Statistik Dampak (Beranda)
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Angka capaian dan bukti komitmen nyata yayasan bagi masyarakat.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Stat 1 */}
                                        <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2">
                                            <span className="text-xs font-bold text-primary">Statistik 1</span>
                                            <input
                                                type="text"
                                                name="stat1_value"
                                                value={form.stat1_value}
                                                onChange={handleChange}
                                                placeholder="120+"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                            />
                                            <input
                                                type="text"
                                                name="stat1_label"
                                                value={form.stat1_label}
                                                onChange={handleChange}
                                                placeholder="Santri Inklusif Dibina"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold"
                                            />
                                            <textarea
                                                rows={2}
                                                name="stat1_desc"
                                                value={form.stat1_desc}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                            ></textarea>
                                        </div>

                                        {/* Stat 2 */}
                                        <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2">
                                            <span className="text-xs font-bold text-[#D38B1D]">Statistik 2</span>
                                            <input
                                                type="text"
                                                name="stat2_value"
                                                value={form.stat2_value}
                                                onChange={handleChange}
                                                placeholder="100%"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                            />
                                            <input
                                                type="text"
                                                name="stat2_label"
                                                value={form.stat2_label}
                                                onChange={handleChange}
                                                placeholder="Beasiswa Dhuafa & Yatim"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold"
                                            />
                                            <textarea
                                                rows={2}
                                                name="stat2_desc"
                                                value={form.stat2_desc}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                            ></textarea>
                                        </div>

                                        {/* Stat 3 */}
                                        <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2">
                                            <span className="text-xs font-bold text-[#0048AB]">Statistik 3</span>
                                            <input
                                                type="text"
                                                name="stat3_value"
                                                value={form.stat3_value}
                                                onChange={handleChange}
                                                placeholder="15+"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                            />
                                            <input
                                                type="text"
                                                name="stat3_label"
                                                value={form.stat3_label}
                                                onChange={handleChange}
                                                placeholder="Ustadz & Terapis Ahli"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold"
                                            />
                                            <textarea
                                                rows={2}
                                                name="stat3_desc"
                                                value={form.stat3_desc}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                            ></textarea>
                                        </div>

                                        {/* Stat 4 */}
                                        <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2">
                                            <span className="text-xs font-bold text-[#BE185D]">Statistik 4</span>
                                            <input
                                                type="text"
                                                name="stat4_value"
                                                value={form.stat4_value}
                                                onChange={handleChange}
                                                placeholder="4+"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                            />
                                            <input
                                                type="text"
                                                name="stat4_label"
                                                value={form.stat4_label}
                                                onChange={handleChange}
                                                placeholder="Tahun Berkhidmat"
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold"
                                            />
                                            <textarea
                                                rows={2}
                                                name="stat4_desc"
                                                value={form.stat4_desc}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Kenapa Memilih Kami / Nilai Keunggulan Beranda */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-5">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                            Kenapa Memilih Kami / Nilai Keunggulan (Beranda)
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Bagian narasi komitmen dan 4 pilar keunggulan yayasan yang tampil di bawah statistik dampak.
                                        </p>
                                    </div>

                                    {/* Bagian Banner Pengantar & Tombol Aksi */}
                                    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
                                        <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wider">
                                            Banner Pengantar &amp; Tombol Aksi
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="sm:col-span-1">
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Teks Badge
                                                </label>
                                                <input
                                                    type="text"
                                                    name="why_badge"
                                                    value={form.why_badge}
                                                    onChange={handleChange}
                                                    placeholder="Kenapa Memilih Kami"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Utama Section
                                                </label>
                                                <input
                                                    type="text"
                                                    name="why_title"
                                                    value={form.why_title}
                                                    onChange={handleChange}
                                                    placeholder="Mewujudkan Hak Ibadah & Belajar Setara Bagi Setiap Anak"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Paragraf Deskripsi Komitmen
                                            </label>
                                            <textarea
                                                rows={3}
                                                name="why_description"
                                                value={form.why_description}
                                                onChange={handleChange}
                                                placeholder="Yayasan Bhakti Arumi Delangga berkomitmen menghadirkan ruang tumbuh yang aman..."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary leading-relaxed"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/50">
                                            {/* Tombol 1 */}
                                            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2.5">
                                                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">touch_app</span>
                                                    Tombol 1 (Biru Utama)
                                                </p>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Label Tombol</label>
                                                    <input
                                                        type="text"
                                                        name="why_btn1_text"
                                                        value={form.why_btn1_text}
                                                        onChange={handleChange}
                                                        placeholder="Profil Maktab Tuli"
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Tautan / URL Tujuan</label>
                                                    <input
                                                        type="text"
                                                        name="why_btn1_link"
                                                        value={form.why_btn1_link}
                                                        onChange={handleChange}
                                                        placeholder="/maktabtuli"
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tombol 2 */}
                                            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2.5">
                                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">ads_click</span>
                                                    Tombol 2 (Outline Putih)
                                                </p>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Label Tombol</label>
                                                    <input
                                                        type="text"
                                                        name="why_btn2_text"
                                                        value={form.why_btn2_text}
                                                        onChange={handleChange}
                                                        placeholder="Galeri Santri"
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Tautan / URL Tujuan</label>
                                                    <input
                                                        type="text"
                                                        name="why_btn2_link"
                                                        value={form.why_btn2_link}
                                                        onChange={handleChange}
                                                        placeholder="/galeri"
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bagian 4 Kartu Keunggulan (Card 01 - 04) */}
                                    <div className="pt-2">
                                        <h4 className="font-headline text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">view_grid</span>
                                            4 Kartu Keunggulan &amp; Metodologi
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Kartu 01 */}
                                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                                    <span className="text-xs font-black text-primary">Kartu 01</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">Langkah 01</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Judul Kartu</label>
                                                    <input
                                                        type="text"
                                                        name="why_card1_title"
                                                        value={form.why_card1_title}
                                                        onChange={handleChange}
                                                        placeholder="Mushaf Isyarat Terstandar"
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-surface-container-lowest"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Deskripsi Penjelasan</label>
                                                    <textarea
                                                        rows={2}
                                                        name="why_card1_desc"
                                                        value={form.why_card1_desc}
                                                        onChange={handleChange}
                                                        placeholder="Pembelajaran tilawah dan hafalan Al-Qur'an mengacu pada standarisasi mushaf isyarat resmi..."
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-lowest leading-relaxed"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            {/* Kartu 02 */}
                                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                                    <span className="text-xs font-black text-[#D38B1D]">Kartu 02</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Langkah 02</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Judul Kartu</label>
                                                    <input
                                                        type="text"
                                                        name="why_card2_title"
                                                        value={form.why_card2_title}
                                                        onChange={handleChange}
                                                        placeholder="Pendekatan Holistik & Terapi"
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-surface-container-lowest"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Deskripsi Penjelasan</label>
                                                    <textarea
                                                        rows={2}
                                                        name="why_card2_desc"
                                                        value={form.why_card2_desc}
                                                        onChange={handleChange}
                                                        placeholder="Menyelaraskan pendidikan keislaman, terapi sensori motorik, dan bimbingan psikologis..."
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-lowest leading-relaxed"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            {/* Kartu 03 */}
                                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                                    <span className="text-xs font-black text-[#0048AB]">Kartu 03</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#0048AB] font-bold">Langkah 03</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Judul Kartu</label>
                                                    <input
                                                        type="text"
                                                        name="why_card3_title"
                                                        value={form.why_card3_title}
                                                        onChange={handleChange}
                                                        placeholder="Pendidikan Formal Berijazah"
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-surface-container-lowest"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Deskripsi Penjelasan</label>
                                                    <textarea
                                                        rows={2}
                                                        name="why_card3_desc"
                                                        value={form.why_card3_desc}
                                                        onChange={handleChange}
                                                        placeholder="Dukungan kesetaraan ijazah Paket A, B, dan C resmi negara..."
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-lowest leading-relaxed"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            {/* Kartu 04 */}
                                            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                                    <span className="text-xs font-black text-[#BE185D]">Kartu 04</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-[#BE185D] font-bold">Langkah 04</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Judul Kartu</label>
                                                    <input
                                                        type="text"
                                                        name="why_card4_title"
                                                        value={form.why_card4_title}
                                                        onChange={handleChange}
                                                        placeholder="Kemandirian Santri & Kriya"
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-surface-container-lowest"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-on-surface mb-1">Deskripsi Penjelasan</label>
                                                    <textarea
                                                        rows={2}
                                                        name="why_card4_desc"
                                                        value={form.why_card4_desc}
                                                        onChange={handleChange}
                                                        placeholder="Pelatihan seni kaligrafi, kriya tangan, dan literasi digital di sanggar kreatif..."
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-lowest leading-relaxed"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 2: HALAMAN MAKTAB TULI                                      */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'maktabtuli' && (
                            <div className="space-y-6">
                                {/* Hero Banner Maktab Tuli */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">hearing</span>
                                            Hero Banner Halaman Maktab Tuli
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Judul besar dan deskripsi pengantar di bagian paling atas halaman Maktab Tuli.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Badge Atas
                                            </label>
                                            <input
                                                type="text"
                                                name="maktab_hero_badge"
                                                value={form.maktab_hero_badge}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Halaman Maktab Tuli
                                            </label>
                                            <input
                                                type="text"
                                                name="maktab_hero_title"
                                                value={form.maktab_hero_title}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Paragraf Pengantar Hero Maktab Tuli
                                        </label>
                                        <textarea
                                            rows={2}
                                            name="maktab_hero_desc"
                                            value={form.maktab_hero_desc}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Profil Lembaga & Foto Utama Maktab Tuli */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                        <div className="border-b border-outline-variant/60 pb-3">
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                                                Profil Lembaga Maktab Tuli
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Narasi perkenalan dan dua poin keunggulan metode belajar santri.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Badge Profil
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_profile_badge"
                                                    value={form.maktab_profile_badge}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Profil
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_profile_title"
                                                    value={form.maktab_profile_title}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Paragraf Profil 1
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="maktab_profile_desc1"
                                                value={form.maktab_profile_desc1}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Paragraf Profil 2
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="maktab_profile_desc2"
                                                value={form.maktab_profile_desc2}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/40">
                                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-2">
                                                <label className="block text-xs font-bold text-primary">Poin 1: Judul</label>
                                                <input
                                                    type="text"
                                                    name="maktab_poin1_title"
                                                    value={form.maktab_poin1_title}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                />
                                                <label className="block text-[11px] text-outline">Deskripsi Poin 1</label>
                                                <textarea
                                                    rows={2}
                                                    name="maktab_poin1_desc"
                                                    value={form.maktab_poin1_desc}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                ></textarea>
                                            </div>

                                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-2">
                                                <label className="block text-xs font-bold text-[#0048AB]">Poin 2: Judul</label>
                                                <input
                                                    type="text"
                                                    name="maktab_poin2_title"
                                                    value={form.maktab_poin2_title}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                />
                                                <label className="block text-[11px] text-outline">Deskripsi Poin 2</label>
                                                <textarea
                                                    rows={2}
                                                    name="maktab_poin2_desc"
                                                    value={form.maktab_poin2_desc}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Foto Profil Maktab Tuli */}
                                    <ImageUploadBox
                                        label="Foto Profil Maktab Tuli"
                                        desc="Foto kegiatan belajar mengajar santri yang tampil di samping profil lembaga."
                                        fieldName="maktab_profile_image"
                                        value={form.maktab_profile_image}
                                        previewUrl={previewUrls.maktab_profile_image}
                                        onFileChange={handleFileChange}
                                        onUrlChange={handleUrlChange}
                                        fallback="/images/image5.png"
                                        height="h-64 sm:h-72"
                                        tip="Gunakan foto santri belajar dengan resolusi jernih (format JPG/PNG minimal 800×600px)."
                                    />
                                </div>

                                {/* Visi & Misi Maktab Tuli */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                                                Visi &amp; Misi Maktab Tuli
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Kelola kartu Visi Utama, kartu Misi Lembaga, serta poin-poin capaian.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
                                            Tampil di /maktabtuli
                                        </span>
                                    </div>

                                    {/* Dua Kartu Berdampingan (Visi & Misi) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        
                                        {/* KARTU 1: VISI UTAMA (TEMA BIRU) */}
                                        <div className="p-5 bg-blue-50/30 rounded-2xl border-2 border-blue-200/80 space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-blue-200/60">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-[#025EDB] text-white flex items-center justify-center shadow-xs">
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-[#0048AB] uppercase tracking-wider">Kartu Visi Utama</h4>
                                                        <p className="text-[11px] text-[#424654]">Tujuan jangka panjang lembaga</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100/80 text-[#025EDB]">
                                                    Kiri
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#0048AB] mb-1">
                                                        Badge Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="maktab_visi_badge"
                                                        value={form.maktab_visi_badge}
                                                        onChange={handleChange}
                                                        placeholder="Contoh: Tujuan Jangka Panjang"
                                                        className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#0048AB] mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="maktab_visi_title"
                                                        value={form.maktab_visi_title}
                                                        onChange={handleChange}
                                                        placeholder="Contoh: Visi Utama"
                                                        className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs font-bold bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-[#0048AB] mb-1">
                                                    Teks Pernyataan Visi Utama (Quote)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    name="maktab_visi_text"
                                                    value={form.maktab_visi_text}
                                                    onChange={handleChange}
                                                    placeholder="Tuliskan visi utama lembaga..."
                                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs leading-relaxed bg-white font-medium"
                                                ></textarea>
                                            </div>

                                            {/* Poin-poin Visi */}
                                            <div className="space-y-2.5 pt-2 border-t border-blue-100">
                                                <label className="block text-[11px] font-bold text-[#0048AB] uppercase tracking-wider">
                                                    3 Poin Capaian Visi
                                                </label>

                                                {/* Poin 1 */}
                                                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-[#025EDB] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                                        1
                                                    </span>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Poin Visi 1</label>
                                                        <textarea
                                                            rows={2}
                                                            name="maktab_visi_poin1"
                                                            value={form.maktab_visi_poin1}
                                                            onChange={handleChange}
                                                            placeholder="Pusat rujukan terdepan dalam standarisasi..."
                                                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                {/* Poin 2 */}
                                                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-[#025EDB] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                                        2
                                                    </span>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Poin Visi 2</label>
                                                        <textarea
                                                            rows={2}
                                                            name="maktab_visi_poin2"
                                                            value={form.maktab_visi_poin2}
                                                            onChange={handleChange}
                                                            placeholder="Mewujudkan ruang tumbuh kembang..."
                                                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                {/* Poin 3 */}
                                                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-[#025EDB] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                                        3
                                                    </span>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Poin Visi 3</label>
                                                        <textarea
                                                            rows={2}
                                                            name="maktab_visi_poin3"
                                                            value={form.maktab_visi_poin3}
                                                            onChange={handleChange}
                                                            placeholder="Membangun generasi muslim Tuli..."
                                                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KARTU 2: MISI LEMBAGA (TEMA AMBER/ORANGE) */}
                                        <div className="p-5 bg-amber-50/40 rounded-2xl border-2 border-amber-200/80 space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-[#D38B1D] text-white flex items-center justify-center shadow-xs">
                                                        <span className="material-symbols-outlined text-[18px]">task_alt</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-[#855400] uppercase tracking-wider">Kartu Misi Lembaga</h4>
                                                        <p className="text-[11px] text-[#424654]">Langkah strategis &amp; pilar utama</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100/80 text-[#855400]">
                                                    Kanan
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#855400] mb-1">
                                                        Badge Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="maktab_misi_badge"
                                                        value={form.maktab_misi_badge}
                                                        onChange={handleChange}
                                                        placeholder="Contoh: Langkah Strategis"
                                                        className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#855400] mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="maktab_misi_title"
                                                        value={form.maktab_misi_title}
                                                        onChange={handleChange}
                                                        placeholder="Contoh: Misi Lembaga"
                                                        className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-[#855400] mb-1">
                                                    Teks Pengantar / Intro Misi
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    name="maktab_misi_intro"
                                                    value={form.maktab_misi_intro}
                                                    onChange={handleChange}
                                                    placeholder="Mewujudkan layanan pendidikan Islam terpadu..."
                                                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs leading-relaxed bg-white font-medium"
                                                ></textarea>
                                            </div>

                                            {/* 3 Pilar Misi */}
                                            <div className="space-y-2.5 pt-2 border-t border-amber-100">
                                                <label className="block text-[11px] font-bold text-[#855400] uppercase tracking-wider">
                                                    3 Pilar Strategis Misi
                                                </label>

                                                {/* Pilar 1 */}
                                                <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-[#855400] flex items-center justify-center font-bold text-xs shrink-0">
                                                            1
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="maktab_misi_poin1_title"
                                                            value={form.maktab_misi_poin1_title}
                                                            onChange={handleChange}
                                                            placeholder="Judul Pilar (Contoh: Pendidikan Agama)"
                                                            className="flex-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-[#191C1D]"
                                                        />
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        name="maktab_misi_poin1_desc"
                                                        value={form.maktab_misi_poin1_desc}
                                                        onChange={handleChange}
                                                        placeholder="Uraian kegiatan pilar 1..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                    ></textarea>
                                                </div>

                                                {/* Pilar 2 */}
                                                <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-[#855400] flex items-center justify-center font-bold text-xs shrink-0">
                                                            2
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="maktab_misi_poin2_title"
                                                            value={form.maktab_misi_poin2_title}
                                                            onChange={handleChange}
                                                            placeholder="Judul Pilar (Contoh: Kesetaraan Formal)"
                                                            className="flex-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-[#191C1D]"
                                                        />
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        name="maktab_misi_poin2_desc"
                                                        value={form.maktab_misi_poin2_desc}
                                                        onChange={handleChange}
                                                        placeholder="Uraian kegiatan pilar 2..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                    ></textarea>
                                                </div>

                                                {/* Pilar 3 */}
                                                <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-[#855400] flex items-center justify-center font-bold text-xs shrink-0">
                                                            3
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="maktab_misi_poin3_title"
                                                            value={form.maktab_misi_poin3_title}
                                                            onChange={handleChange}
                                                            placeholder="Judul Pilar (Contoh: Kemandirian Vokasi)"
                                                            className="flex-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-[#191C1D]"
                                                        />
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        name="maktab_misi_poin3_desc"
                                                        value={form.maktab_misi_poin3_desc}
                                                        onChange={handleChange}
                                                        placeholder="Uraian kegiatan pilar 3..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs leading-relaxed"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 7 Program Belajar Utama (Kurikulum Terstruktur) */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                                                7 Program Belajar Utama (Kurikulum Terstruktur)
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Kelola judul, deskripsi kurikulum, dan isi 7 kartu program belajar santri Maktab Tuli.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
                                            Tampil di /maktabtuli
                                        </span>
                                    </div>

                                    {/* Header Section Program Belajar */}
                                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                                            <span className="material-symbols-outlined text-primary text-[18px]">view_headline</span>
                                            Header Section Program Belajar
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Badge Section
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_program_badge"
                                                    value={form.maktab_program_badge}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: KURIKULUM TERSTRUKTUR"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Section
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_program_title"
                                                    value={form.maktab_program_title}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: 7 Program Belajar Utama"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold bg-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Deskripsi / Subtitle Section
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="maktab_program_desc"
                                                value={form.maktab_program_desc}
                                                onChange={handleChange}
                                                placeholder="Dirancang komprehensif memadukan studi keislaman, penguatan akademis, dan kesiapan kemandirian masa depan santri."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed bg-white"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* 7 Kartu Program Belajar */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-1">
                                            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">auto_stories</span>
                                                Daftar 7 Kartu Program Pembelajaran
                                            </h4>
                                            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                7 Program Aktif
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {PROGRAM_ITEMS.map((item) => (
                                                <div
                                                    key={item.num}
                                                    className="p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/70 shadow-2xs hover:border-primary/50 transition-colors space-y-3 flex flex-col justify-between"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-bold text-on-surface">Program #{item.num}</span>
                                                                    <p className="text-[10px] text-outline">{item.title}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                                {form[`maktab_prog${item.num}_badge`] || item.badge}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                                Judul Program
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name={`maktab_prog${item.num}_title`}
                                                                value={form[`maktab_prog${item.num}_title`]}
                                                                onChange={handleChange}
                                                                placeholder={item.title}
                                                                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold bg-white"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                                Kategori / Badge Program
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name={`maktab_prog${item.num}_badge`}
                                                                value={form[`maktab_prog${item.num}_badge`]}
                                                                onChange={handleChange}
                                                                placeholder={item.badge}
                                                                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-white"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                                Deskripsi Singkat Program
                                                            </label>
                                                            <textarea
                                                                rows={3}
                                                                name={`maktab_prog${item.num}_desc`}
                                                                value={form[`maktab_prog${item.num}_desc`]}
                                                                onChange={handleChange}
                                                                placeholder={item.defaultDesc}
                                                                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed bg-white"
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-outline-variant/40">
                                                        <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                            Teks Tombol / Status Bawah
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name={`maktab_prog${item.num}_btn`}
                                                            value={form[`maktab_prog${item.num}_btn`]}
                                                            onChange={handleChange}
                                                            placeholder="Program Aktif MTAS"
                                                            className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Fasilitas Pendukung Belajar (Sarana & Prasarana) */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
                                                Fasilitas Pendukung Belajar (Sarana &amp; Prasarana)
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Kelola judul, deskripsi, dan 6 kartu fasilitas sarana &amp; prasarana penunjang santri Maktab Tuli.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
                                            Tampil di /maktabtuli
                                        </span>
                                    </div>

                                    {/* Header Section Fasilitas */}
                                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                                            <span className="material-symbols-outlined text-primary text-[18px]">view_headline</span>
                                            Header Section Fasilitas
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Badge Section
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_fasilitas_badge"
                                                    value={form.maktab_fasilitas_badge}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: SARANA & PRASARANA"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Section
                                                </label>
                                                <input
                                                    type="text"
                                                    name="maktab_fasilitas_title"
                                                    value={form.maktab_fasilitas_title}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: Fasilitas Pendukung Belajar"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold bg-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Deskripsi / Subtitle Section
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="maktab_fasilitas_desc"
                                                value={form.maktab_fasilitas_desc}
                                                onChange={handleChange}
                                                placeholder="Kenyamanan dan kelengkapan fasilitas adalah prioritas utama kami demi mendukung proses belajar santri yang optimal."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed bg-white"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* 6 Kartu Fasilitas */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-1">
                                            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                                                Daftar 6 Fasilitas Pendukung
                                            </h4>
                                            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                6 Fasilitas Aktif
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {FACILITY_ITEMS.map((item) => (
                                                <div
                                                    key={item.num}
                                                    className="p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/70 shadow-2xs hover:border-primary/50 transition-colors space-y-3"
                                                >
                                                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-on-surface">Fasilitas #{item.num}</span>
                                                                <p className="text-[10px] text-outline">{item.title}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-outline bg-white px-2 py-0.5 rounded-md border border-outline-variant/60">
                                                            Sarana
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                            Nama Fasilitas
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name={`maktab_fac${item.num}_title`}
                                                            value={form[`maktab_fac${item.num}_title`]}
                                                            onChange={handleChange}
                                                            placeholder={item.title}
                                                            className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-on-surface mb-1">
                                                            Deskripsi Fasilitas
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            name={`maktab_fac${item.num}_desc`}
                                                            value={form[`maktab_fac${item.num}_desc`]}
                                                            onChange={handleChange}
                                                            placeholder={item.defaultDesc}
                                                            className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed bg-white"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 3: HALAMAN BERITA                                           */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'berita' && (
                            <div className="space-y-6">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">newspaper</span>
                                            Header Banner Halaman Berita
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Teks pembuka dan judul banner di halaman indeks berita yayasan (/berita).
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Badge Header
                                            </label>
                                            <input
                                                type="text"
                                                name="berita_header_badge"
                                                value={form.berita_header_badge}
                                                onChange={handleChange}
                                                placeholder="Contoh: Kabar & Informasi Terkini"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Halaman Berita
                                            </label>
                                            <input
                                                type="text"
                                                name="berita_header_title"
                                                value={form.berita_header_title}
                                                onChange={handleChange}
                                                placeholder="Contoh: Berita Yayasan"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Paragraf Deskripsi Header Berita
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="berita_header_desc"
                                            value={form.berita_header_desc}
                                            onChange={handleChange}
                                            placeholder="Informasi, agenda kegiatan, dan kabar terkini..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Petunjuk Manajemen Artikel */}
                                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">article</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-on-surface">Manajemen Artikel &amp; Berita</h4>
                                            <p className="text-xs text-outline mt-0.5">
                                                Untuk menambah artikel baru, mengubah foto berita, atau menentukan Headline Utama, gunakan menu manajemen berita.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin/berita"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 transition-all shrink-0"
                                    >
                                        <span>Buka Manajemen Berita</span>
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 4: HALAMAN GALERI                                           */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'galeri' && (
                            <div className="space-y-6">
                                {/* Header Banner Galeri */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">photo_library</span>
                                            Header Banner Halaman Galeri
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Teks pengantar di bagian atas halaman galeri dokumentasi (/galeri).
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Badge Header
                                            </label>
                                            <input
                                                type="text"
                                                name="galeri_header_badge"
                                                value={form.galeri_header_badge}
                                                onChange={handleChange}
                                                placeholder="Contoh: Dokumentasi & Arsip Kegiatan"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Halaman Galeri
                                            </label>
                                            <input
                                                type="text"
                                                name="galeri_header_title"
                                                value={form.galeri_header_title}
                                                onChange={handleChange}
                                                placeholder="Contoh: Galeri Yayasan"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Paragraf Deskripsi Header Galeri
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="galeri_header_desc"
                                            value={form.galeri_header_desc}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Petunjuk Manajemen Album Galeri & Sorotan Utama */}
                                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">collections</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-on-surface">Manajemen Foto, Video &amp; Sorotan Utama</h4>
                                            <p className="text-xs text-outline mt-0.5">
                                                Untuk mengunggah album foto baru, video YouTube, atau menandai foto/kegiatan prioritas (Sorotan Utama / Featured) di halaman galeri, kelola langsung melalui menu Manajemen Galeri.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin/galeri"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 transition-all shrink-0"
                                    >
                                        <span>Buka Manajemen Galeri</span>
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 5: HALAMAN KONTAK                                           */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'kontak' && (
                            <div className="space-y-6">
                                {/* Header Banner Kontak */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">contact_support</span>
                                            Header Banner Halaman Kontak
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Teks pengantar di bagian atas halaman kontak yayasan (/kontak).
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Badge Header
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_header_badge"
                                                value={form.contact_header_badge}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Halaman Kontak
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_header_title"
                                                value={form.contact_header_title}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Paragraf Deskripsi Kontak
                                        </label>
                                        <textarea
                                            rows={2}
                                            name="contact_header_desc"
                                            value={form.contact_header_desc}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* 4 KARTU KONTAK UTAMA (SESUAI TAMPILAN WEBSITE) */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[22px]">view_carousel</span>
                                                4 Kartu Kontak Utama Website
                                            </h3>
                                            <p className="text-xs text-outline mt-0.5">
                                                Setiap kartu di bawah ini mewakili 1 kartu kontak yang tampil secara konsisten di halaman web publik.
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                            4 Kartu Terpadu
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* ── KARTU 1: ALAMAT KANTOR ── */}
                                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                            <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-headline text-sm font-bold text-on-surface">
                                                            Kartu 1: Alamat Kantor
                                                        </h4>
                                                        <p className="text-[11px] text-outline">
                                                            Badge, judul, alamat, dan tautan peta Google
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    Kartu #1
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Badge Subtext
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card1_badge"
                                                        value={form.contact_card1_badge}
                                                        onChange={handleChange}
                                                        placeholder="Kantor & Asrama"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card1_title"
                                                        value={form.contact_card1_title}
                                                        onChange={handleChange}
                                                        placeholder="Alamat Kantor"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Alamat Kantor Lengkap
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    name="contact_address"
                                                    value={form.contact_address}
                                                    onChange={handleChange}
                                                    placeholder="Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Label Tombol Aksi
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_card1_btn"
                                                    value={form.contact_card1_btn}
                                                    onChange={handleChange}
                                                    placeholder="Lihat di Peta"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary font-bold"
                                                />
                                                <p className="text-[10px] text-outline mt-1.5">
                                                    *Tombol ini mengarahkan pengunjung langsung ke bagian peta lokasi yayasan di bawah. Tautan dan embed Google Maps dikelola pada section Lokasi &amp; Akses Yayasan di bawah.
                                                </p>
                                            </div>
                                        </div>

                                        {/* ── KARTU 2: TELEPON & WHATSAPP ── */}
                                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                            <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-headline text-sm font-bold text-on-surface">
                                                            Kartu 2: Telepon &amp; WhatsApp
                                                        </h4>
                                                        <p className="text-[11px] text-outline">
                                                            Badge jam layanan, telepon, dan tautan chat WA
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    Kartu #2
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Badge Subtext / Jam Layanan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card2_badge"
                                                        value={form.contact_card2_badge}
                                                        onChange={handleChange}
                                                        placeholder="Senin - Sabtu: 08:00 - 16:30 WIB"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card2_title"
                                                        value={form.contact_card2_title}
                                                        onChange={handleChange}
                                                        placeholder="Telepon & WhatsApp"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Nomor Telepon Kantor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_phone"
                                                        value={form.contact_phone}
                                                        onChange={handleChange}
                                                        placeholder="+62 812-3456-7890"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Nomor WhatsApp Resmi (Chat)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_whatsapp"
                                                        value={form.contact_whatsapp}
                                                        onChange={handleChange}
                                                        placeholder="081234567890"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Label Tombol Aksi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card2_btn"
                                                        value={form.contact_card2_btn}
                                                        onChange={handleChange}
                                                        placeholder="Chat WhatsApp"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Rincian Jam Kerja Lengkap
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_hours"
                                                        value={form.contact_hours}
                                                        onChange={handleChange}
                                                        placeholder="Senin - Sabtu: 08:00 - 16:30 WIB"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-[11px] text-outline">
                                                ℹ️ Tautan tombol WhatsApp akan otomatis mengarah ke format <span className="text-primary font-mono font-bold">wa.me</span> resmi yayasan.
                                            </div>
                                        </div>

                                        {/* ── KARTU 3: EMAIL RESMI ── */}
                                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                            <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-headline text-sm font-bold text-on-surface">
                                                            Kartu 3: Email Resmi
                                                        </h4>
                                                        <p className="text-[11px] text-outline">
                                                            Badge respon, alamat email resmi, dan aksi kirim
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    Kartu #3
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Badge Subtext
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card3_badge"
                                                        value={form.contact_card3_badge}
                                                        onChange={handleChange}
                                                        placeholder="Respon Cepat"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card3_title"
                                                        value={form.contact_card3_title}
                                                        onChange={handleChange}
                                                        placeholder="Email Resmi"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Alamat Email Resmi Yayasan
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contact_email"
                                                    value={form.contact_email}
                                                    onChange={handleChange}
                                                    placeholder="info@bhaktiarumi.org"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Label Tombol Aksi
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_card3_btn"
                                                    value={form.contact_card3_btn}
                                                    onChange={handleChange}
                                                    placeholder="Kirim Email"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary font-bold"
                                                />
                                            </div>
                                        </div>

                                        {/* ── KARTU 4: INSTAGRAM RESMI ── */}
                                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                            <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-headline text-sm font-bold text-on-surface">
                                                            Kartu 4: Instagram Resmi
                                                        </h4>
                                                        <p className="text-[11px] text-outline">
                                                            Badge dokumentasi, handle akun, dan tautan profil
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    Kartu #4
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Badge Subtext
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card4_badge"
                                                        value={form.contact_card4_badge}
                                                        onChange={handleChange}
                                                        placeholder="Dokumentasi"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Judul Kartu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card4_title"
                                                        value={form.contact_card4_title}
                                                        onChange={handleChange}
                                                        placeholder="Instagram Resmi"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Username / Handle Akun Instagram
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_instagram_handle"
                                                    value={form.contact_instagram_handle}
                                                    onChange={handleChange}
                                                    placeholder="@maktabtuliassami.id"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        URL Tautan Profil Instagram
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_instagram"
                                                        value={form.contact_instagram}
                                                        onChange={handleChange}
                                                        placeholder="https://www.instagram.com/maktabtuliassami.id/"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface mb-1">
                                                        Label Tombol Aksi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contact_card4_btn"
                                                        value={form.contact_card4_btn}
                                                        onChange={handleChange}
                                                        placeholder="Buka Instagram"
                                                        className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── SECTION KHUSUS: JASA LAYANAN JURU BAHASA ISYARAT (JBI) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[24px]">interpreter_mode</span>
                                            </div>
                                            <div>
                                                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                    Layanan Juru Bahasa Isyarat (JBI)
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                        Banner Utama
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-outline">
                                                    Pengaturan judul, deskripsi, tombol reservasi, 4 lingkup layanan, dan 3 poin standar BISINDO pada banner JBI.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                                            Tampil di Beranda &amp; Kontak
                                        </span>
                                    </div>

                                    {/* 1. Pengaturan Teks Utama & Tombol */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Badge Kategori
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_badge"
                                                    value={form.contact_jbi_badge}
                                                    onChange={handleChange}
                                                    placeholder="Aksesibilitas & Inklusi Komunikasi"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Utama Layanan JBI
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_title"
                                                    value={form.contact_jbi_title}
                                                    onChange={handleChange}
                                                    placeholder="Jasa Layanan Juru Bahasa Isyarat (JBI)"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Deskripsi / Narasi Pengantar JBI
                                            </label>
                                            <textarea
                                                rows={3}
                                                name="contact_jbi_desc"
                                                value={form.contact_jbi_desc}
                                                onChange={handleChange}
                                                placeholder="Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional..."
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Teks Tombol WhatsApp
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_btn_wa"
                                                    value={form.contact_jbi_btn_wa}
                                                    onChange={handleChange}
                                                    placeholder="Reservasi via WhatsApp"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Teks Tombol Formulir
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_btn_form"
                                                    value={form.contact_jbi_btn_form}
                                                    onChange={handleChange}
                                                    placeholder="Isi Form Permohonan"
                                                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. 4 Kartu Lingkup Layanan JBI */}
                                    <div className="pt-4 border-t border-outline-variant/60">
                                        <h4 className="font-headline text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[18px]">grid_view</span>
                                            4 Bidang / Lingkup Layanan JBI
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Item 1 */}
                                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary">Bidang #1</span>
                                                    <span className="material-symbols-outlined text-[18px] text-outline">co_present</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Judul Layanan</label>
                                                    <input
                                                        type="text"
                                                        name="contact_jbi_item1_title"
                                                        value={form.contact_jbi_item1_title}
                                                        onChange={handleChange}
                                                        placeholder="Seminar & Konferensi"
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="contact_jbi_item1_desc"
                                                        value={form.contact_jbi_item1_desc}
                                                        onChange={handleChange}
                                                        placeholder="Penerjemahan langsung untuk webinar, seminar nasional..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Item 2 */}
                                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary">Bidang #2</span>
                                                    <span className="material-symbols-outlined text-[18px] text-outline">menu_book</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Judul Layanan</label>
                                                    <input
                                                        type="text"
                                                        name="contact_jbi_item2_title"
                                                        value={form.contact_jbi_item2_title}
                                                        onChange={handleChange}
                                                        placeholder="Kajian & Keagamaan"
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="contact_jbi_item2_desc"
                                                        value={form.contact_jbi_item2_desc}
                                                        onChange={handleChange}
                                                        placeholder="Penerjemahan khutbah Jum'at, pengajian akbar..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Item 3 */}
                                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary">Bidang #3</span>
                                                    <span className="material-symbols-outlined text-[18px] text-outline">gavel</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Judul Layanan</label>
                                                    <input
                                                        type="text"
                                                        name="contact_jbi_item3_title"
                                                        value={form.contact_jbi_item3_title}
                                                        onChange={handleChange}
                                                        placeholder="Formal & Pendampingan"
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="contact_jbi_item3_desc"
                                                        value={form.contact_jbi_item3_desc}
                                                        onChange={handleChange}
                                                        placeholder="Pendampingan sidang akademik/skripsi, konsultasi medis..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Item 4 */}
                                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary">Bidang #4</span>
                                                    <span className="material-symbols-outlined text-[18px] text-outline">videocam</span>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Judul Layanan</label>
                                                    <input
                                                        type="text"
                                                        name="contact_jbi_item4_title"
                                                        value={form.contact_jbi_item4_title}
                                                        onChange={handleChange}
                                                        placeholder="Media & Konten Digital"
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="contact_jbi_item4_desc"
                                                        value={form.contact_jbi_item4_desc}
                                                        onChange={handleChange}
                                                        placeholder="Penerjemah visual PIP (Picture-in-Picture)..."
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant text-[11px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. 3 Poin Keunggulan / Standar Mutu */}
                                    <div className="pt-4 border-t border-outline-variant/60">
                                        <h4 className="font-headline text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                                            3 Poin Standar Mutu &amp; Keunggulan JBI
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-outline mb-1">Poin Keunggulan 1</label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_point1"
                                                    value={form.contact_jbi_point1}
                                                    onChange={handleChange}
                                                    placeholder="Standar BISINDO & Bahasa Isyarat Agama"
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-outline mb-1">Poin Keunggulan 2</label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_point2"
                                                    value={form.contact_jbi_point2}
                                                    onChange={handleChange}
                                                    placeholder="Tersedia Format Luring & Daring (Zoom / Live)"
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-outline mb-1">Poin Keunggulan 3</label>
                                                <input
                                                    type="text"
                                                    name="contact_jbi_point3"
                                                    value={form.contact_jbi_point3}
                                                    onChange={handleChange}
                                                    placeholder="Penerjemah Berpengalaman & Beretika"
                                                    className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Live Preview Banner Card */}
                                    <div className="pt-4 border-t border-outline-variant/60">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-[18px]">visibility</span>
                                                Pratinjau Langsung (Live Preview) Banner JBI
                                            </h4>
                                            <span className="text-[10px] text-outline bg-surface-container px-2 py-0.5 rounded">
                                                Tampilan Real-time
                                            </span>
                                        </div>

                                        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#003882] via-[#0048AB] to-[#025EDB] p-6 text-white shadow-md">
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                                <div className="max-w-xl">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-blue-100 font-bold text-[10px] uppercase tracking-wider mb-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        <span>{form.contact_jbi_badge || 'Aksesibilitas & Inklusi Komunikasi'}</span>
                                                    </div>
                                                    <h3 className="text-xl sm:text-2xl font-black leading-snug">
                                                        {form.contact_jbi_title || 'Jasa Layanan Juru Bahasa Isyarat (JBI)'}
                                                    </h3>
                                                    <p className="mt-2 text-blue-100/90 text-xs leading-relaxed">
                                                        {form.contact_jbi_desc || 'Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional...'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-xs">
                                                        <span>{form.contact_jbi_btn_wa || 'Reservasi via WhatsApp'}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0048AB] font-bold text-xs shadow-xs">
                                                        <span>{form.contact_jbi_btn_form || 'Isi Form Permohonan'}</span>
                                                        <span>↓</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                                                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                                                    <h4 className="font-bold text-xs text-white mb-1">{form.contact_jbi_item1_title || 'Seminar & Konferensi'}</h4>
                                                    <p className="text-[11px] text-blue-100/80 line-clamp-3">{form.contact_jbi_item1_desc}</p>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                                                    <h4 className="font-bold text-xs text-white mb-1">{form.contact_jbi_item2_title || 'Kajian & Keagamaan'}</h4>
                                                    <p className="text-[11px] text-blue-100/80 line-clamp-3">{form.contact_jbi_item2_desc}</p>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                                                    <h4 className="font-bold text-xs text-white mb-1">{form.contact_jbi_item3_title || 'Formal & Pendampingan'}</h4>
                                                    <p className="text-[11px] text-blue-100/80 line-clamp-3">{form.contact_jbi_item3_desc}</p>
                                                </div>
                                                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                                                    <h4 className="font-bold text-xs text-white mb-1">{form.contact_jbi_item4_title || 'Media & Konten Digital'}</h4>
                                                    <p className="text-[11px] text-blue-100/80 line-clamp-3">{form.contact_jbi_item4_desc}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-blue-100">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-emerald-400 font-bold">✓</span>
                                                    <span>{form.contact_jbi_point1}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-emerald-400 font-bold">✓</span>
                                                    <span>{form.contact_jbi_point2}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-emerald-400 font-bold">✓</span>
                                                    <span>{form.contact_jbi_point3}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── KARTU FAQ: PERTANYAAN SERING DIAJUKAN (ACCORDION) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/60 gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[24px]">quiz</span>
                                            </div>
                                            <div>
                                                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                    Pertanyaan Sering Diajukan (FAQ)
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                        Accordion Kontak
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-outline">
                                                    Pengaturan judul dan 5 butir tanya-jawab seputar pendaftaran santri, program maktab, dan pemesanan JBI.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                                            Tampil di Kontak
                                        </span>
                                    </div>

                                    {/* Judul Section FAQ */}
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Judul Section FAQ
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_faq_title"
                                            value={form.contact_faq_title}
                                            onChange={handleChange}
                                            placeholder="Pertanyaan Sering Diajukan"
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                        />
                                    </div>

                                    {/* 5 Butir FAQ */}
                                    <div className="space-y-4">
                                        <h4 className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[18px]">format_list_bulleted</span>
                                            Daftar 5 Butir Pertanyaan &amp; Jawaban
                                        </h4>

                                        <div className="grid grid-cols-1 gap-4">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <div key={num} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-primary flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold flex items-center justify-center">
                                                                {num}
                                                            </span>
                                                            Butir FAQ #{num}
                                                        </span>
                                                        <span className="text-[11px] text-outline">Pertanyaan &amp; Jawaban #{num}</span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-semibold text-outline mb-1">
                                                            Pertanyaan #{num}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name={`contact_faq${num}_q`}
                                                            value={form[`contact_faq${num}_q`]}
                                                            onChange={handleChange}
                                                            placeholder={`Pertanyaan butir #${num}`}
                                                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs font-semibold"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-semibold text-outline mb-1">
                                                            Jawaban #{num}
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            name={`contact_faq${num}_a`}
                                                            value={form[`contact_faq${num}_a`]}
                                                            onChange={handleChange}
                                                            placeholder={`Jawaban butir #${num}`}
                                                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs leading-relaxed"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* ── BAGIAN: LOKASI & AKSES YAYASAN (PETA GOOGLE MAPS) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[24px]">pin_drop</span>
                                            </div>
                                            <div>
                                                <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                    Lokasi &amp; Akses Yayasan (Peta Google Maps)
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                        Section Lokasi
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-outline">
                                                    Pengaturan judul, deskripsi, tombol aksi, serta tautan dan embed iframe Google Maps lokasi yayasan.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                                            Tampil di Halaman Kontak
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Badge Kategori
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_badge"
                                                value={form.contact_maps_badge}
                                                onChange={handleChange}
                                                placeholder="Lokasi Fisik"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Utama Section
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_title"
                                                value={form.contact_maps_title}
                                                onChange={handleChange}
                                                placeholder="Lokasi & Akses Yayasan"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Deskripsi / Sub-judul Lokasi
                                        </label>
                                        <textarea
                                            rows={2}
                                            name="contact_maps_desc"
                                            value={form.contact_maps_desc}
                                            onChange={handleChange}
                                            placeholder="Kunjungi langsung asrama dan kantor Maktab Tuli As-Sami / Yayasan Bhakti Arumi Delangga di Pontianak."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Tombol Salin Alamat
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_copy_btn"
                                                value={form.contact_maps_copy_btn}
                                                onChange={handleChange}
                                                placeholder="Salin Alamat"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold"
                                            />
                                            <p className="text-[10px] text-outline mt-1">
                                                *Tombol ini akan otomatis menyalin alamat kantor lengkap yayasan ke clipboard pengunjung.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Tombol Google Maps
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_btn"
                                                value={form.contact_maps_btn}
                                                onChange={handleChange}
                                                placeholder="Buka di Google Maps"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-outline-variant/60">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Link Aplikasi Google Maps (URL Direct)
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_link"
                                                value={form.contact_maps_link}
                                                onChange={handleChange}
                                                placeholder="https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                            />
                                            <p className="text-[10px] text-outline mt-1">
                                                Tautan ketika pengunjung mengklik tombol &quot;Buka di Google Maps&quot;.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                URL Embed Google Maps (src iframe)
                                            </label>
                                            <textarea
                                                rows={3}
                                                name="contact_maps_embed"
                                                value={form.contact_maps_embed}
                                                onChange={handleChange}
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px] leading-relaxed"
                                            />
                                            <div className="mt-1.5 p-2.5 bg-surface-container-low rounded-xl text-[11px] text-outline flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-primary shrink-0">info</span>
                                                <span>
                                                    Tempelkan atribut <code className="text-primary font-bold">src</code> dari kode sematkan (embed) Google Maps.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TAB 6: FOOTER WEBSITE                                           */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {activeTab === 'footer' && (
                            <div className="space-y-6">
                                {/* Header Card Footer */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[24px]">dock_to_bottom</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                                                Pengaturan Lengkap Footer Website
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    Tampil di Semua Halaman
                                                </span>
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Kelola profil lembaga, media sosial, menu tautan cepat, program utama, kartu ajakan pendaftaran, hingga teks hak cipta pada bagian kaki (footer) website.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── KARTU 1: IDENTITAS LEMBAGA & NARASI (KOLOM 1) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Kolom 1: Identitas Lembaga &amp; Narasi Profil
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Nama yayasan dan deskripsi singkat misi sosial pada kolom pertama footer.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            Kolom #1
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Nama Yayasan / Lembaga
                                        </label>
                                        <input
                                            type="text"
                                            name="footer_nama_yayasan"
                                            value={form.footer_nama_yayasan}
                                            onChange={handleChange}
                                            placeholder="Yayasan Bhakti Arumi Delangga"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Narasi / Deskripsi Profil Footer
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="footer_deskripsi"
                                            value={form.footer_deskripsi}
                                            onChange={handleChange}
                                            placeholder="Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        />
                                        <p className="text-[10px] text-outline mt-1">
                                            Tampil tepat di bawah nama yayasan pada kolom pertama footer.
                                        </p>
                                    </div>
                                </div>

                                {/* ── KARTU 2: AKUN MEDIA SOSIAL (KOLOM 1) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">share</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Kolom 1: Akun Media Sosial Resmi
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Tautan ikon Instagram, TikTok, YouTube, dan Facebook pada footer.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            4 Ikon Medsos
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-pink-600">photo_camera</span>
                                                Instagram (URL)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_instagram"
                                                value={form.footer_instagram}
                                                onChange={handleChange}
                                                placeholder="https://www.instagram.com/maktabtuliassami.id/"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-slate-900">music_note</span>
                                                TikTok (URL)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_tiktok"
                                                value={form.footer_tiktok}
                                                onChange={handleChange}
                                                placeholder="https://www.tiktok.com/@maktabtuliassami.id"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-red-600">smart_display</span>
                                                YouTube (URL)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_youtube"
                                                value={form.footer_youtube}
                                                onChange={handleChange}
                                                placeholder="https://www.youtube.com/@MaktabTuliAsSami"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-blue-600">public</span>
                                                Facebook / Web (URL)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_facebook"
                                                value={form.footer_facebook}
                                                onChange={handleChange}
                                                placeholder="https://facebook.com/maktabtuliassami"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── KARTU 3: MENU KOLOM 2 (TAUTAN CEPAT) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">link</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Kolom 2: Menu Tautan Cepat
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Judul kolom dan daftar 5 tautan navigasi internal website.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            Kolom #2
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Judul Kolom
                                        </label>
                                        <input
                                            type="text"
                                            name="footer_links_title"
                                            value={form.footer_links_title}
                                            onChange={handleChange}
                                            placeholder="Tautan Cepat"
                                            className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={num} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/70">
                                                <div className="sm:col-span-1 text-[11px] font-bold text-primary">
                                                    #{num}
                                                </div>
                                                <div className="sm:col-span-5">
                                                    <label className="block text-[10px] font-semibold text-outline mb-0.5">
                                                        Teks Menu #{num}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`footer_link${num}_text`}
                                                        value={form[`footer_link${num}_text`]}
                                                        onChange={handleChange}
                                                        placeholder={`Label menu #${num}`}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-white"
                                                    />
                                                </div>
                                                <div className="sm:col-span-6">
                                                    <label className="block text-[10px] font-semibold text-outline mb-0.5">
                                                        URL / Path Halaman #{num}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`footer_link${num}_url`}
                                                        value={form[`footer_link${num}_url`]}
                                                        onChange={handleChange}
                                                        placeholder={`Contoh: /halaman-${num}`}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-mono text-[11px] bg-white"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── KARTU 4: MENU KOLOM 3 (PROGRAM UTAMA) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">school</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Kolom 3: Menu Program Utama
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Judul kolom dan daftar 4 program utama binaan yayasan.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            Kolom #3
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Judul Kolom
                                        </label>
                                        <input
                                            type="text"
                                            name="footer_program_title"
                                            value={form.footer_program_title}
                                            onChange={handleChange}
                                            placeholder="Program Utama"
                                            className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold"
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div key={num} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/70">
                                                <div className="sm:col-span-1 text-[11px] font-bold text-primary">
                                                    #{num}
                                                </div>
                                                <div className="sm:col-span-5">
                                                    <label className="block text-[10px] font-semibold text-outline mb-0.5">
                                                        Nama Program #{num}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`footer_prog${num}_text`}
                                                        value={form[`footer_prog${num}_text`]}
                                                        onChange={handleChange}
                                                        placeholder={`Nama program #${num}`}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold bg-white"
                                                    />
                                                </div>
                                                <div className="sm:col-span-6">
                                                    <label className="block text-[10px] font-semibold text-outline mb-0.5">
                                                        URL / Path Halaman #{num}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`footer_prog${num}_url`}
                                                        value={form[`footer_prog${num}_url`]}
                                                        onChange={handleChange}
                                                        placeholder={`Contoh: /daftar`}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-mono text-[11px] bg-white"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── KARTU 5: KOLOM 4 (KARTU PENDAFTARAN SANTRI BARU) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Kolom 4: Kartu Ajakan Pendaftaran Santri Baru (CTA)
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Kotak banner pendaftaran santri baru di sebelah kanan footer.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            Kolom #4
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Judul Kartu CTA
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_cta_title"
                                                value={form.footer_cta_title}
                                                onChange={handleChange}
                                                placeholder="Pendaftaran Santri Baru"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold text-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Tombol Aksi
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_cta_btn_text"
                                                value={form.footer_cta_btn_text}
                                                onChange={handleChange}
                                                placeholder="Isi Formulir Online"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Deskripsi / Teks Ajakan Pendaftaran
                                        </label>
                                        <textarea
                                            rows={2}
                                            name="footer_cta_desc"
                                            value={form.footer_cta_desc}
                                            onChange={handleChange}
                                            placeholder="Pendaftaran santri baru program Maktab Tuli dan Autis kini dibuka secara daring."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-on-surface mb-1">
                                            Link / URL Tujuan Tombol
                                        </label>
                                        <input
                                            type="text"
                                            name="footer_cta_btn_link"
                                            value={form.footer_cta_btn_link}
                                            onChange={handleChange}
                                            placeholder="/daftar"
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-mono text-[11px]"
                                        />
                                    </div>
                                </div>

                                {/* ── KARTU 6: BARIS BAWAH (COPYRIGHT & SLOGAN) ── */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">copyright</span>
                                            </div>
                                            <div>
                                                <h4 className="font-headline text-sm font-bold text-on-surface">
                                                    Baris Paling Bawah (Hak Cipta &amp; Slogan)
                                                </h4>
                                                <p className="text-[11px] text-outline">
                                                    Teks hak cipta di sebelah kiri dan slogan/tagline yayasan di sebelah kanan.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            Bottom Bar
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Hak Cipta (Sebelah Kiri)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_copyright"
                                                value={form.footer_copyright}
                                                onChange={handleChange}
                                                placeholder="© 2026 Yayasan Bhakti Arumi Delangga. All rights reserved."
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Teks Slogan / Tagline (Sebelah Kanan)
                                            </label>
                                            <input
                                                type="text"
                                                name="footer_slogan"
                                                value={form.footer_slogan}
                                                onChange={handleChange}
                                                placeholder="Pusat Pendidikan Islam & Kemandirian Disabilitas Sensorik"
                                                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Floating / Bottom Save Bar */}
                        <div className="sticky bottom-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-2xl border border-outline-variant shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-outline font-medium">
                                <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                                <span>Perubahan yang disimpan akan langsung tampil secara real-time di halaman website publik.</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10 border border-error/20 transition-all cursor-pointer"
                                >
                                    Reset Standar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {isSaving ? 'sync' : 'save'}
                                    </span>
                                    <span>{isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Seluruh Pengaturan Halaman'}</span>
                                </button>
                            </div>
                        </div>

                    </main>
                </div>
            </div>

            {/* Modal Reset Standar */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant p-6 shadow-2xl space-y-4">
                        <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <div>
                            <h3 className="font-headline text-lg font-bold text-on-surface">
                                Kembalikan Pengaturan ke Standar Awal?
                            </h3>
                            <p className="text-xs text-outline mt-1.5 leading-relaxed">
                                Tindakan ini akan mengembalikan seluruh teks, judul, dan path foto di kelima halaman ke kondisi default yayasan. Data yang sudah Anda simpan sebelumnya akan diganti.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container-high transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleResetDefaults}
                                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-error/90 shadow-xs transition-colors cursor-pointer"
                            >
                                Ya, Kembalikan ke Standar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
