import * as THREE from 'three';
import { SeismicWaveform } from './dataProcessor';

/**
 * Parameters for generating seismic waveforms
 */
export interface WaveformGeneratorParams {
  duration?: number;          // Duration in seconds
  sampleRate?: number;        // Sample rate in Hz
  magnitude?: number;         // Earthquake magnitude (Richter scale)
  distance?: number;          // Distance from epicenter in km
  depth?: number;             // Focal depth in km
  soilType?: 'rock' | 'stiff' | 'soft' | 'very-soft'; // Site soil type
  seedValue?: number;         // Random seed for reproducibility
  peakAcceleration?: number;  // Target peak ground acceleration in g
  component?: 'N-S' | 'E-W' | 'Z'; // Component direction
}

/**
 * Parameters for creating specific waveform shapes
 */
export interface WaveformShapeParams {
  type: 'sinusoidal' | 'ricker' | 'pulse' | 'step' | 'noise' | 'custom';
  frequency?: number;         // Main frequency in Hz
  amplitude?: number;         // Peak amplitude
  delay?: number;             // Time delay in seconds
  duration?: number;          // Pulse duration in seconds
  customFunction?: (t: number) => number; // Custom waveform function
}

/**
 * Parameters for spectrum-compatible waveform generation
 */
export interface SpectrumParams {
  periods: number[];          // Array of period values in seconds
  targetSpectrum: number[];   // Target spectral acceleration values
  iterations?: number;        // Number of iterations for matching
  tolerance?: number;         // Convergence tolerance
  dampingRatio?: number;      // Damping ratio (default: 0.05 = 5%)
}

/**
 * Generate a realistic earthquake waveform based on parameters
 * @param params Parameters for the waveform generation
 * @returns Generated seismic waveform
 */
export function generateRealisticWaveform(params: WaveformGeneratorParams = {}): SeismicWaveform {
  const {
    duration = 30,
    sampleRate = 100,
    magnitude = 6.5,
    distance = 25,
    depth = 10,
    soilType = 'stiff',
    seedValue = Math.random() * 1000,
    peakAcceleration = 0.3,
    component = 'E-W'
  } = params;
  
  // Use seedValue to generate reproducible random numbers
  const seed = seedValue;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  // Calculate expected peak ground acceleration based on magnitude and distance
  // This is a simplified empirical relationship
  let expectedPGA = Math.exp(magnitude - 0.05 * Math.log(distance + 10) - 3.5);
  
  // Adjust for soil type
  const soilFactor = {
    'rock': 1.0,
    'stiff': 1.2,
    'soft': 1.5,
    'very-soft': 2.0
  }[soilType] || 1.0;
  
  expectedPGA *= soilFactor;
  
  // Override with user-specified PGA if provided
  const targetPGA = peakAcceleration !== undefined ? peakAcceleration : expectedPGA;
  
  // Calculate frequency content based on magnitude and distance
  // Larger magnitudes tend to have more low-frequency content
  // Closer distances tend to have more high-frequency content
  const cornerFrequency = 4.0 * Math.exp(-0.5 * magnitude) + 0.2;
  const highFreqDecay = 1.0 + distance / 50.0;
  
  // Generate time array
  const numPoints = Math.floor(duration * sampleRate);
  const time: number[] = [];
  const amplitude: number[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    time.push(i / sampleRate);
  }
  
  // Define the envelope function (build-up, strong motion, and decay)
  const envelopeFunction = (t: number) => {
    const riseTime = duration * 0.2;
    const strongMotionDuration = duration * 0.4;
    const decayTime = duration * 0.4;
    
    if (t < riseTime) {
      // Build-up phase
      return Math.pow(t / riseTime, 2);
    } else if (t < riseTime + strongMotionDuration) {
      // Strong motion phase
      return 1.0;
    } else if (t < duration) {
      // Decay phase
      const decayProgress = (t - riseTime - strongMotionDuration) / decayTime;
      return Math.exp(-3 * decayProgress);
    } else {
      return 0;
    }
  };
  
  // Generate frequency array for summing
  const frequencies: number[] = [];
  const frequencyAmplitudes: number[] = [];
  
  // Use frequencies from 0.1 Hz to 25 Hz
  const numFrequencies = 100;
  const minFreq = 0.1;
  const maxFreq = 25.0;
  
  for (let i = 0; i < numFrequencies; i++) {
    // Logarithmic frequency spacing
    const f = minFreq * Math.pow(maxFreq / minFreq, i / (numFrequencies - 1));
    frequencies.push(f);
    
    // Frequency-dependent amplitude based on simplified spectrum
    let amp = 1.0;
    
    if (f < cornerFrequency) {
      // Low frequency range
      amp = Math.pow(f / cornerFrequency, 1.0);
    } else {
      // High frequency range
      amp = Math.pow(cornerFrequency / f, highFreqDecay);
    }
    
    // Add randomness
    amp *= 0.7 + 0.6 * random();
    
    frequencyAmplitudes.push(amp);
  }
  
  // Generate the waveform
  for (let i = 0; i < numPoints; i++) {
    const t = time[i];
    let value = 0;
    
    for (let j = 0; j < frequencies.length; j++) {
      const f = frequencies[j];
      const a = frequencyAmplitudes[j];
      const phase = 2 * Math.PI * random(); // Random phase
      
      value += a * Math.sin(2 * Math.PI * f * t + phase);
    }
    
    // Apply envelope
    const envelope = envelopeFunction(t);
    value *= envelope;
    
    amplitude.push(value);
  }
  
  // Normalize to target PGA
  const currentPeak = Math.max(...amplitude.map(a => Math.abs(a)));
  const scaleFactor = targetPGA / currentPeak;
  
  for (let i = 0; i < amplitude.length; i++) {
    amplitude[i] *= scaleFactor;
  }
  
  return {
    time,
    amplitude,
    metadata: {
      magnitude,
      depth,
      distance,
      sampleRate,
      component,
      units: 'g'
    }
  };
}

/**
 * Generate a simple waveform with specific shape
 * @param shape Parameters for the waveform shape
 * @param duration Duration in seconds
 * @param sampleRate Sample rate in Hz
 * @returns Generated seismic waveform
 */
export function generateShapeWaveform(
  shape: WaveformShapeParams,
  duration: number = 10,
  sampleRate: number = 100
): SeismicWaveform {
  const {
    type,
    frequency = 1.0,
    amplitude = 1.0,
    delay = 0.0,
    customFunction
  } = shape;
  
  const numPoints = Math.floor(duration * sampleRate);
  const time: number[] = [];
  const waveformAmplitude: number[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const t = i / sampleRate;
    time.push(t);
    
    let value = 0;
    const adjustedTime = t - delay;
    
    if (adjustedTime < 0) {
      waveformAmplitude.push(0);
      continue;
    }
    
    switch (type) {
      case 'sinusoidal':
        value = Math.sin(2 * Math.PI * frequency * adjustedTime);
        break;
        
      case 'ricker': {
        // Ricker wavelet (Mexican hat)
        const tau = Math.PI * frequency * adjustedTime;
        const tau2 = tau * tau;
        value = (1 - 2 * tau2) * Math.exp(-tau2);
        break;
      }
        
      case 'pulse': {
        // Pulse function
        const pulseDuration = shape.duration || 1.0;
        value = (adjustedTime < pulseDuration) ? 1.0 : 0.0;
        break;
      }
        
      case 'step': {
        // Step function
        value = 1.0;
        break;
      }
        
      case 'noise': {
        // Random noise
        value = Math.random() * 2 - 1;
        break;
      }
        
      case 'custom': {
        // Custom function
        if (customFunction) {
          value = customFunction(adjustedTime);
        }
        break;
      }
    }
    
    waveformAmplitude.push(value * amplitude);
  }
  
  return {
    time,
    amplitude: waveformAmplitude,
    metadata: {
      sampleRate,
      units: 'g'
    }
  };
}

/**
 * Generate a spectrum-compatible accelerogram
 * @param spectrumParams Target response spectrum parameters
 * @param baseWaveform Starting waveform to adjust (if not provided, a random one is generated)
 * @returns Spectrum-compatible waveform
 */
export function generateSpectrumCompatibleWaveform(
  spectrumParams: SpectrumParams,
  baseWaveform?: SeismicWaveform
): SeismicWaveform {
  const {
    periods,
    targetSpectrum,
    iterations = 10,
    tolerance = 0.1,
    dampingRatio = 0.05
  } = spectrumParams;
  
  // Generate a base waveform if not provided
  const waveform = baseWaveform || generateRealisticWaveform({
    duration: 30,
    sampleRate: 100
  });
  
  // In a real implementation, this would involve an iterative process
  // to adjust the waveform until its response spectrum matches the target
  // This is a complex algorithm (response spectrum matching)
  
  // For this example, we'll just return the base waveform with a warning
  console.warn('Spectrum matching is not fully implemented - returning base waveform');
  
  return waveform;
}

/**
 * Generate vertical component from horizontal components using empirical relationships
 * @param horizontalWaveform Horizontal component waveform
 * @param vhRatio Vertical-to-horizontal ratio (default based on typical ratios)
 * @returns Vertical component waveform
 */
export function generateVerticalComponent(
  horizontalWaveform: SeismicWaveform,
  vhRatio: number = 0.7
): SeismicWaveform {
  const { time, amplitude, metadata } = horizontalWaveform;
  
  // Create new amplitude array
  const verticalAmplitude: number[] = [];
  
  // Generate vertical motions (phase shifted with amplitude reduction)
  for (let i = 0; i < time.length; i++) {
    // Phase shift and amplitude reduction
    verticalAmplitude.push(amplitude[i] * vhRatio);
  }
  
  return {
    time,
    amplitude: verticalAmplitude,
    metadata: {
      ...metadata,
      component: 'Z'
    }
  };
}

/**
 * Generate three components (E-W, N-S, Z) for a complete ground motion
 * @param params Parameters for the waveform generation
 * @returns Object containing three component waveforms
 */
export function generateThreeComponentWaveform(
  params: WaveformGeneratorParams = {}
): { EW: SeismicWaveform; NS: SeismicWaveform; Z: SeismicWaveform } {
  // Generate primary component (E-W)
  const ewParams = { ...params, component: 'E-W' };
  const ewWaveform = generateRealisticWaveform(ewParams);
  
  // Generate N-S component (correlated but different from E-W)
  const nsParams = { ...params, component: 'N-S', seedValue: (params.seedValue || 0) + 1000 };
  const nsWaveform = generateRealisticWaveform(nsParams);
  
  // Generate vertical component
  const vhRatio = 0.7 - 0.1 * (params.magnitude || 6.5) / 10; // Higher magnitude = lower V/H ratio
  const zWaveform = generateVerticalComponent(ewWaveform, vhRatio);
  
  return {
    EW: ewWaveform,
    NS: nsWaveform,
    Z: zWaveform
  };
}

/**
 * Represent a waveform as a THREE.js mesh for visualization
 * @param waveform The waveform to visualize
 * @param options Visualization options
 * @returns THREE.js mesh
 */
export function createWaveformMesh(
  waveform: SeismicWaveform,
  options: {
    width?: number;
    height?: number;
    color?: THREE.Color | string | number;
    lineWidth?: number;
    fill?: boolean;
    fillOpacity?: number;
  } = {}
): THREE.Object3D {
  const {
    width = 10,
    height = 2,
    color = 0x0088ff,
    lineWidth = 2,
    fill = true,
    fillOpacity = 0.3
  } = options;
  
  const group = new THREE.Group();
  
  // Create line geometry
  const points: THREE.Vector3[] = [];
  const { time, amplitude } = waveform;
  
  // Scale factors
  const timeScale = width / (time[time.length - 1] - time[0]);
  const ampScale = height / 2 / Math.max(...amplitude.map(a => Math.abs(a)));
  
  // Create points
  for (let i = 0; i < time.length; i++) {
    const x = (time[i] - time[0]) * timeScale - width / 2;
    const y = amplitude[i] * ampScale;
    points.push(new THREE.Vector3(x, y, 0));
  }
  
  // Create line
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({
    color,
    linewidth: lineWidth
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
  
  // Create fill if requested
  if (fill) {
    const fillPoints = [...points];
    
    // Add bottom corners
    fillPoints.push(
      new THREE.Vector3(width / 2, -height / 2, 0),
      new THREE.Vector3(-width / 2, -height / 2, 0)
    );
    
    const fillGeometry = new THREE.BufferGeometry().setFromPoints(fillPoints);
    
    // Create triangle indices for filling
    const indices: number[] = [];
    const vertexCount = time.length;
    
    // Reference point at bottom left
    const bottomLeftIndex = vertexCount;
    
    // Reference point at bottom right
    const bottomRightIndex = vertexCount + 1;
    
    // Create triangles
    for (let i = 0; i < vertexCount - 1; i++) {
      indices.push(i, i + 1, bottomLeftIndex);
    }
    
    // Connect last point to bottom right
    indices.push(vertexCount - 1, bottomRightIndex, bottomLeftIndex);
    
    fillGeometry.setIndex(indices);
    
    const fillMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: fillOpacity,
      side: THREE.DoubleSide
    });
    
    const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
    group.add(fillMesh);
  }
  
  return group;
}

/**
 * Create a 3D ground displacement mesh based on a waveform
 * @param waveform The seismic waveform
 * @param width Width of the ground mesh
 * @param depth Depth of the ground mesh
 * @param resolution Number of segments
 * @param amplification Factor to amplify displacements
 * @returns Ground mesh that animates with the waveform
 */
export function createGroundMesh(
  waveform: SeismicWaveform,
  width: number = 20,
  depth: number = 20,
  resolution: number = 32,
  amplification: number = 1
): { 
  mesh: THREE.Mesh, 
  update: (time: number) => void 
} {
  // Create ground geometry
  const geometry = new THREE.PlaneGeometry(
    width,
    depth,
    resolution - 1,
    resolution - 1
  );
  
  // Rotate to horizontal
  geometry.rotateX(-Math.PI / 2);
  
  // Create material with grid
  const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    wireframe: false,
    side: THREE.DoubleSide,
    flatShading: true
  });
  
  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);
  
  // Store original positions
  const originalPositions = geometry.attributes.position.array.slice();
  
  // Get positions attribute
  const positionAttribute = geometry.attributes.position;
  const positions = positionAttribute.array;
  
  // Animation duration
  const duration = waveform.time[waveform.time.length - 1] - waveform.time[0];
  
  // Update function for animation
  const update = (time: number) => {
    // Loop animation
    const loopedTime = (time % duration) + waveform.time[0];
    
    // Find closest time points
    let idx = 0;
    while (idx < waveform.time.length - 1 && waveform.time[idx + 1] < loopedTime) {
      idx++;
    }
    
    // Get amplitude at current time (interpolate)
    let currentAmplitude;
    if (idx < waveform.time.length - 1) {
      const t1 = waveform.time[idx];
      const t2 = waveform.time[idx + 1];
      const a1 = waveform.amplitude[idx];
      const a2 = waveform.amplitude[idx + 1];
      
      const ratio = (loopedTime - t1) / (t2 - t1);
      currentAmplitude = a1 + ratio * (a2 - a1);
    } else {
      currentAmplitude = waveform.amplitude[idx];
    }
    
    // Apply displacement to ground
    for (let i = 0; i < positions.length / 3; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      
      // Distance-based wave effect
      const distance = Math.sqrt(x * x + y * y);
      const distanceFactor = Math.max(0, 1 - distance / (width / 2));
      
      // Combine distance and amplitude
      positions[i * 3 + 2] = originalPositions[i * 3 + 2] + 
                             currentAmplitude * amplification * distanceFactor;
    }
    
    // Flag geometry for update
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  };
  
  return { mesh, update };
}

export default {
  generateRealisticWaveform,
  generateShapeWaveform,
  generateSpectrumCompatibleWaveform,
  generateVerticalComponent,
  generateThreeComponentWaveform,
  createWaveformMesh,
  createGroundMesh
}; 