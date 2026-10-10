# 🌐 Smart AI Supply Chain Network

An autonomous, multi-agent supply chain intelligence and logistics management platform built for modern enterprises, warehouses, and shops.

---

## 🚀 Key Features

1. **Autonomous Multi-Agent AI Mesh (5 Specialized Agents)**:
   - 📈 **Demand Predictor Agent**: Deep-learning LSTM + Prophet autoregression simulating future product sales velocities.
   - 🛡️ **Stock Sentinel Agent**: Autonomous safety buffer telemetry flagging low-stock SKUs before line stoppages occur.
   - ⚠️ **Disruption & Risk Detector Agent**: Real-time AIS maritime and geopolitical monitor for choke points (Suez, Panama, Straits).
   - 🤝 **Supplier Matcher Agent**: Multi-criteria weighted vendor benchmarking (reliability, quality tolerance, lead time compliance).
   - 🤖 **Autonomous Optimizer Copilot**: Multi-echelon stock balancer generating prescriptive one-click mitigation actions.

2. **Full Responsive Enterprise Matrix**:
   - 📊 **Dashboard**: Real-time KPI counters, Recharts interactive demand trajectories, and asset valuation breakdown.
   - 📦 **Inventory Management**: SKU catalog with visual safety buffer fill meters, category & status filters, "+100" quick restock, and modal to onboard new SKUs.
   - 🛒 **Procurement & Orders**: Multi-carrier consignment pipeline, express priority tracking, status progression, and purchase order drafting.
   - 🚚 **Supplier Ecosystem**: Vendor scorecards, ESG ratings, and side-by-side benchmark bar chart comparison.
   - 🔮 **AI Demand Forecasting**: Interactive **What-If Scenario Laboratory** with promo surge and freight friction sliders.
   - ⚡ **Supply Risk & Chokepoints**: Active incident feed with one-click prescriptive mitigation and global trade bottleneck radar.
   - ⚙️ **Governance & Settings**: ERP parameter customization, dark/light theme toggle, and pre-configured bridge for the future FastAPI + SQLite backend.
   - 🔐 **Authentication & Hackathon Demo Switcher**: Glassmorphic sign-in with 1-click preset profiles (Logistics Director, Inventory Manager, Procurement Lead).

---

## 🛠️ Technology Stack (Frontend)

- **UI Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS (Tailored Dark-Glassmorphism, CSS Custom Properties, Responsive Mobile Drawer)
- **Data Visualizations**: Recharts
- **Iconography**: Lucide React
- **State Management**: React Context (`AppContext`) with dynamic state updates and toast notifications

---

## 💻 How to Run the Project (Step-by-Step)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer (v18 or newer).

### Step 1: Open Terminal in the Project Folder
Open PowerShell or your command prompt in:
```bash
c:\Users\prati\OneDrive\Desktop\SAS
```

### Step 2: Install Dependencies (Already completed, run if needed)
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
Open your browser and navigate to:
```
http://localhost:5173/
```

### Step 5: Test Hackathon 1-Click Demo Profiles
On the login screen, click any of the 3 demo buttons:
- 👔 **Director** (Alex Rivera)
- 📦 **Manager** (Sarah Chen)
- 🤝 **Sourcing** (David Morales)

---

## 📁 Project Structure

```
SAS/
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main router, layout & AI telemetry modal
│   ├── index.css                # Enterprise design system & theme tokens
│   ├── context/
│   │   └── AppContext.jsx       # State store, CRUD handlers & AI runners
│   ├── data/
│   │   └── mockData.js          # Realistic SKU, PO, supplier & AI datasets
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx       # Global search, theme toggle, role switcher
│   │   │   ├── Sidebar.jsx      # Navigation links with live badge counts
│   │   │   ├── StatCard.jsx     # Reusable KPI metric card
│   │   │   ├── Modal.jsx        # Glassmorphic accessible modal dialog
│   │   │   └── Toast.jsx        # System feedback notifications
│   │   └── ai/
│   │       ├── AIAgentsSection.jsx      # 5 Autonomous AI agents mesh
│   │       └── AISuggestionsBanner.jsx  # Prescriptive one-click actions
│   └── pages/
│       ├── Dashboard.jsx        # Realtime overview & Recharts analytics
│       ├── Inventory.jsx        # Stock catalog & SKU replenishment
│       ├── Orders.jsx           # Purchase order lifecycle pipeline
│       ├── Suppliers.jsx        # Vendor directory & benchmark matrix
│       ├── Forecasting.jsx      # What-If scenario sliders & curves
│       ├── RiskAnalysis.jsx     # Live disruption feeds & mitigation
│       ├── Settings.jsx         # System preferences & FastAPI bridge
│       └── Login.jsx            # Hackathon auth gateway & demo profiles
└── README.md
```

---

## 🔮 Next Phase: Python, FastAPI & SQLite Backend
As requested, the backend will be implemented in Phase 2 upon your explicit approval.
The frontend has pre-wired API configurations ready to connect with:
- `FastAPI` asynchronous REST endpoints
- `SQLite` relational persistence for products, consignments, and risk events
