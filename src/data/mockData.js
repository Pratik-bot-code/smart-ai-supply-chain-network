// ============================================================================
// SMART AI SUPPLY CHAIN NETWORK - MOCK DATA REPOSITORY
// Realistic enterprise-grade supply chain, products, orders, risks & AI agents
// ============================================================================

export const INITIAL_PRODUCTS = [
  {
    id: "PRD-101",
    sku: "ELEC-MCU-09",
    name: "Industrial IoT Microcontroller STM32",
    category: "Semiconductors",
    stock: 24,
    minThreshold: 80,
    maxCapacity: 500,
    unitCost: 14.50,
    leadTimeDays: 14,
    supplierId: "SUP-01",
    supplierName: "Apex Semiconductor Corp",
    status: "Critical",
    location: "Warehouse A - Rack 04",
    lastRestocked: "2026-09-12"
  },
  {
    id: "PRD-102",
    sku: "AUTO-SEN-44",
    name: "Automotive LiDAR Sensor Pro",
    category: "Sensors",
    stock: 65,
    minThreshold: 100,
    maxCapacity: 600,
    unitCost: 185.00,
    leadTimeDays: 21,
    supplierId: "SUP-02",
    supplierName: "Nova Photonics GmbH",
    status: "Low Stock",
    location: "Warehouse B - Secure Bay",
    lastRestocked: "2026-09-18"
  },
  {
    id: "PRD-103",
    sku: "RAW-LITH-99",
    name: "High-Purity Battery Grade Lithium Salt",
    category: "Raw Materials",
    stock: 450,
    minThreshold: 200,
    maxCapacity: 1000,
    unitCost: 48.00,
    leadTimeDays: 28,
    supplierId: "SUP-03",
    supplierName: "Global Mineral Ventures",
    status: "In Stock",
    location: "Silo Chem-03",
    lastRestocked: "2026-09-29"
  },
  {
    id: "PRD-104",
    sku: "IND-ROB-12",
    name: "Brushless Servo Actuator 24V",
    category: "Robotics",
    stock: 18,
    minThreshold: 50,
    maxCapacity: 300,
    unitCost: 92.00,
    leadTimeDays: 18,
    supplierId: "SUP-04",
    supplierName: "Kinetics Precision Tokyo",
    status: "Critical",
    location: "Warehouse A - Rack 12",
    lastRestocked: "2026-08-30"
  },
  {
    id: "PRD-105",
    sku: "PKG-ECO-55",
    name: "Biodegradable Cushioning Film (Roll)",
    category: "Packaging",
    stock: 920,
    minThreshold: 300,
    maxCapacity: 1200,
    unitCost: 6.20,
    leadTimeDays: 5,
    supplierId: "SUP-05",
    supplierName: "EcoPack Solutions",
    status: "In Stock",
    location: "Warehouse C - Floor Zone",
    lastRestocked: "2026-10-02"
  },
  {
    id: "PRD-106",
    sku: "ELEC-REL-31",
    name: "Solid State Industrial Power Relay",
    category: "Electronics",
    stock: 310,
    minThreshold: 150,
    maxCapacity: 750,
    unitCost: 22.80,
    leadTimeDays: 9,
    supplierId: "SUP-01",
    supplierName: "Apex Semiconductor Corp",
    status: "In Stock",
    location: "Warehouse A - Rack 08",
    lastRestocked: "2026-09-24"
  },
  {
    id: "PRD-107",
    sku: "NET-OPT-08",
    name: "Ruggedized Fiber Optic Transceiver 10G",
    category: "Networking",
    stock: 84,
    minThreshold: 90,
    maxCapacity: 400,
    unitCost: 64.00,
    leadTimeDays: 12,
    supplierId: "SUP-02",
    supplierName: "Nova Photonics GmbH",
    status: "Low Stock",
    location: "Warehouse B - Rack 02",
    lastRestocked: "2026-09-15"
  },
  {
    id: "PRD-108",
    sku: "PWR-BATT-77",
    name: "Industrial LiFePO4 48V Storage Module",
    category: "Power Systems",
    stock: 140,
    minThreshold: 100,
    maxCapacity: 350,
    unitCost: 410.00,
    leadTimeDays: 25,
    supplierId: "SUP-03",
    supplierName: "Global Mineral Ventures",
    status: "In Stock",
    location: "Heavy Goods Bay 01",
    lastRestocked: "2026-09-27"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9401",
    orderNumber: "PO-2026-9401",
    productName: "Automotive LiDAR Sensor Pro",
    supplierName: "Nova Photonics GmbH",
    quantity: 150,
    itemsCount: 150,
    totalAmount: 27750,
    date: "2026-10-08",
    orderDate: "2026-10-08",
    status: "Pending",
    priority: "Urgent",
    carrier: "DHL Global Air",
    trackingNumber: "TRK-DHL-99214-X",
    estimatedDelivery: "2026-10-14",
    destination: "Austin, TX, USA",
    customer: "Tesla Gigafactory Texas",
    items: [
      { name: "Automotive LiDAR Sensor Pro", quantity: 150, unitPrice: 185.00 }
    ]
  },
  {
    id: "ORD-9402",
    orderNumber: "PO-2026-9402",
    productName: "Brushless Servo Actuator 24V",
    supplierName: "Kinetics Tokyo Precision",
    quantity: 220,
    itemsCount: 220,
    totalAmount: 20240,
    date: "2026-10-07",
    orderDate: "2026-10-07",
    status: "In Transit",
    priority: "High",
    carrier: "Kuehne+Nagel Logistics",
    trackingNumber: "TRK-KN-88392-D",
    estimatedDelivery: "2026-10-12",
    destination: "Munich, Germany",
    customer: "Siemens Automation Europe",
    items: [
      { name: "Brushless Servo Actuator 24V", quantity: 220, unitPrice: 92.00 }
    ]
  },
  {
    id: "ORD-9403",
    orderNumber: "PO-2026-9403",
    productName: "Industrial IoT Microcontroller STM32",
    supplierName: "Apex Semiconductor Corp",
    quantity: 500,
    itemsCount: 500,
    totalAmount: 7250,
    date: "2026-10-06",
    orderDate: "2026-10-06",
    status: "Processing",
    priority: "Standard",
    carrier: "Maersk Freight Line",
    trackingNumber: "TRK-MSK-77182-M",
    estimatedDelivery: "2026-10-18",
    destination: "Taipei, Taiwan",
    customer: "Foxconn Electronics Hub",
    items: [
      { name: "Industrial IoT Microcontroller STM32", quantity: 500, unitPrice: 14.50 }
    ]
  },
  {
    id: "ORD-9404",
    orderNumber: "PO-2026-9404",
    productName: "Solid State Industrial Power Relay",
    supplierName: "Schneider Electronic Components",
    quantity: 180,
    itemsCount: 180,
    totalAmount: 4104,
    date: "2026-10-05",
    orderDate: "2026-10-05",
    status: "Delivered",
    priority: "Standard",
    carrier: "FedEx International",
    trackingNumber: "TRK-FDX-66381-P",
    estimatedDelivery: "2026-10-09",
    destination: "Grenoble, France",
    customer: "Schneider Electric SA",
    items: [
      { name: "Solid State Industrial Power Relay", quantity: 180, unitPrice: 22.80 }
    ]
  },
  {
    id: "ORD-9405",
    orderNumber: "PO-2026-9405",
    productName: "High-Purity Battery Grade Lithium Salt",
    supplierName: "Global Mineral Ventures",
    quantity: 300,
    itemsCount: 300,
    totalAmount: 14400,
    date: "2026-10-04",
    orderDate: "2026-10-04",
    status: "Delayed",
    priority: "Urgent",
    carrier: "Cosco Shipping",
    trackingNumber: "TRK-CSC-55490-K",
    estimatedDelivery: "2026-10-22",
    destination: "Ningde, China",
    customer: "CATL Energy Storage Tech",
    items: [
      { name: "High-Purity Battery Grade Lithium Salt", quantity: 300, unitPrice: 48.00 }
    ]
  },
  {
    id: "ORD-9406",
    orderNumber: "PO-2026-9406",
    productName: "Ruggedized Fiber Optic Transceiver 10G",
    supplierName: "Nova Photonics GmbH",
    quantity: 75,
    itemsCount: 75,
    totalAmount: 4800,
    date: "2026-10-03",
    orderDate: "2026-10-03",
    status: "Pending",
    priority: "High",
    carrier: "UPS Express Freight",
    trackingNumber: "TRK-UPS-44321-U",
    estimatedDelivery: "2026-10-15",
    destination: "Phoenix, AZ, USA",
    customer: "Honeywell Aerospace",
    items: [
      { name: "Ruggedized Fiber Optic Transceiver 10G", quantity: 75, unitPrice: 64.00 }
    ]
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "SUP-01",
    name: "Apex Semiconductor Corp",
    code: "APX-SC",
    country: "Taiwan",
    rating: 4.8,
    reliabilityScore: 94,
    avgLeadTime: 14,
    activeContracts: 6,
    riskScore: "Low",
    category: "Semiconductors & Relays",
    contactEmail: "supply@apex-semi.tw",
    contactPhone: "+886 3 578 2000",
    status: "Preferred",
    onTimeRate: 96,
    esgScore: 88,
    disruptionHistory: "No major delays recorded in past 180 days."
  },
  {
    id: "SUP-02",
    name: "Nova Photonics GmbH",
    code: "NOV-PH",
    country: "Germany",
    rating: 4.6,
    reliabilityScore: 89,
    avgLeadTime: 21,
    activeContracts: 4,
    riskScore: "Medium",
    category: "Optical Sensors & LiDAR",
    contactEmail: "b2b@novaphotonics.de",
    contactPhone: "+49 89 289 1200",
    status: "Verified",
    onTimeRate: 91,
    esgScore: 95,
    disruptionHistory: "Minor customs hold observed in Rotterdam port."
  },
  {
    id: "SUP-03",
    name: "Global Mineral Ventures",
    code: "GMV-MIN",
    country: "Chile / Australia",
    rating: 4.2,
    reliabilityScore: 82,
    avgLeadTime: 28,
    activeContracts: 8,
    riskScore: "High",
    category: "Lithium & Heavy Minerals",
    contactEmail: "ops@gmventures.cl",
    contactPhone: "+56 2 2450 8900",
    status: "Under Review",
    onTimeRate: 83,
    esgScore: 74,
    disruptionHistory: "Port congestion and local labor strike risk flagged."
  },
  {
    id: "SUP-04",
    name: "Kinetics Precision Tokyo",
    code: "KPT-JPN",
    country: "Japan",
    rating: 4.9,
    reliabilityScore: 97,
    avgLeadTime: 18,
    activeContracts: 3,
    riskScore: "Low",
    category: "Robotic Actuators & Motors",
    contactEmail: "export@kinetics-tokyo.jp",
    contactPhone: "+81 3 5400 3211",
    status: "Preferred",
    onTimeRate: 98,
    esgScore: 92,
    disruptionHistory: "Zero defects in Q2 and Q3."
  },
  {
    id: "SUP-05",
    name: "EcoPack Solutions",
    code: "ECO-PKG",
    country: "United States",
    rating: 4.5,
    reliabilityScore: 92,
    avgLeadTime: 5,
    activeContracts: 5,
    riskScore: "Low",
    category: "Sustainable Packaging Materials",
    contactEmail: "orders@ecopack.io",
    contactPhone: "+1 415 890 2311",
    status: "Verified",
    onTimeRate: 95,
    esgScore: 99,
    disruptionHistory: "Local domestic transit, highly reliable."
  }
];

export const INITIAL_RISKS = [
  {
    id: "RSK-801",
    title: "Port of Ningbo Typhoon Alert & Berth Congestion",
    type: "Port Congestion",
    severity: "Critical",
    impactedProducts: ["High-Purity Battery Grade Lithium Salt"],
    impactedSupplier: "Global Mineral Ventures",
    location: "East China Sea / Ningbo",
    delayEstimateDays: 7,
    status: "Active",
    aiRecommendation: "Reroute incoming bulk freight via Busan feeder terminal; split shipment into 2 air cargoes to preserve buffer inventory.",
    detectedAt: "2026-10-09 14:30"
  },
  {
    id: "RSK-802",
    title: "Raw Silicon Wafer Supply Shortage",
    type: "Material Shortage",
    severity: "High",
    impactedProducts: ["Industrial IoT Microcontroller STM32"],
    impactedSupplier: "Apex Semiconductor Corp",
    location: "Hsinchu Science Park, Taiwan",
    delayEstimateDays: 5,
    status: "Active",
    aiRecommendation: "Trigger automated emergency purchase order for 200 buffer units before scheduled price hike on Oct 15th.",
    detectedAt: "2026-10-09 09:15"
  },
  {
    id: "RSK-803",
    title: "Rotterdam Customs System Audit Hold",
    type: "Customs Delay",
    severity: "Medium",
    impactedProducts: ["Automotive LiDAR Sensor Pro"],
    impactedSupplier: "Nova Photonics GmbH",
    location: "Rotterdam Terminal 4",
    delayEstimateDays: 3,
    status: "Mitigating",
    aiRecommendation: "Submit digital EUR-1 origin cert via fast-track compliance gateway to clear cargo in 24 hours.",
    detectedAt: "2026-10-08 17:40"
  },
  {
    id: "RSK-804",
    title: "Suez Canal Shipping Route Surcharge & Schedule Deviation",
    type: "Geopolitical Delay",
    severity: "High",
    impactedProducts: ["Brushless Servo Actuator 24V"],
    impactedSupplier: "Kinetics Precision Tokyo",
    location: "Red Sea Corridor",
    delayEstimateDays: 6,
    status: "Active",
    aiRecommendation: "Pre-book rail freight express via Central Asian land bridge for next month's batch to stabilize delivery times.",
    detectedAt: "2026-10-07 11:20"
  }
];

export const AI_AGENTS_METADATA = [
  {
    id: "agent-demand",
    name: "Demand Predictor Agent",
    version: "v4.2-neural",
    tagline: "Neural Forecasting & Volatility Radar",
    icon: "TrendingUp",
    color: "#6366f1",
    badge: "Active",
    accuracy: "96.4%",
    description: "Evaluates historical sales trends, market spikes, macro-indices, and seasonal variables to generate rolling 180-day forecast curves.",
    lastExecution: "3 mins ago",
    keyInsight: "Projecting +34% demand spike in IoT microcontrollers across Q4 industrial automation installations."
  },
  {
    id: "agent-stock",
    name: "Stock Sentinel Agent",
    version: "v3.8-sentinel",
    tagline: "Autonomous Stockout & Safety Buffer Watchdog",
    icon: "ShieldAlert",
    color: "#10b981",
    badge: "Active",
    accuracy: "99.1%",
    description: "Tracks real-time inventory drawdowns against dynamic lead times, flagging critical low stocks and calculating economic order quantities (EOQ).",
    lastExecution: "Just now",
    keyInsight: "STM32 Microcontrollers have reached critical buffer (24 left vs 80 min threshold). Reorder required immediately."
  },
  {
    id: "agent-disruption",
    name: "Disruption & Risk Detector Agent",
    version: "v5.0-georadar",
    tagline: "Global Freight, Weather & Bottleneck Detector",
    icon: "AlertTriangle",
    color: "#f43f5e",
    badge: "Active",
    accuracy: "94.8%",
    description: "Parses marine satellite feeds, weather radars, port customs delays, and carrier updates to detect bottlenecks before lines stop.",
    lastExecution: "12 mins ago",
    keyInsight: "Typhoon alert near Ningbo port adds 7-day risk to bulk Lithium shipments. Reroute recommendation generated."
  },
  {
    id: "agent-supplier",
    name: "Supplier Matcher Agent",
    version: "v2.9-procure",
    tagline: "Multi-Criteria Vendor & Lead Time Evaluator",
    icon: "UserCheck",
    color: "#06b6d4",
    badge: "Active",
    accuracy: "97.2%",
    description: "Analyzes on-time arrival rate, historical defective rates, ESG ratings, and unit discount quotes to assign contracts optimally.",
    lastExecution: "25 mins ago",
    keyInsight: "Apex Semiconductor achieves 96% on-time delivery with lowest defect margin. Recommended for Q4 procurement."
  },
  {
    id: "agent-copilot",
    name: "Autonomous Optimizer Copilot",
    version: "v6.1-hypervisor",
    tagline: "End-to-End Strategic Orchestrator",
    icon: "Cpu",
    color: "#a855f7",
    badge: "Active",
    accuracy: "98.5%",
    description: "Synthesizes inputs from all other 4 agents to offer 1-click strategic decisions, cost savings, and risk mitigations.",
    lastExecution: "1 min ago",
    keyInsight: "Network health scored at 88/100. Executing top 2 proactive suggestions will increase stability to 97/100."
  }
];

export const HISTORICAL_FORECAST_DATA = [
  { month: "May", actualDemand: 1200, predictedDemand: 1180, inventoryReserve: 1400, confidenceMin: 1100, confidenceMax: 1260 },
  { month: "Jun", actualDemand: 1350, predictedDemand: 1320, inventoryReserve: 1500, confidenceMin: 1240, confidenceMax: 1400 },
  { month: "Jul", actualDemand: 1410, predictedDemand: 1400, inventoryReserve: 1450, confidenceMin: 1320, confidenceMax: 1480 },
  { month: "Aug", actualDemand: 1290, predictedDemand: 1310, inventoryReserve: 1380, confidenceMin: 1230, confidenceMax: 1390 },
  { month: "Sep", actualDemand: 1580, predictedDemand: 1550, inventoryReserve: 1600, confidenceMin: 1470, confidenceMax: 1630 },
  { month: "Oct (Live)", actualDemand: 1720, predictedDemand: 1740, inventoryReserve: 1650, confidenceMin: 1650, confidenceMax: 1830 },
  { month: "Nov (AI)", actualDemand: null, predictedDemand: 1910, inventoryReserve: 1820, confidenceMin: 1780, confidenceMax: 2040 },
  { month: "Dec (AI)", actualDemand: null, predictedDemand: 2250, inventoryReserve: 2100, confidenceMin: 2080, confidenceMax: 2420 },
  { month: "Jan (AI)", actualDemand: null, predictedDemand: 1840, inventoryReserve: 1900, confidenceMin: 1690, confidenceMax: 1990 },
  { month: "Feb (AI)", actualDemand: null, predictedDemand: 1680, inventoryReserve: 1750, confidenceMin: 1540, confidenceMax: 1820 },
  { month: "Mar (AI)", actualDemand: null, predictedDemand: 1950, inventoryReserve: 1980, confidenceMin: 1800, confidenceMax: 2100 }
];

export const CATEGORY_BREAKDOWN = [
  { name: "Semiconductors", value: 34, color: "#6366f1" },
  { name: "Raw Materials", value: 26, color: "#06b6d4" },
  { name: "Sensors & Optical", value: 18, color: "#10b981" },
  { name: "Robotics & Motors", value: 12, color: "#f59e0b" },
  { name: "Packaging & Power", value: 10, color: "#ec4899" }
];

export const DEMAND_FORECAST_SERIES = HISTORICAL_FORECAST_DATA;
export const NETWORK_CATEGORY_DISTRIBUTION = CATEGORY_BREAKDOWN;


export const SUPPLIER_RADAR_DATA = [
  { metric: "On-Time %", "Apex Semi": 96, "Nova Photonics": 91, "Global Mineral": 83, "Kinetics Tokyo": 98 },
  { metric: "Quality Score", "Apex Semi": 94, "Nova Photonics": 88, "Global Mineral": 80, "Kinetics Tokyo": 97 },
  { metric: "Cost Advantage", "Apex Semi": 85, "Nova Photonics": 80, "Global Mineral": 92, "Kinetics Tokyo": 78 },
  { metric: "ESG Rating", "Apex Semi": 88, "Nova Photonics": 95, "Global Mineral": 74, "Kinetics Tokyo": 92 },
  { metric: "Capacity Flexibility", "Apex Semi": 92, "Nova Photonics": 84, "Global Mineral": 89, "Kinetics Tokyo": 86 }
];

export const AI_SUGGESTIONS = [
  {
    id: "SUG-01",
    agent: "Stock Sentinel Agent",
    title: "Urgent PO Restock for Industrial IoT Microcontrollers",
    impact: "High Cost & Downtime Prevention",
    description: "Current stock is 24 units against critical threshold 80. AI recommends issuing PO for 180 units to Apex Semiconductor today.",
    benefit: "Prevents estimated $42,000 production line halt.",
    actionType: "RESTOCK_PRODUCT",
    productId: "PRD-101",
    units: 180,
    applied: false
  },
  {
    id: "SUG-02",
    agent: "Disruption & Risk Detector Agent",
    title: "Reroute Ningbo Lithium Shipment via Air Freight",
    impact: "Avoids 7-Day Typhoon Delay",
    description: "Switch 50kg urgent lithium stock to Korea Air expedited corridor to preserve Tesla Gigafactory order commitment.",
    benefit: "Guarantees on-time delivery for PO-2026-9405.",
    actionType: "REROUTE_SHIPMENT",
    riskId: "RSK-801",
    applied: false
  },
  {
    id: "SUG-03",
    agent: "Supplier Matcher Agent",
    title: "Consolidate Q4 Sensor Procurement with Nova Photonics",
    impact: "Bulk Tier Discount of 8.5%",
    description: "Combining LiDAR sensors and optical transceivers into single blanket PO unlocks tier-2 discount saving $12,400.",
    benefit: "Saves $12,400 with guaranteed priority allocation.",
    actionType: "CONSOLIDATE_PO",
    applied: false
  }
];
