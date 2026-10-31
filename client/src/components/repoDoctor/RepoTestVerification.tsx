import React from 'react';
import { TestTube, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoTestVerificationProps {
  verification: RepoDoctorState['testVerification'];
}

export const RepoTestVerification: React.FC<RepoTestVerificationProps> = ({ verification }) => {
  return (
    <div className="space-y-6">
      {/* Reproduction Test Verification Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <TestTube className="w-5 h-5" />
          <span>Reproduction Test Verification (Before vs After Evidence)</span>
        </div>
        <p className="text-xs text-slate-300 font-mono">
          Test: <strong className="text-white">{verification.reproductionTest.name}</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-1">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">1. Buggy Base Revision:</span>
            <div className="text-rose-300 flex items-center gap-1.5 font-semibold">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{verification.reproductionTest.beforeResult}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">2. Patched Revision:</span>
            <div className="text-emerald-300 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{verification.reproductionTest.afterResult}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executed Checks Matrix */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
          Truthfully Executed CI / Test Suite Checks
        </h3>
        <div className="space-y-3">
          {verification.executedChecks.map((check, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">{check.command}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono pl-6">{check.output}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{check.durationMs}ms</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unverified Areas */}
      {verification.unverifiedAreas.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/90 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Explicit Verification Limitations (Untested Areas)</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {verification.unverifiedAreas.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
