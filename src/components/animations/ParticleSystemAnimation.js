import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleSystemAnimation component for creating various particle effects
 * This component can be configured to create different types of particles:
 * - dust: slow moving particles floating in space
 * - smoke: rising particles that fade out
 * - fluid: particles that flow and interact like a fluid
 * - sparkle: bright particles that twinkle and fade
 * - rain: falling particles
 * - snow: slowly falling particles with random movement
 */
const ParticleSystemAnimation = ({
  type = 'dust',
  count = 1000,
  color = '#ffffff',
  size = 0.05,
  speed = 1,
  opacity = 0.7,
  spread = 10,
  width = '100%',
  height = '300px',
  interactive = false,
  className = '',
  background = 'transparent',
  direction = { x: 0, y: 1, z: 0 }, // Default upward for smoke
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Initialize and setup the particle system
  useEffect(() => {
    if (!containerRef.current) return;

    // Create basic Three.js setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: background === 'transparent',
      antialias: true
    });

    // Configure renderer
    renderer.setSize(width, height);
    renderer.setClearColor(background === 'transparent' ? 0x000000 : background, background === 'transparent' ? 0 : 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Position camera
    camera.position.z = 5;

    // Create particle system
    const particleSystem = createParticleSystem(type, count, color, size, opacity, spread, direction);
    scene.add(particleSystem);

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

    // Handle mouse movement for interactive mode
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: ((event.clientX - rect.left) / width) * 2 - 1,
        y: -((event.clientY - rect.top) / height) * 2 + 1
      };
    };

    if (interactive) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      
      // Update particles based on type
      switch (type) {
        case 'dust':
          updateDustParticles(particleSystem, delta * speed);
          break;
        case 'smoke':
          updateSmokeParticles(particleSystem, delta * speed);
          break;
        case 'fluid':
          updateFluidParticles(particleSystem, delta * speed, mousePosition.current, interactive);
          break;
        case 'sparkle':
          updateSparkleParticles(particleSystem, delta * speed);
          break;
        case 'rain':
          updateRainParticles(particleSystem, delta * speed);
          break;
        case 'snow':
          updateSnowParticles(particleSystem, delta * speed);
          break;
        default:
          updateDustParticles(particleSystem, delta * speed);
      }

      renderer.render(scene, camera);
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Store references for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particleSystem,
      animationFrameId: null,
      cleanup: () => {
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize', handleResize);
        if (interactive && containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
        particleSystem.geometry.dispose();
        particleSystem.material.dispose();
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
    };

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, [type, count, color, size, speed, opacity, spread, background, interactive, direction]);

  // Create particle system based on type
  const createParticleSystem = (type, count, color, size, opacity, spread, direction) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifespans = new Float32Array(count);
    
    const colorObj = new THREE.Color(color);
    
    // Generate initial particles based on type
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Common positioning with spread
      let posX, posY, posZ;
      
      // Different initialization strategies based on particle type
      switch (type) {
        case 'dust':
          // Random distribution in a sphere
          posX = (Math.random() - 0.5) * spread;
          posY = (Math.random() - 0.5) * spread;
          posZ = (Math.random() - 0.5) * spread;
          // Slow random movement
          velocities[i3] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
          break;
          
        case 'smoke':
          // Start at bottom with some spread
          posX = (Math.random() - 0.5) * spread * 0.5;
          posY = -spread / 2 + Math.random() * 2; // Start near bottom
          posZ = (Math.random() - 0.5) * spread * 0.5;
          // Upward movement with some randomness
          velocities[i3] = (Math.random() - 0.5) * 0.05;
          velocities[i3 + 1] = 0.05 + Math.random() * 0.05; // Upward
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
          break;
          
        case 'fluid':
          // Start in a more concentrated area
          posX = (Math.random() - 0.5) * spread * 0.8;
          posY = (Math.random() - 0.5) * spread * 0.8;
          posZ = (Math.random() - 0.5) * spread * 0.3;
          // Minimal initial velocity
          velocities[i3] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
          break;
          
        case 'sparkle':
          // Random distribution
          posX = (Math.random() - 0.5) * spread;
          posY = (Math.random() - 0.5) * spread;
          posZ = (Math.random() - 0.5) * spread;
          // No initial velocity
          velocities[i3] = 0;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = 0;
          break;
          
        case 'rain':
          // Start above with horizontal spread
          posX = (Math.random() - 0.5) * spread;
          posY = spread / 2 + Math.random() * 5;
          posZ = (Math.random() - 0.5) * spread * 0.5;
          // Downward fast movement
          velocities[i3] = 0;
          velocities[i3 + 1] = -0.15 - Math.random() * 0.1;
          velocities[i3 + 2] = 0;
          break;
          
        case 'snow':
          // Start above with horizontal spread
          posX = (Math.random() - 0.5) * spread;
          posY = spread / 2 + Math.random() * 5;
          posZ = (Math.random() - 0.5) * spread * 0.5;
          // Slow downward with sideways drift
          velocities[i3] = (Math.random() - 0.5) * 0.03;
          velocities[i3 + 1] = -0.02 - Math.random() * 0.02;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.03;
          break;
          
        default:
          posX = (Math.random() - 0.5) * spread;
          posY = (Math.random() - 0.5) * spread;
          posZ = (Math.random() - 0.5) * spread;
          velocities[i3] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      }
      
      positions[i3] = posX;
      positions[i3 + 1] = posY;
      positions[i3 + 2] = posZ;
      
      // Randomly vary particle size
      sizes[i] = size * (0.5 + Math.random());
      
      // For things like smoke and sparkles, have varying lifespans
      lifespans[i] = type === 'smoke' || type === 'sparkle' || type === 'rain' 
        ? Math.random() * 1.0
        : 1.0;
      
      // Set particle color (slightly vary the color)
      colors[i3] = colorObj.r * (0.9 + Math.random() * 0.2);
      colors[i3 + 1] = colorObj.g * (0.9 + Math.random() * 0.2);
      colors[i3 + 2] = colorObj.b * (0.9 + Math.random() * 0.2);
    }
    
    // Set geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifespans, 1));
    
    // Create shader material for the particles
    const material = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    // Create point cloud
    return new THREE.Points(geometry, material);
  };

  // Update functions for different particle types
  const updateDustParticles = (particles, delta) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const count = positions.length / 3;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3] * delta * 10;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 10;
      
      // Add slight random drift
      velocities[i3] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;
      
      // Contain particles within bounds
      if (Math.abs(positions[i3]) > spread / 2) {
        velocities[i3] *= -0.5;
      }
      if (Math.abs(positions[i3 + 1]) > spread / 2) {
        velocities[i3 + 1] *= -0.5;
      }
      if (Math.abs(positions[i3 + 2]) > spread / 2) {
        velocities[i3 + 2] *= -0.5;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.velocity.needsUpdate = true;
  };

  const updateSmokeParticles = (particles, delta) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const lifespans = particles.geometry.attributes.lifespan.array;
    const colors = particles.geometry.attributes.color.array;
    const count = positions.length / 3;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Decrease lifespan
      lifespans[i] -= delta * 0.2;
      
      // Apply velocity with slight randomness
      positions[i3] += velocities[i3] * delta * 10;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 10;
      
      // Add turbulence
      velocities[i3] += (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] += Math.random() * 0.01; // Upward bias
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.01;
      
      // Fade out as lifespan decreases
      const fade = Math.max(0, lifespans[i]);
      colors[i3 + 0] *= 0.99;
      colors[i3 + 1] *= 0.99;
      colors[i3 + 2] *= 0.99;
      
      // Reset if dead
      if (lifespans[i] <= 0) {
        // Reset position to bottom
        positions[i3] = (Math.random() - 0.5) * spread * 0.5;
        positions[i3 + 1] = -spread / 2 + Math.random() * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
        
        // Reset velocity
        velocities[i3] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 1] = 0.05 + Math.random() * 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
        
        // Reset lifespan
        lifespans[i] = Math.random() * 1.0;
        
        // Reset color
        const colorObj = new THREE.Color(color);
        colors[i3] = colorObj.r * (0.9 + Math.random() * 0.2);
        colors[i3 + 1] = colorObj.g * (0.9 + Math.random() * 0.2);
        colors[i3 + 2] = colorObj.b * (0.9 + Math.random() * 0.2);
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.velocity.needsUpdate = true;
    particles.geometry.attributes.lifespan.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
  };

  const updateFluidParticles = (particles, delta, mousePos, interactive) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const count = positions.length / 3;
    
    // Create a force at mouse position if interactive
    let forceX = 0, forceY = 0, forceZ = 0;
    
    if (interactive) {
      forceX = mousePos.x * 5;
      forceY = mousePos.y * 5;
    }
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3] * delta * 10;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 10;
      
      // Calculate direction to the force
      const dx = forceX - positions[i3];
      const dy = forceY - positions[i3 + 1];
      const dz = forceZ - positions[i3 + 2];
      
      // Calculate distance (squared for efficiency)
      const distSq = dx * dx + dy * dy + dz * dz;
      
      // If close enough, add attraction force
      if (interactive && distSq < 10) {
        const dist = Math.sqrt(distSq);
        const forceMagnitude = 0.05 / (dist + 0.1);
        
        velocities[i3] += (dx / dist) * forceMagnitude;
        velocities[i3 + 1] += (dy / dist) * forceMagnitude;
        velocities[i3 + 2] += (dz / dist) * forceMagnitude;
      }
      
      // Add some random movement
      velocities[i3] += (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.002;
      
      // Apply fluid-like dampening
      velocities[i3] *= 0.99;
      velocities[i3 + 1] *= 0.99;
      velocities[i3 + 2] *= 0.99;
      
      // Contain particles within bounds
      if (Math.abs(positions[i3]) > spread) {
        velocities[i3] *= -0.5;
        positions[i3] = Math.sign(positions[i3]) * spread;
      }
      if (Math.abs(positions[i3 + 1]) > spread) {
        velocities[i3 + 1] *= -0.5;
        positions[i3 + 1] = Math.sign(positions[i3 + 1]) * spread;
      }
      if (Math.abs(positions[i3 + 2]) > spread / 2) {
        velocities[i3 + 2] *= -0.5;
        positions[i3 + 2] = Math.sign(positions[i3 + 2]) * spread / 2;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.velocity.needsUpdate = true;
  };

  const updateSparkleParticles = (particles, delta) => {
    const colors = particles.geometry.attributes.color.array;
    const lifespans = particles.geometry.attributes.lifespan.array;
    const sizes = particles.geometry.attributes.size.array;
    const count = colors.length / 3;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update lifespan
      lifespans[i] -= delta * 0.5;
      
      if (lifespans[i] <= 0) {
        // Reset lifespan
        lifespans[i] = Math.random();
        
        // Randomize sizes for twinkling effect
        sizes[i] = size * (0.2 + Math.random() * 1.5);
        
        // Reset color to bright
        const colorObj = new THREE.Color(color);
        colors[i3] = colorObj.r;
        colors[i3 + 1] = colorObj.g;
        colors[i3 + 2] = colorObj.b;
      } else {
        // Fade out gradually
        const fadeRate = 0.95 + Math.random() * 0.05;
        colors[i3] *= fadeRate;
        colors[i3 + 1] *= fadeRate;
        colors[i3 + 2] *= fadeRate;
      }
    }
    
    particles.geometry.attributes.color.needsUpdate = true;
    particles.geometry.attributes.lifespan.needsUpdate = true;
    particles.geometry.attributes.size.needsUpdate = true;
  };

  const updateRainParticles = (particles, delta) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const count = positions.length / 3;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3] * delta * 20;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 20;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 20;
      
      // Reset if below the boundary
      if (positions[i3 + 1] < -spread / 2) {
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = spread / 2 + Math.random() * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
  };

  const updateSnowParticles = (particles, delta) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const count = positions.length / 3;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3] * delta * 10;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 10;
      
      // Add gentle wind effect
      velocities[i3] += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.0005;
      
      // Reset if below the boundary
      if (positions[i3 + 1] < -spread / 2) {
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = spread / 2 + Math.random() * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
        
        // Reset velocity
        velocities[i3] = (Math.random() - 0.5) * 0.03;
        velocities[i3 + 1] = -0.02 - Math.random() * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.03;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.velocity.needsUpdate = true;
  };

  return (
    <div
      ref={containerRef}
      className={`particle-animation ${className}`}
      style={{ width, height, position: 'relative', overflow: 'hidden', ...style }}
      {...props}
    />
  );
};

export default ParticleSystemAnimation; 