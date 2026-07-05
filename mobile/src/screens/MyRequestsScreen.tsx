import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { EmptyState } from '../components/EmptyState';
import type { RequestStatus } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#D97706',
  'In Review': '#2563EB',
  Accepted: '#059669',
  'In Progress': '#7C3AED',
  Completed: '#059669',
  Rejected: '#DC2626',
  Open: '#D97706',
  Fixed: '#059669',
  Closed: '#64748B',
};

function StatusChip({ status }: { status: RequestStatus | string }) {
  return (
    <Chip compact mode="flat" textStyle={{ color: '#fff', fontSize: 11 }} style={{ backgroundColor: STATUS_COLORS[status] ?? '#64748B' }}>
      {status}
    </Chip>
  );
}

export function MyRequestsScreen() {
  const theme = useTheme();
  const { requests, bugs } = useAppSelector((s) => s.submissions);

  if (requests.length === 0 && bugs.length === 0) {
    return (
      <EmptyState
        icon="ticket-outline"
        title="No tickets yet"
        message="Project requests and bug reports you submit will appear here with live status."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {requests.length > 0 ? (
        <Text variant="titleMedium" style={styles.section}>
          Project Requests
        </Text>
      ) : null}
      {requests.map((r) => (
        <Card key={r.id} mode="outlined" style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <Text variant="titleSmall" style={styles.ticket}>
                {r.ticket}
              </Text>
              <StatusChip status={r.status} />
            </View>
            <Text variant="bodyMedium" style={styles.title}>
              {r.projectType} · {r.priority} priority
            </Text>
            <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
              {r.description}
            </Text>
            <Text variant="bodySmall" style={styles.meta}>
              {new Date(r.createdAt).toLocaleString('en-IN')}
              {r.synced ? '' : ' · queued (will sync when online)'}
            </Text>
          </Card.Content>
        </Card>
      ))}

      {bugs.length > 0 ? (
        <Text variant="titleMedium" style={styles.section}>
          Bug Reports
        </Text>
      ) : null}
      {bugs.map((b) => (
        <Card key={b.id} mode="outlined" style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <Text variant="titleSmall" style={styles.ticket}>
                {b.ticket}
              </Text>
              <StatusChip status={b.status} />
            </View>
            <Text variant="bodyMedium" style={styles.title}>
              {b.title}
            </Text>
            <Text variant="bodySmall" style={styles.meta}>
              {b.deviceInfo} · v{b.appVersion} · {new Date(b.createdAt).toLocaleDateString('en-IN')}
              {b.synced ? '' : ' · queued'}
            </Text>
          </Card.Content>
        </Card>
      ))}
      <Text variant="bodySmall" style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>
        Status updates arrive automatically once the request is reviewed.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  section: { fontWeight: '800', marginBottom: 12, marginTop: 8 },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticket: { fontWeight: '700', letterSpacing: 0.5 },
  title: { marginTop: 8, fontWeight: '600' },
  description: { opacity: 0.7, marginTop: 4 },
  meta: { opacity: 0.55, marginTop: 8 },
  footer: { textAlign: 'center', marginTop: 12 },
});
