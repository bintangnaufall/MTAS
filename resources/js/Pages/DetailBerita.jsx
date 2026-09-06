import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import React, { useState, useMemo } from "react";

// Mock data list aligned with Berita.jsx
const allBeritaData = [
    {
        id: 1,
        kategori: "KEGIATAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Seni Lukis untuk Santri Autis",
        deskripsi: "Program terapi seni yang dirancang khusus untuk meningkatkan fokus dan ekspresi diri bagi santri dengan spektrum autisme.",
        tanggal: "12 Okt 2024",
        image: "/images/image10.png",
    },
    {
        id: 2,
        kategori: "PENDIDIKAN",
        tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
        judul: "Kelas Bahasa Isyarat Al-Qur'an",
        deskripsi: "Metode inovatif membaca Al-Qur'an melalui bahasa isyarat visual yang dirancang oleh tim pengajar bersertifikat.",
        tanggal: "5 Nov 2024",
        image: "/images/image7.png",
    },
    {
        id: 3,
        kategori: "PENGUMUMAN",
        tagBg: "bg-[#FDF2F8] text-[#BE185D]",
        judul: "Pendaftaran Santri Baru 2025",
        deskripsi: "Yayasan membuka pendaftaran santri baru untuk program pendidikan inklusif tahun ajaran 2025.",
        tanggal: "1 Jan 2025",
        image: "/images/image8.png",
    },
    {
        id: 4,
        kategori: "KEGIATAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Bakti Sosial Ramadan 1446H",
        deskripsi: "Kegiatan berbagi paket sembako kepada 150 keluarga pra-sejahtera di sekitar lingkungan yayasan.",
        tanggal: "15 Mar 2025",
        image: "/images/image9.png",
    },
    {
        id: 5,
        kategori: "MAKTAB TULI",
        tagBg: "bg-[#E0F2FE] text-[#0369A1]",
        judul: "Lomba Tahfidz Isyarat Antar Kelas",
        deskripsi: "Kompetisi hafalan Al-Qur'an dengan metode bahasa isyarat yang diikuti seluruh santri Maktab Tuli As-Sami.",
        tanggal: "20 Feb 2025",
        image: "/images/image6.png",
    },
    {
        id: 6,
        kategori: "PENGUMUMAN",
        tagBg: "bg-[#FDF2F8] text-[#BE185D]",
        judul: "Rekrutmen Tenaga Pengajar Baru",
        deskripsi: "Yayasan membuka kesempatan bagi pengajar berkomitmen dan berpengalaman di bidang pendidikan inklusif.",
        tanggal: "10 Apr 2025",
        image: "/images/image5.png",
    },
    {
        id: 7,
        kategori: "KEGIATAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Kunjungan Silaturahmi ke Maktab Autis",
        deskripsi: "Tamu kehormatan dan relawan meninjau langsung fasilitas dan proses pembelajaran di Maktab Autis.",
        tanggal: "3 Mei 2025",
        image: "/images/image4.png",
    },
    {
        id: 8,
        kategori: "PENDIDIKAN",
        tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
        judul: "Workshop Parenting Inklusif",
        deskripsi: "Sesi pelatihan bagi orang tua santri untuk memahami dan mendukung tumbuh kembang anak berkebutuhan khusus.",
        tanggal: "18 Mei 2025",
        image: "/images/image3.png",
    },
    {
        id: 9,
        kategori: "MAKTAB TULI",
        tagBg: "bg-[#E0F2FE] text-[#0369A1]",
        judul: "Wisuda Santri Angkatan ke-5",
        deskripsi: "Perayaan kelulusan santri angkatan ke-5 Maktab Tuli As-Sami yang telah menyelesaikan program pendidikan.",
        tanggal: "1 Jun 2025",
        image: "/images/image1.png",
    },
];

// Content Map for all news
const beritaDetailData = {
    // Featured/default news from design
    featured: {
        kategori: "MAKTAB TULI",
        tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
        judul: "Peluncuran Program Literasi Qur'an Teman Tuli",
        tanggal: "12 Oktober 2024",
        author: "Admin Yayasan",
        image: "/images/berita_utama.png",
        blockquote: "Membuka jendela dunia bagi mereka yang mendengar dengan hati. Program ini bukan sekadar membaca, tapi memahami makna suci di balik setiap isyarat.",
        paragraf1: "Yayasan Bhakti Arumi Delangga secara resmi meluncurkan program unggulan terbaru yakni Literasi Qur'an khusus untuk Teman Tuli. Program ini bertujuan untuk memberikan akses pendidikan agama yang inklusif dan berkualitas bagi saudara-saudara kita yang memiliki keterbatasan pendengaran.",
        subheading: "Mengenal Metode Pembelajaran",
        paragraf2: "Kami menggunakan metode visualisasi isyarat yang telah disesuaikan dengan kurikulum nasional. Setiap huruf hijaiyah diterjemahkan ke dalam bentuk isyarat tangan yang mudah dipahami, dibantu dengan ilustrasi visual yang menarik untuk memudahkan proses penghafalan.",
        blueQuote: "Kami percaya bahwa setiap insan memiliki hak yang sama untuk mempelajari Al-Qur'an. Hambatan fisik seharusnya tidak menjadi penghalang untuk mendekatkan diri kepada Sang Pencipta.",
        blueQuoteAuthor: "— Dr. Arumi, Ketua Yayasan",
        paragraf3: "Kegiatan ini diadakan setiap hari Sabtu dan Minggu di pusat pembelajaran Maktab Tuli. Selain belajar mengaji, para peserta juga diberikan pembekalan keterampilan sosial dan kemandirian untuk membantu mereka berintegrasi lebih baik di masyarakat.",
    },
    1: {
        kategori: "KEGIATAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Seni Lukis untuk Santri Autis",
        tanggal: "12 Oktober 2024",
        author: "Admin Yayasan",
        image: "/images/image10.png",
        blockquote: "Melalui seni, coretan warna-warni kanvas menceritakan keindahan dunia batiniah anak-anak autis yang melampaui kata-kata.",
        paragraf1: "Program terapi seni lukis ini dirancang khusus untuk membantu melatih fokus, motorik halus, dan ekspresi diri bagi santri dengan spektrum autisme di Yayasan Bhakti Arumi Delangga.",
        subheading: "Terapi Seni Sebagai Media Komunikasi",
        paragraf2: "Dalam pelaksanaannya, santri dibimbing oleh instruktur profesional yang memahami psikologi perkembangan anak berkebutuhan khusus, menciptakan suasana belajar yang aman, nyaman, dan menyenangkan.",
        blueQuote: "Seni adalah jendela jiwa. Kami melihat perkembangan luar biasa pada konsentrasi dan ketenangan para santri setelah mengikuti kelas lukis ini secara rutin.",
        blueQuoteAuthor: "— Ibu Rahma, Terapis Seni Yayasan",
        paragraf3: "Pameran karya lukis santri akan diadakan di akhir semester untuk meningkatkan rasa percaya diri mereka serta mengedukasi masyarakat luas tentang potensi tersembunyi anak autis.",
    },
    2: {
        kategori: "PENDIDIKAN",
        tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
        judul: "Kelas Bahasa Isyarat Al-Qur'an",
        tanggal: "05 November 2024",
        author: "Admin Yayasan",
        image: "/images/image7.png",
        blockquote: "Mendekatkan firman-firman suci melalui isyarat visual yang menyentuh kalbu bagi saudara-saudara kita yang sunyi dari suara.",
        paragraf1: "Program pembelajaran Al-Qur'an dengan metode visual dan bahasa isyarat berjalan dengan baik bagi para santri tunarungu di Maktab Tuli As-Sami.",
        subheading: "Metode Isyarat Visual Al-Qur'an",
        paragraf2: "Program ini tidak hanya berfokus pada hafalan visual, melainkan pemahaman makna ayat demi ayat agar santri dapat meresapi ajaran agama dengan baik dan menerapkannya dalam kehidupan.",
        blueQuote: "Bahasa isyarat adalah jembatan hati. Kelas ini membuktikan bahwa keterbatasan pendengaran bukanlah penghalang untuk mencintai dan menghafal Al-Qur'an.",
        blueQuoteAuthor: "— Ustadz Faisal, Koordinator Pendidikan",
        paragraf3: "Kelas ini dibuka gratis untuk umum setiap hari Ahad pagi di aula utama yayasan dan didukung penuh oleh para pengajar yang berkomitmen pada dakwah inklusif.",
    },
    3: {
        kategori: "PENGUMUMAN",
        tagBg: "bg-[#FDF2F8] text-[#BE185D]",
        judul: "Pendaftaran Santri Baru 2025",
        tanggal: "01 Januari 2025",
        author: "Humas Yayasan",
        image: "/images/image8.png",
        blockquote: "Menyambut putra-putri istimewa dengan pelukan kasih sayang dan sistem pendidikan terbaik yang ramah disabilitas.",
        paragraf1: "Yayasan Bhakti Arumi Delangga secara resmi membuka pendaftaran santri baru untuk program pendidikan inklusif tahun ajaran 2025 bagi anak berkebutuhan khusus.",
        subheading: "Program Pendidikan yang Ditawarkan",
        paragraf2: "Tersedia berbagai pilihan program unggulan, mulai dari Maktab Tuli untuk penyandang tunarungu hingga Maktab Autis untuk pendampingan anak dengan autisme.",
        blueQuote: "Setiap anak dilahirkan dengan potensi unik. Di sini, kami berkomitmen untuk menuntun mereka menemukan dan mengembangkan potensi tersebut demi masa depan yang mandiri.",
        blueQuoteAuthor: "— Ibu Arumi, Pendiri Yayasan",
        paragraf3: "Proses pendaftaran dibuka secara daring maupun luring dengan kuota terbatas guna menjamin efektivitas pengajaran terapis dan guru khusus.",
    },
    4: {
        kategori: "KEGIATAN",
        tagBg: "bg-[#E6EFFB] text-[#025EDB]",
        judul: "Bakti Sosial Ramadan 1446H",
        tanggal: "15 Maret 2025",
        author: "Panitia Ramadan",
        image: "/images/image9.png",
        blockquote: "Ramadan adalah momentum terbaik untuk merekatkan ukhuwah dan menumbuhkan kepedulian sosial terhadap sesama.",
        paragraf1: "Dalam rangka menyemarakkan bulan suci Ramadan, yayasan mengadakan kegiatan sosial pembagian paket kebutuhan pokok kepada keluarga kurang mampu di sekitar lingkungan maktab.",
        subheading: "Penyaluran Paket Sembako Amanah",
        paragraf2: "Sebanyak 150 paket sembako berisi beras, minyak goreng, gula, dan bahan pangan lainnya telah didistribusikan secara tertib langsung kepada para penerima manfaat.",
        blueQuote: "Kebahagiaan sejati terletak pada kemampuan kita untuk berbagi dan peduli kepada sesama dalam kebaikan.",
        blueQuoteAuthor: "— Bpk. Ahmad, Ketua Panitia Baksos",
        paragraf3: "Kegiatan ini ditutup dengan doa bersama untuk keberkahan para santri, pengurus yayasan, dan kelancaran program pendidikan ke depan.",
    },
};

const DetailBerita = ({ berita = null, recentBerita = [], beritaTerkait = [], id }) => {
    // Determine which article data to show
    const data = useMemo(() => {
        if (berita) {
            return berita;
        }
        // Fallback to featured design content if ID is featured, 0, or not found in data map
        const key = (id === "featured" || id === "0" || !id) ? "featured" : id;
        return beritaDetailData[key] || beritaDetailData["featured"];
    }, [berita, id]);

    // Berita Terkait (prioritize backend data, fallback to mock)
    const displayTerkait = useMemo(() => {
        if (beritaTerkait && beritaTerkait.length > 0) {
            return beritaTerkait;
        }
        return [
            {
                kategori: "PENGUMUMAN",
                tagBg: "bg-[#E6EFFB] text-[#025EDB]",
                judul: "Evaluasi Semester Program Maktab Tuli",
                tanggal: "10 Okt 2024",
                image: "/images/image8.png",
                href: "/berita/3"
            },
            {
                kategori: "MAKTAB AUTIS",
                tagBg: "bg-[#FFF3E3] text-[#D38B1D]",
                judul: "Terapi Seni untuk Anak-anak Autis",
                tanggal: "02 Okt 2024",
                image: "/images/image10.png",
                href: "/berita/1"
            },
            {
                kategori: "KEGIATAN",
                tagBg: "bg-[#E6EFFB] text-[#025EDB]",
                judul: "Koleksi Buku Cerita untuk Maktab",
                tanggal: "25 Sep 2024",
                image: "/images/image4.png",
                href: "/berita/featured"
            }
        ];
    }, [beritaTerkait]);

    // Berita Terbaru sidebar (prioritize backend data, fallback to mock)
    const displayRecent = useMemo(() => {
        if (recentBerita && recentBerita.length > 0) {
            return recentBerita;
        }
        return [
            {
                id: 1,
                judul: "Pemeriksaan Kesehatan Gratis Tahunan",
                tanggal: "05 Okt 2024",
                image: "/images/image3.png",
                slug: "1"
            },
            {
                id: 4,
                judul: "Distribusi Paket Sembako Amanah",
                tanggal: "28 Sep 2024",
                image: "/images/image9.png",
                slug: "4"
            }
        ];
    }, [recentBerita]);

    // Lightbox state for documentation photos & videos
    const [lightboxItem, setLightboxItem] = useState(null);

    // Documentation items (only from inputted data, empty if none inputted)
    const displayDokumentasi = useMemo(() => {
        let docs = data.dokumentasi;
        if (typeof docs === "string") {
            try {
                docs = JSON.parse(docs);
            } catch (e) {
                docs = [];
            }
        }
        if (Array.isArray(docs) && docs.length > 0) {
            return docs
                .map((item, idx) => {
                    if (typeof item === "string") {
                        const isVideo =
                            /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item) ||
                            item.includes("youtube.com") ||
                            item.includes("youtu.be");
                        return {
                            id: `doc_${idx}`,
                            type: isVideo ? "video" : "image",
                            url: item,
                            caption: `Dokumentasi ${idx + 1}`,
                        };
                    }
                    return {
                        id: item.id || `doc_${idx}`,
                        type:
                            item.type ||
                            (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item.url || "") ||
                            item.url?.includes("youtube.com") ||
                            item.url?.includes("youtu.be")
                                ? "video"
                                : "image"),
                        url: item.url || "",
                        caption: item.caption || `Dokumentasi ${idx + 1}`,
                    };
                })
                .filter((item) => Boolean(item.url && item.url.trim()));
        }
        return [];
    }, [data.dokumentasi]);

    return (
        <>
            <Head title={data.judul} />
            <Layout>
                {/* Banner Breadcrumb & Title */}
                <div className="bg-[#E6EFFB]/30 py-10 px-6 xl:px-48 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex gap-x-2 text-xs font-semibold text-[#74777F] mb-3">
                            <Link href="/" className="hover:text-[#025EDB] transition">Beranda</Link>
                            <span>/</span>
                            <Link href="/berita" className="hover:text-[#025EDB] transition">Berita</Link>
                            <span>/</span>
                            <span className="text-[#1A1C1E] font-bold">Detail Berita</span>
                        </nav>
                        <h1 className="text-[#1A1C1E] font-extrabold text-3xl md:text-4xl tracking-tight">
                            Detail Berita
                        </h1>
                        <p className="text-[#44474E] text-sm md:text-base font-medium mt-1">
                            Informasi Kegiatan Yayasan Bhakti Arumi Delangga untuk Umat.
                        </p>
                    </div>
                </div>

                {/* Main Content & Sidebar Grid */}
                <div className="xl:px-48 px-6 py-16">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                        
                        {/* Main Content Area (Left 2/3) */}
                        <div className="w-full lg:w-2/3 flex flex-col">
                            {/* Kategori Tag */}
                            <div className="mb-4 flex items-center">
                                <span className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-2xs ${data.tagBg || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                    {data.kategori}
                                </span>
                            </div>

                            {/* Judul Berita */}
                            <h2 className="text-[#1A1C1E] font-extrabold text-3xl md:text-4xl leading-tight mb-5">
                                {data.judul}
                            </h2>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm text-[#74777F] font-semibold">
                                <span className="flex items-center gap-x-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {data.tanggal}
                                </span>
                                <span className="flex items-center gap-x-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {data.author}
                                </span>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full h-[300px] md:h-[450px] rounded-[32px] overflow-hidden bg-slate-100 mb-8 shadow-sm">
                                <img
                                    src={data.image}
                                    alt={data.judul}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Article Body */}
                            <div className="prose max-w-none text-[#44474E] leading-relaxed text-base font-normal">
                            {/* Blockquote / Hook */}
                            {data.blockquote && (
                                <div className="border-l-4 border-[#D38B1D] pl-6 py-2 mb-8 bg-[#FFF3E3]/20 rounded-r-2xl">
                                    <p className="text-base md:text-lg italic text-[#1A1C1E] font-medium leading-relaxed">
                                        “{data.blockquote}”
                                    </p>
                                </div>
                            )}

                            {/* Body Paragraphs */}
                            <div className="text-[#44474E] text-base leading-relaxed space-y-6">
                                <p className="font-medium text-lg text-gray-800">
                                    {data.paragraf1}
                                </p>

                                {data.subheading && (
                                    <h3 className="text-xl md:text-2xl font-bold text-[#1A1C1E] pt-4">
                                        {data.subheading}
                                    </h3>
                                )}

                                <p>
                                    {data.paragraf2}
                                </p>

                                {/* Blue Quote Callout Box */}
                                {data.blueQuote && (
                                    <div className="my-8 p-8 bg-[#E6EFFB] rounded-3xl border border-[#CDE1FB] relative overflow-hidden">
                                        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 text-[#025EDB]">
                                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                        </div>
                                        <p className="text-[#025EDB] text-lg md:text-xl font-bold leading-relaxed relative z-10">
                                            {data.blueQuote}
                                        </p>
                                        {data.blueQuoteAuthor && (
                                            <span className="text-[#025EDB] text-sm font-semibold relative z-10 mt-2 block">
                                                {data.blueQuoteAuthor}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {data.paragraf3 && (
                                    <p className="mb-6">
                                        {data.paragraf3}
                                    </p>
                                )}
                            </div>
                            </div>

                            {/* Dokumentasi Kegiatan (Maksimal 6 Foto / Video) - HANYA TAMPIL JIKA ADA MEDIA YANG DIINPUT */}
                            {displayDokumentasi && displayDokumentasi.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl md:text-2xl font-bold text-[#1A1C1E] flex items-center gap-2">
                                            Dokumentasi Kegiatan
                                        </h3>
                                        <span className="text-xs font-bold text-[#025EDB] bg-[#E6EFFB] px-3 py-1 rounded-full">
                                            {displayDokumentasi.length} Foto &amp; Video
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {displayDokumentasi.map((item, index) => (
                                            <div
                                                key={item.id || index}
                                                onClick={() => setLightboxItem(item)}
                                                className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm group cursor-pointer relative border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                            >
                                                {item.type === "video" ? (
                                                    <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                                                        {item.url?.endsWith(".mp4") || item.url?.endsWith(".webm") ? (
                                                            <video
                                                                src={item.url}
                                                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                                preload="metadata"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center p-3 text-center">
                                                                <span className="text-white text-xs font-semibold">Video Dokumentasi</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                            <div className="w-11 h-11 rounded-full bg-[#025EDB] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                                                            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            Video
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full relative">
                                                        <img
                                                            src={item.url}
                                                            alt={item.caption || `Dokumentasi ${index + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.src = "/images/berita_utama.png";
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <div className="w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share & Back buttons */}
                            <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-x-4">
                                    <span className="text-sm font-bold text-[#74777F] tracking-wider">BAGIKAN:</span>
                                    <div className="flex gap-x-3">
                                        <button className="w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-[#E6EFFB] hover:text-[#025EDB] text-[#64748B] flex items-center justify-center transition">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.828-2.414m0 0a3 3 0 10-3.62-3.619l-4.829 2.414m0 0a3 3 0 100 4.828l4.83 2.414m0 0a3 3 0 103.62-3.619z" />
                                            </svg>
                                        </button>
                                        <button className="w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-[#E6EFFB] hover:text-[#025EDB] text-[#64748B] flex items-center justify-center transition">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </button>
                                        <button className="w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-[#E6EFFB] hover:text-[#025EDB] text-[#64748B] flex items-center justify-center transition">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <Link href="/berita" className="text-[#025EDB] hover:underline font-bold text-sm flex items-center gap-x-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Berita
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar Area (Right 1/3) */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8">
                            
                            {/* Widget: Berita Terbaru */}
                            <div className="border border-gray-100 rounded-3xl p-6 shadow-sm bg-white">
                                <h4 className="text-lg font-bold text-[#1A1C1E] mb-6 flex items-center gap-x-2 before:content-[''] before:block before:w-1 before:h-5 before:bg-[#D38B1D] before:rounded-full">
                                    Berita Terbaru
                                </h4>
                                <div className="flex flex-col gap-5">
                                    {displayRecent.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route("berita.detail", { id: item.slug || item.id })}
                                            className="flex gap-4 items-center group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                                        >
                                            <img
                                                src={item.image || "/images/berita_utama.png"}
                                                alt={item.judul}
                                                className="w-16 h-16 rounded-2xl object-cover shrink-0"
                                                onError={(e) => {
                                                    e.target.src = "/images/berita_utama.png";
                                                }}
                                            />
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-900 group-hover:text-[#025EDB] transition duration-200 leading-snug line-clamp-2">
                                                    {item.judul}
                                                </h5>
                                                <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                                                    {item.tanggal || item.time_ago}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Section: Berita Terkait */}
                <div className="bg-[#F8FAFC] py-16 xl:px-48 px-6 border-t border-b border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1A1C1E]">
                                    Berita Terkait
                                </h3>
                                <p className="text-sm text-[#74777F] font-semibold mt-1">
                                    Baca lebih banyak informasi mengenai program kami.
                                </p>
                            </div>
                            <Link href="/berita" className="text-[#025EDB] hover:underline font-bold text-sm flex items-center gap-x-1 whitespace-nowrap">
                                Lihat Semua Berita
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {displayTerkait.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href || route("berita.detail", { id: item.slug || item.id })}
                                    className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                                        <img
                                            src={item.image || "/images/berita_utama.png"}
                                            alt={item.judul}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "/images/berita_utama.png";
                                            }}
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-2.5 flex items-center">
                                            <span className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-2xs ${item.tagBg || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                                {item.kategori}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-[#1A1C1E] mb-4 group-hover:text-[#025EDB] transition line-clamp-2 leading-snug">
                                            {item.judul}
                                        </h4>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <span className="text-[#74777F] text-xs font-semibold">{item.tanggal}</span>
                                            <span className="text-[#D38B1D] font-bold text-xs flex items-center gap-x-1 group-hover:gap-x-1.5 transition-all duration-200">
                                                Baca Berita
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lightbox / Video Player Modal */}
                {lightboxItem && (
                    <div
                        onClick={() => setLightboxItem(null)}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setLightboxItem(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Media Content */}
                            {lightboxItem.type === "video" ? (
                                <div className="w-full flex items-center justify-center p-2 bg-black min-h-[360px]">
                                    {lightboxItem.url?.endsWith(".mp4") || lightboxItem.url?.endsWith(".webm") ? (
                                        <video
                                            src={lightboxItem.url}
                                            controls
                                            autoPlay
                                            className="max-h-[80vh] w-auto max-w-full rounded-2xl"
                                        />
                                    ) : (
                                        <div className="w-full aspect-video">
                                            <iframe
                                                src={lightboxItem.url}
                                                title="Video Player"
                                                className="w-full h-full rounded-2xl"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-center p-2">
                                    <img
                                        src={lightboxItem.url}
                                        alt={lightboxItem.caption || "Dokumentasi"}
                                        className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
                                    />
                                </div>
                            )}

                            {/* Caption */}
                            {lightboxItem.caption && (
                                <div className="w-full py-3 px-6 bg-slate-900/90 text-white text-center text-sm font-medium border-t border-slate-800">
                                    {lightboxItem.caption}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Layout>
        </>
    );
};

export default DetailBerita;
