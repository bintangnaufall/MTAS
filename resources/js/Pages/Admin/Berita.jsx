import React, { useState, useMemo, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Elements/Sidebar";
import TopBar from "@/Components/Elements/TopBar";
import ConfirmModal from "@/Components/Elements/ConfirmModal";

// Helper to get today's date formatted as YYYY-MM-DD for <input type="date">
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Helper to convert any date string to YYYY-MM-DD for <input type="date">
const parseDateToInput = (dateStr) => {
    if (!dateStr) return getTodayDate();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const indonesianMonths = {
        jan: "01", januari: "01",
        feb: "02", februari: "02",
        mar: "03", maret: "03",
        apr: "04", april: "04",
        mei: "05", may: "05",
        jun: "06", juni: "06",
        jul: "07", juli: "07",
        agu: "08", agustus: "08", ags: "08", aug: "08",
        sep: "09", september: "09",
        okt: "10", oktober: "10", oct: "10",
        nov: "11", november: "11",
        des: "12", desember: "12", dec: "12",
    };

    const parts = dateStr.trim().split(/[\s-]+/);
    if (parts.length === 3) {
        if (/^\d{1,2}$/.test(parts[0]) && /^\d{4}$/.test(parts[2])) {
            const day = parts[0].padStart(2, "0");
            const mKey = parts[1].toLowerCase().replace(".", "");
            const month = indonesianMonths[mKey] || "01";
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
    }

    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    return getTodayDate();
};

// Helper to format date for human display (e.g. 22 Agu 2026 or keep legacy text)
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Hari ini";
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.split("T")[0].split("-");
        const months = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
            "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ];
        const monthIndex = parseInt(month, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
        }
    }
    return dateStr;
};

// Initial state for creating a new article (all content fields empty with today's date & logged-in author)
const getInitialNewArticle = (userName) => ({
    judul: "",
    kategori: "PENDIDIKAN",
    image: "",
    imageFile: null,
    previewUrl: "",
    penulis: userName || "Admin Yayasan",
    tanggal: getTodayDate(),
    status: "Published",
    is_featured: false,
    ringkasan: "",
    blockquote: "",
    paragraf1: "",
    subheading: "",
    paragraf2: "",
    blue_quote: "",
    blue_quote_author: "",
    paragraf3: "",
    dokumentasi: [], // array of { id, type: 'image'|'video', url, file, previewUrl, caption }
});

export default function AdminBerita({ auth, articlesData }) {
    const user = auth?.user || {
        name: "Admin Utama",
        email: "admin@bhaktiarumi.org",
        role: "Super Admin",
    };

    // State articles synced with database prop
    const [articles, setArticles] = useState(articlesData || []);

    useEffect(() => {
        if (articlesData) {
            setArticles(articlesData);
        }
    }, [articlesData]);

    // Navigation & UI state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'draft'
    const [categoryFilter, setCategoryFilter] = useState("Semua");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Confirmation Modal States for Status & Featured Toggle
    const [statusToToggle, setStatusToToggle] = useState(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [featuredToToggle, setFeaturedToToggle] = useState(null);
    const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);

    // Dokumentasi URL modal state
    const [showDocUrlModal, setShowDocUrlModal] = useState(false);
    const [docUrlInput, setDocUrlInput] = useState("");
    const [docTypeInput, setDocTypeInput] = useState("video");
    const [isEditDocUrl, setIsEditDocUrl] = useState(false);

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

    // New article state
    const [newArticle, setNewArticle] = useState(() => getInitialNewArticle(user?.name));

    // File input refs
    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);
    const docFileInputRef = useRef(null);
    const editDocFileInputRef = useRef(null);

    // Category styling helper
    const getCategoryStyle = (cat) => {
        switch (cat?.toUpperCase()) {
            case "PENDIDIKAN":
                return {
                    bg: "bg-[#FFF3E3] text-[#D38B1D] border-[#FFE2BC]",
                    dot: "bg-[#D38B1D]",
                };
            case "KEGIATAN":
                return {
                    bg: "bg-[#E6EFFB] text-[#025EDB] border-[#CDE1FB]",
                    dot: "bg-[#025EDB]",
                };
            case "PENGUMUMAN":
                return {
                    bg: "bg-[#FDF2F8] text-[#BE185D] border-[#FCE7F3]",
                    dot: "bg-[#BE185D]",
                };
            case "MAKTAB TULI":
                return {
                    bg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
                    dot: "bg-[#0369A1]",
                };
            case "KAJIAN":
                return {
                    bg: "bg-purple-100 text-purple-700 border-purple-200",
                    dot: "bg-purple-600",
                };
            default:
                return {
                    bg: "bg-gray-100 text-gray-700 border-gray-200",
                    dot: "bg-gray-500",
                };
        }
    };

    // Author initials helper
    const getAuthorInitials = (name) => {
        if (!name) return "AD";
        return (
            name
                .trim()
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "AD"
        );
    };

    // Handle selecting photo from device / computer for main image
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
                setSelectedArticle((prev) => ({
                    ...prev,
                    imageFile: file,
                    previewUrl: base64Url,
                    image: base64Url,
                }));
            } else {
                setNewArticle((prev) => ({
                    ...prev,
                    imageFile: file,
                    previewUrl: base64Url,
                    image: base64Url,
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Handle multiple documentation files (Photos & Videos, max 6)
    const handleDokumentasiFileSelect = (e, isEdit = false) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const currentList = isEdit
            ? (selectedArticle?.dokumentasi || [])
            : (newArticle.dokumentasi || []);

        if (currentList.length >= 6) {
            alert("Maksimal 6 foto/video dokumentasi.");
            return;
        }

        const availableSlots = 6 - currentList.length;
        const filesToAdd = files.slice(0, availableSlots);

        filesToAdd.forEach((file) => {
            const isVideo = file.type.startsWith("video/");
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Url = event.target.result;
                const newItem = {
                    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: isVideo ? "video" : "image",
                    file: file,
                    previewUrl: base64Url,
                    url: base64Url,
                    caption: file.name,
                };

                if (isEdit) {
                    setSelectedArticle((prev) => ({
                        ...prev,
                        dokumentasi: [...(prev.dokumentasi || []), newItem],
                    }));
                } else {
                    setNewArticle((prev) => ({
                        ...prev,
                        dokumentasi: [...(prev.dokumentasi || []), newItem],
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        if (e.target) e.target.value = "";
    };

    // Remove single documentation item
    const handleRemoveDokumentasi = (index, isEdit = false) => {
        if (isEdit) {
            setSelectedArticle((prev) => ({
                ...prev,
                dokumentasi: (prev.dokumentasi || []).filter((_, idx) => idx !== index),
            }));
        } else {
            setNewArticle((prev) => ({
                ...prev,
                dokumentasi: (prev.dokumentasi || []).filter((_, idx) => idx !== index),
            }));
        }
    };

    // Add documentation photo or video from URL
    const handleAddDokumentasiUrl = () => {
        const url = docUrlInput.trim();
        if (!url) {
            alert("Harap masukkan URL foto atau video yang valid.");
            return;
        }

        const isEdit = isEditDocUrl;
        const currentList = isEdit
            ? (selectedArticle?.dokumentasi || [])
            : (newArticle.dokumentasi || []);

        if (currentList.length >= 6) {
            alert("Maksimal 6 foto/video dokumentasi.");
            return;
        }

        const isVideo =
            docTypeInput === "video" ||
            /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ||
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("vimeo.com");

        const newItem = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: isVideo ? "video" : "image",
            url: url,
            previewUrl: url,
            caption: isVideo ? "Video Dokumentasi Link" : "Foto Dokumentasi Link",
        };

        if (isEdit) {
            setSelectedArticle((prev) => ({
                ...prev,
                dokumentasi: [...(prev.dokumentasi || []), ...newItem],
            }));
        } else {
            setNewArticle((prev) => ({
                ...prev,
                dokumentasi: [...(prev.dokumentasi || []), ...newItem],
            }));
        }

        setDocUrlInput("");
        setShowDocUrlModal(false);
    };

    // Handle logout
    const handleLogout = (e) => {
        e?.preventDefault?.();
        router.post(
            typeof route !== "undefined" ? route("logout") : "/logout"
        );
    };

    // Filtered articles
    const filteredArticles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return articles.filter((art) => {
            const title = (art.judul || art.title || "").toLowerCase();
            const author = (art.penulis || art.author || "").toLowerCase();
            const category = (art.kategori || art.category || "").toLowerCase();
            const summary = (art.ringkasan || art.summary || "").toLowerCase();
            const status = (art.status || "Published").toLowerCase();

            const matchesQuery =
                !query ||
                title.includes(query) ||
                author.includes(query) ||
                category.includes(query) ||
                summary.includes(query);

            const matchesStatus =
                statusFilter === "all" || status === statusFilter.toLowerCase();

            const matchesCategory =
                categoryFilter === "Semua" ||
                (art.kategori || art.category || "").toUpperCase() ===
                    categoryFilter.toUpperCase();

            return matchesQuery && matchesStatus && matchesCategory;
        });
    }, [articles, searchQuery, statusFilter, categoryFilter]);

    // Paginated articles
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredArticles.slice(start, start + itemsPerPage);
    }, [filteredArticles, currentPage]);

    // Open create modal with fresh empty fields & default logged in author
    const openCreateModal = () => {
        setNewArticle(getInitialNewArticle(user?.name));
        setShowCreateModal(true);
    };

    // Open edit modal with normalized article fields & date in YYYY-MM-DD
    const openEditModal = (art) => {
        let formattedDate = art.tanggal || art.date || "";
        if (formattedDate && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
            const parsed = new Date(formattedDate);
            if (!isNaN(parsed.getTime())) {
                const year = parsed.getFullYear();
                const month = String(parsed.getMonth() + 1).padStart(2, "0");
                const day = String(parsed.getDate()).padStart(2, "0");
                formattedDate = `${year}-${month}-${day}`;
            } else {
                formattedDate = getTodayDate();
            }
        } else if (!formattedDate) {
            formattedDate = getTodayDate();
        }

        let rawDocs = art.dokumentasi || [];
        if (typeof rawDocs === "string") {
            try {
                rawDocs = JSON.parse(rawDocs);
            } catch (e) {
                rawDocs = [];
            }
        }
        const normalizedDocs = (Array.isArray(rawDocs) ? rawDocs : [])
            .slice(0, 6)
            .map((item, idx) => {
                if (typeof item === "string") {
                    const isVideo =
                        /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item) ||
                        item.includes("youtube.com") ||
                        item.includes("youtu.be");
                    return {
                        id: `doc_${idx}`,
                        type: isVideo ? "video" : "image",
                        url: item,
                        previewUrl: item,
                        caption: `Dokumentasi ${idx + 1}`,
                    };
                }
                return {
                    id: item.id || `doc_${idx}`,
                    type:
                        item.type ||
                        (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item.url || "") ||
                        item.url?.includes("youtube.com") ||
                        item.url?.includes("youtu.be")
                            ? "video"
                            : "image"),
                    url: item.url || "",
                    previewUrl: item.url || "",
                    caption: item.caption || `Dokumentasi ${idx + 1}`,
                };
            });

        setSelectedArticle({
            id: art.id,
            judul: art.judul || art.title || "",
            kategori: art.kategori || art.category || "PENDIDIKAN",
            image: art.image || "/images/berita_utama.png",
            imageFile: null,
            previewUrl: art.image || "/images/berita_utama.png",
            penulis: art.penulis || art.author || user?.name || "Admin Yayasan",
            tanggal: formattedDate,
            status: art.status || "Published",
            is_featured: Boolean(art.is_featured),
            ringkasan: art.ringkasan || art.summary || "",
            blockquote: art.blockquote || "",
            paragraf1: art.paragraf1 || "",
            subheading: art.subheading || "",
            paragraf2: art.paragraf2 || "",
            blue_quote: art.blue_quote || art.blueQuote || "",
            blue_quote_author:
                art.blue_quote_author || art.blueQuoteAuthor || "",
            paragraf3: art.paragraf3 || "",
            dokumentasi: normalizedDocs,
        });
        setShowEditModal(true);
        setActiveDropdownId(null);
    };

    // Open preview modal
    const openPreviewModal = (art) => {
        let rawDocs = art.dokumentasi || [];
        if (typeof rawDocs === "string") {
            try {
                rawDocs = JSON.parse(rawDocs);
            } catch (e) {
                rawDocs = [];
            }
        }
        const normalizedDocs = (Array.isArray(rawDocs) ? rawDocs : [])
            .slice(0, 6)
            .map((item, idx) => {
                if (typeof item === "string") {
                    const isVideo =
                        /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item) ||
                        item.includes("youtube.com") ||
                        item.includes("youtu.be");
                    return {
                        id: `doc_${idx}`,
                        type: isVideo ? "video" : "image",
                        url: item,
                        previewUrl: item,
                        caption: `Dokumentasi ${idx + 1}`,
                    };
                }
                return {
                    id: item.id || `doc_${idx}`,
                    type:
                        item.type ||
                        (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item.url || "") ||
                        item.url?.includes("youtube.com") ||
                        item.url?.includes("youtu.be")
                            ? "video"
                            : "image"),
                    url: item.url || "",
                    previewUrl: item.url || "",
                    caption: item.caption || `Dokumentasi ${idx + 1}`,
                };
            });

        setSelectedArticle({
            id: art.id,
            judul: art.judul || art.title || "Tanpa Judul",
            kategori: art.kategori || art.category || "PENDIDIKAN",
            image: art.image || "/images/berita_utama.png",
            penulis: art.penulis || art.author || "Admin Yayasan",
            tanggal: art.tanggal || art.date || "",
            status: art.status || "Published",
            is_featured: Boolean(art.is_featured),
            ringkasan: art.ringkasan || art.summary || "",
            blockquote: art.blockquote || "",
            paragraf1: art.paragraf1 || "",
            subheading: art.subheading || "",
            paragraf2: art.paragraf2 || "",
            blue_quote: art.blue_quote || art.blueQuote || "",
            blue_quote_author:
                art.blue_quote_author || art.blueQuoteAuthor || "",
            paragraf3: art.paragraf3 || "",
            dokumentasi: normalizedDocs,
        });
        setShowPreviewModal(true);
        setActiveDropdownId(null);
    };

    // Handle create article submission
    const handleCreateArticle = (e) => {
        e.preventDefault();
        const judul = newArticle.judul?.trim();
        if (!judul) {
            alert("Judul berita wajib diisi.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("judul", judul);
        formData.append("kategori", newArticle.kategori || "PENDIDIKAN");
        formData.append(
            "penulis",
            newArticle.penulis || user?.name || "Admin Yayasan"
        );
        formData.append("tanggal", newArticle.tanggal || getTodayDate());
        formData.append("status", newArticle.status || "Published");
        formData.append("is_featured", newArticle.is_featured ? "1" : "0");
        formData.append("ringkasan", newArticle.ringkasan || "");
        formData.append("blockquote", newArticle.blockquote || "");
        formData.append("paragraf1", newArticle.paragraf1 || "");
        formData.append("subheading", newArticle.subheading || "");
        formData.append("paragraf2", newArticle.paragraf2 || "");
        formData.append("blue_quote", newArticle.blue_quote || "");
        formData.append(
            "blue_quote_author",
            newArticle.blue_quote_author || ""
        );
        formData.append("paragraf3", newArticle.paragraf3 || "");

        if (newArticle.imageFile) {
            formData.append("image_file", newArticle.imageFile);
        } else if (newArticle.image && !newArticle.image.startsWith("blob:")) {
            formData.append("image", newArticle.image);
        }

        // Process documentation photos & videos
        const docs = newArticle.dokumentasi || [];
        const docMetadata = docs.map((d) => ({
            type: d.type,
            url: d.url && !d.url.startsWith("blob:") ? d.url : "",
            caption: d.caption || "",
        }));
        formData.append("dokumentasi", JSON.stringify(docMetadata));

        docs.forEach((d) => {
            if (d.file) {
                formData.append("dokumentasi_files[]", d.file);
            }
        });

        router.post("/admin/berita", formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setNewArticle(getInitialNewArticle(user?.name));
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error("Error creating article:", errors);
                setIsSubmitting(false);
            },
        });
    };

    // Handle update article submission
    const handleUpdateArticle = (e) => {
        e.preventDefault();
        if (!selectedArticle) return;

        const judul = selectedArticle.judul?.trim();
        if (!judul) {
            alert("Judul berita wajib diisi.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("judul", judul);
        formData.append("kategori", selectedArticle.kategori || "PENDIDIKAN");
        formData.append(
            "penulis",
            selectedArticle.penulis || user?.name || "Admin Yayasan"
        );
        formData.append("tanggal", selectedArticle.tanggal || getTodayDate());
        formData.append("status", selectedArticle.status || "Published");
        formData.append("is_featured", selectedArticle.is_featured ? "1" : "0");
        formData.append("ringkasan", selectedArticle.ringkasan || "");
        formData.append("blockquote", selectedArticle.blockquote || "");
        formData.append("paragraf1", selectedArticle.paragraf1 || "");
        formData.append("subheading", selectedArticle.subheading || "");
        formData.append("paragraf2", selectedArticle.paragraf2 || "");
        formData.append(
            "blue_quote",
            selectedArticle.blue_quote || selectedArticle.blueQuote || ""
        );
        formData.append(
            "blue_quote_author",
            selectedArticle.blue_quote_author ||
                selectedArticle.blueQuoteAuthor ||
                ""
        );
        formData.append("paragraf3", selectedArticle.paragraf3 || "");

        if (selectedArticle.imageFile) {
            formData.append("image_file", selectedArticle.imageFile);
        } else if (
            selectedArticle.image &&
            !selectedArticle.image.startsWith("blob:")
        ) {
            formData.append("image", selectedArticle.image);
        }

        // Process documentation photos & videos
        const docs = selectedArticle.dokumentasi || [];
        const docMetadata = docs.map((d) => ({
            type: d.type,
            url: d.url && !d.url.startsWith("blob:") ? d.url : "",
            caption: d.caption || "",
        }));
        formData.append("dokumentasi", JSON.stringify(docMetadata));

        docs.forEach((d) => {
            if (d.file) {
                formData.append("dokumentasi_files[]", d.file);
            }
        });

        router.post(`/admin/berita/${selectedArticle.id}`, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedArticle(null);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error("Error updating article:", errors);
                setIsSubmitting(false);
            },
        });
    };

    // Handle delete article
    const handleDeleteArticle = () => {
        if (!selectedArticle) return;
        setIsSubmitting(true);

        router.delete(`/admin/berita/${selectedArticle.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedArticle(null);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Handle toggle status (trigger modal)
    const handleToggleStatus = (article) => {
        setActiveDropdownId(null);
        setStatusToToggle(article);
    };

    // Confirm toggle status
    const confirmToggleStatus = () => {
        if (!statusToToggle) return;
        setIsTogglingStatus(true);
        router.patch(
            `/admin/berita/${statusToToggle.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsTogglingStatus(false);
                    setStatusToToggle(null);
                },
                onError: () => {
                    setIsTogglingStatus(false);
                },
            }
        );
    };

    // Handle toggle featured (trigger modal)
    const handleToggleFeatured = (article) => {
        setActiveDropdownId(null);
        setFeaturedToToggle(article);
    };

    // Confirm toggle featured
    const confirmToggleFeatured = () => {
        if (!featuredToToggle) return;
        setIsTogglingFeatured(true);
        router.patch(
            `/admin/berita/${featuredToToggle.id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsTogglingFeatured(false);
                    setFeaturedToToggle(null);
                },
                onError: () => {
                    setIsTogglingFeatured(false);
                },
            }
        );
    };

    return (
        <>
            <Head title="Berita & Artikel - Yayasan Bhakti Arumi Delangga" />

            <div className="bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
                {/* ---------------- SIDENAVBAR ---------------- */}
                <Sidebar
                    activeNav="News/Articles"
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
                        searchPlaceholder="Cari judul artikel, kategori, penulis, atau ringkasan..."
                        setMobileMenuOpen={setMobileMenuOpen}
                        handleLogout={handleLogout}
                    />

                    {/* ---------------- MAIN BERITA CONTENT ---------------- */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-margin-desktop bg-surface">
                        <div className="max-w-container-max mx-auto space-y-6">
                            {/* Page Header */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
                                            <span className="material-symbols-outlined text-[24px]">newspaper</span>
                                        </span>
                                        <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                                            Berita &amp; Artikel
                                        </h1>
                                    </div>
                                    <p className="font-body-md text-sm text-outline">
                                        Kelola publikasi informasi, foto kegiatan, dan kategori artikel yayasan langsung dari database.
                                    </p>
                                </div>

                                {/* Action & Filter Controls */}
                                <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
                                    {/* Category Dropdown Filter */}
                                    <div className="relative shrink-0 flex items-center">
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => {
                                                setCategoryFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="h-11 pl-3.5 pr-8 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none focus:border-primary shadow-xs appearance-none bg-none cursor-pointer"
                                        >
                                            <option value="Semua">Semua Kategori</option>
                                            <option value="PENDIDIKAN">Pendidikan</option>
                                            <option value="KEGIATAN">Kegiatan</option>
                                            <option value="PENGUMUMAN">Pengumuman</option>
                                            <option value="MAKTAB TULI">Maktab Tuli</option>
                                            <option value="KAJIAN">Kajian</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                            expand_more
                                        </span>
                                    </div>

                                    {/* Status Filter Tabs */}
                                    <div className="h-11 flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/60 shadow-xs shrink-0">
                                        <button
                                            onClick={() => {
                                                setStatusFilter("all");
                                                setCurrentPage(1);
                                            }}
                                            className={`h-full px-3.5 rounded-lg text-xs font-label-md font-semibold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                                                statusFilter === "all"
                                                    ? "bg-white text-primary font-bold shadow-xs"
                                                    : "text-outline hover:text-on-surface"
                                            }`}
                                        >
                                            Semua ({articles.length})
                                        </button>
                                        <button
                                            onClick={() => {
                                                setStatusFilter("published");
                                                setCurrentPage(1);
                                            }}
                                            className={`h-full px-3.5 rounded-lg text-xs font-label-md font-semibold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                                                statusFilter === "published"
                                                    ? "bg-white text-primary font-bold shadow-xs"
                                                    : "text-outline hover:text-on-surface"
                                            }`}
                                        >
                                            Published ({articles.filter((a) => (a.status || "Published") === "Published").length})
                                        </button>
                                        <button
                                            onClick={() => {
                                                setStatusFilter("draft");
                                                setCurrentPage(1);
                                            }}
                                            className={`h-full px-3.5 rounded-lg text-xs font-label-md font-semibold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                                                statusFilter === "draft"
                                                    ? "bg-white text-primary font-bold shadow-xs"
                                                    : "text-outline hover:text-on-surface"
                                            }`}
                                        >
                                            Draft ({articles.filter((a) => a.status === "Draft").length})
                                        </button>
                                    </div>

                                    {/* Action: + Buat Berita Baru */}
                                    <button
                                        onClick={openCreateModal}
                                        className="h-11 px-5 bg-gradient-to-r from-primary to-indigo-600 text-white font-label-md text-sm rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-primary/25 hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer shrink-0 font-bold ml-auto lg:ml-0"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        <span>Buat Berita Baru</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bento List Table */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col overflow-visible relative">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider rounded-t-2xl">
                                    <div className="col-span-12 md:col-span-5">
                                        GAMBAR &amp; JUDUL BERITA
                                    </div>
                                    <div className="hidden md:block col-span-2">
                                        PENULIS
                                    </div>
                                    <div className="hidden md:block col-span-2">
                                        TANGGAL
                                    </div>
                                    <div className="hidden md:block col-span-2 text-center">
                                        STATUS
                                    </div>
                                    <div className="hidden md:block col-span-1 text-center">
                                        AKSI
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="flex flex-col divide-y divide-outline-variant">
                                    {paginatedArticles.map((art, index) => {
                                        const category = art.kategori || art.category || "KEGIATAN";
                                        const title = art.judul || art.title || "Tanpa Judul";
                                        const author = art.penulis || art.author || "Admin Yayasan";
                                        const displayDate = formatDateDisplay(art.tanggal || art.date);
                                        const summary = art.ringkasan || art.summary || art.paragraf1 || "";
                                        const catStyle = getCategoryStyle(category);
                                        const authorInitials = getAuthorInitials(author);
                                        const isFeatured = Boolean(art.is_featured);
                                        const isNearBottom = index >= paginatedArticles.length - 2 && paginatedArticles.length > 1;

                                        return (
                                            <div
                                                key={art.id}
                                                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-primary-fixed/20 transition-colors group relative ${
                                                    activeDropdownId === art.id ? "z-30 bg-primary-fixed/25 ring-1 ring-primary/30" : "z-10"
                                                }`}
                                            >
                                                {/* 1. GAMBAR & JUDUL BERITA */}
                                                <div className="col-span-12 md:col-span-5 flex items-center gap-3.5 min-w-0">
                                                    {/* Thumbnail Image */}
                                                    <div
                                                        onClick={() => openPreviewModal(art)}
                                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant shadow-2xs cursor-pointer group-hover:ring-2 group-hover:ring-primary/40 transition-all relative"
                                                    >
                                                        <img
                                                            src={art.image || "/images/berita_utama.png"}
                                                            alt={title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/images/berita_utama.png";
                                                            }}
                                                        />
                                                        {isFeatured && (
                                                            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                                                <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Title, Category Badge & Summary */}
                                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span
                                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-sm font-bold border tracking-wider uppercase ${catStyle.bg}`}
                                                            >
                                                                {category}
                                                            </span>

                                                            {/* Featured Star Badge / Button */}
                                                            {isFeatured ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleToggleFeatured(art);
                                                                    }}
                                                                    title="Berita Utama (Klik untuk batal)"
                                                                    className="px-2 py-0.5 rounded-full text-[10px] font-label-sm font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 hover:bg-amber-200 transition-colors cursor-pointer shadow-2xs"
                                                                >
                                                                    <span className="material-symbols-outlined text-[13px] text-amber-600 fill-current">
                                                                        star
                                                                    </span>
                                                                    <span>Berita Utama</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleToggleFeatured(art);
                                                                    }}
                                                                    title="Jadikan Berita Utama (Headline di halaman depan)"
                                                                    className="px-2 py-0.5 rounded-full text-[10px] font-label-sm text-outline hover:text-amber-600 hover:bg-amber-50 border border-dashed border-outline-variant hover:border-amber-300 transition-all cursor-pointer inline-flex items-center gap-1 opacity-70 hover:opacity-100"
                                                                >
                                                                    <span className="material-symbols-outlined text-[13px] text-amber-500">
                                                                        grade
                                                                    </span>
                                                                    <span className="hidden sm:inline">Set Utama</span>
                                                                </button>
                                                            )}

                                                            <span className="md:hidden text-[11px] text-outline">
                                                                {displayDate} • {author}
                                                            </span>
                                                        </div>

                                                        <h3
                                                            onClick={() => openPreviewModal(art)}
                                                            className="font-headline-sm text-sm sm:text-base text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer font-bold leading-snug"
                                                            title={title}
                                                        >
                                                            {title}
                                                        </h3>

                                                        {summary && (
                                                            <p className="font-body-sm text-xs text-outline line-clamp-1 hidden sm:block">
                                                                {summary}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 2. PENULIS */}
                                                <div className="hidden md:flex col-span-2 items-center gap-2 min-w-0">
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-xs font-semibold shrink-0 ${
                                                            art.authorBg || catStyle.bg
                                                        }`}
                                                    >
                                                        {authorInitials}
                                                    </div>
                                                    <span
                                                        className="font-body-sm text-xs text-on-surface font-medium truncate"
                                                        title={author}
                                                    >
                                                        {author}
                                                    </span>
                                                </div>

                                                {/* 3. TANGGAL */}
                                                <div className="hidden md:block col-span-2 font-body-sm text-xs text-on-surface-variant">
                                                    {displayDate}
                                                </div>

                                                {/* 4. STATUS (SEJAJAR DENGAN HEADER STATUS) */}
                                                <div className="hidden md:flex col-span-2 justify-center items-center">
                                                    {art.status === "Published" ? (
                                                        <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-xs border border-primary-fixed-dim font-medium shadow-2xs inline-flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#025EDB]"></span>
                                                            Published
                                                        </span>
                                                    ) : (
                                                        <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-xs border border-outline-variant font-medium inline-flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 5. AKSI (FIELD BARU: TITIK 3 / MENU AKSI) */}
                                                <div className="hidden md:flex col-span-1 justify-center items-center relative">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdownId(
                                                                activeDropdownId === art.id ? null : art.id
                                                            );
                                                        }}
                                                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                                            activeDropdownId === art.id
                                                                ? "bg-primary text-white shadow-xs"
                                                                : "text-outline hover:text-on-surface hover:bg-surface-container"
                                                        }`}
                                                        title="Menu Aksi"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            more_vert
                                                        </span>
                                                    </button>

                                                    {/* Desktop Dropdown Menu */}
                                                    {activeDropdownId === art.id && (
                                                        <div
                                                            className={`absolute right-0 ${
                                                                isNearBottom
                                                                    ? "bottom-full mb-1.5 origin-bottom-right"
                                                                    : "top-full mt-1.5 origin-top-right"
                                                            } w-52 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100`}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={() => openPreviewModal(art)}
                                                                className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-primary">
                                                                    visibility
                                                                </span>
                                                                Lihat Preview
                                                            </button>

                                                            <a
                                                                href={`/berita/${art.slug || art.id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-[#025EDB]">
                                                                    open_in_new
                                                                </span>
                                                                Buka di Halaman Web ↗
                                                            </a>

                                                            <button
                                                                onClick={() => openEditModal(art)}
                                                                className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-outline">
                                                                    edit
                                                                </span>
                                                                Edit Berita
                                                            </button>

                                                            <button
                                                                onClick={() => handleToggleFeatured(art)}
                                                                className={`w-full px-3.5 py-2 text-left text-xs font-label-md flex items-center gap-2.5 cursor-pointer transition-colors ${
                                                                    isFeatured
                                                                        ? "text-amber-800 bg-amber-50/70 hover:bg-amber-100/80 font-semibold"
                                                                        : "text-on-surface hover:bg-surface-container-low"
                                                                }`}
                                                            >
                                                                <span className={`material-symbols-outlined text-[18px] text-amber-500 ${isFeatured ? "fill-current" : ""}`}>
                                                                    {isFeatured ? "star" : "grade"}
                                                                </span>
                                                                {isFeatured
                                                                    ? "Hapus Berita Utama"
                                                                    : "Jadikan Berita Utama ⭐"}
                                                            </button>

                                                            <button
                                                                onClick={() => handleToggleStatus(art)}
                                                                className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-outline">
                                                                    {art.status === "Published" ? "draft" : "publish"}
                                                                </span>
                                                                {art.status === "Published"
                                                                    ? "Jadikan Draft"
                                                                    : "Terbitkan (Publish)"}
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedArticle(art);
                                                                    setShowDeleteModal(true);
                                                                    setActiveDropdownId(null);
                                                                }}
                                                                className="w-full px-3.5 py-2 text-left text-xs font-label-md text-error hover:bg-error-container/20 flex items-center gap-2.5 border-t border-outline-variant/60 mt-1 cursor-pointer transition-colors font-medium"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    delete
                                                                </span>
                                                                Hapus Berita
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* MOBILE ONLY (md:hidden): STATUS & AKSI */}
                                                <div className="col-span-12 md:hidden flex justify-between items-center pt-2 border-t border-outline-variant/40 mt-1">
                                                    <div>
                                                        {art.status === "Published" ? (
                                                            <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-label-sm text-xs border border-primary-fixed-dim font-medium inline-flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#025EDB]"></span>
                                                                Published
                                                            </span>
                                                        ) : (
                                                            <span className="bg-surface-variant text-on-surface-variant px-2.5 py-1 rounded-full font-label-sm text-xs border border-outline-variant font-medium inline-flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                                                Draft
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdownId(
                                                                    activeDropdownId === art.id ? null : art.id
                                                                );
                                                            }}
                                                            className="text-outline hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                                                            title="Menu Aksi"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                more_vert
                                                            </span>
                                                        </button>

                                                        {/* Mobile Dropdown Menu */}
                                                        {activeDropdownId === art.id && (
                                                            <div
                                                                className="absolute right-0 bottom-full mb-1.5 w-52 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    onClick={() => openPreviewModal(art)}
                                                                    className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                                                        visibility
                                                                    </span>
                                                                    Lihat Preview
                                                                </button>

                                                                <button
                                                                    onClick={() => openEditModal(art)}
                                                                    className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px] text-outline">
                                                                        edit
                                                                    </span>
                                                                    Edit Berita
                                                                </button>

                                                                <button
                                                                    onClick={() => handleToggleFeatured(art)}
                                                                    className={`w-full px-3.5 py-2 text-left text-xs font-label-md flex items-center gap-2.5 cursor-pointer transition-colors ${
                                                                        isFeatured
                                                                            ? "text-amber-800 bg-amber-50/70 hover:bg-amber-100/80 font-semibold"
                                                                            : "text-on-surface hover:bg-surface-container-low"
                                                                    }`}
                                                                >
                                                                    <span className={`material-symbols-outlined text-[18px] text-amber-500 ${isFeatured ? "fill-current" : ""}`}>
                                                                        {isFeatured ? "star" : "grade"}
                                                                    </span>
                                                                    {isFeatured
                                                                        ? "Hapus Berita Utama"
                                                                        : "Jadikan Berita Utama ⭐"}
                                                                </button>

                                                                <button
                                                                    onClick={() => handleToggleStatus(art)}
                                                                    className="w-full px-3.5 py-2 text-left text-xs font-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 cursor-pointer transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px] text-outline">
                                                                        {art.status === "Published" ? "draft" : "publish"}
                                                                    </span>
                                                                    {art.status === "Published"
                                                                        ? "Jadikan Draft"
                                                                        : "Terbitkan (Publish)"}
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedArticle(art);
                                                                        setShowDeleteModal(true);
                                                                        setActiveDropdownId(null);
                                                                    }}
                                                                    className="w-full px-3.5 py-2 text-left text-xs font-label-md text-error hover:bg-error-container/20 flex items-center gap-2.5 border-t border-outline-variant/60 mt-1 cursor-pointer transition-colors font-medium"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">
                                                                        delete
                                                                    </span>
                                                                    Hapus Berita
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {paginatedArticles.length === 0 && (
                                        <div className="p-12 text-center text-outline font-body-md">
                                            <span className="material-symbols-outlined text-4xl mb-2 text-outline/60">
                                                image_not_supported
                                            </span>
                                            <p>
                                                Tidak ada artikel yang sesuai dengan filter kategori atau pencarian.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Footer */}
                                <div className="p-4 border-t border-outline-variant bg-surface-container flex items-center justify-between">
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                                        Menampilkan{" "}
                                        {filteredArticles.length > 0
                                            ? (currentPage - 1) * itemsPerPage + 1
                                            : 0}
                                        -
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredArticles.length
                                        )}{" "}
                                        dari {filteredArticles.length} artikel
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) => Math.max(p - 1, 1))
                                            }
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-lg text-outline hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                                            title="Halaman Sebelumnya"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                chevron_left
                                            </span>
                                        </button>

                                        <span className="font-label-sm text-xs px-2 text-on-surface font-semibold">
                                            {currentPage} / {totalPages}
                                        </span>

                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(p + 1, totalPages)
                                                )
                                            }
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                                            title="Halaman Selanjutnya"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                chevron_right
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* ---------------- MODAL: BUAT BERITA BARU ---------------- */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-xs">
                                    <span className="material-symbols-outlined text-[22px]">
                                        add_photo_alternate
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                        Buat Berita &amp; Artikel Baru
                                    </h3>
                                    <p className="font-body-sm text-xs text-outline">
                                        Lengkapi formulir berita yayasan. Foto dapat langsung diunggah dari komputer/perangkat Anda.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateArticle} className="flex flex-col flex-1 min-h-0">
                            {/* Scrollable Form Body */}
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 font-body-sm text-xs flex-1">
                                {/* SECTION 1: UPLOAD GAMBAR DARI PERANGKAT & PREVIEW */}
                                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">
                                                add_photo_alternate
                                            </span>
                                            Foto Utama / Thumbnail Artikel
                                        </span>
                                        <span className="text-[11px] text-outline">Format: PNG, JPG, JPEG, WEBP (Maks. 10MB)</span>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => handleFileSelect(e, false)}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                    />

                                    {newArticle.previewUrl ? (
                                        /* PREVIEW OF UPLOADED PHOTO */
                                        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                            <img
                                                src={newArticle.previewUrl}
                                                alt="Preview Foto Berita"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Foto Terpilih
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white text-gray-900 rounded-xl font-label-sm text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                    Ganti Foto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewArticle((prev) => ({
                                                            ...prev,
                                                            imageFile: null,
                                                            previewUrl: "",
                                                            image: "",
                                                        }));
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = "";
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
                                            onClick={() => fileInputRef.current?.click()}
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
                                                    fileInputRef.current?.click();
                                                }}
                                                className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                                                Pilih Foto dari Komputer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* SECTION 2: JUDUL & KATEGORI */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Judul Berita / Artikel *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newArticle.judul}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    judul: e.target.value,
                                                })
                                            }
                                            placeholder="Masukkan judul berita atau kegiatan... (Contoh: Pelatihan Bahasa Isyarat Al-Qur'an)"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Kategori *
                                        </label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={newArticle.kategori}
                                                onChange={(e) =>
                                                    setNewArticle({
                                                        ...newArticle,
                                                        kategori: e.target.value,
                                                    })
                                                }
                                                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-label-md cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="PENDIDIKAN">Pendidikan</option>
                                                <option value="KEGIATAN">Kegiatan</option>
                                                <option value="MAKTAB TULI">Maktab Tuli</option>
                                                <option value="PENGUMUMAN">Pengumuman</option>
                                                <option value="KAJIAN">Kajian</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: PENULIS, TANGGAL & STATUS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Penulis / Author *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newArticle.penulis}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    penulis: e.target.value,
                                                })
                                            }
                                            placeholder="Nama penulis (Default: nama akun Anda)"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Tanggal Publikasi *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={newArticle.tanggal}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    tanggal: e.target.value,
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Status Publikasi
                                        </label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={newArticle.status}
                                                onChange={(e) =>
                                                    setNewArticle({
                                                        ...newArticle,
                                                        status: e.target.value,
                                                    })
                                                }
                                                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-label-md cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="Published">Published (Terbit)</option>
                                                <option value="Draft">Draft (Konsep)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BERITA UTAMA TOGGLE (BINTANG ⭐) */}
                                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                                            <span className="material-symbols-outlined text-[22px] fill-current">star</span>
                                        </div>
                                        <div>
                                            <span className="font-label-md text-xs font-bold text-amber-950 block">
                                                Jadikan Berita Utama (Headline Bintang ⭐)
                                            </span>
                                            <p className="font-body-sm text-[11px] text-amber-800 leading-tight mt-0.5">
                                                Berita ini akan ditandai dengan bintang dan tampil di posisi paling atas (headline) pada halaman depan berita.
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(newArticle.is_featured)}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    is_featured: e.target.checked,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {/* SECTION 4: RINGKASAN & KONTEN LENGKAP */}
                                <div className="border-t border-outline-variant pt-4 space-y-4">
                                    <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">
                                            format_quote
                                        </span>
                                        Isi Ringkasan &amp; Konten Berita
                                    </h4>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            📄 Ringkasan Singkat Berita (Ditampilkan di Kartu / Daftar Berita) *
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={newArticle.ringkasan}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    ringkasan: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis ringkasan 1-2 kalimat deskripsi utama artikel yang akan tampil di halaman daftar berita..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            📌 Kutipan Utama (Blockquote Garis Oranye - Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={newArticle.blockquote}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    blockquote: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kutipan utama atau pesan pembuka bergaris oranye (contoh: “Mendekatkan firman-firman suci melalui isyarat visual...”)"
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary italic"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 1 (Pembuka Artikel)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={newArticle.paragraf1}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    paragraf1: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis isi paragraf pembuka artikel secara detail dan jelas..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Sub-Judul Bagian (Subheading - Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newArticle.subheading}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    subheading: e.target.value,
                                                })
                                            }
                                            placeholder="Contoh: Metode Isyarat Visual Al-Qur'an"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 2 (Penjelasan Sub-Judul)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={newArticle.paragraf2}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    paragraf2: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis paragraf penjelasan isi kelanjutan artikel..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    {/* Blue Quote Callout Box Fields */}
                                    <div className="bg-[#E6EFFB]/40 p-4 rounded-2xl border border-[#D6E2FF] space-y-3">
                                        <label className="font-label-sm text-[#025EDB] block font-bold">
                                            💬 Kutipan Khusus / Highlight Callout Box (Kotak Biru - Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={newArticle.blue_quote}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    blue_quote: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kutipan khusus dari narasumber atau pimpinan yayasan..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#CDE1FB] bg-white text-on-surface focus:outline-none focus:border-primary font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={newArticle.blue_quote_author}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    blue_quote_author: e.target.value,
                                                })
                                            }
                                            placeholder="Nama &amp; jabatan pengutip (contoh: — Ustadz Faisal, Koordinator Pendidikan)"
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#CDE1FB] bg-white text-on-surface focus:outline-none focus:border-primary font-semibold text-xs text-[#025EDB]"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 3 (Penutup Artikel)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={newArticle.paragraf3}
                                            onChange={(e) =>
                                                setNewArticle({
                                                    ...newArticle,
                                                    paragraf3: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kalimat penutup atau harapan dari kegiatan ini..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* SECTION 5: DOKUMENTASI KEGIATAN (FOTO & VIDEO - MAKSIMAL 6) */}
                                <div className="border-t border-outline-variant pt-5 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    collections
                                                </span>
                                                Dokumentasi Kegiatan (Foto &amp; Video)
                                            </h4>
                                            <p className="font-body-sm text-[11px] text-outline mt-0.5 leading-relaxed">
                                                Tambahkan maksimal 6 foto atau video dokumentasi untuk ditampilkan di galeri kegiatan halaman depan detail berita.
                                            </p>
                                        </div>
                                        <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1 self-start sm:self-center shadow-2xs ${
                                            (newArticle.dokumentasi || []).length >= 6
                                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                                : "bg-primary-fixed text-primary border border-primary/20"
                                        }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {(newArticle.dokumentasi || []).length >= 6 ? "check_circle" : "photo_library"}
                                            </span>
                                            {(newArticle.dokumentasi || []).length} / 6 Media Terpilih
                                        </span>
                                    </div>

                                    {/* Hidden file input for multi-upload of photos and videos */}
                                    <input
                                        type="file"
                                        ref={docFileInputRef}
                                        onChange={(e) => handleDokumentasiFileSelect(e, false)}
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                    />

                                    {/* Media Action Buttons */}
                                    <div className="flex flex-wrap gap-2.5">
                                        <button
                                            type="button"
                                            disabled={(newArticle.dokumentasi || []).length >= 6}
                                            onClick={() => docFileInputRef.current?.click()}
                                            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                                        >
                                            <span className="material-symbols-outlined text-[18px] text-primary">
                                                upload_file
                                            </span>
                                            <span>+ Upload Foto / Video dari Perangkat</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={(newArticle.dokumentasi || []).length >= 6}
                                            onClick={() => {
                                                setIsEditDocUrl(false);
                                                setDocUrlInput("");
                                                setDocTypeInput("video");
                                                setShowDocUrlModal(true);
                                            }}
                                            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                                        >
                                            <span className="material-symbols-outlined text-[18px] text-[#025EDB]">
                                                link
                                            </span>
                                            <span>+ Tambah via Link URL (YouTube / Video / Foto)</span>
                                        </button>
                                    </div>

                                    {/* 6-Grid Slot Preview */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                        {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                                            const item = (newArticle.dokumentasi || [])[slotIndex];
                                            if (item) {
                                                return (
                                                    <div
                                                        key={item.id || slotIndex}
                                                        className="aspect-square rounded-2xl overflow-hidden bg-surface-container relative border border-outline-variant group shadow-2xs flex items-center justify-center"
                                                    >
                                                        {item.type === "video" ? (
                                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                                                {item.previewUrl?.startsWith("blob:") || item.previewUrl?.endsWith(".mp4") ? (
                                                                    <video
                                                                        src={item.previewUrl}
                                                                        className="w-full h-full object-cover opacity-70"
                                                                        preload="metadata"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center p-2 text-center">
                                                                        <span className="material-symbols-outlined text-white text-[24px]">videocam</span>
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-md">
                                                                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                                                    </div>
                                                                </div>
                                                                <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                    <span className="material-symbols-outlined text-[10px] text-red-400">videocam</span>
                                                                    Video
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full relative">
                                                                <img
                                                                    src={item.previewUrl || item.url}
                                                                    alt={`Dokumentasi ${slotIndex + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = "/images/berita_utama.png";
                                                                    }}
                                                                />
                                                                <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                    <span className="material-symbols-outlined text-[10px] text-blue-300">image</span>
                                                                    Foto
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Delete Button on Hover */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveDokumentasi(slotIndex, false)}
                                                                title="Hapus foto/video ini"
                                                                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={slotIndex}
                                                    onClick={() => {
                                                        if ((newArticle.dokumentasi || []).length < 6) {
                                                            docFileInputRef.current?.click();
                                                        }
                                                    }}
                                                    className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low/40 hover:bg-surface-container-low hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-center p-2 cursor-pointer group"
                                                >
                                                    <span className="material-symbols-outlined text-outline/60 group-hover:text-primary text-[20px] transition-colors">
                                                        add_photo_alternate
                                                    </span>
                                                    <span className="font-label-sm text-[10px] text-outline mt-1 font-medium group-hover:text-on-surface">
                                                        Slot {slotIndex + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="hidden">
                                    {/* spacer */}
                                </div>
                            </div>

                            {/* Footer (Fixed Bottom) */}
                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-5 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-label-md text-xs hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    <span>{isSubmitting ? "Menyimpan..." : "Simpan ke Database"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL: EDIT ARTIKEL ---------------- */}
            {showEditModal && selectedArticle && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header (Fixed Top) */}
                        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-xs">
                                    <span className="material-symbols-outlined text-[22px]">
                                        edit_document
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                        Edit Berita &amp; Artikel
                                    </h3>
                                    <p className="font-body-sm text-xs text-outline">
                                        Perbarui informasi, foto utama, dan konten artikel yayasan. Foto dapat langsung diunggah dari komputer/perangkat Anda.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateArticle} className="flex flex-col flex-1 min-h-0">
                            {/* Scrollable Form Body */}
                            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 font-body-sm text-xs flex-1">
                                {/* SECTION 1: UPLOAD GAMBAR DARI PERANGKAT & PREVIEW */}
                                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">
                                                add_photo_alternate
                                            </span>
                                            Foto Utama / Thumbnail Artikel
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

                                    {(selectedArticle.previewUrl || selectedArticle.image) ? (
                                        /* PREVIEW OF UPLOADED / CURRENT PHOTO */
                                        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-surface border-2 border-primary/40 shadow-sm flex items-center justify-center group">
                                            <img
                                                src={selectedArticle.previewUrl || selectedArticle.image || "/images/berita_utama.png"}
                                                alt="Preview Foto Berita"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/images/berita_utama.png";
                                                }}
                                            />
                                            <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                {selectedArticle.imageFile ? "Foto Baru Terpilih" : "Foto Saat Ini"}
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
                                                        setSelectedArticle((prev) => ({
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

                                {/* SECTION 2: JUDUL & KATEGORI */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Judul Berita / Artikel *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={selectedArticle.judul || selectedArticle.title || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    judul: e.target.value,
                                                    title: e.target.value,
                                                })
                                            }
                                            placeholder="Masukkan judul berita atau kegiatan... (Contoh: Pelatihan Bahasa Isyarat Al-Qur'an)"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Kategori *
                                        </label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={selectedArticle.kategori || selectedArticle.category || "PENDIDIKAN"}
                                                onChange={(e) =>
                                                    setSelectedArticle({
                                                        ...selectedArticle,
                                                        kategori: e.target.value,
                                                        category: e.target.value,
                                                    })
                                                }
                                                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-label-md cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="PENDIDIKAN">Pendidikan</option>
                                                <option value="KEGIATAN">Kegiatan</option>
                                                <option value="MAKTAB TULI">Maktab Tuli</option>
                                                <option value="PENGUMUMAN">Pengumuman</option>
                                                <option value="KAJIAN">Kajian</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: PENULIS, TANGGAL & STATUS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Penulis / Author *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={selectedArticle.penulis || selectedArticle.author || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    penulis: e.target.value,
                                                    author: e.target.value,
                                                })
                                            }
                                            placeholder="Nama penulis (Default: nama akun Anda)"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Tanggal Publikasi *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={selectedArticle.tanggal || selectedArticle.date || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    tanggal: e.target.value,
                                                    date: e.target.value,
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            Status Publikasi
                                        </label>
                                        <div className="relative flex items-center">
                                            <select
                                                value={selectedArticle.status || "Published"}
                                                onChange={(e) =>
                                                    setSelectedArticle({
                                                        ...selectedArticle,
                                                        status: e.target.value,
                                                    })
                                                }
                                                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-label-md cursor-pointer appearance-none bg-none"
                                            >
                                                <option value="Published">Published (Terbit)</option>
                                                <option value="Draft">Draft (Konsep)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BERITA UTAMA TOGGLE (BINTANG ⭐) */}
                                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                                            <span className="material-symbols-outlined text-[22px] fill-current">star</span>
                                        </div>
                                        <div>
                                            <span className="font-label-md text-xs font-bold text-amber-950 block">
                                                Jadikan Berita Utama (Headline Bintang ⭐)
                                            </span>
                                            <p className="font-body-sm text-[11px] text-amber-800 leading-tight mt-0.5">
                                                Berita ini akan ditandai dengan bintang dan tampil di posisi paling atas (headline) pada halaman depan berita.
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(selectedArticle.is_featured)}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    is_featured: e.target.checked,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {/* SECTION 4: RINGKASAN & KONTEN LENGKAP */}
                                <div className="border-t border-outline-variant pt-4 space-y-4">
                                    <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">
                                            format_quote
                                        </span>
                                        Isi Ringkasan &amp; Konten Berita
                                    </h4>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1 font-semibold">
                                            📄 Ringkasan Singkat Berita (Ditampilkan di Kartu / Daftar Berita) *
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={selectedArticle.ringkasan || selectedArticle.summary || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    ringkasan: e.target.value,
                                                    summary: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis ringkasan 1-2 kalimat deskripsi utama artikel yang akan tampil di halaman daftar berita..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            📌 Kutipan Utama (Blockquote Garis Oranye - Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={selectedArticle.blockquote || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    blockquote: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kutipan utama atau pesan pembuka bergaris oranye (contoh: “Mendekatkan firman-firman suci melalui isyarat visual...”)"
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary italic"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 1 (Pembuka Artikel)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={selectedArticle.paragraf1 || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    paragraf1: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis isi paragraf pembuka artikel secara detail dan jelas..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Sub-Judul Bagian (Subheading - Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedArticle.subheading || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    subheading: e.target.value,
                                                })
                                            }
                                            placeholder="Contoh: Metode Isyarat Visual Al-Qur'an"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 2 (Penjelasan Sub-Judul)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={selectedArticle.paragraf2 || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    paragraf2: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis paragraf penjelasan isi kelanjutan artikel..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    {/* Blue Quote Callout Box Fields */}
                                    <div className="bg-[#E6EFFB]/40 p-4 rounded-2xl border border-[#D6E2FF] space-y-3">
                                        <label className="font-label-sm text-[#025EDB] block font-bold">
                                            💬 Kutipan Khusus / Highlight Callout Box (Kotak Biru - Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={
                                                selectedArticle.blue_quote ||
                                                selectedArticle.blueQuote ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    blue_quote: e.target.value,
                                                    blueQuote: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kutipan khusus dari narasumber atau pimpinan yayasan..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#CDE1FB] bg-white text-on-surface focus:outline-none focus:border-primary font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                selectedArticle.blue_quote_author ||
                                                selectedArticle.blueQuoteAuthor ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    blue_quote_author: e.target.value,
                                                    blueQuoteAuthor: e.target.value,
                                                })
                                            }
                                            placeholder="Nama &amp; jabatan pengutip (contoh: — Ustadz Faisal, Koordinator Pendidikan)"
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#CDE1FB] bg-white text-on-surface focus:outline-none focus:border-primary font-semibold text-xs text-[#025EDB]"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-label-sm text-outline block mb-1">
                                            Paragraf 3 (Penutup Artikel)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={selectedArticle.paragraf3 || ""}
                                            onChange={(e) =>
                                                setSelectedArticle({
                                                    ...selectedArticle,
                                                    paragraf3: e.target.value,
                                                })
                                            }
                                            placeholder="Tulis kalimat penutup atau harapan dari kegiatan ini..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* SECTION 5: DOKUMENTASI KEGIATAN (FOTO & VIDEO - MAKSIMAL 6) */}
                                <div className="border-t border-outline-variant pt-5 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    collections
                                                </span>
                                                Dokumentasi Kegiatan (Foto &amp; Video)
                                            </h4>
                                            <p className="font-body-sm text-[11px] text-outline mt-0.5 leading-relaxed">
                                                Tambahkan maksimal 6 foto atau video dokumentasi untuk ditampilkan di galeri kegiatan halaman depan detail berita.
                                            </p>
                                        </div>
                                        <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1 self-start sm:self-center shadow-2xs ${
                                            (selectedArticle.dokumentasi || []).length >= 6
                                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                                : "bg-primary-fixed text-primary border border-primary/20"
                                        }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {(selectedArticle.dokumentasi || []).length >= 6 ? "check_circle" : "photo_library"}
                                            </span>
                                            {(selectedArticle.dokumentasi || []).length} / 6 Media Terpilih
                                        </span>
                                    </div>

                                    {/* Hidden file input for multi-upload of photos and videos in edit modal */}
                                    <input
                                        type="file"
                                        ref={editDocFileInputRef}
                                        onChange={(e) => handleDokumentasiFileSelect(e, true)}
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                    />

                                    {/* Media Action Buttons */}
                                    <div className="flex flex-wrap gap-2.5">
                                        <button
                                            type="button"
                                            disabled={(selectedArticle.dokumentasi || []).length >= 6}
                                            onClick={() => editDocFileInputRef.current?.click()}
                                            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                                        >
                                            <span className="material-symbols-outlined text-[18px] text-primary">
                                                upload_file
                                            </span>
                                            <span>+ Upload Foto / Video dari Perangkat</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={(selectedArticle.dokumentasi || []).length >= 6}
                                            onClick={() => {
                                                setIsEditDocUrl(true);
                                                setDocUrlInput("");
                                                setDocTypeInput("video");
                                                setShowDocUrlModal(true);
                                            }}
                                            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                                        >
                                            <span className="material-symbols-outlined text-[18px] text-[#025EDB]">
                                                link
                                            </span>
                                            <span>+ Tambah via Link URL (YouTube / Video / Foto)</span>
                                        </button>
                                    </div>

                                    {/* 6-Grid Slot Preview */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                        {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                                            const item = (selectedArticle.dokumentasi || [])[slotIndex];
                                            if (item) {
                                                return (
                                                    <div
                                                        key={item.id || slotIndex}
                                                        className="aspect-square rounded-2xl overflow-hidden bg-surface-container relative border border-outline-variant group shadow-2xs flex items-center justify-center"
                                                    >
                                                        {item.type === "video" ? (
                                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                                                {item.previewUrl?.startsWith("blob:") || item.previewUrl?.endsWith(".mp4") || item.url?.endsWith(".mp4") ? (
                                                                    <video
                                                                        src={item.previewUrl || item.url}
                                                                        className="w-full h-full object-cover opacity-70"
                                                                        preload="metadata"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center p-2 text-center">
                                                                        <span className="material-symbols-outlined text-white text-[24px]">videocam</span>
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-md">
                                                                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                                                    </div>
                                                                </div>
                                                                <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                    <span className="material-symbols-outlined text-[10px] text-red-400">videocam</span>
                                                                    Video
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full relative">
                                                                <img
                                                                    src={item.previewUrl || item.url}
                                                                    alt={`Dokumentasi ${slotIndex + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = "/images/berita_utama.png";
                                                                    }}
                                                                />
                                                                <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                    <span className="material-symbols-outlined text-[10px] text-blue-300">image</span>
                                                                    Foto
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Delete Button on Hover */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveDokumentasi(slotIndex, true)}
                                                                title="Hapus foto/video ini"
                                                                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={slotIndex}
                                                    onClick={() => {
                                                        if ((selectedArticle.dokumentasi || []).length < 6) {
                                                            editDocFileInputRef.current?.click();
                                                        }
                                                    }}
                                                    className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low/40 hover:bg-surface-container-low hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-center p-2 cursor-pointer group"
                                                >
                                                    <span className="material-symbols-outlined text-outline/60 group-hover:text-primary text-[20px] transition-colors">
                                                        add_photo_alternate
                                                    </span>
                                                    <span className="font-label-sm text-[10px] text-outline mt-1 font-medium group-hover:text-on-surface">
                                                        Slot {slotIndex + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Footer (Fixed Bottom) */}
                            <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-5 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-label-md text-xs hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL: PREVIEW ARTIKEL ---------------- */}
            {showPreviewModal && selectedArticle && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white border border-outline-variant rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Top Bar */}
                        <div className="p-4 sm:p-5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-label-sm font-bold border tracking-wider uppercase ${
                                        getCategoryStyle(
                                            selectedArticle.kategori ||
                                                selectedArticle.category
                                        ).bg
                                    }`}
                                >
                                    {selectedArticle.kategori ||
                                        selectedArticle.category}
                                </span>
                                {selectedArticle.is_featured && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-label-sm font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-amber-600 fill-current">star</span>
                                        Berita Utama
                                    </span>
                                )}
                                <span className="font-label-sm text-xs text-outline">
                                    • {formatDateDisplay(selectedArticle.tanggal || selectedArticle.date)} • Oleh{" "}
                                    {selectedArticle.penulis ||
                                        selectedArticle.author}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Article Preview Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                            {/* Judul Artikel */}
                            <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-[#1A1C1E] leading-tight">
                                {selectedArticle.judul || selectedArticle.title}
                            </h2>

                            {/* Main Featured Image Banner */}
                            {selectedArticle.image && (
                                <div className="relative w-full h-56 sm:h-80 rounded-2xl overflow-hidden bg-surface-container shadow-sm border border-outline-variant/60">
                                    <img
                                        src={selectedArticle.image}
                                        alt={
                                            selectedArticle.judul ||
                                            selectedArticle.title
                                        }
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/images/berita_utama.png";
                                        }}
                                    />
                                </div>
                            )}

                            {/* Article Body Content */}
                            <div className="text-[#44474E] leading-relaxed text-sm sm:text-base space-y-5 font-normal">
                                {/* Ringkasan Highlight Box */}
                                {(selectedArticle.ringkasan ||
                                    selectedArticle.summary) && (
                                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/70 text-on-surface font-medium text-sm">
                                        <span className="font-bold text-primary block mb-1">
                                            Ringkasan:
                                        </span>
                                        {selectedArticle.ringkasan ||
                                            selectedArticle.summary}
                                    </div>
                                )}

                                {/* Blockquote */}
                                {selectedArticle.blockquote && (
                                    <div className="border-l-4 border-[#D38B1D] pl-6 py-2 my-6">
                                        <p className="text-[#1A1C1E] text-base sm:text-lg font-medium italic leading-relaxed">
                                            &ldquo;{selectedArticle.blockquote}&rdquo;
                                        </p>
                                    </div>
                                )}

                                {/* Paragraf 1 */}
                                {selectedArticle.paragraf1 && (
                                    <p className="leading-relaxed">
                                        {selectedArticle.paragraf1}
                                    </p>
                                )}

                                {/* Subheading */}
                                {selectedArticle.subheading && (
                                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1C1E] pt-2">
                                        {selectedArticle.subheading}
                                    </h3>
                                )}

                                {/* Paragraf 2 */}
                                {selectedArticle.paragraf2 && (
                                    <p className="leading-relaxed">
                                        {selectedArticle.paragraf2}
                                    </p>
                                )}

                                {/* Blue Quote Callout Box */}
                                {(selectedArticle.blue_quote ||
                                    selectedArticle.blueQuote) && (
                                    <div className="bg-[#E6EFFB]/50 border border-[#D6E2FF] rounded-3xl p-6 sm:p-8 my-6 relative overflow-hidden flex flex-col gap-3">
                                        <div className="absolute right-4 bottom-0 opacity-15 text-[#025EDB] pointer-events-none transform translate-y-2">
                                            <svg
                                                className="w-28 h-28"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M14.017 21v-7.391c0-5.704 3.748-9.762 9-10.961l.653 1.414c-4.013.896-5.836 3.269-5.836 6.19h5.836v10.748h-9.653zm-14.017 0v-7.391c0-5.704 3.748-9.762 9-10.961l.653 1.414c-4.013.896-5.836 3.269-5.836 6.19h5.836v10.748h-9.653z" />
                                            </svg>
                                        </div>
                                        <p className="text-[#025EDB] text-base sm:text-lg font-bold leading-relaxed relative z-10">
                                            {selectedArticle.blue_quote ||
                                                selectedArticle.blueQuote}
                                        </p>
                                        {(selectedArticle.blue_quote_author ||
                                            selectedArticle.blueQuoteAuthor) && (
                                            <span className="text-[#025EDB] text-xs sm:text-sm font-semibold relative z-10 mt-1 block">
                                                {selectedArticle.blue_quote_author ||
                                                    selectedArticle.blueQuoteAuthor}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Paragraf 3 */}
                                {selectedArticle.paragraf3 && (
                                    <p className="leading-relaxed">
                                        {selectedArticle.paragraf3}
                                    </p>
                                )}

                                {/* Dokumentasi Kegiatan Preview */}
                                {selectedArticle.dokumentasi && selectedArticle.dokumentasi.length > 0 && (
                                    <div className="pt-6 border-t border-outline-variant/60 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px] text-primary">
                                                    collections
                                                </span>
                                                Dokumentasi Kegiatan ({selectedArticle.dokumentasi.length} Media)
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {selectedArticle.dokumentasi.map((item, idx) => (
                                                <div
                                                    key={item.id || idx}
                                                    className="aspect-square rounded-2xl overflow-hidden bg-surface-container relative border border-outline-variant shadow-2xs group"
                                                >
                                                    {item.type === "video" ? (
                                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                                            {item.previewUrl?.startsWith("blob:") || item.previewUrl?.endsWith(".mp4") || item.url?.endsWith(".mp4") ? (
                                                                <video
                                                                    src={item.previewUrl || item.url}
                                                                    className="w-full h-full object-cover opacity-70"
                                                                    preload="metadata"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center p-2 text-center">
                                                                    <span className="material-symbols-outlined text-white text-[24px]">videocam</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                                                                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                                                </div>
                                                            </div>
                                                            <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                <span className="material-symbols-outlined text-[10px] text-red-400">videocam</span>
                                                                Video
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full relative">
                                                            <img
                                                                src={item.previewUrl || item.url}
                                                                alt={`Dokumentasi ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = "/images/berita_utama.png";
                                                                }}
                                                            />
                                                            <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                                                <span className="material-symbols-outlined text-[10px] text-blue-300">image</span>
                                                                Foto
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-outline">Status:</span>
                                {selectedArticle.status === "Published" ? (
                                    <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full text-xs font-bold border border-primary-fixed-dim">
                                        Published
                                    </span>
                                ) : (
                                    <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full text-xs font-bold border border-outline-variant">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={`/berita/${selectedArticle.slug || selectedArticle.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl font-label-md text-xs transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                                >
                                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    Buka Halaman Publik ↗
                                </a>
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        openEditModal(selectedArticle);
                                    }}
                                    className="px-4 py-2 border border-outline-variant rounded-xl font-label-md text-xs text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Edit Berita
                                </button>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs hover:bg-primary-container transition-colors font-semibold cursor-pointer"
                                >
                                    Tutup Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL: HAPUS ARTIKEL ---------------- */}
            {showDeleteModal && selectedArticle && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[28px]">
                                delete_forever
                            </span>
                        </div>

                        <div>
                            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                                Hapus Berita dari Database?
                            </h3>
                            <p className="font-body-sm text-xs text-outline mt-1 leading-relaxed">
                                Apakah Anda yakin ingin menghapus artikel{" "}
                                <strong className="text-on-surface">
                                    &ldquo;{selectedArticle.judul || selectedArticle.title}&rdquo;
                                </strong>
                                ? Data yang dihapus tidak dapat dipulihkan kembali.
                            </p>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs hover:bg-surface-container-low transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteArticle}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-error text-white rounded-xl font-label-md text-xs hover:bg-error/90 transition-colors shadow-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? "Menghapus..." : "Hapus Berita"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL: TAMBAH DOKUMENTASI VIA URL ---------------- */}
            {showDocUrlModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">link</span>
                                </div>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                    Tambah Dokumentasi via Link URL
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDocUrlModal(false)}
                                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <p className="font-body-sm text-xs text-outline leading-relaxed">
                            Masukkan URL video (YouTube / link video langsung) atau tautan foto kegiatan untuk ditambahkan ke dokumentasi artikel.
                        </p>

                        <div className="space-y-3">
                            <div>
                                <label className="font-label-sm text-outline block mb-1 font-semibold text-xs">
                                    Tipe Media
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDocTypeInput("video")}
                                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                                            docTypeInput === "video"
                                                ? "bg-primary text-white border-primary"
                                                : "bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">videocam</span>
                                        Video / YouTube
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDocTypeInput("image")}
                                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                                            docTypeInput === "image"
                                                ? "bg-primary text-white border-primary"
                                                : "bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">image</span>
                                        Foto / Gambar
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="font-label-sm text-outline block mb-1 font-semibold text-xs">
                                    URL Media *
                                </label>
                                <input
                                    type="url"
                                    value={docUrlInput}
                                    onChange={(e) => setDocUrlInput(e.target.value)}
                                    placeholder={
                                        docTypeInput === "video"
                                            ? "https://www.youtube.com/watch?v=... atau https://domain.com/video.mp4"
                                            : "https://domain.com/foto.jpg"
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-xs"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddDokumentasiUrl();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setShowDocUrlModal(false)}
                                className="px-4 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleAddDokumentasiUrl}
                                className="px-5 py-2 bg-primary text-white rounded-xl font-label-md text-xs hover:bg-primary-container transition-colors shadow-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Tambah ke Dokumentasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Ubah Status Terbit / Draf */}
            <ConfirmModal
                isOpen={Boolean(statusToToggle)}
                onClose={() => setStatusToToggle(null)}
                onConfirm={confirmToggleStatus}
                title={statusToToggle?.status === 'Published' ? 'Jadikan Draf Berita?' : 'Terbitkan Berita?'}
                message={
                    statusToToggle?.status === 'Published'
                        ? `Apakah Anda yakin ingin menarik artikel "${statusToToggle?.judul || statusToToggle?.title}" menjadi Draf? Artikel tidak akan dapat diakses oleh publik.`
                        : `Apakah Anda yakin ingin mempublikasikan artikel "${statusToToggle?.judul || statusToToggle?.title}" ke situs publik?`
                }
                confirmText={statusToToggle?.status === 'Published' ? 'Ya, Jadikan Draf' : 'Ya, Terbitkan'}
                cancelText="Batal"
                variant={statusToToggle?.status === 'Published' ? 'warning' : 'primary'}
                icon={statusToToggle?.status === 'Published' ? 'edit_note' : 'publish'}
                isLoading={isTogglingStatus}
            />

            {/* Modal Konfirmasi Ubah Status Berita Utama */}
            <ConfirmModal
                isOpen={Boolean(featuredToToggle)}
                onClose={() => setFeaturedToToggle(null)}
                onConfirm={confirmToggleFeatured}
                title={featuredToToggle?.is_featured ? 'Copot Status Berita Utama?' : 'Jadikan Berita Utama?'}
                message={
                    featuredToToggle?.is_featured
                        ? `Apakah Anda yakin ingin mencopot status Berita Utama dari artikel "${featuredToToggle?.judul || featuredToToggle?.title}"?`
                        : `Apakah Anda yakin ingin menetapkan artikel "${featuredToToggle?.judul || featuredToToggle?.title}" sebagai Berita Utama (Headline) di halaman depan?`
                }
                confirmText={featuredToToggle?.is_featured ? 'Copot Status Utama' : 'Jadikan Utama'}
                cancelText="Batal"
                variant="warning"
                icon="star"
                isLoading={isTogglingFeatured}
            />
        </>
    );
}
