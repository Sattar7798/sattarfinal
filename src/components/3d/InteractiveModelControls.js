import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildingIcon, ModelIcon, AnalysisIcon, StructureIcon } from '../ui/AnimatedIcons';

/**
 * InteractiveModelControls component - provides user interface for manipulating 3D models
 * Features:
 * - Model rotation controls
 * - Section cut control
 * - Camera position presets
 * - Toggle options (wireframe, exploded view, etc.)
 * - Color mode selection (material, analysis, etc.)
 */
const InteractiveModelControls = ({
  onViewChange = () => {},
  onSectionCut = () => {},
  onToggleWireframe = () => {},
  onToggleExploded = () => {},
  onToggleAnnotations = () => {},
  onColorModeChange = () => {},
  onResetView = () => {},
  onCameraPositionChange = () => {},
  onZoom = () => {},
  className = '',
  style = {},
  position = 'bottom',
  ...props
}) => {
  // State for the controls
  const [wireframeEnabled, setWireframeEnabled] = useState(false);
  const [explodedViewEnabled, setExplodedViewEnabled] = useState(false);
  const [annotationsEnabled, setAnnotationsEnabled] = useState(true);
  const [currentView, setCurrentView] = useState('3d');
  const [colorMode, setColorMode] = useState('material');
  const [sectionCutEnabled, setSectionCutEnabled] = useState(false);
  const [sectionPlane, setSectionPlane] = useState({ axis: 'y', position: 0 });
  
  // Available camera preset positions
  const cameraPositions = [
    { id: 'front', label: 'Front', icon: '⬆️' },
    { id: 'back', label: 'Back', icon: '⬇️' },
    { id: 'left', label: 'Left', icon: '⬅️' },
    { id: 'right', label: 'Right', icon: '➡️' },
    { id: 'top', label: 'Top', icon: '🔝' },
    { id: 'bottom', label: 'Bottom', icon: '🔽' },
    { id: 'isometric', label: 'Isometric', icon: '↗️' },
  ];
  
  // Color modes for visualization
  const colorModes = [
    { id: 'material', label: 'Material', icon: '🎨' },
    { id: 'stress', label: 'Stress Analysis', icon: '📊' },
    { id: 'displacement', label: 'Displacement', icon: '↔️' },
    { id: 'temperature', label: 'Temperature', icon: '🌡️' },
    { id: 'custom', label: 'Custom', icon: '✨' },
  ];
  
  // Handle view mode changes
  const handleViewChange = (view) => {
    setCurrentView(view);
    onViewChange(view);
  };
  
  // Handle section cut changes
  const handleSectionCutChange = (axis, position) => {
    const newSectionPlane = { axis, position };
    setSectionPlane(newSectionPlane);
    setSectionCutEnabled(true);
    onSectionCut({ enabled: true, ...newSectionPlane });
  };
  
  // Handle section cut enable/disable
  const handleToggleSectionCut = () => {
    const newState = !sectionCutEnabled;
    setSectionCutEnabled(newState);
    onSectionCut({ enabled: newState, ...sectionPlane });
  };
  
  // Toggle wireframe
  const handleToggleWireframe = () => {
    const newState = !wireframeEnabled;
    setWireframeEnabled(newState);
    onToggleWireframe(newState);
  };
  
  // Toggle exploded view
  const handleToggleExploded = () => {
    const newState = !explodedViewEnabled;
    setExplodedViewEnabled(newState);
    onToggleExploded(newState);
  };
  
  // Toggle annotations
  const handleToggleAnnotations = () => {
    const newState = !annotationsEnabled;
    setAnnotationsEnabled(newState);
    onToggleAnnotations(newState);
  };
  
  // Handle color mode change
  const handleColorModeChange = (mode) => {
    setColorMode(mode);
    onColorModeChange(mode);
  };
  
  // Handle camera position change
  const handleCameraPositionChange = (position) => {
    onCameraPositionChange(position);
  };
  
  // Handle reset view
  const handleResetView = () => {
    // Reset all settings to default
    setWireframeEnabled(false);
    setExplodedViewEnabled(false);
    setSectionCutEnabled(false);
    setColorMode('material');
    setCurrentView('3d');
    setSectionPlane({ axis: 'y', position: 0 });
    
    // Call the parent reset callback
    onResetView();
  };
  
  // Button component for consistent styling
  const ControlButton = ({ active, icon, label, onClick, className = '' }) => (
    <motion.button
      className={`
        flex flex-col items-center justify-center p-2 rounded-md
        ${active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
        transition-colors
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={label}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xs font-medium">{label}</div>
    </motion.button>
  );
  
  // Slider component for section cuts
  const SectionSlider = ({ axis, value, onChange }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium mb-1">Section {axis.toUpperCase()}</span>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(axis, parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 transform -translate-y-1/2 flex-col';
      case 'right':
        return 'right-4 top-1/2 transform -translate-y-1/2 flex-col';
      default:
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
    }
  };
  
  // Toggle for boolean options
  const BooleanToggle = ({ value, onToggle, label, icon }) => (
    <motion.button
      className={`
        flex items-center p-2 rounded-md space-x-2
        ${value 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
    >
      <div className="text-xl">{icon}</div>
      <div className="text-xs font-medium">{label}</div>
      <div 
        className={`w-8 h-4 rounded-full relative ${value ? 'bg-white' : 'bg-gray-400'}`}
      >
        <div 
          className={`absolute w-3 h-3 rounded-full top-0.5 transition-all ${
            value ? 'right-0.5 bg-blue-600' : 'left-0.5 bg-gray-600'
          }`} 
        />
      </div>
    </motion.button>
  );

  // Different control groups
  const ViewControls = () => (
    <div className="flex space-x-2">
      <ControlButton
        icon={<ModelIcon size={20} animate={false} />}
        label="3D"
        active={currentView === '3d'}
        onClick={() => handleViewChange('3d')}
      />
      <ControlButton
        icon={<StructureIcon size={20} animate={false} />}
        label="Orthographic"
        active={currentView === 'ortho'}
        onClick={() => handleViewChange('ortho')}
      />
      <ControlButton
        icon={<AnalysisIcon size={20} animate={false} />}
        label="Analysis"
        active={currentView === 'analysis'}
        onClick={() => handleViewChange('analysis')}
      />
      <ControlButton
        icon={<BuildingIcon size={20} animate={false} />}
        label="Building"
        active={currentView === 'building'}
        onClick={() => handleViewChange('building')}
      />
    </div>
  );
  
  const SectionControls = () => (
    <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Section Cut</span>
        <BooleanToggle
          value={sectionCutEnabled}
          onToggle={handleToggleSectionCut}
          label=""
          icon=""
        />
      </div>
      <div className="space-y-3">
        <SectionSlider 
          axis="x" 
          value={sectionPlane.axis === 'x' ? sectionPlane.position : 0}
          onChange={handleSectionCutChange}
        />
        <SectionSlider 
          axis="y" 
          value={sectionPlane.axis === 'y' ? sectionPlane.position : 0}
          onChange={handleSectionCutChange}
        />
        <SectionSlider 
          axis="z" 
          value={sectionPlane.axis === 'z' ? sectionPlane.position : 0}
          onChange={handleSectionCutChange}
        />
      </div>
    </div>
  );
  
  const CameraControls = () => (
    <div className="flex space-x-2 overflow-x-auto py-1 max-w-md">
      {cameraPositions.map((pos) => (
        <ControlButton
          key={pos.id}
          icon={pos.icon}
          label={pos.label}
          onClick={() => handleCameraPositionChange(pos.id)}
        />
      ))}
    </div>
  );
  
  const ColorModeControls = () => (
    <div className="flex space-x-2 overflow-x-auto py-1 max-w-md">
      {colorModes.map((mode) => (
        <ControlButton
          key={mode.id}
          icon={mode.icon}
          label={mode.label}
          active={colorMode === mode.id}
          onClick={() => handleColorModeChange(mode.id)}
        />
      ))}
    </div>
  );
  
  const ToggleControls = () => (
    <div className="flex space-x-2">
      <BooleanToggle
        value={wireframeEnabled}
        onToggle={handleToggleWireframe}
        label="Wireframe"
        icon="🔍"
      />
      <BooleanToggle
        value={explodedViewEnabled}
        onToggle={handleToggleExploded}
        label="Exploded"
        icon="💥"
      />
      <BooleanToggle
        value={annotationsEnabled}
        onToggle={handleToggleAnnotations}
        label="Labels"
        icon="🏷️"
      />
    </div>
  );
  
  const ZoomControls = () => (
    <div className="flex flex-col items-center space-y-1">
      <motion.button
        className="bg-gray-100 dark:bg-gray-800 rounded-md p-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onZoom(0.1)}
      >
        <span className="text-xl">+</span>
      </motion.button>
      <motion.button
        className="bg-gray-100 dark:bg-gray-800 rounded-md p-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onZoom(-0.1)}
      >
        <span className="text-xl">-</span>
      </motion.button>
    </div>
  );
  
  return (
    <div
      className={`fixed ${getPositionClasses()} z-10 ${className}`}
      style={style}
      {...props}
    >
      <div className="flex flex-wrap gap-4 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg">
        <div className="flex flex-col space-y-4">
          <ViewControls />
          <div className="flex space-x-4">
            <CameraControls />
            <ZoomControls />
          </div>
          <ColorModeControls />
          <ToggleControls />
          
          {sectionCutEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2"
            >
              <SectionControls />
            </motion.div>
          )}
          
          <div className="flex justify-end pt-2">
            <motion.button
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetView}
            >
              Reset View
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveModelControls; 