// Jellyfin-inspired dark theme colors
export const colors = {
  // Primary colors - Jellyfin brand colors
  primary: '#00A4DC', // Jellyfin blue
  primaryDark: '#0082B3',
  primaryLight: '#33B8E5',

  // Background colors - Jellyfin dark theme
  background: '#101010', // Jellyfin official background
  backgroundDark: '#0A0A0A',
  backgroundLight: '#1A1A1A',
  backgroundMedium: '#181818',
  surface: '#1C1C1C',
  surfaceLight: '#252525',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#666666',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#00A4DC', // Use Jellyfin blue for info

  // Other
  border: '#2A2A2A',
  divider: '#1F1F1F',
  overlay: 'rgba(0, 0, 0, 0.7)',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    color: colors.textMuted,
  },
  code: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    fontFamily: 'monospace',
    color: colors.textPrimary,
  },
};

