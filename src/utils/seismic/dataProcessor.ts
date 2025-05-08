import * as THREE from 'three';

// Types
export interface SeismicWaveform {
  time: number[];        // Time points in seconds
  amplitude: number[];   // Amplitude values
  metadata?: {
    station?: string;
    component?: 'N-S' | 'E-W' | 'Z';
    magnitude?: number;
    depth?: number;
    distance?: number;
    sampleRate?: number;
    units?: string;
    event?: string;
  };
}

export interface DisplacementField {
  positions: Float32Array;
  values: Float32Array;
  dimensions: [number, number, number];
  metadata?: {
    maxValue: number;
    minValue: number;
  };
}

export interface SeismicResponseSpectrum {
  periods: number[];     // Period values in seconds
  acceleration: number[]; // Spectral acceleration values
  velocity?: number[];   // Spectral velocity values (optional)
  displacement?: number[]; // Spectral displacement values (optional)
  dampingRatio?: number; // Damping ratio used for calculation
}

export interface SeismicLoadingParameters {
  soilType: 'A' | 'B' | 'C' | 'D' | 'E';
  importanceFactor: number;
  responseModificationFactor: number;
  seismicZone: number;
  peakGroundAcceleration: number;
}

export interface SeismicDataPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  originalIndex?: number;
}

/**
 * Normalizes a seismic waveform to a specific range
 * @param waveform The input waveform
 * @param min Target minimum value
 * @param max Target maximum value
 * @returns Normalized waveform
 */
export function normalizeWaveform(
  waveform: SeismicWaveform,
  min: number = -1,
  max: number = 1
): SeismicWaveform {
  const { amplitude, time } = waveform;
  
  // Find current min/max
  const currentMin = Math.min(...amplitude);
  const currentMax = Math.max(...amplitude);
  const range = currentMax - currentMin;
  
  // Avoid division by zero
  if (range === 0) {
    return {
      ...waveform,
      amplitude: amplitude.map(() => (min + max) / 2)
    };
  }
  
  // Normalize
  const normalizedAmplitude = amplitude.map(value => {
    const normalized = (value - currentMin) / range;
    return normalized * (max - min) + min;
  });
  
  return {
    time,
    amplitude: normalizedAmplitude,
    metadata: waveform.metadata
  };
}

/**
 * Resamples a seismic waveform to have the specified number of points
 * @param waveform The input waveform
 * @param targetPoints Desired number of points
 * @returns Resampled waveform
 */
export function resampleWaveform(
  waveform: SeismicWaveform,
  targetPoints: number
): SeismicWaveform {
  const { time, amplitude } = waveform;
  const originalLength = time.length;
  
  if (originalLength === targetPoints) {
    return waveform;
  }
  
  const newTime: number[] = [];
  const newAmplitude: number[] = [];
  
  // Generate new time points at equal intervals
  const startTime = time[0];
  const endTime = time[originalLength - 1];
  const timeInterval = (endTime - startTime) / (targetPoints - 1);
  
  for (let i = 0; i < targetPoints; i++) {
    const t = startTime + i * timeInterval;
    newTime.push(t);
    
    // Find where this time falls in the original data
    let idx = 0;
    while (idx < originalLength - 1 && time[idx + 1] < t) {
      idx++;
    }
    
    // Linear interpolation
    if (idx < originalLength - 1) {
      const t1 = time[idx];
      const t2 = time[idx + 1];
      const a1 = amplitude[idx];
      const a2 = amplitude[idx + 1];
      
      const ratio = (t - t1) / (t2 - t1);
      const interpolatedValue = a1 + ratio * (a2 - a1);
      newAmplitude.push(interpolatedValue);
    } else {
      // Edge case: use last value
      newAmplitude.push(amplitude[originalLength - 1]);
    }
  }
  
  return {
    time: newTime,
    amplitude: newAmplitude,
    metadata: waveform.metadata
  };
}

/**
 * Applies a filter to a seismic waveform (low-pass, high-pass, or band-pass)
 * @param waveform The input waveform
 * @param type Type of filter
 * @param cutoffLow Low cutoff frequency (Hz)
 * @param cutoffHigh High cutoff frequency (Hz)
 * @returns Filtered waveform
 */
export function filterWaveform(
  waveform: SeismicWaveform,
  type: 'lowpass' | 'highpass' | 'bandpass',
  cutoffLow: number = 0.1,
  cutoffHigh: number = 10
): SeismicWaveform {
  // Simple implementation of filtering using FFT would go here
  // In a real application, you'd use a proper DSP library
  // This is a placeholder that just returns the original waveform
  console.warn('Waveform filtering not fully implemented - using original data');
  return waveform;
}

/**
 * Converts a seismic waveform to a THREE.js geometry for visualization
 * @param waveform The input waveform
 * @param scale Scale factor for amplitude
 * @param width Width of the resulting geometry
 * @returns Line geometry for the waveform
 */
export function waveformToLineGeometry(
  waveform: SeismicWaveform,
  scale: number = 1,
  width: number = 10
): THREE.BufferGeometry {
  const { time, amplitude } = waveform;
  const points: THREE.Vector3[] = [];
  
  // Find time range
  const timeMin = time[0];
  const timeMax = time[time.length - 1];
  const timeRange = timeMax - timeMin;
  
  // Create points
  for (let i = 0; i < time.length; i++) {
    const x = ((time[i] - timeMin) / timeRange) * width - width / 2;
    const y = amplitude[i] * scale;
    points.push(new THREE.Vector3(x, y, 0));
  }
  
  // Create geometry
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return geometry;
}

/**
 * Creates a 3D visualization of seismic data as a point cloud
 * @param data Array of data points with x, y, z coordinates and values
 * @param colorScale Color scale for values
 * @param pointSize Size of points
 * @returns Points object for rendering
 */
export function createSeismicPointCloud(
  data: SeismicDataPoint[],
  colorScale: (value: number) => THREE.Color = defaultColorScale,
  pointSize: number = 0.05
): THREE.Points {
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  
  // Create position buffer
  const positions = new Float32Array(data.length * 3);
  const colors = new Float32Array(data.length * 3);
  
  // Find min/max for normalization
  let minValue = Infinity;
  let maxValue = -Infinity;
  
  for (const point of data) {
    minValue = Math.min(minValue, point.value);
    maxValue = Math.max(maxValue, point.value);
  }
  
  // Fill buffers
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const i3 = i * 3;
    
    // Position
    positions[i3] = point.x;
    positions[i3 + 1] = point.y;
    positions[i3 + 2] = point.z;
    
    // Normalize value and get color
    const normalizedValue = (point.value - minValue) / (maxValue - minValue);
    const color = colorScale(normalizedValue);
    
    // Color
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  
  // Add attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create material
  const material = new THREE.PointsMaterial({
    size: pointSize,
    vertexColors: true,
    sizeAttenuation: true
  });
  
  // Create points
  return new THREE.Points(geometry, material);
}

/**
 * Converts a displacement field to a 3D mesh with color mapping
 * @param field Displacement field data
 * @param colorScale Function to map values to colors
 * @returns Mesh for rendering
 */
export function displacementFieldToMesh(
  field: DisplacementField,
  colorScale: (value: number) => THREE.Color = defaultColorScale
): THREE.Mesh {
  const { positions, values, dimensions } = field;
  const [width, height, depth] = dimensions;
  
  // Create geometry (box as placeholder - would use actual data in real implementation)
  const geometry = new THREE.BoxGeometry(width, height, depth);
  
  // Find min/max values
  let minValue = Infinity;
  let maxValue = -Infinity;
  
  for (let i = 0; i < values.length; i++) {
    minValue = Math.min(minValue, values[i]);
    maxValue = Math.max(maxValue, values[i]);
  }
  
  // Create vertex colors
  const colors = new Float32Array(positions.length);
  
  for (let i = 0; i < values.length; i++) {
    const normalizedValue = (values[i] - minValue) / (maxValue - minValue);
    const color = colorScale(normalizedValue);
    
    const i3 = i * 3;
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  
  // Add color attribute
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create material
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe: true
  });
  
  // Create mesh
  return new THREE.Mesh(geometry, material);
}

/**
 * Calculates response spectrum from a seismic waveform
 * @param waveform Input accelerogram
 * @param periods Array of periods to calculate response for
 * @param dampingRatio Damping ratio (default: 0.05 = 5%)
 * @returns Response spectrum
 */
export function calculateResponseSpectrum(
  waveform: SeismicWaveform,
  periods: number[] = Array.from({ length: 100 }, (_, i) => 0.05 + i * 0.05),
  dampingRatio: number = 0.05
): SeismicResponseSpectrum {
  // Simplified response spectrum calculation
  // In a real application, this would use numerical integration
  // of the equation of motion
  
  // Placeholder implementation that creates a realistic-looking spectrum
  const acceleration: number[] = [];
  const velocity: number[] = [];
  const displacement: number[] = [];
  
  const peakAccel = Math.max(...waveform.amplitude.map(a => Math.abs(a)));
  
  for (const period of periods) {
    if (period === 0) {
      acceleration.push(peakAccel);
      velocity.push(0);
      displacement.push(0);
      continue;
    }
    
    const omega = 2 * Math.PI / period;
    
    // Simplified spectrum shape
    let sa = peakAccel;
    
    if (period < 0.1) {
      sa = peakAccel;
    } else if (period < 0.5) {
      sa = peakAccel * 2.5;
    } else {
      sa = peakAccel * 2.5 * (0.5 / period);
    }
    
    // Apply damping reduction
    const dampingCorrection = Math.sqrt(0.07 / (0.02 + dampingRatio));
    sa *= dampingCorrection;
    
    // Calculate Sv and Sd
    const sv = sa / omega;
    const sd = sv / omega;
    
    acceleration.push(sa);
    velocity.push(sv);
    displacement.push(sd);
  }
  
  return {
    periods,
    acceleration,
    velocity,
    displacement,
    dampingRatio
  };
}

/**
 * Default color scale function (blue to red)
 * @param value Normalized value (0-1)
 * @returns THREE.Color
 */
export function defaultColorScale(value: number): THREE.Color {
  // Blue (0) to Red (1)
  return new THREE.Color(value, 0, 1 - value);
}

/**
 * Creates a time-history animation from a seismic waveform
 * @param waveform The input waveform
 * @param structure The structure to animate (e.g., a building model)
 * @param amplificationFactor Factor to amplify the motion
 * @param axis Axis to apply motion ('x', 'y', or 'z')
 * @returns Animation update function
 */
export function createSeismicAnimation(
  waveform: SeismicWaveform,
  structure: THREE.Object3D,
  amplificationFactor: number = 1,
  axis: 'x' | 'y' | 'z' = 'x'
): (time: number) => void {
  const { time: timeArray, amplitude } = normalizeWaveform(waveform, -1, 1);
  const duration = timeArray[timeArray.length - 1] - timeArray[0];
  
  // Save original positions
  const originalPositions: { [id: number]: THREE.Vector3 } = {};
  
  structure.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      originalPositions[object.id] = object.position.clone();
    }
  });
  
  // Animation update function
  return (time: number) => {
    // Loop animation
    const loopedTime = (time % duration) + timeArray[0];
    
    // Find closest time points
    let idx = 0;
    while (idx < timeArray.length - 1 && timeArray[idx + 1] < loopedTime) {
      idx++;
    }
    
    // Get amplitude at current time (interpolate)
    let currentAmplitude;
    if (idx < timeArray.length - 1) {
      const t1 = timeArray[idx];
      const t2 = timeArray[idx + 1];
      const a1 = amplitude[idx];
      const a2 = amplitude[idx + 1];
      
      const ratio = (loopedTime - t1) / (t2 - t1);
      currentAmplitude = a1 + ratio * (a2 - a1);
    } else {
      currentAmplitude = amplitude[idx];
    }
    
    // Apply to structure with amplification
    structure.traverse((object) => {
      if (object instanceof THREE.Mesh && originalPositions[object.id]) {
        const original = originalPositions[object.id];
        
        // Apply ground motion differently based on height (more at top)
        const heightFactor = object.position.y / structure.scale.y;
        const amplification = amplificationFactor * (0.2 + heightFactor * 0.8);
        
        // Apply motion
        object.position[axis] = original[axis] + currentAmplitude * amplification;
      }
    });
  };
}

/**
 * Generates a synthetic waveform for testing
 * @param duration Duration in seconds
 * @param sampleRate Sample rate in Hz
 * @param frequencies Array of frequencies to include
 * @param amplitudes Array of amplitudes for each frequency
 * @returns Synthetic waveform
 */
export function generateSyntheticWaveform(
  duration: number = 30,
  sampleRate: number = 100,
  frequencies: number[] = [0.5, 1.2, 2.0, 5.0],
  amplitudes: number[] = [0.5, 0.3, 0.2, 0.1]
): SeismicWaveform {
  const numPoints = Math.floor(duration * sampleRate);
  const time: number[] = [];
  const amplitude: number[] = [];
  
  // Ensure frequencies and amplitudes arrays match
  const count = Math.min(frequencies.length, amplitudes.length);
  
  // Generate time points
  for (let i = 0; i < numPoints; i++) {
    const t = i / sampleRate;
    time.push(t);
    
    // Sum of sine waves with different frequencies
    let value = 0;
    for (let j = 0; j < count; j++) {
      // Add envelope to create more realistic waveform
      const envelope = Math.sin(Math.PI * t / duration) ** 2;
      value += amplitudes[j] * Math.sin(2 * Math.PI * frequencies[j] * t) * envelope;
    }
    
    // Add some noise
    value += (Math.random() - 0.5) * 0.05;
    
    amplitude.push(value);
  }
  
  return {
    time,
    amplitude,
    metadata: {
      sampleRate,
      magnitude: 6.5, // Mock magnitude
      depth: 10,     // Mock depth in km
      component: 'E-W',
      units: 'g'
    }
  };
}

export default {
  normalizeWaveform,
  resampleWaveform,
  filterWaveform,
  waveformToLineGeometry,
  createSeismicPointCloud,
  displacementFieldToMesh,
  calculateResponseSpectrum,
  defaultColorScale,
  createSeismicAnimation,
  generateSyntheticWaveform
}; 