import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Elements/Sidebar';
import TopBar from '@/Components/Elements/TopBar';
import ConfirmModal from '@/Components/Elements/ConfirmModal';

export default function AdminSantri({ auth, santris = [], stats = {}, filters = {} }) {
    const { flash, errors } = usePage().props;
    const user = auth?.user || { name: 'Admin Utama', email: 'admin@bhaktiarumi.org', role: 'Super Admin' };

    // Navigation & UI state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [genderFilter, setGenderFilter] = useState(filters?.gender || 'Semua');
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Notification / Toast
    const [toastMessage, setToastMessage] = useState(flash?.success || '');
    const [toastError, setToastError] = useState(flash?.error || '');

    // Confirmation Modal States
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            setToastError(flash.error);
            const timer = setTimeout(() => setToastError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error]);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedSantri, setSelectedSantri] = useState(null);

    // Form data
    const initialForm = {
        nama_lengkap: '',
        nama_panggilan: '',
        nis: '',
        jenis_kelamin: 'Laki-laki',
        tempat_lahir: '',
        tanggal_lahir: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        nama_ortu: '',
        no_hp_ortu: '',
        pekerjaan_ortu: '',
        alamat: '',
        keterangan: '',
        foto: null,
    };

    const [formData, setFormData] = useState(initialForm);
    const [editFormData, setEditFormData] = useState(initialForm);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);
    const printRef = useRef(null);

    // Logout
    const handleLogout = (e) => {
        e?.preventDefault?.();
        router.post(typeof route !== 'undefined' ? route('logout') : '/logout');
    };

    // Helper: Hitung Lama Terdaftar (Berapa tahun, bulan, atau hari)
    const getLamaTerdaftar = (dateString) => {
        if (!dateString) return '-';
        const start = new Date(dateString);
        const now = new Date();
        if (isNaN(start.getTime())) return '-';

        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Baru didaftarkan';
        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return '1 hari';
        if (diffDays < 30) return `${diffDays} hari`;

        const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        const years = Math.floor(diffMonths / 12);
        const months = diffMonths % 12;

        if (years > 0 && months > 0) {
            return `${years} thn ${months} bln`;
        } else if (years > 0) {
            return `${years} tahun`;
        } else {
            return `${months || 1} bulan`;
        }
    };

    // Filtered Santri List
    const filteredSantri = useMemo(() => {
        return santris.filter((s) => {
            // Search
            const q = searchQuery.toLowerCase().trim();
            const matchSearch =
                !q ||
                s.nama_lengkap?.toLowerCase().includes(q) ||
                s.nama_panggilan?.toLowerCase().includes(q) ||
                s.nis?.toLowerCase().includes(q) ||
                s.nama_ortu?.toLowerCase().includes(q) ||
                s.no_hp_ortu?.includes(q) ||
                s.alamat?.toLowerCase().includes(q);

            // Gender (JK)
            const matchGender = genderFilter === 'Semua' || s.jenis_kelamin === genderFilter;

            return matchSearch && matchGender;
        });
    }, [santris, searchQuery, genderFilter]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, genderFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredSantri.length / itemsPerPage) || 1;
    const paginatedSantri = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSantri.slice(start, start + itemsPerPage);
    }, [filteredSantri, currentPage, itemsPerPage]);

    // Checkbox selections
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredSantri.map((s) => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Bulk Action Handler (Executed via ConfirmModal)
    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleting(true);
        router.post('/admin/santri/bulk', { ids: selectedIds, action: 'delete' }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsBulkDeleting(false);
                setShowBulkDeleteModal(false);
                setSelectedIds([]);
            },
            onError: () => {
                setIsBulkDeleting(false);
            }
        });
    };

    // Form Handlers & Photo Upload
    const handleFileSelect = (e, isEdit = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setToastError('Ukuran foto maksimal 10MB');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        if (isEdit) {
            setEditFormData((prev) => ({ ...prev, foto: file, remove_foto: false }));
            setEditPhotoPreview(previewUrl);
        } else {
            setFormData((prev) => ({ ...prev, foto: file }));
            setPhotoPreview(previewUrl);
        }
    };

    const handleRemovePhoto = (isEdit = false) => {
        if (isEdit) {
            setEditFormData((prev) => ({ ...prev, foto: null, remove_foto: true }));
            setEditPhotoPreview(null);
            if (editFileInputRef.current) {
                editFileInputRef.current.value = '';
            }
        } else {
            setFormData((prev) => ({ ...prev, foto: null }));
            setPhotoPreview(null);
            if (addFileInputRef.current) {
                addFileInputRef.current.value = '';
            }
        }
    };

    const submitAddSantri = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

        router.post('/admin/santri', data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowAddModal(false);
                setFormData(initialForm);
                setPhotoPreview(null);
                if (addFileInputRef.current) addFileInputRef.current.value = '';
            },
            onError: (err) => {
                setIsSubmitting(false);
                const firstError = Object.values(err)[0];
                setToastError(firstError || 'Gagal menyimpan data santri. Silakan periksa kembali formulir Anda.');
            }
        });
    };

    const openEditModal = (santri) => {
        setSelectedSantri(santri);
        setEditFormData({
            nama_lengkap: santri.nama_lengkap || '',
            nama_panggilan: santri.nama_panggilan || '',
            nis: santri.nis || '',
            jenis_kelamin: santri.jenis_kelamin || 'Laki-laki',
            tempat_lahir: santri.tempat_lahir || '',
            tanggal_lahir: santri.tanggal_lahir || '',
            tanggal_masuk: santri.tanggal_masuk || '',
            nama_ortu: santri.nama_ortu || '',
            no_hp_ortu: santri.no_hp_ortu || '',
            pekerjaan_ortu: santri.pekerjaan_ortu || '',
            alamat: santri.alamat || '',
            keterangan: santri.keterangan || '',
            foto: null,
            remove_foto: false,
        });
        setEditPhotoPreview(santri.foto || null);
        setShowEditModal(true);
    };

    const submitEditSantri = (e) => {
        e.preventDefault();
        if (!selectedSantri) return;
        setIsSubmitting(true);

        const data = new FormData();
        data.append('_method', 'PUT');
        Object.keys(editFormData).forEach((key) => {
            if (editFormData[key] !== null && editFormData[key] !== undefined) {
                data.append(key, editFormData[key]);
            }
        });

        router.post(`/admin/santri/${selectedSantri.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowEditModal(false);
                setSelectedSantri(null);
                setEditPhotoPreview(null);
                if (editFileInputRef.current) editFileInputRef.current.value = '';
            },
            onError: (err) => {
                setIsSubmitting(false);
                const firstError = Object.values(err)[0];
                setToastError(firstError || 'Gagal memperbarui data santri.');
            }
        });
    };

    const openDeleteModal = (santri) => {
        setSelectedSantri(santri);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedSantri) return;
        setIsSubmitting(true);
        router.delete(`/admin/santri/${selectedSantri.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowDeleteModal(false);
                setSelectedSantri(null);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const openDetailModal = (santri) => {
        setSelectedSantri(santri);
        setShowDetailModal(true);
    };

    const handlePrintCard = () => {
        const printWindow = window.open('', '', 'width=900,height=650');
        if (!printWindow || !printRef.current) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Cetak Kartu Santri - ${selectedSantri?.nama_lengkap}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body class="p-8 bg-gray-50 flex items-center justify-center min-h-screen">
                    ${printRef.current.innerHTML}
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Export CSV / Excel Compatible
    const handleDownloadExcel = (useBackend = true) => {
        if (useBackend) {
            window.location.href = '/admin/santri/export';
            setShowExportModal(false);
            setToastMessage('Mengunduh rekaman lengkap data santri format Excel...');
            return;
        }

        // Export active filtered view with UTF-8 BOM
        const headers = ['ID', 'NIS', 'Nama Lengkap', 'Panggilan', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Tanggal Daftar', 'Masa Belajar', 'Wali', 'No HP WhatsApp Wali', 'Alamat', 'Catatan'];
        const rows = filteredSantri.map((s) => [
            s.id,
            `"${s.nis || ''}"`,
            `"${s.nama_lengkap || ''}"`,
            `"${s.nama_panggilan || ''}"`,
            `"${s.jenis_kelamin || ''}"`,
            `"${s.tempat_lahir || ''}"`,
            `"${s.tanggal_lahir || ''}"`,
            `"${s.tanggal_masuk || ''}"`,
            `"${getLamaTerdaftar(s.tanggal_masuk)}"`,
            `"${s.nama_ortu || ''}"`,
            `"${s.no_hp_ortu || ''}"`,
            `"${(s.alamat || '').replace(/"/g, '""')}"`,
            `"${(s.keterangan || '').replace(/"/g, '""')}"`,
        ]);

        const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `data_santri_terfilter_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowExportModal(false);
        setToastMessage('Data santri terfilter berhasil diunduh!');
    };

    const getInitials = (name) => {
        if (!name) return 'ST';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const isFiltered = searchQuery !== '' || genderFilter !== 'Semua';

    return (
        <>
            <Head title="Santri Management - Bhakti Arumi Admin" />

            <div className="bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
                {/* ── SHARED SIDEBAR ── */}
                <Sidebar
                    activeNav="Santri Management"
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                    pendingRegistrations={stats?.pending_pendaftaran || 0}
                />

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <TopBar
                        user={user}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setMobileMenuOpen={setMobileMenuOpen}
                        handleLogout={handleLogout}
                    />

                    {/* ── TOAST MESSAGES ── */}
                    {toastMessage && (
                        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-2xl animate-slideUp">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <span className="font-label-md text-sm">{toastMessage}</span>
                            <button onClick={() => setToastMessage('')} className="ml-2 opacity-80 hover:opacity-100 cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    )}

                    {toastError && (
                        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-error text-white px-5 py-3.5 rounded-xl shadow-2xl animate-slideUp">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            <span className="font-label-md text-sm">{toastError}</span>
                            <button onClick={() => setToastError('')} className="ml-2 opacity-80 hover:opacity-100 cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    )}

                    {/* ── SCROLLABLE PAGE BODY ── */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-margin-desktop bg-surface">
                        <div className="max-w-container-max mx-auto space-y-6">
                            
                            {/* Page Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase">
                                            Pangkalan Data Santri MTAS
                                        </span>
                                    </div>
                                    <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface">
                                        Santri Management
                                    </h1>
                                    <p className="font-body-md text-sm text-outline mt-0.5">
                                        Kelola pangkalan data santri aktif, NIS resmi, masa belajar, dan identitas kontak wali.
                                    </p>
                                </div>

                                {/* Header Actions */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        onClick={() => setShowExportModal(true)}
                                        className="h-11 px-4 flex items-center gap-2 border border-outline-variant bg-surface-container-lowest rounded-xl font-label-md text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-outline">file_download</span>
                                        <span>Ekspor CSV</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFormData(initialForm);
                                            setPhotoPreview(null);
                                            setShowAddModal(true);
                                        }}
                                        className="h-11 px-5 bg-gradient-to-r from-primary to-indigo-600 text-white font-label-md text-sm rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-primary/25 hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer shrink-0 font-bold ml-auto lg:ml-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        <span>Tambah Santri Baru</span>
                                    </button>
                                </div>
                            </div>

                            {/* Pending Pendaftaran Alert Banner */}
                            {stats?.pending_pendaftaran > 0 && (
                                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                                            <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs">Terdapat {stats.pending_pendaftaran} Pendaftaran Calon Santri Baru Menunggu Verifikasi</p>
                                            <p className="text-[11px] text-amber-800 mt-0.5">Calon santri yang dinyatakan lulus di PPDB akan otomatis terdaftar dan dipindahkan ke Santri Management ini.</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin/pendaftaran"
                                        className="h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition whitespace-nowrap cursor-pointer shrink-0"
                                    >
                                        <span>Buka Pendaftaran</span>
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            )}

                            {/* ── BENTO STATS CARDS ── */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
                                {/* Total Santri */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-xl">group</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[10px] font-bold">
                                            Aktif
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-label-md text-xs text-outline mb-0.5">Total Santri Aktif</p>
                                        <h3 className="font-headline-lg text-2xl font-black text-on-surface">
                                            {stats?.total ?? santris.length}
                                        </h3>
                                    </div>
                                </div>

                                {/* Santri Ikhwan (Laki-laki) */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#025EDB] text-xl">male</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#025EDB] font-label-sm text-[10px] font-bold">
                                            Ikhwan
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-label-md text-xs text-outline mb-0.5">Santri Laki-laki</p>
                                        <h3 className="font-headline-lg text-2xl font-black text-[#025EDB]">
                                            {stats?.laki_laki ?? santris.filter(s => s.jenis_kelamin === 'Laki-laki').length}
                                        </h3>
                                    </div>
                                </div>

                                {/* Santri Akhwat (Perempuan) */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-rose-600 text-xl">female</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-label-sm text-[10px] font-bold">
                                            Akhwat
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-label-md text-xs text-outline mb-0.5">Santri Perempuan</p>
                                        <h3 className="font-headline-lg text-2xl font-black text-rose-600">
                                            {stats?.perempuan ?? santris.filter(s => s.jenis_kelamin === 'Perempuan').length}
                                        </h3>
                                    </div>
                                </div>

                                {/* Terdaftar Tahun Ini */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#D38B1D] text-xl">calendar_month</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#D38B1D] font-label-sm text-[10px] font-bold">
                                            Tahun Ini
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-label-md text-xs text-outline mb-0.5">Daftar Tahun {new Date().getFullYear()}</p>
                                        <h3 className="font-headline-lg text-2xl font-black text-[#D38B1D]">
                                            {stats?.tahun_ini ?? santris.filter(s => s.tanggal_masuk && s.tanggal_masuk.startsWith(new Date().getFullYear().toString())).length}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* ── FILTER & SEARCH TOOLBAR ── */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs space-y-3">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                    {/* Search input */}
                                    <div className="relative flex-1 max-w-md">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
                                            search
                                        </span>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari santri (nama, NIS, wali, WA, domisili)..."
                                            className="w-full h-10 pl-10 pr-9 bg-surface-container-low border border-outline-variant/70 rounded-xl font-body-sm text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded-md cursor-pointer"
                                                title="Hapus pencarian"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Filters Group */}
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {/* Gender Filter (JK) */}
                                        <div className="relative flex items-center">
                                            <select
                                                value={genderFilter}
                                                onChange={(e) => setGenderFilter(e.target.value)}
                                                className="h-10 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/70 rounded-xl font-label-md text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:border-outline appearance-none bg-none"
                                            >
                                                <option value="Semua">Semua Jenis Kelamin</option>
                                                <option value="Laki-laki">Laki-laki (Ikhwan)</option>
                                                <option value="Perempuan">Perempuan (Akhwat)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>

                                        {/* Reset Filters Button */}
                                        {isFiltered && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setGenderFilter('Semua');
                                                }}
                                                className="h-10 px-3 flex items-center gap-1.5 text-outline hover:text-error rounded-xl hover:bg-surface-container-high border border-dashed border-outline-variant transition font-label-md text-xs cursor-pointer"
                                                title="Reset Semua Filter"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                                                <span className="hidden sm:inline">Reset</span>
                                            </button>
                                        )}

                                        {/* View mode toggle */}
                                        <div className="flex bg-surface-container-low p-0.5 rounded-xl border border-outline-variant ml-auto h-10 items-center">
                                            <button
                                                onClick={() => setViewMode('table')}
                                                className={`p-2 rounded-lg transition flex items-center justify-center cursor-pointer ${
                                                    viewMode === 'table'
                                                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                        : 'text-outline hover:text-on-surface'
                                                }`}
                                                title="Tampilan Tabel"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">table_rows</span>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 rounded-lg transition flex items-center justify-center cursor-pointer ${
                                                    viewMode === 'grid'
                                                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                        : 'text-outline hover:text-on-surface'
                                                }`}
                                                title="Tampilan Kartu / Grid"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bulk Action Bar if items selected */}
                                {selectedIds.length > 0 && (
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/60 bg-primary-fixed/30 -mx-4 -mb-4 p-3.5 rounded-b-2xl animate-fadeIn">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                                                {selectedIds.length}
                                            </span>
                                            <span className="font-label-md text-xs font-semibold text-on-surface">
                                                santri terpilih
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowBulkDeleteModal(true)}
                                                className="px-3 py-1.5 rounded-lg bg-error text-white font-label-md text-xs hover:bg-error-container transition cursor-pointer flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                <span>Hapus Terpilih</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedIds([])}
                                                className="px-2.5 py-1.5 text-outline hover:text-on-surface font-label-md text-xs cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── SANTRI LIST: TABLE VIEW ── */}
                            {viewMode === 'table' && (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-outline-variant bg-surface-container-low/70">
                                                    <th className="py-3.5 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                filteredSantri.length > 0 &&
                                                                selectedIds.length === filteredSantri.length
                                                            }
                                                            onChange={handleSelectAll}
                                                            className="rounded text-primary focus:ring-primary cursor-pointer"
                                                        />
                                                    </th>
                                                    <th className="py-3.5 px-4 font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        NIS
                                                    </th>
                                                    <th className="py-3.5 px-4 font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        Foto &amp; Nama Santri
                                                    </th>
                                                    <th className="py-3.5 px-4 font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        JK &amp; Usia
                                                    </th>
                                                    <th className="py-3.5 px-4 font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        Wali &amp; Kontak WhatsApp
                                                    </th>
                                                    <th className="py-3.5 px-4 font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        Tanggal Daftar
                                                    </th>
                                                    <th className="py-3.5 px-4 text-right font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/60 font-body-sm text-xs">
                                                {paginatedSantri.map((s) => (
                                                    <tr
                                                        key={s.id}
                                                        className={`hover:bg-primary-fixed/20 transition-colors group ${
                                                            selectedIds.includes(s.id) ? 'bg-primary-fixed/25' : ''
                                                        }`}
                                                    >
                                                        {/* Checkbox */}
                                                        <td className="py-3.5 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(s.id)}
                                                                onChange={() => handleToggleSelect(s.id)}
                                                                className="rounded text-primary focus:ring-primary cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* 1. Dedicated Column: NIS */}
                                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                                            <span className="font-mono text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-lg border border-primary/20 inline-block shadow-2xs">
                                                                {s.nis || 'Belum Terbit'}
                                                            </span>
                                                        </td>

                                                        {/* 2. Foto & Nama Santri */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                {s.foto ? (
                                                                    <img
                                                                        src={s.foto}
                                                                        alt={s.nama_lengkap}
                                                                        className="w-11 h-11 rounded-xl object-cover border border-outline-variant shadow-xs shrink-0 group-hover:ring-2 group-hover:ring-primary/40 transition-all"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                                                                            s.jenis_kelamin === 'Laki-laki'
                                                                                ? 'bg-blue-100 text-[#025EDB]'
                                                                                : 'bg-rose-100 text-rose-700'
                                                                        }`}
                                                                    >
                                                                        {getInitials(s.nama_lengkap)}
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                                                                            {s.nama_lengkap}
                                                                        </span>
                                                                        {s.nama_panggilan && (
                                                                            <span className="px-1.5 py-0.2 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                                                                                {s.nama_panggilan}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[11px] text-outline truncate mt-0.5">
                                                                        {s.alamat ? s.alamat : 'Domisili tidak diisi'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* 3. Gender & Age */}
                                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span className="font-label-md text-xs font-semibold text-on-surface flex items-center gap-1">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.jenis_kelamin === 'Laki-laki' ? 'bg-blue-500' : 'bg-rose-500'}`}></span>
                                                                    {s.jenis_kelamin}
                                                                </span>
                                                                <span className="text-[11px] text-outline mt-0.5">
                                                                    {s.umur ? `${s.umur} Tahun` : s.tanggal_lahir_formatted || '-'}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* 4. Parent Wali & WhatsApp */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex flex-col min-w-[130px]">
                                                                <span className="font-headline-sm text-xs font-semibold text-on-surface truncate">
                                                                    {s.nama_ortu || '-'}
                                                                </span>
                                                                {s.no_hp_ortu ? (
                                                                    <a
                                                                        href={`https://wa.me/${s.no_hp_ortu.replace(/[^0-9]/g, '')}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 text-[11px] font-semibold transition-colors mt-1 w-fit"
                                                                        title="Hubungi via WhatsApp"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[13px]">chat</span>
                                                                        <span>{s.no_hp_ortu}</span>
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-[11px] text-outline">-</span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* 5. Dedicated Column: Tanggal Daftar (Dengan Berapa Tahun / Bulan / Hari) */}
                                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-on-surface text-xs">
                                                                    {s.tanggal_masuk_formatted || s.tanggal_masuk || '-'}
                                                                </span>
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-semibold w-fit border border-outline-variant/60">
                                                                    <span className="material-symbols-outlined text-[12px] text-primary">schedule</span>
                                                                    <span>{getLamaTerdaftar(s.tanggal_masuk)}</span>
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* 6. Actions */}
                                                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {/* Detail / ID Card */}
                                                                <button
                                                                    onClick={() => openDetailModal(s)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary-fixed/40 transition cursor-pointer"
                                                                    title="Lihat Detail & Kartu Santri"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">badge</span>
                                                                </button>

                                                                {/* Edit */}
                                                                <button
                                                                    onClick={() => openEditModal(s)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary-fixed/40 transition cursor-pointer"
                                                                    title="Edit Data Santri"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </button>

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => openDeleteModal(s)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition cursor-pointer"
                                                                    title="Hapus Data Santri"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {filteredSantri.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="py-14 text-center text-outline font-label-md text-xs">
                                                            <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                                                                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-outline-variant">
                                                                    <span className="material-symbols-outlined text-3xl">
                                                                        person_search
                                                                    </span>
                                                                </div>
                                                                <p className="font-bold text-sm text-on-surface">Tidak ada data santri yang cocok</p>
                                                                <p className="text-outline text-xs leading-relaxed">
                                                                    Coba periksa kembali kata kunci pencarian atau sesuaikan opsi filter jenis kelamin.
                                                                </p>
                                                                {isFiltered && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSearchQuery('');
                                                                            setGenderFilter('Semua');
                                                                        }}
                                                                        className="mt-1 px-4 py-2 rounded-xl bg-primary text-white font-label-md text-xs font-semibold hover:bg-primary-container transition cursor-pointer"
                                                                    >
                                                                        Reset Filter
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Table Pagination & Footer */}
                                    <div className="p-4 border-t border-outline-variant bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline">
                                        <div>
                                            <span>
                                                Menampilkan <strong className="text-on-surface">{paginatedSantri.length}</strong> dari{' '}
                                                <strong className="text-on-surface">{filteredSantri.length}</strong> santri (Total: {santris.length})
                                            </span>
                                        </div>
                                        
                                        {/* Pagination buttons */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-1.5 rounded-lg border border-outline-variant/80 hover:bg-surface-container text-on-surface disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                                                    title="Halaman Sebelumnya"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 rounded-lg font-label-md text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                                                            currentPage === page
                                                                ? 'bg-primary text-white shadow-xs'
                                                                : 'text-outline hover:bg-surface-container hover:text-on-surface'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-1.5 rounded-lg border border-outline-variant/80 hover:bg-surface-container text-on-surface disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                                                    title="Halaman Berikutnya"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── SANTRI LIST: GRID VIEW ── */}
                            {viewMode === 'grid' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {paginatedSantri.map((s) => (
                                            <div
                                                key={s.id}
                                                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        {s.foto ? (
                                                            <img
                                                                src={s.foto}
                                                                alt={s.nama_lengkap}
                                                                className="w-14 h-14 rounded-2xl object-cover border border-outline-variant shadow-sm shrink-0"
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                                                                    s.jenis_kelamin === 'Laki-laki'
                                                                        ? 'bg-blue-100 text-[#025EDB]'
                                                                        : 'bg-rose-100 text-rose-700'
                                                                }`}
                                                            >
                                                                {getInitials(s.nama_lengkap)}
                                                            </div>
                                                        )}
                                                        <span className="font-mono text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md border border-primary/20">
                                                            {s.nis || 'No NIS'}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                                                        {s.nama_lengkap}
                                                    </h3>
                                                    <p className="text-xs text-outline mt-0.5">
                                                        {s.jenis_kelamin} {s.umur ? `• ${s.umur} thn` : ''}
                                                    </p>

                                                    <div className="mt-3 pt-3 border-t border-outline-variant/60 space-y-1.5 text-xs">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-outline">Tanggal Daftar</span>
                                                            <span className="font-medium text-on-surface">{s.tanggal_masuk_formatted || s.tanggal_masuk || '-'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-outline">Masa Belajar</span>
                                                            <span className="font-semibold text-primary">{getLamaTerdaftar(s.tanggal_masuk)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-outline">Wali</span>
                                                            <span className="font-medium text-on-surface">{s.nama_ortu || '-'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-outline">WhatsApp</span>
                                                            {s.no_hp_ortu ? (
                                                                <a
                                                                    href={`https://wa.me/${s.no_hp_ortu?.replace(/[^0-9]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-emerald-700 font-semibold hover:underline"
                                                                >
                                                                    {s.no_hp_ortu}
                                                                </a>
                                                            ) : (
                                                                <span className="text-outline">-</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                                                    <button
                                                        onClick={() => openDetailModal(s)}
                                                        className="flex-1 py-1.5 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-primary font-label-md text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">badge</span>
                                                        <span>Kartu Santri</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(s)}
                                                        className="p-1.5 text-outline hover:text-primary rounded-xl hover:bg-surface-container-low transition cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(s)}
                                                        className="p-1.5 text-outline hover:text-error rounded-xl hover:bg-error-container/20 transition cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grid Pagination Footer */}
                                    {totalPages > 1 && (
                                        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-between text-xs text-outline">
                                            <span>Halaman {currentPage} dari {totalPages} ({filteredSantri.length} Santri)</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-1.5 rounded-lg border border-outline-variant/80 hover:bg-surface-container text-on-surface disabled:opacity-40 transition cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-1.5 rounded-lg border border-outline-variant/80 hover:bg-surface-container text-on-surface disabled:opacity-40 transition cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </main>
                </div>
            </div>

            {/* ── MODAL: TAMBAH SANTRI BARU ── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">person_add</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Tambah Santri Baru</h3>
                                    <p className="font-body-sm text-xs text-outline">Lengkapi formulir biodata santri dan identitas wali</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitAddSantri} className="flex flex-col flex-1 min-h-0">
                            {/* Scrollable Form Body (Contained strictly inside modal) */}
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-body-sm text-xs flex-1">
                                
                                {/* SECTION 1: UPLOAD FOTO DARI PERANGKAT & PREVIEW (Matching Screenshot Style) */}
                                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">
                                                add_photo_alternate
                                            </span>
                                            Foto Profil Santri
                                        </span>
                                        <span className="text-[11px] text-outline">Format: PNG, JPG, JPEG, WEBP (Maks. 10MB)</span>
                                    </div>

                                    <input
                                        type="file"
                                        ref={addFileInputRef}
                                        onChange={(e) => handleFileSelect(e, false)}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                    />

                                    {photoPreview ? (
                                        /* PREVIEW OF UPLOADED PHOTO */
                                        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                            <img
                                                src={photoPreview}
                                                alt="Preview Foto Santri"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Foto Terpilih
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => addFileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white text-gray-900 rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                    Ganti Foto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(false)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* UPLOAD DROPZONE / SELECTOR (Exact Match with Screenshot) */
                                        <div
                                            onClick={() => addFileInputRef.current?.click()}
                                            className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
                                                <span className="material-symbols-outlined text-[28px]">upload_file</span>
                                            </div>
                                            <p className="font-headline-sm text-sm font-bold text-on-surface">
                                                Pilih &amp; Upload Foto dari Perangkat (Komputer)
                                            </p>
                                            <p className="font-body-sm text-xs text-outline mt-1 max-w-md">
                                                Klik area ini untuk memilih file foto langsung dari folder laptop atau komputer Anda.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addFileInputRef.current?.click();
                                                }}
                                                className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                                                Pilih Foto dari Komputer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* SECTION 2: BIODATA SANTRI */}
                                <div className="space-y-4">
                                    <h4 className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/60 pb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
                                        Biodata Pokok Santri
                                    </h4>

                                    {/* NIS, Nama Lengkap & Panggilan */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                        <div className="sm:col-span-4">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                NIS Santri
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nis}
                                                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                                placeholder="Otomatis jika kosong"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            {errors?.nis && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.nis}</p>}
                                        </div>
                                        <div className="sm:col-span-5">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Nama Lengkap <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nama_lengkap}
                                                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                                                placeholder="Contoh: Muhammad Rizky Pratama"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            {errors?.nama_lengkap && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.nama_lengkap}</p>}
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Panggilan
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nama_panggilan}
                                                onChange={(e) => setFormData({ ...formData, nama_panggilan: e.target.value })}
                                                placeholder="Contoh: Rizky"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Jenis Kelamin, Tempat & Tanggal Lahir */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Jenis Kelamin <span className="text-error">*</span>
                                            </label>
                                            <div className="flex items-center gap-3 pt-2">
                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="add_jk"
                                                        checked={formData.jenis_kelamin === 'Laki-laki'}
                                                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'Laki-laki' })}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span>Laki-laki</span>
                                                </label>
                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="add_jk"
                                                        checked={formData.jenis_kelamin === 'Perempuan'}
                                                        onChange={() => setFormData({ ...formData, jenis_kelamin: 'Perempuan' })}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span>Perempuan</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Tempat Lahir
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tempat_lahir}
                                                onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                                                placeholder="Contoh: Pontianak"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Tanggal Lahir
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.tanggal_lahir}
                                                onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Tanggal Daftar */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Tanggal Daftar / Masuk
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.tanggal_masuk}
                                            onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                                            className="w-full sm:w-1/2 h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* SECTION 3: IDENTITAS WALI & KONTAK */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/60 pb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
                                        Identitas Orang Tua / Wali
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Nama Orang Tua / Wali <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nama_ortu}
                                                onChange={(e) => setFormData({ ...formData, nama_ortu: e.target.value })}
                                                placeholder="Nama ayah/ibu/wali"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            {errors?.nama_ortu && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.nama_ortu}</p>}
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                No. WhatsApp Wali <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.no_hp_ortu}
                                                onChange={(e) => setFormData({ ...formData, no_hp_ortu: e.target.value })}
                                                placeholder="Contoh: 081234567890"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            {errors?.no_hp_ortu && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.no_hp_ortu}</p>}
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Pekerjaan Wali
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.pekerjaan_ortu}
                                                onChange={(e) => setFormData({ ...formData, pekerjaan_ortu: e.target.value })}
                                                placeholder="Contoh: Wiraswasta"
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Alamat Domisili */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Alamat Domisili Santri
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.alamat}
                                            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                            placeholder="Alamat lengkap tempat tinggal santri..."
                                            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    {/* Catatan Khusus */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Catatan Khusus / Kebutuhan Belajar
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.keterangan}
                                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                            placeholder="Catatan kebutuhan khusus, bahasa isyarat, riwayat terapi, atau capaian hafalan..."
                                            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Footer (Fixed Bottom) */}
                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md text-xs font-bold hover:bg-primary-container transition shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    <span>Simpan Data Santri</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: EDIT DATA SANTRI ── */}
            {showEditModal && selectedSantri && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">edit</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Edit Data Santri</h3>
                                    <p className="font-body-sm text-xs text-outline">{selectedSantri.nama_lengkap} ({selectedSantri.nis || 'NIS Belum Terbit'})</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitEditSantri} className="flex flex-col flex-1 min-h-0">
                            {/* Scrollable Form Body (Contained strictly inside modal) */}
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-body-sm text-xs flex-1">
                                
                                {/* SECTION 1: UPLOAD / PERBARUI FOTO DARI PERANGKAT & PREVIEW (Matching Screenshot Style) */}
                                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">
                                                add_photo_alternate
                                            </span>
                                            Foto Profil Santri
                                        </span>
                                        <span className="text-[11px] text-outline">Format: PNG, JPG, JPEG, WEBP (Maks. 10MB)</span>
                                    </div>

                                    <input
                                        type="file"
                                        ref={editFileInputRef}
                                        onChange={(e) => handleFileSelect(e, true)}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                    />

                                    {editPhotoPreview ? (
                                        /* PREVIEW OF UPLOADED / EXISTING PHOTO */
                                        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                            <img
                                                src={editPhotoPreview}
                                                alt="Preview Foto Santri"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Foto Terpilih
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => editFileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white text-gray-900 rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                    Ganti Foto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(true)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* UPLOAD DROPZONE / SELECTOR (Exact Match with Screenshot) */
                                        <div
                                            onClick={() => editFileInputRef.current?.click()}
                                            className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
                                                <span className="material-symbols-outlined text-[28px]">upload_file</span>
                                            </div>
                                            <p className="font-headline-sm text-sm font-bold text-on-surface">
                                                Pilih &amp; Upload Foto dari Perangkat (Komputer)
                                            </p>
                                            <p className="font-body-sm text-xs text-outline mt-1 max-w-md">
                                                Klik area ini untuk memilih file foto langsung dari folder laptop atau komputer Anda.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editFileInputRef.current?.click();
                                                }}
                                                className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                                                Pilih Foto dari Komputer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* SECTION 2: BIODATA SANTRI */}
                                <div className="space-y-4">
                                    <h4 className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/60 pb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
                                        Biodata Pokok Santri
                                    </h4>

                                    {/* NIS, Nama Lengkap & Panggilan */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                        <div className="sm:col-span-4">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                NIS Santri
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.nis}
                                                onChange={(e) => setEditFormData({ ...editFormData, nis: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                                            />
                                        </div>
                                        <div className="sm:col-span-5">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Nama Lengkap <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={editFormData.nama_lengkap}
                                                onChange={(e) => setEditFormData({ ...editFormData, nama_lengkap: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Nama Panggilan
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.nama_panggilan}
                                                onChange={(e) => setEditFormData({ ...editFormData, nama_panggilan: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Jenis Kelamin, Tempat & Tanggal Lahir */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Jenis Kelamin
                                            </label>
                                            <div className="flex items-center gap-3 pt-2">
                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="edit_jk"
                                                        checked={editFormData.jenis_kelamin === 'Laki-laki'}
                                                        onChange={() => setEditFormData({ ...editFormData, jenis_kelamin: 'Laki-laki' })}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span>Laki-laki</span>
                                                </label>
                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="edit_jk"
                                                        checked={editFormData.jenis_kelamin === 'Perempuan'}
                                                        onChange={() => setEditFormData({ ...editFormData, jenis_kelamin: 'Perempuan' })}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span>Perempuan</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Tempat Lahir
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.tempat_lahir}
                                                onChange={(e) => setEditFormData({ ...editFormData, tempat_lahir: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Tanggal Lahir
                                            </label>
                                            <input
                                                type="date"
                                                value={editFormData.tanggal_lahir}
                                                onChange={(e) => setEditFormData({ ...editFormData, tanggal_lahir: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Tanggal Daftar */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Tanggal Daftar / Masuk
                                        </label>
                                        <input
                                            type="date"
                                            value={editFormData.tanggal_masuk}
                                            onChange={(e) => setEditFormData({ ...editFormData, tanggal_masuk: e.target.value })}
                                            className="w-full sm:w-1/2 h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* SECTION 3: IDENTITAS WALI & KONTAK */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/60 pb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
                                        Identitas Orang Tua / Wali
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Nama Orang Tua / Wali <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={editFormData.nama_ortu}
                                                onChange={(e) => setEditFormData({ ...editFormData, nama_ortu: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                No. WhatsApp Wali <span className="text-error">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={editFormData.no_hp_ortu}
                                                onChange={(e) => setEditFormData({ ...editFormData, no_hp_ortu: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                                Pekerjaan Wali
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.pekerjaan_ortu}
                                                onChange={(e) => setEditFormData({ ...editFormData, pekerjaan_ortu: e.target.value })}
                                                className="w-full h-10 px-3.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Alamat Domisili */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Alamat Domisili
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editFormData.alamat}
                                            onChange={(e) => setEditFormData({ ...editFormData, alamat: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    {/* Catatan Khusus */}
                                    <div>
                                        <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                                            Catatan Perkembangan / Kebutuhan Khusus
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editFormData.keterangan}
                                            onChange={(e) => setEditFormData({ ...editFormData, keterangan: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Footer (Fixed Bottom) */}
                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md text-xs font-bold hover:bg-primary-container transition shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    <span>Simpan Perubahan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: DETAIL & KARTU SANTRI DIGITAL ── */}
            {showDetailModal && selectedSantri && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">badge</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Kartu Santri Digital</h3>
                                    <p className="font-body-sm text-xs text-outline">Identitas Resmi Yayasan Bhakti Arumi Delangga</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 font-body-sm text-xs">
                            {/* PRINTABLE CARD AREA */}
                            <div ref={printRef} className="space-y-4">
                                <div className="bg-gradient-to-br from-[#003B99] via-[#025EDB] to-[#0144A4] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border-2 border-white/20">
                                    {/* Decorative curves */}
                                    <div className="absolute right-0 top-0 w-44 h-44 bg-white/10 rounded-bl-full pointer-events-none"></div>
                                    <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-tr-full pointer-events-none"></div>

                                    {/* Card Header */}
                                    <div className="flex items-center justify-between relative z-10 pb-4 border-b border-white/20 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1">
                                                <img
                                                    src="/images/YBAD_logo.png"
                                                    alt="Logo Yayasan"
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm tracking-tight leading-tight">YAYASAN BHAKTI ARUMI DELANGGA</h4>
                                                <p className="text-[10px] text-blue-100 font-medium tracking-wide">KARTU TANDA SANTRI INKLUSIF</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                                            AKTIF
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="flex gap-4 items-center relative z-10">
                                        {selectedSantri.foto ? (
                                            <img
                                                src={selectedSantri.foto}
                                                alt={selectedSantri.nama_lengkap}
                                                className="w-20 h-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 bg-white"
                                            />
                                        ) : (
                                            <div className="w-20 h-24 rounded-2xl bg-white/20 border-2 border-white/40 flex flex-col items-center justify-center font-bold text-xl text-white shadow-md shrink-0">
                                                {getInitials(selectedSantri.nama_lengkap)}
                                                <span className="text-[9px] font-normal opacity-80 mt-1">SANTRI</span>
                                            </div>
                                        )}

                                        <div className="flex-1 space-y-1">
                                            <h2 className="text-lg font-black tracking-tight leading-snug drop-shadow-sm">
                                                {selectedSantri.nama_lengkap}
                                            </h2>
                                            <p className="font-mono text-xs text-blue-200 tracking-wider font-bold">
                                                NIS: {selectedSantri.nis || '-'}
                                            </p>
                                            <div className="pt-1.5 space-y-0.5 text-[11px] text-blue-100">
                                                <p><span className="opacity-70">Wali:</span> <span className="font-semibold text-white">{selectedSantri.nama_ortu || '-'}</span></p>
                                                <p><span className="opacity-70">Kontak:</span> <span className="font-semibold text-white">{selectedSantri.no_hp_ortu || '-'}</span></p>
                                                <p><span className="opacity-70">Masa Belajar:</span> <span className="font-bold text-white">{getLamaTerdaftar(selectedSantri.tanggal_masuk)}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between relative z-10 text-[10px] text-blue-100">
                                        <span>Tercatat Sejak: {selectedSantri.tanggal_masuk_formatted || selectedSantri.tanggal_masuk || '-'}</span>
                                        <div className="font-mono text-[9px] bg-black/20 px-2 py-0.5 rounded tracking-widest uppercase">
                                            ARUMI-ID-{selectedSantri.id}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Extra Details Sheet */}
                            <div className="bg-surface-container-low rounded-2xl p-4 space-y-2.5 text-xs border border-outline-variant/60">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-outline block text-[11px]">Tempat, Tanggal Lahir</span>
                                        <span className="font-semibold text-on-surface">
                                            {selectedSantri.tempat_lahir || '-'}, {selectedSantri.tanggal_lahir_formatted || '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-outline block text-[11px]">Jenis Kelamin</span>
                                        <span className="font-semibold text-on-surface">{selectedSantri.jenis_kelamin}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-outline block text-[11px]">Tanggal Daftar</span>
                                        <span className="font-semibold text-on-surface">{selectedSantri.tanggal_masuk_formatted || selectedSantri.tanggal_masuk || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-outline block text-[11px]">Lama Terdaftar</span>
                                        <span className="font-semibold text-primary">{getLamaTerdaftar(selectedSantri.tanggal_masuk)}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-outline block text-[11px]">Alamat Domisili</span>
                                    <span className="font-medium text-on-surface">{selectedSantri.alamat || '-'}</span>
                                </div>
                                {selectedSantri.keterangan && (
                                    <div className="pt-2 border-t border-outline-variant/40">
                                        <span className="text-outline block text-[11px]">Catatan / Kebutuhan Khusus</span>
                                        <p className="text-on-surface-variant italic mt-0.5 leading-relaxed bg-surface p-2.5 rounded-xl border border-outline-variant/40">
                                            "{selectedSantri.keterangan}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer (Fixed Bottom) */}
                        <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-between gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={handlePrintCard}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-label-md text-xs font-bold hover:bg-primary-container transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">print</span>
                                <span>Cetak Kartu</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: DELETE CONFIRMATION ── */}
            {showDeleteModal && selectedSantri && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl space-y-4 animate-scaleUp overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-error-container/30 flex items-center justify-center text-error mb-2">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                            Hapus Data Santri?
                        </h3>
                        <p className="font-body-sm text-xs text-outline leading-relaxed">
                            Apakah Anda yakin ingin menghapus data santri <strong>{selectedSantri.nama_lengkap}</strong> (NIS: {selectedSantri.nis || '-'})? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-error text-white rounded-xl font-label-md text-xs font-bold hover:bg-error-container transition shadow-md shadow-error/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                <span>Hapus Permanen</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: EXPORT DATA ── */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl space-y-4 animate-scaleUp overflow-hidden">
                        <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <span className="material-symbols-outlined">file_download</span>
                                <span>Ekspor Data Santri (Excel)</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowExportModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                        <p className="font-body-sm text-xs text-outline leading-relaxed">
                            Unduh seluruh rekaman pangkalan data santri yayasan dalam format Microsoft Excel / CSV yang kompatibel dan terstruktur.
                        </p>
                        <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/60 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-outline">Total Keseluruhan Santri:</span>
                                <strong className="text-on-surface font-bold">{santris.length} Santri</strong>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-outline">Santri Terfilter (Saat Ini):</span>
                                <strong className="text-primary font-bold">{filteredSantri.length} Santri</strong>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-outline">Filter Aktif:</span>
                                <span className="text-on-surface font-medium">{genderFilter} {searchQuery ? `• "${searchQuery}"` : ''}</span>
                            </div>
                        </div>
                        <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2.5 border-t border-outline-variant">
                            <button
                                type="button"
                                onClick={() => setShowExportModal(false)}
                                className="px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer"
                            >
                                Batal
                            </button>
                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={() => handleDownloadExcel(false)}
                                    className="px-3.5 py-2.5 border border-primary/40 bg-primary/10 text-primary rounded-xl font-label-md text-xs font-bold hover:bg-primary/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Unduh hanya data yang cocok dengan filter pencarian saat ini"
                                >
                                    <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                                    <span>Unduh Terfilter</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDownloadExcel(true)}
                                className="px-4 py-2.5 bg-primary text-white rounded-xl font-label-md text-xs font-bold hover:bg-primary-container transition shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">download</span>
                                <span>Unduh Rekap Excel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Santri Terpilih */}
            <ConfirmModal
                isOpen={showBulkDeleteModal}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={confirmBulkDelete}
                title="Hapus Data Santri Terpilih?"
                message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} data santri terpilih secara permanen? Data yang telah dihapus tidak dapat dipulihkan kembali.`}
                confirmText={`Hapus (${selectedIds.length}) Santri`}
                cancelText="Batal"
                variant="danger"
                icon="delete_sweep"
                isLoading={isBulkDeleting}
            />
        </>
    );
}
