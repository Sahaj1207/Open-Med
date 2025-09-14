import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export default function GlassCard({ 
  children, 
  style, 
  glow = false, 
  variant = 'default' 
}: GlassCardProps) {
  const { theme } = useTheme();

  const getGlowColor = () => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'danger': return theme.colors.danger;
      default: return theme.colors.primary;
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.outline,
    },
    glow && {
      shadowColor: getGlowColor(),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
    marginVertical: 2, // Add small vertical margin for better spacing
  },
});