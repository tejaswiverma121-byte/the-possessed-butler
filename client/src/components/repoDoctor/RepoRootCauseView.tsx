import React from 'react';
import { GitCommit, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoRootCauseViewProps {
  diagnosis: RepoDoctorState['rootCauseDiagnosis'];
}

export const RepoRootCauseView: React.FC<RepoRootCauseViewProps> = ({ diagnosis }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Root-Cause Diagnosis & Earliest Failure Point</span>
        </div>
        <p className="text-sm text-slate-100 font-semibold leading-relaxed">
          {diagnosis.summary}
        </p>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-rose-300">
          <span className="text-slate-500 uppercase text-[10px] block font-sans font-bold">Earliest Meaningful Failure Point:</span>
          {diagnosis.earliestFailurePoint}
        </div>
      </div>

      {/* Execution Flow Trace */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
          Data & Control Flow Failure Trace
        </h3>
        <div className="space-y-2.5">
          {diagnosis.executionFlow.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-slate-200 leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mechanism, Evidence, and Ruled-Out Hypotheses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Underlying Mechanism</span>
          <p className="text-slate-200 leading-relaxed">{diagnosis.mechanism}</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Supporting Evidence</span>
          <p className="text-slate-200 leading-relaxed">{diagnosis.evidence}</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <span className="font-bold text-emerald-400 uppercase text-[10px] block">Simpler Explanations Ruled Out</span>
          <p className="text-slate-200 leading-relaxed">{diagnosis.simplerExplanationsRuledOut}</p>
        </div>
      </div>
    </div>
  );
};
