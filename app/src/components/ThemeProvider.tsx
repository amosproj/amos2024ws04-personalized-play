import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import { NAV_THEME, useColorScheme } from '@shadcn/lib';
import { Loading } from '@src/screens';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light
};

const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark
};

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children } = props;
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isSchemeLoaded, setIsSchemeLoaded] = useState(false);

  useEffect(() => {
    const loadScheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('mumbi-theme');
        if (!theme) await AsyncStorage.setItem('mumbi-theme', colorScheme);
        const colorTheme = theme === 'dark' ? 'dark' : 'light';
        if (colorTheme !== colorScheme) setColorScheme(colorTheme);
        setIsSchemeLoaded(true);
      } catch (error) {
        console.error('Failed to load color scheme:', error);
      }
    };
    loadScheme();
  }, []);

  if (!isSchemeLoaded) return null;

  return (
    <NavigationContainer
      theme={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
      fallback={<Loading />}
    >
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      {children}
    </NavigationContainer>
  );
};
