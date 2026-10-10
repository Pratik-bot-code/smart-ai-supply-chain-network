import React from 'react';
import { 
  Bot, 
  Play, 
  Cpu, 
  Activity, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AIAgentsSection = () => {
  const { agents, runAgent, agentRunning, setSelectedAgentDetail } = useApp();

  const getAgentIcon = (id) => {
    switch (id) {
      case 'agent-demand':
        return <TrendingUp size={20} color="#38bdf8" />;
      case 'agent-stock':
        return <Layers size={20} color="#34d399" />;
      case 'agent-risk':
        return <AlertCircle size={20} color="#fb7185" />;
      case 'agent-supplier':
        return <Sparkles size={20} color="#fbbf24" />;
      case 'agent-optimizer':
      default:
        return <Cpu size={20} color="#a855f7" />;
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={22} color="var(--brand-primary)" />
            Autonomous AI Multi-Agent Mesh
          </h2>
          <p className="section-subtitle">
            5 specialized neural agents continuously simulating supply routes, buffer safety, and inventory velocities.
          </p>
        </div>
      </div>

      <div className="agents-grid">
        {agents.map((agent) => {
          const isRunning = agentRunning === agent.id;

          return (
            <div key={agent.id} className="glass-card glass-card-interactive agent-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {getAgentIcon(agent.id)}
                  </div>
                  <span className="badge badge-indigo font-mono" style={{ fontSize: '0.7rem' }}>
                    {agent.accuracy} Acc
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#f8fafc' }}>
                  {agent.name}
                </h3>
                <div style={{ fontSize: '0.725rem', color: 'var(--brand-cyan)', fontWeight: 600, marginBottom: '0.65rem' }}>
                  {agent.architecture}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {agent.description}
                </p>
              </div>

              <div>
                <div style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(20, 24, 34, 0.75)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    <span>Telemetry Status</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Last Inferred</span>
                    <span className="font-mono" style={{ color: '#cbd5e1' }}>{agent.lastExecution}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => runAgent(agent.id)}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw size={13} className="animate-spin-slow" />
                        <span>Inferring...</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        <span>Run Model</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedAgentDetail(agent)}
                    title="Inspect telemetry & decision trees"
                  >
                    <Activity size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIAgentsSection;
