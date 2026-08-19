import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  HelpCircle,
  Boxes,
  Database,
  Layers,
  Sparkles,
  FlaskConical,
  Ruler,
  FileSpreadsheet,
  Receipt,
  Truck,
  Store,
  PieChart,
  Landmark,
  Wallet,
  ArrowLeftRight,
  QrCode,
  FileCheck2,
  Banknote,
  BookOpen,
  CalendarDays,
  FileText,
  BarChart3,
  GitBranch,
  ShieldAlert,
  Contact,
} from "lucide-react";

import { ROUTES } from "@/constants";

export const SIDEBAR_NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: ROUTES.SETUP_CENTER,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "organization",
        label: "Organization",
        icon: Building2,
        children: [
          {
            id: "companies",
            label: "Companies",
            path: ROUTES.COMPANIES,
            icon: Building2,
          },
          {
            id: "branches",
            label: "Branches",
            path: ROUTES.BRANCHES,
            icon: GitBranch,
          },
          {
            id: "members",
            label: "Staff & Members",
            path: ROUTES.WORKSPACE_MEMBERS,
            icon: Users,
          },
          {
            id: "access-control",
            label: "Access Control",
            path: ROUTES.ACCESS_CONTROL,
            icon: ShieldAlert,
          },
        ],
      },
      {
        id: "parties",
        label: "Parties",
        icon: Users,
        children: [
          {
            id: "customers",
            label: "Customers",
            path: ROUTES.CUSTOMERS,
            icon: Users,
          },
          {
            id: "suppliers",
            label: "Suppliers",
            path: ROUTES.SUPPLIERS,
            icon: Truck,
          },
          {
            id: "all-parties",
            label: "All Parties",
            path: ROUTES.PARTIES,
            icon: Contact,
          },
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: Package,
        children: [
          {
            id: "workspace-products",
            label: "Pharmacy Stock",
            path: ROUTES.WORKSPACE_PRODUCTS,
            icon: Boxes,
          },
          {
            id: "catalog",
            label: "Global Catalog",
            path: ROUTES.CATALOG,
            icon: Package,
          },
          {
            id: "master-data",
            label: "Master Data",
            icon: Database,
            children: [
              {
                id: "hsn-master",
                label: "HSN Codes",
                path: ROUTES.HSN_MASTER,
                icon: FileSpreadsheet,
              },
              {
                id: "manufacturer-master",
                label: "Manufacturers",
                path: ROUTES.MANUFACTURER_MASTER,
                icon: Building2,
              },
              {
                id: "salt-master",
                label: "Salt Compositions",
                path: ROUTES.SALT_MASTER,
                icon: FlaskConical,
              },
              {
                id: "category-master",
                label: "Categories",
                path: ROUTES.CATEGORY_MASTER,
                icon: Layers,
              },
              {
                id: "product-form-master",
                label: "Product Forms",
                path: ROUTES.PRODUCT_FORM_MASTER,
                icon: Sparkles,
              },
              {
                id: "uom-master",
                label: "Units of Measure",
                path: ROUTES.UOM_MASTER,
                icon: Ruler,
              },
              {
                id: "bank-master",
                label: "Banks Directory",
                path: ROUTES.BANK_MASTER,
                icon: Landmark,
              },
            ],
          },
        ],
      },
      {
        id: "sales",
        label: "Sales & POS",
        icon: ShoppingCart,
        children: [
          {
            id: "pos-billing",
            label: "POS Billing",
            path: "/sales",
            icon: ShoppingCart,
          },
          {
            id: "invoicing",
            label: "Invoices & Billing",
            path: "/billing",
            icon: Receipt,
          },
          {
            id: "purchases",
            label: "Purchases",
            path: "/purchases",
            icon: Truck,
          },
          {
            id: "marketplace",
            label: "Marketplace",
            icon: Store,
            children: [
              {
                id: "marketplace-stores",
                label: "Stores",
                path: ROUTES.MARKETPLACE_STORES,
                icon: Store,
              },
              {
                id: "marketplace-products",
                label: "Products",
                path: ROUTES.MARKETPLACE_PRODUCTS,
                icon: Package,
              },
            ],
          },
        ],
      },
      {
        id: "finance",
        label: "Finance",
        icon: DollarSign,
        children: [
          {
            id: "chart-of-accounts",
            label: "Chart of Accounts",
            icon: PieChart,
            children: [
              {
                id: "account-groups",
                label: "Account Groups",
                path: ROUTES.ACCOUNT_GROUPS,
                icon: Layers,
              },
              {
                id: "accounts",
                label: "Accounts List",
                path: ROUTES.ACCOUNTS,
                icon: BookOpen,
              },
              {
                id: "account-balances",
                label: "Account Balances",
                path: ROUTES.ACCOUNT_BALANCES,
                icon: Landmark,
              },
            ],
          },
          {
            id: "treasury",
            label: "Treasury",
            icon: Landmark,
            children: [
              {
                id: "bank-accounts",
                label: "Bank Accounts",
                path: ROUTES.BANK_ACCOUNTS,
                icon: Landmark,
              },
              {
                id: "cash-accounts",
                label: "Cash Accounts",
                path: ROUTES.CASH_ACCOUNTS,
                icon: Wallet,
              },
              {
                id: "fund-transfers",
                label: "Fund Transfers",
                path: ROUTES.FUND_TRANSFERS,
                icon: ArrowLeftRight,
              },
              {
                id: "cheques",
                label: "Cheques",
                path: ROUTES.CHEQUES,
                icon: FileCheck2,
              },
              {
                id: "payment-qrs",
                label: "UPI / QR",
                path: ROUTES.PAYMENT_QRS,
                icon: QrCode,
              },
              {
                id: "bank-slips",
                label: "Bank Slips",
                path: ROUTES.BANK_SLIPS,
                icon: Receipt,
              },
              {
                id: "cash-denominations",
                label: "Cash Denominations",
                path: ROUTES.CASH_DENOMINATIONS,
                icon: Banknote,
              },
            ],
          },
          {
            id: "vouchers",
            label: "Journal Vouchers",
            path: ROUTES.JOURNAL_VOUCHERS,
            icon: FileText,
          },
          {
            id: "ledger",
            label: "General Ledger",
            path: ROUTES.LEDGER,
            icon: BookOpen,
          },
          {
            id: "periods",
            label: "Financial Periods",
            path: ROUTES.FINANCIAL_PERIODS,
            icon: CalendarDays,
          },
          {
            id: "reports",
            label: "Financial Reports",
            path: ROUTES.REPORTS,
            icon: BarChart3,
          },
        ],
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        id: "settings",
        label: "Settings",
        path: ROUTES.SETTINGS,
        icon: Settings,
      },
      {
        id: "help",
        label: "Help & Support",
        path: "/help-center",
        icon: HelpCircle,
      },
    ],
  },
];
