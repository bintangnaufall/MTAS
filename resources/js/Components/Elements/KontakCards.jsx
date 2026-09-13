import React from "react";
import { usePage } from "@inertiajs/react";

const KontakCards = ({ mapTargetHref, className = "" }) => {
    const { siteSettings = {} } = usePage().props;

    const contactAddress = siteSettings.contact_address || "Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124";
    const contactPhone = siteSettings.contact_phone || "+62 812-3456-7890";
    const contactWhatsapp = siteSettings.contact_whatsapp || "081234567890";
    const contactEmail = siteSettings.contact_email || "info@bhaktiarumi.org";
    const contactHours = siteSettings.contact_hours || siteSettings.contact_card2_badge || "Senin - Sabtu: 08:00 - 16:30 WIB";
    const contactMapsLink = siteSettings.contact_maps_link || "https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak";
    const contactInstagram = siteSettings.contact_instagram || "https://www.instagram.com/maktabtuliassami.id/";
    const contactInstagramHandle = siteSettings.contact_instagram_handle || "@maktabtuliassami.id";

    // Card 1: Alamat Kantor
    const card1Badge = siteSettings.contact_card1_badge || "Kantor & Asrama";
    const card1Title = siteSettings.contact_card1_title || "Alamat Kantor";
    const card1Btn = siteSettings.contact_card1_btn || "Lihat di Peta";

    // Card 2: Telepon & WhatsApp
    const card2Badge = siteSettings.contact_card2_badge || contactHours;
    const card2Title = siteSettings.contact_card2_title || "Telepon & WhatsApp";
    const card2Btn = siteSettings.contact_card2_btn || "Chat WhatsApp";

    // Card 3: Email Resmi
    const card3Badge = siteSettings.contact_card3_badge || "Respon Cepat";
    const card3Title = siteSettings.contact_card3_title || "Email Resmi";
    const card3Btn = siteSettings.contact_card3_btn || "Kirim Email";

    // Card 4: Instagram Resmi
    const card4Badge = siteSettings.contact_card4_badge || "Dokumentasi";
    const card4Title = siteSettings.contact_card4_title || "Instagram Resmi";
    const card4Btn = siteSettings.contact_card4_btn || "Buka Instagram";

    const cleanWhatsappNum = contactWhatsapp.replace(/[^0-9]/g, "");
    const formattedWa = cleanWhatsappNum.startsWith("0") ? "62" + cleanWhatsappNum.slice(1) : cleanWhatsappNum;

    const cards = [
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: card1Title,
            value: contactAddress.split(",")[0] || "Jl. Arumi Delangga No. 45",
            subtext: card1Badge,
            actionLabel: card1Btn,
            actionHref: mapTargetHref || contactMapsLink,
            isExternal: !mapTargetHref || mapTargetHref.startsWith("http"),
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: card2Title,
            value: contactPhone,
            subtext: card2Badge,
            actionLabel: card2Btn,
            actionHref: `https://wa.me/${formattedWa}?text=Halo%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20bertanya%20mengenai...`,
            isExternal: true,
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: card3Title,
            value: contactEmail,
            subtext: card3Badge,
            actionLabel: card3Btn,
            actionHref: `mailto:${contactEmail}`,
            isExternal: true,
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: card4Title,
            value: contactInstagramHandle,
            subtext: card4Badge,
            actionLabel: card4Btn,
            actionHref: contactInstagram,
            isExternal: true,
        },
    ];

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
            {cards.map((card, idx) => (
                <a
                    key={idx}
                    href={card.actionHref}
                    target={card.isExternal ? "_blank" : undefined}
                    rel={card.isExternal ? "noopener noreferrer" : undefined}
                    className="group bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#E6EFFB] group-hover:bg-[#025EDB] group-hover:text-white transition-colors duration-300 shadow-inner">
                                <div className="group-hover:[&_svg]:text-white transition-colors">
                                    {card.icon}
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                {card.subtext}
                            </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#1A1C1E] group-hover:text-[#025EDB] transition-colors">
                            {card.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 mt-1 break-words">
                            {card.value}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#025EDB] group-hover:text-[#004BCA]">
                        <span>{card.actionLabel}</span>
                        <svg
                            className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default KontakCards;
