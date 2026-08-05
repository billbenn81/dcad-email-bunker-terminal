import React, { useEffect, useRef } from 'react';

interface AmbientDustProps {
  lightIntensity?: number;
}

export const AmbientDust: React.FC<AmbientDustProps> = ({ lightIntensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = 65;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.15 - 0.05, // slow upward drift
      alpha: Math.random() * 0.6 + 0.1,
      flickerSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render spotlight cone gradient glow from top center
      const spotlightX = width / 2;
      const spotlightY = 0;
      const spotlightRadius = Math.max(width, height) * 0.6;

      const spotGrad = ctx.createRadialGradient(
        spotlightX,
        spotlightY,
        10,
        spotlightX,
        spotlightY + 100,
        spotlightRadius
      );
      spotGrad.addColorStop(0, `rgba(255, 230, 180, ${0.08 * lightIntensity})`);
      spotGrad.addColorStop(0.3, `rgba(230, 200, 150, ${0.03 * lightIntensity})`);
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // Render dust motes
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.flickerSpeed) * 0.005;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Calculate proximity to spotlight center for enhanced brightness
        const dx = p.x - spotlightX;
        const dy = p.y - spotlightY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const lightMultiplier = Math.max(0.2, 1 - dist / (spotlightRadius * 0.8));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 220, 180, ${Math.min(
          1,
          Math.max(0.05, p.alpha * lightMultiplier * lightIntensity)
        )})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lightIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-80"
    />
  );
};
