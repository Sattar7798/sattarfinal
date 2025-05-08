import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import BuildingModelViewer from '../3d/BuildingModelViewer';
import SeismicVisualization from '../3d/SeismicVisualization';
import InteractiveModelControls from '../3d/InteractiveModelControls';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { StructureIcon, EarthquakeIcon } from '../ui/AnimatedIcons';

/**
 * InteractiveDemo - Component for showcasing interactive 3D structural models and
 * seismic simulations with advanced visualization features
 */
const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState('building');
  const buildingModelRef = useRef(null);
  const [modelPath, setModelPath] = useState('/assets/models/building-model.glb');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Sample models for demonstration
  const availableModels = [
    { 
      id: 'building', 
      name: 'Multi-story Building', 
      path: '/assets/models/building-model.glb',
      description: 'A 10-story reinforced concrete building with seismic isolation system'
    },
    { 
      id: 'bridge', 
      name: 'Cable-stayed Bridge', 
      path: '/assets/models/bridge-model.glb',
      description: 'Cable-stayed bridge with dynamic response visualization capabilities'
    },
    { 
      id: 'highrise', 
      name: 'High-rise Structure', 
      path: '/assets/models/highrise-model.glb',
      description: 'A 40-story high-rise building with diagrid structural system'
    },
    { 
      id: 'seismic', 
      name: 'Base-Isolated Building', 
      path: '/assets/models/seismic-isolation-model.glb',
      description: 'Building with base isolation system for earthquake protection'
    },
  ];
  
  // Simulated stress data for visualization
  const mockStressData = [
    { elementId: 'beam-001', value: 0.75 },
    { elementId: 'column-001', value: 0.45 },
    { elementId: 'wall-001', value: 0.82 },
    { elementId: 'floor-001', value: 0.30 },
    { elementId: 'connection-001', value: 0.95 },
  ];
  
  // Simulate model loading
  const handleModelLoaded = (model) => {
    console.log('Model loaded:', model);
  };
  
  // Handle building model viewer controls
  const handleViewChange = (view) => {
    console.log('View changed:', view);
  };
  
  const handleSectionCut = (sectionData) => {
    console.log('Section cut:', sectionData);
  };
  
  const handleToggleWireframe = (enabled) => {
    console.log('Wireframe toggled:', enabled);
  };
  
  const handleToggleExploded = (enabled) => {
    console.log('Exploded view toggled:', enabled);
  };
  
  const handleColorModeChange = (mode) => {
    console.log('Color mode changed:', mode);
  };
  
  // Handle seismic visualization callbacks
  const handleVisualizationReady = () => {
    console.log('Seismic visualization ready');
  };
  
  // Change active model
  const handleModelChange = (modelId) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setModelPath(model.path);
    }
  };
  
  // Render building model demonstration
  const renderBuildingDemo = () => (
    <div className="h-[600px] relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <BuildingModelViewer
        modelPath={modelPath}
        width="100%"
        height="100%"
        backgroundColor="#f5f5f5"
        enableSectionCut={true}
        enableExplodedView={true}
        enableStressView={true}
        stressData={mockStressData}
        onModelLoaded={handleModelLoaded}
      />
      
      <InteractiveModelControls
        position="bottom"
        onViewChange={handleViewChange}
        onSectionCut={handleSectionCut}
        onToggleWireframe={handleToggleWireframe}
        onToggleExploded={handleToggleExploded}
        onColorModeChange={handleColorModeChange}
      />
    </div>
  );
  
  // Render seismic demonstration
  const renderSeismicDemo = () => (
    <div className="h-[600px] relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <SeismicVisualization
        width="100%"
        height="100%"
        modelPath={modelPath}
        backgroundColor="#f5f5f5"
        showControls={true}
        initialMagnitude={6.5}
        initialDistance={20}
        initialDirection={0}
        initialSoilType="stiff"
        onVisualizationReady={handleVisualizationReady}
      />
    </div>
  );
  
  // Render model selection
  const renderModelSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {availableModels.map((model) => (
        <Card
          key={model.id}
          className={`cursor-pointer transition-all ${
            modelPath === model.path
              ? 'border-2 border-blue-500 shadow-md'
              : 'hover:shadow-md'
          }`}
          onClick={() => handleModelChange(model.id)}
        >
          <Card.Header className="p-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</h4>
          </Card.Header>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <StructureIcon size={32} color="#6b7280" />
          </div>
          <Card.Footer className="p-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">{model.description}</p>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
  
  // Render advanced settings panel
  const renderAdvancedSettings = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: showAdvancedSettings ? 'auto' : 0,
        opacity: showAdvancedSettings ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Visualization Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rendering Options</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="shadows" 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="shadows" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable Shadows
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="ambient-occlusion" 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="ambient-occlusion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Ambient Occlusion
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="anti-aliasing" 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="anti-aliasing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Anti-aliasing
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Parameters</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="stress-scale" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Stress Scale Factor
                </label>
                <input
                  type="range"
                  id="stress-scale"
                  min="0.1"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              
              <div>
                <label htmlFor="deformation-scale" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Deformation Scale Factor
                </label>
                <input
                  type="range"
                  id="deformation-scale"
                  min="1"
                  max="20"
                  step="1"
                  defaultValue="10"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="interactive-demo">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Structural Demonstrations
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Explore interactive 3D models and simulations that showcase Dr. Hedayat's research in 
            structural engineering and seismic analysis.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center space-x-2 mb-8">
          <Button
            variant={activeDemo === 'building' ? 'primary' : 'secondary'}
            onClick={() => setActiveDemo('building')}
            className="mb-2"
          >
            <div className="flex items-center">
              <StructureIcon size={20} className="mr-2" animate={false} />
              <span>Building Model</span>
            </div>
          </Button>
          
          <Button
            variant={activeDemo === 'seismic' ? 'primary' : 'secondary'}
            onClick={() => setActiveDemo('seismic')}
            className="mb-2"
          >
            <div className="flex items-center">
              <EarthquakeIcon size={20} className="mr-2" animate={false} />
              <span>Seismic Simulation</span>
            </div>
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            isOutlined={true}
            className="mb-2"
          >
            {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
          </Button>
        </div>
        
        {renderAdvancedSettings()}
        {renderModelSelection()}
        
        {activeDemo === 'building' ? renderBuildingDemo() : renderSeismicDemo()}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            These interactive demonstrations are simplified versions of Dr. Hedayat's professional 
            engineering software. For access to full-featured analysis tools, please contact directly.
          </p>
          
          <Button href="/contact" variant="primary" isOutlined={true}>
            Request Professional Access
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo; 