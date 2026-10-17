import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  stoneAuraColor?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseVy: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
  isEmber: boolean;
  size: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ stoneAuraColor = '#D4A72C' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle Palette inspired by Canva charter (gold, ember, cosmic violet, celestial blue)
    const emberColors = ['#D4A72C', '#F6CC78', '#D96A32', '#FF9F43', '#E056FD', '#35B9FF'];

    // Adaptive particle count for silky-smooth 60fps/120fps performance on mobile
    const isMobile = width < 768;
    const particleCount = isMobile ? 26 : Math.min(80, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isEmber = Math.random() > 0.45;
      const size = isEmber ? Math.random() * 2.2 + 0.8 : Math.random() * 1.4 + 0.3;
      const maxAlpha = isEmber ? Math.random() * 0.5 + 0.3 : Math.random() * 0.4 + 0.15;
      const vy = isEmber ? -(Math.random() * 0.45 + 0.15) : (Math.random() - 0.5) * 0.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: size,
        size,
        vx: (Math.random() - 0.5) * 0.3,
        vy,
        baseVy: vy,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        isEmber,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;

      if (!isMobile) {
        // Smooth mouse lerp on desktop only
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Particles with gentle upward drift (embers) and twinkling stars
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds with smooth reset
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.y > height + 15) p.y = 0;

        // Pulsing luminescence
        p.alpha = Math.max(0.05, Math.min(p.maxAlpha, (Math.sin(frame * p.pulseSpeed + p.pulseOffset) + 1) * 0.5 * p.maxAlpha));

        // Subtle mouse push interaction (desktop only)
        if (!isMobile) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140 && dist > 0) {
            const force = (1 - dist / 140) * 0.8;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isEmber ? p.color : '#FFFFFF';
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Ember Soft Halo Glow for larger embers
        if (p.isEmber && p.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [stoneAuraColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
