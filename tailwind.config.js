/** @type {import('tailwindcss').Config} */
export default {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Noto Sans', 'sans-serif'],
            },
            colors: {
                gallery: {
                    50: '#f8f8f8',
                    100: '#eeeeee',
                    200: '#e4e4e4',
                    300: '#d1d1d1',
                    400: '#b4b4b4',
                    500: '#9a9a9a',
                    600: '#818181',
                    700: '#6a6a6a',
                    800: '#5a5a5a',
                    900: '#4e4e4e',
                    950: '#282828',
                },
                'green-vanilla': {
                    300: '#a0e081',
                    400: '#52a535',
                    500: '#3c8527',
                    600: '#2a641c',
                },
            },
        },
    },
    plugins: [],
}
