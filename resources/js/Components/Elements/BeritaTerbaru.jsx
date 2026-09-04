import React from "react";
import { Link } from "@inertiajs/react";

const fallbackBerita = [
    {
        id: 1,
        slug: "penyaluran-paket-sembako-keluarga-pra-sejahtera",
        kategori: "KEGIATAN SOSIAL",
        tagBg: "bg-amber-50 text-[#D38B1D] border-amber-100",
        judul: "Penyaluran Paket Sembako untuk Keluarga Santri Pra-Sejahtera",
        deskripsi: "Alhamdulillah, telah terlaksana kegiatan penyaluran bantuan kepada 100 keluarga santri dan warga sekitar yayasan.",
        tanggal: "12 Mei 2024",
        image: "/images/image9.png",
    },
    {
        id: 2,
        slug: "program-kelas-al-quran-untuk-teman-tuli",
        kategori: "PENDIDIKAN",
        tagBg: "bg-blue-50 text-[#025EDB] border-blue-100",
        judul: "Program Kelas Al-Qur'an Isyarat & Tajwid Visual Santri Tuli",
        deskripsi: "Program pembelajaran Al-Qur'an dengan metode visual dan bahasa isyarat BISINDO berjalan intensif dan penuh semangat.",
        tanggal: "10 Mei 2024",
        image: "/images/image6.png",
    },
    {
        id: 3,
        slug: "pendaftaran-santri-baru-tahun-ajaran-2024",
        kategori: "PENGUMUMAN",
        tagBg: "bg-pink-50 text-[#BE185D] border-pink-100",
        judul: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2024/2025 Dibuka",
        deskripsi: "Yayasan membuka pendaftaran santri baru untuk program Maktab Tuli As-Sami dan Maktab Autis dengan beasiswa penuh.",
        tanggal: "08 Mei 2024",
        image: "/images/image4.png",
    },
];

const BeritaTerbaru = ({ beritaList = [] }) => {
    const list = beritaList && beritaList.length > 0 ? beritaList : fallbackBerita;

    return (
        <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#025EDB] font-bold text-xs uppercase tracking-wider mb-3">
                            Kabar Terkini
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Berita &amp; Artikel Yayasan
                        </h2>
                        <p className="mt-2 text-slate-600 text-sm sm:text-base">
                            Ikuti kabar kegiatan, publikasi edukasi inklusi, dan dokumentasi perkembangan santri.
                        </p>
                    </div>

                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:text-[#025EDB] hover:border-blue-200 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition duration-200 w-fit group"
                    >
                        <span>Lihat Semua Kabar</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                {/* 3 Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {list.slice(0, 3).map((item, idx) => (
                        <article
                            key={item.id || idx}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                        >
                            {/* Image */}
                            <Link href={`/berita/${item.slug || item.id}`} className="block relative h-52 sm:h-60 overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.judul}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        e.target.src = "/images/berita_utama.png";
                                    }}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider border backdrop-blur-md shadow-xs ${item.tagBg || "bg-blue-50 text-[#025EDB] border-blue-100"}`}>
                                        {item.kategori || "BERITA"}
                                    </span>
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{item.tanggal}</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#025EDB] transition-colors leading-snug line-clamp-2 mb-2">
                                        <Link href={`/berita/${item.slug || item.id}`}>
                                            {item.judul}
                                        </Link>
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6">
                                        {item.deskripsi}
                                    </p>
                                </div>

                                <Link
                                    href={`/berita/${item.slug || item.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#025EDB] hover:text-[#0048AB] transition-colors group/btn pt-3 border-t border-slate-100"
                                >
                                    <span>Baca Selengkapnya</span>
                                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BeritaTerbaru;
