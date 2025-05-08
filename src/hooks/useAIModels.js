import { useState, useEffect } from 'react';

/**
 * Sample model predictions for demonstration purposes
 */
const SAMPLE_PREDICTIONS = {
  displacement: {
    input: {
      buildingHeight: 50,
      numStories: 15,
      structureType: 'shear-wall',
      soilType: 'medium',
      earthquakeIntensity: 0.35,
    },
    output: {
      maxDisplacement: 0.245,
      maxStoreyDrift: 0.0082,
      displacementByFloor: Array.from({ length: 15 }, (_, i) => {
        const height = (i + 1) / 15;
        return {
          floor: i + 1,
          displacement: 0.245 * Math.pow(height, 1.5),
          drift: 0.0082 * Math.sin(Math.PI * height),
        };
      }),
    }
  },
  damage: {
    input: {
      buildingType: 'concrete-moment-frame',
      age: 35,
      location: 'urban',
      peakGroundAcceleration: 0.4,
      duration: 25,
    },
    output: {
      damageState: 'Moderate',
      damageIndex: 0.42,
      confidenceScore: 0.85,
      vulnerableAreas: ['beam-column-joints', 'shear-walls'],
      recommendedActions: [
        'Detailed structural inspection',
        'Retrofit beam-column connections',
        'Add supplemental damping devices',
      ]
    }
  },
  damageDetection: {
    input: {
      imageUrl: '/assets/images/sample-crack-detection.jpg',
    },
    output: {
      detections: [
        {
          type: 'crack',
          confidence: 0.92,
          width: '1.2mm',
          severity: 'medium',
          boundingBox: { x: 0.2, y: 0.3, width: 0.4, height: 0.05 },
        },
        {
          type: 'spalling',
          confidence: 0.88,
          area: '25cm²',
          severity: 'high',
          boundingBox: { x: 0.6, y: 0.5, width: 0.2, height: 0.2 },
        }
      ],
      overallAssessment: 'Structural damage detected, requires further inspection.'
    }
  }
};

/**
 * Custom hook for interfacing with AI models to get predictions
 * 
 * @param {Object} options Configuration options
 * @param {string} options.modelType Type of AI model to use
 * @param {Object} options.modelInputs Input parameters for the model
 * @param {boolean} options.useSample Whether to use sample data (for demo/development)
 * @param {string} options.apiEndpoint API endpoint for the model
 * @returns {Object} Model predictions and utility functions
 */
const useAIModels = ({
  modelType = 'displacement',
  modelInputs = {},
  useSample = true,
  apiEndpoint = '/api/ai-model',
} = {}) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelParams, setModelParams] = useState({
    modelType,
    ...modelInputs,
  });

  // Get predictions from AI model
  const getPrediction = async (inputs = null) => {
    setLoading(true);
    setError(null);

    try {
      if (useSample) {
        // Use sample predictions for demonstration
        setTimeout(() => {
          const sampleData = SAMPLE_PREDICTIONS[modelType] || SAMPLE_PREDICTIONS.displacement;
          setPrediction(sampleData.output);
          setLoading(false);
        }, 800); // Simulate API delay
      } else {
        // In a real app, use API to get predictions
        const modelData = {
          modelType,
          inputs: inputs || modelParams,
        };

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(modelData),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        setPrediction(result.prediction);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Error getting model prediction');
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    getPrediction();
  }, []); // Empty dependency array means this runs once on mount

  // Update model parameters
  const updateModelParams = (newParams) => {
    setModelParams(prev => ({
      ...prev,
      ...newParams,
    }));
  };

  // Run model with updated parameters
  const runModel = (inputs = null) => {
    if (inputs) {
      updateModelParams(inputs);
    }
    getPrediction(inputs || modelParams);
  };

  // Format displacement data for visualization
  const formatDisplacementData = () => {
    if (!prediction || !prediction.displacementByFloor) return null;

    return {
      labels: prediction.displacementByFloor.map(d => `Floor ${d.floor}`),
      datasets: [
        {
          label: 'Displacement (m)',
          data: prediction.displacementByFloor.map(d => d.displacement),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Drift Ratio',
          data: prediction.displacementByFloor.map(d => d.drift),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    };
  };

  // Get available models and descriptions
  const getAvailableModels = () => {
    return [
      {
        id: 'displacement',
        name: 'Displacement Prediction',
        description: 'Predicts building displacement and story drift under seismic loads',
        inputParams: ['buildingHeight', 'numStories', 'structureType', 'soilType', 'earthquakeIntensity'],
      },
      {
        id: 'damage',
        name: 'Damage Assessment',
        description: 'Estimates building damage state and vulnerability based on structural parameters',
        inputParams: ['buildingType', 'age', 'location', 'peakGroundAcceleration', 'duration'],
      },
      {
        id: 'damageDetection',
        name: 'Damage Detection',
        description: 'Detects and classifies structural damage from images using computer vision',
        inputParams: ['imageUrl'],
      }
    ];
  };

  return {
    prediction,
    loading,
    error,
    modelParams,
    updateModelParams,
    runModel,
    formatDisplacementData,
    getAvailableModels,
  };
};

export default useAIModels; 