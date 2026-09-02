// src/features/settings/pages/SettingsPage.jsx

import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useIsMobile, usePermission } from "@/hooks";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";
import { ROUTES } from "@/constants";
import AccessDeniedPage from "@/pages/AccessDeniedPage";

import SettingsDesktopPage from "./desktop/SettingsDesktopPage";
import SettingsMobilePage from "./mobile/SettingsMobilePage";

export const TAB_CONFIG = {
  profile: { permission: null, requireSetup: false },
  appearance: { permission: null, requireSetup: false },
  security: { permission: null, requireSetup: false },
  notifications: { permission: null, requireSetup: true },
  billing: { permission: "subscription:view", requireSetup: true },
  integrations: { permission: "workspace:update", requireSetup: true },
};

const VALID_TABS = Object.keys(TAB_CONFIG);

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const { tab } = useParams();
  const navigate = useNavigate();
  const { can } = usePermission();
  const { isSetupComplete } = useSetupStatus();

  const activeTab =
    tab && VALID_TABS.includes(tab.toLowerCase())
      ? tab.toLowerCase()
      : "profile";

  const tabConfig = TAB_CONFIG[activeTab];

  // 1. Guard against accessing setup-dependent tabs before workspace setup is 100% complete
  if (tabConfig?.requireSetup && !isSetupComplete) {
    return <Navigate to={ROUTES.SETTINGS} replace />;
  }

  // 2. Guard against missing user permissions
  if (tabConfig?.permission && !can(tabConfig.permission)) {
    return <AccessDeniedPage requiredPermission={tabConfig.permission} />;
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
        isSetupComplete={isSetupComplete}
      />
    );
  }

  return (
    <SettingsDesktopPage
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isSetupComplete={isSetupComplete}
    />
  );
};

export default SettingsPage;
