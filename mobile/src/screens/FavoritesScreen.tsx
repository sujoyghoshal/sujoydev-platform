import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PROJECTS, BLOG_POSTS } from '../data/portfolio';
import { ProjectCard } from '../components/ProjectCard';
import { BlogCard } from '../components/BlogCard';
import { EmptyState } from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleProjectFavorite, toggleBlogBookmark } from '../app/slices/favoritesSlice';
import type { RootStackParamList } from '../navigation/types';

export function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { projectIds, blogIds } = useAppSelector((s) => s.favorites);

  const favoriteProjects = PROJECTS.filter((p) => projectIds.includes(p.id));
  const bookmarkedPosts = BLOG_POSTS.filter((b) => blogIds.includes(b.id));

  if (favoriteProjects.length === 0 && bookmarkedPosts.length === 0) {
    return (
      <EmptyState
        icon="heart-outline"
        title="Nothing saved yet"
        message="Tap the heart on any project or the bookmark on any article to save it here."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {favoriteProjects.length > 0 ? (
        <Text variant="titleMedium" style={styles.section}>
          Saved Projects
        </Text>
      ) : null}
      {favoriteProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isFavorite
          onPress={() => navigation.navigate('ProjectDetail', { id: project.id })}
          onToggleFavorite={() => dispatch(toggleProjectFavorite(project.id))}
        />
      ))}
      {bookmarkedPosts.length > 0 ? (
        <Text variant="titleMedium" style={styles.section}>
          Bookmarked Articles
        </Text>
      ) : null}
      {bookmarkedPosts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          bookmarked
          onPress={() => navigation.navigate('BlogDetail', { id: post.id })}
          onToggleBookmark={() => dispatch(toggleBlogBookmark(post.id))}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 16, paddingBottom: 40 },
  section: { fontWeight: '800', marginBottom: 12, paddingHorizontal: 16 },
});
