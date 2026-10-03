// src/features/dashboard/constants/dashboardData.js

export const DASHBOARD_HERO_DATA = {
  systemStatus: "All systems operational",
  transactionsToday: 184,
  complianceRate: "98%",
  description:
    "Monitor inventory levels, track medicine sales, manage prescriptions, and ensure smooth pharmacy operations from one centralized dashboard.",
};

export const DASHBOARD_KPI_CARDS = [
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "₹1,28,450",
    prefix: "",
    subtitle: "vs last month",
    trend: { value: "+18.4%", direction: "up", label: "vs last month" },
    color: "primary",
    sparklineData: [65, 78, 70, 85, 92, 105, 128],
    iconName: "TrendingUp",
  },
  {
    id: "medicines-stock",
    title: "Medicines in Stock",
    value: "12,845",
    prefix: "",
    subtitle: "New inventory",
    trend: { value: "+320", direction: "up", label: "New inventory" },
    color: "info",
    sparklineData: [11200, 11500, 11900, 12100, 12400, 12845],
    iconName: "Package",
  },
  {
    id: "low-stock-alerts",
    title: "Low Stock Alerts",
    value: "37",
    prefix: "",
    subtitle: "Needs attention",
    trend: { value: "37 items", direction: "down", label: "Needs attention" },
    color: "warning",
    sparklineData: [45, 42, 39, 41, 38, 37],
    iconName: "AlertTriangle",
  },
  {
    id: "expiring-soon",
    title: "Expiring Soon",
    value: "56",
    prefix: "",
    subtitle: "Review batches",
    trend: { value: "30 days", direction: "down", label: "Review batches" },
    color: "error",
    sparklineData: [70, 68, 62, 59, 58, 56],
    iconName: "CalendarDays",
  },
  {
    id: "todays-sales",
    title: "Today's Sales",
    value: "₹8,940",
    prefix: "",
    subtitle: "Today",
    trend: { value: "+9.2%", direction: "up", label: "Today" },
    color: "primary",
    sparklineData: [4200, 5600, 6800, 7100, 8200, 8940],
    iconName: "ShoppingCart",
  },
];

export const MONTHLY_REVENUE_METRICS = [
  {
    id: "revenue",
    label: "Revenue",
    value: "₹128k",
    change: "+18.4%",
    colorVar: "var(--app-color-primary)",
    badgeClass: "bg-primary-soft text-primary",
  },
  {
    id: "profit",
    label: "Profit",
    value: "₹54k",
    change: "+12.1%",
    colorVar: "var(--app-color-success)",
    badgeClass: "bg-success-soft text-success",
  },
  {
    id: "expenses",
    label: "Expenses",
    value: "₹74k",
    change: "+4.2%",
    colorVar: "var(--app-color-warning)",
    badgeClass: "bg-warning-soft text-warning",
  },
  {
    id: "online-orders",
    label: "Online Orders",
    value: "₹42k",
    change: "+23.5%",
    colorVar: "var(--app-color-info)",
    badgeClass: "bg-info-soft text-info",
  },
];

export const REVENUE_CHART_TIMEFRAMES = [
  { label: "Last 6 months", value: "6m" },
  { label: "Last 30 days", value: "30d" },
  { label: "This Year", value: "1y" },
];

export const REVENUE_CHART_POINTS = [
  { month: "Jan", revenue: 45, profit: 20, expenses: 25, orders: 15 },
  { month: "Feb", revenue: 62, profit: 28, expenses: 34, orders: 22 },
  { month: "Mar", revenue: 75, profit: 34, expenses: 41, orders: 29 },
  { month: "Apr", revenue: 88, profit: 40, expenses: 48, orders: 33 },
  { month: "May", revenue: 105, profit: 48, expenses: 57, orders: 38 },
  { month: "Jun", revenue: 128, profit: 54, expenses: 74, orders: 42 },
];

export const INVENTORY_DISTRIBUTION = {
  total: "12,845",
  categories: [
    { name: "Tablets", count: 5138, percentage: 40, colorVar: "var(--app-color-primary)", bgClass: "bg-primary" },
    { name: "Capsules", count: 3211, percentage: 25, colorVar: "var(--app-color-success)", bgClass: "bg-success" },
    { name: "Syrups", count: 1926, percentage: 15, colorVar: "var(--app-color-warning)", bgClass: "bg-warning" },
    { name: "Injections", count: 1284, percentage: 10, colorVar: "var(--app-color-info)", bgClass: "bg-info" },
    { name: "Medical Supplies", count: 1286, percentage: 10, colorVar: "var(--app-color-error)", bgClass: "bg-error" },
  ],
};

export const INVENTORY_MEDICINES = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    batch: "Batch #B00124",
    initial: "P",
    sku: "PHM-001",
    category: "Tablet",
    stock: "1,240",
    reorderLevel: "500",
    expiryDate: "Dec 2026",
    status: "Healthy",
    statusVariant: "success",
  },
  {
    id: "med-2",
    name: "Amoxicillin 250mg",
    batch: "Batch #B00224",
    initial: "A",
    sku: "PHM-002",
    category: "Capsule",
    stock: "140",
    reorderLevel: "300",
    expiryDate: "Oct 2026",
    status: "Low Stock",
    statusVariant: "warning",
  },
  {
    id: "med-3",
    name: "Insulin Injection",
    batch: "Batch #B00324",
    initial: "I",
    sku: "PHM-003",
    category: "Injection",
    stock: "35",
    reorderLevel: "100",
    expiryDate: "Jul 2026",
    status: "Critical",
    statusVariant: "error",
  },
  {
    id: "med-4",
    name: "Vitamin C Syrup",
    batch: "Batch #B00424",
    initial: "V",
    sku: "PHM-004",
    category: "Syrup",
    stock: "560",
    reorderLevel: "200",
    expiryDate: "Jan 2027",
    status: "Healthy",
    statusVariant: "success",
  },
  {
    id: "med-5",
    name: "Metformin 850mg",
    batch: "Batch #B00524",
    initial: "M",
    sku: "PHM-005",
    category: "Tablet",
    stock: "88",
    reorderLevel: "250",
    expiryDate: "Sep 2026",
    status: "Low Stock",
    statusVariant: "warning",
  },
  {
    id: "med-6",
    name: "Cetirizine 10mg",
    batch: "Batch #B00624",
    initial: "C",
    sku: "PHM-006",
    category: "Tablet",
    stock: "920",
    reorderLevel: "300",
    expiryDate: "Mar 2027",
    status: "Healthy",
    statusVariant: "success",
  },
  {
    id: "med-7",
    name: "Azithromycin 500mg",
    batch: "Batch #B00724",
    initial: "A",
    sku: "PHM-007",
    category: "Tablet",
    stock: "430",
    reorderLevel: "200",
    expiryDate: "Nov 2026",
    status: "Healthy",
    statusVariant: "success",
  },
  {
    id: "med-8",
    name: "Ibuprofen 400mg",
    batch: "Batch #B00824",
    initial: "I",
    sku: "PHM-008",
    category: "Capsule",
    stock: "65",
    reorderLevel: "150",
    expiryDate: "Aug 2026",
    status: "Low Stock",
    statusVariant: "warning",
  },
];

export const SMART_PHARMACY_INSIGHTS = [
  {
    id: "insight-1",
    text: "Revenue increased by 18% this month, driven by higher prescription volume.",
    iconName: "TrendingUp",
    intent: "primary",
  },
  {
    id: "insight-2",
    text: "12 medicines require immediate restocking to avoid stock-outs.",
    iconName: "Package",
    intent: "warning",
  },
  {
    id: "insight-3",
    text: "Inventory turnover improved by 14% compared to last quarter.",
    iconName: "Activity",
    intent: "info",
  },
  {
    id: "insight-4",
    text: "Expiry risk reduced by 8% with new batch rotation policy.",
    iconName: "ShieldCheck",
    intent: "success",
  },
  {
    id: "insight-5",
    text: "Prescription volume expected to increase 9% next week.",
    iconName: "Sparkles",
    intent: "primary",
  },
];

export const LOW_STOCK_MEDICINES = [
  { id: "ls-1", name: "Amoxicillin 250mg", remaining: 140, form: "Capsule" },
  { id: "ls-2", name: "Insulin Injection", remaining: 35, form: "Injection" },
  { id: "ls-3", name: "Metformin 850mg", remaining: 88, form: "Tablet" },
  { id: "ls-4", name: "Aspirin 100mg", remaining: 120, form: "Tablet" },
];

export const EXPIRY_ALERTS = [
  { id: "exp-1", name: "Ciprofloxacin 500mg", daysLeft: 4, batch: "B-9912", count: 45 },
  { id: "exp-2", name: "Doxycycline 100mg", daysLeft: 9, batch: "B-8823", count: 30 },
  { id: "exp-3", name: "Omeprazole 20mg", daysLeft: 14, batch: "B-7734", count: 60 },
  { id: "exp-4", name: "Salbutamol Inhaler", daysLeft: 22, batch: "B-6645", count: 18 },
];

export const SUPPLIER_UPDATES = [
  {
    id: "sup-1",
    name: "MediSupply Ltd",
    status: "Awaiting confirmation",
    statusType: "warning",
  },
  {
    id: "sup-2",
    name: "HealthCare Pharma",
    status: "Shipment delayed",
    statusType: "error",
  },
  {
    id: "sup-3",
    name: "Global Medical",
    status: "Invoice ready",
    statusType: "info",
  },
  {
    id: "sup-4",
    name: "BioGen Labs",
    status: "Quote received",
    statusType: "primary",
  },
];
