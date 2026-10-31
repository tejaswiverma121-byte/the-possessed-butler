import React from 'react';
import { Layers, Folder, Code, Terminal, CheckCircle2 } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoArchitectureMapProps {
  arch: RepoDoctorState['architecturalMap'];
}

export const RepoArchitectureMap: React.FC<RepoArchitectureMapProps> = ({ arch }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>Deep Codebase Understanding & Architectural Map</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Repository: <strong className="text-white font-mono">{arch.repoName}</strong> (Branch: {arch.defaultBranch})
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {arch.totalFiles} Files Scanned
            </span>
          </div>
        </div>

        {/* Languages Strip */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold self-center">
            Detected Languages:
          </span>
          {arch.languages.map((lang, idx) => (
            <span key={idx} className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-800">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Main Modules Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Folder className="w-4 h-4 text-blue-400" />
          <span>Core Subsystems & Module Responsibilities</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arch.mainModules.map((mod, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h4 className="font-bold text-white text-sm">{mod.name}</h4>
                <code className="text-blue-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {mod.path}
                </code>
              </div>
              <p className="text-slate-300 leading-relaxed">{mod.responsibility}</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 font-mono">
                <span>Dependencies:</span>
                <span className="text-slate-400">{mod.dependencies.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entry Points & Conventions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Entry Points & Test Frameworks</span>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div><span className="text-slate-500">Entry:</span> {arch.entryPoints.join(', ')}</div>
            <div><span className="text-slate-500">Frameworks:</span> {arch.testFrameworks.join(', ')}</div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2">
          <span className="font-bold text-slate-400 uppercase text-[10px] block">Repository Code Conventions</span>
          <p className="text-slate-300 leading-relaxed">{arch.conventions}</p>
        </div>
      </div>
    </div>
  );
};
