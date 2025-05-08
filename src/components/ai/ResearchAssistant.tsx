import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Tabs, Card, Tag, List, Avatar, Divider, Spin, Empty } from 'antd';
import { SearchOutlined, FileTextOutlined, BookOutlined, ExperimentOutlined, 
         LinkOutlined, DownloadOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search } = Input;

// Types for research results
interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  keywords: string[];
  citations: number;
  url: string;
  isFavorite?: boolean;
  relevanceScore: number;
}

interface BookReference {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  year: number;
  description: string;
  keywords: string[];
  url?: string;
  isFavorite?: boolean;
  relevanceScore: number;
}

interface CaseStudy {
  id: string;
  title: string;
  location: string;
  year: number;
  description: string;
  findings: string[];
  keywords: string[];
  url?: string;
  isFavorite?: boolean;
  relevanceScore: number;
}

interface AIInsight {
  id: string;
  topic: string;
  summary: string;
  relatedConcepts: string[];
  suggestedReadings: string[];
}

type ResearchResult = ResearchPaper | BookReference | CaseStudy;

// Component props
interface ResearchAssistantProps {
  className?: string;
  initialQuery?: string;
  theme?: 'light' | 'dark';
  recentSearches?: string[];
  suggestedTopics?: string[];
  showAIInsights?: boolean;
}

// Mock research results
const mockPapers: ResearchPaper[] = [
  {
    id: 'p1',
    title: 'Advanced Seismic Analysis Methods for High-Rise Buildings with Irregular Geometries',
    authors: ['J. Wang', 'S. Rodriguez', 'H. Nakamura'],
    journal: 'Journal of Structural Engineering',
    year: 2022,
    abstract: 'This paper presents novel approaches to seismic analysis for irregular high-rise structures, demonstrating improved accuracy in predicting building response during major seismic events. The proposed methodology accounts for torsional effects and non-linear behavior of structural components.',
    keywords: ['seismic analysis', 'high-rise', 'irregular geometry', 'torsional effects', 'non-linear analysis'],
    citations: 45,
    url: 'https://example.com/paper1',
    relevanceScore: 95
  },
  {
    id: 'p2',
    title: 'Integration of Artificial Intelligence in Structural Health Monitoring Systems',
    authors: ['M. Johnson', 'L. Zhang', 'K. Patel'],
    journal: 'Automation in Construction',
    year: 2021,
    abstract: 'This research explores the application of machine learning algorithms for real-time structural health monitoring. The study demonstrates how neural networks can detect subtle changes in structural behavior that may indicate potential failures before they manifest visibly.',
    keywords: ['artificial intelligence', 'structural health monitoring', 'machine learning', 'neural networks', 'predictive maintenance'],
    citations: 38,
    url: 'https://example.com/paper2',
    relevanceScore: 88
  },
  {
    id: 'p3',
    title: 'Performance-Based Design Strategies for Seismic-Resistant Structures',
    authors: ['R. Singh', 'D. Garcia', 'T. Wilson'],
    journal: 'Earthquake Engineering & Structural Dynamics',
    year: 2020,
    abstract: 'This paper presents a comprehensive framework for performance-based seismic design, incorporating multiple performance objectives, probabilistic assessment methods, and life-cycle cost considerations. The approach is validated through case studies of buildings in high seismic zones.',
    keywords: ['performance-based design', 'seismic design', 'multi-objective optimization', 'probabilistic assessment', 'life-cycle analysis'],
    citations: 72,
    url: 'https://example.com/paper3',
    relevanceScore: 82
  },
];

const mockBooks: BookReference[] = [
  {
    id: 'b1',
    title: 'Advanced Structural Analysis in Seismic Zones',
    authors: ['Elizabeth Chen', 'Robert Tanaka'],
    publisher: 'Academic Engineering Press',
    year: 2021,
    description: 'This comprehensive textbook covers the latest methodologies in structural analysis specifically for buildings in seismic zones. It includes chapters on non-linear analysis, base isolation systems, and computational modeling techniques.',
    keywords: ['textbook', 'structural analysis', 'seismic design', 'non-linear analysis', 'computational modeling'],
    url: 'https://example.com/book1',
    relevanceScore: 90
  },
  {
    id: 'b2',
    title: 'AI Applications in Civil and Structural Engineering',
    authors: ['Marcus Williams', 'Sarah Hernandez'],
    publisher: 'Engineering Innovation Press',
    year: 2022,
    description: 'This book explores how artificial intelligence is transforming civil engineering practice, with detailed case studies on structural optimization, predictive maintenance, and automated design systems.',
    keywords: ['artificial intelligence', 'civil engineering', 'structural optimization', 'predictive maintenance', 'automated design'],
    url: 'https://example.com/book2',
    relevanceScore: 85
  },
];

const mockCaseStudies: CaseStudy[] = [
  {
    id: 'c1',
    title: 'Seismic Performance of the Taipei 101 Tower During the 2022 Taiwan Earthquake',
    location: 'Taipei, Taiwan',
    year: 2023,
    description: 'This case study analyzes the performance of the Taipei 101 tower during the 6.8 magnitude earthquake that struck Taiwan in 2022. The study examines the effectiveness of the tuned mass damper and other seismic design features.',
    findings: [
      'The tuned mass damper reduced lateral displacement by approximately 35%',
      'No structural damage was observed despite peak ground acceleration of 0.18g',
      'Building acceleration was kept below comfort thresholds for occupants above the 80th floor'
    ],
    keywords: ['case study', 'skyscraper', 'tuned mass damper', 'earthquake response', 'structural performance'],
    url: 'https://example.com/case1',
    relevanceScore: 92
  },
  {
    id: 'c2',
    title: 'Structural Failure Analysis: Miami Champlain Towers South Collapse',
    location: 'Miami, Florida, USA',
    year: 2021,
    description: 'A detailed technical analysis of the structural failure that led to the collapse of the Champlain Towers South condominium in Surfside, Miami. The study identifies deterioration mechanisms, design weaknesses, and maintenance issues that contributed to the catastrophic failure.',
    findings: [
      'Significant concrete deterioration in the pool deck and parking garage structures',
      'Inadequate waterproofing contributed to long-term reinforcement corrosion',
      'Original design had insufficient redundancy to prevent progressive collapse',
      'Recommendations for enhanced inspection protocols for similar aging structures'
    ],
    keywords: ['failure analysis', 'concrete deterioration', 'progressive collapse', 'structural inspection', 'corrosion'],
    url: 'https://example.com/case2',
    relevanceScore: 78
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    topic: 'Seismic Analysis Trends',
    summary: "Recent advancements in seismic analysis are focusing on integration of machine learning to predict structural responses more accurately. There's also a significant shift toward performance-based design approaches rather than purely code-based approaches.",
    relatedConcepts: [
      'Non-linear time history analysis',
      'Machine learning for ground motion prediction',
      'Performance-based earthquake engineering',
      'Cloud-based seismic simulation'
    ],
    suggestedReadings: [
      'Performance-Based Seismic Design (ASCE, 2023)',
      'Machine Learning in Earthquake Engineering (Wang et al., 2022)'
    ]
  },
  {
    id: 'ai2',
    topic: 'AI & Structural Optimization',
    summary: 'Artificial intelligence is revolutionizing structural optimization by enabling exploration of design spaces that would be impossible through traditional methods. Generative design algorithms combined with structural analysis are producing more efficient and innovative structural solutions.',
    relatedConcepts: [
      'Generative design',
      'Topology optimization',
      'Multi-objective genetic algorithms',
      'Neural networks for structural response prediction'
    ],
    suggestedReadings: [
      'Generative Design for Structural Engineering (MIT Press, 2023)',
      'Neural Networks in Structural Optimization (Zhang & Patel, 2022)'
    ]
  }
];

// Main component
const ResearchAssistant: React.FC<ResearchAssistantProps> = ({
  className = '',
  initialQuery = '',
  theme = 'light',
  recentSearches = ['seismic analysis methods', 'AI in structural engineering', 'vibration control systems'],
  suggestedTopics = ['Performance-based seismic design', 'Machine learning for structural health monitoring', 'Non-linear analysis methods'],
  showAIInsights = true
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('papers');
  const [searchResults, setSearchResults] = useState<{
    papers: ResearchPaper[];
    books: BookReference[];
    caseStudies: CaseStudy[];
  }>({
    papers: [],
    books: [],
    caseStudies: []
  });
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<Input>(null);
  
  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Filter mock data based on query
      // In a real application, this would be an API call to a backend search service
      const papers = mockPapers.filter(paper => 
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
        paper.keywords.some(kw => kw.toLowerCase().includes(query.toLowerCase()))
      );
      
      const books = mockBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase()) ||
        book.keywords.some(kw => kw.toLowerCase().includes(query.toLowerCase()))
      );
      
      const caseStudies = mockCaseStudies.filter(cs => 
        cs.title.toLowerCase().includes(query.toLowerCase()) ||
        cs.description.toLowerCase().includes(query.toLowerCase()) ||
        cs.keywords.some(kw => kw.toLowerCase().includes(query.toLowerCase())) ||
        cs.findings.some(f => f.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults({ papers, books, caseStudies });
      setIsSearching(false);
    }, 1500);
  };
  
  // Handle topic click
  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
    if (searchInputRef.current) {
      // Focus and trigger search
      searchInputRef.current.focus();
      handleSearch(topic);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string, type: 'paper' | 'book' | 'case') => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Render research paper item
  const renderPaperItem = (paper: ResearchPaper) => (
    <List.Item
      key={paper.id}
      actions={[
        <Button 
          key="favorite" 
          type="text" 
          icon={favorites[paper.id] ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
          onClick={() => toggleFavorite(paper.id, 'paper')}
        />,
        <Button key="download" type="text" icon={<DownloadOutlined />} />,
        <Button key="link" type="text" icon={<LinkOutlined />} />
      ]}
    >
      <List.Item.Meta
        title={<a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.title}</a>}
        description={
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {paper.authors.join(', ')} • {paper.journal} • {paper.year} • {paper.citations} citations
            </div>
            <div className="mt-2">{paper.abstract}</div>
            <div className="mt-2">
              {paper.keywords.map(keyword => (
                <Tag 
                  key={keyword} 
                  onClick={() => handleTopicClick(keyword)}
                  className="cursor-pointer mb-1 mr-1"
                >
                  {keyword}
                </Tag>
              ))}
            </div>
            <div className="mt-2">
              <Tag color="blue">Relevance: {paper.relevanceScore}%</Tag>
            </div>
          </div>
        }
      />
    </List.Item>
  );
  
  // Render book reference item
  const renderBookItem = (book: BookReference) => (
    <List.Item
      key={book.id}
      actions={[
        <Button 
          key="favorite" 
          type="text" 
          icon={favorites[book.id] ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
          onClick={() => toggleFavorite(book.id, 'book')}
        />,
        book.url && <Button key="link" type="text" icon={<LinkOutlined />} />
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar size={64} icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
        title={book.url ? <a href={book.url} target="_blank" rel="noopener noreferrer">{book.title}</a> : book.title}
        description={
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {book.authors.join(', ')} • {book.publisher} • {book.year}
            </div>
            <div className="mt-2">{book.description}</div>
            <div className="mt-2">
              {book.keywords.map(keyword => (
                <Tag 
                  key={keyword} 
                  onClick={() => handleTopicClick(keyword)}
                  className="cursor-pointer mb-1 mr-1"
                >
                  {keyword}
                </Tag>
              ))}
            </div>
            <div className="mt-2">
              <Tag color="blue">Relevance: {book.relevanceScore}%</Tag>
            </div>
          </div>
        }
      />
    </List.Item>
  );
  
  // Render case study item
  const renderCaseStudyItem = (caseStudy: CaseStudy) => (
    <List.Item
      key={caseStudy.id}
      actions={[
        <Button 
          key="favorite" 
          type="text" 
          icon={favorites[caseStudy.id] ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
          onClick={() => toggleFavorite(caseStudy.id, 'case')}
        />,
        caseStudy.url && <Button key="link" type="text" icon={<LinkOutlined />} />
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar size={64} icon={<ExperimentOutlined />} style={{ backgroundColor: '#52c41a' }} />}
        title={caseStudy.url ? <a href={caseStudy.url} target="_blank" rel="noopener noreferrer">{caseStudy.title}</a> : caseStudy.title}
        description={
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {caseStudy.location} • {caseStudy.year}
            </div>
            <div className="mt-2">{caseStudy.description}</div>
            <div className="mt-2">
              <strong>Key Findings:</strong>
              <ul className="list-disc list-inside mt-1">
                {caseStudy.findings.map((finding, index) => (
                  <li key={index} className="text-sm">{finding}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              {caseStudy.keywords.map(keyword => (
                <Tag 
                  key={keyword} 
                  onClick={() => handleTopicClick(keyword)}
                  className="cursor-pointer mb-1 mr-1"
                >
                  {keyword}
                </Tag>
              ))}
            </div>
            <div className="mt-2">
              <Tag color="blue">Relevance: {caseStudy.relevanceScore}%</Tag>
            </div>
          </div>
        }
      />
    </List.Item>
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className} ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Structural Engineering Research Assistant</h2>
        
        <Search
          placeholder="Search for research papers, books, case studies..."
          allowClear
          enterButton="Search"
          size="large"
          value={searchQuery}
          onChange={handleInputChange}
          onSearch={handleSearch}
          className="w-full md:w-96"
          loading={isSearching}
          ref={searchInputRef}
        />
      </div>
      
      {!searchResults.papers.length && !searchResults.books.length && !searchResults.caseStudies.length ? (
        <div className="mb-6">
          <Card className="shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Recent Searches</h3>
              <div>
                {recentSearches.map(search => (
                  <Tag 
                    key={search} 
                    className="mb-2 mr-2 cursor-pointer"
                    onClick={() => handleTopicClick(search)}
                  >
                    <SearchOutlined className="mr-1" /> {search}
                  </Tag>
                ))}
              </div>
            </div>
            
            <Divider className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Suggested Topics</h3>
              <div>
                {suggestedTopics.map(topic => (
                  <Tag 
                    key={topic} 
                    color="blue" 
                    className="mb-2 mr-2 cursor-pointer"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </Tag>
                ))}
              </div>
            </div>
            
            {showAIInsights && (
              <>
                <Divider className="my-4" />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">AI Research Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockAIInsights.map(insight => (
                      <Card 
                        key={insight.id} 
                        title={insight.topic}
                        className="bg-blue-50 dark:bg-blue-900 border-0"
                        size="small"
                      >
                        <p className="text-sm">{insight.summary}</p>
                        <div className="mt-2">
                          <strong className="text-xs">Related Concepts:</strong>
                          <div className="mt-1">
                            {insight.relatedConcepts.map(concept => (
                              <Tag 
                                key={concept} 
                                className="mb-1 mr-1 cursor-pointer"
                                onClick={() => handleTopicClick(concept)}
                              >
                                {concept}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      ) : (
        <div>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={`Research Papers (${searchResults.papers.length})`} 
              key="papers"
              className="mb-8"
            >
              {isSearching ? (
                <div className="flex justify-center items-center py-16">
                  <Spin tip="Searching research papers..." />
                </div>
              ) : searchResults.papers.length > 0 ? (
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 5,
                    simple: true,
                  }}
                  dataSource={searchResults.papers}
                  renderItem={renderPaperItem}
                />
              ) : (
                <Empty description="No research papers found matching your query" />
              )}
            </TabPane>
            
            <TabPane 
              tab={`Books & References (${searchResults.books.length})`} 
              key="books"
              className="mb-8"
            >
              {isSearching ? (
                <div className="flex justify-center items-center py-16">
                  <Spin tip="Searching books and references..." />
                </div>
              ) : searchResults.books.length > 0 ? (
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 3,
                    simple: true,
                  }}
                  dataSource={searchResults.books}
                  renderItem={renderBookItem}
                />
              ) : (
                <Empty description="No books or references found matching your query" />
              )}
            </TabPane>
            
            <TabPane 
              tab={`Case Studies (${searchResults.caseStudies.length})`} 
              key="cases"
              className="mb-8"
            >
              {isSearching ? (
                <div className="flex justify-center items-center py-16">
                  <Spin tip="Searching case studies..." />
                </div>
              ) : searchResults.caseStudies.length > 0 ? (
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    pageSize: 3,
                    simple: true,
                  }}
                  dataSource={searchResults.caseStudies}
                  renderItem={renderCaseStudyItem}
                />
              ) : (
                <Empty description="No case studies found matching your query" />
              )}
            </TabPane>
          </Tabs>
        </div>
      )}
    </motion.div>
  );
};

export default ResearchAssistant; 