import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Elements/Sidebar';
import TopBar from '@/Components/Elements/TopBar';
import ConfirmModal from '@/Components/Elements/ConfirmModal';

export default function AdminPendaftaran({ auth, pendaftarans = [], stats = {}, filters = {} }) {
    const { flash, errors } = usePage().props;
    const user = auth?.user || { name: 'Admin Utama', email: 'admin@bhaktiarumi.org', role: 'Super Admin' };

    // Navigation & UI state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'Semua');
    const [programFilter, setProgramFilter] = useState(filters?.program || 'Semua');
    const [genderFilter, setGenderFilter] = useState(filters?.gender || 'Semua');
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Notifications / Toast
    const [toastMessage, setToastMessage] = useState(flash?.success || '');
    const [toastError, setToastError] = useState(flash?.error || '');

    // Confirmation Modal States
    const [bulkActionToConfirm, setBulkActionToConfirm] = useState(null); // 'delete' | 'lulus' | 'diproses' | null
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(''), 5000);
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

    // Reset pagination to page 1 on filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, programFilter, genderFilter, itemsPerPage]);

    // Modals
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showLulusModal, setShowLulusModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
    const [docPreviewData, setDocPreviewData] = useState({ title: '', url: '', type: 'image' });
    const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);

    // Form data for manual registration & edit
    const initialForm = {
        nama_lengkap: '',
        jenis_maktab: 'Maktab Tuli As-Sami',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-laki',
        alamat_domisili: '',
        nama_ortu: '',
        no_hp_ortu: '',
        pekerjaan_ortu: '',
        alamat_ortu: '',
        keterangan_tambahan: '',
        status: 'Menunggu Verifikasi',
        catatan_admin: '',
        foto_santri: null,
        kartu_keluarga: null,
        ktp_ortu: null,
    };

    const [formData, setFormData] = useState(initialForm);
    const [editFormData, setEditFormData] = useState(initialForm);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);

    // Luluskan (Transfer to Santri) form data
    const [lulusFormData, setLulusFormData] = useState({
        nis: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        nama_panggilan: '',
        program: 'Maktab Tuli As-Sami',
        catatan_admin: 'Dinyatakan LULUS seleksi pendaftaran dan resmi terdaftar di Santri Management.',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Logout handler
    const handleLogout = (e) => {
        e?.preventDefault?.();
        router.post(typeof route !== 'undefined' ? route('logout') : '/logout');
    };

    // Filtered data
    const filteredPendaftarans = useMemo(() => {
        return pendaftarans.filter((p) => {
            // Search matching
            const q = searchQuery.toLowerCase().trim();
            const matchSearch =
                !q ||
                (p.nama_lengkap && p.nama_lengkap.toLowerCase().includes(q)) ||
                (p.no_pendaftaran && p.no_pendaftaran.toLowerCase().includes(q)) ||
                (p.nama_ortu && p.nama_ortu.toLowerCase().includes(q)) ||
                (p.no_hp_ortu && p.no_hp_ortu.toLowerCase().includes(q)) ||
                (p.alamat_domisili && p.alamat_domisili.toLowerCase().includes(q)) ||
                (p.tempat_lahir && p.tempat_lahir.toLowerCase().includes(q));

            // Status matching
            const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;

            // Program matching
            const matchProgram = programFilter === 'Semua' || p.jenis_maktab === programFilter;

            // Gender matching
            const matchGender = genderFilter === 'Semua' || p.jenis_kelamin === genderFilter;

            return matchSearch && matchStatus && matchProgram && matchGender;
        });
    }, [pendaftarans, searchQuery, statusFilter, programFilter, genderFilter]);

    // Pagination calculations
    const totalItems = filteredPendaftarans.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedPendaftarans = useMemo(() => {
        return filteredPendaftarans.slice(startIndex, endIndex);
    }, [filteredPendaftarans, startIndex, endIndex]);

    // Selection handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedPendaftarans.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Open Detail Modal
    const openDetailModal = (item) => {
        setSelectedPendaftaran(item);
        setShowDetailModal(true);
    };

    // Open Lulus Modal (Direct trigger to graduate & enroll)
    const openLulusModal = (item) => {
        setSelectedPendaftaran(item);
        // Use next unique NIS supplied from backend or fallback to auto generation
        const autoNis = stats?.next_nis || `SAN-${new Date().getFullYear()}-001`;
        const autoNick = item.nama_lengkap ? item.nama_lengkap.split(' ')[0] : '';

        setLulusFormData({
            nis: autoNis,
            tanggal_masuk: new Date().toISOString().split('T')[0],
            nama_panggilan: autoNick,
            program: item.jenis_maktab || 'Maktab Tuli As-Sami',
            catatan_admin: 'Dinyatakan LULUS seleksi pendaftaran dan resmi terdaftar di Santri Management.',
        });
        setShowLulusModal(true);
    };

    // Submit Luluskan
    const submitLuluskan = (e) => {
        e.preventDefault();
        if (!selectedPendaftaran) return;

        setIsSubmitting(true);
        router.post(`/admin/pendaftaran/${selectedPendaftaran.id}/luluskan`, lulusFormData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowLulusModal(false);
                setShowDetailModal(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Open Status Update Modal
    const openStatusModal = (item) => {
        setSelectedPendaftaran(item);
        setFormData({
            status: item.status,
            catatan_admin: item.catatan_admin || '',
        });
        setShowStatusModal(true);
    };

    // Submit Status Update
    const submitUpdateStatus = (e) => {
        e.preventDefault();
        if (!selectedPendaftaran) return;

        if (formData.status === 'Lulus') {
            setShowStatusModal(false);
            openLulusModal(selectedPendaftaran);
            return;
        }

        setIsSubmitting(true);
        router.patch(`/admin/pendaftaran/${selectedPendaftaran.id}/status`, {
            status: formData.status,
            catatan_admin: formData.catatan_admin,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowStatusModal(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Open Edit Modal
    const openEditModal = (item) => {
        setSelectedPendaftaran(item);
        setEditFormData({
            nama_lengkap: item.nama_lengkap || '',
            jenis_maktab: item.jenis_maktab || 'Maktab Tuli As-Sami',
            tempat_lahir: item.tempat_lahir || '',
            tanggal_lahir: item.tanggal_lahir || '',
            jenis_kelamin: item.jenis_kelamin || 'Laki-laki',
            alamat_domisili: item.alamat_domisili || '',
            nama_ortu: item.nama_ortu || '',
            no_hp_ortu: item.no_hp_ortu || '',
            pekerjaan_ortu: item.pekerjaan_ortu || '',
            alamat_ortu: item.alamat_ortu || '',
            keterangan_tambahan: item.keterangan_tambahan || '',
            status: item.status || 'Menunggu Verifikasi',
            catatan_admin: item.catatan_admin || '',
        });
        setEditPhotoPreview(item.foto_santri || null);
        setShowEditModal(true);
    };

    // Submit Edit
    const submitEdit = (e) => {
        e.preventDefault();
        if (!selectedPendaftaran) return;

        setIsSubmitting(true);
        const data = new FormData();
        Object.keys(editFormData).forEach((k) => {
            if (editFormData[k] !== null && editFormData[k] !== undefined) {
                data.append(k, editFormData[k]);
            }
        });

        router.post(`/admin/pendaftaran/${selectedPendaftaran.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowEditModal(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Open Delete Modal
    const openDeleteModal = (item) => {
        setSelectedPendaftaran(item);
        setShowDeleteModal(true);
    };

    // Submit Delete
    const submitDelete = () => {
        if (!selectedPendaftaran) return;

        setIsSubmitting(true);
        router.delete(`/admin/pendaftaran/${selectedPendaftaran.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowDeleteModal(false);
                setSelectedPendaftaran(null);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Trigger Bulk Action Modal
    const triggerBulkActionModal = (action) => {
        if (selectedIds.length === 0) return;
        setBulkActionToConfirm(action);
    };

    // Submit Bulk Action (Executed via ConfirmModal)
    const confirmBulkAction = () => {
        if (!bulkActionToConfirm || selectedIds.length === 0) return;

        setIsBulkProcessing(true);
        router.post('/admin/pendaftaran/bulk', {
            action: bulkActionToConfirm,
            ids: selectedIds,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsBulkProcessing(false);
                setBulkActionToConfirm(null);
                setSelectedIds([]);
            },
            onError: () => {
                setIsBulkProcessing(false);
            }
        });
    };

    // Document Preview
    const openDocPreview = (title, url) => {
        if (!url) return;
        const isPdf = url.toLowerCase().endsWith('.pdf');
        setDocPreviewData({
            title,
            url,
            type: isPdf ? 'pdf' : 'image',
        });
        setShowDocPreviewModal(true);
    };

    // Helper: Status badge rendering
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Menunggu Verifikasi':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-label-md text-xs font-bold shadow-2xs whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                        <span>Menunggu Verifikasi</span>
                    </span>
                );
            case 'Diproses':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-label-md text-xs font-bold shadow-2xs whitespace-nowrap">
                        <span className="material-symbols-outlined text-[14px]">sync</span>
                        <span>Sedang Diproses</span>
                    </span>
                );
            case 'Lulus':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-label-md text-xs font-bold shadow-2xs whitespace-nowrap">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Lulus / Diterima</span>
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-label-md text-xs font-bold shadow-2xs whitespace-nowrap">
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                        <span>Ditolak</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-label-md text-xs">
                        {status}
                    </span>
                );
        }
    };

    // Helper: Pagination page numbers generator with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            pages.push(totalPages);
        }
        return pages;
    };

    const isFiltered =
        searchQuery !== '' ||
        statusFilter !== 'Semua' ||
        programFilter !== 'Semua' ||
        genderFilter !== 'Semua';

    return (
        <>
            <Head title="Management Pendaftaran Santri (PPDB)" />

            <div className="flex h-screen bg-surface overflow-hidden font-sans text-on-surface">
                {/* ── SIDEBAR ── */}
                <Sidebar
                    activeNav="Pendaftaran Santri"
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                    pendingRegistrations={stats?.menunggu || 0}
                />

                {/* ── MAIN CONTENT AREA ── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* TOPBAR */}
                    <TopBar
                        user={user}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Cari pendaftar (nama, no. reg, wali, hp)..."
                        setMobileMenuOpen={setMobileMenuOpen}
                        handleLogout={handleLogout}
                    />

                    {/* MAIN CONTAINER */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
                        
                        {/* ── TOAST NOTIFICATIONS ── */}
                        {toastMessage && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                                    <div>
                                        <p className="font-bold text-sm">Operasi Berhasil</p>
                                        <p className="text-xs text-emerald-700 mt-0.5">{toastMessage}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setToastMessage('')}
                                    className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}

                        {toastError && (
                            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-rose-600 text-2xl">error</span>
                                    <div>
                                        <p className="font-bold text-sm">Terjadi Kendala</p>
                                        <p className="text-xs text-rose-700 mt-0.5">{toastError}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setToastError('')}
                                    className="p-1 rounded-lg text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}

                        {/* ── PAGE HEADER ── */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase">
                                        PPDB &amp; Pendaftaran Santri MTAS
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-[11px] font-bold">
                                        Tahun Ajaran {new Date().getFullYear()}
                                    </span>
                                </div>
                                <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface">
                                    Management Pendaftaran Santri
                                </h1>
                                <p className="font-body-md text-sm text-outline mt-1">
                                    Kelola formulir masuk, verifikasi kelengkapan berkas wali, dan seleksi kelulusan calon santri sebelum dimasukkan ke database santri aktif.
                                </p>
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                <a
                                    href="/admin/pendaftaran/export"
                                    className="h-11 px-4 flex items-center gap-2 border border-outline-variant bg-surface-container-lowest rounded-xl font-label-md text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-outline">file_download</span>
                                    <span>Ekspor CSV</span>
                                </a>

                                <button
                                    onClick={() => {
                                        setFormData(initialForm);
                                        setPhotoPreview(null);
                                        setShowAddModal(true);
                                    }}
                                    className="h-11 px-5 bg-gradient-to-r from-primary to-indigo-600 text-white font-label-md text-sm rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-primary/25 hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer shrink-0 font-bold"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    <span>Tambah Pendaftar Offline</span>
                                </button>
                            </div>
                        </div>

                        {/* ── BENTO STATS CARDS ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-4">
                            {/* 1. Total Pendaftar */}
                            <div 
                                onClick={() => setStatusFilter('Semua')}
                                className={`bg-surface-container-lowest border rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer ${
                                    statusFilter === 'Semua' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">how_to_reg</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-primary font-label-sm text-[10px] font-bold">
                                        Total Masuk
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-xs text-outline mb-0.5">Total Formulir</p>
                                    <h3 className="font-headline-lg text-2xl font-black text-on-surface">
                                        {stats?.total ?? pendaftarans.length}
                                    </h3>
                                </div>
                            </div>

                            {/* 2. Menunggu Verifikasi */}
                            <div 
                                onClick={() => setStatusFilter('Menunggu Verifikasi')}
                                className={`bg-surface-container-lowest border rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer ${
                                    statusFilter === 'Menunggu Verifikasi' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-outline-variant'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-amber-700 text-xl">pending_actions</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-[10px] font-bold animate-pulse">
                                        Perlu Ditinjau
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-xs text-outline mb-0.5">Menunggu Verifikasi</p>
                                    <h3 className="font-headline-lg text-2xl font-black text-amber-600">
                                        {stats?.menunggu ?? pendaftarans.filter(p => p.status === 'Menunggu Verifikasi').length}
                                    </h3>
                                </div>
                            </div>

                            {/* 3. Sedang Diproses */}
                            <div 
                                onClick={() => setStatusFilter('Diproses')}
                                className={`bg-surface-container-lowest border rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer ${
                                    statusFilter === 'Diproses' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-outline-variant'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-700 text-xl">psychology</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-label-sm text-[10px] font-bold">
                                        Observasi
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-xs text-outline mb-0.5">Sedang Diproses</p>
                                    <h3 className="font-headline-lg text-2xl font-black text-blue-600">
                                        {stats?.diproses ?? pendaftarans.filter(p => p.status === 'Diproses').length}
                                    </h3>
                                </div>
                            </div>

                            {/* 4. Dinyatakan Lulus */}
                            <div 
                                onClick={() => setStatusFilter('Lulus')}
                                className={`bg-surface-container-lowest border rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer ${
                                    statusFilter === 'Lulus' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-outline-variant'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-700 text-xl">verified</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[10px] font-bold">
                                        Diterima
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-xs text-outline mb-0.5">Lulus (Masuk Santri)</p>
                                    <h3 className="font-headline-lg text-2xl font-black text-emerald-600">
                                        {stats?.lulus ?? pendaftarans.filter(p => p.status === 'Lulus').length}
                                    </h3>
                                </div>
                            </div>

                            {/* 5. Ditolak */}
                            <div 
                                onClick={() => setStatusFilter('Ditolak')}
                                className={`bg-surface-container-lowest border rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                                    statusFilter === 'Ditolak' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-outline-variant'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-rose-700 text-xl">block</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-label-sm text-[10px] font-bold">
                                        Ditolak
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-xs text-outline mb-0.5">Tidak Lulus</p>
                                    <h3 className="font-headline-lg text-2xl font-black text-rose-600">
                                        {stats?.ditolak ?? pendaftarans.filter(p => p.status === 'Ditolak').length}
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
                                        placeholder="Cari nama santri, no. reg, orang tua, no HP..."
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
                                    {/* Status Filter */}
                                    <div className="relative flex items-center">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="h-10 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/70 rounded-xl font-label-md text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:border-outline appearance-none bg-none"
                                        >
                                            <option value="Semua">Semua Status</option>
                                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                            <option value="Diproses">Sedang Diproses</option>
                                            <option value="Lulus">Lulus / Diterima</option>
                                            <option value="Ditolak">Ditolak</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Program Filter */}
                                    <div className="relative flex items-center">
                                        <select
                                            value={programFilter}
                                            onChange={(e) => setProgramFilter(e.target.value)}
                                            className="h-10 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/70 rounded-xl font-label-md text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:border-outline appearance-none bg-none"
                                        >
                                            <option value="Semua">Semua Program</option>
                                            <option value="Maktab Tuli As-Sami">Maktab Tuli As-Sami</option>
                                            <option value="Maktab Autis">Maktab Autis</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Gender Filter */}
                                    <div className="relative flex items-center">
                                        <select
                                            value={genderFilter}
                                            onChange={(e) => setGenderFilter(e.target.value)}
                                            className="h-10 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/70 rounded-xl font-label-md text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:border-outline appearance-none bg-none"
                                        >
                                            <option value="Semua">Semua JK</option>
                                            <option value="Laki-laki">Laki-laki (Ikhwan)</option>
                                            <option value="Perempuan">Perempuan (Akhwat)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Reset Filters */}
                                    {isFiltered && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setStatusFilter('Semua');
                                                setProgramFilter('Semua');
                                                setGenderFilter('Semua');
                                            }}
                                            className="h-10 px-3 flex items-center gap-1.5 text-xs text-error hover:bg-error-container/30 rounded-xl transition cursor-pointer font-semibold"
                                            title="Reset semua filter"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                            <span>Reset</span>
                                        </button>
                                    )}

                                    {/* View Mode Toggle */}
                                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/70">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                viewMode === 'table'
                                                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                    : 'text-outline hover:text-on-surface'
                                            }`}
                                            title="Tampilan Tabel"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">view_list</span>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                viewMode === 'grid'
                                                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                    : 'text-outline hover:text-on-surface'
                                            }`}
                                            title="Tampilan Kartu Bento"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Action Bar if items selected */}
                            {selectedIds.length > 0 && (
                                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                        <span className="material-symbols-outlined text-[18px]">checklist</span>
                                        <span>{selectedIds.length} calon santri terpilih</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => triggerBulkActionModal('lulus')}
                                            className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">verified</span>
                                            <span>Luluskan Terpilih</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => triggerBulkActionModal('diproses')}
                                            className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">sync</span>
                                            <span>Set Diproses</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => triggerBulkActionModal('delete')}
                                            className="h-8 px-3 rounded-lg bg-error hover:bg-error/90 text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                            <span>Hapus</span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedIds([])}
                                            className="h-8 px-2 text-xs text-outline hover:text-on-surface cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── DATA VIEW (TABLE OR GRID) ── */}
                        {viewMode === 'table' ? (
                            /* TABLE VIEW */
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-outline-variant bg-surface-container-low/70 font-label-md text-xs text-outline uppercase tracking-wider">
                                                <th className="py-4 px-4 w-12 text-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={
                                                            paginatedPendaftarans.length > 0 &&
                                                            paginatedPendaftarans.every((p) => selectedIds.includes(p.id))
                                                        }
                                                        className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                                                    />
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap">No. Registrasi</th>
                                                <th className="py-4 px-4 min-w-[240px]">Calon Santri</th>
                                                <th className="py-4 px-4 whitespace-nowrap">Program</th>
                                                <th className="py-4 px-4 min-w-[200px]">Orang Tua / Wali</th>
                                                <th className="py-4 px-4 text-center whitespace-nowrap">Berkas Persyaratan</th>
                                                <th className="py-4 px-4 whitespace-nowrap">Status Verifikasi</th>
                                                <th className="py-4 px-4 text-right whitespace-nowrap">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/60 font-body-sm text-xs">
                                            {paginatedPendaftarans.map((p) => {
                                                const isSelected = selectedIds.includes(p.id);
                                                return (
                                                    <tr
                                                        key={p.id}
                                                        className={`hover:bg-surface-container-low/60 transition-colors ${
                                                            isSelected ? 'bg-primary/5' : ''
                                                        }`}
                                                    >
                                                        {/* Checkbox */}
                                                        <td className="py-4 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleSelectOne(p.id)}
                                                                className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                                                            />
                                                        </td>

                                                        {/* No. Registrasi & Tanggal */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md w-fit">
                                                                    {p.no_pendaftaran || `REG-${p.id}`}
                                                                </span>
                                                                <span className="text-[11px] text-outline flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                                                                    <span>{p.created_at || '-'}</span>
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Calon Santri (Foto, Nama, JK, TTL, Domisili) */}
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-start gap-3">
                                                                <div 
                                                                    onClick={() => p.foto_santri && openDocPreview(`Foto Santri: ${p.nama_lengkap}`, p.foto_santri)}
                                                                    className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden border border-outline-variant/80 shrink-0 flex items-center justify-center cursor-pointer group relative shadow-2xs"
                                                                >
                                                                    {p.foto_santri ? (
                                                                        <>
                                                                            <img
                                                                                src={p.foto_santri}
                                                                                alt={p.nama_lengkap}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                                <span className="material-symbols-outlined text-white text-[16px]">visibility</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <span className="material-symbols-outlined text-outline text-2xl">
                                                                            person
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span 
                                                                            onClick={() => openDetailModal(p)}
                                                                            className="font-bold text-on-surface text-sm hover:text-primary transition cursor-pointer truncate"
                                                                        >
                                                                            {p.nama_lengkap}
                                                                        </span>
                                                                        <span className={`px-2 py-0.2 rounded-full font-label-sm text-[10px] font-bold shrink-0 ${
                                                                            p.jenis_kelamin === 'Laki-laki'
                                                                                ? 'bg-blue-100 text-blue-700'
                                                                                : 'bg-rose-100 text-rose-700'
                                                                        }`}>
                                                                            {p.jenis_kelamin === 'Laki-laki' ? 'L (Ikhwan)' : 'P (Akhwat)'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                                                                        <span>{p.tempat_lahir || '-'}</span>
                                                                        <span>•</span>
                                                                        <span>{p.tanggal_lahir_formatted || p.tanggal_lahir || '-'}</span>
                                                                        {p.umur && (
                                                                            <span className="px-1.5 py-0.2 bg-surface-container text-on-surface-variant font-semibold rounded text-[10px]">
                                                                                {p.umur} thn
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {p.alamat_domisili && (
                                                                        <p className="text-[11px] text-outline/90 truncate max-w-xs mt-0.5">
                                                                            {p.alamat_domisili}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Program Maktab */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                                                                p.jenis_maktab === 'Maktab Tuli As-Sami'
                                                                    ? 'bg-blue-50 text-primary border-blue-200'
                                                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                                            }`}>
                                                                <span className="material-symbols-outlined text-[16px]">
                                                                    {p.jenis_maktab === 'Maktab Tuli As-Sami' ? 'hearing_disabled' : 'psychology'}
                                                                </span>
                                                                <span>{p.jenis_maktab}</span>
                                                            </span>
                                                        </td>

                                                        {/* Orang Tua / Wali */}
                                                        <td className="py-4 px-4">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-bold text-on-surface">{p.nama_ortu || '-'}</span>
                                                                {p.pekerjaan_ortu && (
                                                                    <span className="text-[11px] text-outline truncate max-w-[160px]">{p.pekerjaan_ortu}</span>
                                                                )}
                                                                {p.no_hp_ortu && (
                                                                    <a
                                                                        href={`https://wa.me/${p.no_hp_ortu.replace(/[^0-9]/g, '')}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-mono text-[11px] font-bold w-fit transition"
                                                                        title="Hubungi via WhatsApp"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[13px] text-emerald-600">chat</span>
                                                                        <span>{p.no_hp_ortu}</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Dokumen & Berkas (KK, KTP, Foto) */}
                                                        <td className="py-4 px-4 text-center whitespace-nowrap">
                                                            <div className="inline-flex flex-col items-center gap-1">
                                                                <div className="inline-flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/60">
                                                                    {/* Foto */}
                                                                    <button
                                                                        onClick={() => p.foto_santri && openDocPreview(`Foto Santri: ${p.nama_lengkap}`, p.foto_santri)}
                                                                        disabled={!p.foto_santri}
                                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                                                                            p.foto_santri
                                                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer shadow-2xs'
                                                                                : 'bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed'
                                                                        }`}
                                                                        title={p.foto_santri ? 'Lihat Foto Santri' : 'Foto belum ada'}
                                                                    >
                                                                        <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                                                                    </button>

                                                                    {/* KK */}
                                                                    <button
                                                                        onClick={() => p.kartu_keluarga && openDocPreview(`Kartu Keluarga: ${p.nama_lengkap}`, p.kartu_keluarga)}
                                                                        disabled={!p.kartu_keluarga}
                                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                                                                            p.kartu_keluarga
                                                                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer shadow-2xs'
                                                                                : 'bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed'
                                                                        }`}
                                                                        title={p.kartu_keluarga ? 'Lihat Kartu Keluarga (KK)' : 'KK belum ada'}
                                                                    >
                                                                        <span className="material-symbols-outlined text-[15px]">badge</span>
                                                                    </button>

                                                                    {/* KTP */}
                                                                    <button
                                                                        onClick={() => p.ktp_ortu && openDocPreview(`KTP Orang Tua: ${p.nama_ortu}`, p.ktp_ortu)}
                                                                        disabled={!p.ktp_ortu}
                                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                                                                            p.ktp_ortu
                                                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer shadow-2xs'
                                                                                : 'bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed'
                                                                        }`}
                                                                        title={p.ktp_ortu ? 'Lihat KTP Orang Tua' : 'KTP belum ada'}
                                                                    >
                                                                        <span className="material-symbols-outlined text-[15px]">contact_emergency</span>
                                                                    </button>
                                                                </div>
                                                                <span className={`text-[10px] font-bold ${
                                                                    p.doc_complete ? 'text-emerald-700' : 'text-amber-700'
                                                                }`}>
                                                                    {p.doc_count}/3 Berkas
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Status & Catatan */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1">
                                                                {renderStatusBadge(p.status)}
                                                                {p.catatan_admin && (
                                                                    <span className="text-[11px] text-outline italic truncate max-w-[150px]" title={p.catatan_admin}>
                                                                        "{p.catatan_admin}"
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Action Buttons */}
                                                        <td className="py-4 px-4 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {/* Luluskan & Masukkan Santri Aktif */}
                                                                {p.status !== 'Lulus' ? (
                                                                    <button
                                                                        onClick={() => openLulusModal(p)}
                                                                        className="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-label-md text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95"
                                                                        title="Nyatakan LULUS dan pindahkan ke Santri Management"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                                                        <span>Luluskan</span>
                                                                    </button>
                                                                ) : (
                                                                    <Link
                                                                        href="/admin/santri"
                                                                        className="h-8 px-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-label-md text-[11px] font-bold flex items-center gap-1 transition"
                                                                        title="Lihat profil di Santri Management"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[15px]">school</span>
                                                                        <span>Santri Aktif</span>
                                                                    </Link>
                                                                )}

                                                                {/* Lihat Detail Lengkap */}
                                                                <button
                                                                    onClick={() => openDetailModal(p)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary-fixed/40 transition cursor-pointer"
                                                                    title="Lihat Detail Seluruh Inputan Formulir"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                                </button>

                                                                {/* Ubah Status */}
                                                                <button
                                                                    onClick={() => openStatusModal(p)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                                                                    title="Ubah Status / Catatan Verifikasi"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">fact_check</span>
                                                                </button>

                                                                {/* Edit */}
                                                                <button
                                                                    onClick={() => openEditModal(p)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary-fixed/40 transition cursor-pointer"
                                                                    title="Edit Data Pendaftaran"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </button>

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => openDeleteModal(p)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition cursor-pointer"
                                                                    title="Hapus Data Pendaftaran"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {filteredPendaftarans.length === 0 && (
                                                <tr>
                                                    <td colSpan={8} className="py-16 text-center text-outline font-label-md text-xs">
                                                        <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                                                            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline-variant">
                                                                <span className="material-symbols-outlined text-4xl">
                                                                    person_search
                                                                </span>
                                                            </div>
                                                            <p className="font-bold text-base text-on-surface">Tidak ada data pendaftaran yang cocok</p>
                                                            <p className="text-outline text-xs leading-relaxed">
                                                                Coba periksa kembali kata kunci pencarian atau sesuaikan opsi filter status/program.
                                                            </p>
                                                            {isFiltered && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSearchQuery('');
                                                                        setStatusFilter('Semua');
                                                                        setProgramFilter('Semua');
                                                                        setGenderFilter('Semua');
                                                                    }}
                                                                    className="mt-2 px-4 py-2 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary-container transition cursor-pointer shadow-xs"
                                                                >
                                                                    Reset Semua Filter
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ── TABLE FOOTER & COMPLETE PAGINATION ── */}
                                <div className="p-4 border-t border-outline-variant bg-surface-container-low/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-outline">
                                    {/* Left: Range and total information */}
                                    <div className="flex items-center gap-3">
                                        <span>
                                            Menampilkan <strong className="text-on-surface font-bold">{totalItems === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-on-surface font-bold">{endIndex}</strong> dari <strong className="text-on-surface font-bold">{totalItems}</strong> data pendaftaran (Total: {pendaftarans.length})
                                        </span>

                                        {/* Rows per page selector */}
                                        <div className="flex items-center gap-1.5 pl-3 border-l border-outline-variant/60">
                                            <span>Baris:</span>
                                            <div className="relative flex items-center">
                                                <select
                                                    value={itemsPerPage}
                                                    onChange={(e) => {
                                                        setItemsPerPage(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="h-8 pl-2.5 pr-6 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none bg-none"
                                                >
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]">
                                                    expand_more
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Responsive Pagination controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-1 select-none">
                                            {/* First Page */}
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg border border-outline-variant/70 bg-surface-container-lowest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container flex items-center justify-center transition cursor-pointer text-on-surface"
                                                title="Halaman Pertama"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">first_page</span>
                                            </button>

                                            {/* Previous Page */}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="h-8 px-2.5 rounded-lg border border-outline-variant/70 bg-surface-container-lowest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container flex items-center gap-1 transition cursor-pointer text-on-surface font-semibold"
                                                title="Halaman Sebelumnya"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                                <span className="hidden sm:inline">Sebelumnya</span>
                                            </button>

                                            {/* Page Number Buttons */}
                                            <div className="flex items-center gap-1 mx-1">
                                                {getPageNumbers().map((page, idx) => {
                                                    if (page === '...') {
                                                        return (
                                                            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-outline">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <button
                                                            key={`page-${page}`}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-8 h-8 rounded-lg font-label-md text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                                                                currentPage === page
                                                                    ? 'bg-primary text-white shadow-sm'
                                                                    : 'border border-outline-variant/70 bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Next Page */}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="h-8 px-2.5 rounded-lg border border-outline-variant/70 bg-surface-container-lowest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container flex items-center gap-1 transition cursor-pointer text-on-surface font-semibold"
                                                title="Halaman Selanjutnya"
                                            >
                                                <span className="hidden sm:inline">Selanjutnya</span>
                                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                            </button>

                                            {/* Last Page */}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 rounded-lg border border-outline-variant/70 bg-surface-container-lowest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container flex items-center justify-center transition cursor-pointer text-on-surface"
                                                title="Halaman Terakhir"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">last_page</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* GRID / BENTO CARDS VIEW */
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {paginatedPendaftarans.map((p) => (
                                        <div
                                            key={p.id}
                                            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                                        >
                                            <div>
                                                {/* Card Top: No Reg & Status */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                                                        {p.no_pendaftaran || `REG-${p.id}`}
                                                    </span>
                                                    {renderStatusBadge(p.status)}
                                                </div>

                                                {/* Profile Info */}
                                                <div className="flex items-start gap-3.5 mb-4">
                                                    <div 
                                                        onClick={() => p.foto_santri && openDocPreview(`Foto Santri: ${p.nama_lengkap}`, p.foto_santri)}
                                                        className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden border border-outline-variant shrink-0 flex items-center justify-center cursor-pointer group-hover:ring-2 ring-primary/30 transition shadow-2xs"
                                                    >
                                                        {p.foto_santri ? (
                                                            <img
                                                                src={p.foto_santri}
                                                                alt={p.nama_lengkap}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-outline text-2xl">
                                                                person
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 
                                                            onClick={() => openDetailModal(p)}
                                                            className="font-headline-sm text-base font-bold text-on-surface truncate cursor-pointer hover:text-primary transition"
                                                        >
                                                            {p.nama_lengkap}
                                                        </h3>
                                                        <p className="font-label-md text-xs text-primary font-semibold truncate mt-0.5">
                                                            {p.jenis_maktab}
                                                        </p>
                                                        <p className="text-[11px] text-outline mt-1">
                                                            {p.jenis_kelamin} • {p.umur ? `${p.umur} thn` : (p.tempat_lahir || '-')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Details Snippets */}
                                                <div className="space-y-2 bg-surface-container-low p-3.5 rounded-xl text-xs font-body-sm mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-outline">Wali:</span>
                                                        <span className="font-semibold text-on-surface truncate max-w-[150px]">{p.nama_ortu}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-outline">WhatsApp:</span>
                                                        {p.no_hp_ortu ? (
                                                            <a
                                                                href={`https://wa.me/${p.no_hp_ortu.replace(/[^0-9]/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-mono text-emerald-600 font-bold hover:underline"
                                                            >
                                                                {p.no_hp_ortu}
                                                            </a>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-outline">Dokumen:</span>
                                                        <span className={`font-label-sm text-[11px] font-bold ${
                                                            p.doc_complete ? 'text-emerald-700' : 'text-amber-700'
                                                        }`}>
                                                            {p.doc_count}/3 Berkas Lengkap
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Footer Actions */}
                                            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                                                <button
                                                    onClick={() => openDetailModal(p)}
                                                    className="flex-1 h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                    <span>Detail</span>
                                                </button>

                                                {p.status !== 'Lulus' ? (
                                                    <button
                                                        onClick={() => openLulusModal(p)}
                                                        className="flex-1 h-9 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-label-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                                        <span>Luluskan</span>
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href="/admin/santri"
                                                        className="flex-1 h-9 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-label-md text-xs font-bold flex items-center justify-center gap-1.5 transition"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">school</span>
                                                        <span>Santri Aktif</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Pagination Footer */}
                                {totalPages > 1 && (
                                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline">
                                        <span>
                                            Menampilkan <strong className="text-on-surface">{startIndex + 1}</strong> - <strong className="text-on-surface">{endIndex}</strong> dari <strong className="text-on-surface">{totalItems}</strong> calon santri
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 rounded-lg border border-outline-variant/70 disabled:opacity-30 hover:bg-surface-container transition cursor-pointer font-semibold"
                                            >
                                                Sebelumnya
                                            </button>
                                            <span className="px-3 py-1.5 font-label-md font-bold text-on-surface">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 rounded-lg border border-outline-variant/70 disabled:opacity-30 hover:bg-surface-container transition cursor-pointer font-semibold"
                                            >
                                                Selanjutnya
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 1: DETAIL LENGKAP PENDAFTARAN (DISPLAY ALL USER INPUTS) ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showDetailModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp">
                        {/* Header (Fixed) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[26px]">how_to_reg</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                            Detail Formulir Pendaftaran Santri
                                        </h3>
                                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">
                                            {selectedPendaftaran.no_pendaftaran || `REG-${selectedPendaftaran.id}`}
                                        </span>
                                    </div>
                                    <p className="font-body-sm text-xs text-outline mt-0.5">
                                        Seluruh data dan berkas yang telah diinput orang tua calon santri pada form online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                                title="Tutup"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 font-body-sm text-xs flex-1">
                            
                            {/* Status Banner */}
                            <div className="p-4 rounded-2xl border border-outline-variant/70 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-outline text-[11px]">Status Saat Ini:</span>
                                    <div className="mt-1 flex items-center gap-2">
                                        {renderStatusBadge(selectedPendaftaran.status)}
                                        <span className="text-outline text-[11px]">
                                            (Didaftarkan: {selectedPendaftaran.created_at || '-'})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedPendaftaran.status !== 'Lulus' ? (
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                openLulusModal(selectedPendaftaran);
                                            }}
                                            className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:shadow-lg transition cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            <span>Nyatakan Lulus &amp; Pindahkan</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-label-md text-xs font-bold">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            <span>Sudah Masuk Database Santri Aktif</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SECTION 1: DATA CALON SANTRI */}
                            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-4">
                                <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
                                    <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                    <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                                        1. Data Lengkap Calon Santri
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Nama Lengkap Santri
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl font-bold text-on-surface text-sm">
                                            {selectedPendaftaran.nama_lengkap}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Pilihan Program Maktab
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl font-bold text-primary text-sm flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">
                                                {selectedPendaftaran.jenis_maktab === 'Maktab Tuli As-Sami' ? 'hearing_disabled' : 'psychology'}
                                            </span>
                                            <span>{selectedPendaftaran.jenis_maktab}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Tempat &amp; Tanggal Lahir
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl font-semibold text-on-surface">
                                            {selectedPendaftaran.tempat_lahir || '-'}, {selectedPendaftaran.tanggal_lahir_formatted || selectedPendaftaran.tanggal_lahir || '-'}
                                            {selectedPendaftaran.umur && (
                                                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-label-md text-[10px] font-bold">
                                                    {selectedPendaftaran.umur} Tahun
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Jenis Kelamin
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl font-semibold text-on-surface flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                selectedPendaftaran.jenis_kelamin === 'Laki-laki'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {selectedPendaftaran.jenis_kelamin} ({selectedPendaftaran.jenis_kelamin === 'Laki-laki' ? 'Ikhwan' : 'Akhwat'})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Alamat Domisili Tempat Tinggal
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl text-on-surface leading-relaxed">
                                            {selectedPendaftaran.alamat_domisili || 'Tidak dicantumkan'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: DATA ORANG TUA / WALI */}
                            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-4">
                                <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
                                    <span className="material-symbols-outlined text-[#D38B1D] text-[20px]">family_restroom</span>
                                    <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                                        2. Data Orang Tua / Wali
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Nama Orang Tua / Wali
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl font-bold text-on-surface">
                                            {selectedPendaftaran.nama_ortu}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Nomor HP / WhatsApp
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                                            <span className="font-mono font-bold text-on-surface">{selectedPendaftaran.no_hp_ortu}</span>
                                            {selectedPendaftaran.no_hp_ortu && (
                                                <a
                                                    href={`https://wa.me/${selectedPendaftaran.no_hp_ortu.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-label-md text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">chat</span>
                                                    <span>Chat WA</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Pekerjaan Orang Tua
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl text-on-surface font-semibold">
                                            {selectedPendaftaran.pekerjaan_ortu || '-'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
                                            Alamat Orang Tua
                                        </label>
                                        <div className="p-3 bg-surface-container-low rounded-xl text-on-surface">
                                            {selectedPendaftaran.alamat_ortu || selectedPendaftaran.alamat_domisili || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: UNGGAHAN DOKUMEN & BERKAS PERSYARATAN */}
                            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-4">
                                <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
                                    <span className="material-symbols-outlined text-primary text-[20px]">folder_shared</span>
                                    <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                                        3. Dokumen &amp; Berkas Persyaratan Terunggah
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Foto Santri */}
                                    <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-low flex flex-col items-center justify-between text-center space-y-3">
                                        <span className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[16px]">photo_camera</span>
                                            Foto Profil Santri
                                        </span>
                                        <div className="w-24 h-24 rounded-xl bg-white border overflow-hidden flex items-center justify-center shadow-2xs">
                                            {selectedPendaftaran.foto_santri ? (
                                                <img
                                                    src={selectedPendaftaran.foto_santri}
                                                    alt="Foto Santri"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-outline text-[11px]">Belum diunggah</span>
                                            )}
                                        </div>
                                        {selectedPendaftaran.foto_santri && (
                                            <button
                                                onClick={() => openDocPreview(`Foto ${selectedPendaftaran.nama_lengkap}`, selectedPendaftaran.foto_santri)}
                                                className="w-full py-1.5 px-3 bg-primary text-white rounded-xl font-label-md text-xs font-bold hover:bg-primary/90 transition flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                <span>Lihat Penuh</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Kartu Keluarga */}
                                    <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-low flex flex-col items-center justify-between text-center space-y-3">
                                        <span className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-amber-700 text-[16px]">badge</span>
                                            Kartu Keluarga (KK)
                                        </span>
                                        <div className="w-24 h-24 rounded-xl bg-white border overflow-hidden flex items-center justify-center p-2 shadow-2xs">
                                            {selectedPendaftaran.kartu_keluarga ? (
                                                <span className="material-symbols-outlined text-amber-600 text-4xl">
                                                    description
                                                </span>
                                            ) : (
                                                <span className="text-outline text-[11px]">Belum diunggah</span>
                                            )}
                                        </div>
                                        {selectedPendaftaran.kartu_keluarga && (
                                            <button
                                                onClick={() => openDocPreview(`Kartu Keluarga: ${selectedPendaftaran.nama_lengkap}`, selectedPendaftaran.kartu_keluarga)}
                                                className="w-full py-1.5 px-3 bg-amber-600 text-white rounded-xl font-label-md text-xs font-bold hover:bg-amber-700 transition flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                <span>Buka Berkas</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* KTP Orang Tua */}
                                    <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-low flex flex-col items-center justify-between text-center space-y-3">
                                        <span className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-emerald-700 text-[16px]">contact_emergency</span>
                                            KTP Orang Tua
                                        </span>
                                        <div className="w-24 h-24 rounded-xl bg-white border overflow-hidden flex items-center justify-center p-2 shadow-2xs">
                                            {selectedPendaftaran.ktp_ortu ? (
                                                <span className="material-symbols-outlined text-emerald-600 text-4xl">
                                                    credit_card
                                                </span>
                                            ) : (
                                                <span className="text-outline text-[11px]">Belum diunggah</span>
                                            )}
                                        </div>
                                        {selectedPendaftaran.ktp_ortu && (
                                            <button
                                                onClick={() => openDocPreview(`KTP Orang Tua: ${selectedPendaftaran.nama_ortu}`, selectedPendaftaran.ktp_ortu)}
                                                className="w-full py-1.5 px-3 bg-emerald-600 text-white rounded-xl font-label-md text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                <span>Buka Berkas</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: KETERANGAN TAMBAHAN / RIWAYAT MEDIS */}
                            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-3">
                                <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
                                    <span className="material-symbols-outlined text-outline text-[20px]">medical_services</span>
                                    <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                                        4. Keterangan Tambahan / Riwayat Medis Santri
                                    </h4>
                                </div>
                                <div className="p-3.5 bg-surface-container-low rounded-xl text-on-surface leading-relaxed text-xs">
                                    {selectedPendaftaran.keterangan_tambahan || 'Tidak ada catatan atau riwayat khusus yang diisi oleh wali.'}
                                </div>
                            </div>

                            {/* SECTION 5: CATATAN INTERNAL ADMIN */}
                            {selectedPendaftaran.catatan_admin && (
                                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-700 text-[18px]">edit_note</span>
                                        <h4 className="font-bold text-amber-900 text-xs">Catatan Verifikasi Admin</h4>
                                    </div>
                                    <p className="text-amber-800 text-xs leading-relaxed">{selectedPendaftaran.catatan_admin}</p>
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-between gap-3 shrink-0">
                            <button
                                onClick={() => openEditModal(selectedPendaftaran)}
                                className="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Koreksi Data</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                                >
                                    Tutup
                                </button>
                                {selectedPendaftaran.status !== 'Lulus' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            openLulusModal(selectedPendaftaran);
                                        }}
                                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-label-md text-xs font-bold hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                        <span>Luluskan Santri</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 2: KONFIRMASI KELULUSAN (TRANSFER KE SANTRI MANAGEMENT) ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showLulusModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleUp">
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-outline-variant flex items-center gap-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">verified</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm text-lg font-bold">
                                    Nyatakan LULUS &amp; Masukkan ke Santri Aktif
                                </h3>
                                <p className="text-emerald-100 text-xs mt-0.5">
                                    Data akan otomatis dipindahkan ke halaman Santri Management
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitLuluskan} className="p-6 space-y-4 font-body-sm text-xs">
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed">
                                Calon santri <strong className="font-bold">{selectedPendaftaran.nama_lengkap}</strong> akan dinyatakan <strong>LULUS</strong> seleksi dan resmi menjadi santri aktif Yayasan Bhakti Arumi.
                            </div>

                            {/* Auto NIS */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Nomor Induk Santri (NIS) Resmi
                                </label>
                                <input
                                    type="text"
                                    value={lulusFormData.nis}
                                    onChange={(e) => setLulusFormData((p) => ({ ...p, nis: e.target.value }))}
                                    required
                                    className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: SAN-2026-013"
                                />
                                <span className="text-[11px] text-outline mt-0.5 block">
                                    Nomor NIS otomatis terbuat dengan nomor urut berikutnya yang unik.
                                </span>
                            </div>

                            {/* Nama Panggilan */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Nama Panggilan Santri
                                </label>
                                <input
                                    type="text"
                                    value={lulusFormData.nama_panggilan}
                                    onChange={(e) => setLulusFormData((p) => ({ ...p, nama_panggilan: e.target.value }))}
                                    className="w-full h-10 px-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Rizky"
                                />
                            </div>

                            {/* Program Maktab */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Program Maktab Penempatan
                                </label>
                                <div className="relative flex items-center">
                                    <select
                                        value={lulusFormData.program}
                                        onChange={(e) => setLulusFormData((p) => ({ ...p, program: e.target.value }))}
                                        className="w-full h-10 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                    >
                                        <option value="Maktab Tuli As-Sami">Maktab Tuli As-Sami</option>
                                        <option value="Maktab Autis">Maktab Autis</option>
                                        <option value="Maktab Tuli As-Sami & Inklusi">Maktab Tuli As-Sami &amp; Inklusi</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {/* Tanggal Resmi Masuk */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Tanggal Resmi Mulai Belajar (Tanggal Masuk)
                                </label>
                                <input
                                    type="date"
                                    value={lulusFormData.tanggal_masuk}
                                    onChange={(e) => setLulusFormData((p) => ({ ...p, tanggal_masuk: e.target.value }))}
                                    required
                                    className="w-full h-10 px-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                />
                            </div>

                            {/* Catatan Admin */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Catatan Verifikasi Kelulusan
                                </label>
                                <textarea
                                    value={lulusFormData.catatan_admin}
                                    onChange={(e) => setLulusFormData((p) => ({ ...p, catatan_admin: e.target.value }))}
                                    rows={2}
                                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLulusModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-label-md text-xs font-bold hover:opacity-95 shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                    )}
                                    <span>Konfirmasi &amp; Masukkan ke Santri</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 3: UBAH STATUS PENDAFTARAN (DIPROSES / DITOLAK) ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showStatusModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleUp">
                        <div className="p-5 pb-4 border-b border-outline-variant flex items-center justify-between">
                            <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-600">fact_check</span>
                                <span>Ubah Status Pendaftaran</span>
                            </h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={submitUpdateStatus} className="p-5 space-y-4 font-body-sm text-xs">
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Pilih Status Baru
                                </label>
                                <div className="relative flex items-center">
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                                        className="w-full h-11 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant rounded-xl font-label-md text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                    >
                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                        <option value="Diproses">Diproses (Jadwal Observasi/Wawancara)</option>
                                        <option value="Lulus">Lulus / Diterima (Pindah ke Santri Aktif)</option>
                                        <option value="Ditolak">Ditolak / Belum Memenuhi Syarat</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1">
                                    Catatan / Alasan (Opsional)
                                </label>
                                <textarea
                                    value={formData.catatan_admin}
                                    onChange={(e) => setFormData((p) => ({ ...p, catatan_admin: e.target.value }))}
                                    rows={3}
                                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Tuliskan catatan internal admin, misal: 'Jadwal wawancara dijadwalkan tanggal 5 September'..."
                                />
                            </div>

                            <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary/90 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    <span>Simpan Status</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 4: TAMBAH PENDAFTARAN MANUAL (OFFLINE WALK-IN) ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Tambah Pendaftaran Santri (Offline)</h3>
                                    <p className="font-body-sm text-xs text-outline">Entri data pendaftar santri yang mendaftar langsung di kantor yayasan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const d = new FormData();
                            Object.keys(formData).forEach(k => {
                                if (formData[k] !== null && formData[k] !== undefined) {
                                    d.append(k, formData[k]);
                                }
                            });
                            router.post('/admin/pendaftaran', d, {
                                forceFormData: true,
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsSubmitting(false);
                                    setShowAddModal(false);
                                },
                                onError: () => setIsSubmitting(false),
                            });
                        }} className="flex flex-col flex-1 min-h-0">
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-body-sm text-xs flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nama Lengkap Santri *</label>
                                        <input
                                            type="text"
                                            value={formData.nama_lengkap}
                                            onChange={(e) => setFormData(p => ({ ...p, nama_lengkap: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nama lengkap santri"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Program Maktab *</label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={formData.jenis_maktab}
                                                onChange={(e) => setFormData(p => ({ ...p, jenis_maktab: e.target.value }))}
                                                className="w-full h-10 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="Maktab Tuli As-Sami">Maktab Tuli As-Sami</option>
                                                <option value="Maktab Autis">Maktab Autis</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Jenis Kelamin *</label>
                                        <div className="flex gap-4 items-center h-10">
                                            {['Laki-laki', 'Perempuan'].map(jk => (
                                                <label key={jk} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="jk_manual"
                                                        checked={formData.jenis_kelamin === jk}
                                                        onChange={() => setFormData(p => ({ ...p, jenis_kelamin: jk }))}
                                                        className="text-primary focus:ring-primary/20"
                                                    />
                                                    <span>{jk}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={formData.tanggal_lahir}
                                            onChange={(e) => setFormData(p => ({ ...p, tanggal_lahir: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={formData.tempat_lahir}
                                            onChange={(e) => setFormData(p => ({ ...p, tempat_lahir: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Kota kelahiran"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nama Orang Tua / Wali *</label>
                                        <input
                                            type="text"
                                            value={formData.nama_ortu}
                                            onChange={(e) => setFormData(p => ({ ...p, nama_ortu: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nama ayah atau ibu"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nomor HP / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            value={formData.no_hp_ortu}
                                            onChange={(e) => setFormData(p => ({ ...p, no_hp_ortu: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="081234567890"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Pekerjaan Orang Tua</label>
                                        <input
                                            type="text"
                                            value={formData.pekerjaan_ortu}
                                            onChange={(e) => setFormData(p => ({ ...p, pekerjaan_ortu: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Pekerjaan"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-on-surface mb-1">Alamat Domisili</label>
                                        <textarea
                                            value={formData.alamat_domisili}
                                            onChange={(e) => setFormData(p => ({ ...p, alamat_domisili: e.target.value }))}
                                            rows={2}
                                            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Alamat lengkap tempat tinggal"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-on-surface mb-1">Keterangan / Riwayat Medis</label>
                                        <textarea
                                            value={formData.keterangan_tambahan}
                                            onChange={(e) => setFormData(p => ({ ...p, keterangan_tambahan: e.target.value }))}
                                            rows={2}
                                            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Catatan khusus atau riwayat medis"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary/90 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    <span>Simpan Pendaftaran</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 5: EDIT DATA PENDAFTARAN ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showEditModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">edit</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Edit Data Pendaftaran</h3>
                                    <p className="font-body-sm text-xs text-outline">{selectedPendaftaran.nama_lengkap} ({selectedPendaftaran.no_pendaftaran})</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="flex flex-col flex-1 min-h-0">
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-body-sm text-xs flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nama Lengkap Santri *</label>
                                        <input
                                            type="text"
                                            value={editFormData.nama_lengkap}
                                            onChange={(e) => setEditFormData(p => ({ ...p, nama_lengkap: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Program Maktab *</label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={editFormData.jenis_maktab}
                                                onChange={(e) => setEditFormData(p => ({ ...p, jenis_maktab: e.target.value }))}
                                                className="w-full h-10 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="Maktab Tuli As-Sami">Maktab Tuli As-Sami</option>
                                                <option value="Maktab Autis">Maktab Autis</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={editFormData.tempat_lahir}
                                            onChange={(e) => setEditFormData(p => ({ ...p, tempat_lahir: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={editFormData.tanggal_lahir}
                                            onChange={(e) => setEditFormData(p => ({ ...p, tanggal_lahir: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nama Orang Tua / Wali *</label>
                                        <input
                                            type="text"
                                            value={editFormData.nama_ortu}
                                            onChange={(e) => setEditFormData(p => ({ ...p, nama_ortu: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Nomor HP / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            value={editFormData.no_hp_ortu}
                                            onChange={(e) => setEditFormData(p => ({ ...p, no_hp_ortu: e.target.value }))}
                                            required
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Pekerjaan Orang Tua</label>
                                        <input
                                            type="text"
                                            value={editFormData.pekerjaan_ortu}
                                            onChange={(e) => setEditFormData(p => ({ ...p, pekerjaan_ortu: e.target.value }))}
                                            className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-on-surface mb-1">Status Pendaftaran</label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={editFormData.status}
                                                onChange={(e) => setEditFormData(p => ({ ...p, status: e.target.value }))}
                                                className="w-full h-10 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                                <option value="Diproses">Diproses</option>
                                                <option value="Lulus">Lulus</option>
                                                <option value="Ditolak">Ditolak</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-on-surface mb-1">Alamat Domisili Santri</label>
                                        <textarea
                                            value={editFormData.alamat_domisili}
                                            onChange={(e) => setEditFormData(p => ({ ...p, alamat_domisili: e.target.value }))}
                                            rows={2}
                                            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block font-bold text-on-surface mb-1">Keterangan Tambahan / Riwayat</label>
                                        <textarea
                                            value={editFormData.keterangan_tambahan}
                                            onChange={(e) => setEditFormData(p => ({ ...p, keterangan_tambahan: e.target.value }))}
                                            rows={2}
                                            className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary/90 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    <span>Simpan Perubahan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 6: HAPUS PENDAFTARAN ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showDeleteModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-scaleUp">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-error flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-3xl">delete_forever</span>
                        </div>
                        <div className="text-center">
                            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Hapus Pendaftaran Ini?</h3>
                            <p className="text-outline text-xs mt-1.5 leading-relaxed">
                                Apakah Anda yakin ingin menghapus data formulir calon santri <strong className="text-on-surface">{selectedPendaftaran.nama_lengkap}</strong> ({selectedPendaftaran.no_pendaftaran})? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-semibold cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitDelete}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-xl bg-error hover:bg-error/90 text-white font-label-md text-xs font-bold shadow-md shadow-error/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                <span>Ya, Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 7: PREVIEW DOKUMEN & FOTO ── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {showDocPreviewModal && (
                <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp border border-outline-variant">
                        <div className="p-4 px-6 border-b border-outline-variant flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-sm text-on-surface truncate">
                                <span className="material-symbols-outlined text-primary">visibility</span>
                                <span className="truncate">{docPreviewData.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={docPreviewData.url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition"
                                    title="Download File"
                                >
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                </a>
                                <button
                                    onClick={() => setShowDocPreviewModal(false)}
                                    className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-surface flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
                            {docPreviewData.type === 'pdf' ? (
                                <iframe
                                    src={docPreviewData.url}
                                    className="w-full h-[65vh] rounded-xl border border-outline-variant"
                                    title="Preview PDF"
                                />
                            ) : (
                                <img
                                    src={docPreviewData.url}
                                    alt={docPreviewData.title}
                                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Aksi Massal Pendaftaran */}
            <ConfirmModal
                isOpen={Boolean(bulkActionToConfirm)}
                onClose={() => setBulkActionToConfirm(null)}
                onConfirm={confirmBulkAction}
                title={
                    bulkActionToConfirm === 'delete'
                        ? 'Hapus Pendaftaran Terpilih?'
                        : bulkActionToConfirm === 'lulus'
                        ? 'Luluskan Santri Terpilih?'
                        : 'Ubah Status Menjadi Diproses?'
                }
                message={
                    bulkActionToConfirm === 'delete'
                        ? `Apakah Anda yakin ingin menghapus ${selectedIds.length} data pendaftaran calon santri terpilih secara permanen? Data yang dihapus tidak dapat dipulihkan.`
                        : bulkActionToConfirm === 'lulus'
                        ? `Apakah Anda yakin ingin MELULUSKAN ${selectedIds.length} calon santri terpilih dan memindahkannya langsung ke Santri Management?`
                        : `Apakah Anda yakin ingin mengubah status ${selectedIds.length} pendaftaran calon santri terpilih menjadi 'Diproses'?`
                }
                confirmText={
                    bulkActionToConfirm === 'delete'
                        ? `Hapus (${selectedIds.length}) Data`
                        : bulkActionToConfirm === 'lulus'
                        ? `Luluskan (${selectedIds.length}) Santri`
                        : `Set Diproses (${selectedIds.length})`
                }
                cancelText="Batal"
                variant={
                    bulkActionToConfirm === 'delete'
                        ? 'danger'
                        : bulkActionToConfirm === 'lulus'
                        ? 'success'
                        : 'primary'
                }
                icon={
                    bulkActionToConfirm === 'delete'
                        ? 'delete_sweep'
                        : bulkActionToConfirm === 'lulus'
                        ? 'school'
                        : 'sync'
                }
                isLoading={isBulkProcessing}
            />
        </>
    );
}
