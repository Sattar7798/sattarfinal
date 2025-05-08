import * as THREE from 'three';
import { SeismicWaveform } from './dataProcessor';

/**
 * Types of building structure models
 */
export type StructureModelType = 'shear' | 'cantilever' | 'frame' | 'coupled' | 'base-isolated';

/**
 * Building structure parameters
 */
export interface BuildingStructureParams {
  numStories: number;         // Number of stories in the building
  storyHeight: number;        // Height of each story in meters
  totalMass: number;          // Total mass of the building in kg
  fundamentalPeriod?: number; // Fundamental period in seconds (if known)
  dampingRatio?: number;      // Critical damping ratio (typically 0.02-0.05)
  modelType?: StructureModelType; // Type of structural model
  stiffnessProfile?: 'uniform' | 'linear' | 'custom'; // Stiffness distribution along height
  customStiffness?: number[]; // Custom stiffness values for each story
  floorDimensions?: {         // Floor plan dimensions
    width: number;           // Width in meters
    depth: number;           // Depth in meters
  };
  baseIsolation?: {           // Parameters for base isolation (if applicable)
    period: number;          // Isolation period in seconds
    damping: number;         // Isolation damping ratio
  };
}

/**
 * Response values for all degrees of freedom
 */
export interface StructuralResponse {
  time: number[];                     // Time points
  displacement: number[][];           // Displacement at each DOF [time][dof]
  velocity?: number[][];              // Velocity at each DOF [time][dof]
  acceleration?: number[][];          // Acceleration at each DOF [time][dof]
  baseShear?: number[];               // Base shear at each time point
  maxDrift?: number[];                // Maximum story drift at each time point
  maxDisplacement?: number;           // Maximum absolute displacement
  maxAcceleration?: number;           // Maximum absolute acceleration
}

/**
 * Structure model with mass and stiffness matrices
 */
export interface StructureModel {
  massMatrix: number[][];             // Mass matrix
  stiffnessMatrix: number[][];        // Stiffness matrix
  dampingMatrix: number[][];          // Damping matrix
  numDOFs: number;                    // Number of degrees of freedom
  nodeCoordinates: THREE.Vector3[];   // Coordinates of each node
  elementConnectivity: number[][];    // Element connectivity (node indices)
  properties: BuildingStructureParams; // Original properties
}

/**
 * Create a simple shear building model with the given parameters
 * @param params Building structure parameters
 * @returns Structure model with matrices
 */
export function createShearBuildingModel(params: BuildingStructureParams): StructureModel {
  const {
    numStories,
    storyHeight,
    totalMass,
    fundamentalPeriod,
    dampingRatio = 0.05,
    stiffnessProfile = 'uniform',
    customStiffness,
    floorDimensions = { width: 12, depth: 12 }
  } = params;
  
  // Number of degrees of freedom (one per story for shear building)
  const numDOFs = numStories;
  
  // Create mass matrix (diagonal for lumped mass)
  const massMatrix: number[][] = Array(numDOFs).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Distribute mass evenly across stories
  const storyMass = totalMass / numStories;
  for (let i = 0; i < numDOFs; i++) {
    massMatrix[i][i] = storyMass;
  }
  
  // Create stiffness values for each story
  let stiffnessValues: number[] = [];
  
  // If fundamental period is provided, calculate base stiffness
  let baseStiffness = 0;
  if (fundamentalPeriod) {
    // Approximate for first mode of shear building
    const omega = 2 * Math.PI / fundamentalPeriod;
    baseStiffness = omega * omega * storyMass;
  } else {
    // Approximate based on typical values for buildings
    // Approximate stiffness based on rule of thumb
    baseStiffness = 1e6 * numStories; // Simplified value
  }
  
  // Apply stiffness profile
  switch (stiffnessProfile) {
    case 'uniform':
      // Same stiffness for all stories
      stiffnessValues = Array(numStories).fill(baseStiffness);
      break;
    
    case 'linear':
      // Linear decrease with height (stiffer at bottom)
      stiffnessValues = Array(numStories).fill(0).map((_, i) => {
        const ratio = 1 - 0.7 * (i / numStories);
        return baseStiffness * ratio;
      });
      break;
    
    case 'custom':
      // Use custom stiffness values if provided
      if (customStiffness && customStiffness.length === numStories) {
        stiffnessValues = customStiffness;
      } else {
        // Fallback to uniform
        stiffnessValues = Array(numStories).fill(baseStiffness);
      }
      break;
  }
  
  // Create stiffness matrix for shear building
  const stiffnessMatrix: number[][] = Array(numDOFs).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Assemble stiffness matrix for shear building
  for (let i = 0; i < numDOFs; i++) {
    if (i > 0) {
      stiffnessMatrix[i][i - 1] = -stiffnessValues[i];
      stiffnessMatrix[i][i] += stiffnessValues[i];
    }
    
    if (i < numDOFs - 1) {
      stiffnessMatrix[i][i + 1] = -stiffnessValues[i + 1];
      stiffnessMatrix[i][i] += stiffnessValues[i + 1];
    }
  }
  
  // Create damping matrix (Rayleigh damping)
  const dampingMatrix: number[][] = Array(numDOFs).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Simple approach: proportional to mass matrix
  for (let i = 0; i < numDOFs; i++) {
    for (let j = 0; j < numDOFs; j++) {
      dampingMatrix[i][j] = 2 * dampingRatio * massMatrix[i][j];
    }
  }
  
  // Node coordinates
  const nodeCoordinates: THREE.Vector3[] = [];
  
  // Base node
  nodeCoordinates.push(new THREE.Vector3(0, 0, 0));
  
  // Floor nodes
  for (let i = 0; i < numStories; i++) {
    nodeCoordinates.push(new THREE.Vector3(0, (i + 1) * storyHeight, 0));
  }
  
  // Element connectivity (for visualization)
  const elementConnectivity: number[][] = [];
  
  // Connect nodes to form stories
  for (let i = 0; i < numStories; i++) {
    // Columns for each story
    elementConnectivity.push([i, i + 1]);
    
    // Floor outline (for visualization)
    if (floorDimensions) {
      const { width, depth } = floorDimensions;
      const halfWidth = width / 2;
      const halfDepth = depth / 2;
      
      // Add corner nodes for this floor
      const floorHeight = (i + 1) * storyHeight;
      const baseNodeIndex = nodeCoordinates.length;
      
      // Four corners of the floor
      nodeCoordinates.push(new THREE.Vector3(-halfWidth, floorHeight, -halfDepth));
      nodeCoordinates.push(new THREE.Vector3(halfWidth, floorHeight, -halfDepth));
      nodeCoordinates.push(new THREE.Vector3(halfWidth, floorHeight, halfDepth));
      nodeCoordinates.push(new THREE.Vector3(-halfWidth, floorHeight, halfDepth));
      
      // Connect floor corners to form outline
      elementConnectivity.push([baseNodeIndex, baseNodeIndex + 1]);
      elementConnectivity.push([baseNodeIndex + 1, baseNodeIndex + 2]);
      elementConnectivity.push([baseNodeIndex + 2, baseNodeIndex + 3]);
      elementConnectivity.push([baseNodeIndex + 3, baseNodeIndex]);
      
      // Connect center to corners (optional)
      for (let j = 0; j < 4; j++) {
        elementConnectivity.push([i + 1, baseNodeIndex + j]);
      }
    }
  }
  
  return {
    massMatrix,
    stiffnessMatrix,
    dampingMatrix,
    numDOFs,
    nodeCoordinates,
    elementConnectivity,
    properties: params
  };
}

/**
 * Solve the dynamic equation of motion using time-step integration
 * @param model Structure model
 * @param excitation Ground motion excitation
 * @param dt Time step for integration
 * @returns Structural response in time domain
 */
export function solveResponseTimeHistory(
  model: StructureModel,
  excitation: SeismicWaveform,
  dt: number = 0.01
): StructuralResponse {
  const { massMatrix, stiffnessMatrix, dampingMatrix, numDOFs } = model;
  const { time: excitationTime, amplitude: excitationAccel } = excitation;
  
  // Ensure consistent time step
  const time: number[] = [];
  const numSteps = excitationTime.length;
  
  for (let i = 0; i < numSteps; i++) {
    time.push(i * dt);
  }
  
  // Initialize displacement, velocity, and acceleration arrays
  const displacement: number[][] = Array(numSteps).fill(0).map(() => Array(numDOFs).fill(0));
  const velocity: number[][] = Array(numSteps).fill(0).map(() => Array(numDOFs).fill(0));
  const acceleration: number[][] = Array(numSteps).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Force vector at each time step
  const force: number[][] = Array(numSteps).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Calculate force vector (F = -M * influence * ag)
  for (let t = 0; t < numSteps; t++) {
    const ag = excitationAccel[t];
    
    // Apply ground acceleration to each DOF through mass matrix
    for (let i = 0; i < numDOFs; i++) {
      force[t][i] = -massMatrix[i][i] * ag;
    }
  }
  
  // Solve using Newmark-beta method
  const beta = 0.25; // Newmark-beta parameters
  const gamma = 0.5;
  
  // Integration constants
  const a1 = 1 / (beta * dt * dt);
  const a2 = 1 / (beta * dt);
  const a3 = (1 - 2 * beta) / (2 * beta);
  
  // Function to solve a system of linear equations Ax = b
  function solve(A: number[][], b: number[]): number[] {
    // Simple Gaussian elimination - for production code, use a robust linear solver
    const n = A.length;
    const x = Array(n).fill(0);
    
    // Create augmented matrix
    const augMatrix: number[][] = Array(n).fill(0).map((_, i) => [...A[i], b[i]]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augMatrix[j][i]) > Math.abs(augMatrix[maxRow][i])) {
          maxRow = j;
        }
      }
      
      // Swap rows
      if (maxRow !== i) {
        [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];
      }
      
      // Eliminate below
      for (let j = i + 1; j < n; j++) {
        const factor = augMatrix[j][i] / augMatrix[i][i];
        for (let k = i; k <= n; k++) {
          augMatrix[j][k] -= factor * augMatrix[i][k];
        }
      }
    }
    
    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augMatrix[i][n];
      for (let j = i + 1; j < n; j++) {
        x[i] -= augMatrix[i][j] * x[j];
      }
      x[i] /= augMatrix[i][i];
    }
    
    return x;
  }
  
  // Modified mass and stiffness matrices for Newmark method
  const effectiveK: number[][] = Array(numDOFs).fill(0).map(() => Array(numDOFs).fill(0));
  
  // Calculate effective stiffness matrix: K* = K + a1*M + a2*C
  for (let i = 0; i < numDOFs; i++) {
    for (let j = 0; j < numDOFs; j++) {
      effectiveK[i][j] = stiffnessMatrix[i][j] + 
        a1 * massMatrix[i][j] + 
        a2 * gamma * dampingMatrix[i][j];
    }
  }
  
  // Time stepping
  for (let t = 0; t < numSteps - 1; t++) {
    const effectiveForce = Array(numDOFs).fill(0);
    
    // Calculate effective force
    for (let i = 0; i < numDOFs; i++) {
      // F* = F + M(a1*u + a2*v + a3*a) + C(a2*gamma*u + v)
      effectiveForce[i] = force[t+1][i];
      
      for (let j = 0; j < numDOFs; j++) {
        effectiveForce[i] += massMatrix[i][j] * (
          a1 * displacement[t][j] + 
          a2 * velocity[t][j] + 
          a3 * acceleration[t][j]
        );
        
        effectiveForce[i] += dampingMatrix[i][j] * (
          a2 * gamma * displacement[t][j] + 
          velocity[t][j]
        );
      }
    }
    
    // Solve for displacement at next time step
    displacement[t+1] = solve(effectiveK, effectiveForce);
    
    // Update velocity and acceleration
    for (let i = 0; i < numDOFs; i++) {
      velocity[t+1][i] = a2 * (displacement[t+1][i] - displacement[t][i]) - 
        a3 * velocity[t][i];
      
      acceleration[t+1][i] = a1 * (displacement[t+1][i] - displacement[t][i] - 
        dt * velocity[t][i]) - a3 * acceleration[t][i];
    }
  }
  
  // Calculate base shear and drifts
  const baseShear: number[] = Array(numSteps).fill(0);
  const drifts: number[] = Array(numDOFs).fill(0);
  
  // For each time step
  for (let t = 0; t < numSteps; t++) {
    // Base shear
    for (let i = 0; i < numDOFs; i++) {
      baseShear[t] += stiffnessMatrix[0][i] * displacement[t][i];
    }
    
    // Maximum story drift
    for (let i = 0; i < numDOFs - 1; i++) {
      const storyDrift = Math.abs(displacement[t][i+1] - displacement[t][i]);
      if (storyDrift > drifts[i]) {
        drifts[i] = storyDrift;
      }
    }
  }
  
  // Find maximum absolute displacement and acceleration
  let maxDisp = 0;
  let maxAccel = 0;
  
  for (let t = 0; t < numSteps; t++) {
    for (let i = 0; i < numDOFs; i++) {
      maxDisp = Math.max(maxDisp, Math.abs(displacement[t][i]));
      maxAccel = Math.max(maxAccel, Math.abs(acceleration[t][i]));
    }
  }
  
  return {
    time,
    displacement,
    velocity,
    acceleration,
    baseShear,
    maxDrift: drifts,
    maxDisplacement: maxDisp,
    maxAcceleration: maxAccel
  };
}

/**
 * Create a THREE.js visual representation of the building model
 * @param model Structure model
 * @param options Visual options
 * @returns THREE.js object for rendering
 */
export function createBuildingVisualization(
  model: StructureModel,
  options: {
    floorColor?: THREE.Color | string | number;
    columnColor?: THREE.Color | string | number;
    floorOpacity?: number;
    showNodes?: boolean;
    showAxes?: boolean;
    axesScale?: number;
    deformed?: boolean;
    deformationScale?: number;
    response?: StructuralResponse;
    responseStep?: number;
  } = {}
): THREE.Object3D {
  const {
    floorColor = 0x999999,
    columnColor = 0x555555,
    floorOpacity = 0.7,
    showNodes = false,
    showAxes = false,
    axesScale = 1,
    deformed = false,
    deformationScale = 1,
    response,
    responseStep = 0
  } = options;
  
  const { nodeCoordinates, elementConnectivity, properties } = model;
  const { floorDimensions } = properties;
  
  // Function to get node coordinates (original or deformed)
  const getCoordinates = (index: number): THREE.Vector3 => {
    const originalCoord = nodeCoordinates[index];
    
    if (!deformed || !response || !responseStep) {
      return originalCoord.clone();
    }
    
    // Apply deformation if this is a DOF node
    if (index <= model.numDOFs) {
      const displacement = response.displacement[responseStep][index - 1] || 0;
      
      // Apply displacement in x direction (typical lateral direction)
      return new THREE.Vector3(
        originalCoord.x + displacement * deformationScale,
        originalCoord.y,
        originalCoord.z
      );
    }
    
    // For non-DOF nodes like floor corners, find the associated floor
    for (let i = 0; i < model.numDOFs; i++) {
      const floorHeight = (i + 1) * properties.storyHeight;
      
      if (Math.abs(originalCoord.y - floorHeight) < 0.001) {
        // This node is on floor i
        const displacement = response.displacement[responseStep][i] || 0;
        
        // Apply same displacement as the floor center
        return new THREE.Vector3(
          originalCoord.x + displacement * deformationScale,
          originalCoord.y,
          originalCoord.z
        );
      }
    }
    
    return originalCoord.clone();
  };
  
  // Create group to hold all objects
  const group = new THREE.Group();
  
  // Create columns (elements)
  const columns: THREE.Object3D[] = [];
  const columnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(columnColor),
    roughness: 0.7
  });
  
  // Create floor geometries
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(floorColor),
    transparent: true,
    opacity: floorOpacity,
    roughness: 0.6,
    metalness: 0.2
  });
  
  // Process each element
  for (let i = 0; i < elementConnectivity.length; i++) {
    const [node1Index, node2Index] = elementConnectivity[i];
    const start = getCoordinates(node1Index);
    const end = getCoordinates(node2Index);
    
    // Skip floor outline elements for floors
    if (floorDimensions && start.y === end.y && start.y > 0) {
      // This is a floor outline element
      continue;
    }
    
    // Create column cylinder
    const height = start.distanceTo(end);
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    
    // Direction from start to end
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    
    const columnGeometry = new THREE.CylinderGeometry(0.2, 0.2, height, 8);
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    
    // Position and orient cylinder
    column.position.copy(midpoint);
    
    // Align cylinder with direction (default is y-axis)
    const upVector = new THREE.Vector3(0, 1, 0);
    column.quaternion.setFromUnitVectors(upVector, direction);
    
    columns.push(column);
    group.add(column);
  }
  
  // Create floors
  if (floorDimensions) {
    const { width, depth } = floorDimensions;
    
    for (let i = 0; i < properties.numStories; i++) {
      const floorHeight = (i + 1) * properties.storyHeight;
      
      // Calculate displacement for this floor
      let displacementX = 0;
      if (deformed && response && responseStep) {
        displacementX = (response.displacement[responseStep][i] || 0) * deformationScale;
      }
      
      // Create floor plate
      const floorGeometry = new THREE.BoxGeometry(width, 0.3, depth);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      
      floor.position.set(displacementX, floorHeight, 0);
      group.add(floor);
    }
  }
  
  // Add nodes if requested
  if (showNodes) {
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const nodeGeometry = new THREE.SphereGeometry(0.2);
    
    for (let i = 0; i < nodeCoordinates.length; i++) {
      const position = getCoordinates(i);
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.copy(position);
      group.add(nodeMesh);
    }
  }
  
  // Add axes if requested
  if (showAxes) {
    const axesHelper = new THREE.AxesHelper(axesScale);
    group.add(axesHelper);
  }
  
  return group;
}

/**
 * Create an animation function to visualize the dynamic response of a structure
 * @param model Structure model
 * @param response Calculated response
 * @param buildingObject THREE.js object representing the building
 * @param deformationScale Scale factor for visual deformation
 * @returns Animation update function that accepts a time parameter
 */
export function createResponseAnimation(
  model: StructureModel,
  response: StructuralResponse,
  buildingObject: THREE.Object3D,
  deformationScale: number = 10
): (time: number) => void {
  const { time, displacement } = response;
  const duration = time[time.length - 1] - time[0];
  const { numDOFs, properties } = model;
  
  // Find all floor objects
  const floors: THREE.Object3D[] = [];
  const columns: THREE.Object3D[] = [];
  
  buildingObject.traverse((object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh) {
      // Simple heuristic: floors are wider than they are tall
      if (object.geometry instanceof THREE.BoxGeometry) {
        const parameters = object.geometry.parameters;
        if (parameters.width > parameters.height) {
          floors.push(object);
        } else {
          columns.push(object);
        }
      } else if (object.geometry instanceof THREE.CylinderGeometry) {
        columns.push(object);
      }
    }
  });
  
  // Sort floors by height
  floors.sort((a, b) => a.position.y - b.position.y);
  
  // Original positions (for reset)
  const originalPositions = new Map<THREE.Object3D, THREE.Vector3>();
  
  // Store original positions
  floors.forEach(floor => {
    originalPositions.set(floor, floor.position.clone());
  });
  
  columns.forEach(column => {
    originalPositions.set(column, column.position.clone());
  });
  
  // Animation update function
  return (time: number) => {
    // Loop animation
    const loopedTime = time % duration;
    
    // Find closest time points
    let idx = 0;
    while (idx < response.time.length - 1 && response.time[idx + 1] < loopedTime) {
      idx++;
    }
    
    // Interpolate displacements
    const displacements: number[] = [];
    
    for (let i = 0; i < numDOFs; i++) {
      let currentDisplacement;
      
      if (idx < response.time.length - 1) {
        const t1 = response.time[idx];
        const t2 = response.time[idx + 1];
        const d1 = displacement[idx][i];
        const d2 = displacement[idx + 1][i];
        
        const t = (loopedTime - t1) / (t2 - t1);
        currentDisplacement = d1 + t * (d2 - d1);
      } else {
        currentDisplacement = displacement[idx][i];
      }
      
      displacements.push(currentDisplacement * deformationScale);
    }
    
    // Apply displacements to floors
    for (let i = 0; i < Math.min(floors.length, numDOFs); i++) {
      const floor = floors[i];
      const originalPosition = originalPositions.get(floor);
      
      if (originalPosition) {
        floor.position.x = originalPosition.x + displacements[i];
      }
    }
    
    // Update columns (simple approximation)
    columns.forEach(column => {
      const originalPosition = originalPositions.get(column);
      
      if (originalPosition) {
        // Find the closest floors to this column
        const yPos = originalPosition.y;
        let lowerFloorIndex = -1;
        let upperFloorIndex = -1;
        
        for (let i = 0; i < floors.length; i++) {
          if (floors[i].position.y < yPos && (lowerFloorIndex === -1 || 
              floors[i].position.y > floors[lowerFloorIndex].position.y)) {
            lowerFloorIndex = i;
          }
          
          if (floors[i].position.y > yPos && (upperFloorIndex === -1 || 
              floors[i].position.y < floors[upperFloorIndex].position.y)) {
            upperFloorIndex = i;
          }
        }
        
        // Interpolate displacement based on height
        let displacement = 0;
        
        if (lowerFloorIndex >= 0 && upperFloorIndex >= 0) {
          // Interpolate between floors
          const lowerY = floors[lowerFloorIndex].position.y;
          const upperY = floors[upperFloorIndex].position.y;
          const ratio = (yPos - lowerY) / (upperY - lowerY);
          
          const lowerDisp = floors[lowerFloorIndex].position.x - 
                           (originalPositions.get(floors[lowerFloorIndex])?.x || 0);
          const upperDisp = floors[upperFloorIndex].position.x - 
                           (originalPositions.get(floors[upperFloorIndex])?.x || 0);
          
          displacement = lowerDisp + ratio * (upperDisp - lowerDisp);
        } else if (lowerFloorIndex >= 0) {
          // Below all floors, use ground displacement (zero)
          displacement = 0;
        } else if (upperFloorIndex >= 0) {
          // Above all floors, use top floor
          displacement = floors[upperFloorIndex].position.x - 
                        (originalPositions.get(floors[upperFloorIndex])?.x || 0);
        }
        
        // Apply displacement
        column.position.x = originalPosition.x + displacement;
      }
    });
  };
}

export default {
  createShearBuildingModel,
  solveResponseTimeHistory,
  createBuildingVisualization,
  createResponseAnimation
}; 