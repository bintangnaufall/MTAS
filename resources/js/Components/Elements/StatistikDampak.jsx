import React from "react";
import { Link } from "@inertiajs/react";

const StatistikDampak = () => {
    const stats = [
        {
            value: "120+",
            label: "Santri Inklusif Dibina",
            desc: "Santri Teman Tuli & Autis aktif belajar di lingkungan ramah disabilitas",
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            value: "100%",
            label: "Beasiswa Dhuafa & Yatim",
            desc: "Komitmen pendidikan agama berkualitas tanpa membebani keluarga pra-sejahtera",
            icon: (
                <svg className="w-6 h-6 text-[#D38B1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            value: "15+",
            label: "Ustadz & Terapis Ahli",
            desc: "Pengajar berdedikasi dengan keahlian bahasa isyarat dan stimulasi sensori",
            icon: (
                <svg className="w-6 h-6 text-[#0048AB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        {
            value: "4+",
            label: "Tahun Berkhidmat",
            desc: "Menjalin silaturahmi, pengabdian sosial, dan advokasi disabilitas berkelanjutan",
            icon: (
                <svg className="w-6 h-6 text-[#BE185D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const values = [
        {
            title: "Mushaf Isyarat Terstandar",
            desc: "Pembelajaran tilawah dan hafalan Al-Qur'an mengacu pada standarisasi mushaf isyarat resmi dan metode visual terarah.",
            step: "01",
        },
        {
            title: "Pendekatan Holistik & Terapi",
            desc: "Menyelaraskan pendidikan keislaman, terapi sensori motorik, dan bimbingan psikologis agar santri berkembang optimal.",
            step: "02",
        },
        {
            title: "Pendidikan Formal Berijazah",
            desc: "Dukungan kesetaraan ijazah Paket A, B, dan C resmi negara agar santri memiliki bekal melanjutkan pendidikan ke perguruan tinggi.",
            step: "03",
        },
        {
            title: "Kemandirian Santri & Kriya",
            desc: "Pelatihan seni kaligrafi, kriya tangan, dan literasi digital di sanggar kreatif demi membangun kemandirian ekonomi santri.",
            step: "04",
        },
    ];

    return (
        <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Stats Counter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {stats.map((s, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {s.icon}
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-[#025EDB] transition-colors">
                                    {s.value}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-slate-900 mb-1">{s.label}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Why MTAS / Core Values */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left Banner */}
                    <div className="w-full lg:w-5/12 flex flex-col">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#025EDB] font-bold text-xs uppercase tracking-wider w-fit mb-4">
                            Kenapa Memilih Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
                            Mewujudkan Hak Ibadah &amp; Belajar Setara Bagi Setiap Anak
                        </h2>
                        <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                            Yayasan Bhakti Arumi Delangga berkomitmen menghadirkan ruang tumbuh yang aman, mengasihi, dan memberdayakan potensi santri berkebutuhan khusus dengan metodologi modern.
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <Link
                                href="/maktabtuli"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#025EDB] hover:bg-[#0048AB] text-white font-bold text-sm shadow-md shadow-[#025EDB]/20 transition duration-200"
                            >
                                <span>Profil Maktab Tuli</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link
                                href="/galeri"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 transition duration-200"
                            >
                                <span>Galeri Santri</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Values Grid */}
                    <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {values.map((v, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <span className="text-2xl font-black text-slate-300 group-hover:text-[#025EDB] transition-colors block mb-3">
                                        {v.step}
                                    </span>
                                    <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                                        {v.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {v.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatistikDampak;
