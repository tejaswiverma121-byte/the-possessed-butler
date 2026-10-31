import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileSearch } from 'lucide-react';
import { RepoDoctorState } from '../../types';

interface RepoSecondPassReviewProps {
  review: RepoDoctorState['secondPassReview'];
}

export const RepoSecondPassReview: React.FC<RepoSecondPassReviewProps> = ({ review }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <FileSearch className="w-5 h-5 text-emerald-400" />
          <span>Phase 6: Independent Second-Pass Code Review</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          An automated adversary review auditing the patch for security vulnerabilities, architectural style consistency, maintainability by future maintainers, and unintended regression surfaces.
        </p>
      </div>

      {/* Review Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Security */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-sm">Security Audit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              {review.securityCheck.status}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{review.securityCheck.notes}</p>
        </div>

        {/* Architectural Fit */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-sm">Architectural Fit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              {review.architecturalFit.status}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{review.architecturalFit.notes}</p>
        </div>

        {/* Maintainability */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-sm">Maintainability</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              {review.maintainability.status}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{review.maintainability.notes}</p>
        </div>
      </div>

      {/* Remaining Concerns */}
      {review.remainingConcerns.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Advisory Notes for Repository Maintainers
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
            {review.remainingConcerns.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
