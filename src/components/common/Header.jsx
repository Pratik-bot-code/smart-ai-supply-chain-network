import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    theme, 
    toggleTheme, 
    setMobileMenuOpen, 
    lowStockCount, 
    activeSupplyRisksCount,
    runAgent,
    agentRunning,
    currentUser,
    logout,
    showToast
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const totalAlerts = lowStockCount + activeSupplyRisksCount;

  const handleGlobalOptimization = () => {
    runAgent("agent-optimizer");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          type="button" 
          className="icon-button mobile-only" 
          onClick={() => setMobileMenuOpen(prev => !prev)}
          style={{ display: 'none' }}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search SKUs, purchase orders, vendors, or AI forecasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Run Autonomous AI Optimizer button */}
        <button
          type="button"
          className="btn btn-outline-cyan btn-sm"
          onClick={handleGlobalOptimization}
          disabled={agentRunning !== null}
          title="Execute multi-echelon neural optimization"
        >
          {agentRunning ? (
            <>
              <RefreshCw size={14} className="animate-spin-slow" />
              <span>Analyzing Network...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>Run AI Network Audit</span>
            </>
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          type="button" 
          className="icon-button" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Alerts / Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="icon-button" 
            onClick={() => setNotificationsOpen(prev => !prev)}
            aria-label="View notifications"
          >
            <Bell size={17} />
            {totalAlerts > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                backgroundColor: '#f43f5e',
                color: 'white',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #141722'
              }}>
                {totalAlerts}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              backgroundColor: '#141722',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Supply Alerts ({totalAlerts})</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Realtime Feeds</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {lowStockCount > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <ShieldAlert size={16} color="#fbbf24" />
                    <span><strong>{lowStockCount} items</strong> below safety threshold</span>
                  </div>
                )}
                {activeSupplyRisksCount > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <ShieldAlert size={16} color="#f43f5e" />
                    <span><strong>{activeSupplyRisksCount} active risks</strong> require rerouting</span>
                  </div>
                )}
                {totalAlerts === 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#10b981', padding: '0.4rem' }}>
                    <CheckCircle2 size={16} />
                    <span>All supply nodes operate nominally.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active Logged-in User Account Profile */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.3rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-light, rgba(255, 255, 255, 0.1))',
            borderRadius: 'var(--radius-full, 9999px)',
            backdropFilter: 'blur(10px)'
          }}
          title={`Active User: ${currentUser?.name || 'Employee'} (${currentUser?.email || 'Authenticated'})`}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
          }}>
            {currentUser?.avatar || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'EM')}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: 'var(--text-primary, #f8fafc)',
              maxWidth: '130px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentUser?.name || 'Employee Account'}
            </span>
            <span style={{ 
              fontSize: '0.66rem', 
              color: '#818cf8', 
              fontWeight: 600,
              maxWidth: '130px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentUser?.role || 'Supply Chain Employee'}
            </span>
          </div>
        </div>

        {/* Logout Option to clear and remove account session */}
        <button 
          type="button" 
          onClick={logout}
          className="btn btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#fb7185',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Sign Out / Remove Account Session"
          aria-label="Sign Out"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
