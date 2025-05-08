import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Path animation variants
const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom) => ({ 
    pathLength: 1,
    opacity: 1,
    transition: { 
      pathLength: { 
        type: "spring",
        duration: 1.5,
        bounce: 0, 
        delay: custom * 0.2
      },
      opacity: { duration: 0.2 }
    }
  })
};

// Base icon component
export const AnimatedIcon = ({ 
  children, 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2,
  animate = true,
  viewBox = "0 0 24 24",
  className = "",
  onClick,
  ...props 
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
      whileTap={animate ? "tap" : undefined}
      variants={iconVariants}
      className={`inline-block ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.svg>
  );
};

// Building icon
export const BuildingIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.rect variants={pathVariants} custom={0} x="4" y="2" width="16" height="20" rx="2" />
    <motion.line variants={pathVariants} custom={1} x1="9" y1="22" x2="9" y2="22" />
    <motion.line variants={pathVariants} custom={1} x1="15" y1="22" x2="15" y2="22" />
    <motion.line variants={pathVariants} custom={2} x1="8" y1="6" x2="16" y2="6" />
    <motion.line variants={pathVariants} custom={3} x1="8" y1="10" x2="16" y2="10" />
    <motion.line variants={pathVariants} custom={4} x1="8" y1="14" x2="16" y2="14" />
    <motion.line variants={pathVariants} custom={5} x1="8" y1="18" x2="16" y2="18" />
  </AnimatedIcon>
);

// Earthquake icon
export const EarthquakeIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M2 12h2l3-9 3 15 3-15 3 9h8" />
    <motion.line variants={pathVariants} custom={1} x1="2" y1="20" x2="22" y2="20" />
  </AnimatedIcon>
);

// AI / Brain icon
export const AIIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M12 2a8 8 0 0 0-8 8v2a8 8 0 0 0 16 0v-2a8 8 0 0 0-8-8z" />
    <motion.path variants={pathVariants} custom={1} d="M9 12h.01" />
    <motion.path variants={pathVariants} custom={1} d="M15 12h.01" />
    <motion.path variants={pathVariants} custom={2} d="M8 16s1.5 2 4 2 4-2 4-2" />
    <motion.path variants={pathVariants} custom={3} d="M9.5 9a.5.5 0 0 0 0-1" />
    <motion.path variants={pathVariants} custom={3} d="M14.5 9a.5.5 0 0 0 0-1" />
    <motion.path variants={pathVariants} custom={4} d="M3 10h2" />
    <motion.path variants={pathVariants} custom={4} d="M19 10h2" />
    <motion.path variants={pathVariants} custom={5} d="M5 6l3 2" />
    <motion.path variants={pathVariants} custom={5} d="M16 8l3-2" />
  </AnimatedIcon>
);

// Blueprint icon
export const BlueprintIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.rect variants={pathVariants} custom={0} x="2" y="2" width="20" height="20" rx="2" />
    <motion.path variants={pathVariants} custom={1} d="M9 2v20" />
    <motion.path variants={pathVariants} custom={2} d="M2 9h20" />
    <motion.circle variants={pathVariants} custom={3} cx="6" cy="6" r="1" />
    <motion.rect variants={pathVariants} custom={4} x="12" y="12" width="8" height="8" />
    <motion.path variants={pathVariants} custom={5} d="M12 12L6 6" />
  </AnimatedIcon>
);

// Model / 3D icon
export const ModelIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M12 2l8 4v12l-8 4-8-4V6l8-4z" />
    <motion.path variants={pathVariants} custom={1} d="M12 22V10" />
    <motion.path variants={pathVariants} custom={2} d="M4 6l8 4 8-4" />
  </AnimatedIcon>
);

// Grid / Structure icon
export const StructureIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M4 4h16v16H4z" />
    <motion.path variants={pathVariants} custom={1} d="M4 12h16" />
    <motion.path variants={pathVariants} custom={2} d="M12 4v16" />
    <motion.circle variants={pathVariants} custom={3} cx="12" cy="12" r="1" />
    <motion.circle variants={pathVariants} custom={4} cx="4" cy="4" r="1" />
    <motion.circle variants={pathVariants} custom={4} cx="20" cy="4" r="1" />
    <motion.circle variants={pathVariants} custom={4} cx="4" cy="20" r="1" />
    <motion.circle variants={pathVariants} custom={4} cx="20" cy="20" r="1" />
  </AnimatedIcon>
);

// Research / Document icon
export const ResearchIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <motion.path variants={pathVariants} custom={1} d="M14 2v6h6" />
    <motion.path variants={pathVariants} custom={2} d="M9 14h6" />
    <motion.path variants={pathVariants} custom={3} d="M9 18h6" />
    <motion.path variants={pathVariants} custom={4} d="M9 10h1" />
  </AnimatedIcon>
);

// Analysis icon
export const AnalysisIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M2 20h20" />
    <motion.path variants={pathVariants} custom={1} d="M5 4v16" />
    <motion.path variants={pathVariants} custom={2} d="M5 4l5 4" />
    <motion.path variants={pathVariants} custom={2} d="M10 8l4 -3" />
    <motion.path variants={pathVariants} custom={3} d="M14 5l4 5" />
    <motion.path variants={pathVariants} custom={4} d="M18 10l-2 3" />
    <motion.path variants={pathVariants} custom={5} d="M16 13l-5 2" />
    <motion.path variants={pathVariants} custom={6} d="M11 15l-3 -1" />
  </AnimatedIcon>
);

// Strength / Support icon
export const StrengthIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v13" />
    <motion.path variants={pathVariants} custom={1} d="M4 21h16" />
    <motion.path variants={pathVariants} custom={2} d="M12 21v-9" />
    <motion.path variants={pathVariants} custom={3} d="M8 8h8" />
    <motion.path variants={pathVariants} custom={4} d="M8 12h8" />
  </AnimatedIcon>
);

// Data / Graph icon
export const DataIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M4 4v16h16" />
    <motion.path variants={pathVariants} custom={1} d="M4 16l4-4 4 4 8-8" />
    <motion.circle variants={pathVariants} custom={2} cx="8" cy="12" r="1" />
    <motion.circle variants={pathVariants} custom={2} cx="12" cy="16" r="1" />
    <motion.circle variants={pathVariants} custom={2} cx="16" cy="8" r="1" />
  </AnimatedIcon>
);

// Safety / Shield icon
export const SafetyIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M12 3L4 7v6c0 5.523 3.477 10 8 10s8-4.477 8-10V7l-8-4z" />
    <motion.path variants={pathVariants} custom={1} d="M9 12l2 2 4-4" />
  </AnimatedIcon>
);

// Publication icon
export const PublicationIcon = (props) => (
  <AnimatedIcon {...props} viewBox="0 0 24 24">
    <motion.path variants={pathVariants} custom={0} d="M22 4v16H2V4h20z" />
    <motion.path variants={pathVariants} custom={1} d="M2 10h20" />
    <motion.path variants={pathVariants} custom={2} d="M6 4v16" />
    <motion.path variants={pathVariants} custom={3} d="M10 14h8" />
    <motion.path variants={pathVariants} custom={4} d="M10 18h8" />
    <motion.circle variants={pathVariants} custom={5} cx="4" cy="7" r="1" />
    <motion.circle variants={pathVariants} custom={5} cx="4" cy="13" r="1" />
    <motion.circle variants={pathVariants} custom={5} cx="4" cy="19" r="1" />
  </AnimatedIcon>
);

// Contact icon
export const ContactIcon = (props) => (
  <AnimatedIcon {...props}>
    <motion.path variants={pathVariants} custom={0} d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
    <motion.path variants={pathVariants} custom={1} d="M22 6l-10 7L2 6" />
  </AnimatedIcon>
);

// Spinner icon (for loading)
export const SpinnerIcon = ({ size = 24, color = "currentColor", className = "", ...props }) => (
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
    className={`animate-spin ${className}`}
    {...props}
  >
    <motion.circle cx="12" cy="12" r="10" opacity="0.25" />
    <motion.path 
      d="M12 2a10 10 0 0 1 10 10" 
      opacity="0.75"
    />
  </motion.svg>
);

// For interactive elements (buttons, toggles)
export const AnimatedIconButton = ({ 
  icon: Icon, 
  onClick, 
  label,
  showLabel = false,
  className = "",
  iconProps = {},
  ...props 
}) => {
  return (
    <motion.button
      className={`inline-flex items-center justify-center ${showLabel ? 'p-2' : 'p-2'} rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon {...iconProps} />
      {showLabel && (
        <span className="ml-2 text-sm">{label}</span>
      )}
    </motion.button>
  );
};

export default {
  BuildingIcon,
  EarthquakeIcon,
  AIIcon,
  BlueprintIcon,
  ModelIcon,
  StructureIcon,
  ResearchIcon,
  AnalysisIcon,
  StrengthIcon,
  DataIcon,
  SafetyIcon,
  PublicationIcon,
  ContactIcon,
  SpinnerIcon,
  AnimatedIconButton
};