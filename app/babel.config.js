/**
 * Babel configuration for Expo + NativeWind integration
 *
 * - `babel-preset-expo`: Ensures compatibility with Expo for React Native development.
 * - `jsxImportSource: 'nativewind'`: Enables Tailwind CSS styling in React Native components.
 * - `nativewind/babel`: Provides additional support for NativeWind functionality.
 *
 * Note: Keep these settings to ensure seamless NativeWind and Expo integration. Removing or
 * changing them may cause compatibility issues or disable Tailwind styling in the app.
 */
module.exports = (api) => {
  api.cache(true); // Cache to avoid re-evaluation on every build for improved performance.
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin']
  };
};
