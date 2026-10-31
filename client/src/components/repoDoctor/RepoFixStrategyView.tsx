import React from 'react';
import { Target, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoFixStrategyViewProps {
  strategy: RepoDoctorState['fixStrategy'];
}

export const RepoFixStrategyView: React.FC<RepoFixStrategyViewProps> = ({ strategy }) => {
  return (
    <div className="space-y-6">
      {/* Proposed Fix */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
          <Target className="w-5 h-5" />
          <span>Selected Fix Strategy & Architectural Rationale</span>
        </div>
        <p className="text-sm text-slate-100 font-semibold leading-relaxed">
          {strategy.proposedFix}
        </p>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 block mb-1">Why this addresses the root cause:</strong>
          {strategy.whyAddressesRootCause}
        </div>
      </div>

      {/* Alternatives Considered */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Alternative Approaches Considered & Evaluated</span>
        </h4>
        <div className="space-y-2">
          {strategy.alternativesConsidered.map((alt, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {alt}
            </div>
          ))}
        </div>
      </div>

      {/* Backward Compatibility & Interfaces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Affected Interfaces</span>
          <p className="text-slate-200">{strategy.affectedInterfaces}</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <span className="font-bold text-emerald-400 uppercase text-[10px] block">Backward Compatibility</span>
          <p className="text-slate-200">{strategy.backwardCompatibility}</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <span className="font-bold text-amber-400 uppercase text-[10px] block">Regression Risk Assessment</span>
          <p className="text-slate-200">{strategy.regressionRisks}</p>
        </div>
      </div>
    </div>
  );
};
