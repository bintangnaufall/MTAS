import React, { useState, useMemo, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Elements/Sidebar";
import TopBar from "@/Components/Elements/TopBar";

// Helper to get today's date formatted as YYYY-MM-DD for <input type="date">
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Category style helper matching brand theme
const getCategoryStyle = (cat) => {
    switch (cat?.toUpperCase()) {
        case "MAKTAB TULI":
            return {
                bg: "bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]",
                dot: "bg-[#025EDB]",
            };
        case "MAKTAB AUTIS":
            return {
                bg: "bg-[#FDF2F8] text-[#BE185D] border-[#FCE7F3]",
                dot: "bg-[#BE185D]",
            };
        case "ACARA SOSIAL":
            return {
                bg: "bg-[#FFF3E3] text-[#D38B1D] border-[#FFE2BC]",
                dot: "bg-[#D38B1D]",
            };
        case "PEMBELAJARAN":
            return {
                bg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
                dot: "bg-[#0369A1]",
            };
        case "KEGIATAN YAYASAN":
            return {
                bg: "bg-gray-100 text-gray-700 border-gray-200",
                dot: "bg-gray-500",
            };
        default:
            return {
                bg: "bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]",
                dot: "bg-[#025EDB]",
            };
    }
};

const getInitialItem = () => ({
    judul: "",
    kategori: "Kegiatan Yayasan",
    tipe: "foto",
    image: "",
    imageFile: null,
    previewUrl: "",
    video_url: "",
    duration: "",
    tanggal: getTodayDate(),
    deskripsi: "",
    is_featured: false,
    status: "Published",
});

export default function AdminGaleri({ auth, galeriData, stats }) {
    const user = auth?.user || {
        name: "Admin Utama",
        email: "admin@bhaktiarumi.org",
        role: "Super Admin",
    };

    // State galleries
    const [galleries, setGalleries] = useState(galeriData || []);

    useEffect(() => {
        if (galeriData) {
            setGalleries(galeriData);
        }
    }, [galeriData]);

    // Navigation & UI state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'foto' | 'video'
    const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'draft'
    const [categoryFilter, setCategoryFilter] = useState("Semua");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [newItem, setNewItem] = useState(getInitialItem);

    // File input refs
    const createFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // Close active dropdown when clicking outside
    useEffect(() => {
        const handleDocumentClick = () => {
            setActiveDropdownId(null);
        };
        if (activeDropdownId !== null) {
            document.addEventListener("click", handleDocumentClick);
        }
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [activeDropdownId]);

    // Handle logout
    const handleLogout = (e) => {
        e?.preventDefault();
        if (confirm("Apakah Anda yakin ingin keluar dari Admin Console?")) {
            router.post(
                typeof route !== "undefined" ? route("logout") : "/logout"
            );
        }
    };

    // Filter categories list
    const categoryOptions = [
        "Semua",
        "Maktab Tuli",
        "Maktab Autis",
        "Kegiatan Yayasan",
        "Pembelajaran",
        "Acara Sosial",
    ];

    // File select for Create / Edit
    const handleFileSelect = (e, isEdit = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Harap pilih file gambar yang valid (PNG, JPG, JPEG, WEBP).");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran file terlalu besar! Maksimal ukuran file 10MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Url = event.target.result;
            if (isEdit) {
                setSelectedItem((prev) => ({
                    ...prev,
                    imageFile: file,
                    previewUrl: base64Url,
                    image: base64Url,
                }));
            } else {
                setNewItem((prev) => ({
                    ...prev,
                    imageFile: file,
                    previewUrl: base64Url,
                    image: base64Url,
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Filter items
    const filteredGalleries = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return galleries.filter((item) => {
            const title = (item.judul || item.title || "").toLowerCase();
            const category = (item.kategori || item.category || "").toLowerCase();
            const desc = (item.deskripsi || item.description || "").toLowerCase();
            const tipe = (item.tipe || item.type || "foto").toLowerCase();
            const status = (item.status || "Published").toLowerCase();

            const matchesQuery =
                !query ||
                title.includes(query) ||
                category.includes(query) ||
                desc.includes(query);

            const matchesType =
                typeFilter === "all" || tipe === typeFilter.toLowerCase();

            const matchesStatus =
                statusFilter === "all" || status === statusFilter.toLowerCase();

            const matchesCategory =
                categoryFilter === "Semua" ||
                (item.kategori || item.category || "").toUpperCase() ===
                    categoryFilter.toUpperCase();

            return matchesQuery && matchesType && matchesStatus && matchesCategory;
        });
    }, [galleries, searchQuery, typeFilter, statusFilter, categoryFilter]);

    // Paginated
    const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage) || 1;
    const paginatedGalleries = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredGalleries.slice(start, start + itemsPerPage);
    }, [filteredGalleries, currentPage]);

    // Open create modal
    const openCreateModal = (type = "foto") => {
        setNewItem({
            ...getInitialItem(),
            tipe: type,
        });
        setShowCreateModal(true);
    };

    // Open edit modal
    const openEditModal = (item) => {
        setSelectedItem({
            id: item.id,
            judul: item.judul || item.title || "",
            kategori: item.kategori || item.category || "Kegiatan Yayasan",
            tipe: item.tipe || item.type || "foto",
            image: item.image || "/images/image6.png",
            imageFile: null,
            previewUrl: item.image || "/images/image6.png",
            video_url: item.video_url || "",
            duration: item.duration || "",
            tanggal: item.tanggal || item.date || getTodayDate(),
            deskripsi: item.deskripsi || item.description || "",
            is_featured: Boolean(item.is_featured),
            status: item.status || "Published",
        });
        setShowEditModal(true);
        setActiveDropdownId(null);
    };

    // Open preview modal
    const openPreviewModal = (item) => {
        setSelectedItem(item);
        setShowPreviewModal(true);
        setActiveDropdownId(null);
    };

    // Handle Create submission
    const handleCreate = (e) => {
        e.preventDefault();
        const judul = newItem.judul?.trim();
        if (!judul) {
            alert("Judul galeri wajib diisi.");
            return;
        }

        if (newItem.tipe === "foto" && !newItem.imageFile && !newItem.image) {
            alert("Harap pilih atau masukkan gambar foto dokumentasi.");
            return;
        }

        if (newItem.tipe === "video" && !newItem.video_url?.trim()) {
            alert("Harap masukkan URL video YouTube atau link video.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("judul", judul);
        formData.append("kategori", newItem.kategori || "Kegiatan Yayasan");
        formData.append("tipe", newItem.tipe || "foto");
        formData.append("tanggal", newItem.tanggal || getTodayDate());
        formData.append("status", newItem.status || "Published");
        formData.append("is_featured", newItem.is_featured ? "1" : "0");
        formData.append("deskripsi", newItem.deskripsi || "");

        if (newItem.tipe === "video") {
            formData.append("video_url", newItem.video_url || "");
            formData.append("duration", newItem.duration || "");
        }

        if (newItem.imageFile) {
            formData.append("image_file", newItem.imageFile);
        } else if (newItem.image && !newItem.image.startsWith("blob:")) {
            formData.append("image", newItem.image);
        }

        router.post("/admin/galeri", formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setNewItem(getInitialItem());
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error("Error creating gallery item:", errors);
                setIsSubmitting(false);
                alert("Gagal menambahkan item galeri. Periksa kembali form isian.");
            },
        });
    };

    // Handle Update submission
    const handleUpdate = (e) => {
        e.preventDefault();
        if (!selectedItem) return;

        const judul = selectedItem.judul?.trim();
        if (!judul) {
            alert("Judul galeri wajib diisi.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("judul", judul);
        formData.append("kategori", selectedItem.kategori || "Kegiatan Yayasan");
        formData.append("tipe", selectedItem.tipe || "foto");
        formData.append("tanggal", selectedItem.tanggal || getTodayDate());
        formData.append("status", selectedItem.status || "Published");
        formData.append("is_featured", selectedItem.is_featured ? "1" : "0");
        formData.append("deskripsi", selectedItem.deskripsi || "");

        if (selectedItem.tipe === "video") {
            formData.append("video_url", selectedItem.video_url || "");
            formData.append("duration", selectedItem.duration || "");
        }

        if (selectedItem.imageFile) {
            formData.append("image_file", selectedItem.imageFile);
        } else if (
            selectedItem.image &&
            !selectedItem.image.startsWith("blob:")
        ) {
            formData.append("image", selectedItem.image);
        }

        router.post(`/admin/galeri/${selectedItem.id}`, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedItem(null);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error("Error updating gallery item:", errors);
                setIsSubmitting(false);
                alert("Gagal memperbarui item galeri. Periksa kembali data.");
            },
        });
    };

    // Handle Delete
    const handleDelete = () => {
        if (!selectedItem) return;
        setIsSubmitting(true);

        router.delete(`/admin/galeri/${selectedItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
                alert("Gagal menghapus item galeri.");
            },
        });
    };

    // Toggle Status
    const handleToggleStatus = (item) => {
        router.patch(
            `/admin/galeri/${item.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setActiveDropdownId(null);
                },
            }
        );
    };

    // Toggle Featured
    const handleToggleFeatured = (item) => {
        router.patch(
            `/admin/galeri/${item.id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setActiveDropdownId(null);
                },
            }
        );
    };

    return (
        <>
            <Head title="Manajemen Galeri - Yayasan Bhakti Arumi Delangga" />

            <div className="bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
                {/* ---------------- SIDENAVBAR ---------------- */}
                <Sidebar
                    activeNav="Galeri"
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                />

                {/* ---------------- MAIN CONTENT CANVAS ---------------- */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* ---------------- TOPBAR ---------------- */}
                    <TopBar
                        user={user}
                        searchQuery={searchQuery}
                        setSearchQuery={(q) => {
                            setSearchQuery(q);
                            setCurrentPage(1);
                        }}
                        searchPlaceholder="Cari judul galeri, kategori, deskripsi..."
                        setMobileMenuOpen={setMobileMenuOpen}
                        handleLogout={handleLogout}
                    />

                    {/* ---------------- MAIN GALERI CONTENT ---------------- */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-margin-desktop bg-surface">
                        <div className="max-w-container-max mx-auto space-y-6">
                            {/* Page Header & Stats Banner */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
                                            <span className="material-symbols-outlined text-[24px]">photo_library</span>
                                        </span>
                                        <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                                            Manajemen Galeri
                                        </h1>
                                    </div>
                                    <p className="font-body-md text-sm text-outline">
                                        Kelola arsip dokumentasi foto, cuplikan video kegiatan, dan sorotan utama yayasan.
                                    </p>
                                </div>

                                {/* Primary Add Actions */}
                                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                                    <button
                                        onClick={() => openCreateModal("foto")}
                                        className="h-11 px-5 flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-primary/25 hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                                        <span>Tambah Foto</span>
                                    </button>

                                    <button
                                        onClick={() => openCreateModal("video")}
                                        className="h-11 px-5 flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-label-md text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-orange-500/25 hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">video_call</span>
                                        <span>Tambah Video</span>
                                    </button>
                                </div>
                            </div>

                            {/* Metric Cards Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Total Media</span>
                                        <span className="p-1.5 rounded-lg bg-blue-50 text-primary material-symbols-outlined text-[18px]">collections</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-on-surface mt-2">{stats?.total ?? galleries.length}</p>
                                </div>

                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Foto</span>
                                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 material-symbols-outlined text-[18px]">image</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-indigo-600 mt-2">{stats?.foto ?? galleries.filter(g => g.tipe === 'foto').length}</p>
                                </div>

                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Video</span>
                                        <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 material-symbols-outlined text-[18px]">videocam</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-amber-600 mt-2">{stats?.video ?? galleries.filter(g => g.tipe === 'video').length}</p>
                                </div>

                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Published</span>
                                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 material-symbols-outlined text-[18px]">check_circle</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-emerald-600 mt-2">{stats?.published ?? galleries.filter(g => g.status === 'Published').length}</p>
                                </div>

                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Draft</span>
                                        <span className="p-1.5 rounded-lg bg-gray-100 text-gray-600 material-symbols-outlined text-[18px]">draft</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-gray-600 mt-2">{stats?.draft ?? galleries.filter(g => g.status === 'Draft').length}</p>
                                </div>

                                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-outline">Kegiatan Utama</span>
                                        <span className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 material-symbols-outlined text-[18px]">star</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-yellow-600 mt-2">{stats?.featured ?? galleries.filter(g => g.is_featured).length}</p>
                                </div>
                            </div>

                            {/* Filter Bar & Controls */}
                            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                                {/* Filter Pills (Type & Status) */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Type filter */}
                                    <div className="inline-flex p-1 bg-surface-container rounded-xl">
                                        <button
                                            onClick={() => { setTypeFilter("all"); setCurrentPage(1); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                typeFilter === "all"
                                                    ? "bg-white text-[#025EDB] shadow-sm"
                                                    : "text-on-surface-variant hover:text-on-surface"
                                            }`}
                                        >
                                            Semua Media
                                        </button>
                                        <button
                                            onClick={() => { setTypeFilter("foto"); setCurrentPage(1); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                                                typeFilter === "foto"
                                                    ? "bg-white text-[#025EDB] shadow-sm"
                                                    : "text-on-surface-variant hover:text-on-surface"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">image</span>
                                            Foto
                                        </button>
                                        <button
                                            onClick={() => { setTypeFilter("video"); setCurrentPage(1); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                                                typeFilter === "video"
                                                    ? "bg-white text-[#025EDB] shadow-sm"
                                                    : "text-on-surface-variant hover:text-on-surface"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">videocam</span>
                                            Video
                                        </button>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="relative shrink-0 flex items-center">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="h-9 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none bg-none cursor-pointer"
                                        >
                                            <option value="all">Semua Status</option>
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="relative shrink-0 flex items-center">
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => {
                                                setCategoryFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="h-9 pl-3.5 pr-8 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none bg-none cursor-pointer"
                                        >
                                            {categoryOptions.map((cat, i) => (
                                                <option key={i} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* Right Side: View Switch & Item Count */}
                                <div className="flex items-center justify-between md:justify-end gap-3">
                                    <span className="text-xs font-medium text-outline">
                                        Menampilkan <b className="text-on-surface">{filteredGalleries.length}</b> data
                                    </span>

                                    <div className="inline-flex p-1 bg-surface-container rounded-xl">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                viewMode === "grid"
                                                    ? "bg-white text-primary shadow-sm"
                                                    : "text-outline hover:text-on-surface"
                                            }`}
                                            title="Grid Tampilan Kartu"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                        </button>
                                        <button
                                            onClick={() => setViewMode("table")}
                                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                viewMode === "table"
                                                    ? "bg-white text-primary shadow-sm"
                                                    : "text-outline hover:text-on-surface"
                                            }`}
                                            title="Tabel Data"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">view_list</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Display: Grid View or Table View */}
                            {filteredGalleries.length > 0 ? (
                                <>
                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                            {paginatedGalleries.map((item) => {
                                                const catStyle = getCategoryStyle(item.kategori || item.category);
                                                const isVideo = (item.tipe || item.type) === "video";
                                                const isDraft = (item.status || "Published") === "Draft";

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`group bg-surface-container-lowest rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
                                                            item.is_featured
                                                                ? "border-amber-400/80 shadow-md ring-1 ring-amber-300/50"
                                                                : "border-outline-variant/60 shadow-sm hover:shadow-md hover:-translate-y-1"
                                                        }`}
                                                    >
                                                        {/* Thumbnail & Badges Container */}
                                                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                                            <img
                                                                src={item.image || "/images/image6.png"}
                                                                alt={item.judul}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />

                                                            {/* Dark gradient overlay on hover */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                                <button
                                                                    onClick={() => openPreviewModal(item)}
                                                                    className="w-full py-1.5 px-3 bg-white/90 hover:bg-white text-gray-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow backdrop-blur-sm cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">
                                                                        {isVideo ? "play_circle" : "visibility"}
                                                                    </span>
                                                                    <span>Pratinjau {isVideo ? "Video" : "Foto"}</span>
                                                                </button>
                                                            </div>

                                                            {/* Type & Featured Badge */}
                                                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                                                                    isVideo
                                                                        ? "bg-amber-600 text-white"
                                                                        : "bg-blue-600 text-white"
                                                                }`}>
                                                                    <span className="material-symbols-outlined text-[12px]">
                                                                        {isVideo ? "videocam" : "photo_camera"}
                                                                    </span>
                                                                    {isVideo ? "Video" : "Foto"}
                                                                </span>

                                                                {item.is_featured && (
                                                                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-extrabold text-[10px] flex items-center gap-0.5 shadow-sm">
                                                                        ⭐ Utama
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Status Badge Top Right */}
                                                            <div className="absolute top-2.5 right-2.5 z-10">
                                                                <button
                                                                    onClick={() => handleToggleStatus(item)}
                                                                    title="Klik untuk ubah status"
                                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase cursor-pointer shadow-sm transition ${
                                                                        isDraft
                                                                            ? "bg-gray-800/80 text-gray-200 hover:bg-gray-900"
                                                                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                                                                    }`}
                                                                >
                                                                    {isDraft ? "Draft" : "Published"}
                                                                </button>
                                                            </div>

                                                            {/* Video Duration Badge */}
                                                            {isVideo && item.duration && (
                                                                <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                                                    {item.duration}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${catStyle.bg}`}>
                                                                    {item.kategori || item.category}
                                                                </span>

                                                                <h3 className="font-headline-sm text-sm font-bold text-on-surface mt-2 leading-snug line-clamp-2">
                                                                    {item.judul || item.title}
                                                                </h3>

                                                                {item.deskripsi && (
                                                                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                                                                        {item.deskripsi}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                                                                <span className="text-[11px] text-outline flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                                    {item.tanggal || item.date}
                                                                </span>

                                                                {/* Action buttons */}
                                                                <div className="flex items-center gap-1">
                                                                    {/* Featured toggle star */}
                                                                    <button
                                                                        onClick={() => handleToggleFeatured(item)}
                                                                        title={item.is_featured ? "Copot status utama" : "Jadikan kegiatan utama"}
                                                                        className={`p-1 rounded-lg text-xs transition cursor-pointer ${
                                                                            item.is_featured
                                                                                ? "text-amber-500 hover:bg-amber-50"
                                                                                : "text-outline hover:text-amber-500 hover:bg-surface-container"
                                                                        }`}
                                                                    >
                                                                        <span className={`material-symbols-outlined text-[18px] ${item.is_featured ? "fill" : ""}`}>
                                                                            star
                                                                        </span>
                                                                    </button>

                                                                    {/* Edit */}
                                                                    <button
                                                                        onClick={() => openEditModal(item)}
                                                                        title="Edit item galeri"
                                                                        className="p-1 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition cursor-pointer"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                    </button>

                                                                    {/* Delete */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedItem(item);
                                                                            setShowDeleteModal(true);
                                                                        }}
                                                                        title="Hapus item galeri"
                                                                        className="p-1 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition cursor-pointer"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Table View */
                                        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs text-on-surface">
                                                    <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/60">
                                                        <tr>
                                                            <th className="px-4 py-3.5">Media</th>
                                                            <th className="px-4 py-3.5">Judul &amp; Deskripsi</th>
                                                            <th className="px-4 py-3.5">Kategori</th>
                                                            <th className="px-4 py-3.5">Tipe</th>
                                                            <th className="px-4 py-3.5">Tanggal</th>
                                                            <th className="px-4 py-3.5 text-center">Status</th>
                                                            <th className="px-4 py-3.5 text-center">Utama</th>
                                                            <th className="px-4 py-3.5 text-right">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-outline-variant/40">
                                                        {paginatedGalleries.map((item) => {
                                                            const catStyle = getCategoryStyle(item.kategori || item.category);
                                                            const isVideo = (item.tipe || item.type) === "video";
                                                            const isDraft = (item.status || "Published") === "Draft";

                                                            return (
                                                                <tr key={item.id} className="hover:bg-surface-container-low/50 transition">
                                                                    <td className="px-4 py-3">
                                                                        <div
                                                                            onClick={() => openPreviewModal(item)}
                                                                            className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 cursor-pointer group shadow-sm"
                                                                        >
                                                                            <img
                                                                                src={item.image || "/images/image6.png"}
                                                                                alt={item.judul}
                                                                                className="w-full h-full object-cover group-hover:scale-110 transition"
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                                                <span className="material-symbols-outlined text-white text-[16px]">
                                                                                    {isVideo ? "play_circle" : "visibility"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 max-w-xs">
                                                                        <p className="font-bold text-on-surface truncate">{item.judul || item.title}</p>
                                                                        <p className="text-outline text-[11px] truncate">{item.deskripsi || "-"}</p>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${catStyle.bg}`}>
                                                                            {item.kategori || item.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                                            isVideo ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                                                                        }`}>
                                                                            <span className="material-symbols-outlined text-[12px]">
                                                                                {isVideo ? "videocam" : "photo_camera"}
                                                                            </span>
                                                                            {isVideo ? "Video" : "Foto"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-outline whitespace-nowrap">
                                                                        {item.tanggal || item.date}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <button
                                                                            onClick={() => handleToggleStatus(item)}
                                                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition ${
                                                                                isDraft
                                                                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                                            }`}
                                                                        >
                                                                            {isDraft ? "Draft" : "Published"}
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <button
                                                                            onClick={() => handleToggleFeatured(item)}
                                                                            className={`p-1 rounded-lg cursor-pointer transition ${
                                                                                item.is_featured
                                                                                    ? "text-amber-500 hover:bg-amber-50"
                                                                                    : "text-outline hover:text-amber-500"
                                                                            }`}
                                                                        >
                                                                            <span className={`material-symbols-outlined text-[20px] ${item.is_featured ? "fill" : ""}`}>
                                                                                star
                                                                            </span>
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            <button
                                                                                onClick={() => openPreviewModal(item)}
                                                                                className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container cursor-pointer"
                                                                                title="Pratinjau"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => openEditModal(item)}
                                                                                className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container cursor-pointer"
                                                                                title="Edit"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedItem(item);
                                                                                    setShowDeleteModal(true);
                                                                                }}
                                                                                className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 cursor-pointer"
                                                                                title="Hapus"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-2">
                                            <p className="text-xs text-outline font-medium">
                                                Halaman <span className="font-bold text-on-surface">{currentPage}</span> dari <span className="font-bold text-on-surface">{totalPages}</span>
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                                                    <button
                                                        key={pg}
                                                        onClick={() => setCurrentPage(pg)}
                                                        className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                                                            currentPage === pg
                                                                ? "bg-[#025EDB] text-white shadow-sm"
                                                                : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                                                        }`}
                                                    >
                                                        {pg}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Empty State */
                                <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
                                        <span className="material-symbols-outlined text-3xl">photo_library</span>
                                    </div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">Tidak ada data galeri</h3>
                                    <p className="font-body-md text-xs text-outline mt-1 max-w-sm">
                                        Tidak ditemukan media yang sesuai dengan filter atau kata kunci pencarian Anda.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setTypeFilter("all");
                                            setStatusFilter("all");
                                            setCategoryFilter("Semua");
                                        }}
                                        className="mt-4 px-4 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high transition cursor-pointer"
                                    >
                                        Reset Semua Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* --------------------------- CREATE MODAL -------------------------------- */}
            {/* ========================================================================= */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl border border-outline-variant shadow-2xl overflow-hidden my-8 animate-fade-in">
                        {/* Header */}
                        <div className="p-5 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {newItem.tipe === "video" ? "video_call" : "add_photo_alternate"}
                                    </span>
                                </span>
                                <div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                        Tambah {newItem.tipe === "video" ? "Video Kegiatan" : "Foto Dokumentasi"}
                                    </h3>
                                    <p className="text-xs text-outline">Lengkapi detail media untuk ditampilkan pada halaman galeri.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1.5 rounded-full text-outline hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreate} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                            {/* Type switch */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-2">Tipe Media</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewItem(prev => ({ ...prev, tipe: "foto" }))}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                                            newItem.tipe === "foto"
                                                ? "border-[#025EDB] bg-blue-50/50 text-[#025EDB]"
                                                : "border-outline-variant/60 text-outline hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                        Foto Dokumentasi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewItem(prev => ({ ...prev, tipe: "video" }))}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                                            newItem.tipe === "video"
                                                ? "border-[#D38B1D] bg-amber-50/50 text-[#D38B1D]"
                                                : "border-outline-variant/60 text-outline hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                                        Video Kegiatan
                                    </button>
                                </div>
                            </div>

                            {/* Judul Media */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1.5">
                                    Judul Dokumentasi <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.judul}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, judul: e.target.value }))}
                                    placeholder="Contoh: Belajar Bahasa Isyarat Santri Tuli"
                                    className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/80 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Kategori & Tanggal Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Kategori Kegiatan</label>
                                    <div className="relative flex items-center">
                                        <select
                                            value={newItem.kategori}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, kategori: e.target.value }))}
                                            className="w-full h-11 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                        >
                                            <option value="Maktab Tuli">Maktab Tuli</option>
                                            <option value="Maktab Autis">Maktab Autis</option>
                                            <option value="Kegiatan Yayasan">Kegiatan Yayasan</option>
                                            <option value="Pembelajaran">Pembelajaran</option>
                                            <option value="Acara Sosial">Acara Sosial</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Tanggal Pelaksanaan</label>
                                    <input
                                        type="date"
                                        value={newItem.tanggal}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, tanggal: e.target.value }))}
                                        className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            {/* If Video: Link YouTube & Duration */}
                            {newItem.tipe === "video" && (
                                <div className="space-y-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                                    <div>
                                        <label className="block text-xs font-bold text-amber-950 mb-1.5">
                                            URL Video (YouTube / Link Video) <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={newItem.video_url}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, video_url: e.target.value }))}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full h-11 px-4 bg-white border border-amber-300 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-amber-500/20"
                                        />
                                        <p className="text-[11px] text-amber-800/80 mt-1">
                                            Mendukung link YouTube biasa, YouTube Shorts, maupun Vimeo.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-amber-950 mb-1.5">
                                            Durasi Video (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newItem.duration}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="Contoh: 04:25 atau 12:10"
                                            className="w-full h-10 px-4 bg-white border border-amber-300 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-amber-500/20"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Foto / Thumbnail Upload Big Box */}
                            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            add_photo_alternate
                                        </span>
                                        {newItem.tipe === "video" ? "Thumbnail Video" : "Foto Utama / Thumbnail Galeri"}
                                    </span>
                                    <span className="text-[11px] text-outline">Format: PNG, JPG, JPEG, WEBP (Maks. 10MB)</span>
                                </div>

                                <input
                                    type="file"
                                    ref={createFileInputRef}
                                    onChange={(e) => handleFileSelect(e, false)}
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    className="hidden"
                                />

                                {newItem.previewUrl || newItem.image ? (
                                    /* PREVIEW OF UPLOADED PHOTO */
                                    <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                        <img
                                            src={newItem.previewUrl || newItem.image}
                                            alt="Preview Foto Galeri"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            Foto Terpilih
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => createFileInputRef.current?.click()}
                                                className="px-4 py-2 bg-white text-gray-900 rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                Ganti Foto
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewItem((prev) => ({
                                                        ...prev,
                                                        imageFile: null,
                                                        previewUrl: "",
                                                        image: "",
                                                    }));
                                                    if (createFileInputRef.current) {
                                                        createFileInputRef.current.value = "";
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* UPLOAD DROPZONE / SELECTOR */
                                    <div
                                        onClick={() => createFileInputRef.current?.click()}
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
                                                createFileInputRef.current?.click();
                                            }}
                                            className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                                            Pilih Foto dari Komputer
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1.5">Deskripsi Kegiatan</label>
                                <textarea
                                    rows={3}
                                    value={newItem.deskripsi}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    placeholder="Tuliskan keterangan singkat atau cerita di balik dokumentasi kegiatan ini..."
                                    className="w-full p-3 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Status & Featured */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Status Publikasi</label>
                                    <div className="relative flex items-center">
                                        <select
                                            value={newItem.status}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full h-11 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                        >
                                            <option value="Published">Published (Tampil di Website)</option>
                                            <option value="Draft">Draft (Disimpan Sementara)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="relative flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={newItem.is_featured}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, is_featured: e.target.checked }))}
                                            className="w-5 h-5 rounded-lg text-amber-500 focus:ring-amber-400 border-outline-variant"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                                                ⭐ Jadikan Kegiatan Utama
                                            </span>
                                            <span className="text-[11px] text-outline block">Ditampilkan di banner sorotan galeri</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit & Cancel */}
                            <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-[#025EDB] hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition disabled:opacity-50"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Simpan Dokumentasi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* ---------------------------- EDIT MODAL --------------------------------- */}
            {/* ========================================================================= */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl border border-outline-variant shadow-2xl overflow-hidden my-8 animate-fade-in">
                        {/* Header */}
                        <div className="p-5 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </span>
                                <div>
                                    <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                        Edit Item Galeri #{selectedItem.id}
                                    </h3>
                                    <p className="text-xs text-outline">Perbarui informasi atau media dokumentasi.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-1.5 rounded-full text-outline hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdate} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                            {/* Type switch */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-2">Tipe Media</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedItem(prev => ({ ...prev, tipe: "foto" }))}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                                            selectedItem.tipe === "foto"
                                                ? "border-[#025EDB] bg-blue-50/50 text-[#025EDB]"
                                                : "border-outline-variant/60 text-outline hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                        Foto Dokumentasi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedItem(prev => ({ ...prev, tipe: "video" }))}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                                            selectedItem.tipe === "video"
                                                ? "border-[#D38B1D] bg-amber-50/50 text-[#D38B1D]"
                                                : "border-outline-variant/60 text-outline hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                                        Video Kegiatan
                                    </button>
                                </div>
                            </div>

                            {/* Judul */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1.5">
                                    Judul Dokumentasi <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={selectedItem.judul}
                                    onChange={(e) => setSelectedItem(prev => ({ ...prev, judul: e.target.value }))}
                                    className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/80 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Kategori & Tanggal Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Kategori Kegiatan</label>
                                    <div className="relative flex items-center">
                                        <select
                                            value={selectedItem.kategori}
                                            onChange={(e) => setSelectedItem(prev => ({ ...prev, kategori: e.target.value }))}
                                            className="w-full h-11 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                        >
                                            <option value="Maktab Tuli">Maktab Tuli</option>
                                            <option value="Maktab Autis">Maktab Autis</option>
                                            <option value="Kegiatan Yayasan">Kegiatan Yayasan</option>
                                            <option value="Pembelajaran">Pembelajaran</option>
                                            <option value="Acara Sosial">Acara Sosial</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Tanggal Pelaksanaan</label>
                                    <input
                                        type="date"
                                        value={selectedItem.tanggal}
                                        onChange={(e) => setSelectedItem(prev => ({ ...prev, tanggal: e.target.value }))}
                                        className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            {/* If Video: Link YouTube & Duration */}
                            {selectedItem.tipe === "video" && (
                                <div className="space-y-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                                    <div>
                                        <label className="block text-xs font-bold text-amber-950 mb-1.5">
                                            URL Video (YouTube / Link Video) <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={selectedItem.video_url}
                                            onChange={(e) => setSelectedItem(prev => ({ ...prev, video_url: e.target.value }))}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full h-11 px-4 bg-white border border-amber-300 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-amber-500/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-amber-950 mb-1.5">
                                            Durasi Video (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedItem.duration}
                                            onChange={(e) => setSelectedItem(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="Contoh: 04:25"
                                            className="w-full h-10 px-4 bg-white border border-amber-300 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-amber-500/20"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Foto / Thumbnail Upload Big Box */}
                            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            add_photo_alternate
                                        </span>
                                        {selectedItem.tipe === "video" ? "Thumbnail Video" : "Foto Utama / Thumbnail Galeri"}
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

                                {selectedItem.previewUrl || selectedItem.image ? (
                                    /* PREVIEW OF PHOTO */
                                    <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                        <img
                                            src={selectedItem.previewUrl || selectedItem.image}
                                            alt="Preview Foto Galeri"
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
                                                onClick={() => {
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        imageFile: null,
                                                        previewUrl: "",
                                                        image: "",
                                                    }));
                                                    if (editFileInputRef.current) {
                                                        editFileInputRef.current.value = "";
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* UPLOAD DROPZONE / SELECTOR */
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

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-1.5">Deskripsi Kegiatan</label>
                                <textarea
                                    rows={3}
                                    value={selectedItem.deskripsi}
                                    onChange={(e) => setSelectedItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    className="w-full p-3 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs text-on-surface focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Status & Featured */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-1.5">Status Publikasi</label>
                                    <div className="relative flex items-center">
                                        <select
                                            value={selectedItem.status}
                                            onChange={(e) => setSelectedItem(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full h-11 pl-3.5 pr-9 bg-surface-container-low border border-outline-variant/80 rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-none"
                                        >
                                            <option value="Published">Published (Tampil di Website)</option>
                                            <option value="Draft">Draft (Disimpan Sementara)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="relative flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={selectedItem.is_featured}
                                            onChange={(e) => setSelectedItem(prev => ({ ...prev, is_featured: e.target.checked }))}
                                            className="w-5 h-5 rounded-lg text-amber-500 focus:ring-amber-400 border-outline-variant"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                                                ⭐ Jadikan Kegiatan Utama
                                            </span>
                                            <span className="text-[11px] text-outline block">Ditampilkan di banner sorotan galeri</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit & Cancel */}
                            <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-[#025EDB] hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition disabled:opacity-50"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* --------------------------- PREVIEW MODAL ------------------------------- */}
            {/* ========================================================================= */}
            {showPreviewModal && selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fade-in">
                    <div className="bg-surface-container-lowest w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
                                    (selectedItem.tipe || selectedItem.type) === "video" ? "bg-amber-600" : "bg-blue-600"
                                }`}>
                                    {(selectedItem.tipe || selectedItem.type) === "video" ? "Video" : "Foto"}
                                </span>
                                <h3 className="font-bold text-sm truncate max-w-md">{selectedItem.judul || selectedItem.title}</h3>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Media Viewport */}
                        <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[60vh] overflow-hidden">
                            {(selectedItem.tipe || selectedItem.type) === "video" ? (
                                <div className="w-full aspect-video">
                                    <iframe
                                        src={`${selectedItem.embed_url || selectedItem.video_url}?autoplay=1`}
                                        title={selectedItem.judul}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <img
                                    src={selectedItem.previewUrl || selectedItem.image}
                                    alt={selectedItem.judul}
                                    className="max-h-[58vh] max-w-full object-contain"
                                />
                            )}
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-6 bg-surface-container-lowest flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                                        getCategoryStyle(selectedItem.kategori || selectedItem.category).bg
                                    }`}>
                                        {selectedItem.kategori || selectedItem.category}
                                    </span>
                                    <span className="text-xs text-outline">
                                        Tanggal: <b>{selectedItem.tanggal || selectedItem.date}</b>
                                    </span>
                                    {selectedItem.is_featured && (
                                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                                            ⭐ Sorotan Utama
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-on-surface-variant max-w-xl">
                                    {selectedItem.deskripsi || "Tidak ada keterangan deskripsi tambahan."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        openEditModal(selectedItem);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#025EDB] text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Tutup Pratinjau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* ---------------------------- DELETE MODAL ------------------------------- */}
            {/* ========================================================================= */}
            {showDeleteModal && selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl border border-outline-variant p-6 shadow-2xl text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-3xl">delete_forever</span>
                        </div>
                        <h3 className="font-headline-sm text-base font-bold text-on-surface">
                            Hapus Item Galeri?
                        </h3>
                        <p className="text-xs text-outline leading-relaxed">
                            Apakah Anda yakin ingin menghapus <b>"{selectedItem.judul || selectedItem.title}"</b>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer transition disabled:opacity-50"
                            >
                                {isSubmitting ? "Menghapus..." : "Ya, Hapus Data"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
