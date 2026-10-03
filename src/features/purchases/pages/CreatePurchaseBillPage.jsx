import React from "react";
import { useIsMobile } from "@/hooks";
import CreatePurchaseBillDesktopPage from "./desktop/CreatePurchaseBillDesktopPage";
import CreatePurchaseBillMobilePage from "./mobile/CreatePurchaseBillMobilePage";

export const CreatePurchaseBillPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <CreatePurchaseBillMobilePage /> : <CreatePurchaseBillDesktopPage />;
};

export default CreatePurchaseBillPage;
