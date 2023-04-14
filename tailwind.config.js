/** @type {import('tailwindcss').Config} */
export default {
    mode: "jit",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Noto Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
};
