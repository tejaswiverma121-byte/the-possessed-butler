import React, { useState } from 'react';

/**
 * SpiderWebCorner: Delicate glowing dark orange spiderweb accent for card corners
 */
export const SpiderWebCorner: React.FC<{ className?: string }> = ({ className = "top-0 right-0 w-16 h-16" }) => (
  <div className={`absolute pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity z-10 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-pumpkin-500 fill-none stroke-current" strokeWidth="1.5">
      <path d="M0,0 L100,100 M0,0 L100,50 M0,0 L50,100 M0,0 L100,20 M0,0 L20,100" opacity="0.6" />
      <path d="M30,0 C30,15 15,30 0,30" />
      <path d="M55,0 C55,30 30,55 0,55" />
      <path d="M80,0 C80,45 45,80 0,80" />
      <path d="M100,0 C100,60 60,100 0,100" />
    </svg>
  </div>
);

/**
 * FlyingBatSvg: Interactive fluttering bat SVG that reacts on hover
 */
export const FlyingBatSvg: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 28 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-block cursor-pointer transition-transform duration-300 ${hovered ? 'scale-125 rotate-6' : 'hover:scale-110'} ${className}`}
      title="Spooky Sentinel Watcher"
    >
      <svg 
        width={size} 
        height={size * 0.6} 
        viewBox="0 0 100 60" 
        className={`transition-colors duration-300 ${hovered ? 'text-pumpkin-400 drop-shadow-[0_0_8px_#ff6600]' : 'text-pumpkin-500/70 hover:text-pumpkin-400'}`}
        fill="currentColor"
      >
        <path d="M50,22 C42,10 32,5 20,10 C12,13 5,22 2,32 C12,32 18,28 25,32 C30,35 34,45 40,40 C43,38 46,30 50,34 C54,30 57,38 60,40 C66,45 70,35 75,32 C82,28 88,32 98,32 C95,22 88,13 80,10 C68,5 58,10 50,22 Z" />
        <circle cx="46" cy="24" r="1.5" fill="#ffffff" />
        <circle cx="54" cy="24" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};

/**
 * CyberPumpkinAvatar: Interactive AI Assistant Avatar
 */
export const CyberPumpkinAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; isSpeaking?: boolean }> = ({ 
  size = 'md', 
  isSpeaking = false 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative group shrink-0 ${sizeMap[size]}`}>
      {/* Glow aura */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-pumpkin-600 via-ember-500 to-pumpkin-500 opacity-60 group-hover:opacity-100 blur-sm transition-all duration-300 ${isSpeaking ? 'animate-pulse' : ''}`} />
      
      {/* Mascot Image */}
      <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-pumpkin-400/90 shadow-glow-pumpkin bg-obsidian-950">
        <img 
          src="/halloween/cyber_pumpkin_mascot.jpg" 
          alt="Cybernetic Jack-o'-Lantern AI" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Spooky Active Pulse Dot */}
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pumpkin-500 border-2 border-obsidian-950 rounded-full shadow-[0_0_8px_#ff6600] animate-ping" />
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pumpkin-500 border-2 border-obsidian-950 rounded-full" />
    </div>
  );
};

/**
 * InteractiveHeroBanner: Cinematic Dark Orange & Black Cyber-Cathedral Header
 */
export const HalloweenHeroBanner: React.FC<{ 
  onActionClick?: (action: string) => void;
  userEmail: string;
}> = ({ onActionClick, userEmail }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-pumpkin-500/40 shadow-glow-pumpkin bg-obsidian-950 mb-4 group">
      {/* Background Cinematic Banner */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden">
        <img 
          src="/halloween/cyber_halloween_banner.jpg" 
          alt="Cyberpunk Halloween Cathedral" 
          className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
        />
        {/* Dark Orange to Void Black Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-obsidian-950/90" />
      </div>

      {/* Spiderweb in top-right */}
      <SpiderWebCorner className="top-0 right-0 w-24 h-24" />

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <CyberPumpkinAvatar size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-600 shadow-glow-pumpkin tracking-wider">
                  🎃 AUTONOMOUS SENTINEL
                </span>
                <span className="text-xs text-pumpkin-400/80 font-mono hidden sm:inline">
                  • Zero-Leakage Air-Gap Guard
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-display font-extrabold text-white tracking-wide mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Cyber-Gothic Copilot & Mail Guard
              </h2>
            </div>
          </div>

          {/* Interactive Floating Bat & Authenticated Identity */}
          <div className="hidden sm:flex items-center gap-2 bg-obsidian-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-pumpkin-500/30 text-xs font-mono text-pumpkin-300">
            <FlyingBatSvg size={24} />
            <span>Standing Guard: <strong className="text-white">{userEmail}</strong></span>
            <a
              href="/login"
              title="Switch or Authenticate Gmail Account"
              className="ml-1.5 px-2 py-0.5 rounded-lg bg-pumpkin-950 hover:bg-pumpkin-900 text-pumpkin-300 hover:text-white border border-pumpkin-700/80 text-[10px] font-bold transition-all shadow-sm"
            >
              🔐 Switch
            </a>
          </div>
        </div>

        {/* Quick-action interactive spell buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { label: '🦇 Scan Untrusted Inbox', prompt: 'Inspect all incoming emails in quarantined reader for hostile injections' },
            { label: '⚡ Summarize with Groq', prompt: 'Summarize my latest email with Groq' },
            { label: '📜 Verify Approval Gates', prompt: 'List all pending approval checkpoints and execution actions' },
            { label: '🛡️ Check Canary Tripwire', prompt: 'Audit the Canary Landmine token and verify no exfiltration detected' }
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => onActionClick && onActionClick(pill.prompt)}
              className="px-3 py-1 rounded-xl bg-obsidian-900/90 hover:bg-pumpkin-950/80 border border-pumpkin-500/30 hover:border-pumpkin-400 text-pumpkin-200 hover:text-pumpkin-300 text-xs font-mono transition-all duration-200 shadow-sm hover:shadow-glow-pumpkin flex items-center gap-1.5"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
