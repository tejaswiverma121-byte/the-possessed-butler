import { RequirementsDesign, GeneratedFile } from './types.js';

export const SAMPLE_REQUIREMENTS: RequirementsDesign = {
  functionalRequirements: [
    {
      id: 'FR-1',
      priority: 'MVP',
      title: 'Skill Profile & Competency Registration',
      description: 'Students can register or update their technical proficiencies, role preferences (Frontend, Backend, ML, Design, PM), and target project domains.',
      acceptanceCriteria: [
        'Requires at least 1 primary skill tag and 1 role preference.',
        'Allows adding verified portfolio / GitHub profile URL.',
        'Displays preview card immediately upon profile update.'
      ]
    },
    {
      id: 'FR-2',
      priority: 'MVP',
      title: 'Weekly Availability Heatmap & Clash Detection',
      description: 'Visual grid where students select available weekly slots (Morning, Afternoon, Evening across Mon-Sun).',
      acceptanceCriteria: [
        'Renders interactive 7-day grid with clickable time blocks.',
        'Computes common available hours against potential teammates.',
        'Flags matches with fewer than 3 overlapping hours as low compatibility.'
      ]
    },
    {
      id: 'FR-3',
      priority: 'MVP',
      title: 'Multi-Dimensional Compatibility Matchmaking',
      description: 'Calculates synergistic match percentage based on weighted skills (50%), schedule overlap (30%), and commitment goal (20%).',
      acceptanceCriteria: [
        'Returns ranked recommendations sorted by compatibility score (0-100%).',
        'Displays visual breakdown of skill synergy and schedule overlap.',
        'Allows filtering candidates by role, skill, and minimum match score.'
      ]
    },
    {
      id: 'FR-4',
      priority: 'MVP',
      title: 'Team Formation & One-Click Invite Workspace',
      description: 'Create a project squad, view squad skill coverage radar, invite candidates, and accept/decline invites.',
      acceptanceCriteria: [
        'Visualizes squad skill coverage (shows missing roles like UI/UX or Backend).',
        'Provides invite button with real-time squad roster updates.',
        'Enforces maximum team capacity limits (default 4 members).'
      ]
    },
    {
      id: 'FR-5',
      priority: 'P1',
      title: 'Team Charter & Commitment Contract',
      description: 'Members agree on grade target, weekly meeting cadences, and communication channels upon joining.',
      acceptanceCriteria: [
        'Requires mutual sign-off before locking the official team.',
        'Generates printable or shareable team agreement summary.'
      ]
    }
  ],
  nonFunctionalRequirements: [
    { id: 'NFR-1', category: 'Performance', target: 'Matchmaking query executes in < 50ms for rosters up to 5,000 students' },
    { id: 'NFR-2', category: 'Accessibility', target: 'WCAG 2.2 AA compliant, visible focus states, full keyboard navigability' },
    { id: 'NFR-3', category: 'Security & Privacy', target: 'Student contact details hidden until invite accepted; strict input sanitization' },
    { id: 'NFR-4', category: 'Reliability', target: 'Zero data loss during profile edits; local persistence with atomic updates' }
  ],
  userPersonas: [
    {
      name: 'Alex Chen',
      role: 'CS Junior (Backend/Systems Focus)',
      painPoints: ['Spends days building APIs but struggles with CSS/design', 'Had previous teammates ghost 2 days before final submission', 'Works 15 hours/week so needs strict schedule matching'],
      goals: ['Find a reliable UI/UX designer and frontend dev', 'Lock in team within 48 hours of syllabus release', 'Target grade: A']
    },
    {
      name: 'Maya Patel',
      role: 'Interactive Media & UI/UX Senior',
      painPoints: ['Wants to design beautiful web apps but cannot build complex databases', 'Joined teams where members dismissed design as unimportant'],
      goals: ['Partner with strong backend engineers who value user experience', 'Produce a portfolio-worthy product']
    }
  ],
  userJourneys: [
    {
      persona: 'Alex Chen',
      steps: ['Creates profile with Python/FastAPI skills and evening availability', 'Searches for Frontend/UI teammates', 'Inspects Maya profile with 94% compatibility', 'Sends squad invite', 'Signs team charter agreeing on grade A target'],
      happyPath: 'Matches with complementary peers within 24 hours, zero schedule conflicts, project finished smoothly.',
      recoveryFlow: 'If candidate declines invite, candidate recommendations automatically refresh with next best complementary profiles.'
    }
  ],
  pageAndRouteMap: [
    { path: '/', name: 'Teammate Discovery & Matchmaker', purpose: 'Browse top compatibility matches with filter controls and skill synergy badges', components: ['MatchmakerFeed', 'FilterToolbar', 'CandidateCard', 'SquadRadar'] },
    { path: '/my-squad', name: 'My Squad Workspace', purpose: 'Manage team roster, view skill coverage gaps, and track invite requests', components: ['SquadRoster', 'SkillCoverageMeter', 'InviteList'] },
    { path: '/profile', name: 'My Profile & Availability', purpose: 'Configure skill badges, portfolio links, and interactive weekly calendar availability', components: ['SkillTagEditor', 'AvailabilityHeatmap', 'CommitmentGoalSelector'] },
    { path: '/charter', name: 'Team Charter & Social Contract', purpose: 'Review and sign mutual commitment agreement', components: ['CharterForm', 'SignOffStatus'] }
  ],
  databaseSchema: [
    {
      table: 'users',
      fields: [
        { name: 'id', type: 'UUID PRIMARY KEY', constraints: 'NOT NULL' },
        { name: 'name', type: 'VARCHAR(120)', constraints: 'NOT NULL' },
        { name: 'major', type: 'VARCHAR(80)', constraints: 'NOT NULL' },
        { name: 'target_grade', type: 'VARCHAR(2)', constraints: 'DEFAULT "A"' },
        { name: 'availability_slots', type: 'JSONB', constraints: 'Array of slots' }
      ],
      relationships: '1-to-N with user_skills, 1-to-1 with squad_members'
    },
    {
      table: 'skills',
      fields: [
        { name: 'user_id', type: 'UUID REFERENCES users(id)', constraints: 'CASCADE' },
        { name: 'skill_name', type: 'VARCHAR(60)', constraints: 'NOT NULL' },
        { name: 'category', type: 'VARCHAR(40)', constraints: 'frontend | backend | design | ml | pm' },
        { name: 'proficiency', type: 'INTEGER', constraints: 'CHECK (proficiency BETWEEN 1 AND 5)' }
      ],
      relationships: 'Composite PK (user_id, skill_name)'
    },
    {
      table: 'squads',
      fields: [
        { name: 'id', type: 'UUID PRIMARY KEY', constraints: 'NOT NULL' },
        { name: 'name', type: 'VARCHAR(120)', constraints: 'NOT NULL' },
        { name: 'target_project', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'max_capacity', type: 'INTEGER', constraints: 'DEFAULT 4' }
      ],
      relationships: '1-to-N with squad_members'
    }
  ],
  apiContracts: [
    {
      method: 'GET',
      endpoint: '/api/candidates',
      description: 'Fetch candidates ranked by multi-dimensional compatibility score',
      responseBody: { candidates: [{ id: 'u1', name: 'Maya Patel', compatibilityScore: 94, skills: ['UI/UX', 'Figma', 'React'], scheduleOverlapHours: 6 }] },
      auth: 'Bearer Student JWT'
    },
    {
      method: 'POST',
      endpoint: '/api/squad/invite',
      description: 'Send squad invitation to candidate',
      requestBody: { squadId: 'sq-101', candidateId: 'u1', proposedRole: 'Lead UI/UX' },
      responseBody: { success: true, inviteId: 'inv-501', status: 'pending' },
      auth: 'Bearer Student JWT'
    }
  ]
};

export const SAMPLE_ARCHITECTURE = {
  overview: 'Modular Full-Stack Client-Server architecture with decoupled vector matching service, schema validation layer, and responsive interactive preview.',
  techStack: {
    frontend: 'Modern React with Tailwind CSS, Lucide Icons, and accessible custom controls',
    backend: 'Node.js & Express with schema-validated endpoints (Zod)',
    database: 'Relational SQLite / JSON store with atomic transaction isolation',
    validation: 'Zod runtime schema validation for inputs and API payloads',
    testing: 'Vitest / Jest compatible automated assertion test runner'
  },
  rationale: 'React + Tailwind offers rapid, accessible, and responsive component construction with instant visual feedback. Node.js backend enables sub-millisecond compatibility scoring calculations without thread blocking. SQLite guarantees ACID transactional safety for squad capacity limits.',
  alternativesConsidered: 'Considered Next.js SSR, but standalone client-server structure provides cleaner separation for embeddable sandbox previews and containerized isolation.'
};

export const SAMPLE_GENERATED_FILES: GeneratedFile[] = [
  {
    path: 'public/index.html',
    language: 'html',
    purpose: 'Interactive single-page application sandbox with responsive layout, live compatibility scoring, availability matrix, and squad management.',
    content: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SynergyTeam — College Teammate Matchmaker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#22c55e', 600: '#16a34a' }
          },
          fontFamily: { sans: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] }
        }
      }
    }
  </script>
  <style>
    body { background-color: #0b1120; color: #f8fafc; }
    .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .badge { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 9999px; }
  </style>
</head>
<body class="p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Top Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h1 class="text-2xl font-bold tracking-tight text-white">SynergyTeam AI</h1>
        </div>
        <p class="text-sm text-slate-400 mt-1">Algorithmic Skill & Schedule Compatibility Matching for Student Projects</p>
      </div>
      <div class="flex items-center gap-3">
        <button id="tab-matchmaker" onclick="switchTab('matchmaker')" class="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white">Find Teammates</button>
        <button id="tab-squad" onclick="switchTab('squad')" class="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">My Squad (<span id="squad-count">1</span>/4)</button>
        <button id="tab-profile" onclick="switchTab('profile')" class="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">My Availability</button>
      </div>
    </header>

    <!-- TAB 1: Matchmaker View -->
    <main id="view-matchmaker" class="space-y-6">
      <div class="glass-card rounded-xl p-5 border border-emerald-500/20 bg-emerald-950/10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-base font-semibold text-emerald-400 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Squad Skill Coverage & Gap Analysis
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Your squad has: <span class="text-slate-200 font-medium">Backend & Database</span>. Looking for: <span class="text-amber-400 font-medium">UI/UX Designer, Frontend React</span></p>
          </div>
          <div class="flex gap-2 text-xs">
            <span class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Role Target: Grade A</span>
            <span class="px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800">Capacity: 3 Spots Open</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Filter Role:</span>
          <button onclick="filterCandidates('all')" class="badge bg-slate-800 text-white hover:bg-slate-700">All</button>
          <button onclick="filterCandidates('Design')" class="badge bg-purple-900/40 text-purple-300 border border-purple-700">UI/UX Design</button>
          <button onclick="filterCandidates('Frontend')" class="badge bg-blue-900/40 text-blue-300 border border-blue-700">Frontend</button>
          <button onclick="filterCandidates('ML')" class="badge bg-rose-900/40 text-rose-300 border border-rose-700">ML / AI</button>
        </div>
        <div class="text-xs text-slate-400">
          Showing <span id="candidate-count">4</span> complementary candidates
        </div>
      </div>

      <div id="candidates-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      </div>
    </main>

    <!-- TAB 2: Squad Workspace -->
    <div id="view-squad" class="hidden space-y-6">
      <div class="glass-card rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-bold text-white">Current Squad Roster (Capstone Team Alpha)</h2>
        <div id="squad-roster-list" class="space-y-3">
        </div>
      </div>
      <div class="glass-card rounded-xl p-6 space-y-3 border border-slate-700">
        <h3 class="text-md font-semibold text-white">Mutual Team Charter Agreement</h3>
        <p class="text-xs text-slate-400">All members agree to weekly sync on Wednesdays at 18:00 UTC, target grade 'A', and maximum 24h response time on discord.</p>
        <div class="p-3 bg-slate-900/80 rounded-lg text-xs font-mono text-emerald-400 border border-emerald-900/50">
          ✓ Charter Status: Signed by 1/1 active members.
        </div>
      </div>
    </div>

    <!-- TAB 3: My Availability -->
    <div id="view-profile" class="hidden space-y-6">
      <div class="glass-card rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-bold text-white">Weekly Availability Heatmap</h2>
        <p class="text-xs text-slate-400">Click time slots to toggle when you can work on project deliverables. Our algorithm verifies schedule overlap with prospective teammates.</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400">
                <th class="p-2">Slot</th>
                <th class="p-2">Mon</th>
                <th class="p-2">Tue</th>
                <th class="p-2">Wed</th>
                <th class="p-2">Thu</th>
                <th class="p-2">Fri</th>
                <th class="p-2">Sat</th>
                <th class="p-2">Sun</th>
              </tr>
            </thead>
            <tbody id="heatmap-body">
            </tbody>
          </table>
        </div>
        <button onclick="saveSchedule()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold">Save Schedule Blocks</button>
      </div>
    </div>
  </div>

  <script>
    const myUser = {
      id: 'usr-00',
      name: 'Alex Chen (You)',
      role: 'Backend & Systems',
      major: 'Computer Science',
      targetGrade: 'A',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
      availability: ['wed-eve', 'sat-aft', 'sun-aft']
    };

    let candidates = [
      {
        id: 'usr-01',
        name: 'Maya Patel',
        role: 'Design',
        major: 'Interactive Design',
        targetGrade: 'A',
        compatibilityScore: 94,
        skills: ['Figma', 'UI/UX Prototyping', 'Tailwind', 'Design Systems'],
        availability: ['wed-eve', 'fri-eve', 'sat-aft'],
        overlapHours: 6,
        bio: 'Passionate about accessible UI and clean design systems. Looking for backend engineers aiming for an A.'
      },
      {
        id: 'usr-02',
        name: 'Liam Vance',
        role: 'Frontend',
        major: 'Software Engineering',
        targetGrade: 'A',
        compatibilityScore: 89,
        skills: ['React', 'TypeScript', 'Next.js', 'State Management'],
        availability: ['wed-eve', 'sun-aft'],
        overlapHours: 5,
        bio: 'Front-end enthusiast who loves building snappy responsive apps. Available weekends and Wednesday evenings.'
      },
      {
        id: 'usr-03',
        name: 'Sofia Rodriguez',
        role: 'ML',
        major: 'Data Science',
        targetGrade: 'A',
        compatibilityScore: 82,
        skills: ['PyTorch', 'Data Pipelines', 'FastAPI', 'Pandas'],
        availability: ['sat-aft', 'sun-aft'],
        overlapHours: 4,
        bio: 'Interested in AI-driven project features. Looking for strong product-focused team.'
      },
      {
        id: 'usr-04',
        name: 'Jordan Lee',
        role: 'Design',
        major: 'Graphic Communication',
        targetGrade: 'B',
        compatibilityScore: 61,
        skills: ['Illustration', 'Branding', 'User Research'],
        availability: ['mon-mor'],
        overlapHours: 0,
        bio: 'Want to contribute graphic assets. Schedule is tight due to part-time job.'
      }
    ];

    let squad = [myUser];

    function renderCandidates(filtered = candidates) {
      const container = document.getElementById('candidates-grid');
      container.innerHTML = '';
      document.getElementById('candidate-count').innerText = filtered.length;

      filtered.forEach(c => {
        const inSquad = squad.some(s => s.id === c.id);
        const card = document.createElement('div');
        card.className = 'glass-card rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all';
        
        const scoreColor = c.compatibilityScore >= 90 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' :
                           c.compatibilityScore >= 80 ? 'text-blue-400 border-blue-500/30 bg-blue-950/40' : 'text-amber-400 border-amber-500/30 bg-amber-950/40';

        card.innerHTML = \`
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-white text-base">\${c.name}</h3>
                <p class="text-xs text-slate-400">\${c.major} • Target: \${c.targetGrade}</p>
              </div>
              <div class="px-2.5 py-1 rounded-lg border font-mono font-bold text-xs \${scoreColor}">
                \${c.compatibilityScore}% Match
              </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">\${c.bio}</p>
            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Skills & Synergy:</span>
              <div class="flex flex-wrap gap-1.5">
                \${c.skills.map(s => \`<span class="badge bg-slate-800 text-slate-200 border border-slate-700">\${s}</span>\`).join('')}
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span class="w-2 h-2 rounded-full \${c.overlapHours > 0 ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              <span>\${c.overlapHours} shared weekly meeting hours</span>
            </div>
          </div>
          <button onclick="toggleInvite('\${c.id}')" class="w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all \${
            inSquad 
              ? 'bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }">
            \${inSquad ? 'Remove from Squad' : 'Invite to Squad'}
          </button>
        \`;
        container.appendChild(card);
      });
    }

    function toggleInvite(candidateId) {
      const idx = squad.findIndex(s => s.id === candidateId);
      if (idx >= 0) {
        squad.splice(idx, 1);
      } else {
        if (squad.length >= 4) {
          alert('Squad capacity limit reached (Maximum 4 members).');
          return;
        }
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate) squad.push(candidate);
      }
      document.getElementById('squad-count').innerText = squad.length;
      renderCandidates();
      renderSquad();
    }

    function renderSquad() {
      const container = document.getElementById('squad-roster-list');
      container.innerHTML = '';
      squad.forEach((m, idx) => {
        const item = document.createElement('div');
        item.className = 'p-3 rounded-lg bg-slate-900 flex justify-between items-center border border-slate-800';
        item.innerHTML = \`
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold">\${idx + 1}</span>
            <div>
              <p class="text-sm font-semibold text-white">\${m.name}</p>
              <p class="text-xs text-slate-400">\${m.role} • \${m.skills.slice(0, 2).join(', ')}</p>
            </div>
          </div>
          <span class="badge bg-emerald-900/30 text-emerald-300 border border-emerald-800 text-[10px]">Confirmed</span>
        \`;
        container.appendChild(item);
      });
    }

    function filterCandidates(role) {
      if (role === 'all') renderCandidates(candidates);
      else renderCandidates(candidates.filter(c => c.role.toLowerCase() === role.toLowerCase()));
    }

    function switchTab(tab) {
      document.getElementById('view-matchmaker').classList.add('hidden');
      document.getElementById('view-squad').classList.add('hidden');
      document.getElementById('view-profile').classList.add('hidden');

      document.getElementById('tab-matchmaker').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300';
      document.getElementById('tab-squad').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300';
      document.getElementById('tab-profile').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300';

      document.getElementById('view-' + tab).classList.remove('hidden');
      document.getElementById('tab-' + tab).className = 'px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white';
    }

    function initHeatmap() {
      const times = ['Morning (09:00 - 12:00)', 'Afternoon (13:00 - 17:00)', 'Evening (18:00 - 21:00)'];
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const tbody = document.getElementById('heatmap-body');
      tbody.innerHTML = '';

      times.forEach((time, tIdx) => {
        const slotKey = tIdx === 0 ? 'mor' : tIdx === 1 ? 'aft' : 'eve';
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-800/50 hover:bg-slate-900/30';
        tr.innerHTML = \`<td class="p-2 font-mono text-slate-400">\${time}</td>\` + days.map(d => {
          const key = \`\${d}-\${slotKey}\`;
          const active = myUser.availability.includes(key);
          return \`<td class="p-2">
            <button onclick="toggleSlot('\${key}', this)" class="w-8 h-8 rounded border transition-colors \${active ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}"></button>
          </td>\`;
        }).join('');
        tbody.appendChild(tr);
      });
    }

    function toggleSlot(key, btn) {
      const idx = myUser.availability.indexOf(key);
      if (idx >= 0) {
        myUser.availability.splice(idx, 1);
        btn.className = 'w-8 h-8 rounded border bg-slate-900 border-slate-800 hover:border-slate-700';
      } else {
        myUser.availability.push(key);
        btn.className = 'w-8 h-8 rounded border bg-emerald-600 border-emerald-500';
      }
    }

    function saveSchedule() {
      alert('Availability schedule saved. Recalculated common meeting hours for prospective teammates.');
    }

    renderCandidates();
    renderSquad();
    initHeatmap();
  </script>
</body>
</html>`
  },
  {
    path: 'src/services/matchingService.js',
    language: 'javascript',
    purpose: 'Core algorithmic matching logic calculating skill complementarity, schedule overlap, and commitment synergy.',
    isModified: true,
    content: `// Multi-dimensional matching service for Problem2Product AI
export function calculateCompatibilityScore(user, candidate) {
  // 1. Skill Complementarity (50% weight)
  const sharedSkills = candidate.skills.filter(s => user.skills.includes(s));
  const complementarySkills = candidate.skills.filter(s => !user.skills.includes(s));
  const skillScore = Math.min(100, (complementarySkills.length * 25) + (sharedSkills.length * 10));

  // 2. Schedule Overlap (30% weight)
  let overlapHours = 0;
  if (user.availability && candidate.availability) {
    const commonSlots = candidate.availability.filter(slot => user.availability.includes(slot));
    overlapHours = commonSlots.length * 2.5; // ~2.5 hrs per slot
  }
  const scheduleScore = Math.min(100, overlapHours * 20);

  // 3. Goal / Commitment Alignment (20% weight)
  const goalScore = user.targetGrade === candidate.targetGrade ? 100 : 50;

  // Automated Schedule conflict validation applied (Fixes: schedule clash overlap defect)
  if (candidate.availability && user.availability) {
    const hasOverlap = candidate.availability.some(slot => user.availability.includes(slot));
    if (!hasOverlap) return { score: 0, overlapHours: 0, skillComplementarity: false };
  }

  // Weighted total
  const totalScore = Math.round((skillScore * 0.5) + (scheduleScore * 0.3) + (goalScore * 0.2));
  return {
    score: totalScore,
    overlapHours,
    skillComplementarity: complementarySkills.length > 0
  };
}`
  },
  {
    path: 'src/server.js',
    language: 'javascript',
    purpose: 'Node.js Express API server with schema validation and candidate retrieval.',
    content: `import express from 'express';
import cors from 'cors';
import { calculateCompatibilityScore } from './services/matchingService.js';

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_CANDIDATES = [
  { id: 'usr-01', name: 'Maya Patel', skills: ['UI/UX', 'Figma', 'Tailwind'], availability: ['wed-eve', 'sat-aft'], targetGrade: 'A' },
  { id: 'usr-02', name: 'Liam Vance', skills: ['React', 'TypeScript'], availability: ['wed-eve', 'sun-aft'], targetGrade: 'A' },
];

app.post('/api/match', (req, res) => {
  const { user } = req.body;
  if (!user || !user.skills) {
    return res.status(400).json({ error: 'Missing required user profile' });
  }

  const results = MOCK_CANDIDATES.map(candidate => {
    const match = calculateCompatibilityScore(user, candidate);
    return { ...candidate, ...match };
  });

  return res.json({ candidates: results.sort((a, b) => b.score - a.score) });
});

export default app;`
  },
  {
    path: 'tests/matching.test.js',
    language: 'javascript',
    purpose: 'Automated verification test suite checking skill synergy, schedule overlap, and edge cases.',
    content: `import { calculateCompatibilityScore } from '../src/services/matchingService.js';

// Test 1: Complementary Skill Matching
export function test_skill_complementarity_scoring() {
  const user = { skills: ['Python', 'Docker'], availability: ['wed-eve'], targetGrade: 'A' };
  const candidate = { skills: ['Figma', 'UI/UX'], availability: ['wed-eve'], targetGrade: 'A' };
  const result = calculateCompatibilityScore(user, candidate);
  if (result.score < 80) throw new Error('Expected score >= 80 for complementary team skills');
  return true;
}

// Test 2: Schedule Overlap Rejection
export function test_schedule_overlap_rejection() {
  const user = { skills: ['Python'], availability: ['mon-mor'], targetGrade: 'A' };
  const candidate = { skills: ['React'], availability: ['fri-eve'], targetGrade: 'A' };
  const result = calculateCompatibilityScore(user, candidate);
  if (result.overlapHours !== 0) throw new Error('Expected 0 overlapping hours for disjoint availability');
  return true;
}

// Test 3: Empty Profile Boundary Check
export function test_empty_profile_boundary() {
  const user = { skills: [], availability: [], targetGrade: 'B' };
  const candidate = { skills: ['React'], availability: [], targetGrade: 'A' };
  const result = calculateCompatibilityScore(user, candidate);
  if (isNaN(result.score)) throw new Error('Matching algorithm returned NaN for empty profile');
  return true;
}`
  },
  {
    path: 'README.md',
    language: 'markdown',
    purpose: 'System documentation, architecture explanation, and run instructions.',
    content: `# SynergyTeam AI — Teammate Matchmaker & Collaboration Workspace

## Core Problem Addressed
Solves the fundamental information asymmetry and schedule clash problems that cause 40%+ of student capstone and project teams to struggle or fail.

## Setup & Run
1. Serve the frontend: open \`public/index.html\` in any modern browser.
2. Run backend API: \`node src/server.js\`
3. Run test verification: \`npm test\`
`
  }
];
