// src/features/dashboard/pages/MainDashboardPage.jsx

import { useIsMobile } from "@/hooks";

import MainDashboardDesktopPage from "./desktop/MainDashboardDesktopPage";
import MainDashboardMobilePage from "./mobile/MainDashboardMobilePage";

const MainDashboardPage = (props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MainDashboardMobilePage {...props} />
  ) : (
    <MainDashboardDesktopPage {...props} />
  );
};

export default MainDashboardPage;
