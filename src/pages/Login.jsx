import React, { useState } from 'react';
import {
  Bot,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Database,
  Briefcase,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, registerUser } = useApp();

  // Mode: 'register' is the first screen as requested, with smooth toggle to 'login'
  const [authMode, setAuthMode] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register Form Fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerRole, setRegisterRole] = useState('Supply Chain Employee');
  const [registerCompany, setRegisterCompany] = useState('Nexus Global Supply Inc.');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Login Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
        company: registerCompany
      });

      if (res.success) {
        setSuccessMessage(`Account registered in SQLite database for ${registerName}! You can now log in.`);
        // Pre-fill login email for smooth transition
        setLoginEmail(registerEmail);
        setLoginPassword(registerPassword);

        // Smoothly transition to login view after short delay or direct switch
        setTimeout(() => {
          setAuthMode('login');
          setSuccessMessage('Credentials ready! Click "Access Autonomous Matrix" to enter.');
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(loginEmail, loginPassword, 'Supply Chain Employee', 'Employee Account');
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials. Please register or verify password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Fast Login
  const handleQuickDemoLogin = (roleName, userName, demoEmail) => {
    login(demoEmail, 'password123', roleName, userName);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      background: 'radial-gradient(ellipse at top, #141722 0%, #080a0e 100%)'
    }}>
      {/* Ambient Vignettes */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
        top: '10%',
        left: '20%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
        bottom: '10%',
        right: '20%',
        pointerEvents: 'none'
      }} />

      <div className="glass-card" style={{
        maxWidth: authMode === 'register' ? '520px' : '460px',
        width: '100%',
        padding: '2.5rem',
        background: 'rgba(18, 21, 29, 0.94)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-glow-indigo)',
            marginBottom: '0.85rem'
          }}>
            <Bot size={32} />
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
            Smart AI Supply Chain Network
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Autonomous Multi-Agent Logistics Intelligence Platform
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            marginTop: '0.5rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.72rem',
            color: '#34d399',
            fontWeight: 600
          }}>


            {/* Tab Switcher: Register (First) vs Sign In */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.35rem',
              background: 'rgba(10, 13, 20, 0.7)',
              padding: '0.3rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: authMode === 'register' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: authMode === 'register' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>📝 Register </span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: authMode === 'login' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: authMode === 'login' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>🔑 Sign In</span>
              </button>
            </div>

            {/* Feedback Alerts */}
            {errorMessage && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                marginBottom: '1.25rem'
              }}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ===================== MODE 1: REGISTER FORM ===================== */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="e.g. Pratik Sharma"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Corporate Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="pratik@supplychain.ai"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Enterprise Role
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        className="form-input"
                        style={{ paddingLeft: '2.4rem', fontSize: '0.8rem' }}
                        value={registerRole}
                        onChange={(e) => setRegisterRole(e.target.value)}
                      >
                        <option value="Supply Chain Employee">Supply Chain Employee</option>
                        <option value="Operations Associate">Operations Associate</option>
                        <option value="Warehouse Associate">Warehouse Associate</option>
                        <option value="Inventory Specialist">Inventory Specialist</option>
                        <option value="Procurement Specialist">Procurement Specialist</option>
                        <option value="Logistics Coordinator">Logistics Coordinator</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Warehouse Supervisor">Warehouse Supervisor</option>
                        <option value="Logistics Director">Logistics Director</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Organization / Company
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        required
                        className="form-input"
                        style={{ paddingLeft: '2.4rem', fontSize: '0.8rem' }}
                        value={registerCompany}
                        onChange={(e) => setRegisterCompany(e.target.value)}
                        placeholder="Nexus Logistics"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        required
                        minLength={6}
                        className="form-input"
                        style={{ paddingLeft: '2.4rem' }}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Min 6 chars"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        required
                        minLength={6}
                        className="form-input"
                        style={{ paddingLeft: '2.4rem' }}
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem' }}
                >
                  <span>{isLoading ? 'Storing in Database...' : 'Register'}</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Already registered in the system?{' '}
                  <span
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    style={{ color: 'var(--brand-cyan)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign In to Platform
                  </span>
                </div>
              </form>
            )}

            {/* ===================== MODE 2: LOGIN FORM ===================== */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  Registered Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  Account Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  <span>Keep Session Active</span>
                </label>

                <span
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                  style={{ color: 'var(--brand-cyan)', cursor: 'pointer' }}
                >
                  Need to Register?
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem' }}
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                First time using the platform?{' '}
                <span
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                  style={{ color: 'var(--brand-cyan)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register your account first
                </span>
              </div>
            </form>
          </div>


          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.35rem', color: '#10b981' }} />
            Enterprise SQLite Database Verified & Encrypted
          </div>
        </div>
      </div>
      );
};

      export default Login;                                                                                                        
