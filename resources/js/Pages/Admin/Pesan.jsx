import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Elements/Sidebar";
import TopBar from "@/Components/Elements/TopBar";

export default function AdminPesan({ auth, pesanList = [], stats = {}, filters = {} }) {
    const { flash } = usePage().props;
    const user = auth?.user || {
        name: "Admin Utama",
        email: "admin@bhaktiarumi.org",
        role: "Super Admin",
    };

    // Messages state
    const [messages, setMessages] = useState(pesanList);
    useEffect(() => {
        setMessages(pesanList);
    }, [pesanList]);

    // UI & Navigation State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all"); // 'all' | 'unread' | 'read' | 'replied'
    const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

    // Selection & Bulk Actions
    const [selectedIds, setSelectedIds] = useState([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    // Modals
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // single message or 'bulk'
    const [adminNote, setAdminNote] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Toast notification
    const [toastMessage, setToastMessage] = useState(flash?.success || "");
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Filter & Search Messages
    const filteredMessages = useMemo(() => {
        return messages
            .filter((msg) => {
                // Status Filter
                if (statusFilter !== "all" && msg.status !== statusFilter) {
                    return false;
                }
                // Search Query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const matchName = msg.nama?.toLowerCase().includes(q);
                    const matchEmail = msg.email?.toLowerCase().includes(q);
                    const matchPhone = msg.telepon?.toLowerCase().includes(q);
                    const matchSubject = msg.subjek?.toLowerCase().includes(q);
                    const matchContent = msg.pesan?.toLowerCase().includes(q);
                    return matchName || matchEmail || matchPhone || matchSubject || matchContent;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortOrder === "newest") {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
                return new Date(a.created_at) - new Date(b.created_at);
            });
    }, [messages, statusFilter, searchQuery, sortOrder]);

    // Handle Select All Checkbox
    const isAllSelected =
        filteredMessages.length > 0 &&
        filteredMessages.every((m) => selectedIds.includes(m.id));

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredMessages.map((m) => m.id));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Open Detail Modal
    const handleOpenDetail = (msg) => {
        setSelectedMessage(msg);
        setAdminNote(msg.catatan_admin || "");
        setShowDetailModal(true);

        // Auto mark as read if currently unread
        if (msg.status === "unread") {
            handleUpdateStatus(msg.id, "read", false);
        }
    };

    // Handle Status Update (unread / read / replied)
    const handleUpdateStatus = (id, newStatus, showFlash = true) => {
        router.patch(
            `/admin/pesan/${id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessages((prev) =>
                        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
                    );
                    if (selectedMessage && selectedMessage.id === id) {
                        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
                    }
                    if (showFlash) {
                        setToastMessage(`Status pesan berhasil diubah menjadi '${getStatusLabel(newStatus)}'.`);
                        setTimeout(() => setToastMessage(""), 3000);
                    }
                },
            }
        );
    };

    // Handle Save Admin Note
    const handleSaveNote = (e) => {
        e.preventDefault();
        if (!selectedMessage) return;
        setIsSavingNote(true);

        router.patch(
            `/admin/pesan/${selectedMessage.id}/catatan`,
            { catatan_admin: adminNote },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingNote(false);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === selectedMessage.id
                                ? { ...m, catatan_admin: adminNote }
                                : m
                        )
                    );
                    setSelectedMessage((prev) => ({
                        ...prev,
                        catatan_admin: adminNote,
                    }));
                    setToastMessage("Catatan internal admin berhasil disimpan.");
                    setTimeout(() => setToastMessage(""), 3000);
                },
                onError: () => setIsSavingNote(false),
            }
        );
    };

    // Handle Delete Single Message
    const confirmDeleteSingle = (msg) => {
        setItemToDelete(msg);
        setShowDeleteModal(true);
    };

    const confirmDeleteBulk = () => {
        if (selectedIds.length === 0) return;
        setItemToDelete("bulk");
        setShowDeleteModal(true);
    };

    const handleDeleteExecute = () => {
        if (itemToDelete === "bulk") {
            // Bulk Delete
            setIsBulkProcessing(true);
            router.post(
                "/admin/pesan/bulk",
                { action: "delete", ids: selectedIds },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsBulkProcessing(false);
                        setSelectedIds([]);
                        setShowDeleteModal(false);
                        setItemToDelete(null);
                        setToastMessage("Pesan terpilih berhasil dihapus.");
                        setTimeout(() => setToastMessage(""), 3000);
                    },
                    onError: () => setIsBulkProcessing(false),
                }
            );
        } else if (itemToDelete && itemToDelete.id) {
            // Single Delete
            router.delete(`/admin/pesan/${itemToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    if (showDetailModal && selectedMessage?.id === itemToDelete.id) {
                        setShowDetailModal(false);
                    }
                    setItemToDelete(null);
                    setToastMessage("Pesan berhasil dihapus.");
                    setTimeout(() => setToastMessage(""), 3000);
                },
            });
        }
    };

    // Bulk Action Handler (mark_read / mark_unread / mark_replied)
    const handleBulkAction = (action) => {
        if (selectedIds.length === 0) return;
        setIsBulkProcessing(true);

        router.post(
            "/admin/pesan/bulk",
            { action, ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsBulkProcessing(false);
                    setSelectedIds([]);
                    setToastMessage("Aksi massal berhasil diproses.");
                    setTimeout(() => setToastMessage(""), 3000);
                },
                onError: () => setIsBulkProcessing(false),
            }
        );
    };

    // Helpers
    const getStatusBadge = (status) => {
        switch (status) {
            case "unread":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Belum Dibaca
                    </span>
                );
            case "read":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#025EDB] border border-blue-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#025EDB]"></span>
                        Sudah Dibaca
                    </span>
                );
            case "replied":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Sudah Dibalas
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "unread":
                return "Belum Dibaca";
            case "read":
                return "Sudah Dibaca";
            case "replied":
                return "Sudah Dibalas";
            default:
                return status;
        }
    };

    const getWhatsAppUrl = (msg) => {
        if (!msg?.telepon) return null;
        let num = msg.whatsapp_number || msg.telepon.replace(/[^0-9]/g, "");
        if (num.startsWith("0")) {
            num = "62" + num.slice(1);
        }
        const text = encodeURIComponent(
            `Assalamu'alaikum wr. wb. Halo Bpk/Ibu ${msg.nama},\n\nTerima kasih telah menghubungi Yayasan Bhakti Arumi Delangga mengenai "${msg.subjek}".\n\nMenindaklanjuti pesan Anda: `
        );
        return `https://wa.me/${num}?text=${text}`;
    };

    return (
        <div className="flex h-screen bg-surface font-body overflow-hidden">
            <Head title="Monitoring Pesan Masuk - Admin Bhakti Arumi" />

            {/* Sidebar Navigation */}
            <Sidebar
                activeNav="Pesan Masuk"
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Topbar Header */}
                <TopBar
                    user={user}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchPlaceholder="Cari nama, email, subjek, pesan..."
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Toast Notification Alert */}
                    {toastMessage && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-md shadow-emerald-500/5 animate-fadeIn">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                </div>
                                <span className="font-semibold">{toastMessage}</span>
                            </div>
                            <button
                                onClick={() => setToastMessage("")}
                                className="text-emerald-600 hover:text-emerald-900 p-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    )}

                    {/* Page Title & Breadcrumb */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-label-md text-outline mb-1">
                                <span>Admin Console</span>
                                <span>/</span>
                                <span className="text-primary font-bold">Pesan Masuk &amp; Kontak</span>
                            </div>
                            <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                                Monitoring Pesan Masuk
                            </h1>
                            <p className="font-body-sm text-xs md:text-sm text-outline mt-1">
                                Pantau dan respon pesan formulir kontak dari masyarakat dan calon santri.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.reload({ only: ["pesanList", "stats"] })}
                                className="px-4 py-2.5 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant rounded-xl text-xs font-label-md font-semibold text-on-surface flex items-center gap-2 transition shadow-xs cursor-pointer"
                                title="Muat Ulang Data"
                            >
                                <span className="material-symbols-outlined text-[18px] text-outline">refresh</span>
                                <span>Segarkan</span>
                            </button>
                        </div>
                    </div>

                    {/* KPI Statistics Overview Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Total Pesan */}
                        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-label-md text-outline uppercase tracking-wider">
                                    Total Pesan
                                </p>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface mt-1">
                                    {stats?.total ?? messages.length}
                                </h3>
                                <p className="text-[11px] text-outline mt-1">
                                    {stats?.today ? `${stats.today} masuk hari ini` : "Semua riwayat masuk"}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-[24px]">inbox</span>
                            </div>
                        </div>

                        {/* 2. Belum Dibaca (Unread) */}
                        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-label-md text-amber-800 uppercase tracking-wider font-bold">
                                    Belum Dibaca
                                </p>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-amber-950 mt-1">
                                    {stats?.unread ?? messages.filter((m) => m.status === "unread").length}
                                </h3>
                                <p className="text-[11px] text-amber-700 font-medium mt-1">
                                    Perlu tindak lanjut segera
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                                <span className="material-symbols-outlined text-[24px]">mark_chat_unread</span>
                            </div>
                        </div>

                        {/* 3. Sudah Dibaca */}
                        <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-label-md text-[#025EDB] uppercase tracking-wider font-bold">
                                    Sudah Dibaca
                                </p>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-[#002D6E] mt-1">
                                    {stats?.read ?? messages.filter((m) => m.status === "read").length}
                                </h3>
                                <p className="text-[11px] text-[#025EDB]/80 font-medium mt-1">
                                    Telah ditinjau admin
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#025EDB] shrink-0">
                                <span className="material-symbols-outlined text-[24px]">drafts</span>
                            </div>
                        </div>

                        {/* 4. Sudah Dibalas */}
                        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-label-md text-emerald-800 uppercase tracking-wider font-bold">
                                    Sudah Dibalas
                                </p>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mt-1">
                                    {stats?.replied ?? messages.filter((m) => m.status === "replied").length}
                                </h3>
                                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                                    Respon selesai
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                                <span className="material-symbols-outlined text-[24px]">reply</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter, Search & Bulk Actions Bar */}
                    <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-xs space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Status Filter Tabs */}
                            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/60">
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-label-md transition-all cursor-pointer ${
                                        statusFilter === "all"
                                            ? "bg-white text-primary font-bold shadow-xs"
                                            : "text-outline hover:text-on-surface"
                                    }`}
                                >
                                    Semua ({messages.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter("unread")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                        statusFilter === "unread"
                                            ? "bg-amber-100 text-amber-900 font-bold shadow-xs"
                                            : "text-outline hover:text-on-surface"
                                    }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Belum Dibaca ({messages.filter((m) => m.status === "unread").length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter("read")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                        statusFilter === "read"
                                            ? "bg-blue-100 text-[#025EDB] font-bold shadow-xs"
                                            : "text-outline hover:text-on-surface"
                                    }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#025EDB]"></span>
                                    Dibaca ({messages.filter((m) => m.status === "read").length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter("replied")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                        statusFilter === "replied"
                                            ? "bg-emerald-100 text-emerald-900 font-bold shadow-xs"
                                            : "text-outline hover:text-on-surface"
                                    }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                    Dibalas ({messages.filter((m) => m.status === "replied").length})
                                </button>
                            </div>

                            {/* Sort & Search Controls */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="h-10 pl-3 pr-8 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-label-md text-on-surface focus:ring-1 focus:ring-primary cursor-pointer appearance-none bg-none"
                                    >
                                        <option value="newest">Waktu: Paling Baru</option>
                                        <option value="oldest">Waktu: Paling Lama</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                        expand_more
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Action Bar (Visible when items selected) */}
                        {selectedIds.length > 0 && (
                            <div className="p-3 bg-primary-fixed/30 border border-primary-fixed-dim rounded-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
                                <div className="flex items-center gap-2 text-xs font-label-md font-bold text-on-primary-fixed">
                                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                                        {selectedIds.length}
                                    </span>
                                    <span>Pesan dipilih</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => handleBulkAction("mark_read")}
                                        disabled={isBulkProcessing}
                                        className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-[#025EDB] rounded-lg text-xs font-label-md font-semibold transition cursor-pointer"
                                    >
                                        Tandai Dibaca
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("mark_replied")}
                                        disabled={isBulkProcessing}
                                        className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-label-md font-semibold transition cursor-pointer"
                                    >
                                        Tandai Dibalas
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("mark_unread")}
                                        disabled={isBulkProcessing}
                                        className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-label-md font-semibold transition cursor-pointer"
                                    >
                                        Tandai Belum Dibaca
                                    </button>
                                    <button
                                        onClick={confirmDeleteBulk}
                                        disabled={isBulkProcessing}
                                        className="px-3 py-1.5 bg-error/10 hover:bg-error/20 border border-error/30 text-error rounded-lg text-xs font-label-md font-bold transition cursor-pointer"
                                    >
                                        Hapus Terpilih
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages Table Container */}
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
                        {filteredMessages.length === 0 ? (
                            /* Empty State */
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
                                    <span className="material-symbols-outlined text-[36px]">mail_lock</span>
                                </div>
                                <h3 className="text-lg font-bold text-on-surface">Tidak Ada Pesan Ditemukan</h3>
                                <p className="text-xs text-outline mt-1 max-w-md">
                                    {searchQuery
                                        ? `Tidak ada pesan yang cocok dengan kata kunci "${searchQuery}".`
                                        : "Belum ada pesan masuk pada kategori filter ini."}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-4 px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary transition cursor-pointer"
                                    >
                                        Hapus Filter Pencarian
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-outline-variant bg-surface-container-low text-[11px] font-label-md uppercase tracking-wider text-outline">
                                            <th className="py-3.5 px-4 w-10 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                    className="rounded text-primary focus:ring-primary cursor-pointer"
                                                />
                                            </th>
                                            <th className="py-3.5 px-4">Pengirim &amp; Kontak</th>
                                            <th className="py-3.5 px-4">Subjek &amp; Pesan</th>
                                            <th className="py-3.5 px-4">Status</th>
                                            <th className="py-3.5 px-4">Waktu Masuk</th>
                                            <th className="py-3.5 px-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/60 text-sm">
                                        {filteredMessages.map((msg) => {
                                            const isSelected = selectedIds.includes(msg.id);
                                            const isUnread = msg.status === "unread";
                                            const waUrl = getWhatsAppUrl(msg);

                                            return (
                                                <tr
                                                    key={msg.id}
                                                    className={`hover:bg-surface-container-high/40 transition-colors group ${
                                                        isUnread
                                                            ? "bg-amber-50/30 font-semibold"
                                                            : isSelected
                                                            ? "bg-primary-fixed/10"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Select Checkbox */}
                                                    <td className="py-4 px-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggleSelect(msg.id)}
                                                            className="rounded text-primary focus:ring-primary cursor-pointer"
                                                        />
                                                    </td>

                                                    {/* Sender & Contact */}
                                                    <td className="py-4 px-4 min-w-[220px]">
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                                                                    isUnread
                                                                        ? "bg-[#025EDB] text-white"
                                                                        : "bg-surface-container text-on-surface-variant"
                                                                }`}
                                                            >
                                                                {msg.nama ? msg.nama.slice(0, 2).toUpperCase() : "US"}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-bold text-on-surface text-sm truncate">
                                                                        {msg.nama}
                                                                    </span>
                                                                    {isUnread && (
                                                                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-outline truncate font-normal">
                                                                    {msg.email}
                                                                </p>
                                                                {msg.telepon && (
                                                                    <div className="flex items-center gap-1 mt-0.5">
                                                                        <span className="text-[11px] text-outline font-normal">
                                                                            {msg.telepon}
                                                                        </span>
                                                                        {waUrl && (
                                                                            <a
                                                                                href={waUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-emerald-600 hover:text-emerald-700 inline-flex items-center p-0.5"
                                                                                title="Chat WhatsApp"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[14px]">
                                                                                    chat
                                                                                </span>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Subject & Preview */}
                                                    <td className="py-4 px-4 max-w-xs md:max-w-md">
                                                        <button
                                                            onClick={() => handleOpenDetail(msg)}
                                                            className="text-left w-full cursor-pointer focus:outline-none"
                                                        >
                                                            <h4 className="font-bold text-on-surface text-sm hover:text-primary transition-colors truncate">
                                                                {msg.subjek}
                                                            </h4>
                                                            <p className="text-xs text-outline line-clamp-2 mt-0.5 font-normal">
                                                                {msg.pesan}
                                                            </p>
                                                            {msg.catatan_admin && (
                                                                <div className="inline-flex items-center gap-1 text-[11px] text-[#025EDB] bg-blue-50 px-2 py-0.5 rounded-md mt-1 font-medium">
                                                                    <span className="material-symbols-outlined text-[12px]">
                                                                        sticky_note_2
                                                                    </span>
                                                                    <span className="truncate max-w-[200px]">
                                                                        Catatan: {msg.catatan_admin}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <div className="relative inline-block">
                                                            {getStatusBadge(msg.status)}
                                                        </div>
                                                    </td>

                                                    {/* Timestamp */}
                                                    <td className="py-4 px-4 whitespace-nowrap text-xs text-outline font-normal">
                                                        <div>{msg.relative_time}</div>
                                                        <div className="text-[10px] text-outline/70">
                                                            {msg.formatted_date}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-4 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* View / Detail */}
                                                            <button
                                                                onClick={() => handleOpenDetail(msg)}
                                                                className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition cursor-pointer"
                                                                title="Buka Detail Pesan"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    visibility
                                                                </span>
                                                            </button>

                                                            {/* WhatsApp Reply */}
                                                            {waUrl && (
                                                                <a
                                                                    href={waUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 rounded-lg text-outline hover:text-emerald-600 hover:bg-emerald-50 transition"
                                                                    title="Balas via WhatsApp"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">
                                                                        forum
                                                                    </span>
                                                                </a>
                                                            )}

                                                            {/* Email Reply */}
                                                            <a
                                                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                                                                    msg.subjek
                                                                )}`}
                                                                className="p-1.5 rounded-lg text-outline hover:text-blue-600 hover:bg-blue-50 transition"
                                                                title="Balas via Email"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    mail
                                                                </span>
                                                            </a>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => confirmDeleteSingle(msg)}
                                                                className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition cursor-pointer"
                                                                title="Hapus Pesan"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ---------------- MODAL: DETAIL PESAN MASUK ---------------- */}
            {showDetailModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-xs">
                                    <span className="material-symbols-outlined text-[22px]">
                                        mail
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                        Detail Pesan Masuk
                                    </h3>
                                    <p className="font-body-sm text-xs text-outline">
                                        ID #{selectedMessage.id} • Diterima {selectedMessage.formatted_date}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 font-body-sm text-xs flex-1 min-h-0">
                            {/* SECTION 1: INFO PENGIRIM & KONTAK */}
                            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            person
                                        </span>
                                        Informasi Pengirim
                                    </span>
                                    <div>
                                        {getStatusBadge(selectedMessage.status)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <span className="font-label-sm text-outline block mb-0.5 font-semibold">
                                            Nama Lengkap
                                        </span>
                                        <p className="font-bold text-on-surface text-sm">
                                            {selectedMessage.nama}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="font-label-sm text-outline block mb-0.5 font-semibold">
                                            Alamat Email
                                        </span>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-primary hover:underline font-semibold text-sm flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">mail</span>
                                            {selectedMessage.email}
                                        </a>
                                    </div>

                                    <div>
                                        <span className="font-label-sm text-outline block mb-0.5 font-semibold">
                                            Nomor Telepon / WhatsApp
                                        </span>
                                        <p className="font-semibold text-on-surface text-sm">
                                            {selectedMessage.telepon || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="font-label-sm text-outline block mb-0.5 font-semibold">
                                            Waktu Diterima
                                        </span>
                                        <p className="text-outline text-xs">
                                            {selectedMessage.formatted_date} ({selectedMessage.relative_time})
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: SUBJEK & ISI PESAN */}
                            <div className="space-y-3">
                                <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px]">
                                        chat
                                    </span>
                                    Subjek &amp; Isi Pesan
                                </h4>

                                <div>
                                    <label className="font-label-sm text-outline block mb-1 font-semibold">
                                        Subjek Pesan
                                    </label>
                                    <div className="px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface font-bold text-sm">
                                        {selectedMessage.subjek}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-label-sm text-outline block mb-1 font-semibold">
                                        Isi Pesan Lengkap
                                    </label>
                                    <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface leading-relaxed whitespace-pre-wrap font-normal text-xs sm:text-sm">
                                        {selectedMessage.pesan}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: UBAH STATUS TINDAK LANJUT */}
                            <div className="border-t border-outline-variant pt-5 space-y-3">
                                <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px]">
                                        tune
                                    </span>
                                    Status Tindak Lanjut
                                </h4>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(selectedMessage.id, "unread")}
                                        className={`px-4 py-2 rounded-xl text-xs font-label-md font-semibold transition flex items-center gap-2 cursor-pointer ${
                                            selectedMessage.status === "unread"
                                                ? "bg-amber-600 text-white shadow-xs font-bold"
                                                : "bg-surface-container hover:bg-surface-container-high text-outline border border-outline-variant"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            mark_chat_unread
                                        </span>
                                        Belum Dibaca
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(selectedMessage.id, "read")}
                                        className={`px-4 py-2 rounded-xl text-xs font-label-md font-semibold transition flex items-center gap-2 cursor-pointer ${
                                            selectedMessage.status === "read"
                                                ? "bg-[#025EDB] text-white shadow-xs font-bold"
                                                : "bg-surface-container hover:bg-surface-container-high text-outline border border-outline-variant"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            drafts
                                        </span>
                                        Sudah Dibaca
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(selectedMessage.id, "replied")}
                                        className={`px-4 py-2 rounded-xl text-xs font-label-md font-semibold transition flex items-center gap-2 cursor-pointer ${
                                            selectedMessage.status === "replied"
                                                ? "bg-emerald-600 text-white shadow-xs font-bold"
                                                : "bg-surface-container hover:bg-surface-container-high text-outline border border-outline-variant"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            reply
                                        </span>
                                        Sudah Dibalas
                                    </button>
                                </div>
                            </div>

                            {/* SECTION 4: CATATAN INTERNAL ADMIN */}
                            <div className="border-t border-outline-variant pt-5 space-y-3">
                                <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px]">
                                        edit_note
                                    </span>
                                    Catatan Internal Admin
                                </h4>

                                <form onSubmit={handleSaveNote} className="space-y-2">
                                    <textarea
                                        rows={2}
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Tulis catatan penanganan internal di sini (contoh: 'Sudah dihubungi via WhatsApp oleh Ustadz Faisal untuk jadwal observasi hari Sabtu')..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary resize-none font-normal"
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSavingNote}
                                            className="px-4 py-2 bg-primary text-white rounded-xl font-label-md text-xs hover:bg-primary-container transition-colors shadow-2xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">save</span>
                                            <span>{isSavingNote ? "Menyimpan..." : "Simpan Catatan"}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* SECTION 5: METADATA */}
                            <div className="p-3 bg-surface-container-low/70 border border-outline-variant/60 rounded-xl text-[11px] text-outline space-y-1">
                                <p>• IP Address Pengirim: {selectedMessage.ip_address || "127.0.0.1"}</p>
                                {selectedMessage.user_agent && (
                                    <p className="truncate">• Perangkat / User Agent: {selectedMessage.user_agent}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer (Fixed Bottom) */}
                        <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low flex flex-wrap justify-between items-center gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => confirmDeleteSingle(selectedMessage)}
                                className="px-4 py-2.5 text-error hover:bg-error-container/20 border border-transparent hover:border-error/20 font-label-md text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                <span>Hapus Pesan</span>
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                                        selectedMessage.subjek
                                    )}`}
                                    className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface font-label-md text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                                    <span>Balas Email</span>
                                </a>

                                {selectedMessage.telepon && (
                                    <a
                                        href={getWhatsAppUrl(selectedMessage)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleUpdateStatus(selectedMessage.id, "replied", false)}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">forum</span>
                                        <span>Balas via WhatsApp</span>
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-5 py-2.5 bg-primary text-white font-label-md text-xs font-bold rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL: HAPUS PESAN ---------------- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[28px]">
                                delete_forever
                            </span>
                        </div>

                        <div>
                            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                Hapus Pesan Masuk?
                            </h3>
                            <p className="font-body-sm text-xs text-outline mt-1 leading-relaxed">
                                {itemToDelete === "bulk"
                                    ? `Apakah Anda yakin ingin menghapus ${selectedIds.length} pesan terpilih secara permanen? Data yang telah dihapus tidak dapat dipulihkan kembali.`
                                    : `Apakah Anda yakin ingin menghapus pesan dari "${itemToDelete?.nama}"? Data yang telah dihapus tidak dapat dipulihkan kembali.`}
                            </p>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setItemToDelete(null);
                                }}
                                className="px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs hover:bg-surface-container-low transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteExecute}
                                disabled={isBulkProcessing}
                                className="px-5 py-2.5 bg-error text-white rounded-xl font-label-md text-xs hover:bg-error/90 transition-colors shadow-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                <span>{isBulkProcessing ? "Menghapus..." : "Ya, Hapus Sekarang"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
