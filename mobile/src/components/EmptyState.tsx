import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radius, spacing } from '../theme/tokens';

interface Props {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.container}>
      <View style={[styles.iconTile, { backgroundColor: theme.colors.primaryContainer }]}>
        <Icon source={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button mode="contained" style={styles.action} onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: spacing.xxl },
  iconTile: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '800', marginTop: spacing.xl },
  message: { textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
  action: { marginTop: spacing.xl, borderRadius: radius.md },
});
