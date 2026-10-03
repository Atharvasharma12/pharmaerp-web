// src/features/landing/components/desktop/DesktopDashboardShowcaseSection.jsx

import { useState } from "react";
import {
  FiBarChart2,
  FiBox,
  FiClock,
  FiCreditCard,
  FiEye,
  FiLayout,
  FiMonitor,
  FiShield,
  FiSmartphone,
  FiTrendingUp,
} from "react-icons/fi";

import {
  AppBadge,
  AppBox,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const DesktopDashboardShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    {
      id: "all",
      label: "All Dashboards",
      icon: <FiLayout />,
    },
    {
      id: "overview",
      label: "Overview Dashboard",
      icon: <FiMonitor />,
      image: "/overview-dashboard.png",
      alt: "Overview Dashboard",
    },
    {
      id: "pos",
      label: "POS / Billing Screen",
      icon: <FiCreditCard />,
      image: "/pos-billing-screen.png",
      alt: "POS Billing Screen",
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: <FiBox />,
      image: "/inventory-management.png",
      alt: "Inventory Management",
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: <FiBarChart2 />,
      image: "/reports-analytics.png",
      alt: "Reports Analytics",
    },
    {
      id: "mobile",
      label: "Mobile App",
      icon: <FiSmartphone />,
      image: "/mobile-app-preview.png",
      alt: "Mobile App Preview",
    },
  ];

  const benefits = [
    {
      icon: <FiEye />,
      title: "Real-time Insights",
      text: "Live data to help you make quick decisions.",
    },
    {
      icon: <FiBarChart2 />,
      title: "Better Control",
      text: "Track every activity across your store.",
    },
    {
      icon: <FiShield />,
      title: "Data You Can Trust",
      text: "Accurate, secure and always up-to-date.",
    },
    {
      icon: <FiClock />,
      title: "Save More Time",
      text: "Automated reports and smart alerts.",
    },
    {
      icon: <FiTrendingUp />,
      title: "Grow Your Business",
      text: "Insights that help you increase profits.",
    },
  ];

  const activeItem = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="relative w-full overflow-hidden bg-bg py-12">
      <AppBox
        sx={{
          pointerEvents: "none",
          position: "absolute",
          insetInline: 0,
          top: 235,
          height: 430,
          background:
            "linear-gradient(to bottom, var(--app-color-primary-soft), transparent)",
          opacity: 0.45,
        }}
      />

      <AppBox
        sx={{
          pointerEvents: "none",
          position: "absolute",
          right: 80,
          bottom: 80,
          width: 256,
          height: 256,
          borderRadius: "999px",
          bgcolor: "var(--app-color-primary-soft)",
          opacity: 0.6,
          filter: "blur(48px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <AppBadge
            variant="soft"
            colorVariant="primary"
            rounded="full"
            startIcon={<FiMonitor />}
            label="Powerful Insights, Real-time Control"
            sx={{
              mb: 2,
              px: 1.5,
              py: 0.75,
              fontSize: "12px",
              fontWeight: 700,
            }}
          />

          <AppHeading
            level={2}
            weight={800}
            sx={{
              m: 0,
              fontSize: {
                xs: "30px",
                sm: "38px",
                lg: "46px",
              },
              lineHeight: 1.08,
              letterSpacing: "-0.9px",
              color: "var(--app-color-text)",
            }}
          >
            Everything at a Glance with{" "}
            <span className="text-primary">Smart Dashboards</span>
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mx: "auto",
              mt: 2,
              maxWidth: "48rem",
              fontSize: "15px",
              lineHeight: "28px",
              color: "var(--app-color-text-muted)",
            }}
          >
            PharmaERP dashboards give you real-time insights into your pharmacy
            operations so you can make faster, smarter decisions.
          </AppText>
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mx: "auto",
            mt: 4.5,
            maxWidth: 1280,
            overflow: "hidden",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            bgcolor: "var(--app-color-surface)",
            borderColor: "var(--app-color-border)",
            boxShadow: "var(--app-shadow-md)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </AppCard>

        <AppBox
          sx={{
            mx: "auto",
            maxWidth: 1280,
            px: { xs: 2, sm: 2.5, lg: 3 },
            pt: 3,
            pb: 3.5,
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            bgcolor:
              "color-mix(in srgb, var(--app-color-primary-soft) 55%, transparent)",
          }}
        >
          {activeTab === "all" ? (
            <div className="grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <ImageCard
                src="/overview-dashboard.png"
                alt="Overview Dashboard"
                large
              />

              <div className="grid items-start gap-4">
                <div className="grid items-start gap-4 md:grid-cols-2">
                  <ImageCard
                    src="/pos-billing-screen.png"
                    alt="POS Billing Screen"
                  />

                  <ImageCard
                    src="/inventory-management.png"
                    alt="Inventory Management"
                  />
                </div>

                <div className="grid items-start gap-4 md:grid-cols-[0.95fr_1.05fr]">
                  <ImageCard
                    src="/reports-analytics.png"
                    alt="Reports Analytics"
                  />

                  <ImageCard
                    src="/mobile-app-preview.png"
                    alt="Mobile App Preview"
                  />
                </div>
              </div>
            </div>
          ) : (
            <ImageCard src={activeItem.image} alt={activeItem.alt} large />
          )}
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mx: "auto",
            mt: -0.5,
            maxWidth: 1180,
            px: 2.5,
            py: 3,
            bgcolor: "var(--app-color-surface)",
            borderColor: "var(--app-color-border)",
            boxShadow: "var(--app-shadow-md)",
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((item) => (
              <BenefitItem key={item.title} {...item} />
            ))}
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const TabButton = ({ tab, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-[72px] items-center justify-center gap-2.5 border-b px-2 transition lg:border-b-0 lg:border-r"
      style={{
        borderColor: "var(--app-color-border)",
        backgroundColor: "var(--app-color-surface)",
        color: active
          ? "var(--app-color-primary)"
          : "var(--app-color-text-muted)",
      }}
    >
      <AppBox
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
          color: active
            ? "var(--app-color-primary)"
            : "var(--app-color-text-muted)",
        }}
      >
        {tab.icon}
      </AppBox>

      <AppText
        component="span"
        variant="body2"
        weight={800}
        sx={{
          fontSize: "13px",
          whiteSpace: "nowrap",
          color: active
            ? "var(--app-color-primary)"
            : "var(--app-color-text-muted)",
        }}
      >
        {tab.label}
      </AppText>

      {active && (
        <AppBox
          component="span"
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 3,
            bgcolor: "var(--app-color-primary)",
          }}
        />
      )}
    </button>
  );
};

const ImageCard = ({ src, alt, large = false }) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      shadow="md"
      padding="none"
      sx={{
        p: 1,
        bgcolor: "var(--app-color-surface)",
        boxShadow: large ? "var(--app-shadow-lg)" : "var(--app-shadow-md)",
      }}
    >
      <img src={src} alt={alt} className="h-auto w-full object-contain" />
    </AppCard>
  );
};

const BenefitItem = ({ icon, title, text }) => {
  return (
    <AppStack direction="row" align="center" gap={1.5}>
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 48,
          height: 48,
          minWidth: 48,
          flexShrink: 0,
          borderRadius: "999px",
          bgcolor: "var(--app-color-primary-soft)",
          color: "var(--app-color-primary)",
          fontSize: "25px",
          lineHeight: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppBox>
        <AppHeading
          level={4}
          weight={800}
          sx={{
            m: 0,
            fontSize: "13px",
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppHeading>

        <AppText
          variant="body2"
          sx={{
            mt: 0.5,
            fontSize: "12.5px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {text}
        </AppText>
      </AppBox>
    </AppStack>
  );
};

export default DesktopDashboardShowcaseSection;
