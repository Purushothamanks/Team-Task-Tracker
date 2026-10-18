import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag, User, MessageSquare, Plus, CheckSquare, Trash2, Edit, Check } from 'lucide-react';
import { CATEGORIES } from '../mockData';

export default function TaskDrawer({ 
  task, 
  mode, // 'add' | 'view' | 'edit'
  members, 
  currentUser,
  onClose, 
  onSave, 
  onDelete 
}) {
  const [currentMode, setCurrentMode] = useState(mode);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Feature');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Interactive checklist and comments
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Synchronize state with incoming task props
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'Feature');
      setAssigneeId(task.assigneeId || '');
      setDueDate(task.dueDate || '');
      setSubtasks(task.subtasks || []);
      setComments(task.comments || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategory('Feature');
      setAssigneeId(members[0]?.id || '');
      setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]); // 3 days default
      setSubtasks([]);
      setComments([]);
    }
    setCurrentMode(mode);
  }, [task, mode, members]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedTask = {
      id: task?.id || `task-${Date.now()}`,
      title,
      description,
      status,
      priority,
      category,
      assigneeId,
      dueDate,
      subtasks,
      comments,
      createdAt: task?.createdAt || new Date().toISOString()
    };

    onSave(savedTask);
    if (mode === 'add') {
      onClose();
    } else {
      setCurrentMode('view');
    }
  };

  const toggleSubtask = (subtaskId) => {
    const updated = subtasks.map(sub => 
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    setSubtasks(updated);
    if (currentMode === 'view' && task) {
      onSave({ ...task, subtasks: updated });
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    const updated = [...subtasks, newSub];
    setSubtasks(updated);
    setNewSubtaskTitle('');
    if (currentMode === 'view' && task) {
      onSave({ ...task, subtasks: updated });
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updated = subtasks.filter(sub => sub.id !== subtaskId);
    setSubtasks(updated);
    if (currentMode === 'view' && task) {
      onSave({ ...task, subtasks: updated });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `com-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text: newCommentText.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [...comments, newComment];
    setComments(updated);
    setNewCommentText('');
    
    if (currentMode === 'view' && task) {
      onSave({ ...task, comments: updated });
    }
  };

  const getAssignee = (id) => members.find(m => m.id === id);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="task-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <h3>
            {currentMode === 'add' && 'Create Task'}
            {currentMode === 'edit' && 'Edit Task Parameters'}
            {currentMode === 'view' && 'Task Details'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentMode === 'view' && task && (
              <button 
                onClick={() => setCurrentMode('edit')} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <Edit size={16} />
              </button>
            )}
            <button onClick={onClose} className="drawer-close">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {currentMode === 'view' && task ? (
            /* VIEW MODE TEMPLATE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              
              {/* Category & Status Row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span>
                <span className={`status-badge ${task.status}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {task.title}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Properties Grid */}
              <div className="drawer-form-grid" style={{ gap: '12px',
                  padding: '14px', 
                  backgroundColor: 'var(--bg-app)', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '12.5px'
                }}
              >
                <div>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>Assignee</span>
                  {getAssignee(task.assigneeId) ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="card-assignee" style={{ background: getAssignee(task.assigneeId).color, width: '18px', height: '18px', fontSize: '8px' }}>
                        {getAssignee(task.assigneeId).avatar}
                      </div>
                      <span style={{ fontWeight: '500' }}>{getAssignee(task.assigneeId).name}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                  )}
                </div>

                <div>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>Priority</span>
                  <span className={`priority-flag ${task.priority}`} style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flag size={12} fill={task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'} />
                    {task.priority}
                  </span>
                </div>

                <div>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>Due Date</span>
                  <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    <Calendar size={12} style={{ marginRight: '2px' }} />
                    {formatDate(task.dueDate)}
                  </span>
                </div>

                <div>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>Created</span>
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Subtasks Checklist */}
              <div className="subtasks-section">
                <div className="subtasks-title" style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
                  <span>Subtasks checklist ({subtasks.filter(s => s.completed).length}/{subtasks.length})</span>
                </div>
                <div>
                  {subtasks.map(sub => (
                    <div key={sub.id} className={`subtask-item ${sub.completed ? 'completed' : ''}`} style={{ padding: '6px 10px', fontSize: '12.5px' }}>
                      <label className="subtask-left" style={{ cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={sub.completed} 
                          onChange={() => toggleSubtask(sub.id)} 
                        />
                        <span className={sub.completed ? 'subtask-text-done' : ''}>{sub.title}</span>
                      </label>
                      <button 
                        onClick={() => handleDeleteSubtask(sub.id)} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <form onSubmit={handleAddSubtask} className="subtask-add-form" style={{ gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Add checklist subtask..."
                      className="form-input"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 10px', borderRadius: '4px' }}>
                      <Plus size={14} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Discussion Forum */}
              <div className="comments-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Discussion Thread ({comments.length})
                </h4>
                <div className="comments-list" style={{ maxHeight: '160px', gap: '8px' }}>
                  {comments.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px 0' }}>No comments posted.</p>
                  ) : (
                    comments.map(comment => {
                      const commenter = getAssignee(comment.userId);
                      return (
                        <div key={comment.id} className="comment-item" style={{ padding: '8px 10px', borderRadius: '4px', gap: '8px' }}>
                          <div className="card-assignee" style={{ background: commenter?.color || '#8b5cf6', width: '22px', height: '22px', fontSize: '9px', flexShrink: 0 }}>
                            {commenter?.avatar || comment.userName.substring(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="comment-header">
                              <span className="commenter-name" style={{ fontSize: '12px' }}>{comment.userName}</span>
                              <span className="comment-time" style={{ fontSize: '10px' }}>
                                {new Date(comment.timestamp).toLocaleDateString()} {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="comment-text" style={{ fontSize: '12px', marginTop: '2px' }}>{comment.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <form onSubmit={handleAddComment} className="comment-input-wrapper" style={{ gap: '6px', marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 12px', fontSize: '12px' }}>
                    Send
                  </button>
                </form>
              </div>

              {/* View actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button 
                  onClick={() => { onDelete(task.id); onClose(); }} 
                  className="btn" 
                  style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger-text)', padding: '8px 12px', fontSize: '12px', width: 'auto', gap: '4px' }}
                >
                  <Trash2 size={13} /> Delete Task
                </button>
              </div>

            </div>
          ) : (
            /* EDIT / ADD FORM TEMPLATE */
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Task title..."
                  className="form-input"
                  style={{ paddingLeft: '10px' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Describe task details, objectives..."
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{  gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Board Status</label>
                  <select 
                    className="form-select" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{  gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select" 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned User</label>
                  <select 
                    className="form-select" 
                    value={assigneeId} 
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ paddingLeft: '10px' }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    if (currentMode === 'edit') {
                      setCurrentMode('view');
                    } else {
                      onClose();
                    }
                  }} 
                  className="btn" 
                  style={{ width: 'auto', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', fontSize: '12px', display: 'flex', gap: '4px' }}>
                  <Check size={14} /> {currentMode === 'add' ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
