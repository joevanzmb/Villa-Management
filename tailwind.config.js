import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
                serif: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                luxury: {
                    beige: '#F5F0E8',
                    cream: '#FAF7F2',
                    olive: '#5C6B4F',
                    darkgreen: '#1B2A22',
                    wood: '#8B6F47',
                    gold: '#C9A55C',
                    charcoal: '#2C2C2C',
                    muted: '#9B9B8E',
                    sand: '#E8DFD0',
                },
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'line-grow': {
                    '0%': { transform: 'scaleX(0)' },
                    '100%': { transform: 'scaleX(1)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 165, 92, 0.4)' },
                    '50%': { boxShadow: '0 0 30px 10px rgba(201, 165, 92, 0.1)' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(200%)' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'fade-in-up-delay-1': 'fade-in-up 0.8s ease-out 0.2s forwards',
                'fade-in-up-delay-2': 'fade-in-up 0.8s ease-out 0.4s forwards',
                'fade-in-up-delay-3': 'fade-in-up 0.8s ease-out 0.6s forwards',
                'fade-in': 'fade-in 1s ease-out forwards',
                'fade-in-slow': 'fade-in 1.5s ease-out 0.5s forwards',
                'slide-in-left': 'slide-in-left 1s ease-out forwards',
                'slide-in-right': 'slide-in-right 1s ease-out forwards',
                'scale-in': 'scale-in 0.8s ease-out forwards',
                'line-grow': 'line-grow 1.2s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s infinite',
            },
        },
    },

    plugins: [forms],
};
