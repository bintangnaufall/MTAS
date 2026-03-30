import { Link } from "@inertiajs/react";


const beritaData = [
    {
        kategori: "KEGIATAN SOSIAL",
        judul: "Penyaluran Paket Sembako untuk Keluarga Pra-Sejahtera",
        deskripsi:
            "Alhamdulillah, telah terlaksana kegiatan penyaluran bantuan kepada 100 keluarga santri...",
        tanggal: "12 Mei 2024",
        image: "https://picsum.photos/500",
    },
    {
        kategori: "PENDIDIKAN",
        judul: "Program Kelas Al-Quran untuk Teman Tuli",
        deskripsi:
            "Program pembelajaran Al-Quran dengan metode visual dan bahasa isyarat berjalan dengan baik...",
        tanggal: "10 Mei 2024",
        image: "https://picsum.photos/500",
    },
    {
        kategori: "PENGUMUMAN",
        judul: "Pendaftaran Santri Baru Tahun Ajaran 2024",
        deskripsi:
            "Yayasan membuka pendaftaran santri baru untuk program pendidikan inklusif tahun ini...",
        tanggal: "8 Mei 2024",
        image: "https://picsum.photos/500",
    },
];

const BeritaArtikel = () => {
    return (
        <div className="flex flex-col px-48 bg-[#FBF3E6] py-24">

            {/* Header */}
            <span className="text-4xl font-bold">
                Berita & Artikel
            </span>

            <div className="flex justify-between">
                <span className="text-base text-[#44474E] font-normal mt-4">
                    Ikuti perkembangan terbaru dari aktivitas dan program
                    pemberdayaan di Yayasan kami
                </span>

                <Link
                    href="/berita"
                    className="text-[#025EDB] text-base font-bold flex gap-x-2 items-center"
                >
                    Lihat Semua Berita

                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                    >
                        <path
                            d="M1.4 13L0 11.6L9.6 2H1V0H13V12H11V3.4L1.4 13Z"
                            fill="#025EDB"
                        />
                    </svg>
                </Link>
            </div>

            {/* Card Berita */}
            <div className="flex mt-14 gap-x-5">

                {beritaData.map((item, index) => (
                    <div
                        key={index}
                        className="w-1/3 overflow-hidden rounded-2xl shadow-xl bg-white flex flex-col"
                    >
                        <img
                            src={item.image}
                            alt={item.judul}
                            className="h-56 w-full object-cover"
                        />

                        <div className="flex flex-1 flex-col bg-white p-8">

                            <span className="text-xs font-bold text-[#CD8821]">
                                {item.kategori}
                            </span>

                            <span className="pt-3 pb-4 text-xl font-bold text-[#1A1C1E]">
                                {item.judul}
                            </span>

                            <span className="pb-11 text-sm text-[#44474E] h-[100px]">
                                {item.deskripsi}
                            </span>

                            <div className="flex justify-between">

                                <span className="text-xs text-[#44474E]">
                                    {item.tanggal}
                                </span>

                                <Link
                                    href="/berita"
                                    className="flex items-center gap-x-2 text-xs font-bold text-[#025EDB]"
                                >
                                    Lihat detail Berita
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default BeritaArtikel;