// src/app/routes.jsx

import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants";

import { PublicLayout, AuthLayout } from "@/layouts";

import authRoutes from "@/features/auth/routes/authRoutes";

import { LandingPage } from "@/features/landing";

import HomePage from "@/pages/HomePage";

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
        element: <LandingPage />,
      },

      /**
       * PUBLIC PAGES
       */
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
   * 404 ROUTE
   * ------------------------------------------------
   */
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
