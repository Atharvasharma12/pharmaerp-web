// src/features/purchases/pages/PurchasesPage.jsx

import React from "react";
import { useIsMobile } from "@/hooks";
import PurchasesDesktopPage from "./desktop/PurchasesDesktopPage";
import PurchasesMobilePage from "./mobile/PurchasesMobilePage";

export const PurchasesPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <PurchasesMobilePage /> : <PurchasesDesktopPage />;
};

export default PurchasesPage;
