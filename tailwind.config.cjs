/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(262, 83%, 58%)',
          foreground: 'hsl(0, 0%, 100%)'
        },
        secondary: {
          DEFAULT: 'hsl(252, 20%, 96%)',
          foreground: 'hsl(262, 83%, 58%)'
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(262, 83%, 10%)'
        },
        muted: {
          DEFAULT: 'hsl(252, 20%, 96%)',
          foreground: 'hsl(252, 5%, 45%)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};