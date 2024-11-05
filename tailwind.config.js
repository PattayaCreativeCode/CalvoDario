/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-indigo-200',
    'text-indigo-500',
    'text-indigo-600',
    'text-indigo-700',
    'text-indigo-900',
    'ring-indigo-400',
    'ring-indigo-500',
    'bg-rose-50',
    'bg-rose-100',
    'bg-rose-200',
    'text-rose-500',
    'text-rose-600',
    'text-rose-700',
    'text-rose-900',
    'ring-rose-400',
    'ring-rose-500',
    'bg-slate-50',
    'bg-slate-100',
    'bg-slate-200',
    'text-slate-500',
    'text-slate-600',
    'text-slate-700',
    'text-slate-900',
    'ring-slate-400',
    'ring-slate-500'
  ],
  plugins: [],
};