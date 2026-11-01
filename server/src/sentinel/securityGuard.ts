import { SecurityEventLog, RiskLevel } from './types.js';

export class SecurityGuard {
  // Canary decoy tokens stored in server memory only
  private static canaryTokens: Set<string> = new Set([
    'CANARY_SENTINEL_CREDENTIAL_992xQ',
    'CANARY_MASTER_VAULT_KEY_7749',
    'CANARY_PAYMENT_WALLET_SECRET_5881'
  ]);

  private static auditLogs: SecurityEventLog[] = [];

  /**
   * Get active canary trap token for verification
   */
  public static getPrimaryCanary(): string {
    return Array.from(this.canaryTokens)[0];
  }

  /**
   * Add custom canary token
   */
  public static registerCanaryToken(token: string): void {
    if (token && token.trim().length > 5) {
      this.canaryTokens.add(token.trim());
    }
  }

  /**
   * Sanitize untrusted input before processing (Control Plane / Data Plane separation)
   */
  public static sanitizeUntrustedText(rawText: string): { cleanText: string; strippedInjections: string[] } {
    const stripped: string[] = [];

    let cleaned = rawText;

    // 1. Strip invisible zero-width unicode characters
    const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u2060\u180E]/g;
    if (zeroWidthRegex.test(cleaned)) {
      stripped.push('Zero-width invisible Unicode characters');
      cleaned = cleaned.replace(zeroWidthRegex, '');
    }

    // 2. Strip HTML comments often used for hidden system overrides
    const htmlCommentRegex = /<!--[\s\S]*?-->/g;
    const commentMatches = cleaned.match(htmlCommentRegex);
    if (commentMatches && commentMatches.length > 0) {
      stripped.push(`HTML injection comments (${commentMatches.length} detected)`);
      cleaned = cleaned.replace(htmlCommentRegex, ' [SANITIZED_HIDDEN_COMMENT] ');
    }

    // 3. Strip malicious image exfiltration patterns
    const markdownImgExfil = /!\[.*?\]\(https?:\/\/.*?(?:leak|token|key|cookie).*?\)/gi;
    if (markdownImgExfil.test(cleaned)) {
      stripped.push('Markdown image telemetry exfiltration pattern');
      cleaned = cleaned.replace(markdownImgExfil, ' [SANITIZED_IMAGE_EXFILTRATION] ');
    }

    return { cleanText: cleaned, strippedInjections: stripped };
  }

  /**
   * Scan any outbound payload for decoy canary tripwires
   */
  public static scanForCanaryLeak(payload: any, contextName = 'Tool Execution'): boolean {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);

    for (const canary of this.canaryTokens) {
      if (serialized.includes(canary)) {
        this.logSecurityEvent({
          eventType: 'canary_blocked',
          severity: 'critical',
          source: contextName,
          details: `Decoy Canary Token (${canary.slice(0, 12)}...) detected in outbound payload. Action aborted immediately!`,
          canaryTriggered: true,
          mitigationTaken: 'Immediate execution halt and socket termination before transmission.'
        });
        return true; // Canary leaked!
      }
    }
    return false;
  }

  /**
   * Alias for scanForCanaryLeak - checks if payload contains decoy canary tokens
   */
  public static inspectForCanary(payload: any, contextName = 'Tool Output Inspection'): boolean {
    return this.scanForCanaryLeak(payload, contextName);
  }

  /**
   * Helper to log audit events into the security ledger
   */
  public static logAuditEvent(
    action: string,
    details: string,
    extra?: any,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ): SecurityEventLog {
    return this.logSecurityEvent({
      eventType: severity === 'critical' ? 'canary_blocked' : severity === 'warning' ? 'prompt_injection_neutralized' : 'approval_granted',
      severity,
      source: action,
      details: extra ? `${details} ${JSON.stringify(extra)}` : details,
      canaryTriggered: severity === 'critical',
      mitigationTaken: 'Monitored and logged in Sentinel Security Vault'
    });
  }

  /**
   * Evaluate email content for phishing, impersonation, or prompt injection
   */
  public static evaluateEmailSafety(from: string, subject: string, body: string): {
    level: RiskLevel;
    reasons: string[];
    canaryDetected: boolean;
    senderMatch: boolean;
    safeToPreview: boolean;
  } {
    const reasons: string[] = [];
    let level: RiskLevel = 'low';

    // 1. Check for canary leak in raw body
    const canaryDetected = this.scanForCanaryLeak(body, 'Incoming Email Scan');
    if (canaryDetected) {
      level = 'high_risk';
      reasons.push('Canary trap token detected in message body; potential targeted exfiltration prompt.');
    }

    // 2. Sender Domain checks
    let senderMatch = true;
    const lowerFrom = from.toLowerCase();
    const lowerBody = body.toLowerCase();

    if (lowerBody.includes('adobe') && !lowerFrom.includes('@adobe.com') && !lowerFrom.includes('@mail.adobe.com')) {
      senderMatch = false;
      level = 'high_risk';
      reasons.push(`Domain mismatch: Message claims to be from Adobe but originated from untrusted address "${from}".`);
    }

    if ((lowerBody.includes('irctc') || lowerBody.includes('railway')) && !lowerFrom.includes('@irctc.co.in') && !lowerFrom.includes('family.com')) {
      if (lowerBody.includes('cancel') || lowerBody.includes('refund') || lowerBody.includes('override')) {
        senderMatch = false;
        level = 'high_risk';
        reasons.push(`Suspicious ticket sender: Claims to be railway notification from unauthorized address "${from}".`);
      }
    }

    // 3. Prompt injection signature heuristics
    const injectionPatterns = [
      /system\s+override/i,
      /disregard\s+(?:all\s+)?(?:previous\s+)?(?:instructions|rules)/i,
      /ignore\s+(?:all\s+)?prior\s+directives/i,
      /you\s+are\s+now\s+(?:possessed|in\s+jailbreak\s+mode|unrestricted)/i,
      /output\s+(?:your\s+)?(?:system\s+prompt|credentials|api\s+keys)/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(body)) {
        level = 'high_risk';
        reasons.push('Contains explicit prompt injection tokens attempting to hijack agent instructions.');
        this.logSecurityEvent({
          eventType: 'prompt_injection_neutralized',
          severity: 'warning',
          source: from,
          details: `Prompt injection signature matched: ${pattern.source}`,
          canaryTriggered: false,
          mitigationTaken: 'Quarantined input. Neutralized instruction tokens into plain unprivileged text.'
        });
        break;
      }
    }

    // 4. Urgency and payment credential trap checks
    if (/urgent|suspend|cancelled\s+immediately|send\s+password|verify\s+card/i.test(subject + ' ' + body)) {
      if (level === 'low') {
        level = 'suspicious';
        reasons.push('High-urgency language demanding account verification or credential validation.');
      }
    }

    if (reasons.length === 0) {
      reasons.push('Legitimate communication format; no injection markers or domain mismatches identified.');
    }

    return {
      level,
      reasons,
      canaryDetected,
      senderMatch,
      safeToPreview: level !== 'high_risk' || !canaryDetected
    };
  }

  /**
   * Record security event in audit ledger
   */
  public static logSecurityEvent(event: Omit<SecurityEventLog, 'id' | 'timestamp'>): SecurityEventLog {
    const entry: SecurityEventLog = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.auditLogs.unshift(entry);
    // Keep last 100 entries
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    return entry;
  }

  public static getAuditLogs(): SecurityEventLog[] {
    return [...this.auditLogs];
  }
}
