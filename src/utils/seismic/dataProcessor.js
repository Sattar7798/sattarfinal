/**
 * Seismic Data Processor for Structural Engineering Applications
 * 
 * This module provides utilities for processing, analyzing, and transforming
 * seismic waveforms and response data. It includes methods for filtering,
 * spectral analysis, and various transformations commonly used in earthquake
 * engineering.
 */

/**
 * Represents a seismic waveform with time and amplitude data
 */
export interface SeismicWaveform {
  time: number[];            // Time points in seconds
  amplitude: number[];       // Acceleration, velocity, or displacement values
  metadata?: {               // Optional metadata about the waveform
    magnitude?: number;      // Earthquake magnitude 
    depth?: number;          // Focal depth in km
    distance?: number;       // Distance from epicenter in km
    sampleRate?: number;     // Sample rate in Hz
    component?: 'N-S' | 'E-W' | 'Z'; // Component direction
    units?: string;          // Units of amplitude (e.g., 'g', 'cm/s', 'cm')
    source?: string;         // Source of the data
    station?: string;        // Recording station ID
    date?: string;           // Date of earthquake
    eventId?: string;        // Unique identifier for the earthquake
  };
}

/**
 * Applies a low-pass filter to a seismic waveform
 * @param waveform Input waveform
 * @param cutoffFreq Cutoff frequency in Hz
 * @returns Filtered waveform
 */
export function applyLowPassFilter(waveform: SeismicWaveform, cutoffFreq: number): SeismicWaveform {
  // Validate inputs
  if (!waveform || !waveform.time || !waveform.amplitude) {
    throw new Error('Invalid waveform data');
  }
  
  if (cutoffFreq <= 0) {
    throw new Error('Cutoff frequency must be positive');
  }
  
  // Get sample rate from time data
  const dt = waveform.time[1] - waveform.time[0];
  const sampleRate = 1 / dt;
  
  // Normalize cutoff frequency
  const normalizedCutoff = cutoffFreq / (sampleRate / 2);
  
  // Simple first-order IIR filter implementation
  // y[n] = α * x[n] + (1-α) * y[n-1]
  const alpha = normalizedCutoff / (normalizedCutoff + 1);
  
  const filteredAmplitude = [];
  filteredAmplitude[0] = waveform.amplitude[0];
  
  for (let i = 1; i < waveform.amplitude.length; i++) {
    filteredAmplitude[i] = alpha * waveform.amplitude[i] + (1 - alpha) * filteredAmplitude[i - 1];
  }
  
  return {
    time: waveform.time.slice(),
    amplitude: filteredAmplitude,
    metadata: { ...waveform.metadata }
  };
}

/**
 * Applies a high-pass filter to a seismic waveform
 * @param waveform Input waveform
 * @param cutoffFreq Cutoff frequency in Hz
 * @returns Filtered waveform
 */
export function applyHighPassFilter(waveform: SeismicWaveform, cutoffFreq: number): SeismicWaveform {
  // Validate inputs
  if (!waveform || !waveform.time || !waveform.amplitude) {
    throw new Error('Invalid waveform data');
  }
  
  if (cutoffFreq <= 0) {
    throw new Error('Cutoff frequency must be positive');
  }
  
  // Get sample rate from time data
  const dt = waveform.time[1] - waveform.time[0];
  const sampleRate = 1 / dt;
  
  // Normalize cutoff frequency
  const normalizedCutoff = cutoffFreq / (sampleRate / 2);
  
  // Simple first-order IIR high-pass filter implementation
  // y[n] = α * (y[n-1] + x[n] - x[n-1])
  const alpha = 1 / (1 + normalizedCutoff);
  
  const filteredAmplitude = [];
  filteredAmplitude[0] = waveform.amplitude[0];
  
  for (let i = 1; i < waveform.amplitude.length; i++) {
    filteredAmplitude[i] = alpha * (filteredAmplitude[i - 1] + 
                           waveform.amplitude[i] - waveform.amplitude[i - 1]);
  }
  
  return {
    time: waveform.time.slice(),
    amplitude: filteredAmplitude,
    metadata: { ...waveform.metadata }
  };
}

/**
 * Applies a band-pass filter to a seismic waveform
 * @param waveform Input waveform
 * @param lowCutoff Lower cutoff frequency in Hz
 * @param highCutoff Higher cutoff frequency in Hz
 * @returns Filtered waveform
 */
export function applyBandPassFilter(
  waveform: SeismicWaveform, 
  lowCutoff: number, 
  highCutoff: number
): SeismicWaveform {
  // Apply high-pass followed by low-pass
  const highPassed = applyHighPassFilter(waveform, lowCutoff);
  return applyLowPassFilter(highPassed, highCutoff);
}

/**
 * Computes the Fourier amplitude spectrum of a waveform
 * @param waveform Input waveform
 * @returns Object containing frequency and amplitude arrays
 */
export function computeFourierSpectrum(waveform: SeismicWaveform): { 
  frequency: number[]; 
  amplitude: number[]; 
} {
  const { time, amplitude } = waveform;
  
  // Get number of points
  const N = amplitude.length;
  
  // Sample rate
  const dt = time[1] - time[0];
  const fs = 1 / dt;
  
  // Prepare FFT data - ensure power of 2 length
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(N)));
  const paddedSignal = [...amplitude, ...Array(nextPow2 - N).fill(0)];
  
  // Compute FFT - using direct DFT for simplicity
  // A production version would use a fast FFT algorithm
  const real = [];
  const imag = [];
  
  for (let k = 0; k < nextPow2; k++) {
    let sumReal = 0;
    let sumImag = 0;
    
    for (let n = 0; n < nextPow2; n++) {
      const angle = -2 * Math.PI * k * n / nextPow2;
      sumReal += paddedSignal[n] * Math.cos(angle);
      sumImag += paddedSignal[n] * Math.sin(angle);
    }
    
    real[k] = sumReal;
    imag[k] = sumImag;
  }
  
  // Compute magnitude
  const magnitudes = real.map((r, i) => {
    const re = real[i];
    const im = imag[i];
    return Math.sqrt(re * re + im * im) / nextPow2;
  });
  
  // Create frequency array (only positive frequencies up to Nyquist)
  const frequencyStep = fs / nextPow2;
  const nyquistIndex = Math.floor(nextPow2 / 2);
  
  const frequencies = Array(nyquistIndex).fill(0).map((_, i) => i * frequencyStep);
  const amplitudeSpectrum = magnitudes.slice(0, nyquistIndex);
  
  // Scale amplitude
  const scaledAmplitudes = amplitudeSpectrum.map(a => a * 2); // Scale to account for negative frequencies
  
  return {
    frequency: frequencies,
    amplitude: scaledAmplitudes
  };
}

/**
 * Computes the response spectrum for a given ground motion
 * @param waveform Input ground motion waveform (acceleration)
 * @param periods Array of periods to compute response for (in seconds)
 * @param dampingRatio Damping ratio (default: 0.05 = 5%)
 * @returns Object with periods and spectral acceleration values
 */
export function computeResponseSpectrum(
  waveform: SeismicWaveform, 
  periods: number[] = Array.from({ length: 100 }, (_, i) => 0.01 + i * 0.04), 
  dampingRatio: number = 0.05
): { 
  period: number[]; 
  spectralAcceleration: number[];
  spectralVelocity?: number[];
  spectralDisplacement?: number[];
} {
  const { time, amplitude } = waveform;
  
  // Ensure time history represents acceleration
  if (waveform.metadata?.units !== 'g' && waveform.metadata?.units !== 'm/s²') {
    console.warn('Input waveform might not represent acceleration. Response spectrum may be inaccurate.');
  }
  
  // Get time step
  const dt = time[1] - time[0];
  
  // Arrays to store results
  const spectralAcceleration = [];
  const spectralVelocity = [];
  const spectralDisplacement = [];
  
  // Compute response for each period
  for (const period of periods) {
    // Skip if period is too small (numerical stability)
    if (period < 0.01) {
      spectralAcceleration.push(Math.max(...amplitude.map(Math.abs)));
      spectralVelocity.push(0);
      spectralDisplacement.push(0);
      continue;
    }
    
    // Calculate natural frequency and related parameters
    const omega = 2 * Math.PI / period;     // Angular frequency
    const omega2 = omega * omega;           // Angular frequency squared
    const xi = dampingRatio;                // Damping ratio
    
    // Constants for Newmark's method (average acceleration)
    const gamma = 0.5;
    const beta = 0.25;
    
    // Integration constants
    const a1 = 1.0 / (beta * dt * dt) + gamma * xi * omega / (beta * dt);
    const a2 = 1.0 / (beta * dt) + (gamma - beta) * xi * omega / beta;
    const a3 = (0.5 - beta) / beta + dt * (gamma - 0.5 * gamma * gamma / beta) * xi * omega;
    
    const b1 = dt * (1.0 - gamma) + dt * gamma * beta / (0.5 - beta);
    const b2 = dt * gamma * (1.0 - beta) / (0.5 - beta);
    
    // Initial conditions
    let u = 0;      // Displacement
    let v = 0;      // Velocity
    let a = 0;      // Acceleration
    
    // Max values
    let maxU = 0;
    let maxV = 0;
    let maxA = 0;
    
    // Respond to each ground acceleration
    for (let i = 0; i < amplitude.length; i++) {
      // Get ground acceleration
      const ag = amplitude[i];
      
      // Total force at time t
      const p = -ag;
      
      // Calculate effective force
      const peff = p + a1 * u + a2 * v + a3 * a;
      
      // Calculate new acceleration
      const aNew = peff / (1.0 + xi * omega * b1 + omega2 * b2);
      
      // Update displacement and velocity
      const vNew = v + dt * ((1.0 - gamma) * a + gamma * aNew);
      const uNew = u + dt * v + dt * dt * (0.5 - beta) * a + dt * dt * beta * aNew;
      
      // Update state
      u = uNew;
      v = vNew;
      a = aNew;
      
      // Track maximum absolute values
      maxU = Math.max(maxU, Math.abs(u));
      maxV = Math.max(maxV, Math.abs(v));
      maxA = Math.max(maxA, Math.abs(a));
    }
    
    // Store maximum values in output arrays
    spectralAcceleration.push(maxA);
    spectralVelocity.push(maxV);
    spectralDisplacement.push(maxU);
  }
  
  return {
    period: periods,
    spectralAcceleration,
    spectralVelocity,
    spectralDisplacement
  };
}

/**
 * Integrates acceleration to obtain velocity
 * @param waveform Acceleration waveform
 * @param initialVelocity Optional initial velocity
 * @returns Velocity waveform
 */
export function integrateToVelocity(
  waveform: SeismicWaveform, 
  initialVelocity: number = 0
): SeismicWaveform {
  const { time, amplitude } = waveform;
  
  // Get time step
  const dt = time[1] - time[0];
  
  // Compute velocity using trapezoidal rule
  const velocityAmplitude = [initialVelocity];
  
  for (let i = 1; i < amplitude.length; i++) {
    const v = velocityAmplitude[i - 1] + 
              dt * 0.5 * (amplitude[i] + amplitude[i - 1]);
    velocityAmplitude.push(v);
  }
  
  // Determine new units
  let units = 'cm/s';
  if (waveform.metadata?.units === 'g') {
    units = 'cm/s'; // acceleration in g -> velocity in cm/s
  } else if (waveform.metadata?.units === 'm/s²') {
    units = 'm/s'; // acceleration in m/s² -> velocity in m/s
  }
  
  return {
    time: time.slice(),
    amplitude: velocityAmplitude,
    metadata: { 
      ...waveform.metadata,
      units
    }
  };
}

/**
 * Integrates velocity to obtain displacement
 * @param waveform Velocity waveform
 * @param initialDisplacement Optional initial displacement
 * @returns Displacement waveform
 */
export function integrateToDisplacement(
  waveform: SeismicWaveform, 
  initialDisplacement: number = 0
): SeismicWaveform {
  const { time, amplitude } = waveform;
  
  // Get time step
  const dt = time[1] - time[0];
  
  // Compute displacement using trapezoidal rule
  const displacementAmplitude = [initialDisplacement];
  
  for (let i = 1; i < amplitude.length; i++) {
    const d = displacementAmplitude[i - 1] + 
              dt * 0.5 * (amplitude[i] + amplitude[i - 1]);
    displacementAmplitude.push(d);
  }
  
  // Determine new units
  let units = 'cm';
  if (waveform.metadata?.units === 'cm/s') {
    units = 'cm'; // velocity in cm/s -> displacement in cm
  } else if (waveform.metadata?.units === 'm/s') {
    units = 'm'; // velocity in m/s -> displacement in m
  }
  
  return {
    time: time.slice(),
    amplitude: displacementAmplitude,
    metadata: { 
      ...waveform.metadata,
      units
    }
  };
}

/**
 * Differentiates displacement to obtain velocity
 * @param waveform Displacement waveform
 * @returns Velocity waveform
 */
export function differentiateToVelocity(waveform: SeismicWaveform): SeismicWaveform {
  const { time, amplitude } = waveform;
  
  // Get time step
  const dt = time[1] - time[0];
  
  // Compute velocity using central difference
  const velocityAmplitude = [];
  
  // Forward difference for first point
  velocityAmplitude.push((amplitude[1] - amplitude[0]) / dt);
  
  // Central difference for middle points
  for (let i = 1; i < amplitude.length - 1; i++) {
    const v = (amplitude[i + 1] - amplitude[i - 1]) / (2 * dt);
    velocityAmplitude.push(v);
  }
  
  // Backward difference for last point
  const lastIdx = amplitude.length - 1;
  velocityAmplitude.push((amplitude[lastIdx] - amplitude[lastIdx - 1]) / dt);
  
  // Determine new units
  let units = 'cm/s';
  if (waveform.metadata?.units === 'cm') {
    units = 'cm/s'; // displacement in cm -> velocity in cm/s
  } else if (waveform.metadata?.units === 'm') {
    units = 'm/s'; // displacement in m -> velocity in m/s
  }
  
  return {
    time: time.slice(),
    amplitude: velocityAmplitude,
    metadata: { 
      ...waveform.metadata,
      units
    }
  };
}

/**
 * Differentiates velocity to obtain acceleration
 * @param waveform Velocity waveform
 * @returns Acceleration waveform
 */
export function differentiateToAcceleration(waveform: SeismicWaveform): SeismicWaveform {
  const { time, amplitude } = waveform;
  
  // Get time step
  const dt = time[1] - time[0];
  
  // Compute acceleration using central difference
  const accelerationAmplitude = [];
  
  // Forward difference for first point
  accelerationAmplitude.push((amplitude[1] - amplitude[0]) / dt);
  
  // Central difference for middle points
  for (let i = 1; i < amplitude.length - 1; i++) {
    const a = (amplitude[i + 1] - amplitude[i - 1]) / (2 * dt);
    accelerationAmplitude.push(a);
  }
  
  // Backward difference for last point
  const lastIdx = amplitude.length - 1;
  accelerationAmplitude.push((amplitude[lastIdx] - amplitude[lastIdx - 1]) / dt);
  
  // Determine new units
  let units = 'cm/s²';
  if (waveform.metadata?.units === 'cm/s') {
    units = 'cm/s²'; // velocity in cm/s -> acceleration in cm/s²
  } else if (waveform.metadata?.units === 'm/s') {
    units = 'm/s²'; // velocity in m/s -> acceleration in m/s²
  }
  
  return {
    time: time.slice(),
    amplitude: accelerationAmplitude,
    metadata: { 
      ...waveform.metadata,
      units
    }
  };
}

/**
 * Applies baseline correction to a waveform
 * @param waveform Input waveform
 * @param polynomialOrder Order of the polynomial fit (default: 3)
 * @returns Corrected waveform
 */
export function applyBaselineCorrection(
  waveform: SeismicWaveform, 
  polynomialOrder: number = 3
): SeismicWaveform {
  const { time, amplitude } = waveform;
  
  // Fit polynomial to the data
  const coefficients = fitPolynomial(time, amplitude, polynomialOrder);
  
  // Calculate baseline
  const baseline = time.map(t => {
    let value = 0;
    for (let i = 0; i <= polynomialOrder; i++) {
      value += coefficients[i] * Math.pow(t, i);
    }
    return value;
  });
  
  // Remove baseline from amplitude
  const correctedAmplitude = amplitude.map((a, i) => a - baseline[i]);
  
  return {
    time: time.slice(),
    amplitude: correctedAmplitude,
    metadata: { ...waveform.metadata }
  };
}

/**
 * Fits a polynomial to data
 * @param x X values
 * @param y Y values
 * @param order Polynomial order
 * @returns Polynomial coefficients
 */
function fitPolynomial(x: number[], y: number[], order: number): number[] {
  // Simple polynomial fitting using normal equations
  // A more robust implementation would use singular value decomposition
  
  // Create the Vandermonde matrix
  const A = [];
  for (let i = 0; i < x.length; i++) {
    const row = [];
    for (let j = 0; j <= order; j++) {
      row.push(Math.pow(x[i], j));
    }
    A.push(row);
  }
  
  // Create normal equations
  const AtA = [];
  const Aty = Array(order + 1).fill(0);
  
  for (let i = 0; i <= order; i++) {
    const row = Array(order + 1).fill(0);
    for (let j = 0; j <= order; j++) {
      for (let k = 0; k < x.length; k++) {
        row[j] += A[k][i] * A[k][j];
      }
    }
    AtA.push(row);
    
    for (let k = 0; k < x.length; k++) {
      Aty[i] += A[k][i] * y[k];
    }
  }
  
  // Solve the system using Gaussian elimination
  // This is a simplification - a production version would use a robust solver
  return solveLinearSystem(AtA, Aty);
}

/**
 * Solves a linear system Ax = b using Gaussian elimination
 * @param A Coefficient matrix
 * @param b Right-hand side vector
 * @returns Solution vector
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  
  // Create augmented matrix [A|b]
  const augMatrix = A.map((row, i) => [...row, b[i]]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augMatrix[j][i]) > Math.abs(augMatrix[maxRow][i])) {
        maxRow = j;
      }
    }
    
    // Swap rows if necessary
    [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];
    
    // Eliminate below
    for (let j = i + 1; j < n; j++) {
      const factor = augMatrix[j][i] / augMatrix[i][i];
      for (let k = i; k <= n; k++) {
        augMatrix[j][k] -= factor * augMatrix[i][k];
      }
    }
  }
  
  // Back substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += augMatrix[i][j] * x[j];
    }
    x[i] = (augMatrix[i][n] - sum) / augMatrix[i][i];
  }
  
  return x;
}

/**
 * Extracts key parameters from a seismic waveform
 * @param waveform Input waveform
 * @returns Object containing key parameters
 */
export function extractWaveformParameters(waveform: SeismicWaveform): {
  peakAmplitude: number;
  duration: number;
  rms: number;
  arias: number;
  significantDuration: {
    t595: number;
    t2575: number;
    t595Time: [number, number];
    t2575Time: [number, number];
  };
} {
  const { time, amplitude } = waveform;
  
  // Calculate peak amplitude (PGA, PGV, or PGD depending on what the waveform represents)
  const peakAmplitude = Math.max(...amplitude.map(Math.abs));
  
  // Calculate RMS (Root Mean Square)
  const sumOfSquares = amplitude.reduce((sum, a) => sum + a * a, 0);
  const rms = Math.sqrt(sumOfSquares / amplitude.length);
  
  // Calculate Arias Intensity
  // For acceleration in m/s², Ia = (π/2g) ∫ a²(t)dt
  // Simplified trapezoidal integration
  const dt = time[1] - time[0];
  let ariasIntensity = 0;
  const g = 9.81; // m/s²
  
  for (let i = 0; i < amplitude.length - 1; i++) {
    ariasIntensity += 0.5 * (amplitude[i] * amplitude[i] + 
                           amplitude[i + 1] * amplitude[i + 1]) * dt;
  }
  ariasIntensity *= Math.PI / (2 * g);
  
  // Calculate significant duration
  // Based on normalized Arias Intensity
  const ariasValues = [];
  let runningSum = 0;
  
  for (let i = 0; i < amplitude.length - 1; i++) {
    runningSum += 0.5 * (amplitude[i] * amplitude[i] + 
                        amplitude[i + 1] * amplitude[i + 1]) * dt;
    ariasValues.push(runningSum);
  }
  
  // Normalize
  const normalizedArias = ariasValues.map(a => a / ariasValues[ariasValues.length - 1]);
  
  // Find indices where Arias intensity reaches 5%, 25%, 75%, and 95%
  let idx5 = 0, idx25 = 0, idx75 = 0, idx95 = 0;
  
  for (let i = 0; i < normalizedArias.length; i++) {
    if (normalizedArias[i] >= 0.05 && idx5 === 0) idx5 = i;
    if (normalizedArias[i] >= 0.25 && idx25 === 0) idx25 = i;
    if (normalizedArias[i] >= 0.75 && idx75 === 0) idx75 = i;
    if (normalizedArias[i] >= 0.95 && idx95 === 0) idx95 = i;
  }
  
  // Calculate duration from 5% to 95% and 25% to 75%
  const t595 = time[idx95] - time[idx5];
  const t2575 = time[idx75] - time[idx25];
  
  return {
    peakAmplitude,
    duration: time[time.length - 1] - time[0],
    rms,
    arias: ariasIntensity,
    significantDuration: {
      t595,
      t2575,
      t595Time: [time[idx5], time[idx95]],
      t2575Time: [time[idx25], time[idx75]]
    }
  };
}

/**
 * Calculates response spectrum for multiple values of damping
 * @param waveform Input ground motion waveform
 * @param periods Array of periods to compute response for
 * @param dampingRatios Array of damping ratios
 * @returns Object with response spectra for each damping ratio
 */
export function computeMultiDampingResponseSpectra(
  waveform: SeismicWaveform,
  periods: number[] = Array.from({ length: 100 }, (_, i) => 0.01 + i * 0.04),
  dampingRatios: number[] = [0.02, 0.05, 0.10, 0.20]
): {
  period: number[];
  spectra: {
    dampingRatio: number;
    spectralAcceleration: number[];
    spectralVelocity: number[];
    spectralDisplacement: number[];
  }[];
} {
  const spectra = [];
  
  for (const dampingRatio of dampingRatios) {
    const response = computeResponseSpectrum(waveform, periods, dampingRatio);
    
    spectra.push({
      dampingRatio,
      spectralAcceleration: response.spectralAcceleration || [],
      spectralVelocity: response.spectralVelocity || [],
      spectralDisplacement: response.spectralDisplacement || []
    });
  }
  
  return {
    period: periods,
    spectra
  };
}

/**
 * Apply a bandpass filter to seismic waveform data
 * @param {Array} data - Time series data array
 * @param {number} lowCut - Low cutoff frequency (Hz)
 * @param {number} highCut - High cutoff frequency (Hz)
 * @param {number} sampleRate - Sample rate of the data (Hz)
 * @returns {Array} - Filtered data array
 */
export function bandpassFilter(data, lowCut, highCut, sampleRate) {
  // Validate inputs
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data array');
  }
  
  if (lowCut >= highCut) {
    throw new Error('Low cutoff must be less than high cutoff');
  }
  
  if (highCut >= sampleRate / 2) {
    throw new Error(`High cutoff must be less than Nyquist frequency (${sampleRate / 2} Hz)`);
  }
  
  // Convert cutoff frequencies to normalized frequencies
  const nyquist = sampleRate / 2;
  const lowCutNormalized = lowCut / nyquist;
  const highCutNormalized = highCut / nyquist;
  
  // Create filter coefficients for a 4th-order Butterworth filter
  // Note: In a real application, this would use the Web Audio API or a DSP library
  // This is a simplified implementation for demonstration
  
  // Apply filter to data
  const filteredData = [];
  const n = data.length;
  const a = [1.0, -3.8364, 5.52745, -3.53622, 0.85322]; // Example coefficients
  const b = [0.00968, 0.03872, 0.05808, 0.03872, 0.00968]; // Example coefficients
  
  // Apply filter
  for (let i = 0; i < n; i++) {
    let y = b[0] * data[i];
    
    for (let j = 1; j < 5; j++) {
      if (i - j >= 0) {
        y += b[j] * data[i - j] - a[j] * (filteredData[i - j] || 0);
      }
    }
    
    filteredData.push(y);
  }
  
  return filteredData;
}

/**
 * Calculate response spectrum from acceleration time series
 * @param {Array} accelData - Acceleration time series (g)
 * @param {number} dt - Time step (seconds)
 * @param {Array} periods - Array of periods to calculate response for (seconds)
 * @param {number} dampingRatio - Damping ratio (default: 0.05 or 5%)
 * @returns {Array} - Response spectrum data array (Sa vs. Period)
 */
export function calculateResponseSpectrum(accelData, dt, periods, dampingRatio = 0.05) {
  // Validate inputs
  if (!Array.isArray(accelData) || accelData.length === 0) {
    throw new Error('Invalid acceleration data array');
  }
  
  if (!Array.isArray(periods) || periods.length === 0) {
    throw new Error('Invalid periods array');
  }
  
  // Convert acceleration from g to m/s²
  const g = 9.81;
  const acceleration = accelData.map(a => a * g);
  
  const responseSpectrum = [];
  
  // For each period, calculate spectral acceleration
  for (const period of periods) {
    // Skip zero period
    if (period <= 0) {
      responseSpectrum.push({
        period,
        sa: Math.max(...acceleration.map(Math.abs)) / g // PGA for zero period
      });
      continue;
    }
    
    // Calculate single-degree-of-freedom system parameters
    const omega = (2 * Math.PI) / period; // Angular frequency
    const omega2 = omega * omega; // Squared angular frequency
    const xi = dampingRatio; // Damping ratio
    
    // Time domain solution using Newmark-Beta method (average acceleration)
    const gamma = 0.5;
    const beta = 0.25;
    
    // Initial conditions
    let u = 0; // Displacement
    let v = 0; // Velocity
    let maxU = 0; // Maximum absolute displacement
    
    // Constants for Newmark-Beta method
    const a1 = 1 / (beta * dt * dt);
    const a2 = 1 / (beta * dt);
    const a3 = (1 / (2 * beta)) - 1;
    const a4 = (gamma / beta) - 1;
    const a5 = dt * ((gamma / (2 * beta)) - 1);
    const a6 = dt * (1 - gamma);
    const a7 = gamma * dt;
    
    for (let i = 0; i < acceleration.length; i++) {
      // Effective force
      const pEff = -acceleration[i] - a1 * u - a2 * v;
      
      // Calculate system properties
      const kEff = omega2 + a1 + 2 * xi * omega * a2;
      
      // Solve for displacement increment
      const du = pEff / kEff;
      
      // Update displacement, velocity, and acceleration
      const newU = u + du;
      const newV = v + a4 * v + a5 * acceleration[i] + a7 * (-omega2 * newU - 2 * xi * omega * (v + a4 * v + a5 * acceleration[i]));
      
      // Store results
      u = newU;
      v = newV;
      
      // Track maximum absolute displacement
      if (Math.abs(u) > maxU) {
        maxU = Math.abs(u);
      }
    }
    
    // Calculate spectral acceleration from maximum displacement
    const sa = omega2 * maxU / g;
    
    responseSpectrum.push({
      period,
      sa
    });
  }
  
  return responseSpectrum;
}

/**
 * Calculate Arias Intensity from acceleration time series
 * @param {Array} accelData - Acceleration time series (g)
 * @param {number} dt - Time step (seconds)
 * @returns {Array} - Cumulative Arias intensity time series
 */
export function calculateAriasIntensity(accelData, dt) {
  // Validate inputs
  if (!Array.isArray(accelData) || accelData.length === 0) {
    throw new Error('Invalid acceleration data array');
  }
  
  // Convert acceleration from g to m/s²
  const g = 9.81;
  const acceleration = accelData.map(a => a * g);
  
  // Calculate Arias intensity (I_a = π/(2g) ∫a²(t)dt)
  const pi = Math.PI;
  const ariasConstant = pi / (2 * g);
  
  let cumulativeIntensity = 0;
  const ariasIntensity = [];
  
  for (let i = 0; i < acceleration.length; i++) {
    // Increment intensity using trapezoidal rule
    cumulativeIntensity += ariasConstant * Math.pow(acceleration[i], 2) * dt;
    
    ariasIntensity.push({
      time: i * dt,
      intensity: cumulativeIntensity
    });
  }
  
  return ariasIntensity;
}

/**
 * Calculate Power Spectral Density of acceleration time series
 * @param {Array} accelData - Acceleration time series
 * @param {number} sampleRate - Sample rate (Hz)
 * @param {number} smoothingFactor - Smoothing factor for the spectrum (0-1)
 * @returns {Array} - PSD data array with frequency and power
 */
export function calculatePowerSpectralDensity(accelData, sampleRate, smoothingFactor = 0.2) {
  // Validate inputs
  if (!Array.isArray(accelData) || accelData.length === 0) {
    throw new Error('Invalid acceleration data array');
  }
  
  // Ensure data length is a power of 2 for FFT efficiency
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(accelData.length)));
  
  // Zero-pad data to next power of 2
  const paddedData = [...accelData];
  while (paddedData.length < nextPowerOfTwo) {
    paddedData.push(0);
  }
  
  // Apply Hann window to reduce spectral leakage
  const windowedData = applyWindow(paddedData);
  
  // Perform FFT (simplified implementation)
  // In a real application, use a library like fft.js or DSP.js
  const fftResult = simplifiedFFT(windowedData);
  
  // Calculate PSD
  const psdData = [];
  const n = fftResult.length / 2;
  
  for (let i = 0; i < n; i++) {
    const frequency = i * sampleRate / nextPowerOfTwo;
    const power = Math.pow(fftResult[i], 2) / (sampleRate * n);
    
    psdData.push({
      frequency,
      power
    });
  }
  
  // Smooth PSD if requested
  if (smoothingFactor > 0 && smoothingFactor < 1) {
    return smoothPSD(psdData, smoothingFactor);
  }
  
  return psdData;
}

/**
 * Smooth PSD data using moving average
 * @param {Array} psdData - PSD data array
 * @param {number} smoothingFactor - Smoothing factor (0-1)
 * @returns {Array} - Smoothed PSD data
 */
function smoothPSD(psdData, smoothingFactor) {
  // Calculate window size based on smoothing factor
  const windowSize = Math.max(3, Math.round(psdData.length * smoothingFactor * 0.1));
  const halfWindow = Math.floor(windowSize / 2);
  
  const smoothedPSD = [];
  
  for (let i = 0; i < psdData.length; i++) {
    let sumPower = 0;
    let count = 0;
    
    for (let j = Math.max(0, i - halfWindow); j <= Math.min(psdData.length - 1, i + halfWindow); j++) {
      sumPower += psdData[j].power;
      count++;
    }
    
    smoothedPSD.push({
      frequency: psdData[i].frequency,
      power: sumPower / count
    });
  }
  
  return smoothedPSD;
}

/**
 * Apply Hann window to data
 * @param {Array} data - Input data array
 * @returns {Array} - Windowed data
 */
function applyWindow(data) {
  const n = data.length;
  const windowed = [];
  
  for (let i = 0; i < n; i++) {
    const windowCoeff = 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
    windowed.push(data[i] * windowCoeff);
  }
  
  return windowed;
}

/**
 * Simplified FFT implementation for demonstration purposes
 * In a real application, use a proper FFT library
 * @param {Array} data - Input data array
 * @returns {Array} - Magnitude spectrum
 */
function simplifiedFFT(data) {
  // This is a placeholder for a real FFT implementation
  // In a real application, use a library like fft.js
  
  const n = data.length;
  const spectrum = [];
  
  // Simplified DFT calculation (very inefficient for real use)
  for (let k = 0; k < n; k++) {
    let real = 0;
    let imag = 0;
    
    for (let t = 0; t < n; t++) {
      const angle = 2 * Math.PI * k * t / n;
      real += data[t] * Math.cos(angle);
      imag -= data[t] * Math.sin(angle);
    }
    
    // Calculate magnitude
    const magnitude = Math.sqrt(real * real + imag * imag);
    spectrum.push(magnitude);
  }
  
  return spectrum;
}

/**
 * Calculate characteristic earthquake parameters
 * @param {Array} accelData - Acceleration time series (g)
 * @param {number} dt - Time step (seconds)
 * @returns {Object} - Earthquake parameters (PGA, PGV, Arias Intensity, etc.)
 */
export function calculateEarthquakeParameters(accelData, dt) {
  // Validate inputs
  if (!Array.isArray(accelData) || accelData.length === 0) {
    throw new Error('Invalid acceleration data array');
  }
  
  // Calculate peak ground acceleration (PGA)
  const pga = Math.max(...accelData.map(Math.abs));
  
  // Integrate acceleration to get velocity
  const velocity = integrateTimeSeries(accelData, dt);
  
  // Calculate peak ground velocity (PGV)
  const pgv = Math.max(...velocity.map(Math.abs));
  
  // Integrate velocity to get displacement
  const displacement = integrateTimeSeries(velocity, dt);
  
  // Calculate peak ground displacement (PGD)
  const pgd = Math.max(...displacement.map(Math.abs));
  
  // Calculate Arias intensity
  const ariasIntensity = calculateAriasIntensity(accelData, dt);
  const totalAriasIntensity = ariasIntensity[ariasIntensity.length - 1].intensity;
  
  // Calculate significant duration (time between 5% and 95% of Arias intensity)
  const t5 = findTimeAtPercentArias(ariasIntensity, 0.05 * totalAriasIntensity);
  const t95 = findTimeAtPercentArias(ariasIntensity, 0.95 * totalAriasIntensity);
  const significantDuration = t95 - t5;
  
  // Calculate RMS acceleration
  const rmsAccel = calculateRMS(accelData);
  
  // Calculate cumulative absolute velocity (CAV)
  const cav = calculateCAV(accelData, dt);
  
  return {
    pga,           // Peak Ground Acceleration (g)
    pgv,           // Peak Ground Velocity (cm/s)
    pgd,           // Peak Ground Displacement (cm)
    rmsAccel,      // Root Mean Square Acceleration (g)
    ariasIntensity: totalAriasIntensity, // Total Arias Intensity (m/s)
    significantDuration, // Significant Duration (s)
    cav,           // Cumulative Absolute Velocity (cm/s)
    t5,            // 5% Arias Intensity Time (s)
    t95            // 95% Arias Intensity Time (s)
  };
}

/**
 * Integrate time series using trapezoidal rule
 * @param {Array} data - Input time series
 * @param {number} dt - Time step
 * @returns {Array} - Integrated time series
 */
function integrateTimeSeries(data, dt) {
  const integrated = [0]; // Assume zero initial condition
  
  for (let i = 1; i < data.length; i++) {
    // Trapezoidal rule: y[i] = y[i-1] + (x[i] + x[i-1])/2 * dt
    integrated.push(integrated[i - 1] + (data[i] + data[i - 1]) / 2 * dt);
  }
  
  // Remove mean (detrend)
  const mean = integrated.reduce((sum, val) => sum + val, 0) / integrated.length;
  return integrated.map(val => val - mean);
}

/**
 * Find time at which a specific Arias intensity is reached
 * @param {Array} ariasData - Arias intensity data
 * @param {number} targetIntensity - Target intensity
 * @returns {number} - Time at which target intensity is reached
 */
function findTimeAtPercentArias(ariasData, targetIntensity) {
  for (let i = 0; i < ariasData.length; i++) {
    if (ariasData[i].intensity >= targetIntensity) {
      // Linear interpolation for more accuracy
      if (i === 0) return ariasData[i].time;
      
      const t0 = ariasData[i - 1].time;
      const t1 = ariasData[i].time;
      const i0 = ariasData[i - 1].intensity;
      const i1 = ariasData[i].intensity;
      
      return t0 + (t1 - t0) * (targetIntensity - i0) / (i1 - i0);
    }
  }
  
  return ariasData[ariasData.length - 1].time;
}

/**
 * Calculate root mean square (RMS) of a time series
 * @param {Array} data - Input time series
 * @returns {number} - RMS value
 */
function calculateRMS(data) {
  const sumSquares = data.reduce((sum, val) => sum + val * val, 0);
  return Math.sqrt(sumSquares / data.length);
}

/**
 * Calculate Cumulative Absolute Velocity (CAV)
 * @param {Array} accelData - Acceleration time series (g)
 * @param {number} dt - Time step (seconds)
 * @returns {number} - CAV value (cm/s)
 */
function calculateCAV(accelData, dt) {
  // Convert g to cm/s²
  const g = 981; // cm/s²
  const accelCmSec2 = accelData.map(a => Math.abs(a * g));
  
  // Integrate absolute acceleration
  let cav = 0;
  for (let i = 0; i < accelCmSec2.length; i++) {
    cav += accelCmSec2[i] * dt;
  }
  
  return cav;
}

/**
 * Scale an earthquake record to a target PGA
 * @param {Array} accelData - Acceleration time series (g)
 * @param {number} targetPGA - Target PGA in g
 * @returns {Array} - Scaled acceleration time series
 */
export function scaleEarthquakeRecord(accelData, targetPGA) {
  // Find current PGA
  const currentPGA = Math.max(...accelData.map(Math.abs));
  
  // Calculate scaling factor
  const scaleFactor = targetPGA / currentPGA;
  
  // Apply scaling
  return accelData.map(a => a * scaleFactor);
}

/**
 * Convert SeismoSignal format to JSON
 * @param {string} seismoSignalText - Text content of SeismoSignal file
 * @returns {Object} - Parsed data with time and acceleration series
 */
export function parseSeismoSignalFormat(seismoSignalText) {
  // Split text into lines
  const lines = seismoSignalText.trim().split('\n');
  
  // Extract header information
  const headerEndIndex = lines.findIndex(line => line.includes('TIME') || line.includes('ACCELERATION'));
  const headers = lines.slice(0, headerEndIndex).reduce((obj, line) => {
    const parts = line.split(':').map(part => part.trim());
    if (parts.length >= 2) {
      obj[parts[0]] = parts[1];
    }
    return obj;
  }, {});
  
  // Parse data rows
  const dataRows = lines.slice(headerEndIndex + 1).filter(line => line.trim() !== '');
  
  const time = [];
  const acceleration = [];
  
  dataRows.forEach(row => {
    const values = row.trim().split(/\s+/).map(parseFloat);
    if (values.length >= 2) {
      time.push(values[0]);
      acceleration.push(values[1]);
    }
  });
  
  // Extract key metadata
  const timeStep = time.length > 1 ? time[1] - time[0] : 0;
  const duration = time.length > 0 ? time[time.length - 1] : 0;
  
  return {
    metadata: {
      ...headers,
      timeStep,
      duration,
      numPoints: time.length
    },
    time,
    acceleration
  };
}

/**
 * Export data to CSV format
 * @param {Object} data - Data object with time and series arrays
 * @param {string} name - Name of the data series
 * @returns {string} - CSV formatted string
 */
export function exportToCsv(data, name = 'SeismicData') {
  if (!data || !data.time || !data.time.length) {
    throw new Error('Invalid data format');
  }
  
  // Create header
  let csv = `Time,${name}\n`;
  
  // Add data rows
  for (let i = 0; i < data.time.length; i++) {
    const accel = data.acceleration?.[i] ?? '';
    csv += `${data.time[i]},${accel}\n`;
  }
  
  return csv;
}

/**
 * Generate synthetic earthquake ground motion
 * @param {number} magnitude - Earthquake magnitude (Mw)
 * @param {number} distance - Source-to-site distance (km)
 * @param {string} siteClass - Site class (A, B, C, D, or E)
 * @param {number} duration - Duration of record (s)
 * @param {number} dt - Time step (s)
 * @returns {Object} - Synthetic ground motion with time and acceleration series
 */
export function generateSyntheticGroundMotion(magnitude, distance, siteClass, duration = 30, dt = 0.01) {
  // Validate inputs
  if (magnitude < 4 || magnitude > 9) {
    throw new Error('Magnitude must be between 4 and 9');
  }
  
  if (distance < 0) {
    throw new Error('Distance must be non-negative');
  }
  
  const validSiteClasses = ['A', 'B', 'C', 'D', 'E'];
  if (!validSiteClasses.includes(siteClass)) {
    throw new Error(`Site class must be one of: ${validSiteClasses.join(', ')}`);
  }
  
  // Number of time steps
  const numPoints = Math.ceil(duration / dt);
  
  // Setup arrays
  const time = Array.from({ length: numPoints }, (_, i) => i * dt);
  const acceleration = new Array(numPoints).fill(0);
  
  // Generate synthetic ground motion using stochastic method
  // This is a simplified implementation of the Boore (2003) method
  
  // PGA attenuation based on magnitude and distance (simplified)
  const pgaRock = Math.exp(0.48 * magnitude - 0.0059 * Math.pow(magnitude, 2) - 0.8 * Math.log10(distance + 10));
  
  // Site amplification factors (simplified)
  const siteFactors = {
    'A': 0.8,  // Hard rock
    'B': 1.0,  // Rock
    'C': 1.5,  // Dense soil or soft rock
    'D': 2.0,  // Stiff soil
    'E': 3.0   // Soft soil
  };
  
  // Apply site amplification
  const pgaAtSite = pgaRock * siteFactors[siteClass];
  
  // Duration based on magnitude and distance (simplified)
  const significantDuration = 5 + 3 * (magnitude - 5) + 0.05 * distance;
  
  // Frequency content
  // Higher magnitudes have more low frequency content
  const cornerFreq = 4.9 * Math.pow(10, 6) * Math.pow(10, -magnitude);
  
  // Generate white noise
  const whiteNoise = Array.from({ length: numPoints }, () => (Math.random() * 2 - 1));
  
  // Apply spectral shaping (simplified)
  const shapedNoise = bandpassFilter(whiteNoise, 0.1, 25, 1/dt);
  
  // Apply amplitude envelope
  for (let i = 0; i < numPoints; i++) {
    // Envelope function (simplified)
    let envelope;
    const t = time[i];
    const normalizedTime = t / duration;
    
    if (t < 2) {
      // Buildup
      envelope = t / 2;
    } else if (t < significantDuration) {
      // Strong motion
      envelope = 1.0;
    } else {
      // Decay
      envelope = Math.exp(-(t - significantDuration) / (duration - significantDuration) * 3);
    }
    
    // Apply envelope and scale to target PGA
    acceleration[i] = shapedNoise[i] * envelope;
  }
  
  // Normalize and scale to target PGA
  const currentPGA = Math.max(...acceleration.map(Math.abs));
  const scaleFactor = pgaAtSite / currentPGA;
  
  const scaledAcceleration = acceleration.map(a => a * scaleFactor);
  
  return {
    metadata: {
      magnitude,
      distance,
      siteClass,
      duration,
      dt,
      pgaAtSite
    },
    time,
    acceleration: scaledAcceleration
  };
}

export default {
  applyLowPassFilter,
  applyHighPassFilter,
  applyBandPassFilter,
  computeFourierSpectrum,
  computeResponseSpectrum,
  integrateToVelocity,
  integrateToDisplacement,
  differentiateToVelocity,
  differentiateToAcceleration,
  applyBaselineCorrection,
  extractWaveformParameters,
  computeMultiDampingResponseSpectra,
  bandpassFilter,
  calculateResponseSpectrum,
  calculateAriasIntensity,
  calculatePowerSpectralDensity,
  calculateEarthquakeParameters,
  scaleEarthquakeRecord,
  parseSeismoSignalFormat,
  exportToCsv,
  generateSyntheticGroundMotion
}; 