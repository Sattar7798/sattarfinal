import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Button from '../ui/Button';
import { AnimatedText } from '../layout/AnimatedTransitions';

const Hero = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Three.js objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    // Configure renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create grid of particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position in a grid pattern but with some randomness
      posArray[i] = (Math.random() - 0.5) * 50; // x
      posArray[i + 1] = (Math.random() - 0.5) * 50; // y
      posArray[i + 2] = (Math.random() - 0.5) * 10; // z
      
      // Gradient colors (blue to teal)
      const ratio = i / (particleCount * 3);
      colors[i] = 0.0 + ratio * 0.1; // r
      colors[i + 1] = 0.4 + ratio * 0.2; // g
      colors[i + 2] = 0.8 - ratio * 0.3; // b
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Position camera
    camera.position.z = 30;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particle system slowly
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0007;
      
      // Mouse movement effect
      const time = Date.now() * 0.001;
      particleSystem.position.x = Math.sin(time * 0.5) * 2;
      particleSystem.position.y = Math.cos(time * 0.3) * 2;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Store reference for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particleSystem,
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        
        // Dispose resources
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      }
    };

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full -z-10"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 z-0" />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 mb-4">
            Dr. Sattar Hedayat
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
            Structural Engineer & AI Researcher
          </h2>
        </motion.div>
        
        <AnimatedText
          text="Pioneering the Integration of Artificial Intelligence with Structural Engineering for Enhanced Building Safety and Optimization"
          tag="p"
          className="text-lg md:text-xl max-w-3xl mb-8 text-gray-600 dark:text-gray-400"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Button
            href="/research"
            size="lg"
            variant="gradient"
            className="px-8"
          >
            Explore Research
          </Button>
          <Button
            href="/interactive-model"
            size="lg"
            variant="primary"
            isOutlined
            className="px-8"
          >
            Interactive Models
          </Button>
        </motion.div>
        
        {/* Highlight Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl"
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-5xl font-bold text-blue-600 mb-2">15+</h3>
            <p className="text-gray-600 dark:text-gray-400">Years of Experience</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-5xl font-bold text-emerald-600 mb-2">50+</h3>
            <p className="text-gray-600 dark:text-gray-400">Published Research Papers</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-5xl font-bold text-purple-600 mb-2">20+</h3>
            <p className="text-gray-600 dark:text-gray-400">AI-Enhanced Building Projects</p>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
            <svg 
              className="w-6 h-6 text-gray-500 dark:text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 