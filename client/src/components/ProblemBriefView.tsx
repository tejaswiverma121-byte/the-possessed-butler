import React from 'react';
import { Target, Users, AlertCircle, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { ProblemBrief } from '../types';

interface ProblemBriefViewProps {
  brief?: ProblemBrief;
  problemStatement: string;
}

export const ProblemBriefView: React.FC<ProblemBriefViewProps> = ({ brief, problemStatement }) => {
  if (!brief) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Problem brief is being synthesized...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Ingested Statement */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          Raw Problem Ingested
        </div>
        <p className="text-base text-slate-100 font-medium leading-relaxed italic">
          "{problemStatement}"
        </p>
      </div>

      {/* Structured Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What is Happening & Who is Affected */}
        <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Users className="w-4 h-4" />
            <span>Problem & Affected Stakeholders</span>
          </div>
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">What is Happening:</span>
              <p className="text-slate-200">{brief.whatIsHappening}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Who is Affected:</span>
              <p className="text-slate-200">{brief.whoIsAffected}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Frequency & Severity:</span>
              <p className="text-slate-200">{brief.frequencyAndImpact}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Current Workarounds & Why Existing Fails */}
        <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Workarounds & Why Existing Approaches Fail</span>
          </div>
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Current Workarounds:</span>
              <p className="text-slate-200">{brief.currentWorkarounds}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Root Failure of Existing Tools:</span>
              <p className="text-slate-200">{brief.whyExistingFails}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Measurable Success Criteria */}
      <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Measurable Success Criteria (Engineering Benchmarks)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Objective Acceptance Targets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Success Metric</th>
                <th className="pb-2.5 font-semibold">Target Threshold</th>
                <th className="pb-2.5 font-semibold">Verification Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {brief.successCriteria?.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-900/30">
                  <td className="py-2.5 font-mono text-emerald-400 text-[11px] font-semibold">{sc.id}</td>
                  <td className="py-2.5 font-medium text-slate-200">{sc.metric}</td>
                  <td className="py-2.5 font-mono text-amber-300 font-semibold">{sc.target}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{sc.evaluationMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Epistemic Categorization Strip: Facts vs Hypotheses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Facts ({brief.knownFacts?.length || 0})</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            {brief.knownFacts?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assumptions ({brief.assumptions?.length || 0})</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            {brief.assumptions?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Hypotheses ({brief.hypotheses?.length || 0})</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            {brief.hypotheses?.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
