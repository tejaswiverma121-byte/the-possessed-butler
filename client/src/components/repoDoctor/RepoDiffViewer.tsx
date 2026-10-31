import React, { useState } from 'react';
import { GitBranch, FileCode, Copy, Check } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoDiffViewerProps {
  patch: RepoDoctorState['patch'];
}

export const RepoDiffViewer: React.FC<RepoDiffViewerProps> = ({ patch }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = patch.modifiedFiles[selectedFileIdx] || patch.modifiedFiles[0];

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(activeFile.diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Branch & Modified Files Strip */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <GitBranch className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">Isolated Working Branch:</span>
          <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {patch.branchName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {patch.modifiedFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFileIdx(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedFileIdx === idx
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {file.path.split('/').pop()}
            </button>
          ))}
          <button
            onClick={handleCopyDiff}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors ml-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Diff'}</span>
          </button>
        </div>
      </div>

      {/* Unified Diff Box */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs">
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-slate-300 font-semibold">{activeFile.path}</span>
          <span className="text-[11px] text-slate-500 font-sans">Targeted Minimal Patch</span>
        </div>

        <div className="p-4 bg-slate-950/90 overflow-x-auto leading-relaxed">
          {activeFile.diff.split('\n').map((line, i) => {
            const isAdd = line.startsWith('+') && !line.startsWith('+++');
            const isDel = line.startsWith('-') && !line.startsWith('---');
            const isHunk = line.startsWith('@@');

            return (
              <div
                key={i}
                className={
                  isAdd
                    ? 'bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded'
                    : isDel
                    ? 'bg-rose-950/70 text-rose-300 px-2 py-0.5 rounded'
                    : isHunk
                    ? 'text-cyan-400 font-bold py-1'
                    : 'text-slate-400 px-2'
                }
              >
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
