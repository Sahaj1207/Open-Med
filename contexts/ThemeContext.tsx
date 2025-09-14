import React, { createContext, useContext, ReactNode } from 'react';

export const theme = {
  colors: {
    bg: '#0B0F1A',
    surface: '#0F1626',
    surfaceAlt: '#111A2E',
    card: '#121A30',
    textPrimary: '#E6ECF8',
    textSecondary: '#9FB0D6',
    muted: '#6C7AA6',
    outline: '#20304F',
    primary: '#60A5FA',
    primaryGlow: '#93C5FD',
    secondary: '#34D399',
    warning: '#F59E0B',
    danger: '#F87171',
    success: '#22C55E',
    gradientPrimary: ['#3B82F6', '#22D3EE'],
    gradientAccent: ['#22D3EE', '#34D399'],
  },
  effects: {
    glass: { alpha: 0.1, blur: 16 },
    shadow: '0 8px 24px rgba(0,0,0,0.45)',
    glowPrimary: '0 0 16px rgba(96,165,250,0.45)',
    stroke: '1px solid #20304F',
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

type ThemeContextType = {
  theme: typeof theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}