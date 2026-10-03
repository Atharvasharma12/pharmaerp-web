import { useState } from "react";
import {
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UISwitch,
} from "@/components/ui";

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState({
    // Orders & Customers
    orderConfirmations: true,
    newCustomers: true,
    refundRequests: true,
    lowStockWarnings: true,

    // Reports & Marketing
    weeklySummary: false,
    campaignPerformance: true,
    marketingEmails: false,

    // System
    systemUpdates: false,
  });

  const handleToggle = (key) => (checked) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Orders & Customers ────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Orders & Customers
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Alerts for new orders, customer registrations, and inventory thresholds
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-order-confirmations" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Order confirmations
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Get notified when a new order is placed
                </span>
              </div>
              <UISwitch
                id="notif-order-confirmations"
                checked={notifications.orderConfirmations}
                onChange={handleToggle("orderConfirmations")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-new-customers" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  New customers
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Alert when a new customer registers
                </span>
              </div>
              <UISwitch
                id="notif-new-customers"
                checked={notifications.newCustomers}
                onChange={handleToggle("newCustomers")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-refund-requests" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Refund requests
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Notify when a refund is submitted
                </span>
              </div>
              <UISwitch
                id="notif-refund-requests"
                checked={notifications.refundRequests}
                onChange={handleToggle("refundRequests")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-low-stock" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Low stock warnings
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Alert when inventory drops below threshold
                </span>
              </div>
              <UISwitch
                id="notif-low-stock"
                checked={notifications.lowStockWarnings}
                onChange={handleToggle("lowStockWarnings")}
              />
            </div>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 2: Reports & Marketing ───────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Reports & Marketing
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Summaries, campaign analytics digests, and promotional updates
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-weekly-summary" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Weekly summary
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Receive a weekly performance digest
                </span>
              </div>
              <UISwitch
                id="notif-weekly-summary"
                checked={notifications.weeklySummary}
                onChange={handleToggle("weeklySummary")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-campaign-performance" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Campaign performance
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Updates on active campaign metrics
                </span>
              </div>
              <UISwitch
                id="notif-campaign-performance"
                checked={notifications.campaignPerformance}
                onChange={handleToggle("campaignPerformance")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-marketing-emails" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Marketing emails
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Newsletters and promotional content
                </span>
              </div>
              <UISwitch
                id="notif-marketing-emails"
                checked={notifications.marketingEmails}
                onChange={handleToggle("marketingEmails")}
              />
            </div>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 3: System ───────────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            System Notifications
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Platform and push notifications for maintenance and upgrades
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="notif-system-updates" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  System updates
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Important system maintenance and feature notices
                </span>
              </div>
              <UISwitch
                id="notif-system-updates"
                checked={notifications.systemUpdates}
                onChange={handleToggle("systemUpdates")}
              />
            </div>
          </div>
        </UICardContent>
      </UICard>
    </div>
  );
};

export default NotificationsTab;
