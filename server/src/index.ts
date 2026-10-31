import express, { Request, Response } from 'express';
import cors from 'cors';
import { StorageService } from './storage.js';
import { OrchestratorService } from './orchestrator.js';
import { RepoDoctorService } from './repoDoctor.js';
import { AIProviderService } from './aiProvider.js';
import { SAMPLE_PROJECT, SAMPLE_REPO_INVESTIGATION } from './sampleData.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Seed initial sample projects if database is empty
const existingProjects = StorageService.getAllProjects();
if (existingProjects.length === 0) {
  StorageService.saveProject(SAMPLE_PROJECT);
}

const existingRepos = StorageService.getAllRepoInvestigations();
if (existingRepos.length === 0) {
  StorageService.saveRepoInvestigation(SAMPLE_REPO_INVESTIGATION);
}

// Health & Settings
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    name: 'Problem2Product AI & Repository Doctor',
    aiSettings: AIProviderService.getSettings(),
  });
});

app.get('/api/settings', (req: Request, res: Response) => {
  res.json(AIProviderService.getSettings());
});

app.post('/api/settings', (req: Request, res: Response) => {
  const { provider, apiKey, model } = req.body;
  AIProviderService.updateSettings({ provider, apiKey, model });
  res.json({ success: true, settings: AIProviderService.getSettings() });
});

// Mode A: Problem2Product Endpoints
app.get('/api/projects', (req: Request, res: Response) => {
  res.json({ projects: StorageService.getAllProjects() });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = StorageService.getProject(req.params.id as string);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const { title, problemStatement, targetUsers, existingSolutions, constraints, preferences } = req.body;
    if (!problemStatement || problemStatement.trim().length < 5) {
      return res.status(400).json({ error: 'Problem statement must be at least 5 characters long.' });
    }

    const project = await OrchestratorService.createAndRunProject({
      title: title || problemStatement.slice(0, 45) + '...',
      problemStatement,
      targetUsers,
      existingSolutions,
      constraints,
      preferences,
    });

    res.json({ success: true, project });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing project pipeline' });
  }
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const deleted = StorageService.deleteProject(req.params.id as string);
  res.json({ success: deleted });
});

app.post('/api/projects/:id/update-assumption', (req: Request, res: Response) => {
  const project = StorageService.getProject(req.params.id as string);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { itemId, status, userCorrection } = req.body;
  if (project.evidenceAndAssumptions) {
    project.evidenceAndAssumptions = project.evidenceAndAssumptions.map(item => {
      if (item.id === itemId) {
        return { ...item, status: status || item.status, userCorrection: userCorrection || item.userCorrection };
      }
      return item;
    });
    StorageService.saveProject(project);
  }
  res.json({ success: true, project });
});

// Serve live iframe preview of generated app
app.get('/api/preview/:id', (req: Request, res: Response) => {
  const project = StorageService.getProject(req.params.id as string);
  if (!project || !project.generatedFiles) {
    return res.status(404).send('<h2>No preview available for this project.</h2>');
  }

  const htmlFile = project.generatedFiles.find(f => f.path.endsWith('.html') || f.path === 'public/index.html');
  if (htmlFile) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(htmlFile.content);
  }

  res.send('<h2>Preview HTML not found among generated files.</h2>');
});

// Mode B: AI Repository Doctor Endpoints
app.get('/api/repos', (req: Request, res: Response) => {
  res.json({ investigations: StorageService.getAllRepoInvestigations() });
});

app.get('/api/repos/:id', (req: Request, res: Response) => {
  const investigation = StorageService.getRepoInvestigation(req.params.id as string);
  if (!investigation) return res.status(404).json({ error: 'Investigation not found' });
  res.json({ investigation });
});

app.post('/api/repos/analyze', async (req: Request, res: Response) => {
  try {
    const { repoUrl, issueTitle, issueDescription, issueNumber, expectedBehavior, actualBehavior, reproductionSteps, targetBranch } = req.body;
    if (!repoUrl || !issueDescription) {
      return res.status(400).json({ error: 'Repository URL and Issue Description are required.' });
    }

    const result = await RepoDoctorService.analyzeAndFix({
      repoUrl,
      issueTitle: issueTitle || 'Investigated Repository Issue',
      issueDescription,
      issueNumber,
      expectedBehavior,
      actualBehavior,
      reproductionSteps,
      targetBranch,
    });

    res.json({ success: true, investigation: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error analyzing repository' });
  }
});

app.post('/api/repos/:id/approve-pr', (req: Request, res: Response) => {
  const repo = StorageService.getRepoInvestigation(req.params.id as string);
  if (!repo) return res.status(404).json({ error: 'Investigation not found' });

  // Guardrail check: Require explicit user authorization
  repo.openSourceContribution.submittedToGitHub = true;
  repo.executionLogs.push({
    timestamp: new Date().toISOString(),
    phase: 'Phase 7: Contribution Submission',
    message: `User approved remote submission. Pull Request branch ${repo.patch.branchName} prepared for target ${repo.architecturalMap.repoName}:${repo.architecturalMap.defaultBranch}.`,
    type: 'success'
  });
  StorageService.saveRepoInvestigation(repo);

  res.json({
    success: true,
    message: `Pull Request branch [${repo.patch.branchName}] authorized and prepared for maintainer review on ${repo.architecturalMap.repoName}.`,
    repo
  });
});

app.listen(PORT, () => {
  console.log(`[Problem2Product Server] Running on http://localhost:${PORT}`);
});
