import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  time: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-300 dark:bg-gray-700 z-0" />
      
      {/* Timeline items */}
      <div className="relative z-10">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`flex flex-col md:flex-row items-center md:items-start mb-12 last:mb-0`}
          >
            {/* Timeline circle */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 w-8 h-8 rounded-full z-10 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 w-3 h-3 rounded-full" />
              </div>
              <div className="text-center md:text-right font-bold mt-2 md:mt-0 md:mb-0">
                {item.time}
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md md:ml-8 mt-4 md:mt-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              {item.subtitle && (
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium">
                  {item.subtitle}
                </div>
              )}
              <div className="text-gray-700 dark:text-gray-300">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 