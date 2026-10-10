// ==============================================================================
// Smart AI Supply Chain Network - Backend API with Offline Fallback
// When deployed without a backend, auth falls back to localStorage.
// ==============================================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// --- LocalStorage Auth Fallback ---
const LOCAL_USERS_KEY = "sas_registered_users";

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function hashSimple(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(36);
}

async function localRegister(userData) {
  const users = getLocalUsers();
  const emailClean = userData.email.toLowerCase().trim();

  if (users.find((u) => u.email === emailClean)) {
    throw new Error("An account with this email is already registered. Please sign in instead.");
  }

  const userId = "USR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const initials = userData.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "US";

  const newUser = {
    id: userId,
    name: userData.name.trim(),
    email: emailClean,
    passwordHash: hashSimple(userData.password),
    role: userData.role || "Supply Chain Employee",
    company: userData.company || "Nexus Global Supply Inc.",
    avatar: initials,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  return {
    success: true,
    message: "Account successfully registered for " + newUser.name + "! You can now log in.",
    token: "local_" + userId + "_" + Date.now().toString(36),
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      avatar: newUser.avatar,
    },
  };
}

async function localLogin(credentials) {
  const users = getLocalUsers();
  const emailClean = credentials.email.toLowerCase().trim();
  const user = users.find((u) => u.email === emailClean);

  if (!user) {
    throw new Error("Account not found with this email. Please register first.");
  }

  if (user.passwordHash !== hashSimple(credentials.password)) {
    throw new Error("Invalid credentials. Please verify your password.");
  }

  return {
    success: true,
    message: "Welcome back, " + user.name + "!",
    token: "local_" + user.id + "_" + Date.now().toString(36),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
    },
  };
}

// --- Check backend connectivity (cached) ---
let _backendOnline = null;

async function isBackendOnline() {
  if (_backendOnline !== null) return _backendOnline;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(BACKEND_URL + "/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    _backendOnline = res.ok;
  } catch {
    _backendOnline = false;
  }
  // Re-check every 30 seconds
  setTimeout(() => { _backendOnline = null; }, 30000);
  return _backendOnline;
}

// --- Main API object ---
export const backendApi = {
  baseUrl: BACKEND_URL,

  async checkHealth() {
    try {
      const res = await fetch(BACKEND_URL + "/api/health");
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  },

  async register(userData) {
    if (await isBackendOnline()) {
      const res = await fetch(BACKEND_URL + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      return data;
    }
    return localRegister(userData);
  },

  async login(credentials) {
    if (await isBackendOnline()) {
      const res = await fetch(BACKEND_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      return data;
    }
    return localLogin(credentials);
  },

  async getDashboardSummary() {
    const res = await fetch(BACKEND_URL + "/api/dashboard/summary");
    if (!res.ok) throw new Error("Failed to fetch dashboard summary");
    return res.json();
  },

  async getProducts() {
    const res = await fetch(BACKEND_URL + "/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async updateStock(productId, newStock) {
    const res = await fetch(BACKEND_URL + "/api/products/" + productId + "/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    if (!res.ok) throw new Error("Failed to update stock");
    return res.json();
  },

  async getOrders() {
    const res = await fetch(BACKEND_URL + "/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  async createOrder(orderData) {
    const res = await fetch(BACKEND_URL + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  },

  async getSuppliers() {
    const res = await fetch(BACKEND_URL + "/api/suppliers");
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    return res.json();
  },

  async getRisks() {
    const res = await fetch(BACKEND_URL + "/api/risks");
    if (!res.ok) throw new Error("Failed to fetch risks");
    return res.json();
  },

  async getForecast(sku = "SC-CHIP-9902", details = true) {
    const res = await fetch(BACKEND_URL + "/api/forecast/" + sku + "?details=" + details);
    if (!res.ok) throw new Error("Failed to fetch forecast");
    return res.json();
  },

  async getRecommendations() {
    const res = await fetch(BACKEND_URL + "/api/recommendations");
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    return res.json();
  },

  async approveRecommendation(recId) {
    const res = await fetch(BACKEND_URL + "/api/recommendations/" + recId + "/approve", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to approve recommendation");
    return res.json();
  },

  async runAgentCycle() {
    const res = await fetch(BACKEND_URL + "/api/agents/run-cycle", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to execute agent swarm cycle");
    return res.json();
  },

  async getAgentLogs() {
    const res = await fetch(BACKEND_URL + "/api/agents/logs");
    if (!res.ok) throw new Error("Failed to fetch agent logs");
    return res.json();
  },
};
