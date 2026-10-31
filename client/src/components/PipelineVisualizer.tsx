import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectState } from '../types';

interface PipelineVisualizerProps {
  project: ProjectState;
}

const STAGES = [
  { num: 1, name: 'Understanding', short: 'Problem Brief' },
  { num: 2, name: 'Root Cause', short: '5 Whys & Fishbone' },
  { num: 3, name: 'Evidence', short: 'Facts vs Hypotheses' },
  { num: 4, name: 'Solutions', short: 'Trade-off Matrix' },
  { num: 5, name: 'Traceability', short: 'Cause-to-Feature Map' },
  { num: 6, name: 'Requirements', short: 'Personas & Schemas' },
  { num: 7, name: 'Risk Register', short: 'Edge-Case Discovery' },
  { num: 8, name: 'Architecture', short: 'Stack Selection' },
  { num: 9, name: 'Planning', short: 'Work Breakdown' },
  { num: 10, name: 'Code Generation', short: 'Multi-File Sandbox' },
  { num: 11, name: 'Automated Tests', short: 'Assertion Suite' },
  { num: 12, name: 'Diagnosis', short: 'Failure Tracing' },
  { num: 13, name: 'Targeted Repair', short: 'Automated Patching' },
  { num: 14, name: 'Regression Check', short: 'Integrity Verification' },
  { num: 15, name: 'Final Review', short: 'Transparent Report' },
];

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ project }) => {
  const [showLogs, setShowLogs] = useState(false);
  const currentStage = project.currentStage || 1;
  const isCompleted = project.status === 'completed';
  const progressPercent = Math.min(100, Math.round((currentStage / 15) * 100));

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">15-Stage AI Engineering Pipeline</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 text-[10px] font-mono font-semibold">
              {progressPercent}% Complete
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous multi-stage orchestration with strict validation boundaries and continuous problem discovery
          </p>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 font-mono transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Logs ({project.executionLogs?.length || 0})</span>
          {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-1.5 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stages Grid / Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-15 gap-1.5 overflow-x-auto py-1">
        {STAGES.map((s) => {
          const isDone = currentStage > s.num || isCompleted;
          const isCurrent = currentStage === s.num && !isCompleted;

          return (
            <div
              key={s.num}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                  : isCurrent
                  ? 'bg-emerald-950/60 border-emerald-500 text-white glow-green ring-1 ring-emerald-500'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                ) : (
                  <Circle className="w-3 h-3 text-slate-600" />
                )}
              </div>
              <div className="text-[10px] font-mono font-semibold truncate">Stage {s.num}</div>
              <div className="text-[10px] font-medium leading-tight truncate text-slate-300">{s.name}</div>
            </div>
          );
        })}
      </div>

      {/* Expandable Live Execution Logs */}
      {showLogs && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto">
          <div className="text-slate-500 text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800">
            Real-Time Engine Execution Telemetry:
          </div>
          {project.executionLogs?.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
              <span className="text-slate-600 shrink-0">[{log.timestamp.slice(11, 19)}]</span>
              <span className="text-emerald-400 font-semibold shrink-0">[{log.stage}]</span>
              <span
                className={
                  log.type === 'error'
                    ? 'text-rose-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
