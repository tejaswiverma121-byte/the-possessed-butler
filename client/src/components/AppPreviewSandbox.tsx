import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, ExternalLink, Play, Sparkles } from 'lucide-react';

interface AppPreviewSandboxProps {
  projectId: string;
}

export const AppPreviewSandbox: React.FC<AppPreviewSandboxProps> = ({ projectId }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const previewUrl = `/api/preview/${projectId}`;

  return (
    <div className="space-y-4">
      {/* Sandbox Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight">Live Interactive Sandbox Preview</h3>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            (Isolated Generated Web Application)
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Device Switcher */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                device === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                device === 'tablet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                device === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Reload Preview Sandbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Pop Out</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full flex justify-center p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 min-h-[640px] overflow-hidden">
        <div
          className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col ${
            device === 'mobile'
              ? 'w-[375px] h-[660px]'
              : device === 'tablet'
              ? 'w-[768px] h-[660px]'
              : 'w-full h-[660px]'
          }`}
        >
          {/* Simulated Browser Address Bar */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-slate-900 px-3 py-0.5 rounded text-[11px] font-mono text-slate-400 w-full max-w-md mx-auto text-center truncate border border-slate-800">
              https://sandbox.local/preview/{projectId}
            </div>
          </div>

          {/* Actual Iframe */}
          <iframe
            key={refreshKey}
            src={previewUrl}
            title="Generated Solution Sandbox"
            className="w-full flex-1 border-0 bg-slate-950"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
