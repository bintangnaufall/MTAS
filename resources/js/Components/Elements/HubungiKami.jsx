import React from "react";
import { usePage } from "@inertiajs/react";
import KontakCards from "@/Components/Elements/KontakCards";

const HubungiKami = ({
    id = "lokasi-yayasan",
    badge,
    title,
    description,
    showMap = true,
    className = "",
}) => {
    const { siteSettings = {} } = usePage().props;

    const contactAddress = siteSettings.contact_address || "Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124";
    const contactPhone = siteSettings.contact_phone || "+62 812-3456-7890";
    const contactWhatsapp = siteSettings.contact_whatsapp || "081234567890";
    const contactEmail = siteSettings.contact_email || "info@bhaktiarumi.org";
    const contactHours = siteSettings.contact_hours || "Senin - Sabtu: 08:00 - 16:30 WIB";
    const contactMapsEmbed = siteSettings.contact_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid";
    const contactMapsLink = siteSettings.contact_maps_link || "https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak";
    const namaYayasan = siteSettings.contact_nama_yayasan || "Yayasan Bhakti Arumi Delangga";

    const cleanWhatsappNum = contactWhatsapp.replace(/[^0-9]/g, "");
    const formattedWa = cleanWhatsappNum.startsWith("0") ? "62" + cleanWhatsappNum.slice(1) : cleanWhatsappNum;

    const headerBadge = badge || siteSettings.contact_header_badge || "Pusat Layanan & Informasi";
    const headerTitle = title || siteSettings.contact_header_title || "Kontak & Layanan Informasi";
    const headerDesc = description || siteSettings.contact_header_desc || "Kami siap mendengar, berdiskusi, dan membantu menjawab pertanyaan seputar program pendidikan serta pendaftaran santri.";

    return (
        <section id={id} className={`py-16 lg:py-24 bg-gradient-to-b from-[#F8F9FA] via-white to-[#F0F4FA] border-t border-gray-100 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#CDE1FB] text-[#025EDB] font-bold text-xs uppercase tracking-wider mb-4 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                        <span>{headerBadge}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1C1E] tracking-tight leading-tight">
                        {headerTitle}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-[#5C6F84] leading-relaxed max-w-2xl mx-auto">
                        {headerDesc}
                    </p>
                </div>

                {/* ── 4 Contact Info Cards (Sesuai Screenshot) ── */}
                <div className="mb-12">
                    <KontakCards mapTargetHref={`#${id}-peta`} />
                </div>

                {/* ── Google Maps & Identitas Kantor ── */}
                {showMap && (
                    <div id={`${id}-peta`} className="bg-white rounded-3xl border border-gray-200/80 p-6 lg:p-8 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Peta Interaktif */}
                            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xs border border-gray-100 min-h-[340px] lg:min-h-[380px] relative">
                                <iframe
                                    src={contactMapsEmbed}
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                    className="w-full h-full min-h-[340px] border-0"
                                    title="Google Maps Lokasi Yayasan Bhakti Arumi"
                                ></iframe>
                            </div>

                            {/* Info Kunjungan & Navigasi */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-[#025EDB] text-xs font-bold mb-3 border border-blue-100">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span>Lokasi Yayasan & Asrama</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1A1C1E]">
                                        {namaYayasan}
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                        Pusat kegiatan belajar mengajar Maktab Tuli As-Sami & Maktab Autis. Silakan berkunjung pada jam operasional layanan kami.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-start gap-3 text-xs">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6EFFB] text-[#025EDB] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="font-bold text-[#1A1C1E] block">Alamat Kantor & Asrama:</span>
                                                <span className="text-slate-600 leading-relaxed">{contactAddress}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 text-xs">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6EFFB] text-[#025EDB] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="font-bold text-[#1A1C1E] block">Jam Kunjungan & Layanan:</span>
                                                <span className="text-slate-600">{contactHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <a
                                        href={contactMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#025EDB] hover:bg-[#004BCA] text-white text-xs font-bold transition shadow-sm hover:shadow"
                                    >
                                        <span>Buka Petunjuk Arah</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>

                                    <a
                                        href={`https://wa.me/${formattedWa}?text=Halo%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20berkonsultasi%20atau%20mengunjungi%20kantor...`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition"
                                    >
                                        <svg className="w-4 h-4 fill-emerald-600" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                        <span>Tanya via WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HubungiKami;
