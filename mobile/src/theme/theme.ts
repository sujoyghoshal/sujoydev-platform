import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
  configureFonts,
} from 'react-native-paper';
import {
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
  Theme as NavigationTheme,
} from '@react-navigation/native';

const fontConfig = {
  displayLarge: { fontFamily: 'sans-serif', fontWeight: '700' as const },
};

export const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig, isV3: true }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E7FF',
    onPrimaryContainer: '#1E1B4B',
    secondary: '#0D9488',
    secondaryContainer: '#CCFBF1',
    onSecondaryContainer: '#134E4A',
    tertiary: '#D97706',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2F7',
    onSurfaceVariant: '#475569',
    outline: '#CBD5E1',
    error: '#DC2626',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig, isV3: true }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818CF8',
    onPrimary: '#1E1B4B',
    primaryContainer: '#3730A3',
    onPrimaryContainer: '#E0E7FF',
    secondary: '#2DD4BF',
    secondaryContainer: '#115E59',
    onSecondaryContainer: '#CCFBF1',
    tertiary: '#FBBF24',
    background: '#0B1120',
    surface: '#111827',
    surfaceVariant: '#1E293B',
    onSurfaceVariant: '#94A3B8',
    outline: '#334155',
    error: '#F87171',
  },
};

const { LightTheme: navLight, DarkTheme: navDark } = adaptNavigationTheme({
  reactNavigationLight: NavLight,
  reactNavigationDark: NavDark,
});

export const navigationLightTheme: NavigationTheme = {
  ...navLight,
  colors: { ...navLight.colors, background: lightTheme.colors.background },
  fonts: NavLight.fonts,
};

export const navigationDarkTheme: NavigationTheme = {
  ...navDark,
  colors: { ...navDark.colors, background: darkTheme.colors.background },
  fonts: NavDark.fonts,
};

export type AppTheme = typeof lightTheme;
