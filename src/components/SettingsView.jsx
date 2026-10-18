import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, RefreshCw, Moon, Sun, Trash2 } from 'lucide-react';

export default function SettingsView({ 
  currentUser, 
  onUpdateProfile, 
  theme, 
  toggleTheme, 
  onResetWorkspaceData 
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setRole(currentUser.role || '');
    }
  }, [currentUser]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onUpdateProfile({ name: name.trim(), email: email.trim(), role });
  };

  return (
    <div className="animate-fade settings-view">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
        <Settings size={20} className="icon-align" />
        Preferences & Setup
      </h3>

      {/* Profile Section */}
      <div className="settings-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
        <h4>Workspace Identity</h4>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Display Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '42px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User className="input-icon" size={16} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <User className="input-icon" size={16} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Current Role</label>
            <div className="input-wrapper">
              <select 
                className="form-select" 
                style={{ paddingLeft: '42px', height: '42px' }}
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="DevOps Architect">DevOps Architect</option>
              </select>
              <Shield className="input-icon" size={16} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: 'auto', alignSelf: 'flex-start', padding: '8px 16px' }}>
            Update Profile
          </button>
        </form>
      </div>

      {/* Theme Section */}
      <div className="settings-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginTop: '24px' }}>
        <h4>Visual Appearance</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Select between light theme and dark theme for the SyncFlow workspace interface.
        </p>
        <button 
          onClick={toggleTheme} 
          className="btn" 
          style={{ 
            width: 'auto', 
            padding: '10px 16px', 
            display: 'flex', 
            gap: '8px', 
            backgroundColor: 'var(--bg-app)', 
            border: '1px solid var(--border-color)' 
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>Toggle theme ({theme === 'dark' ? 'Light' : 'Dark'} Mode)</span>
        </button>
      </div>

      {/* Maintenance / Danger Section */}
      <div className="settings-section" style={{ marginTop: '24px' }}>
        <h4 style={{ color: 'var(--danger-text)' }}>Workspace Maintenance</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Reinitialize localStorage data back to the default demo tasks and users. This action will clear any custom changes made.
        </p>
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to reset all tasks, comments, and member profiles to initial demo settings?")) {
              onResetWorkspaceData();
            }
          }} 
          className="btn" 
          style={{ 
            width: 'auto', 
            padding: '10px 16px', 
            display: 'flex', 
            gap: '8px', 
            backgroundColor: 'var(--danger-light)', 
            color: 'var(--danger-text)',
            border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}
        >
          <RefreshCw size={16} />
          <span>Reset Workspace Data</span>
        </button>
      </div>
    </div>
  );
}
