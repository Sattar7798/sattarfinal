import React, { useRef, useEffect, ReactNode, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  children: ReactNode;
  className?: string;
  enableOrbitControls?: boolean;
  enableStats?: boolean;
  backgroundColor?: string | THREE.Color;
  environmentPreset?: 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  shadows?: boolean;
  gridHelper?: boolean;
  axesHelper?: boolean;
  showPerformanceMonitor?: boolean;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
  directionalLightPosition?: [number, number, number];
  fog?: boolean;
  fogColor?: string;
  fogDensity?: number;
  skybox?: boolean;
  dpr?: number | [number, number];
}

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black bg-opacity-50 p-4 rounded-lg text-white">
        <div className="w-24 h-1 bg-gray-700 rounded-full mb-2 overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
          />
        </div>
        <span className="text-sm">{progress.toFixed(0)}% loaded</span>
      </div>
    </Html>
  );
}

// Scene setup component
const SceneSetup: React.FC<{
  gridHelper?: boolean;
  axesHelper?: boolean;
  fog?: boolean;
  fogColor?: string;
  fogDensity?: number;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
  directionalLightPosition?: [number, number, number];
}> = ({
  gridHelper = false,
  axesHelper = false,
  fog = false,
  fogColor = '#f0f0f0',
  fogDensity = 0.02,
  ambientLightIntensity = 0.5,
  directionalLightIntensity = 0.8,
  directionalLightPosition = [5, 10, 5],
}) => {
  const sceneRef = useRef<THREE.Scene>(null);
  
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Set up fog if needed
    if (fog) {
      sceneRef.current.fog = new THREE.FogExp2(
        new THREE.Color(fogColor),
        fogDensity
      );
    } else {
      sceneRef.current.fog = null;
    }
  }, [fog, fogColor, fogDensity]);
  
  return (
    <>
      <scene ref={sceneRef} />
      
      {/* Lights */}
      <ambientLight intensity={ambientLightIntensity} />
      <directionalLight 
        position={directionalLightPosition} 
        intensity={directionalLightIntensity} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Helpers */}
      {gridHelper && <gridHelper args={[10, 10, '#888888', '#444444']} />}
      {axesHelper && <axesHelper args={[5]} />}
    </>
  );
};

const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  className = '',
  enableOrbitControls = true,
  enableStats = false,
  backgroundColor = '#f0f0f0',
  environmentPreset = 'city',
  cameraPosition = [5, 5, 5],
  cameraFov = 75,
  shadows = true,
  gridHelper = false,
  axesHelper = false,
  showPerformanceMonitor = false,
  ambientLightIntensity = 0.5,
  directionalLightIntensity = 0.8,
  directionalLightPosition = [5, 10, 5],
  fog = false,
  fogColor = '#f0f0f0',
  fogDensity = 0.02,
  skybox = false,
  dpr = [1, 2],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows={shadows}
        camera={{ 
          position: cameraPosition, 
          fov: cameraFov,
          near: 0.1,
          far: 1000
        }}
        dpr={dpr}
        gl={{ 
          antialias: true,
          alpha: true,
          logarithmicDepthBuffer: true,
        }}
        style={{ 
          background: backgroundColor instanceof THREE.Color 
            ? `rgb(${backgroundColor.r * 255},${backgroundColor.g * 255},${backgroundColor.b * 255})` 
            : backgroundColor
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color(backgroundColor));
          // @ts-ignore - Handle both older and newer versions of Three.js
          if (gl.useLegacyLights !== undefined) {
            // @ts-ignore - For Three.js r138+
            gl.useLegacyLights = false;
          } else {
            // @ts-ignore - For older Three.js versions
            gl.physicallyCorrectLights = true;
          }
        }}
      >
        {isLoading && <Loader />}
        
        <SceneSetup
          gridHelper={gridHelper}
          axesHelper={axesHelper}
          fog={fog}
          fogColor={fogColor}
          fogDensity={fogDensity}
          ambientLightIntensity={ambientLightIntensity}
          directionalLightIntensity={directionalLightIntensity}
          directionalLightPosition={directionalLightPosition}
        />
        
        {skybox && <Environment preset={environmentPreset} background={skybox} />}
        {!skybox && <Environment preset={environmentPreset} />}
        
        {children}
        
        {enableOrbitControls && (
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={100}
            enablePan={true}
            enableZoom={true}
          />
        )}
        
        {enableStats && <Stats />}
      </Canvas>
    </div>
  );
};

export default ThreeScene; 