import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Button = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  isFullWidth = false,
  isOutlined = false,
  isDisabled = false,
  withIcon = false,
  iconPosition = 'right',
  className = '',
  animate = true,
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  // Rounded corner classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Variant classes (solid, outlined, text)
  const variantClasses = isOutlined
    ? {
        primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
        success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
        danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
        warning: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
        info: 'border-2 border-sky-600 text-sky-600 hover:bg-sky-50 focus:ring-sky-500',
        dark: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-50 focus:ring-gray-500',
        light: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
        gradient: 'border-2 border-transparent bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:ring-blue-500',
      }
    : {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
        dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500',
        light: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300',
        gradient: 'text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:ring-blue-500',
      };
  
  // Disabled classes
  const disabledClasses = 'opacity-60 cursor-not-allowed pointer-events-none';
  
  // Full width class
  const fullWidthClass = isFullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${variantClasses[variant]}
    ${isDisabled ? disabledClasses : ''}
    ${fullWidthClass}
    ${className}
  `;
  
  // Animation variants
  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.97
    }
  };
  
  // Handle spacing for icons
  const iconSpacing = withIcon ? (iconPosition === 'right' ? 'space-x-2' : 'space-x-reverse space-x-2') : '';
  
  // Create button content with potential icon spacing
  const buttonContent = (
    <span className={`inline-flex items-center ${iconSpacing}`}>
      {withIcon && iconPosition === 'left' && <span className="button-icon">{props.icon}</span>}
      <span>{children}</span>
      {withIcon && iconPosition === 'right' && <span className="button-icon">{props.icon}</span>}
    </span>
  );
  
  // Return either a link or button based on whether href is provided
  if (href) {
    return (
      <Link href={href} passHref>
        <motion.a
          className={buttonClasses}
          whileHover={animate ? "hover" : undefined}
          whileTap={animate ? "tap" : undefined}
          variants={buttonVariants}
          {...props}
        >
          {buttonContent}
        </motion.a>
      </Link>
    );
  }
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={animate && !isDisabled ? "hover" : undefined}
      whileTap={animate && !isDisabled ? "tap" : undefined}
      variants={buttonVariants}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button; 