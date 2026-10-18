import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Award, CheckSquare, Plus, X } from 'lucide-react';

export default function TeamView({ members, tasks, onAddMember }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Engineer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('online');

  const getMemberStats = (memberId) => {
    const assigned = tasks.filter(t => t.assigneeId === memberId);
    const completed = assigned.filter(t => t.status === 'done').length;
    return {
      assignedCount: assigned.length,
      completedCount: completed
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember = {
      id: `mem-${Date.now()}`,
      name: name.trim(),
      role,
      email: email.trim(),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      color: `linear-gradient(135deg, hsl(${Math.random() * 360}, 75%, 65%) 0%, hsl(${Math.random() * 360}, 85%, 45%) 100%)`,
      status
    };

    onAddMember(newMember);
    
    // reset form
    setName('');
    setEmail('');
    setRole('Senior Engineer');
    setStatus('online');
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Collaborators Roster</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>You have {members.length} team members registered in this workspace.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-primary"
          style={{ width: 'auto', display: 'flex', gap: '8px', padding: '8px 16px' }}
        >
          <UserPlus size={16} />
          <span>Add Teammate</span>
        </button>
      </div>

      {/* Grid of Team Cards */}
      <div className="team-grid animate-slide-up">
        {members.map(member => {
          const { assignedCount, completedCount } = getMemberStats(member.id);

          return (
            <div key={member.id} className="member-card">
              <div className="member-avatar-wrapper">
                <div className="member-avatar" style={{ background: member.color }}>
                  {member.avatar}
                </div>
                <span className={`status-indicator ${member.status}`} title={member.status}></span>
              </div>

              <h4 className="member-name">{member.name}</h4>
              <div className="member-role" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Shield size={12} style={{ color: 'var(--primary)' }} />
                <span>{member.role}</span>
              </div>
              <div className="member-email" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Mail size={11} />
                <span>{member.email}</span>
              </div>

              <div className="member-stats">
                <div className="member-stat-col" style={{ borderRight: '1px solid var(--border-color)' }}>
                  <div className="member-stat-val" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <CheckSquare size={13} style={{ color: 'var(--primary)' }} />
                    {assignedCount}
                  </div>
                  <div className="member-stat-lbl">Assigned</div>
                </div>
                <div className="member-stat-col">
                  <div className="member-stat-val" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Award size={13} style={{ color: 'var(--success)' }} />
                    {completedCount}
                  </div>
                  <div className="member-stat-lbl">Completed</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Teammate Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Teammate</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@company.com"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Workspace Role</label>
                  <select 
                    className="form-select" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Product Manager">Product Manager</option>
                    <option value="Senior Engineer">Senior Engineer</option>
                    <option value="Lead Designer">Lead Designer</option>
                    <option value="QA Tester">QA Tester</option>
                    <option value="DevOps Lead">DevOps Lead</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Active Status</label>
                  <select 
                    className="form-select" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="btn" 
                  style={{ width: 'auto', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
