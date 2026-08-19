import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks";
import { ROUTES } from "@/constants";

import SettingsDesktopPage from "./desktop/SettingsDesktopPage";
import SettingsMobilePage from "./mobile/SettingsMobilePage";

const VALID_TABS = [
  "profile",
  "appearance",
  "notifications",
  "security",
  "billing",
  "integrations",
];

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab =
    tab && VALID_TABS.includes(tab.toLowerCase())
      ? tab.toLowerCase()
      : "profile";

  const handleTabChange = (newTab) => {
    if (newTab === "profile") {
      navigate(ROUTES.SETTINGS);
    } else {
      navigate(`${ROUTES.SETTINGS}/${newTab}`);
    }
  };

  if (isMobile) {
    return <SettingsMobilePage />;
  }

  return (
    <SettingsDesktopPage
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

export default SettingsPage;
