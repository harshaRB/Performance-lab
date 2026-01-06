/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505',
                surface: '#0F1115',
                surfaceHighlight: '#1A1D23',
                primary: '#6366f1', // Indigo
                secondary: '#8b5cf6', // Violet
                accent: '#10b981', // Emerald
                danger: '#f43f5e', // Rose
                warning: '#f97316', // Orange
                text: {
                    main: '#e5e5e5',
                    muted: '#a3a3a3',
                    dim: '#525252'
                }
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-secondary': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-accent': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'obsidian-gradient': 'linear-gradient(145deg, #0F1115 0%, #050505 100%)',
            }
        },
    },
    plugins: [],
}
