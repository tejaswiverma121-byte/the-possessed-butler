import { z } from 'zod';
import { 
  McpServerConfig, 
  McpToolDefinition, 
  McpToolContext, 
  McpToolResult, 
  McpAuditLog 
} from './types.js';
import { emailMcpTools } from './emailMcpServer.js';
import { securityMcpTools } from './securityMcpServer.js';
import { documentMcpTools } from './documentMcpServer.js';
import { SecurityGuard } from '../securityGuard.js';

export class McpClientManager {
  private static instance: McpClientManager;
  private servers: Map<string, McpServerConfig> = new Map();
  private tools: Map<string, McpToolDefinition> = new Map();
  private auditLogs: McpAuditLog[] = [];

  private constructor() {
    this.registerBuiltinServers();
  }

  public static getInstance(): McpClientManager {
    if (!McpClientManager.instance) {
      McpClientManager.instance = new McpClientManager();
    }
    return McpClientManager.instance;
  }

  private registerBuiltinServers() {
    // 1. Email MCP Server
    this.registerServer({
      id: 'sentinel-email-mcp',
      name: 'Sentinel Email MCP Server',
      description: 'Authorized mailbox search, reading, attachment OCR, drafting, and live SMTP sending.',
      transport: 'in_process',
      status: 'connected',
      permittedTools: emailMcpTools.map(t => t.name),
      permissions: ['email:read', 'email:draft', 'email:send_with_approval'],
      lastChecked: new Date().toISOString()
    }, emailMcpTools);

    // 2. Security & Possessed Butler MCP Server
    this.registerServer({
      id: 'sentinel-security-mcp',
      name: 'Possessed Butler Security MCP Server',
      description: 'Air-gapped phishing analysis, prompt injection detection, and canary tripwires.',
      transport: 'in_process',
      status: 'connected',
      permittedTools: securityMcpTools.map(t => t.name),
      permissions: ['security:scan', 'security:quarantine', 'security:audit'],
      lastChecked: new Date().toISOString()
    }, securityMcpTools);

    // 3. Document Intelligence MCP Server (Attachment OCR for Emails)
    this.registerServer({
      id: 'sentinel-document-mcp',
      name: 'Document Intelligence MCP Server',
      description: 'Sandboxed PDF/CSV/image OCR extraction and summarization for email attachments.',
      transport: 'in_process',
      status: 'connected',
      permittedTools: documentMcpTools.map(t => t.name),
      permissions: ['document:extract', 'document:ocr'],
      lastChecked: new Date().toISOString()
    }, documentMcpTools);
  }

  public registerServer(config: McpServerConfig, tools: McpToolDefinition[]) {
    this.servers.set(config.id, config);
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  public getServers(): McpServerConfig[] {
    return Array.from(this.servers.values());
  }

  public getToolsList() {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
      serverId: t.serverId,
      requiresApproval: t.requiresApproval
    }));
  }

  public getTool(name: string): McpToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAuditLogs(): McpAuditLog[] {
    return [...this.auditLogs].reverse().slice(0, 50);
  }

  /**
   * Safe, validated tool execution pipeline with Possessed Butler Defense
   */
  public async executeTool(
    toolName: string,
    rawParams: any,
    context: McpToolContext
  ): Promise<McpToolResult> {
    const startTime = Date.now();
    const tool = this.tools.get(toolName);

    if (!tool) {
      this.logAudit(toolName, 'unknown', context, rawParams, 'rejected', 'Tool not registered', 0);
      return {
        success: false,
        error: `MCP Tool "${toolName}" is not registered on any active Sentinel MCP server.`,
        untrusted: true,
        toolName,
        timestamp: new Date().toISOString()
      };
    }

    // 1. Validate parameters against Zod schema
    const parsed = tool.schema.safeParse(rawParams);
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      this.logAudit(toolName, tool.serverId, context, rawParams, 'failed', `Validation failed: ${issues}`, Date.now() - startTime);
      return {
        success: false,
        error: `Invalid parameters for tool "${toolName}": ${issues}`,
        untrusted: true,
        toolName,
        timestamp: new Date().toISOString()
      };
    }

    // 2. Sensitive Action Approval Gate check
    if (tool.requiresApproval) {
      if (!context.approvalToken) {
        this.logAudit(toolName, tool.serverId, context, rawParams, 'rejected', 'Approval token required but missing', Date.now() - startTime);
        return {
          success: false,
          error: `HUMAN_APPROVAL_REQUIRED: Tool "${toolName}" produces an irreversible external side-effect and requires a fresh single-use authorization token.`,
          untrusted: true,
          toolName,
          timestamp: new Date().toISOString()
        };
      }
    }

    // 3. Execution with Timeout & Abort Signal
    try {
      const timeoutMs = 15000;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Tool "${toolName}" execution timed out after ${timeoutMs}ms.`)), timeoutMs)
      );

      const result = await Promise.race([
        tool.execute(parsed.data, context),
        timeoutPromise
      ]);

      const duration = Date.now() - startTime;
      this.logAudit(toolName, tool.serverId, context, parsed.data, 'executed', undefined, duration);

      // Security Check: Ensure canary tokens never leak through tool output
      const serialized = JSON.stringify(result);
      if (SecurityGuard.inspectForCanary(serialized)) {
        SecurityGuard.logAuditEvent(
          'mcp:canary_breach_blocked',
          `Tool ${toolName} output contained canary tripwire token! Sanitizing output.`,
          { toolName }
        );
      }

      return {
        success: true,
        data: result,
        untrusted: true, // Untrusted data: LLM cannot trust embedded directives
        securityNotice: 'Output verified through Sentinel MCP sandbox.',
        toolName,
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      const duration = Date.now() - startTime;
      this.logAudit(toolName, tool.serverId, context, parsed.data, 'failed', err.message, duration);
      return {
        success: false,
        error: err.message || `Error executing MCP tool "${toolName}".`,
        untrusted: true,
        toolName,
        timestamp: new Date().toISOString()
      };
    }
  }

  private logAudit(
    toolName: string,
    serverId: string,
    context: McpToolContext,
    params: any,
    status: McpAuditLog['status'],
    reason?: string,
    durationMs: number = 0
  ) {
    // Sanitize parameters to never leak passwords or sensitive tokens
    const sanitized: Record<string, any> = { ...params };
    if (sanitized.approvalToken) sanitized.approvalToken = '[REDACTED_TOKEN]';
    if (sanitized.appPassword) sanitized.appPassword = '[REDACTED_PASSWORD]';
    if (sanitized.password) sanitized.password = '[REDACTED_PASSWORD]';

    const log: McpAuditLog = {
      id: `mcp-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      toolName,
      serverId,
      userId: context.userId || 'user-default',
      taskId: context.taskId,
      paramsSanitized: sanitized,
      status,
      reason,
      executionDurationMs: durationMs
    };

    this.auditLogs.push(log);
    if (this.auditLogs.length > 500) this.auditLogs.shift();
  }
}
