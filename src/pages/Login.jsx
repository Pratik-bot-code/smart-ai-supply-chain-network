
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
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, registerUser } = useApp();

  // Registration is the first screen.
  const [authMode, setAuthMode] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerRole, setRegisterRole] = useState(
    'Supply Chain Employee'
  );
  const [registerCompany, setRegisterCompany] = useState(
    'Nexus Global Supply Inc.'
  );
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Switch between registration and login.
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle registration.
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage(
        'Password must be at least 6 characters long.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
        company: registerCompany,
      });

      if (res && res.success) {
        setLoginEmail(registerEmail);
        setLoginPassword(registerPassword);
        setSuccessMessage(
          `Account registered for ${registerName}. You can now log in.`
        );
        setAuthMode('login');
      } else {
        setErrorMessage(
          (res && res.error) ||
          'Registration failed. Please try again.'
        );
      }
    } catch (err) {
      setErrorMessage(
        err.message ||
        'Error communicating with the authentication server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await login(
        loginEmail,
        loginPassword,
        'Supply Chain Employee',
        'Employee Account'
      );

      if (res && res.success === false) {
        setErrorMessage(
          res.error ||
          'Invalid credentials. Please register or verify your password.'
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Common input styles.
  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '0.35rem',
    color: 'var(--text-secondary)',
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  };

  const inputStyle = {
    paddingLeft: '2.5rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        background:
          'radial-gradient(ellipse at top, #141722 0%, #080a0e 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background effects */}
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
          bottom: '10%',
          right: '20%',
          pointerEvents: 'none',
        }}
      />

      {/* Main authentication card */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: authMode === 'register' ? '520px' : '460px',
          width: '100%',
          padding: '2.5rem',
          background: 'rgba(18, 21, 29, 0.94)',
          borderRadius: 'var(--radius-xl)',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-glow-indigo)',
              marginBottom: '0.85rem',
            }}
          >
            <Bot size={32} />
          </div>

          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '0.25rem',
            }}
          >
            Smart AI Supply Chain Network
          </h1>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            Autonomous Multi-Agent Logistics Intelligence Platform
          </p>

          {/* Correctly closed status badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              marginTop: '0.5rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} />
            Secure Supply Chain Access
          </div>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.35rem',
            background: 'rgba(10, 13, 20, 0.7)',
            padding: '0.3rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => switchAuthMode('register')}
            style={{
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background:
                authMode === 'register'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'transparent',
              color:
                authMode === 'register'
                  ? '#ffffff'
                  : 'var(--text-muted)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            📝 Register
          </button>

          <button
            type="button"
            onClick={() => switchAuthMode('login')}
            style={{
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background:
                authMode === 'login'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'transparent',
              color:
                authMode === 'login'
                  ? '#ffffff'
                  : 'var(--text-muted)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🔑 Sign In
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              overflowWrap: 'anywhere',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowWrap: 'anywhere',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= REGISTER FORM ================= */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            {/* Full name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor="register-name">
                Full Name
              </label>

              <div style={{ position: 'relative' }}>
                <User size={16} style={iconStyle} />
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  className="form-input"
                  style={inputStyle}
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g. Pratik Sharma"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor="register-email">
                Corporate Email Address
              </label>

              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input"
                  style={inputStyle}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="pratik@supplychain.ai"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role and company */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label style={labelStyle} htmlFor="register-role">
                  Enterprise Role
                </label>

                <div style={{ position: 'relative' }}>
                  <Briefcase size={15} style={iconStyle} />

                  <select
                    id="register-role"
                    className="form-input"
                    style={{
                      ...inputStyle,
                      fontSize: '0.8rem',
                    }}
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="Supply Chain Employee">
                      Supply Chain Employee
                    </option>
                    <option value="Operations Associate">
                      Operations Associate
                    </option>
                    <option value="Warehouse Associate">
                      Warehouse Associate
                    </option>
                    <option value="Inventory Specialist">
                      Inventory Specialist
                    </option>
                    <option value="Procurement Specialist">
                      Procurement Specialist
                    </option>
                    <option value="Logistics Coordinator">
                      Logistics Coordinator
                    </option>
                    <option value="Inventory Manager">
                      Inventory Manager
                    </option>
                    <option value="Warehouse Supervisor">
                      Warehouse Supervisor
                    </option>
                    <option value="Logistics Director">
                      Logistics Director
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="register-company">
                  Organization / Company
                </label>

                <div style={{ position: 'relative' }}>
                  <Building size={15} style={iconStyle} />

                  <input
                    id="register-company"
                    type="text"
                    required
                    className="form-input"
                    style={{
                      ...inputStyle,
                      fontSize: '0.8rem',
                    }}
                    value={registerCompany}
                    onChange={(e) => setRegisterCompany(e.target.value)}
                    placeholder="Nexus Logistics"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <label style={labelStyle} htmlFor="register-password">
                  Password
                </label>

                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={iconStyle} />

                  <input
                    id="register-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="form-input"
                    style={inputStyle}
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(e.target.value)
                    }
                    placeholder="Min 6 characters"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  style={labelStyle}
                  htmlFor="register-confirm-password"
                >
                  Confirm Password
                </label>

                <div style={{ position: 'relative' }}>
                  <KeyRound size={15} style={iconStyle} />

                  <input
                    id="register-confirm-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="form-input"
                    style={inputStyle}
                    value={registerConfirmPassword}
                    onChange={(e) =>
                      setRegisterConfirmPassword(e.target.value)
                    }
                    placeholder="Repeat password"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.925rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <span>
                {isLoading ? 'Storing in Database...' : 'Register'}
              </span>
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              Already registered in the system?{' '}
              <button
                type="button"
                onClick={() => switchAuthMode('login')}
                style={{
                  color: 'var(--brand-cyan)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Sign In to Platform
              </button>
            </div>
          </form>
        )}

        {/* ================= LOGIN FORM ================= */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {/* Login email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle} htmlFor="login-email">
                Registered Email Address
              </label>

              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />

                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input"
                  style={inputStyle}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle} htmlFor="login-password">
                Account Password
              </label>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />

                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="form-input"
                  style={inputStyle}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Remember me */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#6366f1' }}
                />
                <span>Keep Session Active</span>
              </label>

              <button
                type="button"
                onClick={() => switchAuthMode('register')}
                style={{
                  color: 'var(--brand-cyan)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Need to Register?
              </button>
            </div>

            {/* Sign-in button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.925rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <span>
                {isLoading ? 'Verifying Credentials...' : 'Sign In'}
              </span>
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              First time using the platform?{' '}
              <button
                type="button"
                onClick={() => switchAuthMode('register')}
                style={{
                  color: 'var(--brand-cyan)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Register your account first
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldCheck
            size={14}
            style={{
              display: 'inline',
              verticalAlign: 'text-bottom',
              marginRight: '0.35rem',
              color: '#10b981',
            }}
          />
          Enterprise SQLite Database Verified &amp; Encrypted
        </div>
      </div>
    </div>
  );
};

export default Login;
