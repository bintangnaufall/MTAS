import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import ConfirmModal from './ConfirmModal';

export default function Sidebar({ activeNav = 'Dashboard', setActiveNav, mobileMenuOpen, setMobileMenuOpen, handleLogout, pendingRegistrations = 0 }) {
    const isDashboard = activeNav === 'Dashboard';
    const isPendaftaran = activeNav === 'Pendaftaran' || activeNav === 'Pendaftaran Santri' || activeNav === 'PPDB' || activeNav === 'Pendaftaran Management';
    const isSantri = activeNav === 'Santri Management' || activeNav === 'Santri' || activeNav === 'Manajemen Santri';
    const isNews = activeNav === 'News/Articles' || activeNav === 'Berita';
    const isGallery = activeNav === 'Galeri' || activeNav === 'Gallery' || activeNav === 'Manajemen Galeri';
    const isPesan = activeNav === 'Pesan' || activeNav === 'Pesan Masuk' || activeNav === 'Kontak' || activeNav === 'Monitoring Pesan';
    const isServices = activeNav === 'Services' || activeNav === 'Layanan' || activeNav === 'Konten Web' || activeNav === 'Layanan & Konten Web';
    const isAccount = activeNav === 'Manajemen Akun' || activeNav === 'Akun' || activeNav === 'Users' || activeNav === 'User Management';
    const isSettings = activeNav === 'Pengaturan Akun' || activeNav === 'Pengaturan' || activeNav === 'Settings' || activeNav === 'Profile' || activeNav === 'Profil';

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleNavClick = (navName) => {
        if (setActiveNav) {
            setActiveNav(navName);
        }
        if (setMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    };

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        if (typeof handleLogout === 'function') {
            handleLogout();
        } else {
            router.post(typeof route !== 'undefined' ? route('logout') : '/logout');
        }
    };

    return (
        <>
            <aside className={`
                w-[280px] h-screen sticky top-0 left-0 border-r border-outline-variant bg-surface-container-lowest flex flex-col p-stack-md space-y-2 shrink-0 z-30
                transition-transform duration-300 md:translate-x-0
                ${mobileMenuOpen ? 'translate-x-0 fixed inset-y-0 shadow-2xl' : '-translate-x-full md:relative'}
            `}>
                {/* Brand Area */}
                <div className="mb-6 mt-1 px-3 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <img
                            src="/images/YBAD_logo.png"
                            alt="Logo Yayasan Bhakti Arumi Delangga"
                            className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
                        />
                        <div>
                            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight leading-tight">
                                Bhakti Arumi
                            </h1>
                            <p className="font-label-sm text-label-sm text-outline">
                                Islamic Foundation Admin
                            </p>
                        </div>
                    </Link>

                    {/* Mobile close button */}
                    <button 
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className="md:hidden p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
                        title="Tutup Menu"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col space-y-1 overflow-y-auto pr-1">
                    {/* Dashboard */}
                    {setActiveNav ? (
                        <button
                            onClick={() => handleNavClick('Dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left cursor-pointer ${
                                isDashboard
                                    ? 'bg-primary-container text-white font-bold shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                            }`}
                        >
                            <span className={`material-symbols-outlined ${isDashboard ? 'fill text-white' : 'text-on-surface-variant'}`}>
                                dashboard
                            </span>
                            <span>Dashboard</span>
                        </button>
                    ) : (
                        <Link
                            href="/admin/dashboard"
                            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                                isDashboard
                                    ? 'bg-primary-container text-white font-bold shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                            }`}
                        >
                            <span className={`material-symbols-outlined ${isDashboard ? 'fill text-white' : 'text-on-surface-variant'}`}>
                                dashboard
                            </span>
                            <span>Dashboard</span>
                        </Link>
                    )}

                    {/* Pendaftaran Santri */}
                    <Link
                        href="/admin/pendaftaran"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isPendaftaran
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined ${isPendaftaran ? 'fill text-white' : 'text-on-surface-variant'}`}>
                                how_to_reg
                            </span>
                            <span>Pendaftaran Santri</span>
                        </div>
                        {pendingRegistrations > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPendaftaran ? 'bg-white text-primary' : 'bg-amber-500 text-white animate-pulse'
                            }`}>
                                {pendingRegistrations}
                            </span>
                        )}
                    </Link>

                    {/* Santri Management */}
                    <Link
                        href="/admin/santri"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isSantri
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isSantri ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            group
                        </span>
                        <span>Santri Management</span>
                    </Link>

                    {/* News/Articles */}
                    <Link
                        href="/admin/berita"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isNews
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isNews ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            newspaper
                        </span>
                        <span>News/Articles</span>
                    </Link>

                    {/* Galeri Yayasan */}
                    <Link
                        href="/admin/galeri"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isGallery
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isGallery ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            photo_library
                        </span>
                        <span>Galeri Foto &amp; Video</span>
                    </Link>

                    {/* Pesan Masuk & Monitoring Kontak */}
                    <Link
                        href="/admin/pesan"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isPesan
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isPesan ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            mark_chat_unread
                        </span>
                        <span>Pesan Masuk</span>
                    </Link>

                    {/* Services & CMS Konten Web */}
                    <Link
                        href="/admin/services"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isServices
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isServices ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            settings_suggest
                        </span>
                        <span>Layanan &amp; Konten Web</span>
                    </Link>

                    {/* Divider Menu Sistem */}
                    <div className="pt-2 pb-1 px-3">
                        <span className="text-[10px] font-bold text-outline/70 uppercase tracking-wider">
                            Akun &amp; Pengaturan
                        </span>
                    </div>

                    {/* Manajemen Akun */}
                    <Link
                        href="/admin/akun"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isAccount
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isAccount ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            manage_accounts
                        </span>
                        <span>Manajemen Akun</span>
                    </Link>

                    {/* Pengaturan Akun Saya */}
                    <Link
                        href="/admin/pengaturan-akun"
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${
                            isSettings
                                ? 'bg-primary-container text-white font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high scale-[0.98] hover:scale-100 transition-transform'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isSettings ? 'fill text-white' : 'text-on-surface-variant'}`}>
                            account_circle
                        </span>
                        <span>Pengaturan Akun</span>
                    </Link>
                </div>

                {/* Bottom Logout Area */}
                <div className="mt-auto pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-outline hover:text-error hover:bg-error-container/20 transition-all rounded-xl font-label-md text-label-md text-left cursor-pointer"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div 
                    onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm"
                />
            )}

            {/* Modal Konfirmasi Logout */}
            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin keluar dari Admin Console? Sesi aktif Anda saat ini akan diakhiri."
                confirmText="Ya, Keluar"
                cancelText="Batal"
                variant="danger"
                icon="logout"
                isLoading={isLoggingOut}
            />
        </>
    );
}