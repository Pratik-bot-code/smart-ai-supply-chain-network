import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const Orders = () => {
  const { 
    orders, 
    addOrder, 
    updateOrderStatus, 
    products, 
    suppliers,
    searchQuery: globalSearchQuery 
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    supplierId: suppliers[0]?.id || '',
    quantity: 100,
    carrier: 'DHL Global Express',
    priority: 'High',
    shippingCost: 350
  });

  const query = (localSearch || globalSearchQuery || '').toLowerCase();

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(query) ||
                          ord.productName.toLowerCase().includes(query) ||
                          ord.supplierName.toLowerCase().includes(query) ||
                          ord.carrier.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ord.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const inTransitCount = orders.filter(o => o.status === 'In Transit').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'shippingCost' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === formData.productId) || products[0];
    const supplier = suppliers.find(s => s.id === formData.supplierId) || suppliers[0];

    const totalAmount = (product.unitCost * formData.quantity) + formData.shippingCost;

    addOrder({
      productId: product.id,
      productName: product.name,
      supplierId: supplier.id,
      supplierName: supplier.name,
      quantity: formData.quantity,
      totalAmount,
      carrier: formData.carrier,
      priority: formData.priority,
      status: 'Pending',
      estimatedDelivery: '5 days'
    });

    setIsCreateModalOpen(false);
  };

  const advanceStatus = (orderId, currentStatus) => {
    const statusCycle = ['Pending', 'Processing', 'In Transit', 'Delivered'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < statusCycle.length - 1) {
      updateOrderStatus(orderId, statusCycle[currentIndex + 1]);
    }
  };

  const getStatusBadge = (status) => {
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
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Procurement Orders & Shipments</h1>
          <p className="section-subtitle">
            Autonomous purchase orders, multicarrier tracking, and fulfillment milestones.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={16} />
          <span>Issue Purchase Order</span>
        </button>
      </div>

      {/* KPI Top Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total POs Placed</span>
            <ShoppingCart size={18} color="#818cf8" />
          </div>
          <div className="stat-value" style={{ marginTop: '0.4rem', fontSize: '1.5rem' }}>{orders.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '0.25rem' }}>Enterprise Pipeline</div>
        </div>

        <div className="glass-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Freight In-Transit</span>
            <Truck size={18} color="#38bdf8" />
          </div>
          <div className="stat-value" style={{ marginTop: '0.4rem', fontSize: '1.5rem' }}>{inTransitCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '0.25rem' }}>Active Global Waybills</div>
        </div>

        <div className="glass-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fulfillment Completed</span>
            <CheckCircle size={18} color="#34d399" />
          </div>
          <div className="stat-value" style={{ marginTop: '0.4rem', fontSize: '1.5rem' }}>{deliveredCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.25rem' }}>100% Quality Acceptance</div>
        </div>

        <div className="glass-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Committed Capital</span>
            <DollarSign size={18} color="#fbbf24" />
          </div>
          <div className="stat-value font-mono" style={{ marginTop: '0.4rem', fontSize: '1.5rem' }}>
            ${totalSpend.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '0.25rem' }}>FY26 Logistics Budget</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card filter-bar" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search PO reference, part name, carrier or vendor..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '140px' }}
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container" style={{ marginTop: '1.25rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Product / SKU</th>
              <th>Vendor</th>
              <th>Units & Value</th>
              <th>Carrier & Tracking</th>
              <th>Priority</th>
              <th>Status</th>
              <th>ETA</th>
              <th style={{ textAlign: 'right' }}>Lifecycle Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No purchase orders found matching current filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-cyan)' }}>
                      {ord.orderNumber}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ord.orderDate}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ord.productName || ord.items?.[0]?.name || "Component Part"}</div>
                  </td>
                  <td>{ord.supplierName || "Strategic Vendor"}</td>
                  <td>
                    <div className="font-mono" style={{ fontWeight: 700 }}>
                      {(ord.quantity ?? ord.itemsCount ?? 0).toLocaleString()} pcs
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      ${(ord.totalAmount ?? 0).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div>{ord.carrier}</div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: '#818cf8' }}>
                      {ord.trackingNumber}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ord.priority === 'Urgent' ? 'badge-rose' : ord.priority === 'High' ? 'badge-amber' : 'badge-gray'}`}>
                      {ord.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(ord.status)} font-mono`}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {ord.estimatedDelivery}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {ord.status !== 'Delivered' ? (
                      <button
                        type="button"
                        className="btn btn-outline-cyan btn-sm"
                        onClick={() => advanceStatus(ord.id, ord.status)}
                        title="Advance fulfillment lifecycle"
                      >
                        <span>Next Step</span>
                        <ChevronRight size={12} />
                      </button>
                    ) : (
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        Archived
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Issue New Consignment Purchase Order"
        maxWidth="580px"
      >
        <form onSubmit={handleCreateOrder}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Select Item SKU *
            </label>
            <select
              name="productId"
              className="form-select"
              value={formData.productId}
              onChange={handleInputChange}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.sku} - {p.name} (${p.unitCost}/unit)
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Target Supplier Vendor *
            </label>
            <select
              name="supplierId"
              className="form-select"
              value={formData.supplierId}
              onChange={handleInputChange}
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - Reliability {s.reliabilityScore}% ({s.location})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Order Quantity (Units) *
              </label>
              <input
                type="number"
                name="quantity"
                required
                className="form-input font-mono"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Fulfillment Priority
              </label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Urgent">Urgent (Express)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Logistics Carrier
              </label>
              <select
                name="carrier"
                className="form-select"
                value={formData.carrier}
                onChange={handleInputChange}
              >
                <option value="DHL Global Express">DHL Global Express</option>
                <option value="FedEx Supply Chain Air">FedEx Supply Chain Air</option>
                <option value="Maersk Intermodal">Maersk Intermodal</option>
                <option value="UPS Worldwide Freight">UPS Worldwide Freight</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Freight & Handling Cost ($)
              </label>
              <input
                type="number"
                name="shippingCost"
                className="form-input font-mono"
                value={formData.shippingCost}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Generate Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
