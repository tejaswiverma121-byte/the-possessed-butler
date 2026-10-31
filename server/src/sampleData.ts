import { ProjectState, RepoDoctorState } from './types.js';
import { SAMPLE_REQUIREMENTS, SAMPLE_ARCHITECTURE, SAMPLE_GENERATED_FILES } from './generatedCodeSample.js';

export const SAMPLE_PROJECT: ProjectState = {
  id: 'proj-college-teammates',
  title: 'College Teammate Matchmaker (SynergyTeam AI)',
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  currentStage: 15,
  status: 'completed',
  mode: 'mode_a_new_product',
  requirements: SAMPLE_REQUIREMENTS,
  architecture: SAMPLE_ARCHITECTURE,
  generatedFiles: SAMPLE_GENERATED_FILES,
  input: {
    title: 'College Project Teammate Compatibility Engine',
    problemStatement: 'Students struggle to find reliable teammates for college projects because they do not know who has the necessary skills, interests, or availability.',
    targetUsers: 'College undergraduates, capstone course teams, faculty coordinators',
    existingSolutions: 'Ad-hoc WhatsApp/Discord group chats, awkward in-class cold pitches, instructor random team generator',
    constraints: 'Must work on mobile and desktop without requiring complex institutional IT integration',
    preferences: 'Modern responsive web app with interactive availability heatmap and live match scoring'
  },
  problemBrief: {
    whatIsHappening: 'Students experience acute friction forming teams for academic capstone projects, resulting in mismatched competencies, schedule conflicts, ghosting, and academic penalties.',
    whoIsAffected: 'Undergraduate and graduate students, capstone instructors, and teaching assistants.',
    frequencyAndImpact: 'Occurs 2-4 times each academic year for over 20 million college students globally. 40%+ of student teams report dysfunctional internal dynamics.',
    currentWorkarounds: 'Unstructured group chats, cold outreach, or random instructor assignments that neglect skills and schedules.',
    whyExistingFails: 'Informal chats lack structured skill validation, schedule overlap visibility, or commitment contracts.',
    successCriteria: [
      { id: 'sc-1', metric: 'Verified Skill Complementarity', target: '> 85% match rate', evaluationMethod: 'Algorithmic skill vector overlap' },
      { id: 'sc-2', metric: 'Schedule Conflict Prevention', target: '0 conflicting time-slot matches', evaluationMethod: 'Automated weekly calendar block validation' },
      { id: 'sc-3', metric: 'Team Formation Cycle Time', target: '< 48 hours to lock team', evaluationMethod: 'User workflow benchmark measurement' },
      { id: 'sc-4', metric: 'Equitable Accountability', target: '> 90% positive team review', evaluationMethod: 'Post-milestone peer feedback index' }
    ],
    knownFacts: [
      'Students rarely know the technical skill proficiencies of peers outside their immediate friend circle.',
      'Course schedule and part-time job clashes are the most common reason for missed milestone deadlines.'
    ],
    assumptions: [
      'Students will spend 2 minutes configuring their weekly availability blocks if it prevents a bad team experience.',
      'Transparent grade ambition (A vs Pass) aligns team work ethic upfront.'
    ],
    hypotheses: [
      'Algorithmic skill + availability matching reduces team dissolution rates by > 50%.'
    ]
  },
  rootCauses: [
    {
      id: 'rc-1',
      title: 'Information Asymmetry in Skill & Track-Record Verification',
      explanation: 'Students have no reliable way to verify what peers are actually capable of building or committing to code deliverables.',
      fiveWhys: [
        'Why do teams fail? Because members cannot execute their assigned roles.',
        'Why were they assigned those roles? Because teammates claimed proficiency during quick chat introductions.',
        'Why did teammates overestimate or claim skills? Because there is no standardized, lightweight skill proof.',
        'Why is there no proof? Academic rosters only list names and emails without portfolio or competency history.',
        'Root Cause: Absence of verified capability signaling and public peer competency records.'
      ],
      category: 'information',
      evidence: 'Reported by 78% of students in project debrief surveys who cited "unequal contribution" as the primary grievance.',
      epistemicStatus: 'inferred',
      mechanism: 'Asymmetric information causes adverse selection; students pick friends rather than complementary skill holders.',
      affectedWorkflows: ['Teammate Discovery', 'Role Delegation', 'Milestone Execution'],
      unresolvedConsequence: 'Repeated project abandonment and grade penalties for diligent students.',
      validationMethod: 'A/B test team formation using verified GitHub/portfolio badges vs self-reported claims.',
      confidenceLevel: 88,
      confidenceExplanation: 'Strong empirical correlation in academic team research on adverse selection in peer groups.',
      neededForConfidence: 'Longitudinal telemetry from university capstone semesters.'
    },
    {
      id: 'rc-2',
      title: 'Schedule Incompatibility and Latent Availability Clashes',
      explanation: 'Students select teammates who share project passion but fail because conflicting course schedules and work shifts prevent synchronized collaboration.',
      fiveWhys: [
        'Why do project meetings get cancelled? Because at least one member cannot attend.',
        'Why cannot they attend? Because their work shift or other classes overlap with the group time.',
        'Why was this not caught earlier? Because students only discussed topic interests, not weekly calendar blocks.',
        'Why did not they check schedules? There is no shared calendar overlap calculator during early discovery.',
        'Root Cause: Total lack of synchronized availability visibility during the matching stage.'
      ],
      category: 'process',
      evidence: 'User reports cite "we could never find time to meet" as the #1 reason for missed project checkpoints.',
      epistemicStatus: 'user_reported',
      mechanism: 'Lack of shared working hours degrades synchronous problem solving and creates resentment.',
      affectedWorkflows: ['Meeting Scheduling', 'Pair Programming', 'Submission Deadlines'],
      unresolvedConsequence: 'Last-minute cramming, fragmented integration, and incomplete project features.',
      validationMethod: 'Automated time-slot intersection verification during matchmaking.',
      confidenceLevel: 92,
      confidenceExplanation: 'Direct user feedback consistently points to schedule clashes as an objective blocker.',
      neededForConfidence: 'Calendar sync telemetry across student groups.'
    },
    {
      id: 'rc-3',
      title: 'Absence of Upfront Social Contract & Milestone Accountability',
      explanation: 'Teams form with unspoken assumptions about target grades (e.g. "I just want to pass" vs "I need an A for grad school"), creating friction.',
      fiveWhys: [
        'Why do team members ghost halfway through? Because their motivation drops once basic requirements are met.',
        'Why is their motivation lower than the lead? Because their personal grade targets and priorities differ.',
        'Why was not this aligned upfront? Because students feel awkward discussing ambition and commitment levels.',
        'Why is there no formal framework? Universities do not provide structured team chartering tools.',
        'Root Cause: Zero structured commitment alignment and milestone-based peer contracts at team formation.'
      ],
      category: 'policy',
      evidence: 'Post-mortem reviews consistently show conflict arises from divergent grade expectations (Pass vs A+).',
      epistemicStatus: 'inferred',
      mechanism: 'Divergent personal payoff functions create game-theoretic free-riding and motivation collapse.',
      affectedWorkflows: ['Milestone Review', 'Code Review', 'Final Submission'],
      unresolvedConsequence: 'One student ends up doing 80% of the work while others receive unearned credit.',
      validationMethod: 'Mandatory Team Charter step with explicit commitment level scoring.',
      confidenceLevel: 84,
      confidenceExplanation: 'Well-documented in organizational behavior and cooperative education research.',
      neededForConfidence: 'Comparison of dispute rates between chartered vs unchartered student teams.'
    }
  ],
  evidenceAndAssumptions: [
    {
      id: 'ea-1',
      type: 'verified_fact',
      statement: 'Students in multidisciplinary courses often lack direct social links to peers in complementary majors (e.g. CS students rarely know UI/UX design students).',
      source: 'University course enrollment data and cross-departmental survey.',
      status: 'confirmed'
    },
    {
      id: 'ea-2',
      type: 'user_reported',
      statement: 'Teammates frequently drop out or become unresponsive mid-semester without warning.',
      source: 'User problem description and student forum threads.',
      status: 'confirmed'
    },
    {
      id: 'ea-3',
      type: 'inferred',
      statement: 'Free-rider behavior is enabled when individual contributions cannot be tracked or made visible to peers.',
      source: 'Game theory analysis of group project payoffs.',
      status: 'confirmed'
    },
    {
      id: 'ea-4',
      type: 'hypothesis',
      statement: 'Presenting a compatibility match percentage based on skills, schedule overlap, and commitment rating will reduce group dissolution by > 50%.',
      source: 'Product hypothesis model.',
      status: 'needs_validation'
    },
    {
      id: 'ea-5',
      type: 'unknown',
      statement: 'Will professors actively mandate or endorse an external matchmaking tool as part of syllabus setup?',
      source: 'Faculty interview backlog.',
      status: 'needs_validation'
    }
  ],
  solutionOptions: [
    {
      id: 'sol-1',
      title: 'Algorithmic Skill & Availability Matchmaking Workspace',
      tagline: 'Precision Compatibility Engine with Calendar Overlap and Peer Endorsements',
      overview: 'A focused, interactive web platform where users build verified skill profiles, define weekly availability heatmaps, and specify ambition targets. The system computes a multi-dimensional Compatibility Score and recommends optimal teams.',
      howItWorks: 'Users register with skill tags (e.g., React, Python, UI/UX, Hardware), connect their weekly availability blocks, and specify their project goals. The matching algorithm computes intersection vectors across skills, calendar slots, and commitment levels to suggest synergistic team pairings.',
      addressedRootCauseIds: ['rc-1', 'rc-2', 'rc-3'],
      userBenefits: {
        'Students': 'Find reliable, compatible peers in minutes without awkward cold outreach; zero schedule conflicts.',
        'Project Leads': 'Assemble balanced squads with complementary frontend, backend, and design proficiencies.',
        'Instructors': 'Monitor team formation progress and step in early for students struggling to find groups.'
      },
      requiredFeatures: [
        'User Profiles with verified skill tags and GitHub/portfolio integration',
        'Interactive Weekly Availability Grid / Heatmap with automated clash detection',
        'Intelligent Compatibility Matchmaker with multidimensional scoring (0-100%)',
        'Team Charter Builder to align grade goals and communication cadences',
        'Live Project Board with one-click invite, join request, and approval workflow'
      ],
      advantages: [
        'Directly solves information asymmetry and schedule clash root causes',
        'Empowers students while preserving self-selection autonomy',
        'Lightweight and fast to adopt without complex institutional integration',
        'Measurable success through match rate and schedule conflict prevention'
      ],
      disadvantages: [
        'Requires students to spend 2-3 minutes configuring their schedule and skill tags',
        'Relies on honest initial self-assessment until peer endorsements accumulate'
      ],
      complexity: 'medium',
      estimatedEffort: '2-3 weeks for production MVP',
      relativeCost: 'minimal',
      securityAndPrivacy: 'Role-based access control, sanitized student inputs, FERPA-compliant anonymized views for non-team members.',
      accessibilityAndScalability: 'WCAG 2.2 AA compliant, full keyboard navigation, mobile-responsive layout, sub-50ms vector matching calculation.',
      dependenciesAndAssumptions: ['Assumes students will input their availability honestly', 'Modern web browser with responsive layout'],
      risksAndConsequences: ['Potential popularity bias towards top-scoring students; mitigated via balanced skill distribution cap.'],
      successMeasurement: 'Compatibility match rate > 85%, 0 reported schedule clashes, team lock time < 48 hours.',
      scoreBreakdown: {
        effectiveness: 9.2,
        userValue: 9.5,
        feasibility: 9.0,
        maintainability: 8.8,
        riskScore: 2.1
      }
    },
    {
      id: 'sol-2',
      title: 'Centralized Administrative Team Allocation Portal',
      tagline: 'Instructor-Driven Optimization based on Roster Survey Imports',
      overview: 'A portal where instructors upload class rosters and project topics, and an administrative solver assigns students algorithmically into balanced teams.',
      howItWorks: 'Instructors create constraints; an optimization engine clusters students mathematically into groups without student self-directed search.',
      addressedRootCauseIds: ['rc-1', 'rc-2'],
      userBenefits: {
        'Instructors': 'Guaranteed 100% team formation without unassigned stragglers.',
        'Students': 'Zero effort required to search for teammates.'
      },
      requiredFeatures: ['CSV Roster Parser', 'Hungarian matching algorithm', 'Instructor override console'],
      advantages: ['Ensures every single student is placed', 'Fast administrative execution'],
      disadvantages: [
        'Removes student autonomy; students resist forced team assignments',
        'Higher friction getting professors to adopt and upload roster data',
        'Does not foster organic collaboration culture'
      ],
      complexity: 'high',
      estimatedEffort: '4-5 weeks with SIS integrations',
      relativeCost: 'moderate',
      securityAndPrivacy: 'High student data protection requirements due to institutional roster handling.',
      accessibilityAndScalability: 'Requires batch solver execution; lower real-time responsiveness.',
      dependenciesAndAssumptions: ['Requires official professor buy-in and roster exports'],
      risksAndConsequences: ['High student dissatisfaction and resentment over perceived unfair assignments.'],
      successMeasurement: '100% assignment rate, but lower student satisfaction scores.',
      scoreBreakdown: {
        effectiveness: 6.8,
        userValue: 5.5,
        feasibility: 6.5,
        maintainability: 7.0,
        riskScore: 5.8
      }
    },
    {
      id: 'sol-3',
      title: 'Informal Social Directory & Chat Forum',
      tagline: 'Passive Classifieds Board for Student Project Ads',
      overview: 'A digital bulletin board where students post classified ads seeking teammates with open commenting and private messaging.',
      howItWorks: 'Students publish "Looking for Teammates" cards; interested peers leave comments or direct messages.',
      addressedRootCauseIds: ['rc-1'],
      userBenefits: {
        'Students': 'Low barrier to post a project idea and browse open listings.'
      },
      requiredFeatures: ['Post Board', 'Tag Filters', 'Direct Messaging'],
      advantages: ['Simplest to build and launch immediately'],
      disadvantages: [
        'Fails to solve schedule clashes or information asymmetry',
        'Suffers from same ghosting and unverified claims as WhatsApp/Discord groups',
        'No automated compatibility scoring or accountability mechanisms'
      ],
      complexity: 'low',
      estimatedEffort: '1 week',
      relativeCost: 'minimal',
      securityAndPrivacy: 'Spam and moderation overhead on public message boards.',
      accessibilityAndScalability: 'Simple database lookups.',
      dependenciesAndAssumptions: ['Requires high organic community traffic'],
      risksAndConsequences: ['Board becomes inactive or cluttered with unfulfilled requests.'],
      successMeasurement: 'Number of posts created, but low conversion to successful project delivery.',
      scoreBreakdown: {
        effectiveness: 4.2,
        userValue: 4.8,
        feasibility: 9.5,
        maintainability: 8.0,
        riskScore: 6.5
      }
    }
  ],
  recommendedSolutionId: 'sol-1',
  recommendationRationale: 'Solution 1 (Algorithmic Skill & Availability Matchmaking Workspace) directly targets all 3 systemic root causes (information asymmetry, schedule clashes, and lack of accountability contracts) while preserving student autonomy and requiring zero bureaucratic instructor overhead.',
  traceability: [
    {
      id: 'tr-1',
      rootCauseId: 'rc-1',
      rootCauseTitle: 'Information Asymmetry in Skill Verification',
      mitigation: 'Structured profile with competency badges, verified GitHub/portfolio links, and domain tags',
      websiteFeature: 'Verified User Profiles & Skill Tag Matrix',
      implementationFiles: ['public/index.html', 'src/services/matchingService.js'],
      verificationTest: 'test_skill_complementarity_scoring',
      outcomeMetric: '> 85% skill complementarity match rate',
      status: 'verified'
    },
    {
      id: 'tr-2',
      rootCauseId: 'rc-2',
      rootCauseTitle: 'Schedule Incompatibility and Latent Availability Clashes',
      mitigation: 'Interactive weekly calendar block heatmap and automated schedule overlap intersection calculator',
      websiteFeature: 'Interactive Availability Heatmap & Clash Detector',
      implementationFiles: ['public/index.html', 'src/services/matchingService.js'],
      verificationTest: 'test_schedule_overlap_rejection',
      outcomeMetric: '0 conflicting schedule matches proposed to user',
      status: 'verified'
    },
    {
      id: 'tr-3',
      rootCauseId: 'rc-3',
      rootCauseTitle: 'Absence of Upfront Social Contract & Milestone Accountability',
      mitigation: 'Interactive Team Charter step with goal alignment (Grade target: A/B/P, hours/week commitment)',
      websiteFeature: 'Team Charter & Commitment Alignment Modal',
      implementationFiles: ['public/index.html'],
      verificationTest: 'test_commitment_alignment_check',
      outcomeMetric: '> 90% positive milestone peer reviews',
      status: 'verified'
    }
  ],
  riskRegister: [
    {
      id: 'RSK-001',
      affectedFeature: 'Matchmaking Engine',
      category: 'input_boundary',
      description: 'Candidate submits empty skill tags or empty availability calendar, leading to NaN score or divide-by-zero errors in matching algorithm.',
      evidenceOrReason: 'Common edge case during onboarding when students skip optional steps.',
      likelihood: 'high',
      impact: 'medium',
      severity: 'medium',
      priority: 'P1',
      mitigation: 'Enforce minimum 1 skill tag and default to flexible availability baseline with defensive fallbacks.',
      associatedTestId: 'test_empty_profile_boundary',
      status: 'verified'
    },
    {
      id: 'RSK-002',
      affectedFeature: 'Schedule Conflict Detector',
      category: 'concurrency',
      description: 'Candidate matches high on skill keywords but has strictly 0 overlapping hours due to opposite work/class shifts.',
      evidenceOrReason: 'Users in survey cited inability to schedule synchronized group meetings.',
      likelihood: 'high',
      impact: 'critical',
      severity: 'critical',
      priority: 'P0',
      mitigation: 'Hard reject matches with 0 common available time blocks; penalize score heavily if < 3 hours overlap. (Repaired: strict schedule clash rejection added)',
      associatedTestId: 'test_schedule_overlap_rejection',
      status: 'verified'
    },
    {
      id: 'RSK-003',
      affectedFeature: 'Squad Capacity & Invites',
      category: 'concurrency',
      description: 'Multiple team members invite different candidates simultaneously, exceeding the maximum 4-member squad limit.',
      evidenceOrReason: 'Race conditions during simultaneous acceptance.',
      likelihood: 'medium',
      impact: 'high',
      severity: 'high',
      priority: 'P1',
      mitigation: 'Atomic database transaction and lock check before accepting invites.',
      associatedTestId: 'test_squad_capacity_overflow',
      status: 'verified'
    },
    {
      id: 'RSK-004',
      affectedFeature: 'Security & Privacy',
      category: 'auth_security',
      description: 'Malicious user submits XSS script payload in portfolio link or bio text to steal session cookies of classmates.',
      evidenceOrReason: 'Untrusted user input vector in public student profiles.',
      likelihood: 'medium',
      impact: 'critical',
      severity: 'critical',
      priority: 'P0',
      mitigation: 'DOMPurify sanitization and strict URL protocol validation (only https:// permitted).',
      associatedTestId: 'test_xss_sanitization_in_bio',
      status: 'verified'
    },
    {
      id: 'RSK-005',
      affectedFeature: 'Mobile Layout & Accessibility',
      category: 'accessibility',
      description: 'Weekly availability grid unusable on touch screens or screen readers without keyboard trap prevention.',
      evidenceOrReason: 'Complex 2D grid components often fail mobile touch and WCAG focus traversal.',
      likelihood: 'medium',
      impact: 'medium',
      severity: 'medium',
      priority: 'P2',
      mitigation: 'Accessible button toggles with ARIA labels and touch-friendly 44x44px target tap zones.',
      associatedTestId: 'test_accessibility_keyboard_navigation',
      status: 'verified'
    }
  ],
  testSuites: [
    {
      id: 'ts-1',
      name: 'Matching Algorithm & Synergy Verification',
      type: 'unit',
      tests: [
        {
          id: 'test_skill_complementarity_scoring',
          name: 'Skill Complementarity Scoring',
          code: 'test_skill_complementarity_scoring();',
          status: 'passed',
          durationMs: 14,
          mappedRequirementId: 'FR-3',
          mappedRiskId: 'RSK-001'
        },
        {
          id: 'test_schedule_overlap_rejection',
          name: 'Zero Schedule Overlap Rejection Verification',
          code: 'test_schedule_overlap_rejection();',
          status: 'passed',
          durationMs: 12,
          mappedRequirementId: 'FR-2',
          mappedRiskId: 'RSK-002'
        },
        {
          id: 'test_empty_profile_boundary',
          name: 'Empty Profile Boundary Robustness',
          code: 'test_empty_profile_boundary();',
          status: 'passed',
          durationMs: 11,
          mappedRequirementId: 'FR-1',
          mappedRiskId: 'RSK-001'
        }
      ]
    },
    {
      id: 'ts-2',
      name: 'Security & Sanitization Boundaries',
      type: 'security_boundary',
      tests: [
        {
          id: 'test_xss_sanitization_in_bio',
          name: 'Bio & Portfolio XSS Sanitization Check',
          code: 'expectSanitized("<script>alert(1)</script>").toBeSafe()',
          status: 'passed',
          durationMs: 8,
          mappedRequirementId: 'NFR-3',
          mappedRiskId: 'RSK-004'
        }
      ]
    }
  ],
  repairHistory: [
    {
      id: 'repair-1730384',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      detectedFailure: 'Schedule collision test failed: AssertionError: Expected matching score to reject overlapping project schedules (conflict detected: 14:00-16:00 UTC).',
      rootCauseIdentified: 'Matching algorithm assumed all candidate students were available 24/7 without comparing time-slot overlap arrays.',
      filePath: 'src/services/matchingService.js',
      patchDiff: `--- a/src/services/matchingService.js
+++ b/src/services/matchingService.js
@@ -74,6 +74,18 @@
+  // Added schedule conflict validation (Fixes: schedule clash overlap defect)
+  if (candidate.availability && user.availability) {
+    const hasOverlap = candidate.availability.some((slot) =>
+      user.availability.includes(slot)
+    );
+    if (!hasOverlap) {
+      return { match: false, score: 0, reason: 'Zero schedule availability overlap' };
+    }
+  }
   return calculateCompatibilityScore(user, candidate);`,
      rerunStatus: 'passed',
      regressionCheck: 'Re-executed matching test suite; all 4 tests passed, 0 regressions detected in baseline scoring.'
    }
  ],
  unresolvedLimitations: [
    "Real-world peer reliability still requires long-term classroom telemetry; algorithms can verify skills and schedules but cannot completely predict emotional interpersonal chemistry.",
    "Requires institutional integration with campus authentication (Canvas / Blackboard / Google Workspace) for zero-friction student verification in large colleges.",
    "Mobile screen orientation on small phones (under 360px width) may require horizontal scrolling for dense 7-day schedule matrix views."
  ],
  previewUrl: '/api/preview/proj-college-teammates',
  executionLogs: [
    { timestamp: new Date(Date.now() - 3500000).toISOString(), stage: 'Stage 1: Problem Understanding', message: 'Synthesized problem brief and verified success criteria.', type: 'success' },
    { timestamp: new Date(Date.now() - 3200000).toISOString(), stage: 'Stage 2: Root-Cause Analysis', message: 'Decomposed 3 systemic root causes via 5 Whys and Fishbone model.', type: 'success' },
    { timestamp: new Date(Date.now() - 2800000).toISOString(), stage: 'Stage 4: Solution Generation', message: 'Compared 3 architectural approaches. Selected Algorithmic Matchmaking Workspace.', type: 'success' },
    { timestamp: new Date(Date.now() - 2200000).toISOString(), stage: 'Stage 10: Real Code Generation', message: 'Generated 5 runnable application files and interactive preview sandbox.', type: 'success' },
    { timestamp: new Date(Date.now() - 1900000).toISOString(), stage: 'Stage 11: Automated Testing', message: 'Executed tests; detected schedule overlap flaw (RSK-002).', type: 'warn' },
    { timestamp: new Date(Date.now() - 1800000).toISOString(), stage: 'Stage 13: Targeted Code Repair', message: 'Diagnosed failure root cause and applied targeted patch to matchingService.js.', type: 'success' },
    { timestamp: new Date(Date.now() - 1700000).toISOString(), stage: 'Stage 14: Regression Testing', message: 'All checks passed; 0 regressions detected.', type: 'success' },
    { timestamp: new Date(Date.now() - 1600000).toISOString(), stage: 'Stage 15: Final Review', message: 'Final report prepared with honest limitations. Ready for user preview.', type: 'success' }
  ],
  versionHistory: [
    { version: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), summary: 'Initial submission of College Teammate Problem' },
    { version: 2, timestamp: new Date(Date.now() - 1800000).toISOString(), summary: 'Auto-repair: schedule conflict overlap validation patch' }
  ]
};

export const SAMPLE_REPO_INVESTIGATION: RepoDoctorState = {
  id: 'repo-express-cache-bug',
  input: {
    repoUrl: 'https://github.com/expressjs/express',
    issueTitle: 'Stale query cache read after entity mutation in storage layer',
    issueDescription: 'When updating an entity status via PUT /item/:id, subsequent filtered queries like GET /items?status=active still return the old cached entity state for several minutes, causing data inconsistency across clients.',
    issueNumber: '4982',
    expectedBehavior: 'Mutating an entity should immediately invalidate all cached query results that contain or match that entity.',
    actualBehavior: 'Only the direct key entity:id is purged from cache, leaving composite query keys like query:status=active stale.',
    reproductionSteps: '1. GET /items?status=active -> Cached with item-1\n2. PUT /items/item-1 with status=archived\n3. GET /items?status=active -> Returns item-1 (STALE)',
    targetBranch: 'master'
  },
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date().toISOString(),
  currentPhase: 7,
  status: 'completed',
  architecturalMap: {
    repoName: 'expressjs/express',
    defaultBranch: 'master',
    totalFiles: 215,
    languages: ['JavaScript (88%)', 'TypeScript (10%)', 'Markdown (2%)'],
    mainModules: [
      { name: 'Router & Middleware', path: 'lib/router/', responsibility: 'Route matching, stack traversal, next() error propagation', dependencies: ['methods', 'path-to-regexp'] },
      { name: 'Application Core', path: 'lib/application.js', responsibility: 'App configuration, server binding, lifecycle hooks', dependencies: ['events', 'http'] },
      { name: 'Request & Response', path: 'lib/request.js', responsibility: 'Header negotiation, cookie parsing, content-type handling', dependencies: ['mime-types'] },
      { name: 'Test Fixtures', path: 'test/', responsibility: 'Mocha / Supertest integration test suite', dependencies: ['supertest', 'mocha'] }
    ],
    entryPoints: ['index.js', 'lib/express.js'],
    testFrameworks: ['Mocha 10.2', 'Supertest 6.3'],
    conventions: 'Standard JS style, 2-space indentation, strict error callback propagation.'
  },
  rootCauseDiagnosis: {
    summary: 'Stale query cache read defect: Cache invalidation only purges exact primary keys while ignoring secondary composite query keys.',
    mechanism: '`QueryCache.invalidate(entityId)` only deleted the primary key from the map. It lacked a secondary index of entity-to-query associations, leaving filtered query results cached indefinitely until TTL expiration.',
    relevantFiles: ['lib/storage/queryCache.js', 'lib/router/route.js'],
    executionFlow: [
      '1. Client triggers PUT /items/item-1.',
      '2. Route handler updates database record.',
      '3. Handler invokes cache.invalidate("item-1").',
      '4. Primary key "item-1" is deleted.',
      '5. Composite query key "query:status=active" remains cached in map.',
      '6. Subsequent GET /items?status=active serves stale cached data.'
    ],
    evidence: 'Reproduction test in test/queryCache.test.js demonstrated query:status=active still returned item-1 after invalidate("item-1").',
    status: 'confirmed',
    simplerExplanationsRuledOut: 'Ruled out database lag because direct database SELECT confirmed status was updated in 4ms.',
    earliestFailurePoint: 'lib/storage/queryCache.js:Line 28 in QueryCache.prototype.invalidate'
  },
  fixStrategy: {
    proposedFix: 'Implement a secondary index `entityIndex` (Map of Set<string>) that tracks which composite query cache keys contain each entity, and purge all registered query keys on invalidate(entityId).',
    whyAddressesRootCause: 'Guarantees O(1) targeted invalidation of all related query cache permutations the instant an entity is modified.',
    alternativesConsidered: [
      'Alternative 1: Invalidate the entire cache on any write. (Rejected: destroys cache hit-rate in write-heavy systems)',
      'Alternative 2: Reduce TTL to 1 second. (Rejected: introduces latency and does not guarantee strict consistency)'
    ],
    affectedInterfaces: 'Internal query cache methods only; 100% backward compatible with existing public API.',
    backwardCompatibility: 'All public method signatures preserved; no breaking changes.',
    regressionRisks: 'Negligible memory increase for secondary index map.'
  },
  patch: {
    branchName: 'fix/query-cache-secondary-invalidation',
    modifiedFiles: [
      {
        path: 'lib/storage/queryCache.js',
        oldContent: `function QueryCache() {
  this.cache = Object.create(null);
}

QueryCache.prototype.get = function(key) {
  return this.cache[key];
};

QueryCache.prototype.set = function(key, val) {
  this.cache[key] = val;
};

QueryCache.prototype.invalidate = function(entityId) {
  delete this.cache[entityId];
};`,
        newContent: `function QueryCache() {
  this.cache = Object.create(null);
  this.entityIndex = new Map();
}

QueryCache.prototype.get = function(key) {
  return this.cache[key];
};

QueryCache.prototype.set = function(key, val, relatedEntityIds) {
  this.cache[key] = val;
  if (Array.isArray(relatedEntityIds)) {
    for (var i = 0; i < relatedEntityIds.length; i++) {
      var id = relatedEntityIds[i];
      if (!this.entityIndex.has(id)) {
        this.entityIndex.set(id, new Set());
      }
      this.entityIndex.get(id).add(key);
    }
  }
};

QueryCache.prototype.invalidate = function(entityId) {
  delete this.cache[entityId];
  if (this.entityIndex.has(entityId)) {
    var related = this.entityIndex.get(entityId);
    related.forEach(function(key) {
      delete this.cache[key];
    }, this);
    this.entityIndex.delete(entityId);
  }
};`,
        diff: `--- a/lib/storage/queryCache.js
+++ b/lib/storage/queryCache.js
@@ -1,13 +1,28 @@
 function QueryCache() {
   this.cache = Object.create(null);
+  this.entityIndex = new Map();
 }

 QueryCache.prototype.get = function(key) {
   return this.cache[key];
 };

-QueryCache.prototype.set = function(key, val) {
+QueryCache.prototype.set = function(key, val, relatedEntityIds) {
   this.cache[key] = val;
+  if (Array.isArray(relatedEntityIds)) {
+    for (var i = 0; i < relatedEntityIds.length; i++) {
+      var id = relatedEntityIds[i];
+      if (!this.entityIndex.has(id)) {
+        this.entityIndex.set(id, new Set());
+      }
+      this.entityIndex.get(id).add(key);
+    }
+  }
 };

 QueryCache.prototype.invalidate = function(entityId) {
   delete this.cache[entityId];
+  if (this.entityIndex.has(entityId)) {
+    var related = this.entityIndex.get(entityId);
+    related.forEach(function(key) {
+      delete this.cache[key];
+    }, this);
+    this.entityIndex.delete(entityId);
+  }
 };`
      }
    ],
    commitMessage: `fix(storage): purge composite query cache keys on entity invalidation (#4982)

Maintains an entity-to-query index in QueryCache so that filtered query
permutations are invalidated immediately upon entity mutation, preventing
stale reads across clients.`,
    pullRequestTitle: `fix(storage): resolve stale query cache reads via secondary index invalidation`,
    pullRequestBody: `### Problem
Fixes #4982. When mutating an entity, filtered queries (e.g. \`GET /items?status=active\`) continued returning stale cached records until TTL expiration.

### Root Cause
\`QueryCache.prototype.invalidate(entityId)\` only removed the exact primary key \`entityId\` from the cache dictionary, without notifying or clearing composite query entries that referenced the entity.

### Solution
- Added a lightweight \`entityIndex\` mapping entity IDs to associated composite query keys.
- Enhanced \`QueryCache.prototype.set\` to accept related entity identifiers.
- Updated \`invalidate\` to purge all dependent query keys.

### Verification
- Added reproduction test in \`test/queryCache.test.js\`.
- Ran full test suite: 128 tests passing.
- Verified 0 memory leaks in benchmarks.`
  },
  testVerification: {
    reproductionTest: {
      name: 'test/queryCache.test.js: should purge composite query cache on invalidate',
      beforeResult: 'FAILED: expected undefined, got Object { id: "item-1" }',
      afterResult: 'PASSED (duration: 4ms)'
    },
    executedChecks: [
      { command: 'npm test test/queryCache.test.js', status: 'passed', output: '✓ queryCache invalidation (3 tests passed) [12ms]', durationMs: 120 },
      { command: 'npm run test:all', status: 'passed', output: '128 passing (2.4s)', durationMs: 2400 },
      { command: 'npm run lint', status: 'passed', output: 'ESLint: 0 warnings, 0 errors', durationMs: 450 }
    ],
    unverifiedAreas: [
      'Multi-process cluster synchronization not verified in single-node test environment.'
    ]
  },
  secondPassReview: {
    securityCheck: { status: 'pass', notes: 'Zero untrusted evaluation; prototype-safe object instantiation preserved.' },
    architecturalFit: { status: 'pass', notes: 'Preserves traditional prototype syntax and style of codebase.' },
    maintainability: { status: 'pass', notes: 'Simple, reviewable, self-contained change.' },
    remainingConcerns: []
  },
  openSourceContribution: {
    rootCauseReport: 'Confirmed: primary key invalidation omits secondary query associations.',
    fixSummary: 'Added secondary index to QueryCache with automatic compound key purging.',
    testReport: '3/3 test suites passed. 0 regressions.',
    readableDiff: 'Diff validated against master branch.',
    commitMessage: 'fix(storage): purge composite query cache keys on entity invalidation (#4982)',
    pullRequestDescription: 'Ready for GitHub PR submission.',
    reviewChecklist: [
      { item: 'Targeted minimal diff addressing root cause only', checked: true },
      { item: 'Preserves existing project conventions and linting rules', checked: true },
      { item: 'Includes meaningful reproduction test that passes', checked: true },
      { item: 'No regression in existing test suite (128/128 passing)', checked: true },
      { item: 'User authorization required before remote GitHub push', checked: true }
    ],
    requiresApproval: true,
    submittedToGitHub: false
  },
  executionLogs: [
    { timestamp: new Date(Date.now() - 7100000).toISOString(), phase: 'Phase 1: Codebase Understanding', message: 'Analyzed expressjs/express repository structure and storage layer.', type: 'info' },
    { timestamp: new Date(Date.now() - 6500000).toISOString(), phase: 'Phase 2: Root-Cause Investigation', message: 'Reproduced stale cache read. Located earliest failure point in queryCache.js.', type: 'success' },
    { timestamp: new Date(Date.now() - 5800000).toISOString(), phase: 'Phase 3: Fix Strategy', message: 'Selected secondary index strategy over full cache flush.', type: 'info' },
    { timestamp: new Date(Date.now() - 5000000).toISOString(), phase: 'Phase 4: Safe Implementation', message: 'Created isolated working branch and applied targeted patch.', type: 'success' },
    { timestamp: new Date(Date.now() - 4200000).toISOString(), phase: 'Phase 5: Verification Testing', message: 'Reproduction test verified: failed on original, passes on patch.', type: 'success' },
    { timestamp: new Date(Date.now() - 3600000).toISOString(), phase: 'Phase 6: Second-Pass Review', message: 'Independent review passed: 0 security risks.', type: 'success' },
    { timestamp: new Date(Date.now() - 3000000).toISOString(), phase: 'Phase 7: Contribution Bundle', message: 'Open-source PR bundle prepared with approval gate.', type: 'info' }
  ]
};
