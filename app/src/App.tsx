import type React from 'react';
import '../global.css'; // Import Tailwind CSS styles for NativeWind functionality. Do not remove.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './components';
import { AppRoutes } from './routes';

/**
 * Root component of the application (`App`).
 *
 * - Imports `global.css` to enable Tailwind CSS styles for NativeWind, allowing the use of
 *   utility classes (`className`) in React Native components. Removing `global.css` will
 *   disable Tailwind styling.
 */
export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
