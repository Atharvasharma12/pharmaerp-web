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
} from "lucide-react";

import { ROUTES } from "@/constants";

// Permission keys match the exact backend PERMISSIONS constant:
//   company:view, branch:view, workspace-member:view, role:view
//   customer:view, supplier:view
//   product:view, global-product:view, category:view, hsn:view, manufacturer:view, salt:view, uom:view, product-form:view, bank-master:view
//   pos:view, bill:view, purchase:view, sale:view, marketplace-store:view, marketplace-product:view
//   account:view, account-group:view, account-balance:view, journal-voucher:view, ledger:view, report:view, financial-period:view
//   bank-account:view, cash-account:view, fund-transfer:view, cheque:view, payment-qr:view, bank-slip:view, cash-denomination:view
//
// Items WITHOUT a permission/permissions key are always visible to all authenticated users.

export const SIDEBAR_NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
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
    id: "operations",
    label: "Operations",
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
      {
        id: "parties",
        label: "Parties",
        icon: Users,
        permissions: ["customer:view", "supplier:view"],
        children: [
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
        id: "inventory",
        label: "Inventory",
        icon: Package,
        permissions: [
          "product:view",
          "global-product:view",
          "category:view",
          "hsn:view",
          "manufacturer:view",
          "salt:view",
          "uom:view",
          "product-form:view",
          "bank-master:view",
        ],
        children: [
          {
            id: "workspace-products",
            label: "Pharmacy Stock",
            path: ROUTES.WORKSPACE_PRODUCTS,
            icon: Boxes,
            permission: "product:view",
          },
          {
            id: "transfer-orders",
            label: "Transfer Orders",
            path: "/inventory/transfer-orders",
            icon: ArrowLeftRight,
            permission: "product:view",
          },
          {
            id: "catalog",
            label: "Global Catalog",
            path: ROUTES.CATALOG,
            icon: Package,
            permission: "global-product:view",
          },
          {
            id: "master-data",
            label: "Master Data",
            icon: Database,
            permissions: [
              "hsn:view",
              "manufacturer:view",
              "salt:view",
              "category:view",
              "product-form:view",
              "uom:view",
              "bank-master:view",
            ],
            children: [
              {
                id: "hsn-master",
                label: "HSN Codes",
                path: ROUTES.HSN_MASTER,
                icon: FileSpreadsheet,
                permission: "hsn:view",
              },
              {
                id: "manufacturer-master",
                label: "Manufacturers",
                path: ROUTES.MANUFACTURER_MASTER,
                icon: Building2,
                permission: "manufacturer:view",
              },
              {
                id: "salt-master",
                label: "Salt Compositions",
                path: ROUTES.SALT_MASTER,
                icon: FlaskConical,
                permission: "salt:view",
              },
              {
                id: "category-master",
                label: "Categories",
                path: ROUTES.CATEGORY_MASTER,
                icon: Layers,
                permission: "category:view",
              },
              {
                id: "product-form-master",
                label: "Product Forms",
                path: ROUTES.PRODUCT_FORM_MASTER,
                icon: Sparkles,
                permission: "product-form:view",
              },
              {
                id: "uom-master",
                label: "Units of Measure",
                path: ROUTES.UOM_MASTER,
                icon: Ruler,
                permission: "uom:view",
              },
              {
                id: "bank-master",
                label: "Banks Directory",
                path: ROUTES.BANK_MASTER,
                icon: Landmark,
                permission: "bank-master:view",
              },
            ],
          },
        ],
      },
      {
        id: "sales",
        label: "Sales & POS",
        icon: ShoppingCart,
        permissions: [
          "pos:view",
          "bill:view",
          "purchase:view",
          "sale:view",
          "marketplace-store:view",
          "marketplace-product:view",
        ],
        children: [
          {
            id: "pos-billing",
            label: "POS Billing",
            path: ROUTES.SALES,
            icon: ShoppingCart,
            permission: "pos:view",
          },
          {
            id: "invoicing",
            label: "Invoices & Billing",
            path: ROUTES.BILLING,
            icon: Receipt,
            permission: "bill:view",
          },
          {
            id: "purchases",
            label: "Purchases",
            path: ROUTES.PURCHASES,
            icon: Truck,
            permission: "purchase:view",
          },
          {
            id: "marketplace",
            label: "Marketplace",
            icon: Store,
            permissions: [
              "marketplace-store:view",
              "marketplace-product:view",
            ],
            children: [
              {
                id: "marketplace-stores",
                label: "Stores",
                path: ROUTES.MARKETPLACE_STORES,
                icon: Store,
                permission: "marketplace-store:view",
              },
              {
                id: "marketplace-products",
                label: "Products",
                path: ROUTES.MARKETPLACE_PRODUCTS,
                icon: Package,
                permission: "marketplace-product:view",
              },
            ],
          },
        ],
      },
      {
        id: "finance",
        label: "Finance",
        icon: DollarSign,
        permissions: [
          "account:view",
          "account-group:view",
          "account-balance:view",
          "journal-voucher:view",
          "ledger:view",
          "financial-period:view",
          "report:view",
          "bank-account:view",
          "cash-account:view",
        ],
        children: [
          {
            id: "chart-of-accounts",
            label: "Chart of Accounts",
            icon: PieChart,
            permissions: [
              "account-group:view",
              "account:view",
              "account-balance:view",
            ],
            children: [
              {
                id: "account-groups",
                label: "Account Groups",
                path: ROUTES.ACCOUNT_GROUPS,
                icon: Layers,
                permission: "account-group:view",
              },
              {
                id: "accounts",
                label: "Accounts List",
                path: ROUTES.ACCOUNTS,
                icon: BookOpen,
                permission: "account:view",
              },
              {
                id: "account-balances",
                label: "Account Balances",
                path: ROUTES.ACCOUNT_BALANCES,
                icon: Landmark,
                permission: "account-balance:view",
              },
            ],
          },
          {
            id: "treasury",
            label: "Treasury",
            icon: Landmark,
            permissions: [
              "bank-account:view",
              "cash-account:view",
              "fund-transfer:view",
              "cheque:view",
              "payment-qr:view",
              "bank-slip:view",
              "cash-denomination:view",
            ],
            children: [
              {
                id: "bank-accounts",
                label: "Bank Accounts",
                path: ROUTES.BANK_ACCOUNTS,
                icon: Landmark,
                permission: "bank-account:view",
              },
              {
                id: "cash-accounts",
                label: "Cash Accounts",
                path: ROUTES.CASH_ACCOUNTS,
                icon: Wallet,
                permission: "cash-account:view",
              },
              {
                id: "fund-transfers",
                label: "Fund Transfers",
                path: ROUTES.FUND_TRANSFERS,
                icon: ArrowLeftRight,
                permission: "fund-transfer:view",
              },
              {
                id: "cheques",
                label: "Cheques",
                path: ROUTES.CHEQUES,
                icon: FileCheck2,
                permission: "cheque:view",
              },
              {
                id: "payment-qrs",
                label: "UPI / QR",
                path: ROUTES.PAYMENT_QRS,
                icon: QrCode,
                permission: "payment-qr:view",
              },
              {
                id: "bank-slips",
                label: "Bank Slips",
                path: ROUTES.BANK_SLIPS,
                icon: Receipt,
                permission: "bank-slip:view",
              },
              {
                id: "cash-denominations",
                label: "Cash Denominations",
                path: ROUTES.CASH_DENOMINATIONS,
                icon: Banknote,
                permission: "cash-denomination:view",
              },
            ],
          },
          {
            id: "vouchers",
            label: "Journal Vouchers",
            path: ROUTES.JOURNAL_VOUCHERS,
            icon: FileText,
            permission: "journal-voucher:view",
          },
          {
            id: "ledger",
            label: "General Ledger",
            path: ROUTES.LEDGER,
            icon: BookOpen,
            permission: "ledger:view",
          },
          {
            id: "gst-ledger",
            label: "GST Ledger",
            icon: FileCheck2, // Reusing an icon for now
            permissions: ["ledger:view"], // Or a specific gst permission if needed
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
            id: "periods",
            label: "Financial Periods",
            path: ROUTES.FINANCIAL_PERIODS,
            icon: CalendarDays,
            permission: "financial-period:view",
          },
          {
            id: "reports",
            label: "Financial Reports",
            path: ROUTES.REPORTS,
            icon: BarChart3,
            permission: "report:view",
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
        // No permission — always visible
      },
      {
        id: "help",
        label: "Help & Support",
        path: ROUTES.HELP_CENTER,
        icon: HelpCircle,
        // No permission — always visible
      },
    ],
  },
];
