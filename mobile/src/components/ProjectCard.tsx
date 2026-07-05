import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';
import { Project } from '../types';

interface Props {
  project: Project;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  compact?: boolean;
}

export function ProjectCard({ project, isFavorite, onPress, onToggleFavorite, compact }: Props) {
  const theme = useTheme();
  return (
    <Card mode="elevated" style={[styles.card, compact && styles.compact]} onPress={onPress}>
      <Card.Cover source={{ uri: project.image }} style={compact ? styles.coverCompact : styles.cover} />
      <Card.Content style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {project.title}
          </Text>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            iconColor={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
            size={20}
            style={styles.favBtn}
            onPress={onToggleFavorite}
          />
        </View>
        <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
          {project.description}
        </Text>
        <View style={styles.chips}>
          <Chip compact mode="flat" style={styles.categoryChip} textStyle={styles.chipText}>
            {project.category}
          </Chip>
          {project.technologies.slice(0, compact ? 2 : 3).map((tech) => (
            <Chip key={tech} compact mode="outlined" style={styles.chip} textStyle={styles.chipText}>
              {tech}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 16 },
  compact: { width: 290, marginHorizontal: 0, marginRight: 12 },
  cover: { height: 165 },
  coverCompact: { height: 140 },
  content: { paddingTop: 10, paddingBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, fontWeight: '700' },
  favBtn: { margin: 0, marginRight: -8 },
  description: { opacity: 0.75, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  categoryChip: {},
  chip: { backgroundColor: 'transparent' },
  chipText: { fontSize: 11, marginVertical: 2 },
});
