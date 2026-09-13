import React, { useState, useEffect } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import ConfirmModal from './ConfirmModal';

export default function TopBar({ 
    user, 
    searchQuery = '', 
    setSearchQuery, 
    searchPlaceholder = "Cari data, santri...",
    setMobileMenuOpen, 
    showNotificationDropdown, 
    setShowNotificationDropdown, 
    showUserDropdown, 
    setShowUserDropdown, 
    notificationList, 
    setNotificationList, 
    handleLogout,
    setActiveNav
}) {
    const { auth = {}, adminNotifications = [] } = usePage().props;
    const currentUser = user || auth?.user;

    // Internal fallbacks for dropdowns and notifications if not provided by parent
    const [localShowNotif, setLocalShowNotif] = useState(false);
    const [localShowUser, setLocalShowUser] = useState(false);
    const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'unread'
    const [topAvatarError, setTopAvatarError] = useState(false);
    const [dropdownAvatarError, setDropdownAvatarError] = useState(false);

    useEffect(() => {
        setTopAvatarError(false);
        setDropdownAvatarError(false);
    }, [currentUser?.avatar]);

    // Initialize notifications from Inertia shared adminNotifications or prop fallback to empty array
    const [notifs, setNotifs] = useState(() => {
        if (Array.isArray(notificationList)) return notificationList;
        if (Array.isArray(adminNotifications)) return adminNotifications;
        return [];
    });

    // Sync with shared adminNotifications if they change
    useEffect(() => {
        if (Array.isArray(notificationList)) {
            setNotifs(notificationList);
        } else if (Array.isArray(adminNotifications)) {
            setNotifs(adminNotifications);
        }
    }, [notificationList, adminNotifications]);

    const isNotifOpen = showNotificationDropdown !== undefined ? showNotificationDropdown : localShowNotif;
    const setIsNotifOpen = setShowNotificationDropdown || setLocalShowNotif;

    const isUserOpen = showUserDropdown !== undefined ? showUserDropdown : localShowUser;
    const setIsUserOpen = setShowUserDropdown || setLocalShowUser;

    const unreadCount = notifs.filter(n => n.unread).length;

    const filteredNotifs = notifs.filter(n => {
        if (notifFilter === 'unread') return n.unread;
        return true;
    });

    const handleMarkAllAsRead = (e) => {
        e?.stopPropagation();
        const updated = notifs.map(n => ({ ...n, unread: false }));
        setNotifs(updated);
        if (setNotificationList) setNotificationList(updated);

        // Sync to backend
        router.post('/admin/notifications/mark-all-read', {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['adminNotifications']
        });
    };

    const handleClearAll = (e) => {
        e?.stopPropagation();
        setNotifs([]);
        if (setNotificationList) setNotificationList([]);

        // Sync to backend
        router.post('/admin/notifications/clear-all', {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['adminNotifications']
        });
    };

    const handleDismissItem = (e, item) => {
        e?.stopPropagation();
        const updated = notifs.filter(n => n.id !== item.id);
        setNotifs(updated);
        if (setNotificationList) setNotificationList(updated);

        // Sync to backend
        router.post(`/admin/notifications/dismiss/${encodeURIComponent(item.id)}`, {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['adminNotifications']
        });
    };

    const handleNotifClick = (item) => {
        // Mark this specific notification as read in UI
        const updated = notifs.map(n => n.id === item.id ? { ...n, unread: false } : n);
        setNotifs(updated);
        if (setNotificationList) setNotificationList(updated);
        setIsNotifOpen(false);

        // Sync to backend then navigate
        router.post(`/admin/notifications/mark-read/${encodeURIComponent(item.id)}`, {}, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                if (item.url) {
                    router.visit(item.url);
                }
            }
        });
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const triggerLogoutModal = (e) => {
        e?.preventDefault();
        setIsUserOpen(false);
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        if (typeof handleLogout === 'function') {
            handleLogout();
        } else {
            router.post(typeof route !== 'undefined' ? route('logout') : '/logout');
        }
    };

    const handleAccountSettings = () => {
        setIsUserOpen(false);
        router.visit('/admin/pengaturan-akun');
    };

    return (
        <header className="flex justify-between items-center h-16 px-4 md:px-margin-desktop w-full border-b border-outline-variant bg-surface shrink-0 z-20 transition-all duration-200">
            {/* Left Side: Mobile Menu Button & Product Title */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}
                    className="md:hidden p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
                    title="Buka Menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface truncate hidden lg:block">
                    Yayasan Bhakti Arumi Delangga
                </h2>

                {/* Search Bar */}
                <div className="relative w-full max-w-xs md:max-w-md">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/60"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery && setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Right Side: Trailing Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-3 relative">
                
                {/* 🔔 Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen);
                            setIsUserOpen(false);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative cursor-pointer border ${
                            isNotifOpen 
                                ? 'bg-primary/10 text-primary border-primary/40' 
                                : 'text-outline hover:text-primary hover:bg-surface-container-high border-outline-variant/60'
                        }`}
                        title="Pemberitahuan Sistem & Transaksi"
                    >
                        <span className={`material-symbols-outlined ${unreadCount > 0 ? 'animate-wiggle' : ''}`}>
                            notifications
                        </span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white font-sans text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-surface animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Menu */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden font-sans">
                            {/* Dropdown Header */}
                            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col gap-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-headline text-sm font-bold text-on-surface">Pemberitahuan Sistem</span>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-error text-white font-sans text-[10px] font-bold">
                                                {unreadCount} Baru
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs text-primary font-sans font-semibold hover:underline cursor-pointer"
                                        >
                                            Tandai Semua Dibaca
                                        </button>
                                    )}
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex bg-surface-container-high/60 p-1 rounded-lg border border-outline-variant/60 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setNotifFilter('all')}
                                        className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer text-center ${
                                            notifFilter === 'all'
                                                ? 'bg-white text-primary shadow-2xs font-bold'
                                                : 'text-outline hover:text-on-surface'
                                        }`}
                                    >
                                        Semua ({notifs.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotifFilter('unread')}
                                        className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer text-center ${
                                            notifFilter === 'unread'
                                                ? 'bg-white text-primary shadow-2xs font-bold'
                                                : 'text-outline hover:text-on-surface'
                                        }`}
                                    >
                                        Belum Dibaca ({unreadCount})
                                    </button>
                                </div>
                            </div>

                            {/* Notification Items List */}
                            <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/40">
                                {filteredNotifs.length > 0 ? (
                                    filteredNotifs.map((item) => {
                                        const isUnread = item.unread;
                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => handleNotifClick(item)}
                                                className={`p-3.5 flex gap-3 hover:bg-surface-container-low transition-colors cursor-pointer group ${
                                                    isUnread ? 'bg-primary/5' : 'bg-surface-container-lowest'
                                                }`}
                                            >
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                    item.type === 'error' ? 'bg-red-50 text-red-600' :
                                                    item.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                    item.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {item.icon || 'notifications'}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            {item.category && (
                                                                <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-outline text-[9px] font-semibold uppercase">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                            <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-on-surface' : 'font-medium text-slate-700'}`}>
                                                                {item.title}
                                                            </h4>
                                                        </div>
                                                        <span className="text-[10px] text-outline shrink-0">{item.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                                                        {item.desc}
                                                    </p>
                                                </div>

                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center"></span>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-outline space-y-2">
                                        <span className="material-symbols-outlined text-4xl text-outline/60">
                                            notifications_off
                                        </span>
                                        <p className="text-xs font-semibold text-on-surface">
                                            {notifFilter === 'unread' ? 'Semua notifikasi sudah dibaca' : 'Tidak ada pemberitahuan baru'}
                                        </p>
                                        <p className="text-[11px] text-outline">
                                            Aktivitas pendaftaran dan pesan baru akan muncul di sini.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown Footer */}
                            <div className="p-2.5 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between text-xs">
                                <Link
                                    href="/admin/pendaftaran"
                                    onClick={() => setIsNotifOpen(false)}
                                    className="text-[11px] font-semibold text-primary hover:underline"
                                >
                                    Lihat Semua Pendaftaran &rarr;
                                </Link>
                                <Link
                                    href="/admin/pesan"
                                    onClick={() => setIsNotifOpen(false)}
                                    className="text-[11px] font-semibold text-primary hover:underline"
                                >
                                    Lihat Pesan Masuk &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Button */}
                <button
                    onClick={() => alert('Pusat Bantuan Yayasan Bhakti Arumi: Hubungi IT Support di support@bhaktiarumi.org atau WhatsApp +62 812-3456-7890')}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/60"
                    title="Bantuan & Dukungan"
                >
                    <span className="material-symbols-outlined">help_outline</span>
                </button>

                <div className="h-8 w-px bg-outline-variant mx-1"></div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsUserOpen(!isUserOpen);
                            setIsNotifOpen(false);
                        }}
                        className="flex items-center gap-2.5 p-1 pr-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden shrink-0">
                            {currentUser?.avatar && !topAvatarError ? (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name || 'User'}
                                    className="w-full h-full object-cover"
                                    onError={() => setTopAvatarError(true)}
                                />
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">person</span>
                            )}
                        </div>
                        <div className="flex flex-col items-start hidden sm:flex">
                            <span className="font-sans text-xs text-on-surface font-semibold">
                                {currentUser?.name || 'Admin Utama'}
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
                    </button>

                    {isUserOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 py-2 font-sans">
                            <div className="px-4 py-2.5 border-b border-outline-variant flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden shrink-0">
                                    {currentUser?.avatar && !dropdownAvatarError ? (
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.name || 'User'}
                                            className="w-full h-full object-cover"
                                            onError={() => setDropdownAvatarError(true)}
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-sans text-xs font-bold text-on-surface truncate">{currentUser?.name || 'Admin Utama'}</p>
                                    <p className="text-[11px] text-outline truncate">{currentUser?.email || 'admin@bhaktiarumi.org'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleAccountSettings}
                                className="w-full px-4 py-2.5 text-left text-xs text-on-surface hover:bg-surface-container flex items-center gap-2.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px] text-outline">manage_accounts</span>
                                <span>Pengaturan Akun</span>
                            </button>
                            <button
                                type="button"
                                onClick={triggerLogoutModal}
                                className="w-full px-4 py-2.5 text-left text-xs text-error hover:bg-error-container/20 flex items-center gap-2.5 border-t border-outline-variant mt-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                <span>Keluar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
        </header>
    );
}