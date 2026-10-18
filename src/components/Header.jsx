import React, { useState } from 'react';
import { Search, Plus, Bell, Sun, Moon, Sparkles, CheckSquare, Menu } from 'lucide-react';

export default function Header({ 
  activeView, 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  onAddTaskClick,
  currentUser,
  onToggleMobileMenu
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Marcus Chen moved 'CI/CD Pipeline' to Review", time: "10 mins ago", read: false },
    { id: 2, text: "Sophia Martinez commented on 'Landing Page hero section'", time: "1 hour ago", read: false },
    { id: 3, text: "Alex Rivera completed subtask on 'Figma screens'", time: "2 hours ago", read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getActiveLabel = () => {
    switch (activeView) {
      case 'overview': return 'Overview';
      case 'board': return 'Active Board';
      case 'analytics': return 'Analytics';
      case 'team': return 'Team Directory';
      case 'settings': return 'Settings';
      case 'admin': return 'Admin Console';
      default: return 'Workspace';
    }
  };

  return (
    <header className="header animate-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <span className="breadcrumb-root">SyncFlow</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-active">{getActiveLabel()}</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Search bar - only shown on Dashboard view */}
        {activeView === 'board' && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="search-icon" size={16} />
          </div>
        )}

        {/* Global theme toggler */}
        <button
          onClick={toggleTheme}
          className="btn-icon-header"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{ cursor: 'pointer' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications dropdown trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon-header"
            title="Notifications"
            style={{ cursor: 'pointer' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-dot"></span>}
          </button>

          {showNotifications && (
            <div 
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 200,
                padding: '16px',
                animation: 'slideUp 0.2s ease-out'
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '8px'
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No updates.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      style={{ 
                        padding: '8px 10px', 
                        borderRadius: 'var(--radius-sm)', 
                        backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                        border: '1px solid var(--border-color)',
                        fontSize: '12px',
                        textAlign: 'left'
                      }}
                    >
                      <p style={{ color: 'var(--text-primary)', fontWeight: n.read ? '400' : '600', marginBottom: '4px' }}>{n.text}</p>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Task Creation Trigger */}
        {activeView === 'board' && (
          <button
            onClick={onAddTaskClick}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '8px 16px', height: '38px', gap: '6px' }}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        )}
      </div>
    </header>
  );
}
