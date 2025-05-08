import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopButton, TypeWriter } from '../animations/MicroInteractions';
import { AIIcon, DataIcon, ResearchIcon, PublicationIcon } from '../ui/AnimatedIcons';
import Loader from '../ui/Loader';

/**
 * ResearchAssistant - AI-powered research assistant component
 * This component demonstrates Dr. Hedayat's work on AI-assisted research tools
 * for structural engineering problems.
 */
const ResearchAssistant = ({
  defaultQuery = '',
  showExamples = true,
  maxResults = 5,
  className = '',
  onResultClick = () => {},
}) => {
  // State for search query and results
  const [query, setQuery] = useState(defaultQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showExplanation, setShowExplanation] = useState(false);
  const inputRef = useRef(null);

  // Example research queries
  const exampleQueries = [
    'How do seismic isolation systems perform in high-rise buildings?',
    'Latest research on AI-based structural health monitoring',
    'Methods for predicting building response to earthquake excitation',
    'Machine learning for optimizing structural design',
    'Performance-based design approaches for seismic risk mitigation'
  ];

  // Simulated research database categories
  const categories = [
    { id: 'all', label: 'All', icon: <DataIcon size={18} animate={false} /> },
    { id: 'publications', label: 'Publications', icon: <PublicationIcon size={18} animate={false} /> },
    { id: 'research', label: 'Research', icon: <ResearchIcon size={18} animate={false} /> },
    { id: 'ai', label: 'AI Models', icon: <AIIcon size={18} animate={false} /> }
  ];

  // Perform search when query changes or filter changes
  useEffect(() => {
    if (!query.trim()) return;

    const performSearch = async () => {
      setIsSearching(true);
      
      try {
        // In a real implementation, this would call an API
        // Here we'll simulate a delayed response with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock results based on query and filter
        const mockResults = generateMockResults(query, activeFilter);
        setSearchResults(mockResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid excessive API calls
    const timerId = setTimeout(performSearch, 300);
    return () => clearTimeout(timerId);
  }, [query, activeFilter]);

  // Generate mock results based on query and filter
  const generateMockResults = (query, filter) => {
    // Mock database of research items
    const database = [
      {
        id: 1,
        title: 'Machine Learning Approaches for Predicting Seismic Building Damage',
        excerpt: 'This paper explores various machine learning algorithms to predict building damage levels from earthquake data.',
        type: 'publication',
        year: 2023,
        relevance: 0.95,
        url: '/publications/ml-seismic-damage'
      },
      {
        id: 2,
        title: 'Deep Neural Networks for Real-time Structural Health Monitoring',
        excerpt: 'A novel approach using deep neural networks for continuous monitoring of structural integrity.',
        type: 'research',
        year: 2022,
        relevance: 0.88,
        url: '/research/dnn-health-monitoring'
      },
      {
        id: 3,
        title: 'Transformer-based Models for Earthquake Waveform Classification',
        excerpt: 'Applying transformer neural networks to classify earthquake signals and predict structural responses.',
        type: 'ai',
        year: 2023,
        relevance: 0.92,
        url: '/research/transformer-earthquake'
      },
      {
        id: 4,
        title: 'Performance Evaluation of Base Isolation Systems in High-rise Buildings',
        excerpt: 'Comparative study of various base isolation technologies in high-rise structures under different seismic conditions.',
        type: 'publication',
        year: 2021,
        relevance: 0.85,
        url: '/publications/isolation-highrise'
      },
      {
        id: 5,
        title: 'Optimizing Building Design Parameters using Genetic Algorithms',
        excerpt: 'Using evolutionary computation to optimize structural parameters for earthquake resistance.',
        type: 'research',
        year: 2022,
        relevance: 0.78,
        url: '/research/genetic-optimization'
      },
      {
        id: 6,
        title: 'Reinforcement Learning for Adaptive Structural Control Systems',
        excerpt: 'Novel application of reinforcement learning to control structural damping systems in real-time.',
        type: 'ai',
        year: 2023,
        relevance: 0.89,
        url: '/research/rl-structural-control'
      },
      {
        id: 7,
        title: 'Convolutional Neural Networks for Crack Detection in Concrete Structures',
        excerpt: 'Using computer vision techniques to automate structural damage assessment after earthquakes.',
        type: 'ai',
        year: 2022,
        relevance: 0.82,
        url: '/research/cnn-crack-detection'
      }
    ];

    // Filter by category if needed
    const filteredDatabase = filter === 'all' 
      ? database 
      : database.filter(item => {
          switch (filter) {
            case 'publications': return item.type === 'publication';
            case 'research': return item.type === 'research';
            case 'ai': return item.type === 'ai';
            default: return true;
          }
        });

    // Simple relevance scoring based on word matching (simplified)
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    const scoredResults = filteredDatabase.map(item => {
      const titleAndExcerpt = (item.title + ' ' + item.excerpt).toLowerCase();
      const matchCount = queryWords.filter(word => titleAndExcerpt.includes(word)).length;
      const scoreBoost = matchCount / Math.max(1, queryWords.length);
      
      return {
        ...item,
        relevance: Math.min(0.99, item.relevance + scoreBoost * 0.2)
      };
    });

    // Sort by relevance and return limited results
    return scoredResults
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Perform search
      setIsSearching(true);
    }
  };

  // Set example query when clicked
  const handleExampleClick = (example) => {
    setQuery(example);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle result click
  const handleResultClick = (result) => {
    onResultClick(result);
  };

  // Render functions for different parts of the interface
  const renderSearchForm = () => (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <AIIcon size={20} color="#6b7280" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Enter a research question or topic..."
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`absolute right-2.5 bottom-2.5 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none ${
            isSearching || !query.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSearching ? (
            <div className="flex items-center">
              <Loader type="spinner" size="xs" className="mr-2" />
              <span>Searching</span>
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );

  const renderExampleQueries = () => (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Example research questions:
      </h3>
      <div className="flex flex-wrap gap-2">
        {exampleQueries.map((example, index) => (
          <PopButton
            key={index}
            onClick={() => handleExampleClick(example)}
            className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1"
          >
            {example}
          </PopButton>
        ))}
      </div>
    </div>
  );

  const renderCategoryFilters = () => (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setActiveFilter(category.id)}
          className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
            activeFilter === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-1.5">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );

  const renderSearchResults = () => (
    <AnimatePresence mode="wait">
      {isSearching ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <Loader type="dots" color="primary" text="Searching research database..." />
        </motion.div>
      ) : searchResults.length > 0 ? (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Research Results
            </h2>
            <button
              onClick={() => setShowExplanation(prev => !prev)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showExplanation ? 'Hide Explanation' : 'How this works?'}
            </button>
          </div>

          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-4"
            >
              <TypeWriter
                text="This AI research assistant uses natural language processing to understand complex engineering queries and retrieves the most relevant research papers, projects, and publications from Dr. Hedayat's research database. It analyzes structural engineering terminology to match with semantic concepts rather than just keywords."
                speed={20}
                className="text-sm text-gray-700 dark:text-gray-300"
              />
            </motion.div>
          )}

          <div className="space-y-4">
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {result.title}
                  </h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-2 py-1 flex items-center">
                    {Math.round(result.relevance * 100)}% match
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {result.excerpt}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 mr-2">
                      {result.type === 'publication' && <PublicationIcon size={14} animate={false} className="mr-1" />}
                      {result.type === 'research' && <ResearchIcon size={14} animate={false} className="mr-1" />}
                      {result.type === 'ai' && <AIIcon size={14} animate={false} className="mr-1" />}
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.year}
                    </span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    Read more →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : query.trim() ? (
        <motion.div
          key="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No research found for "{query}". Try adjusting your search terms.
          </p>
          <button
            onClick={() => setQuery('')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear search
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className={`research-assistant ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <AIIcon size={24} className="mr-2" />
          AI Research Assistant
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore Dr. Hedayat's research database using natural language queries. Ask questions about structural engineering, seismic analysis, or AI integration.
        </p>
      </div>

      {renderSearchForm()}
      {showExamples && !searchResults.length && !isSearching && renderExampleQueries()}
      {(searchResults.length > 0 || isSearching) && renderCategoryFilters()}
      {renderSearchResults()}
    </div>
  );
};

export default ResearchAssistant; 