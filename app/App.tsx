import type React from 'react';
import { Text, View } from 'react-native';
import './global.css'; // Import Tailwind CSS styles for NativeWind functionality. Do not remove.

/**
 * Root component of the application (`App`).
 *
 * - Imports `global.css` to enable Tailwind CSS styles for NativeWind, allowing the use of
 *   utility classes (`className`) in React Native components. Removing `global.css` will
 *   disable Tailwind styling.
 */
export const App: React.FC = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Hello Mumbi!</Text>
    </View>
  );
};
