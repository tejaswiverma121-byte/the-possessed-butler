import React from 'react';
import { Network, CheckCircle2, FileCode, TestTube, ArrowRight } from 'lucide-react';
import { TraceabilityItem } from '../types';

interface TraceabilityMatrixProps {
  traceability?: TraceabilityItem[];
}

export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({ traceability }) => {
  if (!traceability || traceability.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Traceability graph being constructed...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Network className="w-5 h-5 text-emerald-400" />
          <span>Root-Cause-to-Feature Traceability Matrix</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Guarantees that no diagnosed root cause is dropped or ignored. Every single root cause is directly tracked into a proposed mitigation, a concrete website feature, tangible source files, an automated verification test, and a measurable outcome metric.
        </p>
      </div>

      <div className="space-y-4">
        {traceability.map((item, idx) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Top Bar: Cause ID and Verification Status */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-mono font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {item.rootCauseTitle}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border ${
                  item.status === 'verified'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}
              >
                {item.status === 'verified' ? '✓ Verified in Code & Tests' : 'Implemented'}
              </span>
            </div>

            {/* Linear Traceability Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch text-xs">
              {/* Box 1: Root Cause */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block mb-1">
                    1. Root Cause
                  </span>
                  <p className="text-slate-200 font-medium">{item.rootCauseTitle}</p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-2">ID: {item.rootCauseId}</div>
              </div>

              {/* Box 2: Mitigation */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400/80 font-semibold block mb-1">
                    2. Mitigation Strategy
                  </span>
                  <p className="text-slate-300">{item.mitigation}</p>
                </div>
              </div>

              {/* Box 3: Website Feature */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-400/80 font-semibold block mb-1">
                    3. Implemented Feature
                  </span>
                  <p className="text-white font-semibold">{item.websiteFeature}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.implementationFiles.map((f, i) => (
                    <span key={i} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Box 4: Verification Test */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400/80 font-semibold block mb-1">
                    4. Verification Test
                  </span>
                  <p className="font-mono text-[11px] text-amber-300">{item.verificationTest}</p>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Automated Assertion</span>
                </div>
              </div>

              {/* Box 5: Outcome Metric */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block mb-1">
                    5. Real Outcome Target
                  </span>
                  <p className="text-emerald-300 font-semibold text-xs">{item.outcomeMetric}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
