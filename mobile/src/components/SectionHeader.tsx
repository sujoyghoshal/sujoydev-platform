import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { radius, spacing } from '../theme/tokens';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.accent, { backgroundColor: theme.colors.primary }]} />
      <View style={styles.titles}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Button mode="text" compact onPress={onAction} icon="arrow-right" contentStyle={styles.actionContent}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  accent: {
    width: 4,
    height: 22,
    borderRadius: radius.full,
    marginRight: 10,
  },
  titles: { flex: 1, marginRight: spacing.sm },
  title: { fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { marginTop: 2 },
  actionContent: { flexDirection: 'row-reverse' },
});
