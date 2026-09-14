import React, { useState, useEffect, useMemo } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import Sidebar from "@/Components/Elements/Sidebar";
import TopBar from "@/Components/Elements/TopBar";
import ConfirmModal from "@/Components/Elements/ConfirmModal";

export default function PengaturanAkun({
    auth,
    user: initialUser,
    userStats = {},
    roleInfo = {},
    sessions: initialSessions = [],
    preferences: initialPreferences = {},
    activeTab: propActiveTab,
}) {
    const { flash, errors } = usePage().props;
    const currentUser = auth?.user || initialUser || {
        name: "Admin Utama",
        email: "admin@bhaktiarumi.org",
        role: "super_admin",
    };

    // Sessions State (local copy for instant optimistic updates)
    const [sessions, setSessions] = useState(initialSessions);
    useEffect(() => {
        setSessions(initialSessions);
    }, [initialSessions]);

    // Navigation & UI States with robust URL / Storage tab retention
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tabFromUrl = params.get("tab");
            if (tabFromUrl && ["profil", "keamanan", "preferensi", "sesi"].includes(tabFromUrl)) {
                return tabFromUrl;
            }
        }
        if (propActiveTab && ["profil", "keamanan", "preferensi", "sesi"].includes(propActiveTab)) {
            return propActiveTab;
        }
        if (typeof window !== "undefined") {
            const savedTab = sessionStorage.getItem("mtas_admin_profile_tab");
            if (savedTab && ["profil", "keamanan", "preferensi", "sesi"].includes(savedTab)) {
                return savedTab;
            }
        }
        return "profil";
    });

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("mtas_admin_profile_tab", tabKey);
            const url = new URL(window.location.href);
            url.searchParams.set("tab", tabKey);
            window.history.replaceState({}, "", url);
        }
    };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Toast Notifications
    const [toastMessage, setToastMessage] = useState(flash?.success || "");
    const [toastError, setToastError] = useState(flash?.error || "");

    // Confirmation Modal States
    const [showAvatarDeleteModal, setShowAvatarDeleteModal] = useState(false);
    const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [isDeletingSession, setIsDeletingSession] = useState(false);
    const [showGoogleDisconnectModal, setShowGoogleDisconnectModal] = useState(false);
    const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false);

    const confirmDisconnectGoogle = () => {
        setIsDisconnectingGoogle(true);
        router.post("/admin/pengaturan-akun/google/disconnect", {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowGoogleDisconnectModal(false);
                setIsDisconnectingGoogle(false);
            },
            onError: (errs) => {
                setIsDisconnectingGoogle(false);
                if (errs.google) {
                    setToastError(errs.google);
                }
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(""), 4500);
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

    useEffect(() => {
        if (errors?.google) {
            setToastError(errors.google);
            const timer = setTimeout(() => setToastError(""), 6000);
            return () => clearTimeout(timer);
        }
    }, [errors?.google]);

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        name: initialUser?.name || currentUser?.name || "",
        username: initialUser?.username || currentUser?.username || "",
        email: initialUser?.email || currentUser?.email || "",
        phone: initialUser?.phone || currentUser?.phone || "",
        jabatan: initialUser?.jabatan || currentUser?.jabatan || "",
        bio: initialUser?.bio || currentUser?.bio || "",
        avatar_file: null,
        avatar_data: "",
    });

    const [avatarPreview, setAvatarPreview] = useState(
        initialUser?.avatar || currentUser?.avatar || null
    );
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        setAvatarPreview(initialUser?.avatar || currentUser?.avatar || null);
        setAvatarLoadError(false);
    }, [initialUser?.avatar, currentUser?.avatar]);

    useEffect(() => {
        if (initialUser) {
            setProfileForm((prev) => ({
                ...prev,
                name: initialUser.name || "",
                username: initialUser.username || "",
                email: initialUser.email || "",
                phone: initialUser.phone || "",
                jabatan: initialUser.jabatan || "",
                bio: initialUser.bio || "",
            }));
        }
    }, [initialUser?.email, initialUser?.name, initialUser?.username, initialUser?.phone, initialUser?.jabatan, initialUser?.bio]);

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Preferences Form State
    const [prefs, setPrefs] = useState({
        notifications: {
            pendaftaran_baru: initialPreferences?.notifications?.pendaftaran_baru ?? true,
            pesan_masuk: initialPreferences?.notifications?.pesan_masuk ?? true,
            laporan_mingguan: initialPreferences?.notifications?.laporan_mingguan ?? false,
            keamanan_login: initialPreferences?.notifications?.keamanan_login ?? true,
            email_digest: initialPreferences?.notifications?.email_digest ?? true,
        },
        interface: {
            theme: initialPreferences?.interface?.theme ?? (typeof localStorage !== "undefined" ? localStorage.getItem("mtas_theme") : null) ?? "light",
            compact_tables: initialPreferences?.interface?.compact_tables ?? (typeof localStorage !== "undefined" ? localStorage.getItem("mtas_compact_tables") === "true" : false),
            sidebar_collapsed: initialPreferences?.interface?.sidebar_collapsed ?? false,
        },
    });
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);

    // Helper penerapan tema gelap/terang/sistem ke DOM secara instan
    const applyThemeToDOM = (themeMode) => {
        try {
            const isDark =
                themeMode === "dark" ||
                (themeMode === "system" &&
                    typeof window !== "undefined" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches);
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("mtas_theme", themeMode);
            }
        } catch (e) {}
    };

    // Helper penerapan tabel ringkas (compact mode) ke DOM secara instan
    const applyCompactToDOM = (isCompact) => {
        try {
            if (isCompact) {
                document.documentElement.classList.add("compact-tables");
            } else {
                document.documentElement.classList.remove("compact-tables");
            }
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("mtas_compact_tables", isCompact ? "true" : "false");
            }
        } catch (e) {}
    };

    // Sinkronkan preferensi ke DOM saat komponen dimuat
    useEffect(() => {
        if (prefs.interface?.theme) {
            applyThemeToDOM(prefs.interface.theme);
        }
        if (typeof prefs.interface?.compact_tables === "boolean") {
            applyCompactToDOM(prefs.interface.compact_tables);
        }
    }, []);

    // Listener otomatis jika memilih mode 'system'
    useEffect(() => {
        if (prefs.interface?.theme === "system" && typeof window !== "undefined") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = (e) => {
                if (prefs.interface?.theme === "system") {
                    if (e.matches) {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                }
            };
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }
    }, [prefs.interface?.theme]);

    const handleThemeChange = (newTheme) => {
        const updatedPrefs = {
            ...prefs,
            interface: { ...prefs.interface, theme: newTheme },
        };
        setPrefs(updatedPrefs);
        applyThemeToDOM(newTheme);

        // Auto-save preferensi ke server
        router.post(
            "/admin/pengaturan-akun/preferensi",
            { preferences: updatedPrefs },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const label =
                        newTheme === "dark"
                            ? "Gelap"
                            : newTheme === "light"
                            ? "Terang"
                            : "Sistem (Otomatis)";
                    setToastMessage(`Mode tampilan sistem berhasil diubah ke tema ${label}.`);
                },
            }
        );
    };

    const handleCompactToggle = (checked) => {
        const updatedPrefs = {
            ...prefs,
            interface: { ...prefs.interface, compact_tables: checked },
        };
        setPrefs(updatedPrefs);
        applyCompactToDOM(checked);

        // Auto-save preferensi ke server
        router.post(
            "/admin/pengaturan-akun/preferensi",
            { preferences: updatedPrefs },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setToastMessage(
                        checked
                            ? "Tabel data ringkas (Compact Mode) berhasil diaktifkan."
                            : "Tabel data standar berhasil diaktifkan."
                    );
                },
            }
        );
    };

    // Avatar File Handler
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            setToastError("Ukuran file foto profil maksimal 3MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            setAvatarPreview(uploadEvent.target.result);
            setAvatarLoadError(false);
            setProfileForm((prev) => ({
                ...prev,
                avatar_file: file,
                avatar_data: uploadEvent.target.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    // Delete Avatar Handler (Executed via ConfirmModal)
    const confirmDeleteAvatar = () => {
        setIsDeletingAvatar(true);
        router.delete(
            typeof route !== "undefined"
                ? route("admin.pengaturan-akun.avatar.delete")
                : "/admin/pengaturan-akun/avatar",
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeletingAvatar(false);
                    setShowAvatarDeleteModal(false);
                    setAvatarPreview(null);
                    setAvatarLoadError(false);
                    setProfileForm((prev) => ({
                        ...prev,
                        avatar_file: null,
                        avatar_data: "",
                    }));
                },
                onError: () => {
                    setIsDeletingAvatar(false);
                },
            }
        );
    };

    // Submit Profile Update
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setIsSavingProfile(true);

        const formData = new FormData();
        formData.append("name", profileForm.name);
        formData.append("username", profileForm.username || "");
        formData.append("email", profileForm.email);
        formData.append("phone", profileForm.phone || "");
        formData.append("jabatan", profileForm.jabatan || "");
        formData.append("bio", profileForm.bio || "");

        if (profileForm.avatar_file) {
            formData.append("avatar_file", profileForm.avatar_file);
        } else if (profileForm.avatar_data) {
            formData.append("avatar_data", profileForm.avatar_data);
        }

        router.post(
            typeof route !== "undefined"
                ? route("admin.pengaturan-akun.profil")
                : "/admin/pengaturan-akun/profil",
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingProfile(false);
                },
                onError: () => {
                    setIsSavingProfile(false);
                },
            }
        );
    };

    // Submit Password Update
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setIsSavingPassword(true);

        router.post(
            typeof route !== "undefined"
                ? route("admin.pengaturan-akun.password")
                : "/admin/pengaturan-akun/password",
            passwordForm,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingPassword(false);
                    setPasswordForm({
                        current_password: "",
                        password: "",
                        password_confirmation: "",
                    });
                },
                onError: () => {
                    setIsSavingPassword(false);
                },
            }
        );
    };

    // Submit Preferences Update
    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        setIsSavingPrefs(true);

        applyThemeToDOM(prefs.interface.theme);
        applyCompactToDOM(prefs.interface.compact_tables);

        router.post(
            "/admin/pengaturan-akun/preferensi",
            { preferences: prefs },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingPrefs(false);
                    setToastMessage("Preferensi akun & antarmuka berhasil disimpan.");
                },
                onError: () => {
                    setIsSavingPrefs(false);
                },
            }
        );
    };

    // Destroy Session Handler (Executed via ConfirmModal)
    const confirmDestroySession = () => {
        if (!sessionToDelete) return;
        const targetId = sessionToDelete;
        setIsDeletingSession(true);

        const url = typeof route !== "undefined"
            ? route("admin.pengaturan-akun.session.destroy", { id: targetId })
            : `/admin/pengaturan-akun/session/${encodeURIComponent(targetId)}`;

        router.delete(url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsDeletingSession(false);
                setSessionToDelete(null);
                // Optimistic update of sessions list
                if (targetId === "all_others") {
                    setSessions((prev) => prev.filter((s) => s.is_current || s.id === "current"));
                    setToastMessage("Seluruh sesi perangkat lain berhasil dinonaktifkan.");
                } else {
                    setSessions((prev) => prev.filter((s) => s.id !== targetId));
                    setToastMessage("Sesi perangkat berhasil dinonaktifkan.");
                }
            },
            onError: (errs) => {
                setIsDeletingSession(false);
                setSessionToDelete(null);
                if (errs?.session) {
                    setToastError(errs.session);
                } else {
                    setToastError("Gagal memutuskan sesi perangkat.");
                }
            },
        });
    };

    // Password Strength Evaluator
    const passwordStrength = useMemo(() => {
        const pass = passwordForm.password || "";
        if (!pass) return { score: 0, text: "Belum diisi", color: "bg-slate-200", textColor: "text-outline" };

        let score = 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[a-z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 2) {
            return { score: 25, text: "Lemah", color: "bg-rose-500", textColor: "text-rose-600" };
        }
        if (score === 3 || score === 4) {
            return { score: 70, text: "Sedang", color: "bg-amber-500", textColor: "text-amber-600" };
        }
        return { score: 100, text: "Sangat Kuat", color: "bg-emerald-600", textColor: "text-emerald-600" };
    }, [passwordForm.password]);

    const handleLogout = (e) => {
        e?.preventDefault?.();
        router.post(typeof route !== "undefined" ? route("logout") : "/logout");
    };

    return (
        <>
            <Head title="Pengaturan Akun & Profil - Admin MTAS Bhakti Arumi" />

            <div className="flex h-screen bg-surface overflow-hidden font-body-sm text-on-surface">
                {/* Sidebar */}
                <Sidebar
                    activeNav="Pengaturan Akun"
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
                        searchPlaceholder="Cari data, santri, atau pengaturan..."
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
                                        <span className="material-symbols-outlined text-[24px]">account_circle</span>
                                    </span>
                                    <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                                        Pengaturan Akun &amp; Profil
                                    </h1>
                                </div>
                                <p className="font-body-md text-sm text-outline">
                                    Kelola kredensial pribadi, informasi biodata, preferensi keamanan, dan integrasi akun Anda.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/akun"
                                    className="h-11 px-4 flex items-center gap-2 rounded-xl font-label-md text-sm font-semibold transition-all border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container shadow-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                                    <span>Manajemen Akun Pengguna</span>
                                </Link>

                                <Link
                                    href="/admin/dashboard"
                                    className="h-11 px-4 flex items-center gap-2 rounded-xl font-label-md text-sm font-semibold transition-all border border-outline-variant bg-surface-container-lowest text-outline hover:text-on-surface hover:bg-surface-container shadow-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    <span>Kembali ke Dashboard</span>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Profile Overview Banner */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none rounded-r-2xl hidden md:block" />

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    {/* Avatar with Camera Icon */}
                                    <div className="relative group shrink-0">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-primary to-indigo-600 border-2 border-primary/30 flex items-center justify-center text-white shadow-md">
                                            {avatarPreview && !avatarLoadError ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt={profileForm.name}
                                                    className="w-full h-full object-cover"
                                                    onError={() => setAvatarLoadError(true)}
                                                />
                                            ) : (
                                                <span className="text-2xl md:text-3xl font-black tracking-wider">
                                                    {initialUser?.initials || currentUser?.initials || "US"}
                                                </span>
                                            )}
                                        </div>

                                        <label
                                            htmlFor="hero-avatar-upload"
                                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-primary/90 hover:scale-110 transition-all"
                                            title="Ubah Foto Profil"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                            <input
                                                id="hero-avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>

                                    {/* User Main Meta */}
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h2 className="font-headline-md text-xl md:text-2xl font-black text-on-surface">
                                                {profileForm.name || "Nama Pengguna"}
                                            </h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${roleInfo?.badge?.bg || "bg-purple-50 text-purple-700 border-purple-200"}`}>
                                                <span className="material-symbols-outlined text-[14px]">
                                                    {roleInfo?.badge?.icon || "shield_person"}
                                                </span>
                                                {roleInfo?.name || currentUser?.role_label || "Super Admin"}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-outline font-medium">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                                                <span>{profileForm.email}</span>
                                            </div>
                                            {profileForm.username && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">alternate_email</span>
                                                    <span>{profileForm.username}</span>
                                                </div>
                                            )}
                                            {profileForm.jabatan && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                                                    <span>{profileForm.jabatan}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-outline/80 line-clamp-1 italic max-w-xl">
                                            {profileForm.bio || "Belum ada bio atau kutipan profil yang ditambahkan."}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Stats Badges */}
                                <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 border-t md:border-t-0 md:border-l border-outline-variant/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-bold text-on-surface">Status Akun: Aktif</span>
                                    </div>
                                    <span className="text-[11px] text-outline">
                                        Bergabung sejak {userStats?.joined_date || "17 Agustus 2026"}
                                    </span>
                                    <span className="text-[11px] text-outline">
                                        Login terakhir: {userStats?.last_login_formatted || "Hari ini"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 border-b border-outline-variant pb-px overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => handleTabChange("profil")}
                                className={`flex items-center gap-2 px-5 py-3 font-label-md text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                    activeTab === "profil"
                                        ? "border-primary text-primary bg-primary/5 rounded-t-xl"
                                        : "border-transparent text-outline hover:text-on-surface hover:bg-surface-container-low/60 rounded-t-xl"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                <span>Profil &amp; Biodata</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabChange("keamanan")}
                                className={`flex items-center gap-2 px-5 py-3 font-label-md text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                    activeTab === "keamanan"
                                        ? "border-primary text-primary bg-primary/5 rounded-t-xl"
                                        : "border-transparent text-outline hover:text-on-surface hover:bg-surface-container-low/60 rounded-t-xl"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                <span>Keamanan &amp; Kata Sandi</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabChange("preferensi")}
                                className={`flex items-center gap-2 px-5 py-3 font-label-md text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                    activeTab === "preferensi"
                                        ? "border-primary text-primary bg-primary/5 rounded-t-xl"
                                        : "border-transparent text-outline hover:text-on-surface hover:bg-surface-container-low/60 rounded-t-xl"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                                <span>Preferensi &amp; Notifikasi</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabChange("sesi")}
                                className={`flex items-center gap-2 px-5 py-3 font-label-md text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                    activeTab === "sesi"
                                        ? "border-primary text-primary bg-primary/5 rounded-t-xl"
                                        : "border-transparent text-outline hover:text-on-surface hover:bg-surface-container-low/60 rounded-t-xl"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">devices</span>
                                <span>Sesi &amp; Hak Akses</span>
                            </button>
                        </div>

                        {/* TAB 1: PROFIL & BIODATA */}
                        {activeTab === "profil" && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                                    {/* Left Column: Avatar & Photo Management */}
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
                                                <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                                                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                    Foto Profil
                                                </h3>
                                            </div>

                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-tr from-primary to-indigo-600 border-4 border-surface shadow-md flex items-center justify-center text-white">
                                                    {avatarPreview && !avatarLoadError ? (
                                                        <img
                                                            src={avatarPreview}
                                                            alt={profileForm.name}
                                                            className="w-full h-full object-cover"
                                                            onError={() => setAvatarLoadError(true)}
                                                        />
                                                    ) : (
                                                        <span className="text-4xl font-black">
                                                            {initialUser?.initials || currentUser?.initials || "US"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-on-surface">
                                                    {avatarPreview ? "Foto Kustom Aktif" : "Avatar Inisial Otomatis"}
                                                </p>
                                                <p className="text-[11px] text-outline leading-relaxed max-w-xs">
                                                    Format yang didukung: JPG, PNG, atau WEBP. Ukuran maksimal file 3MB.
                                                </p>
                                            </div>

                                            <div className="flex flex-col w-full gap-2 pt-2">
                                                <label
                                                    htmlFor="avatar-file-input"
                                                    className="w-full h-10 px-4 bg-primary text-white rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">upload</span>
                                                    <span>Unggah Foto Baru</span>
                                                    <input
                                                        id="avatar-file-input"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        className="hidden"
                                                        onChange={handleAvatarChange}
                                                    />
                                                </label>

                                                {avatarPreview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAvatarDeleteModal(true)}
                                                        className="w-full h-9 px-4 bg-error-container/20 text-error hover:bg-error-container/40 rounded-xl font-label-md text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        <span>Hapus Foto Profil</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Google Connection Status */}
                                    <div className="pt-4 border-t border-outline-variant/60 mt-auto">
                                            <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                                            <path
                                                                fill="#4285F4"
                                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                            />
                                                            <path
                                                                fill="#34A853"
                                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                            />
                                                            <path
                                                                fill="#FBBC05"
                                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                                            />
                                                            <path
                                                                fill="#EA4335"
                                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                                            />
                                                        </svg>
                                                        <div className="min-w-0 max-w-[150px] sm:max-w-[180px]">
                                                            <p className="text-xs font-bold text-on-surface">Akun Google</p>
                                                            <p className="text-[10px] text-outline truncate" title={initialUser?.google_email || initialUser?.email}>
                                                                {initialUser?.google_id ? (initialUser?.google_email || initialUser?.email || "Terkoneksi OAuth 2.0") : "Belum Terhubung"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                        initialUser?.google_id
                                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                                    }`}>
                                                        {initialUser?.google_id ? "Terhubung" : "Belum Terhubung"}
                                                    </span>
                                                </div>

                                                {/* Tombol Aksi Bind / Ganti / Putuskan Google */}
                                                <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-2">
                                                    {initialUser?.google_id ? (
                                                        <>
                                                            <a
                                                                href="/auth/google?action=bind"
                                                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:text-primary transition shadow-2xs cursor-pointer"
                                                                title="Pilih akun Google lain untuk dihubungkan"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                                                                <span>Ganti Akun Google</span>
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowGoogleDisconnectModal(true)}
                                                                className="px-2.5 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
                                                                title="Putuskan tautan akun Google"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">link_off</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <a
                                                            href="/auth/google?action=bind"
                                                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/60 border border-[#4285F4]/40 hover:border-[#4285F4] rounded-xl text-xs font-bold text-[#1a73e8] transition shadow-2xs cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                                            </svg>
                                                            <span>Pilih &amp; Hubungkan Akun Google</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Profile Form Fields */}
                                    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                        Informasi Biodata Pribadi
                                                    </h3>
                                                </div>
                                                <span className="text-xs text-outline italic">* Wajib diisi</span>
                                            </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Nama Lengkap */}
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Nama Lengkap <span className="text-error">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        person
                                                    </span>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={profileForm.name}
                                                        onChange={(e) =>
                                                            setProfileForm({ ...profileForm, name: e.target.value })
                                                        }
                                                        placeholder="Contoh: Ahmad Fauzi, S.Pd"
                                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                                {errors?.name && (
                                                    <p className="text-xs text-error font-medium">{errors.name}</p>
                                                )}
                                            </div>

                                            {/* Username */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Username / ID Login
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        alternate_email
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={profileForm.username}
                                                        onChange={(e) =>
                                                            setProfileForm({ ...profileForm, username: e.target.value })
                                                        }
                                                        placeholder="ahmad.fauzi"
                                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                                {errors?.username && (
                                                    <p className="text-xs text-error font-medium">{errors.username}</p>
                                                )}
                                            </div>

                                            {/* Email Address */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Alamat Email <span className="text-error">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        mail
                                                    </span>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={profileForm.email}
                                                        onChange={(e) =>
                                                            setProfileForm({ ...profileForm, email: e.target.value })
                                                        }
                                                        placeholder="admin@bhaktiarumi.org"
                                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                                {errors?.email && (
                                                    <p className="text-xs text-error font-medium">{errors.email}</p>
                                                )}
                                            </div>

                                            {/* Nomor Telepon / WhatsApp */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Nomor Telepon / WhatsApp
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        phone
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={profileForm.phone}
                                                        onChange={(e) =>
                                                            setProfileForm({ ...profileForm, phone: e.target.value })
                                                        }
                                                        placeholder="081234567890"
                                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                                {errors?.phone && (
                                                    <p className="text-xs text-error font-medium">{errors.phone}</p>
                                                )}
                                            </div>

                                            {/* Jabatan / Posisi */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Jabatan / Posisi di Yayasan
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        work
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={profileForm.jabatan}
                                                        onChange={(e) =>
                                                            setProfileForm({ ...profileForm, jabatan: e.target.value })
                                                        }
                                                        placeholder="Contoh: Pengurus Harian / IT Admin"
                                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                                {errors?.jabatan && (
                                                    <p className="text-xs text-error font-medium">{errors.jabatan}</p>
                                                )}
                                            </div>

                                            {/* Bio / Ringkasan */}
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Bio / Kutipan Profil Singkat
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={profileForm.bio}
                                                    onChange={(e) =>
                                                        setProfileForm({ ...profileForm, bio: e.target.value })
                                                    }
                                                    placeholder="Tuliskan catatan singkat, keahlian, atau pesan pengurus yayasan..."
                                                    maxLength={500}
                                                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
                                                />
                                                <div className="flex justify-between text-[11px] text-outline">
                                                    <span>Ditampilkan pada kartu informasi akun.</span>
                                                    <span>{profileForm.bio?.length || 0}/500 karakter</span>
                                                </div>
                                                {errors?.bio && (
                                                    <p className="text-xs text-error font-medium">{errors.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-3 mt-auto">
                                        <button
                                            type="submit"
                                            disabled={isSavingProfile}
                                            className="h-11 px-6 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-primary/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {isSavingProfile ? "sync" : "save"}
                                            </span>
                                            <span>{isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: KEAMANAN & KATA SANDI */}
                        {activeTab === "keamanan" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Form Ubah Password */}
                                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-5">
                                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
                                            <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                Perbarui Kata Sandi
                                            </h3>
                                        </div>
                                        <span className="text-xs text-outline">Minimal 8 karakter</span>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        {/* Password Saat Ini (jika user punya password lama) */}
                                        {userStats?.has_password && (
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Kata Sandi Saat Ini <span className="text-error">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                        key
                                                    </span>
                                                    <input
                                                        type={showCurrentPass ? "text" : "password"}
                                                        required
                                                        value={passwordForm.current_password}
                                                        onChange={(e) =>
                                                            setPasswordForm({
                                                                ...passwordForm,
                                                                current_password: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Masukkan kata sandi lama Anda"
                                                        className="w-full h-11 pl-10 pr-11 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {showCurrentPass ? "visibility_off" : "visibility"}
                                                        </span>
                                                    </button>
                                                </div>
                                                {errors?.current_password && (
                                                    <p className="text-xs text-error font-medium">
                                                        {errors.current_password}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Password Baru */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-on-surface">
                                                Kata Sandi Baru <span className="text-error">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                    lock
                                                </span>
                                                <input
                                                    type={showNewPass ? "text" : "password"}
                                                    required
                                                    value={passwordForm.password}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            password: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Minimal 8 karakter kombinasi huruf & angka"
                                                    className="w-full h-11 pl-10 pr-11 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPass(!showNewPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {showNewPass ? "visibility_off" : "visibility"}
                                                    </span>
                                                </button>
                                            </div>
                                            {errors?.password && (
                                                <p className="text-xs text-error font-medium">{errors.password}</p>
                                            )}

                                            {/* Strength Meter Bar */}
                                            {passwordForm.password && (
                                                <div className="space-y-1 pt-1">
                                                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                            style={{ width: `${passwordStrength.score}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className="text-outline">Kekuatan Sandi:</span>
                                                        <span className={`font-bold ${passwordStrength.textColor}`}>
                                                            {passwordStrength.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Konfirmasi Password Baru */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-on-surface">
                                                Konfirmasi Kata Sandi Baru <span className="text-error">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                                    verified_user
                                                </span>
                                                <input
                                                    type={showConfirmPass ? "text" : "password"}
                                                    required
                                                    value={passwordForm.password_confirmation}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            password_confirmation: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Ulangi kata sandi baru"
                                                    className="w-full h-11 pl-10 pr-11 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {showConfirmPass ? "visibility_off" : "visibility"}
                                                    </span>
                                                </button>
                                            </div>
                                            {errors?.password_confirmation && (
                                                <p className="text-xs text-error font-medium">
                                                    {errors.password_confirmation}
                                                </p>
                                            )}
                                        </div>

                                        {/* Tombol Simpan Password */}
                                        <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSavingPassword}
                                                className="h-11 px-6 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-primary/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {isSavingPassword ? "sync" : "key"}
                                                </span>
                                                <span>{isSavingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Security Guidelines & Best Practices Card */}
                                <div className="space-y-4">
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                            <span className="material-symbols-outlined text-[20px]">security</span>
                                            <h4>Ketentuan Keamanan Sandi</h4>
                                        </div>
                                        <ul className="space-y-2.5 text-xs text-outline">
                                            <li className="flex items-start gap-2">
                                                <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                                                    passwordForm.password.length >= 8 ? "text-emerald-600 font-bold" : "text-slate-400"
                                                }`}>
                                                    {passwordForm.password.length >= 8 ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                                <span>Minimal 8 karakter panjangnya.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                                                    /[A-Z]/.test(passwordForm.password) ? "text-emerald-600 font-bold" : "text-slate-400"
                                                }`}>
                                                    {/[A-Z]/.test(passwordForm.password) ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                                <span>Mengandung huruf kapital (A-Z).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                                                    /[0-9]/.test(passwordForm.password) ? "text-emerald-600 font-bold" : "text-slate-400"
                                                }`}>
                                                    {/[0-9]/.test(passwordForm.password) ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                                <span>Mengandung angka numerik (0-9).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                                                    /[^A-Za-z0-9]/.test(passwordForm.password) ? "text-emerald-600 font-bold" : "text-slate-400"
                                                }`}>
                                                    {/[^A-Za-z0-9]/.test(passwordForm.password) ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                                <span>Disarankan memuat simbol (@, #, $, %, !).</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-xs">
                                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                            <span>Privasi &amp; Akses Yayasan</span>
                                        </div>
                                        <p className="text-[11px] leading-relaxed">
                                            Demi keamanan data santri MTAS dan integritas informasi publik yayasan, jangan bagikan kata sandi admin Anda kepada pihak lain.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: PREFERENSI & NOTIFIKASI */}
                        {activeTab === "preferensi" && (
                            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Notifikasi Sistem & Email */}
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-5">
                                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
                                            <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                                            <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                Pemberitahuan Sistem &amp; Email
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Notif 1: Pendaftaran Baru */}
                                            <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-outline cursor-pointer transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-on-surface">
                                                        Pendaftaran Santri Baru
                                                    </p>
                                                    <p className="text-[11px] text-outline leading-relaxed">
                                                        Kirim notifikasi saat ada calon santri baru mendaftar di formulir online MTAS.
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={prefs.notifications.pendaftaran_baru}
                                                    onChange={(e) =>
                                                        setPrefs({
                                                            ...prefs,
                                                            notifications: {
                                                                ...prefs.notifications,
                                                                pendaftaran_baru: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant shrink-0 mt-0.5"
                                                />
                                            </label>

                                            {/* Notif 2: Pesan Kontak Masuk */}
                                            <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-outline cursor-pointer transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-on-surface">
                                                        Pesan Kontak Masuk
                                                    </p>
                                                    <p className="text-[11px] text-outline leading-relaxed">
                                                        Pemberitahuan ketika ada pertanyaan atau donatur mengirim pesan melalui laman Kontak.
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={prefs.notifications.pesan_masuk}
                                                    onChange={(e) =>
                                                        setPrefs({
                                                            ...prefs,
                                                            notifications: {
                                                                ...prefs.notifications,
                                                                pesan_masuk: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant shrink-0 mt-0.5"
                                                />
                                            </label>

                                            {/* Notif 3: Laporan Mingguan */}
                                            <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-outline cursor-pointer transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-on-surface">
                                                        Rangkuman Mingguan Otomatis
                                                    </p>
                                                    <p className="text-[11px] text-outline leading-relaxed">
                                                        Kirim ringkasan statistik kunjungan, berita, dan pendaftaran setiap Senin pagi.
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={prefs.notifications.laporan_mingguan}
                                                    onChange={(e) =>
                                                        setPrefs({
                                                            ...prefs,
                                                            notifications: {
                                                                ...prefs.notifications,
                                                                laporan_mingguan: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant shrink-0 mt-0.5"
                                                />
                                            </label>

                                            {/* Notif 4: Keamanan Login */}
                                            <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-outline cursor-pointer transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-on-surface">
                                                        Peringatan Keamanan &amp; Sesi Baru
                                                    </p>
                                                    <p className="text-[11px] text-outline leading-relaxed">
                                                        Kirim email konfirmasi jika akun Anda login dari peramban atau perangkat baru.
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={prefs.notifications.keamanan_login}
                                                    onChange={(e) =>
                                                        setPrefs({
                                                            ...prefs,
                                                            notifications: {
                                                                ...prefs.notifications,
                                                                keamanan_login: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant shrink-0 mt-0.5"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Preferensi Antarmuka & Tampilan */}
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-5">
                                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
                                            <span className="material-symbols-outlined text-primary text-[20px]">palette</span>
                                            <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                Tampilan &amp; Tata Letak
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Tema Mode */}
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-on-surface">
                                                    Mode Tampilan Sistem
                                                </label>
                                                <div className="grid grid-cols-3 gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleThemeChange("light")}
                                                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                                            prefs.interface.theme === "light"
                                                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                                                : "border-outline-variant bg-surface-container-low text-outline hover:bg-surface-container"
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-[22px] block mb-1">light_mode</span>
                                                        <span className="text-xs">Terang</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleThemeChange("dark")}
                                                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                                            prefs.interface.theme === "dark"
                                                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                                                : "border-outline-variant bg-surface-container-low text-outline hover:bg-surface-container"
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-[22px] block mb-1">dark_mode</span>
                                                        <span className="text-xs">Gelap</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleThemeChange("system")}
                                                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                                            prefs.interface.theme === "system"
                                                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                                                : "border-outline-variant bg-surface-container-low text-outline hover:bg-surface-container"
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-[22px] block mb-1">desktop_windows</span>
                                                        <span className="text-xs">Sistem</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Kerapatan Tabel */}
                                            <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-outline cursor-pointer transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-on-surface">
                                                        Tabel Data Ringkas (Compact Mode)
                                                    </p>
                                                    <p className="text-[11px] text-outline leading-relaxed">
                                                        Mengurangi jarak antar baris pada tabel santri, pendaftaran, dan berita agar memuat lebih banyak data di layar.
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={prefs.interface.compact_tables}
                                                    onChange={(e) => handleCompactToggle(e.target.checked)}
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant shrink-0 mt-0.5"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingPrefs}
                                        className="h-11 px-6 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-primary/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {isSavingPrefs ? "sync" : "save"}
                                        </span>
                                        <span>{isSavingPrefs ? "Menyimpan..." : "Simpan Preferensi Akun"}</span>
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 4: SESI & HAK AKSES */}
                        {activeTab === "sesi" && (
                            <div className="space-y-6">
                                {/* Role & Permissions Card */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
                                            <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                Rincian Hak Akses Peran ({roleInfo?.name || currentUser?.role_label})
                                            </h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleInfo?.badge?.bg || "bg-purple-50 text-purple-700 border-purple-200"}`}>
                                            {roleInfo?.name || "Super Admin"}
                                        </span>
                                    </div>

                                    <p className="text-xs text-outline leading-relaxed">
                                        {roleInfo?.description ||
                                            "Akses penuh ke seluruh modul sistem, konfigurasi, audit log, dan manajemen peran akun."}
                                    </p>

                                    <div>
                                        <h4 className="text-xs font-bold text-on-surface mb-2">
                                            Modul &amp; Hak Istimewa yang Diizinkan:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(roleInfo?.permissions || [
                                                "Akses Penuh",
                                                "Kelola Akun & Peran",
                                                "Kelola Berita",
                                                "Kelola Galeri",
                                                "Kelola Pesan",
                                                "Akses Pengaturan",
                                            ]).map((perm, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface flex items-center gap-1.5"
                                                >
                                                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                                                        check_circle
                                                    </span>
                                                    <span>{perm}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Active Sessions List */}
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/60 gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">devices</span>
                                            <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                                Perangkat &amp; Sesi Aktif ({sessions.length})
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            {sessions.some((s) => !s.is_current && s.id !== "current") && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSessionToDelete("all_others")}
                                                    className="px-3 py-1.5 rounded-xl bg-error-container/20 hover:bg-error-container/40 text-error font-label-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">phonelink_erase</span>
                                                    <span>Putuskan Sesi Lainnya</span>
                                                </button>
                                            )}
                                            <span className="text-xs text-outline">Pemberitahuan audit keamanan</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {sessions.map((sess, idx) => (
                                            <div
                                                key={sess.id || idx}
                                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                                                    sess.is_current
                                                        ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
                                                        : "bg-surface-container-low border-outline-variant"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center border border-outline-variant shrink-0">
                                                        <span className="material-symbols-outlined text-[22px]">
                                                            {sess.device_icon || "computer"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-on-surface">
                                                                {sess.browser} di {sess.os}
                                                            </h4>
                                                            {sess.is_current && (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                                                    Sesi Ini
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-outline">
                                                            IP: <span className="font-mono">{sess.ip_address}</span> • Terakhir aktif: {sess.last_active} ({sess.last_active_human})
                                                        </p>
                                                    </div>
                                                </div>

                                                {!sess.is_current && sess.id !== "current" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSessionToDelete(sess.id)}
                                                        disabled={isDeletingSession && sessionToDelete === sess.id}
                                                        className="px-3.5 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-error-container/20 hover:text-error text-xs font-semibold text-outline transition-all cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        {isDeletingSession && sessionToDelete === sess.id ? (
                                                            <>
                                                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                                                <span>Memutuskan...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="material-symbols-outlined text-[16px]">link_off</span>
                                                                <span>Putuskan Sesi</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus Foto Profil */}
            <ConfirmModal
                isOpen={showAvatarDeleteModal}
                onClose={() => setShowAvatarDeleteModal(false)}
                onConfirm={confirmDeleteAvatar}
                title="Hapus Foto Profil?"
                message="Apakah Anda yakin ingin menghapus foto profil Anda? Tampilan profil akan kembali menggunakan inisial nama akun Anda."
                confirmText="Ya, Hapus Foto"
                cancelText="Batal"
                variant="danger"
                icon="delete_forever"
                isLoading={isDeletingAvatar}
            />

            {/* Modal Konfirmasi Putuskan Sesi */}
            <ConfirmModal
                isOpen={Boolean(sessionToDelete)}
                onClose={() => setSessionToDelete(null)}
                onConfirm={confirmDestroySession}
                title={sessionToDelete === "all_others" ? "Putuskan Semua Sesi Lain?" : "Putuskan Sesi Perangkat?"}
                message={
                    sessionToDelete === "all_others"
                        ? "Apakah Anda yakin ingin memutuskan seluruh sesi perangkat lain? Akun Anda di seluruh peramban/perangkat lain akan otomatis dikeluarkan."
                        : "Apakah Anda yakin ingin memutuskan sesi perangkat ini? Pengguna pada perangkat tersebut akan otomatis dikeluarkan dari sistem."
                }
                confirmText={sessionToDelete === "all_others" ? "Ya, Putuskan Semua" : "Ya, Putuskan Sesi"}
                cancelText="Batal"
                variant="danger"
                icon="phonelink_erase"
                isLoading={isDeletingSession}
            />

            {/* Modal Konfirmasi Putuskan Tautan Google */}
            <ConfirmModal
                isOpen={showGoogleDisconnectModal}
                onClose={() => setShowGoogleDisconnectModal(false)}
                onConfirm={confirmDisconnectGoogle}
                title="Putuskan Tautan Akun Google?"
                message="Apakah Anda yakin ingin memutuskan tautan akun Google dari profil ini? Anda nantinya akan masuk menggunakan kredensial email & kata sandi lokal akun Anda."
                confirmText="Ya, Putuskan Tautan"
                cancelText="Batal"
                variant="danger"
                icon="link_off"
                isLoading={isDisconnectingGoogle}
            />
        </>
    );
}
