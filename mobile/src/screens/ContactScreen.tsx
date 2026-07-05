import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';
import { DEVELOPER } from '../config/constants';

interface ContactAction {
  icon: string;
  title: string;
  description: string;
  url: string;
}

const ACTIONS: ContactAction[] = [
  { icon: 'phone', title: 'Call', description: DEVELOPER.phoneDisplay, url: `tel:${DEVELOPER.phone}` },
  { icon: 'whatsapp', title: 'WhatsApp', description: 'Chat on WhatsApp', url: DEVELOPER.whatsapp },
  { icon: 'email', title: 'Email', description: DEVELOPER.email, url: `mailto:${DEVELOPER.email}` },
  { icon: 'web', title: 'Portfolio', description: 'nurixsoft.vercel.app', url: DEVELOPER.portfolio },
];

export function ContactScreen() {
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Surface style={[styles.banner, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <View style={styles.bannerRow}>
          <View style={styles.bannerText}>
            <Text variant="titleLarge" style={[styles.bannerTitle, { color: theme.colors.onPrimaryContainer }]}>
              Let’s talk about your project
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85, marginTop: 6 }}>
              We usually reply within a few hours. Choose whichever channel works best for you.
            </Text>
          </View>
        </View>
      </Surface>

      {ACTIONS.map((action) => (
        <List.Item
          key={action.title}
          title={action.title}
          description={action.description}
          left={(props) => <List.Icon {...props} icon={action.icon} color={theme.colors.primary} />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Linking.openURL(action.url)}
          style={styles.item}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  banner: { margin: 16, borderRadius: 20, padding: 20 },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bannerText: { flex: 1 },
  bannerTitle: { fontWeight: '800' },
  item: { paddingHorizontal: 8 },
});
