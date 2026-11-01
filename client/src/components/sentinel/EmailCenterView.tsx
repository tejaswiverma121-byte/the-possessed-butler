import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Paperclip, 
  Eye, 
  CheckCircle2, 
  CheckCheck, 
  MailOpen, 
  RefreshCw, 
  Radio, 
  Plug
} from 'lucide-react';
import { SentinelEmail, SentinelUserAccount } from '../../types';
import { SpiderWebCorner, FlyingBatSvg } from './HalloweenDecorations';

interface EmailCenterViewProps {
  emails: SentinelEmail[];
  userAccount: SentinelUserAccount;
  onSelectEmailForInspector: (email: SentinelEmail) => void;
  onComposeEmail: (to: string, subject: string, body: string) => void;
  onMarkAsRead?: (id: string, isRead: boolean) => void;
  onMarkAllAsRead?: () => void;
  onSyncImap?: () => Promise<void>;
  onOpenAccountModal?: () => void;
}

export const EmailCenterView: React.FC<EmailCenterViewProps> = ({
  emails,
  userAccount,
  onSelectEmailForInspector,
  onComposeEmail,
  onMarkAsRead,
  onMarkAllAsRead,
  onSyncImap,
  onOpenAccountModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEmailId, setActiveEmailId] = useState<string>(emails[0]?.id || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const categories = [
    { id: 'all', label: 'All Messages' },
    { id: 'invoice', label: 'Invoices & Receipts' },
    { id: 'important', label: 'Admissions & College' },
    { id: 'suspicious', label: 'Phishing & Quarantined' },
  ];

  const filteredEmails = emails.filter((em) => {
    if (selectedCategory !== 'all' && em.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        em.subject.toLowerCase().includes(q) ||
        em.from.toLowerCase().includes(q) ||
        em.body.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeEmail = emails.find(e => e.id === activeEmailId) || filteredEmails[0] || emails[0] || null;
  const unreadCount = emails.filter(e => !e.isRead).length;

  const handleTriggerSync = async () => {
    if (!onSyncImap || isSyncing) return;
    setIsSyncing(true);
    try {
      await onSyncImap();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-obsidian-950 font-sans">
      {/* Header bar */}
      <div className="p-4 border-b border-pumpkin-900/40 bg-obsidian-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xl">🎃</span>
            <h2 className="text-base font-display font-extrabold text-white tracking-wide">
              Email & Document Intelligence Center
            </h2>
            <FlyingBatSvg size={18} />
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-600 shadow-glow-pumpkin">
                {unreadCount} unread
              </span>
            )}
            {userAccount.isLiveImapConnected ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Live IMAP Connected
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-obsidian-950 text-pumpkin-400 border border-pumpkin-900">
                Sandbox Mode
              </span>
            )}
          </div>
          <p suppressHydrationWarning className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2 flex-wrap">
            <span>Connected Inbox: <strong suppressHydrationWarning className="text-pumpkin-400">{userAccount.email}</strong></span>
            {userAccount.isLiveImapConnected && userAccount.imapStatus?.lastSyncedAt && (
              <span suppressHydrationWarning className="text-[11px] text-pumpkin-400/80">
                (Last synced: {new Date(userAccount.imapStatus.lastSyncedAt).toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>

        {/* Search, Live Sync & Bulk Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Real Inbox Sync Button */}
          {userAccount.isLiveImapConnected ? (
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 hover:bg-emerald-900 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              title="Sync latest live emails from IMAP/Gmail"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live Inbox'}</span>
            </button>
          ) : (
            <a
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pumpkin-600 to-ember-500 hover:from-pumpkin-500 hover:to-ember-400 text-obsidian-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-pumpkin"
              title="Authenticate and connect real Gmail or Outlook inbox"
            >
              <Plug className="w-3.5 h-3.5 text-obsidian-950" />
              <span>Authenticate Gmail Vault</span>
            </a>
          )}

          {/* Mark All Read */}
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-pumpkin-900 hover:border-pumpkin-500 hover:bg-pumpkin-950 text-xs font-mono text-pumpkin-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Mark all emails as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-pumpkin-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search emails, spells..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-obsidian-950 border border-pumpkin-900/80 text-xs text-slate-100 placeholder-pumpkin-300/40 font-mono focus:border-pumpkin-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2.5 border-b border-pumpkin-900/40 bg-obsidian-950 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 font-bold ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-pumpkin-600 via-ember-500 to-pumpkin-500 text-obsidian-950 shadow-glow-pumpkin'
                  : 'bg-obsidian-900 text-slate-300 hover:text-pumpkin-200 border border-pumpkin-900/60 hover:border-pumpkin-600'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Pane: Email List (Left) and Full Email Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Email List */}
        <div className="md:col-span-5 border-r border-pumpkin-900/40 overflow-y-auto divide-y divide-pumpkin-900/30 bg-obsidian-950">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No emails found matching your filters.
            </div>
          ) : (
            filteredEmails.map((em) => {
              const isSelected = activeEmail?.id === em.id;
              const isHighRisk = em.riskAssessment?.level === 'high_risk';
              const isUnread = !em.isRead;
              const isLiveImap = em.id.startsWith('live-imap-');

              return (
                <div
                  key={em.id}
                  onClick={() => setActiveEmailId(em.id)}
                  className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 cursor-pointer group ${
                    isSelected
                      ? 'bg-obsidian-900 border-l-4 border-pumpkin-500 shadow-md'
                      : isUnread
                      ? 'hover:bg-obsidian-900 bg-obsidian-950/90'
                      : 'hover:bg-obsidian-900/80 bg-obsidian-950 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1 w-full">
                    <div className="flex items-center gap-2 truncate max-w-[220px]">
                      {isUnread ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-pumpkin-400 shrink-0 shadow-glow-pumpkin animate-pulse" title="Unread" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-transparent shrink-0" />
                      )}
                      <span className={`text-xs truncate ${isUnread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {em.from}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-pumpkin-400/80">{new Date(em.date).toLocaleDateString()}</span>
                      {onMarkAsRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(em.id, !em.isRead);
                          }}
                          className={`p-1 rounded hover:bg-obsidian-800 transition-colors ${
                            isUnread ? 'text-pumpkin-400 hover:text-pumpkin-300' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={isUnread ? "Mark as Read" : "Mark as Unread"}
                        >
                          {isUnread ? (
                            <MailOpen className="w-3.5 h-3.5" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`text-xs truncate w-full ${isUnread ? 'font-bold text-slate-100' : 'font-normal text-slate-400'}`}>
                    {em.subject}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{em.body.replace(/<!--[\s\S]*?-->/g, '')}</div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isLiveImap && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[9px]">
                          LIVE IMAP
                        </span>
                      )}
                      {isHighRisk ? (
                        <span className="px-2 py-0.5 rounded bg-vampire-950 text-vampire-300 border border-vampire-800 font-bold flex items-center gap-1">
                          <span>🦇 HIGH RISK PHISHING</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-obsidian-900 text-pumpkin-300 border border-pumpkin-900">
                          {em.category.toUpperCase()}
                        </span>
                      )}
                      {isUnread && (
                        <span className="px-1.5 py-0.5 rounded bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-700 font-bold text-[9px]">
                          NEW
                        </span>
                      )}
                      {em.promptGuardScan && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
                          em.promptGuardScan.badge_color === 'green' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          em.promptGuardScan.badge_color === 'yellow' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                          em.promptGuardScan.badge_color === 'red' ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' :
                          'bg-slate-900 text-slate-300 border-slate-700'
                        }`}>
                          <span>🛡️ PG: {em.promptGuardScan.risk_score}%</span>
                        </span>
                      )}
                    </div>
                    {em.attachments.length > 0 && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Paperclip className="w-3 h-3 text-pumpkin-400" />
                        <span>{em.attachments.length} attachment</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Full Message View */}
        <div className="md:col-span-7 overflow-y-auto p-6 space-y-5 bg-obsidian-950">
          {activeEmail ? (
            <div className="space-y-4">
              {/* Threat Banner if High Risk */}
              {activeEmail.riskAssessment.level === 'high_risk' && (
                <div className="p-4 rounded-2xl bg-vampire-950/60 border border-vampire-700 space-y-2 shadow-glow-vampire">
                  <div className="flex items-center gap-2 text-xs font-bold text-vampire-300 font-mono">
                    <ShieldAlert className="w-5 h-5 text-vampire-400" />
                    <span>🦇 POSSESSED BUTLER AIR-GAP ALERT: Malicious Prompt Injection Neutralized</span>
                  </div>
                  <ul className="text-xs text-vampire-200/90 font-mono list-disc pl-5 space-y-1">
                    {activeEmail.riskAssessment.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Message Header Card with Actions */}
              <div className="relative p-4.5 rounded-2xl bg-obsidian-900 border border-pumpkin-900/60 space-y-3 font-mono shadow-md group">
                <SpiderWebCorner className="top-0 right-0 w-16 h-16 opacity-20 group-hover:opacity-40" />
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white font-sans">{activeEmail.subject}</h3>
                      {activeEmail.id.startsWith('live-imap-') && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          Live IMAP
                        </span>
                      )}
                      {!activeEmail.isRead && (
                        <span className="px-2 py-0.5 rounded bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-700 text-[10px] font-bold">
                          Unread
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300">
                      From: <span className="text-pumpkin-300 font-bold">{activeEmail.from}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      To: <span className="text-slate-400">{activeEmail.to}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Mark as Read / Unread */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(activeEmail.id, !activeEmail.isRead)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          activeEmail.isRead
                            ? 'bg-obsidian-950 text-slate-300 border-pumpkin-900 hover:bg-obsidian-800 hover:text-white'
                            : 'bg-gradient-to-r from-pumpkin-600 to-ember-500 text-obsidian-950 border-pumpkin-400 shadow-glow-pumpkin'
                        }`}
                        title={activeEmail.isRead ? "Mark this email as unread" : "Mark this email as read"}
                      >
                        {activeEmail.isRead ? (
                          <>
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>Mark as Unread</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-obsidian-950" />
                            <span>Mark as Read</span>
                          </>
                        )}
                      </button>
                    )}
                    <span className="text-xs text-pumpkin-400/80 font-mono hidden lg:inline">
                      {new Date(activeEmail.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prompt Guard 2 Security Verification Banner */}
              <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-witch-800 flex items-center justify-between gap-3 font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-obsidian-950 border border-witch-700 text-pumpkin-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Prompt Guard 2 ML Shield:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeEmail.promptGuardScan?.badge_color === 'green' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        activeEmail.promptGuardScan?.badge_color === 'yellow' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        activeEmail.promptGuardScan?.badge_color === 'red' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                        'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        {activeEmail.promptGuardScan?.risk_tier || 'PROMPT GUARD READY'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeEmail.promptGuardScan 
                        ? `Risk Score: ${activeEmail.promptGuardScan.risk_score}% • Confidence: ${Math.round(activeEmail.promptGuardScan.confidence * 100)}% • Latency: ${activeEmail.promptGuardScan.latency_ms}ms`
                        : 'Pretrained ML model loaded on Apple Silicon Metal Performance Shaders (MPS)'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectEmailForInspector(activeEmail)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-witch-800 to-witch-900 hover:from-witch-700 hover:to-witch-800 text-pumpkin-300 border border-witch-600 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-sm"
                  title="Open Inspector Drawer to see full Prompt Guard chunk analysis"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Evidence</span>
                </button>
              </div>

              {/* Email Body */}
              <div className="p-5 rounded-2xl bg-obsidian-900/90 border border-pumpkin-900/50 text-[13px] text-slate-200 leading-relaxed font-sans whitespace-pre-wrap shadow-inner">
                {activeEmail.body}
              </div>

              {/* Attachments & OCR summary */}
              {activeEmail.attachments.length > 0 && (
                <div className="space-y-3 font-mono">
                  <h4 className="text-xs font-bold text-pumpkin-300 uppercase">Document & OCR Attachments:</h4>
                  {activeEmail.attachments.map((att) => (
                    <div key={att.id} className="p-4 rounded-2xl bg-obsidian-900 border border-pumpkin-900/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-pumpkin-300">
                          <FileText className="w-4 h-4" />
                          <span>{att.name}</span>
                        </div>
                        <button
                          onClick={() => onSelectEmailForInspector(activeEmail)}
                          className="px-3 py-1 rounded-lg bg-obsidian-950 text-pumpkin-300 border border-pumpkin-800 hover:bg-pumpkin-950 text-xs flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Inspector</span>
                        </button>
                      </div>

                      {att.ocrSummary && (
                        <div className="p-2.5 rounded-xl bg-obsidian-950 border border-pumpkin-900/80 text-xs text-pumpkin-200">
                          <span className="font-bold text-pumpkin-400">OCR Summary:</span> {att.ocrSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono">Select an email to view full details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
