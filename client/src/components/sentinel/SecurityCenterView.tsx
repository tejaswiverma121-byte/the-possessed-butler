import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  Lock, 
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import { sentinelGetSecurityAudit } from '../../api';
import { SpiderWebCorner, FlyingBatSvg } from './HalloweenDecorations';

export const SecurityCenterView: React.FC = () => {
  const [canaryToken, setCanaryToken] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    setIsLoading(true);
    try {
      const data = await sentinelGetSecurityAudit();
      setCanaryToken(data.primaryCanary || 'CANARY_SENTINEL_CREDENTIAL_992xQ');
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-obsidian-950 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-pumpkin-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-pumpkin-500/10 border border-pumpkin-500/20 text-pumpkin-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-display font-extrabold text-white tracking-wide">
              Possessed Butler Defense & Security Center
            </h2>
            <FlyingBatSvg size={20} />
          </div>
          <p className="text-xs text-pumpkin-200/70 mt-1 font-sans">
            Autonomous Prompt-Injection Mitigation, Canary Tripwires & Single-Use Permission Gates
          </p>
        </div>

        <button
          onClick={loadAudit}
          className="px-3.5 py-2 rounded-xl bg-obsidian-900 border border-pumpkin-900/60 text-xs text-pumpkin-400 hover:text-white hover:border-pumpkin-500 flex items-center gap-2 font-mono font-medium transition-all shadow-md hover:shadow-glow-pumpkin"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Hero Security Shield Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-obsidian-900 border-2 border-pumpkin-500/60 p-5 md:p-6 shadow-glow-pumpkin flex flex-col md:flex-row items-center gap-6">
        <SpiderWebCorner className="top-0 right-0 w-24 h-24 opacity-25" />

        <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-pumpkin-400 shadow-[0_0_30px_rgba(255,102,0,0.5)]">
          <img 
            src="/halloween/cyber_security_crest.jpg" 
            alt="Cyber Security Crest" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-600 shadow-glow-pumpkin">
              🛡️ ACTIVE CYBER-DEFENSE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
              ✓ ZERO EXFILTRATIONS DETECTED
            </span>
          </div>
          <h3 className="text-base md:text-lg font-display font-extrabold text-white">
            Dual-LLM Air-Gap & Autonomous Tripwire Containment
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Sentinel AI processes untrusted content (live emails, web scrapers, OCR PDFs) inside an isolated Quarantined Reader. Decoy Canary Tokens trigger immediate execution abort if exfiltration is attempted.
          </p>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 font-mono">
        {/* Pillar 1 */}
        <div className="relative p-5 rounded-2xl bg-obsidian-900/90 border border-pumpkin-900/50 space-y-3 shadow-lg hover:border-pumpkin-500/60 transition-colors group">
          <SpiderWebCorner className="top-0 right-0 w-14 h-14 opacity-15 group-hover:opacity-40" />
          <div className="flex items-center gap-2 text-sm font-bold text-pumpkin-400">
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Dual-LLM Air-Gap</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Untrusted content (emails, webpages, PDFs) is read by an isolated Quarantined Reader with zero tools and no credentials.
          </p>
          <span className="inline-block text-[10px] text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800 font-bold">
            Enforced Server-Side
          </span>
        </div>

        {/* Pillar 2 */}
        <div className="relative p-5 rounded-2xl bg-obsidian-900/90 border border-pumpkin-900/50 space-y-3 shadow-lg hover:border-pumpkin-500/60 transition-colors group">
          <SpiderWebCorner className="top-0 right-0 w-14 h-14 opacity-15 group-hover:opacity-40" />
          <div className="flex items-center gap-2 text-sm font-bold text-ember-400">
            <Key className="w-4.5 h-4.5" />
            <span>Canary Tripwire Guard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Decoy secret tokens planted in memory. Any attempt by hostile payloads to exfiltrate them triggers an instant execution kill.
          </p>
          <div className="p-2 rounded-lg bg-obsidian-950 border border-pumpkin-900/50 text-[11px] text-pumpkin-300 break-all font-mono">
            {canaryToken}
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="relative p-5 rounded-2xl bg-obsidian-900/90 border border-pumpkin-900/50 space-y-3 shadow-lg hover:border-pumpkin-500/60 transition-colors group">
          <SpiderWebCorner className="top-0 right-0 w-14 h-14 opacity-15 group-hover:opacity-40" />
          <div className="flex items-center gap-2 text-sm font-bold text-pumpkin-400">
            <Lock className="w-4.5 h-4.5" />
            <span>Human Approval Gate</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Sending outgoing emails, external dispatches, and mutations strictly require single-use cryptographic authorization tokens.
          </p>
          <span className="inline-block text-[10px] text-pumpkin-300 bg-pumpkin-950/80 px-2.5 py-1 rounded-md border border-pumpkin-800 font-bold">
            Zero Auto-Dispatches
          </span>
        </div>
      </div>

      {/* Security Audit Ledger */}
      <div className="space-y-3 font-mono">
        <h3 className="text-xs font-bold text-pumpkin-300 uppercase tracking-wider flex items-center gap-2">
          <span>Real-Time Security Event Audit Ledger:</span>
          <FlyingBatSvg size={16} />
        </h3>

        {logs.length > 0 ? (
          <div className="space-y-2.5">
            {logs.map((log) => {
              const isCrit = log.severity === 'critical';
              const isWarn = log.severity === 'warning';
              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 transition-all ${
                    isCrit 
                      ? 'bg-vampire-950/40 border-vampire-700 text-vampire-200 shadow-glow-vampire' 
                      : isWarn 
                      ? 'bg-pumpkin-950/30 border-pumpkin-700 text-pumpkin-200' 
                      : 'bg-obsidian-900 border-pumpkin-900/40 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] ${
                        isCrit ? 'bg-vampire-900 text-white font-extrabold' : isWarn ? 'bg-pumpkin-900 text-white font-extrabold' : 'bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-800'
                      }`}>
                        {log.eventType.toUpperCase()}
                      </span>
                      <span className="text-sm font-sans font-bold text-white">{log.details}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Source: <span className="text-slate-300">{log.source}</span> • Mitigation: <span className="text-pumpkin-400 font-bold">{log.mitigationTaken}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-obsidian-900/50 border border-pumpkin-900/40 text-center text-slate-500">
            🎃 No threat incidents detected. All defenses operational and standing guard.
          </div>
        )}
      </div>
    </div>
  );
};
