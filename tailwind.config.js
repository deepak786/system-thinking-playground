/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eefdf3',
          100: '#d6f9e1',
          200: '#b0f1c8',
          300: '#7be4a8',
          400: '#3fce82',
          500: '#1cb765',
          600: '#0f9351',
          700: '#0e7443',
          800: '#105c38',
          900: '#0f4b30',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 40px -20px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(28,183,101,0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(28,183,101,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(28,183,101,0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
