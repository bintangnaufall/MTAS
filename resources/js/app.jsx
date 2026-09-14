import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = 'MTAS';

// Initialize theme & compact tables mode from localStorage / system
try {
    const savedTheme = localStorage.getItem('mtas_theme') || 'light';
    const isDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (savedTheme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('mtas_theme') === 'system') {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        });
    }

    const savedCompact = localStorage.getItem('mtas_compact_tables');
    if (savedCompact === 'true') {
        document.documentElement.classList.add('compact-tables');
    } else if (savedCompact === 'false') {
        document.documentElement.classList.remove('compact-tables');
    }
} catch (e) {}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
