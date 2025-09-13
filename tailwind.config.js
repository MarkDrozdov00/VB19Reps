/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'bg-violet-500',
    'bg-violet-100',
    'text-violet-700'
  ],
  theme: {
    extend: {
      colors: {
        'vb19': {
          primary: '#9b51e0',
          secondary: '#e91e63',
          accent: '#ff6b35',
          bg: '#faf7ff',
          text: '#2d1b69',
          muted: '#8b5cf6'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'slide-up': 'slideInUp 0.6s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
