import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, Clock, Users, ShieldAlert, Cpu } from 'lucide-react';
import { ProjectInput } from '../types';

interface ProblemSubmissionProps {
  onSubmit: (input: ProjectInput) => Promise<void>;
  isLoading: boolean;
}

const TEMPLATES: Array<{ label: string; tag: string; data: ProjectInput }> = [
  {
    label: 'College Teammate Matchmaker (Flagship)',
    tag: 'Academic & Collaboration',
    data: {
      title: 'College Teammate Compatibility Engine',
      problemStatement: 'Students struggle to find reliable teammates for college projects because they do not know who has the necessary skills, interests, or availability.',
      targetUsers: 'College undergraduates, capstone course teams, academic coordinators',
      existingSolutions: 'Ad-hoc WhatsApp/Discord group chats, cold messaging classmates, random instructor assignment',
      constraints: 'Must work smoothly on mobile and desktop without requiring campus IT installation',
      preferences: 'Modern responsive web app with interactive weekly availability heatmap and live match scoring'
    }
  },
  {
    label: 'Hospital Emergency Bed Triage',
    tag: 'Healthcare Operations',
    data: {
      title: 'Emergency Department Bed Triage System',
      problemStatement: 'Emergency room triage nurses experience severe delays routing critical patients to available beds because current bed-status updates require manual telephone calls between disparate ward departments.',
      targetUsers: 'ER triage nurses, floor charge nurses, hospital bed managers, transport staff',
      existingSolutions: 'Dry-erase whiteboard in triage bay, intermittent phone check-ins every 45 minutes',
      constraints: 'Strict HIPAA compliance, sub-second latency for bed occupancy updates, audio alerts',
      preferences: 'High-contrast dark mode dashboard suitable for nurse station wall monitors'
    }
  },
  {
    label: 'Freelance Milestone Escrow & Dispute Resolution',
    tag: 'Fintech & Remote Work',
    data: {
      title: 'Milestone Escrow & Scope Protection Platform',
      problemStatement: 'Independent software contractors frequently suffer unpaid milestone invoices or scope creep from non-technical clients who reject deliverables without concrete acceptance criteria.',
      targetUsers: 'Freelance developers, boutique design agencies, small business clients',
      existingSolutions: 'PayPal invoices, informal email agreements, expensive traditional platforms with 20% commission',
      constraints: 'Instant milestone funding verification, cryptographically verifiable acceptance sign-offs',
      preferences: 'Clean developer-centric UI with interactive contract milestone timeline'
    }
  }
];

export const ProblemSubmission: React.FC<ProblemSubmissionProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProjectInput>({
    title: '',
    problemStatement: '',
    targetUsers: '',
    existingSolutions: '',
    constraints: '',
    preferences: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyTemplate = (template: typeof TEMPLATES[0]) => {
    setFormData(template.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problemStatement.trim()) return;
    await onSubmit(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-slate-800 shadow-2xl max-w-4xl mx-auto">
      {/* Title & Description */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 1: Problem Submission Workspace</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          What real-world problem do you need to solve?
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Describe any problem in ordinary human language. Problem2Product AI will systematically investigate root causes (5 Whys & Fishbone), formulate and compare trade-offs, generate a runnable full-stack application, run tests, repair defects, and produce an honest verification report.
        </p>
      </div>

      {/* Preset Starters */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Or select a flagship reference problem:</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-3 text-left rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-850 hover:border-emerald-500/50 transition-all group"
            >
              <span className="text-[10px] font-mono uppercase text-emerald-400/90 font-medium block">
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
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Problem Statement <span className="text-emerald-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.problemStatement}
            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            placeholder='e.g., "Students struggle to find reliable teammates for college projects because they do not know who has the necessary skills, interests, or availability."'
            className="w-full bg-slate-900/90 text-slate-100 text-sm border border-slate-700/80 rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Optional Collapsible Fields */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
          >
            <span>{showAdvanced ? '− Hide optional context' : '+ Add optional target stakeholders, constraints, or preferences'}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Users / Stakeholders</span>
                </label>
                <input
                  type="text"
                  value={formData.targetUsers}
                  onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                  placeholder="e.g. Undergrad students, course TAs, faculty"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                  <span>Existing Solutions & Limitations</span>
                </label>
                <input
                  type="text"
                  value={formData.existingSolutions}
                  onChange={(e) => setFormData({ ...formData, existingSolutions: e.target.value })}
                  placeholder="e.g. WhatsApp chats (unorganized), instructor random assignments"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Constraints (Budget, Time, Technical)</span>
                </label>
                <input
                  type="text"
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="e.g. Must run in modern browser without IT install"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Platform / Tech Preferences</span>
                </label>
                <input
                  type="text"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  placeholder="e.g. React, Tailwind, responsive mobile-friendly"
                  className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !formData.problemStatement.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Investigating & Engineering Solution...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Launch Autonomous Investigation Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
