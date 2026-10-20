/**
 * TeamTask-Tracker Enterprise Data Store & Schema
 * Replaces dummy mock data with true persistent enterprise state management,
 * audit logging, and data portability (export/import).
 */

export const CATEGORIES = ["Feature", "Bug", "Design", "DevOps", "Security", "Architecture", "Marketing"];

export const DEFAULT_ADMIN = {
  id: "admin-1",
  name: "Purushothaman K S",
  role: "System Administrator & Lead Architect",
  email: "purushothamank.s799@gmail.com",
  avatar: "PK",
  color: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  status: "online",
  isAdmin: true,
  department: "Core Engineering"
};

export const INITIAL_ENTERPRISE_TASKS = [
  {
    id: "task-enterprise-1",
    title: "System Architecture & Environment Deployment",
    description: "Initialize the TeamTask-Tracker production cluster, configure real-time sync listeners, and verify cross-tab data replication.",
    status: "in-progress",
    priority: "urgent",
    category: "DevOps",
    assigneeId: "admin-1",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    subtasks: [
      { id: "sub-1-1", title: "Configure peer-to-peer BroadcastChannel bus", completed: true },
      { id: "sub-1-2", title: "Implement enterprise audit logging timeline", completed: true },
      { id: "sub-1-3", title: "Establish JSON & CSV backup routines", completed: false },
      { id: "sub-1-4", title: "Verify multi-tab real-time state synchronization", completed: false }
    ],
    comments: [
      {
        id: "com-1-1",
        userId: "admin-1",
        userName: "Purushothaman K S",
        text: "Enterprise real-time bus initialized. Ready for team onboarding.",
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "task-enterprise-2",
    title: "Configure Role-Based Access & Security Policies",
    description: "Audit organization permissions, restrict administrator capabilities, and ensure zero unhandled exceptions across team workflows.",
    status: "todo",
    priority: "high",
    category: "Security",
    assigneeId: "admin-1",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    subtasks: [
      { id: "sub-2-1", title: "Audit administrator route protections", completed: true },
      { id: "sub-2-2", title: "Validate member email format and role boundaries", completed: false },
      { id: "sub-2-3", title: "Implement session termination guards", completed: false }
    ],
    comments: [],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    id: "log-init-1",
    actor: "Purushothaman K S",
    action: "WORKSPACE_INITIALIZED",
    details: "TeamTask-Tracker enterprise workspace initialized with real-time peer sync engine.",
    timestamp: new Date().toISOString()
  }
];

export function exportWorkspaceToJson(tasks, members, auditLog) {
  const exportData = {
    appName: "TeamTask-Tracker",
    version: "2.0.0-Enterprise",
    exportedAt: new Date().toISOString(),
    data: {
      tasks,
      members,
      auditLog
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `teamtask-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportTasksToCsv(tasks, members) {
  const headers = ["ID", "Title", "Status", "Priority", "Category", "Assignee", "Due Date", "Created At"];
  const memberMap = new Map(members.map(m => [m.id, m.name]));

  const rows = tasks.map(t => [
    t.id,
    `"${(t.title || "").replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    t.category,
    `"${(memberMap.get(t.assigneeId) || "Unassigned").replace(/"/g, '""')}"`,
    t.dueDate || "",
    t.createdAt || ""
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const a = document.createElement("a");
  a.href = encodedUri;
  a.download = `teamtask-tracker-tasks-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
