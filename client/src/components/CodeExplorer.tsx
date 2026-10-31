import React, { useState } from 'react';
import { FileCode, Folder, Copy, Check, Info, FileText } from 'lucide-react';
import { GeneratedFile } from '../types';

interface CodeExplorerProps {
  files?: GeneratedFile[];
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    files && files.length > 0 ? files[0].path : ''
  );
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Generating multi-file application source code...
      </div>
    );
  }

  const selectedFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Code Explorer Shell */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Left Sidebar: File Tree */}
        <div className="w-full md:w-64 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 p-3.5 space-y-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <Folder className="w-4 h-4 text-emerald-400" />
            <span>Project Artifacts ({files.length})</span>
          </div>

          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = file.path === selectedFile.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  {file.isModified && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      Patched
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden">
          {/* File Top Bar */}
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">{selectedFile.path}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">
                {selectedFile.language} • {selectedFile.content.split('\n').length} lines
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Purpose banner */}
          <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Purpose:</strong> {selectedFile.purpose}
            </span>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-300 leading-relaxed">
            <pre className="whitespace-pre">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
