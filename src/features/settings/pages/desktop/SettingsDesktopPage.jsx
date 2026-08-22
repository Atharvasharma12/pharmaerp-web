import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, Bell, Lock, CreditCard, Plug } from "lucide-react";
import { UIPageHeader, UITabs } from "@/components/ui";

import ProfileTab from "../../components/tabs/ProfileTab";
import AppearanceTab from "../../components/tabs/AppearanceTab";
import NotificationsTab from "../../components/tabs/NotificationsTab";
import SecurityTab from "../../components/tabs/SecurityTab";
import BillingTab from "../../components/tabs/BillingTab";
import IntegrationsTab from "../../components/tabs/IntegrationsTab";

export const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: <User className="size-3.5" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="size-3.5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="size-3.5" /> },
  { id: "security", label: "Security", icon: <Lock className="size-3.5" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="size-3.5" /> },
  { id: "integrations", label: "Integrations", icon: <Plug className="size-3.5" /> },
];

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
    <section className="relative flex w-full flex-col font-sans">
      <div className="w-full space-y-4">
        {/* Standardized Page Header */}
        <UIPageHeader
          title="Settings"
          description="Manage your account profile, appearance, notifications, security, billing, and third-party integrations."
          bordered={false}
          compact={true}
          className="pb-0 pt-0"
        />

        {/* Reusable UITabs Primitive */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <UITabs
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onChange={(tabId) => onTabChange(tabId)}
            variant="pill"
            size="sm"
          />
        </div>

        {/* Active Tab Content Surface */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
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
