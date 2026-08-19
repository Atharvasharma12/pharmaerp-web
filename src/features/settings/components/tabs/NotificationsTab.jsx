import { useState } from "react";
import SettingsCard from "../SettingsCard";
import SettingsToggle from "../SettingsToggle";

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
      <SettingsCard
        title="Orders & Customers"
        description="Alerts for new orders, customer registrations, and inventory thresholds"
      >
        <div className="divide-y divide-border/60">
          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-order-confirmations"
              label="Order confirmations"
              description="Get notified when a new order is placed"
              checked={notifications.orderConfirmations}
              onChange={handleToggle("orderConfirmations")}
            />
          </div>

          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-new-customers"
              label="New customers"
              description="Alert when a new customer registers"
              checked={notifications.newCustomers}
              onChange={handleToggle("newCustomers")}
            />
          </div>

          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-refund-requests"
              label="Refund requests"
              description="Notify when a refund is submitted"
              checked={notifications.refundRequests}
              onChange={handleToggle("refundRequests")}
            />
          </div>

          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-low-stock"
              label="Low stock warnings"
              description="Alert when inventory drops below threshold"
              checked={notifications.lowStockWarnings}
              onChange={handleToggle("lowStockWarnings")}
            />
          </div>
        </div>
      </SettingsCard>

      {/* ── CARD 2: Reports & Marketing ───────────────────────── */}
      <SettingsCard
        title="Reports & Marketing"
        description="Summaries, campaign analytics digests, and promotional updates"
      >
        <div className="divide-y divide-border/60">
          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-weekly-summary"
              label="Weekly summary"
              description="Receive a weekly performance digest"
              checked={notifications.weeklySummary}
              onChange={handleToggle("weeklySummary")}
            />
          </div>

          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-campaign-performance"
              label="Campaign performance"
              description="Updates on active campaign metrics"
              checked={notifications.campaignPerformance}
              onChange={handleToggle("campaignPerformance")}
            />
          </div>

          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-marketing-emails"
              label="Marketing emails"
              description="Newsletters and promotional content"
              checked={notifications.marketingEmails}
              onChange={handleToggle("marketingEmails")}
            />
          </div>
        </div>
      </SettingsCard>

      {/* ── CARD 3: System ───────────────────────────────────── */}
      <SettingsCard
        title="System Notifications"
        description="Platform and push notifications for maintenance and upgrades"
      >
        <div className="divide-y divide-border/60">
          <div className="py-2.5 first:pt-0 last:pb-0">
            <SettingsToggle
              id="notif-system-updates"
              label="System updates"
              description="Important system maintenance and feature notices"
              checked={notifications.systemUpdates}
              onChange={handleToggle("systemUpdates")}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

export default NotificationsTab;
