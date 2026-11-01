import express, { Request, Response } from 'express';
import cors from 'cors';
import { AIProviderService } from './aiProvider.js';
import { ChatAgent } from './sentinel/chatAgent.js';
import { EmailService } from './sentinel/emailService.js';
import { TaskEngine } from './sentinel/taskEngine.js';
import { SecurityGuard } from './sentinel/securityGuard.js';
import { PromptGuardClient } from './sentinel/promptGuardClient.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health & Settings
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    name: 'Sentinel AI — Autonomous Local-First Assistant (MCP Protocol)',
    aiSettings: AIProviderService.getSettings(),
  });
});

app.get('/api/settings', (req: Request, res: Response) => {
  res.json(AIProviderService.getSettings());
});

app.post('/api/settings', (req: Request, res: Response) => {
  const { provider, apiKey, model } = req.body;
  AIProviderService.updateSettings({ provider, apiKey, model });
  res.json({ success: true, settings: AIProviderService.getSettings() });
});

// ================= SENTINEL AI API ENDPOINTS =================

// Chat
app.get('/api/sentinel/chat', (req: Request, res: Response) => {
  res.json({ history: ChatAgent.getHistory() });
});

app.post('/api/sentinel/chat', async (req: Request, res: Response) => {
  try {
    const { message, userEmail } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }
    if (userEmail && typeof userEmail === 'string' && EmailService.getUserAccount().email !== userEmail) {
      EmailService.updateUserAccount({ email: userEmail });
    }
    const result = await ChatAgent.processUserMessage(message);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error in Sentinel Chat' });
  }
});

app.post('/api/sentinel/chat/clear', (req: Request, res: Response) => {
  ChatAgent.clearHistory();
  res.json({ success: true, history: ChatAgent.getHistory() });
});

// Tasks & Approvals
app.get('/api/sentinel/tasks', (req: Request, res: Response) => {
  res.json({ tasks: TaskEngine.getAllTasks() });
});

app.post('/api/sentinel/tasks/sync', (req: Request, res: Response) => {
  const { tasks } = req.body;
  if (Array.isArray(tasks)) {
    for (const t of tasks) {
      if (t && t.id) {
        TaskEngine.upsertTask(t);
      }
    }
  }
  res.json({ success: true, tasks: TaskEngine.getAllTasks() });
});

app.get('/api/sentinel/tasks/:id', (req: Request, res: Response) => {
  const task = TaskEngine.getTask(req.params.id as string);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

app.post('/api/sentinel/tasks/:id/approve', async (req: Request, res: Response) => {
  try {
    const { approved } = req.body;
    const taskId = req.params.id as string;
    const result = TaskEngine.resolveApproval(taskId, Boolean(approved));

    if (approved && result.token) {
      const checkpoint = result.task.approvalCheckpoint;
      if (checkpoint?.actionType === 'send_email') {
        const sendResult = await EmailService.sendEmailWithApproval({
          to: checkpoint.details.to,
          subject: checkpoint.details.subject,
          body: checkpoint.details.body,
          approvalToken: result.token,
          verifiedActionId: taskId
        });

        if (sendResult.isLiveSent) {
          TaskEngine.completeTask(taskId, sendResult.statusMessage);
          ChatAgent.updateCheckpointStatus(
            taskId, 
            'approved', 
            `✓ **Real Email Delivered**: Successfully transmitted over live Google SMTP to \`${checkpoint.details.to}\` (Subject: *"${checkpoint.details.subject}"*). It has landed in their inbox and is visible in your Gmail **Sent** folder!`
          );
        } else {
          ChatAgent.updateCheckpointStatus(
            taskId, 
            'rejected', 
            `⚠️ **Email Delivery Failed**: ${sendResult.statusMessage}`
          );
        }
      }
    } else if (!approved) {
      ChatAgent.updateCheckpointStatus(taskId, 'rejected', 'Action cancelled by user. No emails or transactions were sent.');
    }

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


// Emails
app.get('/api/sentinel/emails', (req: Request, res: Response) => {
  const { category, query } = req.query;
  const emails = EmailService.getEmails({
    category: category as string,
    query: query as string
  });
  res.json({ emails, userAccount: EmailService.getUserAccount() });
});

app.get('/api/sentinel/emails/:id', (req: Request, res: Response) => {
  const email = EmailService.getEmailById(req.params.id as string);
  if (!email) return res.status(404).json({ error: 'Email not found' });
  res.json({ email });
});

app.post('/api/sentinel/emails/:id/read', (req: Request, res: Response) => {
  const { isRead = true } = req.body;
  const updated = EmailService.markEmailAsRead(req.params.id as string, isRead);
  if (!updated) return res.status(404).json({ error: 'Email not found' });
  res.json({ success: true, email: updated });
});

app.post('/api/sentinel/emails/read-all', (_req: Request, res: Response) => {
  const emails = EmailService.markAllEmailsAsRead();
  res.json({ success: true, message: 'All emails marked as read', emails });
});

// Live IMAP Synchronization Routes
app.post('/api/sentinel/imap/test', async (req: Request, res: Response) => {
  try {
    const result = await EmailService.testImapConnection(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/sentinel/imap/connect', async (req: Request, res: Response) => {
  try {
    const result = await EmailService.connectAndSyncImap(req.body);
    res.json({
      success: true,
      message: result.message,
      fetchedCount: result.fetchedCount,
      userAccount: EmailService.getUserAccount(),
      emails: EmailService.getEmails()
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/sentinel/imap/sync', async (_req: Request, res: Response) => {
  try {
    const result = await EmailService.syncLiveEmails();
    res.json({
      success: true,
      message: result.message,
      fetchedCount: result.fetchedCount,
      emails: EmailService.getEmails(),
      userAccount: EmailService.getUserAccount()
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/sentinel/imap/disconnect', (_req: Request, res: Response) => {
  const result = EmailService.disconnectImap();
  res.json({
    ...result,
    userAccount: EmailService.getUserAccount(),
    emails: EmailService.getEmails()
  });
});

app.get('/api/sentinel/imap/status', (_req: Request, res: Response) => {
  res.json({
    imapStatus: EmailService.getImapStatus(),
    userAccount: EmailService.getUserAccount()
  });
});



app.post('/api/sentinel/emails/send', async (req: Request, res: Response) => {
  try {
    const { to, subject, body, approvalToken, verifiedActionId } = req.body;
    const result = await EmailService.sendEmailWithApproval({
      to,
      subject,
      body,
      approvalToken,
      verifiedActionId
    });
    res.json(result);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

// Security & Audit
app.get('/api/sentinel/security/audit', (req: Request, res: Response) => {
  res.json({
    primaryCanary: SecurityGuard.getPrimaryCanary(),
    logs: SecurityGuard.getAuditLogs()
  });
});

// Prompt Guard 2 ML Prompt Injection Defense API Endpoints
app.post(['/api/security/scan-email', '/api/sentinel/security/scan-email'], async (req: Request, res: Response) => {
  try {
    const { from, to, subject, body, html, attachments, id } = req.body;
    const result = await PromptGuardClient.scanEmail({
      id,
      from: from || '',
      to: to || '',
      subject: subject || '',
      body: body || '',
      html: html || '',
      attachments: attachments || []
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing Prompt Guard scan' });
  }
});

app.get(['/api/security/scan-history', '/api/sentinel/security/scan-history'], async (_req: Request, res: Response) => {
  try {
    const history = await PromptGuardClient.getScanHistory();
    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching scan history' });
  }
});

app.get(['/api/security/statistics', '/api/sentinel/security/statistics'], async (_req: Request, res: Response) => {
  try {
    const statistics = await PromptGuardClient.getStatistics();
    res.json(statistics);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching security statistics' });
  }
});

app.get(['/api/security/health', '/api/sentinel/security/health'], async (_req: Request, res: Response) => {
  try {
    const statistics = await PromptGuardClient.getStatistics();
    res.json({
      status: statistics.model_ready ? 'online' : 'ready_offline',
      model_ready: statistics.model_ready,
      model_name: statistics.model_name,
      device: statistics.device
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Account Settings
app.get('/api/sentinel/account', (req: Request, res: Response) => {
  res.json({ account: EmailService.getUserAccount() });
});

app.post('/api/sentinel/account', (req: Request, res: Response) => {
  const updated = EmailService.updateUserAccount(req.body);
  res.json({ success: true, account: updated });
});

// ================= MCP & LOCAL LLM DIAGNOSTICS =================
import { McpClientManager } from './sentinel/mcp/mcpClientManager.js';
import { LocalLlmService } from './sentinel/localLlm.js';

app.get('/api/sentinel/mcp/status', (_req: Request, res: Response) => {
  const mcp = McpClientManager.getInstance();
  res.json({
    status: 'active',
    protocol: 'Model Context Protocol (MCP) 1.32.2',
    servers: mcp.getServers(),
    tools: mcp.getToolsList(),
    auditLogs: mcp.getAuditLogs()
  });
});

app.post('/api/sentinel/mcp/execute', async (req: Request, res: Response) => {
  try {
    const { toolName, params, taskId, approvalToken } = req.body;
    if (!toolName) {
      return res.status(400).json({ error: 'toolName is required' });
    }
    const mcp = McpClientManager.getInstance();
    const result = await mcp.executeTool(toolName, params || {}, {
      userId: EmailService.getUserAccount().id,
      taskId,
      approvalToken
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sentinel/ollama/status', async (_req: Request, res: Response) => {
  const status = await LocalLlmService.checkStatus();
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`[Sentinel AI Server] Running on http://localhost:${PORT}`);
  console.log(`[Sentinel AI] MCP Layer initialized with ${McpClientManager.getInstance().getServers().length} active MCP servers`);
});
