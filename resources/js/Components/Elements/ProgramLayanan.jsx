import React from "react";
import { Link, usePage } from "@inertiajs/react";

const ProgramLayanan = () => {
    const { siteSettings = {} } = usePage().props;

    const services = [
        {
            title: siteSettings.service1_title || "Maktab Tuli As-Sami",
            tag: siteSettings.service1_tag || "Pendidikan Al-Qur'an Isyarat",
            desc: siteSettings.service1_desc || "Pusat pembelajaran Al-Qur'an, tajwid visual, fiqih ibadah praktis, dan pembinaan akhlak khusus Teman Tuli dengan metode visual terpadu.",
            image: siteSettings.service1_image || "/images/image6.png",
            link: siteSettings.service1_link || "/maktabtuli",
            badgeBg: "bg-blue-50 text-[#025EDB] border-blue-100",
            accentColor: "#025EDB",
            features: ["Mushaf Isyarat Resmi", "Tajwid Visual Terpadu", "PKBM Ijazah Paket", "Bina Kemandirian"],
            btnText: "Eksplorasi Maktab Tuli",
        },
        {
            title: siteSettings.service2_title || "Maktab Autis & Kemandirian",
            tag: siteSettings.service2_tag || "Terapi Sensori & Perilaku",
            desc: siteSettings.service2_desc || "Pendampingan sensori motorik, pengenalan rukun Islam secara visual, serta bimbingan kemandirian harian agar santri mampu beribadah dan bersosialisasi mandiri.",
            image: siteSettings.service2_image || "/images/image7.png",
            link: siteSettings.service2_link || "/daftar",
            badgeBg: "bg-pink-50 text-[#BE185D] border-pink-100",
            accentColor: "#BE185D",
            features: ["Terapi Sensori Motorik", "Bina Perilaku & Ibadah", "Rasio Pengajar Intensif", "Evaluasi Berkala"],
            btnText: "Daftar Maktab Autis",
        },
        {
            title: siteSettings.service3_title || "Konseling & Parenting Inklusif",
            tag: siteSettings.service3_tag || "Pendampingan Keluarga",
            desc: siteSettings.service3_desc || "Sesi bimbingan berkala bagi orang tua dan wali santri guna memperkuat ketahanan keluarga serta sanggar seni kriya untuk kemandirian berwirausaha santri.",
            image: siteSettings.service3_image || "/images/image8.png",
            link: siteSettings.service3_link || "/kontak",
            badgeBg: "bg-amber-50 text-[#D38B1D] border-amber-100",
            accentColor: "#D38B1D",
            features: ["Konseling Psikologis", "Kelas Parenting Terarah", "Sanggar Kriya & Seni", "Komunitas Inklusif"],
            btnText: "Konsultasi Layanan",
        },
    ];

    return (
        <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#025EDB] font-bold text-xs uppercase tracking-wider shadow-2xs mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                        <span>Program &amp; Layanan Utama</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Pilar Pendidikan &amp; Pengabdian Inklusif
                    </h2>
                    <p className="mt-4 text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                        Kami menghadirkan ekosistem pembelajaran holistik yang menggabungkan nilai-nilai keislaman, terapi tumbuh kembang, dan penguatan kemandirian santri disabilitas.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                        >
                            {/* Card Image */}
                            <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        e.target.src = "/images/hero_foto.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full font-bold text-xs border backdrop-blur-md shadow-xs ${item.badgeBg}`}>
                                        {item.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#025EDB] transition-colors leading-snug mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                                        {item.desc}
                                    </p>

                                    {/* Feature Chips */}
                                    <div className="space-y-2 mb-6 pt-2 border-t border-slate-100">
                                        {item.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                                                <svg className="w-4 h-4 text-[#025EDB] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={item.link}
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-[#025EDB] text-[#025EDB] hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 border border-slate-200/80 hover:border-[#025EDB] shadow-2xs group-hover:bg-[#025EDB] group-hover:text-white"
                                >
                                    <span>{item.btnText}</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramLayanan;
