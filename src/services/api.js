  // ==============================================================================
  // Smart AI Supply Chain Network - FastAPI Backend Connector
  // Connects React frontend directly to FastAPI server running on http://localhost:8000
  // ==============================================================================

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  export const backendApi = {
    baseUrl: BACKEND_URL,

    async checkHealth() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        return res.ok ? await res.json() : null;
      } catch {
        return null;
      }
    },

    async register(userData) {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      return data;
    },

    async login(credentials) {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      return data;
    },

    async getDashboardSummary() {
      const res = await fetch(`${BACKEND_URL}/api/dashboard/summary`);
      if (!res.ok) throw new Error("Failed to fetch dashboard summary");
      return res.json();
    },

    async getProducts() {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },

    async updateStock(productId, newStock) {
      const res = await fetch(`${BACKEND_URL}/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) throw new Error("Failed to update stock");
      return res.json();
    },

    async getOrders() {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },

    async createOrder(orderData) {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },

    async getSuppliers() {
      const res = await fetch(`${BACKEND_URL}/api/suppliers`);
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      return res.json();
    },

    async getRisks() {
      const res = await fetch(`${BACKEND_URL}/api/risks`);
      if (!res.ok) throw new Error("Failed to fetch risks");
      return res.json();
    },

    async getForecast(sku = "SC-CHIP-9902", details = true) {
      const res = await fetch(`${BACKEND_URL}/api/forecast/${sku}?details=${details}`);
      if (!res.ok) throw new Error("Failed to fetch forecast from Scikit-Learn backend");
      return res.json();
    },

    async getRecommendations() {
      const res = await fetch(`${BACKEND_URL}/api/recommendations`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },

    async approveRecommendation(recId) {
      const res = await fetch(`${BACKEND_URL}/api/recommendations/${recId}/approve`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to approve recommendation");
      return res.json();
    },

    async runAgentCycle() {
      const res = await fetch(`${BACKEND_URL}/api/agents/run-cycle`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to execute agent swarm cycle");
      return res.json();
    },

    async getAgentLogs() {
      const res = await fetch(`${BACKEND_URL}/api/agents/logs`);
      if (!res.ok) throw new Error("Failed to fetch agent logs");
      return res.json();
    }
  };
