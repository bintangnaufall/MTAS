import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                "surface": "#f7f9fb",
                "outline": "#727786",
                "on-surface": "#191c1e",
                "on-primary-fixed-variant": "#00419d",
                "on-error": "#ffffff",
                "on-tertiary-container": "#dbe3ff",
                "primary-fixed-dim": "#b1c6ff",
                "inverse-on-surface": "#eff1f3",
                "surface-variant": "#e0e3e5",
                "surface-tint": "#0057cd",
                "inverse-surface": "#2d3133",
                "primary-fixed": "#d9e2ff",
                "surface-container-high": "#e6e8ea",
                "surface-container-highest": "#e0e3e5",
                "error": "#ba1a1a",
                "surface-container-lowest": "#ffffff",
                "surface-container": "#eceef0",
                "on-secondary-container": "#704600",
                "on-tertiary-fixed": "#001944",
                "on-tertiary": "#ffffff",
                "on-error-container": "#93000a",
                "tertiary-container": "#3b63b3",
                "on-background": "#191c1e",
                "inverse-primary": "#b1c6ff",
                "surface-dim": "#d8dadc",
                "on-secondary-fixed": "#2a1700",
                "error-container": "#ffdad6",
                "on-secondary": "#ffffff",
                "outline-variant": "#c2c6d6",
                "on-surface-variant": "#424654",
                "secondary-fixed": "#ffddb7",
                "primary": "#0048ab",
                "secondary-container": "#feb249",
                "primary-container": "#025edb",
                "on-primary-container": "#dce3ff",
                "tertiary": "#1d4a99",
                "tertiary-fixed-dim": "#afc6ff",
                "on-primary": "#ffffff",
                "secondary-fixed-dim": "#ffb95d",
                "secondary": "#855400",
                "tertiary-fixed": "#d9e2ff",
                "surface-container-low": "#f2f4f6",
                "on-secondary-fixed-variant": "#653e00",
                "on-primary-fixed": "#001946",
                "on-tertiary-fixed-variant": "#124392",
                "surface-bright": "#f7f9fb",
                "background": "#f7f9fb"
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "2xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "margin-mobile": "1rem",
                "stack-sm": "0.5rem",
                "stack-lg": "2rem",
                "container-max": "1440px",
                "stack-md": "1rem",
                "margin-desktop": "2.5rem",
                "gutter": "1.5rem",
                "sidebar-width": "280px"
            },
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                headline: ['Manrope', 'sans-serif'],
                label: ['JetBrains Mono', 'monospace'],
                body: ['Inter', 'sans-serif'],
                'headline-sm': ['Manrope', 'sans-serif'],
                'label-md': ['JetBrains Mono', 'monospace'],
                'label-sm': ['JetBrains Mono', 'monospace'],
                'body-lg': ['Inter', 'sans-serif'],
                'headline-md': ['Manrope', 'sans-serif'],
                'body-md': ['Inter', 'sans-serif'],
                'body-sm': ['Inter', 'sans-serif'],
                'headline-lg': ['Manrope', 'sans-serif']
            },
            fontSize: {
                "headline-sm": ["18px", { lineHeight: "24px", fontWeight: "600" }],
                "label-md": ["13px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
                "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
                "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
                "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
                "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
                "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }]
            }
        },
    },

    plugins: [forms],
};
