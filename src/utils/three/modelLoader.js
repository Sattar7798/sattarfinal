/**
 * 3D Model Loader Utility
 * 
 * This utility provides functions for loading, optimizing, and managing 3D models
 * in the application. It supports common 3D formats (GLTF, GLB, OBJ, FBX) and
 * includes optimization features for better performance.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Cache for loaded models to prevent duplicate loading
const modelCache = new Map();

// Cache for textures
const textureCache = new Map();

// Loader instances (initialized lazily)
let gltfLoader = null;
let dracoLoader = null;
let objLoader = null;
let mtlLoader = null;
let fbxLoader = null;
let exrLoader = null;

/**
 * Initialize loaders with options
 * @param {Object} options Loader options
 */
export function initLoaders(options = {}) {
  const {
    dracoDecoderPath = '/draco/',
    ktx2DecoderPath = '/ktx2/',
    useKTX2 = false
  } = options;
  
  // Initialize DRACO loader
  dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  
  // Initialize GLTF loader
  gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  
  // Add KTX2 support if needed
  if (useKTX2) {
    // KTX2Loader requires explicit import due to its size
    import('three/examples/jsm/loaders/KTX2Loader.js').then(({ KTX2Loader }) => {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath(ktx2DecoderPath);
      ktx2Loader.detectSupport(THREE.WebGLRenderer);
      gltfLoader.setKTX2Loader(ktx2Loader);
    });
  }
  
  // Initialize other loaders
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  fbxLoader = new FBXLoader();
  exrLoader = new EXRLoader();
}

/**
 * Load a 3D model based on file extension
 * @param {string} url - URL of the model to load
 * @param {Object} options - Loading options
 * @returns {Promise<THREE.Object3D>} - The loaded model
 */
export async function loadModel(url, options = {}) {
  const {
    useCache = true,
    onProgress = null,
    optimize = false,
    scale = 1.0,
    rotation = [0, 0, 0],
    position = [0, 0, 0],
    materialOverrides = null,
    name = null,
    instanced = false,
    instanceCount = 1,
    instanceMatrix = null
  } = options;
  
  // Return cached model if available and caching is enabled
  const cacheKey = url + JSON.stringify({ scale, rotation, position });
  if (useCache && modelCache.has(cacheKey)) {
    const cachedModel = modelCache.get(cacheKey);
    return instanced ? createInstancedModel(cachedModel, instanceCount, instanceMatrix) : cachedModel.clone();
  }
  
  // Initialize loaders if not already initialized
  if (!gltfLoader) {
    initLoaders();
  }
  
  try {
    // Determine file type from URL extension
    const fileExtension = url.split('.').pop().toLowerCase();
    
    // Load based on file type
    let model;
    
    switch (fileExtension) {
      case 'gltf':
      case 'glb':
        model = await loadGLTF(url, onProgress);
        break;
      
      case 'obj':
        model = await loadOBJ(url, options.mtlUrl, onProgress);
        break;
      
      case 'fbx':
        model = await loadFBX(url, onProgress);
        break;
      
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
    
    // Apply transformations
    applyTransformations(model, scale, rotation, position);
    
    // Apply custom name if provided
    if (name) {
      model.name = name;
    }
    
    // Apply material overrides if provided
    if (materialOverrides) {
      applyMaterialOverrides(model, materialOverrides);
    }
    
    // Optimize model if requested
    if (optimize) {
      optimizeModel(model, options.optimizationOptions || {});
    }
    
    // Cache model if caching is enabled
    if (useCache) {
      modelCache.set(cacheKey, model.clone());
    }
    
    // Return instanced model if requested
    if (instanced) {
      return createInstancedModel(model, instanceCount, instanceMatrix);
    }
    
    return model;
  } catch (error) {
    console.error(`Error loading model from ${url}:`, error);
    throw error;
  }
}

/**
 * Load a GLTF/GLB model
 * @param {string} url - URL of the GLTF/GLB file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<THREE.Object3D>} - The loaded model
 */
async function loadGLTF(url, onProgress) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        
        // Enable shadows for all meshes
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        
        resolve(model);
      },
      onProgress,
      reject
    );
  });
}

/**
 * Load an OBJ model with optional MTL file
 * @param {string} objUrl - URL of the OBJ file
 * @param {string} mtlUrl - URL of the MTL file (optional)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<THREE.Object3D>} - The loaded model
 */
async function loadOBJ(objUrl, mtlUrl, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      // Load MTL if provided
      if (mtlUrl) {
        const materials = await new Promise((resolve, reject) => {
          mtlLoader.load(
            mtlUrl,
            resolve,
            onProgress,
            reject
          );
        });
        
        materials.preload();
        objLoader.setMaterials(materials);
      }
      
      // Load OBJ
      objLoader.load(
        objUrl,
        (model) => {
          // Enable shadows for all meshes
          model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          
          resolve(model);
        },
        onProgress,
        reject
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load an FBX model
 * @param {string} url - URL of the FBX file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<THREE.Object3D>} - The loaded model
 */
async function loadFBX(url, onProgress) {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      url,
      (model) => {
        // Enable shadows for all meshes
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        
        resolve(model);
      },
      onProgress,
      reject
    );
  });
}

/**
 * Load and cache a texture
 * @param {string} url - URL of the texture
 * @param {Object} options - Texture options
 * @returns {Promise<THREE.Texture>} - The loaded texture
 */
export async function loadTexture(url, options = {}) {
  const {
    useCache = true,
    sRGB = true,
    wrapS = THREE.ClampToEdgeWrapping,
    wrapT = THREE.ClampToEdgeWrapping,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    flipY = true,
    anisotropy = 4
  } = options;
  
  // Return cached texture if available
  const cacheKey = url + JSON.stringify({ sRGB, wrapS, wrapT, flipY });
  if (useCache && textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }
  
  return new Promise((resolve, reject) => {
    // Determine file type
    const fileExtension = url.split('.').pop().toLowerCase();
    
    if (fileExtension === 'exr') {
      // Load EXR texture (high dynamic range)
      if (!exrLoader) {
        exrLoader = new EXRLoader();
      }
      
      exrLoader.load(
        url,
        (texture) => {
          configureTexture(texture, options);
          
          if (useCache) {
            textureCache.set(cacheKey, texture);
          }
          
          resolve(texture);
        },
        undefined,
        reject
      );
    } else {
      // Load standard texture
      const textureLoader = new THREE.TextureLoader();
      
      textureLoader.load(
        url,
        (texture) => {
          configureTexture(texture, options);
          
          if (useCache) {
            textureCache.set(cacheKey, texture);
          }
          
          resolve(texture);
        },
        undefined,
        reject
      );
    }
  });
}

/**
 * Configure a texture with given options
 * @param {THREE.Texture} texture - The texture to configure
 * @param {Object} options - Texture options
 */
function configureTexture(texture, options) {
  const {
    sRGB = true,
    wrapS = THREE.ClampToEdgeWrapping,
    wrapT = THREE.ClampToEdgeWrapping,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    flipY = true,
    anisotropy = 4
  } = options;
  
  texture.wrapS = wrapS;
  texture.wrapT = wrapT;
  texture.minFilter = minFilter;
  texture.magFilter = magFilter;
  texture.flipY = flipY;
  texture.anisotropy = anisotropy;
  
  if (sRGB) {
    texture.encoding = THREE.sRGBEncoding;
  }
  
  // Generate mipmaps if appropriate filter is used
  if (
    minFilter === THREE.LinearMipmapLinearFilter ||
    minFilter === THREE.LinearMipmapNearestFilter ||
    minFilter === THREE.NearestMipmapLinearFilter ||
    minFilter === THREE.NearestMipmapNearestFilter
  ) {
    texture.generateMipmaps = true;
  }
}

/**
 * Apply transformations to a model
 * @param {THREE.Object3D} model - The model to transform
 * @param {number} scale - Scale factor
 * @param {Array<number>} rotation - Rotation in [x, y, z] format (radians)
 * @param {Array<number>} position - Position in [x, y, z] format
 */
function applyTransformations(model, scale, rotation, position) {
  // Apply scale
  if (typeof scale === 'number') {
    model.scale.set(scale, scale, scale);
  } else if (Array.isArray(scale) && scale.length === 3) {
    model.scale.set(scale[0], scale[1], scale[2]);
  }
  
  // Apply rotation
  if (Array.isArray(rotation) && rotation.length === 3) {
    model.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
  
  // Apply position
  if (Array.isArray(position) && position.length === 3) {
    model.position.set(position[0], position[1], position[2]);
  }
}

/**
 * Apply material overrides to a model
 * @param {THREE.Object3D} model - The model to modify
 * @param {Object} overrides - Material property overrides
 */
function applyMaterialOverrides(model, overrides) {
  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.material) {
      // Handle arrays of materials
      if (Array.isArray(node.material)) {
        node.material = node.material.map(material => {
          return applyOverridesToMaterial(material, overrides);
        });
      } else {
        // Handle single material
        node.material = applyOverridesToMaterial(node.material, overrides);
      }
    }
  });
}

/**
 * Apply overrides to a specific material
 * @param {THREE.Material} material - The material to modify
 * @param {Object} overrides - Material property overrides
 * @returns {THREE.Material} - The modified material
 */
function applyOverridesToMaterial(material, overrides) {
  // Clone the material to avoid affecting other instances
  const newMaterial = material.clone();
  
  // Apply each override property
  Object.entries(overrides).forEach(([key, value]) => {
    if (key in newMaterial) {
      // Handle color properties
      if (key.includes('color') && !(value instanceof THREE.Color)) {
        newMaterial[key] = new THREE.Color(value);
      } else {
        newMaterial[key] = value;
      }
    }
  });
  
  newMaterial.needsUpdate = true;
  return newMaterial;
}

/**
 * Create an instanced version of a model
 * @param {THREE.Object3D} model - The base model
 * @param {number} count - Number of instances
 * @param {THREE.InstancedBufferAttribute|Array} matrix - Instance matrices
 * @returns {THREE.Object3D} - Instanced model
 */
function createInstancedModel(model, count, matrix) {
  const instancedModel = new THREE.Group();
  instancedModel.name = `instanced-${model.name || 'model'}`;
  
  // Process each mesh to create instanced versions
  model.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      const geometry = node.geometry;
      const material = node.material;
      
      // Create instanced material
      const instancedMaterial = material.clone();
      
      // Create instanced mesh
      const instancedMesh = new THREE.InstancedMesh(
        geometry,
        instancedMaterial,
        count
      );
      
      // Set instance matrices
      if (matrix) {
        if (matrix instanceof THREE.InstancedBufferAttribute) {
          instancedMesh.instanceMatrix = matrix;
        } else if (Array.isArray(matrix)) {
          for (let i = 0; i < count; i++) {
            instancedMesh.setMatrixAt(i, matrix[i]);
          }
        }
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedModel.add(instancedMesh);
    }
  });
  
  return instancedModel;
}

/**
 * Optimize a model for better performance
 * @param {THREE.Object3D} model - The model to optimize
 * @param {Object} options - Optimization options
 */
function optimizeModel(model, options = {}) {
  const {
    mergeMeshes = true,
    simplifyGeometry = false,
    simplificationRatio = 0.5,
    shareMaterials = true,
    occlusionCulling = true
  } = options;
  
  // Merge geometries with the same material to reduce draw calls
  if (mergeMeshes) {
    mergeMeshesByMaterial(model);
  }
  
  // Simplify complex geometries
  if (simplifyGeometry) {
    simplifyGeometries(model, simplificationRatio);
  }
  
  // Share materials between meshes to reduce memory
  if (shareMaterials) {
    optimizeMaterials(model);
  }
  
  // Enable frustum culling for all objects
  model.traverse((node) => {
    node.frustumCulled = true;
  });
  
  // Enable occlusion culling (if supported by renderer)
  if (occlusionCulling) {
    // Note: This requires renderer.sortObjects = false
    // and proper material setup - handled elsewhere
  }
  
  // Optimize meshes for static objects
  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.geometry) {
      // Mark geometries as immutable if they won't change
      node.geometry.setUsage(THREE.StaticDrawUsage);
      
      // Compute vertex normals if not already computed
      if (!node.geometry.attributes.normal) {
        node.geometry.computeVertexNormals();
      }
    }
  });
}

/**
 * Merge meshes with the same material to reduce draw calls
 * @param {THREE.Object3D} model - The model containing meshes to merge
 */
function mergeMeshesByMaterial(model) {
  // Group meshes by material
  const meshesByMaterial = new Map();
  
  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.geometry) {
      // Skip meshes that shouldn't be merged
      if (node.userData.doNotMerge) return;
      
      // Handle only meshes with standard materials
      if (!(node.material instanceof THREE.MeshStandardMaterial) &&
          !(node.material instanceof THREE.MeshPhongMaterial) &&
          !(node.material instanceof THREE.MeshBasicMaterial)) {
        return;
      }
      
      // Skip instanced meshes
      if (node instanceof THREE.InstancedMesh) return;
      
      // Skip skinned meshes
      if (node.isSkinnedMesh) return;
      
      // Create material key
      const matKey = node.material.uuid;
      
      if (!meshesByMaterial.has(matKey)) {
        meshesByMaterial.set(matKey, {
          material: node.material,
          meshes: []
        });
      }
      
      meshesByMaterial.get(matKey).meshes.push(node);
    }
  });
  
  // Merge geometries for each material group
  meshesByMaterial.forEach(({ material, meshes }) => {
    // Skip if only one mesh
    if (meshes.length <= 1) return;
    
    const geometries = [];
    const parent = meshes[0].parent;
    
    // Collect all geometries, transforming vertices to world space
    meshes.forEach(mesh => {
      const geometry = mesh.geometry.clone();
      
      // Apply mesh's world matrix to vertices
      geometry.applyMatrix4(mesh.matrixWorld);
      
      // Remove from parent for later replacement
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      
      geometries.push(geometry);
    });
    
    // Merge all geometries
    const mergedGeometry = mergeBufferGeometries(geometries, false);
    
    // Create new mesh with merged geometry
    const mergedMesh = new THREE.Mesh(mergedGeometry, material);
    mergedMesh.name = 'merged-mesh';
    mergedMesh.castShadow = true;
    mergedMesh.receiveShadow = true;
    
    // Add to the parent of the first mesh
    if (parent) {
      parent.add(mergedMesh);
    } else {
      model.add(mergedMesh);
    }
  });
}

/**
 * Simplify complex geometries to improve performance
 * @param {THREE.Object3D} model - The model containing geometries to simplify
 * @param {number} ratio - Simplification ratio (0-1)
 */
function simplifyGeometries(model, ratio) {
  // This is a stub - real implementation would use a geometry simplification algorithm
  // like SimplifyModifier from THREE.js examples
  console.warn('Geometry simplification is not fully implemented');
  
  // Full implementation would look like:
  /*
  import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';
  
  const modifier = new SimplifyModifier();
  
  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.geometry) {
      // Skip small geometries
      if (node.geometry.attributes.position.count < 100) return;
      
      // Calculate target vertex count
      const targetCount = Math.floor(node.geometry.attributes.position.count * ratio);
      
      // Apply simplification
      const simplified = modifier.modify(node.geometry, targetCount);
      node.geometry.dispose();
      node.geometry = simplified;
    }
  });
  */
}

/**
 * Optimize materials by sharing instances where possible
 * @param {THREE.Object3D} model - The model to optimize
 */
function optimizeMaterials(model) {
  const materialCache = new Map();
  
  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.material) {
      if (Array.isArray(node.material)) {
        // Handle multi-material meshes
        node.material = node.material.map(mat => {
          return getSharedMaterial(mat, materialCache);
        });
      } else {
        // Handle single material meshes
        node.material = getSharedMaterial(node.material, materialCache);
      }
    }
  });
}

/**
 * Get a shared material from cache or create a new one
 * @param {THREE.Material} material - The original material
 * @param {Map} cache - Material cache
 * @returns {THREE.Material} - The shared material
 */
function getSharedMaterial(material, cache) {
  // Create material key based on important properties
  const matType = material.type;
  const colorHex = material.color ? material.color.getHexString() : '';
  const roughness = material.roughness !== undefined ? material.roughness.toFixed(2) : '';
  const metalness = material.metalness !== undefined ? material.metalness.toFixed(2) : '';
  const mapId = material.map ? material.map.uuid : '';
  
  const key = `${matType}-${colorHex}-${roughness}-${metalness}-${mapId}`;
  
  if (!cache.has(key)) {
    cache.set(key, material);
  }
  
  return cache.get(key);
}

/**
 * Clear all model and texture caches
 */
export function clearCaches() {
  modelCache.clear();
  textureCache.clear();
}

/**
 * Dispose of a model and free its resources
 * @param {THREE.Object3D} model - The model to dispose
 */
export function disposeModel(model) {
  model.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }
      
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(material => disposeMaterial(material));
        } else {
          disposeMaterial(node.material);
        }
      }
    }
  });
}

/**
 * Dispose of a material and its textures
 * @param {THREE.Material} material - The material to dispose
 */
function disposeMaterial(material) {
  // Dispose all textures used by the material
  Object.keys(material).forEach(key => {
    const value = material[key];
    if (value && value.isTexture) {
      value.dispose();
    }
  });
  
  // Dispose material
  material.dispose();
}

export default {
  initLoaders,
  loadModel,
  loadTexture,
  clearCaches,
  disposeModel
}; 