import React, { useState } from 'react';
import { Kanban, List, Calendar, ChevronRight, ChevronLeft, Flag, CheckSquare, Plus } from 'lucide-react';
import { CATEGORIES } from '../mockData';

export default function DashboardView({ 
  tasks, 
  members, 
  onTaskClick, 
  onAddTaskClick,
  onUpdateTaskStatus,
  searchQuery
}) {
  const [viewType, setViewType] = useState('kanban'); // 'kanban' | 'list'
  
  // Filters
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const getAssignee = (id) => members.find(m => m.id === id);

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Priority filter
    const matchesPriority = priorityFilter === 'all' ? true : task.priority === priorityFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' ? true : task.category === categoryFilter;
    
    // Assignee filter
    const matchesAssignee = assigneeFilter === 'all' ? true : task.assigneeId === assigneeFilter;

    return matchesSearch && matchesPriority && matchesCategory && matchesAssignee;
  });

  const columns = [
    { id: 'todo', title: 'To Do', colorClass: 'todo' },
    { id: 'in-progress', title: 'In Progress', colorClass: 'in-progress' },
    { id: 'review', title: 'In Review', colorClass: 'review' },
    { id: 'done', title: 'Completed', colorClass: 'done' }
  ];

  const getTasksByStatus = (status) => filteredTasks.filter(t => t.status === status);

  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  const handleQuickMove = (e, task, direction) => {
    e.stopPropagation(); // prevent card click details trigger
    const statuses = ['todo', 'in-progress', 'review', 'done'];
    const currentIndex = statuses.indexOf(task.status);
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < statuses.length) {
      onUpdateTaskStatus(task.id, statuses[newIndex]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      
      {/* Filters Bar */}
      <div className="filters-bar animate-fade">
        <div className="filter-groups">
          <select 
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="all">All Assignees</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {(priorityFilter !== 'all' || categoryFilter !== 'all' || assigneeFilter !== 'all') && (
            <button 
              onClick={() => { setPriorityFilter('all'); setCategoryFilter('all'); setAssigneeFilter('all'); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* View mode buttons */}
        <div className="view-tabs">
          <button 
            className={`view-tab ${viewType === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewType('kanban')}
          >
            <Kanban size={15} />
            Board
          </button>
          <button 
            className={`view-tab ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => setViewType('list')}
          >
            <List size={15} />
            List
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div 
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '80px 40px',
            backgroundColor: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            marginTop: '20px'
          }}
        >
          <CheckSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No tasks found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '320px', textAlign: 'center' }}>
            No tasks match your current filters or search query. Create a new task or adjust your parameters.
          </p>
          <button onClick={onAddTaskClick} className="btn btn-primary" style={{ width: 'auto' }}>
            <Plus size={16} /> Create Task
          </button>
        </div>
      ) : viewType === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="kanban-board animate-slide-up">
          {columns.map(col => {
            const columnTasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <span className={`column-dot ${col.colorClass}`}></span>
                    <span>{col.title}</span>
                  </div>
                  <span className="column-count">{columnTasks.length}</span>
                </div>

                <div className="cards-container">
                  {columnTasks.map(task => {
                    const assignee = getAssignee(task.assigneeId);
                    const completedSubs = task.subtasks.filter(s => s.completed).length;
                    const totalSubs = task.subtasks.length;
                    const isTaskOverdue = isOverdue(task.dueDate, task.status);

                    return (
                      <div 
                        key={task.id} 
                        className={`task-card priority-${task.priority}`}
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="card-accent-line"></div>
                        
                        <div className="task-card-header">
                          <span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span>
                          <span className={`priority-flag ${task.priority}`}>
                            <Flag size={10} fill={task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'} />
                          </span>
                        </div>

                        <h4 className="task-card-title">{task.title}</h4>
                        <p className="task-card-desc">{task.description}</p>

                        {/* Checklist progress bar */}
                        {totalSubs > 0 && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><CheckSquare size={10} /> Checklist</span>
                              <span>{Math.round((completedSubs / totalSubs) * 100)}%</span>
                            </div>
                            <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div 
                                style={{ 
                                  width: `${(completedSubs / totalSubs) * 100}%`, 
                                  height: '100%', 
                                  backgroundColor: completedSubs === totalSubs ? 'var(--success)' : 'var(--primary)' 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="task-card-footer">
                          {task.dueDate ? (
                            <span className={`due-date ${isTaskOverdue ? 'overdue' : ''}`}>
                              <Calendar size={12} />
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          ) : (
                            <span></span>
                          )}

                          <div className="task-indicators">
                            {/* Quick columns navigation */}
                            <div style={{ display: 'flex', gap: '4px', marginRight: '6px' }}>
                              {task.status !== 'todo' && (
                                <button 
                                  onClick={(e) => handleQuickMove(e, task, -1)} 
                                  title="Move Left"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                >
                                  <ChevronLeft size={14} />
                                </button>
                              )}
                              {task.status !== 'done' && (
                                <button 
                                  onClick={(e) => handleQuickMove(e, task, 1)} 
                                  title="Move Right"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                >
                                  <ChevronRight size={14} />
                                </button>
                              )}
                            </div>

                            {/* Assignee Avatar */}
                            {assignee ? (
                              <div 
                                className="card-assignee" 
                                style={{ background: assignee.color }}
                                title={assignee.name}
                              >
                                {assignee.avatar}
                              </div>
                            ) : (
                              <div 
                                className="card-assignee" 
                                style={{ background: 'var(--text-muted)' }}
                                title="Unassigned"
                              >
                                -
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW TABLE */
        <div className="list-view animate-slide-up" style={{ marginTop: '16px' }}>
          <table className="list-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const assignee = getAssignee(task.assigneeId);
                const isTaskOverdue = isOverdue(task.dueDate, task.status);

                return (
                  <tr key={task.id} onClick={() => onTaskClick(task)}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{task.title}</td>
                    <td>
                      <span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span>
                    </td>
                    <td>
                      <span className={`priority-flag ${task.priority}`} style={{ textTransform: 'capitalize' }}>
                        <Flag size={12} fill={task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      {assignee ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="card-assignee" style={{ background: assignee.color, width: '22px', height: '22px', fontSize: '9px' }}>
                            {assignee.avatar}
                          </div>
                          <span>{assignee.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                      )}
                    </td>
                    <td className={isTaskOverdue ? 'overdue' : ''} style={{ color: isTaskOverdue ? 'var(--danger)' : 'inherit', fontWeight: isTaskOverdue ? '600' : 'normal' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${task.status}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
