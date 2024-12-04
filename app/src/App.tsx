import type React from 'react';
import '../global.css'; // Import Tailwind CSS styles for NativeWind functionality. Do not remove.
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './components';
import { fontAssets } from './constants';
import { AppRoutes } from './routes';

/**
 * Root component of the application (`App`).
 *
 * - Imports `global.css` to enable Tailwind CSS styles for NativeWind, allowing the use of
 *   utility classes (`className`) in React Native components. Removing `global.css` will
 *   disable Tailwind styling.
 */
export const App: React.FC = () => {
  const [isFontsLoaded] = useFonts(fontAssets);

  // Prevent the splash screen from auto-hiding before content is ready.
  useEffect(() => {
    const prepare = async () => await preventAutoHideAsync();
    prepare();
  }, []);

  // Hide the splash screen once fonts are loaded.
  const onLayoutRootView = useCallback(async () => {
    if (isFontsLoaded) await hideAsync();
  }, [isFontsLoaded]);

  if (!isFontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <GestureHandlerRootView>
          <ThemeProvider>
            <AppRoutes />
            <PortalHost />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
