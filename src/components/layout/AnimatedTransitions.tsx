import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface AnimatedTransitionsProps {
  children: ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale' | 'flip' | 'none';
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Animation variants based on transition type and direction
const getVariants = (type: string, direction: string, duration: number) => {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { 
        x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
        y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
        opacity: 0 
      },
      animate: { 
        x: 0, 
        y: 0, 
        opacity: 1 
      },
      exit: { 
        x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
        y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
        opacity: 0 
      },
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
    flip: {
      initial: { 
        rotateY: direction === 'left' || direction === 'right' ? 90 : 0,
        rotateX: direction === 'up' || direction === 'down' ? 90 : 0,
        opacity: 0 
      },
      animate: { 
        rotateX: 0, 
        rotateY: 0, 
        opacity: 1 
      },
      exit: { 
        rotateY: direction === 'left' || direction === 'right' ? -90 : 0,
        rotateX: direction === 'up' || direction === 'down' ? -90 : 0,
        opacity: 0 
      },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  return {
    ...(transitions[type] || transitions.fade),
    transition: {
      duration,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier easing
    }
  };
};

const AnimatedTransitions: React.FC<AnimatedTransitionsProps> = ({
  children,
  className = '',
  transitionType = 'fade',
  duration = 0.4,
  direction = 'left',
}) => {
  const router = useRouter();
  
  const variants = getVariants(transitionType, direction, duration);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.asPath}
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedTransitions; 