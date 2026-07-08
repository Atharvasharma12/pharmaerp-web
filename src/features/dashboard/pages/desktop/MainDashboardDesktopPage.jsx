import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppAlert, AppBox, AppHeading, AppText, AppCard } from "@/components";

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
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

const MainDashboardDesktopPage = () => {
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
    <section className="min-h-screen bg-bg p-8">
      {showToast && (
        <TopToast
          message="🎉 Welcome! Your 14-day free trial has started."
          onClose={() => setShowToast(false)}
        />
      )}
      
      <AppBox sx={{ maxWidth: 1200, mx: "auto" }}>
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          sx={{
            p: 4,
            mb: 4,
            bgcolor: "color-mix(in srgb, var(--app-color-primary) 5%, var(--app-color-surface))",
            borderLeft: "5px solid var(--app-color-primary)",
          }}
        >
          <AppHeading level={1} weight={800} sx={{ fontSize: "28px", mb: 1, color: "var(--app-color-text)" }}>
            Welcome to PharmaERP!
          </AppHeading>
          <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontSize: "15px" }}>
            We've set up your brand new workspace and started your 14-day free trial subscription. 
            Use the Setup Center list to finish creating your companies, branch locations, and staff profiles!
          </AppText>
        </AppCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 3 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "16px", mb: 1.5 }}>Sales Overview</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>Get insights on your pharmacy branches' sales.</AppText>
          </AppCard>
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 3 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "16px", mb: 1.5 }}>Inventory Stats</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>Monitor medicine stock, catalog, and low-stock alerts.</AppText>
          </AppCard>
          <AppCard variant="default" rounded="lg" bordered sx={{ p: 3 }}>
            <AppHeading level={3} weight={700} sx={{ fontSize: "16px", mb: 1.5 }}>Quick Actions</AppHeading>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>Create bills, register customers, and place purchase orders.</AppText>
          </AppCard>
        </div>
      </AppBox>
    </section>
  );
};

export default MainDashboardDesktopPage;
