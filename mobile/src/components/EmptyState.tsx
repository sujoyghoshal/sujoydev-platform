import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';

interface Props {
  icon: string;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={72}
        icon={icon}
        style={{ backgroundColor: theme.colors.surfaceVariant }}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  title: { fontWeight: '700', marginTop: 16 },
  message: { opacity: 0.7, textAlign: 'center', marginTop: 6 },
});
