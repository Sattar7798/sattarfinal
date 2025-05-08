import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Types for model loading
export type ModelFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl';
export type LoadProgressCallback = (event: ProgressEvent) => void;
export type LoadErrorCallback = (error: Error) => void;
export type LoadSuccessCallback<T> = (model: T) => void;

interface ModelLoadOptions {
  format?: ModelFormat;
  useDraco?: boolean;
  dracoPath?: string;
  onProgress?: LoadProgressCallback;
  onError?: LoadErrorCallback;
  scale?: number | THREE.Vector3;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/**
 * Detects model format from file path
 * @param path Path to the model file
 * @returns Format type or null if can't be determined
 */
export function detectModelFormat(path: string): ModelFormat | null {
  const extension = path.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'gltf':
      return 'gltf';
    case 'glb':
      return 'glb';
    case 'obj':
      return 'obj';
    case 'fbx':
      return 'fbx';
    case 'stl':
      return 'stl';
    default:
      return null;
  }
}

/**
 * Load a 3D model from URL
 * @param url URL of the model to load
 * @param options Options for loading the model
 * @returns Promise that resolves to the loaded model
 */
export function loadModel<T extends THREE.Object3D>(
  url: string,
  options: ModelLoadOptions = {}
): Promise<T> {
  const {
    format = detectModelFormat(url),
    useDraco = true,
    dracoPath = 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/',
    onProgress,
    onError,
    scale = 1,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    castShadow = true,
    receiveShadow = false
  } = options;
  
  if (!format) {
    return Promise.reject(new Error(`Could not determine format for model: ${url}`));
  }
  
  return new Promise((resolve, reject) => {
    let loader;
    
    // Create appropriate loader based on format
    switch (format) {
      case 'gltf':
      case 'glb': {
        loader = new GLTFLoader();
        
        // Set up Draco decoder if requested
        if (useDraco) {
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath(dracoPath);
          loader.setDRACOLoader(dracoLoader);
        }
        break;
      }
      case 'obj':
        loader = new OBJLoader();
        break;
      case 'fbx':
        loader = new FBXLoader();
        break;
      case 'stl':
        loader = new STLLoader();
        break;
      default:
        reject(new Error(`Unsupported model format: ${format}`));
        return;
    }
    
    // Load the model
    loader.load(
      url,
      (result) => {
        let model: THREE.Object3D;
        
        // Process based on model type
        if (format === 'gltf' || format === 'glb') {
          model = (result as GLTF).scene;
        } else if (format === 'stl') {
          // STL loader returns geometry, need to create a mesh
          const geometry = result as THREE.BufferGeometry;
          const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
          model = new THREE.Mesh(geometry, material);
        } else {
          // OBJ and FBX loaders return Object3D directly
          model = result as THREE.Object3D;
        }
        
        // Apply transformations
        if (typeof scale === 'number') {
          model.scale.set(scale, scale, scale);
        } else {
          model.scale.copy(scale);
        }
        
        model.position.copy(position);
        model.rotation.copy(rotation);
        
        // Set shadow properties
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
            
            // Ensure materials are set up for shadows
            if (child.material) {
              const materials = Array.isArray(child.material) 
                ? child.material 
                : [child.material];
              
              materials.forEach(mat => {
                if (mat instanceof THREE.Material) {
                  mat.needsUpdate = true;
                }
              });
            }
          }
        });
        
        resolve(model as T);
      },
      onProgress,
      (error) => {
        if (onError) {
          onError(error);
        }
        reject(error);
      }
    );
  });
}

/**
 * Applies a section cut to a model along a specific axis
 * @param model The 3D model to apply the section cut to
 * @param axis The axis to cut along ('x', 'y', or 'z')
 * @param position Position along the axis where the cut should be made (-1 to 1)
 * @returns The modified model
 */
export function applySectionCut(
  model: THREE.Object3D,
  axis: 'x' | 'y' | 'z',
  position: number
): THREE.Object3D {
  // Create a clipping plane
  const plane = new THREE.Plane();
  const normal = new THREE.Vector3();
  
  // Set the normal based on the axis
  if (axis === 'x') {
    normal.set(position < 0 ? 1 : -1, 0, 0);
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(Math.abs(position), 0, 0));
  } else if (axis === 'y') {
    normal.set(0, position < 0 ? 1 : -1, 0);
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(0, Math.abs(position), 0));
  } else {  // axis === 'z'
    normal.set(0, 0, position < 0 ? 1 : -1);
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(0, 0, Math.abs(position)));
  }
  
  // Apply clipping plane to all materials
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        const materials = Array.isArray(child.material) 
          ? child.material 
          : [child.material];
        
        materials.forEach(mat => {
          if (mat instanceof THREE.Material) {
            mat.clippingPlanes = [plane];
            mat.clipShadows = true;
            mat.needsUpdate = true;
          }
        });
      }
    }
  });
  
  return model;
}

/**
 * Creates an exploded view of a model by moving parts away from center
 * @param model The 3D model to explode
 * @param factor Explosion factor (0-1, where 0 is normal and 1 is fully exploded)
 * @param center Center point of explosion (defaults to model center)
 * @returns The modified model with exploded view
 */
export function createExplodedView(
  model: THREE.Object3D,
  factor: number = 0,
  center?: THREE.Vector3
): THREE.Object3D {
  if (factor === 0) return model;
  
  // Calculate center if not provided
  const centerPoint = center || new THREE.Vector3();
  if (!center) {
    const bbox = new THREE.Box3().setFromObject(model);
    bbox.getCenter(centerPoint);
  }
  
  // Apply explosion to each child
  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.parent !== model) {
      // Calculate direction from center to this part
      const partCenter = new THREE.Vector3();
      new THREE.Box3().setFromObject(child).getCenter(partCenter);
      
      const direction = partCenter.clone().sub(centerPoint).normalize();
      
      // Calculate distance to move (based on distance from center and factor)
      const distanceFromCenter = partCenter.distanceTo(centerPoint);
      const moveDistance = distanceFromCenter * factor;
      
      // Move the part along the direction
      child.position.add(direction.multiplyScalar(moveDistance));
    }
  });
  
  return model;
}

/**
 * Changes the material of a model or specific mesh
 * @param model The 3D model to modify
 * @param material New material to apply
 * @param meshName Optional mesh name to target a specific part
 * @returns The modified model
 */
export function changeMaterial(
  model: THREE.Object3D,
  material: THREE.Material,
  meshName?: string
): THREE.Object3D {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (!meshName || child.name === meshName) {
        child.material = material;
      }
    }
  });
  
  return model;
}

/**
 * Creates a wireframe version of a model
 * @param model The 3D model to convert to wireframe
 * @param color Wireframe color
 * @param thickness Line thickness
 * @returns A new wireframe model
 */
export function createWireframe(
  model: THREE.Object3D,
  color: THREE.Color | string = 0x000000,
  thickness: number = 1
): THREE.Object3D {
  const wireframe = new THREE.Group();
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: color instanceof THREE.Color ? color : new THREE.Color(color),
    linewidth: thickness
  });
  
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Create edges geometry
      const edges = new THREE.EdgesGeometry(child.geometry);
      const line = new THREE.LineSegments(edges, wireframeMaterial);
      
      // Copy transformations
      line.position.copy(child.position);
      line.rotation.copy(child.rotation);
      line.scale.copy(child.scale);
      
      wireframe.add(line);
    }
  });
  
  return wireframe;
}

/**
 * Creates a bounding box helper for a model
 * @param model The 3D model
 * @param color Box color
 * @returns A bounding box helper object
 */
export function createBoundingBox(
  model: THREE.Object3D,
  color: THREE.Color | string = 0xff0000
): THREE.Box3Helper {
  const box = new THREE.Box3().setFromObject(model);
  const helper = new THREE.Box3Helper(box, color instanceof THREE.Color ? color : new THREE.Color(color));
  return helper;
}

/**
 * Organizes a model into layers/groups based on names or properties
 * @param model The 3D model to organize
 * @param groupingFunction Function that determines which group each object belongs to
 * @returns The model organized into named groups
 */
export function organizeModelIntoGroups(
  model: THREE.Object3D,
  groupingFunction: (object: THREE.Object3D) => string
): Record<string, THREE.Group> {
  const groups: Record<string, THREE.Group> = {};
  
  // Create groups based on function
  model.traverse((child) => {
    if (child !== model) {
      const groupName = groupingFunction(child);
      
      if (groupName) {
        // Create group if it doesn't exist
        if (!groups[groupName]) {
          groups[groupName] = new THREE.Group();
          groups[groupName].name = groupName;
        }
        
        // Clone the object and add to group
        if (child.parent) {
          child.parent.remove(child);
          groups[groupName].add(child);
        }
      }
    }
  });
  
  // Add all groups to the model
  Object.values(groups).forEach(group => {
    model.add(group);
  });
  
  return groups;
}

/**
 * Analyzes a model and returns information about its structure and components
 * @param model The 3D model to analyze
 * @returns Analysis information about the model
 */
export function analyzeModel(model: THREE.Object3D): {
  triangleCount: number;
  meshCount: number;
  materialCount: number;
  textureCount: number;
  boundingBox: THREE.Box3;
  hierarchyDepth: number;
  uniqueMaterials: THREE.Material[];
} {
  let triangleCount = 0;
  let meshCount = 0;
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  let maxDepth = 0;
  
  // Recursive function to determine hierarchy depth
  const getDepth = (object: THREE.Object3D, currentDepth: number): number => {
    let maxChildDepth = currentDepth;
    
    object.children.forEach(child => {
      const childDepth = getDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    });
    
    return maxChildDepth;
  };
  
  // Analyze the model
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshCount++;
      
      // Count triangles
      if (child.geometry) {
        if (child.geometry.index) {
          triangleCount += child.geometry.index.count / 3;
        } else if (child.geometry.attributes.position) {
          triangleCount += child.geometry.attributes.position.count / 3;
        }
      }
      
      // Collect materials
      if (child.material) {
        const meshMaterials = Array.isArray(child.material) 
          ? child.material 
          : [child.material];
        
        meshMaterials.forEach(mat => {
          if (materials.indexOf(mat) === -1) {
            materials.push(mat);
          }
          
          // Collect textures
          if (mat instanceof THREE.MeshStandardMaterial ||
              mat instanceof THREE.MeshPhysicalMaterial ||
              mat instanceof THREE.MeshBasicMaterial ||
              mat instanceof THREE.MeshPhongMaterial) {
            
            const mapsToCheck = [
              mat.map, 
              mat.normalMap, 
              mat.bumpMap, 
              mat.roughnessMap, 
              mat.metalnessMap, 
              mat.aoMap,
              mat.emissiveMap
            ];
            
            mapsToCheck.forEach(map => {
              if (map && textures.indexOf(map) === -1) {
                textures.push(map);
              }
            });
          }
        });
      }
    }
  });
  
  // Calculate hierarchy depth
  maxDepth = getDepth(model, 0);
  
  // Calculate bounding box
  const boundingBox = new THREE.Box3().setFromObject(model);
  
  return {
    triangleCount: Math.round(triangleCount),
    meshCount,
    materialCount: materials.length,
    textureCount: textures.length,
    boundingBox,
    hierarchyDepth: maxDepth,
    uniqueMaterials: materials
  };
}

export default {
  loadModel,
  detectModelFormat,
  applySectionCut,
  createExplodedView,
  changeMaterial,
  createWireframe,
  createBoundingBox,
  organizeModelIntoGroups,
  analyzeModel
}; 