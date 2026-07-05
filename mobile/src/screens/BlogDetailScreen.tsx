import React from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { Chip, IconButton, Text, useTheme } from 'react-native-paper';
import { BLOG_POSTS } from '../data/portfolio';
import { EmptyState } from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleBlogBookmark } from '../app/slices/favoritesSlice';
import type { RootScreenProps } from '../navigation/types';

export function BlogDetailScreen({ route }: RootScreenProps<'BlogDetail'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((s) => s.favorites.blogIds);
  const post = BLOG_POSTS.find((p) => p.id === route.params.id);

  if (!post) {
    return <EmptyState icon="alert-circle-outline" title="Article not found" message="This article is no longer available." />;
  }

  const bookmarked = bookmarks.includes(post.id);

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <Chip compact mode="flat">
          {post.category}
        </Chip>
        <View style={styles.actions}>
          <IconButton
            icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
            iconColor={bookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
            onPress={() => dispatch(toggleBlogBookmark(post.id))}
          />
          <IconButton
            icon="share-variant"
            onPress={() => void Share.share({ message: `${post.title}\n\n${post.excerpt}` })}
          />
        </View>
      </View>
      <Text variant="headlineSmall" style={styles.title}>
        {post.title}
      </Text>
      <Text variant="bodySmall" style={styles.meta}>
        {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
        {post.readMinutes} min read
      </Text>
      <Text variant="bodyMedium" style={styles.body}>
        {post.content}
      </Text>
      <View style={styles.tags}>
        {post.tags.map((tag) => (
          <Chip key={tag} compact mode="outlined" style={styles.tag}>
            #{tag}
          </Chip>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row' },
  title: { fontWeight: '800', marginTop: 10 },
  meta: { opacity: 0.6, marginTop: 6 },
  body: { marginTop: 18, lineHeight: 24, opacity: 0.9 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24 },
  tag: { backgroundColor: 'transparent' },
});
