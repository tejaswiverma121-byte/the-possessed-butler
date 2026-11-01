import fs from 'fs';
import path from 'path';
import { SentinelTask, TaskStatus, HumanApprovalCheckpoint } from './types.js';
import { SecurityGuard } from './securityGuard.js';

const TASKS_FILE = path.resolve(process.cwd(), 'data', 'persisted_tasks.json');

export class TaskEngine {
  private static tasks: Map<string, SentinelTask> = new Map();

  static {
    try {
      if (fs.existsSync(TASKS_FILE)) {
        const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
        const list: SentinelTask[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const t of list) {
            this.tasks.set(t.id, t);
          }
          console.log(`[TaskEngine] Restored ${list.length} persisted tasks from disk.`);
        }
      }
    } catch (e) {
      console.warn('[TaskEngine] Error reading persisted tasks:', e);
    }
  }

  private static savePersistedTasks(): void {
    try {
      const dataDir = path.dirname(TASKS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const list = Array.from(this.tasks.values());
      fs.writeFileSync(TASKS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[TaskEngine] Error saving persisted tasks:', e);
    }
  }

  /**
   * Upsert an existing or synced task
   */
  public static upsertTask(task: SentinelTask): void {
    this.tasks.set(task.id, task);
    this.savePersistedTasks();
  }

  /**
   * Create an explicit, auditable task
   */
  public static createTask(goal: string, requiredPermissions: string[] = []): SentinelTask {
    const id = `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const task: SentinelTask = {
      id,
      goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'planning',
      progressPercent: 10,
      requiredPermissions,
      steps: [
        { id: 'step-1', name: 'Analyze request and extract constraints', tool: 'intent_classifier', status: 'passed' },
        { id: 'step-2', name: 'Verify permissions & check security boundary', tool: 'security_gate', status: 'in_progress' }
      ],
      evidence: ['Initial user goal submitted via conversational interface'],
      residualRisks: ['Task subject to human verification before irreversible side effects']
    };

    this.tasks.set(id, task);
    this.savePersistedTasks();
    return task;
  }

  public static getTask(id: string): SentinelTask | undefined {
    return this.tasks.get(id);
  }

  public static getAllTasks(): SentinelTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Issue a human approval checkpoint for an irreversible action
   */
  public static requestHumanApproval(taskId: string, checkpoint: Omit<HumanApprovalCheckpoint, 'id' | 'status' | 'approvalToken' | 'expiresAt'>): HumanApprovalCheckpoint {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const approvalToken = `apr-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fullCheckpoint: HumanApprovalCheckpoint = {
      id: `chk-${Date.now()}`,
      status: 'pending',
      approvalToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 mins expiry
      ...checkpoint
    };

    task.status = 'awaiting_approval';
    task.approvalCheckpoint = fullCheckpoint;
    task.updatedAt = new Date().toISOString();
    task.steps.push({
      id: `step-${task.steps.length + 1}`,
      name: `Awaiting explicit user authorization for ${checkpoint.actionType}`,
      tool: 'human_approval_gate',
      status: 'in_progress'
    });

    this.tasks.set(taskId, task);
    this.savePersistedTasks();
    return fullCheckpoint;
  }

  /**
   * User approves or rejects the checkpoint
   */
  public static resolveApproval(taskId: string, approved: boolean): { task: SentinelTask; token?: string } {
    const task = this.tasks.get(taskId);
    if (!task || !task.approvalCheckpoint) {
      throw new Error(`Task ${taskId} has no pending approval checkpoint`);
    }

    if (new Date() > new Date(task.approvalCheckpoint.expiresAt)) {
      task.approvalCheckpoint.status = 'expired';
      task.status = 'failed';
      task.resultSummary = 'Approval token expired after inactivity.';
      this.tasks.set(taskId, task);
      this.savePersistedTasks();
      throw new Error('Approval request has expired. Please re-issue the request.');
    }

    if (approved) {
      task.approvalCheckpoint.status = 'approved';
      task.status = 'executing';
      task.progressPercent = 80;
      task.updatedAt = new Date().toISOString();
      task.evidence.push(`Human explicitly approved action: ${task.approvalCheckpoint.title}`);
      
      SecurityGuard.logSecurityEvent({
        eventType: 'approval_granted',
        severity: 'info',
        source: 'Task Engine',
        details: `User granted approval for ${task.approvalCheckpoint.title}`,
        canaryTriggered: false,
        mitigationTaken: 'Verified single-use token issued.'
      });

      this.tasks.set(taskId, task);
      this.savePersistedTasks();
      return { task, token: task.approvalCheckpoint.approvalToken };
    } else {
      task.approvalCheckpoint.status = 'rejected';
      task.status = 'cancelled';
      task.progressPercent = 100;
      task.resultSummary = 'User rejected authorization. Execution safely stopped without side-effects.';
      task.updatedAt = new Date().toISOString();

      SecurityGuard.logSecurityEvent({
        eventType: 'approval_rejected',
        severity: 'info',
        source: 'Task Engine',
        details: `User cancelled action: ${task.approvalCheckpoint.title}`,
        canaryTriggered: false,
        mitigationTaken: 'Halted execution cleanly.'
      });

      this.tasks.set(taskId, task);
      this.savePersistedTasks();
      return { task };
    }
  }

  public static completeTask(taskId: string, resultSummary: string, evidence: string[] = []): SentinelTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = 'completed';
    task.progressPercent = 100;
    task.resultSummary = resultSummary;
    task.evidence.push(...evidence);
    task.updatedAt = new Date().toISOString();

    const lastStep = task.steps[task.steps.length - 1];
    if (lastStep && lastStep.status === 'in_progress') {
      lastStep.status = 'passed';
      lastStep.resultSnippet = resultSummary;
    }

    this.tasks.set(taskId, task);
    this.savePersistedTasks();
    return task;
  }
}
