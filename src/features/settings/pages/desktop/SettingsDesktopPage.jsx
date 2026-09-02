// src/features/settings/pages/desktop/SettingsDesktopPage.jsx

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, Bell, Lock, CreditCard, Plug } from "lucide-react";
import { UIPageHeader, UITabs } from "@/components/ui";
import { usePermission } from "@/hooks";

import ProfileTab from "../../components/tabs/ProfileTab";
import AppearanceTab from "../../components/tabs/AppearanceTab";
import NotificationsTab from "../../components/tabs/NotificationsTab";
import SecurityTab from "../../components/tabs/SecurityTab";
import BillingTab from "../../components/tabs/BillingTab";
import IntegrationsTab from "../../components/tabs/IntegrationsTab";

export const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: <User className="size-3.5" />, requireSetup: false },
  { id: "appearance", label: "Appearance", icon: <Palette className="size-3.5" />, requireSetup: false },
  { id: "security", label: "Security", icon: <Lock className="size-3.5" />, requireSetup: false },
  { id: "notifications", label: "Notifications", icon: <Bell className="size-3.5" />, requireSetup: true },
  { id: "billing", label: "Billing", icon: <CreditCard className="size-3.5" />, permission: "subscription:view", requireSetup: true },
  { id: "integrations", label: "Integrations", icon: <Plug className="size-3.5" />, permission: "workspace:update", requireSetup: true },
];

const SettingsDesktopPage = ({
  activeTab = "profile",
  onTabChange,
  isSetupComplete = true,
}) => {
  const { can } = usePermission();

  // Filter visible tabs based on user permissions and setup completion
  const visibleTabs = useMemo(
    () =>
      SETTINGS_TABS.filter((t) => {
        if (t.requireSetup && !isSetupComplete) return false;
        if (t.permission && !can(t.permission)) return false;
        return true;
      }),
    [can, isSetupComplete]
  );

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
          description="Manage your account profile, appearance, security, notifications, billing, and third-party integrations."
          bordered={false}
          compact={true}
          className="pb-0 pt-0"
        />

        {/* Reusable UITabs Primitive */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <UITabs
            tabs={visibleTabs}
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
