import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ScatterDataPoint
} from 'chart.js';
import { Tabs, Select, Slider, Switch, Button, Spin, Progress } from 'antd';
import { LoadingOutlined, BarChartOutlined, LineChartOutlined, DotChartOutlined } from '@ant-design/icons';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Types for model data
interface ModelData {
  id: string;
  name: string;
  description: string;
  type: 'regression' | 'classification' | 'timeSeries';
  accuracy: number;
  lastUpdated: string;
  features: string[];
  availableDatasets: string[];
}

// Types for prediction result
interface PredictionResult {
  predictedValues: number[];
  actualValues?: number[];
  labels: string[];
  confidenceIntervals?: Array<[number, number]>;
  metrics?: {
    mse?: number;
    rmse?: number;
    mae?: number;
    r2?: number;
    accuracy?: number;
    precision?: number;
    recall?: number;
  };
}

// Mock models data - in real app, this would come from an API
const availableModels: ModelData[] = [
  {
    id: 'sm-1',
    name: 'Seismic Response Predictor',
    description: 'Predicts building response to various seismic intensities',
    type: 'regression',
    accuracy: 0.92,
    lastUpdated: '2023-05-15',
    features: ['building_height', 'num_stories', 'structural_type', 'soil_type', 'seismic_zone'],
    availableDatasets: ['California Earthquakes', 'Japan Tremors', 'Turkey Seismic Data']
  },
  {
    id: 'sm-2',
    name: 'Structural Degradation Classifier',
    description: 'Classifies structural elements based on degradation patterns',
    type: 'classification',
    accuracy: 0.89,
    lastUpdated: '2023-06-22',
    features: ['age', 'material', 'load_history', 'environmental_exposure', 'maintenance_level'],
    availableDatasets: ['Bridge Inspection Data', 'High-rise Building Reports', 'Hospital Structures']
  },
  {
    id: 'sm-3',
    name: 'Vibration Analysis Time Series',
    description: 'Analyzes structural vibrations and predicts future patterns',
    type: 'timeSeries',
    accuracy: 0.85,
    lastUpdated: '2023-07-10',
    features: ['vibration_amplitude', 'frequency', 'damping_ratio', 'load_condition', 'temperature'],
    availableDatasets: ['Wind Turbine Vibrations', 'Skyscraper Movement', 'Bridge Oscillations']
  },
];

// Parameters for models
interface PredictiveModelsProps {
  className?: string;
  showConfidenceIntervals?: boolean;
  allowModelComparison?: boolean;
  enableRealTimeData?: boolean;
  defaultModelId?: string;
  visualizationStyle?: 'line' | 'scatter' | 'bar';
  showMetrics?: boolean;
  theme?: 'light' | 'dark';
  initialModelType?: string;
  height?: string;
}

// Generate mock data for predictions
const generateMockPrediction = (
  modelId: string, 
  datasetName: string, 
  numPoints: number = 10
): PredictionResult => {
  // Random data based on model type
  const model = availableModels.find(m => m.id === modelId);
  const labels = Array.from({ length: numPoints }, (_, i) => `Point ${i+1}`);
  
  // Create predicted values with some randomness
  const predictedValues = Array.from({ length: numPoints }, () => 
    Math.random() * 100 * (model?.accuracy || 0.8)
  );
  
  // Create actual values that are close to predicted, but with some noise
  const actualValues = predictedValues.map(val => 
    val + (Math.random() - 0.5) * 20
  );
  
  // Generate confidence intervals
  const confidenceIntervals = predictedValues.map(val => [
    Math.max(0, val - Math.random() * 15),
    val + Math.random() * 15
  ] as [number, number]);
  
  // Calculate metrics
  const mse = actualValues.reduce((sum, val, i) => 
    sum + Math.pow(val - predictedValues[i], 2), 0) / numPoints;
    
  const rmse = Math.sqrt(mse);
  
  const mae = actualValues.reduce((sum, val, i) => 
    sum + Math.abs(val - predictedValues[i]), 0) / numPoints;
    
  const r2 = 1 - (mse / 
    actualValues.reduce((sum, val) => 
      sum + Math.pow(val - (actualValues.reduce((a, b) => a + b) / numPoints), 2), 0) / numPoints);
      
  return {
    predictedValues,
    actualValues,
    labels,
    confidenceIntervals,
    metrics: {
      mse,
      rmse,
      mae,
      r2,
      accuracy: model?.accuracy || 0.8,
      precision: model?.accuracy ? model.accuracy - 0.05 : 0.75,
      recall: model?.accuracy ? model.accuracy - 0.03 : 0.77,
    }
  };
};

// Main component
const PredictiveModels: React.FC<PredictiveModelsProps> = ({
  className = '',
  showConfidenceIntervals = true,
  allowModelComparison = true,
  enableRealTimeData = false,
  defaultModelId = 'sm-1',
  visualizationStyle = 'line',
  showMetrics = true,
  theme = 'light',
  initialModelType,
  height
}) => {
  // State management
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModelId);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [numDataPoints, setNumDataPoints] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [comparisonModelId, setComparisonModelId] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<PredictionResult | null>(null);
  const [visualizationType, setVisualizationType] = useState<'line' | 'scatter' | 'bar'>(visualizationStyle);
  
  // Reference to current model
  const selectedModel = availableModels.find(model => model.id === selectedModelId);
  
  // Set initial dataset
  useEffect(() => {
    if (selectedModel && selectedModel.availableDatasets.length > 0 && !selectedDataset) {
      setSelectedDataset(selectedModel.availableDatasets[0]);
    }
  }, [selectedModel, selectedDataset]);
  
  // Fetch prediction data
  const fetchPrediction = () => {
    if (!selectedModelId || !selectedDataset) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = generateMockPrediction(selectedModelId, selectedDataset, numDataPoints);
      setPredictionResult(result);
      setIsLoading(false);
    }, 1500);
  };
  
  // Fetch comparison data if needed
  const fetchComparisonData = () => {
    if (!comparisonModelId || !selectedDataset) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = generateMockPrediction(comparisonModelId, selectedDataset, numDataPoints);
      setComparisonResult(result);
      setIsLoading(false);
    }, 1200);
  };
  
  // Real-time data simulation with interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (enableRealTimeData && selectedModelId && selectedDataset) {
      interval = setInterval(() => {
        const result = generateMockPrediction(selectedModelId, selectedDataset, numDataPoints);
        setPredictionResult(result);
        
        if (comparisonModelId) {
          const compResult = generateMockPrediction(comparisonModelId, selectedDataset, numDataPoints);
          setComparisonResult(compResult);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enableRealTimeData, selectedModelId, comparisonModelId, selectedDataset, numDataPoints]);
  
  // Run prediction when model or dataset changes
  useEffect(() => {
    if (!enableRealTimeData && selectedModelId && selectedDataset) {
      fetchPrediction();
      
      if (comparisonModelId) {
        fetchComparisonData();
      }
    }
  }, [selectedModelId, selectedDataset, numDataPoints, comparisonModelId, enableRealTimeData]);
  
  // Generate chart data
  const chartData = {
    labels: predictionResult?.labels || [],
    datasets: [
      {
        label: `${selectedModel?.name || 'Model'} Predictions`,
        data: predictionResult?.predictedValues || [],
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.4)',
        pointBackgroundColor: 'rgba(53, 162, 235, 1)',
        pointRadius: 4,
      },
      ...(predictionResult?.actualValues ? [{
        label: 'Actual Values',
        data: predictionResult?.actualValues || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 4,
      }] : []),
      ...(comparisonResult ? [{
        label: `${availableModels.find(m => m.id === comparisonModelId)?.name || 'Comparison'} Predictions`,
        data: comparisonResult?.predictedValues || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 4,
      }] : []),
    ],
  };
  
  // Create different chart options by type
  const getChartOptionsByType = (type: 'line' | 'scatter' | 'bar') => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: theme === 'dark' ? '#ccc' : '#666',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: theme === 'dark' ? '#ccc' : '#666',
          },
        },
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: theme === 'dark' ? '#ccc' : '#666',
          },
        },
        tooltip: {
          backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          titleColor: theme === 'dark' ? '#fff' : '#000',
          bodyColor: theme === 'dark' ? '#ccc' : '#666',
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderWidth: 1,
        },
      },
    };

    return baseOptions;
  };

  // Chart options
  const lineChartOptions = getChartOptionsByType('line');
  const scatterChartOptions = getChartOptionsByType('scatter');
  const barChartOptions = getChartOptionsByType('bar');
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">AI Structural Prediction Models</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Select Model</label>
            <Select
              className="w-full"
              value={selectedModelId}
              onChange={setSelectedModelId}
              options={availableModels.map(model => ({
                value: model.id,
                label: model.name,
              }))}
              placeholder="Select a model"
            />
            {selectedModel && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedModel.description}
              </div>
            )}
          </div>
          
          {selectedModel && (
            <div>
              <label className="block mb-2 text-sm font-medium">Select Dataset</label>
              <Select
                className="w-full"
                value={selectedDataset}
                onChange={setSelectedDataset}
                options={selectedModel.availableDatasets.map(dataset => ({
                  value: dataset,
                  label: dataset,
                }))}
                placeholder="Select a dataset"
              />
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm font-medium">Number of Data Points</label>
            <Slider
              min={5}
              max={50}
              value={numDataPoints}
              onChange={(value) => {
                // Handle both single number and array cases
                const newValue = Array.isArray(value) ? value[0] : value;
                setNumDataPoints(newValue);
              }}
            />
          </div>
          
          {allowModelComparison && (
            <div>
              <label className="block mb-2 text-sm font-medium">Compare with Model</label>
              <Select
                className="w-full"
                value={comparisonModelId}
                onChange={setComparisonModelId}
                options={[
                  { value: '', label: 'None' },
                  ...availableModels
                    .filter(model => model.id !== selectedModelId)
                    .map(model => ({
                      value: model.id,
                      label: model.name,
                    }))
                ]}
                placeholder="Select comparison model"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Real-time Updates</label>
            <Switch
              checked={enableRealTimeData}
              onChange={(checked) => {
                // In a real app, this would be controlled by the parent
                // Here we just run the prediction again to simulate
                if (checked) {
                  fetchPrediction();
                  if (comparisonModelId) fetchComparisonData();
                }
              }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              onClick={fetchPrediction}
              disabled={isLoading || !selectedModelId || !selectedDataset}
              icon={isLoading ? <LoadingOutlined /> : undefined}
            >
              Run Prediction
            </Button>
            
            <div className="flex items-center gap-1">
              <Button 
                type={visualizationType === 'line' ? "primary" : "default"} 
                icon={<LineChartOutlined />}
                onClick={() => setVisualizationType('line')}
                size="small"
              />
              <Button 
                type={visualizationType === 'scatter' ? "primary" : "default"} 
                icon={<DotChartOutlined />}
                onClick={() => setVisualizationType('scatter')}
                size="small"
              />
              <Button 
                type={visualizationType === 'bar' ? "primary" : "default"} 
                icon={<BarChartOutlined />}
                onClick={() => setVisualizationType('bar')}
                size="small"
              />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spin tip="Running prediction..." />
            </div>
          ) : predictionResult ? (
            <div className="space-y-4">
              <div className="h-64">
                {visualizationType === 'line' && (
                  <Line data={chartData} options={lineChartOptions} />
                )}
                {visualizationType === 'scatter' && (
                  <Scatter data={chartData} options={scatterChartOptions} />
                )}
                {visualizationType === 'bar' && (
                  <Line data={chartData} options={barChartOptions} />
                )}
              </div>
              
              {showMetrics && predictionResult.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {selectedModel?.type === 'regression' && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Mean Squared Error</div>
                        <div className="text-lg font-semibold">{predictionResult.metrics.mse?.toFixed(3)}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Root MSE</div>
                        <div className="text-lg font-semibold">{predictionResult.metrics.rmse?.toFixed(3)}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Mean Abs Error</div>
                        <div className="text-lg font-semibold">{predictionResult.metrics.mae?.toFixed(3)}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">R² Score</div>
                        <div className="text-lg font-semibold">{predictionResult.metrics.r2?.toFixed(3)}</div>
                      </div>
                    </>
                  )}
                  
                  {selectedModel?.type === 'classification' && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Accuracy</div>
                        <div className="text-lg font-semibold">
                          {(predictionResult.metrics.accuracy || 0).toFixed(2)}
                          <Progress percent={Number((predictionResult.metrics.accuracy || 0) * 100)} size="small" />
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Precision</div>
                        <div className="text-lg font-semibold">
                          {(predictionResult.metrics.precision || 0).toFixed(2)}
                          <Progress percent={Number((predictionResult.metrics.precision || 0) * 100)} size="small" />
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Recall</div>
                        <div className="text-lg font-semibold">
                          {(predictionResult.metrics.recall || 0).toFixed(2)}
                          <Progress percent={Number((predictionResult.metrics.recall || 0) * 100)} size="small" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">
                Select a model and dataset to run predictions
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PredictiveModels; 