import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// Types
export interface SceneSetupOptions {
  // Canvas and rendering
  canvas?: HTMLCanvasElement;
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  
  // Camera settings
  cameraType?: 'perspective' | 'orthographic';
  fov?: number;
  near?: number;
  far?: number;
  position?: THREE.Vector3 | [number, number, number];
  target?: THREE.Vector3 | [number, number, number];
  
  // Controls
  enableControls?: boolean;
  controlsConfig?: {
    enableDamping?: boolean;
    dampingFactor?: number;
    minDistance?: number;
    maxDistance?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
    enablePan?: boolean;
    enableZoom?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
  };
  
  // Environment & background
  backgroundColor?: THREE.Color | string | number;
  fogEnabled?: boolean;
  fogColor?: THREE.Color | string | number;
  fogDensity?: number;
  
  // Lighting
  addLights?: boolean;
  lightSetup?: 'basic' | 'studio' | 'outdoor' | 'dramatic';
  ambientLightIntensity?: number;
  ambientLightColor?: THREE.Color | string | number;
  
  // Helpers
  gridHelper?: boolean;
  gridSize?: number;
  gridDivisions?: number;
  axesHelper?: boolean;
  axesSize?: number;
  
  // Post-processing
  enablePostprocessing?: boolean;
  bloom?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  ssao?: boolean;
  ssaoRadius?: number;
  ssaoIntensity?: number;
  outline?: boolean;
  outlineColor?: THREE.Color | string | number;
  outlineThickness?: number;
  
  // Shadows
  shadows?: boolean;
  shadowMapSize?: number;
}

export interface SceneSetupResult {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls?: OrbitControls;
  composer?: EffectComposer;
  outlinePass?: OutlinePass;
  lights: THREE.Light[];
  helpers: THREE.Object3D[];
  clock: THREE.Clock;
  resizeListener: () => void;
  
  // Methods
  render: () => void;
  update: (delta: number) => void;
  dispose: () => void;
  selectObject: (object: THREE.Object3D | null) => void;
  setBackgroundColor: (color: THREE.Color | string | number) => void;
  toggleHelper: (helperType: 'grid' | 'axes', visible: boolean) => void;
  setCameraPosition: (position: THREE.Vector3 | [number, number, number]) => void;
  setCameraTarget: (target: THREE.Vector3 | [number, number, number]) => void;
  
  // Utility for adding elements to the scene
  add: (object: THREE.Object3D) => void;
  remove: (object: THREE.Object3D) => void;
  getMeshByName: (name: string) => THREE.Mesh | null;
}

/**
 * Creates and sets up a complete Three.js scene with standard configurations
 * @param options Configuration options for the scene
 * @returns Object containing scene, camera, renderer, and utility functions
 */
export function setupScene(options: SceneSetupOptions = {}): SceneSetupResult {
  // Extract options with defaults
  const {
    // Canvas and rendering
    canvas = document.createElement('canvas'),
    antialias = true,
    alpha = false,
    preserveDrawingBuffer = false,
    
    // Camera settings
    cameraType = 'perspective',
    fov = 75,
    near = 0.1,
    far = 1000,
    position = [5, 5, 5],
    target = [0, 0, 0],
    
    // Controls
    enableControls = true,
    controlsConfig = {},
    
    // Environment & background
    backgroundColor = 0xf0f0f0,
    fogEnabled = false,
    fogColor = 0xcccccc,
    fogDensity = 0.02,
    
    // Lighting
    addLights = true,
    lightSetup = 'basic',
    ambientLightIntensity = 0.5,
    ambientLightColor = 0xffffff,
    
    // Helpers
    gridHelper = false,
    gridSize = 10,
    gridDivisions = 10,
    axesHelper = false,
    axesSize = 5,
    
    // Post-processing
    enablePostprocessing = false,
    bloom = false,
    bloomStrength = 1.5,
    bloomRadius = 0,
    bloomThreshold = 0.85,
    ssao = false,
    ssaoRadius = 16,
    ssaoIntensity = 1.5,
    outline = false,
    outlineColor = 0xff0000,
    outlineThickness = 4,
    
    // Shadows
    shadows = true,
    shadowMapSize = 2048,
  } = options;
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Set background color
  if (backgroundColor !== null) {
    scene.background = new THREE.Color(backgroundColor);
  }
  
  // Setup fog if enabled
  if (fogEnabled) {
    scene.fog = new THREE.FogExp2(
      new THREE.Color(fogColor),
      fogDensity
    );
  }
  
  // Create camera
  let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  
  if (cameraType === 'orthographic') {
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
      -5 * aspect, 5 * aspect, 5, -5, near, far
    );
  } else {
    camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      near,
      far
    );
  }
  
  // Set camera position
  if (Array.isArray(position)) {
    camera.position.set(position[0], position[1], position[2]);
  } else {
    camera.position.copy(position);
  }
  
  // Look at target
  if (Array.isArray(target)) {
    camera.lookAt(new THREE.Vector3(target[0], target[1], target[2]));
  } else {
    camera.lookAt(target);
  }
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias,
    alpha,
    preserveDrawingBuffer
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Setup shadows
  if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  // Create clock
  const clock = new THREE.Clock();
  
  // Create controls if enabled
  let controls: OrbitControls | undefined;
  
  if (enableControls) {
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Apply control configuration
    const {
      enableDamping = true,
      dampingFactor = 0.05,
      minDistance = 1,
      maxDistance = 100,
      minPolarAngle = 0,
      maxPolarAngle = Math.PI,
      enablePan = true,
      enableZoom = true,
      autoRotate = false,
      autoRotateSpeed = 2.0
    } = controlsConfig;
    
    controls.enableDamping = enableDamping;
    controls.dampingFactor = dampingFactor;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.minPolarAngle = minPolarAngle;
    controls.maxPolarAngle = maxPolarAngle;
    controls.enablePan = enablePan;
    controls.enableZoom = enableZoom;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    
    // Set target
    if (Array.isArray(target)) {
      controls.target.set(target[0], target[1], target[2]);
    } else {
      controls.target.copy(target);
    }
  }
  
  // Arrays to store lights and helpers
  const lights: THREE.Light[] = [];
  const helpers: THREE.Object3D[] = [];
  
  // Add lighting if requested
  if (addLights) {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      ambientLightColor,
      ambientLightIntensity
    );
    scene.add(ambientLight);
    lights.push(ambientLight);
    
    // Add different light setups based on configuration
    switch (lightSetup) {
      case 'studio': {
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = shadows;
        setupShadowCamera(keyLight, shadowMapSize);
        scene.add(keyLight);
        lights.push(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 3, 0);
        scene.add(fillLight);
        lights.push(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
        rimLight.position.set(0, 2, -5);
        scene.add(rimLight);
        lights.push(rimLight);
        break;
      }
      
      case 'outdoor': {
        // Sun light
        const sunLight = new THREE.DirectionalLight(0xfffaf0, 1);
        sunLight.position.set(3, 10, 4);
        sunLight.castShadow = shadows;
        setupShadowCamera(sunLight, shadowMapSize);
        scene.add(sunLight);
        lights.push(sunLight);
        
        // Skylight (ambient)
        const skyLight = new THREE.HemisphereLight(0x87ceeb, 0x8d8f91, 0.5);
        scene.add(skyLight);
        lights.push(skyLight);
        break;
      }
      
      case 'dramatic': {
        // Strong main light
        const mainLight = new THREE.SpotLight(0xffffff, 1.5);
        mainLight.position.set(5, 10, 7);
        mainLight.angle = Math.PI / 6;
        mainLight.penumbra = 0.3;
        mainLight.castShadow = shadows;
        mainLight.shadow.mapSize.width = shadowMapSize;
        mainLight.shadow.mapSize.height = shadowMapSize;
        scene.add(mainLight);
        lights.push(mainLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0x5496ff, 0.6);
        rimLight.position.set(-5, 3, -5);
        scene.add(rimLight);
        lights.push(rimLight);
        break;
      }
      
      // Default 'basic' setup
      default: {
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = shadows;
        setupShadowCamera(mainLight, shadowMapSize);
        scene.add(mainLight);
        lights.push(mainLight);
        break;
      }
    }
  }
  
  // Add grid helper if requested
  if (gridHelper) {
    const grid = new THREE.GridHelper(gridSize, gridDivisions);
    scene.add(grid);
    helpers.push(grid);
  }
  
  // Add axes helper if requested
  if (axesHelper) {
    const axes = new THREE.AxesHelper(axesSize);
    scene.add(axes);
    helpers.push(axes);
  }
  
  // Setup post-processing if enabled
  let composer: EffectComposer | undefined;
  let outlinePass: OutlinePass | undefined;
  
  if (enablePostprocessing) {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add SSAO if enabled
    if (ssao) {
      const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
      ssaoPass.kernelRadius = ssaoRadius;
      ssaoPass.minDistance = 0.001;
      ssaoPass.maxDistance = 0.1;
      ssaoPass.output = SSAOPass.OUTPUT.Default;
      composer.addPass(ssaoPass);
    }
    
    // Add bloom if enabled
    if (bloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        bloomStrength,
        bloomRadius,
        bloomThreshold
      );
      composer.addPass(bloomPass);
    }
    
    // Add outline if enabled
    if (outline) {
      outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
      );
      outlinePass.edgeStrength = 3;
      outlinePass.edgeGlow = 0;
      outlinePass.edgeThickness = outlineThickness;
      outlinePass.visibleEdgeColor.set(outlineColor);
      outlinePass.hiddenEdgeColor.set(0x000000);
      composer.addPass(outlinePass);
    }
  }
  
  // Handle window resize
  const resizeListener = () => {
    // Update camera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = window.innerWidth / window.innerHeight;
    } else {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -5 * aspect;
      camera.right = 5 * aspect;
      camera.top = 5;
      camera.bottom = -5;
    }
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update composer
    if (composer) {
      composer.setSize(window.innerWidth, window.innerHeight);
    }
  };
  
  window.addEventListener('resize', resizeListener);
  
  // Setup shadow camera
  function setupShadowCamera(light: THREE.DirectionalLight, size: number) {
    light.shadow.mapSize.width = size;
    light.shadow.mapSize.height = size;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = -10;
    light.shadow.bias = -0.0001;
  }
  
  // Utility function to find a mesh by name
  function getMeshByName(name: string): THREE.Mesh | null {
    let result: THREE.Mesh | null = null;
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.name === name) {
        result = object;
      }
    });
    return result;
  }
  
  // Rendering function
  function render() {
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }
  
  // Update function for animations
  function update(delta: number) {
    if (controls?.enableDamping) {
      controls.update();
    }
    
    // Additional update logic can be added here
  }
  
  // Function to select an object for outlining
  function selectObject(object: THREE.Object3D | null) {
    if (outlinePass) {
      outlinePass.selectedObjects = object ? [object] : [];
    }
  }
  
  // Function to change background color
  function setBackgroundColor(color: THREE.Color | string | number) {
    scene.background = new THREE.Color(color);
  }
  
  // Function to toggle helpers visibility
  function toggleHelper(helperType: 'grid' | 'axes', visible: boolean) {
    helpers.forEach(helper => {
      if ((helperType === 'grid' && helper instanceof THREE.GridHelper) ||
          (helperType === 'axes' && helper instanceof THREE.AxesHelper)) {
        helper.visible = visible;
      }
    });
  }
  
  // Function to set camera position
  function setCameraPosition(newPosition: THREE.Vector3 | [number, number, number]) {
    if (Array.isArray(newPosition)) {
      camera.position.set(newPosition[0], newPosition[1], newPosition[2]);
    } else {
      camera.position.copy(newPosition);
    }
  }
  
  // Function to set camera target
  function setCameraTarget(newTarget: THREE.Vector3 | [number, number, number]) {
    const targetVector = Array.isArray(newTarget) 
      ? new THREE.Vector3(newTarget[0], newTarget[1], newTarget[2]) 
      : newTarget;
    
    camera.lookAt(targetVector);
    
    if (controls) {
      if (Array.isArray(newTarget)) {
        controls.target.set(newTarget[0], newTarget[1], newTarget[2]);
      } else {
        controls.target.copy(newTarget);
      }
      controls.update();
    }
  }
  
  // Dispose function to clean up resources
  function dispose() {
    window.removeEventListener('resize', resizeListener);
    
    // Dispose geometries and materials
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
          } else {
            disposeMaterial(object.material);
          }
        }
      }
    });
    
    // Dispose controls
    if (controls) {
      controls.dispose();
    }
    
    // Dispose renderer
    renderer.dispose();
    
    // Clear scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }
  
  // Helper to dispose materials
  function disposeMaterial(material: THREE.Material) {
    material.dispose();
    
    // Dispose textures
    for (const key in material) {
      const value = (material as any)[key];
      if (value instanceof THREE.Texture) {
        value.dispose();
      }
    }
  }
  
  // Return all created objects and functions
  return {
    scene,
    camera,
    renderer,
    controls,
    composer,
    outlinePass,
    lights,
    helpers,
    clock,
    resizeListener,
    
    render,
    update,
    dispose,
    selectObject,
    setBackgroundColor,
    toggleHelper,
    setCameraPosition,
    setCameraTarget,
    
    // Scene manipulation
    add: (object) => scene.add(object),
    remove: (object) => scene.remove(object),
    getMeshByName
  };
}

/**
 * Creates a preset environment for structural engineering visualization
 * @param canvas Canvas element to render to
 * @returns Scene setup result
 */
export function createStructuralVisualizationScene(
  canvas: HTMLCanvasElement
): SceneSetupResult {
  return setupScene({
    canvas,
    lightSetup: 'studio',
    backgroundColor: 0xf5f5f5,
    enablePostprocessing: true,
    bloom: true,
    bloomStrength: 0.5,
    bloomRadius: 0.4,
    bloomThreshold: 0.85,
    outline: true,
    shadows: true,
    enableControls: true,
    controlsConfig: {
      enableDamping: true,
      dampingFactor: 0.05,
      minDistance: 2,
      maxDistance: 50
    },
    fogEnabled: false,
    position: [10, 10, 10],
    target: [0, 0, 0],
    cameraType: 'perspective',
    fov: 45,
    gridHelper: true,
    gridSize: 20,
    gridDivisions: 20
  });
}

/**
 * Creates a preset environment for seismic simulation visualization
 * @param canvas Canvas element to render to
 * @returns Scene setup result
 */
export function createSeismicSimulationScene(
  canvas: HTMLCanvasElement
): SceneSetupResult {
  return setupScene({
    canvas,
    lightSetup: 'dramatic',
    backgroundColor: 0x000000,
    enablePostprocessing: true,
    bloom: true,
    bloomStrength: 1.5,
    bloomRadius: 0.7,
    bloomThreshold: 0.5,
    outline: false,
    shadows: true,
    fogEnabled: true,
    fogColor: 0x000000,
    fogDensity: 0.02,
    position: [15, 15, 15],
    target: [0, 0, 0],
    cameraType: 'perspective',
    fov: 60,
    gridHelper: true,
    gridSize: 50,
    gridDivisions: 50,
    axesHelper: true,
    axesSize: 10
  });
}

export default {
  setupScene,
  createStructuralVisualizationScene,
  createSeismicSimulationScene
}; 