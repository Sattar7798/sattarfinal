import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Reveal animations for different elements
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Scale up animation
export const ScaleUp = ({ children, delay = 0, duration = 0.5, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide in from direction
export const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.5, 
  distance = 50,
  className = '', 
  ...props 
}) => {
  const directionOffset = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
export const StaggerChildren = ({ 
  children, 
  delayIncrement = 0.1, 
  staggerDirection = 1,
  initialDelay = 0,
  className = '', 
  ...props 
}) => {
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: initialDelay + (custom * delayIncrement * staggerDirection),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
      {...props}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={childVariants} custom={index}>
            {child}
          </motion.div>
        )) : 
        children
      }
    </motion.div>
  );
};

// Text animation that reveals character by character
export const AnimatedText = ({ 
  text, 
  tag = 'h2', 
  delay = 0, 
  duration = 0.05, 
  className = '', 
  ...props 
}) => {
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (custom = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: duration,
        delayChildren: delay,
      }
    })
  };
  
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const Component = motion[tag];
  
  return (
    <Component
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
      {...props}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block whitespace-nowrap" style={{ marginRight: '0.25em' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={child}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Component>
  );
};

// Parallax scroll effect
export const ParallaxSection = ({ 
  children, 
  speed = 0.2, 
  className = '', 
  direction = 'up',
  ...props 
}) => {
  const directionMultiplier = direction === 'down' ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ 
        opacity: 1,
        y: -50 * speed * directionMultiplier
      }}
      viewport={{ once: false, margin: '-100px 0px -100px 0px' }}
      transition={{ duration: 0.8 }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, pageKey }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

// Scroll-linked animation hook
export const useScrollAnimation = (ref, options = {}) => {
  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    onChange = () => {} 
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          } else {
            entry.target.classList.remove('animated');
          }
          onChange(entry);
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, rootMargin, onChange]);
};

export default {
  FadeIn,
  ScaleUp, 
  SlideIn,
  StaggerChildren,
  AnimatedText,
  ParallaxSection,
  PageTransition,
  useScrollAnimation
}; 