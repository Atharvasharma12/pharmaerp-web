// src/features/landing/components/mobile/MobileCTASection.jsx

import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobileCTASection = () => {
  const points = [
    "No Credit Card Required",
    "GST Compliant",
    "Setup in Minutes",
  ];

  const stats = [
    { icon: <FiUsers />, value: "5,000+", label: "Pharmacies" },
    { icon: <FiClock />, value: "7 Days", label: "Free Trial" },
    { icon: <FiShield />, value: "100%", label: "Secure" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_9%,transparent),transparent_36%)]" />

      <AppBox sx={sectionSx}>
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="md"
          padding="none"
          sx={cardSx}
        >
          <AppBox sx={badgeSx}>
            <FiUsers className="text-[13px]" />
            <span>Trusted by 5,000+ Pharmacies</span>
          </AppBox>

          <AppHeading level={2} weight={800} align="center" sx={titleSx}>
            Ready to Simplify Your
            <span className="block text-primary">Pharmacy Operations?</span>
          </AppHeading>

          <AppText variant="body2" weight={600} align="center" sx={subtitleSx}>
            Manage billing, inventory, expiry tracking and reports in one simple
            pharmacy management system.
          </AppText>

          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-alt">
            {stats.map((item) => (
              <StatItem key={item.label} {...item} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {points.map((point) => (
              <MiniPoint key={point} text={point} />
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            <AppButton
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              endIcon={<FiArrowRight />}
              sx={primaryButtonSx}
            >
              Start Free Trial
            </AppButton>

            <AppButton
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              fullWidth
              startIcon={<FiCalendar />}
              sx={secondaryButtonSx}
            >
              Book a Demo
            </AppButton>
          </div>

          <AppBox sx={secureBoxSx}>
            <FiZap className="text-primary" />

            <AppText variant="body2" weight={700} sx={secureTextSx}>
              Start your 7 days free trial today.
            </AppText>
          </AppBox>
        </AppCard>
      </AppBox>
    </section>
  );
};

const StatItem = ({ icon, value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center px-1.5 py-3 text-center">
      <AppBox sx={statIconSx}>{icon}</AppBox>

      <AppText variant="body2" weight={800} sx={statValueSx}>
        {value}
      </AppText>

      <AppText variant="body2" weight={650} sx={statLabelSx}>
        {label}
      </AppText>
    </div>
  );
};

const MiniPoint = ({ text }) => {
  return (
    <AppBox sx={miniPointSx}>
      <FiCheckCircle className="shrink-0 text-[12px] text-primary" />

      <AppText variant="body2" weight={750} sx={miniPointTextSx}>
        {text}
      </AppText>
    </AppBox>
  );
};

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 2, sm: 2.5 },
  py: { xs: 4, sm: 4.5 },
};

const cardSx = {
  px: { xs: 2.2, sm: 2.7 },
  py: { xs: 3, sm: 3.5 },
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const badgeSx = {
  mx: "auto",
  mb: 1.6,
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  gap: 0.7,
  px: 1.3,
  py: 0.65,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "10.6px",
  fontWeight: 800,
};

const titleSx = {
  m: 0,
  fontSize: { xs: "24px", sm: "26px" },
  lineHeight: 1.18,
  letterSpacing: "-0.6px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mx: "auto",
  mt: 1.25,
  maxWidth: 315,
  fontSize: { xs: "12.3px", sm: "13px" },
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const statIconSx = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "14px",
};

const statValueSx = {
  mt: 0.8,
  fontSize: "12.2px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const statLabelSx = {
  mt: 0.55,
  fontSize: "9.5px",
  lineHeight: 1,
  color: "var(--app-color-text-muted)",
};

const miniPointSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.55,
  px: 1,
  py: 0.65,
  borderRadius: "999px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const miniPointTextSx = {
  fontSize: "10.2px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const primaryButtonSx = {
  height: 42,
  fontSize: "13px",
  fontWeight: 800,
  textTransform: "none",
  boxShadow: "var(--app-shadow-sm)",
};

const secondaryButtonSx = {
  height: 42,
  fontSize: "13px",
  fontWeight: 800,
  textTransform: "none",
  bgcolor: "var(--app-color-surface)",
};

const secureBoxSx = {
  mt: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.8,
};

const secureTextSx = {
  fontSize: "11.2px",
  color: "var(--app-color-text-muted)",
};

export default MobileCTASection;
