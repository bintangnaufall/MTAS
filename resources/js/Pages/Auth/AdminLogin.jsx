import React, { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";

export default function AdminLogin({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'security' | 'help' | null

    useEffect(() => {
        document.documentElement.classList.add("overflow-hidden");
        document.body.classList.add("overflow-hidden");
        return () => {
            document.documentElement.classList.remove("overflow-hidden");
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "bintang7735@gmail.com",
        password: "",
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(typeof route !== "undefined" ? route("login.post") : "/admin/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Masuk Admin Console - Yayasan Bhakti Arumi Delangga" />

            {/* Zero-Scroll 100vh Full Viewport Center Container */}
            <div className="h-screen max-h-screen w-screen max-w-full bg-[#f4f7fb] text-on-surface font-body-sm flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
                
                {/* Ambient Soft Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-24 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#0048ab0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                {/* Centered Main Wrapper (100% Symmetrical Vertical & Horizontal Alignment) */}
                <div className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center my-auto space-y-3.5">
                    
                    {/* Brand Header (Centered) */}
                    <div className="flex flex-col items-center text-center space-y-1">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-outline-variant/70 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
                                <img
                                    src="/images/YBAD_logo.png"
                                    alt="Logo Yayasan Bhakti Arumi"
                                    className="w-full h-full object-contain drop-shadow-xs"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/berita_utama.png";
                                    }}
                                />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1.5">
                                    <h1 className="font-headline-md text-base font-bold text-primary tracking-tight leading-tight">
                                        Bhakti Arumi
                                    </h1>
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold tracking-wide">
                                        MTAS
                                    </span>
                                </div>
                                <p className="font-label-sm text-[10px] text-outline leading-none">
                                    Islamic Foundation Admin Console
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Centered Main Card */}
                    <div className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-7 transition-all">
                        {/* Title */}
                        <div className="text-center mb-5">
                            <h2 className="font-headline-lg text-xl sm:text-2xl font-black text-on-surface tracking-tight leading-tight">
                                Masuk Admin Console
                            </h2>
                            <p className="font-body-md text-xs text-outline mt-0.5">
                                Masukkan kredensial akun Anda untuk mengakses sistem
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                                <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                                    check_circle
                                </span>
                                <span className="font-medium">{status}</span>
                            </div>
                        )}

                        {/* Error Notification */}
                        {errors.email && (
                            <div className="mb-3.5 p-2.5 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs flex items-start gap-2 animate-in fade-in">
                                <span className="material-symbols-outlined text-error text-[16px] shrink-0 mt-0.5">
                                    error
                                </span>
                                <span className="font-medium">{errors.email}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            {/* Email / Username Field */}
                            <div className="space-y-1 text-left">
                                <label className="block text-xs font-bold text-on-surface">
                                    Email atau Username <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                                        mail
                                    </span>
                                    <input
                                        type="text"
                                        name="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="nama@bhaktiarumi.org atau username"
                                        autoComplete="username"
                                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-xs sm:text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1 text-left">
                                <label className="block text-xs font-bold text-on-surface">
                                    Kata Sandi <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="Masukkan kata sandi Anda"
                                        autoComplete="current-password"
                                        className="w-full h-11 pl-10 pr-11 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-xs sm:text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-lg transition-colors cursor-pointer"
                                        title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-error font-medium">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between pt-0.5">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-outline-variant transition-colors"
                                    />
                                    <span className="text-xs font-semibold text-outline">
                                        Ingat sesi masuk di perangkat ini
                                    </span>
                                </label>
                            </div>

                            {/* Submit Login Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-label-md font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Memverifikasi Akun...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Dashboard</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center my-4">
                            <div className="border-t border-outline-variant/60 w-full" />
                            <span className="bg-surface-container-lowest px-2.5 text-[10px] font-bold text-outline uppercase tracking-wider absolute">
                                atau masuk dengan
                            </span>
                        </div>

                        {/* Google OAuth Button */}
                        <a
                            href={typeof route !== "undefined" ? route("auth.google") : "/auth/google"}
                            className="w-full h-10 bg-surface-container-low hover:bg-surface-container active:bg-surface-container-high border border-outline-variant rounded-xl text-xs font-bold text-on-surface shadow-2xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group"
                        >
                            <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Akun Google Workspace</span>
                        </a>

                        {/* Security & Help Links (Centered) */}
                        <div className="pt-3.5 mt-3.5 border-t border-outline-variant/60 flex items-center justify-center gap-5 text-[11px] text-outline font-medium">
                            <button
                                type="button"
                                onClick={() => setActiveModal("security")}
                                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px]">security</span>
                                <span>Kebijakan Keamanan</span>
                            </button>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={() => setActiveModal("help")}
                                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px]">help</span>
                                <span>Pusat Bantuan IT</span>
                            </button>
                        </div>
                    </div>

                    {/* Centered Return Link & Bottom Footer Info */}
                    <div className="flex flex-col items-center text-center space-y-1 pt-1">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-outline hover:text-primary font-semibold transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            <span>Kembali ke Halaman Publik MTAS</span>
                        </Link>
                        
                        <div className="flex items-center justify-center gap-2 text-[11px] text-outline/80">
                            <span>&copy; 2026 Yayasan Bhakti Arumi Delangga</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                <span className="font-mono text-[10px]">TLS 1.3 Online</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MODAL KEBIJAKAN KEAMANAN ================= */}
            {activeModal === "security" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-outline-variant text-on-surface space-y-4">
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
                                <span className="material-symbols-outlined text-[22px]">verified_user</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                    Standar Keamanan Sistem MTAS
                                </h3>
                                <p className="text-xs text-outline">
                                    Protokol Proteksi Admin &amp; Data Santri
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs text-outline">
                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                                <span className="font-bold text-on-surface block mb-0.5">
                                    🔒 Rate Limiting &amp; Proteksi Percobaan
                                </span>
                                Pembatasan otomatis percobaan login hingga maksimal 5 kali berturut-turut untuk mencegah serangan brute force.
                            </div>
                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                                <span className="font-bold text-on-surface block mb-0.5">
                                    🛡️ Bcrypt 12-Round Password Hash
                                </span>
                                Kredensial akun dienkripsi secara irreversibel dengan algoritma hashing standar industri.
                            </div>
                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                                <span className="font-bold text-on-surface block mb-0.5">
                                    🔑 Token CSRF &amp; Regenerasi Sesi
                                </span>
                                ID sesi diperbarui secara otomatis pada saat otentikasi untuk mencegah eksploitasi session fixation.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-primary/20 cursor-pointer"
                        >
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* ================= MODAL BANTUAN IT ================= */}
            {activeModal === "help" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-outline-variant text-on-surface space-y-4">
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
                                <span className="material-symbols-outlined text-[22px]">support_agent</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                                    Pusat Bantuan &amp; Akses
                                </h3>
                                <p className="text-xs text-outline">
                                    Kontak Administrator IT &amp; Super Admin
                                </p>
                            </div>
                        </div>

                        <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/20 text-xs text-on-surface space-y-2">
                            <p className="font-bold text-primary">
                                Lupa kata sandi akun Anda?
                            </p>
                            <p className="text-outline leading-relaxed">
                                Untuk menjaga privasi dan keamanan data santri MTAS, pengaturan ulang (reset) kata sandi dilakukan langsung oleh <strong>Super Admin Yayasan</strong>:
                            </p>
                            <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 font-mono text-[11px] text-on-surface space-y-1">
                                <div><span className="text-outline">Email IT:</span> it@bhaktiarumi.org</div>
                                <div><span className="text-outline">WhatsApp:</span> +62 812-3456-7890</div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-primary/20 cursor-pointer"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
