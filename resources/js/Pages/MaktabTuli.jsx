import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";

const MaktabTuli = ({ galeris = [] }) => {
    const [lightboxItem, setLightboxItem] = useState(null);

    // 7 Core Learning Programs requested
    const programs = [
        {
            title: "Quran Isyarat",
            category: "Program Utama",
            description: "Pembelajaran tilawah, tajwid visual, dan tahfidz Al-Qur'an menggunakan standarisasi mushaf bahasa isyarat.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            title: "Hadist Isyarat",
            category: "Studi Islam",
            description: "Pemahaman matan hadits-hadits shahih pilihan dan pengamalan adab nabawi harian melalui bahasa isyarat visual.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
        },
        {
            title: "Fiqih Isyarat",
            category: "Ibadah Praktis",
            description: "Bimbingan tata cara thaharah, shalat, puasa, dan hukum-hukum muamalah Islam secara aplikatif dan terstruktur.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
        },
        {
            title: "Pelajaran Umum",
            category: "Akademik Dasar",
            description: "Penguatan literasi, numerasi, sains terapan, dan wawasan kebangsaan guna memperluas cakrawala berpikir santri.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
        },
        {
            title: "PKBM Ijazah Paket",
            category: "Pendidikan Formal",
            description: "Program pendidikan kesetaraan Paket A (SD), B (SMP), dan C (SMA) berijazah resmi negara untuk masa depan santri.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
        },
        {
            title: "Persiapan Kuliah",
            category: "Lanjutan Studi",
            description: "Bimbingan seleksi masuk perguruan tinggi inklusif, pendampingan beasiswa, dan penguatan kemandirian akademis tinggi.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14v7" />
                </svg>
            ),
        },
        {
            title: "Sanggar Seni",
            category: "Kreativitas & Kriya",
            description: "Wadah kreasi seni lukis, kaligrafi Islam, desain grafis, fotografi, dan kriya tangan untuk kemandirian berwirausaha.",
            icon: (
                <svg className="w-8 h-8 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4 5 5 0 015-5c.5 0 1 .1 1.5.3L15 4a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8l-8.3 5.5c.2.5.3 1 .3 1.5a5 5 0 01-5 5H7z" />
                </svg>
            ),
        },
    ];

    // Fallback gallery items
    const fallbackGallery = [
        {
            id: 1,
            judul: "Kebersamaan Belajar Sore",
            kategori: "MAKTAB TULI",
            tipe: "image",
            image: "/images/image6.png",
            deskripsi: "Sesi halaqah sore santri mendalami kosa kata Al-Qur'an isyarat bersama asatidz.",
        },
        {
            id: 2,
            judul: "Praktik Menulis & Tajwid Visual",
            kategori: "PEMBELAJARAN",
            tipe: "image",
            image: "/images/image7.png",
            deskripsi: "Santri mempraktikkan penulisan ayat Al-Qur'an dengan panduan isyarat tangan.",
        },
        {
            id: 3,
            judul: "Halaqah Al-Qur'an Isyarat",
            kategori: "MAKTAB TULI",
            tipe: "image",
            image: "/images/image8.png",
            deskripsi: "Pembelajaran intensif tilawah dan hafalan surat-surat pendek secara visual.",
        },
        {
            id: 4,
            judul: "Kegiatan Bakti Sosial & Silaturahmi",
            kategori: "ACARA SOSIAL",
            tipe: "image",
            image: "/images/image9.png",
            deskripsi: "Santri terlibat aktif dalam aksi kepedulian sosial bersama masyarakat sekitar.",
        },
        {
            id: 5,
            judul: "Kreativitas & Kriya Santri",
            kategori: "KEGIATAN YAYASAN",
            tipe: "image",
            image: "/images/image10.png",
            deskripsi: "Pengembangan bakat seni dan karya kreatif santri di sanggar inklusi.",
        },
        {
            id: 6,
            judul: "Pendidikan Karakter & Adab",
            kategori: "MAKTAB TULI",
            tipe: "image",
            image: "/images/image5.png",
            deskripsi: "Pembiasaan adab islami dan penguatan karakter kemandirian santri.",
        },
    ];

    // Latest gallery items (from props or fallback)
    const galleryItems = Array.isArray(galeris) && galeris.length > 0
        ? galeris.slice(0, 6)
        : (galeris === undefined || galeris === null ? fallbackGallery : []);

    const renderFeaturedCard = (item, colSpan = "sm:col-span-2 lg:col-span-2", height = "h-64 sm:h-72 lg:h-80") => (
        <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className={`${colSpan} relative rounded-3xl overflow-hidden group ${height} shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md`}
        >
            <img
                src={item.image}
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#025EDB] font-bold text-[11px] uppercase tracking-wider shadow-xs">
                    {item.kategori || "MAKTAB TULI"}
                </span>
            </div>
            {item.tipe === "video" && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            )}
            <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="text-lg sm:text-xl font-bold drop-shadow-md line-clamp-1">
                    {item.judul}
                </h3>
                {item.deskripsi && (
                    <p className="text-xs text-white/80 mt-1 line-clamp-2">
                        {item.deskripsi}
                    </p>
                )}
            </div>
        </div>
    );

    const renderStandardCard = (item, colSpan = "sm:col-span-1 lg:col-span-1", height = "h-64 sm:h-72 lg:h-80") => (
        <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className={`${colSpan} relative rounded-2xl overflow-hidden group ${height} shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md`}
        >
            <img
                src={item.image}
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
            <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white font-semibold text-[10px] uppercase">
                    {item.kategori || "KEGIATAN"}
                </span>
            </div>
            {item.tipe === "video" && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="text-xs sm:text-sm font-bold drop-shadow-sm line-clamp-1">
                    {item.judul}
                </h4>
                {item.deskripsi && (
                    <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
                        {item.deskripsi}
                    </p>
                )}
            </div>
        </div>
    );

    // 6 Supporting Facilities
    const facilities = [
        {
            title: "Ruang Kelas Multimedia",
            desc: "Dilengkapi proyektor resolusi tinggi, monitor interaktif, dan pencahayaan optimal untuk kenyamanan visual santri.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Media Belajar Digital",
            desc: "Aplikasi kamus isyarat agama, video pembelajaran animasi, dan modul visual yang dapat diulang kapan pun.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Konseling & Bimbingan",
            desc: "Pendampingan psikologis dan bimbingan kepribadian ramah Tuli guna memperkuat ketangguhan mental dan spiritual.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            title: "Perpustakaan Visual",
            desc: "Koleksi buku bertutur visual, literasi sejarah Islam infografis, dan referensi akademik ramah disabilitas rungu.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            )
        },
        {
            title: "Area Sosialisasi & Asrama",
            desc: "Lingkungan asrama dan ruang komunal yang nyaman, bersih, dan aman untuk membangun kebersamaan antarsantri.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            title: "Akses Internet Cepat",
            desc: "Jaringan Wi-Fi berkecepatan tinggi untuk menunjang video conference bahasa isyarat dan riset pembelajaran digital.",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
            )
        }
    ];

    return (
        <>
            <Head title="Maktab Tuli As-Sami - Bhakti Arumi" />
            <Layout>
                {/* ── HERO BANNER ── */}
                <div className="bg-[#E6EFFB]/30 flex flex-col xl:px-48 px-6 py-16 lg:py-24 border-b border-[#025EDB]/10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDE1FB] text-[#025EDB] font-bold text-xs uppercase tracking-wider mb-4 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                            <span>Pendidikan Inklusif Berkelanjutan</span>
                        </div>
                        <h1 className="text-[#0048AB] font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight leading-tight">
                            Maktab Tuli As-Sami
                        </h1>
                        <p className="text-slate-700 text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Pusat pendidikan Al-Qur'an dan bimbingan agama Islam khusus bagi Teman Tuli, membangun kemandirian spiritual dan intelektual melalui bahasa isyarat serta metode visual terpadu.
                        </p>
                    </div>
                </div>

                {/* ── PROFIL LEMBAGA ── */}
                <div className="flex flex-col lg:flex-row xl:px-48 px-6 py-16 lg:py-24 w-full gap-y-12 lg:gap-x-12 items-center">
                    <div className="w-full lg:w-1/2">
                        <div className="bg-[#EDEAE5]/70 p-3 rounded-3xl border border-gray-200/70 shadow-sm">
                            <div className="relative rounded-2xl overflow-hidden group">
                                <img
                                    src="/images/image5.png"
                                    alt="Aktivitas Belajar Maktab Tuli"
                                    className="w-full h-[320px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-lg border border-gray-100">
                                    <h3 className="text-[#025EDB] font-bold text-base">
                                        Pendidikan Inklusif
                                    </h3>
                                    <p className="text-gray-500 text-xs">
                                        Metode Visual &amp; BISINDO
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="bg-[#FFDDB7] py-1 px-3.5 text-[#653E00] text-xs font-bold w-fit rounded-lg uppercase tracking-wider">
                            Profil Lembaga
                        </span>
                        <h2 className="py-3 font-extrabold text-[#191C1D] text-2xl sm:text-3xl lg:text-4xl leading-snug">
                            Membuka Jendela Dunia Melalui Cahaya Iman
                        </h2>
                        <p className="text-[#424654] text-sm sm:text-base font-normal mb-4 leading-relaxed">
                            Maktab Tuli As-Sami didirikan dengan tekad untuk menjembatani kesenjangan akses pendidikan agama bagi saudara-saudara kita yang mengalami kendala pendengaran. Kami percaya bahwa Al-Qur'an adalah rahmat bagi semesta alam, tanpa terkecuali.
                        </p>
                        <p className="text-[#424654] text-sm sm:text-base font-normal mb-8 leading-relaxed">
                            Berawal dari kelompok belajar kecil, kini kami bertumbuh menjadi institusi yang mengintegrasikan kurikulum agama tradisional dengan pendekatan teknologi visual modern, memastikan setiap santri dapat memahami esensi Islam dengan cara yang paling efektif bagi mereka.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-[#E6EFFB]/40 transition-all duration-300">
                                <span className="text-[#0048AB] text-lg font-bold mb-1.5 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#0048AB]"></span>
                                    Kurikulum Visual
                                </span>
                                <span className="text-[#424654] font-normal text-xs leading-relaxed">
                                    Disusun sistematis dengan infografis, video interaktif, dan kamus isyarat Al-Qur'an standar.
                                </span>
                            </div>
                            <div className="flex flex-col bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-[#E6EFFB]/40 transition-all duration-300">
                                <span className="text-[#0048AB] text-lg font-bold mb-1.5 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#0048AB]"></span>
                                    Kemandirian Berdikari
                                </span>
                                <span className="text-[#424654] font-normal text-xs leading-relaxed">
                                    Membekali santri dengan ijazah formal kesetaraan, keterampilan seni, dan kesiapan masuk dunia kerja/kuliah.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── VISI & MISI (BALANCED & CLEAN) ── */}
                <div className="bg-white border-y border-gray-100 xl:px-48 px-6 py-16 lg:py-24">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold text-[#025EDB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                            Arah &amp; Komitmen Lembaga
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191C1D] mt-3">
                            Visi &amp; Misi Maktab Tuli
                        </h2>
                        <p className="text-sm text-[#424654] mt-2">
                            Pondasi nilai dan langkah nyata kami dalam membimbing santri Tuli menuju kemuliaan akhlak dan kemandirian hidup.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* VISI CARD */}
                        <div className="bg-gradient-to-br from-[#F4F8FF] to-white border border-[#CDE1FB] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#025EDB] text-white flex items-center justify-center shadow-md shadow-[#025EDB]/20 shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold tracking-wider text-[#025EDB] uppercase">Tujuan Jangka Panjang</span>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#0048AB]">Visi Utama</h3>
                                    </div>
                                </div>

                                <blockquote className="text-[#191C1D] font-bold text-base sm:text-lg leading-relaxed mb-6 bg-white p-4 rounded-2xl border border-blue-100/70 shadow-2xs">
                                    "Menjadi pusat unggulan pendidikan Al-Qur'an dan studi keislaman inklusif bagi Teman Tuli yang melahirkan generasi beriman, berakhlak mulia, cerdas berilmu, serta mandiri secara global."
                                </blockquote>

                                <div className="space-y-3 text-xs sm:text-sm text-[#424654]">
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#025EDB]/10 text-[#025EDB] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                                        <span className="leading-relaxed">Pusat rujukan terdepan dalam standarisasi pembelajaran Al-Qur'an dan Hadits berbasis isyarat visual.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#025EDB]/10 text-[#025EDB] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                                        <span className="leading-relaxed">Mewujudkan ruang tumbuh kembang yang aman, berdaya, dan setara bagi santri disabilitas rungu.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#025EDB]/10 text-[#025EDB] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                                        <span className="leading-relaxed">Membangun generasi muslim Tuli yang percaya diri, mandiri secara ekonomi, dan berkontribusi di masyarakat.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MISI CARD */}
                        <div className="bg-gradient-to-br from-[#FFF9F2] to-white border border-[#FED7AA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#D38B1D] text-white flex items-center justify-center shadow-md shadow-[#D38B1D]/20 shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold tracking-wider text-[#D38B1D] uppercase">Langkah Strategis</span>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#855400]">Misi Lembaga</h3>
                                    </div>
                                </div>

                                <p className="text-[#191C1D] font-bold text-base sm:text-lg leading-relaxed mb-6 bg-white p-4 rounded-2xl border border-amber-100/70 shadow-2xs">
                                    "Mewujudkan layanan pendidikan Islam terpadu, kesetaraan akademik, dan vokasi terapan melalui tiga pilar utama:"
                                </p>

                                <div className="space-y-3 text-xs sm:text-sm text-[#424654]">
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#D38B1D]/15 text-[#855400] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                                        <span className="leading-relaxed"><strong>Pendidikan Agama:</strong> Menyelenggarakan tilawah Al-Qur'an, Hadits, dan Fiqih berbasis isyarat baku (BISINDO) serta media interaktif.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#D38B1D]/15 text-[#855400] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                                        <span className="leading-relaxed"><strong>Kesetaraan Formal:</strong> Memfasilitasi program PKBM berijazah resmi negara serta bimbingan intensif persiapan masuk universitas.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#D38B1D]/15 text-[#855400] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                                        <span className="leading-relaxed"><strong>Kemandirian Vokasi:</strong> Mengembangkan bakat sanggar seni, kriya, teknologi digital, dan wirausaha kreatif santri.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PROGRAM PEMBELAJARAN (7 PROGRAMS) ── */}
                <div className="flex flex-col xl:px-48 px-6 py-16 lg:py-24 bg-[#F8F9FA]">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs text-[#025EDB] font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                            Kurikulum &amp; Bidang Studi
                        </span>
                        <h2 className="mt-2 text-[#191C1D] text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                            Program Pembelajaran Terpadu
                        </h2>
                        <p className="text-sm text-[#424654] mt-2">
                            Integrasi antara ilmu keislaman, pendidikan kesetaraan nasional, dan keterampilan aplikatif untuk masa depan santri.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-5 max-w-7xl mx-auto w-full">
                        {programs.map((prog, idx) => (
                            <div
                                key={idx}
                                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#E6EFFB] group-hover:bg-[#025EDB] group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-inner">
                                            <div className="group-hover:[&_svg]:text-white transition-colors">
                                                {prog.icon}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200">
                                            {prog.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#191C1D] group-hover:text-[#025EDB] transition-colors mb-2">
                                        {prog.title}
                                    </h3>
                                    <p className="text-[#424654] text-xs leading-relaxed">
                                        {prog.description}
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-semibold text-[#025EDB]">
                                    <span>Program Aktif MTAS</span>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── METODE PENGAJARAN (CLEAN & SYMMETRICAL, OVERCLAIM REMOVED) ── */}
                <div className="flex flex-col xl:px-48 px-6 py-16 lg:py-24 bg-white">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs text-[#025EDB] font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                            Pendekatan Edukasi
                        </span>
                        <h2 className="mt-2 text-[#191C1D] text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                            Metode Pengajaran Visual-First
                        </h2>
                        <p className="text-sm text-[#424654] mt-2">
                            Memaksimalkan daya serap santri melalui sinkronisasi visual terstruktur, gerak isyarat, dan interaksi sosial yang sehat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto w-full">
                        {/* 01 */}
                        <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:bg-[#E6EFFB]/50 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <span className="font-black text-3xl text-[#0048AB] block mb-2">01</span>
                                <h3 className="font-bold text-base text-[#191C1D] mb-1.5">
                                    Visual Mapping
                                </h3>
                                <p className="text-[#424654] text-xs leading-relaxed">
                                    Penyajian materi menggunakan infografis, diagram alur, dan simbol visual untuk memperkuat daya ingat santri.
                                </p>
                            </div>
                        </div>

                        {/* 02 */}
                        <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:bg-[#E6EFFB]/50 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <span className="font-black text-3xl text-[#0048AB] block mb-2">02</span>
                                <h3 className="font-bold text-base text-[#191C1D] mb-1.5">
                                    Sign-To-Text Sync
                                </h3>
                                <p className="text-[#424654] text-xs leading-relaxed">
                                    Penyelarasan gerakan isyarat dengan tulisan Arab dan Latin secara berdampingan agar pemahaman makna lebih utuh.
                                </p>
                            </div>
                        </div>

                        {/* 03 */}
                        <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:bg-[#E6EFFB]/50 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <span className="font-black text-3xl text-[#0048AB] block mb-2">03</span>
                                <h3 className="font-bold text-base text-[#191C1D] mb-1.5">
                                    Interactive Practice
                                </h3>
                                <p className="text-[#424654] text-xs leading-relaxed">
                                    Praktik ibadah langsung dengan repetisi terukur serta evaluasi visual individual oleh ustadz pengampu.
                                </p>
                            </div>
                        </div>

                        {/* 04 */}
                        <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:bg-[#E6EFFB]/50 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <span className="font-black text-3xl text-[#0048AB] block mb-2">04</span>
                                <h3 className="font-bold text-base text-[#191C1D] mb-1.5">
                                    Peer Learning
                                </h3>
                                <p className="text-[#424654] text-xs leading-relaxed">
                                    Kolaborasi belajar antarteman sebaya untuk membangun empati sosial, kekeluargaan, dan rasa percaya diri santri.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GALERI KEGIATAN SANTRI ── */}
                <div className="flex flex-col xl:px-48 px-6 py-16 lg:py-24 bg-[#F8F9FA] border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 max-w-6xl mx-auto w-full gap-4">
                        <div>
                            <span className="text-xs text-[#025EDB] font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                                Dokumentasi Nyata
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191C1D] mt-2">
                                Galeri Kegiatan Santri
                            </h2>
                            <p className="text-sm text-[#424654] mt-1">
                                Dokumentasi dan rekaman momen belajar, interaksi, serta karya kreasi santri Maktab Tuli.
                            </p>
                        </div>
                        <Link
                            href="/galeri"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#025EDB] hover:text-[#0048AB] transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs w-fit"
                        >
                            <span>Lihat Semua Galeri</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Dynamic Adaptive Bento Grid (0, 1, 2, 3, 4, 5, 6+ items) */}
                    {(() => {
                        const total = galleryItems.length;

                        // Case 0: 0 Foto (Empty State)
                        if (total === 0) {
                            return (
                                <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-100 max-w-xl mx-auto shadow-xs w-full">
                                    <div className="w-16 h-16 bg-blue-50 text-[#025EDB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#191C1D] mb-1.5">
                                        Belum Ada Dokumentasi Kegiatan
                                    </h3>
                                    <p className="text-xs text-[#424654] max-w-sm mx-auto mb-6 leading-relaxed">
                                        Foto dan rekaman momen kegiatan belajar santri akan segera kami publikasikan di sini.
                                    </p>
                                    <Link
                                        href="/galeri"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#025EDB] hover:bg-[#0048AB] text-white font-semibold text-xs rounded-xl shadow-xs transition duration-200"
                                    >
                                        <span>Buka Galeri Utama</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            );
                        }

                        // Case 1: 1 Foto (Hero Showcase Card)
                        if (total === 1) {
                            return (
                                <div className="max-w-4xl mx-auto w-full">
                                    {renderFeaturedCard(galleryItems[0], "w-full", "h-72 sm:h-96")}
                                </div>
                            );
                        }

                        // Case 2: 2 Foto (2 Kolom Seimbang 50% - 50%)
                        if (total === 2) {
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-6xl mx-auto w-full">
                                    {galleryItems.map((item) => renderFeaturedCard(item, "w-full", "h-72 sm:h-88"))}
                                </div>
                            );
                        }

                        // Case 3: 3 Foto (3 Kolom Seimbang 33.3% - 33.3% - 33.3%)
                        if (total === 3) {
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
                                    {galleryItems.map((item) => renderFeaturedCard(item, "w-full", "h-72 sm:h-80 lg:h-88"))}
                                </div>
                            );
                        }

                        // Case 4: 4 Foto (4 Kolom Rata Bersih)
                        if (total === 4) {
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto w-full">
                                    {galleryItems.map((item) => renderStandardCard(item, "w-full", "h-64 sm:h-72 lg:h-80"))}
                                </div>
                            );
                        }

                        // Case 5: 5 Foto (Bento Adaptif: Baris 1 [2+1+1=4], Baris 2 [2+2=4] Rata Sempurna)
                        if (total === 5) {
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto w-full">
                                    {/* Baris 1: 1 Besar (2 col) + 2 Sedang (1 col masing-masing) */}
                                    {renderFeaturedCard(galleryItems[0], "sm:col-span-2 lg:col-span-2")}
                                    {renderStandardCard(galleryItems[1], "sm:col-span-1 lg:col-span-1")}
                                    {renderStandardCard(galleryItems[2], "sm:col-span-1 lg:col-span-1")}

                                    {/* Baris 2: 2 Besar Berimbang (2 col masing-masing = 50%-50%) */}
                                    {renderFeaturedCard(galleryItems[3], "sm:col-span-2 lg:col-span-2")}
                                    {renderFeaturedCard(galleryItems[4], "sm:col-span-2 lg:col-span-2")}
                                </div>
                            );
                        }

                        // Case 6+: 6 Foto (Bento Simetris Klasik: Baris 1 [2+1+1=4], Baris 2 [1+1+2=4])
                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto w-full">
                                {renderFeaturedCard(galleryItems[0], "sm:col-span-2 lg:col-span-2")}
                                {renderStandardCard(galleryItems[1], "sm:col-span-1 lg:col-span-1")}
                                {renderStandardCard(galleryItems[2], "sm:col-span-1 lg:col-span-1")}
                                {renderStandardCard(galleryItems[3], "sm:col-span-1 lg:col-span-1")}
                                {renderStandardCard(galleryItems[4], "sm:col-span-1 lg:col-span-1")}
                                {renderFeaturedCard(galleryItems[5], "sm:col-span-2 lg:col-span-2")}
                            </div>
                        );
                    })()}
                </div>

                {/* ── FASILITAS PENDUKUNG (NEAT & POLISHED) ── */}
                <div className="xl:px-48 px-6 py-16 lg:py-24 flex flex-col bg-white border-t border-gray-100">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs text-[#025EDB] font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                            Sarana &amp; Prasarana
                        </span>
                        <h2 className="mt-2 text-[#191C1D] text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                            Fasilitas Pendukung Belajar
                        </h2>
                        <p className="text-sm text-[#424654] mt-2">
                            Kenyamanan dan kelengkapan fasilitas adalah prioritas utama kami demi mendukung proses belajar santri yang optimal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                        {facilities.map((fac, idx) => (
                            <div
                                key={idx}
                                className="flex gap-4 p-5 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:border-blue-200 hover:bg-[#E6EFFB]/40 hover:shadow-xs transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white group-hover:bg-[#025EDB] group-hover:text-white transition-colors duration-300 shadow-2xs shrink-0">
                                    <div className="group-hover:[&_svg]:text-white transition-colors">
                                        {fac.icon}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-base font-bold text-[#191C1D] group-hover:text-[#025EDB] transition-colors mb-1">
                                        {fac.title}
                                    </h3>
                                    <p className="text-[#424654] text-xs leading-relaxed">
                                        {fac.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── LIGHTBOX MODAL ── */}
                {lightboxItem && (
                    <div
                        onClick={() => setLightboxItem(null)}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center"
                        >
                            <button
                                onClick={() => setLightboxItem(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <img
                                src={lightboxItem.image}
                                alt={lightboxItem.judul}
                                className="w-full max-h-[70vh] object-contain bg-black"
                            />
                            <div className="p-5 bg-slate-900 text-white w-full border-t border-slate-800">
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                                    {lightboxItem.kategori}
                                </span>
                                <h3 className="text-lg font-bold mt-0.5">{lightboxItem.judul}</h3>
                                {lightboxItem.deskripsi && (
                                    <p className="text-xs text-slate-300 mt-1">{lightboxItem.deskripsi}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    );
};

export default MaktabTuli;
