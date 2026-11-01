const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function saveSettings(data: { provider: string; apiKey?: string; model?: string }) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}


// ================= SENTINEL AI CLIENT API =================

export async function sentinelGetChatHistory() {
  const res = await fetch(`${API_BASE}/sentinel/chat`);
  return res.json();
}

export async function sentinelSendMessage(message: string, userEmail?: string) {
  const res = await fetch(`${API_BASE}/sentinel/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userEmail }),
  });
  return res.json();
}

export async function sentinelClearChat() {
  const res = await fetch(`${API_BASE}/sentinel/chat/clear`, { method: 'POST' });
  return res.json();
}

export async function sentinelGetTasks() {
  const res = await fetch(`${API_BASE}/sentinel/tasks`);
  return res.json();
}

export async function sentinelApproveTask(taskId: string, approved: boolean) {
  const res = await fetch(`${API_BASE}/sentinel/tasks/${taskId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved }),
  });
  return res.json();
}

export async function sentinelGetEmails(category?: string, query?: string) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (query) params.append('query', query);
  const res = await fetch(`${API_BASE}/sentinel/emails?${params.toString()}`);
  return res.json();
}

export async function sentinelMarkEmailAsRead(id: string, isRead: boolean = true) {
  const res = await fetch(`${API_BASE}/sentinel/emails/${id}/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead }),
  });
  return res.json();
}

export async function sentinelMarkAllEmailsAsRead() {
  const res = await fetch(`${API_BASE}/sentinel/emails/read-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function sentinelTestImap(config: any) {
  const res = await fetch(`${API_BASE}/sentinel/imap/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function sentinelConnectImap(config: any) {
  const res = await fetch(`${API_BASE}/sentinel/imap/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function sentinelSyncImap() {
  const res = await fetch(`${API_BASE}/sentinel/imap/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function sentinelDisconnectImap() {
  const res = await fetch(`${API_BASE}/sentinel/imap/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function sentinelGetImapStatus() {
  const res = await fetch(`${API_BASE}/sentinel/imap/status`);
  return res.json();
}



export async function sentinelSendEmail(payload: {
  to: string;
  subject: string;
  body: string;
  approvalToken: string;
  verifiedActionId: string;
}) {
  const res = await fetch(`${API_BASE}/sentinel/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sentinelGetSecurityAudit() {
  const res = await fetch(`${API_BASE}/sentinel/security/audit`);
  return res.json();
}

export async function sentinelGetAccount() {
  const res = await fetch(`${API_BASE}/sentinel/account`);
  return res.json();
}

export async function sentinelUpdateAccount(account: any) {
  const res = await fetch(`${API_BASE}/sentinel/account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  return res.json();
}

