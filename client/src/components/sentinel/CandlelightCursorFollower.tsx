'use client';

import React, { useEffect, useState } from 'react';

/**
 * CandlelightCursorFollower: A cinematic, warm candlelight/lantern halo
 * that smoothly follows the pointer, illuminating the gothic scene.
 */
export const CandlelightCursorFollower: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const loop = () => {
      // Lerp for smooth lantern inertia
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-500 ease-out"
      style={{
        background: `radial-gradient(circle 380px at ${pos.x}px ${pos.y}px, rgba(243, 217, 164, 0.07) 0%, rgba(198, 165, 107, 0.03) 45%, transparent 70%)`,
      }}
    />
  );
};
