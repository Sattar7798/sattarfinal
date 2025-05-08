/**
 * Three.js Scene Setup Utilities
 * 
 * This module provides utilities for setting up and configuring Three.js scenes
 * with a focus on structural engineering visualization needs.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import Stats from 'three/examples/jsm/libs/stats.module';

/**
 * Default scene configuration
 */
const defaultConfig = {
  // Camera settings
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [15, 15, 15],
    target: [0, 0, 0]
  },
  
  // Renderer settings
  renderer: {
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
    shadowMap: true,
    shadowMapType: THREE.PCFSoftShadowMap,
    outputEncoding: THREE.sRGBEncoding,
    physicallyCorrectLights: true
  },
  
  // Controls settings
  controls: {
    enabled: true,
    enableDamping: true,
    dampingFactor: 0.05,
    screenSpacePanning: true,
    minDistance: 1,
    maxDistance: 500,
    maxPolarAngle: Math.PI / 1.5,
    autoRotate: false,
    enableZoom: true,
    zoomSpeed: 1.0
  },
  
  // Scene settings
  scene: {
    background: 0xf0f0f0,
    fog: {
      enabled: false,
      color: 0xf0f0f0,
      near: 20,
      far: 100
    }
  },
  
  // Lighting settings
  lighting: {
    ambient: {
      enabled: true,
      color: 0xffffff,
      intensity: 0.4
    },
    directional: {
      enabled: true,
      color: 0xffffff,
      intensity: 0.8,
      position: [10, 20, 10],
      castShadow: true,
      shadowMapSize: 2048
    },
    hemisphere: {
      enabled: true,
      skyColor: 0xffffff,
      groundColor: 0x444444,
      intensity: 0.5
    },
    spotLights: []
  },
  
  // Grid and axes
  helpers: {
    grid: {
      enabled: true,
      size: 50,
      divisions: 50,
      color: 0x888888,
      colorCenterLine: 0x444444
    },
    axes: {
      enabled: false,
      size: 5
    }
  },
  
  // Post-processing
  postprocessing: {
    enabled: false,
    antialiasing: true,
    outlineHighlight: false
  },
  
  // Stats and debug info
  debug: {
    stats: false,
    axesHelper: false
  }
};

/**
 * Creates a complete Three.js scene setup
 * @param {HTMLElement} container DOM element to contain the canvas
 * @param {Object} config Configuration options
 * @returns {Object} Object containing scene, camera, renderer, and other components
 */
export function createScene(container, config = {}) {
  // Merge provided config with defaults
  const mergedConfig = mergeConfig(defaultConfig, config);
  
  // Get container dimensions
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Set scene background and fog
  const bgColor = new THREE.Color(mergedConfig.scene.background);
  scene.background = bgColor;
  
  if (mergedConfig.scene.fog.enabled) {
    const fogColor = new THREE.Color(mergedConfig.scene.fog.color);
    scene.fog = new THREE.Fog(
      fogColor,
      mergedConfig.scene.fog.near,
      mergedConfig.scene.fog.far
    );
  }
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    mergedConfig.camera.fov,
    width / height,
    mergedConfig.camera.near,
    mergedConfig.camera.far
  );
  
  // Set camera position
  camera.position.fromArray(mergedConfig.camera.position);
  camera.lookAt(new THREE.Vector3().fromArray(mergedConfig.camera.target));
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: mergedConfig.renderer.antialias,
    alpha: mergedConfig.renderer.alpha,
    preserveDrawingBuffer: mergedConfig.renderer.preserveDrawingBuffer
  });
  
  // Configure renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  if (mergedConfig.renderer.shadowMap) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = mergedConfig.renderer.shadowMapType;
  }
  
  if (mergedConfig.renderer.outputEncoding) {
    renderer.outputEncoding = mergedConfig.renderer.outputEncoding;
  }
  
  if (mergedConfig.renderer.physicallyCorrectLights) {
    renderer.physicallyCorrectLights = true;
  }
  
  // Append renderer to container
  container.appendChild(renderer.domElement);
  
  // Setup lighting
  const lights = setupLighting(scene, mergedConfig.lighting);
  
  // Setup helpers (grid, axes)
  const helpers = setupHelpers(scene, mergedConfig.helpers);
  
  // Setup controls
  let controls = null;
  if (mergedConfig.controls.enabled) {
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Apply controls settings
    Object.keys(mergedConfig.controls).forEach(key => {
      if (key !== 'enabled' && key in controls) {
        controls[key] = mergedConfig.controls[key];
      }
    });
    
    controls.update();
  }
  
  // Setup post-processing
  let composer = null;
  let outlinePass = null;
  
  if (mergedConfig.postprocessing.enabled) {
    composer = setupPostProcessing(
      renderer,
      scene,
      camera,
      mergedConfig.postprocessing
    );
    
    // Store outline pass for highlight functionality
    if (mergedConfig.postprocessing.outlineHighlight) {
      outlinePass = composer.passes.find(pass => pass instanceof OutlinePass);
    }
  }
  
  // Setup stats
  let stats = null;
  if (mergedConfig.debug.stats) {
    stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    container.appendChild(stats.dom);
  }
  
  // Setup resize handler
  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    
    if (composer) {
      composer.setSize(width, height);
      
      // Update FXAA shader uniforms
      const fxaaPass = composer.passes.find(
        pass => pass.material && pass.material.uniforms.resolution
      );
      
      if (fxaaPass) {
        const pixelRatio = renderer.getPixelRatio();
        fxaaPass.material.uniforms.resolution.value.x = 1 / (width * pixelRatio);
        fxaaPass.material.uniforms.resolution.value.y = 1 / (height * pixelRatio);
      }
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // Store animation frame ID for cleanup
  let animationFrameId = null;
  
  // Animation loop function
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    
    if (controls && controls.enabled && controls.enableDamping) {
      controls.update();
    }
    
    if (stats) {
      stats.update();
    }
    
    // Render scene
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };
  
  // Methods for scene manipulation
  const methods = {
    // Start animation loop
    start: () => {
      if (!animationFrameId) {
        animate();
      }
      return methods;
    },
    
    // Stop animation loop
    stop: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      return methods;
    },
    
    // Highlight object with outline
    highlightObject: (object) => {
      if (outlinePass) {
        outlinePass.selectedObjects = [object];
      }
      return methods;
    },
    
    // Clear highlight
    clearHighlight: () => {
      if (outlinePass) {
        outlinePass.selectedObjects = [];
      }
      return methods;
    },
    
    // Add object to scene
    add: (object) => {
      scene.add(object);
      return methods;
    },
    
    // Remove object from scene
    remove: (object) => {
      scene.remove(object);
      return methods;
    },
    
    // Set camera position
    setCameraPosition: (x, y, z) => {
      camera.position.set(x, y, z);
      return methods;
    },
    
    // Set camera target
    setCameraTarget: (x, y, z) => {
      if (controls) {
        controls.target.set(x, y, z);
        controls.update();
      }
      camera.lookAt(x, y, z);
      return methods;
    },
    
    // Reset camera position and target
    resetCamera: () => {
      camera.position.fromArray(mergedConfig.camera.position);
      
      if (controls) {
        controls.target.fromArray(mergedConfig.camera.target);
        controls.update();
      }
      
      camera.lookAt(new THREE.Vector3().fromArray(mergedConfig.camera.target));
      return methods;
    },
    
    // Take screenshot
    takeScreenshot: (width, height) => {
      // Save current size
      const currentWidth = renderer.domElement.width;
      const currentHeight = renderer.domElement.height;
      const currentRatio = renderer.getPixelRatio();
      
      // Resize renderer if custom dimensions provided
      if (width && height) {
        renderer.setSize(width, height);
      }
      
      // Render scene
      renderer.setPixelRatio(1);
      renderer.render(scene, camera);
      
      // Get image data
      const dataURL = renderer.domElement.toDataURL('image/png');
      
      // Restore original size
      renderer.setSize(currentWidth, currentHeight);
      renderer.setPixelRatio(currentRatio);
      renderer.render(scene, camera);
      
      return dataURL;
    },
    
    // Get a single frame render
    render: () => {
      renderer.render(scene, camera);
      return methods;
    },
    
    // Dispose and clean up resources
    dispose: () => {
      // Stop animation if running
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Dispose controls
      if (controls) {
        controls.dispose();
      }
      
      // Remove stats if present
      if (stats && stats.dom && stats.dom.parentElement) {
        stats.dom.parentElement.removeChild(stats.dom);
      }
      
      // Dispose renderer
      renderer.dispose();
      
      // Dispose all scene objects
      disposeSceneObjects(scene);
      
      // Remove renderer from container
      if (container && renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    }
  };
  
  // Return all created components
  return {
    scene,
    camera,
    renderer,
    controls,
    composer,
    lights,
    helpers,
    container,
    stats,
    config: mergedConfig,
    ...methods
  };
}

/**
 * Sets up scene lighting based on config
 * @param {THREE.Scene} scene Scene to add lights to
 * @param {Object} config Lighting configuration
 * @returns {Object} Object containing created lights
 */
function setupLighting(scene, config) {
  const lights = {};
  
  // Ambient light
  if (config.ambient.enabled) {
    const ambientLight = new THREE.AmbientLight(
      config.ambient.color,
      config.ambient.intensity
    );
    scene.add(ambientLight);
    lights.ambient = ambientLight;
  }
  
  // Directional light
  if (config.directional.enabled) {
    const directionalLight = new THREE.DirectionalLight(
      config.directional.color,
      config.directional.intensity
    );
    
    directionalLight.position.fromArray(config.directional.position);
    
    if (config.directional.castShadow) {
      directionalLight.castShadow = true;
      
      // Configure shadow properties
      const d = 50;
      directionalLight.shadow.camera.left = -d;
      directionalLight.shadow.camera.right = d;
      directionalLight.shadow.camera.top = d;
      directionalLight.shadow.camera.bottom = -d;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      
      // Shadow map size
      const size = config.directional.shadowMapSize;
      directionalLight.shadow.mapSize.width = size;
      directionalLight.shadow.mapSize.height = size;
    }
    
    scene.add(directionalLight);
    lights.directional = directionalLight;
  }
  
  // Hemisphere light
  if (config.hemisphere.enabled) {
    const hemisphereLight = new THREE.HemisphereLight(
      config.hemisphere.skyColor,
      config.hemisphere.groundColor,
      config.hemisphere.intensity
    );
    
    scene.add(hemisphereLight);
    lights.hemisphere = hemisphereLight;
  }
  
  // Spot lights
  if (config.spotLights && config.spotLights.length > 0) {
    lights.spotLights = [];
    
    config.spotLights.forEach((spotConfig, index) => {
      if (!spotConfig.enabled) return;
      
      const spotLight = new THREE.SpotLight(
        spotConfig.color,
        spotConfig.intensity,
        spotConfig.distance,
        spotConfig.angle,
        spotConfig.penumbra,
        spotConfig.decay
      );
      
      spotLight.position.fromArray(spotConfig.position);
      
      if (spotConfig.target) {
        const targetObject = new THREE.Object3D();
        targetObject.position.fromArray(spotConfig.target);
        scene.add(targetObject);
        spotLight.target = targetObject;
      }
      
      if (spotConfig.castShadow) {
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = spotConfig.shadowMapSize || 1024;
        spotLight.shadow.mapSize.height = spotConfig.shadowMapSize || 1024;
      }
      
      scene.add(spotLight);
      lights.spotLights.push(spotLight);
    });
  }
  
  return lights;
}

/**
 * Sets up scene helpers based on config
 * @param {THREE.Scene} scene Scene to add helpers to
 * @param {Object} config Helpers configuration
 * @returns {Object} Object containing created helpers
 */
function setupHelpers(scene, config) {
  const helpers = {};
  
  // Grid helper
  if (config.grid.enabled) {
    const gridHelper = new THREE.GridHelper(
      config.grid.size,
      config.grid.divisions,
      config.grid.colorCenterLine,
      config.grid.color
    );
    
    gridHelper.position.y = -0.01; // Slight offset to prevent z-fighting
    scene.add(gridHelper);
    helpers.grid = gridHelper;
  }
  
  // Axes helper
  if (config.axes.enabled) {
    const axesHelper = new THREE.AxesHelper(config.axes.size);
    scene.add(axesHelper);
    helpers.axes = axesHelper;
  }
  
  return helpers;
}

/**
 * Sets up post-processing effects
 * @param {THREE.WebGLRenderer} renderer The renderer
 * @param {THREE.Scene} scene The scene
 * @param {THREE.Camera} camera The camera
 * @param {Object} config Post-processing configuration
 * @returns {EffectComposer} The configured effect composer
 */
function setupPostProcessing(renderer, scene, camera, config) {
  // Create composer
  const composer = new EffectComposer(renderer);
  
  // Add render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  // Add outline pass if enabled
  if (config.outlineHighlight) {
    const resolution = new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );
    
    const outlinePass = new OutlinePass(resolution, scene, camera);
    outlinePass.edgeStrength = 3.0;
    outlinePass.edgeGlow = 0.5;
    outlinePass.edgeThickness = 1.0;
    outlinePass.pulsePeriod = 0;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');
    
    composer.addPass(outlinePass);
  }
  
  // Add FXAA anti-aliasing pass if enabled
  if (config.antialiasing) {
    const pixelRatio = renderer.getPixelRatio();
    
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * pixelRatio);
    
    composer.addPass(fxaaPass);
  }
  
  return composer;
}

/**
 * Merges configuration objects
 * @param {Object} defaultConfig Default configuration object
 * @param {Object} userConfig User-provided configuration
 * @returns {Object} Merged configuration
 */
function mergeConfig(defaultConfig, userConfig) {
  // Deep clone default config to avoid mutation
  const result = JSON.parse(JSON.stringify(defaultConfig));
  
  // Recursively merge user config into default config
  if (userConfig) {
    Object.entries(userConfig).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && key in result) {
        result[key] = mergeConfig(result[key], value);
      } else {
        result[key] = value;
      }
    });
  }
  
  return result;
}

/**
 * Recursively disposes all scene objects
 * @param {THREE.Scene} scene Scene to dispose
 */
function disposeSceneObjects(scene) {
  scene.traverse((object) => {
    // Dispose geometries
    if (object.geometry) {
      object.geometry.dispose();
    }
    
    // Dispose materials
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => disposeMaterial(material));
      } else {
        disposeMaterial(object.material);
      }
    }
  });
}

/**
 * Disposes a material and its textures
 * @param {THREE.Material} material Material to dispose
 */
function disposeMaterial(material) {
  // Dispose textures
  Object.values(material).forEach(value => {
    if (value && typeof value === 'object' && 'isTexture' in value) {
      value.dispose();
    }
  });
  
  material.dispose();
}

/**
 * Creates a basic scene with minimal configuration
 * @param {HTMLElement} container DOM element to contain the canvas
 * @returns {Object} Scene setup object
 */
export function createBasicScene(container) {
  return createScene(container, {
    controls: {
      enableDamping: true
    }
  });
}

/**
 * Creates a high-quality scene for rendering
 * @param {HTMLElement} container DOM element to contain the canvas
 * @returns {Object} Scene setup object
 */
export function createHighQualityScene(container) {
  return createScene(container, {
    renderer: {
      antialias: true,
      shadowMap: true,
      shadowMapType: THREE.PCFSoftShadowMap,
      physicallyCorrectLights: true
    },
    lighting: {
      ambient: {
        intensity: 0.3
      },
      directional: {
        intensity: 1.0,
        castShadow: true,
        shadowMapSize: 4096
      },
      hemisphere: {
        intensity: 0.7
      }
    }
  });
}

/**
 * Creates a scene specifically optimized for structural analysis visualization
 * @param {HTMLElement} container DOM element to contain the canvas
 * @returns {Object} Scene setup object
 */
export function createStructuralVisualizationScene(container) {
  return createScene(container, {
    camera: {
      position: [20, 15, 20]
    },
    scene: {
      background: 0xf5f5f5
    },
    lighting: {
      ambient: {
        intensity: 0.5
      },
      directional: {
        position: [15, 25, 15],
        castShadow: true
      },
      spotLights: [
        {
          enabled: true,
          color: 0xffffff,
          intensity: 0.6,
          position: [-10, 20, 10],
          angle: Math.PI / 6,
          penumbra: 0.3,
          castShadow: true,
          shadowMapSize: 1024
        }
      ]
    },
    helpers: {
      grid: {
        size: 20,
        divisions: 20
      }
    }
  });
}

/**
 * Create a TransformControls instance for manipulating objects
 * @param {THREE.Camera} camera The camera
 * @param {HTMLElement} domElement The renderer's DOM element
 * @param {THREE.Object3D} object Optional initial target object
 * @returns {TransformControls} Transform controls instance
 */
export function createTransformControls(camera, domElement, object = null) {
  const controls = new TransformControls(camera, domElement);
  
  if (object) {
    controls.attach(object);
  }
  
  // Configure basic settings
  controls.setSize(0.8);
  controls.setMode('translate'); // 'translate', 'rotate', or 'scale'
  
  return controls;
}

/**
 * Create a scene with clipping planes for section cuts
 * @param {HTMLElement} container DOM element to contain the canvas
 * @returns {Object} Scene setup with clipping plane support
 */
export function createSectionCutScene(container) {
  const sceneSetup = createScene(container, {
    renderer: {
      localClippingEnabled: true
    }
  });
  
  // Create a clipping plane
  const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  
  // Add clipping plane helper
  const planeHelper = new THREE.PlaneHelper(clippingPlane, 20, 0xff0000);
  planeHelper.visible = false;
  sceneSetup.scene.add(planeHelper);
  
  // Add section cut methods
  const sectionCutMethods = {
    // Enable section cut with plane
    enableSectionCut: (normal, constant) => {
      if (normal) {
        clippingPlane.normal.copy(normal);
      }
      
      if (constant !== undefined) {
        clippingPlane.constant = constant;
      }
      
      planeHelper.visible = true;
      
      // Apply clipping plane to all materials
      sceneSetup.scene.traverse((node) => {
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(mat => {
              mat.clippingPlanes = [clippingPlane];
              mat.needsUpdate = true;
            });
          } else {
            node.material.clippingPlanes = [clippingPlane];
            node.material.needsUpdate = true;
          }
        }
      });
      
      return sceneSetup;
    },
    
    // Disable section cut
    disableSectionCut: () => {
      planeHelper.visible = false;
      
      // Remove clipping plane from all materials
      sceneSetup.scene.traverse((node) => {
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(mat => {
              mat.clippingPlanes = [];
              mat.needsUpdate = true;
            });
          } else {
            node.material.clippingPlanes = [];
            node.material.needsUpdate = true;
          }
        }
      });
      
      return sceneSetup;
    },
    
    // Get clipping plane
    getClippingPlane: () => clippingPlane,
    
    // Get plane helper
    getPlaneHelper: () => planeHelper,
    
    // Update clipping plane and helper
    updateSectionCut: (params = {}) => {
      const { normal, constant, visible } = params;
      
      if (normal) {
        clippingPlane.normal.copy(normal);
      }
      
      if (constant !== undefined) {
        clippingPlane.constant = constant;
      }
      
      if (visible !== undefined) {
        planeHelper.visible = visible;
      }
      
      return sceneSetup;
    }
  };
  
  // Return enhanced scene setup
  return {
    ...sceneSetup,
    ...sectionCutMethods
  };
}

export default {
  createScene,
  createBasicScene,
  createHighQualityScene,
  createStructuralVisualizationScene,
  createTransformControls,
  createSectionCutScene
}; 