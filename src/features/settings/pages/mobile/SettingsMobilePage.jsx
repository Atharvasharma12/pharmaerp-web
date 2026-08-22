import { motion, AnimatePresence } from "framer-motion";
import { UIPageHeader, UITabs } from "@/components/ui";

import { SETTINGS_TABS } from "../desktop/SettingsDesktopPage";
import ProfileTab from "../../components/tabs/ProfileTab";
import AppearanceTab from "../../components/tabs/AppearanceTab";
import NotificationsTab from "../../components/tabs/NotificationsTab";
import SecurityTab from "../../components/tabs/SecurityTab";
import BillingTab from "../../components/tabs/BillingTab";
import IntegrationsTab from "../../components/tabs/IntegrationsTab";

const SettingsMobilePage = ({ activeTab = "profile", onTabChange }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "appearance":
        return <AppearanceTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "billing":
        return <BillingTab />;
      case "integrations":
        return <IntegrationsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <section className="relative flex w-full flex-col font-sans px-3 pt-2 pb-20">
      <div className="w-full space-y-3.5">
        <UIPageHeader
          title="Settings"
          description="Manage your profile, theme, and store preferences."
          bordered={false}
          compact={true}
          className="pb-0 pt-0"
        />

        {/* Reusable scrollable pill tab bar */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <UITabs
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onChange={(tabId) => onTabChange(tabId)}
            variant="pill"
            size="sm"
          />
        </div>

        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
};

export default SettingsMobilePage;
