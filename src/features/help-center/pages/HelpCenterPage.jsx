// src/features/help-center/pages/HelpCenterPage.jsx

import React from "react";
import { useIsMobile } from "@/hooks";
import HelpCenterDesktopPage from "./desktop/HelpCenterDesktopPage";
import HelpCenterMobilePage from "./mobile/HelpCenterMobilePage";

export const HelpCenterPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <HelpCenterMobilePage /> : <HelpCenterDesktopPage />;
};

export default HelpCenterPage;
