import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemAnimationProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  velocityFactor?: number;
  forceDirection?: 'radial' | 'directional' | 'vortex';
  forceStrength?: number;
  type?: 'centered' | 'repel' | 'orbit';
  mousePosition?: { x: number | null; y: number | null };
  showConnections?: boolean;
  connectionDistance?: number;
  maxConnectionOpacity?: number;
}

const ParticleSystemAnimation: React.FC<ParticleSystemAnimationProps> = ({
  className = '',
  particleCount = 150,
  particleColor = '#4287f5',
  velocityFactor = 1.5,
  forceDirection = 'directional',
  forceStrength = 1.0,
  type,
  mousePosition,
  showConnections = false,
  connectionDistance = 50,
  maxConnectionOpacity = 0.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeObserver = new ResizeObserver(() => {
      if (canvas) {
        setupCanvas(canvas);
      }
    });

    resizeObserver.observe(canvas);
    setupCanvas(canvas);

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
    }> = [];

    // Set up the canvas dimensions
    function setupCanvas(canvas: HTMLCanvasElement) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Initialize particles
      initParticles();
    }

    // Initialize all particles
    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1;
        particles.push({
          x: canvas ? Math.random() * canvas.width : 0,
          y: canvas ? Math.random() * canvas.height : 0,
          vx: (Math.random() - 0.5) * velocityFactor,
          vy: (Math.random() - 0.5) * velocityFactor,
          size,
          color: particleColor,
          opacity: Math.random() * 0.6 + 0.2,
          life: 0,
          maxLife: Math.random() * 100 + 50
        });
      }
    }

    // Apply force to particles based on direction type
    function applyForce(particle: typeof particles[0]) {
      switch (forceDirection) {
        case 'radial': {
          // Force away from center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            const forceX = (dx / distance) * forceStrength * 0.1;
            const forceY = (dy / distance) * forceStrength * 0.1;
            particle.vx += forceX;
            particle.vy += forceY;
          }
          break;
        }
        case 'directional': {
          // Force in one direction (downward and to the right)
          particle.vx += 0.01 * forceStrength;
          particle.vy += 0.01 * forceStrength;
          break;
        }
        case 'vortex': {
          // Vortex-like rotational force
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            // Tangential force
            const forceX = -dy / distance * forceStrength * 0.1;
            const forceY = dx / distance * forceStrength * 0.1;
            particle.vx += forceX;
            particle.vy += forceY;
            
            // Small radial force to prevent particles from escaping too far
            const radialForceX = -dx / distance * forceStrength * 0.01;
            const radialForceY = -dy / distance * forceStrength * 0.01;
            particle.vx += radialForceX;
            particle.vy += radialForceY;
          }
          break;
        }
      }
    }

    // Update particle positions and properties
    function updateParticles() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        applyForce(p);
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply some friction
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Increment life
        p.life++;
        
        // Reset particle if it's dead or outside the canvas
        if (p.life > p.maxLife || 
            p.x < -50 || p.x > canvas.width + 50 || 
            p.y < -50 || p.y > canvas.height + 50) {
          
          // Reset position
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          
          // Reset velocity
          p.vx = (Math.random() - 0.5) * velocityFactor;
          p.vy = (Math.random() - 0.5) * velocityFactor;
          
          // Reset life
          p.life = 0;
          p.maxLife = Math.random() * 100 + 50;
        }

        // Add attraction or repulsion effect
        if (type === 'centered') {
          const centerX = canvas ? canvas.width / 2 : 0;
          const centerY = canvas ? canvas.height / 2 : 0;
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            p.vx += dx / distance * 0.02;
            p.vy += dy / distance * 0.02;
          }
        } else if (type === 'repel') {
          const mouseX = mousePosition?.x;
          const mouseY = mousePosition?.y;
          
          if (mouseX !== null && mouseY !== null) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              p.vx += dx / distance * 0.1;
              p.vy += dy / distance * 0.1;
            }
          }
        } else if (type === 'orbit') {
          const centerX = canvas ? canvas.width / 2 : 0;
          const centerY = canvas ? canvas.height / 2 : 0;
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Tangential velocity for orbit effect
          p.vx += -dy / distance * 0.01;
          p.vy += dx / distance * 0.01;
          
          // Small attraction to keep particles from flying away
          p.vx += dx / distance * 0.001;
          p.vy += dy / distance * 0.001;
        }
      }
    }

    // Draw all particles
    function drawParticles() {
      // Clear the canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw connections between particles
      if (showConnections && ctx) {
        particles.forEach((p, index) => {
          // Draw connections to nearby particles
          for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
              const lineOpacity = (1 - distance / connectionDistance) * maxConnectionOpacity * p.opacity * p2.opacity;
              
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = lineOpacity;
              ctx.stroke();
            }
          }
        });
      }
      
      // Reset global alpha
      if (ctx) {
        ctx.globalAlpha = 1;
      }
    }

    // Animation loop
    function animate() {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    }
    
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [particleCount, particleColor, velocityFactor, forceDirection, forceStrength, type, mousePosition, showConnections, connectionDistance, maxConnectionOpacity]);

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
};

export default ParticleSystemAnimation; 