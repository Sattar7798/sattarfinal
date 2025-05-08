import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, Card, Tabs, Spin, Tag, Progress } from 'antd';
import { CaretUpOutlined, CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// Types for the component
interface DataAnalyzerProps {
  className?: string;
  dataSource?: string;
  showInsights?: boolean;
  theme?: 'light' | 'dark';
}

// Types for analysis results
interface AnalysisResult {
  id: string;
  datasetName: string;
  createdAt: string;
  metrics: {
    structuralIntegrity: number;
    vibrationStability: number;
    seismicResilience: number;
    materialEfficiency: number;
    overallScore: number;
  };
  anomalies: {
    count: number;
    severity: 'low' | 'medium' | 'high';
    locations: string[];
  };
  insights: string[];
  recommendations: string[];
  comparisonToNorms: {
    metric: string;
    value: number;
    benchmark: number;
    deviation: number;
  }[];
}

// Mock analysis results
const mockAnalysisResults: AnalysisResult[] = [
  {
    id: 'a1',
    datasetName: 'High-rise Building #42',
    createdAt: '2023-04-15T09:30:00Z',
    metrics: {
      structuralIntegrity: 87,
      vibrationStability: 92,
      seismicResilience: 76,
      materialEfficiency: 84,
      overallScore: 85
    },
    anomalies: {
      count: 3,
      severity: 'medium',
      locations: ['Floor 15 - East Wing', 'Floor 22 - Core Structure', 'Basement Level 2']
    },
    insights: [
      'Vibration response is within optimal range for the height category',
      'Seismic resilience is below average for buildings in this zone',
      'Material efficiency shows 12% improvement over traditional designs'
    ],
    recommendations: [
      'Reinforce eastern wing connections to improve lateral stability',
      'Consider additional damping elements for higher seismic performance',
      'Preventative maintenance for basement columns within next 6 months'
    ],
    comparisonToNorms: [
      { metric: 'Load Distribution', value: 0.92, benchmark: 0.85, deviation: 8.2 },
      { metric: 'Lateral Displacement', value: 0.05, benchmark: 0.08, deviation: -37.5 },
      { metric: 'Harmonic Response', value: 1.21, benchmark: 1.15, deviation: 5.2 }
    ]
  },
  {
    id: 'a2',
    datasetName: 'Bridge Structure #87',
    createdAt: '2023-05-22T14:45:00Z',
    metrics: {
      structuralIntegrity: 92,
      vibrationStability: 85,
      seismicResilience: 82,
      materialEfficiency: 79,
      overallScore: 84
    },
    anomalies: {
      count: 2,
      severity: 'low',
      locations: ['Support Pier 3', 'Expansion Joint 5']
    },
    insights: [
      'Superior weight distribution compared to design specifications',
      'Vibration dampening is less effective during high wind conditions',
      'Thermal expansion modeling indicates 7% higher stress points'
    ],
    recommendations: [
      'Adjust expansion joint tolerances at positions 4 through 7',
      'Apply additional corrosion protection to support piers',
      'Schedule inspection of cable tension after seasonal temperature cycle'
    ],
    comparisonToNorms: [
      { metric: 'Tensile Strength', value: 1.32, benchmark: 1.20, deviation: 10.0 },
      { metric: 'Fatigue Resistance', value: 0.88, benchmark: 0.90, deviation: -2.2 },
      { metric: 'Wind Response', value: 0.12, benchmark: 0.15, deviation: -20.0 }
    ]
  }
];

// Mock data sources
const dataSources = [
  { value: 'building-42', label: 'High-rise Building #42' },
  { value: 'bridge-87', label: 'Bridge Structure #87' },
  { value: 'hospital-15', label: 'Hospital Complex #15' },
  { value: 'stadium-03', label: 'Olympic Stadium #03' }
];

const DataAnalyzer: React.FC<DataAnalyzerProps> = ({
  className = '',
  dataSource = 'building-42',
  showInsights = true,
  theme = 'light'
}) => {
  const [selectedDataSource, setSelectedDataSource] = useState(dataSource);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics');
  
  // Get the appropriate analysis result based on selected data source
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      let result: AnalysisResult | undefined;
      
      if (selectedDataSource === 'building-42') {
        result = mockAnalysisResults[0];
      } else if (selectedDataSource === 'bridge-87') {
        result = mockAnalysisResults[1];
      } else {
        // Generate random data for other sources
        result = {
          ...mockAnalysisResults[0],
          datasetName: dataSources.find(ds => ds.value === selectedDataSource)?.label || 'Unknown',
          metrics: {
            structuralIntegrity: Math.floor(Math.random() * 30) + 70,
            vibrationStability: Math.floor(Math.random() * 30) + 70,
            seismicResilience: Math.floor(Math.random() * 30) + 70,
            materialEfficiency: Math.floor(Math.random() * 30) + 70,
            overallScore: Math.floor(Math.random() * 30) + 70
          }
        };
      }
      
      setAnalysisData(result);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [selectedDataSource]);
  
  // Get color based on severity or score
  const getColorForScore = (score: number) => {
    if (score >= 85) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 50) return 'orange';
    return 'red';
  };
  
  const getAnomalySeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      default: return 'blue';
    }
  };
  
  // Format deviation
  const formatDeviation = (deviation: number) => {
    const isPositive = deviation > 0;
    return (
      <span className="flex items-center">
        {isPositive ? (
          <CaretUpOutlined className="text-green-600" />
        ) : (
          <CaretDownOutlined className="text-red-600" />
        )}
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(deviation).toFixed(1)}%
        </span>
      </span>
    );
  };
  
  return (
    <motion.div
      className={`${className} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
        <h2 className="text-xl font-bold">Structural Data Analysis</h2>
        
        <div className="w-full md:w-64">
          <Select
            className="w-full"
            placeholder="Select data source"
            value={selectedDataSource}
            onChange={setSelectedDataSource}
            options={dataSources}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin tip="Analyzing structural data..." />
        </div>
      ) : analysisData ? (
        <div>
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-medium">{analysisData.datasetName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analyzed on {new Date(analysisData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="flex items-center">
                <span className="text-sm mr-2">Overall Score:</span>
                <Tag 
                  color={getColorForScore(analysisData.metrics.overallScore)}
                  className="text-lg px-3 py-1"
                >
                  {analysisData.metrics.overallScore}/100
                </Tag>
              </div>
            </div>
          </div>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Metrics" key="metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Structural Integrity" className="shadow-sm">
                  <div className="flex flex-col items-center">
                    <Progress 
                      type="dashboard" 
                      percent={analysisData.metrics.structuralIntegrity} 
                      gapDegree={30}
                      strokeColor={getColorForScore(analysisData.metrics.structuralIntegrity)}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Measures the overall structural soundness
                    </p>
                  </div>
                </Card>
                
                <Card title="Vibration Stability" className="shadow-sm">
                  <div className="flex flex-col items-center">
                    <Progress 
                      type="dashboard" 
                      percent={analysisData.metrics.vibrationStability}
                      gapDegree={30}
                      strokeColor={getColorForScore(analysisData.metrics.vibrationStability)}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Resistance to harmonic and forced vibrations
                    </p>
                  </div>
                </Card>
                
                <Card title="Seismic Resilience" className="shadow-sm">
                  <div className="flex flex-col items-center">
                    <Progress 
                      type="dashboard" 
                      percent={analysisData.metrics.seismicResilience}
                      gapDegree={30}
                      strokeColor={getColorForScore(analysisData.metrics.seismicResilience)}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Ability to withstand seismic events
                    </p>
                  </div>
                </Card>
                
                <Card title="Material Efficiency" className="shadow-sm">
                  <div className="flex flex-col items-center">
                    <Progress 
                      type="dashboard" 
                      percent={analysisData.metrics.materialEfficiency}
                      gapDegree={30}
                      strokeColor={getColorForScore(analysisData.metrics.materialEfficiency)}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Optimal use of materials relative to load
                    </p>
                  </div>
                </Card>
              </div>
            </TabPane>
            
            <TabPane tab="Anomalies" key="anomalies">
              <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium">Detected Anomalies</h4>
                  <Tag 
                    color={getAnomalySeverityColor(analysisData.anomalies.severity)}
                    className="px-3 py-1"
                  >
                    {analysisData.anomalies.count} Issues • {analysisData.anomalies.severity.toUpperCase()} Severity
                  </Tag>
                </div>
                
                <div className="space-y-2">
                  {analysisData.anomalies.locations.map((location, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <InfoCircleOutlined className="text-blue-500 mr-2 text-lg mt-0.5" />
                      <div>
                        <div className="font-medium">{location}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Requires inspection and potential maintenance
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabPane>
            
            {showInsights && (
              <TabPane tab="AI Insights" key="insights">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card title="Key Insights" className="shadow-sm">
                    <ul className="list-disc list-inside space-y-2">
                      {analysisData.insights.map((insight, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300">{insight}</li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card title="Recommendations" className="shadow-sm">
                    <ul className="list-disc list-inside space-y-2">
                      {analysisData.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300">{rec}</li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card title="Comparison to Standards" className="shadow-sm md:col-span-2">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Metric</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Benchmark</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Deviation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {analysisData.comparisonToNorms.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{item.metric}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-200">{item.value.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{item.benchmark.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-right">{formatDeviation(item.deviation)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No analysis data available.</p>
        </div>
      )}
    </motion.div>
  );
};

export default DataAnalyzer; 