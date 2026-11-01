import { z } from 'zod';

export interface McpServerConfig {
  id: string;
  name: string;
  description: string;
  transport: 'in_process' | 'stdio' | 'sse';
  status: 'connected' | 'disconnected' | 'error';
  permittedTools: string[];
  permissions: string[];
  lastChecked?: string;
  error?: string;
}

export interface McpToolContext {
  userId: string;
  taskId?: string;
  callerActionId?: string;
  approvalToken?: string;
  signal?: AbortSignal;
}

export interface McpToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  untrusted: boolean;
  securityNotice?: string;
  toolName: string;
  timestamp: string;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  serverId: string;
  schema: z.ZodObject<any>;
  requiresApproval: boolean;
  approvalDescription?: (params: any) => string;
  execute: (params: any, context: McpToolContext) => Promise<any>;
}

export interface McpAuditLog {
  id: string;
  timestamp: string;
  toolName: string;
  serverId: string;
  userId: string;
  taskId?: string;
  paramsSanitized: Record<string, any>;
  status: 'authorized' | 'rejected' | 'failed' | 'executed';
  reason?: string;
  executionDurationMs: number;
}
