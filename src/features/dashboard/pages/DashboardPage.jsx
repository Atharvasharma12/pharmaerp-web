// src/features/dashboard/pages/DashboardPage.jsx

import { useIsMobile } from "@/hooks";

import DashboardDesktopPage from "./desktop/DashboardDesktopPage";
import DashboardMobilePage from "./mobile/DashboardMobilePage";

const DashboardPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <DashboardMobilePage /> : <DashboardDesktopPage />;
};

export default DashboardPage;
