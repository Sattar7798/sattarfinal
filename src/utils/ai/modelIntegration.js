/**
 * AI Model Integration Utilities for Structural Engineering Applications
 * 
 * This module provides utilities for integrating AI/ML models into the application,
 * loading models from various sources, running predictions, and managing model metadata.
 * It supports TensorFlow.js models, ONNX models, and custom API-based models.
 */

import * as tf from 'tensorflow/tfjs';
import { InferenceSession } from 'onnxruntime-web';

/**
 * Types of supported AI models
 */
export const MODEL_TYPES = {
  TENSORFLOW: 'tensorflow',
  ONNX: 'onnx',
  API: 'api'
};

/**
 * Model application domains
 */
export const MODEL_DOMAINS = {
  SEISMIC_RESPONSE: 'seismic_response',
  STRUCTURAL_HEALTH: 'structural_health',
  DAMAGE_DETECTION: 'damage_detection',
  LOAD_PREDICTION: 'load_prediction',
  OPTIMIZATION: 'optimization'
};

/**
 * Model metadata structure
 */
export class ModelMetadata {
  constructor({
    id,
    name,
    description,
    version,
    type,
    domain,
    inputShape,
    outputShape,
    accuracy,
    lastUpdated,
    sizeKB,
    author,
    citation,
    featureDescription,
    preprocessingSteps
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.version = version;
    this.type = type;
    this.domain = domain;
    this.inputShape = inputShape;
    this.outputShape = outputShape;
    this.accuracy = accuracy;
    this.lastUpdated = lastUpdated;
    this.sizeKB = sizeKB;
    this.author = author;
    this.citation = citation;
    this.featureDescription = featureDescription || [];
    this.preprocessingSteps = preprocessingSteps || [];
  }

  /**
   * Create metadata object from JSON
   */
  static fromJSON(json) {
    return new ModelMetadata(json);
  }

  /**
   * Convert metadata to JSON
   */
  toJSON() {
    return { ...this };
  }
}

/**
 * Base AI Model Wrapper Class
 */
export class AIModel {
  constructor(metadata) {
    this.metadata = metadata instanceof ModelMetadata 
      ? metadata 
      : new ModelMetadata(metadata);
    this.isLoaded = false;
    this.model = null;
    this.preprocessors = [];
    this.postprocessors = [];
  }

  /**
   * Add preprocessing function to pipeline
   */
  addPreprocessor(fn) {
    this.preprocessors.push(fn);
    return this;
  }

  /**
   * Add postprocessing function to pipeline
   */
  addPostprocessor(fn) {
    this.postprocessors.push(fn);
    return this;
  }

  /**
   * Process input through preprocessing pipeline
   */
  preprocess(input) {
    return this.preprocessors.reduce((data, fn) => fn(data), input);
  }

  /**
   * Process output through postprocessing pipeline
   */
  postprocess(output) {
    return this.postprocessors.reduce((data, fn) => fn(data), output);
  }

  /**
   * Load the model (to be implemented by subclasses)
   */
  async load() {
    throw new Error('Method not implemented');
  }

  /**
   * Run prediction (to be implemented by subclasses)
   */
  async predict(input) {
    throw new Error('Method not implemented');
  }

  /**
   * Dispose of model resources
   */
  dispose() {
    this.isLoaded = false;
    this.model = null;
  }
}

/**
 * TensorFlow.js Model Wrapper
 */
export class TensorFlowModel extends AIModel {
  constructor(metadata, modelPath) {
    super(metadata);
    this.modelPath = modelPath;
  }

  /**
   * Load TensorFlow.js model
   */
  async load() {
    try {
      this.model = await tf.loadLayersModel(this.modelPath);
      this.isLoaded = true;
      console.log(`Model ${this.metadata.name} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error loading model ${this.metadata.name}:`, error);
      return false;
    }
  }

  /**
   * Run prediction with TensorFlow.js model
   */
  async predict(input) {
    if (!this.isLoaded) {
      await this.load();
    }

    try {
      // Apply preprocessing
      const processedInput = this.preprocess(input);
      
      // Convert to tensor
      const inputTensor = tf.tensor(processedInput);
      
      // Run prediction
      const outputTensor = this.model.predict(inputTensor);
      
      // Get data from tensor
      const output = await outputTensor.array();
      
      // Clean up tensors
      inputTensor.dispose();
      outputTensor.dispose();
      
      // Apply postprocessing
      return this.postprocess(output);
    } catch (error) {
      console.error(`Prediction error for model ${this.metadata.name}:`, error);
      throw error;
    }
  }

  /**
   * Dispose of TensorFlow resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
    }
    super.dispose();
  }
}

/**
 * ONNX Model Wrapper
 */
export class ONNXModel extends AIModel {
  constructor(metadata, modelPath) {
    super(metadata);
    this.modelPath = modelPath;
    this.session = null;
  }

  /**
   * Load ONNX model
   */
  async load() {
    try {
      const response = await fetch(this.modelPath);
      const modelBuffer = await response.arrayBuffer();
      this.session = await InferenceSession.create(modelBuffer);
      this.isLoaded = true;
      console.log(`ONNX Model ${this.metadata.name} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error loading ONNX model ${this.metadata.name}:`, error);
      return false;
    }
  }

  /**
   * Run prediction with ONNX model
   */
  async predict(input) {
    if (!this.isLoaded) {
      await this.load();
    }

    try {
      // Apply preprocessing
      const processedInput = this.preprocess(input);
      
      // Prepare input data for ONNX
      const inputName = this.session.inputNames[0];
      const feeds = {};
      feeds[inputName] = new Float32Array(processedInput.flat());
      
      // Run inference
      const outputMap = await this.session.run(feeds);
      const outputData = outputMap[this.session.outputNames[0]];
      
      // Apply postprocessing
      return this.postprocess(Array.from(outputData.data));
    } catch (error) {
      console.error(`ONNX prediction error for model ${this.metadata.name}:`, error);
      throw error;
    }
  }
  
  /**
   * Dispose of ONNX resources
   */
  dispose() {
    if (this.session) {
      // ONNX Runtime doesn't have an explicit dispose method
      this.session = null;
    }
    super.dispose();
  }
}

/**
 * API-based Model Wrapper
 */
export class APIModel extends AIModel {
  constructor(metadata, endpoint) {
    super(metadata);
    this.endpoint = endpoint;
    this.authToken = null;
  }

  /**
   * Set authentication token for API calls
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Load model (verify API endpoint)
   */
  async load() {
    try {
      // Verify API is available
      const response = await fetch(`${this.endpoint}/health`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (response.ok) {
        this.isLoaded = true;
        console.log(`API Model ${this.metadata.name} connected successfully`);
        return true;
      } else {
        console.error(`API Model ${this.metadata.name} is not available`);
        return false;
      }
    } catch (error) {
      console.error(`Error connecting to API model ${this.metadata.name}:`, error);
      return false;
    }
  }

  /**
   * Get headers for API requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Run prediction via API
   */
  async predict(input) {
    try {
      // Apply preprocessing
      const processedInput = this.preprocess(input);
      
      // Make API request
      const response = await fetch(`${this.endpoint}/predict`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ input: processedInput })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Apply postprocessing
      return this.postprocess(result.prediction);
    } catch (error) {
      console.error(`API prediction error for model ${this.metadata.name}:`, error);
      throw error;
    }
  }
}

/**
 * Model Registry for managing multiple models
 */
export class ModelRegistry {
  constructor() {
    this.models = new Map();
  }

  /**
   * Register a model
   */
  registerModel(model) {
    this.models.set(model.metadata.id, model);
    return this;
  }

  /**
   * Get a model by ID
   */
  getModel(id) {
    return this.models.get(id);
  }

  /**
   * Get all models
   */
  getAllModels() {
    return Array.from(this.models.values());
  }

  /**
   * Get models by domain
   */
  getModelsByDomain(domain) {
    return this.getAllModels().filter(model => model.metadata.domain === domain);
  }

  /**
   * Get models by type
   */
  getModelsByType(type) {
    return this.getAllModels().filter(model => model.metadata.type === type);
  }

  /**
   * Load all models
   */
  async loadAllModels() {
    const loadPromises = Array.from(this.models.values()).map(model => model.load());
    return Promise.all(loadPromises);
  }

  /**
   * Dispose all models
   */
  disposeAllModels() {
    this.models.forEach(model => model.dispose());
  }
}

/**
 * Create a model factory based on model type
 */
export function createModel(metadata, path) {
  switch (metadata.type) {
    case MODEL_TYPES.TENSORFLOW:
      return new TensorFlowModel(metadata, path);
    case MODEL_TYPES.ONNX:
      return new ONNXModel(metadata, path);
    case MODEL_TYPES.API:
      return new APIModel(metadata, path);
    default:
      throw new Error(`Unsupported model type: ${metadata.type}`);
  }
}

/**
 * Standard preprocessing functions
 */
export const preprocessors = {
  normalize: (mean, std) => (data) => {
    return data.map(value => (value - mean) / std);
  },
  
  scale: (min, max) => (data) => {
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const range = dataMax - dataMin;
    return data.map(value => min + ((value - dataMin) / range) * (max - min));
  },
  
  reshape: (shape) => (data) => {
    // Simple reshape for 1D arrays to 2D
    if (shape.length === 2) {
      const [rows, cols] = shape;
      const result = [];
      for (let i = 0; i < rows; i++) {
        result.push(data.slice(i * cols, (i + 1) * cols));
      }
      return result;
    }
    return data;
  }
};

/**
 * Standard postprocessing functions
 */
export const postprocessors = {
  denormalize: (mean, std) => (data) => {
    return data.map(value => value * std + mean);
  },
  
  threshold: (threshold) => (data) => {
    return data.map(value => value > threshold ? 1 : 0);
  },
  
  argmax: () => (data) => {
    if (Array.isArray(data[0])) {
      // Multiple predictions
      return data.map(prediction => {
        const max = Math.max(...prediction);
        return prediction.indexOf(max);
      });
    } else {
      // Single prediction
      const max = Math.max(...data);
      return data.indexOf(max);
    }
  }
};

/**
 * Helper to load a model from the server
 */
export async function loadModelFromServer(modelId) {
  try {
    // Fetch model metadata
    const metadataResponse = await fetch(`/api/models/${modelId}/metadata`);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch model metadata: ${metadataResponse.statusText}`);
    }
    
    const metadata = await metadataResponse.json();
    
    // Create model based on type
    let model;
    switch (metadata.type) {
      case MODEL_TYPES.TENSORFLOW:
        model = new TensorFlowModel(metadata, `/api/models/${modelId}/model.json`);
        break;
      case MODEL_TYPES.ONNX:
        model = new ONNXModel(metadata, `/api/models/${modelId}/model.onnx`);
        break;
      case MODEL_TYPES.API:
        model = new APIModel(metadata, `/api/models/${modelId}/predict`);
        break;
      default:
        throw new Error(`Unsupported model type: ${metadata.type}`);
    }
    
    // Load the model
    await model.load();
    
    return model;
  } catch (error) {
    console.error('Error loading model from server:', error);
    throw error;
  }
}

export default {
  MODEL_TYPES,
  MODEL_DOMAINS,
  ModelMetadata,
  AIModel,
  TensorFlowModel,
  ONNXModel,
  APIModel,
  ModelRegistry,
  createModel,
  preprocessors,
  postprocessors,
  loadModelFromServer
}; 