// src/features/landing/components/desktop/DesktopWorkflowSection.jsx

import {
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiGrid,
  FiMonitor,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import { AppBadge, AppBox, AppCard, AppHeading, AppText } from "@/components";

const DesktopWorkflowSection = () => {
  const steps = [
    {
      number: "1",
      icon: <FiShoppingCart />,
      title: "Purchase",
      desc: "Create purchase orders, manage suppliers and get the best prices.",
      colorVariant: "primary",
    },
    {
      number: "2",
      icon: <FiPackage />,
      title: "Stock In",
      desc: "Receive stock, scan items and update inventory in real-time.",
      colorVariant: "primary",
    },
    {
      number: "3",
      icon: <FiGrid />,
      title: "Inventory Management",
      desc: "Track stock, batches, expiry dates and get low stock alerts.",
      colorVariant: "primary",
    },
    {
      number: "4",
      icon: <FiFileText />,
      title: "Sales & Billing",
      desc: "Fast billing with GST, discounts, schemes and multiple payments.",
      colorVariant: "primary",
    },
    {
      number: "5",
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Get real-time reports on sales, profit, stock and business performance.",
      colorVariant: "primary",
    },
    {
      number: "6",
      icon: <FiUsers />,
      title: "Customers & Growth",
      desc: "Improve customer loyalty, manage credit and grow your pharmacy business.",
      colorVariant: "primary",
    },
  ];

  return (
    <section id="workflow" className="w-full bg-bg py-10 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <AppBadge
            variant="soft"
            colorVariant="primary"
            rounded="full"
            startIcon={<FiMonitor />}
            label="Smart Workflow"
            sx={{
              mb: 1.5,
              px: 1.5,
              py: 0.5,
              fontSize: "12px",
              fontWeight: 700,
            }}
          />

          <AppHeading
            level={2}
            weight={800}
            sx={{
              m: 0,
              fontSize: { xs: "28px", sm: "34px", lg: "40px" },
              lineHeight: 1.08,
              letterSpacing: "-0.8px",
              color: "var(--app-color-text)",
            }}
          >
            A Complete System That Simplifies
            <span className="block text-primary">Your Pharmacy Operations</span>
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mx: "auto",
              mt: 1.5,
              maxWidth: "48rem",
              fontSize: "14px",
              lineHeight: "24px",
              color: "var(--app-color-text-muted)",
            }}
          >
            From purchase to profit, PharmaERP streamlines every step of your
            pharmacy workflow so you can save time and focus on your customers.
          </AppText>
        </div>

        <div className="mt-14 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <WorkflowCard
              key={step.title}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 3.5,
            px: 2.5,
            py: 2,
            borderColor: "var(--app-color-primary-soft)",
            bgcolor: "var(--app-color-readonly-bg)",
          }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="flex gap-4">
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 56,
                  height: 56,
                  minWidth: 56,
                  flexShrink: 0,
                  borderRadius: "999px",
                  bgcolor: "var(--app-color-primary-soft)",
                  color: "var(--app-color-primary)",
                  fontSize: "26px",
                  lineHeight: 0,
                }}
              >
                <FiMonitor />
              </AppBox>

              <div>
                <AppHeading
                  level={3}
                  weight={800}
                  sx={{
                    m: 0,
                    fontSize: "18px",
                    color: "var(--app-color-primary)",
                  }}
                >
                  One System. Complete Control.
                </AppHeading>

                <AppText
                  variant="body2"
                  sx={{
                    mt: 1,
                    maxWidth: 340,
                    fontSize: "14px",
                    lineHeight: "24px",
                    color: "var(--app-color-text)",
                  }}
                >
                  PharmaERP connects every operation of your pharmacy in one
                  place.
                </AppText>

                <div className="mt-5 space-y-3">
                  {[
                    "Real-time data & updates",
                    "Accurate stock & expiry tracking",
                    "Better decisions, higher profits",
                    "Happy customers, growing business",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <FiCheckCircle className="shrink-0 text-[17px] text-primary" />

                      <AppText
                        variant="body2"
                        sx={{
                          fontSize: "13.5px",
                          lineHeight: 1,
                          color: "var(--app-color-text)",
                        }}
                      >
                        {item}
                      </AppText>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/src/assets/dashboard-showcase/overview-dashboard.png"
                alt="Dashboard Overview"
                className="w-full max-w-[700px] rounded-xl object-contain"
                style={{
                  boxShadow: "var(--app-shadow-md)",
                }}
              />
            </div>
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const WorkflowCard = ({
  number,
  icon,
  title,
  desc,
  colorVariant = "primary",
  isLast,
}) => {
  const color = `var(--app-color-${colorVariant})`;
  const softColor = `var(--app-color-${colorVariant}-soft)`;

  return (
    <div className="relative pt-[35px]">
      {!isLast && (
        <div className="absolute left-[calc(100%-3px)] top-[79px] z-20 hidden w-7 items-center xl:flex">
          <div className="h-[2px] flex-1 border-t-2 border-dotted border-primary" />
          <div className="h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-[var(--app-color-primary)]" />
        </div>
      )}

      <AppCard
        variant="default"
        bordered
        rounded="lg"
        shadow="sm"
        padding="none"
        sx={{
          position: "relative",
          minHeight: 188,
          px: 2,
          pb: 2.5,
          pt: 5.5,
          textAlign: "center",
          bgcolor: "var(--app-color-surface)",
          overflow: "visible",
        }}
      >
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: 70,
            height: 70,
            transform: "translate(-50%, -50%)",
            borderRadius: "999px",
            bgcolor: softColor,
            color,
            fontSize: "34px",
            lineHeight: 0,
            zIndex: 5,
          }}
        >
          {icon}
        </AppBox>

        <div className="flex min-h-[34px] items-center justify-center gap-2">
          <AppBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 24,
              height: 24,
              minWidth: 24,
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor: color,
              color: "var(--app-color-primary-contrast)",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {number}
          </AppBox>

          <AppHeading
            level={3}
            weight={800}
            sx={{
              m: 0,
              maxWidth: 125,
              textAlign: "left",
              fontSize: "14.5px",
              lineHeight: 1.25,
              color,
            }}
          >
            {title}
          </AppHeading>
        </div>

        <AppText
          variant="body2"
          sx={{
            mx: "auto",
            mt: 2,
            maxWidth: 145,
            fontSize: "12.5px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>
      </AppCard>
    </div>
  );
};

export default DesktopWorkflowSection;
