import { useEffect, useState } from 'react';

/**
 * Custom hook for managing reusable animation variants and configurations
 * to ensure consistent animations across the website.
 * 
 * @param {Object} options Configuration options for animations
 * @param {string} options.type Animation type (fade, slide, scale, etc.)
 * @param {number} options.duration Duration of the animation in seconds
 * @param {number} options.delay Initial delay before animation starts
 * @param {string} options.ease Easing function for the animation
 * @returns {Object} Animation variants and utility functions
 */
export const useAnimation = ({
  type = 'fade',
  duration = 0.5,
  delay = 0,
  ease = 'easeOut',
} = {}) => {
  const [inView, setInView] = useState(false);
  
  // Basic animation configurations
  const getAnimationConfig = () => ({
    transition: {
      duration,
      delay,
      ease,
    }
  });
  
  // Predefined animation variants
  const animations = {
    fade: {
      hidden: { opacity: 0, ...getAnimationConfig() },
      visible: { opacity: 1, ...getAnimationConfig() }
    },
    fadeUp: {
      hidden: { opacity: 0, y: 20, ...getAnimationConfig() },
      visible: { opacity: 1, y: 0, ...getAnimationConfig() }
    },
    fadeDown: {
      hidden: { opacity: 0, y: -20, ...getAnimationConfig() },
      visible: { opacity: 1, y: 0, ...getAnimationConfig() }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -20, ...getAnimationConfig() },
      visible: { opacity: 1, x: 0, ...getAnimationConfig() }
    },
    fadeRight: {
      hidden: { opacity: 0, x: 20, ...getAnimationConfig() },
      visible: { opacity: 1, x: 0, ...getAnimationConfig() }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8, ...getAnimationConfig() },
      visible: { opacity: 1, scale: 1, ...getAnimationConfig() }
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.8, y: 20, ...getAnimationConfig() },
      visible: { opacity: 1, scale: 1, y: 0, ...getAnimationConfig() }
    },
    flip: {
      hidden: { opacity: 0, rotateX: 90, ...getAnimationConfig() },
      visible: { opacity: 1, rotateX: 0, ...getAnimationConfig() }
    },
    stagger: (staggerChildren = 0.1) => ({
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren,
          delayChildren: delay
        }
      }
    }),
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, ease }
      }
    }
  };

  // Generate animation sequence with custom delays
  const sequence = (elements, baseDelay = 0, increment = 0.1) => {
    return elements.map((element, index) => ({
      ...element,
      transition: {
        ...element.transition,
        delay: baseDelay + (index * increment)
      }
    }));
  };

  // Get the animation variants based on the type
  const getVariants = () => {
    return animations[type] || animations.fade;
  };

  // Get the appropriate props for the motion component
  const getMotionProps = (customVariants) => {
    const variants = customVariants || getVariants();
    
    return {
      variants,
      initial: "hidden",
      animate: inView ? "visible" : "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-50px" },
    };
  };

  // Set the element to be in view
  const setElementInView = () => {
    setInView(true);
  };

  return {
    inView,
    setInView: setElementInView,
    variants: getVariants(),
    getMotionProps,
    sequence,
    animations,
  };
};

export default useAnimation; 