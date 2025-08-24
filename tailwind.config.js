
/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: { extend: {
            // (Opsional) Hapus duplikasi warna kalau kamu sudah pakai @theme inline di globals.css
            // colors: { 'polri-blue': { ... } },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
        }},
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}