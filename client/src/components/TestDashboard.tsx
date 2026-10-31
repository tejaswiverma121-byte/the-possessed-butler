import React from 'react';
import { TestTube, CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { TestSuite } from '../types';

interface TestDashboardProps {
  testSuites?: TestSuite[];
}

export const TestDashboard: React.FC<TestDashboardProps> = ({ testSuites }) => {
  if (!testSuites || testSuites.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Automated test execution in progress...
      </div>
    );
  }

  const allTests = testSuites.flatMap((s) => s.tests);
  const passedCount = allTests.filter((t) => t.status === 'passed').length;
  const failedCount = allTests.filter((t) => t.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Badges */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Automated Test Verification Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Truthful test execution results. Tests map directly to functional requirements and risk register entries.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{passedCount} Passed</span>
            </span>
            {failedCount > 0 && (
              <span className="px-3 py-1 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 font-semibold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>{failedCount} Failed</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
              {allTests.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* Test Suites Listing */}
      <div className="space-y-4">
        {testSuites.map((suite) => (
          <div key={suite.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  Suite: {suite.type}
                </span>
                <h4 className="text-sm font-bold text-white">{suite.name}</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">{suite.tests.length} tests</span>
            </div>

            <div className="space-y-3">
              {suite.tests.map((test) => {
                const isPassed = test.status === 'passed';
                const isFailed = test.status === 'failed';

                return (
                  <div
                    key={test.id}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : isFailed
                        ? 'bg-rose-950/20 border-rose-800/50'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isFailed ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="font-semibold text-xs text-slate-100">{test.name}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        {test.durationMs !== undefined && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{test.durationMs}ms</span>
                          </span>
                        )}
                        {test.mappedRequirementId && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Req: {test.mappedRequirementId}
                          </span>
                        )}
                        {test.mappedRiskId && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Risk: {test.mappedRiskId}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                            isPassed
                              ? 'bg-emerald-900/40 text-emerald-300'
                              : isFailed
                              ? 'bg-rose-900/40 text-rose-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/80 font-mono text-[11px] text-slate-400 overflow-x-auto border border-slate-900">
                      <code>{test.code}</code>
                    </div>

                    {test.errorTrace && (
                      <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/80 font-mono text-[11px] text-rose-300 leading-relaxed overflow-x-auto">
                        <span className="font-bold block text-rose-400 uppercase text-[10px] mb-1">
                          Stack Trace & Assertion Failure:
                        </span>
                        {test.errorTrace}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
