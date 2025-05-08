import React, { useRef, ReactNode, useEffect } from 'react';
import { motion, useAnimation, Variant } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate' | 'none';
type AnimationType = 'spring' | 'tween' | 'inertia';
type AnimationEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circIn' | 'circOut' | 'circInOut' | 'backIn' | 'backOut' | 'backInOut';

interface ScrollAnimationVariants {
  hidden: Variant;
  visible: Variant;
}

interface ScrollTriggerAnimationsProps {
  children: ReactNode;
  className?: string;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  threshold?: number;
  type?: AnimationType;
  ease?: AnimationEasing;
  staggerChildren?: number;
  distance?: number;
  once?: boolean;
  damping?: number;
  stiffness?: number;
  startVisible?: boolean;
  customVariants?: ScrollAnimationVariants;
}

const generateVariants = (
  direction: AnimationDirection,
  distance: number,
  staggerChildren: number,
  damping: number,
  stiffness: number,
  duration: number,
  ease: AnimationEasing
): ScrollAnimationVariants => {
  // Base hidden states for different directions
  const getHiddenState = (): Variant => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'scale':
        return { scale: 0.8, opacity: 0 };
      case 'rotate':
        return { rotate: -10, opacity: 0, scale: 0.95 };
      case 'fade':
        return { opacity: 0 };
      case 'none':
        return {};
      default:
        return { y: distance, opacity: 0 };
    }
  };

  // Create transition based on type
  const getTransition = (childDelay: number = 0) => {
    switch (type) {
      case 'spring':
        return {
          type: 'spring',
          damping,
          stiffness,
          delay: childDelay,
        };
      case 'inertia':
        return {
          type: 'inertia',
          velocity: 50,
          delay: childDelay,
        };
      case 'tween':
      default:
        return {
          type: 'tween',
          duration,
          ease,
          delay: childDelay,
        };
    }
  };

  return {
    hidden: getHiddenState(),
    visible: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: getTransition(),
      transitionEnd: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
      },
    },
  };
};

const ScrollTriggerAnimations: React.FC<ScrollTriggerAnimationsProps> = ({
  children,
  className = '',
  direction = 'up',
  duration = 0.6,
  delay = 0,
  threshold = 0.2,
  type = 'tween',
  ease = 'easeOut',
  staggerChildren = 0.1,
  distance = 50,
  once = true,
  damping = 12,
  stiffness = 100,
  startVisible = false,
  customVariants,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  // Generate animation variants
  const variants = customVariants || generateVariants(
    direction,
    distance,
    staggerChildren,
    damping,
    stiffness,
    duration,
    ease
  );

  // Handle child staggering
  const containerVariants = {
    hidden: { opacity: 1 }, // Container is always visible
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  useEffect(() => {
    if (startVisible) {
      controls.start('visible');
    } else if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView, startVisible]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={startVisible ? 'visible' : 'hidden'}
      animate={controls}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
          <motion.div
            key={index}
            variants={variants}
            style={{ display: child.props.style?.display || 'flex' }}
            className={child.props.className || ''}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ScrollTriggerAnimations; 