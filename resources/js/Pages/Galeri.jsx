import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import React, { useState, useMemo, useEffect, useCallback } from "react";

const Galeri = ({ galleries = [], photos = [], videos = [], featuredItem = null, categories = [] }) => {
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedType, setSelectedType] = useState("all"); // 'all' | 'foto' | 'video'
    const [searchQuery, setSearchQuery] = useState("");

    // Lightbox / Photo Preview modal state
    const [lightboxIndex, setLightboxIndex] = useState(null); // index in current filtered list
    const [zoomLevel, setZoomLevel] = useState(1);

    // Video modal state
    const [activeVideo, setActiveVideo] = useState(null);

    // Fallback default categories if empty
    const categoryList = useMemo(() => {
        if (categories && categories.length > 0) return categories;
        return [
            "Semua",
            "Maktab Tuli",
            "Maktab Autis",
            "Kegiatan Yayasan",
            "Pembelajaran",
            "Acara Sosial",
        ];
    }, [categories]);

    // Fallback mock items if database is empty initially
    const allItems = useMemo(() => {
        if (galleries && galleries.length > 0) {
            return galleries;
        }
        return [
            {
                id: 1,
                judul: "Belajar Bahasa Isyarat",
                kategori: "Maktab Tuli",
                tipe: "foto",
                tanggal: "12 Okt 2023",
                image: "/images/image6.png",
                tagBg: "bg-[#E6EFFB] text-[#025EDB]",
                deskripsi: "Sesi pembelajaran bahasa isyarat santri Maktab Tuli bersama para pengajar berpengalaman.",
            },
            {
                id: 2,
                judul: "Aksi Tanam Pohon",
                kategori: "Acara Sosial",
                tipe: "foto",
                tanggal: "05 Nov 2023",
                image: "/images/image5.png",
                tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
                deskripsi: "Kegiatan penghijauan dan aksi tanam pohon oleh santri yayasan bersama komunitas relawan.",
            },
            {
                id: 3,
                judul: "Diskusi Kelompok",
                kategori: "Pembelajaran",
                tipe: "foto",
                tanggal: "20 Nov 2023",
                image: "/images/image7.png",
                tagBg: "bg-[#E0F2FE] text-[#0369A1]",
                deskripsi: "Diskusi interaktif santri dalam memecahkan soal dan melatih kemampuan berpikir kritis.",
            },
            {
                id: 4,
                judul: "Terapi Sensori Mandiri",
                kategori: "Maktab Autis",
                tipe: "foto",
                tanggal: "10 Jan 2024",
                image: "/images/image10.png",
                tagBg: "bg-[#FDF2F8] text-[#BE185D]",
                deskripsi: "Latihan terapi sensori mandiri bagi santri Maktab Autis didampingi terapis profesional.",
            },
            {
                id: 5,
                judul: "Ramah Tamah Tahunan",
                kategori: "Kegiatan Yayasan",
                tipe: "foto",
                tanggal: "15 Des 2023",
                image: "/images/image8.png",
                tagBg: "bg-[#F3F4F6] text-[#4B5563]",
                deskripsi: "Pertemuan silaturahmi tahunan antara jajaran pengurus yayasan, wali santri, dan masyarakat sekitar.",
            },
            {
                id: 6,
                judul: "Bakti Sosial Ramadan",
                kategori: "Kegiatan Yayasan",
                tipe: "foto",
                tanggal: "18 Mar 2024",
                image: "/images/image9.png",
                tagBg: "bg-[#F3F4F6] text-[#4B5563]",
                deskripsi: "Penyaluran bantuan sembako dan santunan paket Ramadan bagi warga sekitar lingkungan yayasan.",
            },
        ];
    }, [galleries]);

    // Fallback default videos if none in DB
    const displayVideos = useMemo(() => {
        if (videos && videos.length > 0) {
            return videos;
        }
        return [
            {
                id: 101,
                judul: "Profil Maktab Tuli Arumi",
                kategori: "Maktab Tuli",
                tipe: "video",
                tanggal: "14 Feb 2024",
                duration: "04:25",
                image: "/images/image1.png",
                embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                deskripsi: "Video profil pengenalan program Maktab Tuli Yayasan Bhakti Arumi Delangga.",
            },
            {
                id: 102,
                judul: "Metode Terapi Maktab Autis",
                kategori: "Maktab Autis",
                tipe: "video",
                tanggal: "15 Jan 2024",
                duration: "12:10",
                image: "/images/image3.png",
                embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                deskripsi: "Penjelasan mendalam tentang pendekatan terapi sensorik dan motorik anak berkebutuhan khusus.",
            },
            {
                id: 103,
                judul: "Dokumentasi Ramadhan 1445H",
                kategori: "Kegiatan Yayasan",
                tipe: "video",
                tanggal: "25 Mar 2024",
                duration: "08:45",
                image: "/images/image7.png",
                embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                deskripsi: "Rangkaian kegiatan santri selama bulan suci Ramadan mulai dari tadarus hingga buka puasa bersama.",
            },
        ];
    }, [videos]);

    // Filter items based on category, type, and search query
    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return allItems.filter((item) => {
            const matchesCategory =
                selectedCategory === "Semua" ||
                item.kategori === selectedCategory ||
                item.category === selectedCategory;

            const itemType = item.tipe || item.type || "foto";
            const matchesType =
                selectedType === "all" || itemType === selectedType;

            const title = (item.judul || item.title || "").toLowerCase();
            const desc = (item.deskripsi || item.description || "").toLowerCase();
            const cat = (item.kategori || item.category || "").toLowerCase();

            const matchesSearch =
                !query ||
                title.includes(query) ||
                desc.includes(query) ||
                cat.includes(query);

            return matchesCategory && matchesType && matchesSearch;
        });
    }, [allItems, selectedCategory, selectedType, searchQuery]);

    // Current active lightbox photo item
    const currentLightboxItem = useMemo(() => {
        if (lightboxIndex === null || lightboxIndex < 0 || lightboxIndex >= filteredItems.length) {
            return null;
        }
        return filteredItems[lightboxIndex];
    }, [lightboxIndex, filteredItems]);

    // Lightbox navigation handlers
    const openLightbox = (index) => {
        const item = filteredItems[index];
        if (item && (item.tipe === "video" || item.type === "video")) {
            setActiveVideo(item);
        } else {
            setLightboxIndex(index);
            setZoomLevel(1);
        }
    };

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
        setZoomLevel(1);
    }, []);

    const nextLightbox = useCallback(() => {
        if (filteredItems.length === 0) return;
        setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
        setZoomLevel(1);
    }, [filteredItems.length]);

    const prevLightbox = useCallback(() => {
        if (filteredItems.length === 0) return;
        setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        setZoomLevel(1);
    }, [filteredItems.length]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex !== null) {
                if (e.key === "Escape") closeLightbox();
                if (e.key === "ArrowRight") nextLightbox();
                if (e.key === "ArrowLeft") prevLightbox();
            } else if (activeVideo !== null) {
                if (e.key === "Escape") setActiveVideo(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, activeVideo, closeLightbox, nextLightbox, prevLightbox]);

    // Category style helper for light cards
    const getCategoryBadgeClass = (category) => {
        switch (category?.toUpperCase()) {
            case "MAKTAB TULI":
                return "bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]";
            case "MAKTAB AUTIS":
                return "bg-[#FDF2F8] text-[#BE185D] border-[#FCE7F3]";
            case "ACARA SOSIAL":
                return "bg-[#FFF3E3] text-[#D38B1D] border-[#FFE2BC]";
            case "PEMBELAJARAN":
                return "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]";
            case "KEGIATAN YAYASAN":
                return "bg-[#F3F4F6] text-[#4B5563] border-gray-200";
            default:
                return "bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]";
        }
    };

    // Category style helper for dark modal/lightbox preview (High Contrast & Clear Readability)
    const getCategoryModalBadgeClass = (category) => {
        switch (category?.toUpperCase()) {
            case "MAKTAB TULI":
                return "bg-[#025EDB] text-white border-blue-400";
            case "MAKTAB AUTIS":
                return "bg-[#BE185D] text-white border-pink-400";
            case "ACARA SOSIAL":
                return "bg-[#D38B1D] text-white border-amber-400";
            case "PEMBELAJARAN":
                return "bg-[#0369A1] text-white border-sky-400";
            case "KEGIATAN YAYASAN":
                return "bg-[#4B5563] text-white border-gray-400";
            default:
                return "bg-[#025EDB] text-white border-blue-400";
        }
    };

    // Featured event data
    const featured = featuredItem || {
        judul: "Perayaan Milad Yayasan Bhakti Arumi Delangga",
        image: "/images/image4.png",
        tanggal: "14 Feb 2024",
        deskripsi: "Momentum bersejarah dalam merayakan perjalanan pengabdian kami. Acara ini dihadiri oleh seluruh santri Maktab Tuli dan Autis, para orang tua, serta tokoh masyarakat setempat untuk mempererat silaturahmi.",
    };

    return (
        <>
            <Head title="Galeri Dokumentasi - Yayasan Bhakti Arumi Delangga" />
            <Layout>
                {/* ------------------------------------------------------------- */}
                {/* HERO HEADER SECTION                                           */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-[#E6EFFB]/30 xl:pt-14 xl:pb-24 pt-8 pb-14">
                    <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
                        {/* Subtitle Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#025EDB]/15 shadow-xs mb-5">
                            <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#025EDB]">
                                Dokumentasi &amp; Arsip Kegiatan
                            </span>
                        </div>

                        <h1 className="text-[#1A1C1E] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
                            Galeri <span className="text-[#025EDB]">Yayasan</span>
                        </h1>

                        <p className="text-[#44474E] text-base md:text-lg font-medium mt-4 max-w-2xl leading-relaxed">
                            Dokumentasi penuh makna dari setiap langkah dan senyuman adik-adik santri Yayasan Bhakti Arumi Delangga dalam mewujudkan pendidikan inklusif yang berkelanjutan.
                        </p>

                        {/* Quick Stats Badges */}
                        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold text-gray-600">
                            <span className="px-3.5 py-1.5 bg-white rounded-full border border-gray-200/80 shadow-2xs">
                                📸 {allItems.filter(i => (i.tipe || i.type) === 'foto').length} Foto Dokumentasi
                            </span>
                            <span className="px-3.5 py-1.5 bg-white rounded-full border border-gray-200/80 shadow-2xs">
                                🎬 {allItems.filter(i => (i.tipe || i.type) === 'video').length} Video Kegiatan
                            </span>
                            <span className="px-3.5 py-1.5 bg-white rounded-full border border-gray-200/80 shadow-2xs">
                                🤝 Maktab Tuli &amp; Autis
                            </span>
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* FILTER AND SEARCH CONTROLS                                    */}
                {/* ------------------------------------------------------------- */}
                <div className="xl:px-48 px-6 pb-10">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm">
                            {/* Left: Type Switcher & Category Pills */}
                            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                                {/* Media Type Switcher */}
                                <div className="inline-flex p-1 bg-gray-100/90 rounded-2xl shrink-0">
                                    <button
                                        onClick={() => setSelectedType("all")}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            selectedType === "all"
                                                ? "bg-white text-[#025EDB] shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Semua Media
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("foto")}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                            selectedType === "foto"
                                                ? "bg-white text-[#025EDB] shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Foto
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("video")}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                            selectedType === "video"
                                                ? "bg-white text-[#025EDB] shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Video
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="hidden sm:block h-7 w-px bg-gray-200 mx-1"></div>

                                {/* Categories pills scrollable */}
                                <div className="flex flex-wrap gap-2 items-center">
                                    {categoryList.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                                selectedCategory === cat
                                                    ? "bg-[#025EDB] text-white shadow-sm shadow-blue-500/20 scale-[1.02]"
                                                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#025EDB] border border-gray-100"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Search input */}
                            <div className="relative w-full lg:w-72 shrink-0">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#025EDB]/30 focus:border-[#025EDB] transition"
                                    placeholder="Cari dokumentasi..."
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search result helper */}
                        <div className="flex items-center justify-between px-2 text-xs text-gray-500 font-medium">
                            <span>
                                Menampilkan <b className="text-gray-900 font-bold">{filteredItems.length}</b> dokumentasi kegiatan
                            </span>
                            {(selectedCategory !== "Semua" || selectedType !== "all" || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory("Semua");
                                        setSelectedType("all");
                                        setSearchQuery("");
                                    }}
                                    className="text-[#025EDB] font-bold hover:underline cursor-pointer"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* GALLERY GRID SECTION (WITH HOVER EFFECTS & LIGHTBOX PREVIEW)  */}
                {/* ------------------------------------------------------------- */}
                <div className="xl:px-48 px-6 pb-24">
                    <div className="max-w-7xl mx-auto">
                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredItems.map((item, index) => {
                                    const isVideo = (item.tipe || item.type) === "video";
                                    const badgeClass = getCategoryBadgeClass(item.kategori || item.category);

                                    return (
                                        <div
                                            key={item.id || index}
                                            onClick={() => openLightbox(index)}
                                            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                                        >
                                            {/* Media Image Container with Hover Effects */}
                                            <div className="relative h-64 overflow-hidden bg-slate-100 shrink-0">
                                                <img
                                                    src={item.image || "/images/image6.png"}
                                                    alt={item.judul || item.title}
                                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                />

                                                {/* Category Badge overlay on image top-left */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide border shadow-xs backdrop-blur-md ${badgeClass}`}
                                                    >
                                                        {item.kategori || item.category}
                                                    </span>
                                                </div>

                                                {/* Media Type Icon Badge on top-right */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md ${
                                                        isVideo
                                                            ? "bg-[#D38B1D] text-white"
                                                            : "bg-white/90 text-gray-700 group-hover:bg-[#025EDB] group-hover:text-white transition-colors duration-300"
                                                    }`}>
                                                        {isVideo ? (
                                                            <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Hover Overlay with Preview Pill */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/95 text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                                        {isVideo ? (
                                                            <>
                                                                <svg className="w-4 h-4 text-[#D38B1D]" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                                <span>Putar Video</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                <span>Pratinjau Foto</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Video Duration Badge */}
                                                {isVideo && item.duration && (
                                                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                                                        {item.duration}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#1A1C1E] leading-snug group-hover:text-[#025EDB] transition duration-300 line-clamp-2">
                                                        {item.judul || item.title}
                                                    </h3>
                                                    {item.deskripsi && (
                                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                                            {item.deskripsi}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Date & Action */}
                                                <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100 text-xs text-[#74777F]">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <svg
                                                            className="w-4 h-4 text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <span>{item.tanggal || item.date}</span>
                                                    </div>

                                                    <span className="text-[#025EDB] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        Buka
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto p-8">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#025EDB] flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.75}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Dokumentasi Tidak Ditemukan
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                                    Coba ubah kata kunci pencarian Anda atau pilih kategori dan tipe media lain.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("Semua");
                                        setSelectedType("all");
                                        setSearchQuery("");
                                    }}
                                    className="mt-6 px-5 py-2.5 bg-[#025EDB] text-white text-xs font-bold rounded-full hover:bg-blue-700 transition cursor-pointer shadow-sm"
                                >
                                    Tampilkan Semua Dokumentasi
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* FEATURED HIGHLIGHT BANNER (KEGIATAN UTAMA)                    */}
                {/* ------------------------------------------------------------- */}
                {featured && (
                    <div className="xl:px-48 px-6 pb-24">
                        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-800 via-[#025EDB] to-blue-700 rounded-[36px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 relative">
                            {/* Decorative light pattern */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                            {/* Event Image */}
                            <div className="lg:col-span-6 relative h-72 lg:h-auto min-h-[360px] overflow-hidden group">
                                <img
                                    src={featured.image || "/images/image4.png"}
                                    alt={featured.judul}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>

                                {/* Floating Tag */}
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-blue-900 font-extrabold text-xs uppercase tracking-wider backdrop-blur-md shadow-md">
                                        ⭐ Sorotan Utama Yayasan
                                    </span>
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-center text-white relative z-10">
                                <span className="text-xs font-bold text-[#FFDDB7] tracking-widest uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#FFDDB7] animate-ping"></span>
                                    Kegiatan Utama
                                </span>
                                <h2 className="text-3xl lg:text-4xl font-extrabold mt-3 leading-tight text-white">
                                    {featured.judul}
                                </h2>
                                <p className="text-blue-100/90 text-sm lg:text-base font-medium mt-5 leading-relaxed">
                                    {featured.deskripsi || "Momentum bersejarah dalam merayakan perjalanan pengabdian kami bersama seluruh santri, wali santri, dan masyarakat."}
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => {
                                            const idx = filteredItems.findIndex(i => i.id === featured.id);
                                            if (idx >= 0) {
                                                openLightbox(idx);
                                            } else {
                                                setLightboxIndex(0);
                                            }
                                        }}
                                        className="bg-[#D38B1D] hover:bg-[#b87616] text-white font-bold py-3.5 px-8 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Lihat Foto Dokumentasi</span>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>

                                    <Link
                                        href="/kontak"
                                        className="text-white hover:text-blue-200 text-xs font-bold underline underline-offset-4 transition"
                                    >
                                        Hubungi Panitia Kegiatan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* VIDEO DOCUMENTATION SECTION                                   */}
                {/* ------------------------------------------------------------- */}
                <div className="xl:px-48 px-6 pb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D38B1D] uppercase tracking-wider mb-1">
                                    <span>🎬 Video Dokumentasi</span>
                                </div>
                                <h2 className="text-3xl font-extrabold text-[#1A1C1E]">
                                    Cuplikan Aktivitas &amp; Pembelajaran
                                </h2>
                                <p className="text-[#44474E] text-sm font-medium mt-1.5">
                                    Saksikan langsung keceriaan, semangat belajar, dan perkembangan adik-adik santri.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedType("video");
                                    window.scrollTo({ top: 300, behavior: "smooth" });
                                }}
                                className="text-[#025EDB] hover:text-blue-700 font-bold text-sm flex items-center gap-1.5 transition cursor-pointer"
                            >
                                Filter Video Saja
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Video Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayVideos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 p-3 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    {/* Video Thumbnail Container */}
                                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xs bg-slate-900">
                                        <img
                                            src={video.image || "/images/image1.png"}
                                            alt={video.judul || video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />

                                        {/* Play Overlay Button with animated pulse */}
                                        <div className="absolute inset-0 bg-black/25 flex justify-center items-center group-hover:bg-black/40 transition duration-300">
                                            <div className="w-14 h-14 rounded-full bg-white flex justify-center items-center shadow-xl transform group-hover:scale-115 group-hover:bg-[#025EDB] transition-all duration-300">
                                                <svg
                                                    className="w-6 h-6 text-[#025EDB] group-hover:text-white translate-x-0.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Duration Badge */}
                                        {video.duration && (
                                            <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                                                {video.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Video Title & Meta */}
                                    <div className="p-3 pt-4">
                                        <span className="text-[11px] font-bold text-[#025EDB] uppercase tracking-wide">
                                            {video.kategori || "Kegiatan Yayasan"}
                                        </span>
                                        <h3 className="text-base font-bold text-[#1A1C1E] mt-1 leading-snug group-hover:text-[#025EDB] transition duration-300 line-clamp-2">
                                            {video.judul || video.title}
                                        </h3>
                                        <p className="text-xs text-[#74777F] font-medium mt-2 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {video.tanggal || "Terbaru"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* ============================================================= */}
                {/* PHOTO LIGHTBOX PREVIEW MODAL (INTERACTIVE SLIDER & ZOOM)     */}
                {/* ============================================================= */}
                {currentLightboxItem && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in select-none"
                        onClick={(e) => {
                            // Click backdrop to close
                            if (e.target === e.currentTarget) closeLightbox();
                        }}
                    >
                        {/* Lightbox Top Bar */}
                        <div className="flex items-center justify-between text-white z-20 px-2 py-2 max-w-4xl mx-auto w-full">
                            {/* Counter & Info */}
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wider backdrop-blur-sm">
                                    Foto {lightboxIndex + 1} dari {filteredItems.length}
                                </span>
                                <span className="text-xs text-gray-300 hidden sm:inline-block">
                                    Gunakan tombol panah ◄ ► untuk navigasi foto
                                </span>
                            </div>

                            {/* Control Actions */}
                            <div className="flex items-center gap-2">
                                {/* Zoom controls */}
                                <button
                                    onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                    title="Perbesar (Zoom In)"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                    title="Perkecil (Zoom Out)"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setZoomLevel(1)}
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
                                    title="Reset Zoom"
                                >
                                    {Math.round(zoomLevel * 100)}%
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={closeLightbox}
                                    className="p-2 rounded-full bg-white/15 hover:bg-red-600 text-white transition cursor-pointer ml-2"
                                    title="Tutup (ESC)"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Lightbox Center Image Viewport */}
                        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-auto">
                            {/* Prev Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevLightbox();
                                }}
                                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
                                title="Foto Sebelumnya"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Main Image with Zoom Support */}
                            <div className="max-w-5xl max-h-[72vh] flex items-center justify-center p-2">
                                <img
                                    src={currentLightboxItem.image || "/images/image6.png"}
                                    alt={currentLightboxItem.judul || currentLightboxItem.title}
                                    style={{ transform: `scale(${zoomLevel})` }}
                                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200"
                                />
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextLightbox();
                                }}
                                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
                                title="Foto Berikutnya"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Lightbox Bottom Caption Bar */}
                        <div className="z-20 bg-black/60 backdrop-blur-md rounded-2xl p-4 max-w-4xl mx-auto w-full text-white border border-white/10 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold uppercase border shadow-xs ${
                                            getCategoryModalBadgeClass(currentLightboxItem.kategori || currentLightboxItem.category)
                                        }`}>
                                            {currentLightboxItem.kategori || currentLightboxItem.category}
                                        </span>
                                        <span className="text-xs text-gray-300">
                                            📅 {currentLightboxItem.tanggal || currentLightboxItem.date}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                                        {currentLightboxItem.judul || currentLightboxItem.title}
                                    </h3>
                                </div>

                                <a
                                    href={currentLightboxItem.image}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold shrink-0 inline-flex items-center gap-1.5 transition self-start sm:self-center"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Buka Foto Asli
                                </a>
                            </div>

                            {currentLightboxItem.deskripsi && (
                                <p className="text-xs text-gray-300 mt-2 border-t border-white/10 pt-2 line-clamp-2">
                                    {currentLightboxItem.deskripsi}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================================= */}
                {/* VIDEO MODAL PLAYER POPUP (WITH DESCRIPTION & METADATA)       */}
                {/* ============================================================= */}
                {activeVideo && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in select-none overflow-y-auto"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setActiveVideo(null);
                        }}
                    >
                        {/* Video Top Bar */}
                        <div className="flex items-center justify-between text-white z-20 px-2 py-2 max-w-4xl mx-auto w-full">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-[#D38B1D] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Video Dokumentasi
                                </span>
                                {activeVideo.duration && (
                                    <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold text-gray-200 backdrop-blur-sm">
                                        ⏱️ {activeVideo.duration}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setActiveVideo(null)}
                                className="p-2 rounded-full bg-white/15 hover:bg-red-600 text-white transition cursor-pointer"
                                title="Tutup (ESC)"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Center: Video Player Container */}
                        <div className="max-w-4xl w-full mx-auto my-auto py-2">
                            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border border-white/10">
                                <iframe
                                    src={`${activeVideo.embed_url || activeVideo.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"}?autoplay=1`}
                                    title={activeVideo.judul || activeVideo.title}
                                    className="w-full h-full border-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Bottom Description Card (Matching Photo Preview) */}
                        <div className="z-20 bg-black/60 backdrop-blur-md rounded-2xl p-4 max-w-4xl mx-auto w-full text-white border border-white/10 shadow-lg mt-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold uppercase border shadow-xs ${
                                            getCategoryModalBadgeClass(activeVideo.kategori || activeVideo.category)
                                        }`}>
                                            {activeVideo.kategori || activeVideo.category || "KEGIATAN YAYASAN"}
                                        </span>
                                        <span className="text-xs text-gray-300">
                                            📅 {activeVideo.tanggal || activeVideo.date || "Terbaru"}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                                        {activeVideo.judul || activeVideo.title}
                                    </h3>
                                </div>

                                {(activeVideo.video_url || activeVideo.embed_url) && (
                                    <a
                                        href={activeVideo.video_url || activeVideo.embed_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold shrink-0 inline-flex items-center gap-1.5 transition self-start sm:self-center"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Buka Video Asli
                                    </a>
                                )}
                            </div>

                            {activeVideo.deskripsi && (
                                <p className="text-xs text-gray-300 mt-2 border-t border-white/10 pt-2 leading-relaxed">
                                    {activeVideo.deskripsi}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Layout>
        </>
    );
};

export default Galeri;
