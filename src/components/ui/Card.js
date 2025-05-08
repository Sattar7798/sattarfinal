import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Card = ({
  children,
  className = '',
  elevation = 'md',
  variant = 'default',
  direction = 'vertical',
  hoverEffect = true,
  clickable = false,
  href,
  onClick,
  ...props
}) => {
  // Base classes for all cards
  const baseClasses = 'overflow-hidden transition-all duration-300';
  
  // Elevation/shadow classes
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 rounded-lg',
    outlined: 'border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent',
    filled: 'bg-gray-100 dark:bg-gray-900 rounded-lg',
    elevated: 'bg-white dark:bg-gray-800 rounded-lg shadow-md',
    rounded: 'bg-white dark:bg-gray-800 rounded-3xl',
  };
  
  // Direction classes
  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
  };
  
  // Hover effect classes
  const hoverClasses = hoverEffect 
    ? 'hover:shadow-lg hover:-translate-y-1'
    : '';
  
  // Clickable classes
  const clickableClasses = clickable || href
    ? 'cursor-pointer'
    : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${elevationClasses[elevation]}
    ${variantClasses[variant]}
    ${directionClasses[direction]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `;
  
  // Card variants for animation
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: hoverEffect ? {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    } : {},
    tap: clickable || href ? {
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {}
  };
  
  // Handle card click
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  // Create the card content
  const cardContent = (
    <motion.div
      className={cardClasses}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.div>
  );
  
  // Return a linked card if href is provided
  if (href) {
    return (
      <Link href={href} passHref>
        <a className="no-underline">{cardContent}</a>
      </Link>
    );
  }
  
  // Otherwise return a regular card
  return cardContent;
};

// Card Header subcomponent
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

// Card Body subcomponent
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-5 pt-0 flex-grow ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer subcomponent
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-5 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Card Image subcomponent
Card.Image = ({ 
  src, 
  alt = '', 
  width = 1200, 
  height = 630, 
  className = '',
  position = 'top',
  objectFit = 'cover',
  ...props 
}) => {
  // Position classes
  const positionClasses = {
    top: 'order-first',
    bottom: 'order-last',
    left: 'order-first',
    right: 'order-last',
  };
  
  return (
    <div className={`relative w-full overflow-hidden ${positionClasses[position]} ${className}`} {...props}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        objectFit={objectFit}
        layout="responsive"
      />
    </div>
  );
};

// Card Title subcomponent
Card.Title = ({ children, className = '', as = 'h3', ...props }) => {
  const Component = as;
  return (
    <Component className={`text-xl font-bold mb-2 text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Card Subtitle subcomponent
Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={`text-sm mb-4 text-gray-600 dark:text-gray-400 ${className}`} {...props}>
    {children}
  </p>
);

// Card Text subcomponent
Card.Text = ({ children, className = '', ...props }) => (
  <p className={`text-gray-700 dark:text-gray-300 ${className}`} {...props}>
    {children}
  </p>
);

// Card Actions subcomponent
Card.Actions = ({ children, className = '', position = 'end', ...props }) => {
  const positionClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  return (
    <div className={`flex items-center mt-4 ${positionClasses[position]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card; 