# Problem2Product AI (v2.0)
> **Autonomous Problem Investigation, Architecture Synthesis, Multi-File Code Generation, Self-Repair & Open-Source Repository Doctor**

Problem2Product AI is a complete, dual-pillar engineering platform built to transform messy, real-world human problem statements into verified software applications, and autonomously diagnose, repair, and prepare pull requests for existing open-source codebases.

Unlike conventional chatbots, static landing page generators, or simple code-snippet generators, Problem2Product AI operates on the fundamental principle that **engineering starts with root-cause discovery, rigorous trade-off evaluation, and verifiable testing—not just UI aesthetics**.

---

## 🌟 Dual Operational Modes

### Mode A: Build a New Solution (Problem2Product Core)
Accepts any real-world problem statement in plain human language (e.g., *"Students struggle to find reliable teammates for college projects because they do not know who has the necessary skills, interests, or availability"*).
- **15-Stage Observable Pipeline**: From problem synthesis to 5 Whys decomposition, trade-off matrix evaluation, multi-file code generation, automated test verification, and targeted self-repair.
- **Root-Cause-to-Feature Traceability**: Guarantees that every diagnosed root cause maps directly to a mitigation, a tangible feature, implementation files, verification tests, and measurable outcome metrics.
- **Responsive Live Sandbox**: Live iframe rendering of the generated application with instant device switcher (Desktop, Tablet, Mobile) and interactive state.
- **Automated Self-Repair**: Detects failing assertions (e.g., schedule overlap flaws), synthesizes targeted unified diffs, applies the patch, and validates 0 regressions.
- **18-Section Master Project Report**: Transparent report with explicit disclaimers, known limitations, and budget telemetry.

### Mode B: Fix an Existing Repository (AI Repository Doctor)
Accepts a GitHub repository URL and an issue report / bug description.
- **Phase 1: Deep Codebase Understanding**: Scans AST structure, dependencies, module responsibilities, entry points, and test conventions.
- **Phase 2: Root-Cause Investigation**: Traces data and control execution flow, locates the earliest meaningful failure point, and evaluates evidence against competing hypotheses.
- **Phase 3: Fix Strategy & Trade-offs**: Evaluates alternative approaches, assesses backward compatibility, and formulates a minimal targeted patch plan.
- **Phase 4: Safe Implementation**: Applies the patch on an isolated working branch with clean unified git diffs.
- **Phase 5: Verification Testing**: Proves fix correctness using reproduction tests (failing on buggy code, passing on patched code).
- **Phase 6: Second-Pass Review**: Adversary audit for security, maintainability, and code style.
- **Phase 7: Open-Source Contribution Mode**: Generates conventional commit messages, GitHub PR description, review checklist, and provides an **Explicit User Approval Gate** before remote submission.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Fast, type-safe, component-driven UI with instant HMR |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive, glassmorphism design system tailored for engineering workspaces |
| **Backend** | Node.js, Express, TypeScript | Modular REST API and static preview server with async pipeline dispatcher |
| **AI Integration** | Provider Abstraction (Gemini / OpenAI / Domain Engine) | Seamlessly supports Gemini 2.0 Flash/Pro, OpenAI GPT-4o, or the built-in offline High-Fidelity Domain Intelligence Engine |
| **Persistence** | File-backed atomic JSON store | Zero-overhead, revision-tracked storage for projects, repos, and stage checkpoints |
| **Execution Sandbox** | Isolated Node runner & iframe sandbox | Secure evaluation of untrusted generated code with DOMPurify sanitization |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ (tested on Node v25)
- **npm** v9+

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm run install:all
```
*(Or run `npm install` in the root, `server/`, and `client/` directories.)*

### 2. Launch Dev Servers
Start both the Express backend (`http://localhost:3001`) and the Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

### 3. Production Build
To validate TypeScript types and build optimized production bundles for both client and server:
```bash
npm run build
```

---

## 📋 The 15-Stage Pipeline Breakdown

1. **Problem Understanding**: Synthesizes the raw prompt into an objective problem brief with measurable success criteria.
2. **Root-Cause Analysis**: Applies 5 Whys and Ishikawa Fishbone categories (Process, People, Technology, Information, Policy, Environment).
3. **Evidence & Assumptions**: Classifies items into Verified Facts, User Reports, Inferred Models, and Unverified Hypotheses.
4. **Solution Generation & Comparison**: Compares 3 genuinely different architectural approaches across 12 dimensions.
5. **Root-Cause-to-Feature Traceability**: Creates strict 1:1 mappings from cause to code and tests.
6. **Requirements & Product Design**: Generates prioritized functional requirements (MVP/P1/P2), NFRs, user personas, journeys, route map, database schemas, and API contracts.
7. **Risk & Edge-Case Discovery**: Populates a filterable Risk Register spanning boundaries, concurrency, XSS, and accessibility.
8. **Architecture & Stack Selection**: Selects and justifies frameworks, data stores, and validation boundaries.
9. **Implementation Planning**: Deconstructs work into targeted modules.
10. **Real Code Generation**: Emits complete, runnable application files (`public/index.html`, `src/services/matchingService.js`, `src/server.js`, `tests/matching.test.js`, `README.md`).
11. **Automated Testing**: Executes assertions and evaluates real statuses (`passed`, `failed`, `skipped`).
12. **Failure Diagnosis**: Isolates root triggers when assertions fail.
13. **Targeted Code Repair**: Applies minimal unified diffs directly to the affected files.
14. **Regression Testing**: Reruns the test suite to verify 0 regressions.
15. **Final Review & Reporting**: Compiles an 18-section exportable master verification report.

---

## 🛡️ "No Claim of Perfection" Principle

In accordance with strict engineering standards, Problem2Product AI **never** claims that an application is "100% bug-free", "completely secure", or "guaranteed to solve every real-world problem".
- All findings are evidence-based.
- Known limitations, untested distributed environments, and unresolved risks are explicitly disclosed in the final report.
- The platform operates as a continuous discovery and improvement system.

---

## 🔒 Security & User Control Guardrails
- **Credential Safety**: API keys are held server-side in memory and never exposed in client bundles or prompts.
- **Untrusted Input**: User bios and external inputs are sanitized against XSS attacks.
- **Approval Checkpoint**: No remote branch is pushed or pull request opened without explicit user authorization via the **User Approval Gate**.

---

## 📄 License
MIT License. Built for rigorous software engineering and open-source contributions.
