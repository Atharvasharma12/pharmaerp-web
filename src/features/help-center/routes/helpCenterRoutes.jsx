// src/features/help-center/routes/helpCenterRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import HelpCenterPage from "../pages/HelpCenterPage";

export const helpCenterRoutes = [
  {
    path: ROUTES.HELP_CENTER,
    element: <HelpCenterPage />,
  },
];

export default helpCenterRoutes;
