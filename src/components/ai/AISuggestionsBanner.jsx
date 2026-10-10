import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AISuggestionsBanner = () => {
  const { suggestions, applySuggestion } = useApp();

  const activeSuggestions = suggestions.filter(s => !s.applied);

  if (activeSuggestions.length === 0) {
    return (
      <div className="glass-card" style={{ marginBottom: '1.75rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981' }}>
          <ShieldCheck size={22} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>Supply Network In Optimal State</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All AI automated interventions executed. Safety buffers and order pipelines are balanced.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#22d3ee" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Autonomous Recommendations ({activeSuggestions.length})</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Realtime Prescriptive Actions</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activeSuggestions.slice(0, 3).map((item) => (
          <div 
            key={item.id}
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              borderLeft: `4px solid ${item.priority === 'High' ? '#f43f5e' : item.priority === 'Medium' ? '#f59e0b' : '#06b6d4'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee',
                flexShrink: 0
              }}>
                <Zap size={18} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc' }}>{item.title}</span>
                  <span className={`badge ${item.priority === 'High' ? 'badge-rose' : 'badge-amber'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                    {item.priority} Priority
                  </span>
                  <span className="badge badge-cyan font-mono" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                    {item.impact}
                  </span>
                </div>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {item.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-emerald btn-sm"
              onClick={() => applySuggestion(item.id)}
              style={{ flexShrink: 0 }}
            >
              <span>Apply Fix</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestionsBanner;
