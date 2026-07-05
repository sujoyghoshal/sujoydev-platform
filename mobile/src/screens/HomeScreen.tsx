import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Icon, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEVELOPER, STATS, TECH_STACK } from '../config/constants';
import { PROJECTS, TESTIMONIALS, BLOG_POSTS } from '../data/portfolio';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { StatCard } from '../components/ui/StatCard';
import { brand, radius, shadow, spacing } from '../theme/tokens';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleProjectFavorite } from '../app/slices/favoritesSlice';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const STAT_ICONS: Record<string, string> = {
  'Projects Delivered': 'rocket-launch-outline',
  'Happy Clients': 'account-heart-outline',
  'Services Offered': 'view-grid-outline',
  Technologies: 'layers-triple-outline',
};

const TRUST_POINTS = [
  { icon: 'shield-check-outline', label: 'On-time delivery' },
  { icon: 'currency-inr', label: 'Budget-friendly' },
  { icon: 'headset', label: 'Direct support' },
];

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
          <Surface
            style={[styles.hero, { backgroundColor: theme.colors.primaryContainer }]}
            elevation={0}>
            {/* Decorative gradient blobs */}
            <View style={[styles.blob, styles.blobA, { backgroundColor: theme.dark ? brand.heroBlobDarkA : brand.heroBlobA }]} />
            <View style={[styles.blob, styles.blobB, { backgroundColor: theme.dark ? brand.heroBlobDarkB : brand.heroBlobB }]} />

            {DEVELOPER.availableForFreelance ? (
              <Chip
                compact
                icon={() => <Icon source="circle" size={8} color={brand.success} />}
                style={[styles.availableChip, { backgroundColor: theme.colors.surface }]}
                textStyle={styles.availableText}>
                Accepting new projects
              </Chip>
            ) : null}
            <Text
              variant="labelSmall"
              style={[styles.overline, { color: theme.colors.primary }]}>
              FREELANCE SOFTWARE STUDIO
            </Text>
            <Text
              variant="displaySmall"
              style={[styles.heroName, { color: theme.colors.onPrimaryContainer }]}>
              {DEVELOPER.name}
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85, marginTop: 2 }}>
              {DEVELOPER.title}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.tagline, { color: theme.colors.onPrimaryContainer }]}>
              {DEVELOPER.tagline}
            </Text>

            <View style={styles.heroButtons}>
              <Button
                mode="contained"
                icon="briefcase-plus-outline"
                style={styles.heroButton}
                contentStyle={styles.heroButtonContent}
                onPress={() => navigation.navigate('ProjectRequest')}>
                Request a Project
              </Button>
              <Button
                mode="outlined"
                icon="phone-outline"
                style={styles.heroButton}
                contentStyle={styles.heroButtonContent}
                textColor={theme.colors.onPrimaryContainer}
                onPress={() => navigation.navigate('Contact')}>
                Contact
              </Button>
            </View>

            {/* Trust row */}
            <View style={styles.trustRow}>
              {TRUST_POINTS.map((point) => (
                <View key={point.label} style={styles.trustItem}>
                  <Icon source={point.icon} size={15} color={theme.colors.primary} />
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onPrimaryContainer, opacity: 0.85 }}>
                    {point.label}
                  </Text>
                </View>
              ))}
            </View>
          </Surface>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(120 + index * 90).duration(450)}
              style={styles.statCell}>
              <StatCard
                value={stat.value}
                label={stat.label}
                icon={STAT_ICONS[stat.label] ?? 'chart-box-outline'}
              />
            </Animated.View>
          ))}
        </View>

        {/* About */}
        <SectionHeader title="About NurixSoft" subtitle="Who we are and how we work" />
        <Card mode="outlined" style={[styles.blockCard, { borderColor: theme.colors.outline }]}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.aboutText}>
              {DEVELOPER.about}
            </Text>
          </Card.Content>
        </Card>

        {/* Featured projects */}
        <SectionHeader
          title="Featured Projects"
          subtitle="Recent client work"
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
        <SectionHeader title="Technology Stack" subtitle="Tools we ship with" />
        <View style={styles.techWrap}>
          {TECH_STACK.map((tech) => (
            <Chip
              key={tech}
              compact
              style={[styles.techChip, { backgroundColor: theme.colors.surfaceVariant }]}
              textStyle={styles.techChipText}>
              {tech}
            </Chip>
          ))}
        </View>

        {/* Testimonials */}
        <SectionHeader title="Testimonials" subtitle="What clients say" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}>
          {TESTIMONIALS.map((t) => (
            <Surface
              key={t.id}
              style={[styles.testimonialCard, { backgroundColor: theme.colors.surface }]}
              elevation={0}>
              <Icon source="format-quote-open" size={26} color={theme.colors.primary} />
              <Text variant="bodySmall" style={{ color: brand.warning, marginTop: 2 }}>
                {'★'.repeat(t.rating)}
                {'☆'.repeat(5 - t.rating)}
              </Text>
              <Text variant="bodyMedium" style={styles.testimonialText}>
                “{t.comment}”
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.testimonialAuthor, { color: theme.colors.onSurfaceVariant }]}>
                — {t.author}, {t.role}
              </Text>
            </Surface>
          ))}
        </ScrollView>

        {/* Latest blogs */}
        <SectionHeader
          title="Latest from the Blog"
          subtitle="Guides and insights"
          actionLabel="Read all"
          onAction={() => navigation.navigate('Blog')}
        />
        {BLOG_POSTS.slice(0, 2).map((post) => (
          <Card
            key={post.id}
            mode="outlined"
            style={[styles.blockCard, { borderColor: theme.colors.outline }]}
            onPress={() => navigation.navigate('BlogDetail', { id: post.id })}>
            <Card.Content style={styles.blogRow}>
              <View style={[styles.blogIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon source="post-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.blogText}>
                <Text variant="titleSmall" style={{ fontWeight: '700' }}>
                  {post.title}
                </Text>
                <Text variant="bodySmall" numberOfLines={2} style={styles.aboutText}>
                  {post.excerpt}
                </Text>
              </View>
              <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
            </Card.Content>
          </Card>
        ))}

        {/* Bottom CTA */}
        <Surface style={[styles.cta, { backgroundColor: theme.colors.primary }]} elevation={0}>
          <View style={[styles.blob, styles.ctaBlob, { backgroundColor: 'rgba(255,255,255,0.10)' }]} />
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimary, fontWeight: '800' }}>
            Have a project in mind?
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.9, marginTop: 4 }}>
            Let’s build it together — websites, Android apps and backends.
          </Text>
          <Button
            mode="contained-tonal"
            icon="arrow-right"
            contentStyle={styles.ctaBtnContent}
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
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    margin: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  blob: { position: 'absolute', borderRadius: radius.full },
  blobA: { width: 220, height: 220, top: -90, right: -70 },
  blobB: { width: 160, height: 160, bottom: -70, left: -50 },
  availableChip: { alignSelf: 'flex-start', marginBottom: spacing.md },
  availableText: { fontSize: 11, fontWeight: '600' },
  overline: { letterSpacing: 2, fontWeight: '800' },
  heroName: { fontWeight: '800', marginTop: 2, letterSpacing: -0.5 },
  tagline: { marginTop: spacing.sm, opacity: 0.9, lineHeight: 21 },
  heroButtons: { flexDirection: 'row', gap: spacing.sm + 2, marginTop: spacing.xl },
  heroButton: { borderRadius: radius.md },
  heroButtonContent: { paddingVertical: 2 },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statCell: { flexGrow: 1, flexBasis: '46%' },
  blockCard: { marginHorizontal: spacing.lg, marginBottom: spacing.sm + 2, borderRadius: radius.lg },
  aboutText: { opacity: 0.85, lineHeight: 22, marginTop: 4 },
  featuredRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xs },
  techWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  techChip: { borderRadius: radius.sm },
  techChipText: { fontSize: 12 },
  testimonialCard: {
    width: 280,
    marginRight: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  testimonialText: { marginTop: spacing.sm, lineHeight: 21 },
  testimonialAuthor: { marginTop: spacing.md },
  blogRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  blogIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blogText: { flex: 1 },
  cta: {
    margin: spacing.lg,
    marginTop: spacing.xxl,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  ctaBlob: { width: 190, height: 190, top: -80, right: -60 },
  ctaBtn: { alignSelf: 'flex-start', marginTop: spacing.lg, borderRadius: radius.md },
  ctaBtnContent: { flexDirection: 'row-reverse', paddingVertical: 2 },
});
