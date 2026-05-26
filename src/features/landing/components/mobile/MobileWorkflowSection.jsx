// src/features/landing/components/mobile/MobileWorkflowSection.jsx

import { useMemo, useState } from "react";
import {
  FiBarChart2,
  FiChevronRight,
  FiCheckCircle,
  FiFileText,
  FiGrid,
  FiPackage,
  FiShoppingCart,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobileWorkflowSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Steps" },
    { id: "purchase", label: "Purchase" },
    { id: "inventory", label: "Inventory" },
    { id: "sales", label: "Sales" },
    { id: "reports", label: "Reports" },
  ];

  const steps = [
    {
      category: "purchase",
      number: "1",
      icon: <FiShoppingCart />,
      title: "Purchase",
      desc: "Create purchase orders, select suppliers, compare prices and place orders.",
      colorVariant: "primary",
    },
    {
      category: "purchase",
      number: "2",
      icon: <FiPackage />,
      title: "Stock Receive",
      desc: "Receive stock, verify items, scan and update inventory in real-time.",
      colorVariant: "primary",
    },
    {
      category: "inventory",
      number: "3",
      icon: <FiGrid />,
      title: "Inventory Management",
      desc: "Track stock levels, batch, expiry, MRP and get low stock alerts.",
      colorVariant: "primary",
    },
    {
      category: "sales",
      number: "4",
      icon: <FiFileText />,
      title: "Sales & Billing",
      desc: "Create bills quickly with GST, apply discounts and collect payments.",
      colorVariant: "primary",
    },
    {
      category: "sales",
      number: "5",
      icon: <FiUsers />,
      title: "Customer Management",
      desc: "Maintain customer profiles, purchase history, credit and loyalty points.",
      colorVariant: "primary",
    },
    {
      category: "reports",
      number: "6",
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Get real-time reports on sales, profit, stock and business performance.",
      colorVariant: "primary",
    },
    {
      category: "reports",
      number: "7",
      icon: <FiFileText />,
      title: "Business Growth",
      desc: "Make better decisions, reduce costs and grow your pharmacy business.",
      colorVariant: "primary",
    },
  ];

  const visibleSteps = useMemo(() => {
    if (activeTab === "all") return steps;
    return steps.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <section className="w-full bg-bg">
      <AppBox sx={sectionSx}>
        <AppHeading level={1} weight={700} sx={titleSx}>
          A Complete Workflow to
          <span className="block text-primary">
            Simplify Your Pharmacy Operations
          </span>
        </AppHeading>

        <AppText variant="body2" weight={500} sx={subtitleSx}>
          From purchase to profit, manage every step in one integrated system.
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

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={workflowCardSx}
        >
          <div className="relative space-y-2">
            {visibleSteps.map((step, index) => (
              <WorkflowStep
                key={step.title}
                {...step}
                isLast={index === visibleSteps.length - 1}
              />
            ))}
          </div>
        </AppCard>

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
                  End-to-End Control
                </AppHeading>

                <AppText variant="body2" weight={500} sx={bannerTextSx}>
                  Manage your pharmacy operations seamlessly with PharmaERP.
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

const WorkflowStep = ({
  number,
  icon,
  title,
  desc,
  colorVariant = "primary",
  isLast,
}) => {
  return (
    <div className="relative grid grid-cols-[34px_1fr] gap-2">
      <div className="relative flex justify-center">
        {!isLast && (
          <span className="absolute left-1/2 top-8 h-[calc(100%+8px)] -translate-x-1/2 border-l border-dashed border-primary" />
        )}

        <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-primary-contrast shadow-sm">
          {number}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-surface px-2.5 py-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <AppBox sx={iconBoxSx(colorVariant)}>{icon}</AppBox>

          <div className="min-w-0 flex-1">
            <AppHeading level={3} weight={750} sx={stepTitleSx}>
              {title}
            </AppHeading>

            <AppText variant="body2" weight={500} sx={stepDescSx}>
              {desc}
            </AppText>
          </div>

          <FiChevronRight className="shrink-0 text-[17px] text-primary" />
        </div>
      </div>
    </div>
  );
};

const StoreIllustration = () => {
  return (
    <div className="relative h-[58px] w-[86px]">
      <div className="absolute bottom-0 left-3 h-[38px] w-[58px] rounded-lg border border-border bg-surface shadow-sm">
        <div className="grid h-3 grid-cols-4 overflow-hidden rounded-t-lg">
          <span className="bg-primary" />
          <span className="bg-surface-alt" />
          <span className="bg-primary" />
          <span className="bg-surface-alt" />
        </div>

        <div className="grid grid-cols-3 gap-1 p-1.5">
          <span className="h-5 rounded bg-primary-soft" />
          <span className="h-5 rounded bg-primary-soft" />
          <span className="h-5 rounded bg-primary-soft" />
        </div>
      </div>

      <div className="absolute right-1 top-0 flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[16px] font-black leading-none text-primary-contrast shadow-sm">
        +
      </div>

      <FiCheckCircle className="absolute bottom-2 left-0 text-[22px] text-primary" />
    </div>
  );
};

const sectionSx = {
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 2, sm: 2.5 },
  py: { xs: 4, sm: 4.5 },
};

const titleSx = {
  m: 0,
  textAlign: "center",
  fontSize: { xs: "23px", sm: "25px" },
  lineHeight: 1.22,
  letterSpacing: "-0.55px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mx: "auto",
  mt: 1.1,
  maxWidth: 310,
  textAlign: "center",
  fontSize: { xs: "12.4px", sm: "13px" },
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const workflowCardSx = {
  mt: 3,
  px: 1.2,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const iconBoxSx = (colorVariant) => ({
  width: 48,
  height: 48,
  minWidth: 48,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  bgcolor: `var(--app-color-${colorVariant}-soft)`,
  color: `var(--app-color-${colorVariant})`,
});

const stepTitleSx = {
  m: 0,
  fontSize: "13px",
  lineHeight: 1.2,
  letterSpacing: "-0.2px",
  color: "var(--app-color-text)",
};

const stepDescSx = {
  mt: 0.55,
  fontSize: "11.4px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const bannerSx = {
  mt: 2,
  px: 2,
  py: 1.6,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const bannerIconSx = {
  width: 44,
  height: 44,
  minWidth: 44,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "23px",
};

const bannerTitleSx = {
  m: 0,
  fontSize: "12.8px",
  lineHeight: 1.25,
  color: "var(--app-color-primary)",
};

const bannerTextSx = {
  mt: 0.45,
  maxWidth: 178,
  fontSize: "10.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

export default MobileWorkflowSection;
