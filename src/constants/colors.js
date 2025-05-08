/**
 * Color constants for consistent styling across the website
 */

// Primary brand colors
export const BRAND = {
  PRIMARY: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Main primary color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  SECONDARY: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main secondary color
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  ACCENT: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107', // Main accent color
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
};

// Basic colors
export const BASIC = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  
  GRAY: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Dark mode colors
export const DARK = {
  BACKGROUND: {
    DEFAULT: '#121212',
    PAPER: '#1e1e1e',
    ELEVATED: '#2d2d2d',
  },
  TEXT: {
    PRIMARY: 'rgba(255, 255, 255, 0.87)',
    SECONDARY: 'rgba(255, 255, 255, 0.6)',
    DISABLED: 'rgba(255, 255, 255, 0.38)',
  },
};

// Light mode colors
export const LIGHT = {
  BACKGROUND: {
    DEFAULT: '#ffffff',
    PAPER: '#f5f5f5',
    ELEVATED: '#ffffff',
  },
  TEXT: {
    PRIMARY: 'rgba(0, 0, 0, 0.87)',
    SECONDARY: 'rgba(0, 0, 0, 0.6)',
    DISABLED: 'rgba(0, 0, 0, 0.38)',
  },
};

// Semantic colors
export const SEMANTIC = {
  SUCCESS: {
    LIGHT: '#4caf50',
    MAIN: '#2e7d32',
    DARK: '#1b5e20',
    CONTRAST: '#ffffff',
  },
  ERROR: {
    LIGHT: '#ef5350',
    MAIN: '#d32f2f',
    DARK: '#c62828',
    CONTRAST: '#ffffff',
  },
  WARNING: {
    LIGHT: '#ff9800',
    MAIN: '#ed6c02',
    DARK: '#e65100',
    CONTRAST: '#ffffff',
  },
  INFO: {
    LIGHT: '#03a9f4',
    MAIN: '#0288d1',
    DARK: '#01579b',
    CONTRAST: '#ffffff',
  },
};

// Specific domain-related colors
export const DOMAIN = {
  // Structural engineering related colors
  STRUCTURAL: {
    CONCRETE: '#b0bec5',
    STEEL: '#78909c',
    GLASS: '#e1f5fe',
    WOOD: '#8d6e63',
  },
  
  // Seismic analysis related colors
  SEISMIC: {
    LOW: '#66bb6a',
    MODERATE: '#ffb74d',
    HIGH: '#ef5350',
    CRITICAL: '#d32f2f',
  },
  
  // AI/ML related colors
  AI: {
    NEURAL: '#8e24aa',
    PREDICTION: '#1e88e5',
    ANALYSIS: '#00897b',
    VISION: '#7cb342',
  },
  
  // Chart colors
  CHART: {
    SERIES: [
      '#1f77b4', // blue
      '#ff7f0e', // orange
      '#2ca02c', // green
      '#d62728', // red
      '#9467bd', // purple
      '#8c564b', // brown
      '#e377c2', // pink
      '#7f7f7f', // gray
      '#bcbd22', // olive
      '#17becf'  // teal
    ],
    SEQUENTIAL: [
      '#d0d1e6',
      '#a6bddb',
      '#74a9cf',
      '#3690c0',
      '#0570b0',
      '#034e7b'
    ],
    DIVERGING: [
      '#d73027',
      '#f46d43',
      '#fdae61',
      '#fee090',
      '#e0f3f8',
      '#abd9e9',
      '#74add1',
      '#4575b4'
    ],
  },
};

// Gradients
export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
  SECONDARY: 'linear-gradient(135deg, #388e3c 0%, #81c784 100%)',
  ACCENT: 'linear-gradient(135deg, #ffa000 0%, #ffd54f 100%)',
  SUCCESS: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
  ERROR: 'linear-gradient(135deg, #c62828 0%, #ef5350 100%)',
  DARK: 'linear-gradient(135deg, #212121 0%, #424242 100%)',
  SEISMIC: 'linear-gradient(90deg, #66bb6a 0%, #ffb74d 50%, #ef5350 100%)',
};

// TailwindCSS specific color mapping
export const TAILWIND = {
  primary: BRAND.PRIMARY,
  secondary: BRAND.SECONDARY,
  accent: BRAND.ACCENT,
  success: SEMANTIC.SUCCESS,
  error: SEMANTIC.ERROR,
  warning: SEMANTIC.WARNING,
  info: SEMANTIC.INFO,
  gray: BASIC.GRAY,
};

export default {
  BRAND,
  BASIC,
  DARK,
  LIGHT,
  SEMANTIC,
  DOMAIN,
  GRADIENTS,
  TAILWIND,
}; 