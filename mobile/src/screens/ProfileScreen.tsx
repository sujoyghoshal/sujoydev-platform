import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, List, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { signedOut } from '../app/slices/authSlice';
import { setThemeMode, ThemeMode } from '../app/slices/themeSlice';
import { signOutGoogle } from '../services/googleAuth';
import { DEVELOPER, APP_VERSION } from '../config/constants';
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
        <View style={styles.header}>
          {user?.photoUrl ? (
            <Avatar.Image size={72} source={{ uri: user.photoUrl }} />
          ) : (
            <Avatar.Icon size={72} icon="account" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
          )}
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={styles.name}>
              {isAuthenticated ? user?.name : 'Welcome'}
            </Text>
            <Text variant="bodySmall" style={styles.email}>
              {isAuthenticated ? user?.email : 'Sign in to submit requests and track tickets'}
            </Text>
          </View>
        </View>

        {!isAuthenticated ? (
          <Button mode="contained" icon="login" style={styles.signIn} onPress={() => navigation.navigate('Login')}>
            Sign In
          </Button>
        ) : null}

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
            description="Something not working? Tell me."
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
            title="Contact Developer"
            left={(p) => <List.Icon {...p} icon="phone-outline" />}
            onPress={() => navigation.navigate('Contact')}
          />
          <List.Item
            title="Download Resume"
            left={(p) => <List.Icon {...p} icon="file-download-outline" />}
            onPress={() => Linking.openURL(DEVELOPER.resumeUrl)}
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20 },
  headerText: { flex: 1 },
  name: { fontWeight: '800' },
  email: { opacity: 0.65, marginTop: 2 },
  signIn: { marginHorizontal: 16, marginBottom: 8, borderRadius: 10 },
  themeRow: { paddingHorizontal: 16, paddingBottom: 12 },
  signOut: { margin: 16, borderRadius: 10 },
});
