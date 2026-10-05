// src/layouts/app/components/sidebar/sidebarNavConfig.js

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
  ShieldCheck,
  Contact,
  Clock,
  FileUp,
  RefreshCw,
} from "lucide-react";

import { ROUTES } from "@/constants";

// Permission keys match the exact backend PERMISSIONS constant:
//   company:view, branch:view, workspace-member:view, role:view
//   customer:view, supplier:view
//   product:view, global-product:view, category:view, hsn:view, manufacturer:view, salt:view, uom:view, product-form:view, bank-master:view
//   pos:view, bill:view, purchase:view, sale:view, marketplace-store:view, marketplace-product:view
//   account:view, account-group:view, account-balance:view, journal-voucher:view, ledger:view, report:view, financial-period:view
//   bank-account:view, cash-account:view, fund-transfer:view, cheque:view, payment-qr:view, cash-denomination:view
//
// Items WITHOUT a permission/permissions key are always visible to all authenticated users.

export const SIDEBAR_NAV_GROUPS = [
  {
    id: "overview",
    label: "Home",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        id: "setup-center",
        label: "Setup Center",
        path: ROUTES.SETUP_CENTER,
        icon: Sparkles,
        requireOwner: true,
      },
    ],
  },
  {
    id: "daily-ops",
    label: "Daily Ops",
    items: [
      {
        id: "business-days",
        label: "Business Days",
        path: "/operations/business-days",
        icon: CalendarDays,
      },
      {
        id: "shifts",
        label: "Shifts",
        path: "/operations/shifts",
        icon: Clock,
      },
      {
        id: "billing",
        label: "Billing",
        path: ROUTES.SALES,
        icon: ShoppingCart,
        permissions: ["pos:view", "bill:view", "sale:view"],
      },
      {
        id: "purchases",
        label: "Purchases",
        path: ROUTES.PURCHASES,
        icon: Truck,
        permission: "purchase:view",
      },
      {
        id: "pharmacy-stock",
        label: "Pharmacy Stock",
        path: ROUTES.WORKSPACE_PRODUCTS,
        icon: Boxes,
        permission: "product:view",
      },
      {
        id: "customers",
        label: "Customers",
        path: ROUTES.CUSTOMERS,
        icon: Users,
        permission: "customer:view",
      },
      {
        id: "suppliers",
        label: "Suppliers",
        path: ROUTES.SUPPLIERS,
        icon: Truck,
        permission: "supplier:view",
      },
    ],
  },
  {
    id: "money",
    label: "Money",
    items: [
      {
        id: "cash-counter",
        label: "Cash Counter",
        path: ROUTES.BRANCH_CASH,
        icon: Wallet,
        permission: "cash-account:view",
      },
      {
        id: "bank-accounts",
        label: "Bank Accounts",
        path: ROUTES.BANK_ACCOUNTS,
        icon: Landmark,
        permission: "bank-account:view",
      },
      {
        id: "transfers",
        label: "Transfers",
        path: ROUTES.FUND_TRANSFERS,
        icon: ArrowLeftRight,
        permission: "fund-transfer:view",
      },
      {
        id: "payment-qrs",
        label: "UPI / QR",
        path: ROUTES.PAYMENT_QRS,
        icon: QrCode,
        permission: "payment-qr:view",
      },
      {
        id: "cheques",
        label: "Cheques",
        path: ROUTES.CHEQUES,
        icon: FileCheck2,
        permission: "cheque:view",
      },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    items: [
      {
        id: "transfer-orders",
        label: "Transfer Orders",
        path: "/inventory/transfer-orders",
        icon: ArrowLeftRight,
        permission: "product:view",
      },
    ],
  },
  {
    id: "manage",
    label: "Manage",
    items: [
      {
        id: "organization",
        label: "Organization",
        icon: Building2,
        permissions: [
          "company:view",
          "branch:view",
          "workspace-member:view",
          "role:view",
        ],
        children: [
          {
            id: "companies",
            label: "Companies",
            path: ROUTES.COMPANIES,
            icon: Building2,
            permission: "company:view",
          },
          {
            id: "branches",
            label: "Branches",
            path: ROUTES.BRANCHES,
            icon: GitBranch,
            permission: "branch:view",
          },
          {
            id: "members",
            label: "Staff & Members",
            path: ROUTES.WORKSPACE_MEMBERS,
            icon: Users,
            permission: "workspace-member:view",
          },
          {
            id: "roles-permissions",
            label: "Roles & Permissions",
            path: ROUTES.ROLES,
            icon: ShieldCheck,
            permission: "role:view",
          },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "accounts-ledger",
        label: "Accounts & Ledger",
        path: ROUTES.ACCOUNT_GROUPS,
        icon: Layers,
        permissions: ["account-group:view", "account:view"],
      },
      {
        id: "account-balances",
        label: "Account Balances",
        path: ROUTES.ACCOUNT_BALANCES,
        icon: Landmark,
        permission: "account-balance:view",
      },
      {
        id: "vouchers",
        label: "Manual Adjustments",
        path: ROUTES.JOURNAL_VOUCHERS,
        icon: FileText,
        permission: "journal-voucher:view",
      },
      {
        id: "gst-ledger",
        label: "GST Reports",
        icon: FileCheck2,
        permissions: ["ledger:view"],
        children: [
          {
            id: "gstr-1",
            label: "GSTR-1",
            path: ROUTES.GSTR1,
            icon: FileText,
            permission: "ledger:view",
          },
          {
            id: "gstr-2",
            label: "GSTR-2",
            path: ROUTES.GSTR2,
            icon: FileText,
            permission: "ledger:view",
          },
        ],
      },
      {
        id: "reports",
        label: "Financial Reports",
        path: ROUTES.REPORTS,
        icon: BarChart3,
        permission: "report:view",
      },
      {
        id: "periods",
        label: "Financial Periods",
        path: ROUTES.FINANCIAL_PERIODS,
        icon: CalendarDays,
        permission: "financial-period:view",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [

      {
        id: "help",
        label: "Help & Support",
        path: ROUTES.HELP_CENTER,
        icon: HelpCircle,
      },
    ],
  },
];

