import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Surface, Text, useTheme } from 'react-native-paper';
import { radius, shadow, spacing } from '../../theme/tokens';

interface Props {
  value: string;
  label: string;
  icon: string;
}

/** KPI tile with icon chip — used on the Home stats grid. */
export function StatCard({ value, label, icon }: Props) {
  const theme = useTheme();
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryContainer }]}>
        <Icon source={icon} size={20} color={theme.colors.primary} />
      </View>
      <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
      <Text variant="bodySmall" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {label}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
    ...shadow.card,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  value: { fontWeight: '800' },
  label: { marginTop: 2 },
});
