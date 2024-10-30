/**
 * Metro config for Expo + NativeWind integration
 *
 * - Uses `withNativeWind` to integrate Tailwind CSS styling with React Native.
 * - Configures Metro to process styles from `./global.css` for Tailwind utility usage.
 * - Enables using Tailwind classes directly in components, bringing a consistent styling
 *   approach across web and mobile.
 *
 * Note: Keep the config as-is to avoid breaking the NativeWind setup and maintain compatibility
 * with Metro and Expo updates.
 */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
