import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ResearchIcon, AnalysisIcon, AIIcon, BuildingIcon } from '../ui/AnimatedIcons';
import Card from '../ui/Card';
import { ScrollProgressBar } from '../animations/ScrollTriggerAnimations';
import { HoverCard } from '../animations/MicroInteractions';
import ScrollTriggerAnimation, { ScrollTriggeredSequence } from '../animations/ScrollTriggerAnimations';

// Research categories
const categories = [
  {
    id: 'seismic',
    title: 'Seismic Engineering',
    icon: <AnalysisIcon size={32} animate={false} />,
    color: 'blue'
  },
  {
    id: 'ai',
    title: 'AI in Structural Engineering',
    icon: <AIIcon size={32} animate={false} />,
    color: 'purple'
  },
  {
    id: 'analysis',
    title: 'Advanced Structural Analysis',
    icon: <BuildingIcon size={32} animate={false} />,
    color: 'emerald'
  },
  {
    id: 'design',
    title: 'Innovative Design Methodologies',
    icon: <ResearchIcon size={32} animate={false} />,
    color: 'amber'
  }
];

// Research projects data
const researchProjects = [
  {
    id: 1,
    title: 'Machine Learning for Seismic Response Prediction',
    excerpt: 'Using neural networks to predict structural responses to seismic events with enhanced accuracy and reduced computational cost.',
    image: '/assets/images/research/seismic-ml.jpg',
    category: 'ai',
    year: '2022',
    link: '/research/seismic-ml',
    publications: 5,
    collaborators: ['Stanford University', 'MIT'],
    featured: true
  },
  {
    id: 2,
    title: 'Real-time Structural Health Monitoring',
    excerpt: 'Developing IoT-based systems that continuously monitor building integrity and provide early warning for potential structural issues.',
    image: '/assets/images/research/health-monitoring.jpg',
    category: 'analysis',
    year: '2021',
    link: '/research/health-monitoring',
    publications: 3,
    collaborators: ['Berkeley', 'Tokyo University'],
    featured: true
  },
  {
    id: 3,
    title: 'Novel Earthquake-Resistant Building Materials',
    excerpt: 'Research on composite materials that exhibit enhanced performance during seismic events while maintaining cost-effectiveness.',
    image: '/assets/images/research/earthquake-materials.jpg',
    category: 'seismic',
    year: '2020',
    link: '/research/earthquake-materials',
    publications: 7,
    collaborators: ['ETH Zurich', 'University of Tokyo'],
    featured: true
  },
  {
    id: 4,
    title: 'Optimized Building Designs for Extreme Weather',
    excerpt: 'Using computational fluid dynamics and AI optimization to create building designs resilient to hurricanes, tornados, and other extreme weather events.',
    image: '/assets/images/research/extreme-weather.jpg',
    category: 'design',
    year: '2023',
    link: '/research/extreme-weather',
    publications: 2,
    collaborators: ['NOAA', 'University of Miami'],
    featured: true
  },
  {
    id: 5,
    title: 'Reinforcement Learning for Adaptive Structural Controls',
    excerpt: 'Applying reinforcement learning techniques to develop structural control systems that adapt to changing environmental conditions.',
    image: '/assets/images/research/reinforcement-learning.jpg',
    category: 'ai',
    year: '2022',
    link: '/research/reinforcement-learning',
    publications: 4,
    collaborators: ['Google Research', 'Caltech'],
    featured: false
  },
  {
    id: 6,
    title: 'Neural Networks for Modal Analysis Enhancement',
    excerpt: 'Improving traditional modal analysis techniques with deep learning to identify structural damage patterns with greater accuracy.',
    image: '/assets/images/research/modal-analysis.jpg',
    category: 'analysis',
    year: '2021',
    link: '/research/modal-analysis',
    publications: 3,
    collaborators: ['Berkeley', 'Stanford'],
    featured: false
  },
  {
    id: 7,
    title: 'Probabilistic Seismic Hazard Assessment',
    excerpt: 'Developing advanced probabilistic models for better understanding regional seismic risks and building code implications.',
    image: '/assets/images/research/seismic-hazard.jpg',
    category: 'seismic',
    year: '2023',
    link: '/research/seismic-hazard',
    publications: 6,
    collaborators: ['USGS', 'Columbia University'],
    featured: false
  },
  {
    id: 8,
    title: 'Parametric Design Frameworks for Sustainable Structures',
    excerpt: 'Creating computational design methodologies that optimize for both structural integrity and environmental sustainability.',
    image: '/assets/images/research/parametric-design.jpg',
    category: 'design',
    year: '2020',
    link: '/research/parametric-design',
    publications: 4,
    collaborators: ['MIT', 'TU Delft'],
    featured: false
  }
];

// Research section with filters and interactive cards
const ResearchSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'all'
    ? researchProjects
    : researchProjects.filter(project => project.category === selectedCategory);
  
  // Get color based on category
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'gray';
  };
  
  // Featured projects section
  const FeaturedProjects = () => (
    <section className="mb-20">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Featured Research</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {researchProjects
          .filter(project => project.featured)
          .map((project, index) => (
            <ScrollTriggerAnimation
              key={project.id}
              animationVariant="fadeInUp"
              delay={index * 0.1}
              className="h-full"
            >
              <FeaturedProjectCard project={project} />
            </ScrollTriggerAnimation>
          ))
        }
      </div>
    </section>
  );
  
  // Featured project card with larger image and more details
  const FeaturedProjectCard = ({ project }) => (
    <HoverCard 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
      hoverScale={1.02}
    >
      <div className="relative h-60">
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 hover:scale-105"
        />
        <div className={`absolute top-4 right-4 bg-${getCategoryColor(project.category)}-600 text-white text-sm px-3 py-1 rounded-full`}>
          {categories.find(cat => cat.id === project.category)?.title}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {project.excerpt}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Year: {project.year}</span>
          <span>{project.publications} publications</span>
        </div>
        
        <Link 
          href={project.link} 
          className={`inline-flex items-center justify-center px-4 py-2 bg-${getCategoryColor(project.category)}-600 hover:bg-${getCategoryColor(project.category)}-700 text-white rounded-lg transition-colors self-start`}
        >
          View Research
        </Link>
      </div>
    </HoverCard>
  );
  
  // All projects in grid layout
  const ProjectsGrid = () => (
    <ScrollTriggeredSequence
      variant="fadeInUp"
      delayIncrement={0.05}
      containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredProjects.map(project => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          isHovered={hoveredProject === project.id}
          onHover={() => setHoveredProject(project.id)}
          onLeave={() => setHoveredProject(null)}
        />
      ))}
    </ScrollTriggeredSequence>
  );
  
  // Individual project card
  const ProjectCard = ({ project, isHovered, onHover, onLeave }) => (
    <HoverCard
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md h-full flex flex-col"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative h-48">
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className={`absolute top-3 right-3 bg-${getCategoryColor(project.category)}-600 text-white text-xs px-2 py-1 rounded-full`}>
          {categories.find(cat => cat.id === project.category)?.title}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {project.excerpt}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>{project.year}</span>
          <span>{project.publications} publications</span>
        </div>
        
        <Link 
          href={project.link} 
          className={`text-${getCategoryColor(project.category)}-600 hover:text-${getCategoryColor(project.category)}-800 text-sm font-medium`}
        >
          Learn more →
        </Link>
      </div>
    </HoverCard>
  );
  
  // Category filter buttons
  const CategoryFilters = () => (
    <div className="mb-10">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Filter by Research Area</h3>
      
      <div className="flex flex-wrap gap-3">
        <CategoryButton 
          isActive={selectedCategory === 'all'} 
          onClick={() => setSelectedCategory('all')}
        >
          All Research
        </CategoryButton>
        
        {categories.map(category => (
          <CategoryButton 
            key={category.id}
            isActive={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
            color={category.color}
          >
            <span className="flex items-center gap-2">
              {category.icon}
              {category.title}
            </span>
          </CategoryButton>
        ))}
      </div>
    </div>
  );
  
  // Category filter button component
  const CategoryButton = ({ children, isActive, onClick, color = 'blue' }) => (
    <motion.button
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? `bg-${color}-600 text-white` 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
  
  // Research statistics component
  const ResearchStats = () => (
    <ScrollTriggerAnimation animationVariant="fadeIn" className="mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <StatItem value="35+" label="Research Projects" />
        <StatItem value="120+" label="Publications" />
        <StatItem value="18" label="International Collaborations" />
        <StatItem value="12+" label="Industry Partnerships" />
      </div>
    </ScrollTriggerAnimation>
  );
  
  // Individual stat display
  const StatItem = ({ value, label }) => (
    <div className="text-center">
      <h4 className="text-3xl md:text-4xl font-bold mb-1">{value}</h4>
      <p className="text-sm md:text-base opacity-90">{label}</p>
    </div>
  );
  
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollProgressBar color="#4338ca" height={4} />
      
      <ScrollTriggerAnimation animationVariant="fadeInUp" className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          Research Areas & Projects
        </h2>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Exploring cutting-edge solutions at the intersection of structural engineering, 
          seismic analysis, and artificial intelligence.
        </p>
      </ScrollTriggerAnimation>
      
      <ResearchStats />
      <FeaturedProjects />
      <CategoryFilters />
      <ProjectsGrid />
      
      <ScrollTriggerAnimation animationVariant="fadeIn" className="mt-16 text-center">
        <Link 
          href="/research" 
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-medium transition-colors"
        >
          View All Research Projects
        </Link>
      </ScrollTriggerAnimation>
    </div>
  );
};

export default ResearchSection; 