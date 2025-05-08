'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AIIcon, StructureIcon, EarthquakeIcon } from '@/components/ui/AnimatedIcons';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Layout from '@/components/layout/LayoutFix';

// Publication type
type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  url: string;
  citations?: number;
  featured?: boolean;
};

export default function PublicationsPage() {
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Publication categories
  const categories = [
    { id: 'all', label: 'All Publications', icon: <StructureIcon size={20} /> },
    { id: 'seismic', label: 'Seismic Analysis', icon: <EarthquakeIcon size={20} /> },
    { id: 'ai', label: 'AI Integration', icon: <AIIcon size={20} /> },
    { id: 'sustainability', label: 'Sustainability', icon: <StructureIcon size={20} /> }
  ];
  
  // Real publications data from CV
  const publications: Publication[] = [
    {
      id: 'pub-1',
      title: 'Seismic Hazard and Structural Vulnerability: A Study of Building Damage in the 2017 Kermanshah Earthquake',
      authors: 'Hedayat, S., Ciampi, P., and Scarascia Mugnozza, G.',
      journal: 'In preparation',
      year: 2024,
      abstract: 'This paper analyzes the structural vulnerabilities and seismic resilience factors leading to building damage and collapse in the 2017 Kermanshah Earthquake, providing insights for improved structural design and seismic resilience strategies.',
      tags: ['Seismic Analysis', 'Structural Vulnerability', 'Earthquake Damage'],
      category: 'seismic',
      imageUrl: '/assets/images/publications/seismic-vulnerability.jpg',
      url: '/publications/seismic-vulnerability',
      featured: true
    },
    {
      id: 'pub-2',
      title: 'Advancing Infrastructure Resilience through Smart Monitoring: Insights from the Genoa Bridge Catastrophe',
      authors: 'Hedayat, S., Ziarati, T., Ciampi, P., Giannini, L.M.',
      journal: 'In preparation',
      year: 2024,
      abstract: 'This research evaluates the structural integrity and resilience of the Genoa San Giorgio Bridge using advanced analysis tools such as ABAQUS software, aiming to identify and address structural vulnerabilities that may have led to the tragic collapse of the bridge in 2018.',
      tags: ['Smart Monitoring', 'Infrastructure Resilience', 'Structural Analysis'],
      category: 'ai',
      imageUrl: '/assets/images/publications/bridge-monitoring.jpg',
      url: '/publications/bridge-monitoring',
      featured: true
    },
    {
      id: 'pub-3',
      title: "Iran's Seismic Puzzle: Bridging Gaps in Earthquake Emergency Planning and Public Awareness for Risk Reduction",
      authors: 'Ciampi, P., Giannini, L.M., Hedayat, S., Ziarati, T., and Scarascia Mugnozza, G.',
      journal: 'Italian Journal of Engineering Geology and Environment',
      year: 2024,
      doi: '10.4408/IJEGE.2024-01.O-01',
      abstract: 'This study designed surveys across various regions of Iran to gather data on public awareness of local hazard risks, utilizing QGIS and Excel to generate detailed maps and graphs integrating demographic, geographic, and hazard data. The research also modeled a machine learning system using XGBoost, Random Forests, and LSTM algorithms to predict potential earthquakes.',
      tags: ['Seismic Risk', 'Public Awareness', 'Emergency Planning', 'Machine Learning'],
      category: 'seismic',
      imageUrl: '/assets/images/publications/seismic-puzzle.jpg',
      url: 'https://doi.org/10.4408/IJEGE.2024-01.O-01',
      citations: 0
    },
    {
      id: 'pub-4',
      title: 'Smart Sustainability: The AI-Driven Future of Renewable Energy',
      authors: 'Ziarati, T., Hedayat, S., Moscatiello, C., Sappa, G., and Manganelli, M.',
      journal: '2024 IEEE International Conference on Environment and Electrical Engineering and 2024 IEEE Industrial and Commercial Power Systems Europe (EEEIC / ICPS Europe)',
      year: 2024,
      doi: '10.1109/EEEIC/ICPSEurope58172.2024.10689386',
      abstract: 'This paper explores the integration of AI with renewable energy, notably in promoting sustainability in smart cities. The research emphasizes creative solutions, resulting in groundbreaking discoveries demonstrating AI\'s revolutionary potential in enhancing sustainable practices in the renewable energy environment.',
      tags: ['AI', 'Renewable Energy', 'Smart Cities', 'Sustainability'],
      category: 'sustainability',
      imageUrl: '/assets/images/publications/smart-sustainability.jpg',
      url: 'https://doi.org/10.1109/EEEIC/ICPSEurope58172.2024.10689386',
      citations: 0
    }
  ];
  
  // Filter publications based on active filter and search query
  const filteredPublications = publications.filter(pub => {
    // Filter by category
    const categoryMatch = activeFilter === 'all' || pub.category === activeFilter;
    
    // Filter by search query
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    const searchMatch = searchTerms.length === 0 || searchTerms.every(term => 
      pub.title.toLowerCase().includes(term) || 
      pub.abstract.toLowerCase().includes(term) || 
      pub.tags.some(tag => tag.toLowerCase().includes(term))
    );
    
    return categoryMatch && searchMatch;
  });
  
  // Sort publications by year (newest first)
  const sortedPublications = [...filteredPublications].sort((a, b) => b.year - a.year);
  
  // Featured publications
  const featuredPublications = publications.filter(pub => pub.featured);
  
  return (
    <Layout>
      <PageHeader
        title="Publications"
        subtitle="Explore Sattar Hedayat's research contributions and scholarly publications"
        imageUrl="/assets/images/publications-header.jpg"
      />
      
      <Container>
        <Section>
          {/* Featured publications */}
          {featuredPublications.length > 0 && activeFilter === 'all' && searchQuery === '' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Publications</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPublications.map((pub, index) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
                  >
                    {pub.imageUrl && (
                      <div className="md:w-1/3">
                        <div className="h-48 md:h-full w-full relative">
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${pub.imageUrl})` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className={`p-6 flex flex-col justify-between ${pub.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{pub.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{pub.authors}</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{pub.abstract}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pub.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">{pub.journal}</span>, {pub.year}
                          {pub.citations && (
                            <span className="ml-2">• {pub.citations} citations</span>
                          )}
                        </div>
                        <a
                          href={pub.url}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search and filter */}
          <div className="mb-10">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search publications by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Publications list */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {activeFilter === 'all' 
                ? 'All Publications' 
                : `${categories.find(c => c.id === activeFilter)?.label}`}
              {searchQuery && ` matching "${searchQuery}"`}
              <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">({sortedPublications.length})</span>
            </h2>
            
            {sortedPublications.length > 0 ? (
              <div className="space-y-8">
                {sortedPublications.map((pub, index) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{pub.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{pub.authors}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{pub.abstract}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">{pub.journal}</span>, {pub.year}
                          {pub.citations && (
                            <span className="ml-2">• {pub.citations} citations</span>
                          )}
                        </div>
                        <div className="space-x-4">
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                            >
                              DOI: {pub.doi}
                            </a>
                          )}
                          <a
                            href={pub.url}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Read more →
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No publications found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </Section>
      </Container>
    </Layout>
  );
} 