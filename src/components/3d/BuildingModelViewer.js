import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { useThree } from '../../hooks/useThreeJS';

/**
 * Simplified BuildingModelViewer component
 * Renders a basic 3D building model without requiring external model files
 */
const BuildingModelViewer = ({
  width = '100%',
  height = '600px',
  backgroundColor = '#f5f5f5',
  className = '',
}) => {
  // Refs for container and scene elements
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Three.js scene
    let scene, camera, renderer, controls, building;
    
    try {
      // Initialize Three.js scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);
      
      // Get container dimensions
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Create camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(15, 15, 15);
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      
      // Add to container
      container.appendChild(renderer.domElement);
      
      // Create controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = 50;
      
      // Create simple building model
      building = createBuildingModel();
      scene.add(building);
      
      // Center the building
      building.position.y = 5; // Raise slightly to show the ground
      
      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      scene.add(directionalLight);
      
      // Add some point lights for better illumination
      const pointLight1 = new THREE.PointLight(0xffffcc, 0.5);
      pointLight1.position.set(-10, 15, 10);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xccffff, 0.5);
      pointLight2.position.set(10, 15, -10);
      scene.add(pointLight2);
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (controls) controls.update();
        
        // Optional: add gentle rotation to the building
        if (building) {
          building.rotation.y += 0.001;
        }
        
        renderer.render(scene, camera);
      };
      
      animate();
      setIsLoading(false);
      
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
      
      // Clean up on unmount
      return () => {
        if (container && renderer && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        
        window.removeEventListener('resize', handleResize);
        
        // Dispose resources
        if (scene) {
          scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }
        
        if (renderer) renderer.dispose();
        if (controls) controls.dispose();
      };
      
    } catch (err) {
      console.error("Three.js error:", err);
      setError("Failed to initialize 3D viewer. Please check browser compatibility.");
      setIsLoading(false);
    }
  }, [backgroundColor]);
  
  // Create a simple building model
  const createBuildingModel = () => {
    const buildingGroup = new THREE.Group();
    
    // Building parameters
    const numFloors = 10;
    const floorWidth = 10;
    const floorDepth = 10;
    const floorHeight = 1;
    const columnRadius = 0.4;
    const columnHeight = floorHeight * 0.9;
    
    // Materials
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x90cdf4,
      metalness: 0.2,
      roughness: 0.1
    });
    
    const columnMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2563eb,
      metalness: 0.3,
      roughness: 0.2
    });
    
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.1,
      roughness: 0.5
    });
    
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xadd8e6,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.4,
      transmission: 0.5
    });
    
    // Create foundation
    const foundationGeometry = new THREE.BoxGeometry(floorWidth + 2, floorHeight * 1.5, floorDepth + 2);
    const foundation = new THREE.Mesh(foundationGeometry, new THREE.MeshStandardMaterial({ 
      color: 0x1e40af,
      metalness: 0.2,
      roughness: 0.8
    }));
    foundation.position.y = -floorHeight * 0.75;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    buildingGroup.add(foundation);
    
    // Create floors and structural elements
    for (let floor = 0; floor < numFloors; floor++) {
      const floorY = floor * floorHeight;
      
      // Create floor slab
      const floorGeometry = new THREE.BoxGeometry(floorWidth, floorHeight * 0.2, floorDepth);
      const floorSlab = new THREE.Mesh(floorGeometry, floorMaterial);
      floorSlab.position.y = floorY;
      floorSlab.castShadow = true;
      floorSlab.receiveShadow = true;
      buildingGroup.add(floorSlab);
      
      // Create core (central shaft)
      if (floor < numFloors - 1) {
        const coreSize = floorWidth * 0.2;
        const coreGeometry = new THREE.BoxGeometry(coreSize, floorHeight, coreSize);
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = floorY + floorHeight * 0.5;
        core.castShadow = true;
        core.receiveShadow = true;
        buildingGroup.add(core);
      }
      
      // Create columns
      if (floor < numFloors - 1) {
        const columnPositions = [
          [-floorWidth * 0.4, floorY + floorHeight * 0.5, -floorDepth * 0.4],
          [floorWidth * 0.4, floorY + floorHeight * 0.5, -floorDepth * 0.4],
          [-floorWidth * 0.4, floorY + floorHeight * 0.5, floorDepth * 0.4],
          [floorWidth * 0.4, floorY + floorHeight * 0.5, floorDepth * 0.4]
        ];
        
        columnPositions.forEach(position => {
          const columnGeometry = new THREE.CylinderGeometry(columnRadius, columnRadius, columnHeight, 8);
          const column = new THREE.Mesh(columnGeometry, columnMaterial);
          column.position.set(...position);
          column.castShadow = true;
          column.receiveShadow = true;
          buildingGroup.add(column);
        });
      }
      
      // Create glass facade panels
      if (floor < numFloors - 1) {
        // Front panel
        const frontGlassGeometry = new THREE.PlaneGeometry(floorWidth * 0.9, floorHeight * 0.9);
        const frontGlass = new THREE.Mesh(frontGlassGeometry, glassMaterial);
        frontGlass.position.set(0, floorY + floorHeight * 0.5, floorDepth * 0.5);
        frontGlass.castShadow = true;
        buildingGroup.add(frontGlass);
        
        // Back panel
        const backGlass = frontGlass.clone();
        backGlass.position.z = -floorDepth * 0.5;
        backGlass.rotation.y = Math.PI;
        buildingGroup.add(backGlass);
        
        // Left panel
        const leftGlassGeometry = new THREE.PlaneGeometry(floorDepth * 0.9, floorHeight * 0.9);
        const leftGlass = new THREE.Mesh(leftGlassGeometry, glassMaterial);
        leftGlass.position.set(-floorWidth * 0.5, floorY + floorHeight * 0.5, 0);
        leftGlass.rotation.y = Math.PI * 0.5;
        leftGlass.castShadow = true;
        buildingGroup.add(leftGlass);
        
        // Right panel
        const rightGlass = leftGlass.clone();
        rightGlass.position.x = floorWidth * 0.5;
        rightGlass.rotation.y = -Math.PI * 0.5;
        buildingGroup.add(rightGlass);
      }
    }
    
    // Create roof
    const roofGeometry = new THREE.BoxGeometry(floorWidth, floorHeight * 0.3, floorDepth);
    const roof = new THREE.Mesh(roofGeometry, floorMaterial);
    roof.position.y = numFloors * floorHeight;
    roof.castShadow = true;
    roof.receiveShadow = true;
    buildingGroup.add(roof);
    
    // Position the whole building so the bottom is at y=0
    buildingGroup.position.y = floorHeight * 0.1;
    
    return buildingGroup;
  };

  return (
    <div
      className={`building-model-viewer ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor
      }}
    >
      {/* 3D model container */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontSize: '18px'
          }}
        >
          <div>
            <div
              style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 2s linear infinite',
                margin: '0 auto 10px'
              }}
            />
            <p>Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '18px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div>
            <p style={{ marginBottom: '10px' }}>Error: {error}</p>
            <p style={{ fontSize: '14px' }}>
              Try using a modern browser with WebGL support.
            </p>
          </div>
        </div>
      )}
      
      {/* Info overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333',
          pointerEvents: 'none'
        }}
      >
        Drag to rotate | Scroll to zoom
      </div>
    </div>
  );
};

export default BuildingModelViewer; 