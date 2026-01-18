import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParticleEngine, DEFAULT_THEME } from '../utils/ParticleEngine';

export interface ParticleRef {
  triggerBurst: (x: number, y: number) => void;
  triggerSwirl: (x: number, y: number) => void;
  triggerSweep: (rect: {top: number, bottom: number, left: number, right: number}) => void;
}

const ParticleOverlay = forwardRef<ParticleRef, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    engineRef.current = new ParticleEngine(canvasRef.current, DEFAULT_THEME);

    // Start Ambient Loop
    const ambientInterval = setInterval(() => {
        engineRef.current?.emitAmbient();
    }, 50);

    return () => {
      clearInterval(ambientInterval);
      engineRef.current?.destroy();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    triggerBurst: (x, y) => {
      engineRef.current?.emitBurst(x, y, 1.5);
    },
    triggerSwirl: (x, y) => {
      engineRef.current?.emitSwirl(x, y);
    },
    triggerSweep: (rect) => {
        // Convert screen rect to canvas coords if needed (assuming canvas is full screen fixed)
        // For simplicity, we assume canvas matches screen exactly
        engineRef.current?.emitSweep(rect);
    }
  }));

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

export default ParticleOverlay;