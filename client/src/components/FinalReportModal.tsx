import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Printer, ShieldAlert } from 'lucide-react';
import { ProjectState } from '../types';

interface FinalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({ isOpen, onClose, project }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    return `# Problem2Product AI — Autonomous Master Project Verification Report
**Project Title:** ${project.title}
**Generated Date:** ${new Date().toISOString()}
**Pipeline Status:** ${project.status.toUpperCase()} (Stage ${project.currentStage}/15)

---

## 1. Original Problem Statement
"${project.input.problemStatement}"

## 2. Problem Summary and Affected Users
- **What is Happening:** ${project.problemBrief?.whatIsHappening || 'N/A'}
- **Affected Stakeholders:** ${project.problemBrief?.whoIsAffected || 'N/A'}
- **Frequency & Impact:** ${project.problemBrief?.frequencyAndImpact || 'N/A'}
- **Failure of Current Approaches:** ${project.problemBrief?.whyExistingFails || 'N/A'}

## 3. Root Causes and Evidence (5 Whys Decomposition)
${project.rootCauses?.map((rc, idx) => `
### Cause ${idx + 1}: ${rc.title}
- **Category:** ${rc.category}
- **Status:** ${rc.epistemicStatus}
- **Confidence Rating:** ${rc.confidenceLevel}% (${rc.confidenceExplanation})
- **5 Whys Chain:**
${rc.fiveWhys.map((w, wi) => `  ${wi + 1}. ${w}`).join('\n')}
- **Underlying Mechanism:** ${rc.mechanism}
- **Supporting Evidence:** ${rc.evidence}
- **Consequences if Unresolved:** ${rc.unresolvedConsequence}
- **Validation Method:** ${rc.validationMethod}
`).join('\n') || 'None'}

## 4. Assumptions and Unknowns
${project.evidenceAndAssumptions?.map((ea) => `- [${ea.type.toUpperCase()}] ${ea.statement} (Status: ${ea.status})`).join('\n') || 'None'}

## 5. Alternative Solutions Considered
${project.solutionOptions?.map((sol) => `
- **${sol.title}** (${sol.tagline})
  - Complexity: ${sol.complexity} | Effort: ${sol.estimatedEffort} | Cost: ${sol.relativeCost}
  - User Value: ${sol.scoreBreakdown.userValue}/10 | Feasibility: ${sol.scoreBreakdown.feasibility}/10
`).join('\n') || 'None'}

## 6. Recommended Solution & Decision Rationale
**Chosen Approach:** ${project.recommendedSolutionId || 'N/A'}
**Rationale:** ${project.recommendationRationale || 'N/A'}

## 7. Root-Cause-to-Feature Mapping (Traceability)
${project.traceability?.map((tr) => `
- **${tr.rootCauseTitle}**
  - Mitigation: ${tr.mitigation}
  - Website Feature: ${tr.websiteFeature}
  - Files: ${tr.implementationFiles.join(', ')}
  - Verification: ${tr.verificationTest}
  - Metric: ${tr.outcomeMetric}
`).join('\n') || 'None'}

## 8. Selected Technology Stack & Reasons
- **Frontend:** ${project.architecture?.techStack.frontend || 'React + Tailwind CSS'}
- **Backend:** ${project.architecture?.techStack.backend || 'Node.js Express'}
- **Database:** ${project.architecture?.techStack.database || 'SQLite / JSON'}
- **Architecture Rationale:** ${project.architecture?.rationale || 'Decoupled full-stack architecture'}

## 9. Implemented Features & Source Files
${project.generatedFiles?.map((f) => `- \`${f.path}\` (${f.language}) — ${f.purpose}`).join('\n') || 'None'}

## 10. Requirements and Acceptance Criteria
${project.requirements?.functionalRequirements.map((fr) => `
- **[${fr.priority}] ${fr.id}: ${fr.title}**
  - Description: ${fr.description}
  - Acceptance Criteria: ${fr.acceptanceCriteria.join('; ')}
`).join('\n') || 'None'}

## 11. Risks Discovered & Mitigations Implemented
${project.riskRegister?.map((r) => `
- **[${r.priority}] ${r.id}: ${r.description}**
  - Severity: ${r.severity.toUpperCase()} | Category: ${r.category}
  - Mitigation: ${r.mitigation}
  - Status: ${r.status.toUpperCase()} (Test: ${r.associatedTestId})
`).join('\n') || 'None'}

## 12. Tests Executed (Truthful Results)
${project.testSuites?.flatMap((s) => s.tests).map((t) => `- [${t.status.toUpperCase()}] ${t.name} (${t.durationMs || 0}ms)`).join('\n') || 'None'}

## 13. Issues Fixed and Regression Checks
${project.repairHistory?.map((rh) => `
- **Defect:** ${rh.detectedFailure}
  - Root Cause: ${rh.rootCauseIdentified}
  - Patched File: ${rh.filePath}
  - Regression Result: ${rh.regressionCheck}
`).join('\n') || 'No repairs needed.'}

## 14. Unresolved Issues, Untested Areas & Known Limitations ("No Claim of Perfection")
${project.unresolvedLimitations?.map((lim, idx) => `${idx + 1}. ${lim}`).join('\n') || 'None recorded.'}

## 15. Setup & Run Instructions
1. Open \`public/index.html\` in any web browser.
2. Run backend API: \`node src/server.js\`
3. Execute tests: \`npm test\`

## 16. Preview & Deployment Instructions
- Embeddable sandbox available at: \`/api/preview/${project.id}\`
- Containerized deployment ready via Node.js runtime.

## 17. Measurable Success Metrics
${project.problemBrief?.successCriteria.map((sc) => `- **${sc.metric}:** Target ${sc.target} (Method: ${sc.evaluationMethod})`).join('\n') || 'None'}

## 18. Recommended Next Improvements
1. Cross-institutional federation with university single sign-on (OAuth2/SAML).
2. Longitudinal peer rating decay algorithm to prevent score inflation over multiple terms.
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Problem2Product-Report-${project.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-card rounded-2xl w-full max-w-4xl h-[90vh] p-6 space-y-4 border border-slate-700 shadow-2xl flex flex-col relative">
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                18-Section Master Project Verification Report
              </h2>
              <p className="text-xs text-slate-400">Complete architectural, root-cause, testing, and limitation audit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Preview */}
        <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-4 leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono">{generateMarkdownReport()}</pre>
        </div>

        {/* Footer Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center gap-2 text-[11px] text-amber-300/90">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>No Claim of Perfection:</strong> This report reflects evidence from automated tests and domain analysis. It transparently records known limitations and unverified areas rather than claiming absolute defect-free perfection.
          </span>
        </div>
      </div>
    </div>
  );
};
