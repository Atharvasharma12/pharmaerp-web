import { User, Palette, Bell, Lock, CreditCard, Plug } from "lucide-react";
import { motion } from "framer-motion";

export const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Plug,
  },
];

const SettingsNav = ({ activeTab, onTabChange }) => {
  return (
    <nav
      aria-label="Settings Navigation Tabs"
      className="w-full overflow-x-auto auto-hide-scrollbar"
    >
      <div className="inline-flex w-fit items-center gap-0.5 rounded-[8px] border border-border bg-surface-alt/70 p-0.5 shadow-2xs">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? "text-primary font-bold shadow-2xs"
                  : "text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeHorizontalSettingsTab"
                  className="absolute inset-0 rounded-[6px] bg-surface border border-border/80 shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Icon
                size={13.5}
                className={`relative z-10 shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SettingsNav;
