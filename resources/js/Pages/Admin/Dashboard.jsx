import React, { useState, useMemo } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Elements/Sidebar';
import TopBar from '@/Components/Elements/TopBar';

export default function Dashboard({ 
    auth, 
    stats = {}, 
    activities = [], 
    priorityAlerts = [], 
    weeklyData = [], 
    monthlyData = [],
    demographics = {},
    accounts = [], 
    notifications = [],
    pendingRegistrations = 0
}) {
    const user = auth?.user || { name: 'Admin Utama', email: 'admin@bhaktiarumi.org', role: 'Super Admin' };

    // Navigation state
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Filter & Dropdown states
    const [timeRange, setTimeRange] = useState('Hari Ini');
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [chartMode, setChartMode] = useState('tren'); // 'tren' | 'distribusi'
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    // Dynamic stats with robust fallbacks
    const dashboardStats = {
        totalSantri: stats?.totalSantri ?? 128,
        activeSantri: stats?.activeSantri ?? 128,
        santriTuli: stats?.santriTuli ?? 64,
        santriAutis: stats?.santriAutis ?? 42,
        totalPendaftaran: stats?.totalPendaftaran ?? 0,
        pendingPendaftaran: stats?.pendingPendaftaran ?? pendingRegistrations ?? 0,
        pendaftaranTahunIni: stats?.pendaftaranTahunIni ?? 24,
        totalBerita: stats?.totalBerita ?? 9,
        publishedBerita: stats?.publishedBerita ?? 9,
        draftBerita: stats?.draftBerita ?? 0,
        totalGaleri: stats?.totalGaleri ?? 10,
        publishedGaleri: stats?.publishedGaleri ?? 10,
        totalPesan: stats?.totalPesan ?? 10,
        unreadPesan: stats?.unreadPesan ?? 0,
        totalPengajar: stats?.totalPengajar ?? 18,
        totalAkun: stats?.totalAkun ?? 5,
    };

    // Default notifications if empty
    const defaultNotifs = [
        {
            id: 1,
            type: 'error',
            icon: 'how_to_reg',
            title: 'Verifikasi Pendaftaran',
            desc: `Terdapat ${dashboardStats.pendingPendaftaran} data pendaftaran calon santri baru yang memerlukan verifikasi.`,
            time: 'Baru saja',
            unread: dashboardStats.pendingPendaftaran > 0
        },
        {
            id: 2,
            type: 'info',
            icon: 'mark_email_unread',
            title: 'Pesan Masuk Baru',
            desc: `Terdapat ${dashboardStats.unreadPesan} pesan pertanyaan kontak yang belum dibalas.`,
            time: '10m lalu',
            unread: dashboardStats.unreadPesan > 0
        },
        {
            id: 3,
            type: 'info',
            icon: 'verified',
            title: 'Sinkronisasi Santri Selesai',
            desc: 'Pangkalan data santri MTAS telah diperbarui dengan NIS resmi.',
            time: '1j lalu',
            unread: false
        }
    ];

    const [notificationList, setNotificationList] = useState(
        notifications && notifications.length > 0 ? notifications : defaultNotifs
    );

    // Monthly registration & admissions data
    const defaultMonthlyData = [
        { month: 'Jan', monthNum: 1, pendaftar: 2, diterima: 2 },
        { month: 'Feb', monthNum: 2, pendaftar: 3, diterima: 2 },
        { month: 'Mar', monthNum: 3, pendaftar: 4, diterima: 3 },
        { month: 'Apr', monthNum: 4, pendaftar: 2, diterima: 2 },
        { month: 'Mei', monthNum: 5, pendaftar: 5, diterima: 4 },
        { month: 'Jun', monthNum: 6, pendaftar: 8, diterima: 7 },
        { month: 'Jul', monthNum: 7, pendaftar: 12, diterima: 10 },
        { month: 'Agu', monthNum: 8, pendaftar: 6, diterima: 5 },
        { month: 'Sep', monthNum: 9, pendaftar: 3, diterima: 3 },
        { month: 'Okt', monthNum: 10, pendaftar: 2, diterima: 2 },
        { month: 'Nov', monthNum: 11, pendaftar: 1, diterima: 1 },
        { month: 'Des', monthNum: 12, pendaftar: 2, diterima: 1 },
    ];

    const chartMonthlyData = monthlyData && monthlyData.length > 0 ? monthlyData : defaultMonthlyData;
    
    // Calculate max value for scaling histogram heights
    const maxMonthlyVal = useMemo(() => {
        const highest = Math.max(...chartMonthlyData.map(d => Math.max(d.pendaftar || 0, d.diterima || 0)), 1);
        return Math.max(highest, 6);
    }, [chartMonthlyData]);

    const currentMonthNum = new Date().getMonth() + 1;
    const [activeMonthHover, setActiveMonthHover] = useState(
        chartMonthlyData.find(m => m.monthNum === currentMonthNum) || chartMonthlyData[chartMonthlyData.length - 1] || chartMonthlyData[0]
    );

    const demographicData = {
        totalSantri: demographics?.totalSantri ?? dashboardStats.totalSantri ?? 12,
        santriTuli: demographics?.santriTuli ?? dashboardStats.santriTuli ?? 7,
        santriAutis: demographics?.santriAutis ?? dashboardStats.santriAutis ?? 5,
        santriLaki: demographics?.santriLaki ?? 7,
        santriPerempuan: demographics?.santriPerempuan ?? 5,
        totalPendaftaran: demographics?.totalPendaftaran ?? dashboardStats.totalPendaftaran ?? 3,
        pendaftaranLulus: demographics?.pendaftaranLulus ?? 2,
        pendaftaranPending: demographics?.pendaftaranPending ?? dashboardStats.pendingPendaftaran ?? 1,
        berkasLengkap: demographics?.berkasLengkap ?? 2,
        conversionRate: demographics?.conversionRate ?? 85.0,
    };

    const tuliPercent = demographicData.totalSantri > 0 ? Math.round((demographicData.santriTuli / demographicData.totalSantri) * 100) : 58;
    const autisPercent = 100 - tuliPercent;
    const lakiPercent = demographicData.totalSantri > 0 ? Math.round((demographicData.santriLaki / demographicData.totalSantri) * 100) : 58;
    const perempuanPercent = 100 - lakiPercent;
    const berkasPercent = demographicData.totalPendaftaran > 0 ? Math.round((demographicData.berkasLengkap / demographicData.totalPendaftaran) * 100) : 67;

    const totalPendaftarYear = useMemo(() => {
        return chartMonthlyData.reduce((acc, curr) => acc + (curr.pendaftar || 0), 0);
    }, [chartMonthlyData]);

    const totalDiterimaYear = useMemo(() => {
        return chartMonthlyData.reduce((acc, curr) => acc + (curr.diterima || 0), 0);
    }, [chartMonthlyData]);

    // Activities list
    const initialActivities = activities && activities.length > 0 ? activities : [
        {
            id: 1,
            module: 'Pendaftaran',
            icon: 'how_to_reg',
            action: 'Verifikasi Dokumen Santri Baru',
            user: 'Admin Utama',
            time: '10:42 AM, Hari ini',
            status: 'Selesai',
            statusType: 'success',
            details: 'Kelengkapan formulir pendaftaran santri reguler tahfidz 2026/2027 telah diverifikasi & disetujui.'
        },
        {
            id: 2,
            module: 'Berita',
            icon: 'newspaper',
            action: 'Publikasi: Kegiatan Ramadhan',
            user: 'Ustadz Hasan',
            time: '09:15 AM, Hari ini',
            status: 'Diproses',
            statusType: 'pending',
            details: 'Draft artikel kegiatan pesantren kilat Ramadhan 1447H telah diajukan untuk proses peninjauan editor.'
        },
        {
            id: 3,
            module: 'Santri',
            icon: 'group',
            action: 'Update Profil Perkembangan Santri',
            user: 'Admin Akademik',
            time: 'Kemarin, 16:30 PM',
            status: 'Selesai',
            statusType: 'success',
            details: 'Pendaftaran santri baru Maktab Tuli telah diverifikasi dan dimasukkan ke Kelas A.'
        },
        {
            id: 4,
            module: 'Pesan Masuk',
            icon: 'mail',
            action: 'Tindak Lanjut Pertanyaan Wali',
            user: 'Staff Pengurus',
            time: 'Kemarin, 14:10 PM',
            status: 'Selesai',
            statusType: 'success',
            details: 'Menjawab pertanyaan wali santri mengenai kurikulum tahfidz isyarat dan biaya pendaftaran.'
        },
        {
            id: 5,
            module: 'Akun',
            icon: 'manage_accounts',
            action: 'Pembaruan Hak Akses Editor',
            user: 'Admin Utama',
            time: '15 Agu, 11:20 AM',
            status: 'Selesai',
            statusType: 'success',
            details: 'Sinkronisasi hak akses editor konten untuk publikasi berita yayasan.'
        }
    ];

    // Priority alerts list
    const alertsList = priorityAlerts && priorityAlerts.length > 0 ? priorityAlerts : [
        {
            id: 'alert_1',
            type: 'error',
            icon: 'how_to_reg',
            title: 'Verifikasi Pendaftaran Tertunda',
            desc: `Terdapat data pendaftaran calon santri baru yang menunggu verifikasi admin.`,
            actionText: 'TINJAU PENDAFTARAN',
            actionUrl: '/admin/pendaftaran'
        },
        {
            id: 'alert_2',
            type: 'info',
            icon: 'school',
            title: 'Pembaruan Modul Santri',
            desc: 'Pangkalan data santri MTAS & cetak kartu digital aktif tersinkronisasi.',
            actionText: 'KELOLA SANTRI',
            actionUrl: '/admin/santri'
        },
        {
            id: 'alert_3',
            type: 'warning',
            icon: 'campaign',
            title: 'Pesan & Pertanyaan Masuk',
            desc: 'Konsultasi formulir kontak website siap ditanggapi oleh admin/pengurus.',
            actionText: 'BUKA PESAN',
            actionUrl: '/admin/pesan'
        }
    ];

    // Filtered activities based on search
    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return initialActivities;
        const q = searchQuery.toLowerCase();
        return initialActivities.filter(
            a => a.module.toLowerCase().includes(q) ||
                 a.action.toLowerCase().includes(q) ||
                 a.user.toLowerCase().includes(q) ||
                 a.status.toLowerCase().includes(q)
        );
    }, [initialActivities, searchQuery]);

    // Handle logout
    const handleLogout = (e) => {
        e?.preventDefault?.();
        router.post(typeof route !== 'undefined' ? route('logout') : '/logout');
    };

    return (
        <>
            <Head title="Iktisar Dashboard - Bhakti Arumi Admin" />

            <div className="bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
                
                {/* ---------------- SIDENAVBAR (Shared Component) ---------------- */}
                <Sidebar 
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                    pendingRegistrations={dashboardStats.pendingPendaftaran}
                />

                {/* ---------------- MAIN CONTENT CANVAS ---------------- */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    
                    <TopBar 
                        user={user}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Cari data, santri, aktivitas..."
                        setMobileMenuOpen={setMobileMenuOpen}
                        showNotificationDropdown={showNotificationDropdown}
                        setShowNotificationDropdown={setShowNotificationDropdown}
                        showUserDropdown={showUserDropdown}
                        setShowUserDropdown={setShowUserDropdown}
                        notificationList={notificationList}
                        setNotificationList={setNotificationList}
                        handleLogout={handleLogout}
                        setActiveNav={setActiveNav}
                    />

                    {/* ---------------- MAIN DASHBOARD CONTENT ---------------- */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-margin-desktop bg-surface">
                        
                        {/* VIEW 1: IKTISAR DASHBOARD (Default) */}
                        {activeNav === 'Dashboard' && (
                            <div className="max-w-container-max mx-auto space-y-gutter">
                                
                                {/* Page Header */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Sistem Online &amp; Terhubung
                                            </span>
                                            <span className="text-xs text-outline hidden sm:inline">•</span>
                                            <span className="text-xs text-outline hidden sm:inline">Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}</span>
                                        </div>
                                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                                            Iktisar Dashboard
                                        </h1>
                                        <p className="font-body-md text-body-md text-outline">
                                            Ringkasan statistik santri, pendaftaran PPDB, berita, dan monitoring aktivitas yayasan.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 relative">
                                        
                                        {/* Date Filter Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                                                className="h-10 px-4 flex items-center gap-2 border border-outline-variant bg-surface-container-lowest rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
                                                <span>{timeRange}</span>
                                                <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
                                            </button>

                                            {showTimeDropdown && (
                                                <div className="absolute right-0 mt-1.5 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-30 py-1">
                                                    {['Hari Ini', '7 Hari Terakhir', 'Bulan Ini', 'Tahun Ini'].map((range) => (
                                                        <button
                                                            key={range}
                                                            onClick={() => {
                                                                setTimeRange(range);
                                                                setShowTimeDropdown(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left font-label-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                                                timeRange === range ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
                                                            }`}
                                                        >
                                                            <span>{range}</span>
                                                            {timeRange === range && (
                                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Download Report Button */}
                                        <button
                                            onClick={() => setShowReportModal(true)}
                                            className="h-10 px-4 bg-primary hover:bg-primary-container text-white font-label-md text-sm rounded-lg transition-all flex items-center gap-2 shadow-xs hover:shadow-md active:scale-95 whitespace-nowrap cursor-pointer shrink-0 font-bold"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                            <span>Unduh Laporan</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Statistical Bento Grid (4 Cards) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                                     
                                     {/* Stat Card 1: Total Santri */}
                                     <Link 
                                         href="/admin/santri"
                                         className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/40 transition-all group cursor-pointer"
                                     >
                                         <div className="flex justify-between items-start mb-4">
                                             <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
                                                 <span className="material-symbols-outlined text-primary text-2xl">group</span>
                                             </div>
                                             <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[11px] font-bold border border-emerald-200">
                                                 {dashboardStats.activeSantri} Aktif
                                             </span>
                                         </div>
                                         <div>
                                             <p className="font-label-md text-xs text-outline mb-1">Total Santri MTAS</p>
                                             <div className="flex items-baseline justify-between">
                                                 <h3 className="font-headline-lg text-2xl font-black text-on-surface">
                                                     {dashboardStats.totalSantri}
                                                 </h3>
                                                 <span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                     Detail <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                                 </span>
                                             </div>
                                             <div className="mt-2 text-[11px] text-outline flex items-center gap-2">
                                                 <span>Tuli: {dashboardStats.santriTuli}</span>
                                                 <span>•</span>
                                                 <span>Autis/Tahfidz: {dashboardStats.santriAutis}</span>
                                             </div>
                                         </div>
                                     </Link>

                                     {/* Stat Card 2: Pendaftaran Santri Baru */}
                                     <Link 
                                         href="/admin/pendaftaran"
                                         className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#D38B1D]/40 transition-all group cursor-pointer"
                                     >
                                         <div className="flex justify-between items-start mb-4">
                                             <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                 <span className="material-symbols-outlined text-[#D38B1D] text-2xl">how_to_reg</span>
                                             </div>
                                             {dashboardStats.pendingPendaftaran > 0 ? (
                                                 <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D38B1D] font-label-sm text-[11px] font-bold border border-amber-200 animate-pulse">
                                                     {dashboardStats.pendingPendaftaran} Menunggu
                                                 </span>
                                             ) : (
                                                 <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[11px] font-bold border border-emerald-200">
                                                     Terverifikasi
                                                 </span>
                                             )}
                                         </div>
                                         <div>
                                             <p className="font-label-md text-xs text-outline mb-1">Pendaftaran Santri Baru</p>
                                             <div className="flex items-baseline justify-between">
                                                 <h3 className="font-headline-lg text-2xl font-black text-[#D38B1D]">
                                                     {dashboardStats.pendaftaranTahunIni}
                                                 </h3>
                                                 <span className="text-xs text-[#D38B1D] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                     Verifikasi <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                                 </span>
                                             </div>
                                             <p className="mt-2 text-[11px] text-outline">
                                                 Total Form Masuk: {dashboardStats.totalPendaftaran} calon santri
                                             </p>
                                         </div>
                                     </Link>

                                     {/* Stat Card 3: Berita & Publikasi */}
                                     <Link 
                                         href="/admin/berita"
                                         className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#025EDB]/40 transition-all group cursor-pointer"
                                     >
                                         <div className="flex justify-between items-start mb-4">
                                             <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                 <span className="material-symbols-outlined text-[#025EDB] text-2xl">newspaper</span>
                                             </div>
                                             <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#025EDB] font-label-sm text-[11px] font-bold border border-blue-200">
                                                 {dashboardStats.publishedBerita} Published
                                             </span>
                                         </div>
                                         <div>
                                             <p className="font-label-md text-xs text-outline mb-1">Berita &amp; Artikel</p>
                                             <div className="flex items-baseline justify-between">
                                                 <h3 className="font-headline-lg text-2xl font-black text-on-surface">
                                                     {dashboardStats.totalBerita}
                                                 </h3>
                                                 <span className="text-xs text-[#025EDB] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                     Kelola <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                                 </span>
                                             </div>
                                             <p className="mt-2 text-[11px] text-outline">
                                                 Galeri Media: {dashboardStats.totalGaleri} Foto &amp; Video
                                             </p>
                                         </div>
                                     </Link>

                                     {/* Stat Card 4: Pesan & Tenaga Pendidik */}
                                     <Link 
                                         href="/admin/pesan"
                                         className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-emerald-600/40 transition-all group cursor-pointer"
                                     >
                                         <div className="flex justify-between items-start mb-4">
                                             <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                 <span className="material-symbols-outlined text-emerald-700 text-2xl">mark_chat_unread</span>
                                             </div>
                                             {dashboardStats.unreadPesan > 0 ? (
                                                 <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-label-sm text-[11px] font-bold border border-red-200 animate-pulse">
                                                     {dashboardStats.unreadPesan} Pesan Baru
                                                 </span>
                                             ) : (
                                                 <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[11px] font-bold border border-emerald-200">
                                                     {dashboardStats.totalPesan} Pesan Masuk
                                                 </span>
                                             )}
                                         </div>
                                         <div>
                                             <p className="font-label-md text-xs text-outline mb-1">Pesan &amp; Pengurus</p>
                                             <div className="flex items-baseline justify-between">
                                                 <h3 className="font-headline-lg text-2xl font-black text-on-surface">
                                                     {dashboardStats.totalPengajar} Ustadz/ah
                                                 </h3>
                                                 <span className="text-xs text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                     Buka Pesan <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                                 </span>
                                             </div>
                                             <p className="mt-2 text-[11px] text-outline">
                                                 {dashboardStats.totalAkun} Pengguna Admin Aktif
                                             </p>
                                         </div>
                                     </Link>
                                </div>

                                {/* Middle Section: Interactive Charts & Priority Alerts */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                                    
                                    {/* Main Chart Area (2 Columns) */}
                                    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col shadow-xs font-sans">
                                        {/* Card Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <span className="material-symbols-outlined text-[22px]">query_stats</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">
                                                        Analisis Pendaftaran &amp; Pertumbuhan Santri
                                                    </h3>
                                                    <p className="font-sans text-xs text-outline mt-0.5">
                                                        Tren pendaftaran bulanan dan persebaran program santri tahun {new Date().getFullYear()}.
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex bg-surface-container-high/80 p-1 rounded-xl border border-outline-variant/60 shadow-2xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setChartMode('tren')}
                                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                                                            chartMode === 'tren'
                                                                ? 'bg-primary text-white shadow-xs'
                                                                : 'text-outline hover:text-on-surface hover:bg-white/50'
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                                        <span>Tren Bulanan</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setChartMode('distribusi')}
                                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                                                            chartMode === 'distribusi'
                                                                ? 'bg-primary text-white shadow-xs'
                                                                : 'text-outline hover:text-on-surface hover:bg-white/50'
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                                                        <span>Distribusi Santri</span>
                                                    </button>
                                                </div>
                                                
                                                <Link 
                                                    href="/admin/pendaftaran"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all whitespace-nowrap"
                                                >
                                                    <span>Pendaftaran</span>
                                                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Chart Visualization Area */}
                                        <div className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant/80 p-4 min-h-[300px] flex flex-col justify-between relative overflow-hidden group">
                                            
                                            {/* Blueprint Grid Pattern */}
                                            <div 
                                                className="absolute inset-0 opacity-15 pointer-events-none" 
                                                style={{
                                                    backgroundImage: 'linear-gradient(to right, #c2c6d6 1px, transparent 1px), linear-gradient(to bottom, #c2c6d6 1px, transparent 1px)',
                                                    backgroundSize: '36px 36px'
                                                }}
                                            ></div>

                                            {chartMode === 'tren' ? (
                                                <>
                                                    {/* Chart Top Stat Badge */}
                                                    <div className="z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-sans pb-2 border-b border-outline-variant/30">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-3 h-3 rounded bg-primary shadow-xs"></span>
                                                                <span className="text-on-surface font-medium">Pendaftar Masuk</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-3 h-3 rounded bg-emerald-500 shadow-xs"></span>
                                                                <span className="text-on-surface font-medium">Diterima / Lulus</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-sans text-on-surface bg-white px-3.5 py-1 rounded-lg border border-outline-variant shadow-xs flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                            {activeMonthHover ? (
                                                                <span>
                                                                    <strong className="text-primary font-bold">{activeMonthHover.month}:</strong> {activeMonthHover.pendaftar} Pendaftar • <strong className="text-emerald-700 font-bold">{activeMonthHover.diterima} Diterima</strong>
                                                                    {activeMonthHover.pendaftar > 0 && (
                                                                        <span className="text-outline text-[11px] ml-1">
                                                                            ({Math.round((activeMonthHover.diterima / activeMonthHover.pendaftar) * 100)}% Kelulusan)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            ) : 'Arahkan kursor ke salah satu bulan'}
                                                        </div>
                                                    </div>

                                                    {/* Visual Histogram Bars Area */}
                                                    <div className="z-10 relative flex-1 flex flex-col justify-end pt-6 pb-1">
                                                        {/* Horizontal Guide Grid Lines */}
                                                        <div className="absolute inset-x-0 inset-y-6 flex flex-col justify-between pointer-events-none opacity-40">
                                                            <div className="border-b border-dashed border-outline-variant/70 flex justify-between text-[9px] text-outline px-1">
                                                                <span></span>
                                                                <span>{maxMonthlyVal} maks</span>
                                                            </div>
                                                            <div className="border-b border-dashed border-outline-variant/50 flex justify-between text-[9px] text-outline px-1">
                                                                <span></span>
                                                                <span>{Math.round(maxMonthlyVal / 2)}</span>
                                                            </div>
                                                            <div className="border-b border-outline-variant/40"></div>
                                                        </div>

                                                        {/* 12 Months Columns */}
                                                        <div className="grid grid-cols-12 gap-1 sm:gap-2 items-end h-44 z-10 px-1">
                                                            {chartMonthlyData.map((d) => {
                                                                const pendaftarHeight = `${Math.min(100, Math.max(8, (d.pendaftar / maxMonthlyVal) * 100))}%`;
                                                                const diterimaHeight = `${Math.min(100, Math.max(6, (d.diterima / maxMonthlyVal) * 100))}%`;
                                                                const isHovered = activeMonthHover?.monthNum === d.monthNum;
                                                                const isCurrent = d.monthNum === currentMonthNum;
                                                                return (
                                                                    <div 
                                                                        key={d.month} 
                                                                        onMouseEnter={() => setActiveMonthHover(d)}
                                                                        className={`flex flex-col items-center gap-2 cursor-pointer h-full justify-end rounded-xl transition-all p-1 group/col ${
                                                                            isHovered ? 'bg-primary/10 shadow-xs ring-1 ring-primary/20' : 'hover:bg-white/40'
                                                                        }`}
                                                                    >
                                                                        {/* Floating count badge on hover */}
                                                                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-0.5 relative">
                                                                            {/* Blue Bar: Pendaftar */}
                                                                            <div className="w-full max-w-[12px] sm:max-w-[16px] h-full flex items-end justify-center">
                                                                                <div 
                                                                                    style={{ height: d.pendaftar > 0 ? pendaftarHeight : '4px' }}
                                                                                    className={`w-full transition-all duration-300 rounded-t-md flex items-center justify-center ${
                                                                                        isHovered 
                                                                                            ? 'bg-primary shadow-md shadow-primary/30 scale-y-[1.02]' 
                                                                                            : d.pendaftar > 0 ? 'bg-primary/85 hover:bg-primary' : 'bg-outline-variant/30'
                                                                                    }`}
                                                                                    title={`${d.month}: ${d.pendaftar} Pendaftar`}
                                                                                ></div>
                                                                            </div>
                                                                            {/* Green Bar: Diterima */}
                                                                            <div className="w-full max-w-[12px] sm:max-w-[16px] h-full flex items-end justify-center">
                                                                                <div 
                                                                                    style={{ height: d.diterima > 0 ? diterimaHeight : '4px' }}
                                                                                    className={`w-full transition-all duration-300 rounded-t-md flex items-center justify-center ${
                                                                                        isHovered 
                                                                                            ? 'bg-emerald-600 shadow-md shadow-emerald-500/30 scale-y-[1.02]' 
                                                                                            : d.diterima > 0 ? 'bg-emerald-500/85 hover:bg-emerald-500' : 'bg-outline-variant/30'
                                                                                    }`}
                                                                                    title={`${d.month}: ${d.diterima} Diterima`}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Month Label */}
                                                                        <div className="flex items-center justify-center min-h-[22px]">
                                                                            {isCurrent ? (
                                                                                <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-2xs">
                                                                                    {d.month}
                                                                                </span>
                                                                            ) : (
                                                                                <span className={`text-[10px] sm:text-[11px] font-sans transition-colors ${
                                                                                    isHovered 
                                                                                        ? 'text-primary font-bold' 
                                                                                        : 'text-outline font-medium'
                                                                                }`}>
                                                                                    {d.month}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Chart Footer Indicator */}
                                                    <div className="z-10 flex flex-wrap items-center justify-between font-sans text-xs pt-2.5 border-t border-outline-variant/30 gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            <span className="text-[11px] font-medium text-outline">Database Pendaftaran &amp; Santri Terintegrasi Real-Time</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                                                                Tahun {new Date().getFullYear()}: <strong>{totalPendaftarYear} Pendaftar</strong>
                                                            </span>
                                                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                                                <strong>{totalDiterimaYear} Diterima</strong> ({totalPendaftarYear > 0 ? Math.round((totalDiterimaYear / totalPendaftarYear) * 100) : 100}% Rasio)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                /* Mode Distribusi Santri & Demografi */
                                                <div className="z-10 flex flex-col justify-between h-full gap-4 py-1 font-sans">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {/* Program Breakdown */}
                                                        <div className="bg-white/95 p-3.5 rounded-xl border border-outline-variant/80 shadow-2xs">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px] text-primary">sign_language</span>
                                                                    Program Maktab
                                                                </span>
                                                                <span className="text-[10px] text-outline font-medium">{demographicData.totalSantri} Santri</span>
                                                            </div>
                                                            <div className="space-y-2.5 mt-2">
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Maktab Tuli</span>
                                                                        <span className="font-bold text-primary">{demographicData.santriTuli} ({tuliPercent}%)</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${tuliPercent}%` }} className="bg-primary h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Maktab Autis &amp; Khusus</span>
                                                                        <span className="font-bold text-amber-600">{demographicData.santriAutis} ({autisPercent}%)</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${autisPercent}%` }} className="bg-amber-500 h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Gender Demographics */}
                                                        <div className="bg-white/95 p-3.5 rounded-xl border border-outline-variant/80 shadow-2xs">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px] text-indigo-600">wc</span>
                                                                    Jenis Kelamin
                                                                </span>
                                                                <span className="text-[10px] text-outline font-medium">Rasio Gender</span>
                                                            </div>
                                                            <div className="space-y-2.5 mt-2">
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Laki-laki</span>
                                                                        <span className="font-bold text-indigo-600">{demographicData.santriLaki} ({lakiPercent}%)</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${lakiPercent}%` }} className="bg-indigo-500 h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Perempuan</span>
                                                                        <span className="font-bold text-rose-600">{demographicData.santriPerempuan} ({perempuanPercent}%)</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${perempuanPercent}%` }} className="bg-rose-500 h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Dokumen & Kelulusan */}
                                                        <div className="bg-white/95 p-3.5 rounded-xl border border-outline-variant/80 shadow-2xs">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">folder_shared</span>
                                                                    Berkas &amp; Seleksi
                                                                </span>
                                                                <span className="text-[10px] text-outline font-medium">{demographicData.totalPendaftaran} Pendaftar</span>
                                                            </div>
                                                            <div className="space-y-2.5 mt-2">
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Berkas Lengkap</span>
                                                                        <span className="font-bold text-emerald-600">{demographicData.berkasLengkap} Berkas ({berkasPercent}%)</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${berkasPercent}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-on-surface font-medium">Menunggu Verifikasi</span>
                                                                        <span className="font-bold text-amber-600">{demographicData.pendaftaranPending} Pendaftar</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                                        <div style={{ width: `${demographicData.totalPendaftaran > 0 ? Math.round((demographicData.pendaftaranPending / demographicData.totalPendaftaran) * 100) : 0}%` }} className="bg-amber-500 h-full rounded-full transition-all duration-500"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Distribution Footer Navigation */}
                                                    <div className="flex flex-wrap items-center justify-between font-sans text-xs pt-2.5 border-t border-outline-variant/30 gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Link 
                                                                href="/admin/santri"
                                                                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-outline-variant shadow-2xs transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[15px]">badge</span>
                                                                Lihat Data Santri ({demographicData.totalSantri})
                                                            </Link>
                                                            <Link 
                                                                href="/admin/pendaftaran"
                                                                className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-outline-variant shadow-2xs transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                                                                Kelola Pendaftaran ({demographicData.totalPendaftaran})
                                                            </Link>
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                                                            Rasio Penerimaan: <strong>{demographicData.conversionRate}%</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Priority Alerts / Notifications (1 Column) */}
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col shadow-xs">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                                    Pemberitahuan Prioritas
                                                </h3>
                                                <p className="font-body-sm text-xs text-outline">
                                                    Item mendesak yang memerlukan tindakan.
                                                </p>
                                            </div>
                                            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                                        </div>

                                        <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto pr-1">
                                            {alertsList.map((alertItem, idx) => (
                                                <div 
                                                    key={alertItem.id || idx}
                                                    className={`flex gap-3.5 items-start p-3.5 rounded-xl border transition-all ${
                                                        alertItem.type === 'error'
                                                            ? 'border-error-container bg-error-container/20 hover:bg-error-container/30'
                                                            : alertItem.type === 'warning'
                                                            ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/50'
                                                            : 'border-primary-fixed bg-surface-container-low hover:bg-surface-container-high'
                                                    }`}
                                                >
                                                    <span className={`material-symbols-outlined shrink-0 text-[22px] mt-0.5 ${
                                                        alertItem.type === 'error' 
                                                            ? 'text-error' 
                                                            : alertItem.type === 'warning' 
                                                            ? 'text-[#D38B1D]' 
                                                            : 'text-primary'
                                                    }`}>
                                                        {alertItem.icon || 'info'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate">
                                                            {alertItem.title}
                                                        </h4>
                                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
                                                            {alertItem.desc}
                                                        </p>
                                                        {alertItem.actionUrl && (
                                                            <Link 
                                                                href={alertItem.actionUrl}
                                                                className={`mt-2 font-label-sm text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 hover:underline ${
                                                                    alertItem.type === 'error' ? 'text-error' : alertItem.type === 'warning' ? 'text-[#D38B1D]' : 'text-primary'
                                                                }`}
                                                            >
                                                                <span>{alertItem.actionText || 'TINJAU SEKARANG'}</span>
                                                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section: Aktivitas Sistem Terbaru (Data Table) */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col overflow-hidden shadow-xs">
                                    <div className="p-5 sm:p-6 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-xl">history</span>
                                            </div>
                                            <div>
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                                    Aktivitas &amp; Log Sistem Terbaru
                                                </h3>
                                                <p className="font-body-sm text-xs text-outline">
                                                    Sinkronisasi otomatis pendaftaran, data santri, berita, dan pesan.
                                                </p>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-[11px] font-semibold">
                                                {filteredActivities.length} entri
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => router.reload({ only: ['activities', 'stats'] })}
                                                className="h-9 px-3 border border-outline-variant rounded-lg flex items-center gap-1.5 hover:bg-surface-container-high transition-colors text-outline hover:text-on-surface font-label-md text-xs cursor-pointer"
                                                title="Segarkan Log"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">refresh</span>
                                                <span>Segarkan</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table Container */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-outline-variant bg-surface">
                                                    <th className="py-3.5 px-6 font-label-sm text-label-sm text-outline uppercase tracking-wider">Modul</th>
                                                    <th className="py-3.5 px-6 font-label-sm text-label-sm text-outline uppercase tracking-wider">Aktivitas</th>
                                                    <th className="py-3.5 px-6 font-label-sm text-label-sm text-outline uppercase tracking-wider">Oleh</th>
                                                    <th className="py-3.5 px-6 font-label-sm text-label-sm text-outline uppercase tracking-wider">Waktu</th>
                                                    <th className="py-3.5 px-6 font-label-sm text-label-sm text-outline uppercase tracking-wider">Status</th>
                                                    <th className="py-3.5 px-6 text-right font-label-sm text-label-sm text-outline uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant">
                                                {filteredActivities.map((act) => (
                                                    <tr 
                                                        key={act.id} 
                                                        onClick={() => setSelectedActivity(act)}
                                                        className="hover:bg-primary-fixed/30 transition-colors group cursor-pointer"
                                                    >
                                                        <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface font-medium whitespace-nowrap">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                                                                    {act.icon}
                                                                </span>
                                                                <span className="font-semibold">{act.module}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant font-medium">
                                                            {act.action}
                                                        </td>
                                                        <td className="py-4 px-6 font-body-sm text-body-sm text-outline whitespace-nowrap">
                                                            {act.user}
                                                        </td>
                                                        <td className="py-4 px-6 font-body-sm text-body-sm text-outline whitespace-nowrap">
                                                            {act.time}
                                                        </td>
                                                        <td className="py-4 px-6 whitespace-nowrap">
                                                            {act.statusType === 'success' && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-xs font-semibold">
                                                                    {act.status}
                                                                </span>
                                                            )}
                                                            {act.statusType === 'pending' && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-xs font-semibold">
                                                                    {act.status}
                                                                </span>
                                                            )}
                                                            {act.statusType === 'error' && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-label-sm text-xs font-semibold">
                                                                    {act.status}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedActivity(act);
                                                                }}
                                                                className="p-1 text-outline group-hover:text-primary transition-transform group-hover:translate-x-1"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {filteredActivities.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="py-8 text-center text-outline font-label-md text-xs">
                                                            Tidak ada aktivitas yang sesuai dengan pencarian "{searchQuery}".
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 2: SERVICES / PROGRAM YAYASAN */}
                        {activeNav === 'Services' && (
                            <div className="max-w-container-max mx-auto space-y-6">
                                <div>
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
                                        Layanan &amp; Program Yayasan
                                    </h1>
                                    <p className="font-body-md text-body-md text-outline">
                                        Konfigurasi layanan Maktab Tuli, Tahfidz Al-Qur'an, dan Program Kemandirian Santri.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-2xl">sign_language</span>
                                            </div>
                                            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Maktab Tuli Ar-Rumi</h3>
                                        </div>
                                        <p className="font-body-sm text-outline mb-4">
                                            Program pembelajaran Al-Qur'an & Isyarat Bahasa Al-Fatihah bagi santri tunarungu dengan metode visual inovatif.
                                        </p>
                                        <a href="/maktabtuli" target="_blank" rel="noreferrer" className="text-primary font-label-sm text-xs hover:underline flex items-center gap-1 font-bold">
                                            <span>Lihat Halaman Publik Maktab Tuli</span>
                                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                        </a>
                                    </div>
                                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                <span className="material-symbols-outlined text-2xl">self_improvement</span>
                                            </div>
                                            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Program Kemandirian Santri</h3>
                                        </div>
                                        <p className="font-body-sm text-outline mb-4">
                                            Pelatihan kemandirian, terapi sensori integrasi, dan pembinaan potensi santri istimewa menuju kemandirian beragama dan sosial.
                                        </p>
                                        <Link href="/admin/santri" className="text-primary font-label-sm text-xs hover:underline flex items-center gap-1 font-bold">
                                            <span>Kelola Data Santri</span>
                                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {/* ---------------- ACTIVITY DETAIL MODAL ---------------- */}
            {selectedActivity && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">{selectedActivity.icon}</span>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">Detail Aktivitas Sistem</h3>
                            </div>
                            <button 
                                onClick={() => setSelectedActivity(null)}
                                className="text-outline hover:text-on-surface cursor-pointer p-1 rounded-lg hover:bg-surface-container"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-3 font-body-sm text-xs">
                            <div>
                                <span className="font-label-sm text-outline block mb-0.5">Modul Sistem</span>
                                <span className="font-semibold text-on-surface text-sm">{selectedActivity.module}</span>
                            </div>
                            <div>
                                <span className="font-label-sm text-outline block mb-0.5">Aksi / Aktivitas</span>
                                <span className="text-on-surface font-medium">{selectedActivity.action}</span>
                            </div>
                            <div>
                                <span className="font-label-sm text-outline block mb-0.5">Eksekutor / Pencatat</span>
                                <span className="text-on-surface">{selectedActivity.user}</span>
                            </div>
                            <div>
                                <span className="font-label-sm text-outline block mb-0.5">Waktu Tercatat</span>
                                <span className="text-on-surface">{selectedActivity.time}</span>
                            </div>
                            <div>
                                <span className="font-label-sm text-outline block mb-0.5">Keterangan Lengkap</span>
                                <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 leading-relaxed">
                                    {selectedActivity.details}
                                </p>
                            </div>
                        </div>
                        <div className="pt-3 flex justify-end">
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-label-md text-xs hover:bg-primary-container transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- REPORT EXPORT MODAL ---------------- */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">download</span>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">Unduh Laporan Yayasan</h3>
                            </div>
                            <button 
                                onClick={() => setShowReportModal(false)}
                                className="text-outline hover:text-on-surface cursor-pointer p-1 rounded-lg hover:bg-surface-container"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="font-body-sm text-xs text-outline">
                            Pilih jenis laporan dan rentang waktu yang ingin diekspor untuk rekapitulasi data yayasan.
                        </p>
                        <div className="space-y-3 font-label-md text-xs">
                            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                                <input type="radio" name="reportType" defaultChecked className="text-primary focus:ring-primary" />
                                <div>
                                    <p className="font-semibold text-on-surface">Laporan Komprehensif Santri &amp; PPDB ({timeRange})</p>
                                    <p className="font-body-sm text-[11px] text-outline">Rekap total {dashboardStats.totalSantri} santri, {dashboardStats.pendaftaranTahunIni} pendaftar baru, dan distribusi program.</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                                <input type="radio" name="reportType" className="text-primary focus:ring-primary" />
                                <div>
                                    <p className="font-semibold text-on-surface">Laporan Capaian Kurikulum &amp; Pembelajaran Tahfidz</p>
                                    <p className="font-body-sm text-[11px] text-outline">Rekapitulasi evaluasi tahsin isyarat, hafalan juz, dan perkembangan santri inklusi.</p>
                                </div>
                            </label>
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-label-md text-xs hover:bg-surface-container-low transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Memulai pembuatan dokumen laporan periode ${timeRange}... Silakan gunakan fitur export santri/pendaftaran untuk file Excel.`);
                                    setShowReportModal(false);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-label-md text-xs hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">file_download</span>
                                <span>Unduh PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
