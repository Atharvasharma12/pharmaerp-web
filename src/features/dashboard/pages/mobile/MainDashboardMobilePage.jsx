import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppAlert, AppBox, AppHeading, AppText, AppCard } from "@/components";

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-24px)] max-w-sm -translate-x-1/2">
    <AppAlert
      severity="success"
      variant="filled"
      title={message}
      closable
      onClose={onClose}
      sx={{ boxShadow: "var(--app-shadow-lg)" }}
    />
  </div>
);

const MainDashboardMobilePage = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.showWelcomeToast) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <section className="min-h-screen bg-bg px-4 py-6">
      {showToast && (
        <TopToast
          message="🎉 Welcome! Your 14-day free trial has started."
          onClose={() => setShowToast(false)}
        />
      )}
      
      <AppBox sx={{ width: "100%" }}>
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "color-mix(in srgb, var(--app-color-primary) 5%, var(--app-color-surface))",
            borderLeft: "4px solid var(--app-color-primary)",
          }}
        >
          <AppHeading level={2} weight={800} sx={{ fontSize: "20px", mb: 0.8, color: "var(--app-color-text)" }}>
            Welcome to PharmaERP
          </AppHeading>
          <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "13px", lineHeight: "19px" }}>
            Workspace ready! We have activated your 14-day free trial.
            Complete your setup steps inside the Setup Center to start working.
          </AppText>
        </AppCard>

        <div className="flex flex-col gap-4">
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 2.5 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "14px", mb: 1 }}>Sales Overview</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "12px" }}>Get insights on your pharmacy branches' sales.</AppText>
          </AppCard>
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 2.5 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "14px", mb: 1 }}>Inventory Stats</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "12px" }}>Monitor medicine stock and low-stock alerts.</AppText>
          </AppCard>
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 2.5 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "14px", mb: 1 }}>Quick Actions</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "12px" }}>Create bills, register customers, and place orders.</AppText>
          </AppCard>
        </div>
      </AppBox>
    </section>
  );
};

export default MainDashboardMobilePage;
