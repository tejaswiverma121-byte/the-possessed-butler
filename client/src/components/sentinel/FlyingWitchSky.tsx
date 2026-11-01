'use client';

import React, { useState, useEffect } from 'react';

/**
 * FlyingWitchSky: Cinematic witch silhouette gliding across the misty sky
 * with a glowing ember/magic dust trail.
 */
export const FlyingWitchSky: React.FC<{
  speedSeconds?: number;
  direction?: 'left-to-right' | 'right-to-left';
}> = ({ speedSeconds = 24, direction = 'left-to-right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger start so it feels natural
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-12 h-48 pointer-events-none z-10 overflow-hidden select-none opacity-85">
      <div
        className={`absolute flex items-center gap-2 will-change-transform ${
          direction === 'left-to-right' ? 'animate-witch-glide' : 'animate-witch-glide-reverse'
        }`}
        style={{
          animationDuration: `${speedSeconds}s`,
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          animationIterationCount: 'infinite',
        }}
      >
        {/* Magic Dust / Stardust Trail */}
        <div className="w-24 h-6 flex items-center justify-end space-x-1 opacity-70">
          <span className="w-1 h-1 rounded-full bg-[#F3D9A4] animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E2638] blur-[0.5px]" />
          <span className="w-2 h-0.5 rounded-full bg-gradient-to-l from-[#C6A56B] to-transparent" />
        </div>

        {/* Witch Silhouette SVG */}
        <div className="relative filter drop-shadow-[0_0_12px_rgba(198,165,107,0.4)]">
          <svg
            width="56"
            height="44"
            viewBox="0 0 100 80"
            className="fill-[#151219] stroke-[#C6A56B]/70"
            strokeWidth="1.2"
          >
            {/* Broom Stick */}
            <line x1="5" y1="58" x2="95" y2="38" stroke="#C6A56B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Broom Bristles */}
            <path d="M5,58 L-4,52 L-6,65 L3,62 Z" fill="#F3D9A4" stroke="#C6A56B" />

            {/* Witch Body, Cape & Legs */}
            <path d="M42,50 C38,45 35,38 45,35 C52,32 58,40 54,50 Z" fill="#09080B" />
            <path d="M35,46 Q24,52 18,62 Q32,56 42,52 Z" fill="#3A101A" stroke="#9E2638" />

            {/* Pointed Witch Hat with Curved Brim */}
            <path d="M44,35 L48,10 Q50,6 54,8 L56,33 Z" fill="#09080B" stroke="#9E2638" />
            <ellipse cx="49" cy="34" rx="14" ry="3.5" fill="#151219" stroke="#C6A56B" strokeWidth="1" />

            {/* Glowing Lantern dangling from broom tip */}
            <circle cx="88" cy="40" r="3.5" fill="#F3D9A4" className="animate-pulse" />
            <line x1="88" y1="40" x2="88" y2="44" stroke="#C6A56B" strokeWidth="1" />
            <rect x="86" y="44" width="4" height="6" rx="1" fill="#3A101A" stroke="#C6A56B" strokeWidth="0.8" />
            <circle cx="88" cy="47" r="1.5" fill="#F3D9A4" />
          </svg>
        </div>
      </div>
    </div>
  );
};
