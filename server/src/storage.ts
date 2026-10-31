import fs from 'fs';
import path from 'path';
import { ProjectState, RepoDoctorState } from './types.js';

const DATA_DIR = path.resolve(process.cwd(), '../data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const REPOS_FILE = path.join(DATA_DIR, 'repos.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class StorageService {
  private static loadProjects(): Record<string, ProjectState> {
    if (!fs.existsSync(PROJECTS_FILE)) return {};
    try {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private static saveProjects(projects: Record<string, ProjectState>): void {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  }

  public static getProject(id: string): ProjectState | undefined {
    const projects = this.loadProjects();
    return projects[id];
  }

  public static getAllProjects(): ProjectState[] {
    const projects = this.loadProjects();
    return Object.values(projects).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public static saveProject(project: ProjectState): ProjectState {
    const projects = this.loadProjects();
    project.updatedAt = new Date().toISOString();
    projects[project.id] = project;
    this.saveProjects(projects);
    return project;
  }

  public static deleteProject(id: string): boolean {
    const projects = this.loadProjects();
    if (projects[id]) {
      delete projects[id];
      this.saveProjects(projects);
      return true;
    }
    return false;
  }

  // Repo Doctor state storage
  private static loadRepos(): Record<string, RepoDoctorState> {
    if (!fs.existsSync(REPOS_FILE)) return {};
    try {
      const data = fs.readFileSync(REPOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private static saveRepos(repos: Record<string, RepoDoctorState>): void {
    fs.writeFileSync(REPOS_FILE, JSON.stringify(repos, null, 2), 'utf-8');
  }

  public static getRepoInvestigation(id: string): RepoDoctorState | undefined {
    const repos = this.loadRepos();
    return repos[id];
  }

  public static getAllRepoInvestigations(): RepoDoctorState[] {
    const repos = this.loadRepos();
    return Object.values(repos).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public static saveRepoInvestigation(repo: RepoDoctorState): RepoDoctorState {
    const repos = this.loadRepos();
    repo.updatedAt = new Date().toISOString();
    repos[repo.id] = repo;
    this.saveRepos(repos);
    return repo;
  }
}
