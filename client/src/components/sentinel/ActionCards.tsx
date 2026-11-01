import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  FileText, 
  Eye, 
  Lock,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { SentinelEmail } from '../../types';

export const getCleanEmailSummary = (body: string, subject: string, query?: string): string => {
  if (!body) return `Message regarding "${subject}".`;
  const clean = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[image:[^\]]*\]/gi, ' ')
    .replace(/\[https?:\/\/[^\]]*\]/gi, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();

  // If a search query keyword is provided, extract the snippet surrounding the match!
  if (query && query.trim().length > 1) {
    const qLower = query.toLowerCase().trim();
    const qBase = qLower.endsWith('s') && qLower.length > 3 ? qLower.slice(0, -1) : qLower;
    const cleanLower = clean.toLowerCase();
    let idx = cleanLower.indexOf(qLower);
    if (idx === -1 && qBase !== qLower) {
      idx = cleanLower.indexOf(qBase);
    }
    if (idx !== -1) {
      const matchLen = cleanLower.includes(qLower) ? qLower.length : qBase.length;
      const start = Math.max(0, idx - 60);
      const end = Math.min(clean.length, idx + matchLen + 140);
      let snippet = clean.slice(start, end).trim();
      if (start > 0) snippet = '...' + snippet;
      if (end < clean.length) snippet = snippet + '...';
      return snippet;
    }
  }

  if (clean.length < 15) {
    return `Notification message regarding "${subject}". Click below to read full email content.`;
  }
  if (clean.length > 210) {
    const cut = clean.slice(0, 210);
    const lastP = cut.lastIndexOf('.');
    if (lastP > 80) return cut.slice(0, lastP + 1);
    const lastS = cut.lastIndexOf(' ');
    return (lastS > 0 ? cut.slice(0, lastS) : cut) + '...';
  }
  return clean;
};

const getGmailSearchUrl = (queryOrSubject: string) => {
  const clean = queryOrSubject.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
  return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(clean)}`;
};

interface ApprovalCardProps {
  taskId: string;
  checkpoint: {
    id: string;
    actionType: string;
    title: string;
    description: string;
    recipientOrDestination?: string;
    amountOrFee?: string;
    details: Record<string, any>;
    expiresAt: string;
    status: string;
    approvalToken?: string;
  };
  onResolve: (taskId: string, approved: boolean) => void;
}

export const ApprovalRequestCard: React.FC<ApprovalCardProps> = ({ taskId, checkpoint, onResolve }) => {
  const [resolvedStatus, setResolvedStatus] = useState<string>(checkpoint.status || 'pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever checkpoint.status changes
  React.useEffect(() => {
    if (checkpoint.status) {
      setResolvedStatus(checkpoint.status);
    }
  }, [checkpoint.status]);

  const handleAction = async (approved: boolean) => {
    setIsSubmitting(true);
    try {
      await onResolve(taskId, approved);
      setResolvedStatus(approved ? 'approved' : 'rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApproved = checkpoint.status === 'approved' || resolvedStatus === 'approved';
  const isRejected = checkpoint.status === 'rejected' || resolvedStatus === 'rejected';

  if (isApproved) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 text-xs text-emerald-200 flex items-center justify-between shadow-lg shadow-emerald-950/40">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-sm">Action Authorized & Dispatched</div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5 font-mono">
              Verified with single-use approval token. Outgoing side-effect executed safely.
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg bg-emerald-900 border border-emerald-700 font-mono font-bold text-[11px] text-emerald-300">
          ✓ SENT
        </span>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-obsidian-900/90 border border-witch-800 text-xs text-slate-400 flex items-center gap-2.5 shadow-md">
        <XCircle className="w-5 h-5 text-vampire-400 shrink-0" />
        <div>
          <div className="font-bold text-slate-200 text-sm">Action Cancelled by User</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">Execution aborted. No emails or transactions were sent.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4.5 rounded-2xl bg-obsidian-900/95 border-2 border-pumpkin-500/80 shadow-glow-pumpkin space-y-3.5 backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-start gap-2 pb-2.5 border-b border-witch-800/80">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-pumpkin-500/20 text-pumpkin-400 border border-pumpkin-500/30">
            <Lock className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-display font-bold text-white tracking-wide">{checkpoint.title}</h4>
            <p className="text-xs text-pumpkin-200/70 font-sans mt-0.5">{checkpoint.description}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-600/80 animate-pulse tracking-wider">
          🎃 APPROVAL REQUIRED
        </span>
      </div>

      {/* Details Box */}
      <div className="p-3.5 rounded-xl bg-obsidian-950/90 border border-witch-900/80 space-y-2 text-xs font-mono">
        {checkpoint.details.from && (
          <div className="flex justify-between items-center pb-1.5 mb-1.5 border-b border-witch-900/60">
            <span className="text-slate-400">From (Your Gmail):</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {checkpoint.details.from}
            </span>
          </div>
        )}
        {checkpoint.details.to && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Recipient:</span>
            <span className="text-pumpkin-300 font-bold">{checkpoint.details.to}</span>
          </div>
        )}
        {checkpoint.details.subject && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Subject:</span>
            <span className="text-slate-200 font-medium">{checkpoint.details.subject}</span>
          </div>
        )}
        {checkpoint.details.body && (
          <div className="mt-2 pt-2 border-t border-witch-900 text-slate-300 text-xs whitespace-pre-wrap font-sans bg-witch-950/60 p-2.5 rounded-lg border border-witch-800/40 leading-relaxed">
            {checkpoint.details.body}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          onClick={() => handleAction(true)}
          disabled={isSubmitting}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-pumpkin"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Authorize & Send Now</span>
        </button>
        <button
          onClick={() => handleAction(false)}
          disabled={isSubmitting}
          className="py-2.5 px-4 rounded-xl bg-obsidian-800 hover:bg-witch-900 border border-witch-800 text-slate-300 font-medium text-xs transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const EmailPreviewCard: React.FC<{ 
  email: SentinelEmail & { query?: string; aiSummary?: string }; 
  onViewDetails?: (email: SentinelEmail) => void;
  onOpenInbox?: (email: SentinelEmail) => void;
}> = ({ email, onViewDetails, onOpenInbox }) => {
  const isHighRisk = email.riskAssessment?.level === 'high_risk';
  const gmailUrl = getGmailSearchUrl(email.subject);
  const summaryDescription = email.aiSummary || getCleanEmailSummary(email.body, email.subject, email.query);

  return (
    <div className={`mt-3 p-4.5 rounded-2xl border transition-all ${
      isHighRisk 
        ? 'bg-vampire-950/40 border-vampire-700/80 shadow-glow-vampire' 
        : 'bg-obsidian-900/95 border-witch-800 hover:border-pumpkin-500/60 shadow-xl'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start gap-2 pb-2.5 border-b border-witch-850">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-pumpkin-400 shrink-0" />
            <h4 className="text-sm font-bold text-white tracking-wide">{email.subject}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
            <span>From:</span>
            <span className="text-pumpkin-200 font-mono font-medium">{email.from}</span>
            <span className="text-slate-600">•</span>
            <span>{new Date(email.date).toLocaleDateString()}</span>
          </p>
        </div>

        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider shrink-0 ${
          isHighRisk 
            ? 'bg-vampire-950 text-vampire-300 border border-vampire-700 animate-pulse' 
            : 'bg-witch-950 text-pumpkin-300 border border-witch-700'
        }`}>
          {isHighRisk ? '🩸 HIGH RISK' : '🎃 VERIFIED'}
        </span>
      </div>

      {/* Description / Summary Box */}
      <div className="mt-3 p-3 rounded-xl bg-witch-950/70 border border-witch-850/60 text-xs text-slate-200 leading-relaxed font-sans">
        <div className="text-[10px] font-mono font-bold text-pumpkin-400 mb-1 flex items-center gap-1">
          <span>AI EXECUTIVE SUMMARY</span>
        </div>
        <p className="text-slate-300">{summaryDescription}</p>
      </div>

      {/* Attachment info if any */}
      {email.attachments?.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-witch-900 flex items-center gap-2 text-xs text-slate-300">
          <FileText className="w-3.5 h-3.5 text-pumpkin-400 shrink-0" />
          <span className="font-mono text-xs text-slate-200 truncate">{email.attachments[0].name}</span>
          <span className="text-[10px] text-slate-500">({Math.round(email.attachments[0].sizeBytes / 1024)} KB)</span>
        </div>
      )}

      {/* Interactive Action & Redirect Buttons */}
      <div className="mt-3.5 pt-3 border-t border-witch-850/80 flex flex-wrap items-center gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(email)}
            className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-pumpkin"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect & Read</span>
          </button>
        )}

        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-3.5 rounded-xl bg-witch-900/90 hover:bg-witch-800 text-pumpkin-300 hover:text-pumpkin-200 border border-witch-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          title="Open in your real Gmail tab"
        >
          <span>Open in Gmail</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {onOpenInbox && (
          <button
            onClick={() => onOpenInbox(email)}
            className="py-1.5 px-3 rounded-xl bg-obsidian-800 hover:bg-witch-800 text-slate-300 hover:text-white border border-witch-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox View</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const EmailListCard: React.FC<{
  data: {
    title?: string;
    emails: SentinelEmail[];
    query?: string;
  };
  onViewDetails?: (email: SentinelEmail) => void;
  onOpenInbox?: (email: SentinelEmail) => void;
}> = ({ data, onViewDetails, onOpenInbox }) => {
  const { title, emails = [], query = '' } = data;

  if (emails.length === 0) {
    const gmailFallbackUrl = query ? getGmailSearchUrl(query) : 'https://mail.google.com';
    return (
      <div className="mt-3 p-4 rounded-2xl bg-obsidian-900/90 border border-witch-800 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-pumpkin-300 font-bold text-sm">
          <Mail className="w-4 h-4" />
          <span>No matching emails found in latest sync</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          No emails matching <span className="text-pumpkin-200 font-semibold font-mono">"{query}"</span> were found in your recent messages. You can search directly in your real Gmail inbox:
        </p>
        <a
          href={gmailFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 text-xs font-bold transition-all shadow-glow-pumpkin"
        >
          <span>Search in Gmail ↗</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4.5 rounded-2xl bg-obsidian-900/95 border border-pumpkin-900/60 shadow-xl space-y-3 backdrop-blur-md">
      {title && (
        <div className="flex justify-between items-center pb-2 border-b border-witch-800">
          <h4 className="text-xs font-mono font-bold text-pumpkin-300 tracking-wider flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>{title.toUpperCase()}</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400 bg-obsidian-950 px-2 py-0.5 rounded border border-witch-850">
            {emails.length} messages
          </span>
        </div>
      )}

      <div className="space-y-2.5">
        {emails.map((email) => {
          const gmailUrl = getGmailSearchUrl(email.subject);
          const summary = getCleanEmailSummary(email.body, email.subject, query);
          const isHighRisk = email.riskAssessment?.level === 'high_risk';

          return (
            <div
              key={email.id}
              className={`p-3 rounded-xl border transition-all ${
                isHighRisk 
                  ? 'bg-vampire-950/30 border-vampire-800/60' 
                  : 'bg-obsidian-950/80 border-witch-850/80 hover:border-pumpkin-500/50'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{email.subject}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-pumpkin-200 font-mono truncate">{email.from}</span>
                    <span className="text-slate-600">•</span>
                    <span>{new Date(email.date).toLocaleDateString()}</span>
                  </p>
                </div>
                {isHighRisk && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-vampire-950 text-vampire-300 border border-vampire-700">
                    PHISH
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed bg-witch-950/50 p-2 rounded-lg border border-witch-900/60">
                {summary}
              </p>

              {/* Action & Redirect Buttons */}
              <div className="mt-2.5 flex items-center gap-2 pt-1.5 border-t border-witch-900">
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(email)}
                    className="py-1 px-2.5 rounded-lg bg-pumpkin-500/20 hover:bg-pumpkin-500/30 text-pumpkin-300 border border-pumpkin-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                )}

                {onOpenInbox && (
                  <button
                    onClick={() => onOpenInbox(email)}
                    className="py-1 px-2.5 rounded-lg bg-obsidian-800 hover:bg-witch-800 text-slate-300 hover:text-white border border-witch-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Inbox className="w-3 h-3" />
                    <span>Inbox</span>
                  </button>
                )}

                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2.5 rounded-lg bg-witch-900 hover:bg-witch-800 text-pumpkin-300 hover:text-pumpkin-200 border border-witch-700/80 text-[11px] font-bold flex items-center gap-1 transition-colors ml-auto shadow-sm"
                >
                  <span>Open in Gmail</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SecurityAlertCard: React.FC<{ email: SentinelEmail }> = ({ email }) => {
  return (
    <div className="mt-3 p-4.5 rounded-2xl bg-vampire-950/60 border-2 border-vampire-600 shadow-glow-vampire space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-vampire-300">
        <ShieldAlert className="w-5 h-5 text-vampire-400 shrink-0" />
        <span>🦇 Hostile Prompt Injection & Phishing Quarantined</span>
      </div>

      <div className="text-xs text-vampire-200/90 leading-relaxed space-y-1 font-mono">
        {email.riskAssessment?.reasons.map((r, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="text-vampire-400 font-bold">⚠️</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-obsidian-950/90 border border-vampire-900/60 text-xs font-mono text-slate-400">
        <span className="text-pumpkin-400 font-bold">Air-Gap Protection:</span> The Quarantined Reader stripped instructions. No credentials or canary secrets leaked.
      </div>
    </div>
  );
};
