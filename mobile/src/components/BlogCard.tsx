import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';
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
    <Card mode="outlined" style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.topRow}>
          <Chip compact mode="flat" textStyle={styles.chipText}>
            {post.category}
          </Chip>
          <IconButton
            icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
            iconColor={bookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
            size={20}
            style={styles.bookmark}
            onPress={onToggleBookmark}
          />
        </View>
        <Text variant="titleMedium" style={styles.title}>
          {post.title}
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={styles.excerpt}>
          {post.excerpt}
        </Text>
        <Text variant="bodySmall" style={styles.meta}>
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · {post.readMinutes} min read
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 12 },
  content: { paddingVertical: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chipText: { fontSize: 11, marginVertical: 2 },
  bookmark: { margin: 0, marginRight: -8 },
  title: { fontWeight: '700', marginTop: 8 },
  excerpt: { opacity: 0.75, marginTop: 4 },
  meta: { opacity: 0.55, marginTop: 8 },
});
