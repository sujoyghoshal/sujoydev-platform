import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BLOG_POSTS } from '../data/portfolio';
import { BlogCard } from '../components/BlogCard';
import { EmptyState } from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleBlogBookmark } from '../app/slices/favoritesSlice';
import type { RootStackParamList } from '../navigation/types';

export function BlogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((s) => s.favorites.blogIds);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOG_POSTS.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Searchbar placeholder="Search articles" value={query} onChangeText={setQuery} style={styles.search} />
      <View style={styles.chipRow}>
        {categories.map((c) => (
          <Chip
            key={c}
            compact
            selected={category === c}
            mode={category === c ? 'flat' : 'outlined'}
            onPress={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BlogCard
            post={item}
            bookmarked={bookmarks.includes(item.id)}
            onPress={() => navigation.navigate('BlogDetail', { id: item.id })}
            onToggleBookmark={() => dispatch(toggleBlogBookmark(item.id))}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon="text-box-search-outline" title="No articles found" message="Try a different search or category." />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  search: { marginHorizontal: 16, marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  list: { paddingBottom: 24 },
});
