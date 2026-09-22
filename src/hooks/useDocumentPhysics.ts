import { useState, useEffect } from 'react';

interface DocumentPhysicsProps {
  separationFactor?: number;
  floatingAmp?: number;
  breathingAmp?: number;
}

export function useDocumentPhysics({
  separationFactor = 0,
  floatingAmp = 6,
  breathingAmp = 3,
}: DocumentPhysicsProps = {}) {
  const [physics, setPhysics] = useState({ floatY: 0, floatZ: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const updatePhysics = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // Gentle sine-wave harmonic floating
      const floatY = Math.sin(elapsed * 1.5) * floatingAmp;
      // Depth breathing synced with separation factor
      const floatZ = Math.cos(elapsed * 1.2) * breathingAmp + separationFactor * 10;

      setPhysics({
        floatY: Math.round(floatY * 100) / 100,
        floatZ: Math.round(floatZ * 100) / 100,
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [separationFactor, floatingAmp, breathingAmp]);

  return physics;
}
