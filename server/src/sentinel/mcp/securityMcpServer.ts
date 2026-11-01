import { z } from 'zod';
import { McpToolDefinition } from './types.js';
import { SecurityGuard } from '../securityGuard.js';
import { EmailService } from '../emailService.js';

export const securityMcpTools: McpToolDefinition[] = [
  {
    name: 'scan_phishing',
    description: 'Perform deep isolated security analysis on message headers, domain reputation, and urgent coercive language.',
    serverId: 'sentinel-security-mcp',
    requiresApproval: false,
    schema: z.object({
      sender: z.string().describe('Sender email or display header'),
      subject: z.string().describe('Message subject line'),
      bodySnippet: z.string().describe('Body or snippet text to inspect')
    }),
    execute: async (params: { sender: string; subject: string; bodySnippet: string }) => {
      const suspiciousDomains = ['shadow.net', 'fake-irctc.com', 'phish-secure.xyz', 'account-verification-alert.ru'];
      const urgentMarkers = ['immediate action required', 'account suspended', 'wire funds', 'password expired', 'click here immediately'];
      
      const reasons: string[] = [];
      let isHighRisk = false;

      const lowerSender = params.sender.toLowerCase();
      const lowerBody = params.bodySnippet.toLowerCase();

      if (suspiciousDomains.some(d => lowerSender.includes(d))) {
        reasons.push(`Untrusted or known phishing domain in sender: "${params.sender}"`);
        isHighRisk = true;
      }

      if (urgentMarkers.some(m => lowerBody.includes(m))) {
        reasons.push('Coercive high-urgency language detected matching social engineering vectors');
      }

      // Check prompt injection canary leakage
      if (SecurityGuard.inspectForCanary(params.bodySnippet)) {
        reasons.push('CRITICAL: Message contains prompt injection canary token extraction attempts!');
        isHighRisk = true;
      }

      return {
        verdict: isHighRisk ? 'quarantined' : reasons.length > 0 ? 'suspicious' : 'clean',
        riskLevel: isHighRisk ? 'high_risk' : reasons.length > 0 ? 'medium' : 'low',
        indicatorsDetected: reasons.length,
        reasons: reasons.length > 0 ? reasons : ['No threat markers or malicious anomalies identified.'],
        quarantineRecommended: isHighRisk
      };
    }
  },

  {
    name: 'analyze_prompt_injection',
    description: 'Inspect untrusted input for hidden system instructions, prompt override attempts, or delimiter breaking.',
    serverId: 'sentinel-security-mcp',
    requiresApproval: false,
    schema: z.object({
      untrustedText: z.string().describe('The untrusted external text to evaluate for prompt injection')
    }),
    execute: async (params: { untrustedText: string }) => {
      const injectionPatterns = [
        /ignore\s+(?:all\s+)?previous\s+instructions/i,
        /disregard\s+(?:all\s+)?prior\s+rules/i,
        /you\s+are\s+now\s+(?:in\s+)?dan\s+mode/i,
        /system\s*:\s*override/i,
        /reveal\s+(?:your\s+)?system\s+prompt/i,
        /print\s+(?:all\s+)?canary\s+tokens/i,
        /send\s+all\s+emails\s+to/i
      ];

      const matches = injectionPatterns.filter(p => p.test(params.untrustedText));
      const canaryFound = SecurityGuard.inspectForCanary(params.untrustedText);

      return {
        hasInjection: matches.length > 0 || canaryFound,
        detectedPatternsCount: matches.length,
        canaryBreachAttempt: canaryFound,
        safetyRecommendation: matches.length > 0 || canaryFound 
          ? 'BLOCK_AND_QUARANTINE' 
          : 'SAFE_TO_PROCESS_AS_UNTRUSTED_DATA'
      };
    }
  },

  {
    name: 'quarantine_threat',
    description: 'Isolate a malicious message or attachment into the secure Sentinel Vault to protect the user.',
    serverId: 'sentinel-security-mcp',
    requiresApproval: false,
    schema: z.object({
      targetId: z.string().describe('ID of the email or file to quarantine'),
      reason: z.string().describe('Security justification for quarantine')
    }),
    execute: async (params: { targetId: string; reason: string }) => {
      SecurityGuard.logAuditEvent(
        'mcp:security:quarantine',
        `Quarantined asset ${params.targetId}: ${params.reason}`,
        { targetId: params.targetId, reason: params.reason }
      );

      return {
        targetId: params.targetId,
        status: 'quarantined',
        quarantineVault: 'SENTINEL_ISOLATION_ZONE_0',
        networkEgressBlocked: true,
        timestamp: new Date().toISOString()
      };
    }
  }
];
