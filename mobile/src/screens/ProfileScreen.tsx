import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, List, SegmentedButtons, Surface, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { signedOut } from '../app/slices/authSlice';
import { setThemeMode, ThemeMode } from '../app/slices/themeSlice';
import { signOutGoogle } from '../services/googleAuth';
import { APP_VERSION } from '../config/constants';
import { brand, radius, shadow, spacing } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const themeMode = useAppSelector((s) => s.theme.mode);
  const { requests, bugs } = useAppSelector((s) => s.submissions);
  const { projectIds, blogIds } = useAppSelector((s) => s.favorites);

  const onSignOut = async () => {
    await signOutGoogle();
    dispatch(signedOut());
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <View style={[styles.headerBlob, { backgroundColor: theme.dark ? brand.heroBlobDarkA : brand.heroBlobA }]} />
          <View style={styles.header}>
            {user?.photoUrl ? (
              <Avatar.Image size={68} source={{ uri: user.photoUrl }} />
            ) : (
              <Avatar.Icon
                size={68}
                icon="account"
                style={{ backgroundColor: theme.colors.surface }}
                color={theme.colors.primary}
              />
            )}
            <View style={styles.headerText}>
              <Text variant="titleLarge" style={[styles.name, { color: theme.colors.onPrimaryContainer }]}>
                {isAuthenticated ? user?.name : 'Welcome'}
              </Text>
              <Text variant="bodySmall" style={[styles.email, { color: theme.colors.onPrimaryContainer }]}>
                {isAuthenticated ? user?.email : 'Sign in to submit requests and track tickets'}
              </Text>
            </View>
          </View>
          {!isAuthenticated ? (
            <Button mode="contained" icon="login" style={styles.signIn} onPress={() => navigation.navigate('Login')}>
              Sign In
            </Button>
          ) : null}
        </Surface>

        <List.Section>
          <List.Subheader>My Activity</List.Subheader>
          <List.Item
            title="My Tickets"
            description={`${requests.length} requests · ${bugs.length} bug reports`}
            left={(p) => <List.Icon {...p} icon="ticket-confirmation-outline" />}
            right={(p) => <List.Icon {...p} icon="chevron-right" />}
            onPress={() => navigation.navigate('MyRequests')}
          />
          <List.Item
            title="Saved Items"
            description={`${projectIds.length} projects · ${blogIds.length} articles`}
            left={(p) => <List.Icon {...p} icon="heart-outline" />}
            right={(p) => <List.Icon {...p} icon="chevron-right" />}
            onPress={() => navigation.navigate('Favorites')}
          />
          <List.Item
            title="Report a Bug"
            description="Something not working? Tell us."
            left={(p) => <List.Icon {...p} icon="bug-outline" />}
            right={(p) => <List.Icon {...p} icon="chevron-right" />}
            onPress={() => navigation.navigate('BugReport')}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <View style={styles.themeRow}>
            <SegmentedButtons
              value={themeMode}
              onValueChange={(v) => dispatch(setThemeMode(v as ThemeMode))}
              buttons={[
                { value: 'light', label: 'Light', icon: 'white-balance-sunny' },
                { value: 'dark', label: 'Dark', icon: 'weather-night' },
                { value: 'system', label: 'Auto', icon: 'theme-light-dark' },
              ]}
            />
          </View>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Contact NurixSoft"
            left={(p) => <List.Icon {...p} icon="phone-outline" />}
            onPress={() => navigation.navigate('Contact')}
          />
          <List.Item
            title="App Version"
            description={APP_VERSION}
            left={(p) => <List.Icon {...p} icon="information-outline" />}
          />
        </List.Section>

        {isAuthenticated ? (
          <Button mode="outlined" icon="logout" textColor={theme.colors.error} style={styles.signOut} onPress={onSignOut}>
            Sign Out
          </Button>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },
  headerCard: {
    margin: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  headerBlob: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: radius.full,
    top: -70,
    right: -50,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  headerText: { flex: 1 },
  name: { fontWeight: '800', letterSpacing: -0.3 },
  email: { opacity: 0.8, marginTop: 2 },
  signIn: { marginTop: spacing.lg, borderRadius: radius.md },
  themeRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  signOut: { margin: spacing.lg, borderRadius: radius.md },
});
