import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

interface WellnessScoreProps {
  score: number;
  maxScore?: number;
  size?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WellnessScore({ 
  score, 
  maxScore = 100, 
  size = 120 
}: WellnessScoreProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    progress.value = withTiming(score / maxScore, { duration: 1000 });
  }, [score, maxScore]);

  const animatedProps = useAnimatedStyle(() => {
    const strokeDashoffset = circumference - (progress.value * circumference);
    return {
      strokeDashoffset,
    };
  });

  const getScoreColor = () => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.primary;
    if (score >= 40) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.outline}
          strokeWidth={8}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth={8}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={[styles.score, { color: theme.colors.textPrimary }]}>
          {score}
        </Text>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Wellness Score
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
  },
  score: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});