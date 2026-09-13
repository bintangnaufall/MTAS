import React from 'react';
import { usePage } from '@inertiajs/react';

export default function LayananJbi({ onSelectForm, className = '' }) {
    const { props } = usePage();
    const settings = props.siteSettings || {};

    const rawWa = settings.contact_whatsapp || '081234567890';
    const cleanedWa = rawWa.replace(/\D/g, '');
    const formattedWa = cleanedWa.startsWith('0')
        ? '62' + cleanedWa.substring(1)
        : cleanedWa.startsWith('62')
        ? cleanedWa
        : '62' + cleanedWa;

    const badge = settings.contact_jbi_badge || 'Aksesibilitas & Inklusi Komunikasi';
    const title = settings.contact_jbi_title || 'Jasa Layanan Juru Bahasa Isyarat (JBI)';
    const desc = settings.contact_jbi_desc || 'Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional untuk menjembatani komunikasi yang setara dan inklusif antara Teman Dengar dan Teman Tuli dalam berbagai agenda resmi, keagamaan, pendidikan, maupun publik.';
    const btnWa = settings.contact_jbi_btn_wa || 'Reservasi via WhatsApp';
    const btnForm = settings.contact_jbi_btn_form || 'Isi Form Permohonan';

    const items = [
        {
            title: settings.contact_jbi_item1_title || 'Seminar & Konferensi',
            desc: settings.contact_jbi_item1_desc || 'Penerjemahan langsung untuk webinar, seminar nasional, rapat dinas, dan pelatihan korporasi.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            title: settings.contact_jbi_item2_title || 'Kajian & Keagamaan',
            desc: settings.contact_jbi_item2_desc || "Penerjemahan khutbah Jum'at, pengajian akbar, kajian tematik Islam, akad nikah, dan tabligh.",
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            title: settings.contact_jbi_item3_title || 'Formal & Pendampingan',
            desc: settings.contact_jbi_item3_desc || 'Pendampingan sidang akademik/skripsi, konsultasi medis di faskes, serta urusan kedinasan.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
        },
        {
            title: settings.contact_jbi_item4_title || 'Media & Konten Digital',
            desc: settings.contact_jbi_item4_desc || 'Penerjemah visual PIP (Picture-in-Picture) video promosi, siaran TV/streaming, dan takarir isyarat.',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const points = [
        settings.contact_jbi_point1 || 'Standar BISINDO & Bahasa Isyarat Agama',
        settings.contact_jbi_point2 || 'Tersedia Format Luring & Daring (Zoom / Live)',
        settings.contact_jbi_point3 || 'Penerjemah Berpengalaman & Beretika',
    ];

    const waLink = `https://wa.me/${formattedWa}?text=Halo%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20berkonsultasi%20mengenai%20Jasa%20Layanan%20Juru%20Bahasa%20Isyarat%20(JBI)...`;

    return (
        <section className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#003882] via-[#0048AB] to-[#025EDB] p-8 sm:p-12 text-white shadow-xl ${className}`}>
            {/* Ambient Glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-blue-100 font-bold text-xs uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{badge}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                            {title}
                        </h2>
                        <p className="mt-3 text-blue-100/90 text-sm sm:text-base leading-relaxed">
                            {desc}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            <span>{btnWa}</span>
                        </a>
                        {onSelectForm ? (
                            <button
                                type="button"
                                onClick={onSelectForm}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0048AB] hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
                            >
                                <span>{btnForm}</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        ) : (
                            <a
                                href="/kontak#formulir-kontak"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0048AB] hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
                            >
                                <span>{btnForm}</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* 4 Cards Lingkup Layanan JBI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                                {item.title}
                            </h3>
                            <p className="text-xs text-blue-100/80 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Badges Keunggulan JBI */}
                <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-blue-100">
                    {points.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{pt}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
