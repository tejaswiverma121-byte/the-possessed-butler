import React, { useState } from 'react';
import { FileCheck, Users, MapPin, Database, Send, ShieldCheck, CheckSquare } from 'lucide-react';
import { RequirementsDesign } from '../types';

interface RequirementsViewProps {
  requirements?: RequirementsDesign;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({ requirements }) => {
  const [subTab, setSubTab] = useState<'functional' | 'personas' | 'routes' | 'schema' | 'api'>('functional');

  if (!requirements) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Synthesizing functional and technical requirements...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setSubTab('functional')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            subTab === 'functional' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Functional & NFRs
        </button>
        <button
          onClick={() => setSubTab('personas')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            subTab === 'personas' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          User Personas & Journeys
        </button>
        <button
          onClick={() => setSubTab('routes')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            subTab === 'routes' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Route Map
        </button>
        <button
          onClick={() => setSubTab('schema')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            subTab === 'schema' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Database Schema
        </button>
        <button
          onClick={() => setSubTab('api')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            subTab === 'api' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          API Contracts
        </button>
      </div>

      {/* Tab 1: Functional & Non-Functional */}
      {subTab === 'functional' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Prioritized Functional Requirements</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {requirements.functionalRequirements.map((fr) => (
                <div key={fr.id} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{fr.id}</span>
                      <h4 className="text-sm font-bold text-white">{fr.title}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        fr.priority === 'MVP'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {fr.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{fr.description}</p>

                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Acceptance Criteria:</span>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                      {fr.acceptanceCriteria.map((ac, idx) => (
                        <li key={idx}>{ac}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Functional Requirements */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Non-Functional Requirements (NFRs)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requirements.nonFunctionalRequirements.map((nfr) => (
                <div key={nfr.id} className="glass-card rounded-xl p-4 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-emerald-400 font-semibold">{nfr.id}</span>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">{nfr.category}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{nfr.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personas & Journeys */}
      {subTab === 'personas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.userPersonas.map((persona, idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{persona.name}</h4>
                    <p className="text-[11px] text-slate-400">{persona.role}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-rose-400 uppercase font-semibold">Pain Points:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {persona.painPoints.map((pp, i) => (
                      <li key={i}>{pp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Key Goals:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {persona.goals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* User Journey */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              End-to-End User Journey Workflow
            </h3>
            {requirements.userJourneys.map((uj, idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-emerald-400">Persona: {uj.persona}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {uj.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                        {i + 1}. {st}
                      </span>
                      {i < uj.steps.length - 1 && <span className="text-slate-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <strong className="text-emerald-400">Happy Path:</strong> {uj.happyPath}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Route Map */}
      {subTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.pageAndRouteMap.map((r, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">{r.name}</h4>
                <code className="text-emerald-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {r.path}
                </code>
              </div>
              <p className="text-slate-300 leading-relaxed">{r.purpose}</p>
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800">
                {r.components.map((c, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    &lt;{c} /&gt;
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Database Schema */}
      {subTab === 'schema' && (
        <div className="space-y-4">
          {requirements.databaseSchema.map((t, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-mono text-sm font-bold text-emerald-400">Table: {t.table}</span>
                <span className="text-[11px] text-slate-400 font-mono">{t.relationships}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[11px]">
                      <th className="p-2">Column</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                    {t.fields.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-900/20">
                        <td className="p-2 text-slate-100 font-semibold">{f.name}</td>
                        <td className="p-2 text-blue-400">{f.type}</td>
                        <td className="p-2 text-amber-300/90">{f.constraints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: API Contracts */}
      {subTab === 'api' && (
        <div className="space-y-4">
          {requirements.apiContracts.map((api, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    api.method === 'GET' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {api.method}
                </span>
                <span className="text-white font-bold">{api.endpoint}</span>
                <span className="text-[10px] text-slate-500 ml-auto">Auth: {api.auth}</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">{api.description}</p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300/90 overflow-x-auto">
                {JSON.stringify(api.responseBody, null, 2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
