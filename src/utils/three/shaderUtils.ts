import * as THREE from 'three';

/**
 * Vertex shader for heatmap visualization
 */
export const heatmapVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  uniform float displacementScale;
  uniform sampler2D displacementMap;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    // Optional displacement based on texture and time
    vec4 dispSample = texture2D(displacementMap, uv);
    vec3 newPosition = position;
    
    // Apply displacement along normal if scale is non-zero
    if (displacementScale > 0.0) {
      newPosition += normal * dispSample.r * displacementScale;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

/**
 * Fragment shader for heatmap visualization
 */
export const heatmapFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  uniform float intensity;
  uniform int colorScale;
  uniform float highlightThreshold;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform bool useLighting;
  
  // Helper function to convert values to different color scales
  vec3 getColorFromScale(float value) {
    // Rainbow scale
    if(colorScale == 0) {
      float h = value;
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }
    // Thermal scale (blue to red)
    else if(colorScale == 1) {
      return mix(
        vec3(0.0, 0.0, 1.0),  // blue (cold)
        vec3(1.0, 0.0, 0.0),  // red (hot)
        value
      );
    }
    // Spectral scale
    else if(colorScale == 2) {
      if (value < 0.25) {
        return mix(vec3(0.0, 0.0, 0.5), vec3(0.0, 0.5, 1.0), value * 4.0);
      } else if (value < 0.5) {
        return mix(vec3(0.0, 0.5, 1.0), vec3(0.0, 1.0, 0.0), (value - 0.25) * 4.0);
      } else if (value < 0.75) {
        return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (value - 0.5) * 4.0);
      } else {
        return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (value - 0.75) * 4.0);
      }
    }
    // Viridis-like scale
    else if(colorScale == 3) {
      return mix(
        mix(vec3(0.267, 0.005, 0.329), vec3(0.129, 0.567, 0.551), value),
        mix(vec3(0.129, 0.567, 0.551), vec3(0.993, 0.906, 0.144), value),
        value
      );
    }
    // Grayscale
    else if(colorScale == 4) {
      return vec3(value);
    }
    // Custom gradient
    else {
      return mix(colorA, colorB, value);
    }
  }
  
  void main() {
    // Calculate value based on position, normal and time
    float value = vPosition.y * 0.1 + 0.5;
    value = mod(value + time * 0.1, 1.0);
    
    // Apply intensity to make effect more/less pronounced
    value = pow(value, intensity);
    
    // Get color from scale
    vec3 color = getColorFromScale(value);
    
    // Apply lighting if enabled
    if (useLighting) {
      vec3 light = normalize(vec3(1.0, 1.0, 1.0));
      float dProd = max(0.0, dot(vNormal, light));
      vec3 lit = color * dProd;
      color = mix(color, lit, 0.6);
    }
    
    // Highlight above threshold
    if (value > highlightThreshold) {
      color = mix(color, vec3(1.0), 0.3);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Vertex shader for stress lines visualization
 */
export const stressLinesVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment shader for stress lines visualization
 */
export const stressLinesFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  uniform float lineWidth;
  uniform float intensity;
  uniform vec3 colorA;
  uniform vec3 colorB;
  
  // Generate a pattern of stress lines
  float stressPattern(vec2 p) {
    // Create principal stress directions
    vec2 dir1 = vec2(cos(p.x * 10.0), sin(p.y * 10.0));
    vec2 dir2 = vec2(sin(p.x * 8.0), cos(p.y * 8.0));
    
    // Calculate stress intensity at this point
    float stress = sin(p.x * 5.0 + time) * cos(p.y * 5.0 + time) * 0.5 + 0.5;
    
    // Create pattern along principal directions
    float pattern1 = abs(sin(dot(p, dir1) * 20.0));
    float pattern2 = abs(sin(dot(p, dir2) * 20.0));
    
    // Combine patterns based on stress
    float pattern = mix(pattern1, pattern2, stress);
    
    // Create lines with adjustable width
    return smoothstep(lineWidth, 0.0, pattern);
  }
  
  void main() {
    float pattern = stressPattern(vUv);
    
    // Mix colors based on stress intensity
    vec3 color = mix(colorA, colorB, pattern * intensity);
    
    gl_FragColor = vec4(color, pattern);
  }
`;

/**
 * Creates a ColorMap from a continuous value (0-1) for visualization
 * @param value - Normalized value between 0-1
 * @param colorScale - Color scale type: 'rainbow', 'thermal', 'spectral', 'viridis'
 * @returns THREE.Color object
 */
export function getColorFromValue(value: number, colorScale: 'rainbow' | 'thermal' | 'spectral' | 'viridis' | 'grayscale' = 'rainbow'): THREE.Color {
  // Ensure value is in 0-1 range
  const v = Math.max(0, Math.min(1, value));
  
  switch (colorScale) {
    case 'rainbow': {
      // HSL-based rainbow
      const h = v;
      const r = Math.max(0, Math.min(1, Math.abs(h * 6.0 - 3.0) - 1.0));
      const g = Math.max(0, Math.min(1, 2.0 - Math.abs(h * 6.0 - 2.0)));
      const b = Math.max(0, Math.min(1, 2.0 - Math.abs(h * 6.0 - 4.0)));
      return new THREE.Color(r, g, b);
    }
    case 'thermal': {
      // Blue (cold) to Red (hot)
      return new THREE.Color(v, 0, 1 - v);
    }
    case 'spectral': {
      // Multi-color spectral scale
      if (v < 0.25) {
        const t = v * 4.0;
        return new THREE.Color(
          0,
          0.5 * t,
          0.5 + 0.5 * t
        );
      } else if (v < 0.5) {
        const t = (v - 0.25) * 4.0;
        return new THREE.Color(
          0,
          0.5 + 0.5 * t,
          1.0 - t
        );
      } else if (v < 0.75) {
        const t = (v - 0.5) * 4.0;
        return new THREE.Color(
          t,
          1.0,
          0
        );
      } else {
        const t = (v - 0.75) * 4.0;
        return new THREE.Color(
          1.0,
          1.0 - t,
          0
        );
      }
    }
    case 'viridis': {
      // Approximation of the viridis color map
      const c0 = new THREE.Color(0.267, 0.005, 0.329);
      const c1 = new THREE.Color(0.129, 0.567, 0.551);
      const c2 = new THREE.Color(0.993, 0.906, 0.144);
      
      if (v < 0.5) {
        return c0.clone().lerp(c1, v * 2);
      } else {
        return c1.clone().lerp(c2, (v - 0.5) * 2);
      }
    }
    case 'grayscale': {
      // Simple grayscale
      return new THREE.Color(v, v, v);
    }
    default:
      return new THREE.Color(v, v, v);
  }
}

/**
 * Creates a data texture for displacement maps
 * @param width - Width of the texture
 * @param height - Height of the texture
 * @param generator - Function that generates a value for each pixel
 * @returns THREE.DataTexture
 */
export function createDataTexture(
  width: number = 256,
  height: number = 256,
  generator: (x: number, y: number, w: number, h: number) => number = (x, y, w, h) => Math.random()
): THREE.DataTexture {
  const size = width * height;
  const data = new Uint8Array(4 * size);
  
  for (let i = 0; i < size; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    
    const val = generator(x, y, width, height);
    const stride = i * 4;
    
    // Set R, G, B, A values
    data[stride] = val * 255;
    data[stride + 1] = val * 255;
    data[stride + 2] = val * 255;
    data[stride + 3] = 255; // Alpha always 1
  }
  
  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat
  );
  
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a gradient texture for use in shaders
 * @param colorStops - Array of {position, color} objects where position is 0-1
 * @param width - Width of the texture
 * @returns THREE.Texture
 */
export function createGradientTexture(
  colorStops: Array<{ position: number; color: THREE.Color | string }>,
  width: number = 256
): THREE.Texture {
  // Create canvas and context
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Could not get canvas context');
    return new THREE.Texture();
  }
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  
  // Add color stops
  colorStops.forEach(stop => {
    if (typeof stop.color === 'string') {
      gradient.addColorStop(stop.position, stop.color);
    } else {
      gradient.addColorStop(
        stop.position, 
        `rgb(${Math.floor(stop.color.r * 255)}, ${Math.floor(stop.color.g * 255)}, ${Math.floor(stop.color.b * 255)})`
      );
    }
  });
  
  // Fill gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 1);
  
  // Create texture
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Creates a noise pattern texture for use in shaders
 * @param width - Width of the texture
 * @param height - Height of the texture
 * @param scale - Scale of the noise (higher = more detailed)
 * @returns THREE.Texture
 */
export function createNoiseTexture(
  width: number = 256,
  height: number = 256,
  scale: number = 10
): THREE.Texture {
  const size = width * height;
  const data = new Uint8Array(4 * size);
  
  // Simplex noise approximation
  const noise = (nx: number, ny: number) => {
    // Simple noise approximation
    return 0.5 * (
      Math.sin(nx * 12.9898 + ny * 78.233) * 
      Math.sin(nx * 39.346 + ny * 36.2364) +
      1.0
    );
  };
  
  for (let i = 0; i < size; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    
    // Normalized coordinates
    const nx = x / width;
    const ny = y / height;
    
    // Generate noise value
    const noiseValue = noise(nx * scale, ny * scale);
    const stride = i * 4;
    
    // Set R, G, B, A values
    data[stride] = noiseValue * 255;
    data[stride + 1] = noiseValue * 255;
    data[stride + 2] = noiseValue * 255;
    data[stride + 3] = 255; // Alpha always 1
  }
  
  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat
  );
  
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a contour map shader material
 * @param parameters - Parameters for the contour material
 * @returns THREE.ShaderMaterial
 */
export function createContourMaterial(parameters: {
  colorScale?: 'rainbow' | 'thermal' | 'spectral' | 'viridis' | 'grayscale';
  lineWidth?: number;
  contourInterval?: number;
  animate?: boolean;
  animationSpeed?: number;
  colorA?: THREE.Color | string;
  colorB?: THREE.Color | string;
} = {}): THREE.ShaderMaterial {
  const {
    colorScale = 'thermal',
    lineWidth = 0.05,
    contourInterval = 10.0,
    animate = true,
    animationSpeed = 0.5,
    colorA = new THREE.Color(0x0000ff),
    colorB = new THREE.Color(0xff0000)
  } = parameters;
  
  // Create material with shaders
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      lineWidth: { value: lineWidth },
      contourInterval: { value: contourInterval },
      colorScale: { value: ['rainbow', 'thermal', 'spectral', 'viridis', 'grayscale'].indexOf(colorScale) },
      colorA: { value: new THREE.Color(colorA) },
      colorB: { value: new THREE.Color(colorB) },
      animationSpeed: { value: animationSpeed }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float lineWidth;
      uniform float contourInterval;
      uniform int colorScale;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform float animationSpeed;
      
      // Helper function to convert values to different color scales - same as in heatmapFragmentShader
      vec3 getColorFromScale(float value) {
        // Rainbow scale
        if(colorScale == 0) {
          float h = value;
          float r = abs(h * 6.0 - 3.0) - 1.0;
          float g = 2.0 - abs(h * 6.0 - 2.0);
          float b = 2.0 - abs(h * 6.0 - 4.0);
          return clamp(vec3(r, g, b), 0.0, 1.0);
        }
        // Thermal scale
        else if(colorScale == 1) {
          return mix(
            vec3(0.0, 0.0, 1.0),  // blue (cold)
            vec3(1.0, 0.0, 0.0),  // red (hot)
            value
          );
        }
        // Spectral scale
        else if(colorScale == 2) {
          if (value < 0.25) {
            return mix(vec3(0.0, 0.0, 0.5), vec3(0.0, 0.5, 1.0), value * 4.0);
          } else if (value < 0.5) {
            return mix(vec3(0.0, 0.5, 1.0), vec3(0.0, 1.0, 0.0), (value - 0.25) * 4.0);
          } else if (value < 0.75) {
            return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (value - 0.5) * 4.0);
          } else {
            return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (value - 0.75) * 4.0);
          }
        }
        // Viridis-like scale
        else if(colorScale == 3) {
          return mix(
            mix(vec3(0.267, 0.005, 0.329), vec3(0.129, 0.567, 0.551), value),
            mix(vec3(0.129, 0.567, 0.551), vec3(0.993, 0.906, 0.144), value),
            value
          );
        }
        // Grayscale
        else if(colorScale == 4) {
          return vec3(value);
        }
        // Custom gradient
        else {
          return mix(colorA, colorB, value);
        }
      }
      
      void main() {
        // Generate value field (can be replaced with simulation data)
        float value = vPosition.y * 0.1;
        
        // Add some variation with sin waves if animation is enabled
        if (time > 0.0) {
          value += sin(vPosition.x * 5.0 + time * animationSpeed) * 0.05;
        }
        
        // Normalize to 0-1 range
        value = mod(value, 1.0);
        
        // Create contour lines
        float contour = abs(fract(value * contourInterval) - 0.5);
        contour = smoothstep(0.0, lineWidth, contour);
        
        // Get base color for region
        vec3 baseColor = getColorFromScale(value);
        
        // Combine base color with contour lines
        vec3 finalColor = mix(vec3(0.1), baseColor, contour);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true
  });
}

/**
 * Create a displacement map for structural deformation
 * @param amplitude - Maximum displacement amplitude
 * @param frequency - Frequency of the displacement pattern
 * @param time - Time variable for animation
 * @returns THREE.DataTexture
 */
export function createDisplacementMap(
  amplitude: number = 1.0,
  frequency: number = 5.0,
  time: number = 0
): THREE.DataTexture {
  const size = 256;
  const data = new Float32Array(size * size * 4);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      
      // Normalized coordinates
      const x = i / size - 0.5;
      const y = j / size - 0.5;
      
      // Distance from center
      const dist = Math.sqrt(x * x + y * y);
      
      // Radial waves with time
      const val = (
        Math.sin(dist * frequency * Math.PI * 2 + time) * 0.5 + 0.5
      ) * amplitude;
      
      // Store displacement value
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 1.0;  // Alpha
    }
  }
  
  const texture = new THREE.DataTexture(
    data,
    size, 
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  
  texture.needsUpdate = true;
  return texture;
}

export default {
  heatmapVertexShader,
  heatmapFragmentShader,
  stressLinesVertexShader,
  stressLinesFragmentShader,
  getColorFromValue,
  createDataTexture,
  createGradientTexture,
  createNoiseTexture,
  createContourMaterial,
  createDisplacementMap
}; 