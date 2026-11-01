import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Image, 
  Copy, 
  Check,
  Mail,
  MailCheck,
  ExternalLink,
  RefreshCw,
  Cpu,
  Layers,
  Lock,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { SentinelEmail, SentinelTask } from '../../types';

interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmail?: SentinelEmail;
  activeTask?: SentinelTask;
  onMarkAsRead?: (id: string, isRead: boolean) => void;
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  selectedEmail, 
  activeTask, 
  onMarkAsRead 
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'task' | 'security'>('email');
  const [copied, setCopied] = useState(false);
  const [scanResult, setScanResult] = useState<any>(selectedEmail?.promptGuardScan || null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Sync scanResult whenever selectedEmail changes
  useEffect(() => {
    if (selectedEmail?.promptGuardScan) {
      setScanResult(selectedEmail.promptGuardScan);
    } else if (selectedEmail) {
      // Auto-trigger security scan if email hasn't been scanned yet
      runSecurityScan();
    } else {
      setScanResult(null);
    }
  }, [selectedEmail?.id]);

  const runSecurityScan = async () => {
    if (!selectedEmail) return;
    setIsScanning(true);
    setScanError(null);
    try {
      const res = await fetch('http://localhost:3001/api/security/scan-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEmail.id,
          from: selectedEmail.from,
          to: selectedEmail.to,
          subject: selectedEmail.subject,
          body: selectedEmail.body,
          attachments: selectedEmail.attachments
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setScanResult(data);
      if (selectedEmail) {
        selectedEmail.promptGuardScan = data;
      }
    } catch (err: any) {
      setScanError(err.message);
      // Explicit fallback state per specification (never silently safe)
      setScanResult({
        scan_status: 'unavailable',
        model: 'meta-llama/Llama-Prompt-Guard-2-22M',
        risk_tier: 'SCAN_UNAVAILABLE',
        badge_color: 'grey',
        risk_score: 50,
        confidence: 0,
        explanation: 'Prompt Guard inference daemon is currently unreachable. Content held for user review.',
        allow_llm_processing: false,
        require_user_review: true,
        has_attachments_scanned: Boolean(selectedEmail.attachments && selectedEmail.attachments.length > 0),
        attachment_count: selectedEmail.attachments?.length || 0,
        policy_enforcements: ['Automated LLM ingestion blocked', 'Tool execution revoked', 'Manual review required']
      });
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGmailUrl = (subject: string) => {
    const clean = subject.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
    return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(clean)}`;
  };

  // Visual indicator mapping adhering to Section 7
  const getRiskPresentation = (color: string) => {
    switch (color) {
      case 'green':
        return {
          label: 'Safe — Low Risk',
          tag: 'SAFE',
          pillBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          barGradient: 'from-emerald-500 to-teal-400',
          textColor: 'text-emerald-400',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
        };
      case 'yellow':
        return {
          label: 'Suspicious — Medium Risk',
          tag: 'SUSPICIOUS',
          pillBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
          barGradient: 'from-amber-500 to-yellow-400',
          textColor: 'text-amber-400',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
        };
      case 'red':
        return {
          label: 'Potentially Malicious — High Risk',
          tag: 'MALICIOUS',
          pillBg: 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-glow-pumpkin',
          barGradient: 'from-rose-600 to-red-500',
          textColor: 'text-rose-400',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
        };
      case 'grey':
      default:
        return {
          label: 'Scan Unavailable — Mandatory Review',
          tag: 'UNAVAILABLE',
          pillBg: 'bg-slate-900/80 text-slate-300 border-slate-700/50',
          barGradient: 'from-slate-600 to-slate-500',
          textColor: 'text-slate-400',
          icon: <HelpCircle className="w-4 h-4 text-slate-400" />
        };
    }
  };

  const currentRisk = getRiskPresentation(scanResult?.badge_color || 'grey');

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-96 bg-obsidian-950/98 backdrop-blur-xl border-l border-witch-800 flex flex-col justify-between shadow-2xl transition-all">
      {/* Top Header */}
      <div className="p-4 border-b border-witch-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <span>🎃 Security Inspector & Evidence Drawer</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex rounded-xl bg-obsidian-900 p-1 text-xs font-mono border border-witch-900">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 rounded-lg transition-all font-bold ${
              activeTab === 'email' 
                ? 'bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 text-obsidian-950 shadow-glow-pumpkin' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email & Body
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 rounded-lg transition-all font-bold flex items-center justify-center gap-1 ${
              activeTab === 'security' 
                ? 'bg-gradient-to-r from-witch-600 to-witch-700 text-white shadow-glow-witch' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛡️ Prompt Guard</span>
            {scanResult && (
              <span className={`w-2 h-2 rounded-full ${
                scanResult.badge_color === 'green' ? 'bg-emerald-400' :
                scanResult.badge_color === 'yellow' ? 'bg-amber-400' :
                scanResult.badge_color === 'red' ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'
              }`} />
            )}
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`flex-1 py-1.5 rounded-lg transition-all font-bold ${
              activeTab === 'task' 
                ? 'bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 text-obsidian-950 shadow-glow-pumpkin' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Task Plan
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* TAB 1: EMAIL & OCR ATTACHMENTS */}
        {activeTab === 'email' && (
          selectedEmail ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-obsidian-900/90 border border-witch-800 space-y-2.5 shadow-md">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-witch-400 uppercase font-bold tracking-wider">Subject:</span>
                  <span className="text-[10px] text-pumpkin-400 font-bold">{new Date(selectedEmail.date).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm font-bold text-white font-display">{selectedEmail.subject}</div>
                <div className="text-xs text-slate-300">From: <span className="text-pumpkin-300 font-bold">{selectedEmail.from}</span></div>
                <div className="text-xs text-slate-300">To: <span className="text-slate-400">{selectedEmail.to}</span></div>

                {/* Prompt Guard Badge Banner */}
                {scanResult && (
                  <div className={`mt-2 p-2 rounded-lg border text-[11px] font-sans flex items-center justify-between gap-2 ${currentRisk.pillBg}`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {currentRisk.icon}
                      <span>Prompt Guard: {currentRisk.label}</span>
                    </div>
                    <span className="font-mono font-bold text-xs">
                      {scanResult.risk_score}%
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-witch-850">
                  <span className={`text-[10px] font-bold ${selectedEmail.isRead ? 'text-slate-400' : 'text-pumpkin-400'}`}>
                    {selectedEmail.isRead ? 'READ' : '🎃 UNREAD'}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={getGmailUrl(selectedEmail.subject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-witch-900 hover:bg-witch-800 text-pumpkin-300 hover:text-pumpkin-200 border border-witch-700 text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
                      title="Open this email in your real Gmail tab"
                    >
                      <span>Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(selectedEmail.id, !selectedEmail.isRead)}
                        className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                          selectedEmail.isRead
                            ? 'bg-obsidian-800 text-slate-300 border-witch-800 hover:bg-obsidian-700'
                            : 'bg-pumpkin-950 text-pumpkin-300 border-pumpkin-700 hover:bg-pumpkin-900 shadow-glow-pumpkin'
                        }`}
                      >
                        {selectedEmail.isRead ? (
                          <>
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>Mark Unread</span>
                          </>
                        ) : (
                          <>
                            <MailCheck className="w-3.5 h-3.5 text-pumpkin-400" />
                            <span>Mark Read</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Body / Content Section */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2 shadow-md">
                <div className="flex justify-between items-center text-[10px] text-witch-400 uppercase font-bold tracking-wider">
                  <span>Message Body:</span>
                  <button 
                    onClick={() => copyText(selectedEmail.body || '')} 
                    className="text-pumpkin-400 hover:text-pumpkin-300 flex items-center gap-0.5 normal-case font-mono"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-950 border border-witch-900 text-slate-300 text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-sans">
                  {selectedEmail.body || 'No message content available.'}
                </div>
              </div>

              {/* Attachments Section */}
              {selectedEmail.attachments.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-pumpkin-300 uppercase tracking-wider">
                    Inspected Attachments ({selectedEmail.attachments.length})
                  </h4>
                  {selectedEmail.attachments.map((att) => (
                    <div key={att.id} className="p-3.5 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2 shadow-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-bold text-pumpkin-300">
                          {att.mimeType.includes('image') ? <Image className="w-4 h-4 text-pumpkin-400" /> : <FileText className="w-4 h-4 text-witch-400" />}
                          <span className="truncate max-w-[180px]">{att.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {Math.round(att.sizeBytes / 1024)} KB
                        </span>
                      </div>

                      {att.ocrSummary && (
                        <div className="p-2.5 rounded-lg bg-witch-950/80 border border-witch-700 text-xs text-witch-200">
                          <span className="font-bold text-pumpkin-400">OCR Analysis:</span> {att.ocrSummary}
                        </div>
                      )}

                      {att.extractedText && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span>Extracted Raw Text:</span>
                            <button onClick={() => copyText(att.extractedText || '')} className="text-pumpkin-400 hover:text-pumpkin-300 flex items-center gap-0.5">
                              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-2.5 rounded-lg bg-obsidian-950 border border-witch-900 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {att.extractedText}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-obsidian-900/50 border border-witch-900 text-center text-slate-500">
                  No attachments in this email thread.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Select or ask about an email to inspect its contents and attachments here.
            </div>
          )
        )}

        {/* TAB 2: PROMPT GUARD 2 SECURITY SCAN (SECTION 7 SPECIFICATION) */}
        {activeTab === 'security' && (
          selectedEmail ? (
            <div className="space-y-4">
              {/* Scan Status Banner */}
              <div className={`p-4 rounded-xl border ${currentRisk.pillBg} space-y-2 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentRisk.icon}
                    <span className="font-bold font-display text-sm tracking-wide">
                      {currentRisk.label}
                    </span>
                  </div>
                  <button
                    onClick={runSecurityScan}
                    disabled={isScanning}
                    className="p-1 rounded bg-obsidian-900/80 hover:bg-obsidian-800 text-slate-300 hover:text-white transition-all border border-witch-700/50"
                    title="Re-run Prompt Guard Scan"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-pumpkin-400' : ''}`} />
                  </button>
                </div>

                {/* Risk Score Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-300 font-mono">
                    <span>Malicious Risk Score:</span>
                    <span className="font-bold text-sm text-white">
                      {scanResult ? `${scanResult.risk_score} / 100` : '—'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-obsidian-950 border border-witch-900 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${currentRisk.barGradient} transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(5, scanResult?.risk_score || 0))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Model & Classification Metadata Card */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2.5 shadow-md">
                <div className="text-[10px] text-pumpkin-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Pretrained ML Model Architecture</span>
                </div>

                <div className="space-y-1.5 text-[11px] font-sans">
                  <div className="flex justify-between items-center py-1 border-b border-witch-850">
                    <span className="text-slate-400">Model Name:</span>
                    <span className="text-pumpkin-300 font-mono font-bold truncate max-w-[200px]" title={scanResult?.model}>
                      {scanResult?.model || 'meta-llama/Llama-Prompt-Guard-2-22M'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-witch-850">
                    <span className="text-slate-400">Classification:</span>
                    <span className="font-mono uppercase font-bold text-white px-2 py-0.5 rounded bg-obsidian-950 border border-witch-800">
                      {scanResult?.classification || 'uninspected'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-witch-850">
                    <span className="text-slate-400">Detection Confidence:</span>
                    <span className="font-mono font-bold text-white">
                      {scanResult?.confidence ? `${Math.round(scanResult.confidence * 100)}%` : '0%'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-witch-850">
                    <span className="text-slate-400">Inference Latency:</span>
                    <span className="font-mono text-slate-300">
                      {scanResult?.latency_ms ? `${scanResult.latency_ms} ms` : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-witch-850">
                    <span className="text-slate-400">User Review Required:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      scanResult?.require_user_review
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {scanResult?.require_user_review ? '⚠️ MANDATORY' : '✓ CLEARED'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Attachments Scanned:</span>
                    <span className="font-mono text-slate-300">
                      {scanResult?.has_attachments_scanned 
                        ? `✓ Yes (${scanResult.attachment_count} files)` 
                        : 'None in payload'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rationale & Flagged Chunks Card */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2 shadow-md">
                <div className="text-[10px] text-witch-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Detection Rationale & Context Chunks</span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-obsidian-950 p-2.5 rounded-lg border border-witch-900">
                  {scanResult?.explanation || 'No malicious patterns detected in message payload.'}
                </p>

                {/* Flagged Chunks Badges */}
                <div className="pt-1 space-y-1.5">
                  <span className="text-[10px] text-slate-400">512-Token Windows Scanned:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult?.total_chunks_scanned && scanResult.total_chunks_scanned > 0 ? (
                      Array.from({ length: scanResult.total_chunks_scanned }).map((_, idx) => {
                        const isFlagged = scanResult.flagged_chunks?.includes(idx);
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              isFlagged
                                ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                                : 'bg-obsidian-950 text-slate-400 border-witch-900'
                            }`}
                          >
                            Chunk {idx} {isFlagged ? '🚨 FLAGGED' : '✓ SAFE'}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-slate-500 text-[10px]">1 Primary Chunk</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Policy Enforcements */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2 shadow-md">
                <div className="text-[10px] text-pumpkin-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Active Defense Enforcements</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 font-sans">
                  {scanResult?.policy_enforcements && scanResult.policy_enforcements.length > 0 ? (
                    scanResult.policy_enforcements.map((enf: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 py-0.5">
                        <span className="text-pumpkin-400">•</span>
                        <span>{enf}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 py-1">
                      • Untrusted external data boundary active<br />
                      • Automated tool execution disabled without human token
                    </div>
                  )}
                </div>
              </div>

              {/* Air-Gap Canary Trap Notice */}
              <div className="p-3 rounded-xl bg-obsidian-950 border border-pumpkin-900/40 text-[11px] text-slate-400 space-y-1">
                <div className="text-pumpkin-400 font-bold">Canary Decoy Trap Armed:</div>
                <div className="font-mono text-[10px] text-pumpkin-300 break-all">
                  CANARY_SENTINEL_CREDENTIAL_992xQ
                </div>
                <p className="text-[10px] text-slate-500">
                  Monitored on all outbound sockets. Any leakage triggers immediate process termination.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
              <div>Select an email to inspect its Prompt Guard 2 classification report.</div>
            </div>
          )
        )}

        {/* TAB 3: ACTIVE TASK PLAN */}
        {activeTab === 'task' && (
          activeTask ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-obsidian-900 border border-witch-800 space-y-2">
                <div className="text-[10px] text-witch-400 uppercase font-bold tracking-wider">Active Goal:</div>
                <div className="text-sm font-bold text-white font-display">{activeTask.goal}</div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-pumpkin-300 bg-pumpkin-950 px-2 py-0.5 rounded border border-pumpkin-800">
                    Status: {activeTask.status}
                  </span>
                  <span className="text-xs text-slate-400">{activeTask.progressPercent}% Complete</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-pumpkin-300 uppercase tracking-wider">Controlled Steps:</h4>
                {activeTask.steps.map((st, i) => (
                  <div key={st.id} className="p-3 rounded-xl bg-obsidian-900/80 border border-witch-850 flex items-start gap-2.5">
                    <span className="text-xs font-bold text-pumpkin-400">{i + 1}.</span>
                    <div className="space-y-0.5">
                      <div className="text-xs text-slate-200 font-medium">{st.name}</div>
                      <div className="text-[10px] text-slate-500">Tool: {st.tool} • Status: {st.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No active task currently running. Ask the assistant to start a task.
            </div>
          )
        )}
      </div>
    </aside>
  );
};
