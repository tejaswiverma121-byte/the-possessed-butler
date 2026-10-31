import { ProjectInput, ProjectState, RepoDoctorInput, RepoDoctorState } from './types';

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

// Mode A: Projects
export async function fetchProjects(): Promise<{ projects: ProjectState[] }> {
  const res = await fetch(`${API_BASE}/projects`);
  return res.json();
}

export async function fetchProject(id: string): Promise<{ project: ProjectState }> {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  return res.json();
}

export async function submitProject(input: ProjectInput): Promise<{ success: boolean; project: ProjectState }> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to submit problem statement');
  }
  return res.json();
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function updateAssumption(projectId: string, itemId: string, status: string, userCorrection?: string): Promise<{ success: boolean; project: ProjectState }> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/update-assumption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, status, userCorrection }),
  });
  return res.json();
}

// Mode B: Repository Doctor
export async function fetchRepos(): Promise<{ investigations: RepoDoctorState[] }> {
  const res = await fetch(`${API_BASE}/repos`);
  return res.json();
}

export async function fetchRepo(id: string): Promise<{ investigation: RepoDoctorState }> {
  const res = await fetch(`${API_BASE}/repos/${id}`);
  return res.json();
}

export async function analyzeRepository(input: RepoDoctorInput): Promise<{ success: boolean; investigation: RepoDoctorState }> {
  const res = await fetch(`${API_BASE}/repos/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to analyze repository');
  }
  return res.json();
}

export async function approveRepoPr(id: string): Promise<{ success: boolean; message: string; repo: RepoDoctorState }> {
  const res = await fetch(`${API_BASE}/repos/${id}/approve-pr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
