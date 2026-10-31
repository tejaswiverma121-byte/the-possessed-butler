import React, { useState } from 'react';
import { ShieldAlert, Filter, CheckCircle2, AlertTriangle, ShieldCheck, Bug } from 'lucide-react';
import { RiskItem, RiskSeverity, RiskStatus } from '../types';

interface RiskRegisterViewProps {
  risks?: RiskItem[];
}

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({ risks }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!risks || risks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Conducting edge-case and boundary vulnerability analysis...
      </div>
    );
  }

  const filteredRisks = risks.filter((r) => {
    const matchesSev = severityFilter === 'all' || r.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSev && matchesStatus;
  });

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-950 text-orange-300 border border-orange-800">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-slate-300 border border-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (status: RiskStatus) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">✓ Verified</span>;
      case 'fixed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-teal-950 text-teal-300 border border-teal-800">Fixed</span>;
      case 'mitigated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-950 text-blue-300 border border-blue-800">Mitigated</span>;
      case 'blocked':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800">Blocked</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900 text-slate-400 border border-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Active Edge-Case & Technical Risk Register</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Systematically tracks failure modes including boundary overflows, concurrency clashes, XSS injections, and accessibility constraints. Per our <em>No Claim of Perfection</em> rule, all risks are audited against automated tests.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-400">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium uppercase transition-colors ${
                severityFilter === s ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Status:</span>
          {['all', 'verified', 'mitigated', 'fixed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium uppercase transition-colors ${
                statusFilter === st ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Risks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                  {risk.id}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  Priority: <strong className="text-amber-400">{risk.priority}</strong>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Category: <strong>{risk.category.replace('_', ' ')}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getSeverityBadge(risk.severity)}
                {getStatusBadge(risk.status)}
              </div>
            </div>

            {/* Description & Cause */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-100 text-sm leading-snug">{risk.description}</h4>
              <p className="text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-500">Evidence / Root Trigger:</span> {risk.evidenceOrReason}
              </p>
            </div>

            {/* 3-Column Mitigation & Test verification strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Feature</span>
                <p className="text-slate-200 font-semibold">{risk.affectedFeature}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Active Mitigation</span>
                <p className="text-slate-300">{risk.mitigation}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-400 block">Associated Automated Test</span>
                <code className="text-blue-300 font-mono text-[11px] block truncate">{risk.associatedTestId}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
