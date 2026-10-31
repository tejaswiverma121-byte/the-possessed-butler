import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ShieldCheck, Scale, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { SolutionOption } from '../types';

interface SolutionComparisonProps {
  solutions?: SolutionOption[];
  recommendedSolutionId?: string;
  recommendationRationale?: string;
}

export const SolutionComparison: React.FC<SolutionComparisonProps> = ({
  solutions,
  recommendedSolutionId,
  recommendationRationale,
}) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(
    recommendedSolutionId || (solutions && solutions.length > 0 ? solutions[0].id : '')
  );

  if (!solutions || solutions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Generating multi-solution comparison matrix...
      </div>
    );
  }

  const activeSolution = solutions.find((s) => s.id === selectedSolutionId) || solutions[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Rationale for Recommendation */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 bg-emerald-950/20 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Award className="w-5 h-5" />
          <span>Recommended Engineering Decision & Architecture Justification</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {recommendationRationale}
        </p>
      </div>

      {/* Solutions Cards Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {solutions.map((sol) => {
          const isRecommended = sol.id === recommendedSolutionId;
          const isSelected = sol.id === activeSolution.id;

          return (
            <div
              key={sol.id}
              onClick={() => setSelectedSolutionId(sol.id)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Approach {sol.id}
                  </span>
                  {isRecommended && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>Recommended</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{sol.title}</h4>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{sol.tagline}</p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {sol.overview}
                </p>

                {/* Score breakdown strip */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[9px] text-slate-500">Value</div>
                    <div className="text-xs font-bold text-emerald-400">{sol.scoreBreakdown.userValue}/10</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[9px] text-slate-500">Feasibility</div>
                    <div className="text-xs font-bold text-blue-400">{sol.scoreBreakdown.feasibility}/10</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[9px] text-slate-500">Complexity</div>
                    <div className="text-xs font-bold text-amber-400 uppercase">{sol.complexity}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{isSelected ? 'Active Details' : 'Click to Inspect'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Approach Detailed Breakdown (All 12 Dimensions) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Detailed Architecture Specification
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{activeSolution.title}</h3>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
              Effort: {activeSolution.estimatedEffort}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
              Cost: {activeSolution.relativeCost}
            </span>
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Underlying Mechanism & Workflow</h4>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {activeSolution.howItWorks}
          </p>
        </div>

        {/* Stakeholder Benefits Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Stakeholder Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(activeSolution.userBenefits).map(([group, benefit], idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">{group}:</span>
                <p className="text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages vs Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Architectural Advantages</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {activeSolution.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Trade-offs & Limitations</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {activeSolution.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security, Accessibility & Success Measurement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-400 block">Security & Privacy:</span>
            <p className="text-slate-300">{activeSolution.securityAndPrivacy}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-400 block">Accessibility & Scalability:</span>
            <p className="text-slate-300">{activeSolution.accessibilityAndScalability}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400 block">Measurable Success Target:</span>
            <p className="text-slate-300">{activeSolution.successMeasurement}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
