import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

/**
 * Collection of micro-interaction animations for enhanced UI feedback
 */

// Pop animation when clicking a button
export const PopButton = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <motion.button
      className={`inline-flex items-center justify-center ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Hover card that expands slightly
export const HoverCard = ({ 
  children, 
  className = '',
  hoverScale = 1.03,
  shadow = true,
  ...props 
}) => {
  return (
    <motion.div
      className={`${className} ${shadow ? 'transition-shadow' : ''}`}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : undefined 
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated icon that rotates or scales on hover
export const AnimatedIcon = ({ 
  children, 
  type = 'rotate', // 'rotate', 'scale', 'bounce', 'pulse'
  className = '',
  ...props 
}) => {
  const animations = {
    rotate: { rotate: 360 },
    scale: { scale: 1.2 },
    bounce: { y: [0, -8, 0] },
    pulse: { scale: [1, 1.1, 1] },
  };
  
  return (
    <motion.div
      className={className}
      whileHover={animations[type]}
      transition={{ 
        type: type === 'bounce' ? 'spring' : 'tween',
        duration: type === 'rotate' ? 0.6 : 0.3,
        repeat: type === 'pulse' ? Infinity : undefined,
        repeatType: 'reverse',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated text that reveals itself
export const TypeWriter = ({ 
  text, 
  speed = 50, // ms per character
  className = '',
  cursor = true,
  ...props 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [index, speed, text]);
  
  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setIndex(0);
  }, [text]);
  
  return (
    <span className={className} {...props}>
      {displayText}
      {cursor && index < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Ripple effect for buttons
export const RippleButton = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  rippleColor = 'rgba(255, 255, 255, 0.7)',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  
  const handleClick = (e) => {
    if (disabled) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;
    const width = button.clientWidth;
    const height = button.clientHeight;
    
    const diameter = Math.max(width, height);
    
    setRipples([
      ...ripples,
      {
        id: Date.now(),
        left,
        top,
        diameter,
      },
    ]);
    
    if (onClick) onClick(e);
  };
  
  const removeRipple = (id) => {
    setRipples(ripples.filter(ripple => ripple.id !== id));
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full"
          style={{
            left: ripple.left - ripple.diameter / 2,
            top: ripple.top - ripple.diameter / 2,
            width: ripple.diameter,
            height: ripple.diameter,
            background: rippleColor,
          }}
          initial={{ transform: 'scale(0)', opacity: 0.5 }}
          animate={{ transform: 'scale(2)', opacity: 0 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </motion.button>
  );
};

// Toggle switch with animation
export const AnimatedToggle = ({ 
  isOn, 
  toggleSwitch, 
  className = '',
  onColor = '#4CAF50',
  offColor = '#ccc',
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: { width: 36, height: 20, circle: 16 },
    md: { width: 48, height: 24, circle: 20 },
    lg: { width: 60, height: 30, circle: 26 },
  };
  
  const { width, height, circle } = sizes[size] || sizes.md;
  
  return (
    <motion.div
      className={`cursor-pointer rounded-full flex items-center p-1 ${className}`}
      onClick={toggleSwitch}
      style={{ 
        width,
        height,
        backgroundColor: isOn ? onColor : offColor,
        justifyContent: isOn ? 'flex-end' : 'flex-start',
      }}
      animate={{ backgroundColor: isOn ? onColor : offColor }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <motion.div
        className="bg-white rounded-full shadow-md"
        style={{ 
          width: circle,
          height: circle,
        }}
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
      />
    </motion.div>
  );
};

// Checkbox with checkmark animation
export const AnimatedCheckbox = ({ 
  checked, 
  onChange, 
  className = '',
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const boxSize = sizes[size] || sizes.md;
  
  const tickVariants = {
    checked: { 
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    unchecked: { 
      pathLength: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      className={`relative cursor-pointer border-2 rounded-md flex items-center justify-center ${className}`}
      style={{ 
        width: boxSize,
        height: boxSize,
        borderColor: checked ? '#4CAF50' : '#ccc',
        backgroundColor: checked ? '#4CAF50' : 'transparent',
      }}
      animate={{ 
        borderColor: checked ? '#4CAF50' : '#ccc',
        backgroundColor: checked ? '#4CAF50' : 'transparent',
      }}
      onClick={onChange}
      {...props}
    >
      <svg
        width={boxSize * 0.7}
        height={boxSize * 0.7}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={tickVariants}
          animate={checked ? 'checked' : 'unchecked'}
          initial={false}
        />
      </svg>
    </motion.div>
  );
};

// Radio button with pulse animation
export const AnimatedRadio = ({ 
  checked, 
  onChange, 
  className = '',
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: { outer: 16, inner: 8 },
    md: { outer: 20, inner: 10 },
    lg: { outer: 24, inner: 12 },
  };
  
  const { outer, inner } = sizes[size] || sizes.md;
  
  return (
    <motion.div
      className={`relative cursor-pointer border-2 rounded-full flex items-center justify-center ${className}`}
      style={{ 
        width: outer,
        height: outer,
        borderColor: checked ? '#4CAF50' : '#ccc'
      }}
      animate={{ borderColor: checked ? '#4CAF50' : '#ccc' }}
      onClick={onChange}
      {...props}
    >
      <motion.div
        className="bg-green-600 rounded-full"
        initial={false}
        animate={{ 
          width: checked ? inner : 0,
          height: checked ? inner : 0,
          opacity: checked ? 1 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
    </motion.div>
  );
};

// Notification dot/badge with pulse effect
export const NotificationBadge = ({ 
  count, 
  className = '',
  maxCount = 99,
  size = 'md',
  ...props 
}) => {
  const show = count > 0;
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  const sizes = {
    sm: { minWidth: 16, height: 16, fontSize: 8 },
    md: { minWidth: 20, height: 20, fontSize: 10 },
    lg: { minWidth: 24, height: 24, fontSize: 12 },
  };
  
  const { minWidth, height, fontSize } = sizes[size] || sizes.md;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`flex items-center justify-center rounded-full bg-red-500 text-white font-bold ${className}`}
          style={{ 
            minWidth,
            height,
            fontSize,
            padding: count > 9 ? '0 6px' : 0
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          {...props}
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {displayCount}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Button that shows a success/error status
export const StatusButton = ({ 
  children, 
  onClick, 
  className = '',
  status = null, // null, 'loading', 'success', 'error'
  loadingText = 'Loading...',
  successText = 'Success!',
  errorText = 'Error!',
  resetDelay = 2000, // ms to reset after success/error
  onReset = () => {},
  ...props 
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (status === 'loading') {
      controls.start({
        width: 'auto',
        transition: { duration: 0.3 }
      });
    } else if (status === 'success') {
      controls.start({
        backgroundColor: '#4CAF50',
        width: 'auto',
        transition: { duration: 0.3 }
      });
      
      // Reset after delay
      const timer = setTimeout(() => {
        onReset();
      }, resetDelay);
      
      return () => clearTimeout(timer);
    } else if (status === 'error') {
      controls.start({
        backgroundColor: '#F44336',
        width: 'auto',
        transition: { duration: 0.3 }
      });
      
      // Reset after delay
      const timer = setTimeout(() => {
        onReset();
      }, resetDelay);
      
      return () => clearTimeout(timer);
    } else {
      controls.start({
        backgroundColor: '',
        width: 'auto',
        transition: { duration: 0.3 }
      });
    }
  }, [status, controls, resetDelay, onReset]);
  
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      animate={controls}
      onClick={status === null ? onClick : undefined}
      disabled={status !== null}
      whileTap={status === null ? { scale: 0.98 } : {}}
      whileHover={status === null ? { scale: 1.02 } : {}}
      {...props}
    >
      <AnimatePresence mode="wait">
        {status === null && (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
        )}
        
        {status === 'loading' && (
          <motion.span
            key="loading"
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="inline-block w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {loadingText}
          </motion.span>
        )}
        
        {status === 'success' && (
          <motion.span
            key="success"
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
            {successText}
          </motion.span>
        )}
        
        {status === 'error' && (
          <motion.span
            key="error"
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
            {errorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Tooltip that appears on hover
export const AnimatedTooltip = ({ 
  children, 
  content, 
  className = '',
  position = 'top', // top, bottom, left, right
  delay = 0.3,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    let timeout;
    if (isHovered) {
      timeout = setTimeout(() => {
        setShowTooltip(true);
      }, delay * 1000);
    } else {
      setShowTooltip(false);
    }
    
    return () => clearTimeout(timeout);
  }, [isHovered, delay]);
  
  const getTooltipPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
    }
  };
  
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      ...(['top', 'bottom'].includes(position) 
        ? { y: position === 'top' ? 10 : -10 }
        : { x: position === 'left' ? 10 : -10 }),
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute z-50 bg-gray-800 text-white text-sm p-2 rounded whitespace-nowrap"
            style={getTooltipPositionStyles()}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {content}
            <div 
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                position === 'top' ? 'bottom-0 translate-y-1/2' : 
                position === 'bottom' ? 'top-0 -translate-y-1/2' :
                position === 'left' ? 'right-0 translate-x-1/2' :
                'left-0 -translate-x-1/2'
              } ${
                ['top', 'bottom'].includes(position) ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated input field with focus effects
export const AnimatedInput = ({ 
  value,
  onChange,
  placeholder = "",
  className = '',
  focusScale = 1.02,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ 
        scale: isFocused ? focusScale : 1,
        boxShadow: isFocused ? '0 0 0 2px rgba(66, 153, 225, 0.5)' : 'none'
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full p-2 border rounded outline-none transition-colors bg-white dark:bg-gray-800"
        {...props}
      />
    </motion.div>
  );
};

// Collection of all micro-interactions
export default {
  PopButton,
  HoverCard,
  AnimatedIcon,
  TypeWriter,
  RippleButton,
  AnimatedToggle,
  AnimatedCheckbox,
  AnimatedRadio,
  NotificationBadge,
  StatusButton,
  AnimatedTooltip,
  AnimatedInput
}; 