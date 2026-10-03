// src/features/sales/pages/SalesPage.jsx

import React from "react";
import { useIsMobile } from "@/hooks";
import SalesDesktopPage from "./desktop/SalesDesktopPage";
import SalesMobilePage from "./mobile/SalesMobilePage";

export const SalesPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <SalesMobilePage /> : <SalesDesktopPage />;
};

export default SalesPage;
