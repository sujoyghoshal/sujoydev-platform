import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { store, hydrateStore } from './src/app/store';
import { useAppSelector } from './src/app/hooks';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  lightTheme,
  darkTheme,
  navigationLightTheme,
  navigationDarkTheme,
} from './src/theme/theme';

function ThemedApp() {
  const systemScheme = useColorScheme();
  const mode = useAppSelector((s) => s.theme.mode);
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const paperTheme = isDark ? darkTheme : lightTheme;
  const navTheme = isDark ? navigationDarkTheme : navigationLightTheme;

  return (
    <PaperProvider
      theme={paperTheme}
      settings={{
        icon: ({ name, color, size, testID }) => (
          <MaterialDesignIcons name={name as never} color={color} size={size} testID={testID} />
        ),
      }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={paperTheme.colors.background}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void hydrateStore().finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemedApp />
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
