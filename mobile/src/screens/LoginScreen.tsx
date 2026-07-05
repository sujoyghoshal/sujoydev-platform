import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Snackbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../app/hooks';
import { signedIn } from '../app/slices/authSlice';
import { signInWithGoogle } from '../services/googleAuth';
import { apiClient, setAccessToken } from '../api/client';
import { generateId } from '../services/tickets';
import type { RootScreenProps } from '../navigation/types';

export function LoginScreen({ navigation, route }: RootScreenProps<'Login'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const finishLogin = () => {
    const redirectTo = route.params?.redirectTo;
    if (redirectTo === 'ProjectRequest' || redirectTo === 'BugReport') {
      navigation.replace(redirectTo);
    } else {
      navigation.goBack();
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    try {
      const { profile, idToken } = await signInWithGoogle();

      // Exchange the Google ID token for a NurixSoft JWT. If the backend is
      // unreachable the local session still works; the API is simply not
      // authenticated until the next sign-in.
      if (idToken) {
        try {
          const { data } = await apiClient.post('/auth/google', { idToken });
          setAccessToken(data.data.accessToken as string);
        } catch {
          // Offline or backend not deployed yet — continue with local session.
        }
      }

      dispatch(signedIn(profile));
      finishLogin();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onGuest = () => {
    dispatch(
      signedIn({
        id: generateId(),
        name: 'Guest User',
        email: 'guest@nurixsoft.app',
        provider: 'guest',
      }),
    );
    finishLogin();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Avatar.Icon size={84} icon="account-lock" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
        <Text variant="headlineSmall" style={styles.title}>
          Sign in to continue
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Signing in lets you submit project requests, report bugs, track ticket status and save favorites.
        </Text>

        <Button
          mode="contained"
          icon="google"
          style={styles.button}
          loading={busy}
          disabled={busy}
          onPress={onGoogle}>
          Continue with Google
        </Button>
        <Button mode="outlined" icon="account-outline" style={styles.button} disabled={busy} onPress={onGuest}>
          Continue as Guest
        </Button>
        <Text variant="bodySmall" style={styles.note}>
          Guest sessions are stored only on this device. Your data is never shared.
        </Text>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={4000}>
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { fontWeight: '800', marginTop: 20 },
  subtitle: { opacity: 0.7, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  button: { alignSelf: 'stretch', marginTop: 10, borderRadius: 10 },
  note: { opacity: 0.5, textAlign: 'center', marginTop: 18 },
});
