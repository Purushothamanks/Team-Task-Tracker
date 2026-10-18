import React, { useState, useEffect } from 'react';
import { initialMembers, initialTasks } from './mockData';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import TeamView from './components/TeamView';
import SettingsView from './components/SettingsView';
import TaskDrawer from './components/TaskDrawer';
import Toast from './components/Toast';
import AdminConsoleView from './components/AdminConsoleView';
import OverviewView from './components/OverviewView';
import { Home as NavHome, Kanban as NavKanban, BarChart3 as NavAnalytics, Users as NavTeam, Settings as NavSettings } from 'lucide-react';

export default function App() {
  // Global State Loader
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('sf_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sf_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const getPathView = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (['overview', 'board', 'analytics', 'team', 'settings', 'admin'].includes(path)) {
      return path;
    }
    return 'overview';
  };

  const [activeView, setActiveView] = useState(() => {
    const savedUser = localStorage.getItem('sf_current_user');
    if (!savedUser) return 'overview';
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (['overview', 'board', 'analytics', 'team', 'settings', 'admin'].includes(path)) {
      return path;
    }
    return 'overview';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sf_theme');
    if (saved) return saved;
    // Default to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'add' | 'view' | 'edit'

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('sf_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save audit logs to localStorage
  useEffect(() => {
    localStorage.setItem('sf_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logEvent = (user, action) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user: user || 'System',
      action,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Apply Theme on load and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sf_theme', theme);
  }, [theme]);

  // Persist Members and Tasks
  useEffect(() => {
    localStorage.setItem('sf_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('sf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleViewChange = (id) => {
    window.history.pushState({}, '', `/${id}`);
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  // Handle popstate for browser navigation (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      if (currentUser) {
        setActiveView(getPathView());
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Initial routing check
  useEffect(() => {
    if (currentUser) {
      const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
      if (!currentPath || currentPath === '') {
        window.history.pushState({}, '', '/overview');
        setActiveView('overview');
      } else {
        setActiveView(getPathView());
      }
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Handlers
  const handleLogin = (user, isNew) => {
    setCurrentUser(user);
    localStorage.setItem('sf_current_user', JSON.stringify(user));
    
    if (isNew) {
      setMembers(prev => [...prev, user]);
      showToast(`Welcome to SyncFlow, ${user.name}! Profile created.`, 'success');
      logEvent(user.name, `Created account and joined workspace as ${user.role}`);
    } else {
      // If user isn't in members, add them
      if (!members.find(m => m.id === user.id)) {
        setMembers(prev => [...prev, user]);
      }
      showToast(`Welcome back, ${user.name}!`, 'success');
      logEvent(user.name, 'Logged in to workspace');
    }
    window.history.pushState({}, '', '/overview');
    setActiveView('overview');
  };

  const handleLogout = () => {
    logEvent(currentUser?.name || 'User', 'Logged out of workspace');
    setCurrentUser(null);
    localStorage.removeItem('sf_current_user');
    showToast('Logged out of workspace.', 'info');
    window.history.pushState({}, '', '/');
  };

  // CRUD Task Handlers
  const handleSaveTask = (savedTask) => {
    const exists = tasks.some(t => t.id === savedTask.id);
    if (exists) {
      setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
      showToast(`Task "${savedTask.title}" updated successfully.`, 'success');
      logEvent(currentUser.name, `Updated task: "${savedTask.title}"`);
    } else {
      setTasks(prev => [savedTask, ...prev]);
      showToast(`Task "${savedTask.title}" created.`, 'success');
      logEvent(currentUser.name, `Created task: "${savedTask.title}"`);
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast(`Task "${taskToDelete?.title || 'Unknown'}" deleted.`, 'error');
    logEvent(currentUser.name, `Deleted task: "${taskToDelete?.title || 'Unknown'}"`);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    const statuses = { todo: 'To Do', 'in-progress': 'In Progress', review: 'In Review', done: 'Completed' };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    showToast(`Task status updated to ${statuses[newStatus] || newStatus}.`, 'success');
    
    const taskObj = tasks.find(t => t.id === taskId);
    logEvent(currentUser.name, `Moved task "${taskObj?.title || 'Unknown'}" to ${statuses[newStatus] || newStatus}`);
  };

  // Team Handlers
  const handleAddMember = (newMember) => {
    setMembers(prev => [...prev, newMember]);
    showToast(`${newMember.name} registered as ${newMember.role}.`, 'success');
    logEvent(currentUser.name, `Registered new collaborator: "${newMember.name}" (${newMember.role})`);
  };

  const handleUpdateProfile = (updatedProfile) => {
    const updated = { ...currentUser, ...updatedProfile };
    setCurrentUser(updated);
    localStorage.setItem('sf_current_user', JSON.stringify(updated));
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, ...updatedProfile } : m));
    showToast("Workspace profile updated successfully.", "success");
    logEvent(currentUser.name, 'Updated workspace profile details');
  };

  // Reset workspace
  const handleResetWorkspaceData = () => {
    localStorage.removeItem('sf_tasks');
    localStorage.removeItem('sf_members');
    localStorage.removeItem('sf_audit_logs');
    setTasks(initialTasks);
    setMembers(initialMembers);
    setAuditLogs([]);
    window.history.pushState({}, '', '/overview');
    setActiveView('overview');
    showToast("Workspace data restored to default demo state.", "success");
  };

  // Admin Console Handlers
  const handleDeleteMember = (memberId) => {
    const memberToDelete = members.find(m => m.id === memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setTasks(prev => prev.map(t => t.assigneeId === memberId ? { ...t, assigneeId: '' } : t));
    showToast(`Member ${memberToDelete?.name} removed.`, 'error');
    logEvent(currentUser.name, `REMOVED collaborator: "${memberToDelete?.name || 'Unknown'}"`);
  };

  const handleToggleAdminStatus = (memberId) => {
    const memberObj = members.find(m => m.id === memberId);
    const newAdminVal = !memberObj?.isAdmin;
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, isAdmin: newAdminVal, role: newAdminVal ? 'System Administrator' : 'Contributor' } : m));
    showToast(`${memberObj?.name} is now ${newAdminVal ? 'an Admin' : 'a Contributor'}.`, 'success');
    logEvent(currentUser.name, `${newAdminVal ? 'PROMOTED' : 'DEMOTED'} user "${memberObj?.name}" ${newAdminVal ? 'to Admin' : 'to Contributor'}`);
  };

  const handleClearLogs = () => {
    setAuditLogs([]);
    showToast("Audit logs cleared.", "info");
  };

  const handleUpdateMemberRole = (memberId, newRole) => {
    const memberObj = members.find(m => m.id === memberId);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    showToast(`Role for ${memberObj?.name} updated to ${newRole}.`, 'success');
    logEvent(currentUser.name, `CHANGED role of user "${memberObj?.name}" to "${newRole}"`);
  };

  return (
    <>
      {!currentUser ? (
        <Login 
          members={members} 
          onLogin={handleLogin} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      ) : (
        <div className="app-container">
          
          {/* Main navigation sidebar */}
          <Sidebar 
            activeView={activeView} 
            onViewChange={handleViewChange} 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          {/* Core Content Body */}
          <main className="main-content">
            
            {/* Nav Header */}
            <Header 
              activeView={activeView}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              theme={theme}
              toggleTheme={toggleTheme}
              onAddTaskClick={() => { setSelectedTask(null); setModalMode('add'); }}
              currentUser={currentUser}
              onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
            />

            {/* Inner pages loader */}
            <div className="page-container">
              {activeView === 'overview' && (
                <OverviewView 
                  tasks={tasks}
                  members={members}
                  currentUser={currentUser}
                  auditLogs={auditLogs}
                  onTaskClick={(task) => { setSelectedTask(task); setModalMode('view'); }}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onNavigateToBoard={() => handleViewChange('board')}
                />
              )}

              {activeView === 'board' && (
                <DashboardView 
                  tasks={tasks}
                  members={members}
                  searchQuery={searchQuery}
                  onTaskClick={(task) => { setSelectedTask(task); setModalMode('view'); }}
                  onAddTaskClick={() => { setSelectedTask(null); setModalMode('add'); }}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}

              {activeView === 'analytics' && (
                <AnalyticsView 
                  tasks={tasks}
                  members={members}
                />
              )}

              {activeView === 'team' && (
                <TeamView 
                  members={members}
                  tasks={tasks}
                  onAddMember={handleAddMember}
                />
              )}

              {activeView === 'settings' && (
                <SettingsView 
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onResetWorkspaceData={handleResetWorkspaceData}
                />
              )}

              {activeView === 'admin' && (
                <AdminConsoleView 
                  members={members}
                  tasks={tasks}
                  currentUser={currentUser}
                  auditLogs={auditLogs}
                  onDeleteMember={handleDeleteMember}
                  onToggleAdminStatus={handleToggleAdminStatus}
                  onClearLogs={handleClearLogs}
                  onUpdateMemberRole={handleUpdateMemberRole}
                />
              )}
            </div>
          </main>


          {/* Mobile Bottom Navigation Bar */}
          <nav className="mobile-bottom-nav">
            <button 
              className={`mobile-nav-item ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => handleViewChange('overview')}
              aria-label="Overview"
            >
              <NavHome size={18} />
              <span>Overview</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeView === 'board' ? 'active' : ''}`}
              onClick={() => handleViewChange('board')}
              aria-label="Board"
            >
              <NavKanban size={18} />
              <span>Board</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleViewChange('analytics')}
              aria-label="Analytics"
            >
              <NavAnalytics size={18} />
              <span>Analytics</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeView === 'team' ? 'active' : ''}`}
              onClick={() => handleViewChange('team')}
              aria-label="Team"
            >
              <NavTeam size={18} />
              <span>Team</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeView === 'settings' ? 'active' : ''}`}
              onClick={() => handleViewChange('settings')}
              aria-label="Settings"
            >
              <NavSettings size={18} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Global Dialog Drawer */}
          {(modalMode === 'add' || selectedTask) && (
            <TaskDrawer 
              task={selectedTask}
              mode={modalMode}
              members={members}
              currentUser={currentUser}
              onClose={() => { setSelectedTask(null); setModalMode('view'); }}
              onSave={handleSaveTask}
              onDelete={handleDeleteTask}
            />
          )}

        </div>
      )}

      {/* Global Toast portal container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </>
  );
}
