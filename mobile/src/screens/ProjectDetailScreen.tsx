import React from 'react';
import { Image, Linking, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { PROJECTS } from '../data/portfolio';
import { EmptyState } from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleProjectFavorite } from '../app/slices/favoritesSlice';
import type { RootScreenProps } from '../navigation/types';

export function ProjectDetailScreen({ route, navigation }: RootScreenProps<'ProjectDetail'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((s) => s.favorites.projectIds);
  const project = PROJECTS.find((p) => p.id === route.params.id);

  if (!project) {
    return (
      <EmptyState icon="alert-circle-outline" title="Project not found" message="This project is no longer available." />
    );
  }

  const isFavorite = favoriteIds.includes(project.id);

  const onShare = () => {
    void Share.share({
      message: `${project.title} — ${project.description}\n${project.liveUrl ?? project.githubUrl ?? ''}`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: project.image }} style={styles.cover} resizeMode="cover" />
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text variant="headlineSmall" style={styles.title}>
            {project.title}
          </Text>
          <Text variant="bodySmall" style={styles.meta}>
            {project.category} · {project.year}
          </Text>
        </View>
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          iconColor={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
          onPress={() => dispatch(toggleProjectFavorite(project.id))}
        />
        <IconButton icon="share-variant" onPress={onShare} />
      </View>

      <Text variant="bodyMedium" style={styles.body}>
        {project.longDescription}
      </Text>

      <Text variant="titleSmall" style={styles.sectionTitle}>
        Technologies
      </Text>
      <View style={styles.chips}>
        {project.technologies.map((tech) => (
          <Chip key={tech} compact mode="outlined" style={styles.chip}>
            {tech}
          </Chip>
        ))}
      </View>

      {project.screenshots.length > 0 ? (
        <>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Screenshots
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shots}>
            {project.screenshots.map((shot) => (
              <Image key={shot} source={{ uri: shot }} style={styles.shot} resizeMode="cover" />
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.links}>
        {project.githubUrl ? (
          <Button mode="outlined" icon="github" style={styles.linkBtn} onPress={() => Linking.openURL(project.githubUrl!)}>
            GitHub
          </Button>
        ) : null}
        {project.liveUrl ? (
          <Button mode="outlined" icon="web" style={styles.linkBtn} onPress={() => Linking.openURL(project.liveUrl!)}>
            Live Demo
          </Button>
        ) : null}
        {project.playStoreUrl ? (
          <Button mode="outlined" icon="google-play" style={styles.linkBtn} onPress={() => Linking.openURL(project.playStoreUrl!)}>
            Play Store
          </Button>
        ) : null}
      </View>

      {project.clientReview ? (
        <>
          <Divider style={styles.divider} />
          <Card mode="outlined" style={styles.reviewCard}>
            <Card.Content>
              <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                {'★'.repeat(project.clientReview.rating)}
                {'☆'.repeat(5 - project.clientReview.rating)}
              </Text>
              <Text variant="bodyMedium" style={styles.reviewText}>
                “{project.clientReview.comment}”
              </Text>
              <Text variant="bodySmall" style={styles.reviewAuthor}>
                — {project.clientReview.author}
              </Text>
            </Card.Content>
          </Card>
        </>
      ) : null}

      <Button
        mode="contained"
        icon="briefcase-plus"
        style={styles.hireBtn}
        onPress={() => navigation.navigate('ProjectRequest', { serviceTitle: `Project like "${project.title}"` })}>
        Build Something Like This
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  cover: { width: '100%', height: 210 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  titleWrap: { flex: 1 },
  title: { fontWeight: '800' },
  meta: { opacity: 0.6, marginTop: 2 },
  body: { paddingHorizontal: 16, marginTop: 8, lineHeight: 22, opacity: 0.9 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 22, marginBottom: 10, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  chip: { backgroundColor: 'transparent' },
  shots: { paddingHorizontal: 16, gap: 10 },
  shot: { width: 150, height: 300, borderRadius: 12 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginTop: 24 },
  linkBtn: { borderRadius: 10 },
  divider: { marginVertical: 20, marginHorizontal: 16 },
  reviewCard: { marginHorizontal: 16 },
  reviewText: { marginTop: 8, lineHeight: 20 },
  reviewAuthor: { marginTop: 8, opacity: 0.7 },
  hireBtn: { margin: 16, marginTop: 28, borderRadius: 10 },
});
