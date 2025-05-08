import React from 'react';
import { motion } from 'framer-motion';

// Interface for icon props
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Animation variants for the icons
const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95,
    rotate: 0,
    transition: { duration: 0.1 }
  }
};

/**
 * Structural Engineering Icon
 */
export const StructureIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </motion.svg>
  );
};

/**
 * Earthquake/Seismic Analysis Icon
 */
export const EarthquakeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <path d="M2 12h2l4-8 3 16 3-8 3 8h5" />
      <path d="M21 12v6" strokeDasharray="2" />
      <path d="M3 12v6" strokeDasharray="2" />
    </motion.svg>
  );
};

/**
 * AI/Machine Learning Icon
 */
export const AIIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M6 8h.01M6 12h.01" />
      <path d="M12 8h.01M12 12h.01" />
      <path d="M18 8h.01M18 12h.01" />
    </motion.svg>
  );
};

/**
 * Education/Academic Icon
 */
export const EducationIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <path d="M2 3h20v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <path d="M12 12v5" />
      <path d="M12 12l4 2" />
      <path d="M12 12l-4 2" />
    </motion.svg>
  );
};

/**
 * Research Icon
 */
export const ResearchIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
      <line x1="11" y1="8" x2="11" y2="14" />
    </motion.svg>
  );
};

/**
 * Publications Icon
 */
export const PublicationsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <line x1="8" y1="7" x2="15" y2="7" />
      <line x1="8" y1="11" x2="15" y2="11" />
      <line x1="8" y1="15" x2="15" y2="15" />
    </motion.svg>
  );
};

/**
 * Analysis Icon
 */
export const AnalysisIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
      <polyline points="7.5 19.79 7.5 14.6 3 12" />
      <polyline points="21 12 16.5 14.6 16.5 19.79" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </motion.svg>
  );
}; 