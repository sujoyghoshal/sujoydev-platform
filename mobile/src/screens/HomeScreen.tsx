import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEVELOPER, STATS, TECH_STACK } from '../config/constants';
import { PROJECTS, TESTIMONIALS, BLOG_POSTS } from '../data/portfolio';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleProjectFavorite } from '../app/slices/favoritesSlice';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((s) => s.favorites.projectIds);
  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <Surface style={[styles.hero, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                {DEVELOPER.availableForFreelance ? (
                  <Chip
                    compact
                    icon="circle"
                    style={[styles.availableChip, { backgroundColor: theme.colors.secondaryContainer }]}
                    textStyle={styles.availableText}>
                    Accepting new projects
                  </Chip>
                ) : null}
                <Text variant="headlineMedium" style={[styles.heroName, { color: theme.colors.onPrimaryContainer }]}>
                  {DEVELOPER.name}
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85 }}>
                  {DEVELOPER.title}
                </Text>
                <Text variant="bodyMedium" style={[styles.tagline, { color: theme.colors.onPrimaryContainer }]}>
                  {DEVELOPER.tagline}
                </Text>
              </View>
            </View>
            <View style={styles.heroButtons}>
              <Button
                mode="contained"
                icon="briefcase-plus"
                style={styles.heroButton}
                onPress={() => navigation.navigate('ProjectRequest')}>
                Request a Project
              </Button>
              <Button
                mode="outlined"
                icon="phone"
                style={styles.heroButton}
                textColor={theme.colors.onPrimaryContainer}
                onPress={() => navigation.navigate('Contact')}>
                Contact
              </Button>
            </View>
          </Surface>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.statsRow}>
          {STATS.map((stat) => (
            <Surface key={stat.label} style={styles.statCard} elevation={1}>
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                {stat.value}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                {stat.label}
              </Text>
            </Surface>
          ))}
        </Animated.View>

        {/* About */}
        <SectionHeader title="About NurixSoft" />
        <Card mode="outlined" style={styles.blockCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.aboutText}>
              {DEVELOPER.about}
            </Text>
          </Card.Content>
        </Card>

        {/* Featured projects */}
        <SectionHeader
          title="Featured Projects"
          actionLabel="See all"
          onAction={() => navigation.navigate('Projects')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}>
          {featured.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              compact
              isFavorite={favoriteIds.includes(project.id)}
              onPress={() => navigation.navigate('ProjectDetail', { id: project.id })}
              onToggleFavorite={() => dispatch(toggleProjectFavorite(project.id))}
            />
          ))}
        </ScrollView>

        {/* Tech stack */}
        <SectionHeader title="Technology Stack" />
        <View style={styles.techWrap}>
          {TECH_STACK.map((tech) => (
            <Chip key={tech} compact mode="outlined" style={styles.techChip}>
              {tech}
            </Chip>
          ))}
        </View>

        {/* Testimonials */}
        <SectionHeader title="Testimonials" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} mode="outlined" style={styles.testimonialCard}>
              <Card.Content>
                <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </Text>
                <Text variant="bodyMedium" style={styles.testimonialText}>
                  “{t.comment}”
                </Text>
                <Text variant="bodySmall" style={styles.testimonialAuthor}>
                  — {t.author}, {t.role}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Latest blogs */}
        <SectionHeader
          title="Latest from the Blog"
          actionLabel="Read all"
          onAction={() => navigation.navigate('Blog')}
        />
        {BLOG_POSTS.slice(0, 2).map((post) => (
          <Card
            key={post.id}
            mode="outlined"
            style={styles.blockCard}
            onPress={() => navigation.navigate('BlogDetail', { id: post.id })}>
            <Card.Content>
              <Text variant="titleSmall" style={{ fontWeight: '700' }}>
                {post.title}
              </Text>
              <Text variant="bodySmall" numberOfLines={2} style={styles.aboutText}>
                {post.excerpt}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {/* Bottom CTA */}
        <Surface style={[styles.cta, { backgroundColor: theme.colors.primary }]} elevation={2}>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
            Have a project in mind?
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.9, marginTop: 4 }}>
            Let’s build it together — websites, Android apps and backends.
          </Text>
          <Button
            mode="contained-tonal"
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('ProjectRequest')}>
            Start a Project
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  hero: { margin: 16, borderRadius: 24, padding: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroText: { flex: 1 },
  availableChip: { alignSelf: 'flex-start', marginBottom: 10 },
  availableText: { fontSize: 11 },
  heroName: { fontWeight: '800', marginTop: 2 },
  tagline: { marginTop: 8, opacity: 0.9 },
  heroButtons: { flexDirection: 'row', gap: 10, marginTop: 18 },
  heroButton: { borderRadius: 10 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  statCard: {
    flexGrow: 1,
    flexBasis: '46%',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statLabel: { opacity: 0.7, marginTop: 2 },
  blockCard: { marginHorizontal: 16, marginBottom: 10 },
  aboutText: { opacity: 0.85, lineHeight: 21, marginTop: 4 },
  featuredRow: { paddingHorizontal: 16, paddingBottom: 4 },
  techWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  techChip: { backgroundColor: 'transparent' },
  testimonialCard: { width: 280, marginRight: 12 },
  testimonialText: { marginTop: 8, lineHeight: 20 },
  testimonialAuthor: { marginTop: 10, opacity: 0.7 },
  cta: { margin: 16, marginTop: 28, borderRadius: 20, padding: 20 },
  ctaBtn: { alignSelf: 'flex-start', marginTop: 14, borderRadius: 10 },
});
