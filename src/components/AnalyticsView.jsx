import React from 'react';
import { CheckCircle2, ListTodo, Activity, Award, BarChart3, Flag, PieChart } from 'lucide-react';

export default function AnalyticsView({ tasks, members }) {
  // Metric Calculators
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status metrics
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = activeTasks;
  const reviewCount = reviewTasks;
  const doneCount = completedTasks;

  // Priority metrics
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  // SVGs pie calculation helper
  const totalPriorities = highCount + mediumCount + lowCount;
  const highPercent = totalPriorities > 0 ? (highCount / totalPriorities) * 100 : 0;
  const mediumPercent = totalPriorities > 0 ? (mediumCount / totalPriorities) * 100 : 0;
  const lowPercent = totalPriorities > 0 ? (lowCount / totalPriorities) * 100 : 0;

  // Team velocities: Completed tasks per team member
  const memberVelocities = members.map(m => {
    const assigned = tasks.filter(t => t.assigneeId === m.id);
    const completed = assigned.filter(t => t.status === 'done').length;
    return {
      name: m.name,
      avatar: m.avatar,
      color: m.color,
      completed,
      assigned: assigned.length
    };
  }).sort((a, b) => b.completed - a.completed);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Row */}
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ListTodo size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalTasks}</div>
            <div className="stat-lbl">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{completedTasks}</div>
            <div className="stat-lbl">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
            <Activity size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{activeTasks + reviewTasks}</div>
            <div className="stat-lbl">Active In-Flight</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(251,191,36,0.1)', color: 'var(--warning)' }}>
            <Award size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{completionRate}%</div>
            <div className="stat-lbl">Velocity Rate</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="charts-row">
        
        {/* Left Side: Status & Team Velocities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Progress bars */}
          <div className="chart-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Task Status Distribution
            </h3>
            <div className="progress-list">
              <div className="progress-bar-wrapper">
                <div className="progress-info">
                  <span>To Do</span>
                  <span>{todoCount} ({totalTasks > 0 ? Math.round((todoCount/totalTasks)*100) : 0}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${totalTasks > 0 ? (todoCount/totalTasks)*100 : 0}%`, backgroundColor: 'var(--text-muted)' }}></div>
                </div>
              </div>

              <div className="progress-bar-wrapper">
                <div className="progress-info">
                  <span>In Progress</span>
                  <span>{inProgressCount} ({totalTasks > 0 ? Math.round((inProgressCount/totalTasks)*100) : 0}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${totalTasks > 0 ? (inProgressCount/totalTasks)*100 : 0}%`, backgroundColor: 'var(--info)' }}></div>
                </div>
              </div>

              <div className="progress-bar-wrapper">
                <div className="progress-info">
                  <span>In Review</span>
                  <span>{reviewCount} ({totalTasks > 0 ? Math.round((reviewCount/totalTasks)*100) : 0}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${totalTasks > 0 ? (reviewCount/totalTasks)*100 : 0}%`, backgroundColor: 'var(--warning)' }}></div>
                </div>
              </div>

              <div className="progress-bar-wrapper">
                <div className="progress-info">
                  <span>Completed</span>
                  <span>{doneCount} ({totalTasks > 0 ? Math.round((doneCount/totalTasks)*100) : 0}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${totalTasks > 0 ? (doneCount/totalTasks)*100 : 0}%`, backgroundColor: 'var(--success)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member velocities */}
          <div className="chart-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: 'var(--primary)' }} /> Team Velocity (Completed Tasks)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              {memberVelocities.map(mv => (
                <div key={mv.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="card-assignee" style={{ background: mv.color, flexShrink: 0 }}>
                    {mv.avatar}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                      <span>{mv.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        <strong>{mv.completed}</strong> completed / {mv.assigned} assigned
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '6px' }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${mv.assigned > 0 ? (mv.completed / mv.assigned) * 100 : 0}%`, 
                          backgroundColor: mv.completed > 0 ? 'var(--primary)' : 'var(--border-color)' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Priority Breakdown (Circular Doughnut Widget) */}
        <div className="chart-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: 'var(--primary)' }} /> Priority Distribution
          </h3>
          <div className="priority-ring-chart">
            <div className="ring-visuals">
              {/* SVG Ring Gauge */}
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r="54" fill="transparent" stroke="var(--border-color)" strokeWidth="12" />
                
                {/* SVG stroke-dasharray doughnut simulation or concentric layered circles */}
                {totalPriorities > 0 ? (
                  <>
                    {/* Low Priority Ring Segment */}
                    <circle 
                      cx="70" cy="70" r="54" 
                      fill="transparent" 
                      stroke="var(--success)" 
                      strokeWidth="12" 
                      strokeDasharray={`${(lowPercent / 100) * 339.29} 339.29`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Medium Priority Ring Segment */}
                    <circle 
                      cx="70" cy="70" r="54" 
                      fill="transparent" 
                      stroke="var(--warning)" 
                      strokeWidth="12" 
                      strokeDasharray={`${(mediumPercent / 100) * 339.29} 339.29`}
                      strokeDashoffset={`-${(lowPercent / 100) * 339.29}`}
                      strokeLinecap="round"
                    />
                    {/* High Priority Ring Segment */}
                    <circle 
                      cx="70" cy="70" r="54" 
                      fill="transparent" 
                      stroke="var(--danger)" 
                      strokeWidth="12" 
                      strokeDasharray={`${(highPercent / 100) * 339.29} 339.29`}
                      strokeDashoffset={`-${((lowPercent + mediumPercent) / 100) * 339.29}`}
                      strokeLinecap="round"
                    />
                  </>
                ) : null}
              </svg>
              <div className="ring-text">
                {totalPriorities}
                <span>Tasks</span>
              </div>
            </div>

            <div className="priority-legends">
              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-color high"></span>
                  <span>High Priority</span>
                </div>
                <span className="legend-val">{highCount} ({Math.round(highPercent)}%)</span>
              </div>

              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-color medium"></span>
                  <span>Medium Priority</span>
                </div>
                <span className="legend-val">{mediumCount} ({Math.round(mediumPercent)}%)</span>
              </div>

              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-color low"></span>
                  <span>Low Priority</span>
                </div>
                <span className="legend-val">{lowCount} ({Math.round(lowPercent)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
