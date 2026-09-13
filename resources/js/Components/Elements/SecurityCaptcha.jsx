import React, { useState, useEffect } from "react";

export default function SecurityCaptcha({
    initialQuestion = "Berapakah 5 + 3?",
    value = "",
    onChange,
    onHoneypotChange,
    honeypotValue = "",
    errors = {},
    className = "",
}) {
    const [question, setQuestion] = useState(initialQuestion);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (initialQuestion) {
            setQuestion(initialQuestion);
        }
    }, [initialQuestion]);

    const handleRefresh = async (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            const res = await fetch("/captcha/refresh", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const data = await res.json();
            if (data?.question) {
                setQuestion(data.question);
                if (onChange) {
                    onChange("");
                }
            }
        } catch (err) {
            console.error("Gagal memperbarui captcha:", err);
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
            }, 400);
        }
    };

    return (
        <div className={`rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-slate-50 p-4 sm:p-5 shadow-xs ${className}`}>
            {/* Honeypot Trap Field (Hidden from real human users, traps spam bots) */}
            <div
                style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: "-9999px",
                    height: 0,
                    width: 0,
                    zIndex: -1,
                    pointerEvents: "none",
                }}
                aria-hidden="true"
            >
                <label htmlFor="form_hp_website">Leave this field blank</label>
                <input
                    type="text"
                    id="form_hp_website"
                    name="form_hp_website"
                    value={honeypotValue}
                    onChange={(e) => onHoneypotChange && onHoneypotChange(e.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                />
            </div>

            {/* Header / Security Badge */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#025EDB]/10 text-[#025EDB]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Verifikasi Keamanan (Anti-Bot)
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    title="Ganti pertanyaan keamanan"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#025EDB] hover:text-[#0048AB] bg-white border border-blue-200/80 hover:border-blue-300 px-2.5 py-1 rounded-lg transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#025EDB]" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-[11px]">Ganti Soal</span>
                </button>
            </div>

            {/* Math Question & Answer Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-blue-200/90 shadow-2xs shrink-0 select-none">
                    <span className="text-xs font-bold text-slate-500">Hitung:</span>
                    <span className="text-sm font-black text-[#025EDB] tracking-wide font-mono">
                        {question}
                    </span>
                </div>

                <div className="flex-1 relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={value}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        placeholder="Ketik angka jawaban..."
                        required
                        className={`w-full bg-white border text-sm font-medium text-slate-900 rounded-xl px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#025EDB]/15 ${
                            errors?.captcha_answer
                                ? "border-red-400 focus:border-red-500"
                                : "border-slate-200 focus:border-[#025EDB]"
                        }`}
                    />
                </div>
            </div>

            {/* Error Message for Captcha */}
            {errors?.captcha_answer && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.captcha_answer}</span>
                </p>
            )}

            {/* Error Message for Rate Limit Throttling */}
            {errors?.rate_limit && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2 font-medium">
                    <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errors.rate_limit}</span>
                </div>
            )}
        </div>
    );
}
