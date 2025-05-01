
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
        },
        blueprint: {
          50: 'hsl(var(--blueprint-50))',
          100: 'hsl(var(--blueprint-100))',
          200: 'hsl(var(--blueprint-200))',
          300: 'hsl(var(--blueprint-300))',
          400: 'hsl(var(--blueprint-400))',
          500: 'hsl(var(--blueprint-500))',
          600: 'hsl(var(--blueprint-600))',
          700: 'hsl(var(--blueprint-700))',
          800: 'hsl(var(--blueprint-800))',
          900: 'hsl(var(--blueprint-900))',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4d4d4d',
          800: '#2d2d2d', // F9's primary color
          900: '#1a1a1a',
          950: '#0a0a0a',
        },
        earth: {
          50: '#f9f7f5',
          100: '#f3efe9',
          200: '#e7dfd4',
          300: '#d6c7b3',
          400: '#c3ab8f',
          500: '#b3957a',
          600: '#a58065',
          700: '#8b6b53',
          800: '#725847',
          900: '#5e4a3c',
          950: '#332720',
        },
        architect: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#313131',
          950: '#1a1a1a',
        },
        terracotta: {
          50: '#fcf8f6',
          100: '#f6e9e2',
          200: '#ebcfc0',
          300: '#e0b298',
          400: '#d49473',
          500: '#cb7a59',
          600: '#bc6247',
          700: '#9c4e3b',
          800: '#7e4334',
          900: '#673a2f',
          950: '#371c16',
        },
        yellow: {
          50: 'hsl(var(--yellow-50))',
          100: 'hsl(var(--yellow-100))',
          200: 'hsl(var(--yellow-200))',
          300: 'hsl(var(--yellow-300))',
          400: 'hsl(var(--yellow-400))',
          500: 'hsl(var(--yellow-500))', // F9 yellow
          600: 'hsl(var(--yellow-600))',
          700: 'hsl(var(--yellow-700))',
          800: 'hsl(var(--yellow-800))',
          900: 'hsl(var(--yellow-900))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          from: { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          from: { 
            opacity: '1',
            transform: 'translateY(0)'  
          },
          to: { 
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'slide-in': {
          from: { 
            transform: 'translateX(-20px)',
            opacity: '0'
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'slide-in-right': {
          from: { 
            transform: 'translateX(20px)',
            opacity: '0'
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'pop': {
          '0%': { 
            transform: 'scale(0.95)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 rgba(147, 51, 234, 0)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
            opacity: '0.9'
          }
        },
        'checkmark': {
          from: { 
            strokeDashoffset: '20',
            opacity: '0'
          },
          to: { 
            strokeDashoffset: '0',
            opacity: '1'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        'pop': 'pop 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'checkmark': 'checkmark 0.3s ease-out forwards'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
