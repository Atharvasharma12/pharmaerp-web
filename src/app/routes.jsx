// src/app/routes.jsx

import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants";

import {
  PublicLayout,
  AuthLayout,
  AppLayout,
  OnboardingLayout,
} from "@/layouts";

import authRoutes from "@/features/auth/routes/authRoutes";
import onboardingRoutes from "@/features/onboarding/routes/onboardingRoutes";
import dashboardRoutes from "@/features/dashboard/routes/dashboardRoutes";
// import companyRoutes from "@/features/company/routes/companyRoutes";
// import branchRoutes from "@/features/branch/routes/branchRoutes";

import HomePage from "@/pages/HomePage";
import companyRoutes from "@/features/company/routes/companyRoutes";
import branchRoutes from "@/features/branch/routes/branchRoutes";

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
  /**
   * ------------------------------------------------
   * PUBLIC ROUTES
   * ------------------------------------------------
   */
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
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

  /**
   * ------------------------------------------------
   * AUTH ROUTES
   * ------------------------------------------------
   */
  {
    element: <AuthLayout />,
    children: authRoutes,
  },

  /**
   * ------------------------------------------------
   * ONBOARDING ROUTES
   * ------------------------------------------------
   */
  {
    element: <OnboardingLayout />,
    children: onboardingRoutes,
  },

  /**
   * ------------------------------------------------
   * APP ROUTES
   * ------------------------------------------------
   */
  {
    element: <AppLayout />,
    children: [...dashboardRoutes, ...companyRoutes, ...branchRoutes],
  },

  /**
   * ------------------------------------------------
   * 404 ROUTE
   * ------------------------------------------------
   */
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
