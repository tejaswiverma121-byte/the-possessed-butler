import React, { useState } from 'react';
import { Wrench, GitPullRequest, Send, Sparkles, BookOpen, Bug, CheckSquare } from 'lucide-react';
import { RepoDoctorInput } from '../../types';

interface RepoSubmissionProps {
  onSubmit: (input: RepoDoctorInput) => Promise<void>;
  isLoading: boolean;
}

const REPO_TEMPLATES: Array<{ label: string; tag: string; data: RepoDoctorInput }> = [
  {
    label: 'Express.js Storage Cache Invalidation Bug',
    tag: 'Stale Cache Read (#4982)',
    data: {
      repoUrl: 'https://github.com/expressjs/express',
      issueTitle: 'Stale query cache read after entity mutation in storage layer',
      issueDescription: 'When updating an entity status via PUT /item/:id, subsequent filtered queries like GET /items?status=active still return the old cached entity state for several minutes, causing data inconsistency across clients.',
      issueNumber: '4982',
      expectedBehavior: 'Mutating an entity should immediately invalidate all cached query results that contain or match that entity.',
      actualBehavior: 'Only the direct key entity:id is purged from cache, leaving composite query keys like query:status=active stale.',
      reproductionSteps: '1. GET /items?status=active -> Cached with item-1\n2. PUT /items/item-1 with status=archived\n3. GET /items?status=active -> Returns item-1 (STALE)',
      targetBranch: 'master'
    }
  },
  {
    label: 'TanStack Query Race Condition',
    tag: 'Concurrency & Network',
    data: {
      repoUrl: 'https://github.com/TanStack/query',
      issueTitle: 'Race condition when rapidly toggling search query filter input',
      issueDescription: 'Fast typing in filter inputs triggers concurrent fetch requests where an older slow response resolves after a newer fast response, rendering outdated search results in the UI.',
      issueNumber: '6120',
      expectedBehavior: 'Stale responses should be aborted or ignored via AbortController signal when a newer request is in flight.',
      actualBehavior: 'Older response overwrites newer query cache state if network latency fluctuates.',
      reproductionSteps: '1. Type "alpha" (network delayed by 400ms)\n2. Backspace and type "beta" (resolves in 100ms)\n3. "alpha" response finishes last and replaces "beta"',
      targetBranch: 'main'
    }
  }
];

export const RepoSubmission: React.FC<RepoSubmissionProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<RepoDoctorInput>({
    repoUrl: '',
    issueTitle: '',
    issueDescription: '',
    issueNumber: '',
    expectedBehavior: '',
    actualBehavior: '',
    reproductionSteps: '',
    targetBranch: 'main'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyTemplate = (tmpl: typeof REPO_TEMPLATES[0]) => {
    setFormData(tmpl.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.repoUrl.trim() || !formData.issueDescription.trim()) return;
    await onSubmit(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-slate-800 shadow-2xl max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800 text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Mode B: AI Repository Doctor Workspace</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Diagnose, Fix & Prepare PR for an Existing Codebase
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Provide a GitHub repository URL and an issue report. Repository Doctor will map the codebase architecture, isolate the root failure point, synthesize a minimal targeted patch on a clean branch, verify with reproduction tests, and prepare an open-source pull request.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Or load a real-world repository defect benchmark:</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REPO_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-3.5 text-left rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-850 hover:border-blue-500/50 transition-all group"
            >
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold block">
                {tmpl.tag}
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-1 group-hover:text-white transition-colors">
                {tmpl.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              GitHub Repository URL <span className="text-blue-400">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Branch (Default: main)
            </label>
            <input
              type="text"
              value={formData.targetBranch}
              onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
              placeholder="main or master"
              className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Issue Title or Summary
          </label>
          <input
            type="text"
            value={formData.issueTitle}
            onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
            placeholder="e.g. Stale query cache read after entity mutation in storage layer"
            className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Defect Description / Problem Report <span className="text-blue-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.issueDescription}
            onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
            placeholder="Explain the symptom, error logs, or failure behavior observed in the codebase..."
            className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-xl p-3.5 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
          />
        </div>

        {/* Collapsible Expected vs Actual */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 font-medium"
          >
            <span>{showAdvanced ? '− Hide reproduction steps & behavior details' : '+ Add reproduction steps, expected vs actual behavior'}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expected Behavior</label>
                <textarea
                  rows={2}
                  value={formData.expectedBehavior}
                  onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                  placeholder="What should correctly happen?"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Actual Behavior</label>
                <textarea
                  rows={2}
                  value={formData.actualBehavior}
                  onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                  placeholder="What actually happens instead?"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Reproduction Steps / Stack Trace</label>
                <textarea
                  rows={2}
                  value={formData.reproductionSteps}
                  onChange={(e) => setFormData({ ...formData, reproductionSteps: e.target.value })}
                  placeholder="1. Step one&#10;2. Step two"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !formData.repoUrl.trim() || !formData.issueDescription.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Codebase & Synthesizing Fix...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Run Autonomous Repository Doctor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
