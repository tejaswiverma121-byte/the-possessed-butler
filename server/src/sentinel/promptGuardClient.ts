import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { SecurityGuard } from './securityGuard.js';

export interface PromptGuardScanResult {
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
}

export interface SecurityStats {
  total_scans: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  unavailable_count: number;
  attacks_detected_count: number;
  average_risk_score: number;
  average_latency_ms: number;
  model_name: string;
  model_ready: boolean;
  device: string;
}

export class PromptGuardClient {
  private static serviceUrl = process.env.SECURITY_SERVICE_URL || 'http://127.0.0.1:8001';
  private static venvPythonPath = path.resolve(process.cwd(), 'security', '.venv', 'bin', 'python');
  private static fallbackHistory: PromptGuardScanResult[] = [];

  /**
   * Scans an email payload for Prompt Injection attacks.
   * Priority 1: Query local FastAPI daemon at http://127.0.0.1:8001
   * Priority 2: Direct one-shot local Python CLI runner using the dedicated venv
   * Priority 3: Fallback explicitly with scan_status: "unavailable" (NEVER silently safe)
   */
  public static async scanEmail(email: {
    id?: string;
    from: string;
    to?: string;
    subject: string;
    body: string;
    html?: string;
    attachments?: any[];
  }): Promise<PromptGuardScanResult> {
    const startTime = Date.now();

    // 1. Try FastAPI microservice
    try {
      const response = await fetch(`${this.serviceUrl}/api/security/scan-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: email.id,
          from: email.from,
          to: email.to || '',
          subject: email.subject || '',
          body: email.body || '',
          html: email.html || '',
          attachments: email.attachments || []
        }),
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const result = (await response.json()) as PromptGuardScanResult;
        this._recordAuditLog(result, email);
        return result;
      }
    } catch (daemonErr) {
      // Microservice may not be running yet; try direct Python CLI invocation
    }

    // 2. Try direct local Python invocation via virtual environment
    if (fs.existsSync(this.venvPythonPath)) {
      try {
        const pyResult = await this._runDirectPythonScan(email);
        if (pyResult) {
          this._recordAuditLog(pyResult, email);
          return pyResult;
        }
      } catch (cliErr) {
        console.warn('[PromptGuardClient] Direct Python CLI execution failed:', cliErr);
      }
    }

    // 3. Fallback: Model is unavailable
    // MANDATORY REQUIREMENT: Do not silently classify as safe.
    // Return explicit scan_status: "unavailable", decision: "HOLD_FOR_REVIEW", allow_llm: false
    const fallbackScan: PromptGuardScanResult = {
      scan_id: `pg-unavail-${Date.now()}`,
      email_id: email.id || `em-${Date.now()}`,
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - startTime,
      scan_status: 'unavailable',
      model: process.env.PROMPT_GUARD_MODEL_ID || 'meta-llama/Llama-Prompt-Guard-2-22M',
      attack_detected: false,
      classification: 'scan_unavailable',
      risk_score: 50,
      confidence: 0.0,
      flagged_chunks: [],
      total_chunks_scanned: 0,
      explanation: 'Prompt Guard inference engine is offline or unavailable. Mandatory human supervisor review required before automated LLM ingestion.',
      has_attachments_scanned: Boolean(email.attachments && email.attachments.length > 0),
      attachment_count: email.attachments?.length || 0,
      hidden_findings: [],
      decision: 'HOLD_FOR_REVIEW',
      risk_tier: 'SCAN_UNAVAILABLE',
      allow_llm_processing: false,
      require_user_review: true,
      badge_color: 'grey',
      summary: 'Security scan unavailable. Automated processing suspended until verified by user.',
      policy_enforcements: [
        'Main LLM processing blocked to prevent untrusted execution',
        'Automatic email sending and forwarding disabled',
        'Manual user approval mandatory'
      ]
    };

    this.fallbackHistory.unshift(fallbackScan);
    if (this.fallbackHistory.length > 50) this.fallbackHistory.pop();

    SecurityGuard.logSecurityEvent({
      eventType: 'prompt_injection_neutralized',
      severity: 'warning',
      source: email.from,
      details: `Prompt Guard scan unavailable for "${email.subject}". Holding email for review.`,
      canaryTriggered: false,
      mitigationTaken: 'Quarantined message from automated LLM pipeline due to unavailable ML scanner.'
    });

    return fallbackScan;
  }

  /**
   * Runs local one-shot Python runner
   */
  private static async _runDirectPythonScan(email: any): Promise<PromptGuardScanResult | null> {
    return new Promise((resolve) => {
      const script = `
import json, sys
from security.security_engine import SecurityEngine
try:
    payload = json.loads(sys.stdin.read())
    engine = SecurityEngine.get_instance()
    result = engine.scan_email(payload)
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
      const child = spawn(this.venvPythonPath, ['-c', script], {
        cwd: path.resolve(process.cwd())
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

      child.on('close', (code) => {
        if (code === 0 && stdout) {
          try {
            const parsed = JSON.parse(stdout);
            if (!parsed.error) {
              resolve(parsed as PromptGuardScanResult);
              return;
            }
          } catch (e) {}
        }
        resolve(null);
      });

      child.on('error', () => resolve(null));

      child.stdin.write(JSON.stringify(email));
      child.stdin.end();
    });
  }

  private static _recordAuditLog(result: PromptGuardScanResult, email: any) {
    if (result.risk_tier === 'HIGH_RISK') {
      SecurityGuard.logSecurityEvent({
        eventType: 'prompt_injection_neutralized',
        severity: 'critical',
        source: email.from,
        details: `[Prompt Guard 2] High-risk prompt injection neutralized (Score: ${result.risk_score}%, Model: ${result.model}). ${result.explanation}`,
        canaryTriggered: false,
        mitigationTaken: 'Quarantined from LLM. All tool execution and auto-forwarding revoked.'
      });
    } else if (result.risk_tier === 'MEDIUM_RISK') {
      SecurityGuard.logSecurityEvent({
        eventType: 'prompt_injection_neutralized',
        severity: 'warning',
        source: email.from,
        details: `[Prompt Guard 2] Suspicious prompt patterns identified (Score: ${result.risk_score}%). User verification required.`,
        canaryTriggered: false,
        mitigationTaken: 'Suspended automated actions. Flagged email with warning in butler UI.'
      });
    } else if (result.risk_tier === 'LOW_RISK') {
      SecurityGuard.logSecurityEvent({
        eventType: 'scan_completed',
        severity: 'info',
        source: email.from,
        details: `[Prompt Guard 2] Scan verified safe (Score: ${result.risk_score}%, Latency: ${result.latency_ms}ms).`,
        canaryTriggered: false,
        mitigationTaken: 'Content processed as isolated untrusted external text.'
      });
    }
  }

  public static async getScanHistory(): Promise<any[]> {
    try {
      const res = await fetch(`${this.serviceUrl}/api/security/scan-history`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.history || [];
      }
    } catch (e) {}
    return this.fallbackHistory;
  }

  public static async getStatistics(): Promise<SecurityStats> {
    try {
      const res = await fetch(`${this.serviceUrl}/api/security/statistics`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        return (await res.json()) as SecurityStats;
      }
    } catch (e) {}

    const total = this.fallbackHistory.length;
    return {
      total_scans: total,
      low_risk_count: this.fallbackHistory.filter(s => s.risk_tier === 'LOW_RISK').length,
      medium_risk_count: this.fallbackHistory.filter(s => s.risk_tier === 'MEDIUM_RISK').length,
      high_risk_count: this.fallbackHistory.filter(s => s.risk_tier === 'HIGH_RISK').length,
      unavailable_count: this.fallbackHistory.filter(s => s.risk_tier === 'SCAN_UNAVAILABLE').length,
      attacks_detected_count: this.fallbackHistory.filter(s => s.attack_detected).length,
      average_risk_score: total > 0 ? Math.round(this.fallbackHistory.reduce((a, b) => a + b.risk_score, 0) / total) : 0,
      average_latency_ms: total > 0 ? Math.round(this.fallbackHistory.reduce((a, b) => a + b.latency_ms, 0) / total) : 0,
      model_name: process.env.PROMPT_GUARD_MODEL_ID || 'meta-llama/Llama-Prompt-Guard-2-22M',
      model_ready: false,
      device: 'offline_or_direct'
    };
  }
}
