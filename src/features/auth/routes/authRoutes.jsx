// src/features/auth/routes/authRoutes.jsx

import { ROUTES } from "@/constants";
import { GuestRoute } from "@/guards";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const authRoutes = [
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },

  {
    path: ROUTES.REGISTER,
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
];

export default authRoutes;
