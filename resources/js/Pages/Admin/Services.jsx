import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Elements/Sidebar';
import TopBar from '@/Components/Elements/TopBar';

export default function Services({ auth, settings = {}, success, status }) {
    const user = auth?.user || { name: 'Admin Utama', email: 'admin@bhaktiarumi.org', role: 'Super Admin' };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'about' | 'services' | 'contact'
    const [isSaving, setIsSaving] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(success || status || '');

    // Form State for all customizable site settings
    const [form, setForm] = useState({
        // Hero Section
        hero_badge: settings.hero_badge || 'Pusat Pendidikan & Perlindungan Inklusif',
        hero_title_line1: settings.hero_title_line1 || 'Yayasan Bhakti',
        hero_title_line2: settings.hero_title_line2 || 'Arumi Delangga',
        hero_description: settings.hero_description || 'Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.',
        hero_btn1_text: settings.hero_btn1_text || 'Tentang Yayasan',
        hero_btn1_link: settings.hero_btn1_link || '/maktabtuli',
        hero_btn2_text: settings.hero_btn2_text || 'Daftar Santri',
        hero_btn2_link: settings.hero_btn2_link || '/daftar',
        hero_image: settings.hero_image || '/images/hero_foto.png',

        // Tentang Yayasan Section
        about_title: settings.about_title || 'Dedikasi untuk Inklusi dan Spiritualitas',
        about_description: settings.about_description || 'Didirikan dengan semangat kasih sayang, Yayasan Bhakti Arumi Delangga hadir sebagai jembatan bagi anak-anak berkebutuhan khusus, khususnya teman Tuli dan Autis, untuk mendapatkan hak pendidikan agama dan umum yang setara.',
        about_image1: settings.about_image1 || '/images/image1.png',
        about_image2: settings.about_image2 || '/images/image2.png',
        about_image3: settings.about_image3 || '/images/image3.png',
        about_image4: settings.about_image4 || '/images/image4.png',
        about_sejarah_title: settings.about_sejarah_title || 'Sejarah Singkat & Komitmen',
        about_sejarah_desc: settings.about_sejarah_desc || 'Didirikan sejak tahun 2020 sebagai ikhtiar memperluas akses pembelajaran Al-Qur\'an bahasa isyarat di Pontianak, Kalimantan Barat.',
        about_visi: settings.about_visi || 'Menjadi pusat unggulan pendidikan Al-Qur\'an dan studi keislaman inklusif bagi Teman Tuli & Autis yang berakhlak mulia dan mandiri.',
        about_misi: settings.about_misi || 'Membangun kurikulum tahfidz isyarat, menyelenggarakan terapi kemandirian sensori, dan membina keluarga santri.',

        // Program & Layanan (Services)
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

        // Kontak, Maps & Media Sosial
        contact_nama_yayasan: settings.contact_nama_yayasan || 'Yayasan Bhakti Arumi Delangga',
        contact_tagline: settings.contact_tagline || 'Maktab Tuli As-Sami & Maktab Autis',
        contact_address: settings.contact_address || 'Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124',
        contact_phone: settings.contact_phone || '+62 812-3456-7890',
        contact_whatsapp: settings.contact_whatsapp || '081234567890',
        contact_email: settings.contact_email || 'info@bhaktiarumi.org',
        contact_hours: settings.contact_hours || 'Senin - Sabtu: 08:00 - 16:30 WIB',
        contact_maps_embed: settings.contact_maps_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid',
        contact_maps_link: settings.contact_maps_link || 'https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak',
        contact_instagram: settings.contact_instagram || 'https://www.instagram.com/maktabtuliassami.id/',
        contact_tiktok: settings.contact_tiktok || 'https://www.tiktok.com/@maktabtuliassami.id',
        contact_youtube: settings.contact_youtube || 'https://www.youtube.com/@MaktabTuliAsSami',
        contact_facebook: settings.contact_facebook || 'https://facebook.com/maktabtuliassami',
    });

    // File preview states for newly selected files
    const [fileUploads, setFileUploads] = useState({});
    const [previewUrls, setPreviewUrls] = useState({});

    // Handle text input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
                setToastMessage('Alhamdulillah! Konten tampilan dan pengaturan website berhasil disimpan.');
                setTimeout(() => setToastMessage(''), 5000);
            },
            onError: (errors) => {
                setIsSaving(false);
                alert('Terjadi kesalahan saat menyimpan pengaturan. Pastikan format file gambar sesuai (Maks 5MB).');
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

    const tabs = [
        { id: 'hero', name: 'Hero & Tampilan Depan', icon: 'wallpaper', desc: 'Foto utama, judul besar, dan tombol aksi beranda' },
        { id: 'about', name: 'Tentang Yayasan & Kolase', icon: 'domain', desc: 'Profil yayasan, 4 foto kolase, visi & misi' },
        { id: 'services', name: 'Program & Layanan', icon: 'school', desc: 'Kartu Maktab Tuli, Maktab Autis & Parenting' },
        { id: 'contact', name: 'Kontak, Maps & Medsos', icon: 'location_on', desc: 'Alamat, nomor WA/HP, email, embed Google Maps' },
    ];

    return (
        <>
            <Head title="Manajemen Konten & Layanan Website - Admin Bhakti Arumi" />

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
                        title="Layanan & Konten Website"
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">auto_fix_high</span>
                                </div>
                                <div>
                                    <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                                        Manajemen Konten &amp; Halaman Depan
                                    </h1>
                                    <p className="text-xs sm:text-sm text-outline mt-0.5">
                                        Ubah foto beranda, teks headline, informasi kontak, dan Google Maps secara langsung tanpa perlu koding.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant transition-all shadow-2xs"
                                >
                                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    <span>Pratinjau Web Publik</span>
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
                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-white text-primary font-bold shadow-xs border border-outline-variant/60'
                                                : 'text-outline hover:text-on-surface hover:bg-white/50'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                                            {tab.icon}
                                        </span>
                                        <div className="truncate">
                                            <p className="text-xs sm:text-sm font-semibold truncate leading-tight">{tab.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* TAB 1: HERO & TAMPILAN DEPAN */}
                        {activeTab === 'hero' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-5">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            Teks &amp; Tombol Aksi Hero (Bagian Atas Beranda)
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Informasi utama yang pertama kali dilihat oleh pengunjung website yayasan.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
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
                                    </div>
                                </div>

                                {/* Right Side: Foto Hero Upload & Preview */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="border-b border-outline-variant/60 pb-3 mb-4">
                                            <h3 className="font-headline text-base font-bold text-on-surface">
                                                Foto Utama Hero
                                            </h3>
                                            <p className="text-xs text-outline">
                                                Foto santri/kegiatan yang tampil di sisi kanan banner utama.
                                            </p>
                                        </div>

                                        <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/80 bg-surface-container-low group">
                                            <img
                                                src={previewUrls.hero_image || form.hero_image}
                                                alt="Pratinjau Hero"
                                                className="w-full h-56 sm:h-64 object-cover"
                                                onError={(e) => { e.target.src = '/images/hero_foto.png'; }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                                <label className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-primary hover:text-white transition-colors shadow-lg">
                                                    Ganti Foto Utama
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, 'hero_image')}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <label className="block text-xs font-semibold text-outline mb-1">
                                                Atau Masukkan URL Gambar:
                                            </label>
                                            <input
                                                type="text"
                                                name="hero_image"
                                                value={form.hero_image}
                                                onChange={handleChange}
                                                placeholder="/images/hero_foto.png"
                                                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-surface-container-low"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 text-xs space-y-1">
                                        <p className="font-bold text-primary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">info</span>
                                            Tips Gambar Hero
                                        </p>
                                        <p className="text-outline text-[11px] leading-relaxed">
                                            Gunakan foto portrait atau landscape dengan rasio 4:3 / 1:1 resolusi minimal 800x800px (format PNG/JPG).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: TENTANG YAYASAN & KOLASE */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            Profil &amp; Narasi Tentang Yayasan
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Teks perkenalan dan visi misi yang tampil pada section kedua beranda.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Judul Section Profil
                                                </label>
                                                <input
                                                    type="text"
                                                    name="about_title"
                                                    value={form.about_title}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Deskripsi Utama Yayasan
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    name="about_description"
                                                    value={form.about_description}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs leading-relaxed"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Visi Yayasan
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    name="about_visi"
                                                    value={form.about_visi}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Misi Yayasan
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    name="about_misi"
                                                    value={form.about_misi}
                                                    onChange={handleChange}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4 Kolase Gambar */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            4 Foto Kolase Galeri Tentang Yayasan
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Ubah foto-foto aktivitas santri yang disusun dalam grid kolase artistik.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Image 1 */}
                                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                            <p className="text-xs font-bold text-on-surface">1. Foto Aktivitas Kiri Atas</p>
                                            <div className="h-36 rounded-lg overflow-hidden border border-outline-variant bg-slate-100">
                                                <img
                                                    src={previewUrls.about_image1 || form.about_image1}
                                                    alt="Kolase 1"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = '/images/image1.png'; }}
                                                />
                                            </div>
                                            <label className="block w-full text-center bg-white hover:bg-primary hover:text-white text-primary border border-primary/30 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                                                Upload Foto 1
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'about_image1')} />
                                            </label>
                                        </div>

                                        {/* Image 2 */}
                                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                            <p className="text-xs font-bold text-on-surface">2. Banner / Badge Kiri Bawah</p>
                                            <div className="h-36 rounded-lg overflow-hidden border border-outline-variant bg-[#D89322]/20 flex items-center justify-center p-2">
                                                <img
                                                    src={previewUrls.about_image2 || form.about_image2}
                                                    alt="Kolase 2"
                                                    className="max-h-24 max-w-full object-contain"
                                                    onError={(e) => { e.target.src = '/images/image2.png'; }}
                                                />
                                            </div>
                                            <label className="block w-full text-center bg-white hover:bg-primary hover:text-white text-primary border border-primary/30 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                                                Upload Foto 2
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'about_image2')} />
                                            </label>
                                        </div>

                                        {/* Image 3 */}
                                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                            <p className="text-xs font-bold text-on-surface">3. Foto Kelas Kanan Atas</p>
                                            <div className="h-36 rounded-lg overflow-hidden border border-outline-variant bg-slate-100">
                                                <img
                                                    src={previewUrls.about_image3 || form.about_image3}
                                                    alt="Kolase 3"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = '/images/image3.png'; }}
                                                />
                                            </div>
                                            <label className="block w-full text-center bg-white hover:bg-primary hover:text-white text-primary border border-primary/30 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                                                Upload Foto 3
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'about_image3')} />
                                            </label>
                                        </div>

                                        {/* Image 4 */}
                                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                                            <p className="text-xs font-bold text-on-surface">4. Foto Guru Kanan Bawah</p>
                                            <div className="h-36 rounded-lg overflow-hidden border border-outline-variant bg-slate-100">
                                                <img
                                                    src={previewUrls.about_image4 || form.about_image4}
                                                    alt="Kolase 4"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = '/images/image4.png'; }}
                                                />
                                            </div>
                                            <label className="block w-full text-center bg-white hover:bg-primary hover:text-white text-primary border border-primary/30 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                                                Upload Foto 4
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'about_image4')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: PROGRAM & LAYANAN (SERVICES) */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            Daftar Layanan &amp; Program Pendidikan Yayasan
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Kelola kartu layanan yang tampil pada menu layanan publik dan halaman detail.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Service 1 */}
                                        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                                                    <span className="material-symbols-outlined text-[18px]">sign_language</span>
                                                    Program 1
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Nama Program</label>
                                                    <input
                                                        type="text"
                                                        name="service1_title"
                                                        value={form.service1_title}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tag Kategori</label>
                                                    <input
                                                        type="text"
                                                        name="service1_tag"
                                                        value={form.service1_tag}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="service1_desc"
                                                        value={form.service1_desc}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white leading-relaxed"
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tautan / Halaman</label>
                                                    <input
                                                        type="text"
                                                        name="service1_link"
                                                        value={form.service1_link}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-outline-variant/40">
                                                <div className="h-28 rounded-lg overflow-hidden mb-2 bg-slate-200">
                                                    <img
                                                        src={previewUrls.service1_image || form.service1_image}
                                                        alt="Service 1"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = '/images/image6.png'; }}
                                                    />
                                                </div>
                                                <label className="block text-center bg-white text-primary text-xs font-semibold py-1.5 rounded-lg border border-primary/30 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                    Upload Foto Program 1
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'service1_image')} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Service 2 */}
                                        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                                                    <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                                                    Program 2
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Nama Program</label>
                                                    <input
                                                        type="text"
                                                        name="service2_title"
                                                        value={form.service2_title}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tag Kategori</label>
                                                    <input
                                                        type="text"
                                                        name="service2_tag"
                                                        value={form.service2_tag}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="service2_desc"
                                                        value={form.service2_desc}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white leading-relaxed"
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tautan / Halaman</label>
                                                    <input
                                                        type="text"
                                                        name="service2_link"
                                                        value={form.service2_link}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-outline-variant/40">
                                                <div className="h-28 rounded-lg overflow-hidden mb-2 bg-slate-200">
                                                    <img
                                                        src={previewUrls.service2_image || form.service2_image}
                                                        alt="Service 2"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = '/images/image7.png'; }}
                                                    />
                                                </div>
                                                <label className="block text-center bg-white text-primary text-xs font-semibold py-1.5 rounded-lg border border-primary/30 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                    Upload Foto Program 2
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'service2_image')} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Service 3 */}
                                        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                                                    <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                                                    Program 3
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Nama Program</label>
                                                    <input
                                                        type="text"
                                                        name="service3_title"
                                                        value={form.service3_title}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tag Kategori</label>
                                                    <input
                                                        type="text"
                                                        name="service3_tag"
                                                        value={form.service3_tag}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Deskripsi Layanan</label>
                                                    <textarea
                                                        rows={3}
                                                        name="service3_desc"
                                                        value={form.service3_desc}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white leading-relaxed"
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-outline mb-1">Tautan / Halaman</label>
                                                    <input
                                                        type="text"
                                                        name="service3_link"
                                                        value={form.service3_link}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-outline-variant/40">
                                                <div className="h-28 rounded-lg overflow-hidden mb-2 bg-slate-200">
                                                    <img
                                                        src={previewUrls.service3_image || form.service3_image}
                                                        alt="Service 3"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = '/images/image8.png'; }}
                                                    />
                                                </div>
                                                <label className="block text-center bg-white text-primary text-xs font-semibold py-1.5 rounded-lg border border-primary/30 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                    Upload Foto Program 3
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'service3_image')} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: KONTAK, MAPS & MEDSOS */}
                        {activeTab === 'contact' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Side: Info Kontak & Medsos */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            Informasi Kontak &amp; Operasional
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Tampil pada halaman Kontak, Footer, dan Header website.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Alamat Lengkap Kantor &amp; Asrama
                                            </label>
                                            <textarea
                                                rows={2}
                                                name="contact_address"
                                                value={form.contact_address}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Nomor WhatsApp / HP
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contact_whatsapp"
                                                    value={form.contact_whatsapp}
                                                    onChange={handleChange}
                                                    placeholder="081234567890"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-on-surface mb-1">
                                                    Email Resmi
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contact_email"
                                                    value={form.contact_email}
                                                    onChange={handleChange}
                                                    placeholder="info@bhaktiarumi.org"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Jam Pelayanan / Operasional
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_hours"
                                                value={form.contact_hours}
                                                onChange={handleChange}
                                                placeholder="Senin - Sabtu: 08:00 - 16:30 WIB"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>

                                        <div className="pt-3 border-t border-outline-variant/60 space-y-3">
                                            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">share</span>
                                                Tautan Media Sosial Yayasan
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Instagram URL</label>
                                                    <input
                                                        type="text"
                                                        name="contact_instagram"
                                                        value={form.contact_instagram}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">TikTok URL</label>
                                                    <input
                                                        type="text"
                                                        name="contact_tiktok"
                                                        value={form.contact_tiktok}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">YouTube URL</label>
                                                    <input
                                                        type="text"
                                                        name="contact_youtube"
                                                        value={form.contact_youtube}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-outline mb-1">Facebook URL</label>
                                                    <input
                                                        type="text"
                                                        name="contact_facebook"
                                                        value={form.contact_facebook}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Google Maps Embed & Preview */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                                    <div className="border-b border-outline-variant/60 pb-3">
                                        <h3 className="font-headline text-base font-bold text-on-surface">
                                            Google Maps &amp; Koordinat Lokasi
                                        </h3>
                                        <p className="text-xs text-outline">
                                            Peta interaktif yang disematkan pada halaman Kontak dan Footer.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                URL Embed Google Maps (iframe src)
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_embed"
                                                value={form.contact_maps_embed}
                                                onChange={handleChange}
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs font-mono"
                                            />
                                            <p className="text-[11px] text-outline mt-1">
                                                Buka Google Maps &gt; Bagikan &gt; Sematkan peta &gt; Salin isi <code>src="..."</code>.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-on-surface mb-1">
                                                Tautan Langsung Google Maps
                                            </label>
                                            <input
                                                type="text"
                                                name="contact_maps_link"
                                                value={form.contact_maps_link}
                                                onChange={handleChange}
                                                placeholder="https://maps.google.com/?q=..."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs"
                                            />
                                        </div>

                                        {/* Maps Live Preview */}
                                        <div className="pt-2">
                                            <p className="text-xs font-bold text-on-surface mb-2 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px] text-emerald-600">map</span>
                                                Pratinjau Peta Saat Ini:
                                            </p>
                                            <div className="h-56 rounded-xl overflow-hidden border border-outline-variant shadow-inner bg-slate-100">
                                                {form.contact_maps_embed ? (
                                                    <iframe
                                                        src={form.contact_maps_embed}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="Live Maps Preview"
                                                    ></iframe>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-outline text-xs">
                                                        Masukkan URL Embed untuk melihat pratinjau peta
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Floating Save Button Bar at Bottom */}
                        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-outline-variant shadow-lg flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-outline hidden sm:flex">
                                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                                <span>Perubahan yang disimpan langsung aktif di halaman depan website.</span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-surface-container-high hover:bg-surface-container-highest transition-colors cursor-pointer"
                                >
                                    Batal / Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {isSaving ? 'sync' : 'save'}
                                    </span>
                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                                </button>
                            </div>
                        </div>

                    </main>
                </div>
            </div>

            {/* Modal Reset Defaults */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-outline-variant">
                        <div className="flex items-center gap-3 text-error">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                            <h3 className="font-headline text-lg font-bold text-on-surface">Kembalikan ke Standar Awal?</h3>
                        </div>
                        <p className="text-xs text-outline leading-relaxed">
                            Semua penyesuaian teks, foto, dan informasi kontak akan dikembalikan ke format standar bawaan sistem yayasan.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-surface-container-high cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleResetDefaults}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-error/90 cursor-pointer shadow-xs"
                            >
                                Ya, Kembalikan Standar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
