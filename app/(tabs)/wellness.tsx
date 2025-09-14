import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

const { width } = Dimensions.get('window');

interface MetricData {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  data: number[];
}

export default function WellnessScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const metrics: MetricData[] = [
    {
      id: 'steps',
      title: 'Steps',
      value: '6,420',
      unit: 'steps',
      trend: '+12%',
      trendDirection: 'up',
      icon: 'walk',
      color: theme.colors.success,
      data: [4200, 5100, 4800, 6420, 5900, 6800, 6420]
    },
    {
      id: 'sleep',
      title: 'Sleep',
      value: '6h 40m',
      unit: 'hours',
      trend: '-20m',
      trendDirection: 'down',
      icon: 'sleep',
      color: theme.colors.primary,
      data: [7.5, 8, 6.8, 7.2, 6.9, 7.1, 6.67]
    },
    {
      id: 'heart_rate',
      title: 'Heart Rate',
      value: '74',
      unit: 'bpm',
      trend: 'Normal',
      trendDirection: 'neutral',
      icon: 'heart-pulse',
      color: theme.colors.danger,
      data: [72, 75, 73, 76, 74, 73, 74]
    }
  ];

  const SimpleSparkline = ({ data, color }: { data: number[]; color: string }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const sparklineWidth = 60;
    const sparklineHeight = 20;
    
    return (
      <View style={[styles.sparkline, { width: sparklineWidth, height: sparklineHeight }]}>
        {data.map((value, index) => {
          const normalizedHeight = range > 0 ? ((value - minValue) / range) * sparklineHeight : sparklineHeight / 2;
          const x = (index / (data.length - 1)) * (sparklineWidth - 4);
          
          return (
            <View
              key={index}
              style={[
                styles.sparklineBar,
                {
                  left: x,
                  height: Math.max(normalizedHeight, 2),
                  bottom: 0,
                  backgroundColor: color,
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const handleStartWindDown = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Wind Down Started',
      'Starting your 5-minute wind-down routine. Find a comfortable position and breathe deeply.',
      [{ text: 'Begin', onPress: () => console.log('Wind down routine started') }]
    );
  };

  const handleLogActivity = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Log Activity',
      'What activity would you like to log?',
      [
        { text: 'Walking', onPress: () => console.log('Logged walking activity') },
        { text: 'Exercise', onPress: () => console.log('Logged exercise activity') },
        { text: 'Meditation', onPress: () => console.log('Logged meditation activity') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSetGoals = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Set New Goals',
      'Choose a goal to customize:',
      [
        { text: 'Daily Steps', onPress: () => console.log('Setting step goal') },
        { text: 'Sleep Target', onPress: () => console.log('Setting sleep goal') },
        { text: 'Water Intake', onPress: () => console.log('Setting water goal') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleExportData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Export Wellness Data',
      'Your health data will be exported to a CSV file. This may take a moment.',
      [
        { 
          text: 'Export', 
          onPress: () => {
            console.log('Exporting wellness data...');
            setTimeout(() => {
              Alert.alert('Export Complete', 'Your wellness data has been saved to Downloads folder.');
            }, 2000);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Wellness Tracker
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Your health metrics and insights
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <TouchableOpacity 
              key={metric.id} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(
                  `${metric.title} Details`,
                  `Current: ${metric.value}\nTrend: ${metric.trend}\nThis week's average shows ${metric.trendDirection === 'up' ? 'improvement' : metric.trendDirection === 'down' ? 'decline' : 'steady performance'}.`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <GlassCard style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                    <MaterialCommunityIcons 
                      name={metric.icon as any} 
                      size={20} 
                      color={metric.color} 
                    />
                  </View>
                  <SimpleSparkline data={metric.data} color={metric.color} />
                </View>
                
                <View style={styles.metricContent}>
                  <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
                    {metric.value}
                  </Text>
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>
                    {metric.title}
                  </Text>
                  <View style={styles.metricTrend}>
                    <MaterialCommunityIcons 
                      name={
                        metric.trendDirection === 'up' ? 'trending-up' :
                        metric.trendDirection === 'down' ? 'trending-down' :
                        'trending-neutral'
                      }
                      size={14}
                      color={
                        metric.trendDirection === 'up' ? theme.colors.success :
                        metric.trendDirection === 'down' ? theme.colors.warning :
                        theme.colors.muted
                      }
                    />
                    <Text style={[
                      styles.metricTrendText, 
                      { 
                        color: metric.trendDirection === 'up' ? theme.colors.success :
                               metric.trendDirection === 'down' ? theme.colors.warning :
                               theme.colors.muted
                      }
                    ]}>
                      {metric.trend}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Insights Card */}
        <GlassCard style={styles.insightsCard} glow variant="primary">
          <View style={styles.insightsHeader}>
            <LinearGradient
              colors={theme.colors.gradientPrimary}
              style={styles.aiIcon}
            >
              <MaterialCommunityIcons 
                name="robot-outline" 
                size={24} 
                color={theme.colors.textPrimary} 
              />
            </LinearGradient>
            <Text style={[styles.insightsTitle, { color: theme.colors.textPrimary }]}>
              AI Health Insights
            </Text>
          </View>

          <View style={styles.insightsContent}>
            <View style={styles.prosConsSection}>
              <Text style={[styles.prosConsTitle, { color: theme.colors.success }]}>
                ✓ What's Going Well
              </Text>
              <Text style={[styles.prosConsItem, { color: theme.colors.textSecondary }]}>
                • Great step count today! You exceeded your daily goal by 420 steps 👟
              </Text>
              <Text style={[styles.prosConsItem, { color: theme.colors.textSecondary }]}>
                • Heart rate is in healthy range throughout the day ❤️
              </Text>
            </View>

            <View style={styles.prosConsSection}>
              <Text style={[styles.prosConsTitle, { color: theme.colors.warning }]}>
                ⚠️ Areas for Improvement
              </Text>
              <Text style={[styles.prosConsItem, { color: theme.colors.textSecondary }]}>
                • Sleep duration was 20 minutes shorter than your average 😴
              </Text>
              <Text style={[styles.prosConsItem, { color: theme.colors.textSecondary }]}>
                • Late-night screen time may be affecting sleep quality
              </Text>
            </View>

            <View style={styles.recommendationSection}>
              <Text style={[styles.recommendationTitle, { color: theme.colors.textPrimary }]}>
                💡 Recommendation
              </Text>
              <Text style={[styles.recommendationText, { color: theme.colors.textSecondary }]}>
                Try a 5-minute wind-down routine before bed to improve sleep quality and duration.
              </Text>
              
              <PrimaryButton
                title="Start 5-min Wind Down"
                onPress={handleStartWindDown}
                size="sm"
                style={styles.recommendationButton}
              />
            </View>
          </View>
        </GlassCard>

        {/* Weekly Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            This Week's Summary
          </Text>
          
          <View style={styles.summaryStats}>
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Steps This Week', 'Total: 45,890 steps\nDaily Average: 6,555 steps\nBest Day: 8,420 steps (Wednesday)', [{ text: 'OK' }]);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                45,890
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Steps
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Sleep This Week', 'Total: 48.5 hours\nDaily Average: 6h 56m\nBest Night: 8h 15m (Sunday)', [{ text: 'OK' }]);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                48.5h
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Sleep
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Active Days', 'You met your activity goals 5 out of 7 days this week! Keep up the great work!', [{ text: 'OK' }]);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.summaryValue, { color: theme.colors.secondary }]}>
                5
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Active Days
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weeklyProgress}>
            <Text style={[styles.progressTitle, { color: theme.colors.textPrimary }]}>
              Weekly Goals Progress
            </Text>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.outline }]}>
                <View style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.colors.success,
                    width: '78%' 
                  }
                ]} />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                78% complete
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={handleLogActivity}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="plus" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.actionButtonText, { color: theme.colors.textPrimary }]}>
                Log Activity
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={handleSetGoals}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="target" 
                size={24} 
                color={theme.colors.secondary} 
              />
              <Text style={[styles.actionButtonText, { color: theme.colors.textPrimary }]}>
                Set Goals
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={handleExportData}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="download-outline" 
                size={24} 
                color={theme.colors.warning} 
              />
              <Text style={[styles.actionButtonText, { color: theme.colors.textPrimary }]}>
                Export Data
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 72) / 2,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkline: {
    position: 'relative',
  },
  sparklineBar: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
  },
  metricContent: {
    alignItems: 'flex-start',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  insightsCard: {
    marginBottom: 20,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  insightsContent: {
    gap: 16,
  },
  prosConsSection: {
    marginBottom: 8,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  prosConsItem: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  recommendationSection: {
    marginTop: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  recommendationButton: {
    alignSelf: 'flex-start',
  },
  summaryCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  weeklyProgress: {
    marginTop: 16,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 80,
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});