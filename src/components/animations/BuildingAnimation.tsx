import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface BuildingAnimationProps {
  className?: string;
}

const BuildingAnimation: React.FC<BuildingAnimationProps> = ({ className = '' }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const buildingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const floorVariants = {
    hidden: { opacity: 0, scaleX: 0.8 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // Generate a simple skyscraper with 8 floors
  const floors = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className={`h-8 bg-blue-${500 - i * 30} rounded-sm shadow-md mb-1`}
      variants={floorVariants}
      style={{ position: 'relative', zIndex: 1 }}
    />
  ));
  
  return (
    <motion.div 
      ref={ref}
      className={`w-40 mx-auto ${className}`}
      initial="hidden"
      animate={controls}
      variants={buildingVariants}
      style={{ 
        position: 'relative', 
        zIndex: 1,
        isolation: 'isolate'
      }}
    >
      {/* Roof */}
      <motion.div 
        className="h-8 w-32 mx-auto bg-blue-800 rounded-t-lg shadow-lg"
        variants={floorVariants}
        style={{ position: 'relative', zIndex: 1 }}
      />
      
      {/* Building floors */}
      <div className="px-4" style={{ position: 'relative', zIndex: 1 }}>
        {floors}
      </div>
      
      {/* Base/Foundation */}
      <motion.div 
        className="h-4 bg-gray-700 rounded-b-sm shadow-xl"
        variants={floorVariants}
        style={{ position: 'relative', zIndex: 1 }}
      />
      
      {/* Ground */}
      <motion.div 
        className="mt-2 h-2 bg-green-700 rounded-sm w-64 -mx-12"
        variants={{
          hidden: { opacity: 0, scaleX: 0.5 },
          visible: { 
            opacity: 1, 
            scaleX: 1,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.6 }
          }
        }}
        style={{ 
          position: 'relative', 
          zIndex: 1,
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      />
    </motion.div>
  );
};

export default BuildingAnimation; 