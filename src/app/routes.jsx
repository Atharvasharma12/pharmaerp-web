import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants";

import {
  PublicLayout,
  AuthLayout,
  AppLayout,
  OnboardingLayout,
} from "@/layouts";

import { GuestRoute, ProtectedRoute, WorkspaceRequiredRoute } from "@/guards";

import authRoutes from "@/features/auth/routes/authRoutes";
import onboardingRoutes from "@/features/onboarding/routes/onboardingRoutes";
import userRoutes from "@/features/user/routes/userRoutes";

import workspaceRoutes from "@/features/workspace/routes/workspaceRoutes";
import setupRoutes from "@/features/setup/routes/setupRoutes";
import dashboardRoutes from "@/features/dashboard/routes/dashboardRoutes";

import companyRoutes from "@/features/company/routes/companyRoutes";
import branchRoutes from "@/features/branch/routes/branchRoutes";
import accessControlRoutes from "@/features/access-control/routes/accessControlRoutes";

import globalProductRoutes from "@/features/global-products/routes/globalProductRoutes";
import workspaceProductRoutes from "@/features/workspace-products/routes/workspaceProductRoutes";

import HomePage from "@/pages/HomePage";

import { LandingPage } from "@/features/landing";

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

  // Onboarding
  {
    element: (
      <ProtectedRoute>
        <OnboardingLayout />
      </ProtectedRoute>
    ),
    children: onboardingRoutes,
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

      // Catalog
      ...globalProductRoutes,
      ...workspaceProductRoutes,
    ],
  },

  // 404
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
