import React from 'react';
import { CheckSquare, Calendar, Users, Activity, ExternalLink, ArrowRight, Shield } from 'lucide-react';

export default function OverviewView({ 
  tasks, 
  members, 
  currentUser, 
  auditLogs, 
  onTaskClick, 
  onUpdateTaskStatus,
  onNavigateToBoard
}) {
  
  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Filter tasks assigned to current user that are not completed
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done');
  
  // Statistics
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCheckboxToggle = (e, task) => {
    e.stopPropagation(); // Prevent opening task detail drawer
    onUpdateTaskStatus(task.id, 'done');
  };

  const getLogDotColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete')) return '#ef4444'; // danger
    if (act.includes('create') || act.includes('registered')) return '#10b981'; // success
    if (act.includes('login')) return '#4f46e5'; // primary
    if (act.includes('moved')) return '#0ea5e9'; // info
    return '#9ca3af'; // neutral
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      
      {/* Welcome Banner */}
      <div 
        style={{ 
          padding: '24px', 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-card)', 
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--bg-card) 60%, var(--primary-light) 100%)'
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
          {getGreeting()}, {currentUser?.name.split(' ')[0]}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          You have <strong>{myTasks.length}</strong> pending assignments in the workspace today. 
          Your team has completed <strong>{completedTasks}</strong> out of <strong>{totalTasks}</strong> total tasks ({completionRate}% rate).
        </p>
      </div>

      {/* Overview Split Grid */}
      <div className="overview-grid animate-slide-up">
        
        {/* Left Side: My Assignments Checklist */}
        <div className="overview-col">
          <div className="chart-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="card-title-sec" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={16} style={{ color: 'var(--primary)' }} /> My Active Assignments
              </h3>
              <button 
                onClick={onNavigateToBoard}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary)', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Go to Board <ArrowRight size={12} />
              </button>
            </div>

            {myTasks.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border-card)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>🎉 All caught up! No active tasks assigned to you.</p>
                <button onClick={onNavigateToBoard} className="btn btn-primary" style={{ width: 'auto', padding: '6px 14px', fontSize: '12px' }}>
                  Assign Me Tasks
                </button>
              </div>
            ) : (
              <div className="my-tasks-list">
                {myTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="my-task-item"
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="my-task-left">
                      <input 
                        type="checkbox" 
                        title="Mark completed"
                        onClick={(e) => handleCheckboxToggle(e, task)} 
                        onChange={() => {}}
                      />
                      <div>
                        <span className="my-task-title">{task.title}</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                          <span className={`category-pill ${task.category.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px' }}>{task.category}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due: {task.dueDate || 'No date'}</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px' 
            }}
          >
            <div className="chart-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Tasks Velocity</span>
                <span style={{ fontSize: '20px', fontWeight: '700' }}>{completionRate}%</span>
              </div>
              {/* Proportional circular progress bar visual */}
              <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                <svg width="38" height="38" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border-card)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--primary)" strokeWidth="3" 
                          strokeDasharray={`${completionRate} 100`} strokeDashoffset="0" transform="rotate(-90 18 18)" />
                </svg>
              </div>
            </div>

            <div className="chart-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Board Load</span>
                <span style={{ fontSize: '20px', fontWeight: '700' }}>{tasks.filter(t => t.status !== 'done').length} Open</span>
              </div>
              <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center' }}>
                <Activity size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Activity & Teammates */}
        <div className="overview-col">
          
          {/* Active Teammates */}
          <div className="chart-card">
            <h3 className="card-title-sec" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} style={{ color: 'var(--primary)' }} /> Collaborative Team
            </h3>
            <div className="active-teammates-box">
              {members.map(member => (
                <div key={member.id} className="teammate-row">
                  <div className="teammate-info">
                    <div className="card-assignee" style={{ background: member.color, width: '26px', height: '26px', fontSize: '10px' }}>
                      {member.avatar}
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '600', display: 'block' }}>{member.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{member.role}</span>
                    </div>
                  </div>
                  <span 
                    style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: member.status === 'online' ? 'var(--success)' : member.status === 'busy' ? 'var(--danger)' : 'var(--text-muted)' 
                    }} 
                    title={member.status}
                  ></span>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Timeline */}
          <div className="chart-card">
            <h3 className="card-title-sec" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: 'var(--primary)' }} /> Team Activities
            </h3>
            <div 
              style={{ 
                maxHeight: '220px', 
                overflowY: 'auto', 
                paddingRight: '6px'
              }}
            >
              {auditLogs.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No workspace updates recorded.</p>
              ) : (
                <div className="timeline-list">
                  {auditLogs.slice(-6).reverse().map(log => (
                    <div key={log.id} className="timeline-row">
                      <span className="timeline-dot-indicator" style={{ backgroundColor: getLogDotColor(log.action) }}></span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{log.action}</span>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <span>By {log.user}</span>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
