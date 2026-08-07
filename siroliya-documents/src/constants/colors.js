// colors.js
// Family Documents App — Theme Colors
// Usage: import { colors } from './colors';
// colors.dark.background, colors.light.background, etc.

export const colors = {
  dark: {
    background: '#000000',    // true black, jaisa Instagram/YouTube
    surface: '#121212',       // cards, headers — dark gray
    surfaceElevated: '#1E1E1E', // modals, dropdowns — thoda upar uthaya hua surface
    surfaceGlass: 'rgba(18, 18, 18, 0.7)', // for glassmorphism cards (use with backdrop-blur)
    border: '#2A2A2A',

    primary: '#2E6BFF',       // electric blue — buttons, links, active states
    secondary: '#D4AF37',     // muted gold — premium highlights, badges

    textPrimary: '#FFFFFF',
    textSecondary: '#A8A8A8',
    textMuted: '#6E6E6E',

    success: '#3DDC97',
    danger: '#FF5C5C',
    warning: '#F5A623',

    // Member tag colors
    memberPiyush: '#2E6BFF',
    memberDishant: '#8B5CF6',
    memberSapna: '#EC4899',
    memberSantosh: '#14B8A6',
  },

  light: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceShadow: 'rgba(16, 24, 40, 0.08)', // use as boxShadow / elevation tint
    border: '#E5E7EB',

    primary: '#2E6BFF',       // same electric blue — brand consistency across themes
    secondary: '#B8860B',     // darker gold — more readable on light bg

    textPrimary: '#1A1F2B',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    success: '#1FAA6D',
    danger: '#E5484D',
    warning: '#D97706',

    // Member tag colors
    memberPiyush: '#2E6BFF',
    memberDishant: '#7C3AED',
    memberSapna: '#DB2777',
    memberSantosh: '#0D9488',
  },
};

// Helper to get colors by mode: getColors('dark') or getColors('light')
export const getColors = (mode = 'light') => colors[mode] ?? colors.light;