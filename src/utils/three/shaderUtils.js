/**
 * Shader Utilities for Three.js Visualizations
 * 
 * This module provides shader-related utilities for creating advanced 
 * visual effects in structural engineering visualizations, including
 * stress visualization, displacement effects, and custom material effects.
 */

import * as THREE from 'three';

/**
 * Common vertex shader chunks that can be reused across different shaders
 */
export const ShaderChunks = {
  // Vertex position attributes and uniforms
  baseVertexUniforms: `
    uniform float time;
    uniform vec3 color;
    attribute float displacement;
    attribute float value;
    varying float vValue;
    varying vec3 vPosition;
    varying vec3 vNormal;
  `,
  
  // Fragment uniforms and varying definitions
  baseFragmentUniforms: `
    uniform vec3 color;
    uniform vec3 highColor;
    uniform vec3 lowColor;
    uniform float opacity;
    varying float vValue;
    varying vec3 vPosition;
    varying vec3 vNormal;
  `,
  
  // Color mapping based on value
  colorMapping: `
    // Map value to color
    vec3 mapValueToColor(float value, vec3 lowColor, vec3 highColor) {
      return mix(lowColor, highColor, value);
    }
  `,
  
  // Normal visualization
  normalVisualization: `
    // Convert normal to color
    vec3 normalToColor(vec3 normal) {
      return normal * 0.5 + 0.5;
    }
  `,
  
  // Vertex displacement along normal
  displacementVertex: `
    // Apply displacement along normal
    vec3 applyDisplacement(vec3 position, vec3 normal, float displacement) {
      return position + normal * displacement;
    }
  `,
  
  // Fresnel effect
  fresnelEffect: `
    // Calculate fresnel effect
    float fresnelEffect(vec3 viewDirection, vec3 normal, float power) {
      return pow(1.0 - abs(dot(viewDirection, normal)), power);
    }
  `
};

/**
 * Pre-defined shader material types for common visualization needs
 */
export const ShaderTypes = {
  STRESS: 'stress',
  DISPLACEMENT: 'displacement',
  NORMAL: 'normal',
  WIREFRAME: 'wireframe',
  CONTOUR: 'contour',
  GRADIENT: 'gradient',
  HEATMAP: 'heatmap',
  X_RAY: 'xray'
};

/**
 * Create a shader material for stress visualization
 * @param {Object} options Material options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export function createStressShaderMaterial(options = {}) {
  const {
    lowColor = new THREE.Color(0x0000ff), // Blue (low stress)
    highColor = new THREE.Color(0xff0000), // Red (high stress)
    opacity = 1.0,
    wireframe = false,
    transparent = opacity < 1.0,
    time = 0,
  } = options;
  
  // Vertex shader
  const vertexShader = `
    ${ShaderChunks.baseVertexUniforms}
    
    void main() {
      vValue = value;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Apply displacement along normal if present
      vec3 newPosition = position;
      if (displacement > 0.0) {
        newPosition = ${ShaderChunks.displacementVertex}
          applyDisplacement(position, normal, displacement * 0.1);
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;
  
  // Fragment shader
  const fragmentShader = `
    ${ShaderChunks.baseFragmentUniforms}
    ${ShaderChunks.colorMapping}
    ${ShaderChunks.fresnelEffect}
    
    void main() {
      // Base color from value
      vec3 baseColor = mapValueToColor(vValue, lowColor, highColor);
      
      // Add edge highlight
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = fresnelEffect(viewDirection, vNormal, 2.0);
      vec3 finalColor = mix(baseColor, vec3(1.0), fresnel * 0.3);
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;
  
  // Create shader material
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: time },
      color: { value: new THREE.Color(0xffffff) },
      lowColor: { value: lowColor },
      highColor: { value: highColor },
      opacity: { value: opacity }
    },
    vertexShader,
    fragmentShader,
    transparent,
    wireframe,
    side: THREE.DoubleSide,
    extensions: {
      derivatives: true
    }
  });
}

/**
 * Create a shader material for displacement visualization
 * @param {Object} options Material options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export function createDisplacementShaderMaterial(options = {}) {
  const {
    baseColor = new THREE.Color(0xcccccc),
    displacementColor = new THREE.Color(0xff7700),
    opacity = 1.0,
    wireframe = false,
    transparent = opacity < 1.0,
    displacementScale = 1.0,
    time = 0,
    animated = false
  } = options;
  
  // Vertex shader
  const vertexShader = `
    ${ShaderChunks.baseVertexUniforms}
    uniform float displacementScale;
    uniform float time;
    uniform bool animated;
    
    void main() {
      // Pass values to fragment shader
      vValue = value;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Calculate displacement amount
      float displacementAmount = displacement * displacementScale;
      
      // Optional animation
      if (animated) {
        displacementAmount *= (sin(time * 2.0) * 0.5 + 0.5);
      }
      
      // Apply displacement along normal
      vec3 newPosition = position + normal * displacementAmount;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;
  
  // Fragment shader
  const fragmentShader = `
    ${ShaderChunks.baseFragmentUniforms}
    uniform vec3 baseColor;
    uniform vec3 displacementColor;
    uniform bool animated;
    
    void main() {
      // Mix between base color and displacement color based on value
      vec3 finalColor = mix(baseColor, displacementColor, vValue);
      
      // Add lighting based on normal
      float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0)));
      finalColor *= 0.8 + light * 0.2;
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;
  
  // Create shader material
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: time },
      displacementScale: { value: displacementScale },
      baseColor: { value: baseColor },
      displacementColor: { value: displacementColor },
      opacity: { value: opacity },
      animated: { value: animated }
    },
    vertexShader,
    fragmentShader,
    transparent,
    wireframe,
    side: THREE.DoubleSide
  });
}

/**
 * Create a shader material for contour line visualization
 * @param {Object} options Material options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export function createContourShaderMaterial(options = {}) {
  const {
    baseColor = new THREE.Color(0xffffff),
    contourColor = new THREE.Color(0x000000),
    levels = 10,
    opacity = 1.0,
    transparent = opacity < 1.0,
    contourWidth = 0.05
  } = options;
  
  // Vertex shader
  const vertexShader = `
    ${ShaderChunks.baseVertexUniforms}
    
    void main() {
      vValue = value;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Fragment shader
  const fragmentShader = `
    ${ShaderChunks.baseFragmentUniforms}
    uniform vec3 baseColor;
    uniform vec3 contourColor;
    uniform float levels;
    uniform float contourWidth;
    
    void main() {
      // Create contour pattern
      float scaledValue = vValue * levels;
      float contourPattern = abs(fract(scaledValue) - 0.5) / 0.5;
      
      // Make contour lines
      float contour = smoothstep(contourWidth, 0.0, contourPattern);
      
      // Mix base color and contour color
      vec3 finalColor = mix(baseColor, contourColor, contour);
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;
  
  // Create shader material
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: baseColor },
      contourColor: { value: contourColor },
      levels: { value: levels },
      opacity: { value: opacity },
      contourWidth: { value: contourWidth }
    },
    vertexShader,
    fragmentShader,
    transparent,
    side: THREE.DoubleSide
  });
}

/**
 * Create an X-ray shader material
 * @param {Object} options Material options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export function createXRayShaderMaterial(options = {}) {
  const {
    color = new THREE.Color(0x88ccff),
    opacity = 0.5,
    fresnelPower = 2.0,
    gridSize = 10.0
  } = options;
  
  // Vertex shader
  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Fragment shader
  const fragmentShader = `
    uniform vec3 color;
    uniform float opacity;
    uniform float fresnelPower;
    uniform float gridSize;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    ${ShaderChunks.fresnelEffect}
    
    void main() {
      // Edge highlight with fresnel
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = fresnelEffect(viewDirection, vNormal, fresnelPower);
      
      // Add subtle grid pattern
      vec2 grid = fract(vUv * gridSize);
      float gridPattern = 1.0 - smoothstep(0.95, 1.0, max(grid.x, grid.y));
      
      // Final color
      vec3 finalColor = color + fresnel * 0.5;
      float finalOpacity = opacity * (fresnel * 0.5 + 0.5) + gridPattern * 0.1;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;
  
  // Create shader material
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      opacity: { value: opacity },
      fresnelPower: { value: fresnelPower },
      gridSize: { value: gridSize }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
}

/**
 * Apply a value array to a mesh's geometry as a vertex attribute
 * @param {THREE.Mesh} mesh The mesh to update
 * @param {Array} values Array of values (one per vertex)
 * @param {string} attributeName Name of the attribute
 * @param {Object} options Additional options
 * @returns {THREE.Mesh} The updated mesh
 */
export function applyVertexAttribute(mesh, values, attributeName = 'value', options = {}) {
  const {
    normalize = true,
    updateMaterial = true,
    min = Math.min(...values),
    max = Math.max(...values)
  } = options;
  
  // Get geometry
  const geometry = mesh.geometry;
  
  // Create normalized values if requested
  const normalizedValues = normalize 
    ? values.map(v => (v - min) / (max - min || 1)) 
    : values;
  
  // Add attribute to geometry
  geometry.setAttribute(
    attributeName,
    new THREE.Float32BufferAttribute(normalizedValues, 1)
  );
  
  // Update material if needed
  if (updateMaterial && mesh.material) {
    if (!mesh.material.isShaderMaterial) {
      console.warn('Mesh material is not a ShaderMaterial. Vertex attributes may not be used.');
    } else if (mesh.material.uniforms) {
      // Add min/max to uniforms if present
      if (mesh.material.uniforms.valueMin !== undefined) {
        mesh.material.uniforms.valueMin.value = min;
      }
      if (mesh.material.uniforms.valueMax !== undefined) {
        mesh.material.uniforms.valueMax.value = max;
      }
    }
  }
  
  return mesh;
}

/**
 * Create a custom shader material based on a template
 * @param {string} type Shader type from ShaderTypes
 * @param {Object} options Material options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export function createShaderMaterial(type, options = {}) {
  switch (type) {
    case ShaderTypes.STRESS:
      return createStressShaderMaterial(options);
    case ShaderTypes.DISPLACEMENT:
      return createDisplacementShaderMaterial(options);
    case ShaderTypes.CONTOUR:
      return createContourShaderMaterial(options);
    case ShaderTypes.X_RAY:
      return createXRayShaderMaterial(options);
    default:
      console.warn(`Shader type "${type}" not recognized. Using stress shader.`);
      return createStressShaderMaterial(options);
  }
}

/**
 * Update uniform values of a shader material
 * @param {THREE.ShaderMaterial} material Shader material to update
 * @param {Object} uniformValues Object with uniform name-value pairs
 * @returns {THREE.ShaderMaterial} Updated material
 */
export function updateShaderUniforms(material, uniformValues) {
  if (!material || !material.uniforms) {
    console.warn('Material has no uniforms to update');
    return material;
  }
  
  // Update each uniform
  Object.entries(uniformValues).forEach(([name, value]) => {
    if (material.uniforms[name] !== undefined) {
      material.uniforms[name].value = value;
    }
  });
  
  return material;
}

/**
 * Creates and applies a displacement map from a texture
 * @param {THREE.Mesh} mesh The mesh to apply displacement to
 * @param {string} textureUrl URL of the displacement texture
 * @param {Object} options Displacement options
 * @returns {Promise<THREE.Mesh>} Promise resolving to the updated mesh
 */
export function applyDisplacementTexture(mesh, textureUrl, options = {}) {
  const {
    scale = 1.0,
    bias = 0.0,
    updateGeometry = false,
    applyToMaterial = true
  } = options;
  
  return new Promise((resolve, reject) => {
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        // Setup for proper displacement
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        if (applyToMaterial) {
          // Apply to material (for shader displacement)
          if (!mesh.material.displacementMap) {
            // Clone material if it's shared
            mesh.material = mesh.material.clone();
          }
          
          mesh.material.displacementMap = texture;
          mesh.material.displacementScale = scale;
          mesh.material.displacementBias = bias;
          mesh.material.needsUpdate = true;
        }
        
        if (updateGeometry) {
          // Create a displacement attribute from the texture (more advanced)
          applyDisplacementTextureToGeometry(mesh, texture, scale, bias);
        }
        
        resolve(mesh);
      },
      undefined,
      (error) => {
        console.error('Error loading displacement texture:', error);
        reject(error);
      }
    );
  });
}

/**
 * Apply displacement from a texture directly to geometry vertices
 * @param {THREE.Mesh} mesh Mesh to modify
 * @param {THREE.Texture} texture Displacement texture
 * @param {number} scale Displacement scale
 * @param {number} bias Displacement bias
 */
function applyDisplacementTextureToGeometry(mesh, texture, scale = 1.0, bias = 0.0) {
  // This is a placeholder for a more complex implementation
  // In a real implementation, we would:
  // 1. Render the texture to a canvas
  // 2. Get pixel data
  // 3. Sample pixel values based on UV coordinates
  // 4. Apply displacement to vertices
  
  console.warn('Displacement texture to geometry not fully implemented');
}

/**
 * Collection of shader utilities and materials for advanced visualizations
 */

// Create a material that shows heat map visualization
export const createHeatmapMaterial = (minValue = 0, maxValue = 1, useLogScale = false) => {
  // Create shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      minValue: { value: minValue },
      maxValue: { value: maxValue },
      useLogScale: { value: useLogScale ? 1.0 : 0.0 }
    },
    vertexShader: `
      attribute float value;
      varying float vValue;
      
      void main() {
        vValue = value;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float minValue;
      uniform float maxValue;
      uniform float useLogScale;
      varying float vValue;
      
      // Function to convert HSV to RGB
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        float normalizedValue;
        
        // Apply log scale if requested
        if (useLogScale > 0.5) {
          // Avoid log(0) by adding a small value
          float minLog = log(minValue + 0.0001);
          float maxLog = log(maxValue + 0.0001);
          float valueLog = log(vValue + 0.0001);
          normalizedValue = (valueLog - minLog) / (maxLog - minLog);
        } else {
          normalizedValue = (vValue - minValue) / (maxValue - minValue);
        }
        
        // Clamp to 0-1 range
        normalizedValue = clamp(normalizedValue, 0.0, 1.0);
        
        // Use HSV color space for a nice rainbow gradient
        // Hue: 0 (red) -> 0.66 (blue)
        float hue = (1.0 - normalizedValue) * 0.66;
        vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  
  return material;
};

// Create a material that shows stress contours
export const createStressContourMaterial = (minValue = 0, maxValue = 1, contourLines = 10) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      minValue: { value: minValue },
      maxValue: { value: maxValue },
      contourLines: { value: contourLines }
    },
    vertexShader: `
      attribute float value;
      varying float vValue;
      
      void main() {
        vValue = value;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float minValue;
      uniform float maxValue;
      uniform float contourLines;
      varying float vValue;
      
      // Function to convert HSV to RGB
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        float normalizedValue = (vValue - minValue) / (maxValue - minValue);
        normalizedValue = clamp(normalizedValue, 0.0, 1.0);
        
        // Calculate contour line effect
        float contourValue = normalizedValue * contourLines;
        float contourFract = fract(contourValue);
        float contourLine = smoothstep(0.0, 0.05, contourFract) * smoothstep(0.05, 0.0, contourFract - 0.95);
        
        // Base color from rainbow gradient
        float hue = (1.0 - normalizedValue) * 0.66;
        vec3 baseColor = hsv2rgb(vec3(hue, 1.0, 1.0));
        
        // Mix in contour lines (black)
        vec3 finalColor = mix(baseColor, vec3(0.0), contourLine * 0.5);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
  
  return material;
};

// Create a material for displacement visualization
export const createDisplacementMaterial = (factor = 1.0, color = 0x3388ff) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      factor: { value: factor },
      color: { value: new THREE.Color(color) }
    },
    vertexShader: `
      attribute vec3 displacement;
      uniform float factor;
      varying float vMagnitude;
      
      void main() {
        // Apply displacement
        vec3 newPosition = position + displacement * factor;
        
        // Calculate magnitude for coloring
        vMagnitude = length(displacement) / factor;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vMagnitude;
      
      void main() {
        // Visualize displacement magnitude
        vec3 finalColor = color * vMagnitude;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
  
  return material;
};

// Create X-ray effect material 
export const createXRayMaterial = (color = 0x88ccff, opacity = 0.5, fresnelFactor = 1.0) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      opacity: { value: opacity },
      fresnelFactor: { value: fresnelFactor }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vViewDir = normalize(cameraPosition - worldPosition.xyz);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      uniform float fresnelFactor;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      
      void main() {
        // Calculate fresnel effect (edges glow stronger)
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), fresnelFactor);
        
        // Apply color and opacity
        gl_FragColor = vec4(color, opacity * fresnel);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  
  return material;
};

// Create outline effect material
export const createOutlineMaterial = (color = 0x000000, thickness = 0.03) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      thickness: { value: thickness }
    },
    vertexShader: `
      uniform float thickness;
      
      void main() {
        // Expand the position along the normal by thickness amount
        vec3 newPosition = position + normal * thickness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.BackSide
  });
  
  return material;
};

// Create a material for section cuts
export const createSectionMaterial = (planeNormal = new THREE.Vector3(0, 1, 0), planeConstant = 0) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      planeNormal: { value: planeNormal.normalize() },
      planeConstant: { value: planeConstant }
    },
    vertexShader: `
      varying vec3 vPosition;
      
      void main() {
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 planeNormal;
      uniform float planeConstant;
      varying vec3 vPosition;
      
      void main() {
        // Calculate signed distance to plane
        float distance = dot(vPosition, planeNormal) - planeConstant;
        
        // Discard fragments on one side of the plane
        if (distance > 0.0) {
          discard;
        }
        
        // Show section cut edge
        float edgeWidth = 0.01;
        float edgeFactor = 1.0 - smoothstep(0.0, -edgeWidth, distance);
        
        // Base color
        vec3 baseColor = vec3(1.0, 0.0, 0.0);  // Red for cut surface
        vec3 edgeColor = vec3(1.0, 1.0, 0.0);  // Yellow for edge
        
        vec3 finalColor = mix(baseColor, edgeColor, edgeFactor);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
  
  return material;
};

// Create a wireframe material with adjustable thickness
export const createEnhancedWireframeMaterial = (color = 0xffffff, lineWidth = 0.003, opacity = 1.0) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      lineWidth: { value: lineWidth },
      opacity: { value: opacity }
    },
    vertexShader: `
      attribute vec3 barycentric;
      varying vec3 vBarycentric;
      
      void main() {
        vBarycentric = barycentric;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float lineWidth;
      uniform float opacity;
      varying vec3 vBarycentric;
      
      float edgeFactor() {
        vec3 d = fwidth(vBarycentric);
        vec3 a3 = smoothstep(vec3(0.0), d * lineWidth, vBarycentric);
        return min(min(a3.x, a3.y), a3.z);
      }
      
      void main() {
        float factor = edgeFactor();
        
        if (factor > 0.99) {
          discard;
        }
        
        gl_FragColor = vec4(color, (1.0 - factor) * opacity);
      }
    `,
    transparent: opacity < 1.0,
    depthWrite: opacity >= 1.0
  });
  
  return material;
};

// Prepare a mesh for the enhanced wireframe visualization
export const prepareWireframeMesh = (geometry) => {
  const positions = geometry.attributes.position;
  const faces = positions.count / 3;
  
  // Add barycentric coordinates for wireframe rendering
  const barycentric = [];
  
  for (let i = 0; i < faces; i++) {
    barycentric.push(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }
  
  geometry.setAttribute('barycentric', new THREE.Float32BufferAttribute(barycentric, 3));
  
  return geometry;
};

// Helper for adding attributes to geometry for different visualizations
export const addVisualizationAttributes = (geometry, values, attributeName = 'value') => {
  if (values.length === geometry.attributes.position.count) {
    geometry.setAttribute(attributeName, new THREE.Float32BufferAttribute(values, 1));
  } else {
    console.error(`Attribute length mismatch: ${values.length} values provided for ${geometry.attributes.position.count} vertices`);
  }
  
  return geometry;
};

export default {
  ShaderChunks,
  ShaderTypes,
  createShaderMaterial,
  createStressShaderMaterial,
  createDisplacementShaderMaterial,
  createContourShaderMaterial,
  createXRayShaderMaterial,
  applyVertexAttribute,
  updateShaderUniforms,
  applyDisplacementTexture,
  createHeatmapMaterial,
  createStressContourMaterial,
  createDisplacementMaterial,
  createXRayMaterial,
  createOutlineMaterial,
  createSectionMaterial,
  createEnhancedWireframeMaterial,
  prepareWireframeMesh,
  addVisualizationAttributes
}; 