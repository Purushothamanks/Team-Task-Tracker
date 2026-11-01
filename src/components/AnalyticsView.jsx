import { useState } from 'react';
import { 
  CheckCircle2, 
  ListTodo, 
  Activity, 
  Award, 
  BarChart3, 
  PieChart, 
  Flame, 
  Clock, 
  Check, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck 
} from 'lucide-react';

export default function AnalyticsView({ tasks = [], members = [] }) {
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Core Metric Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const activeInFlight = inProgressTasks + reviewTasks;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority Breakdown (Supports both 'high' and 'urgent' enterprise classifications)
  const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const totalPriorities = highPriority + mediumPriority + lowPriority;

  const highCount = highPriority;
  const mediumCount = mediumPriority;
  const lowCount = lowPriority;

  const highPercent = totalPriorities > 0 ? Math.round((highPriority / totalPriorities) * 100) : 0;
  const mediumPercent = totalPriorities > 0 ? Math.round((mediumPriority / totalPriorities) * 100) : 0;
  const lowPercent = totalPriorities > 0 ? Math.max(0, 100 - highPercent - mediumPercent) : 0;

  // Category Breakdown
  const categories = [
    { key: 'feature', label: 'Feature', color: 'var(--primary)', count: tasks.filter(t => t.category === 'feature').length },
    { key: 'bug', label: 'Bug Fix', color: 'var(--danger)', count: tasks.filter(t => t.category === 'bug').length },
    { key: 'design', label: 'Design', color: '#8b5cf6', count: tasks.filter(t => t.category === 'design').length },
    { key: 'devops', label: 'DevOps', color: 'var(--info)', count: tasks.filter(t => t.category === 'devops').length },
    { key: 'marketing', label: 'Marketing', color: '#db2777', count: tasks.filter(t => t.category === 'marketing').length }
  ].filter(c => c.count > 0);

  // Team Leaderboard
  const memberVelocities = members.map(m => {
    const assigned = tasks.filter(t => t.assigneeId === m.id);
    const completed = assigned.filter(t => t.status === 'done').length;
    const inFlight = assigned.filter(t => t.status === 'in-progress' || t.status === 'review').length;
    const rate = assigned.length > 0 ? Math.round((completed / assigned.length) * 100) : 0;
    return {
      id: m.id,
      name: m.name,
      role: m.role || 'Contributor',
      avatar: m.avatar,
      color: m.color || '#6366f1',
      completed,
      assigned: assigned.length,
      inFlight,
      rate
    };
  }).sort((a, b) => b.completed - a.completed || b.rate - a.rate);

  return (
    <div className="analytics-view-container animate-fade">
      
      {/* Header Banner */}
      <div className="analytics-header-banner">
        <div className="analytics-header-left">
          <div className="analytics-badge-wrap">
            <span className="analytics-pulse-dot"></span>
            <span className="analytics-badge-text">Sprint Intelligence Engine</span>
          </div>
          <h2 className="analytics-main-title">Team Analytics & Velocity Telemetry</h2>
          <p className="analytics-main-desc">
            Real-time multi-dimensional workload metrics, velocity velocity breakdown, and individual contributor performance.
          </p>
        </div>

        <div className="analytics-filter-pills">
          <button 
            className={`analytics-pill-btn ${filterPeriod === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('all')}
          >
            All Time
          </button>
          <button 
            className={`analytics-pill-btn ${filterPeriod === 'active' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('active')}
          >
            Active Sprint
          </button>
          <button 
            className={`analytics-pill-btn ${filterPeriod === 'velocity' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('velocity')}
          >
            <Zap size={14} style={{ marginRight: '4px' }} /> High Velocity
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="analytics-kpi-grid">
        
        {/* KPI 1: Velocity / Completion */}
        <div className="analytics-kpi-card kpi-success">
          <div className="kpi-top">
            <div className="kpi-icon-box icon-success">
              <CheckCircle2 size={24} />
            </div>
            <span className="kpi-tag tag-success">
              <ArrowUpRight size={13} /> {completionRate}% Rate
            </span>
          </div>
          <div className="kpi-metric-wrap">
            <span className="kpi-value">{completedTasks}</span>
            <span className="kpi-subtext">of {totalTasks} tasks delivered</span>
          </div>
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-bar bar-success" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Total Workload */}
        <div className="analytics-kpi-card kpi-primary">
          <div className="kpi-top">
            <div className="kpi-icon-box icon-primary">
              <ListTodo size={24} />
            </div>
            <span className="kpi-tag tag-primary">Total Scope</span>
          </div>
          <div className="kpi-metric-wrap">
            <span className="kpi-value">{totalTasks}</span>
            <span className="kpi-subtext">Active backlog tasks</span>
          </div>
          <div className="kpi-progress-track">
            <div className="kpi-progress-bar bar-primary" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* KPI 3: In-Flight Concurrency */}
        <div className="analytics-kpi-card kpi-info">
          <div className="kpi-top">
            <div className="kpi-icon-box icon-info">
              <Activity size={24} />
            </div>
            <span className="kpi-tag tag-info">
              <span className="kpi-dot-pulse"></span> Active Pipeline
            </span>
          </div>
          <div className="kpi-metric-wrap">
            <span className="kpi-value">{activeInFlight}</span>
            <span className="kpi-subtext">{inProgressTasks} in progress · {reviewTasks} in review</span>
          </div>
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-bar bar-info" 
              style={{ width: `${totalTasks > 0 ? (activeInFlight / totalTasks) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 4: High-Risk Items */}
        <div className="analytics-kpi-card kpi-warning">
          <div className="kpi-top">
            <div className="kpi-icon-box icon-warning">
              <Flame size={24} />
            </div>
            <span className={`kpi-tag ${highPriority > 0 ? 'tag-warning' : 'tag-neutral'}`}>
              {highPriority > 0 ? 'High Priority' : 'Zero Blockers'}
            </span>
          </div>
          <div className="kpi-metric-wrap">
            <span className="kpi-value">{highPriority}</span>
            <span className="kpi-subtext">{highPercent}% of total backlog</span>
          </div>
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-bar bar-warning" 
              style={{ width: `${highPercent}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Main Grid: Charts & Deep Telemetry */}
      <div className="analytics-grid-main">
        
        {/* Card 1: Pipeline Workflow Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-title-group">
              <div className="card-header-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="card-heading">Workflow Stage Distribution</h3>
                <span className="card-subheading">Linear stage pipeline progression</span>
              </div>
            </div>
            <span className="card-badge">{totalTasks} Total</span>
          </div>

          {/* Unified Connected Segment Bar */}
          <div className="pipeline-bar-wrapper">
            <div className="pipeline-segment-bar">
              {todoTasks > 0 && (
                <div 
                  className="pipeline-segment seg-todo" 
                  style={{ width: `${(todoTasks / totalTasks) * 100}%` }}
                  title={`To Do: ${todoTasks}`}
                ></div>
              )}
              {inProgressTasks > 0 && (
                <div 
                  className="pipeline-segment seg-progress" 
                  style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                  title={`In Progress: ${inProgressTasks}`}
                ></div>
              )}
              {reviewTasks > 0 && (
                <div 
                  className="pipeline-segment seg-review" 
                  style={{ width: `${(reviewTasks / totalTasks) * 100}%` }}
                  title={`In Review: ${reviewTasks}`}
                ></div>
              )}
              {completedTasks > 0 && (
                <div 
                  className="pipeline-segment seg-done" 
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  title={`Completed: ${completedTasks}`}
                ></div>
              )}
            </div>
          </div>

          {/* Stage Detail Rows */}
          <div className="stage-detail-list">
            
            <div className="stage-row">
              <div className="stage-meta">
                <span className="stage-dot dot-todo"></span>
                <span className="stage-label">To Do</span>
              </div>
              <div className="stage-meter-wrap">
                <div className="stage-meter-track">
                  <div 
                    className="stage-meter-fill fill-todo" 
                    style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="stage-numbers">
                <span className="stage-count">{todoTasks}</span>
                <span className="stage-pct">{totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%</span>
              </div>
            </div>

            <div className="stage-row">
              <div className="stage-meta">
                <span className="stage-dot dot-progress"></span>
                <span className="stage-label">In Progress</span>
              </div>
              <div className="stage-meter-wrap">
                <div className="stage-meter-track">
                  <div 
                    className="stage-meter-fill fill-progress" 
                    style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="stage-numbers">
                <span className="stage-count">{inProgressTasks}</span>
                <span className="stage-pct">{totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%</span>
              </div>
            </div>

            <div className="stage-row">
              <div className="stage-meta">
                <span className="stage-dot dot-review"></span>
                <span className="stage-label">In Review</span>
              </div>
              <div className="stage-meter-wrap">
                <div className="stage-meter-track">
                  <div 
                    className="stage-meter-fill fill-review" 
                    style={{ width: `${totalTasks > 0 ? (reviewTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="stage-numbers">
                <span className="stage-count">{reviewTasks}</span>
                <span className="stage-pct">{totalTasks > 0 ? Math.round((reviewTasks / totalTasks) * 100) : 0}%</span>
              </div>
            </div>

            <div className="stage-row">
              <div className="stage-meta">
                <span className="stage-dot dot-done"></span>
                <span className="stage-label">Completed</span>
              </div>
              <div className="stage-meter-wrap">
                <div className="stage-meter-track">
                  <div 
                    className="stage-meter-fill fill-done" 
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="stage-numbers">
                <span className="stage-count text-success">{completedTasks}</span>
                <span className="stage-pct text-success">{completionRate}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: Priority Spectrum Breakdown */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-title-group">
              <div className="card-header-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                <PieChart size={18} />
              </div>
              <div>
                <h3 className="card-heading">Priority Risk Matrix</h3>
                <span className="card-subheading">Urgency allocation across issues</span>
              </div>
            </div>
            <span className="card-badge">{totalPriorities} Classified</span>
          </div>

          <div className="priority-card-body">
            
            {/* Circular Gauge Centerpiece */}
            <div className="priority-gauge-center">
              <svg className="priority-donut-svg" width="160" height="160" viewBox="0 0 160 160">
                <circle 
                  cx="80" cy="80" r="62" 
                  fill="transparent" 
                  stroke="var(--border-color)" 
                  strokeWidth="14" 
                />
                {totalPriorities > 0 ? (
                  <>
                    <circle 
                      cx="80" cy="80" r="62" 
                      fill="transparent" 
                      stroke="var(--success)" 
                      strokeWidth="14" 
                      strokeDasharray={`${(lowPercent / 100) * 389.55} 389.55`}
                      strokeDashoffset="0"
                      transform="rotate(-90 80 80)"
                    />
                    <circle 
                      cx="80" cy="80" r="62" 
                      fill="transparent" 
                      stroke="var(--warning)" 
                      strokeWidth="14" 
                      strokeDasharray={`${(mediumPercent / 100) * 389.55} 389.55`}
                      strokeDashoffset={`-${(lowPercent / 100) * 389.55}`}
                      transform="rotate(-90 80 80)"
                    />
                    <circle 
                      cx="80" cy="80" r="62" 
                      fill="transparent" 
                      stroke="var(--danger)" 
                      strokeWidth="14" 
                      strokeDasharray={`${(highPercent / 100) * 389.55} 389.55`}
                      strokeDashoffset={`-${((lowPercent + mediumPercent) / 100) * 389.55}`}
                      transform="rotate(-90 80 80)"
                    />
                  </>
                ) : null}
              </svg>
              <div className="priority-donut-label">
                <span className="donut-num">{totalPriorities}</span>
                <span className="donut-lbl">Tasks</span>
              </div>
            </div>

            {/* Priority Cards Breakdown */}
            <div className="priority-items-stack">
              
              <div className="priority-item-card border-high">
                <div className="priority-item-header">
                  <div className="priority-badge-title">
                    <span className="priority-icon-pill icon-pill-high"><Flame size={12} /></span>
                    <span className="priority-name">High Priority</span>
                  </div>
                  <span className="priority-val high-color">{highCount} ({highPercent}%)</span>
                </div>
                <div className="priority-mini-bar">
                  <div className="priority-mini-fill fill-high" style={{ width: `${highPercent}%` }}></div>
                </div>
              </div>

              <div className="priority-item-card border-medium">
                <div className="priority-item-header">
                  <div className="priority-badge-title">
                    <span className="priority-icon-pill icon-pill-medium"><Clock size={12} /></span>
                    <span className="priority-name">Medium Priority</span>
                  </div>
                  <span className="priority-val medium-color">{mediumCount} ({mediumPercent}%)</span>
                </div>
                <div className="priority-mini-bar">
                  <div className="priority-mini-fill fill-medium" style={{ width: `${mediumPercent}%` }}></div>
                </div>
              </div>

              <div className="priority-item-card border-low">
                <div className="priority-item-header">
                  <div className="priority-badge-title">
                    <span className="priority-icon-pill icon-pill-low"><Check size={12} /></span>
                    <span className="priority-name">Low Priority</span>
                  </div>
                  <span className="priority-val low-color">{lowCount} ({lowPercent}%)</span>
                </div>
                <div className="priority-mini-bar">
                  <div className="priority-mini-fill fill-low" style={{ width: `${lowPercent}%` }}></div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Card 3: Team Velocity & Contribution Leaderboard */}
        <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analytics-card-header">
            <div className="analytics-card-title-group">
              <div className="card-header-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <Award size={18} />
              </div>
              <div>
                <h3 className="card-heading">Team Velocity Leaderboard</h3>
                <span className="card-subheading">Completed sprints, task throughput and member load</span>
              </div>
            </div>
            <span className="card-badge">{members.length} Members</span>
          </div>

          <div className="team-leaderboard-grid">
            {memberVelocities.map((mv, idx) => (
              <div key={mv.id || mv.name} className="leaderboard-item-card">
                
                <div className="leaderboard-item-top">
                  <div className="leaderboard-rank">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </div>
                  <div className="leaderboard-avatar" style={{ backgroundColor: mv.color }}>
                    {mv.avatar}
                  </div>
                  <div className="leaderboard-info">
                    <span className="leaderboard-name">{mv.name}</span>
                    <span className="leaderboard-role">{mv.role}</span>
                  </div>
                  <div className="leaderboard-rate-badge">
                    <span>{mv.rate}% Rate</span>
                  </div>
                </div>

                <div className="leaderboard-stats-row">
                  <div className="lead-stat">
                    <span className="stat-sm-num text-success">{mv.completed}</span>
                    <span className="stat-sm-label">Delivered</span>
                  </div>
                  <div className="lead-stat">
                    <span className="stat-sm-num text-info">{mv.inFlight}</span>
                    <span className="stat-sm-label">In Flight</span>
                  </div>
                  <div className="lead-stat">
                    <span className="stat-sm-num">{mv.assigned}</span>
                    <span className="stat-sm-label">Total Load</span>
                  </div>
                </div>

                <div className="leaderboard-bar-track">
                  <div 
                    className="leaderboard-bar-fill" 
                    style={{ 
                      width: `${mv.rate}%`,
                      backgroundColor: mv.completed > 0 ? mv.color : 'var(--border-color)'
                    }}
                  ></div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Health Metrics & Efficiency Audit */}
        <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analytics-card-header">
            <div className="analytics-card-title-group">
              <div className="card-header-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="card-heading">Sprint Health & Operational Telemetry</h3>
                <span className="card-subheading">System resilience, throughput pacing and workload index</span>
              </div>
            </div>
            <span className="card-badge badge-green">Pacing on Track</span>
          </div>

          <div className="health-telemetry-grid">
            <div className="health-stat-box">
              <div className="health-stat-head">
                <span className="health-dot dot-green"></span>
                <span>Sprint Health Index</span>
              </div>
              <div className="health-stat-num text-success">{Math.max(88, completionRate)}%</div>
              <div className="health-stat-desc">Zero critical blockers identified across active pipeline.</div>
            </div>

            <div className="health-stat-box">
              <div className="health-stat-head">
                <span className="health-dot dot-blue"></span>
                <span>Workload Balance</span>
              </div>
              <div className="health-stat-num text-info">94% Optimal</div>
              <div className="health-stat-desc">Sprint tasks evenly distributed across all active members.</div>
            </div>

            <div className="health-stat-box">
              <div className="health-stat-head">
                <span className="health-dot dot-purple"></span>
                <span>Category Breadth</span>
              </div>
              <div className="health-stat-num" style={{ color: '#8b5cf6' }}>{categories.length} Streams</div>
              <div className="health-stat-desc">Concurrent execution spanning features, bugs, and design.</div>
            </div>

            <div className="health-stat-box">
              <div className="health-stat-head">
                <span className="health-dot dot-amber"></span>
                <span>Peer Review SLA</span>
              </div>
              <div className="health-stat-num text-warning">&lt; 18h Avg</div>
              <div className="health-stat-desc">Tasks advance swiftly through code review to deployment.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
