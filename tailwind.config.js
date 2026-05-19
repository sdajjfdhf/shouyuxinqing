/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /** 主绿：豆沙绿系（沿用 `forest-*` 类名，全站文案与按钮自动统一） */
        forest: {
          50: '#f4faf6',
          100: '#e5f0ea',
          200: '#cce0d6',
          300: '#a6cab8',
          400: '#7aad93',
          500: '#569174',
          600: '#43765e',
          700: '#375f4d',
          800: '#2f4d40',
          900: '#284136',
        },
        /** 淡粉辅色 */
        blossom: {
          50: '#fff8fa',
          100: '#ffecf2',
          200: '#ffd6e4',
          300: '#ffb8cf',
          400: '#f293b3',
          500: '#e0759a',
          600: '#c45d80',
          700: '#a34768',
          800: '#863d57',
          900: '#6f3649',
        },
        healing: {
          blue: '#e0f2fe',
          purple: '#f3e8ff',
          pink: '#fce7f3',
          yellow: '#fef9c3',
          orange: '#ffedd5',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        cute: ['"ZCOOL KuaiLe"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 1s',
        'breathe': 'breathe 4s ease-in-out infinite',
        'sway': 'sway 3s ease-in-out infinite',
        'leaf-fall': 'leaf-fall 15s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'leaf-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
