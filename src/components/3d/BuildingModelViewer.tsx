import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// Model component that loads and displays the 3D building
function BuildingModel({ modelPath, position = [0, 0, 0], scale = 1 }: {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Simple animation - gentle floating rotation
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <primitive 
      ref={ref}
      object={scene} 
      position={position}
      scale={scale}
    />
  );
}

// Main viewer component with controls
const BuildingModelViewer: React.FC<{
  modelPath: string;
  className?: string;
  backgroundColor?: string;
}> = ({ 
  modelPath = '/models/building-model.glb', 
  className = '', 
  backgroundColor = '#f0f0f0'
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  
  return (
    <div className={`relative h-[500px] w-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 45 }}
        style={{ background: backgroundColor }}
      >
        <Suspense fallback={null}>
          <BuildingModel 
            modelPath={modelPath} 
            position={[0, -1, 0]} 
            scale={0.5} 
          />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls UI */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded-md">
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        </button>
      </div>
    </div>
  );
};

export default BuildingModelViewer; 