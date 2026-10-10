import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Cpu, 
  Database, 
  Server, 
  ShieldCheck, 
  Bell, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { settings, setSettings, showToast, theme, toggleTheme } = useApp();

  const [form, setForm] = useState({
    companyName: settings.companyName || "Nexus Global Supply Logistics Inc.",
    currency: settings.currency || "USD ($)",
    autoRestockAI: settings.autoRestockAI !== undefined ? settings.autoRestockAI : true,
    riskThreshold: settings.riskThreshold || "Medium & Critical",
    forecastHorizon: settings.forecastHorizon || "6 Months Rolling",
    aiSensitivity: settings.aiSensitivity || "Adaptive Balanced",
    fastApiEndpoint: "http://localhost:8000/api/v1",
    dbEngine: "SQLite 3.42 (Local Embedded)"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(form);
    showToast("Settings Updated", "Enterprise supply chain parameters saved successfully.", "success");
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>System Governance & Integrations</h1>
          <p className="section-subtitle">
            Configure multi-agent decision thresholds, ERP bridge, and backend API parameters.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSave}
        >
          <Save size={16} />
          <span>Save Preferences</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* General Enterprise Settings */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Globe size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Organization Identity</h3>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Operating Enterprise Name
              </label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={form.companyName}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Reporting Currency
              </label>
              <select
                name="currency"
                className="form-select"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Visual UI Interface Theme
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  style={{ flex: 1 }}
                >
                  Dark Glassmorphism
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                  style={{ flex: 1 }}
                >
                  Clean Light Mode
                </button>
              </div>
            </div>
          </div>

          {/* AI Neural Agent Thresholds */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Cpu size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Autonomous AI Engine Parameters</h3>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Neural Sensitivity Mode
              </label>
              <select
                name="aiSensitivity"
                className="form-select"
                value={form.aiSensitivity}
                onChange={handleChange}
              >
                <option value="Aggressive Proactive">Aggressive Proactive (Earlier Reorder Triggers)</option>
                <option value="Adaptive Balanced">Adaptive Balanced (Recommended for Most Warehouses)</option>
                <option value="Conservative Buffer">Conservative Buffer (Prioritize Low Holding Costs)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Disruption Alert Sensitivity
              </label>
              <select
                name="riskThreshold"
                className="form-select"
                value={form.riskThreshold}
                onChange={handleChange}
              >
                <option value="Critical Only">Critical Shocks Only</option>
                <option value="Medium & Critical">Medium & Critical (Recommended)</option>
                <option value="All Anomalies">All Telemetry Anomalies</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(18, 22, 30, 0.75)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Autonomous Reorder PO Trigger</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Allow AI agents to pre-draft POs when stock breaches min buffer</div>
              </div>
              <input
                type="checkbox"
                name="autoRestockAI"
                checked={form.autoRestockAI}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
              />
            </div>
          </div>
        </div>

        {/* Backend & Database Integration Architecture Deck */}
        <div className="glass-card" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server size={20} color="var(--brand-primary)" />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>FastAPI & SQLite Backend Architecture Bridge</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Frontend-first architecture. Ready for Python FastAPI REST & SQLite persistence.
                </p>
              </div>
            </div>
            <span className="badge badge-emerald font-mono">Frontend Operational</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(18, 22, 30, 0.75)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Server size={16} color="#818cf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>FastAPI REST Gateway</span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                {form.fastApiEndpoint}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Pydantic validation, CORS middleware, and asynchronous neural endpoints ready for Phase 2.
              </p>
            </div>

            <div style={{ background: 'rgba(18, 22, 30, 0.75)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Database size={16} color="#34d399" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Relational Database Schema</span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                {form.dbEngine}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Tables: products, orders, suppliers, risks, simulations, audit_logs.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
