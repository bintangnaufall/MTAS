import Layout from "@/Layouts/Layout";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 6;
const DEFAULT_CATEGORIES = ["Semua", "KEGIATAN", "PENDIDIKAN", "PENGUMUMAN", "MAKTAB TULI"];

const Berita = ({ beritaList = [], featuredBerita = null, aktivitasTerbaru = [], filters = {} }) => {
    const { siteSettings = {} } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(filters?.kategori || "Semua");
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [currentPage, setCurrentPage] = useState(1);

    // Active headline article (prioritize is_featured, fallback to latest published, or null if no news)
    const activeHeadline = useMemo(() => {
        if (featuredBerita) return featuredBerita;
        if (beritaList && beritaList.length > 0) {
            return beritaList.find((b) => b.is_featured) || beritaList[0];
        }
        return null;
    }, [featuredBerita, beritaList]);

    // Extract dynamic categories based on existing data
    const dynamicCategories = useMemo(() => {
        const cats = new Set(DEFAULT_CATEGORIES);
        if (beritaList && Array.isArray(beritaList)) {
            beritaList.forEach((b) => {
                if (b.kategori) cats.add(b.kategori.toUpperCase());
            });
        }
        return Array.from(cats);
    }, [beritaList]);

    // Grid articles: Exclude the top headline if in "Semua" and not searching to prevent duplicates
    const gridSource = useMemo(() => {
        if (!beritaList || beritaList.length === 0) return [];
        if (selectedCategory === "Semua" && !searchQuery.trim() && activeHeadline) {
            const filtered = beritaList.filter((b) => b.id !== activeHeadline.id);
            return filtered;
        }
        return beritaList;
    }, [beritaList, selectedCategory, searchQuery, activeHeadline]);

    // Filter by selected category & search query
    const filteredBerita = useMemo(() => {
        return gridSource.filter((item) => {
            const matchCat =
                selectedCategory === "Semua" ||
                item.kategori?.toUpperCase() === selectedCategory.toUpperCase();
            const q = searchQuery.toLowerCase().trim();
            const matchSearch =
                !q ||
                (item.judul || "").toLowerCase().includes(q) ||
                (item.deskripsi || "").toLowerCase().includes(q) ||
                (item.penulis || "").toLowerCase().includes(q);
            return matchCat && matchSearch;
        });
    }, [gridSource, selectedCategory, searchQuery]);

    const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE) || 1;
    const paginatedBerita = filteredBerita.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Latest 3 activities for the sidebar
    const aktivitasList = useMemo(() => {
        if (aktivitasTerbaru && aktivitasTerbaru.length > 0) {
            return aktivitasTerbaru.slice(0, 3);
        }
        if (beritaList && beritaList.length > 0) {
            return beritaList.slice(0, 3).map((b, index) => ({
                id: b.id,
                slug: b.slug,
                kategori: b.kategori,
                tagBg: b.tagBg,
                judul: b.judul,
                ringkasan: b.deskripsi,
                image: b.image || "/images/berita_utama.png",
                time: b.time_ago || "HARI INI",
                isActive: index === 0,
            }));
        }
        return [];
    }, [aktivitasTerbaru, beritaList]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setSelectedCategory("Semua");
        setSearchQuery("");
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="Berita - Yayasan Bhakti Arumi Delangga" />
            <Layout>
                {/* Hero Header */}
                <div className="bg-[#E6EFFB]/30 xl:pt-14 xl:pb-24 pt-8 pb-14 flex flex-col items-center justify-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#025EDB]/15 shadow-xs mb-5">
                        <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                        <span className="text-[#025EDB] font-bold text-xs uppercase tracking-wider">
                            {siteSettings.berita_header_badge || "Kabar & Informasi Terkini"}
                        </span>
                    </div>
                    <h1 className="text-[#1A1C1E] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
                        {siteSettings.berita_header_title || <>Berita <span className="text-[#025EDB]">Yayasan</span></>}
                    </h1>
                    <p className="text-[#44474E] text-base md:text-lg font-medium mt-4 max-w-2xl px-6 leading-relaxed">
                        {siteSettings.berita_header_desc || "Informasi, agenda kegiatan, dan kabar terkini seputar program pendidikan dan sosial Yayasan Bhakti Arumi Delangga."}
                    </p>
                </div>

                {/* Berita Utama (Headline di Paling Atas) */}
                <div className="xl:px-48 px-6 pt-16 pb-12">
                    <div className="max-w-7xl mx-auto">
                        {activeHeadline ? (
                            <Link
                                href={route("berita.detail", { id: activeHeadline.slug || activeHeadline.id })}
                                className="group border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row block bg-white"
                            >
                                <div className="lg:w-1/2 relative overflow-hidden h-72 lg:h-auto min-h-[320px] bg-slate-100">
                                    <img
                                        src={activeHeadline.image || "/images/berita_utama.png"}
                                        alt={activeHeadline.judul}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "/images/berita_utama.png";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300" />
                                    {activeHeadline.is_featured && (
                                        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-amber-500/95 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                                            <span>⭐</span>
                                            <span>Berita Utama</span>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-14">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="text-[#D38B1D] font-bold text-xs tracking-widest uppercase">
                                            {activeHeadline.kategori || "BERITA UTAMA"}
                                        </span>
                                        {activeHeadline.is_featured && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                                ⭐ Headline
                                            </span>
                                        )}
                                        {activeHeadline.tanggal && (
                                            <span className="text-xs text-gray-400 ml-auto font-medium">
                                                {activeHeadline.tanggal}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-[#1A1C1E] font-bold text-3xl lg:text-4xl mt-4 leading-tight group-hover:text-[#025EDB] transition duration-300">
                                        {activeHeadline.judul}
                                    </h2>
                                    <p className="text-[#44474E] font-normal text-base mt-5 leading-relaxed line-clamp-3">
                                        {activeHeadline.deskripsi}
                                    </p>
                                    <span className="flex text-[#025EDB] font-bold text-sm items-center gap-x-2 mt-8 w-fit group-hover:gap-x-3 transition-all duration-200">
                                        Baca Berita
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            /* Tampilan jika berita kosong (Empty State Headline) */
                            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 lg:p-14 text-center flex flex-col items-center justify-center shadow-2xs">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#025EDB] flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Belum Ada Berita Utama</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-md">
                                    Saat ini belum ada berita atau artikel utama yang dipublikasikan. Berita terbaru dari yayasan akan segera hadir di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter, Search & Grid */}
                <div className="xl:px-48 px-6 pb-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Filter Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10">
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {dynamicCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-300 ${
                                            selectedCategory === cat
                                                ? "bg-[#025EDB] text-white shadow-sm"
                                                : "bg-[#F3F4F6] text-[#44474E] hover:bg-[#E6EFFB] hover:text-[#025EDB]"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full lg:w-72">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full bg-[#F3F4F6] border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#025EDB]/30 transition"
                                    placeholder="Cari berita..."
                                />
                            </div>
                        </div>

                        {/* Grid + Sidebar */}
                        <div className="flex flex-col lg:flex-row gap-10 items-start">
                            {/* Grid Berita */}
                            <div className="w-full lg:w-2/3">
                                {paginatedBerita.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {paginatedBerita.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={route("berita.detail", { id: item.slug || item.id })}
                                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer block"
                                            >
                                                <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                                                    <img
                                                        src={item.image || "/images/berita_utama.png"}
                                                        alt={item.judul}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.src = "/images/berita_utama.png";
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition duration-300" />
                                                    {item.is_featured && (
                                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                                                            <span>⭐</span>
                                                            <span>Utama</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${item.tagBg || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                                            {item.kategori}
                                                        </span>
                                                        <span className="text-[#74777F] text-xs font-medium">{item.tanggal}</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-[#1A1C1E] mb-2 leading-snug group-hover:text-[#025EDB] transition duration-300 line-clamp-2">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="text-sm text-[#44474E] leading-relaxed flex-grow line-clamp-3">
                                                        {item.deskripsi}
                                                    </p>
                                                    <span className="flex text-[#025EDB] font-bold text-sm items-center gap-x-1.5 mt-5 w-fit group-hover:gap-x-2.5 transition-all duration-300">
                                                        Baca Selengkapnya
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    /* Tampilan jika berita kosong / tidak ditemukan */
                                    <div className="text-center py-16 px-6 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                                        {beritaList && beritaList.length === 0 ? (
                                            <>
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-[#025EDB] flex items-center justify-center">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">Belum Ada Berita Diterbitkan</h3>
                                                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                                                    Saat ini belum ada artikel atau kegiatan yang dipublikasikan ke dalam sistem.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Berita tidak ditemukan</h3>
                                                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                                                    Tidak ada berita yang sesuai dengan kategori &quot;{selectedCategory}&quot;
                                                    {searchQuery ? ` atau kata kunci "${searchQuery}"` : ""}.
                                                </p>
                                                <button
                                                    onClick={handleResetFilter}
                                                    className="mt-5 px-5 py-2.5 bg-[#025EDB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition duration-200 shadow-sm"
                                                >
                                                    Reset Filter
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#44474E] hover:bg-[#E6EFFB] hover:text-[#025EDB] hover:border-[#025EDB] disabled:opacity-30 disabled:cursor-not-allowed transition duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition duration-200 ${
                                                    currentPage === page
                                                        ? "bg-[#025EDB] text-white shadow-md"
                                                        : "border border-gray-200 text-[#44474E] hover:bg-[#E6EFFB] hover:text-[#025EDB] hover:border-[#025EDB]"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#44474E] hover:bg-[#E6EFFB] hover:text-[#025EDB] hover:border-[#025EDB] disabled:opacity-30 disabled:cursor-not-allowed transition duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Aktivitas Terbaru (3 Berita Terbaru dengan Gambar, Ringkasan, & Lama Upload) */}
                            <div className="w-full lg:w-1/3">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                                            <span className="w-1.5 h-5 bg-[#025EDB] rounded-full"></span>
                                            Aktivitas Terbaru
                                        </h2>
                                        {aktivitasList.length > 0 && (
                                            <span className="text-xs font-semibold text-[#025EDB] bg-[#E6EFFB] px-2.5 py-1 rounded-full">
                                                {aktivitasList.length} Terbaru
                                            </span>
                                        )}
                                    </div>

                                    {aktivitasList.length > 0 ? (
                                        <div className="flex flex-col">
                                            {aktivitasList.map((item, index) => (
                                                <div key={item.id} className="flex gap-x-4 group">
                                                    {/* Timeline Node & Line */}
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                                                index === 0
                                                                    ? "bg-blue-600 ring-4 ring-blue-100"
                                                                    : "bg-gray-200 group-hover:bg-blue-400 group-hover:ring-4 group-hover:ring-blue-50"
                                                            }`}
                                                        >
                                                            {index === 0 && (
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            )}
                                                        </div>
                                                        {index !== aktivitasList.length - 1 && (
                                                            <div className="w-[2px] bg-blue-100 flex-grow my-1 min-h-[36px]" />
                                                        )}
                                                    </div>

                                                    {/* Content Item */}
                                                    <div className="pb-7 -mt-1 flex-grow">
                                                        {/* Waktu Upload Berita (Hari ini, x hari lalu, dll) */}
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span
                                                                className={`text-xs font-extrabold tracking-wider uppercase ${
                                                                    index === 0 ? "text-blue-600" : "text-gray-500"
                                                                }`}
                                                            >
                                                                {item.time || item.time_ago || "HARI INI"}
                                                            </span>
                                                            {item.kategori && (
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase">
                                                                    {item.kategori}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Kartu Aktivitas Berita (Gambar + Judul + Ringkasan) */}
                                                        <Link
                                                            href={route("berita.detail", { id: item.slug || item.id })}
                                                            className="flex gap-3.5 items-start p-2.5 -ml-2.5 rounded-2xl hover:bg-slate-50 transition duration-200 block"
                                                        >
                                                            {/* Gambar Thumbnail Berita */}
                                                            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100 shadow-2xs">
                                                                <img
                                                                    src={item.image || "/images/berita_utama.png"}
                                                                    alt={item.judul || item.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.target.src = "/images/berita_utama.png";
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Judul & Ringkasan Berita */}
                                                            <div className="flex flex-col flex-grow min-w-0">
                                                                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#025EDB] transition duration-200 line-clamp-2">
                                                                    {item.judul || item.title}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                                    {item.ringkasan || item.desc}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Tampilan jika Aktivitas Terbaru kosong */
                                        <div className="py-10 text-center text-gray-400">
                                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700">Belum ada aktivitas</p>
                                            <p className="text-xs text-gray-400 mt-1">Aktivitas berita terbaru akan tampil di sini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Berita;

