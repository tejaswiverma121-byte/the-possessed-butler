export interface ImapConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
  mailbox?: string;
}

export interface ImapStatus {
  isConnected: boolean;
  provider: 'gmail' | 'outlook' | 'custom_imap' | 'simulation';
  host?: string;
  user?: string;
  mailbox?: string;
  lastSyncedAt?: string;
  totalSynced?: number;
  lastError?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  provider: 'gmail' | 'outlook' | 'custom_imap' | 'simulation';
  imapHost?: string;
  imapPort?: number;
  connectedAt: string;
  trustedSenders: string[];
  blockedSenders: string[];
  isLiveImapConnected?: boolean;
  imapStatus?: ImapStatus;
}


export type RiskLevel = 'low' | 'suspicious' | 'high_risk' | 'inconclusive';

export interface EmailAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  extractedText?: string;
  ocrSummary?: string;
  riskLevel: RiskLevel;
  riskFindings: string[];
}

export interface EmailMessage {
  id: string;
  threadId?: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isRead: boolean;
  category: 'important' | 'urgent' | 'invoice' | 'routine' | 'suspicious';
  attachments: EmailAttachment[];
  riskAssessment: {
    level: RiskLevel;
    reasons: string[];
    canaryDetected: boolean;
    senderMatch: boolean;
    safeToPreview: boolean;
  };
  promptGuardScan?: {
    scan_id: string;
    email_id: string;
    timestamp: string;
    latency_ms: number;
    scan_status: 'completed' | 'unavailable' | 'error';
    model: string;
    attack_detected: boolean;
    classification: 'benign' | 'suspicious' | 'malicious' | 'scan_unavailable';
    risk_score: number;
    confidence: number;
    flagged_chunks: number[];
    total_chunks_scanned: number;
    explanation: string;
    has_attachments_scanned: boolean;
    attachment_count: number;
    hidden_findings: string[];
    decision: 'ALLOW_UNTRUSTED' | 'FLAGGED_FOR_REVIEW' | 'QUARANTINE_BLOCKED' | 'HOLD_FOR_REVIEW';
    risk_tier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'SCAN_UNAVAILABLE';
    allow_llm_processing: boolean;
    require_user_review: boolean;
    badge_color: 'green' | 'yellow' | 'red' | 'grey';
    summary: string;
    policy_enforcements: string[];
  };
}

export type TaskStatus = 
  | 'idle' 
  | 'planning' 
  | 'awaiting_approval' 
  | 'executing' 
  | 'verifying' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface TaskStep {
  id: string;
  name: string;
  tool: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  resultSnippet?: string;
}

export interface HumanApprovalCheckpoint {
  id: string;
  actionType: 'send_email' | 'delete_data' | 'execute_patch' | 'grant_permission';
  title: string;
  description: string;
  recipientOrDestination?: string;
  amountOrFee?: string;
  details: Record<string, any>;
  expiresAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvalToken?: string;
}

export interface SentinelTask {
  id: string;
  goal: string;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  progressPercent: number;
  requiredPermissions: string[];
  steps: TaskStep[];
  approvalCheckpoint?: HumanApprovalCheckpoint;
  resultSummary?: string;
  evidence: string[];
  residualRisks: string[];
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  eventType: 'canary_blocked' | 'prompt_injection_neutralized' | 'policy_denial' | 'approval_granted' | 'approval_rejected' | 'scan_completed' | 'sync_active';

  severity: 'info' | 'warning' | 'critical';
  source: string;
  details: string;
  canaryTriggered: boolean;
  mitigationTaken: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  taskRef?: string;
  actionCard?: {
    type: 'approval_request' | 'email_preview' | 'email_list' | 'security_alert';
    data: any;
  };
}
