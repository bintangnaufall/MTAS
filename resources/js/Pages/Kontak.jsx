import Layout from "@/Layouts/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Kontak = () => {
    const { flash, siteSettings = {} } = usePage().props;

    const contactAddress = siteSettings.contact_address || "Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124";
    const contactPhone = siteSettings.contact_phone || "+62 812-3456-7890";
    const contactWhatsapp = siteSettings.contact_whatsapp || "081234567890";
    const contactEmail = siteSettings.contact_email || "info@bhaktiarumi.org";
    const contactHours = siteSettings.contact_hours || "08.00 - 16.30 WIB";
    const contactMapsEmbed = siteSettings.contact_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid";
    const contactMapsLink = siteSettings.contact_maps_link || "https://maps.google.com/?q=Maktab+Tuli+As-Sami+Pontianak";
    const contactInstagram = siteSettings.contact_instagram || "https://www.instagram.com/maktabtuliassami.id/";

    // Inertia Form Hook connected to backend POST /kontak
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        nama: "",
        email: "",
        telepon: "",
        subjek: "",
        pesan: "",
    });

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [activeFaq, setActiveFaq] = useState(0);

    // Show toast when message is sent successfully
    useEffect(() => {
        if (recentlySuccessful || flash?.success) {
            setShowSuccessToast(true);
            reset();
            const timer = setTimeout(() => {
                setShowSuccessToast(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful, flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/kontak", {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessToast(true);
                reset();
            },
        });
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(contactAddress);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 3000);
    };

    const handleSelectJbi = () => {
        setData((prev) => ({
            ...prev,
            subjek: "Permohonan Jasa Juru Bahasa Isyarat (JBI)",
            pesan: prev.pesan || "Halo Admin Yayasan Bhakti Arumi,\n\nSaya bermaksud mengajukan permohonan Jasa Layanan Juru Bahasa Isyarat (JBI) untuk kebutuhan:\n• Nama Kegiatan: \n• Tanggal & Waktu Pelaksanaan: \n• Lokasi (Luring/Daring via Zoom): \n• Perkiraan Durasi Acara: \n• Nama Instansi/Penyelenggara: \n\nMohon informasi ketersediaan JBI dan prosedur administrasinya. Terima kasih."
        }));
        const formElem = document.getElementById("formulir-kontak");
        if (formElem) {
            formElem.scrollIntoView({ behavior: "smooth" });
        }
    };

    const cleanWhatsappNum = contactWhatsapp.replace(/[^0-9]/g, '');
    const formattedWa = cleanWhatsappNum.startsWith('0') ? '62' + cleanWhatsappNum.slice(1) : cleanWhatsappNum;

    const contactCards = [
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Alamat Kantor",
            value: contactAddress.split(',')[0] || "Pontianak",
            subtext: "Kantor & Asrama",
            actionLabel: "Lihat di Peta",
            actionHref: "#lokasi-yayasan",
            isExternal: false,
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: "Telepon & WhatsApp",
            value: contactPhone,
            subtext: contactHours,
            actionLabel: "Chat WhatsApp",
            actionHref: `https://wa.me/${formattedWa}?text=Halo%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20bertanya%20mengenai...`,
            isExternal: true,
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Email Resmi",
            value: contactEmail,
            subtext: "Respon Cepat",
            actionLabel: "Kirim Email",
            actionHref: `mailto:${contactEmail}`,
            isExternal: true,
        },
        {
            icon: (
                <svg className="w-6 h-6 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: "Instagram Resmi",
            value: "@maktabtuliassami.id",
            subtext: "Dokumentasi",
            actionLabel: "Buka Instagram",
            actionHref: contactInstagram,
            isExternal: true,
        },
    ];

    const faqs = [
        {
            question: "Bagaimana prosedur pemesanan Jasa Juru Bahasa Isyarat (JBI)?",
            answer: "Pemesanan JBI disarankan diajukan minimal H-3 atau H-7 sebelum hari kegiatan agar tim kami dapat mengonfirmasi jadwal ketersediaan JBI dan mempelajari materi acara. Layanan tersedia secara luring (tatap muka di Pontianak & sekitarnya) maupun daring (Zoom/Live Streaming seluruh Indonesia). Anda dapat mengajukan permohonan melalui formulir di halaman ini atau langsung menghubungi admin WhatsApp kami.",
        },
        {
            question: "Bagaimana alur pendaftaran santri baru Maktab Tuli & Maktab Autis?",
            answer: "Pendaftaran dapat dilakukan secara online melalui menu 'Daftar' di bagian atas situs ini atau datang langsung ke kantor yayasan. Setelah pengisian formulir, tim kami akan menjadwalkan sesi observasi/asesmen awal serta konsultasi bersama orang tua calon santri.",
        },
        {
            question: "Program maktab apa saja yang tersedia di yayasan?",
            answer: "Kami menyelenggarakan Program Pembelajaran Al-Qur'an Isyarat, Kelas Bahasa Isyarat (BISINDO), Bimbingan Fiqih & Tauhid, Terapi Perkembangan & Kemandirian untuk Anak Autis, serta Pelatihan Kewirausahaan/Karya Inklusi.",
        },
        {
            question: "Apakah tersedia program beasiswa / bantuan bagi santri prasejahtera?",
            answer: "Ya, Yayasan Bhakti Arumi Delangga memiliki program beasiswa penuh maupun subsidi pendidikan bagi keluarga prasejahtera dan yatim piatu yang didukung oleh program kepedulian sosial yayasan.",
        },
        {
            question: "Bagaimana jika ingin berkunjung atau menjalin kemitraan sosial?",
            answer: "Kami sangat terbuka untuk kunjungan silaturahmi, studi banding, relawan, maupun kolaborasi CSR instansi. Silakan kirimkan permohonan melalui formulir kontak ini atau hubungi admin WhatsApp kami untuk konfirmasi jadwal.",
        },
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? -1 : index);
    };

    return (
        <>
            <Head title="Kontak - Yayasan Bhakti Arumi Delangga" />
            <Layout>
                <div className="bg-gradient-to-b from-[#E6EFFB]/40 via-white to-[#F7F9FB] min-h-screen pb-20">
                    {/* Header / Hero Section */}
                    <div className="max-w-5xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#CDE1FB] text-[#025EDB] font-bold text-xs uppercase tracking-wider mb-5 shadow-sm shadow-blue-50">
                            <span className="w-2 h-2 rounded-full bg-[#025EDB] animate-pulse"></span>
                            <span>Pusat Layanan &amp; Informasi</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1C1E] tracking-tight leading-tight">
                            Kontak Yayasan Bhakti Arumi
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-[#5C6F84] max-w-2xl mx-auto leading-relaxed">
                            Kami siap mendengar, berdiskusi, dan membantu menjawab pertanyaan seputar program pendidikan serta pendaftaran santri.
                        </p>
                    </div>

                    {/* 4 Contact Info Cards */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {contactCards.map((card, idx) => (
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
                                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── SECTION KHUSUS: JASA LAYANAN JURU BAHASA ISYARAT (JBI) ── */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#003882] via-[#0048AB] to-[#025EDB] p-8 sm:p-12 text-white shadow-xl">
                            {/* Ambient Glows */}
                            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none"></div>
                            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-blue-100 font-bold text-xs uppercase tracking-wider mb-4">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span>Aksesibilitas &amp; Inklusi Komunikasi</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                                            Jasa Layanan Juru Bahasa Isyarat (JBI)
                                        </h2>
                                        <p className="mt-3 text-blue-100/90 text-sm sm:text-base leading-relaxed">
                                            Yayasan Bhakti Arumi Delangga menyediakan tenaga Juru Bahasa Isyarat (JBI) profesional untuk menjembatani komunikasi yang setara dan inklusif antara Teman Dengar dan Teman Tuli dalam berbagai agenda resmi, keagamaan, pendidikan, maupun publik.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <a
                                            href={`https://wa.me/${formattedWa}?text=Halo%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20berkonsultasi%20mengenai%20Jasa%20Layanan%20Juru%20Bahasa%20Isyarat%20(JBI)...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                            </svg>
                                            <span>Reservasi via WhatsApp</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={handleSelectJbi}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0048AB] hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                                        >
                                            <span>Isi Form Permohonan</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* 4 Cards Lingkup Layanan JBI */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                                            Seminar &amp; Konferensi
                                        </h3>
                                        <p className="text-xs text-blue-100/80 leading-relaxed">
                                            Penerjemahan langsung untuk webinar, seminar nasional, rapat dinas, dan pelatihan korporasi.
                                        </p>
                                    </div>

                                    <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                                            Kajian &amp; Keagamaan
                                        </h3>
                                        <p className="text-xs text-blue-100/80 leading-relaxed">
                                            Penerjemahan khutbah Jum'at, pengajian akbar, kajian tematik Islam, akad nikah, dan tabligh.
                                        </p>
                                    </div>

                                    <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                                            Formal &amp; Pendampingan
                                        </h3>
                                        <p className="text-xs text-blue-100/80 leading-relaxed">
                                            Pendampingan sidang akademik/skripsi, konsultasi medis di faskes, serta urusan kedinasan.
                                        </p>
                                    </div>

                                    <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">
                                            Media &amp; Konten Digital
                                        </h3>
                                        <p className="text-xs text-blue-100/80 leading-relaxed">
                                            Penerjemah visual PIP (Picture-in-Picture) video promosi, siaran TV/streaming, dan takarir isyarat.
                                        </p>
                                    </div>
                                </div>

                                {/* Badges Keunggulan JBI */}
                                <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-blue-100">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Standar BISINDO &amp; Bahasa Isyarat Agama</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Tersedia Format Luring &amp; Daring (Zoom / Live)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Penerjemah Berpengalaman &amp; Beretika</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Section: Form & Sidebar */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Contact Form Card (Col Span 7) */}
                            <div id="formulir-kontak" className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6EFFB]/40 rounded-full blur-3xl -z-0 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#E6EFFB] text-[#025EDB] flex items-center justify-center font-bold">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1E]">
                                            Kirim Pesan Langsung
                                        </h2>
                                    </div>
                                    <p className="text-sm text-[#5C6F84] mb-8">
                                        Sampaikan pertanyaan, masukan, atau kebutuhan informasi Anda melalui formulir di bawah. Tim kami akan segera menanggapi.
                                    </p>

                                    {/* Success Alert Banner */}
                                    {showSuccessToast && (
                                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-emerald-900">Pesan Berhasil Terkirim!</h4>
                                                    <p className="text-xs text-emerald-700 mt-0.5">
                                                        Terima kasih telah menghubungi kami. Tim Yayasan Bhakti Arumi Delangga akan segera merespons.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowSuccessToast(false)}
                                                className="text-emerald-500 hover:text-emerald-800 p-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Nama Lengkap */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                    Nama Lengkap <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={data.nama}
                                                        onChange={(e) => setData("nama", e.target.value)}
                                                        required
                                                        placeholder="Contoh: Ahmad Hidayat"
                                                        className={`w-full px-4 py-3.5 bg-gray-50/80 hover:bg-white focus:bg-white rounded-xl border text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#025EDB]/10 ${
                                                            errors.nama ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#025EDB]"
                                                        }`}
                                                    />
                                                </div>
                                                {errors.nama && (
                                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                        <span>•</span> {errors.nama}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                    Alamat Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData("email", e.target.value)}
                                                    required
                                                    placeholder="nama@email.com"
                                                    className={`w-full px-4 py-3.5 bg-gray-50/80 hover:bg-white focus:bg-white rounded-xl border text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#025EDB]/10 ${
                                                        errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#025EDB]"
                                                    }`}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                        <span>•</span> {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Nomor Telepon / WA */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                    Nomor Telepon / WhatsApp
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.telepon}
                                                    onChange={(e) => setData("telepon", e.target.value)}
                                                    placeholder="081234567890"
                                                    className={`w-full px-4 py-3.5 bg-gray-50/80 hover:bg-white focus:bg-white rounded-xl border text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#025EDB]/10 ${
                                                        errors.telepon ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#025EDB]"
                                                    }`}
                                                />
                                                {errors.telepon && (
                                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                        <span>•</span> {errors.telepon}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Subjek */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Subjek Pesan <span className="text-red-500">*</span>
                                                    </label>
                                                </div>

                                                {/* Quick Chips */}
                                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                                    {[
                                                        { label: "Jasa JBI (Bahasa Isyarat)", subject: "Permohonan Jasa Juru Bahasa Isyarat (JBI)" },
                                                        { label: "Pendaftaran Santri (PSB)", subject: "Informasi Pendaftaran Santri Baru (PSB)" },
                                                        { label: "Konsultasi Parenting", subject: "Konsultasi Parenting & Tumbuh Kembang" },
                                                        { label: "Kemitraan / CSR", subject: "Kemitraan & Kolaborasi Sosial" },
                                                    ].map((chip, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => {
                                                                setData("subjek", chip.subject);
                                                                if (chip.subject.includes("JBI") && !data.pesan) {
                                                                    setData((prev) => ({
                                                                        ...prev,
                                                                        subjek: chip.subject,
                                                                        pesan: "Halo Admin Yayasan Bhakti Arumi,\n\nSaya bermaksud mengajukan permohonan Jasa Layanan Juru Bahasa Isyarat (JBI) untuk kebutuhan:\n• Nama Kegiatan: \n• Tanggal & Waktu Pelaksanaan: \n• Lokasi (Luring/Daring via Zoom): \n• Perkiraan Durasi Acara: \n• Nama Instansi/Penyelenggara: \n\nMohon informasi ketersediaan JBI dan prosedur administrasinya. Terima kasih."
                                                                    }));
                                                                }
                                                            }}
                                                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-semibold cursor-pointer ${
                                                                data.subjek === chip.subject
                                                                    ? "bg-[#025EDB] text-white border-[#025EDB] shadow-2xs"
                                                                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                                                            }`}
                                                        >
                                                            {chip.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <input
                                                    type="text"
                                                    value={data.subjek}
                                                    onChange={(e) => setData("subjek", e.target.value)}
                                                    required
                                                    placeholder="Contoh: Permohonan Jasa Juru Bahasa Isyarat (JBI)"
                                                    className={`w-full px-4 py-3.5 bg-gray-50/80 hover:bg-white focus:bg-white rounded-xl border text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#025EDB]/10 ${
                                                        errors.subjek ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#025EDB]"
                                                    }`}
                                                />
                                                {errors.subjek && (
                                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                        <span>•</span> {errors.subjek}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Isi Pesan */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                Isi Pesan / Pertanyaan <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                rows={5}
                                                value={data.pesan}
                                                onChange={(e) => setData("pesan", e.target.value)}
                                                required
                                                placeholder="Tuliskan pertanyaan, maksud, atau detail pesan Anda secara lengkap di sini..."
                                                className={`w-full px-4 py-3.5 bg-gray-50/80 hover:bg-white focus:bg-white rounded-xl border text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#025EDB]/10 resize-none ${
                                                    errors.pesan ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#025EDB]"
                                                }`}
                                            ></textarea>
                                            {errors.pesan && (
                                                <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                    <span>•</span> {errors.pesan}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full sm:w-auto px-8 py-3.5 bg-[#025EDB] hover:bg-[#004BCA] active:bg-[#00399c] text-white font-bold text-sm rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Mengirim Pesan...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Kirim Pesan Sekarang</span>
                                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Data Anda dijaga kerahasiaannya
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Sidebar Column (Col Span 5): WhatsApp Card & FAQ Accordion */}
                            <div className="lg:col-span-5 space-y-6">
                                {/* Direct WhatsApp Card */}
                                <div className="bg-gradient-to-br from-[#128C7E] to-[#075E54] rounded-3xl p-7 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-bold tracking-wider uppercase">
                                                Respon Instan
                                            </span>
                                            <h3 className="text-xl font-extrabold text-white">
                                                Chat WhatsApp Admin
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-emerald-50 text-sm leading-relaxed mb-6">
                                        Butuh tanggapan cepat mengenai pendaftaran santri, konsultasi anak, atau informasi kemitraan? Hubungi nomor admin resmi kami via WhatsApp.
                                    </p>

                                    <a
                                        href="https://wa.me/6281234567890?text=Halo%20Admin%20Yayasan%20Bhakti%20Arumi%20Delangga,%20saya%20ingin%20berkonsultasi..."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-white hover:bg-emerald-50 text-[#075E54] font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
                                    >
                                        <span>Buka WhatsApp Sekarang</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-100">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        <span>Admin Siap Membantu (08.00 - 16.00 WIB)</span>
                                    </div>
                                </div>

                                {/* FAQ Section */}
                                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2.5 mb-5">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#025EDB] flex items-center justify-center font-bold text-xs">
                                            ?
                                        </div>
                                        <h3 className="text-lg font-extrabold text-[#1A1C1E]">
                                            Pertanyaan Sering Diajukan
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {faqs.map((faq, idx) => {
                                            const isOpen = activeFaq === idx;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                                        isOpen
                                                            ? "bg-blue-50/30 border-blue-200/80 shadow-sm"
                                                            : "bg-gray-50/70 border-gray-100 hover:border-gray-200"
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleFaq(idx)}
                                                        className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
                                                    >
                                                        <span className={`text-xs sm:text-sm font-bold transition-colors ${
                                                            isOpen ? "text-[#025EDB]" : "text-gray-800"
                                                        }`}>
                                                            {faq.question}
                                                        </span>
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                                            isOpen ? "rotate-180 bg-[#025EDB] text-white" : "bg-gray-200/80 text-gray-600"
                                                        }`}>
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-4 pb-4 pt-1 text-xs text-[#5C6F84] leading-relaxed border-t border-blue-100/60 mt-1">
                                                            {faq.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Lokasi & Google Maps */}
                    <div id="lokasi-yayasan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#025EDB] text-xs font-bold uppercase tracking-wider mb-2">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        Lokasi Fisik
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1E]">
                                        Lokasi &amp; Akses Yayasan
                                    </h2>
                                    <p className="text-sm text-[#5C6F84] mt-1">
                                        Kunjungi langsung asrama dan kantor Maktab Tuli As-Sami / Yayasan Bhakti Arumi Delangga di Pontianak.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCopyAddress}
                                        className="px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white text-xs font-bold text-gray-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
                                    >
                                        {copiedAddress ? (
                                            <>
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Salin Alamat</span>
                                            </>
                                        )}
                                    </button>

                                    <a
                                        href={contactMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 rounded-xl bg-[#025EDB] hover:bg-[#004BCA] text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20"
                                    >
                                        <span>Buka di Google Maps</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Clean Google Maps Embed */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-md relative bg-gray-100 aspect-video md:aspect-[21/9] max-h-[460px] w-full">
                                <iframe
                                    src={contactMapsEmbed}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi Maktab Tuli As-Sami Yayasan Bhakti Arumi"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Kontak;
