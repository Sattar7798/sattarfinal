import React, { useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A collection of shader effects for Three.js rendering
 */

// Create a basic gradient shader material
const GradientMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#ff0000'),
    color2: new THREE.Color('#0000ff'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(color1, color2, vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Create a heat map shader material
const HeatmapMaterial = shaderMaterial(
  {
    minValue: 0,
    maxValue: 1,
    colorHot: new THREE.Color('#ff0000'),
    colorCold: new THREE.Color('#0000ff'),
  },
  // Vertex shader
  `
    attribute float value;
    varying float vValue;
    void main() {
      vValue = value;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float minValue;
    uniform float maxValue;
    uniform vec3 colorHot;
    uniform vec3 colorCold;
    varying float vValue;

    void main() {
      float normalizedValue = (vValue - minValue) / (maxValue - minValue);
      normalizedValue = clamp(normalizedValue, 0.0, 1.0);
      vec3 color = mix(colorCold, colorHot, normalizedValue);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Create an outline shader material
const OutlineMaterial = shaderMaterial(
  {
    outlineColor: new THREE.Color('#000000'),
    outlineWidth: 0.02,
  },
  // Vertex shader
  `
    uniform float outlineWidth;
    void main() {
      vec3 newPosition = position + normal * outlineWidth;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 outlineColor;
    void main() {
      gl_FragColor = vec4(outlineColor, 1.0);
    }
  `
);

// Create an X-ray shader material
const XRayMaterial = shaderMaterial(
  {
    color: new THREE.Color('#00ffff'),
    opacity: 0.5,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vViewDir = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float opacity;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
      fresnel = pow(fresnel, 3.0);
      gl_FragColor = vec4(color, opacity * fresnel);
    }
  `
);

// Extend Three.js with our custom materials
extend({ GradientMaterial, HeatmapMaterial, OutlineMaterial, XRayMaterial });

// Gradient Material Component
export const GradientShader = ({ color1 = '#ff0000', color2 = '#0000ff', ...props }) => {
  const ref = React.useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.time = clock.getElapsedTime();
    }
  });
  
  return <gradientMaterial ref={ref} color1={color1} color2={color2} {...props} />;
};

// Heatmap Material Component
export const HeatmapShader = ({ 
  minValue = 0, 
  maxValue = 1, 
  colorHot = '#ff0000', 
  colorCold = '#0000ff',
  ...props 
}) => {
  return (
    <heatmapMaterial 
      minValue={minValue} 
      maxValue={maxValue}
      colorHot={colorHot}
      colorCold={colorCold}
      {...props} 
    />
  );
};

// Outline Material Component
export const OutlineShader = ({ 
  color = '#000000', 
  width = 0.02,
  ...props 
}) => {
  return (
    <outlineMaterial 
      outlineColor={color}
      outlineWidth={width}
      side={THREE.BackSide}
      {...props} 
    />
  );
};

// X-Ray Material Component
export const XRayShader = ({ 
  color = '#00ffff', 
  opacity = 0.5,
  ...props 
}) => {
  return (
    <xRayMaterial 
      color={color}
      opacity={opacity}
      transparent={true}
      depthWrite={false}
      {...props} 
    />
  );
};

// Main component to export all shaders
const ShaderEffects = {
  GradientShader,
  HeatmapShader,
  OutlineShader,
  XRayShader
};

export default ShaderEffects; 