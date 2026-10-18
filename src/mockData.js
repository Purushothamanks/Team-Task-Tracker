export const initialMembers = [
  {
    id: "mem-1",
    name: "Alex Rivera",
    role: "Lead Designer",
    email: "alex.r@syncflow.co",
    avatar: "AR",
    color: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
    status: "online"
  },
  {
    id: "mem-2",
    name: "Marcus Chen",
    role: "Senior Frontend Engineer",
    email: "marcus.c@syncflow.co",
    avatar: "MC",
    color: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
    status: "online"
  },
  {
    id: "mem-3",
    name: "Sophia Martinez",
    role: "Product Manager",
    email: "sophia.m@syncflow.co",
    avatar: "SM",
    color: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
    status: "busy"
  },
  {
    id: "mem-4",
    name: "David Kim",
    role: "DevOps Architect",
    email: "david.k@syncflow.co",
    avatar: "DK",
    color: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    status: "offline"
  },
  {
    id: "mem-5",
    name: "Emma Watson",
    role: "QA Engineer",
    email: "emma.w@syncflow.co",
    avatar: "EW",
    color: "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
    status: "online"
  }
];

export const initialTasks = [
  {
    id: "task-1",
    title: "Design Landing Page Hero Section",
    description: "Create a modern, high-converting hero layout with glassmorphic cards and dark-mode gradients for the SyncFlow SaaS website.",
    status: "todo",
    priority: "high",
    category: "Design",
    assigneeId: "mem-1",
    dueDate: "2026-06-25",
    subtasks: [
      { id: "sub-1-1", title: "Sketch initial concepts", completed: true },
      { id: "sub-1-2", title: "Select color palette and typography", completed: true },
      { id: "sub-1-3", title: "Create Figma high-fidelity screens", completed: false },
      { id: "sub-1-4", title: "Gather team feedback on micro-interactions", completed: false }
    ],
    comments: [
      {
        id: "com-1-1",
        userId: "mem-3",
        userName: "Sophia Martinez",
        text: "Alex, let's make sure the hero layout features the new team analytics component prominently.",
        timestamp: "2026-06-21T10:30:00Z"
      },
      {
        id: "com-1-2",
        userId: "mem-1",
        userName: "Alex Rivera",
        text: "Got it! I am sketching a glassmorphism widget that displays task completion trends.",
        timestamp: "2026-06-21T11:15:00Z"
      }
    ],
    createdAt: "2026-06-20T08:00:00Z"
  },
  {
    id: "task-2",
    title: "Implement Dark Mode Theme Context",
    description: "Develop global theme provider using React Context API and CSS custom variables to handle instant theme-switching cleanly.",
    status: "in-progress",
    priority: "medium",
    category: "Feature",
    assigneeId: "mem-2",
    dueDate: "2026-06-23",
    subtasks: [
      { id: "sub-2-1", title: "Define custom variables in index.css", completed: true },
      { id: "sub-2-2", title: "Create ThemeContext and useTheme hook", completed: true },
      { id: "sub-2-3", title: "Wire up toggler in Header and Login screen", completed: false },
      { id: "sub-2-4", title: "Persist choice to localStorage", completed: false }
    ],
    comments: [
      {
        id: "com-2-1",
        userId: "mem-2",
        userName: "Marcus Chen",
        text: "CSS variables are all ready in the root. Hooking them up to the state now.",
        timestamp: "2026-06-21T14:00:00Z"
      }
    ],
    createdAt: "2026-06-19T09:30:00Z"
  },
  {
    id: "task-3",
    title: "Setup CI/CD Pipeline via GitHub Actions",
    description: "Write workflows to automate building, testing, and deployment to AWS Amplify upon every push to the main branch.",
    status: "review",
    priority: "high",
    category: "DevOps",
    assigneeId: "mem-4",
    dueDate: "2026-06-22",
    subtasks: [
      { id: "sub-3-1", title: "Write build and test workflow files", completed: true },
      { id: "sub-3-2", title: "Configure AWS credentials secret keys", completed: true },
      { id: "sub-3-3", title: "Test build pipeline with mock errors", completed: true },
      { id: "sub-3-4", title: "Verify successful deployment triggers", completed: true }
    ],
    comments: [
      {
        id: "com-3-1",
        userId: "mem-4",
        userName: "David Kim",
        text: "Deployments are succeeding on the staging sub-domain. Ready for final PM review.",
        timestamp: "2026-06-20T16:45:00Z"
      },
      {
        id: "com-3-2",
        userId: "mem-3",
        userName: "Sophia Martinez",
        text: "Amazing work David! I'll run the QA checks and sign off by tonight.",
        timestamp: "2026-06-21T09:00:00Z"
      }
    ],
    createdAt: "2026-06-18T10:00:00Z"
  },
  {
    id: "task-4",
    title: "Draft Q3 QBR Product Presentation",
    description: "Assemble slide decks focusing on feature milestones achieved in Q2 and outline product roadmap timelines for Q3 and Q4.",
    status: "done",
    priority: "low",
    category: "Marketing",
    assigneeId: "mem-3",
    dueDate: "2026-06-20",
    subtasks: [
      { id: "sub-4-1", title: "Pull Q2 feature completion numbers", completed: true },
      { id: "sub-4-2", title: "Compile engineering team velocities", completed: true },
      { id: "sub-4-3", title: "Design roadmap visual charts", completed: true }
    ],
    comments: [],
    createdAt: "2026-06-15T11:00:00Z"
  },
  {
    id: "task-5",
    title: "Automate E2E Login & Signup Tests",
    description: "Write automated Cypress testing suites to validate email and password inputs, role selections, and login validations.",
    status: "todo",
    priority: "medium",
    category: "Bug",
    assigneeId: "mem-5",
    dueDate: "2026-06-28",
    subtasks: [
      { id: "sub-5-1", title: "Setup Cypress framework", completed: true },
      { id: "sub-5-2", title: "Write happy path login assertions", completed: false },
      { id: "sub-5-3", title: "Write invalid inputs validation checks", completed: false }
    ],
    comments: [],
    createdAt: "2026-06-21T12:00:00Z"
  }
];

export const CATEGORIES = ["Feature", "Bug", "Design", "Marketing", "DevOps"];
