import React, { useState, useEffect } from 'react';
import { 
  fetchProjects, 
  fetchProject, 
  submitProject, 
  fetchRepos, 
  fetchRepo, 
  analyzeRepository, 
  fetchSettings 
} from './api';
import { ProjectState, RepoDoctorState, ProjectInput, RepoDoctorInput } from './types';
import { Navbar } from './components/Navbar';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { ProblemSubmission } from './components/ProblemSubmission';
import { ProblemBriefView } from './components/ProblemBriefView';
import { RootCauseExplorer } from './components/RootCauseExplorer';
import { EvidenceAndAssumptionsView } from './components/EvidenceAndAssumptionsView';
import { SolutionComparison } from './components/SolutionComparison';
import { TraceabilityMatrix } from './components/TraceabilityMatrix';
import { RequirementsView } from './components/RequirementsView';
import { RiskRegisterView } from './components/RiskRegisterView';
import { AppPreviewSandbox } from './components/AppPreviewSandbox';
import { CodeExplorer } from './components/CodeExplorer';
import { TestDashboard } from './components/TestDashboard';
import { RepairWorkbench } from './components/RepairWorkbench';
import { FinalReportModal } from './components/FinalReportModal';
import { ApiKeyModal } from './components/ApiKeyModal';

// Repo Doctor Components
import { RepoSubmission } from './components/repoDoctor/RepoSubmission';
import { RepoArchitectureMap } from './components/repoDoctor/RepoArchitectureMap';
import { RepoRootCauseView } from './components/repoDoctor/RepoRootCauseView';
import { RepoFixStrategyView } from './components/repoDoctor/RepoFixStrategyView';
import { RepoDiffViewer } from './components/repoDoctor/RepoDiffViewer';
import { RepoTestVerification } from './components/repoDoctor/RepoTestVerification';
import { RepoSecondPassReview } from './components/repoDoctor/RepoSecondPassReview';
import { RepoPrBundleView } from './components/repoDoctor/RepoPrBundleView';

import { 
  Layers, 
  HelpCircle, 
  FileCheck, 
  Scale, 
  Network, 
  CheckSquare, 
  ShieldAlert, 
  Monitor, 
  FileCode, 
  TestTube, 
  Wrench,
  GitBranch,
  FileSearch,
  GitPullRequest
} from 'lucide-react';

export function App() {
  const [currentMode, setCurrentMode] = useState<'mode_a' | 'mode_b'>('mode_a');
  
  // Projects State (Mode A)
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activeProject, setActiveProject] = useState<ProjectState | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);
  const [showNewProblemModal, setShowNewProblemModal] = useState(false);

  // Repos State (Mode B)
  const [repos, setRepos] = useState<RepoDoctorState[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [activeRepo, setActiveRepo] = useState<RepoDoctorState | null>(null);
  const [activeRepoTab, setActiveRepoTab] = useState<string>('diagnosis');
  const [isSubmittingRepo, setIsSubmittingRepo] = useState(false);
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);

  // Global Modals
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [aiSettings, setAiSettings] = useState({ provider: 'domain_engine', hasKey: false, model: 'auto' });

  // Initial Load
  useEffect(() => {
    loadSettings();
    loadProjects();
    loadRepos();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setAiSettings(data);
    } catch (e) {
      console.warn('Failed to fetch settings', e);
    }
  };

  const loadProjects = async (selectId?: string) => {
    try {
      const data = await fetchProjects();
      setProjects(data.projects);
      if (data.projects.length > 0) {
        const targetId = selectId || selectedProjectId || data.projects[0].id;
        setSelectedProjectId(targetId);
        const active = await fetchProject(targetId);
        setActiveProject(active.project);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRepos = async (selectId?: string) => {
    try {
      const data = await fetchRepos();
      setRepos(data.investigations);
      if (data.investigations.length > 0) {
        const targetId = selectId || selectedRepoId || data.investigations[0].id;
        setSelectedRepoId(targetId);
        const active = await fetchRepo(targetId);
        setActiveRepo(active.investigation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    const data = await fetchProject(id);
    setActiveProject(data.project);
    setShowNewProblemModal(false);
  };

  const handleSelectRepo = async (id: string) => {
    setSelectedRepoId(id);
    const data = await fetchRepo(id);
    setActiveRepo(data.investigation);
    setShowNewRepoModal(false);
  };

  const handleCreateProject = async (input: ProjectInput) => {
    setIsSubmittingProblem(true);
    try {
      const res = await submitProject(input);
      await loadProjects(res.project.id);
      setShowNewProblemModal(false);
      setActiveTab('overview');
    } catch (err: any) {
      alert(err.message || 'Error processing problem statement');
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  const handleCreateRepoInvestigation = async (input: RepoDoctorInput) => {
    setIsSubmittingRepo(true);
    try {
      const res = await analyzeRepository(input);
      await loadRepos(res.investigation.id);
      setShowNewRepoModal(false);
      setActiveRepoTab('diagnosis');
    } catch (err: any) {
      alert(err.message || 'Error analyzing repository');
    } finally {
      setIsSubmittingRepo(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar
        currentMode={currentMode}
        setMode={setCurrentMode}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        repos={repos}
        selectedRepoId={selectedRepoId}
        onSelectRepo={handleSelectRepo}
        onNewProblem={() => setShowNewProblemModal(true)}
        onNewRepo={() => setShowNewRepoModal(true)}
        onOpenSettings={() => setShowApiKeyModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        aiSettings={aiSettings}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* ================= MODE A: PROBLEM2PRODUCT ================= */}
        {currentMode === 'mode_a' && (
          <div className="space-y-6">
            {/* If New Problem is toggled or no project exists */}
            {showNewProblemModal || !activeProject ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <span className="text-xs font-mono text-slate-400">Step 1 of 15 • Problem Formulation</span>
                  {activeProject && (
                    <button
                      onClick={() => setShowNewProblemModal(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Back to active project
                    </button>
                  )}
                </div>
                <ProblemSubmission onSubmit={handleCreateProject} isLoading={isSubmittingProblem} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* 15-Stage Pipeline Progress Header */}
                <PipelineVisualizer project={activeProject} />

                {/* Navigation Tabs for Mode A */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-medium">
                  {[
                    { id: 'overview', label: 'Problem Brief', icon: FileCheck },
                    { id: 'root_cause', label: '5 Whys & Fishbone', icon: Layers },
                    { id: 'evidence', label: 'Evidence & Assumptions', icon: HelpCircle },
                    { id: 'solutions', label: 'Solution Matrix', icon: Scale },
                    { id: 'traceability', label: 'Traceability', icon: Network },
                    { id: 'requirements', label: 'Requirements', icon: CheckSquare },
                    { id: 'risks', label: 'Risk Register', icon: ShieldAlert },
                    { id: 'preview', label: 'Live Sandbox', icon: Monitor },
                    { id: 'code', label: 'Source Code', icon: FileCode },
                    { id: 'tests', label: 'Automated Tests', icon: TestTube },
                    { id: 'repair', label: 'Self-Repair Log', icon: Wrench },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shrink-0 ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Views */}
                {activeTab === 'overview' && (
                  <ProblemBriefView
                    brief={activeProject.problemBrief}
                    problemStatement={activeProject.input.problemStatement}
                  />
                )}

                {activeTab === 'root_cause' && (
                  <RootCauseExplorer rootCauses={activeProject.rootCauses} />
                )}

                {activeTab === 'evidence' && (
                  <EvidenceAndAssumptionsView
                    projectId={activeProject.id}
                    items={activeProject.evidenceAndAssumptions}
                    onRefresh={() => handleSelectProject(activeProject.id)}
                  />
                )}

                {activeTab === 'solutions' && (
                  <SolutionComparison
                    solutions={activeProject.solutionOptions}
                    recommendedSolutionId={activeProject.recommendedSolutionId}
                    recommendationRationale={activeProject.recommendationRationale}
                  />
                )}

                {activeTab === 'traceability' && (
                  <TraceabilityMatrix traceability={activeProject.traceability} />
                )}

                {activeTab === 'requirements' && (
                  <RequirementsView requirements={activeProject.requirements} />
                )}

                {activeTab === 'risks' && (
                  <RiskRegisterView risks={activeProject.riskRegister} />
                )}

                {activeTab === 'preview' && (
                  <AppPreviewSandbox projectId={activeProject.id} />
                )}

                {activeTab === 'code' && (
                  <CodeExplorer files={activeProject.generatedFiles} />
                )}

                {activeTab === 'tests' && (
                  <TestDashboard testSuites={activeProject.testSuites} />
                )}

                {activeTab === 'repair' && (
                  <RepairWorkbench repairHistory={activeProject.repairHistory} />
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= MODE B: AI REPOSITORY DOCTOR ================= */}
        {currentMode === 'mode_b' && (
          <div className="space-y-6">
            {showNewRepoModal || !activeRepo ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <span className="text-xs font-mono text-slate-400">Autonomous Codebase Analysis & Fix</span>
                  {activeRepo && (
                    <button
                      onClick={() => setShowNewRepoModal(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Back to active investigation
                    </button>
                  )}
                </div>
                <RepoSubmission onSubmit={handleCreateRepoInvestigation} isLoading={isSubmittingRepo} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Repository Header Strip */}
                <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <h2 className="text-base font-bold text-white tracking-tight">
                        {activeRepo.architecturalMap.repoName}
                      </h2>
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-semibold">
                        Phase {activeRepo.currentPhase}/7 • Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Issue: <span className="text-slate-200 font-medium">{activeRepo.input.issueTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                      Branch: {activeRepo.patch.branchName}
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs for Mode B */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-medium">
                  {[
                    { id: 'arch', label: 'Codebase Map', icon: Layers },
                    { id: 'diagnosis', label: 'Root Cause & Failure Point', icon: Wrench },
                    { id: 'strategy', label: 'Fix Strategy & Trade-offs', icon: Scale },
                    { id: 'diff', label: 'Targeted Git Patch', icon: GitBranch },
                    { id: 'tests', label: 'Reproduction & Verification', icon: TestTube },
                    { id: 'review', label: 'Second-Pass Review', icon: FileSearch },
                    { id: 'pr', label: 'Contribution & PR Gate', icon: GitPullRequest },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeRepoTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveRepoTab(tab.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Repo Doctor Tab Views */}
                {activeRepoTab === 'arch' && (
                  <RepoArchitectureMap arch={activeRepo.architecturalMap} />
                )}

                {activeRepoTab === 'diagnosis' && (
                  <RepoRootCauseView diagnosis={activeRepo.rootCauseDiagnosis} />
                )}

                {activeRepoTab === 'strategy' && (
                  <RepoFixStrategyView strategy={activeRepo.fixStrategy} />
                )}

                {activeRepoTab === 'diff' && (
                  <RepoDiffViewer patch={activeRepo.patch} />
                )}

                {activeRepoTab === 'tests' && (
                  <RepoTestVerification verification={activeRepo.testVerification} />
                )}

                {activeRepoTab === 'review' && (
                  <RepoSecondPassReview review={activeRepo.secondPassReview} />
                )}

                {activeRepoTab === 'pr' && (
                  <RepoPrBundleView
                    investigation={activeRepo}
                    onRefresh={() => handleSelectRepo(activeRepo.id)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        currentSettings={aiSettings}
        onSettingsUpdated={loadSettings}
      />

      {activeProject && (
        <FinalReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          project={activeProject}
        />
      )}
    </div>
  );
}

export default App;
