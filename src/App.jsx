import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Toast from './components/common/Toast';
import Modal from './components/common/Modal';

// Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Forecasting from './pages/Forecasting';
import RiskAnalysis from './pages/RiskAnalysis';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

const MainLayout = () => {
  const { 
    activeTab, 
    isAuthenticated, 
    selectedAgentDetail, 
    setSelectedAgentDetail,
    runAgent,
    agentRunning
  } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'orders':
        return <Orders />;
      case 'suppliers':
        return <Suppliers />;
      case 'forecasting':
        return <Forecasting />;
      case 'risks':
        return <RiskAnalysis />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Header />
        <main className="content-body">
          {renderActivePage()}
        </main>
      </div>

      <Toast />

      {/* Global AI Agent Telemetry Inspector Modal */}
      {selectedAgentDetail && (
        <Modal
          isOpen={Boolean(selectedAgentDetail)}
          onClose={() => setSelectedAgentDetail(null)}
          title={`Neural Telemetry: ${selectedAgentDetail.name}`}
          maxWidth="640px"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)'
              }}>
                <Cpu size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedAgentDetail.name}</h4>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>
                  Architecture: {selectedAgentDetail.architecture}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {selectedAgentDetail.description}
            </p>

            <div style={{
              background: 'rgba(20, 24, 34, 0.85)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence Metric</span>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                  {selectedAgentDetail.accuracy}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cycle Execution</span>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#cbd5e1' }}>
                  {selectedAgentDetail.lastExecution}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Synthetic Decision Pipeline Logs
              </h5>
              <div className="font-mono" style={{
                background: '#0a0d14',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                color: '#818cf8',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div>[INFO] Loading feature vector: lead_time, demand_velocity, freight_index</div>
                <div>[INFO] Applying Monte Carlo simulation (N=10,000 iterations)...</div>
                <div>[OPTIMAL] Converged on 99.4% service level constraint.</div>
                <div>[OUTPUT] Prescriptive action sent to orchestrator matrix.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedAgentDetail(null)}
              >
                Close Inspector
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  runAgent(selectedAgentDetail.id);
                  setSelectedAgentDetail(null);
                }}
                disabled={agentRunning !== null}
              >
                <RefreshCw size={14} className={agentRunning ? "animate-spin-slow" : ""} />
                <span>Re-execute Node</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#0a0c10',
          color: '#f9fafb',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '520px', background: '#131722', border: '1px solid rgba(244, 63, 94, 0.4)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <h2 style={{ color: '#f43f5e', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Neural Grid Desynchronization</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              A UI rendering exception occurred: {this.state.error?.message || "Unknown State"}.
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              Reset Session State & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

