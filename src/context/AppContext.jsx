import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_RISKS,
  AI_AGENTS_METADATA,
  AI_SUGGESTIONS
} from '../data/mockData';
import { backendApi } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [risks, setRisks] = useState(INITIAL_RISKS);
  const [agents, setAgents] = useState(AI_AGENTS_METADATA);
  const [suggestions, setSuggestions] = useState(AI_SUGGESTIONS);
  const [agentRunning, setAgentRunning] = useState(null);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // Authentication State: Clean session management
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('supply_chain_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('supply_chain_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Settings State
  const [settings, setSettings] = useState({
    companyName: "Nexus Global Supply Logistics Inc.",
    currency: "USD ($)",
    autoRestockAI: true,
    riskThreshold: "Medium & Critical",
    forecastHorizon: "6 Months Rolling",
    aiSensitivity: "Adaptive Balanced"
  });

  const showToast = (title, message, type = "info") => {
    const id = Date.now();
    setToastMessage({ title, message, type, id });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Auth Handlers with Backend SQLite Persistence
  const registerUser = async ({ name, email, password, role, company }) => {
    try {
      const res = await backendApi.register({ name, email, password, role, company });
      showToast("Account Registered", res.message || `Account created for ${name}! Please sign in.`, "success");
      return { success: true, user: res.user };
    } catch (err) {
      const errorMsg = err.message || "Failed to register account";
      showToast("Registration Error", errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password, fallbackRole = "Supply Chain Employee", fallbackName = "Employee Account") => {
    try {
      const res = await backendApi.login({ email, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        localStorage.setItem('supply_chain_user', JSON.stringify(res.user));
        localStorage.setItem('supply_chain_authenticated', 'true');
        setActiveTab('dashboard');
        showToast("Authentication Successful", `Welcome back, ${res.user.name} (${res.user.role})`, "success");
        return { success: true, user: res.user };
      }
    } catch (err) {
      // Demo password fallback for instant testing during presentations
      if (password === 'demo123' || password === '••••••••••••' || password === 'password123') {
        const derivedName = email ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : fallbackName;
        const initials = derivedName ? derivedName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "EM";
        const userObj = {
          name: derivedName,
          email,
          role: fallbackRole,
          company: "Nexus Global Supply Inc.",
          avatar: initials
        };
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('supply_chain_user', JSON.stringify(userObj));
        localStorage.setItem('supply_chain_authenticated', 'true');
        setActiveTab('dashboard');
        showToast("Session Active", `Logged in as ${derivedName} (${fallbackRole})`, "success");
        return { success: true, user: userObj };
      }
      showToast("Authentication Failed", err.message || "Invalid email or password", "error");
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('supply_chain_user');
    localStorage.removeItem('supply_chain_authenticated');
    showToast("Logged Out", "Account session removed. You have safely signed out.", "info");
  };

  const switchRole = (newRole) => {
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem('supply_chain_user', JSON.stringify(updated));
    showToast("Role Updated", `Account role set to ${newRole}`, "info");
  };

  // Product Actions
  const addProduct = (productData) => {
    const newId = `PRD-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct = {
      id: newId,
      sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: productData.name,
      category: productData.category || "General",
      stock: Number(productData.stock) || 0,
      minThreshold: Number(productData.minThreshold) || 50,
      maxCapacity: Number(productData.maxCapacity) || 500,
      unitCost: Number(productData.unitCost) || 10,
      leadTimeDays: Number(productData.leadTimeDays) || 7,
      supplierId: productData.supplierId || "SUP-01",
      supplierName: productData.supplierName || "Apex Semiconductor Corp",
      status: Number(productData.stock) <= Number(productData.minThreshold) ? "Low Stock" : "In Stock",
      location: productData.location || "Warehouse A - Rack 01",
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast("Product Added", `${newProduct.name} has been added to inventory catalog.`, "success");
  };

  const restockProduct = (productId, amount = 100) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedStock = p.stock + amount;
        return {
          ...p,
          stock: updatedStock,
          status: updatedStock > p.minThreshold ? "In Stock" : "Low Stock",
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
    showToast("Stock Replenished", `Added ${amount} units to product ${productId}.`, "success");
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast("Product Deleted", `Product ${productId} was removed.`, "info");
  };

  // Order Actions
  const addOrder = (orderData) => {
    const newId = `ORD-${Math.floor(9400 + Math.random() * 500)}`;
    const newOrder = {
      id: newId,
      orderNumber: `PO-2026-${Math.floor(9400 + Math.random() * 500)}`,
      customer: orderData.customer,
      destination: orderData.destination,
      itemsCount: Number(orderData.itemsCount) || 1,
      totalAmount: Number(orderData.totalAmount) || 1000,
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      priority: orderData.priority || "Standard",
      carrier: orderData.carrier || "DHL Global Express",
      estimatedDelivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: [{ name: orderData.itemName || "Automated Fulfillment Item", quantity: Number(orderData.itemsCount) || 1, unitPrice: 100 }]
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast("Purchase Order Created", `Order ${newOrder.orderNumber} placed for ${newOrder.customer}.`, "success");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast("Order Updated", `Order ${orderId} marked as ${newStatus}.`, "info");
  };

  // Supplier Actions
  const addSupplier = (supplierData) => {
    const newId = `SUP-0${suppliers.length + 1}`;
    const newSupplier = {
      id: newId,
      name: supplierData.name,
      code: supplierData.code || `VND-${Math.floor(10 + Math.random() * 89)}`,
      country: supplierData.country || "Global",
      rating: Number(supplierData.rating) || 4.5,
      reliabilityScore: Number(supplierData.reliabilityScore) || 90,
      avgLeadTime: Number(supplierData.avgLeadTime) || 14,
      activeContracts: 1,
      riskScore: supplierData.riskScore || "Low",
      category: supplierData.category || "General Componentry",
      contactEmail: supplierData.contactEmail || "contact@vendor.com",
      contactPhone: supplierData.contactPhone || "+1 (555) 019-2831",
      status: "Verified",
      onTimeRate: 92,
      esgScore: 85,
      disruptionHistory: "Newly onboarded supplier."
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    showToast("Supplier Onboarded", `${newSupplier.name} added to vendor registry.`, "success");
  };

  // Risk Actions
  const resolveRisk = (riskId) => {
    setRisks(prev => prev.map(r => r.id === riskId ? { ...r, status: "Resolved" } : r));
    showToast("Risk Mitigated", `Supply chain risk ${riskId} is marked as Resolved.`, "success");
  };

  // Apply AI Suggestion
  const applySuggestion = (suggestionId) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    if (suggestion.actionType === "RESTOCK_PRODUCT" && suggestion.productId) {
      restockProduct(suggestion.productId, suggestion.units || 150);
    } else if (suggestion.actionType === "REROUTE_SHIPMENT" && suggestion.riskId) {
      resolveRisk(suggestion.riskId);
    }

    setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s));
    showToast("AI Recommendation Applied", suggestion.title, "success");
  };

  // Trigger AI Agent Run
  const runAgent = (agentId) => {
    setAgentRunning(agentId);
    showToast("AI Agent Triggered", `Running neural simulation for ${agents.find(a => a.id === agentId)?.name}...`, "info");

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === agentId) {
          return {
            ...a,
            lastExecution: "Just now",
            badge: "Optimized",
            accuracy: `${(95 + Math.random() * 4).toFixed(1)}%`
          };
        }
        return a;
      }));
      setAgentRunning(null);
      showToast("Agent Complete", `Analysis updated with latest live telemetry.`, "success");
    }, 1200);
  };

  // Summary Metrics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === "Low Stock" || p.status === "Critical").length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const activeSupplyRisksCount = risks.filter(r => r.status === "Active").length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        mobileMenuOpen,
        setMobileMenuOpen,
        products,
        addProduct,
        restockProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrderStatus,
        suppliers,
        addSupplier,
        risks,
        resolveRisk,
        agents,
        runAgent,
        agentRunning,
        selectedAgentDetail,
        setSelectedAgentDetail,
        suggestions,
        applySuggestion,
        toastMessage,
        setToastMessage,
        showToast,
        clearToast,
        settings,
        setSettings,
        totalProducts,
        lowStockCount,
        pendingOrdersCount,
        activeSupplyRisksCount,
        currentUser,
        isAuthenticated,
        login,
        registerUser,
        logout,
        switchRole
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
