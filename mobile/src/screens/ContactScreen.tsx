import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { DEVELOPER } from '../config/constants';
import { brand, radius, shadow, spacing } from '../theme/tokens';

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
      <Animated.View entering={FadeInUp.duration(450)}>
        <Surface style={[styles.banner, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <View style={[styles.blob, { backgroundColor: theme.dark ? brand.heroBlobDarkA : brand.heroBlobA }]} />
          <Text variant="labelSmall" style={[styles.overline, { color: theme.colors.primary }]}>
            GET IN TOUCH
          </Text>
          <Text variant="headlineSmall" style={[styles.bannerTitle, { color: theme.colors.onPrimaryContainer }]}>
            Let’s talk about your project
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85, marginTop: 6, lineHeight: 21 }}>
            We usually reply within a few hours. Choose whichever channel works best for you.
          </Text>
        </Surface>
      </Animated.View>

      {ACTIONS.map((action, index) => (
        <Animated.View key={action.title} entering={FadeInDown.delay(100 + index * 80).duration(400)}>
          <Surface style={[styles.item, { backgroundColor: theme.colors.surface }]} elevation={0}>
            <TouchableRipple
              borderless
              style={styles.itemRipple}
              onPress={() => Linking.openURL(action.url)}
              accessibilityLabel={action.title}>
              <View style={styles.itemRow}>
                <View style={[styles.iconTile, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Icon source={action.icon} size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.itemText}>
                  <Text variant="titleSmall" style={styles.itemTitle}>
                    {action.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {action.description}
                  </Text>
                </View>
                <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
              </View>
            </TouchableRipple>
          </Surface>
        </Animated.View>
      ))}

      <View style={styles.hoursRow}>
        <Icon source="clock-outline" size={14} color={theme.colors.onSurfaceVariant} />
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Available Mon–Sat · 10:00 – 20:00 IST
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: radius.full,
    top: -70,
    right: -50,
  },
  overline: { letterSpacing: 2, fontWeight: '800' },
  bannerTitle: { fontWeight: '800', marginTop: 4, letterSpacing: -0.3 },
  item: {
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  itemRipple: { borderRadius: radius.lg },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: { flex: 1 },
  itemTitle: { fontWeight: '800' },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
});
