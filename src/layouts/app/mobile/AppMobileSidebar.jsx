// src/layouts/app/mobile/AppMobileSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiBarChart2,
  FiBox,
  FiBriefcase,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiMapPin,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { AppButton, AppAvatar } from "@/components";
import { ROUTES } from "@/constants";

import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";

const sidebarItems = [
  {
    label: "Dashboard",
    path: ROUTES.SETUP_CENTER,
    icon: <FiHome />,
  },
  {
    label: "Companies",
    path: ROUTES.COMPANIES,
    icon: <FiBriefcase />,
  },
  {
    label: "Branches",
    path: ROUTES.BRANCHES,
    icon: <FiMapPin />,
  },
  {
    label: "Staff",
    path: ROUTES.WORKSPACE_MEMBERS,
    icon: <FiUsers />,
  },
  {
    label: "Access Control",
    path: ROUTES.ACCESS_CONTROL,
    icon: <FiUsers />,
  },
  {
    label: "Parties",
    path: ROUTES.PARTIES,
    icon: <FiUsers />,
  },
  {
    label: "Products",
    path: ROUTES.WORKSPACE_PRODUCTS,
    icon: <FiBox />,
  },
  {
    label: "Catalog",
    path: ROUTES.CATALOG,
    icon: <FiBox />,
  },
  {
    label: "Finance & Accounting",
    path: ROUTES.FINANCE,
    icon: <FiDollarSign />,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <FiBox />,
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: <FiTruck />,
  },
  {
    label: "Sales (POS)",
    path: "/sales",
    icon: <FiShoppingCart />,
  },
  {
    label: "Billing & Invoicing",
    path: "/billing",
    icon: <FiFileText />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <FiBarChart2 />,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: <FiCreditCard />,
  },

  {
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: <FiSettings />,
  },
];

const AppMobileSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { currentWorkspaceSubscription, getWorkspaceCurrentSubscription } = useSubscription();

  React.useEffect(() => {
    if (currentWorkspace?._id) {
      getWorkspaceCurrentSubscription(currentWorkspace._id).catch(() => {});
    }
  }, [currentWorkspace?._id, getWorkspaceCurrentSubscription]);

  const userName = user?.name || user?.fullName || "Admin";
  const userInitials = userName
    ?.split(" ")
    ?.map((word) => word?.[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  const planType = currentWorkspaceSubscription?.currentPlanSnapshot?.type || "free";
  const isFree = planType === "free" || currentWorkspaceSubscription?.isFree || !currentWorkspaceSubscription;

  return (
    <>
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-[60] bg-overlay transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[70] w-[285px] max-w-[82vw] border-r border-border bg-surface shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[62px] items-center justify-between border-b border-border px-4">
            <NavLink
              to={ROUTES.SETUP_CENTER}
              onClick={onClose}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
                <img
                  src="/erp-mini-logo.png"
                  alt="PharmaERP Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div>
                <div className="text-[20px] font-bold leading-none tracking-tight text-text">
                  Pharma<span className="text-primary">ERP</span>
                </div>
                <div className="mt-1 text-[10px] font-medium leading-none text-text-muted">
                  Retail Pharmacy ERP
                </div>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface-hover hover:text-primary"
            >
              <FiX className="text-[21px]" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-text-muted hover:bg-surface-hover hover:text-text",
                  ].join(" ")
                }
              >
                <span className="text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t border-border px-3 py-4">
            {isFree && (
              <div className="rounded-xl border border-primary/15 bg-primary-soft/60 p-3">
                <div className="text-[11px] font-medium text-text-muted">
                  Your Plan
                </div>

                <div className="mt-1 text-[14px] font-bold text-primary">
                  Free Tier
                </div>

                <div className="mt-2 text-[11px] leading-relaxed text-text-muted">
                  Upgrade anytime to unlock more users, branches and premium
                  features.
                </div>

                <NavLink to={ROUTES.UPGRADE_PLAN} onClick={onClose} className="w-full block">
                  <AppButton
                    fullWidth
                    variant="contained"
                    colorVariant="primary"
                    rounded="lg"
                    sx={{
                      mt: 2,
                      py: "7px",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Upgrade Plan
                  </AppButton>
                </NavLink>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-hover transition duration-200">
              <AppAvatar name={userName} initials={userInitials} size="small" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-text">
                  {userName}
                </div>
                <div className="truncate text-[10px] text-text-muted">
                  {user?.email}
                </div>
              </div>
              <div className="shrink-0 rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                {planType}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppMobileSidebar;
