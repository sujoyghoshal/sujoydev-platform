import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Button mode="text" compact onPress={onAction}>
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
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  titles: { flex: 1, marginRight: 8 },
  title: { fontWeight: '700' },
  subtitle: { opacity: 0.7, marginTop: 2 },
});
