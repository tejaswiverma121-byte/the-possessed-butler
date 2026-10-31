import React, { useState } from 'react';
import { GitPullRequest, CheckCircle2, ShieldAlert, Send, Copy, Check } from 'lucide-react';
import { RepoDoctorState } from '../../types';
import { approveRepoPr } from '../../api';

interface RepoPrBundleViewProps {
  investigation: RepoDoctorState;
  onRefresh: () => void;
}

export const RepoPrBundleView: React.FC<RepoPrBundleViewProps> = ({ investigation, onRefresh }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [copiedPr, setCopiedPr] = useState(false);
  const [copiedCommit, setCopiedCommit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const pr = investigation.openSourceContribution;
  const patch = investigation.patch;

  const handleApprove = async () => {
    setIsApproving(true);
    setSuccessMessage('');
    try {
      const res = await approveRepoPr(investigation.id);
      setSuccessMessage(res.message);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error authorizing pull request');
    } finally {
      setIsApproving(false);
    }
  };

  const handleCopyPr = () => {
    navigator.clipboard.writeText(patch.pullRequestBody);
    setCopiedPr(true);
    setTimeout(() => setCopiedPr(false), 2000);
  };

  const handleCopyCommit = () => {
    navigator.clipboard.writeText(patch.commitMessage);
    setCopiedCommit(true);
    setTimeout(() => setCopiedCommit(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
          <GitPullRequest className="w-5 h-5" />
          <span>Open-Source Contribution Package & GitHub Pull Request</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Prepares all required open-source contribution artifacts matching repository guidelines: conventional commit message, detailed PR summary with root-cause and test verification, and maintainer review checklist.
        </p>
      </div>

      {/* Suggested Commit Message */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
            Suggested Conventional Commit Message
          </span>
          <button
            onClick={handleCopyCommit}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
          >
            {copiedCommit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCommit ? 'Copied' : 'Copy Commit'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
          {patch.commitMessage}
        </pre>
      </div>

      {/* Pull Request Body */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 block">
              Pull Request Title & Description
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">{patch.pullRequestTitle}</span>
          </div>
          <button
            onClick={handleCopyPr}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
          >
            {copiedPr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPr ? 'Copied' : 'Copy PR Body'}</span>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {patch.pullRequestBody}
        </div>
      </div>

      {/* Contribution Review Checklist */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Maintainer Quality & Contribution Checklist
        </h4>
        <div className="space-y-2">
          {pr.reviewChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{item.item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Approval Gate (Mandatory Guardrail) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700 bg-slate-900/60 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Explicit User Approval Guardrail</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Problem2Product AI operates with strict safety controls. Changes remain local in an isolated workspace until you explicitly authorize submitting the branch and pull request to the target repository.
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400">
              Target: <strong className="text-white">{investigation.architecturalMap.repoName}</strong> (Branch: {investigation.architecturalMap.defaultBranch})
            </div>
            <button
              onClick={handleApprove}
              disabled={isApproving || pr.submittedToGitHub}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isApproving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to Repository...</span>
                </>
              ) : pr.submittedToGitHub ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Pull Request Authorized</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Authorize & Submit Pull Request</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
