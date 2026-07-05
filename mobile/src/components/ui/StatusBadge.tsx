import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { radius, statusColors } from '../../theme/tokens';

interface Props {
  status: string;
}

/** Colored pill with icon for ticket / request statuses. */
export function StatusBadge({ status }: Props) {
  const c = statusColors[status] ?? { bg: '#E2E8F0', fg: '#334155', icon: 'information-outline' };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Icon source={c.icon} size={13} color={c.fg} />
      <Text variant="labelSmall" style={[styles.text, { color: c.fg }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: { fontWeight: '700' },
});
