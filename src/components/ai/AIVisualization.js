'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Advanced AI Visualization Component
 * Creates interactive, data-rich visualizations for AI predictions in structural engineering
 */
const AIVisualization = ({
  type = 'displacement',
  title = 'AI Structural Analysis Visualization',
  showControls = true,
  height = 600,
  className = '',
}) => {
  // Core state
  const [visualizationType, setVisualizationType] = useState(type);
  const [isAnimating, setIsAnimating] = useState(false);
  const [accuracy, setAccuracy] = useState(92.5);
  const [confidence, setConfidence] = useState(0.85);
  const [smoothingLevel, setSmoothingLevel] = useState(0.5);
  const [dataRange, setDataRange] = useState({ min: 0, max: 100 });
  const [viewMode, setViewMode] = useState('chart'); // 'chart', 'heatmap', 'timeseries'
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState("Initializing component");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const chartRef = useRef(null);
  
  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
    setDebugInfo("Component mounted on client");
  }, []);
  
  // Debug effect to track chart container dimensions
  useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.getBoundingClientRect();
      setDebugInfo(`Chart container: ${width}px × ${height}px`);
    }
  }, [chartRef]);
  
  // Feature analysis data
  const features = [
    { name: 'Foundation Integrity', confidence: 0.95, status: 'normal' },
    { name: 'Beam-Column Connection', confidence: 0.72, status: 'warning' },
    { name: 'Lateral Load Resistance', confidence: 0.88, status: 'normal' },
    { name: 'Floor Diaphragm Performance', confidence: 0.93, status: 'normal' },
    { name: 'Steel Reinforcement Adequacy', confidence: 0.65, status: 'critical' }
  ];
  
  // Generate sample data for the charts
  const generateChartData = () => {
    // Time series data
    const timeSeriesData = {
      labels: ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s'],
      datasets: [
        {
          label: 'Actual Response',
          data: [0, 5, 15, 22, 18, 12, 5, -2, -8, -4, 0],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'AI Prediction',
          data: [0, 4, 13, 24, 20, 13, 6, -1, -7, -5, 0],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
        }
      ]
    };
    
    // Bar chart data based on visualization type
    let structuralData = [];
    
    switch(visualizationType) {
      case 'displacement':
        structuralData = [
          { label: 'Displacement', value: 24.3, color: '#3B82F6' },
          { label: 'Mean Absolute Error', value: 1.83, color: '#10B981' },
          { label: 'R² Score', value: 0.92, color: '#6366F1' },
          { label: 'Max Stress', value: 18.7, color: '#F59E0B' },
          { label: 'Damping Factor', value: 0.65, color: '#EC4899' }
        ];
        break;
      case 'stress':
        structuralData = [
          { label: 'Max Stress', value: 42.5, color: '#3B82F6' },
          { label: 'Prediction Accuracy', value: 94.1, color: '#10B981' },
          { label: 'Safety Factor', value: 2.14, color: '#6366F1' },
          { label: 'Stress Concentration', value: 3.2, color: '#F59E0B' },
          { label: 'Load Ratio', value: 0.78, color: '#EC4899' }
        ];
        break;
      case 'seismic':
        structuralData = [
          { label: 'Peak Acceleration', value: 0.35, color: '#3B82F6' },
          { label: 'Response Time', value: 2.4, color: '#10B981' },
          { label: 'Damping Ratio', value: 0.05, color: '#6366F1' },
          { label: 'Building Period', value: 1.2, color: '#F59E0B' },
          { label: 'Base Shear', value: 426, color: '#EC4899' }
        ];
        break;
      case 'vibration':
        structuralData = [
          { label: 'Resonant Freq', value: 2.81, color: '#3B82F6' },
          { label: 'Amplitude', value: 12.5, color: '#10B981' },
          { label: 'Modal Separation', value: 18.3, color: '#6366F1' },
          { label: 'Damping Coef', value: 0.08, color: '#F59E0B' },
          { label: 'Phase Shift', value: 24.6, color: '#EC4899' }
        ];
        break;
      default:
        structuralData = [
          { label: 'Displacement', value: 24.3, color: '#3B82F6' },
          { label: 'Mean Absolute Error', value: 1.83, color: '#10B981' },
          { label: 'R² Score', value: 0.92, color: '#6366F1' },
          { label: 'Max Stress', value: 18.7, color: '#F59E0B' },
          { label: 'Damping Factor', value: 0.65, color: '#EC4899' }
        ];
    }
    
    const barChartData = {
      labels: structuralData.map(d => d.label),
      datasets: [
        {
          label: 'Values',
          data: structuralData.map(d => d.value),
          backgroundColor: structuralData.map(d => d.color),
          borderWidth: 1,
        }
      ]
    };
    
    return { timeSeriesData, barChartData, structuralData };
  };
  
  const { timeSeriesData, barChartData } = generateChartData();
  
  // Fallback content for server-side rendering
  if (!isClient) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg text-center min-h-[300px] flex flex-col justify-center items-center">
        <p className="text-lg font-bold text-yellow-800 mb-2">Loading Visualization...</p>
        <p className="text-sm text-yellow-700">The visualization will appear once JavaScript is fully loaded.</p>
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mt-4"></div>
      </div>
    );
  }
  
  // Get metrics based on current visualization type
  const getMetrics = () => {
    const metrics = {
      displacement: {
        primaryMetric: { name: 'Max Displacement', value: '24.3', unit: 'mm' },
        secondaryMetrics: [
          { name: 'Mean Absolute Error', value: '1.83', unit: 'mm' },
          { name: 'R² Score', value: '0.92', unit: '' }
        ]
      },
      stress: {
        primaryMetric: { name: 'Max Stress', value: '42.5', unit: 'MPa' },
        secondaryMetrics: [
          { name: 'Prediction Accuracy', value: '94.1', unit: '%' },
          { name: 'Safety Factor', value: '2.14', unit: 'x' }
        ]
      },
      seismic: {
        primaryMetric: { name: 'Peak Acceleration', value: '0.35', unit: 'g' },
        secondaryMetrics: [
          { name: 'Response Time', value: '2.4', unit: 's' },
          { name: 'Damping Ratio', value: '0.05', unit: '' }
        ]
      },
      vibration: {
        primaryMetric: { name: 'Resonant Frequency', value: '2.81', unit: 'Hz' },
        secondaryMetrics: [
          { name: 'Amplitude', value: '12.5', unit: 'mm' },
          { name: 'Modal Separation', value: '18.3', unit: '%' }
        ]
      }
    };
    
    return metrics[visualizationType] || metrics.displacement;
  };
  
  const metrics = getMetrics();
  
  return (
    <div 
      className={`bg-white shadow-lg border-2 border-blue-200 rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">{title}</h2>
        
        {/* Debug info - useful during development */}
        <div className="bg-gray-100 border border-gray-300 p-2 mb-4 rounded-md">
          <p className="text-xs text-gray-700">Debug: {debugInfo}</p>
        </div>
        
        {/* Model type selector */}
        {showControls && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Analysis Type:</h3>
            <div className="flex flex-wrap gap-2">
              {['displacement', 'stress', 'seismic', 'vibration'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setVisualizationType(type);
                    setDebugInfo(`Changed model type to ${type}`);
                  }}
                  className={`py-2 px-4 rounded-lg capitalize ${
                    visualizationType === type 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* View mode toggle */}
        {showControls && (
          <div className="flex flex-wrap mb-6 gap-2">
            <button 
              onClick={() => {
                setViewMode('chart');
                setDebugInfo("Changed to chart view");
              }}
              className={`py-2 px-4 rounded-lg ${viewMode === 'chart' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Chart View
            </button>
            <button 
              onClick={() => {
                setViewMode('heatmap');
                setDebugInfo("Changed to heatmap view");
              }}
              className={`py-2 px-4 rounded-lg ${viewMode === 'heatmap' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Heatmap View
            </button>
            <button 
              onClick={() => {
                setViewMode('timeseries');
                setDebugInfo("Changed to time series view");
              }}
              className={`py-2 px-4 rounded-lg ${viewMode === 'timeseries' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Time Series
            </button>
          </div>
        )}
        
        {/* Controls */}
        {showControls && (
          <div className="mb-8 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoothing:</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={smoothingLevel} 
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    setSmoothingLevel(newValue);
                    setDebugInfo(`Smoothing changed to ${newValue.toFixed(2)}`);
                  }} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-500 min-w-[40px] text-right">{(smoothingLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confidence:</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={confidence} 
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    setConfidence(newValue);
                    setDebugInfo(`Confidence changed to ${newValue.toFixed(2)}`);
                  }} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-500 min-w-[40px] text-right">{(confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Visualization with fallback */}
        <div 
          ref={chartRef}
          className="bg-gray-100 p-4 rounded-lg mb-6 border border-gray-200"
          style={{ minHeight: '350px' }}
        >
          {viewMode === 'chart' && (
            <div className="h-80">
              <div className="h-full w-full">
                <Bar 
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: `${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)} Analysis Results`,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          
          {viewMode === 'timeseries' && (
            <div className="h-80">
              <div className="h-full w-full">
                <Line 
                  data={timeSeriesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Structural Response Over Time',
                      },
                    },
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'Displacement (mm)',
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Time',
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {viewMode === 'heatmap' && (
            <div className="h-80 flex items-center justify-center">
              {/* Simple heatmap visualization */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-md mx-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-center justify-center cursor-pointer shadow-md
                      ${feature.status === 'normal' 
                        ? 'bg-green-100 border-green-400' 
                        : feature.status === 'warning'
                          ? 'bg-yellow-100 border-yellow-400'
                          : 'bg-red-100 border-red-400'
                      } border-2 hover:brightness-95`}
                    onClick={() => {
                      setSelectedFeature(feature.name);
                      setDebugInfo(`Selected feature: ${feature.name}`);
                    }}
                  >
                    <div className="text-center p-1">
                      <div className="text-xs font-semibold mb-1">{feature.name}</div>
                      <div className={`text-sm font-bold ${
                        feature.confidence > 0.8 
                          ? 'text-green-700' 
                          : feature.confidence > 0.7 
                            ? 'text-yellow-700' 
                            : 'text-red-700'
                      }`}>
                        {Math.round(feature.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
            <div className="text-sm text-gray-500">{metrics.primaryMetric.name}</div>
            <div className="text-xl font-bold text-blue-700">{metrics.primaryMetric.value} <span className="text-sm font-normal">{metrics.primaryMetric.unit}</span></div>
            <div className="text-xs text-gray-500">AI prediction accuracy: {accuracy}%</div>
          </div>
          {metrics.secondaryMetrics.map((metric, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
              <div className="text-sm text-gray-500">{metric.name}</div>
              <div className="text-xl font-bold text-blue-700">{metric.value} <span className="text-sm font-normal">{metric.unit}</span></div>
              <div className="text-xs text-gray-500">Based on 500+ simulations</div>
            </div>
          ))}
        </div>
        
        {/* Feature detail panel - shows when a feature is selected */}
        {selectedFeature && (
          <motion.div 
            className="mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900">{selectedFeature} Analysis</h3>
              <button 
                onClick={() => setSelectedFeature(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Detailed analysis of {selectedFeature.toLowerCase()} shows structural performance is 
              {features.find(f => f.name === selectedFeature)?.status === 'normal' 
                ? ' within expected parameters.' 
                : features.find(f => f.name === selectedFeature)?.status === 'warning'
                  ? ' showing signs of potential weakness.' 
                  : ' indicating critical issues that need attention.'}
            </p>
            <div className="flex justify-center">
              <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    features.find(f => f.name === selectedFeature)?.status === 'normal'
                      ? 'bg-green-500'
                      : features.find(f => f.name === selectedFeature)?.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${(features.find(f => f.name === selectedFeature)?.confidence || 0) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIVisualization; 