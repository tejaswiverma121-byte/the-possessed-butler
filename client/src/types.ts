export interface ProjectInput {
  title: string;
  problemStatement: string;
  targetUsers?: string;
  existingSolutions?: string;
  constraints?: string;
  preferences?: string;
}

export interface ProblemBrief {
  whatIsHappening: string;
  whoIsAffected: string;
  frequencyAndImpact: string;
  currentWorkarounds: string;
  whyExistingFails: string;
  successCriteria: Array<{
    id: string;
    metric: string;
    target: string;
    evaluationMethod: string;
  }>;
  knownFacts: string[];
  assumptions: string[];
  hypotheses: string[];
}

export type RootCauseCategory = 'process' | 'people' | 'technology' | 'information' | 'environment' | 'policy';
export type EpistemicStatus = 'verified' | 'user_reported' | 'inferred' | 'unverified_hypothesis';

export interface RootCause {
  id: string;
  title: string;
  explanation: string;
  fiveWhys: string[];
  category: RootCauseCategory;
  evidence: string;
  epistemicStatus: EpistemicStatus;
  mechanism: string;
  affectedWorkflows: string[];
  unresolvedConsequence: string;
  validationMethod: string;
  confidenceLevel: number;
  confidenceExplanation: string;
  neededForConfidence: string;
}

export interface EvidenceAssumptionItem {
  id: string;
  type: 'verified_fact' | 'user_reported' | 'inferred' | 'hypothesis' | 'unknown';
  statement: string;
  source: string;
  status: 'confirmed' | 'disputed' | 'needs_validation';
  userCorrection?: string;
}

export interface SolutionOption {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  howItWorks: string;
  addressedRootCauseIds: string[];
  userBenefits: Record<string, string>;
  requiredFeatures: string[];
  advantages: string[];
  disadvantages: string[];
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  estimatedEffort: string;
  relativeCost: 'minimal' | 'moderate' | 'significant' | 'enterprise';
  securityAndPrivacy: string;
  accessibilityAndScalability: string;
  dependenciesAndAssumptions: string[];
  risksAndConsequences: string[];
  successMeasurement: string;
  scoreBreakdown: {
    effectiveness: number;
    userValue: number;
    feasibility: number;
    maintainability: number;
    riskScore: number;
  };
}

export interface TraceabilityItem {
  id: string;
  rootCauseId: string;
  rootCauseTitle: string;
  mitigation: string;
  websiteFeature: string;
  implementationFiles: string[];
  verificationTest: string;
  outcomeMetric: string;
  status: 'mapped' | 'implemented' | 'verified';
}

export interface RequirementsDesign {
  functionalRequirements: Array<{
    id: string;
    priority: 'MVP' | 'P1' | 'P2';
    title: string;
    description: string;
    acceptanceCriteria: string[];
  }>;
  nonFunctionalRequirements: Array<{
    id: string;
    category: string;
    target: string;
  }>;
  userPersonas: Array<{
    name: string;
    role: string;
    painPoints: string[];
    goals: string[];
  }>;
  userJourneys: Array<{
    persona: string;
    steps: string[];
    happyPath: string;
    recoveryFlow: string;
  }>;
  pageAndRouteMap: Array<{
    path: string;
    name: string;
    purpose: string;
    components: string[];
  }>;
  databaseSchema: Array<{
    table: string;
    fields: Array<{ name: string; type: string; constraints: string }>;
    relationships: string;
  }>;
  apiContracts: Array<{
    method: string;
    endpoint: string;
    description: string;
    requestBody?: any;
    responseBody: any;
    auth: string;
  }>;
}

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'identified' | 'mitigated' | 'fixed' | 'verified' | 'accepted' | 'blocked' | 'untested';

export interface RiskItem {
  id: string;
  affectedFeature: string;
  category: 'input_boundary' | 'concurrency' | 'network_timeout' | 'auth_security' | 'data_integrity' | 'accessibility' | 'scalability' | 'external_dependency';
  description: string;
  evidenceOrReason: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  severity: RiskSeverity;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  mitigation: string;
  associatedTestId: string;
  status: RiskStatus;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  purpose: string;
  isModified?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  code: string;
  status: 'passed' | 'failed' | 'skipped' | 'blocked' | 'untested';
  errorTrace?: string;
  durationMs?: number;
  mappedRequirementId?: string;
  mappedRiskId?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'contract' | 'accessibility' | 'security_boundary';
  tests: TestCase[];
}

export interface RepairRecord {
  id: string;
  timestamp: string;
  detectedFailure: string;
  rootCauseIdentified: string;
  filePath: string;
  patchDiff: string;
  rerunStatus: 'passed' | 'failed';
  regressionCheck: string;
}

export interface ProjectState {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStage: number;
  status: 'draft' | 'analyzing' | 'generating' | 'testing' | 'repairing' | 'completed' | 'error';
  mode: 'mode_a_new_product' | 'mode_b_repo_doctor';
  input: ProjectInput;
  problemBrief?: ProblemBrief;
  rootCauses?: RootCause[];
  evidenceAndAssumptions?: EvidenceAssumptionItem[];
  solutionOptions?: SolutionOption[];
  recommendedSolutionId?: string;
  recommendationRationale?: string;
  traceability?: TraceabilityItem[];
  requirements?: RequirementsDesign;
  riskRegister?: RiskItem[];
  architecture?: {
    overview: string;
    techStack: {
      frontend: string;
      backend: string;
      database: string;
      validation: string;
      testing: string;
    };
    rationale: string;
    alternativesConsidered: string;
  };
  generatedFiles?: GeneratedFile[];
  testSuites?: TestSuite[];
  repairHistory?: RepairRecord[];
  previewUrl?: string;
  unresolvedLimitations?: string[];
  executionLogs: Array<{ timestamp: string; stage: string; message: string; type: 'info' | 'warn' | 'error' | 'success' }>;
  versionHistory: Array<{ version: number; timestamp: string; summary: string }>;
}

export interface RepoDoctorInput {
  repoUrl: string;
  issueTitle: string;
  issueDescription: string;
  issueNumber?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  reproductionSteps?: string;
  logsOrStackTrace?: string;
  targetBranch?: string;
}

export interface RepoDoctorState {
  id: string;
  input: RepoDoctorInput;
  createdAt: string;
  updatedAt: string;
  currentPhase: number;
  status: 'cloning' | 'analyzing' | 'diagnosing' | 'implementing' | 'verifying' | 'reviewing' | 'completed' | 'error';
  architecturalMap: {
    repoName: string;
    defaultBranch: string;
    totalFiles: number;
    languages: string[];
    mainModules: Array<{ name: string; path: string; responsibility: string; dependencies: string[] }>;
    entryPoints: string[];
    testFrameworks: string[];
    conventions: string;
  };
  rootCauseDiagnosis: {
    summary: string;
    mechanism: string;
    relevantFiles: string[];
    executionFlow: string[];
    evidence: string;
    status: 'confirmed' | 'strongly_supported' | 'hypothesis';
    simplerExplanationsRuledOut: string;
    earliestFailurePoint: string;
  };
  fixStrategy: {
    proposedFix: string;
    whyAddressesRootCause: string;
    alternativesConsidered: string[];
    affectedInterfaces: string;
    backwardCompatibility: string;
    regressionRisks: string;
  };
  patch: {
    branchName: string;
    modifiedFiles: Array<{ path: string; oldContent: string; newContent: string; diff: string }>;
    commitMessage: string;
    pullRequestTitle: string;
    pullRequestBody: string;
  };
  testVerification: {
    reproductionTest: { name: string; beforeResult: string; afterResult: string };
    executedChecks: Array<{ command: string; status: 'passed' | 'failed' | 'skipped' | 'blocked'; output: string; durationMs: number }>;
    unverifiedAreas: string[];
  };
  secondPassReview: {
    securityCheck: { status: 'pass' | 'warning'; notes: string };
    architecturalFit: { status: 'pass' | 'warning'; notes: string };
    maintainability: { status: 'pass' | 'warning'; notes: string };
    remainingConcerns: string[];
  };
  openSourceContribution: {
    rootCauseReport: string;
    fixSummary: string;
    testReport: string;
    readableDiff: string;
    commitMessage: string;
    pullRequestDescription: string;
    reviewChecklist: Array<{ item: string; checked: boolean }>;
    requiresApproval: boolean;
    submittedToGitHub: boolean;
  };
  executionLogs: Array<{ timestamp: string; phase: string; message: string; type: 'info' | 'warn' | 'error' | 'success' }>;
}
