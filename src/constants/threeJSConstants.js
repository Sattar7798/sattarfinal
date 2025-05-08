/**
 * Three.js constants and configurations for 3D visualizations
 */
import * as THREE from 'three';

// Standard camera configurations
export const CAMERAS = {
  PERSPECTIVE: {
    type: 'perspective',
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5]
  },
  ORTHOGRAPHIC: {
    type: 'orthographic',
    frustumSize: 10,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5]
  },
  // Special camera configurations
  BUILDING_VIEW: {
    type: 'perspective',
    fov: 60,
    near: 0.1,
    far: 1000,
    position: [15, 15, 15],
    orbitTarget: [0, 5, 0]
  },
  DETAIL_VIEW: {
    type: 'perspective',
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [3, 2, 5],
    orbitTarget: [0, 0, 0]
  }
};

// Standard lighting configurations
export const LIGHTS = {
  BASIC: {
    ambient: { enabled: true, color: 0xffffff, intensity: 0.5 },
    directional: { enabled: true, color: 0xffffff, intensity: 0.8, position: [5, 10, 5], castShadow: true }
  },
  STRUCTURAL: {
    ambient: { enabled: true, color: 0xcccccc, intensity: 0.4 },
    directional: { enabled: true, color: 0xffffff, intensity: 0.7, position: [10, 20, 15], castShadow: true },
    point: { enabled: true, color: 0xffaa88, intensity: 1.0, position: [-5, 10, -5], castShadow: false }
  },
  DRAMATIC: {
    ambient: { enabled: true, color: 0x334455, intensity: 0.3 },
    directional: { enabled: false },
    spot: { enabled: true, color: 0xffffff, intensity: 1.0, position: [10, 15, 10], angle: Math.PI / 6, penumbra: 0.2, castShadow: true }
  },
  EARTHQUAKE: {
    ambient: { enabled: true, color: 0x555555, intensity: 0.3 },
    directional: { enabled: true, color: 0xff3333, intensity: 0.7, position: [-5, 10, 5], castShadow: true },
    point: { enabled: true, color: 0xffaa00, intensity: 1.0, position: [5, 5, 5], castShadow: true }
  }
};

// Material configurations
export const MATERIALS = {
  // Basic materials
  STANDARD: new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.2
  }),
  CONCRETE: new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.9,
    metalness: 0.1
  }),
  STEEL: new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.2,
    metalness: 0.8
  }),
  GLASS: new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0,
    transparent: true,
    opacity: 0.3,
    transmission: 0.9
  }),
  // Special visualization materials
  WIREFRAME: new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
  }),
  HIGHLIGHT: new THREE.MeshStandardMaterial({
    color: 0xff3333,
    emissive: 0xff0000,
    emissiveIntensity: 0.3,
    roughness: 0.5,
    metalness: 0.2
  }),
  STRESS_HIGH: new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.2
  }),
  STRESS_MEDIUM: new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    roughness: 0.5,
    metalness: 0.2
  }),
  STRESS_LOW: new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 0.5,
    metalness: 0.2
  })
};

// Renderer configurations
export const RENDERERS = {
  STANDARD: {
    antialias: true,
    alpha: false,
    clearColor: 0xeeeeee,
    shadows: true
  },
  TRANSPARENT: {
    antialias: true,
    alpha: true,
    shadows: true
  },
  PERFORMANCE: {
    antialias: false,
    alpha: false,
    clearColor: 0xffffff,
    shadows: false
  }
};

// Animation configurations
export const ANIMATIONS = {
  EARTHQUAKE: {
    duration: 8,
    intensity: 0.4,
    frequency: 4,
    decay: 0.2
  },
  BUILDING_SWAY: {
    duration: 5,
    amplitude: 0.2,
    frequency: 0.5
  },
  CONSTRUCTION: {
    duration: 10,
    segmentDuration: 0.5
  }
};

// Geometry presets
export const BUILDING_PRESETS = {
  SKYSCRAPER: {
    height: 50,
    width: 10,
    depth: 10,
    stories: 15,
    columns: 4,
    beams: true
  },
  OFFICE_BUILDING: {
    height: 30,
    width: 20,
    depth: 15,
    stories: 8,
    columns: 6,
    beams: true
  },
  RESIDENTIAL: {
    height: 15,
    width: 25,
    depth: 12,
    stories: 5,
    columns: 8,
    beams: true
  },
  SHEAR_WALL: {
    height: 25,
    width: 15,
    depth: 15,
    stories: 8,
    columns: 4,
    beams: true,
    shearWalls: true
  }
};

// Helper functions
export const createBuildingGeometry = (preset = BUILDING_PRESETS.SKYSCRAPER) => {
  // This would be implemented with actual Three.js code to generate building geometry
  // Simplified version just returns a sample geometry
  return new THREE.BoxGeometry(preset.width, preset.height, preset.depth);
};

export const applyEarthquakeAnimation = (object, options = ANIMATIONS.EARTHQUAKE) => {
  // This would contain the actual animation logic using Three.js
  // Simplified placeholder
  const originalPosition = object.position.clone();
  
  return {
    update: (time) => {
      const decay = Math.exp(-options.decay * time);
      const intensity = options.intensity * decay;
      
      object.position.x = originalPosition.x + Math.sin(time * options.frequency) * intensity;
      object.position.y = originalPosition.y + Math.cos(time * options.frequency * 1.5) * intensity * 0.5;
      object.rotation.z = Math.sin(time * options.frequency * 0.7) * intensity * 0.05;
    },
    reset: () => {
      object.position.copy(originalPosition);
      object.rotation.z = 0;
    }
  };
};

export default {
  CAMERAS,
  LIGHTS,
  MATERIALS,
  RENDERERS,
  ANIMATIONS,
  BUILDING_PRESETS,
  createBuildingGeometry,
  applyEarthquakeAnimation
}; 