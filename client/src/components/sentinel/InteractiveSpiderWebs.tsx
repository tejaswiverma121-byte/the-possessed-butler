'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HangingSpiderProps {
  xPercent: number; // 0 to 100% horizontally
  baseLength?: number; // base silk length in px
  swingRange?: number;
  size?: number;
}

/**
 * HangingSpider: An interactive spider hanging from an invisible silk thread.
 * Reacts to mouse cursor proximity with spring-like pendulum swing and bobbing!
 */
export const HangingSpider: React.FC<HangingSpiderProps> = ({
  xPercent,
  baseLength = 120,
  swingRange = 25,
  size = 28,
}) => {
  const [silkLength, setSilkLength] = useState(baseLength);
  const [swingAngle, setSwingAngle] = useState(0);
  const [isAlerted, setIsAlerted] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let targetAngle = 0;
    let currentAngle = 0;
    let targetLength = baseLength;
    let currentLength = baseLength;

    const handleMouseMove = (e: MouseEvent) => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const spiderX = rect.left + rect.width / 2;
      const spiderY = rect.top + currentLength;

      const dx = e.clientX - spiderX;
      const dy = e.clientY - spiderY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        setIsAlerted(true);
        // Scuttle up or swing away from cursor
        const angle = Math.max(-swingRange, Math.min(swingRange, (-dx / dist) * swingRange));
        targetAngle = angle;
        targetLength = baseLength - 25 + (Math.sin(Date.now() / 150) * 8); // scurry upward in fright
      } else {
        setIsAlerted(false);
        // Gentle ambient pendulum oscillation
        targetAngle = Math.sin(Date.now() / 900 + xPercent) * 6;
        targetLength = baseLength + Math.sin(Date.now() / 1200 + xPercent) * 8;
      }
    };

    const animate = () => {
      // Smooth lerp
      currentAngle += (targetAngle - currentAngle) * 0.08;
      currentLength += (targetLength - currentLength) * 0.08;

      setSwingAngle(currentAngle);
      setSilkLength(currentLength);

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [baseLength, swingRange, xPercent]);

  return (
    <div
      ref={anchorRef}
      className="absolute top-0 pointer-events-none z-30 select-none"
      style={{ left: `${xPercent}%` }}
    >
      {/* Silk Thread */}
      <svg
        width="2"
        height={silkLength}
        className="overflow-visible"
        style={{
          transform: `rotate(${swingAngle}deg)`,
          transformOrigin: 'top center',
          transition: 'transform 0.05s ease-out',
        }}
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={silkLength}
          stroke="rgba(232, 224, 213, 0.45)"
          strokeWidth="1"
          strokeDasharray="2,1"
        />

        {/* Spider Body & Articulated Legs */}
        <g
          transform={`translate(0, ${silkLength})`}
          className="transition-transform duration-200"
          style={{ transform: `scale(${isAlerted ? 1.15 : 1})` }}
        >
          {/* Eyes Glow */}
          <circle cx="-2" cy="-1" r="1" fill={isAlerted ? '#FF3344' : '#F3D9A4'} />
          <circle cx="2" cy="-1" r="1" fill={isAlerted ? '#FF3344' : '#F3D9A4'} />

          {/* Cephalothorax & Abdomen */}
          <ellipse cx="0" cy="1" rx={size * 0.16} ry={size * 0.22} fill="#151219" stroke="#9E2638" strokeWidth="1" />
          <ellipse cx="0" cy={size * 0.35} rx={size * 0.26} ry={size * 0.32} fill="#09080B" stroke="#C6A56B" strokeWidth="0.8" />

          {/* Left Legs */}
          <path d={`M-3,0 Q-10,-4 -14,-2 M-3,2 Q-12,0 -16,6 M-3,4 Q-12,8 -14,14 M-2,6 Q-8,12 -10,18`} stroke="#C6A56B" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* Right Legs */}
          <path d={`M3,0 Q10,-4 14,-2 M3,2 Q12,0 16,6 M3,4 Q12,8 14,14 M2,6 Q8,12 10,18`} stroke="#C6A56B" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/**
 * GothicCobwebCorner: Intricate Victorian web accent for page corners
 */
export const GothicCobwebCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  opacity?: number;
}> = ({ position = 'top-right', size = 160, opacity = 0.4 }) => {
  const getTransforms = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 scale-x-[-1]';
      case 'bottom-right':
        return 'bottom-0 right-0 scale-y-[-1]';
      case 'bottom-left':
        return 'bottom-0 left-0 scale-x-[-1] scale-y-[-1]';
      default:
        return 'top-0 right-0';
    }
  };

  return (
    <div
      className={`absolute pointer-events-none z-20 ${getTransforms()}`}
      style={{ width: size, height: size, opacity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#C6A56B]/60 fill-none" strokeWidth="0.8">
        {/* Radial Spoke Threads */}
        <line x1="100" y1="0" x2="0" y2="100" />
        <line x1="100" y1="0" x2="20" y2="100" />
        <line x1="100" y1="0" x2="50" y2="100" />
        <line x1="100" y1="0" x2="80" y2="100" />
        <line x1="100" y1="0" x2="0" y2="80" />
        <line x1="100" y1="0" x2="0" y2="50" />
        <line x1="100" y1="0" x2="0" y2="20" />

        {/* Concentric Arcs */}
        <path d="M100,20 Q60,20 20,100" strokeDasharray="3,1" />
        <path d="M100,40 Q50,40 40,100" />
        <path d="M100,60 Q65,65 60,100" />
        <path d="M100,80 Q80,80 80,100" />
      </svg>
    </div>
  );
};
