import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Animation variants for different effects
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  zoomOut: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  flipInX: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { 
      opacity: 1, 
      rotateX: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  flipInY: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  slideIn: {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: '100%', 
      opacity: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { 
      opacity: 1, 
      scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
      transition: { 
        duration: 0.8,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -90, scale: 0.3 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  expandIn: {
    hidden: { 
      opacity: 0, 
      height: 0,
      overflow: 'hidden'
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }
};

/**
 * ScrollTriggerAnimation component animates elements when they scroll into view
 */
const ScrollTriggerAnimation = ({
  children,
  animationVariant = 'fadeInUp',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0,
  className = '',
  style = {},
  duration,
  ease,
  ...props
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const [isInView, setIsInView] = useState(false);

  // Get variant from variants object or use custom variant if provided as object
  const variant = typeof animationVariant === 'string' 
    ? ANIMATION_VARIANTS[animationVariant] 
    : animationVariant;
  
  // Apply custom transition options if provided
  if (variant && variant.visible && duration) {
    variant.visible.transition = {
      ...(variant.visible.transition || {}),
      duration
    };
  }
  
  if (variant && variant.visible && ease) {
    variant.visible.transition = {
      ...(variant.visible.transition || {}),
      ease
    };
  }

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start("visible");
        } else if (!triggerOnce) {
          setIsInView(false);
          controls.start("hidden");
        }
      },
      { 
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls, threshold, rootMargin, triggerOnce]);

  // Apply delay if specified
  useEffect(() => {
    if (isInView && delay > 0) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variant}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollTriggeredSequence component animates children in a sequence when scrolled into view
 */
export const ScrollTriggeredSequence = ({
  children,
  variant = 'fadeInUp',
  delayIncrement = 0.1,
  containerClassName = '',
  initialDelay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  staggerDirection = 1,
  ...props
}) => {
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        } else if (!triggerOnce) {
          controls.start("hidden");
        }
      },
      { 
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [controls, threshold, rootMargin, triggerOnce]);

  const getVariants = () => {
    // Use predefined variant or custom one
    const baseVariant = typeof variant === 'string' 
      ? ANIMATION_VARIANTS[variant] 
      : variant;
      
    return {
      hidden: baseVariant.hidden,
      visible: {
        ...baseVariant.visible,
        transition: {
          ...baseVariant.visible.transition,
          staggerChildren: delayIncrement,
          staggerDirection: staggerDirection,
          delayChildren: initialDelay,
        }
      }
    };
  };

  return (
    <motion.div
      ref={containerRef}
      variants={getVariants()}
      initial="hidden"
      animate={controls}
      className={containerClassName}
      {...props}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          variants={typeof variant === 'string' ? ANIMATION_VARIANTS[variant] : variant}
          custom={i}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * ScrollProgressBar component shows a progress bar at the top of the page
 * that fills as the user scrolls down the page
 */
export const ScrollProgressBar = ({ 
  color = '#3B82F6', 
  height = 6,
  position = 'top',
  zIndex = 50
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const positionStyles = {
    top: { top: 0, bottom: 'auto' },
    bottom: { bottom: 0, top: 'auto' }
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex,
        ...positionStyles[position]
      }}
    >
      <div 
        style={{
          height: '100%',
          width: `${scrollProgress}%`,
          backgroundColor: color,
          transition: 'width 0.1s'
        }}
      />
    </div>
  );
};

/**
 * Parallax component creates a smooth parallax scrolling effect
 */
export const Parallax = ({ 
  children,
  speed = 0.5,  // Positive values scroll slower, negative values scroll faster
  direction = 'up',
  className = '',
  style = {},
  ...props
}) => {
  const ref = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [transformValue, setTransformValue] = useState(0);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const updateElementPosition = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setElementHeight(rect.height);
    };
    
    // Initial calculations
    updateElementPosition();
    
    // Recalculate on resize
    window.addEventListener('resize', updateElementPosition);
    
    return () => {
      window.removeEventListener('resize', updateElementPosition);
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Calculate when element is in view
      const elementScrollStart = elementTop - windowHeight;
      const elementScrollEnd = elementTop + elementHeight;
      
      if (scrollY >= elementScrollStart && scrollY <= elementScrollEnd) {
        // Calculate how far through the element we have scrolled
        const elementScrollPosition = (scrollY - elementScrollStart) / 
          (elementScrollEnd - elementScrollStart);
        
        // Calculate parallax effect
        const directionMultiplier = direction === 'up' ? -1 : 1;
        const parallaxOffset = (elementScrollPosition * speed * 100) * directionMultiplier;
        
        setTransformValue(parallaxOffset);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementTop, elementHeight, speed, direction]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style} {...props}>
      <div style={{ transform: `translate3d(0, ${transformValue}px, 0)` }}>
        {children}
      </div>
    </div>
  );
};

export default ScrollTriggerAnimation; 