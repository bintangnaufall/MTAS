import { Link, usePage } from "@inertiajs/react";
import React from "react";

const Footer = () => {
    const { siteSettings = {} } = usePage().props;

    const namaYayasan = siteSettings.footer_nama_yayasan || siteSettings.contact_nama_yayasan || "Yayasan Bhakti Arumi Delangga";
    const deskripsi = siteSettings.footer_deskripsi || "Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.";
    const instagram = siteSettings.footer_instagram || siteSettings.contact_instagram || "https://www.instagram.com/maktabtuliassami.id/";
    const tiktok = siteSettings.footer_tiktok || siteSettings.contact_tiktok || "https://www.tiktok.com/@maktabtuliassami.id";
    const youtube = siteSettings.footer_youtube || siteSettings.contact_youtube || "https://www.youtube.com/@MaktabTuliAsSami";
    const facebook = siteSettings.footer_facebook || siteSettings.contact_facebook || "https://facebook.com/maktabtuliassami";

    const linksTitle = siteSettings.footer_links_title || "Tautan Cepat";
    const quickLinks = [
        { text: siteSettings.footer_link1_text || "Beranda", url: siteSettings.footer_link1_url || "/" },
        { text: siteSettings.footer_link2_text || "Maktab Tuli", url: siteSettings.footer_link2_url || "/maktabtuli" },
        { text: siteSettings.footer_link3_text || "Berita & Artikel", url: siteSettings.footer_link3_url || "/berita" },
        { text: siteSettings.footer_link4_text || "Galeri Dokumentasi", url: siteSettings.footer_link4_url || "/galeri" },
        { text: siteSettings.footer_link5_text || "Kontak Kami", url: siteSettings.footer_link5_url || "/kontak" },
    ].filter(item => item.text);

    const programTitle = siteSettings.footer_program_title || "Program Utama";
    const programLinks = [
        { text: siteSettings.footer_prog1_text || "Maktab Tuli As-Sami", url: siteSettings.footer_prog1_url || "/maktabtuli" },
        { text: siteSettings.footer_prog2_text || "Maktab Autis & Khusus", url: siteSettings.footer_prog2_url || "/daftar" },
        { text: siteSettings.footer_prog3_text || "Konseling Parenting Inklusif", url: siteSettings.footer_prog3_url || "/kontak" },
        { text: siteSettings.footer_prog4_text || "Penerimaan Santri Baru (PSB)", url: siteSettings.footer_prog4_url || "/daftar" },
    ].filter(item => item.text);

    const ctaTitle = siteSettings.footer_cta_title || "Pendaftaran Santri Baru";
    const ctaDesc = siteSettings.footer_cta_desc || "Pendaftaran santri baru program Maktab Tuli dan Autis kini dibuka secara daring.";
    const ctaBtnText = siteSettings.footer_cta_btn_text || "Isi Formulir Online";
    const ctaBtnLink = siteSettings.footer_cta_btn_link || "/daftar";

    const copyrightText = siteSettings.footer_copyright || `© ${new Date().getFullYear()} ${namaYayasan}. All rights reserved.`;
    const sloganText = siteSettings.footer_slogan || "Pusat Pendidikan Islam & Kemandirian Disabilitas Sensorik";

    return (
        <footer className="bg-white border-t border-[#025EDB]/10 w-full">
            <div className="w-full flex flex-col lg:flex-row py-12 px-4 sm:px-12 xl:px-48 gap-8 lg:gap-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:w-1/3">
                    <span className="text-[#025EDB] text-lg font-bold">
                        {namaYayasan}
                    </span>
                    <p className="text-sm text-[#44474E] py-4 leading-relaxed">
                        {deskripsi}
                    </p>
                    <div className="flex gap-x-3 mt-2">
                        {/* Instagram */}
                        {instagram && (
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#025EDB]/10 hover:bg-[#025EDB]/20 transition-colors rounded-xl w-10 h-10 flex justify-center items-center"
                                title="Instagram Yayasan"
                            >
                                <svg
                                    fill="#025EDB"
                                    width="22px"
                                    height="22px"
                                    viewBox="0 0 32 32"
                                >
                                    <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z" />
                                    <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8 c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z" />
                                    <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8 c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z" />
                                </svg>
                            </a>
                        )}
                        {/* Tiktok */}
                        {tiktok && (
                            <a
                                href={tiktok}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="bg-[#025EDB]/10 hover:bg-[#025EDB]/20 transition-colors rounded-xl w-10 h-10 flex justify-center items-center"
                                title="TikTok Yayasan"
                            >
                                <svg
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 23 28"
                                    fill="#025EDB"
                                >
                                    <path d="M16.8218 5.1344C16.0887 4.29394 15.648 3.19805 15.648 2H14.7293C14.9659 3.3095 15.7454 4.43326 16.8218 5.1344Z" fill="#025EDB" />
                                    <path d="M19.4245 6.67608V9.34614C17.6429 9.34614 15.9912 8.77501 14.6456 7.80911V14.7977C14.6456 18.2851 11.8108 21.127 8.32172 21.127C6.97621 21.127 5.7235 20.6998 4.69812 19.98C5.8534 21.2198 7.50049 22 9.32392 22C12.8083 22 15.6478 19.1627 15.6478 15.6707V8.68211C16.9933 9.64801 18.645 10.2191 20.4267 10.2191V6.78293C20.0787 6.78293 19.7446 6.74574 19.4245 6.67608Z" fill="#025EDB" />
                                </svg>
                            </a>
                        )}
                        {/* Youtube */}
                        {youtube && (
                            <a
                                href={youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#025EDB]/10 hover:bg-[#025EDB]/20 transition-colors rounded-xl w-10 h-10 flex justify-center items-center"
                                title="YouTube Channel"
                            >
                                <svg
                                    width="22px"
                                    height="22px"
                                    viewBox="0 -0.5 25 25"
                                    fill="none"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.168 19.0028C20.4724 19.0867 22.41 17.29 22.5 14.9858V9.01982C22.41 6.71569 20.4724 4.91893 18.168 5.00282H6.832C4.52763 4.91893 2.58998 6.71569 2.5 9.01982V14.9858C2.58998 17.29 4.52763 19.0867 6.832 19.0028H18.168Z"
                                        stroke="#025EDB"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12.008 9.17784L15.169 11.3258C15.3738 11.4454 15.4997 11.6647 15.4997 11.9018C15.4997 12.139 15.3738 12.3583 15.169 12.4778L12.008 14.8278C11.408 15.2348 10.5 14.2518 10.5 14.2518V9.75184C10.5 9.11884 11.409 8.77084 12.008 9.17784Z"
                                        stroke="#025EDB"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        )}
                        {/* Facebook */}
                        {facebook && (
                            <a
                                href={facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#025EDB]/10 hover:bg-[#025EDB]/20 transition-colors rounded-xl w-10 h-10 flex justify-center items-center"
                                title="Facebook Page"
                            >
                                <span className="material-symbols-outlined text-[#025EDB] text-[20px]">public</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:w-1/2 lg:w-1/5">
                    <span className="text-[#1A1C1E] text-sm font-bold mb-4">
                        {linksTitle}
                    </span>
                    <div className="flex flex-col space-y-2.5 text-sm text-[#44474E]">
                        {quickLinks.map((link, idx) => (
                            <Link key={idx} href={link.url} className="hover:text-primary transition-colors">
                                {link.text}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:w-1/2 lg:w-1/4">
                    <span className="text-[#1A1C1E] text-sm font-bold mb-4">
                        {programTitle}
                    </span>
                    <div className="flex flex-col space-y-2.5 text-sm text-[#44474E]">
                        {programLinks.map((prog, idx) => (
                            <Link key={idx} href={prog.url} className="hover:text-primary transition-colors">
                                {prog.text}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:w-1/4 bg-[#E6EFFB]/40 p-5 rounded-2xl border border-[#025EDB]/10">
                    <span className="text-[#025EDB] text-sm font-bold mb-2">
                        {ctaTitle}
                    </span>
                    <p className="text-xs text-[#44474E] leading-relaxed mb-4">
                        {ctaDesc}
                    </p>
                    <Link
                        href={ctaBtnLink}
                        className="text-xs font-bold text-white bg-[#025EDB] hover:bg-[#0048AB] transition-colors py-2.5 px-4 rounded-xl text-center shadow-xs"
                    >
                        {ctaBtnText}
                    </Link>
                </div>
            </div>

            <div className="py-5 px-4 sm:px-12 xl:px-48 border-t border-[#025EDB]/10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>
                    {copyrightText}
                </span>
                <span>
                    {sloganText}
                </span>
            </div>
        </footer>
    );
};

export default Footer;
