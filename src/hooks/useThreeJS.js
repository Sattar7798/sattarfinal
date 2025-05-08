import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Custom hook for setting up and managing a Three.js scene within a React component
 * 
 * @param {Object} options Configuration options for the Three.js scene
 * @param {boolean} options.orbitControls Whether to use OrbitControls
 * @param {Object} options.camera Camera settings (perspective or orthographic)
 * @param {string} options.clearColor Background color of the scene
 * @param {boolean} options.alpha Whether the canvas background is transparent
 * @param {boolean} options.antialias Whether to enable antialiasing
 * @param {boolean} options.shadows Whether to enable shadows
 * @param {Object} options.lights Configuration for scene lighting
 * @param {Function} options.onSetup Callback function when scene is set up
 * @param {Function} options.onAnimate Callback function for animation loop
 * @param {Function} options.onResize Callback for window resize events
 * @returns {Object} Scene objects and utility functions
 */
const useThreeJS = ({
  orbitControls = false,
  camera = {
    type: 'perspective',
    fov: 75,
    position: [0, 0, 5],
    near: 0.1,
    far: 1000,
  },
  clearColor = 0x000000,
  alpha = false,
  antialias = true,
  shadows = false,
  lights = {
    ambient: { enabled: true, color: 0xffffff, intensity: 0.5 },
    directional: { enabled: false, color: 0xffffff, intensity: 1.0, position: [1, 1, 1], castShadow: true },
    point: { enabled: false, color: 0xffffff, intensity: 1.0, position: [0, 3, 0], castShadow: true },
    spot: { enabled: false, color: 0xffffff, intensity: 1.0, position: [0, 3, 0], castShadow: true },
  },
  onSetup = null,
  onAnimate = null,
  onResize = null,
} = {}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const requestRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Get container dimensions
      const { clientWidth: width, clientHeight: height } = containerRef.current;

      // Create scene
      const scene = new THREE.Scene();

      // Create camera
      let threeCamera;
      if (camera.type === 'perspective') {
        threeCamera = new THREE.PerspectiveCamera(
          camera.fov || 75,
          width / height,
          camera.near || 0.1,
          camera.far || 1000
        );
      } else if (camera.type === 'orthographic') {
        const frustrumSize = camera.frustumSize || 10;
        const aspect = width / height;
        threeCamera = new THREE.OrthographicCamera(
          -frustrumSize * aspect / 2,
          frustrumSize * aspect / 2,
          frustrumSize / 2,
          -frustrumSize / 2,
          camera.near || 0.1,
          camera.far || 1000
        );
      }

      // Set camera position
      if (camera.position) {
        threeCamera.position.set(...camera.position);
      }

      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        antialias,
        alpha,
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      if (!alpha) {
        renderer.setClearColor(clearColor);
      }

      // Configure shadows
      if (shadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      // Add renderer to DOM
      containerRef.current.appendChild(renderer.domElement);

      // Add lights
      if (lights.ambient && lights.ambient.enabled) {
        const ambientLight = new THREE.AmbientLight(lights.ambient.color, lights.ambient.intensity);
        scene.add(ambientLight);
      }

      if (lights.directional && lights.directional.enabled) {
        const directionalLight = new THREE.DirectionalLight(lights.directional.color, lights.directional.intensity);
        directionalLight.position.set(...lights.directional.position);
        
        if (shadows && lights.directional.castShadow) {
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 1024;
          directionalLight.shadow.mapSize.height = 1024;
          directionalLight.shadow.camera.near = 0.5;
          directionalLight.shadow.camera.far = 50;
          directionalLight.shadow.camera.left = -10;
          directionalLight.shadow.camera.right = 10;
          directionalLight.shadow.camera.top = 10;
          directionalLight.shadow.camera.bottom = -10;
        }
        
        scene.add(directionalLight);
      }

      if (lights.point && lights.point.enabled) {
        const pointLight = new THREE.PointLight(lights.point.color, lights.point.intensity);
        pointLight.position.set(...lights.point.position);
        
        if (shadows && lights.point.castShadow) {
          pointLight.castShadow = true;
          pointLight.shadow.mapSize.width = 1024;
          pointLight.shadow.mapSize.height = 1024;
        }
        
        scene.add(pointLight);
      }

      if (lights.spot && lights.spot.enabled) {
        const spotLight = new THREE.SpotLight(lights.spot.color, lights.spot.intensity);
        spotLight.position.set(...lights.spot.position);
        spotLight.angle = lights.spot.angle || Math.PI / 4;
        spotLight.penumbra = lights.spot.penumbra || 0.1;
        
        if (shadows && lights.spot.castShadow) {
          spotLight.castShadow = true;
          spotLight.shadow.mapSize.width = 1024;
          spotLight.shadow.mapSize.height = 1024;
        }
        
        scene.add(spotLight);
      }

      // Add orbit controls
      let controls = null;
      if (orbitControls) {
        controls = new OrbitControls(threeCamera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        if (camera.orbitTarget) {
          controls.target.set(...camera.orbitTarget);
        }
      }

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        const { clientWidth: width, clientHeight: height } = containerRef.current;
        
        // Update camera
        if (threeCamera.isPerspectiveCamera) {
          threeCamera.aspect = width / height;
        } else if (threeCamera.isOrthographicCamera) {
          const frustrumSize = camera.frustumSize || 10;
          const aspect = width / height;
          threeCamera.left = -frustrumSize * aspect / 2;
          threeCamera.right = frustrumSize * aspect / 2;
          threeCamera.top = frustrumSize / 2;
          threeCamera.bottom = -frustrumSize / 2;
        }
        
        threeCamera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(width, height);
        
        // Call custom resize handler
        if (onResize) {
          onResize({
            width,
            height,
            aspect: width / height,
            scene,
            camera: threeCamera,
            renderer,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        requestRef.current = requestAnimationFrame(animate);
        
        if (controls) {
          controls.update();
        }
        
        if (onAnimate) {
          onAnimate({
            scene,
            camera: threeCamera,
            renderer,
            controls,
            time: performance.now() / 1000,
          });
        }
        
        renderer.render(scene, threeCamera);
      };

      // Store scene objects
      const sceneObjects = {
        scene,
        camera: threeCamera,
        renderer,
        controls,
        dispose: () => {
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }

          window.removeEventListener('resize', handleResize);
          
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
          }
          
          // Dispose scene resources
          scene.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  disposeMaterial(material);
                });
              } else {
                disposeMaterial(object.material);
              }
            }
          });
          
          renderer.dispose();
          
          if (controls) {
            controls.dispose();
          }
        },
      };

      // Store scene reference
      sceneRef.current = sceneObjects;
      
      // Run setup callback
      if (onSetup) {
        onSetup(sceneObjects);
      }
      
      // Set initialized
      setInitialized(true);
      
      // Start animation loop
      animate();
      
      // Cleanup function
      return () => {
        if (sceneRef.current) {
          sceneRef.current.dispose();
        }
      };
    } catch (err) {
      console.error('Error initializing Three.js scene:', err);
      setError(err.message);
    }
  }, []); // Empty dependency array to only run once

  // Helper to dispose material textures and maps
  const disposeMaterial = (material) => {
    // Dispose any maps/textures
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        value.dispose();
      }
    }
    
    material.dispose();
  };
  
  // Add or remove objects from the scene
  const addToScene = (object) => {
    if (sceneRef.current && sceneRef.current.scene) {
      sceneRef.current.scene.add(object);
    }
  };
  
  const removeFromScene = (object) => {
    if (sceneRef.current && sceneRef.current.scene) {
      sceneRef.current.scene.remove(object);
    }
  };
  
  // Create a raycaster for mouse interaction
  const createRaycaster = (mouseX, mouseY) => {
    if (!sceneRef.current || !containerRef.current) return null;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const { camera } = sceneRef.current;
    
    const normalizedX = (mouseX / width) * 2 - 1;
    const normalizedY = -(mouseY / height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(normalizedX, normalizedY);
    
    raycaster.setFromCamera(mouseVector, camera);
    
    return raycaster;
  };
  
  // Find intersections with a raycaster
  const findIntersections = (raycaster, objects) => {
    if (!raycaster) return [];
    
    return raycaster.intersectObjects(objects, true);
  };

  return {
    containerRef,
    scene: sceneRef.current?.scene,
    camera: sceneRef.current?.camera,
    renderer: sceneRef.current?.renderer,
    controls: sceneRef.current?.controls,
    initialized,
    error,
    addToScene,
    removeFromScene,
    createRaycaster,
    findIntersections,
  };
};

export default useThreeJS; 