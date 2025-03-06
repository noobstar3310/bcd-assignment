import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // This makes dark mode opt-in instead of default
    theme: {
        extend: {
            colors: {
                background: '#ffffff',
                foreground: '#000000',
            },
        },
    },
    plugins: [],
};

export default config; 