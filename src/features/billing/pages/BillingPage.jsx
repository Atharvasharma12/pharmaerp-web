// src/features/billing/pages/BillingPage.jsx

import React from "react";
import { useIsMobile } from "@/hooks";
import BillingDesktopPage from "./desktop/BillingDesktopPage";
import BillingMobilePage from "./mobile/BillingMobilePage";

export const BillingPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <BillingMobilePage /> : <BillingDesktopPage />;
};

export default BillingPage;
