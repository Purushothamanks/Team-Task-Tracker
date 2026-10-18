import React, { useState } from 'react';
import { Shield, Users, Trash2, Calendar, FileText, Settings, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminConsoleView({ 
  members, 
  tasks, 
  currentUser, 
  auditLogs, 
  onDeleteMember, 
  onToggleAdminStatus,
  onClearLogs,
  onUpdateMemberRole
}) {
  const [roleEdits, setRoleEdits] = useState({});

  const totalAdmins = members.filter(m => m.isAdmin).length;
  const systemLogs = auditLogs || [];

  const handleRoleChange = (memberId, newRole) => {
    onUpdateMemberRole(memberId, newRole);
    setRoleEdits(prev => ({ ...prev, [memberId]: false }));
  };

  const getLogColorClass = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete')) return 'var(--danger)';
    if (act.includes('create') || act.includes('registered')) return 'var(--success)';
    if (act.includes('login') || act.includes('welcome')) return 'var(--primary)';
    if (act.includes('status') || act.includes('moved')) return 'var(--info)';
    return 'var(--text-secondary)';
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Admin stats */}
      <div className="analytics-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <Shield size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalAdmins}</div>
            <div className="stat-lbl">Active Admins</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{members.length}</div>
            <div className="stat-lbl">Registered Accounts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{tasks.length}</div>
            <div className="stat-lbl">Board Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{systemLogs.length}</div>
            <div className="stat-lbl">Audit Log Events</div>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="charts-row">
        
        {/* User Directory Manager */}
        <div className="chart-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} /> User Directory & Access Control
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {members.map(member => (
              <div 
                key={member.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '14px', 
                  backgroundColor: 'var(--bg-app)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                  <div className="card-assignee" style={{ background: member.color, width: '38px', height: '38px', fontSize: '13px' }}>
                    {member.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>{member.name}</span>
                      {member.isAdmin && (
                        <span 
                          style={{ 
                            fontSize: '9px', 
                            fontWeight: '700', 
                            backgroundColor: 'var(--danger-light)', 
                            color: 'var(--danger-text)', 
                            padding: '1px 6px', 
                            borderRadius: '10px', 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          <Shield size={8} /> ADMIN
                        </span>
                      )}
                    </div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</span>
                    
                    {/* Role editor toggle */}
                    {roleEdits[member.id] ? (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <select 
                          className="form-select" 
                          style={{ padding: '2px 6px', fontSize: '11px', height: '24px', width: '130px' }}
                          defaultValue={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        >
                          <option value="System Administrator">System Administrator</option>
                          <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                          <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                          <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                          <option value="Product Manager">Product Manager</option>
                          <option value="QA Engineer">QA Engineer</option>
                        </select>
                        <button 
                          onClick={() => setRoleEdits(prev => ({ ...prev, [member.id]: false }))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span 
                        onClick={() => member.id !== currentUser.id && setRoleEdits(prev => ({ ...prev, [member.id]: true }))}
                        style={{ fontSize: '11px', color: 'var(--primary)', cursor: member.id !== currentUser.id ? 'pointer' : 'default', display: 'block', marginTop: '2px' }}
                      >
                        {member.role} {member.id !== currentUser.id && '⚙️'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin controls */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {member.id !== currentUser.id && (
                    <>
                      <button
                        onClick={() => onToggleAdminStatus(member.id)}
                        className="btn"
                        style={{ 
                          width: 'auto', 
                          padding: '6px 12px', 
                          fontSize: '12px', 
                          backgroundColor: member.isAdmin ? 'var(--border-color)' : 'var(--primary-light)',
                          color: member.isAdmin ? 'var(--text-primary)' : 'var(--primary)'
                        }}
                      >
                        <UserCheck size={12} className="icon-align" /> {member.isAdmin ? 'Demote' : 'Make Admin'}
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${member.name} from the workspace?`)) {
                            onDeleteMember(member.id);
                          }
                        }}
                        className="btn"
                        style={{ 
                          width: 'auto', 
                          padding: '6px 12px', 
                          fontSize: '12px', 
                          backgroundColor: 'var(--danger-light)', 
                          color: 'var(--danger-text)' 
                        }}
                      >
                        <Trash2 size={12} className="icon-align" /> Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs panel */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} /> System Audit Logs
            </h3>
            {systemLogs.length > 0 && (
              <button 
                onClick={onClearLogs}
                style={{ background: 'none', border: 'none', color: 'var(--danger-text)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
              >
                Clear History
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
            {systemLogs.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                No events recorded. Perform database modifications to see activities.
              </p>
            ) : (
              systemLogs.slice(0).reverse().map((log) => (
                <div 
                  key={log.id} 
                  style={{ 
                    padding: '10px 12px', 
                    borderRadius: 'var(--radius-sm)', 
                    backgroundColor: 'var(--bg-app)', 
                    border: '1px solid var(--border-color)', 
                    borderLeft: `4px solid ${getLogColorClass(log.action)}`,
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{log.action}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>By: {log.user}</span>
                    <span>{new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
