import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger', // 'danger' | 'warning' | 'primary' | 'success'
    icon = 'warning',
    isLoading = false,
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Listen for ESC key & lock background body scrolling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden';
            }
        } else {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        };
    }, [isOpen, isLoading, onClose]);

    if (!isOpen || !mounted || typeof document === 'undefined') return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-error-container/30 text-error',
            btnBg: 'bg-error text-white hover:bg-error/90 shadow-error/20',
        },
        warning: {
            iconBg: 'bg-amber-100 text-amber-700',
            btnBg: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20',
        },
        primary: {
            iconBg: 'bg-primary/10 text-primary',
            btnBg: 'bg-primary text-white hover:bg-primary/90 shadow-primary/20',
        },
        success: {
            iconBg: 'bg-emerald-100 text-emerald-700',
            btnBg: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;

    const modalMarkup = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
                if (!isLoading) onClose();
            }}
        >
            <div 
                className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl space-y-4 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with icon */}
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                            {title}
                        </h3>
                        <div className="font-body-sm text-xs text-outline leading-relaxed mt-1">
                            {typeof message === 'string' ? <p>{message}</p> : message}
                        </div>
                    </div>
                </div>

                {/* Footer action buttons */}
                <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-low transition cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-xl font-label-md text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${currentVariant.btnBg}`}
                    >
                        {isLoading && (
                            <span className="material-symbols-outlined text-sm animate-spin">
                                progress_activity
                            </span>
                        )}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalMarkup, document.body);
}
