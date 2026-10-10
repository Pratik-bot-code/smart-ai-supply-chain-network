import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Star, 
  Award, 
  CheckCircle, 
  ExternalLink, 
  BarChart3, 
  Globe, 
  ShieldCheck,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const Suppliers = () => {
  const { suppliers, addSupplier, searchQuery: globalSearchQuery } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Semiconductors',
    location: 'Munich, Germany',
    contact: '',
    reliabilityScore: 92,
    qualityScore: 95,
    onTimeRate: 90,
    avgLeadTimeDays: 14,
    esgRating: 'A',
    status: 'Active'
  });

  const query = (localSearch || globalSearchQuery || '').toLowerCase();

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(query) ||
                          s.category.toLowerCase().includes(query) ||
                          s.location.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'reliabilityScore' || name === 'qualityScore' || name === 'onTimeRate' || name === 'avgLeadTimeDays'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleCreateSupplier = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addSupplier(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: 'Semiconductors',
      location: 'Munich, Germany',
      contact: '',
      reliabilityScore: 92,
      qualityScore: 95,
      onTimeRate: 90,
      avgLeadTimeDays: 14,
      esgRating: 'A',
      status: 'Active'
    });
  };

  // Comparison benchmark data
  const comparisonChartData = suppliers.slice(0, 4).map(s => ({
    name: s.name.split(' ')[0],
    reliability: s.reliabilityScore,
    quality: s.qualityScore,
    onTime: s.onTimeRate
  }));

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Strategic Supplier & Vendor Ecosystem</h1>
          <p className="section-subtitle">
            Vendor reliability benchmarking, lead time compliance, and AI vendor matching.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setIsCompareModalOpen(true)}
          >
            <Scale size={16} />
            <span>AI Benchmark Matrix</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Onboard Supplier</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card filter-bar" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search vendor name, territory, component category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <select 
          className="form-select" 
          style={{ width: 'auto', minWidth: '170px' }}
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Vendor Categories</option>
          <option value="Semiconductors">Semiconductors</option>
          <option value="Sensors & Optics">Sensors & Optics</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Robotics & Motion">Robotics & Motion</option>
          <option value="Power Electronics">Power Electronics</option>
        </select>
      </div>

      {/* Suppliers Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{supplier.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-cyan)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    <Globe size={13} />
                    <span>{supplier.location}</span>
                  </div>
                </div>
                <span className={`badge ${supplier.status === 'Tier-1 Strategic' ? 'badge-indigo' : 'badge-emerald'}`}>
                  {supplier.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>{supplier.category}</span>
                <span className="badge badge-cyan font-mono" style={{ fontSize: '0.72rem' }}>ESG: {supplier.esgRating}</span>
              </div>

              {/* Metric Scores */}
              <div style={{
                background: 'rgba(18, 22, 30, 0.75)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                textAlign: 'center',
                gap: '0.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reliability</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                    {supplier.reliabilityScore}%
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quality</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                    {supplier.qualityScore}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>On-Time</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                    {supplier.onTimeRate}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                <span>Avg Factory Lead Time:</span>
                <span className="font-mono" style={{ fontWeight: 600, color: '#f8fafc' }}>{supplier.avgLeadTimeDays} days</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Vendor Contact:</span>
                <span className="font-mono" style={{ color: 'var(--brand-cyan)' }}>{supplier.contact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Modal */}
      <Modal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        title="AI Vendor Multi-Criteria Performance Benchmark"
        maxWidth="750px"
      >
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Neural evaluation comparing top tier vendors across operational reliability, manufacturing quality tolerance, and on-time fulfillment velocity.
          </p>

          <div style={{ height: '300px', width: '100%', marginBottom: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" domain={[80, 100]} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141722', 
                    borderColor: 'rgba(255, 255, 255, 0.12)', 
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="reliability" name="Reliability Score" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="Quality Acceptance" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" name="On-Time Delivery" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCompareModalOpen(false)}
            >
              Close Benchmark
            </button>
          </div>
        </div>
      </Modal>

      {/* Onboard Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Supplier Vendor"
        maxWidth="560px"
      >
        <form onSubmit={handleCreateSupplier}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Vendor Legal Company Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Kyoto Precision Dynamics"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Manufacturing Category
              </label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Semiconductors">Semiconductors</option>
                <option value="Sensors & Optics">Sensors & Optics</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Robotics & Motion">Robotics & Motion</option>
                <option value="Power Electronics">Power Electronics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Headquarters Territory
              </label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Reliability (%)
              </label>
              <input
                type="number"
                name="reliabilityScore"
                className="form-input font-mono"
                value={formData.reliabilityScore}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Quality Score (%)
              </label>
              <input
                type="number"
                name="qualityScore"
                className="form-input font-mono"
                value={formData.qualityScore}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Lead Time (Days)
              </label>
              <input
                type="number"
                name="avgLeadTimeDays"
                className="form-input font-mono"
                value={formData.avgLeadTimeDays}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Procurement Representative Email
            </label>
            <input
              type="email"
              name="contact"
              className="form-input font-mono"
              placeholder="vendor.contact@company.com"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Onboard Vendor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
