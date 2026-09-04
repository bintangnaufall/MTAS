import { Link } from "@inertiajs/react";

const beritaData = [
    {
        id: 4,
        kategori: "KEGIATAN SOSIAL",
        tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
        judul: "Penyaluran Paket Sembako untuk Keluarga Pra-Sejahtera",
        deskripsi: "Alhamdulillah, telah terlaksana kegiatan penyaluran bantuan kepada 100 keluarga santri...",
        tanggal: "12 Mei 2024",
        image: "https://picsum.photos/seed/a1/500/300",
    },
    {
        id: 2,
        kategori: "PENDIDIKAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Program Kelas Al-Quran untuk Teman Tuli",
        deskripsi: "Program pembelajaran Al-Quran dengan metode visual dan bahasa isyarat berjalan dengan baik...",
        tanggal: "10 Mei 2024",
        image: "https://picsum.photos/seed/a2/500/300",
    },
    {
        id: 3,
        kategori: "PENGUMUMAN",
        tagBg: "bg-[#FDF2F8] text-[#BE185D]",
        judul: "Pendaftaran Santri Baru Tahun Ajaran 2024",
        deskripsi: "Yayasan membuka pendaftaran santri baru untuk program pendidikan inklusif tahun ini...",
        tanggal: "8 Mei 2024",
        image: "https://picsum.photos/seed/a3/500/300",
    },
];

const BeritaArtikel = ({ beritaList = [] }) => {
    const displayList = beritaList && beritaList.length > 0 ? beritaList : beritaData;

    return (
        <div className="flex flex-col xl:px-48 px-4 bg-[#FBF3E6] xl:py-24 py-16">

            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <span className="xl:text-4xl text-2xl font-bold text-[#1A1C1E]">
                        Berita & Artikel
                    </span>
                    <p className="xl:text-base text-xs text-[#44474E] font-normal mt-2">
                        Ikuti perkembangan terbaru dari aktivitas kami
                    </p>
                </div>
                <Link
                    href="/berita"
                    className="text-[#025EDB] xl:text-base text-xs font-bold flex gap-x-2 xl:items-center items-end group hover:gap-x-3 transition-all duration-200 mt-1"
                >
                    Lihat Semua
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        className="group-hover:translate-x-0.5 transition-transform duration-200"
                    >
                        <path d="M1.4 13L0 11.6L9.6 2H1V0H13V12H11V3.4L1.4 13Z" fill="#025EDB" />
                    </svg>
                </Link>
            </div>

            {/* Card Berita */}
            <div className="xl:flex xl:flex-row flex flex-col xl:gap-x-6 gap-y-8">
                {displayList.slice(0, 3).map((item, index) => (
                    <Link
                        key={item.id || index}
                        href={route("berita.detail", { id: item.slug || item.id })}
                        className="xl:w-1/3 overflow-hidden rounded-3xl shadow-sm bg-white flex flex-col group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
                    >
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                            <img
                                src={item.image || "/images/berita_utama.png"}
                                alt={item.judul}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = "/images/berita_utama.png";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition duration-300" />
                        </div>

                        <div className="flex flex-1 flex-col bg-white p-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`inline-flex items-center w-fit text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${item.tagBg || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                    {item.kategori}
                                </span>
                                <span className="text-xs text-[#74777F]">{item.tanggal}</span>
                            </div>

                            <span className="pt-1 pb-3 text-lg font-bold text-[#1A1C1E] group-hover:text-[#025EDB] transition duration-300 leading-snug">
                                {item.judul}
                            </span>

                            <span className="pb-6 text-sm text-[#44474E] leading-relaxed flex-grow">
                                {item.deskripsi}
                            </span>

                            <span
                                className="flex items-center gap-x-1.5 text-sm font-bold text-[#025EDB] w-fit group-hover:gap-x-2.5 transition-all duration-300"
                            >
                                Lihat detail Berita
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BeritaArtikel;