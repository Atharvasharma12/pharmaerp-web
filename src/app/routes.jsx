import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants";

import {
  PublicLayout,
  AuthLayout,
  AppLayout,
} from "@/layouts";

import { GuestRoute, ProtectedRoute, WorkspaceRequiredRoute } from "@/guards";

import authRoutes from "@/features/auth/routes/authRoutes";
import userRoutes from "@/features/user/routes/userRoutes";

import { RegisterPage } from "@/features/auth/pages";

import workspaceRoutes from "@/features/workspace/routes/workspaceRoutes";
import setupRoutes from "@/features/setup/routes/setupRoutes";
import dashboardRoutes from "@/features/dashboard/routes/dashboardRoutes";

import companyRoutes from "@/features/company/routes/companyRoutes";
import branchRoutes from "@/features/branch/routes/branchRoutes";
import accessControlRoutes from "@/features/access-control/routes/accessControlRoutes";
import catalogRoutes from "@/features/catalog/routes/catalogRoutes";
import subscriptionRoutes from "@/features/subscription/routes/subscriptionRoutes";

import globalProductRoutes from "@/features/global-products/routes/globalProductRoutes";
import workspaceProductRoutes from "@/features/workspace-products/routes/workspaceProductRoutes";

import HomePage from "@/pages/HomePage";

import { LandingPage } from "@/features/landing";
import hsnMasterRoutes from "@/features/hsn-master/routes/hsnMasterRoutes";
import manufacturerMasterRoutes from "@/features/manufacturer-master/routes/manufacturerMasterRoutes";
import uomMasterRoutes from "@/features/uom-master/routes/uomMasterRoutes";
import categoryMasterRoutes from "@/features/category-master/routes/categoryMasterRoutes";
import productFormMasterRoutes from "@/features/product-form-master/routes/productFormMasterRoutes";
import saltMasterRoutes from "@/features/salt-master/routes/saltMasterRoutes";
import bankMasterRoutes from "@/features/bank-master/routes/bankMasterRoutes";
import marketplaceStoreRoutes from "@/features/marketplace/stores/routes/marketplaceStoreRoutes";
import marketplaceProductRoutes from "@/features/marketplace/products/routes/marketplaceProductRoutes";
import partiesRoutes from "@/features/parties/routes/partiesRoutes";
import customerRoutes from "@/features/parties/customers/routes/customerRoutes";
import supplierRoutes from "@/features/parties/suppliers/routes/supplierRoutes";
import financeRoutes from "@/features/finance/routes/financeRoutes";
import chartOfAccountsRoutes from "@/features/finance/chart-of-accounts/routes/chartOfAccountsRoutes";
import journalVoucherRoutes from "@/features/finance/journal-vouchers/routes/journalVoucherRoutes";
import accountGroupRoutes from "@/features/finance/chart-of-accounts/account-groups/routes/accountGroupRoutes";
import accountRoutes from "@/features/finance/chart-of-accounts/accounts/routes/accountRoutes";
import accountBalanceRoutes from "@/features/finance/account-balances/routes/accountBalanceRoutes";
import treasuryRoutes from "@/features/finance/treasury/routes/treasuryRoutes";
import fundTransferRoutes from "@/features/finance/treasury/fund-transfers/routes/fundTransferRoutes";
import chequeRoutes from "@/features/finance/treasury/cheque-management/routes/chequeRoutes";
import bankAccountRoutes from "@/features/finance/treasury/bank-management/bank-accounts/routes/bankAccountRoutes";
import cashAccountRoutes from "@/features/finance/treasury/cash-management/cash-accounts/routes/cashAccountRoutes";
import paymentQrRoutes from "@/features/finance/treasury/payment-qr/routes/paymentQrRoutes";
import bankSlipRoutes from "@/features/finance/treasury/bank-management/bank-slips/routes/bankSlipRoutes";
import bankTransactionRoutes from "@/features/finance/treasury/bank-management/bank-transactions/routes/bankTransactionRoutes";
import cashTransactionRoutes from "@/features/finance/treasury/cash-management/cash-transactions/routes/cashTransactionRoutes";
import cashDenominationRoutes from "@/features/finance/treasury/cash-management/cash-denominations/routes/cashDenominationRoutes";
import financialPeriodRoutes from "@/features/finance/financial-periods/routes/financialPeriodRoutes";
import ledgerRoutes from "@/features/finance/ledger/routes/ledgerRoutes";
import reportsRoutes from "@/features/finance/reports/routes/reportsRoutes";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>

        <p className="mt-3 text-lg font-medium text-text">Page Not Found</p>

        <p className="mt-2 text-sm text-text-muted">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  // Public
  {
    element: (
      <GuestRoute>
        <PublicLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
      {
        path: "/features",
        element: <HomePage />,
      },
      {
        path: "/pricing",
        element: <HomePage />,
      },
      {
        path: "/blog",
        element: <HomePage />,
      },
      {
        path: "/contact",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <HomePage />,
      },
      {
        path: "/help-center",
        element: <HomePage />,
      },
      {
        path: "/privacy-policy",
        element: <HomePage />,
      },
      {
        path: "/terms-of-service",
        element: <HomePage />,
      },
    ],
  },

  // Auth
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: authRoutes,
  },



  // Setup + User
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [...setupRoutes, ...userRoutes],
  },

  // ERP Application
  {
    element: (
      <ProtectedRoute>
        <WorkspaceRequiredRoute>
          <AppLayout />
        </WorkspaceRequiredRoute>
      </ProtectedRoute>
    ),
    children: [
      ...dashboardRoutes,

      ...workspaceRoutes,
      ...companyRoutes,
      ...branchRoutes,
      ...accessControlRoutes,
      ...partiesRoutes,
      ...subscriptionRoutes,
      ...customerRoutes,
      ...supplierRoutes,

      ...financeRoutes,
      ...chartOfAccountsRoutes,
      ...journalVoucherRoutes,
      ...accountGroupRoutes,
      ...accountRoutes,
      ...accountBalanceRoutes,
      ...financialPeriodRoutes,
      ...ledgerRoutes,
      ...reportsRoutes,

      ...treasuryRoutes,
      ...fundTransferRoutes,
      ...chequeRoutes,
      ...bankAccountRoutes,
      ...cashAccountRoutes,
      ...paymentQrRoutes,
      ...bankSlipRoutes,
      ...bankTransactionRoutes,
      ...cashTransactionRoutes,
      ...cashDenominationRoutes,

      // Catalog
      ...catalogRoutes,
      ...workspaceProductRoutes,
      ...globalProductRoutes,
      ...hsnMasterRoutes,
      ...manufacturerMasterRoutes,
      ...uomMasterRoutes,
      ...categoryMasterRoutes,
      ...productFormMasterRoutes,
      ...saltMasterRoutes,
      ...bankMasterRoutes,
      // Marketplace
      ...marketplaceStoreRoutes,
      ...marketplaceProductRoutes,
    ],
  },

  // 404
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
