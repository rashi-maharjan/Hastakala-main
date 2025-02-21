/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 1px 20px 0px rgba(0, 0, 0, 0.10)',
      },
      colors: {
        primary: {
          DEFAULT: "#204EC5",
        },
        dark:{
          DEFAULT:"#111",
        },
        grey:{
          DEFAULT:'#D9D9D9',
          '100':'#EDEDED',
        }
      },
    },
    plugins: [],
  },
};
