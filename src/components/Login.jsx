import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

export default function Login({ members, onLogin, theme, toggleTheme }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Engineer');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const adminEmails = ['purushothamank.s799@gmail.com', 'purushothamanks1711@gmail.com'];
    const isAdminEmail = adminEmails.includes(email.trim().toLowerCase());

    if (isAdminEmail && password !== 'TTT@Admin1') {
      setError('Incorrect password for Administrator access.');
      return;
    }

    if (isRegister) {
      if (isAdminEmail) {
        setError('Administrator accounts cannot be registered. Please sign in directly.');
        return;
      }
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      
      // Handle signup
      const newMember = {
        id: `mem-${Date.now()}`,
        name,
        role,
        email: email.trim().toLowerCase(),
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        color: `linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%) 0%, hsl(${Math.random() * 360}, 80%, 40%) 100%)`,
        status: 'online',
        isAdmin: false
      };
      onLogin(newMember, true); // True means newly registered
    } else {
      // Handle manual login
      if (isAdminEmail) {
        let existingAdmin = members.find(m => m.email.toLowerCase() === email.trim().toLowerCase());
        if (!existingAdmin) {
          existingAdmin = {
            id: email.trim().toLowerCase() === 'purushothamank.s799@gmail.com' ? 'admin-1' : 'admin-2',
            name: email.trim().toLowerCase() === 'purushothamank.s799@gmail.com' ? 'Purushothaman K S' : 'Purushothaman K S (Alt)',
            role: 'System Administrator',
            email: email.trim().toLowerCase(),
            avatar: 'PK',
            color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            status: 'online',
            isAdmin: true
          };
        } else {
          existingAdmin = { ...existingAdmin, isAdmin: true, role: 'System Administrator' };
        }
        onLogin(existingAdmin, false);
      } else {
        // Check if user exists in members
        const existing = members.find(m => m.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          onLogin(existing, false);
        } else {
          // Fallback: create mock profile for any unknown credentials for demo purposes
          const nameFromEmail = email.split('@')[0];
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          const demoUser = {
            id: `mem-${Date.now()}`,
            name: formattedName || 'Guest User',
            role: 'Contributor',
            email: email,
            avatar: (formattedName ? formattedName[0] : 'G').toUpperCase(),
            color: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            status: 'online',
            isAdmin: false
          };
          onLogin(demoUser, false);
        }
      }
    }
  };

  const handleQuickLogin = (member) => {
    onLogin(member, false);
  };

  return (
    <div className="login-container">
      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-floating" 
        title="Toggle dark/light mode"
        aria-label="Toggle dark/light mode"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Left Column: Form */}
      <div className="login-left">
        <div className="login-bg-glow"></div>
        <div className="login-deco-pattern"></div>
        
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-symbol">
              <Sparkles size={18} fill="white" />
            </div>
            SyncFlow
          </div>

          <div className="login-header">
            <h2>{isRegister ? 'Join SyncFlow' : 'Welcome back'}</h2>
            <p>{isRegister ? 'Create an account to collaborate with your team.' : 'Sign in to access your projects and tasks.'}</p>
          </div>

          {error && (
            <div 
              style={{ 
                padding: '10px 14px', 
                backgroundColor: 'var(--danger-light)', 
                color: 'var(--danger-text)', 
                fontSize: '13px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group animate-fade">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="input-icon" size={18} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="input-icon" size={18} />
              </div>
            </div>

            {isRegister && (
              <div className="form-group animate-fade">
                <label className="form-label">Team Role</label>
                <div className="input-wrapper">
                  <select 
                    className="form-select" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={{ paddingLeft: '42px', height: '45px' }}
                  >
                    <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                    <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                    <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Specialist">DevOps Specialist</option>
                  </select>
                  <Briefcase className="input-icon" size={18} />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <span className="forgot-password">Forgot password?</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Login for demo */}
          {!isRegister && (
            <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', textAlign: 'center' }}>
                Quick demo access
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {members.slice(0, 3).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleQuickLogin(m)}
                    className="btn"
                    style={{
                      width: 'auto',
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span 
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        background: m.color, 
                        color: 'white', 
                        fontSize: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {m.avatar}
                    </span>
                    <span>{m.name.split(' ')[0]} ({m.role.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="login-footer-text">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="login-toggle-link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign In' : 'Sign Up'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Promotional Slideshow / Showcase */}
      <div className="login-right">
        <div style={{ maxWidth: '480px' }}>
          <span 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#a5b4fc', 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={14} /> Version 2.0 Launch
          </span>
          <h1 
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '44px', 
              fontWeight: '800', 
              lineHeight: '1.15', 
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            Streamline team tasks, collaborate in real-time.
          </h1>
          <p 
            style={{ 
              fontSize: '16px', 
              lineHeight: '1.6', 
              color: '#c7d2fe', 
              marginBottom: '40px',
              textAlign: 'left'
            }}
          >
            SyncFlow enables distributed teams to manage complex project workflows, analyze task productivity trends, and maintain tight delivery schedules inside a gorgeous, professional interface.
          </p>

          {/* Interactive Feature Glass Card */}
          <div 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.06)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)', 
              padding: '24px', 
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#4f46e5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold' 
                }}
              >
                AR
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>Hero Design Approved</p>
                <p style={{ fontSize: '12px', color: '#a5b4fc' }}>Design Team • High Priority</p>
              </div>
            </div>
            {/* Simulated progress slider */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Subtasks Progress</span>
                <span>75%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic circular glowing vectors in background */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '-10%', 
            right: '-10%', 
            width: '400px', 
            height: '400px', 
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)', 
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        ></div>
        <div 
          style={{ 
            position: 'absolute', 
            top: '-10%', 
            right: '10%', 
            width: '300px', 
            height: '300px', 
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)', 
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        ></div>
      </div>
    </div>
  );
}
