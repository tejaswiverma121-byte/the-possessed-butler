import React, { useState } from 'react';
import { GitBranch, ShieldAlert, CheckCircle2, ChevronRight, Layers, HelpCircle, Activity } from 'lucide-react';
import { RootCause } from '../types';

interface RootCauseExplorerProps {
  rootCauses?: RootCause[];
}

export const RootCauseExplorer: React.FC<RootCauseExplorerProps> = ({ rootCauses }) => {
  const [selectedCauseId, setSelectedCauseId] = useState<string>(
    rootCauses && rootCauses.length > 0 ? rootCauses[0].id : ''
  );

  if (!rootCauses || rootCauses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Root cause investigation in progress...
      </div>
    );
  }

  const selectedCause = rootCauses.find((rc) => rc.id === selectedCauseId) || rootCauses[0];

  const getEpistemicBadge = (status: RootCause['epistemicStatus']) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">Verified Empirical Fact</span>;
      case 'user_reported':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">Direct User Report</span>;
      case 'inferred':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800">Inferred Systemic Model</span>;
      case 'unverified_hypothesis':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">Unverified Hypothesis</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Fishbone / Category Strip */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Ishikawa Fishbone & 5-Whys Root-Cause Decomposition</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing systemic root causes from superficial symptoms across information, process, policy, and people.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
            {rootCauses.length} Causes Diagnosed
          </span>
        </div>

        {/* Cause Selectors Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rootCauses.map((rc, idx) => {
            const isSelected = rc.id === selectedCause.id;
            return (
              <button
                key={rc.id}
                onClick={() => setSelectedCauseId(rc.id)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Category: {rc.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {rc.confidenceLevel}% Conf.
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-2">
                    {idx + 1}. {rc.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  {getEpistemicBadge(rc.epistemicStatus)}
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Cause Deep-Dive (All 10 Prompt-Required Properties) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        {/* Cause Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase">
                Cause {selectedCause.id}
              </span>
              <span className="text-xs text-slate-400 uppercase font-mono">
                Category: <strong>{selectedCause.category}</strong>
              </span>
              {getEpistemicBadge(selectedCause.epistemicStatus)}
            </div>
            <h3 className="text-lg font-bold text-white">{selectedCause.title}</h3>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Confidence Rating</div>
              <div className="text-base font-bold text-white font-mono">{selectedCause.confidenceLevel}%</div>
            </div>
          </div>
        </div>

        {/* 5 Whys Step-by-Step Chain */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Five Whys Systematic Investigation Chain</span>
          </div>
          <div className="space-y-2">
            {selectedCause.fiveWhys.map((why, index) => (
              <div key={index} className="flex items-start gap-2.5 text-xs">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-emerald-400 shrink-0">
                  {index + 1}
                </span>
                <p className="text-slate-300 leading-relaxed pt-0.5">
                  {index === selectedCause.fiveWhys.length - 1 ? (
                    <strong className="text-emerald-300 font-semibold">{why}</strong>
                  ) : (
                    why
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Detail Matrix: Mechanism, Evidence, Consequences, Validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Underlying Mechanism
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCause.mechanism}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Supporting Evidence
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCause.evidence}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
              Consequences if Unresolved
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCause.unresolvedConsequence}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Validation Method & Needed Data
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCause.validationMethod}</p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <em>To raise confidence:</em> {selectedCause.neededForConfidence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
