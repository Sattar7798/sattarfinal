import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Advanced SeismicVisualization component
 * Creates interactive, data-rich visualizations for seismic response
 */
const SeismicVisualization = ({
  initialIntensity = 0.3,
  width = '100%',
  height = '600px',
  className = '',
}) => {
  // Core state for earthquake parameters
  const [magnitude, setMagnitude] = useState(6.5);
  const [distance, setDistance] = useState(20);
  const [soilType, setSoilType] = useState('stiff');
  const [damping, setDamping] = useState(0.05);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  
  // Canvas ref
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Animation state
  const [currentTime, setCurrentTime] = useState(0);
  const [buildingDisplacement, setBuildingDisplacement] = useState(0);
  
  // Animation parameters
  const [animationData, setAnimationData] = useState({
    frequency: 2,
    maxAmplitude: 1,
    dampingRatio: 0.05
  });
  
  // Get calculated values based on inputs
  const getCalculatedValues = () => {
    // Peak ground acceleration (simplified model)
    // Based on magnitude and distance
    const pga = Math.pow(10, magnitude - 4.5) / Math.sqrt(distance) * 0.1;
    
    // Amplification factor based on soil type
    const soilFactors = {
      'rock': 1.0,
      'stiff': 1.3,
      'soft': 1.8,
      'very-soft': 2.5
    };
    
    // Get frequency and amplitude based on parameters
    const frequency = 2.0 - (magnitude - 4.0) * 0.2; // Lower frequency for larger magnitude
    const maxAmplitude = pga * soilFactors[soilType];
    
    // Return values
    return {
      frequency,
      maxAmplitude,
      dampingRatio: damping,
      pga: pga.toFixed(2)
    };
  };
  
  // Update animation data when parameters change
  useEffect(() => {
    const values = getCalculatedValues();
    setAnimationData({
      frequency: values.frequency,
      maxAmplitude: values.maxAmplitude,
      dampingRatio: values.dampingRatio
    });
  }, [magnitude, distance, soilType, damping]);
  
  // Draw animation frame
  const drawFrame = (time) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw ground
    const groundY = height * 0.75;
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Calculate ground motion (horizontal sinusoidal motion)
    const { frequency, maxAmplitude } = animationData;
    const groundMotion = Math.sin(2 * Math.PI * frequency * time) * maxAmplitude * 30;
    
    // Calculate building response (with phase lag and amplification at top)
    // Using simplified SDOF response
    const dampingFactor = Math.exp(-animationData.dampingRatio * 2 * Math.PI * frequency * time);
    const buildingResp = -groundMotion * dampingFactor * 1.5;
    setBuildingDisplacement(buildingResp);
    
    // Draw building (10-story)
    const buildingWidth = width * 0.3;
    const buildingHeight = groundY * 0.8;
    const buildingX = width / 2 - buildingWidth / 2;
    const buildingY = groundY - buildingHeight;
    
    // Number of floors
    const numFloors = 10;
    const floorHeight = buildingHeight / numFloors;
    
    // Draw each floor with increasing displacement at higher floors
    for (let floor = 0; floor <= numFloors; floor++) {
      const floorY = groundY - floor * floorHeight;
      
      // Displacement increases with height (mode shape)
      const floorDisplacement = buildingResp * (floor / numFloors);
      
      // Draw floor slab
      ctx.fillStyle = floor === 0 ? '#1e40af' : '#3b82f6';
      ctx.fillRect(buildingX + floorDisplacement, floorY - 5, buildingWidth, 10);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(buildingX + floorDisplacement, floorY - 5, buildingWidth, 10);
      
      // Draw columns for all floors except the top
      if (floor < numFloors) {
        const nextFloorDisp = buildingResp * ((floor + 1) / numFloors);
        
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        // Left column
        ctx.beginPath();
        ctx.moveTo(buildingX + floorDisplacement, floorY);
        ctx.lineTo(buildingX + nextFloorDisp, floorY - floorHeight);
        ctx.stroke();
        
        // Right column
        ctx.beginPath();
        ctx.moveTo(buildingX + floorDisplacement + buildingWidth, floorY);
        ctx.lineTo(buildingX + nextFloorDisp + buildingWidth, floorY - floorHeight);
        ctx.stroke();
      }
    }
    
    // Draw ground motion arrow
    const arrowLength = Math.abs(groundMotion);
    const arrowDirection = groundMotion > 0 ? 1 : -1;
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
    ctx.lineTo(width / 2, groundY + 15);
    ctx.lineTo(width / 2, groundY + 25);
    ctx.closePath();
    ctx.fill();
    
    // Arrow line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2, groundY + 20);
    ctx.lineTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
    ctx.stroke();
    
    // Add visual wave pattern in ground
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    for (let x = 0; x < width; x += 5) {
      // Create wave pattern based on current time and position
      const y = groundY + 5 + Math.sin(x / 20 + time * 10) * 3;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Add info text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const pga = getCalculatedValues().pga;
    ctx.fillText(`Peak Ground Acceleration: ${pga}g`, width / 2, groundY + 50);
    
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Max Displacement: ${Math.abs(buildingResp * 0.3).toFixed(1)} cm`, width / 2, buildingY - 20);
  };
  
  // Animation loop
  const animate = () => {
    if (!isPlaying) return;
    
    setCurrentTime(prevTime => {
      const newTime = prevTime + 0.016 * speed; // ~60fps with speed factor
      drawFrame(newTime);
      return newTime;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);
  
  // Initialize canvas
  useEffect(() => {
    // Initial draw
    drawFrame(0);
  }, []);

  return (
    <div className={`seismic-visualization ${className}`} style={{ width, position: 'relative' }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main visualization area */}
        <div className="flex-grow">
          <div 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative"
            style={{ height }}
          >
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600}
              className="w-full h-full"
            />
            
            {/* Playback controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              {!isPlaying ? (
                <button 
                  onClick={() => setIsPlaying(true)} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Play Simulation
                </button>
              ) : (
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Pause
                </button>
              )}
              <button 
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                  drawFrame(0);
                }} 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
            
            {/* Information panel */}
            {isPlaying && (
              <motion.div 
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-2 text-lg font-bold text-blue-600">
                  Earthquake Simulation
                </div>
                <div className="mb-1">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Magnitude:</span>
                  <span className="ml-2 font-mono">{magnitude.toFixed(1)}</span>
                </div>
                <div className="mb-1">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Distance:</span>
                  <span className="ml-2 font-mono">{distance} km</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Soil Type:</span>
                  <span className="ml-2 font-mono">{soilType}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Controls panel */}
        <div className="md:w-72 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-bold mb-4">Earthquake Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex justify-between mb-1">
                <span>Magnitude:</span>
                <span className="font-mono">{magnitude.toFixed(1)}</span>
              </label>
              <input 
                type="range" 
                min="4.0" 
                max="8.0" 
                step="0.1" 
                value={magnitude}
                onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="flex justify-between mb-1">
                <span>Distance (km):</span>
                <span className="font-mono">{distance}</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="100" 
                step="5" 
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="flex justify-between mb-1">
                <span>Soil Type:</span>
              </label>
              <select 
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="rock">Rock</option>
                <option value="stiff">Stiff Soil</option>
                <option value="soft">Soft Soil</option>
                <option value="very-soft">Very Soft Soil</option>
              </select>
            </div>
            
            <div>
              <label className="flex justify-between mb-1">
                <span>Building Damping:</span>
                <span className="font-mono">{(damping * 100).toFixed(0)}%</span>
              </label>
              <input 
                type="range" 
                min="0.01" 
                max="0.20" 
                step="0.01" 
                value={damping}
                onChange={(e) => setDamping(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {isPlaying && (
              <div>
                <label className="flex justify-between mb-1">
                  <span>Simulation Speed:</span>
                  <span className="font-mono">{speed.toFixed(1)}x</span>
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2.0" 
                  step="0.1" 
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This simulation demonstrates how buildings respond to seismic forces with different soil types and magnitudes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeismicVisualization;