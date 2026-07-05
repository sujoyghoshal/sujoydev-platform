import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PROJECTS } from '../data/portfolio';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState } from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleProjectFavorite } from '../app/slices/favoritesSlice';
import type { RootStackParamList } from '../navigation/types';

const CATEGORIES = ['All', 'Android', 'Website', 'Backend', 'Full Stack'] as const;

export function ProjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((s) => s.favorites.projectIds);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Searchbar
        placeholder="Search projects or technologies"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            compact
            selected={category === c}
            mode={category === c ? 'flat' : 'outlined'}
            onPress={() => setCategory(c)}
            style={styles.chip}>
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
          <ProjectCard
            project={item}
            isFavorite={favoriteIds.includes(item.id)}
            onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}
            onToggleFavorite={() => dispatch(toggleProjectFavorite(item.id))}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="magnify-close"
            title="No projects found"
            message="Try a different search term or category."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  search: { marginHorizontal: 16, marginTop: 8 },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {},
  list: { paddingBottom: 24 },
});
