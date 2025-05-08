import React, { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';

// Types for different micro-interaction components
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'small' | 'medium' | 'large';
  hoverScale?: number;
  hoverElevation?: boolean;
  whileTapScale?: number;
  ripple?: boolean;
};

type IconButtonProps = ButtonProps & {
  label: string;
};

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & MotionProps & {
  children: ReactNode;
  underline?: boolean;
  hoverColor?: string;
};

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  bgColorFrom?: string;
  bgColorTo?: string;
};

type TooltipProps = {
  children: ReactNode;
  tooltip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
};

// Animation variants
const buttonVariants: Record<string, Variants> = {
  primary: {
    rest: { scale: 1, boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)' },
    hover: { scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)' },
  },
  secondary: {
    rest: { scale: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' },
    hover: { scale: 1.03, boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)' },
    tap: { scale: 0.97, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' },
  },
  subtle: {
    rest: { scale: 1, backgroundColor: 'transparent' },
    hover: { scale: 1.02, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
    tap: { scale: 0.98, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  },
};

const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  },
};

const linkVariants: Variants = {
  rest: { backgroundSize: '0% 2px' },
  hover: { 
    color: '#3182ce', 
    backgroundSize: '100% 2px',
    transition: { duration: 0.3 }
  }
};

// Components
export const AnimatedButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  hoverScale = 1.05,
  hoverElevation = true,
  whileTapScale = 0.95,
  ripple = true,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };

  // Color variants
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    subtle: 'bg-transparent hover:bg-gray-100 text-gray-700'
  };

  const animationVariant = buttonVariants[variant] || buttonVariants.primary;

  return (
    <motion.button
      className={`rounded font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className} transition-colors`}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={animationVariant}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const AnimatedIconButton: React.FC<IconButtonProps> = ({
  children,
  label,
  variant = 'subtle',
  size = 'medium',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3',
  };

  return (
    <motion.button
      aria-label={label}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants[variant]}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const AnimatedLink: React.FC<LinkProps> = ({
  children,
  underline = true,
  hoverColor = '#3182ce', // Tailwind blue-600
  className = '',
  ...props
}) => {
  const underlineStyle = underline 
    ? {
        backgroundImage: 'linear-gradient(currentColor, currentColor)',
        backgroundPosition: '0 100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '0% 2px',
        transition: 'background-size 0.3s',
      }
    : {};

  return (
    <motion.a
      className={`inline-block relative ${className}`}
      style={underlineStyle}
      initial="rest"
      whileHover="hover"
      variants={linkVariants}
      {...props}
    >
      {children}
    </motion.a>
  );
};

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  hoverScale = 1.03,
  hoverRotate = 0,
  bgColorFrom = 'rgba(255, 255, 255, 0.8)',
  bgColorTo = 'rgba(255, 255, 255, 1)',
}) => {
  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${className}`}
      initial={{ 
        scale: 1, 
        rotate: 0, 
        background: bgColorFrom,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      whileHover={{ 
        scale: hoverScale, 
        rotate: hoverRotate, 
        background: bgColorTo,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 15 
      }}
    >
      {children}
    </motion.div>
  );
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  tooltip,
  position = 'top',
  delay = 0.3,
  maxWidth = 200,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: { bottom: '100%', marginBottom: 5, left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: '100%', marginTop: 5, left: '50%', transform: 'translateX(-50%)' },
    left: { right: '100%', marginRight: 5, top: '50%', transform: 'translateY(-50%)' },
    right: { left: '100%', marginLeft: 5, top: '50%', transform: 'translateY(-50%)' },
  };

  return (
    <div 
      className="relative inline-block" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <motion.div
        className="absolute z-50 px-2 py-1 text-sm bg-gray-900 text-white rounded pointer-events-none"
        style={{ 
          ...positionStyles[position],
          maxWidth,
        }}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={tooltipVariants}
      >
        {tooltip}
      </motion.div>
    </div>
  );
};

// Export default object for convenient import
const MicroInteractions = {
  Button: AnimatedButton,
  IconButton: AnimatedIconButton,
  Link: AnimatedLink,
  HoverCard,
  Tooltip,
};

export default MicroInteractions; 