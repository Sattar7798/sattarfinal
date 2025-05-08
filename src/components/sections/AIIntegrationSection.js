import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AIVisualization from '../ai/AIVisualization';
import ResearchAssistant from '../ai/ResearchAssistant';
import { FadeIn, SlideIn, ScaleUp } from '../layout/AnimatedTransitions';
import { AIIcon, StructureIcon, AnalysisIcon, DataIcon } from '../ui/AnimatedIcons';
import Button from '../ui/Button';
import Card from '../ui/Card';

/**
 * AIIntegrationSection - Showcases Dr. Hedayat's integration of AI with structural engineering
 * Highlights research areas, applications, and interactive demonstrations
 */
const AIIntegrationSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModel, setActiveModel] = useState('displacement');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  
  // Mock structural data for demonstration
  const mockStructuralData = {
    displacement: generateMockData('displacement', 200),
    stress: generateMockData('stress', 200),
    seismic: generateMockData('seismic', 200),
    vibration: generateMockData('vibration', 200)
  };
  
  // Mock AI prediction data - slightly different to show improvements
  const mockPredictionData = {
    displacement: generateMockData('displacement', 200, 0.9),
    stress: generateMockData('stress', 200, 0.85),
    seismic: generateMockData('seismic', 200, 0.92),
    vibration: generateMockData('vibration', 200, 0.88)
  };
  
  // Generate sample data for visualizations
  function generateMockData(type, points, accuracy = 1.0) {
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const x = i / (points - 1);
      let y;
      
      switch (type) {
        case 'displacement':
          y = 0.5 * Math.sin(x * Math.PI * 4) * Math.exp(-x) + 0.2 * Math.sin(x * Math.PI * 8);
          break;
        case 'stress':
          y = 0.7 * Math.pow(x, 2) * Math.sin(x * Math.PI * 2) + 0.3 * Math.random();
          break;
        case 'seismic':
          y = Math.sin(x * Math.PI * 10) * Math.exp(-x * 2) * (1 - x) * 2;
          break;
        case 'vibration':
          y = Math.cos(x * Math.PI * 8) * Math.exp(-x) * 0.5 + 0.1 * Math.sin(x * Math.PI * 20);
          break;
        default:
          y = Math.sin(x * Math.PI * 2);
      }
      
      // Adjust for AI accuracy - make it slightly different but trending towards the actual
      if (accuracy < 1.0) {
        const noise = (Math.random() * 2 - 1) * (1 - accuracy) * 0.2;
        y = y * accuracy + noise;
      }
      
      data.push({ x, y });
    }
    
    return data;
  }
  
  // Research areas in AI + Structural Engineering
  const researchAreas = [
    {
      id: 'prediction',
      title: 'Predictive Analysis',
      icon: <DataIcon size={24} />,
      description: 'Using machine learning to predict structural responses to various load conditions, reducing the need for expensive physical testing.',
      color: 'blue'
    },
    {
      id: 'optimization',
      title: 'Design Optimization',
      icon: <StructureIcon size={24} />,
      description: 'Generative design algorithms that produce optimized structural solutions based on given constraints and performance targets.',
      color: 'emerald'
    },
    {
      id: 'monitoring',
      title: 'Real-time Monitoring',
      icon: <AnalysisIcon size={24} />,
      description: 'Neural networks that process sensor data from buildings to detect anomalies and predict potential structural issues.',
      color: 'purple'
    },
    {
      id: 'seismic',
      title: 'Seismic Response',
      icon: <AIIcon size={24} />,
      description: 'Deep learning models trained on earthquake data to forecast building behavior during seismic events with unprecedented accuracy.',
      color: 'amber'
    }
  ];
  
  // Research impact statistics
  const impactStats = [
    { value: '43%', label: 'Average reduction in analysis time' },
    { value: '87%', label: 'Accuracy in structural response prediction' },
    { value: '31%', label: 'Material savings through AI optimization' },
    { value: '250+', label: 'Citations of AI integration research' }
  ];
  
  // Render navigation tabs
  const renderTabs = () => (
    <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-8">
      <button
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === 'overview'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === 'visualization'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
        onClick={() => setActiveTab('visualization')}
      >
        AI Visualization
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === 'assistant'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
        onClick={() => setActiveTab('assistant')}
      >
        Research Assistant
      </button>
    </div>
  );
  
  // Render overview content
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <SlideIn direction="left" className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            AI Integration in Structural Engineering
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Dr. Hedayat's pioneering research merges artificial intelligence with structural engineering, 
            creating intelligent systems that revolutionize how we design, analyze, and monitor buildings 
            and infrastructure.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            By leveraging machine learning, deep neural networks, and computer vision algorithms, these 
            integrated approaches can detect patterns, predict behaviors, and optimize solutions beyond 
            what traditional computational methods can achieve.
          </p>
          <Button
            href="/research#ai-integration"
            variant="primary"
            className="mt-2"
          >
            Explore Research Papers
          </Button>
        </SlideIn>

        <FadeIn delay={0.3} className="mt-10">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Research Impact
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {impactStats.map((stat, index) => (
              <Card key={index} className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
      
      <div>
        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {researchAreas.map((area, index) => (
            <ScaleUp key={area.id} delay={index * 0.1}>
              <Card className="h-full p-6">
                <div className={`text-${area.color}-600 mb-3`}>
                  {area.icon}
                </div>
                <Card.Title>{area.title}</Card.Title>
                <Card.Text className="text-sm">{area.description}</Card.Text>
              </Card>
            </ScaleUp>
          ))}
        </FadeIn>
      </div>
    </div>
  );
  
  // Render visualization content
  const renderVisualization = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI-Enhanced Structural Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This interactive demonstration compares traditional structural analysis methods with 
          AI-enhanced predictions. The visualizations show how machine learning models can accurately
          predict structural responses with significantly less computational effort.
        </p>
      </div>
      
      <div className="flex flex-wrap space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeModel === 'displacement'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setActiveModel('displacement')}
        >
          Displacement
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeModel === 'stress'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setActiveModel('stress')}
        >
          Stress Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeModel === 'seismic'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setActiveModel('seismic')}
        >
          Seismic Response
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeModel === 'vibration'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setActiveModel('vibration')}
        >
          Vibration
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <AIVisualization
          type={activeModel}
          title={`AI-Enhanced ${activeModel.charAt(0).toUpperCase() + activeModel.slice(1)} Analysis`}
          height={500}
          className="rounded-lg overflow-hidden"
          initialModelType={activeModel}
          showControls={true}
        />
      </div>
    </div>
  );
  
  // Render research assistant content
  const renderAssistant = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI Research Assistant
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Experience Dr. Hedayat's AI-powered research assistant that helps engineers find relevant 
          literature, data, and solutions for structural engineering problems. This natural language 
          interface can understand complex engineering queries and provide relevant information.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ResearchAssistant />
      </div>
    </div>
  );
  
  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'visualization':
        return renderVisualization();
      case 'assistant':
        return renderAssistant();
      default:
        return renderOverview();
    }
  };
  
  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gray-50 dark:bg-gray-900"
      id="ai-integration"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <AIIcon size={36} className="mr-3" />
            AI Integration in Structural Engineering
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Exploring the frontier where artificial intelligence meets structural design, 
            creating smarter, safer, and more resilient buildings.
          </p>
        </motion.div>
        
        {renderTabs()}
        {renderContent()}
      </div>
    </section>
  );
};

export default AIIntegrationSection; 