import React from 'react';
import { Sparkles, Terminal, Settings, FileText, Plus, ShieldCheck, Wrench } from 'lucide-react';
import { ProjectState, RepoDoctorState } from '../types';

interface NavbarProps {
  currentMode: 'mode_a' | 'mode_b';
  setMode: (mode: 'mode_a' | 'mode_b') => void;
  projects: ProjectState[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  repos: RepoDoctorState[];
  selectedRepoId: string;
  onSelectRepo: (id: string) => void;
  onNewProblem: () => void;
  onNewRepo: () => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  aiSettings: { provider: string; hasKey: boolean; model: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setMode,
  projects,
  selectedProjectId,
  onSelectProject,
  repos,
  selectedRepoId,
  onSelectRepo,
  onNewProblem,
  onNewRepo,
  onOpenSettings,
  onOpenReport,
  aiSettings,
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Mode Switcher */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">Problem2Product</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Root-Cause Engineering & Repo Doctor</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setMode('mode_a')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentMode === 'mode_a'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mode A: New Solution</span>
            </button>
            <button
              onClick={() => setMode('mode_b')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentMode === 'mode_b'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mode B: Repo Doctor</span>
            </button>
          </div>
        </div>

        {/* Controls, Selector & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Active Item Selector */}
          {currentMode === 'mode_a' ? (
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 max-w-[200px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedRepoId}
              onChange={(e) => onSelectRepo(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 max-w-[200px] truncate"
            >
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.architecturalMap?.repoName || r.input.repoUrl}
                </option>
              ))}
            </select>
          )}

          {/* New Item Trigger */}
          {currentMode === 'mode_a' ? (
            <button
              onClick={onNewProblem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Problem</span>
            </button>
          ) : (
            <button
              onClick={onNewRepo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Diagnose Repo</span>
            </button>
          )}

          {/* Report Button (Mode A) */}
          {currentMode === 'mode_a' && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="View 18-Section Final Report"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Report</span>
            </button>
          )}

          {/* Engine / Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {aiSettings.hasKey ? aiSettings.provider : 'Domain Safe Engine'}
            </span>
            <Settings className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
