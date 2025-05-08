import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Types of shader effects offered
export type ShaderEffectType = 'heatmap' | 'displacement' | 'stressLines' | 'streamlines' | 'contour' | 'gradient' | 'none';

// Shape of shader parameters
interface ShaderParameters {
  intensity?: number;
  colorScale?: 'rainbow' | 'thermal' | 'spectral' | 'viridis' | 'grayscale';
  displacementScale?: number;
  lineWidth?: number;
  opacity?: number;
  animated?: boolean;
  animationSpeed?: number;
  useLighting?: boolean;
  highlightThreshold?: number;
  colorA?: string;
  colorB?: string;
}

// Props for the main component
interface ShaderEffectsProps {
  type: ShaderEffectType;
  parameters?: ShaderParameters;
  target?: THREE.Mesh | THREE.Group | null;
  applyToScene?: boolean;
  children?: React.ReactNode;
}

// Vertex shader for structural heatmap visualization
const heatmapVertexShader = `
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
    vec3 newPosition = position + normal * dispSample.r * displacementScale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader for structural heatmap visualization
const heatmapFragmentShader = `
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

// Creates the various shader materials
const HeatmapMaterial = shaderMaterial(
  {
    time: 0,
    intensity: 1.0,
    colorScale: 0,
    highlightThreshold: 0.7,
    colorA: new THREE.Color('#3498db'),
    colorB: new THREE.Color('#e74c3c'),
    useLighting: true,
    displacementScale: 0.0,
    displacementMap: new THREE.Texture()
  },
  heatmapVertexShader,
  heatmapFragmentShader
);

// Stress lines vertex shader
const stressLinesVertexShader = `
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Stress lines fragment shader
const stressLinesFragmentShader = `
  varying vec2 vUv;
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

// Contour shader
const contourFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float intensity;
  uniform int colorScale;
  uniform float lineWidth;
  
  void main() {
    // Generate value field (can be replaced with simulation data)
    float value = vPosition.y * 0.1 + sin(vPosition.x * 10.0 + time) * 0.1;
    
    // Create contour lines
    float contour = abs(fract(value * 10.0) - 0.5);
    contour = smoothstep(0.0, lineWidth * 0.1, contour);
    
    // Assemble final color
    gl_FragColor = vec4(vec3(contour), 1.0);
  }
`;

// Register materials with react-three-fiber
extend({ HeatmapMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      heatmapMaterial: any;
    }
  }
}

// Component to apply effect to the entire scene
const SceneEffect: React.FC<{
  type: ShaderEffectType;
  parameters: ShaderParameters;
}> = ({ type, parameters }) => {
  const { scene, size, camera } = useThree();
  
  // Create render target and effect composer for post-processing
  const [renderTarget, composer] = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(
      size.width,
      size.height, 
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
      }
    );
    
    // Here you'd set up EffectComposer with appropriate passes
    // This is simplified - in a real implementation, you'd use
    // @react-three/postprocessing or a custom EffectComposer setup
    const composer = { render: () => {} };
    
    return [renderTarget, composer];
  }, [size]);

  // Update effect on each frame
  useFrame(({ gl }) => {
    // Post-processing would be implemented here
  });
  
  return null;
};

// Component to apply shader material to a specific mesh
const MeshEffect: React.FC<{
  type: ShaderEffectType;
  parameters: ShaderParameters;
  target: THREE.Mesh | THREE.Group | null;
}> = ({ type, parameters, target }) => {
  // Handle different effect types
  const {
    intensity = 1,
    colorScale = 'rainbow',
    displacementScale = 0,
    lineWidth = 0.05,
    animated = true,
    animationSpeed = 1,
    useLighting = true,
    highlightThreshold = 0.7,
    colorA = '#3498db',
    colorB = '#e74c3c'
  } = parameters;
  
  // Map color scale string to numeric value
  const colorScaleValue = {
    'rainbow': 0,
    'thermal': 1,
    'spectral': 2,
    'viridis': 3,
    'grayscale': 4
  }[colorScale] || 0;
  
  // Convert hex strings to THREE.Color objects
  const colorAObj = new THREE.Color(colorA);
  const colorBObj = new THREE.Color(colorB);
  
  // Create dummy texture for displacement
  const displacementMap = useMemo(() => {
    const texture = new THREE.DataTexture(
      new Uint8Array([255, 255, 255, 255]),
      1, 1,
      THREE.RGBAFormat
    );
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Update material parameters each frame
  useFrame(({ clock }) => {
    if (target && target instanceof THREE.Mesh && target.material) {
      // If target has our custom material
      if ('time' in (target.material as any)) {
        const material = target.material as any;
        if (animated) {
          material.time = clock.getElapsedTime() * animationSpeed;
        }
        
        // Update other parameters
        material.intensity = intensity;
        material.colorScale = colorScaleValue;
        material.displacementScale = displacementScale;
        material.lineWidth = lineWidth;
        material.useLighting = useLighting;
        material.highlightThreshold = highlightThreshold;
        material.colorA = colorAObj;
        material.colorB = colorBObj;
        
        material.needsUpdate = true;
      }
    }
  });
  
  return null;
};

// Main component
const ShaderEffects: React.FC<ShaderEffectsProps> = ({
  type = 'heatmap',
  parameters = {},
  target = null,
  applyToScene = false,
  children
}) => {
  // Only apply shader effect if not 'none'
  if (type === 'none') {
    return <>{children}</>;
  }
  
  return (
    <>
      {applyToScene && (
        <SceneEffect 
          type={type} 
          parameters={parameters} 
        />
      )}
      
      {target && (
        <MeshEffect 
          type={type} 
          parameters={parameters} 
          target={target} 
        />
      )}
      
      {children}
    </>
  );
};

export default ShaderEffects; 