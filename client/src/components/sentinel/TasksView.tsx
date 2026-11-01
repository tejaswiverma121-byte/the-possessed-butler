import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lock, 
  RefreshCw 
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const TasksView: React.FC = () => {
  const { tasks, handleResolveApproval, loadAllData } = useSentinel();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await loadAllData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveCheckpoint = async (taskId: string, approved: boolean) => {
    try {
      await handleResolveApproval(taskId, approved);
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 space-y-6 bg-obsidian-950 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-witch-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-pumpkin-500/10 border border-pumpkin-500/20 text-pumpkin-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-display font-bold text-white tracking-wide">Tasks & Human Approval Checkpoints</h2>
          </div>
          <p className="text-xs text-pumpkin-200/70 mt-1 font-sans">
            State Machine controlled multi-step execution with explicit permission gates
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-3.5 py-2 rounded-xl bg-obsidian-900 border border-witch-800 text-xs text-pumpkin-400 hover:text-white hover:border-pumpkin-500 flex items-center gap-2 font-mono font-medium transition-all shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Tasks</span>
        </button>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isPendingApproval = task.status === 'awaiting_approval';
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-5 md:p-6 rounded-2xl border transition-all space-y-4 shadow-xl ${
                  isPendingApproval
                    ? 'bg-obsidian-900/95 border-2 border-pumpkin-500/80 shadow-glow-pumpkin'
                    : isCompleted
                    ? 'bg-obsidian-900/80 border-witch-800/80'
                    : 'bg-obsidian-900/60 border-witch-800/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider ${
                        isPendingApproval 
                          ? 'bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-600 animate-pulse'
                          : isCompleted 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-witch-950 text-witch-300 border border-witch-800'
                      }`}>
                        {task.status === 'awaiting_approval' ? '🎃 PENDING APPROVAL' : task.status.toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-white font-display">{task.goal}</h3>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Created: {new Date(task.createdAt).toLocaleString()} • Progress: <span className="text-pumpkin-400 font-bold">{task.progressPercent}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full sm:w-44 h-2.5 rounded-full bg-obsidian-950 border border-witch-900 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500' 
                          : isPendingApproval 
                          ? 'bg-gradient-to-r from-pumpkin-500 to-pumpkin-400' 
                          : 'bg-gradient-to-r from-witch-500 to-pumpkin-500'
                      }`}
                      style={{ width: `${task.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Steps List */}
                <div className="p-4 rounded-xl bg-obsidian-950/90 border border-witch-900/80 space-y-2.5 text-xs font-mono">
                  <div className="text-[11px] text-witch-400 uppercase font-bold tracking-wider">Execution Pipeline Steps:</div>
                  {task.steps.map((st, i) => (
                    <div key={st.id} className="flex items-center justify-between text-xs py-1 border-b border-witch-950 last:border-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-pumpkin-400 font-bold">{i + 1}.</span>
                        <span className="text-slate-200">{st.name}</span>
                      </div>
                      <span className={`text-[11px] font-bold ${
                        st.status === 'passed' ? 'text-emerald-400' : st.status === 'in_progress' ? 'text-pumpkin-400 animate-pulse' : 'text-slate-500'
                      }`}>
                        [{st.status.toUpperCase()}]
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pending Checkpoint Action Gate */}
                {isPendingApproval && task.approvalCheckpoint && (
                  <div className="p-5 rounded-xl bg-pumpkin-950/40 border-2 border-pumpkin-600/80 space-y-3 font-mono text-xs shadow-glow-pumpkin">
                    <div className="flex items-center gap-2 font-bold text-pumpkin-300 text-sm">
                      <Lock className="w-4 h-4 text-pumpkin-400" />
                      <span>{task.approvalCheckpoint.title}</span>
                    </div>
                    <p className="text-xs text-pumpkin-200/80 font-sans leading-relaxed">
                      {task.approvalCheckpoint.description}
                    </p>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        onClick={() => handleResolveCheckpoint(task.id, true)}
                        className="py-2 px-5 rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-pumpkin transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authorize Action Now</span>
                      </button>
                      <button
                        onClick={() => handleResolveCheckpoint(task.id, false)}
                        className="py-2 px-4 rounded-xl bg-obsidian-800 hover:bg-witch-900 border border-witch-800 text-slate-300 text-xs transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}

                {/* Result Summary */}
                {task.resultSummary && (
                  <div className="p-3.5 rounded-xl bg-obsidian-950 border border-witch-900 text-xs font-mono text-slate-300">
                    <span className="text-pumpkin-400 font-bold">Execution Result:</span> {task.resultSummary}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center text-slate-500 font-mono rounded-2xl border border-witch-900/60 bg-obsidian-900/40">
          🎃 No tasks recorded yet. Give instructions in the Conversation to invoke autonomous workflows.
        </div>
      )}
    </div>
  );
};
