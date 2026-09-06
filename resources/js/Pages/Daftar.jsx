import Layout from "@/Layouts/Layout";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Daftar = () => {
    const { flash } = usePage().props;
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        jenis_maktab: "Maktab Tuli As-Sami",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        alamat_domisili: "",
        nama_ortu: "",
        no_hp_ortu: "",
        pekerjaan_ortu: "",
        alamat_ortu: "",
        keterangan_tambahan: "",
        persetujuan: false,
    });

    const [files, setFiles] = useState({
        foto_santri: null,
        kartu_keluarga: null,
        ktp_ortu: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setSubmitSuccess(true);
        }
    }, [flash?.success]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFiles((prev) => ({ ...prev, [fieldName]: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (files.foto_santri) data.append("foto_santri", files.foto_santri);
        if (files.kartu_keluarga) data.append("kartu_keluarga", files.kartu_keluarga);
        if (files.ktp_ortu) data.append("ktp_ortu", files.ktp_ortu);

        router.post("/daftar", data, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setSubmitSuccess(true);
                setFormData({
                    nama_lengkap: "",
                    jenis_maktab: "Maktab Tuli As-Sami",
                    tempat_lahir: "",
                    tanggal_lahir: "",
                    jenis_kelamin: "",
                    alamat_domisili: "",
                    nama_ortu: "",
                    no_hp_ortu: "",
                    pekerjaan_ortu: "",
                    alamat_ortu: "",
                    keterangan_tambahan: "",
                    persetujuan: false,
                });
                setFiles({
                    foto_santri: null,
                    kartu_keluarga: null,
                    ktp_ortu: null,
                });
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const inputClass =
        "w-full bg-[#F3F4F6] border border-transparent rounded-xl px-4 py-3.5 text-sm text-[#1A1C1E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#025EDB]/30 focus:border-[#025EDB]/30 transition";

    const labelClass = "block text-sm font-semibold text-[#1A1C1E] mb-1.5";

    return (
        <>
            <Head title="Daftar Santri" />
            <Layout>
                {/* ── Hero ── */}
                <div className="bg-[#E6EFFB]/40 xl:px-48 px-6 pt-14 pb-16 text-center">
                    <span className="inline-block bg-[#FFDDB7] text-[#653E00] text-xs font-bold px-4 py-1 rounded-xl mb-5">
                        YAYASAN BHAKTI ARUMI DELANGGA
                    </span>
                    <h1 className="text-[#1A1C1E] font-extrabold text-5xl md:text-6xl tracking-tight leading-tight">
                        Pelayanan{" "}
                        <span className="text-[#025EDB]">Pendaftaran Santri</span>
                    </h1>
                    <p className="text-[#44474E] text-base md:text-lg font-medium mt-4 max-w-2xl mx-auto">
                        Formulir Pendaftaran Maktab Tuli As-Sami dan Maktab Autis. Mari
                        bergabung dalam ekosistem pendidikan inklusif yang menyejukkan.
                    </p>
                </div>

                {/* ── Section: Informasi Pendaftaran + Tahapan ── */}
                <div className="xl:px-48 px-6 py-14">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kiri: Informasi Pendaftaran */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-extrabold text-[#1A1C1E] mb-2">
                                Informasi Pendaftaran
                            </h2>
                            <p className="text-[#44474E] text-sm font-medium mb-8 leading-relaxed">
                                Pendaftaran santri dibuka untuk Maktab Tuli As-Sami dan Maktab
                                Autis. Silakan mengisi formulir dengan lengkap dan benar untuk
                                mempermudah proses verifikasi kami.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ),
                                        title: "Kartu Keluarga",
                                        desc: "Fotokopi/Scan Kartu Keluarga terbaru.",
                                        bg: "bg-[#E6EFFB]",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-[#D38B1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                        ),
                                        title: "KTP Orang Tua",
                                        desc: "Fotokopi/Scan identitas resmi wali.",
                                        bg: "bg-[#FFF3E3]",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        ),
                                        title: "Foto Santri",
                                        desc: "Foto formal berwarna ukuran 3x4.",
                                        bg: "bg-[#E6EFFB]",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-[#D38B1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        ),
                                        title: "Nomor HP Aktif",
                                        desc: "Digunakan untuk koordinasi pendaftaran.",
                                        bg: "bg-[#FFF3E3]",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:shadow-sm transition duration-300"
                                    >
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1A1C1E]">{item.title}</p>
                                            <p className="text-xs text-[#44474E] font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan: Tahapan Pendaftaran */}
                        <div className="bg-[#025EDB] rounded-3xl p-8 text-white shadow-lg shadow-[#025EDB]/20">
                            <h3 className="text-xl font-extrabold mb-8">
                                Tahapan Pendaftaran
                            </h3>
                            <div className="flex flex-col gap-0">
                                {[
                                    { num: 1, title: "Isi Formulir", desc: "Lengkapi data diri dan isi dengan benar." },
                                    { num: 2, title: "Verifikasi Data", desc: "Admin akan memproses kelengkapan dokumen." },
                                    { num: 3, title: "Dihubungi Admin", desc: "Wawancara singkat dan jadwal kunjungan." },
                                    { num: 4, title: "Santri Diterima", desc: "Proses administrasi akhir & orientasi." },
                                ].map((step, idx, arr) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center font-bold text-sm text-white shrink-0">
                                                {step.num}
                                            </div>
                                            {idx < arr.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-white/20 my-1.5" style={{ minHeight: "28px" }} />
                                            )}
                                        </div>
                                        <div className="pb-6">
                                            <p className="text-sm font-bold text-white">{step.title}</p>
                                            <p className="text-xs text-blue-200 font-medium mt-0.5 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section: Formulir Pendaftaran Santri ── */}
                <div className="xl:px-48 px-6 pb-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-[#1A1C1E]">
                                Formulir Pendaftaran Santri
                            </h2>
                            <p className="text-[#44474E] text-sm font-medium mt-2">
                                Lengkapi data di bawah ini dengan informasi yang akurat.
                            </p>
                        </div>

                        {submitSuccess && (
                            <div className="mb-8 p-5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm font-semibold flex items-center gap-3">
                                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold">Pendaftaran Berhasil Dikirim!</p>
                                    <p className="font-medium text-emerald-700 text-xs mt-0.5">
                                        Tim kami akan menghubungi Anda dalam 1×24 jam untuk konfirmasi. Terima kasih!
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm space-y-10">

                            {/* ── Data Santri ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#E6EFFB] flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#1A1C1E]">Data Santri</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                            placeholder="Masukkan nama lengkap santri"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Jenis Maktab</label>
                                        <div className="relative flex items-center">
                                            <select
                                                name="jenis_maktab"
                                                value={formData.jenis_maktab}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClass} pr-10 appearance-none bg-none cursor-pointer`}
                                            >
                                                <option value="Maktab Tuli As-Sami">Maktab Tuli As-Sami</option>
                                                <option value="Maktab Autis">Maktab Autis</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tempat Lahir</label>
                                        <input
                                            type="text"
                                            name="tempat_lahir"
                                            value={formData.tempat_lahir}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                            placeholder="Kota kelahiran"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            name="tanggal_lahir"
                                            value={formData.tanggal_lahir}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Jenis Kelamin Toggle */}
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Jenis Kelamin</label>
                                        <div className="flex rounded-xl overflow-hidden border border-gray-200 w-fit">
                                            {["Laki-laki", "Perempuan"].map((opt) => (
                                                <button
                                                    type="button"
                                                    key={opt}
                                                    onClick={() => setFormData((p) => ({ ...p, jenis_kelamin: opt }))}
                                                    className={`px-8 py-3 text-sm font-bold transition-all duration-200 ${
                                                        formData.jenis_kelamin === opt
                                                            ? "bg-[#025EDB] text-white"
                                                            : "bg-[#F3F4F6] text-[#44474E] hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Alamat Domisili</label>
                                        <textarea
                                            name="alamat_domisili"
                                            value={formData.alamat_domisili}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className={`${inputClass} resize-none`}
                                            placeholder="Alamat lengkap tempat tinggal santri"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* ── Data Orang Tua / Wali ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#FFF3E3] flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#D38B1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#1A1C1E]">Data Orang Tua / Wali</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Nama Orang Tua</label>
                                        <input
                                            type="text"
                                            name="nama_ortu"
                                            value={formData.nama_ortu}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                            placeholder="Nama ayah atau ibu"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Nomor HP</label>
                                        <input
                                            type="tel"
                                            name="no_hp_ortu"
                                            value={formData.no_hp_ortu}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                            placeholder="Contoh: 08123456789 0"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Pekerjaan</label>
                                        <input
                                            type="text"
                                            name="pekerjaan_ortu"
                                            value={formData.pekerjaan_ortu}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="Pekerjaan saat ini"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Alamat Orang Tua</label>
                                        <input
                                            type="text"
                                            name="alamat_ortu"
                                            value={formData.alamat_ortu}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="Sama dengan santri / isi lainnya"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* ── Unggah Berkas ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[#E6EFFB] flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#1A1C1E]">Unggah Berkas</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    {[
                                        { key: "foto_santri", label: "Foto Santri", icon: (
                                            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )},
                                        { key: "kartu_keluarga", label: "Kartu Keluarga", icon: (
                                            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )},
                                        { key: "ktp_ortu", label: "KTP Orang Tua", icon: (
                                            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                        )},
                                    ].map(({ key, label, icon }) => (
                                        <label
                                            key={key}
                                            htmlFor={`file-${key}`}
                                            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                                                files[key]
                                                    ? "border-[#025EDB] bg-[#E6EFFB]"
                                                    : "border-gray-200 bg-[#F3F4F6] hover:border-[#025EDB]/50 hover:bg-[#E6EFFB]/40"
                                            }`}
                                        >
                                            <input
                                                id={`file-${key}`}
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, key)}
                                            />
                                            {files[key] ? (
                                                <svg className="w-7 h-7 text-[#025EDB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : icon}
                                            <span className={`text-xs font-bold text-center ${files[key] ? "text-[#025EDB]" : "text-[#44474E]"}`}>
                                                {files[key] ? files[key].name.substring(0, 18) + "..." : label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Keterangan Tambahan */}
                                <div>
                                    <label className={labelClass}>Keterangan Tambahan</label>
                                    <textarea
                                        name="keterangan_tambahan"
                                        value={formData.keterangan_tambahan}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Riwayat medis, kebutuhan khusus, atau informasi penting lainnya..."
                                    />
                                </div>
                            </div>

                            {/* Persetujuan */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="persetujuan"
                                    checked={formData.persetujuan}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 w-4 h-4 accent-[#025EDB] shrink-0"
                                />
                                <span className="text-sm text-[#44474E] font-medium leading-relaxed group-hover:text-[#1A1C1E] transition">
                                    Saya menyatakan bahwa seluruh data yang saya isi adalah benar dan dapat dipertanggungjawabkan.
                                </span>
                            </label>

                            {/* Tombol Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.persetujuan}
                                className="w-full bg-[#025EDB] hover:bg-[#004BCA] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-md shadow-[#025EDB]/20 hover:shadow-lg hover:shadow-[#025EDB]/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Mengirim Pendaftaran...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Daftar Sekarang
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Daftar;
