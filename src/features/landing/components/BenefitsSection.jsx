import React from "react";
import {
  FiBox,
  FiTrendingUp,
  FiPackage,
  FiFileText,
  FiUsers,
  FiMonitor,
  FiShield,
  FiHome,
  FiDollarSign,
  FiSend,
} from "react-icons/fi";

import {
  AppBadge,
  AppBox,
  AppCard,
  AppGrid,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <FiSend />,
      title: "Increase Efficiency",
      desc: "Automate daily tasks like billing, inventory and reports to save time and run your store smoothly.",
      colorVariant: "success",
    },
    {
      icon: <FiTrendingUp />,
      title: "Boost Profits",
      desc: "Track sales, margins and fast moving items to make better decisions and grow your profits.",
      colorVariant: "info",
    },
    {
      icon: <FiPackage />,
      title: "Reduce Stock Loss",
      desc: "Smart expiry alerts, batch tracking and real-time stock updates help you reduce wastage and losses.",
      colorVariant: "primary",
    },
    {
      icon: <FiFileText />,
      title: "100% GST Compliant",
      desc: "Stay fully compliant with GST billing, reports and e-invoicing. File returns accurately and on time.",
      colorVariant: "warning",
    },
    {
      icon: <FiUsers />,
      title: "Improve Customer Satisfaction",
      desc: "Maintain customer history, offers and loyalty points to build long-term relationships.",
      colorVariant: "info",
    },
    {
      icon: <FiMonitor />,
      title: "Access Anytime, Anywhere",
      desc: "Cloud based solution lets you access your pharmacy data from desktop, tablet or mobile.",
      colorVariant: "warning",
    },
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Your data is safe with automatic backup, role-based access and enterprise level security.",
      colorVariant: "error",
    },
    {
      icon: <FiHome />,
      title: "Built for Pharmacy Stores",
      desc: "Designed specifically for Indian pharmacy stores with all the features you truly need.",
      colorVariant: "success",
    },
  ];

  const bottomItems = [
    {
      icon: <FiShield />,
      title: "Save Time",
      desc: "Automate operations and focus on customers",
    },
    {
      icon: <FiDollarSign />,
      title: "Save Money",
      desc: "Reduce wastage and operational costs",
    },
    {
      icon: <FiTrendingUp />,
      title: "Make Better Decisions",
      desc: "Real-time insights and reports at your fingertips",
    },
    {
      icon: <FiUsers />,
      title: "Grow Your Business",
      desc: "Smarter management for sustainable growth",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg py-10">
      {/* Decorative Dots */}
      <DecorDots className="left-0 top-[310px]" />
      <DecorDots className="right-0 bottom-[70px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <AppBox sx={{ mx: "auto", maxWidth: "56rem", textAlign: "center" }}>
          <AppBadge
            variant="soft"
            colorVariant="success"
            rounded="full"
            startIcon={<FiBox />}
            label="Key Benefits"
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
              fontSize: {
                xs: "28px",
                sm: "34px",
                lg: "40px",
              },
              lineHeight: 1.08,
              letterSpacing: "-0.8px",
              color: "var(--app-color-text)",
            }}
          >
            Powerful Benefits That Help
            <span className="block text-primary">Your Pharmacy Grow</span>
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
            PharmaERP is designed to improve efficiency, reduce costs and
            increase profits while giving you complete control of your pharmacy.
          </AppText>
        </AppBox>

        {/* Benefits Grid */}
        <AppGrid xs={1} md={2} lg={4} gap={2.5} sx={{ mt: 4 }}>
          {benefits.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </AppGrid>

        {/* Bottom Stats */}
        <AppCard
          variant="soft"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 3,
            px: 2.5,
            py: 2,
            bgcolor:
              "var(--app-color-success-soft, var(--app-color-surface-alt))",
            borderColor: "var(--app-color-border)",
          }}
        >
          <AppGrid xs={1} md={2} lg={4} gap={2.5}>
            {bottomItems.map((item, index) => (
              <BottomBenefit
                key={item.title}
                {...item}
                noBorder={index === bottomItems.length - 1}
              />
            ))}
          </AppGrid>
        </AppCard>
      </div>
    </section>
  );
};

const BenefitCard = ({ icon, title, desc, colorVariant = "success" }) => {
  return (
    <AppCard
      variant="default"
      bordered
      rounded="lg"
      shadow="sm"
      padding="none"
      contentSx={{
        height: "100%",
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2.5,
      }}
      sx={{
        height: "100%",
        bgcolor: "var(--app-color-surface)",
      }}
    >
      <AppBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          height: "100%",
          textAlign: "center",
        }}
      >
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 56,
            height: 56,
            borderRadius: "999px",
            fontSize: "28px",
            lineHeight: 0,
            flexShrink: 0,
            bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-surface-alt))`,
            color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
          }}
        >
          {icon}
        </AppBox>

        <AppHeading
          level={3}
          weight={700}
          sx={{
            mt: 2,
            mb: 0,
            fontSize: "15px",
            lineHeight: 1.35,
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppHeading>

        <AppText
          variant="body2"
          sx={{
            mt: 1,
            maxWidth: 240,
            fontSize: "13px",
            lineHeight: "24px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>

        <AppBox
          sx={{
            mt: 2.5,
            width: 48,
            height: 2,
            borderRadius: "999px",
            bgcolor: "var(--app-color-success)",
          }}
        />
      </AppBox>
    </AppCard>
  );
};

const BottomBenefit = ({ icon, title, desc, noBorder }) => {
  return (
    <AppStack
      direction="row"
      align="center"
      gap={1.5}
      sx={{
        pr: { lg: noBorder ? 0 : 2.5 },
        borderRight: {
          xs: "none",
          lg: noBorder ? "none" : "1px solid var(--app-color-border)",
        },
      }}
    >
      {/* Icon */}
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 44,
          height: 44,
          minWidth: 44,
          flexShrink: 0,
          borderRadius: "999px",
          bgcolor:
            "var(--app-color-success-soft, var(--app-color-surface-alt))",
          color: "var(--app-color-success, var(--app-color-primary))",
          fontSize: "23px",
          lineHeight: 0,
        }}
      >
        {icon}
      </AppBox>

      {/* Content */}
      <AppBox>
        <AppHeading
          level={4}
          weight={700}
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
            fontSize: "12px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>
      </AppBox>
    </AppStack>
  );
};

const DecorDots = ({ className = "" }) => {
  return (
    <div
      className={`pointer-events-none absolute hidden h-[120px] w-[90px] opacity-35 lg:block ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--app-color-success) 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
      }}
    />
  );
};

export default BenefitsSection;
