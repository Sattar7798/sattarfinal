import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  text = '',
  className = '',
  ...props
}) => {
  // Size mapping
  const sizeMap = {
    xs: {
      spinner: 16,
      bar: { width: 100, height: 2 },
      dots: 6,
      pulse: 24,
    },
    sm: {
      spinner: 24,
      bar: { width: 150, height: 4 },
      dots: 8,
      pulse: 32,
    },
    md: {
      spinner: 36,
      bar: { width: 200, height: 6 },
      dots: 10,
      pulse: 48,
    },
    lg: {
      spinner: 48,
      bar: { width: 300, height: 8 },
      dots: 12,
      pulse: 64,
    },
    xl: {
      spinner: 64,
      bar: { width: 400, height: 10 },
      dots: 14,
      pulse: 96,
    },
  };

  // Color mapping
  const colorMap = {
    primary: 'text-blue-600 fill-blue-600',
    secondary: 'text-gray-600 fill-gray-600',
    success: 'text-green-600 fill-green-600',
    danger: 'text-red-600 fill-red-600',
    warning: 'text-yellow-600 fill-yellow-600',
    info: 'text-sky-600 fill-sky-600',
    light: 'text-gray-200 fill-gray-200',
    dark: 'text-gray-800 fill-gray-800',
  };

  // Bar color mapping for bg
  const barColorMap = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-sky-600',
    light: 'bg-gray-200',
    dark: 'bg-gray-800',
  };

  // Spinner component
  const Spinner = () => {
    const spinnerSize = sizeMap[size].spinner;
    return (
      <div className={`inline-block ${className}`} {...props}>
        <svg
          className={`animate-spin ${colorMap[color]}`}
          xmlns="http://www.w3.org/2000/svg"
          width={spinnerSize}
          height={spinnerSize}
          viewBox="0 0 24 24"
        >
          <path
            opacity="0.2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          />
          <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" />
          <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" />
        </svg>
        {text && <div className="mt-2 text-center">{text}</div>}
      </div>
    );
  };

  // Progress bar component
  const ProgressBar = () => {
    const { width, height } = sizeMap[size].bar;
    return (
      <div className={`relative ${className}`} {...props}>
        <div
          className="rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          style={{ width, height }}
        >
          <motion.div
            className={`h-full ${barColorMap[color]}`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </div>
        {text && <div className="mt-2 text-center">{text}</div>}
      </div>
    );
  };

  // Dots loader component
  const DotsLoader = () => {
    const dotSize = sizeMap[size].dots;
    const dotsVariants = {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.2,
        },
      },
    };

    const dotVariants = {
      initial: { y: 0 },
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    };

    return (
      <div className={`inline-flex items-center ${className}`} {...props}>
        <motion.div
          variants={dotsVariants}
          initial="initial"
          animate="animate"
          className="flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={dotVariants}
              custom={i}
              className={`w-${dotSize / 4} h-${dotSize / 4} rounded-full ${barColorMap[color]}`}
              style={{ width: dotSize, height: dotSize }}
            />
          ))}
        </motion.div>
        {text && <div className="ml-4">{text}</div>}
      </div>
    );
  };

  // Pulse loader component
  const PulseLoader = () => {
    const pulseSize = sizeMap[size].pulse;
    return (
      <div className={`inline-block relative ${className}`} {...props}>
        <div
          className={`absolute inset-0 ${barColorMap[color]} opacity-25 rounded-full animate-ping`}
          style={{ width: pulseSize, height: pulseSize }}
        />
        <div
          className={`relative ${barColorMap[color]} rounded-full`}
          style={{ width: pulseSize, height: pulseSize }}
        />
        {text && <div className="mt-2 text-center">{text}</div>}
      </div>
    );
  };

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        <div className="flex-1 space-y-3">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        {text && <div className="mt-2 text-center">{text}</div>}
      </div>
    );
  };

  // Render based on type
  switch (type) {
    case 'spinner':
      return <Spinner />;
    case 'bar':
      return <ProgressBar />;
    case 'dots':
      return <DotsLoader />;
    case 'pulse':
      return <PulseLoader />;
    case 'skeleton':
      return <SkeletonLoader />;
    default:
      return <Spinner />;
  }
};

// Container for centering loader on page or in component
Loader.Container = ({ children, fullScreen = false, className = '' }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50'
    : 'flex items-center justify-center w-full h-full';

  return <div className={`${containerClass} ${className}`}>{children}</div>;
};

// Skeleton component for content placeholders
Loader.Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1,
  ...props 
}) => {
  // Base skeleton class
  const baseClass = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse';
  
  // Variant specific classes
  const variantClass = {
    text: 'h-4',
    heading: 'h-8',
    avatar: 'rounded-full',
    thumbnail: 'rounded-md',
    button: 'h-10 rounded-md',
    card: 'rounded-lg',
  };

  // Style based on width/height props
  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || undefined,
  };

  if (variant === 'avatar' && !width && !height) {
    style.width = '48px';
    style.height = '48px';
  }

  if (variant === 'thumbnail' && !width && !height) {
    style.width = '100%';
    style.height = '200px';
  }

  if (variant === 'card' && !width && !height) {
    style.width = '100%';
    style.height = '320px';
  }

  // Create multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`${baseClass} ${variantClass[variant]}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export default Loader; 