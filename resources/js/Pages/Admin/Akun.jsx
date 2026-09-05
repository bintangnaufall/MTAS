import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Elements/Sidebar";
import TopBar from "@/Components/Elements/TopBar";

export default function AdminAkun({ auth, users = [], stats = {}, rolesList = [], filters = {} }) {
    const { flash, errors } = usePage().props;
    const currentUser = auth?.user || {
        name: "Admin Utama",
        email: "admin@bhaktiarumi.org",
        role: "super_admin",
    };

    // State management
    const [userList, setUserList] = useState(users);
    useEffect(() => {
        setUserList(users);
    }, [users]);

    // UI & Navigation
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [roleFilter, setRoleFilter] = useState(filters?.role || "all"); // 'all' | 'super_admin' | 'admin' | 'editor' | 'staff'
    const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'name_asc' | 'name_desc'
    const [showRoleInfo, setShowRoleInfo] = useState(false);

    // Toast notifications
    const [toastMessage, setToastMessage] = useState(flash?.success || "");
    const [toastError, setToastError] = useState(flash?.error || "");

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            setToastError(flash.error);
            const timer = setTimeout(() => setToastError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error]);

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetPassModal, setShowResetPassModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form States
    const [createForm, setCreateForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "admin",
    });

    const [editForm, setEditForm] = useState({
        name: "",
        username: "",
        email: "",
        role: "admin",
        password: "",
    });

    const [resetPassForm, setResetPassForm] = useState({
        password: "",
    });

    const [showPasswordText, setShowPasswordText] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper: Generate Random Password
    const generateRandomPassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
        let res = "";
        for (let i = 0; i < 10; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    };

    // Logout Handler
    const handleLogout = (e) => {
        e?.preventDefault();
        if (confirm("Apakah Anda yakin ingin keluar dari Admin Console?")) {
            router.post(typeof route !== "undefined" ? route("logout") : "/logout");
        }
    };

    // Filter & Sort Users
    const filteredUsers = useMemo(() => {
        return userList
            .filter((u) => {
                // Role filter
                if (roleFilter !== "all" && u.role !== roleFilter) {
                    return false;
                }
                // Search filter
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const matchName = u.name?.toLowerCase().includes(q);
                    const matchEmail = u.email?.toLowerCase().includes(q);
                    const matchUser = u.username?.toLowerCase().includes(q);
                    const matchRole = u.role_label?.toLowerCase().includes(q);
                    return matchName || matchEmail || matchUser || matchRole;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === "newest") {
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                }
                if (sortBy === "oldest") {
                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                }
                if (sortBy === "name_asc") {
                    return a.name.localeCompare(b.name);
                }
                if (sortBy === "name_desc") {
                    return b.name.localeCompare(a.name);
                }
                return 0;
            });
    }, [userList, roleFilter, searchQuery, sortBy]);

    // Handle Create Submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(
            typeof route !== "undefined" ? route("admin.akun.store") : "/admin/akun",
            createForm,
            {
                onSuccess: () => {
                    setShowCreateModal(false);
                    setCreateForm({
                        name: "",
                        username: "",
                        email: "",
                        password: "",
                        role: "admin",
                    });
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Open Edit Modal
    const handleOpenEdit = (u) => {
        setSelectedUser(u);
        setEditForm({
            name: u.name,
            username: u.username === "-" ? "" : u.username,
            email: u.email,
            role: u.role,
            password: "",
        });
        setShowEditModal(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);

        router.post(
            typeof route !== "undefined"
                ? route("admin.akun.update", selectedUser.id)
                : `/admin/akun/${selectedUser.id}`,
            {
                ...editForm,
                _method: "PUT",
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Quick Update Role
    const handleQuickRoleChange = (userId, newRole) => {
        router.patch(
            typeof route !== "undefined"
                ? route("admin.akun.role", userId)
                : `/admin/akun/${userId}/role`,
            { role: newRole },
            {
                preserveScroll: true,
            }
        );
    };

    // Open Reset Password Modal
    const handleOpenResetPass = (u) => {
        setSelectedUser(u);
        setResetPassForm({ password: "" });
        setShowResetPassModal(true);
    };

    // Handle Reset Password Submit
    const handleResetPassSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);

        router.post(
            typeof route !== "undefined"
                ? route("admin.akun.reset-password", selectedUser.id)
                : `/admin/akun/${selectedUser.id}/reset-password`,
            resetPassForm,
            {
                onSuccess: () => {
                    setShowResetPassModal(false);
                    setSelectedUser(null);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Open Delete Modal
    const handleOpenDelete = (u) => {
        setSelectedUser(u);
        setShowDeleteModal(true);
    };

    // Handle Delete Confirm
    const handleDeleteConfirm = () => {
        if (!selectedUser) return;
        setIsSubmitting(true);

        router.delete(
            typeof route !== "undefined"
                ? route("admin.akun.destroy", selectedUser.id)
                : `/admin/akun/${selectedUser.id}`,
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Get Role Meta details & Clean Theme
    const getRoleDetails = (roleKey) => {
        const cleanStyles = {
            super_admin: {
                key: "super_admin",
                name: "Super Admin",
                description: "Akses penuh ke seluruh modul sistem, konfigurasi, audit log, dan manajemen peran akun.",
                badge: {
                    bg: "bg-purple-50 text-purple-700 border border-purple-200 font-bold",
                    color: "#7e22ce",
                    icon: "shield_person",
                },
                avatarBg: "bg-purple-100 text-purple-700 font-bold border border-purple-200",
                dropdownBorder: "border-outline-variant bg-surface text-on-surface",
                permissions: ["Akses Penuh", "Kelola Akun & Peran", "Kelola Berita", "Kelola Galeri", "Kelola Pesan", "Akses Pengaturan"]
            },
            admin: {
                key: "admin",
                name: "Administrator",
                description: "Mengelola operasional harian: berita, galeri, pesan masuk, dan monitoring santri.",
                badge: {
                    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
                    color: "#047857",
                    icon: "admin_panel_settings",
                },
                avatarBg: "bg-emerald-100 text-emerald-700 font-bold border border-emerald-200",
                dropdownBorder: "border-outline-variant bg-surface text-on-surface",
                permissions: ["Kelola Berita", "Kelola Galeri", "Kelola Pesan", "Monitoring Santri"]
            },
            editor: {
                key: "editor",
                name: "Editor Konten",
                description: "Membuat, menyunting, dan menerbitkan konten publikasi berita dan dokumentasi galeri.",
                badge: {
                    bg: "bg-blue-50 text-blue-700 border border-blue-200 font-bold",
                    color: "#1d4ed8",
                    icon: "edit_note",
                },
                avatarBg: "bg-blue-100 text-blue-700 font-bold border border-blue-200",
                dropdownBorder: "border-outline-variant bg-surface text-on-surface",
                permissions: ["Buat & Edit Berita", "Upload & Edit Galeri", "Lihat Pesan"]
            },
            staff: {
                key: "staff",
                name: "Staff Pengurus",
                description: "Melihat data informasi yayasan, meninjau pesan masuk, dan membuat draft konten.",
                badge: {
                    bg: "bg-amber-50 text-amber-800 border border-amber-200 font-bold",
                    color: "#b45309",
                    icon: "badge",
                },
                avatarBg: "bg-amber-100 text-amber-800 font-bold border border-amber-200",
                dropdownBorder: "border-outline-variant bg-surface text-on-surface",
                permissions: ["Lihat Pesan Masuk", "Draft Berita", "Lihat Galeri"]
            },
        };

        if (cleanStyles[roleKey]) {
            return cleanStyles[roleKey];
        }

        return {
            key: roleKey,
            name: roleKey || "Pengguna",
            description: "Pengguna sistem yayasan",
            badge: { bg: "bg-slate-100 text-slate-700 border border-slate-200 font-semibold", color: "#475569", icon: "person" },
            avatarBg: "bg-slate-100 text-slate-700 font-bold border border-slate-200",
            dropdownBorder: "border-outline-variant bg-surface text-on-surface",
            permissions: ["Akses Standar"],
        };
    };

    return (
        <>
            <Head title="Manajemen Akun & Peran - Admin MTAS Bhakti Arumi" />

            <div className="flex h-screen bg-surface overflow-hidden font-body-sm text-on-surface">
                {/* Sidebar */}
                <Sidebar
                    activeNav="Manajemen Akun"
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* TopBar */}
                    <TopBar
                        user={currentUser}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Cari nama, email, username akun..."
                        setMobileMenuOpen={setMobileMenuOpen}
                        handleLogout={handleLogout}
                    />

                    {/* Scrollable Body */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
                        {/* Toast Success Notification */}
                        {toastMessage && (
                            <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-700 text-white rounded-xl shadow-lg animate-in slide-in-from-top duration-200">
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                <span className="text-sm font-medium">{toastMessage}</span>
                                <button
                                    onClick={() => setToastMessage("")}
                                    className="p-1 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        )}

                        {/* Toast Error Notification */}
                        {toastError && (
                            <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-rose-700 text-white rounded-xl shadow-lg animate-in slide-in-from-top duration-200">
                                <span className="material-symbols-outlined text-[20px]">error</span>
                                <span className="text-sm font-medium">{toastError}</span>
                                <button
                                    onClick={() => setToastError("")}
                                    className="p-1 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        )}

                        {/* Page Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1">
                                    <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/30">
                                        <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                                    </span>
                                    <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                                        Manajemen Akun &amp; Peran
                                    </h1>
                                </div>
                                <p className="font-body-md text-sm text-outline">
                                    Kelola pengguna, penetapan peran (role), kredensial akun, dan pembagian hak akses sistem MTAS Bhakti Arumi.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowRoleInfo(!showRoleInfo)}
                                    className={`h-11 px-4 flex items-center gap-2 rounded-xl font-label-md text-sm font-semibold transition-all border shadow-xs ${
                                        showRoleInfo
                                            ? "bg-primary text-white border-primary shadow-primary/20"
                                            : "bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">info</span>
                                    <span>{showRoleInfo ? "Tutup Info Peran" : "Panduan Peran"}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setCreateForm({
                                            name: "",
                                            username: "",
                                            email: "",
                                            password: "",
                                            role: "admin",
                                        });
                                        setShowCreateModal(true);
                                    }}
                                    className="h-11 px-5 flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-primary/25 hover:shadow-lg active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    <span>Tambah Akun Baru</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Overview Grid - Clean Standard Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
                            {/* 1. Total Akun */}
                            <div
                                onClick={() => setRoleFilter("all")}
                                className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest shadow-2xs hover:shadow-xs ${
                                    roleFilter === "all"
                                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                        : "border-outline-variant hover:border-outline"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-outline uppercase tracking-wider">Total Akun</span>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                                        <span className="material-symbols-outlined text-[22px]">group</span>
                                    </div>
                                </div>
                                <div className="font-headline-lg text-3xl font-black text-on-surface mb-1">
                                    {stats.total ?? userList.length}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-outline">Semua Pengguna</span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                                        Aktif
                                    </span>
                                </div>
                            </div>

                            {/* 2. Super Admin */}
                            <div
                                onClick={() => setRoleFilter("super_admin")}
                                className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest shadow-2xs hover:shadow-xs ${
                                    roleFilter === "super_admin"
                                        ? "border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/50"
                                        : "border-outline-variant hover:border-purple-300"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-outline uppercase tracking-wider">Super Admin</span>
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                                        <span className="material-symbols-outlined text-[22px]">shield_person</span>
                                    </div>
                                </div>
                                <div className="font-headline-lg text-3xl font-black text-on-surface mb-1">
                                    {stats.super_admin ?? 0}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-outline">Akses Penuh</span>
                                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[10px] border border-purple-200">
                                        Level 1
                                    </span>
                                </div>
                            </div>

                            {/* 3. Administrator */}
                            <div
                                onClick={() => setRoleFilter("admin")}
                                className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest shadow-2xs hover:shadow-xs ${
                                    roleFilter === "admin"
                                        ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50"
                                        : "border-outline-variant hover:border-emerald-300"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-outline uppercase tracking-wider">Administrator</span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                                        <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                                    </div>
                                </div>
                                <div className="font-headline-lg text-3xl font-black text-on-surface mb-1">
                                    {stats.admin ?? 0}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-outline">Operasional</span>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                                        Level 2
                                    </span>
                                </div>
                            </div>

                            {/* 4. Editor Konten */}
                            <div
                                onClick={() => setRoleFilter("editor")}
                                className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest shadow-2xs hover:shadow-xs ${
                                    roleFilter === "editor"
                                        ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50"
                                        : "border-outline-variant hover:border-blue-300"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-outline uppercase tracking-wider">Editor Konten</span>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                                        <span className="material-symbols-outlined text-[22px]">edit_note</span>
                                    </div>
                                </div>
                                <div className="font-headline-lg text-3xl font-black text-on-surface mb-1">
                                    {stats.editor ?? 0}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-outline">Publikasi</span>
                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                                        Level 3
                                    </span>
                                </div>
                            </div>

                            {/* 5. Staff Pengurus */}
                            <div
                                onClick={() => setRoleFilter("staff")}
                                className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer col-span-2 sm:col-span-1 bg-surface-container-lowest shadow-2xs hover:shadow-xs ${
                                    roleFilter === "staff"
                                        ? "border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/50"
                                        : "border-outline-variant hover:border-amber-300"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-outline uppercase tracking-wider">Staff Pengurus</span>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                                        <span className="material-symbols-outlined text-[22px]">badge</span>
                                    </div>
                                </div>
                                <div className="font-headline-lg text-3xl font-black text-on-surface mb-1">
                                    {stats.staff ?? 0}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-outline">Staff &amp; Draft</span>
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-[10px] border border-amber-200">
                                        Level 4
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Role Guidelines Card */}
                        {showRoleInfo && (
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
                                        <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                            Matriks Hak Akses &amp; Deskripsi Peran (Role)
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowRoleInfo(false)}
                                        className="text-xs text-outline hover:text-on-surface p-1"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {rolesList.map((r) => {
                                        const meta = getRoleDetails(r.key);
                                        return (
                                            <div
                                                key={r.key}
                                                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2.5 mb-2">
                                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.badge.bg}`}>
                                                            <span className="material-symbols-outlined text-[18px]">{meta.badge.icon}</span>
                                                        </span>
                                                        <h4 className="font-bold text-sm text-on-surface">{r.name}</h4>
                                                    </div>
                                                    <p className="text-xs text-outline mb-3 leading-relaxed">
                                                        {r.description}
                                                    </p>
                                                </div>
                                                <div className="pt-2 border-t border-outline-variant/60">
                                                    <p className="text-[10px] font-bold text-outline uppercase mb-1.5 tracking-wider">
                                                        Hak Istimewa:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {r.permissions.map((perm, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-on-surface font-semibold border border-outline-variant/60 shadow-2xs"
                                                            >
                                                                {perm}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Search, Filter Tabs & Sort Controls */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                {/* Role filter tabs */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                        onClick={() => setRoleFilter("all")}
                                        className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                                            roleFilter === "all"
                                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                                                : "bg-surface-container text-outline hover:text-on-surface hover:bg-surface-container-high"
                                        }`}
                                    >
                                        Semua ({userList.length})
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("super_admin")}
                                        className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                                            roleFilter === "super_admin"
                                                ? "bg-purple-600 text-white shadow-xs"
                                                : "bg-surface-container text-outline hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                                        }`}
                                    >
                                        Super Admin ({userList.filter((u) => u.role === "super_admin").length})
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("admin")}
                                        className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                                            roleFilter === "admin"
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-surface-container text-outline hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                        }`}
                                    >
                                        Administrator ({userList.filter((u) => u.role === "admin").length})
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("editor")}
                                        className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                                            roleFilter === "editor"
                                                ? "bg-blue-600 text-white shadow-xs"
                                                : "bg-surface-container text-outline hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                        }`}
                                    >
                                        Editor ({userList.filter((u) => u.role === "editor").length})
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("staff")}
                                        className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                                            roleFilter === "staff"
                                                ? "bg-amber-600 text-white shadow-xs"
                                                : "bg-surface-container text-outline hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                        }`}
                                    >
                                        Staff ({userList.filter((u) => u.role === "staff").length})
                                    </button>
                                </div>

                                {/* Sort dropdown */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-semibold text-outline">Urutan:</span>
                                    <div className="relative flex items-center">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="h-9 pl-3 pr-8 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary appearance-none bg-none cursor-pointer"
                                        >
                                            <option value="newest">Terbaru Ditambahkan</option>
                                            <option value="oldest">Terlama Ditambahkan</option>
                                            <option value="name_asc">Nama (A - Z)</option>
                                            <option value="name_desc">Nama (Z - A)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Table */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-outline-variant bg-surface-container-low/60">
                                            <th className="py-4 px-6 font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                                                Pengguna &amp; Identitas
                                            </th>
                                            <th className="py-4 px-6 font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                                                Peran (Role)
                                            </th>
                                            <th className="py-4 px-6 font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                                                Status Akses
                                            </th>
                                            <th className="py-4 px-6 font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                                                Tgl Dibuat
                                            </th>
                                            <th className="py-4 px-6 text-right font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/60">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-outline">
                                                    <span className="material-symbols-outlined text-4xl mb-2 text-outline/60">
                                                        person_off
                                                    </span>
                                                    <p className="text-sm font-medium">Tidak ada akun yang sesuai dengan kriteria.</p>
                                                    {searchQuery && (
                                                        <button
                                                            onClick={() => setSearchQuery("")}
                                                            className="mt-2 text-xs text-primary underline font-semibold"
                                                        >
                                                            Reset pencarian
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => {
                                                const meta = getRoleDetails(u.role);
                                                return (
                                                    <tr
                                                        key={u.id}
                                                        className={`hover:bg-surface-container-low/50 transition-colors ${
                                                            u.is_current_user ? "bg-primary/5" : ""
                                                        }`}
                                                    >
                                                        {/* Pengguna & Identitas */}
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-3.5">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs shrink-0 overflow-hidden ${meta.avatarBg}`}
                                                                >
                                                                    {u.avatar ? (
                                                                        <img
                                                                            src={u.avatar}
                                                                            alt={u.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                if (e.currentTarget.nextElementSibling) {
                                                                                    e.currentTarget.nextElementSibling.classList.remove('hidden');
                                                                                    e.currentTarget.nextElementSibling.style.display = 'block';
                                                                                }
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    <span className={u.avatar ? 'hidden' : 'block'}>
                                                                        {u.initials || "US"}
                                                                    </span>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-headline-sm text-sm font-bold text-on-surface truncate">
                                                                            {u.name}
                                                                        </span>
                                                                        {u.is_current_user && (
                                                                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px] font-bold">
                                                                                Anda
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-outline mt-0.5">
                                                                        <span className="truncate">{u.email}</span>
                                                                        {u.username && u.username !== "-" && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span className="font-mono text-outline/80 font-medium">@{u.username}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Peran (Role) */}
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badge.bg}`}>
                                                                <span className="material-symbols-outlined text-[15px]">
                                                                    {meta.badge.icon}
                                                                </span>
                                                                <span>{meta.name}</span>
                                                            </span>
                                                        </td>

                                                        {/* Status Akses */}
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                                                    Aktif
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Tgl Dibuat */}
                                                        <td className="py-4 px-6 text-xs text-outline font-medium">
                                                            {u.formatted_created}
                                                        </td>

                                                        {/* Aksi */}
                                                        <td className="py-4 px-6 text-right">
                                                            <div className="inline-flex items-center gap-2 justify-end">
                                                                {/* Quick Role Change Selector with Custom Arrow & Left Icon - NEVER COVERED */}
                                                                <div className="relative inline-flex items-center">
                                                                    <span className="absolute left-2.5 pointer-events-none flex items-center text-on-surface/80">
                                                                        <span className="material-symbols-outlined text-[15px]">
                                                                            {meta.badge.icon}
                                                                        </span>
                                                                    </span>
                                                                    <select
                                                                        value={u.role}
                                                                        onChange={(e) => handleQuickRoleChange(u.id, e.target.value)}
                                                                        title="Ubah Peran Secara Cepat"
                                                                        className={`h-8.5 pl-8 pr-7 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer appearance-none bg-none transition-all shadow-2xs ${meta.dropdownBorder}`}
                                                                    >
                                                                        <option value="super_admin">Super Admin</option>
                                                                        <option value="admin">Administrator</option>
                                                                        <option value="editor">Editor Konten</option>
                                                                        <option value="staff">Staff Pengurus</option>
                                                                    </select>
                                                                    <span className="absolute right-2 pointer-events-none flex items-center text-outline">
                                                                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                                                                    </span>
                                                                </div>

                                                                {/* Edit Button */}
                                                                <button
                                                                    onClick={() => handleOpenEdit(u)}
                                                                    className="w-8.5 h-8.5 rounded-xl border border-outline-variant hover:border-primary text-outline hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                                                                    title="Sunting Data Akun"
                                                                >
                                                                    <span className="material-symbols-outlined text-[17px]">edit</span>
                                                                </button>

                                                                {/* Reset Password Button */}
                                                                <button
                                                                    onClick={() => handleOpenResetPass(u)}
                                                                    className="w-8.5 h-8.5 rounded-xl border border-outline-variant hover:border-amber-500 text-outline hover:text-amber-600 hover:bg-amber-500/10 transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                                                                    title="Reset Kata Sandi"
                                                                >
                                                                    <span className="material-symbols-outlined text-[17px]">lock_reset</span>
                                                                </button>

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => handleOpenDelete(u)}
                                                                    disabled={u.is_current_user}
                                                                    className={`w-8.5 h-8.5 rounded-xl border transition-all flex items-center justify-center shadow-2xs ${
                                                                        u.is_current_user
                                                                            ? "border-outline-variant/30 text-outline/30 cursor-not-allowed"
                                                                            : "border-outline-variant hover:border-rose-500 text-outline hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                                                                    }`}
                                                                    title={u.is_current_user ? "Tidak bisa menghapus akun Anda sendiri" : "Hapus Akun"}
                                                                >
                                                                    <span className="material-symbols-outlined text-[17px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL 1: TAMBAH AKUN BARU */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/30">
                                    <span className="material-symbols-outlined text-[22px]">person_add</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                        Tambah Akun Pengguna Baru
                                    </h3>
                                    <p className="text-xs text-outline">Daftarkan akun pengurus / admin baru ke dalam sistem.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1 rounded-lg text-outline hover:bg-surface-container"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    placeholder="Contoh: Muhammad Ihsan"
                                    className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Username & Email in 2 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">
                                        Username (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.username}
                                        onChange={(e) => setCreateForm({ ...createForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                                        placeholder="contoh: ihsan.admin"
                                        className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                    />
                                    {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                        placeholder="ihsan@bhaktiarumi.org"
                                        className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-semibold text-on-surface">
                                        Kata Sandi <span className="text-rose-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const pwd = generateRandomPassword();
                                            setCreateForm({ ...createForm, password: pwd });
                                            setShowPasswordText(true);
                                        }}
                                        className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">autorenew</span>
                                        Acak Sandi Kuat
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPasswordText ? "text" : "password"}
                                        required
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full h-10 pl-3.5 pr-10 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordText(!showPasswordText)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showPasswordText ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                            </div>

                            {/* Role Selection Cards */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-2">
                                    Pilih Peran &amp; Hak Akses <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {rolesList.map((r) => {
                                        const isSelected = createForm.role === r.key;
                                        const meta = getRoleDetails(r.key);
                                        return (
                                            <div
                                                key={r.key}
                                                onClick={() => setCreateForm({ ...createForm, role: r.key })}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                                    isSelected
                                                        ? `${meta.dropdownBorder} ring-2 ring-primary/40 shadow-xs scale-[1.01]`
                                                        : "bg-surface-container-low border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.badge.bg}`}>
                                                        <span className="material-symbols-outlined text-[15px]">{meta.badge.icon}</span>
                                                    </span>
                                                    <span className="text-xs font-bold text-on-surface">{r.name}</span>
                                                </div>
                                                <p className="text-[11px] text-outline leading-tight">{r.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.role && <p className="text-xs text-rose-500 mt-1">{errors.role}</p>}
                            </div>

                            <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="h-10 px-4 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Simpan Akun"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT DATA AKUN */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/30">
                                    <span className="material-symbols-outlined text-[22px]">edit</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                        Sunting Akun: {selectedUser.name}
                                    </h3>
                                    <p className="text-xs text-outline">Perbarui identitas atau peran pengguna.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Username & Email in 2 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">
                                        Username (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                                        className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                    />
                                    {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-2">
                                    Peran &amp; Hak Akses
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {rolesList.map((r) => {
                                        const isSelected = editForm.role === r.key;
                                        const meta = getRoleDetails(r.key);
                                        return (
                                            <div
                                                key={r.key}
                                                onClick={() => setEditForm({ ...editForm, role: r.key })}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                                    isSelected
                                                        ? `${meta.dropdownBorder} ring-2 ring-primary/40 shadow-xs scale-[1.01]`
                                                        : "bg-surface-container-low border-outline-variant hover:bg-surface-container"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.badge.bg}`}>
                                                        <span className="material-symbols-outlined text-[15px]">{meta.badge.icon}</span>
                                                    </span>
                                                    <span className="text-xs font-bold text-on-surface">{r.name}</span>
                                                </div>
                                                <p className="text-[11px] text-outline leading-tight">{r.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Optional Password Update */}
                            <div className="pt-2 border-t border-outline-variant/60">
                                <label className="block text-xs font-semibold text-on-surface mb-1">
                                    Ganti Kata Sandi (Kosongkan jika tidak ingin diubah)
                                </label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="Masukkan kata sandi baru jika ingin mengubah..."
                                    className="w-full h-10 px-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                                />
                            </div>

                            <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="h-10 px-4 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Perbarui Akun"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: RESET PASSWORD */}
            {showResetPassModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-amber-500/10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                                    <span className="material-symbols-outlined text-[22px]">lock_reset</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                        Reset Kata Sandi
                                    </h3>
                                    <p className="text-xs text-outline">Perbarui kata sandi untuk akun {selectedUser.name}.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowResetPassModal(false)}
                                className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleResetPassSubmit} className="p-5 space-y-4">
                            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs space-y-1">
                                <p className="font-bold text-on-surface">Target Akun:</p>
                                <p className="text-outline">Nama: {selectedUser.name}</p>
                                <p className="text-outline">Email: {selectedUser.email}</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-semibold text-on-surface">
                                        Kata Sandi Baru <span className="text-rose-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const pwd = generateRandomPassword();
                                            setResetPassForm({ password: pwd });
                                            setShowPasswordText(true);
                                        }}
                                        className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">autorenew</span>
                                        Acak Kata Sandi
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPasswordText ? "text" : "password"}
                                        required
                                        value={resetPassForm.password}
                                        onChange={(e) => setResetPassForm({ password: e.target.value })}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full h-10 pl-3.5 pr-10 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordText(!showPasswordText)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showPasswordText ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowResetPassModal(false)}
                                    className="h-10 px-4 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 px-5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Reset Kata Sandi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 4: HAPUS AKUN KONFIRMASI */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-outline-variant flex items-center gap-3 bg-rose-500/10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
                                <span className="material-symbols-outlined text-[24px]">warning</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm text-base font-bold text-rose-700 dark:text-rose-400">
                                    Konfirmasi Hapus Akun
                                </h3>
                                <p className="text-xs text-outline">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                        </div>

                        <div className="p-5 space-y-3">
                            <p className="text-sm text-on-surface leading-relaxed">
                                Apakah Anda yakin ingin menghapus akun pengguna <strong className="text-on-surface">{selectedUser.name}</strong> ({selectedUser.email})?
                            </p>
                            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
                                Pengguna ini tidak akan dapat login lagi ke dalam sistem Admin Console MTAS Bhakti Arumi.
                            </div>
                        </div>

                        <div className="p-4 border-t border-outline-variant flex items-center justify-end gap-2.5 bg-surface-container-low">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="h-10 px-4 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={isSubmitting}
                                className="h-10 px-5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                                <span>{isSubmitting ? "Menghapus..." : "Ya, Hapus Akun"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
