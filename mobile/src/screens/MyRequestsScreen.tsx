import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Icon, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppSelector } from '../app/hooks';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { radius, shadow, spacing } from '../theme/tokens';

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
      {requests.map((r, index) => (
        <Animated.View key={r.id} entering={FadeInDown.delay(index * 70).duration(400)}>
          <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
            <View style={styles.row}>
              <View style={styles.ticketRow}>
                <Icon source="pound" size={14} color={theme.colors.primary} />
                <Text variant="titleSmall" style={[styles.ticket, { color: theme.colors.primary }]}>
                  {r.ticket}
                </Text>
              </View>
              <StatusBadge status={r.status} />
            </View>
            <Text variant="titleSmall" style={styles.title}>
              {r.projectType} · {r.priority} priority
            </Text>
            <Text
              variant="bodySmall"
              numberOfLines={2}
              style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {r.description}
            </Text>
            <View style={styles.metaRow}>
              <Icon source="calendar-clock-outline" size={13} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(r.createdAt).toLocaleString('en-IN')}
              </Text>
              {!r.synced ? (
                <>
                  <Icon source="cloud-upload-outline" size={13} color={theme.colors.tertiary} />
                  <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                    queued — will sync when online
                  </Text>
                </>
              ) : null}
            </View>
          </Surface>
        </Animated.View>
      ))}

      {bugs.length > 0 ? (
        <Text variant="titleMedium" style={styles.section}>
          Bug Reports
        </Text>
      ) : null}
      {bugs.map((b, index) => (
        <Animated.View key={b.id} entering={FadeInDown.delay(index * 70).duration(400)}>
          <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={0}>
            <View style={styles.row}>
              <View style={styles.ticketRow}>
                <Icon source="pound" size={14} color={theme.colors.primary} />
                <Text variant="titleSmall" style={[styles.ticket, { color: theme.colors.primary }]}>
                  {b.ticket}
                </Text>
              </View>
              <StatusBadge status={b.status} />
            </View>
            <Text variant="titleSmall" style={styles.title}>
              {b.title}
            </Text>
            <View style={styles.metaRow}>
              <Icon source="cellphone" size={13} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {b.deviceInfo} · v{b.appVersion} · {new Date(b.createdAt).toLocaleDateString('en-IN')}
              </Text>
              {!b.synced ? (
                <>
                  <Icon source="cloud-upload-outline" size={13} color={theme.colors.tertiary} />
                  <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                    queued
                  </Text>
                </>
              ) : null}
            </View>
          </Surface>
        </Animated.View>
      ))}

      <View style={[styles.infoBanner, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon source="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
        <Text variant="bodySmall" style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>
          Status updates arrive automatically once the request is reviewed.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  section: { fontWeight: '800', marginBottom: spacing.md, marginTop: spacing.sm },
  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ticket: { fontWeight: '800', letterSpacing: 0.4 },
  title: { marginTop: spacing.sm + 2, fontWeight: '700' },
  description: { marginTop: spacing.xs, lineHeight: 19 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: spacing.sm + 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  footer: { flex: 1, lineHeight: 18 },
});
