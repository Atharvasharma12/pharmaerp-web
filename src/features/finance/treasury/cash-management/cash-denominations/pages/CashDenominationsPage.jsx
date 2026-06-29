import React from "react";

import { useIsMobile } from "@/hooks";

import { CashDenominationsDesktopPage } from "./desktop";
import { CashDenominationsMobilePage } from "./mobile";

const CashDenominationsPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <CashDenominationsMobilePage />
  ) : (
    <CashDenominationsDesktopPage />
  );
};

export default CashDenominationsPage;
