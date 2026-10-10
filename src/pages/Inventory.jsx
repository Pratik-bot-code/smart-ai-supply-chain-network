import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  Boxes, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const Inventory = () => {
  const { 
    products, 
    addProduct, 
    restockProduct, 
    deleteProduct, 
    suppliers,
    searchQuery: globalSearchQuery 
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new SKU
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Semiconductors',
    stock: 50,
    minThreshold: 40,
    maxCapacity: 500,
    unitCost: 25.00,
    leadTimeDays: 14,
    supplierId: suppliers[0]?.id || 'SUP-01',
    location: 'Warehouse A - Bay 01'
  });

  const query = (localSearch || globalSearchQuery || '').toLowerCase();

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query) || 
                          item.sku.toLowerCase().includes(query) ||
                          item.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'minThreshold' || name === 'maxCapacity' || name === 'leadTimeDays'
        ? parseInt(value) || 0
        : name === 'unitCost'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    const supplier = suppliers.find(s => s.id === formData.supplierId);
    addProduct({
      ...formData,
      supplierName: supplier?.name || "Global Tier-1 Vendor"
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      sku: '',
      category: 'Semiconductors',
      stock: 50,
      minThreshold: 40,
      maxCapacity: 500,
      unitCost: 25.00,
      leadTimeDays: 14,
      supplierId: suppliers[0]?.id || 'SUP-01',
      location: 'Warehouse A - Bay 01'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return 'badge-emerald';
      case 'Low Stock':
        return 'badge-amber';
      case 'Critical':
        return 'badge-rose';
      default:
        return 'badge-gray';
    }
  };

  const categories = ['All', 'Semiconductors', 'Sensors', 'Raw Materials', 'Robotics', 'Power Systems', 'Microcontrollers'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Critical'];

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Warehouse Inventory & Buffer Matrix</h1>
          <p className="section-subtitle">
            Autonomous stock health, replenishment triggers, and SKU lead time telemetry.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add New SKU Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card filter-bar" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Filter by SKU code, item name, or category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(st => (
              <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container" style={{ marginTop: '1.25rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>SKU / Product Name</th>
              <th>Category</th>
              <th>Buffer Capacity & Stock</th>
              <th>Unit Cost</th>
              <th>Lead Time</th>
              <th>Status</th>
              <th>Warehouse</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No inventory items match your search criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => {
                const stockPercentage = Math.min(100, Math.round((item.stock / (item.maxCapacity || 500)) * 100));
                const isUnderThreshold = item.stock <= item.minThreshold;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{item.name}</div>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>
                        {item.sku}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{item.category}</span>
                    </td>
                    <td style={{ minWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                        <span className="font-mono"><strong>{item.stock}</strong> units</span>
                        <span style={{ color: 'var(--text-muted)' }}>Min: {item.minThreshold}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${stockPercentage}%`, 
                            height: '100%', 
                            background: item.status === 'Critical' ? '#f43f5e' : item.status === 'Low Stock' ? '#f59e0b' : '#10b981',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </td>
                    <td className="font-mono">${item.unitCost.toFixed(2)}</td>
                    <td className="font-mono">{item.leadTimeDays} days</td>
                    <td>
                      <span className={`badge ${getStatusBadge(item.status)} font-mono`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.location}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => restockProduct(item.id, 100)}
                          title="Instant Restock +100 Units"
                        >
                          <RefreshCw size={12} />
                          <span>+100</span>
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          style={{ width: '32px', height: '32px', color: '#f43f5e' }}
                          onClick={() => deleteProduct(item.id)}
                          title="Decommission SKU"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Inventory SKU"
        maxWidth="560px"
      >
        <form onSubmit={handleCreateProduct}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                SKU Identifier *
              </label>
              <input
                type="text"
                name="sku"
                required
                className="form-input font-mono"
                placeholder="e.g. ELEC-PWR-99"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Category *
              </label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Semiconductors">Semiconductors</option>
                <option value="Sensors">Sensors</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Robotics">Robotics</option>
                <option value="Power Systems">Power Systems</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Ultra-Fast Optical Isolator IC"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Initial Stock Units
              </label>
              <input
                type="number"
                name="stock"
                className="form-input font-mono"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Safety Buffer Min Threshold
              </label>
              <input
                type="number"
                name="minThreshold"
                className="form-input font-mono"
                value={formData.minThreshold}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Unit Cost ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                name="unitCost"
                className="form-input font-mono"
                value={formData.unitCost}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Lead Time (Days)
              </label>
              <input
                type="number"
                name="leadTimeDays"
                className="form-input font-mono"
                value={formData.leadTimeDays}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Assigned Supplier Partner
            </label>
            <select
              name="supplierId"
              className="form-select"
              value={formData.supplierId}
              onChange={handleInputChange}
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
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
              Register Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
