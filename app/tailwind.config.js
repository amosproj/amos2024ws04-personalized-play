/**
 * Tailwind CSS configuration for integrating NativeWind with Expo.
 * Essential for using Tailwind's utility classes in React Native components.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', '*.{tsx,ts}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {}
  },
  plugins: []
};
