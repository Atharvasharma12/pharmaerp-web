// src/features/landing/components/mobile/MobileFeaturesSection.jsx

import { useMemo, useState } from "react";
import {
  FiBarChart2,
  FiBox,
  FiChevronRight,
  FiFileText,
  FiPercent,
  FiShield,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobileFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Features" },
    { id: "operations", label: "Operations" },
    { id: "inventory", label: "Inventory" },
    { id: "billing", label: "Billing" },
    { id: "more", label: "More" },
  ];

  const features = [
    {
      category: "billing",
      icon: <FiShoppingCart />,
      title: "POS Billing",
      desc: "Fast and easy POS billing with GST invoice, multiple payment options and discounts.",
      colorVariant: "primary",
    },
    {
      category: "inventory",
      icon: <FiBox />,
      title: "Inventory Management",
      desc: "Real-time stock tracking, batch-wise management, expiry alerts and low stock notifications.",
      colorVariant: "primary",
    },
    {
      category: "operations",
      icon: <FiFileText />,
      title: "Purchase Management",
      desc: "Create POs, manage suppliers, track purchases and maintain best price records.",
      colorVariant: "primary",
    },
    {
      category: "operations",
      icon: <FiUsers />,
      title: "Customer Management",
      desc: "Maintain customer profiles, purchase history, loyalty points and credit management.",
      colorVariant: "primary",
    },
    {
      category: "more",
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Get real-time insights on sales, profit, stock, expiry, tax and business performance.",
      colorVariant: "primary",
    },
    {
      category: "more",
      icon: <FiPercent />,
      title: "GST & Compliance",
      desc: "GST invoicing, returns, e-way bills and complete compliance management.",
      colorVariant: "primary",
    },
  ];

  const visibleFeatures = useMemo(() => {
    if (activeTab === "all") return features;
    return features.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <section className="w-full bg-bg">
      <AppBox sx={sectionSx}>
        <AppHeading level={1} weight={700} sx={titleSx}>
          Everything You Need to
          <span className="block text-primary">Run Your Pharmacy Better</span>
        </AppHeading>

        <AppText variant="body2" weight={500} sx={subtitleSx}>
          Powerful features designed to simplify operations, reduce manual work
          and grow your business.
        </AppText>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <AppButton
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? "contained" : "outlined"}
                colorVariant="primary"
                rounded="lg"
                sx={{
                  flexShrink: 0,
                  minWidth: "unset",
                  height: 32,
                  px: 1.35,
                  fontSize: "10.6px",
                  fontWeight: 650,
                  textTransform: "none",
                  bgcolor: isActive
                    ? "var(--app-color-primary)"
                    : "var(--app-color-surface)",
                  borderColor: "var(--app-color-border)",
                  boxShadow: isActive ? "var(--app-shadow-xs)" : "none",
                }}
              >
                {tab.label}
              </AppButton>
            );
          })}
        </div>

        <div className="mt-3 space-y-2">
          {visibleFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered={false}
          shadow="sm"
          padding="none"
          sx={bannerSx}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <AppBox sx={bannerIconSx}>
                <FiShield />
              </AppBox>

              <AppBox sx={{ minWidth: 0 }}>
                <AppHeading level={3} weight={650} sx={bannerTitleSx}>
                  Built for Indian Pharmacies
                </AppHeading>

                <AppText variant="body2" weight={500} sx={bannerTextSx}>
                  100% GST Compliant • E-invoicing Ready
                  <span className="block">Secure & Reliable</span>
                </AppText>
              </AppBox>
            </div>

            <div className="shrink-0">
              <StoreIllustration />
            </div>
          </div>
        </AppCard>
      </AppBox>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, colorVariant = "primary" }) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={featureCardSx}
    >
      <div className="flex items-center gap-2.5">
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            borderRadius: "13px",
            fontSize: "20px",
            color: `var(--app-color-${colorVariant})`,
            bgcolor: `var(--app-color-${colorVariant}-soft)`,
          }}
        >
          {icon}
        </AppBox>

        <div className="min-w-0 flex-1">
          <AppHeading level={3} weight={650} sx={cardTitleSx}>
            {title}
          </AppHeading>

          <AppText variant="body2" weight={500} sx={cardDescSx}>
            {desc}
          </AppText>
        </div>

        <FiChevronRight className="shrink-0 text-[19px] text-primary" />
      </div>
    </AppCard>
  );
};

const StoreIllustration = () => {
  return (
    <AppBox sx={storeSx}>
      <AppBox sx={storePlusSx}>✚</AppBox>
      <AppBox sx={storeRoofSx} />
      <AppBox sx={storeBodySx}>
        <AppBox sx={storeWindowSx} />
        <AppBox sx={storeWindowSx} />
      </AppBox>
    </AppBox>
  );
};

const sectionSx = {
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 2.4, sm: 2.8 },
  pt: { xs: 2, sm: 2.3 },
  pb: { xs: 1.6, sm: 2 },
};

const titleSx = {
  m: 0,
  fontSize: { xs: "23px", sm: "26px" },
  lineHeight: 1.11,
  letterSpacing: "-0.65px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 1.35,
  maxWidth: 330,
  fontSize: "13px",
  lineHeight: "20.5px",
  color: "var(--app-color-text-muted)",
};

const featureCardSx = {
  px: 1.15,
  py: 0.9,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "13.7px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const cardDescSx = {
  mt: 0.35,
  fontSize: "11.3px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const bannerSx = {
  mt: 1.7,
  minHeight: 66,
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  px: 1.1,
  py: 1,
  bgcolor: "var(--app-color-readonly-bg)",
  background:
    "linear-gradient(135deg, var(--app-color-primary-soft), var(--app-color-surface))",
};

const bannerIconSx = {
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const bannerTitleSx = {
  m: 0,
  fontSize: "12.2px",
  lineHeight: 1.1,
  color: "var(--app-color-primary)",
};

const bannerTextSx = {
  mt: 0.35,
  fontSize: "10.3px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const storeSx = {
  position: "relative",
  width: 58,
  minWidth: 58,
  height: 45,
  flexShrink: 0,
};

const storePlusSx = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 3,
  width: 15,
  height: 15,
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "9px",
  fontWeight: 800,
  boxShadow: "var(--app-shadow-xs)",
};

const storeRoofSx = {
  position: "absolute",
  top: 15,
  left: 5,
  width: 48,
  height: 12,
  borderRadius: "6px 6px 3px 3px",
  bgcolor: "var(--app-color-primary)",
};

const storeBodySx = {
  position: "absolute",
  left: 8,
  bottom: 0,
  width: 42,
  height: 23,
  borderRadius: "6px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
};

const storeWindowSx = {
  width: 12,
  height: 14,
  borderRadius: "3px",
  bgcolor: "var(--app-color-primary-soft)",
  border: "1px solid var(--app-color-border)",
};

export default MobileFeaturesSection;
