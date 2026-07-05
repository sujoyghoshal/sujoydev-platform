import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, IconButton, Text, useTheme } from 'react-native-paper';
import { radius, spacing } from '../theme/tokens';
import { BlogPost } from '../types';

interface Props {
  post: BlogPost;
  bookmarked: boolean;
  onPress: () => void;
  onToggleBookmark: () => void;
}

export function BlogCard({ post, bookmarked, onPress, onToggleBookmark }: Props) {
  const theme = useTheme();
  return (
    <Card
      mode="outlined"
      style={[styles.card, { borderColor: theme.colors.outline }]}
      onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.topRow}>
          <Chip
            compact
            style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={[styles.chipText, { color: theme.colors.onPrimaryContainer }]}>
            {post.category}
          </Chip>
          <IconButton
            icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
            iconColor={bookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
            size={20}
            style={styles.bookmark}
            onPress={onToggleBookmark}
            accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          />
        </View>
        <Text variant="titleMedium" style={styles.title}>
          {post.title}
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={[styles.excerpt, { color: theme.colors.onSurfaceVariant }]}>
          {post.excerpt}
        </Text>
        <View style={styles.metaRow}>
          <Icon source="calendar-blank-outline" size={13} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodySmall" style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          <Icon source="clock-outline" size={13} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodySmall" style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
            {post.readMinutes} min read
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  content: { paddingVertical: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { borderRadius: radius.full },
  chipText: { fontSize: 11, fontWeight: '700', marginVertical: 1 },
  bookmark: { margin: 0, marginRight: -spacing.sm },
  title: { fontWeight: '800', marginTop: spacing.sm, letterSpacing: -0.2 },
  excerpt: { marginTop: spacing.xs, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm + 2 },
  meta: { marginRight: spacing.sm },
});
