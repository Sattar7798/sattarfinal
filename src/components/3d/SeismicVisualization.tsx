import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

// Building that reacts to seismic waves
function SeismicBuilding({ 
  position = [0, 0, 0], 
  intensity = 0.5, 
  frequency = 1,
  modelPath = '/models/building-model.glb'
}: {
  position?: [number, number, number];
  intensity?: number;
  frequency?: number;
  modelPath?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Clone and process the model to make it suitable for seismic simulation
  const processedModel = React.useMemo(() => {
    const clonedScene = scene.clone();
    // Process model for seismic simulation if needed
    return clonedScene;
  }, [scene]);
  
  // Apply seismic movement animation
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      
      // Horizontal movement (represents seismic waves)
      ref.current.position.x = position[0] + Math.sin(time * frequency) * intensity * 0.5;
      
      // Slight rotation to simulate building response
      ref.current.rotation.z = Math.sin(time * frequency * 1.2) * intensity * 0.1;
      
      // Small vertical movement
      ref.current.position.y = position[1] + Math.abs(Math.sin(time * frequency * 0.8)) * intensity * 0.2;
    }
  });
  
  return (
    <primitive 
      ref={ref}
      object={processedModel} 
      position={position}
      scale={0.4}
    />
  );
}

// Ground plane with ripple effect for seismic waves
function SeismicGround({ intensity = 0.5, frequency = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry] = useState(() => new THREE.PlaneGeometry(20, 20, 32, 32));
  
  // Animate the ground to visualize seismic waves
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const position = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const distance = Math.sqrt(x * x + y * y);
        
        // Create ripple effect originating from center
        const z = Math.sin(distance * 0.5 - time * frequency * 2) * intensity * 0.15;
        position.setZ(i, z);
      }
      
      position.needsUpdate = true;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        color="#444" 
        roughness={0.7}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

// Main seismic visualization component
const SeismicVisualization: React.FC<{
  className?: string;
  initialIntensity?: number;
}> = ({ 
  className = '', 
  initialIntensity = 0.5 
}) => {
  const [intensity, setIntensity] = useState(initialIntensity);
  const [frequency, setFrequency] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setIntensity(0.1);
      }, 15000); // Earthquake lasts 15 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);
  
  const startEarthquake = () => {
    setIsAnimating(true);
    setIntensity(initialIntensity);
    setFrequency(1.5);
  };
  
  return (
    <div className={`relative h-[600px] w-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 45 }}
        style={{ background: '#111' }}
      >
        <Suspense fallback={null}>
          <SeismicBuilding 
            intensity={isAnimating ? intensity : 0.05} 
            frequency={frequency}
          />
          <SeismicGround 
            intensity={isAnimating ? intensity : 0.1} 
            frequency={frequency}
          />
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate={!isAnimating}
            autoRotateSpeed={0.5}
          />
          
          {/* Add magnitude indicator text */}
          {isAnimating && (
            <Text
              position={[0, 4, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {`Magnitude: ${(intensity * 10).toFixed(1)}`}
            </Text>
          )}
        </Suspense>
      </Canvas>
      
      {/* Controls UI */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 p-4 rounded-md flex flex-col gap-2">
        <h3 className="text-white text-xl mb-2">Seismic Simulation</h3>
        <div className="flex justify-between items-center">
          <span className="text-white mr-2">Intensity:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            disabled={isAnimating}
            className="w-48"
          />
          <span className="text-white ml-2">{(intensity * 10).toFixed(1)}</span>
        </div>
        <button 
          onClick={startEarthquake}
          disabled={isAnimating}
          className={`px-4 py-2 rounded text-white transition-colors ${
            isAnimating 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isAnimating ? 'Earthquake in progress...' : 'Start Earthquake Simulation'}
        </button>
      </div>
      
      {/* Overlay for earthquake magnitude */}
      {isAnimating && (
        <motion.div 
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-bold">Magnitude {(intensity * 10).toFixed(1)}</p>
          <p>Simulated Earthquake</p>
        </motion.div>
      )}
    </div>
  );
};

export default SeismicVisualization; 