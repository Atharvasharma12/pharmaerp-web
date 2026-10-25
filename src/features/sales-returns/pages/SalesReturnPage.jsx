import React from "react";
import { useIsMobile } from "@/hooks";
import SalesReturnDesktopPage from "./desktop/SalesReturnDesktopPage";
import SalesReturnMobilePage from "./mobile/SalesReturnMobilePage";

export const SalesReturnPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <SalesReturnMobilePage /> : <SalesReturnDesktopPage />;
};

export default SalesReturnPage;
