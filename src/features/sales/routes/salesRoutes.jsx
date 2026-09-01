// src/features/sales/routes/salesRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import SalesPage from "../pages/SalesPage";

export const salesRoutes = [
  {
    path: ROUTES.SALES,
    element: <SalesPage />,
  },
];

export default salesRoutes;
