import React from "react";

import { useIsMobile } from "@/hooks";

import { CreateCashDenominationDesktopPage } from "./desktop";
import { CreateCashDenominationMobilePage } from "./mobile";

const CreateCashDenominationPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <CreateCashDenominationMobilePage />
  ) : (
    <CreateCashDenominationDesktopPage />
  );
};

export default CreateCashDenominationPage;
