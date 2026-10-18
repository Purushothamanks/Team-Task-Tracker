import React from 'react';
import { Home, Kanban, BarChart3, Users, Settings, LogOut, Sparkles, Shield, X } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, currentUser, onLogout, isOpen, onClose }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'board', label: 'Active Board', icon: <Kanban size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'team', label: 'Team Directory', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  if (currentUser?.isAdmin) {
    menuItems.push({ id: 'admin', label: 'Admin Console', icon: <Shield size={18} style={{ color: 'var(--danger)' }} /> });
  }

  const handleItemClick = (id) => {
    onViewChange(id);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Sparkles size={16} fill="white" />
            </div>
            SyncFlow
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="avatar" style={{ background: currentUser?.color || '#4f46e5' }}>
              {currentUser?.avatar || 'US'}
            </div>
            <div className="profile-info">
              <div className="profile-name">{currentUser?.name}</div>
              <div className="profile-role">{currentUser?.role}</div>
            </div>
            <button
              onClick={() => {
                if (onClose) onClose();
                onLogout();
              }}
              title="Log Out"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
