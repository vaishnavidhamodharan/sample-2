import { useState, useEffect } from 'react';

export interface MouseParallaxResult {
  rotateX: number;
  rotateY: number;
  x: number;
  y: number;
}

export function useMouseParallax(maxAngle: number = 10, speed: number = 0.06): MouseParallaxResult {
  const [rotation, setRotation] = useState<MouseParallaxResult>({
    rotateX: 0,
    rotateY: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let normX = 0;
    let normY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      normX = (e.clientX - centerX) / (centerX || 1);
      normY = (e.clientY - centerY) / (centerY || 1);

      targetY = normX * maxAngle;
      targetX = -normY * maxAngle;
    };

    const animate = () => {
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      setRotation({
        rotateX: Math.round(currentX * 100) / 100,
        rotateY: Math.round(currentY * 100) / 100,
        x: Math.round(normX * 100) / 100,
        y: Math.round(normY * 100) / 100,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxAngle, speed]);

  return rotation;
}
