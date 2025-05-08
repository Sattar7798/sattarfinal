import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

/**
 * ThreeScene - Base component for all 3D visualizations
 * Provides a configurable Three.js scene, camera, renderer, and basic controls
 * Serves as the foundation for more complex 3D visualizations throughout the application
 */
const ThreeScene = ({
  width = '100%',
  height = '500px',
  backgroundColor = '#f0f0f0',
  cameraPosition = [5, 5, 10],
  cameraFov = 45,
  enableStats = false,
  enableShadows = true,
  enableControls = true,
  controlsConfig = {},
  enableGrid = true,
  enableAxes = false,
  gridConfig = {},
  antialias = true,
  children = null,
  onSceneCreated = () => {},
  onBeforeRender = () => {},
  onAfterRender = () => {},
}) => {
  // References
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const lightsRef = useRef([]);
  const statsRef = useRef(null);
  const frameIdRef = useRef(null);
  
  // State for dimensions to trigger resizing
  const [dimensions, setDimensions] = useState({
    width: typeof width === 'number' ? width : '100%',
    height: typeof height === 'number' ? height : '500px'
  });
  
  // Initialize scene on component mount
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene and renderer
    const { scene, camera, renderer, controls, stats } = initThreeJS();
    
    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    statsRef.current = stats;
    
    // Setup basic scene components
    setupScene(scene);
    
    // Expose scene to parent component
    onSceneCreated({
      scene,
      camera,
      renderer,
      controls,
      container: containerRef.current
    });
    
    // Start render loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Call before render hook
      onBeforeRender({
        scene,
        camera,
        renderer,
        controls,
        delta: 0, // In a more complex setup, we'd calculate actual delta time
        time: performance.now() / 1000
      });
      
      // Update controls if enabled
      if (controls) {
        controls.update();
      }
      
      // Render scene
      renderer.render(scene, camera);
      
      // Update stats if enabled
      if (stats) {
        stats.update();
      }
      
      // Call after render hook
      onAfterRender({
        scene,
        camera,
        renderer,
        controls,
        delta: 0,
        time: performance.now() / 1000
      });
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      // Dispose renderer and controls
      if (renderer) {
        renderer.dispose();
        
        // Remove canvas from container
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      
      if (controls) {
        controls.dispose();
      }
      
      // Dispose all scene resources
      if (scene) {
        disposeSceneResources(scene);
      }
      
      // Remove stats if present
      if (stats && stats.dom && containerRef.current) {
        containerRef.current.removeChild(stats.dom);
      }
    };
  }, []);
  
  // Update dimensions if width or height props change
  useEffect(() => {
    setDimensions({
      width: typeof width === 'number' ? width : '100%',
      height: typeof height === 'number' ? height : '500px'
    });
    
    // Trigger resize handler to update canvas size
    if (cameraRef.current && rendererRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    }
  }, [width, height]);
  
  // Initialize Three.js components
  const initThreeJS = () => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(cameraFov, width / height, 0.1, 1000);
    camera.position.fromArray(cameraPosition);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: antialias,
      alpha: backgroundColor.toLowerCase().includes('transparent')
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadows
    if (enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    // Append renderer to container
    container.appendChild(renderer.domElement);
    
    // Create controls if enabled
    let controls = null;
    if (enableControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Apply custom controls configuration
      Object.keys(controlsConfig).forEach(key => {
        controls[key] = controlsConfig[key];
      });
    }
    
    // Create stats if enabled
    let stats = null;
    if (enableStats) {
      stats = Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0px';
      container.appendChild(stats.dom);
    }
    
    return { scene, camera, renderer, controls, stats };
  };
  
  // Setup basic scene components (lights, grid, axes)
  const setupScene = (scene) => {
    // Add default lighting
    addDefaultLighting(scene);
    
    // Add grid helper if enabled
    if (enableGrid) {
      const {
        size = 20,
        divisions = 20,
        colorCenterLine = 0x444444,
        colorGrid = 0x888888
      } = gridConfig;
      
      const grid = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
      grid.position.y = 0;
      grid.name = 'gridHelper';
      scene.add(grid);
    }
    
    // Add axes helper if enabled
    if (enableAxes) {
      const axesSize = gridConfig?.size || 5;
      const axes = new THREE.AxesHelper(axesSize);
      axes.name = 'axesHelper';
      scene.add(axes);
    }
  };
  
  // Add default lighting setup
  const addDefaultLighting = (scene) => {
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
    
    // Create directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.name = 'directionalLight';
    
    // Enable shadows
    if (enableShadows) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 50;
      dirLight.shadow.camera.left = -15;
      dirLight.shadow.camera.right = 15;
      dirLight.shadow.camera.top = 15;
      dirLight.shadow.camera.bottom = -15;
    }
    
    scene.add(dirLight);
    
    // Store lights reference
    lightsRef.current = [ambientLight, dirLight];
  };
  
  // Cleanup and dispose of scene resources
  const disposeSceneResources = (scene) => {
    scene.traverse(object => {
      // Dispose geometry
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      // Dispose material(s)
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => disposeMaterial(material));
        } else {
          disposeMaterial(object.material);
        }
      }
    });
  };
  
  // Dispose a material and its textures
  const disposeMaterial = (material) => {
    // Dispose all textures
    for (const key in material) {
      const value = material[key];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        value.dispose();
      }
    }
    material.dispose();
  };
  
  // Public API methods that can be called via refs
  
  // Add object to scene
  const addToScene = (object) => {
    if (sceneRef.current) {
      sceneRef.current.add(object);
      return true;
    }
    return false;
  };
  
  // Remove object from scene
  const removeFromScene = (object) => {
    if (sceneRef.current) {
      sceneRef.current.remove(object);
      return true;
    }
    return false;
  };
  
  // Set camera position
  const setCameraPosition = (x, y, z) => {
    if (cameraRef.current) {
      cameraRef.current.position.set(x, y, z);
      return true;
    }
    return false;
  };
  
  // Set camera target (look at point)
  const setCameraTarget = (x, y, z) => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(x, y, z);
      return true;
    }
    return false;
  };
  
  // Load a GLTF model
  const loadGLTFModel = (url, onProgress, onError) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      
      loader.load(
        url,
        (gltf) => {
          if (sceneRef.current) {
            // Add model to scene
            sceneRef.current.add(gltf.scene);
            resolve(gltf);
          } else {
            reject(new Error('Scene not initialized'));
          }
        },
        onProgress,
        (error) => {
          if (onError) onError(error);
          reject(error);
        }
      );
    });
  };
  
  // Capture screenshot of current view
  const captureScreenshot = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Get data URL
      return rendererRef.current.domElement.toDataURL('image/png');
    }
    return null;
  };
  
  // Reset camera and controls to default state
  const resetCameraView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.fromArray(cameraPosition);
      cameraRef.current.lookAt(0, 0, 0);
      
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
      
      return true;
    }
    return false;
  };
  
  // Expose the public API
  React.useImperativeHandle(
    ref,
    () => ({
      scene: sceneRef.current,
      camera: cameraRef.current,
      renderer: rendererRef.current,
      controls: controlsRef.current,
      addToScene,
      removeFromScene,
      setCameraPosition,
      setCameraTarget,
      loadGLTFModel,
      captureScreenshot,
      resetCameraView
    }),
    [sceneRef.current, cameraRef.current, rendererRef.current, controlsRef.current]
  );
  
  return (
    <div 
      ref={containerRef}
      className="three-scene-container"
      style={{ 
        width: dimensions.width, 
        height: dimensions.height, 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Children can be UI overlays or controls */}
      {children}
    </div>
  );
};

export default ThreeScene; 