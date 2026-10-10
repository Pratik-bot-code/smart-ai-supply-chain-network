import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  ShoppingCart, 
  Truck, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Bot, 
  X,
  LogOut,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    lowStockCount,
    pendingOrdersCount,
    activeSupplyRisksCount,
    currentUser,
    logout
  } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? { count: lowStockCount, type: 'badge-amber' } : null
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? { count: pendingOrdersCount, type: 'badge-indigo' } : null
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Truck,
      badge: null
    },
    {
      id: 'forecasting',
      label: 'AI Forecasting',
      icon: TrendingUp,
      badge: { count: 'AI 98%', type: 'badge-cyan' }
    },
    {
      id: 'risks',
      label: 'Risk Analysis',
      icon: AlertTriangle,
      badge: activeSupplyRisksCount > 0 ? { count: activeSupplyRisksCount, type: 'badge-rose' } : null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 45 }} 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge">
            <div className="logo-icon-box">
              <Bot size={22} />
            </div>
            <div className="logo-text">
              <h2>SmartSupply AI</h2>
              <span>Autonomous Network</span>
            </div>
          </div>
          {mobileMenuOpen && (
            <button 
              className="icon-button" 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-label">Command Center</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <div className="nav-item-left">
                  <Icon size={18} color={isActive ? '#38bdf8' : 'currentColor'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badge.type} font-mono`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                    {item.badge.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: '1rem' }}>Active Neural Engine</div>
          <div style={{
            padding: '0.85rem',
            margin: '0 0.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e2e8f0' }}>5 Agents Synchronized</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Live telemetry monitoring stockouts, lead times & supply shocks.
            </p>
          </div>
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="user-snippet">
              <div className="user-avatar">
                {currentUser?.avatar || 'AI'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Supply Operator'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.role || 'Admin'}
                </div>
              </div>
            </div>
            <button 
              type="button" 
              className="icon-button" 
              onClick={logout} 
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
