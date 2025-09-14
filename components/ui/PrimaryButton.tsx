import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function PrimaryButton({ 
  title, 
  onPress, 
  style, 
  disabled = false,
  variant = 'primary',
  size = 'md'
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const glow = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.4,
  }));

  const handlePress = () => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    
    glow.value = withSequence(
      withSpring(1.5, { duration: 150 }),
      withSpring(1, { duration: 300 })
    );
    
    onPress();
  };

  const getGradient = () => {
    switch (variant) {
      case 'primary': return theme.colors.gradientPrimary;
      case 'secondary': return [theme.colors.secondary, theme.colors.secondary];
      case 'danger': return [theme.colors.danger, theme.colors.danger];
      default: return theme.colors.gradientPrimary;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 40;
      case 'md': return 52;
      case 'lg': return 60;
      case 'xl': return 72;
      default: return 52;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'md': return 16;
      case 'lg': return 18;
      case 'xl': return 20;
      default: return 16;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'sm': return 16;
      case 'md': return 24;
      case 'lg': return 32;
      case 'xl': return 40;
      default: return 24;
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[animatedStyle, glowStyle, style]}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          {
            height: getHeight(),
            paddingHorizontal: getPaddingHorizontal(),
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text style={[
          styles.text,
          {
            fontSize: getFontSize(),
            color: variant === 'primary' ? '#0A1220' : theme.colors.textPrimary,
          }
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
    minWidth: 120,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});