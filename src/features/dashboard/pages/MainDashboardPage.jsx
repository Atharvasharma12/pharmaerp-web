// src/features/dashboard/pages/MainDashboardPage.jsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uiToast } from "@/components/ui";

import { useIsMobile } from "@/hooks";

import MainDashboardDesktopPage from "./desktop/MainDashboardDesktopPage";
import MainDashboardMobilePage from "./mobile/MainDashboardMobilePage";

const MainDashboardPage = (props) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.unauthorizedContext) {
      const ctx = location.state.unauthorizedContext;
      uiToast.error("Access Denied", `You need an active ${ctx} to access that page.`);
      
      // Clean up the state so it doesn't fire again on refresh
      const state = { ...location.state };
      delete state.unauthorizedContext;
      navigate(location.pathname, { replace: true, state });
    } else if (location.state?.unauthorizedPermission) {
      uiToast.error("Access Denied", "You don't have permission to view that page.");
      
      // Clean up the state so it doesn't fire again on refresh
      const state = { ...location.state };
      delete state.unauthorizedPermission;
      navigate(location.pathname, { replace: true, state });
    }
  }, [location, navigate]);

  return isMobile ? (
    <MainDashboardMobilePage {...props} />
  ) : (
    <MainDashboardDesktopPage {...props} />
  );
};

export default MainDashboardPage;
