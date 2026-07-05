import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Snackbar, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../app/hooks';
import { signedIn } from '../app/slices/authSlice';
import { signInWithGoogle } from '../services/googleAuth';
import { apiClient, setAccessToken } from '../api/client';
import { generateId } from '../services/tickets';
import { brand, radius, shadow, spacing } from '../theme/tokens';
import type { RootScreenProps } from '../navigation/types';

const BENEFITS = [
  { icon: 'briefcase-plus-outline', label: 'Submit project requests' },
  { icon: 'ticket-confirmation-outline', label: 'Track ticket status live' },
  { icon: 'heart-outline', label: 'Save favorite projects' },
];

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
        <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
          <Surface style={[styles.brandTile, { backgroundColor: theme.colors.primary }]} elevation={0}>
            <View style={[styles.brandBlob, { backgroundColor: 'rgba(255,255,255,0.14)' }]} />
            <Icon source="cube-outline" size={40} color={theme.colors.onPrimary} />
          </Surface>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome to NurixSoft
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to work with us on your next website, app or design.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(450)} style={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <View key={benefit.label} style={styles.benefitRow}>
              <View style={[styles.benefitIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon source={benefit.icon} size={18} color={theme.colors.primary} />
              </View>
              <Text variant="bodyMedium">{benefit.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(450)} style={styles.actions}>
          <Button
            mode="contained"
            icon="google"
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={busy}
            disabled={busy}
            onPress={onGoogle}>
            Continue with Google
          </Button>
          <Button
            mode="outlined"
            icon="account-outline"
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={busy}
            onPress={onGuest}>
            Continue as Guest
          </Button>
          <View style={styles.noteRow}>
            <Icon source="shield-lock-outline" size={14} color={brand.success} />
            <Text variant="bodySmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
              Guest sessions stay on this device. Your data is never shared.
            </Text>
          </View>
        </Animated.View>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={4000}>
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl + 4 },
  header: { alignItems: 'center' },
  brandTile: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.raised,
  },
  brandBlob: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: radius.full,
    top: -45,
    right: -30,
  },
  title: { fontWeight: '800', marginTop: spacing.xl, letterSpacing: -0.4 },
  subtitle: { textAlign: 'center', marginTop: spacing.sm },
  benefits: { marginTop: spacing.xxl, gap: spacing.md, alignSelf: 'stretch' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { marginTop: spacing.xxl, alignSelf: 'stretch' },
  button: { marginTop: spacing.sm + 2, borderRadius: radius.md },
  buttonContent: { paddingVertical: 4 },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  note: { textAlign: 'center' },
});
