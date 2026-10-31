import React from 'react';
import { Wrench, CheckCircle2, GitCommit, FileCode, RotateCcw } from 'lucide-react';
import { RepairRecord } from '../types';

interface RepairWorkbenchProps {
  repairHistory?: RepairRecord[];
}

export const RepairWorkbench: React.FC<RepairWorkbenchProps> = ({ repairHistory }) => {
  if (!repairHistory || repairHistory.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        No defect repairs required; all initial test checks passed or repair loop is waiting.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Wrench className="w-5 h-5 text-emerald-400" />
          <span>Autonomous Defect Diagnosis & Targeted Self-Repair Workbench</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          When a test assertion fails, the platform does not regenerate the entire project. Instead, it diagnoses the underlying flaw, crafts a minimal targeted unified patch, applies the diff, and reruns regression tests.
        </p>
      </div>

      {/* Repair Records */}
      <div className="space-y-4">
        {repairHistory.map((rec) => (
          <div key={rec.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-bold text-white uppercase">{rec.id}</span>
                <span className="text-xs text-slate-400 font-mono">[{rec.timestamp.slice(11, 19)} UTC]</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                ✓ Repair Verified ({rec.rerunStatus})
              </span>
            </div>

            {/* Failure & Diagnosis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Detected Failure</span>
                <p className="text-rose-200 leading-relaxed">{rec.detectedFailure}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Diagnosed Root Cause</span>
                <p className="text-emerald-200 leading-relaxed">{rec.rootCauseIdentified}</p>
              </div>
            </div>

            {/* Patched File & Diff Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Modified File: <strong>{rec.filePath}</strong></span>
                </span>
                <span className="text-emerald-400 font-semibold">Unified Diff</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
                {rec.patchDiff.split('\n').map((line, i) => {
                  const isAdd = line.startsWith('+') && !line.startsWith('+++');
                  const isDel = line.startsWith('-') && !line.startsWith('---');
                  const isHeader = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');

                  return (
                    <div
                      key={i}
                      className={
                        isAdd
                          ? 'bg-emerald-950/60 text-emerald-300 px-1 py-0.5 rounded'
                          : isDel
                          ? 'bg-rose-950/60 text-rose-300 px-1 py-0.5 rounded'
                          : isHeader
                          ? 'text-cyan-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {line || ' '}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regression Verification Check */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">
                  <strong>Regression Check:</strong> {rec.regressionCheck}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
