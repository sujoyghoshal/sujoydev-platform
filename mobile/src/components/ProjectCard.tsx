import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';
import { radius, shadow, spacing } from '../theme/tokens';
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
    <Card
      mode="elevated"
      style={[styles.card, compact && styles.compact]}
      onPress={onPress}>
      <View style={styles.coverWrap}>
        <Card.Cover
          source={{ uri: project.image }}
          style={[compact ? styles.coverCompact : styles.cover, styles.coverRadius]}
        />
        <Chip
          compact
          style={[styles.categoryBadge, { backgroundColor: theme.colors.surface }]}
          textStyle={styles.badgeText}>
          {project.category}
        </Chip>
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          iconColor={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
          size={18}
          style={[styles.favBtn, { backgroundColor: theme.colors.surface }]}
          onPress={onToggleFavorite}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        />
      </View>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
          {project.title}
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
          {project.description}
        </Text>
        <View style={styles.chips}>
          {project.technologies.slice(0, compact ? 2 : 3).map((tech) => (
            <Chip
              key={tech}
              compact
              style={[styles.chip, { backgroundColor: theme.colors.surfaceVariant }]}
              textStyle={styles.chipText}>
              {tech}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  compact: { width: 290, marginHorizontal: 0, marginRight: spacing.md },
  coverWrap: { position: 'relative' },
  coverRadius: { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  cover: { height: 165 },
  coverCompact: { height: 140 },
  categoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, fontWeight: '700', marginVertical: 1 },
  favBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    margin: 0,
    width: 34,
    height: 34,
  },
  content: { paddingTop: spacing.md, paddingBottom: spacing.lg },
  title: { fontWeight: '800', letterSpacing: -0.2 },
  description: { opacity: 0.75, marginTop: 2, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  chip: { borderRadius: radius.sm },
  chipText: { fontSize: 11, marginVertical: 2 },
});
