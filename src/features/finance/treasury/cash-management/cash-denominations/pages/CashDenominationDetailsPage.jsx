import React from "react";

import { useIsMobile } from "@/hooks";

import { CashDenominationDetailsDesktopPage } from "./desktop";
import { CashDenominationDetailsMobilePage } from "./mobile";

const CashDenominationDetailsPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <CashDenominationDetailsMobilePage />
  ) : (
    <CashDenominationDetailsDesktopPage />
  );
};

export default CashDenominationDetailsPage;
