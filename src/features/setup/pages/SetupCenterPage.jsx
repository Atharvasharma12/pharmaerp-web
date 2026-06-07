// src/features/setup/pages/SetupCenterPage.jsx

import { useIsMobile } from "@/hooks";

import SetupCenterDesktopPage from "./desktop/SetupCenterDesktopPage";
import SetupCenterMobilePage from "./mobile/SetupCenterMobilePage";

const SetupCenterPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <SetupCenterMobilePage /> : <SetupCenterDesktopPage />;
};

export default SetupCenterPage;
