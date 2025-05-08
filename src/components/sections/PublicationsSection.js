import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ResearchIcon, SafetyIcon, AIIcon, BuildingIcon, AnalysisIcon } from '../ui/AnimatedIcons';
import { HoverCard } from '../animations/MicroInteractions';
import ScrollTriggerAnimation, { ScrollTriggeredSequence } from '../animations/ScrollTriggerAnimations';

// Sample publications data
const publicationsData = [
  {
    id: 1,
    title: "Machine Learning Framework for Predicting Structural Response under Seismic Loading",
    authors: ["Sattar Hedayat", "J. Smith", "A. Johnson"],
    journal: "Journal of Structural Engineering",
    year: 2023,
    volume: "149(5)",
    pages: "1432-1448",
    doi: "10.1061/(ASCE)ST.1943-541X.0003456",
    abstract: "This paper presents a novel machine learning framework for predicting structural responses under various seismic loading scenarios.",
    keywords: ["Machine Learning", "Seismic Analysis", "Neural Networks"],
    citations: 8,
    category: "ai",
    featured: true,
  },
  {
    id: 2,
    title: "Real-time Structural Health Monitoring Using IoT Sensors and Edge Computing",
    authors: ["Sattar Hedayat", "R. Brown", "L. Zhang"],
    journal: "Structural Health Monitoring",
    year: 2022,
    volume: "21(3)",
    pages: "893-912",
    doi: "10.1177/14759217221089654",
    abstract: "A comprehensive system for real-time structural health monitoring is developed using IoT sensors and edge computing.",
    keywords: ["Structural Health Monitoring", "IoT", "Edge Computing"],
    citations: 12,
    category: "monitoring",
    featured: true,
  },
  {
    id: 3,
    title: "Comparative Study of Novel Earthquake-Resistant Materials for High-Rise Buildings",
    authors: ["Sattar Hedayat", "T. Williams", "H. Lee", "M. Garcia"],
    journal: "Construction and Building Materials",
    year: 2021,
    volume: "312",
    pages: "125344",
    doi: "10.1016/j.conbuildmat.2021.125344",
    abstract: "This study evaluates the performance of three novel composite materials for seismic resistance in high-rise buildings.",
    keywords: ["Earthquake Resistance", "Composite Materials", "High-Rise Buildings"],
    citations: 24,
    category: "materials",
    featured: true,
  },
  {
    id: 4,
    title: "Optimized Building Designs for Extreme Weather Events using Computational Fluid Dynamics",
    authors: ["Sattar Hedayat", "P. Anderson", "J. Chen"],
    journal: "Journal of Wind Engineering and Industrial Aerodynamics",
    year: 2022,
    volume: "230",
    pages: "105147",
    doi: "10.1016/j.jweia.2022.105147",
    abstract: "A multi-objective optimization approach is proposed for building designs subjected to extreme weather events.",
    keywords: ["Wind Engineering", "Extreme Weather", "Building Design"],
    citations: 9,
    category: "design",
    featured: false,
  },
  {
    id: 5,
    title: "Deep Reinforcement Learning for Adaptive Structural Control Systems",
    authors: ["Sattar Hedayat", "M. Wilson", "K. Park"],
    journal: "Computer-Aided Civil and Infrastructure Engineering",
    year: 2022,
    volume: "37(1)",
    pages: "45-63",
    doi: "10.1111/cace.12567",
    abstract: "This research demonstrates the application of deep reinforcement learning for the development of adaptive structural control systems.",
    keywords: ["Reinforcement Learning", "Structural Control", "Artificial Intelligence"],
    citations: 15,
    category: "ai",
    featured: false,
  },
  {
    id: 6,
    title: "Neural Networks for Enhanced Modal Analysis in Structural Health Monitoring",
    authors: ["Sattar Hedayat", "L. Thompson", "S. Kim"],
    journal: "Engineering Structures",
    year: 2021,
    volume: "246",
    pages: "113075",
    doi: "10.1016/j.engstruct.2021.113075",
    abstract: "A novel approach to modal analysis is proposed using convolutional neural networks to process vibration data.",
    keywords: ["Modal Analysis", "Neural Networks", "Structural Health Monitoring"],
    citations: 18,
    category: "monitoring",
    featured: false,
  }
];

// Category definitions
const categories = [
  { id: 'all', name: 'All Publications', icon: <ResearchIcon size={24} animate={false} /> },
  { id: 'ai', name: 'AI & Machine Learning', icon: <AIIcon size={24} animate={false} /> },
  { id: 'monitoring', name: 'Structural Monitoring', icon: <SafetyIcon size={24} animate={false} /> },
  { id: 'design', name: 'Structural Design', icon: <BuildingIcon size={24} animate={false} /> },
  { id: 'materials', name: 'Advanced Materials', icon: <AnalysisIcon size={24} animate={false} /> },
];

const PublicationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPublications, setFilteredPublications] = useState(publicationsData);
  
  // Filter publications based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPublications(publicationsData);
    } else {
      setFilteredPublications(publicationsData.filter(pub => pub.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  // Format authors list
  const formatAuthors = (authors) => {
    if (authors.length <= 2) return authors.join(' & ');
    return `${authors[0]}, et al.`;
  };
  
  // Featured publications section
  const FeaturedPublications = () => (
    <ScrollTriggerAnimation animationVariant="fadeIn" className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Featured Publications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publicationsData
          .filter(pub => pub.featured)
          .map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              featured={true}
            />
          ))
        }
      </div>
    </ScrollTriggerAnimation>
  );
  
  // Publication card component
  const PublicationCard = ({ publication, featured = false }) => (
    <HoverCard className={`
      flex flex-col h-full overflow-hidden rounded-xl shadow-md
      ${featured 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' 
        : 'bg-white dark:bg-gray-800'
      }
    `}>
      <div className="p-5 flex-grow flex flex-col">
        {featured && (
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-1">
              Featured
            </span>
          </div>
        )}
        
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white leading-tight">
          {publication.title}
        </h3>
        
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
          {formatAuthors(publication.authors)}
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {publication.journal}, {publication.year}, {publication.volume}
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
          DOI: {publication.doi}
        </p>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
          {publication.abstract}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {publication.keywords.slice(0, 3).map((keyword, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-1"
            >
              {keyword}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {publication.citations} citations
          </div>
          
          <Link 
            href={`/publications/${publication.id}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View Publication
          </Link>
        </div>
      </div>
    </HoverCard>
  );
  
  // Filter button component
  const FilterButton = ({ isActive, onClick, children }) => (
    <motion.button
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
  
  // Category filters
  const CategoryFilters = () => (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Filter by Research Area</h3>
      
      <div className="flex flex-wrap gap-3">
        {categories.map(category => (
          <FilterButton 
            key={category.id}
            isActive={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </div>
          </FilterButton>
        ))}
      </div>
    </div>
  );
  
  // Publication listing section
  const PublicationsList = () => (
    <div>
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Recent Publications
      </h3>
      
      <ScrollTriggeredSequence
        variant="fadeInUp"
        delayIncrement={0.05}
        containerClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredPublications.map(publication => (
          <PublicationCard
            key={publication.id}
            publication={publication}
          />
        ))}
      </ScrollTriggeredSequence>
    </div>
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollTriggerAnimation animationVariant="fadeInUp" className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Publications & Research
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Advancing the field through pioneering research and scholarly contributions
          in structural engineering and artificial intelligence.
        </p>
      </ScrollTriggerAnimation>
      
      <FeaturedPublications />
      <CategoryFilters />
      <PublicationsList />
      
      <ScrollTriggerAnimation animationVariant="fadeIn" className="mt-12 text-center">
        <Link 
          href="/publications" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-colors"
        >
          View All Publications
        </Link>
      </ScrollTriggerAnimation>
    </div>
  );
};

export default PublicationsSection; 