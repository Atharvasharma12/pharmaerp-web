import { motion, AnimatePresence } from "framer-motion";

import SettingsNav from "../../components/SettingsNav";
import ProfileTab from "../../components/tabs/ProfileTab";
import AppearanceTab from "../../components/tabs/AppearanceTab";
import NotificationsTab from "../../components/tabs/NotificationsTab";
import SecurityTab from "../../components/tabs/SecurityTab";
import BillingTab from "../../components/tabs/BillingTab";
import IntegrationsTab from "../../components/tabs/IntegrationsTab";

const SettingsDesktopPage = ({ activeTab = "profile", onTabChange }) => {
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
    <section className="relative flex w-full flex-col">
      <div className="w-full space-y-4">
        {/* Page Header (Compact, Zero Top Waste) */}
        <div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-text leading-tight">
            Settings
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-text-muted leading-relaxed">
            Manage your account profile, appearance, notifications, security,
            billing, and third-party integrations.
          </p>
        </div>

        {/* Single-Row Horizontal Tab Bar (Fit to Content) */}
        <SettingsNav activeTab={activeTab} onTabChange={onTabChange} />

        {/* Active Tab Content Surface */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
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

export default SettingsDesktopPage;
