import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import MenuNavbar from "../Fragments/MenuNavbar";

const Nav = () => {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const isActive = (path) => path === "/" ? url === "/" : url.startsWith(path);

    return (
        <div className="xl:px-48 xl:py-5 py-4 px-4 bg-[#E6EFFB]/30 transition-all duration-300">
            {/* Navbar Container */}
            <div className="flex xl:rounded-full w-full border border-gray-100 h-[64px] bg-white items-center justify-between px-6 shadow-md shadow-gray-100/50 transition-all duration-300">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img
                        src="/images/YBAD_logo.png"
                        alt="LOGO MTAS"
                        className="w-11 h-11 object-contain group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 cursor-pointer"
                    />
                    <span className="xl:text-base font-extrabold text-[#025EDB] w-36 xl:w-full leading-tight text-sm tracking-tight transition group-hover:text-[#004BCA]">
                        Yayasan Bhakti Arumi Delangga
                    </span>
                </Link>

                {/* Menu Desktop */}
                <MenuNavbar />

                {/* Button daftar Desktop */}
                <Link
                    href="/daftar"
                    className="hidden xl:flex items-center justify-center bg-[#025EDB] text-white rounded-full px-6 py-2.5 font-bold text-[13px] tracking-wider uppercase shadow-md shadow-[#025EDB]/10 hover:shadow-lg hover:shadow-[#025EDB]/30 hover:bg-[#004BCA] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                    Daftar
                </Link>

                {/* Hamburger Menu Toggle (Mobile) */}
                <button
                    onClick={() => setOpen(!open)}
                    className={`xl:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 active:scale-90 ${
                        open ? "bg-[#E6EFFB] text-[#025EDB]" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    {open ? (
                        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`xl:hidden absolute top-[75px] left-0 w-full overflow-hidden bg-white shadow-xl border-b border-gray-100 px-6 flex flex-col gap-2.5 z-50 transition-all duration-500 ease-in-out ${
                    open ? "max-h-[500px] py-6 opacity-100 translate-y-0" : "max-h-0 py-0 opacity-0 -translate-y-4 pointer-events-none"
                }`}
            >
                <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={`py-3.5 px-6 rounded-2xl flex justify-start items-center transition-all duration-300 group active:scale-98 ${
                        isActive("/")
                            ? "bg-[#025EDB] font-bold text-white shadow-md shadow-[#025EDB]/20"
                            : "text-gray-700 hover:bg-[#E6EFFB]/40 hover:text-[#025EDB] font-semibold"
                    }`}
                >
                    <span className={`mr-4 transition-colors duration-300 ${isActive("/") ? "text-white" : "text-gray-400 group-hover:text-[#025EDB]"}`}>
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
                            <path d="M0 17.64V5.88L7.84 0L15.68 5.88V17.64H9.8V10.78H5.88V17.64H0Z" />
                        </svg>
                    </span>
                    Beranda
                </Link>

                <Link
                    href="/maktabtuli"
                    onClick={() => setOpen(false)}
                    className={`py-3.5 px-6 rounded-2xl flex justify-start items-center transition-all duration-300 group active:scale-98 ${
                        isActive("/maktabtuli")
                            ? "bg-[#025EDB] font-bold text-white shadow-md shadow-[#025EDB]/20"
                            : "text-gray-700 hover:bg-[#E6EFFB]/40 hover:text-[#025EDB] font-semibold"
                    }`}
                >
                    <span className={`mr-4 transition-colors duration-300 ${isActive("/maktabtuli") ? "text-white" : "text-gray-400 group-hover:text-[#025EDB]"}`}>
                        <svg width="18" height="21" viewBox="0 0 18 21" fill="currentColor">
                            <path d="M4 20.8C5.03333 20.8 5.87917 20.5417 6.5375 20.025C7.19583 19.5083 7.7 18.75 8.05 17.75C8.33333 16.9167 8.60417 16.3333 8.8625 16C9.12083 15.6667 9.71667 15.1333 10.65 14.4C11.6833 13.5667 12.5 12.625 13.1 11.575C13.7 10.525 14 9.26667 14 7.8C14 5.81667 13.3292 4.15417 11.9875 2.8125C10.6458 1.47083 8.98333 0.8 7 0.8C5.01667 0.8 3.35417 1.47083 2.0125 2.8125C0.670833 4.15417 0 5.81667 0 7.8H2C2 6.38333 2.47917 5.19583 3.4375 4.2375C4.39583 3.27917 5.58333 2.8 7 2.8C8.41667 2.8 9.60417 3.27917 10.5625 4.2375C11.5208 5.19583 12 6.38333 12 7.8C12 8.93333 11.775 9.9 11.325 10.7C10.875 11.5 10.2333 12.2167 9.4 12.85C8.53333 13.4833 7.85833 14.1 7.375 14.7C6.89167 15.3 6.53333 15.95 6.3 16.65C6.06667 17.3833 5.7875 17.925 5.4625 18.275C5.1375 18.625 4.65 18.8 4 18.8C3.45 18.8 2.97917 18.6042 2.5875 18.2125C2.19583 17.8208 2 17.35 2 16.8H0C0 17.9 0.391667 18.8417 1.175 19.625C1.95833 20.4083 2.9 20.8 4 20.8V20.8M14.8 15.55C15.7833 14.55 16.5625 13.3875 17.1375 12.0625C17.7125 10.7375 18 9.31667 18 7.8C18 6.26667 17.7125 4.83333 17.1375 3.5C16.5625 2.16667 15.7833 1 14.8 0L13.35 1.4C14.1833 2.23333 14.8333 3.19583 15.3 4.2875C15.7667 5.37917 16 6.55 16 7.8C16 9.03333 15.7667 10.1917 15.3 11.275C14.8333 12.3583 14.1833 13.3167 13.35 14.15L14.8 15.55V15.55M7 10.3C7.7 10.3 8.29167 10.0542 8.775 9.5625C9.25833 9.07083 9.5 8.48333 9.5 7.8C9.5 7.1 9.25833 6.50833 8.775 6.025C8.29167 5.54167 7.7 5.3 7 5.3C6.3 5.3 5.70833 5.54167 5.225 6.025C4.74167 6.50833 4.5 7.1 4.5 7.8C4.5 8.48333 4.74167 9.07083 5.225 9.5625C5.70833 10.0542 6.3 10.3 7 10.3V10.3" />
                        </svg>
                    </span>
                    Maktab Tuli
                </Link>

                <Link
                    href="/berita"
                    onClick={() => setOpen(false)}
                    className={`py-3.5 px-6 rounded-2xl flex justify-start items-center transition-all duration-300 group active:scale-98 ${
                        isActive("/berita")
                            ? "bg-[#025EDB] font-bold text-white shadow-md shadow-[#025EDB]/20"
                            : "text-gray-700 hover:bg-[#E6EFFB]/40 hover:text-[#025EDB] font-semibold"
                    }`}
                >
                    <span className={`mr-4 transition-colors duration-300 ${isActive("/berita") ? "text-white" : "text-gray-400 group-hover:text-[#025EDB]"}`}>
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="currentColor">
                            <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V0L1.675 1.675L3.325 0L5 1.675L6.675 0L8.325 1.675L10 0L11.675 1.675L13.325 0L15 1.675L16.675 0L18.325 1.675L20 0V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H2V18M2 16H9V10H2V16V16V16V16M11 16H18V16V16V14H11V16V16M11 12H18V10H11V12V12M2 8H18V5H2V8V8" />
                        </svg>
                    </span>
                    Berita
                </Link>

                <Link
                    href="/galeri"
                    onClick={() => setOpen(false)}
                    className={`py-3.5 px-6 rounded-2xl flex justify-start items-center transition-all duration-300 group active:scale-98 ${
                        isActive("/galeri")
                            ? "bg-[#025EDB] font-bold text-white shadow-md shadow-[#025EDB]/20"
                            : "text-gray-700 hover:bg-[#E6EFFB]/40 hover:text-[#025EDB] font-semibold"
                    }`}
                >
                    <span className={`mr-4 transition-colors duration-300 ${isActive("/galeri") ? "text-white" : "text-gray-400 group-hover:text-[#025EDB]"}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 12H17L13.55 7.5L11.25 10.5L9.7 8.5L7 12V12M6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6V16M6 14H18V14V14V2V2V2H6V2V2V14V14V14V14M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18V18V18H16V20H2V20M6 2V2V2V2V14V14V14V14V14V14V2V2V2V2" />
                        </svg>
                    </span>
                    Galeri
                </Link>

                <Link
                    href="/kontak"
                    onClick={() => setOpen(false)}
                    className={`py-3.5 px-6 rounded-2xl flex justify-start items-center transition-all duration-300 group active:scale-98 ${
                        isActive("/kontak")
                            ? "bg-[#025EDB] font-bold text-white shadow-md shadow-[#025EDB]/20"
                            : "text-gray-700 hover:bg-[#E6EFFB]/40 hover:text-[#025EDB] font-semibold"
                    }`}
                >
                    <span className={`mr-4 transition-colors duration-300 ${isActive("/kontak") ? "text-white" : "text-gray-400 group-hover:text-[#025EDB]"}`}>
                        <svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor">
                            <path d="M9 20L8.75 17H8.5C6.13333 17 4.125 16.175 2.475 14.525C0.825 12.875 0 10.8667 0 8.5C0 6.13333 0.825 4.125 2.475 2.475C4.125 0.825 6.13333 0 8.5 0C9.68333 0 10.7875 0.220833 11.8125 0.6625C12.8375 1.10417 13.7375 1.7125 14.5125 2.4875C15.2875 3.2625 15.8958 4.1625 16.3375 5.1875C16.7792 6.2125 17 7.31667 17 8.5C17 9.75 16.7958 10.95 16.3875 12.1C15.9792 13.25 15.4208 14.3167 14.7125 15.3C14.0042 16.2833 13.1625 17.175 12.1875 17.975C11.2125 18.775 10.15 19.45 9 20V20M11 16.35C12.1833 15.35 13.1458 14.1792 13.8875 12.8375C14.6292 11.4958 15 10.05 15 8.5C15 6.68333 14.3708 5.14583 13.1125 3.8875C11.8542 2.62917 10.3167 2 8.5 2C6.68333 2 5.14583 2.62917 3.8875 3.8875C2.62917 5.14583 2 6.68333 2 8.5C2 10.3167 2.62917 11.8542 3.8875 13.1125C5.14583 14.3708 6.68333 15 8.5 15H11V16.35V16.35M8.475 13.975C8.75833 13.975 9 13.875 9.2 13.675C9.4 13.475 9.5 13.2333 9.5 12.95C9.5 12.6667 9.4 12.425 9.2 12.225C9 12.025 8.75833 11.925 8.475 11.925C8.19167 11.925 7.95 12.025 7.75 12.225C7.55 12.425 7.45 12.6667 7.45 12.95C7.45 13.2333 7.55 13.475 7.75 13.675C7.95 13.875 8.19167 13.975 8.475 13.975V13.975M7.75 10.8H9.25C9.25 10.3 9.3 9.95 9.4 9.75C9.5 9.55 9.81667 9.18333 10.35 8.65C10.65 8.35 10.9 8.025 11.1 7.675C11.3 7.325 11.4 6.95 11.4 6.55C11.4 5.7 11.1125 5.0625 10.5375 4.6375C9.9625 4.2125 9.28333 4 8.5 4C7.76667 4 7.15 4.20417 6.65 4.6125C6.15 5.02083 5.8 5.51667 5.6 6.1L7 6.65C7.08333 6.36667 7.24167 6.0875 7.475 5.8125C7.70833 5.5375 8.05 5.4 8.5 5.4C8.95 5.4 9.2875 5.525 9.5125 5.775C9.7375 6.025 9.85 h6C9.85 6.6 9.85 6.88333 9.76667 7.1375 9.6 7.3625C9.43333 7.5875 9.23333 7.81667 9 8.05C8.41667 8.55 8.0625 8.94583 7.9375 9.2375C7.8125 9.52917 7.75 10.05 7.75 10.8V10.8M8.5 9.175V9.175V9.175V9.175V9.175V9.175V9.175V9.175V9.175V9.175V9.175V9.175" />
                        </svg>
                    </span>
                    Kontak
                </Link>

                <hr className="border-gray-100 my-2" />

                <Link
                    href="/daftar"
                    onClick={() => setOpen(false)}
                    className="bg-[#025EDB] text-white rounded-2xl py-3.5 text-center font-bold tracking-wider uppercase shadow-md shadow-[#025EDB]/10 hover:bg-[#004BCA] hover:shadow-lg active:scale-95 transition-all duration-300 block"
                >
                    Daftar
                </Link>
            </div>
        </div>
    );
};

export default Nav;
