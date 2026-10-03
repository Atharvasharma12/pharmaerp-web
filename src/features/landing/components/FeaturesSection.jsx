import React from "react";
import {
  FiShield,
  FiShoppingCart,
  FiBox,
  FiClipboard,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiPercent,
  FiLock,
  FiArrowRight,
  FiCloud,
  FiMonitor,
} from "react-icons/fi";
import { MdOutlineQrCodeScanner } from "react-icons/md";

import {
  AppBadge,
  AppBox,
  AppCard,
  AppGrid,
  AppHeading,
  AppLink,
  AppStack,
  AppText,
} from "@/components";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiShoppingCart />,
      title: "Sales & Billing",
      desc: "Fast and easy billing with GST, discounts, schemes and multiple payment options.",
      colorVariant: "success",
    },
    {
      icon: <FiBox />,
      title: "Inventory Management",
      desc: "Real-time stock tracking, low stock alerts and accurate inventory control.",
      colorVariant: "info",
    },
    {
      icon: <FiClipboard />,
      title: "Purchase Management",
      desc: "Manage suppliers, purchase orders, returns and purchase price.",
      colorVariant: "primary",
    },
    {
      icon: <FiUsers />,
      title: "Customer Management",
      desc: "Maintain customer records, loyalty points and purchase history.",
      colorVariant: "warning",
    },
    {
      icon: <FiCalendar />,
      title: "Expiry Tracking",
      desc: "Track expiry dates and batches with smart alerts.",
      colorVariant: "error",
    },
    {
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Insightful reports on sales, profit and stock performance.",
      colorVariant: "info",
    },
    {
      icon: <FiPercent />,
      title: "Offers & Schemes",
      desc: "Create offers and discount rules to boost your sales.",
      colorVariant: "warning",
    },
    {
      icon: <FiLock />,
      title: "Access Control",
      desc: "Secure role-based access for staff and multi-user management.",
      colorVariant: "info",
    },
  ];

  const bottomFeatures = [
    {
      icon: <FiShield />,
      title: "GST Compliant",
      desc: "Accurate invoicing and tax reports.",
    },
    {
      icon: <MdOutlineQrCodeScanner />,
      title: "Barcode Support",
      desc: "Fast billing with barcode support.",
    },
    {
      icon: <FiCloud />,
      title: "Cloud Backup",
      desc: "Automatic backup and secure storage.",
    },
    {
      icon: <FiMonitor />,
      title: "Access Anywhere",
      desc: "Use your pharmacy system anytime.",
    },
  ];

  return (
    <section className="w-full bg-bg py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <AppBox sx={{ mx: "auto", maxWidth: "56rem", textAlign: "center" }}>
          <AppBadge
            variant="soft"
            colorVariant="success"
            rounded="full"
            startIcon={<FiShield />}
            label="Powerful Features"
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
            Everything You Need to Run Your Pharmacy
            <span className="block text-primary">All in One Place</span>
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
            PharmaERP comes with all the essential tools to manage your pharmacy
            operations efficiently and effortlessly.
          </AppText>
        </AppBox>

        {/* FEATURE GRID */}
        <AppGrid xs={1} md={2} lg={4} gap={2.5} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </AppGrid>

        {/* BOTTOM FEATURES */}
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 3,
            px: 2.5,
            py: 2,
            bgcolor: "var(--app-color-surface)",
          }}
        >
          <AppGrid xs={1} md={2} lg={4} gap={2.5}>
            {bottomFeatures.map((item, index) => (
              <BottomFeature
                key={item.title}
                {...item}
                noBorder={index === bottomFeatures.length - 1}
              />
            ))}
          </AppGrid>
        </AppCard>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, colorVariant = "success" }) => {
  return (
    <AppCard
      variant="default"
      bordered
      rounded="lg"
      shadow="sm"
      padding="md"
      sx={{
        height: "100%",
        bgcolor: "var(--app-color-surface)",
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
          borderRadius: "12px",
          fontSize: "22px",
          lineHeight: 0,
          bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-surface-alt))`,
          color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
        }}
      >
        {icon}
      </AppBox>

      {/* Title */}
      <AppHeading
        level={3}
        weight={700}
        sx={{
          mt: 2,
          mb: 0,
          fontSize: "15px",
          color: "var(--app-color-text)",
        }}
      >
        {title}
      </AppHeading>

      {/* Description */}
      <AppText
        variant="body2"
        sx={{
          mt: 1,
          fontSize: "13px",
          lineHeight: "24px",
          color: "var(--app-color-text-muted)",
        }}
      >
        {desc}
      </AppText>

      {/* Link */}
      <AppLink
        href="/"
        underline="none"
        sx={{
          mt: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--app-color-primary)",
        }}
      >
        Learn more
        <FiArrowRight style={{ fontSize: 14 }} />
      </AppLink>
    </AppCard>
  );
};

const BottomFeature = ({ icon, title, desc, noBorder }) => {
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
          fontSize: "24px",
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

export default FeaturesSection;
