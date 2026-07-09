// src/layouts/app/desktop/AppDesktopSidebar.jsx

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

const SIDEBAR_WIDTH = 230;

const AppDesktopSidebar = ({ open = true, onClose }) => {
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
    <div
      className={[
        "relative shrink-0",
        "transition-all duration-300 ease-in-out",
        open ? `w-[${SIDEBAR_WIDTH}px]` : "w-0",
      ].join(" ")}
      style={{
        width: open ? SIDEBAR_WIDTH : 0,
      }}
    >
      <aside
        className={[
          "fixed left-0 top-0 z-30",
          "h-screen border-r border-divider bg-surface/95 backdrop-blur-md",
          "transition-transform duration-300 ease-in-out",
          "will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{
          width: SIDEBAR_WIDTH,
        }}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-[58px] shrink-0 items-center px-5 border-b border-divider">
            <NavLink
              to={ROUTES.SETUP_CENTER}
              className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-divider bg-surface shadow-sm">
                <img
                  src="/erp-mini-logo.png"
                  alt="PharmaERP Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-[20px] font-semibold leading-none tracking-tight text-text">
                  <span className="text-primary">Pharma</span>ERP
                </div>

                <div className="mt-1 truncate text-[11px] font-normal leading-none text-text-muted">
                  Retail Pharmacy ERP
                </div>
              </div>
            </NavLink>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-text-muted hover:bg-surface-hover hover:text-text",
                    ].join(" ")
                  }
                >
                  <span className="text-[17px]">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="shrink-0 space-y-3 px-3 pb-4">
            {isFree && (
              <div className="rounded-xl border border-primary/15 bg-primary-soft/60 p-3">
                <div className="text-[11px] font-medium text-text-muted">
                  Your Plan
                </div>

                <div className="mt-1 text-[14px] font-semibold text-primary">
                  Free Tier
                </div>

                <div className="my-3 h-px bg-border" />

                <div className="text-[11px] font-medium text-text">
                  Lifetime Free Tier
                </div>

                <div className="mt-1 text-[11px] text-text-muted">
                  No credit card required.
                </div>

                <NavLink to={ROUTES.UPGRADE_PLAN} className="w-full block">
                  <AppButton
                    fullWidth
                    variant="contained"
                    colorVariant="primary"
                    rounded="lg"
                    sx={{
                      mt: 2,
                      py: "7px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Upgrade Plan
                  </AppButton>
                </NavLink>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-divider p-3">
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

      {open && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="fixed left-[215px] top-[14px] z-50 flex h-8 w-8 items-center justify-center rounded-full border border-divider bg-surface text-text-muted shadow-sm transition-all duration-300 hover:bg-surface-hover hover:text-primary"
        >
          <FiX className="text-[17px]" />
        </button>
      )}
    </div>
  );
};

export default AppDesktopSidebar;
