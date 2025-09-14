import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import WellnessScore from '@/components/ui/WellnessScore';

export default function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const quickActions = [
    { 
      icon: 'chat-outline', 
      label: 'Log Symptom', 
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/chat');
      },
      color: theme.colors.primary 
    },
    { 
      icon: 'camera-outline', 
      label: 'Scan Rx', 
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/camera-scanner');
      },
      color: theme.colors.secondary 
    },
    { 
      icon: 'pill', 
      label: 'Add Med', 
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/meds');
      },
      color: theme.colors.warning 
    },
  ];

  const metrics = [
    { label: 'Steps', value: '6,420', trend: '+12%', color: theme.colors.success },
    { label: 'Sleep', value: '6h 40m', trend: '-20m', color: theme.colors.primary },
    { label: 'HR', value: '74 bpm', trend: 'Normal', color: theme.colors.secondary },
  ];

  const handleStartBreak = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Simulate starting break timer
    router.push('/wellness');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={[styles.welcomeText, { color: theme.colors.textPrimary }]}>
              Hi, Dhanesh 👋
            </Text>
            <Text style={[styles.subtitleText, { color: theme.colors.textSecondary }]}>
              Here's your wellness status
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.avatar}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              console.log('Opening profile');
            }}
          >
            <LinearGradient
              colors={theme.colors.gradientPrimary}
              style={styles.avatarGradient}
            >
              <MaterialCommunityIcons 
                name="account" 
                size={24} 
                color={theme.colors.textPrimary} 
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Wellness Score Card */}
        <GlassCard style={styles.scoreCard} glow variant="primary">
          <WellnessScore score={78} />
          <Text style={[styles.trendText, { color: theme.colors.success }]}>
            +6 this week
          </Text>
        </GlassCard>

        {/* AI Tip Card */}
        <GlassCard style={styles.tipCard}>
          <LinearGradient
            colors={[theme.colors.primary + '20', 'transparent']}
            style={styles.tipGradient}
          >
            <MaterialCommunityIcons 
              name="robot-outline" 
              size={24} 
              color={theme.colors.primary} 
            />
          </LinearGradient>
          <Text style={[styles.tipTitle, { color: theme.colors.textPrimary }]}>
            AI Buddy
          </Text>
          <Text style={[styles.tipContent, { color: theme.colors.textSecondary }]}>
            Long screen time today. Ready for a 5-minute eye break?
          </Text>
          <PrimaryButton
            title="Start Break"
            onPress={handleStartBreak}
            size="sm"
            style={styles.tipButton}
          />
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionItem, { backgroundColor: theme.colors.surfaceAlt }]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name={action.icon as any} 
                  size={28} 
                  color={action.color} 
                />
                <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Metrics Row */}
        <GlassCard style={styles.metricsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Today's Stats
          </Text>
          <View style={styles.metricsRow}>
            {metrics.map((metric, index) => (
              <TouchableOpacity
                key={index}
                style={styles.metricItem}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/wellness');
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
                  {metric.value}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  {metric.label}
                </Text>
                <Text style={[styles.metricTrend, { color: metric.color }]}>
                  {metric.trend}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Telehealth Teaser */}
        <GlassCard style={styles.teaserCard}>
          <MaterialCommunityIcons 
            name="video-outline" 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.teaserTitle, { color: theme.colors.textPrimary }]}>
            Talk to a Doctor
          </Text>
          <Text style={[styles.teaserSubtitle, { color: theme.colors.textSecondary }]}>
            Secure video consults via trusted partners
          </Text>
          <Text style={[styles.comingSoon, { color: theme.colors.warning }]}>
            Coming Soon
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  tipCard: {
    marginBottom: 20,
  },
  tipGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  tipButton: {
    alignSelf: 'flex-start',
  },
  actionsCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  metricsCard: {
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 11,
    fontWeight: '600',
  },
  teaserCard: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 24,
  },
  teaserTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  teaserSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});