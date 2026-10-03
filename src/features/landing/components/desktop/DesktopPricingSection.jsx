import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiCloud,
  FiHeadphones,
  FiHome,
  FiRefreshCw,
  FiShield,
  FiTag,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsDiamond } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

import { ROUTES } from "@/constants";
import {
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppGrid,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const DesktopPricingSection = () => {
  const [yearly, setYearly] = useState(true);

  const plans = [
    {
      name: "Basic",
      subtitle: "Perfect for small pharmacies",
      price: "₹999",
      yearlyText: "Billed annually at ₹11,988 (Save ₹2,388)",
      icon: <FiHome />,
      colorVariant: "primary",
      popular: false,
      features: [
        "Sales & Billing (GST Ready)",
        "Inventory Management",
        "Purchase Management",
        "Expiry & Batch Tracking",
        "Reports & Analytics",
        "1 Store / 1 User",
        "Cloud Backup (5 GB)",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      subtitle: "Best for growing pharmacies",
      price: "₹1,999",
      yearlyText: "Billed annually at ₹23,988 (Save ₹4,000)",
      icon: <BsDiamond />,
      colorVariant: "primary",
      popular: true,
      features: [
        "Customer Management (CRM)",
        "Advanced Reports & Analytics",
        "Barcode Scanning Support",
        "Offers & Schemes Management",
        "Low Stock & Expiry Alerts",
        "Multi-User Access (Up to 3 Users)",
        "Multi-Store Management",
        "Cloud Backup (20 GB)",
        "WhatsApp Integration",
        "Priority Support",
        "Data Export (Excel/PDF)",
        "GSTR-1 & E-Invoicing",
      ],
    },
    {
      name: "Enterprise",
      subtitle: "For large & multi-store pharmacies",
      price: "₹3,999",
      yearlyText: "Billed annually at ₹47,988 (Save ₹8,000)",
      icon: <HiOutlineOfficeBuilding />,
      colorVariant: "primary",
      popular: false,
      features: [
        "Unlimited Users",
        "Advanced Analytics Dashboard",
        "Role-Based Access Control",
        "Dedicated Account Manager",
        "API Access",
        "Custom Training & Onboarding",
        "Cloud Backup (100 GB)",
        "Data Backup & Restore",
        "24/7 Premium Support",
        "SLA & Uptime Guarantee",
        "Priority Feature Requests",
      ],
    },
  ];

  const bottomFeatures = [
    {
      icon: <FiCloud />,
      title: "100% Cloud Based",
      desc: "Access your pharmacy data anytime, anywhere.",
    },
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Advanced security and daily backups.",
    },
    {
      icon: <FiRefreshCw />,
      title: "Easy to Use",
      desc: "Simple interface for pharmacy professionals.",
    },
    {
      icon: <FiHeadphones />,
      title: "Dedicated Support",
      desc: "Our expert team is ready to help you.",
    },
  ];

  return (
    <section id="pricing" className="w-full bg-bg py-9 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <AppBox sx={{ mx: "auto", maxWidth: "64rem", textAlign: "center" }}>
          <AppBadge
            variant="soft"
            colorVariant="primary"
            rounded="full"
            startIcon={<FiTag />}
            label="Simple Pricing, Powerful Software"
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
                lg: "38px",
              },
              lineHeight: 1.08,
              letterSpacing: "-0.8px",
              color: "var(--app-color-text)",
            }}
          >
            Choose the Perfect Plan for
            <span className="block text-primary">Your Pharmacy Business</span>
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mx: "auto",
              mt: 1.5,
              maxWidth: "56rem",
              fontSize: "13.5px",
              lineHeight: "24px",
              color: "var(--app-color-text-muted)",
            }}
          >
            Flexible plans for every pharmacy size and need. All plans include
            core features to run your pharmacy smoothly. Upgrade, downgrade or
            cancel anytime as your business grows.
          </AppText>

          <AppBox
            sx={{
              mt: 2.5,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AppStack
              direction="row"
              align="center"
              justify="center"
              wrap="wrap"
              gap={1.5}
              sx={{
                width: "fit-content",
                mx: "auto",
                textAlign: "center",
              }}
            >
              <AppText
                variant="body2"
                weight={700}
                sx={{ fontSize: "13px", color: "var(--app-color-text)" }}
              >
                Monthly Billing
              </AppText>

              <AppBox
                component="button"
                onClick={() => setYearly(!yearly)}
                sx={{
                  position: "relative",
                  width: 44,
                  height: 24,
                  border: 0,
                  cursor: "pointer",
                  borderRadius: "999px",
                  bgcolor: yearly
                    ? "var(--app-color-primary)"
                    : "var(--app-color-border-strong)",
                  transition: "0.2s ease",
                }}
              >
                <AppBox
                  sx={{
                    position: "absolute",
                    top: 4,
                    left: yearly ? 23 : 4,
                    width: 16,
                    height: 16,
                    borderRadius: "999px",
                    bgcolor: "var(--app-color-text-inverse)",
                    transition: "0.2s ease",
                  }}
                />
              </AppBox>

              <AppText
                variant="body2"
                weight={700}
                sx={{ fontSize: "13px", color: "var(--app-color-primary)" }}
              >
                Yearly Billing
              </AppText>

              <AppBadge
                variant="soft"
                colorVariant="primary"
                rounded="full"
                label="Save up to 20%"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              />
            </AppStack>
          </AppBox>
        </AppBox>

        <AppGrid xs={1} lg={3} gap={2.5} sx={{ mt: 3.5 }}>
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </AppGrid>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 2.5,
            px: 2.5,
            py: 2,
            bgcolor: "var(--app-color-surface)",
            borderColor: "var(--app-color-border)",
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

        <AppBox
          sx={{
            mt: 2.5,
            px: 2.5,
            py: 1.5,
            width: "100%",
            borderRadius: "16px",
            bgcolor: "var(--app-color-primary-soft)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AppStack
            direction="row"
            align="center"
            justify="center"
            wrap="wrap"
            gap={3}
            sx={{
              width: "fit-content",
              mx: "auto",
              textAlign: "center",
            }}
          >
            {[
              "All plans are GST compliant",
              "No hidden charges",
              "Cancel anytime",
              "Upgrade or downgrade anytime",
            ].map((item) => (
              <AppStack
                key={item}
                direction="row"
                align="center"
                justify="center"
                gap={1}
              >
                <FiShield
                  style={{
                    fontSize: 15,
                    flexShrink: 0,
                    color: "var(--app-color-primary)",
                  }}
                />

                <AppText
                  variant="body2"
                  weight={700}
                  sx={{ fontSize: "13px", color: "var(--app-color-primary)" }}
                >
                  {item}
                </AppText>
              </AppStack>
            ))}
          </AppStack>
        </AppBox>
      </div>
    </section>
  );
};

const PricingCard = ({
  name,
  subtitle,
  price,
  yearlyText,
  icon,
  colorVariant = "primary",
  popular,
  features,
}) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={{
        position: "relative",
        height: "100%",
        px: 2.5,
        py: 2.5,
        bgcolor: "var(--app-color-surface)",
        borderWidth: popular ? 2 : 1,
        borderColor: popular
          ? `var(--app-color-${colorVariant})`
          : "var(--app-color-border)",
        overflow: "visible",
      }}
    >
      {popular && (
        <AppBox
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <AppBadge
            variant="contained"
            colorVariant={colorVariant}
            rounded="full"
            startIcon={<FaStar />}
            label="MOST POPULAR"
            sx={{
              px: 2,
              py: 0.5,
              fontSize: "11px",
              fontWeight: 800,
              color: "var(--app-color-primary-contrast)",
              whiteSpace: "nowrap",
              boxShadow: "var(--app-shadow-sm)",
            }}
          />
        </AppBox>
      )}

      <AppStack direction="row" align="flex-start" gap={2}>
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: "16px",
            fontSize: "28px",
            lineHeight: 0,
            bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-surface-alt))`,
            color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
          }}
        >
          {icon}
        </AppBox>

        <AppBox>
          <AppHeading
            level={3}
            weight={800}
            sx={{
              m: 0,
              fontSize: "18px",
              color: "var(--app-color-text)",
            }}
          >
            {name}
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: "13px",
              color: "var(--app-color-text-muted)",
            }}
          >
            {subtitle}
          </AppText>
        </AppBox>
      </AppStack>

      <AppBox sx={{ mt: 2 }}>
        <AppStack direction="row" align="flex-end" gap={1}>
          <AppHeading
            level={2}
            weight={800}
            sx={{
              m: 0,
              fontSize: "38px",
              lineHeight: 1,
              color: `var(--app-color-${colorVariant})`,
            }}
          >
            {price}
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mb: 0.5,
              fontSize: "13px",
              color: "var(--app-color-text)",
            }}
          >
            / month
          </AppText>
        </AppStack>

        <AppBadge
          variant="soft"
          colorVariant={colorVariant}
          rounded="full"
          label={yearlyText}
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 0.5,
            fontSize: "11px",
            fontWeight: 800,
          }}
        />
      </AppBox>

      <AppBox
        sx={{
          my: 2,
          borderTop: "1px solid var(--app-color-border)",
        }}
      />

      <AppHeading
        level={4}
        weight={700}
        sx={{
          m: 0,
          fontSize: "14px",
          color: `var(--app-color-${colorVariant})`,
        }}
      >
        {name === "Basic"
          ? "Everything in Basic:"
          : name === "Professional"
            ? "Everything in Basic, plus:"
            : "Everything in Professional, plus:"}
      </AppHeading>

      <AppGrid
        xs={1}
        md={name === "Professional" || name === "Enterprise" ? 2 : 1}
        columnGap={2}
        rowGap={1.25}
        sx={{ mt: 1.5 }}
      >
        {features.map((feature) => (
          <AppStack key={feature} direction="row" align="flex-start" gap={1}>
            <FiCheckCircle
              style={{
                marginTop: 3,
                flexShrink: 0,
                fontSize: 15,
                color: `var(--app-color-${colorVariant})`,
              }}
            />

            <AppText
              variant="body2"
              sx={{
                fontSize: "12.5px",
                lineHeight: "20px",
                color: "var(--app-color-text)",
              }}
            >
              {feature}
            </AppText>
          </AppStack>
        ))}
      </AppGrid>

      <AppBox sx={{ mt: 2.5 }}>
        <AppButton
          component={Link}
          to={ROUTES.REGISTER}
          fullWidth
          variant={popular ? "contained" : "outlined"}
          colorVariant={colorVariant}
          rounded="md"
          sx={{
            py: 1.25,
            fontSize: "14px",
            fontWeight: 800,
          }}
        >
          Start 7 Days Free Trial
        </AppButton>

        <AppText
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 1,
            fontSize: "11.5px",
            color: "var(--app-color-text-muted)",
          }}
        >
          No Credit Card Required
        </AppText>
      </AppBox>
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
          bgcolor: "var(--app-color-primary-soft)",
          color: "var(--app-color-primary)",
          fontSize: "22px",
          lineHeight: 0,
        }}
      >
        {icon}
      </AppBox>

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

export default DesktopPricingSection;
