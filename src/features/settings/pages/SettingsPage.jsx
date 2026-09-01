// src/features/settings/pages/SettingsPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile, usePermission } from "@/hooks";
import { ROUTES } from "@/constants";
import AccessDeniedPage from "@/pages/AccessDeniedPage";

import SettingsDesktopPage from "./desktop/SettingsDesktopPage";
import SettingsMobilePage from "./mobile/SettingsMobilePage";

const TAB_PERMISSIONS = {
  profile: null,
  appearance: null,
  notifications: null,
  security: null,
  billing: "subscription:view",
  integrations: "workspace:update",
};

const VALID_TABS = Object.keys(TAB_PERMISSIONS);

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const { tab } = useParams();
  const navigate = useNavigate();
  const { can } = usePermission();

  const activeTab =
    tab && VALID_TABS.includes(tab.toLowerCase())
      ? tab.toLowerCase()
      : "profile";

  // If requested tab requires permission that the current user lacks, render AccessDeniedPage
  const requiredPermission = TAB_PERMISSIONS[activeTab];
  if (requiredPermission && !can(requiredPermission)) {
    return <AccessDeniedPage requiredPermission={requiredPermission} />;
  }

  const handleTabChange = (newTab) => {
    if (newTab === "profile") {
      navigate(ROUTES.SETTINGS);
    } else {
      navigate(`${ROUTES.SETTINGS}/${newTab}`);
    }
  };

  if (isMobile) {
    return (
      <SettingsMobilePage
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  }

  return (
    <SettingsDesktopPage
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

export default SettingsPage;
