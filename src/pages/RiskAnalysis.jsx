import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Globe, 
  ArrowRight,
  TrendingDown,
  Anchor,
  Wind
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const RiskAnalysis = () => {
  const { risks, resolveRisk, runAgent, agentRunning, activeSupplyRisksCount } = useApp();

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'badge-rose';
      case 'High':
        return 'badge-amber';
      case 'Medium':
        return 'badge-indigo';
      default:
        return 'badge-gray';
    }
  };

  const getRiskIcon = (category) => {
    switch (category) {
      case 'Maritime Congestion':
        return <Anchor size={18} color="#38bdf8" />;
      case 'Weather / Extreme Climate':
        return <Wind size={18} color="#fbbf24" />;
      default:
        return <AlertTriangle size={18} color="#fb7185" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Supply Disruption & Risk Telemetry</h1>
          <p className="section-subtitle">
            Autonomous global geopolitical monitoring, maritime chokepoints, and contingency rerouting.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => runAgent('agent-risk')}
          disabled={agentRunning !== null}
        >
          {agentRunning === 'agent-risk' ? (
            <>
              <RefreshCw size={15} className="animate-spin-slow" />
              <span>Scanning Corridors...</span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Scan Global Bottlenecks</span>
            </>
          )}
        </button>
      </div>

      {/* Top Threat Indicators */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Supply Shocks</span>
            <ShieldAlert size={20} color="#fb7185" />
          </div>
          <div className="stat-value" style={{ marginTop: '0.4rem', color: activeSupplyRisksCount > 0 ? '#fb7185' : '#34d399' }}>
            {activeSupplyRisksCount} Active
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {activeSupplyRisksCount > 0 ? 'Requires intervention' : 'All corridors nominal'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Protected Inventory Value</span>
            <ShieldCheck size={20} color="#34d399" />
          </div>
          <div className="stat-value font-mono" style={{ marginTop: '0.4rem', color: '#34d399' }}>
            $640,000
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Hedged via dual-sourcing
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Network Fragility Index</span>
            <Globe size={20} color="#38bdf8" />
          </div>
          <div className="stat-value font-mono" style={{ marginTop: '0.4rem' }}>
            24.5 / 100
          </div>
          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.25rem' }}>
            Low Overall Systemic Risk
          </div>
        </div>
      </div>

      {/* Active Incident Feed */}
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Disruption Intelligence</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              AIS vessel tracking, weather radar, and port terminal strikes
            </p>
          </div>
          <span className="badge badge-rose font-mono">Real-Time Satellite Feed</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {risks.map((risk) => {
            const isResolved = risk.status === 'Resolved';

            return (
              <div 
                key={risk.id}
                style={{
                  background: isResolved ? 'rgba(18, 21, 28, 0.45)' : 'rgba(20, 24, 34, 0.8)',
                  border: `1px solid ${isResolved ? 'rgba(255, 255, 255, 0.05)' : 'var(--border-subtle)'}`,
                  borderLeft: `4px solid ${isResolved ? '#10b981' : risk.severity === 'Critical' ? '#f43f5e' : '#f59e0b'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getRiskIcon(risk.category)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isResolved ? 'var(--text-muted)' : '#f8fafc' }}>
                        {risk.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>
                        {risk.corridor} • {risk.category}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${getSeverityBadge(risk.severity)}`}>
                      {risk.severity} Severity
                    </span>
                    <span className={`badge ${isResolved ? 'badge-emerald' : 'badge-amber'} font-mono`}>
                      {risk.status}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {risk.description}
                </p>

                <div style={{
                  background: 'rgba(13, 16, 22, 0.75)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      AI Prescriptive Mitigation Strategy
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.1rem' }}>
                      {risk.suggestedAction}
                    </div>
                  </div>

                  {!isResolved && (
                    <button
                      type="button"
                      className="btn btn-emerald btn-sm"
                      onClick={() => resolveRisk(risk.id)}
                    >
                      <CheckCircle2 size={13} />
                      <span>Execute Mitigation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Maritime Chokepoints Static Matrix */}
      <div className="glass-card">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Critical Global Trade Chokepoint Health</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Automated monitoring of shipping bottlenecks affecting supply lead time</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(18, 22, 30, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Strait of Malacca</span>
              <span className="badge badge-emerald font-mono">Nominal</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Daily throughput: 16.2M bpd equivalent. Congestion index: 1.1x normal.</p>
          </div>

          <div style={{ background: 'rgba(18, 22, 30, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Suez Canal & Red Sea</span>
              <span className="badge badge-rose font-mono">Diverted</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Cape of Good Hope reroute active. Additional +9 to 14 days added to maritime transit.</p>
          </div>

          <div style={{ background: 'rgba(18, 22, 30, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Panama Canal</span>
              <span className="badge badge-amber font-mono">Draft Limited</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Freshwater lake levels stable at 44.5ft draft. Booking slots constrained.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
