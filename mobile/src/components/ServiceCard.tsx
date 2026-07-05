import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import { Service } from '../types';

interface Props {
  service: Service;
  onHire: () => void;
}

export function ServiceCard({ service, onHire }: Props) {
  const theme = useTheme();
  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <Avatar.Icon
            size={44}
            icon={service.icon}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.title}>
              {service.title}
            </Text>
            <Text variant="bodySmall" style={styles.meta}>
              From ₹{service.priceFrom.toLocaleString('en-IN')} · {service.deliveryDays} days delivery
            </Text>
          </View>
        </View>
        <Text variant="bodySmall" style={styles.description}>
          {service.description}
        </Text>
        <View style={styles.deliverables}>
          {service.deliverables.map((item) => (
            <Text key={item} variant="bodySmall" style={styles.deliverable}>
              ✓ {item}
            </Text>
          ))}
        </View>
        <Button mode="contained" style={styles.button} onPress={onHire}>
          Request
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 16 },
  content: { paddingVertical: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerText: { flex: 1 },
  title: { fontWeight: '700' },
  meta: { opacity: 0.7, marginTop: 2 },
  description: { marginTop: 12, opacity: 0.85 },
  deliverables: { marginTop: 10, gap: 3 },
  deliverable: { opacity: 0.7 },
  button: { marginTop: 14, borderRadius: 10 },
});
