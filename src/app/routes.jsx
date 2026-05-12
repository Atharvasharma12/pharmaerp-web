// src/app/routes.jsx

import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants";

import { PublicLayout, AuthLayout } from "@/layouts";

import authRoutes from "@/features/auth/routes/authRoutes";

import { LandingPage } from "@/features/landing";
import HomePage from "@/pages/HomePage";

const NotFoundPage = () => {
  return <div>404 - Page Not Found</div>;
};

export const router = createBrowserRouter([
  // PUBLIC PAGES
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
    ],
  },

  // AUTH PAGES
  {
    element: <AuthLayout />,
    children: authRoutes,
  },

  // 404
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
