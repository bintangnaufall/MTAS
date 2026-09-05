import React from "react";
import { Link, usePage } from "@inertiajs/react";

const CtaPendaftaran = () => {
    const { siteSettings = {} } = usePage().props;
    const whatsapp = siteSettings.contact_whatsapp || "081234567890";
    const waClean = whatsapp.replace(/[^0-9]/g, "");

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="relative rounded-3xl lg:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#003882] via-[#0048AB] to-[#025EDB] p-8 sm:p-12 lg:p-16 shadow-2xl text-white">
                    {/* Decorative Ambient Shapes */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-blue-100 font-bold text-xs uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Penerimaan Santri Baru (PSB) Aktif</span>
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5">
                            Buka Jendela Masa Depan Gemilang untuk Ananda
                        </h2>

                        <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
                            Setiap anak memiliki keistimewaan dan potensi besar untuk bertumbuh mandiri serta memahami Al-Qur'an. Daftarkan putra-putri Anda atau konsultasikan kebutuhan tumbuh kembang mereka bersama tim ahli kami.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/daftar"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#0048AB] font-bold text-sm sm:text-base hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>Daftar Santri Baru (PSB)</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            <Link
                                href="/kontak"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>Konsultasi &amp; Kunjungan</span>
                            </Link>

                            {waClean && (
                                <a
                                    href={`https://wa.me/${waClean.startsWith("0") ? "62" + waClean.slice(1) : waClean}?text=Halo%20Yayasan%20Bhakti%20Arumi,%20saya%20ingin%20konsultasi%20pendaftaran%20santri`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    <span>WhatsApp Admin</span>
                                </a>
                            )}
                        </div>

                        {/* Badges / Guarantees */}
                        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-blue-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Mushaf Isyarat Standar</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Ijazah Formal PKBM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Fasilitas Sensori Khusus</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Beasiswa Santri Dhuafa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaPendaftaran;
