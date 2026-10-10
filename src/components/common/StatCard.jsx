import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconColor = '#6366f1',
  iconBg = 'rgba(99, 102, 241, 0.15)',
  subtitle,
  onClick
}) => {
  const getBadgeClass = () => {
    switch (changeType) {
      case 'positive':
        return 'badge-emerald';
      case 'negative':
        return 'badge-rose';
      case 'warning':
        return 'badge-amber';
      case 'info':
        return 'badge-cyan';
      default:
        return 'badge-gray';
    }
  };

  const renderTrendIcon = () => {
    if (changeType === 'positive') return <ArrowUpRight size={14} />;
    if (changeType === 'negative') return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  return (
    <div 
      className={`glass-card ${onClick ? 'glass-card-interactive' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-header">
        <div>
          <span className="stat-label">{title}</span>
          <div className="stat-value" style={{ marginTop: '0.4rem' }}>{value}</div>
        </div>
        {Icon && (
          <div 
            className="stat-icon-wrapper" 
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-footer" style={{ marginTop: '1rem' }}>
        {change && (
          <span className={`badge ${getBadgeClass()}`}>
            {renderTrendIcon()}
            {change}
          </span>
        )}
        {subtitle && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
