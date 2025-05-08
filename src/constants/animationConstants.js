/**
 * Animation constants for consistent animations across the website
 */

// Animation durations
export const DURATIONS = {
  EXTRA_FAST: 0.2,
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
  EXTRA_SLOW: 1.2,
};

// Animation delays
export const DELAYS = {
  NONE: 0,
  SHORT: 0.1,
  MEDIUM: 0.2,
  LONG: 0.3,
  EXTRA_LONG: 0.5,
};

// Animation easing functions
export const EASE = {
  // Standard easing
  LINEAR: [0, 0, 1, 1],
  EASE_IN: [0.42, 0, 1, 1],
  EASE_OUT: [0, 0, 0.58, 1],
  EASE_IN_OUT: [0.42, 0, 0.58, 1],
  
  // Custom easing
  ELASTIC_OUT: [0.64, 0.57, 0.67, 1.53],
  BACK_OUT: [0.34, 1.56, 0.64, 1],
  SOFT_OUT: [0, 0, 0.2, 1],
  ANTICIPATE: [0.68, -0.6, 0.32, 1.6],
  
  // Named strings for Framer Motion
  MOTION: {
    DEFAULT: "easeInOut",
    BOUNCE: "easeOutBounce",
    SPRING: "spring",
    ANTICIPATE: "anticipate",
  }
};

// Spring animation configurations
export const SPRING = {
  GENTLE: {
    type: "spring",
    stiffness: 150,
    damping: 15,
  },
  BOUNCY: {
    type: "spring",
    stiffness: 300,
    damping: 10,
  },
  SUBTLE: {
    type: "spring",
    stiffness: 120,
    damping: 20,
  },
};

// Stagger configurations
export const STAGGER = {
  FAST: 0.05,
  NORMAL: 0.1,
  SLOW: 0.15,
  CHILDREN: {
    delayChildren: 0.1,
    staggerChildren: 0.05,
  },
  SEQUENCE: {
    delayChildren: 0.2,
    staggerChildren: 0.1,
  }
};

// Common animation variants
export const VARIANTS = {
  FADE_IN: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: DURATIONS.NORMAL }
    }
  },
  FADE_UP: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATIONS.NORMAL }
    }
  },
  SCALE_IN: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: DURATIONS.NORMAL }
    }
  },
  SLIDE_RIGHT: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: DURATIONS.NORMAL }
    }
  },
  SLIDE_LEFT: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: DURATIONS.NORMAL }
    }
  },
  STAGGERED_CONTAINER: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: STAGGER.NORMAL,
        delayChildren: DELAYS.SHORT
      }
    }
  },
  STAGGERED_ITEM: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATIONS.FAST }
    }
  }
};

// Viewport observation options
export const VIEWPORT = {
  ONCE: { once: true },
  MARGIN: { once: true, margin: "-50px" },
  REPEAT: { once: false },
};

export default {
  DURATIONS,
  DELAYS,
  EASE,
  SPRING,
  STAGGER,
  VARIANTS,
  VIEWPORT,
}; 