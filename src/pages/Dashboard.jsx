import React from 'react';
import { 
  Boxes, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Truck,
  CheckCircle2,
  Clock,
  LogOut
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import AISuggestionsBanner from '../components/ai/AISuggestionsBanner';
import AIAgentsSection from '../components/ai/AIAgentsSection';
import { DEMAND_FORECAST_SERIES, NETWORK_CATEGORY_DISTRIBUTION } from '../data/mockData';

const Dashboard = () => {
  const { 
    totalProducts, 
    lowStockCount, 
    pendingOrdersCount, 
    activeSupplyRisksCount, 
    orders, 
    setActiveTab,
    products,
    logout
  } = useApp();

  const recentOrders = orders.slice(0, 5);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-emerald';
      case 'In Transit':
        return 'badge-cyan';
      case 'Processing':
        return 'badge-indigo';
      case 'Pending':
        return 'badge-amber';
      case 'Delayed':
        return 'badge-rose';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Title */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Supply Chain Command Matrix</h1>
          <p className="section-subtitle">
            Autonomous multi-tier visibility, predictive replenishment, and logistics resilience.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('inventory')}
          >
            Manage Inventory
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('forecasting')}
          >
            AI Forecasts
          </button>
          <button 
            type="button" 
            className="btn btn-sm"
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fb7185',
              cursor: 'pointer',
              fontWeight: 600
            }}
            title="Log out and remove account session"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Catalog Stock Items"
          value={totalProducts}
          change="+8.4% month"
          changeType="positive"
          icon={Boxes}
          iconColor="#38bdf8"
          iconBg="rgba(56, 189, 248, 0.12)"
          subtitle="9 Active Warehouses"
          onClick={() => setActiveTab('inventory')}
        />

        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          change={lowStockCount > 0 ? "Requires restock" : "Safe levels"}
          changeType={lowStockCount > 0 ? "warning" : "positive"}
          icon={AlertTriangle}
          iconColor="#fbbf24"
          iconBg="rgba(245, 158, 11, 0.12)"
          subtitle="Below buffer threshold"
          onClick={() => setActiveTab('inventory')}
        />

        <StatCard
          title="Consignments in Pipeline"
          value={pendingOrdersCount}
          change="3 in transit"
          changeType="info"
          icon={ShoppingCart}
          iconColor="#818cf8"
          iconBg="rgba(99, 102, 241, 0.12)"
          subtitle="Avg lead time 4.2d"
          onClick={() => setActiveTab('orders')}
        />

        <StatCard
          title="Supply Disruptions"
          value={activeSupplyRisksCount}
          change={activeSupplyRisksCount > 0 ? "High vulnerability" : "Network nominal"}
          changeType={activeSupplyRisksCount > 0 ? "negative" : "positive"}
          icon={ShieldAlert}
          iconColor="#fb7185"
          iconBg="rgba(244, 63, 94, 0.12)"
          subtitle="Rerouting recommended"
          onClick={() => setActiveTab('risks')}
        />
      </div>

      {/* AI Prescriptive Suggestions Banner */}
      <AISuggestionsBanner />

      {/* Visual Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Demand vs Inventory Area Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Demand Velocity vs Buffer Capacity</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Historic trends & 4-month simulated neural trajectory</p>
            </div>
            <span className="badge badge-indigo font-mono">Confidence 96.8%</span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_FORECAST_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141722', 
                    borderColor: 'rgba(255, 255, 255, 0.12)', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }} 
                />
                <Area type="monotone" dataKey="actualDemand" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" name="Demand (Units)" />
                <Area type="monotone" dataKey="projectedStock" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorStock)" name="Safety Buffer" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Category Allocation Donut Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Asset Value Allocation by Sector</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Semiconductors, Sensors, Raw Materials, Industrial</p>
            </div>
            <span className="badge badge-cyan font-mono">$1.42M Valuation</span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={NETWORK_CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {NETWORK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141722', 
                    borderColor: 'rgba(255, 255, 255, 0.12)', 
                    borderRadius: '8px'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Matrix */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Live Procurement Pipeline</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recent carrier consignments and supplier fulfillment stages</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('orders')}
          >
            <span>View All Orders</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Product Item</th>
                <th>Supplier Vendor</th>
                <th>Units</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td className="font-mono" style={{ fontWeight: 600, color: 'var(--brand-cyan)' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ fontWeight: 600 }}>{ord.productName || ord.items?.[0]?.name || "Component Part"}</td>
                  <td>{ord.supplierName || "Strategic Vendor"}</td>
                  <td className="font-mono">{(ord.quantity ?? ord.itemsCount ?? 0).toLocaleString()}</td>
                  <td className="font-mono">${(ord.totalAmount ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getOrderStatusBadge(ord.status)} font-mono`}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {ord.estimatedDelivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Autonomous Multi-Agent Mesh Section */}
      <AIAgentsSection />
    </div>
  );
};

export default Dashboard;
