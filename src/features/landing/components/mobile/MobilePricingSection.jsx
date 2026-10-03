// src/features/landing/components/mobile/MobilePricingSection.jsx

import { useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiHome,
  FiShield,
  FiTag,
} from "react-icons/fi";
import { BsDiamond } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobilePricingSection = () => {
  const [yearly, setYearly] = useState(true);

  const plans = [
    {
      name: "Basic",
      subtitle: "Perfect for single store pharmacies",
      price: "₹999",
      billed: "Billed annually at ₹11,988",
      icon: <FiHome />,
      tone: "primary",
      ctaVariant: "outlined",
      featuresTitle: "Everything in Basic:",
      features: [
        "POS Billing (GST)",
        "Inventory Management",
        "Purchase Management",
        "Expiry & Batch Tracking",
        "Reports & Analytics",
        "1 Store / 1 User",
      ],
    },
    {
      name: "Professional",
      subtitle: "Best for growing pharmacies",
      price: "₹1,999",
      billed: "Billed annually at ₹23,988",
      icon: <BsDiamond />,
      tone: "primary",
      ctaVariant: "contained",
      popular: true,
      featuresTitle: "Everything in Basic, plus:",
      features: [
        "Customer Management (CRM)",
        "Multi-Store Management",
        "Advanced Reports & Analytics",
        "Barcode Scanning",
        "WhatsApp Integration",
        "Low Stock Alerts (SMS/Email)",
        "Data Export (Excel/PDF)",
        "GST Reports & E-Invoicing",
      ],
    },
    {
      name: "Enterprise",
      subtitle: "For large & multi-store pharmacies",
      price: "₹3,999",
      billed: "Billed annually at ₹47,988",
      icon: <HiOutlineOfficeBuilding />,
      tone: "primary",
      ctaVariant: "outlined",
      featuresTitle: "Everything in Professional, plus:",
      features: [
        "Unlimited Users",
        "Role-Based Access Control",
        "Dedicated Account Manager",
        "Cloud Backup (100 GB)",
        "24/7 Priority Support",
        "Custom Training & Onboarding",
      ],
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_35%)]" />

      <AppBox sx={sectionSx}>
        <AppBox sx={headerSx}>
          <AppHeading level={2} weight={800} align="center" sx={titleSx}>
            Simple Pricing for
            <span className="block text-primary">Every Pharmacy Business</span>
          </AppHeading>

          <AppText variant="body2" weight={600} align="center" sx={subtitleSx}>
            Choose the perfect plan for your pharmacy. No hidden charges. Cancel
            anytime.
          </AppText>

          <div className="mt-4 flex items-center justify-center gap-2">
            <AppBox sx={toggleWrapSx}>
              <AppText variant="body2" weight={750} sx={toggleTextSx(!yearly)}>
                Monthly
              </AppText>

              <button
                type="button"
                onClick={() => setYearly((prev) => !prev)}
                className="relative h-7 w-12 rounded-full bg-primary transition"
                aria-label="Toggle billing"
              >
                <span
                  className={[
                    "absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition",
                    yearly ? "left-6" : "left-1",
                  ].join(" ")}
                />
              </button>

              <AppText variant="body2" weight={800} sx={toggleTextSx(yearly)}>
                Yearly
              </AppText>
            </AppBox>

            <span className="rounded-xl bg-primary-soft px-2 py-1 text-[10px] font-extrabold text-primary">
              Save up to 20%
            </span>
          </div>
        </AppBox>

        <div className="mt-5 space-y-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered={false}
          shadow="sm"
          padding="none"
          sx={trustCardSx}
        >
          <div className="grid grid-cols-3 divide-x divide-border">
            <TrustPoint icon={<FiTag />} text="All plans are GST compliant" />
            <TrustPoint text="No setup fees" />
            <TrustPoint text="Cancel anytime" />
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="xl"
          bordered={false}
          shadow="sm"
          padding="none"
          sx={secureCardSx}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <AppBox sx={secureIconSx}>
                <FiShield />
              </AppBox>

              <div className="min-w-0">
                <AppHeading level={3} weight={800} sx={secureTitleSx}>
                  Secure. Reliable. Built for Indian Pharmacies.
                </AppHeading>

                <AppText variant="body2" weight={600} sx={secureTextSx}>
                  Your data is safe with us.
                </AppText>
              </div>
            </div>

            <StoreIllustration />
          </div>
        </AppCard>
      </AppBox>
    </section>
  );
};

const PlanCard = ({
  name,
  subtitle,
  price,
  billed,
  icon,
  tone = "primary",
  ctaVariant,
  popular,
  featuresTitle,
  features,
}) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={planCardSx(tone, popular)}
    >
      {popular && (
        <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[1px] items-center gap-1 rounded-b-lg bg-primary px-4 py-1.5 text-[10px] font-extrabold text-primary-contrast">
          <FaStar className="text-[10px]" />
          MOST POPULAR
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-2.5">
        <AppBox sx={planIconSx(tone)}>{icon}</AppBox>

        <div className="min-w-0">
          <AppHeading level={3} weight={800} sx={planNameSx}>
            {name}
          </AppHeading>

          <AppText variant="body2" weight={600} sx={planSubtitleSx}>
            {subtitle}
          </AppText>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-end gap-1">
            <AppHeading level={3} weight={850} sx={priceSx(tone)}>
              {price}
            </AppHeading>

            <AppText variant="body2" weight={750} sx={monthSx}>
              / month
            </AppText>
          </div>

          <span
            className="mt-1 inline-flex rounded-lg px-2 py-0.5 text-[10px] font-extrabold"
            style={{
              background: `var(--app-color-${tone}-soft)`,
              color: `var(--app-color-${tone})`,
            }}
          >
            {billed}
          </span>
        </div>

        <div className="shrink-0 text-center">
          <AppButton
            variant={ctaVariant}
            colorVariant={tone}
            rounded="md"
            sx={trialButtonSx(ctaVariant)}
          >
            Start Free Trial
          </AppButton>

          <AppText variant="body2" weight={700} sx={trialTextSx}>
            7 Days Free Trial
          </AppText>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <AppText variant="body2" weight={850} sx={featureTitleSx(tone)}>
          {featuresTitle}
        </AppText>

        <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {features.map((feature) => (
            <FeatureItem key={feature} text={feature} />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-1 border-t border-border pt-2.5 text-[11px] font-extrabold text-text-muted"
      >
        View all features
        <FiChevronDown className="text-[14px]" />
      </button>
    </AppCard>
  );
};

const FeatureItem = ({ text }) => {
  return (
    <div className="flex items-start gap-1.5">
      <FiCheckCircle className="mt-[2px] shrink-0 text-[12px] text-primary" />

      <AppText variant="body2" weight={700} sx={featureTextSx}>
        {text}
      </AppText>
    </div>
  );
};

const TrustPoint = ({ icon, text }) => {
  return (
    <div className="flex min-h-[42px] items-center justify-center gap-1 px-1 text-center">
      {icon && <span className="text-[15px] text-primary">{icon}</span>}

      <span className="text-[10px] font-extrabold leading-tight text-primary">
        {text}
      </span>
    </div>
  );
};

const StoreIllustration = () => {
  return (
    <div className="relative h-[58px] w-[84px] shrink-0">
      <div className="absolute bottom-0 right-1 h-[38px] w-[62px] rounded-lg border border-border bg-surface shadow-sm">
        <div className="absolute -top-3 left-1.5 right-1.5 h-4 rounded-t-lg bg-surface shadow-sm" />

        <div className="absolute -top-6 left-6 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[17px] font-black text-primary-contrast shadow-sm">
          +
        </div>

        <div className="absolute left-2 right-2 top-2 grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="h-4 rounded bg-primary-soft" />
          ))}
        </div>

        <div className="absolute bottom-1.5 left-2 h-5 w-6 rounded bg-primary-soft" />
        <div className="absolute bottom-1.5 right-2 h-5 w-6 rounded bg-primary-soft" />
      </div>

      <div className="absolute bottom-0 left-1 h-7 w-4 rounded-t-full bg-primary-soft" />
      <div className="absolute bottom-0 right-0 h-8 w-5 rounded-t-full bg-primary-soft" />
    </div>
  );
};

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 2, sm: 2.5 },
  pt: { xs: 3, sm: 3.4 },
  pb: { xs: 2.6, sm: 3 },
};

const headerSx = {
  textAlign: "center",
};

const titleSx = {
  m: 0,
  fontSize: { xs: "27px", sm: "29px" },
  lineHeight: 1.16,
  letterSpacing: "-0.75px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mx: "auto",
  mt: 1.4,
  maxWidth: 315,
  fontSize: { xs: "12.8px", sm: "13.4px" },
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const toggleWrapSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.2,
  py: 0.55,
  borderRadius: "999px",
  bgcolor: "var(--app-color-disabled-bg)",
};

const toggleTextSx = (active) => ({
  fontSize: "11.5px",
  lineHeight: 1,
  color: active ? "var(--app-color-primary)" : "var(--app-color-text-muted)",
});

const planCardSx = (tone, popular) => ({
  position: "relative",
  px: 1.8,
  py: 1.8,
  pt: popular ? 4.4 : 1.8,
  bgcolor: "var(--app-color-surface)",
  borderColor: popular ? `var(--app-color-${tone})` : "var(--app-color-border)",
  boxShadow: "var(--app-shadow-sm)",
});

const planIconSx = (tone) => ({
  width: 54,
  height: 54,
  minWidth: 54,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "14px",
  bgcolor: `var(--app-color-${tone}-soft)`,
  color: `var(--app-color-${tone})`,
  fontSize: "28px",
});

const planNameSx = {
  m: 0,
  fontSize: { xs: "17px", sm: "18px" },
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.8,
  fontSize: { xs: "11.5px", sm: "12.2px" },
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const priceSx = (tone) => ({
  m: 0,
  fontSize: { xs: "31px", sm: "34px" },
  lineHeight: 1,
  letterSpacing: "-1px",
  color: `var(--app-color-${tone})`,
});

const monthSx = {
  mb: 0.3,
  fontSize: "11px",
  color: "var(--app-color-text)",
};

const trialButtonSx = (variant) => ({
  minWidth: 132,
  height: 36,
  px: 1.5,
  fontSize: "11.5px",
  fontWeight: 800,
  boxShadow: variant === "contained" ? "var(--app-shadow-sm)" : "none",
});

const trialTextSx = {
  mt: 0.8,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const featureTitleSx = (tone) => ({
  fontSize: "11.8px",
  color: `var(--app-color-${tone})`,
});

const featureTextSx = {
  fontSize: { xs: "10.3px", sm: "10.8px" },
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const trustCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-readonly-bg)",
};

const secureCardSx = {
  mt: 2,
  px: 1.6,
  py: 1.5,
  bgcolor: "var(--app-color-readonly-bg)",
};

const secureIconSx = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "23px",
};

const secureTitleSx = {
  m: 0,
  fontSize: "12.8px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const secureTextSx = {
  mt: 0.4,
  fontSize: "10.8px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

export default MobilePricingSection;
