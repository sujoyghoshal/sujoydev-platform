import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { radius, shadow, spacing } from '../theme/tokens';
import { Service } from '../types';

interface Props {
  service: Service;
  onHire: () => void;
}

export function ServiceCard({ service, onHire }: Props) {
  const theme = useTheme();
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
      <View style={styles.headerRow}>
        <View style={[styles.iconTile, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon source={service.icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text variant="titleMedium" style={styles.title}>
            {service.title}
          </Text>
          <View style={styles.metaRow}>
            <Text variant="titleSmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>
              ₹{service.priceFrom.toLocaleString('en-IN')}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {'  '}from · {service.deliveryDays} days
            </Text>
          </View>
        </View>
      </View>
      <Text variant="bodySmall" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        {service.description}
      </Text>
      <View style={styles.deliverables}>
        {service.deliverables.map((item) => (
          <View key={item} style={styles.deliverableRow}>
            <Icon source="check-circle" size={15} color={theme.colors.secondary} />
            <Text variant="bodySmall" style={[styles.deliverable, { color: theme.colors.onSurfaceVariant }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
      <Button
        mode="contained"
        icon="arrow-right"
        contentStyle={styles.buttonContent}
        style={styles.button}
        onPress={onHire}>
        Request this service
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: { fontWeight: '800', letterSpacing: -0.2 },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  description: { marginTop: spacing.md, lineHeight: 19 },
  deliverables: { marginTop: spacing.md, gap: 6 },
  deliverableRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliverable: { flex: 1 },
  button: { marginTop: spacing.lg, borderRadius: radius.md },
  buttonContent: { flexDirection: 'row-reverse', paddingVertical: 2 },
});
