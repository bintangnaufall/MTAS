import { Link, usePage } from "@inertiajs/react";

const HeroYayasan = () => {
    const { siteSettings = {} } = usePage().props;

    const heroBadge = siteSettings.hero_badge || "Pusat Pendidikan & Perlindungan Inklusif";
    const heroTitle1 = siteSettings.hero_title_line1 || "Yayasan Bhakti";
    const heroTitle2 = siteSettings.hero_title_line2 || "Arumi Delangga";
    const heroDesc = siteSettings.hero_description || "Memperjuangkan hak-hak penyandang disabilitas secara menyeluruh, mencakup pendidikan agama Islam, kemandirian hidup, dan pendampingan psikologis.";
    const btn1Text = siteSettings.hero_btn1_text || "Tentang Yayasan";
    const btn1Link = siteSettings.hero_btn1_link || "/maktabtuli";
    const btn2Text = siteSettings.hero_btn2_text || "Daftar Santri";
    const btn2Link = siteSettings.hero_btn2_link || "/daftar";
    const heroImg = siteSettings.hero_image || "/images/hero_foto.png";
    const floatingTitle = siteSettings.hero_floating_title || "Santri Inklusif";
    const floatingSubtitle = siteSettings.hero_floating_subtitle || "Aktif belajar bersama di MTAS";

    return (
        <div className="bg-[#E6EFFB]/30 border-b border-[#025EDB]/10">
            <div className="xl:mx-48 xl:pt-16 mx-4 pt-8 pb-12 xl:pb-20 xl:min-h-[620px] xl:flex xl:flex-row flex flex-col justify-between items-center max-w-7xl">
                {/* LEFT CONTENT */}
                <div className="flex flex-col xl:justify-center xl:max-w-xl">
                    {/* Badge */}
                    <div className="bg-[#FBF3E6] border border-[#FFE2BC] rounded-full flex items-center gap-x-2 px-3.5 py-1.5 w-fit shadow-2xs">
                        <svg width="18" height="18" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.03765 0.0485337C4.88669 -0.0161779 4.71581 -0.0161779 4.56485 0.0485337L0.364849 1.84853C0.143597 1.94279 0 2.16004 0 2.40053C0 2.64103 0.143597 2.85828 0.364849 2.95253L1.95125 3.63113C2.01013 3.56453 2.08309 3.51186 2.16485 3.47693L4.56485 2.44853C4.7625 2.36044 4.99228 2.3856 5.16618 2.51439C5.34009 2.64317 5.43117 2.85562 5.40455 3.07037C5.37793 3.28513 5.23773 3.46891 5.03765 3.55133L3.40145 4.25333L4.56545 4.75193C4.71623 4.81647 4.88687 4.81647 5.03765 4.75193L9.23765 2.95193C9.45815 2.85734 9.6011 2.64047 9.6011 2.40053C9.6011 2.1606 9.45815 1.94373 9.23765 1.84913L5.03765 0.0491337V0.0485337ZM0.787249 4.43873L1.80125 4.87253V7.33373C1.5935 7.28649 1.38313 7.25163 1.17125 7.22933C0.889503 7.19972 0.66686 6.97708 0.637249 6.69533C0.558343 5.93988 0.609073 5.1765 0.787249 4.43813V4.43873ZM4.38125 8.74433C3.97566 8.34636 3.50996 8.01471 3.00125 7.76153V5.38733L4.09205 5.85533C4.54492 6.04947 5.05758 6.04947 5.51045 5.85533L8.81525 4.43873C8.99447 5.17694 9.04521 5.9405 8.96525 6.69593C8.93564 6.97768 8.713 7.20032 8.43125 7.22993C7.22077 7.35715 6.08917 7.89101 5.22125 8.74433C4.98794 8.97302 4.61455 8.97302 4.38125 8.74433Z" fill="#D38B1D" />
                        </svg>
                        <span className="text-xs font-bold text-[#A66705] tracking-wide">
                            {heroBadge}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col mt-5">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#D38B1D] tracking-tight">
                                {heroTitle1.split(' ')[0]}
                            </span>
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                                {heroTitle1.split(' ').slice(1).join(' ') || ''}
                            </span>
                        </div>
                        <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#025EDB] tracking-tight leading-tight mt-1">
                            {heroTitle2}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                        {heroDesc}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-7 gap-3 sm:gap-4">
                        <Link
                            href={btn1Link}
                            className="bg-[#025EDB] hover:bg-[#0048AB] text-white text-sm sm:text-base font-bold rounded-full px-8 py-3.5 text-center transition-all duration-300 shadow-md shadow-[#025EDB]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                        >
                            {btn1Text}
                        </Link>
                        <Link
                            href={btn2Link}
                            className="bg-white hover:bg-[#E6EFFB] text-[#025EDB] text-sm sm:text-base font-bold rounded-full px-8 py-3.5 text-center border-2 border-[#025EDB]/30 hover:border-[#025EDB] transition-all duration-300 shadow-xs active:scale-98"
                        >
                            {btn2Text}
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative inline-block mt-8 xl:mt-0">
                    <div className="rounded-3xl border-4 border-white bg-slate-900 shadow-2xl overflow-hidden max-w-sm sm:max-w-md">
                        <img
                            src={heroImg}
                            alt="Santri Yayasan Bhakti Arumi Delangga"
                            className="w-full h-80 sm:h-96 md:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                            onError={(e) => { e.target.src = '/images/hero_foto.png'; }}
                        />
                    </div>
                    <div className="absolute -bottom-4 left-4 sm:-left-6 rounded-2xl bg-white px-5 py-3.5 shadow-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#025EDB] flex items-center justify-center font-black">
                            <span className="material-symbols-outlined text-[22px]">diversity_3</span>
                        </div>
                        <div>
                            <p className="text-sm font-extrabold text-[#025EDB] leading-tight">{floatingTitle}</p>
                            <p className="text-xs text-slate-500 font-medium">{floatingSubtitle}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroYayasan;
