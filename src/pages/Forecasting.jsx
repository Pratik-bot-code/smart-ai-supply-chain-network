import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  Calendar, 
  Layers, 
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { DEMAND_FORECAST_SERIES } from '../data/mockData';

const Forecasting = () => {
  const { products, runAgent, agentRunning } = useApp();

  const [promoSurge, setPromoSurge] = useState(15); // percentage
  const [leadTimeFriction, setLeadTimeFriction] = useState(5); // days
  const [selectedHorizon, setSelectedHorizon] = useState('6M');

  // Dynamic forecast data calculation based on sliders
  const dynamicForecastData = DEMAND_FORECAST_SERIES.map(item => {
    const surgeMultiplier = 1 + (promoSurge / 100);
    const simulatedDemand = Math.round(item.actualDemand * surgeMultiplier);
    const simulatedSafetyStock = Math.round(simulatedDemand * 1.35 + (leadTimeFriction * 18));
    return {
      month: item.month,
      historical: item.actualDemand,
      aiForecast: simulatedDemand,
      safetyBuffer: simulatedSafetyStock
    };
  });

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>AI Demand Forecasting & Neural Trajectory</h1>
          <p className="section-subtitle">
            Deep-learning seasonal autoregression, What-If surge scenarios, and safety stock dynamics.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => runAgent('agent-demand')}
          disabled={agentRunning !== null}
        >
          {agentRunning === 'agent-demand' ? (
            <>
              <RefreshCw size={15} className="animate-spin-slow" />
              <span>Simulating Trajectory...</span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Recalibrate Neural Engine</span>
            </>
          )}
        </button>
      </div>

      {/* What-If Scenario Control Deck */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(18, 21, 29, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Sliders size={18} color="var(--brand-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Interactive What-If Scenario Laboratory</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Slider 1 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Demand Spike / Promo Surge</span>
              <span className="font-mono" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>+{promoSurge}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="60" 
              step="5"
              value={promoSurge}
              onChange={(e) => setPromoSurge(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>Baseline (0%)</span>
              <span>Extreme (+60%)</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Port Congestion Lead Delay</span>
              <span className="font-mono" style={{ color: '#fbbf24', fontWeight: 700 }}>+{leadTimeFriction} Days</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="20" 
              step="1"
              value={leadTimeFriction}
              onChange={(e) => setLeadTimeFriction(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>Normal (0d)</span>
              <span>Critical Friction (+20d)</span>
            </div>
          </div>

          {/* Forecast Horizon */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Forecast Rolling Horizon
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['3M', '6M', '12M'].map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`btn btn-sm ${selectedHorizon === h ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setSelectedHorizon(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Simulated Demand Projection vs Required Buffer</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Prophet + LSTM Hybrid model factoring macroeconomic indexes and supply shocks
            </p>
          </div>
          <span className="badge badge-emerald font-mono">98.1% Validation</span>
        </div>

        <div style={{ height: '340px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicForecastData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141722', 
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="historical" 
                stroke="#64748b" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name="Baseline Historical" 
              />
              <Line 
                type="monotone" 
                dataKey="aiForecast" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                dot={{ r: 5 }} 
                name="AI Projected Demand" 
              />
              <Line 
                type="monotone" 
                dataKey="safetyBuffer" 
                stroke="#6366f1" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Required Safety Stock" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SKU Demand Vulnerability Table */}
      <div className="glass-card">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>SKU Demand Velocity & Projected Stockout Windows</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Proactive reorder date recommendations per product category</p>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU Part</th>
                <th>Current In-Stock</th>
                <th>Monthly Run-Rate</th>
                <th>Estimated Stockout</th>
                <th>Buffer Status</th>
                <th>Autonomous Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stockDaysLeft = Math.round((p.stock / (p.minThreshold * 0.8)) * 14);
                const isUrgent = p.stock <= p.minThreshold;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>{p.sku}</div>
                    </td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>
                      {p.stock} units
                    </td>
                    <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                      ~{Math.round(p.minThreshold * 1.4)} units/mo
                    </td>
                    <td>
                      <span className="font-mono" style={{ color: isUrgent ? '#fb7185' : '#34d399', fontWeight: 600 }}>
                        {isUrgent ? 'Under 7 Days' : `~${stockDaysLeft} Days`}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isUrgent ? 'badge-rose' : 'badge-emerald'}`}>
                        {isUrgent ? 'Replenish Now' : 'Healthy Buffer'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem' }}>
                        <Zap size={13} color="#22d3ee" />
                        <span>{isUrgent ? `Execute immediate PO for +${p.minThreshold * 2} pcs` : `Maintain nominal schedule (${p.leadTimeDays}d lead)`}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
