/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#080A12',
          navy: '#10182B',
          dark: '#0B0F1A',
          card: 'rgba(16, 24, 43, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        infinity: {
          purple: '#7B2CFF',
          glow: 'rgba(123, 44, 255, 0.4)',
        },
        stone: {
          power: '#F04452',    // Power Stone Red
          space: '#35B9FF',    // Space Stone Blue
          mind: '#F5C451',     // Mind Stone Gold
          reality: '#D62E45',  // Reality Stone Crimson
          time: '#45D483',     // Time Stone Emerald
          soul: '#FF8C42',     // Soul Stone Amber
        },
        avengers: {
          gold: '#ECC94B',
          white: '#F4F5FA',
          muted: '#8E9AA8',
          border: 'rgba(244, 245, 250, 0.12)',
        }
      },
      fontFamily: {
        marvel: ['"Cinzel"', '"Cinzel Decorative"', 'serif'],
        cinematic: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        display: ['"Orbitron"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        montserrat: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
        'orbit-1': 'orbit1 18s linear infinite',
        'orbit-2': 'orbit2 24s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(123, 44, 255, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(123, 44, 255, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
