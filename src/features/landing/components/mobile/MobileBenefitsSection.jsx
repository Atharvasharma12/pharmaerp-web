// src/features/landing/components/mobile/MobileBenefitsSection.jsx

import {
  FiBell,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiMonitor,
  FiShield,
  FiSmile,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { FaRupeeSign, FaStar } from "react-icons/fa";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobileBenefitsSection = () => {
  const benefits = [
    {
      icon: <FiClock />,
      title: "Save Time",
      desc: "Automate daily tasks & focus on customers",
      tone: "primary",
    },
    {
      icon: <FaRupeeSign />,
      title: "Save Money",
      desc: "Reduce wastage, errors and costs",
      tone: "primary",
    },
    {
      icon: <FiTrendingUp />,
      title: "Increase Profits",
      desc: "Track sales, margins & grow your profits",
      tone: "warning",
    },
    {
      icon: <FiBell />,
      title: "Reduce Stock Loss",
      desc: "Smart alerts for expiry, low stock & batch",
      tone: "info",
    },
    {
      icon: <FiUsers />,
      title: "Happy Customers",
      desc: "Better service, loyalty & customer satisfaction",
      tone: "error",
    },
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Your data is safe with cloud security",
      tone: "primary",
    },
    {
      icon: <FiMonitor />,
      title: "Access Anywhere",
      desc: "Use PharmaERP on mobile, tablet & desktop",
      tone: "info",
    },
    {
      icon: <FiFileText />,
      title: "100% GST Compliant",
      desc: "GST ready invoices, returns & e-invoicing",
      tone: "warning",
    },
  ];

  const stats = [
    { icon: <FiClock />, value: "70%", label: "Time Saved" },
    { icon: <FaRupeeSign />, value: "30%", label: "Cost Reduced" },
    { icon: <FiTrendingUp />, value: "45%", label: "Profit Increase" },
    { icon: <FiSmile />, value: "98%", label: "User Satisfaction" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_34%)]" />

      <AppBox sx={sectionSx}>
        <AppBox sx={headerSx}>
          <AppText variant="body2" weight={800} align="center" sx={eyebrowSx}>
            Benefits
          </AppText>

          <AppBox sx={lineSx} />

          <AppHeading level={2} weight={800} align="center" sx={titleSx}>
            Powerful Benefits That
            <span className="block text-primary">Help Your Pharmacy Grow</span>
          </AppHeading>

          <AppText variant="body2" weight={600} align="center" sx={subtitleSx}>
            PharmaERP helps you save time, reduce costs and increase profits
            with complete control.
          </AppText>
        </AppBox>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {benefits.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={impactCardSx}
        >
          <AppHeading level={3} weight={800} align="center" sx={impactTitleSx}>
            Real Impact for Indian Pharmacies
          </AppHeading>

          <AppBox sx={smallLineSx} />

          <div className="mt-3 grid grid-cols-4 divide-x divide-border">
            {stats.map((item) => (
              <ImpactStat key={item.label} {...item} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <AvatarStack />

            <div className="flex items-center gap-0.5 text-warning">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-[11px]" />
              ))}
            </div>

            <AppText variant="body2" weight={750} sx={trustedTextSx}>
              Trusted by <span className="text-primary">5,000+</span>
            </AppText>
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="xl"
          bordered={false}
          shadow="md"
          padding="none"
          sx={ctaCardSx}
        >
          <div className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="min-w-0">
              <AppHeading level={3} weight={800} sx={ctaTitleSx}>
                Everything you need to manage and grow your pharmacy business.
              </AppHeading>

              <AppButton
                variant="contained"
                colorVariant="primary"
                rounded="md"
                endIcon={<FiChevronRight />}
                sx={ctaButtonSx}
              >
                Start 7 Days Free Trial
              </AppButton>
            </div>

            <StoreIllustration />
          </div>
        </AppCard>
      </AppBox>
    </section>
  );
};

const BenefitCard = ({ icon, title, desc, tone = "primary" }) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={benefitCardSx}
    >
      <AppBox sx={iconBoxSx(tone)}>{icon}</AppBox>

      <div className="min-w-0 flex-1">
        <AppHeading level={3} weight={800} sx={benefitTitleSx}>
          {title}
        </AppHeading>

        <AppText variant="body2" weight={600} sx={benefitDescSx}>
          {desc}
        </AppText>
      </div>

      <FiChevronRight className="shrink-0 text-[16px] text-primary" />
    </AppCard>
  );
};

const ImpactStat = ({ icon, value, label }) => {
  return (
    <div className="flex flex-col items-center px-1 text-center">
      <AppBox sx={statIconSx}>{icon}</AppBox>

      <AppHeading level={4} weight={850} sx={statValueSx}>
        {value}
      </AppHeading>

      <AppText variant="body2" weight={650} sx={statLabelSx}>
        {label}
      </AppText>
    </div>
  );
};

const AvatarStack = () => {
  const avatars = [
    "https://i.pravatar.cc/80?img=11",
    "https://i.pravatar.cc/80?img=47",
    "https://i.pravatar.cc/80?img=12",
    "https://i.pravatar.cc/80?img=32",
  ];

  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar) => (
        <img
          key={avatar}
          src={avatar}
          alt="Pharmacy owner"
          className="h-6 w-6 rounded-full border-2 border-surface object-cover"
        />
      ))}
    </div>
  );
};

const StoreIllustration = () => {
  return (
    <div className="relative h-[82px] w-[112px] shrink-0">
      <div className="absolute bottom-0 right-1 h-[54px] w-[86px] rounded-xl border border-border bg-surface shadow-sm">
        <div className="absolute -top-4 left-2 right-2 h-5 rounded-t-xl bg-surface shadow-sm" />

        <div className="absolute -top-7 left-8 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[20px] font-black text-primary-contrast shadow-sm">
          +
        </div>

        <div className="absolute left-2 right-2 top-3 grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="h-5 rounded bg-primary-soft" />
          ))}
        </div>

        <div className="absolute bottom-2 left-3 h-6 w-7 rounded bg-primary-soft" />
        <div className="absolute bottom-2 right-3 h-6 w-7 rounded bg-primary-soft" />
      </div>

      <div className="absolute bottom-0 left-0 h-8 w-5 rounded-t-full bg-primary-soft" />
      <div className="absolute bottom-0 right-0 h-9 w-6 rounded-t-full bg-primary-soft" />
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
  pb: { xs: 2.5, sm: 3 },
};

const headerSx = {
  textAlign: "center",
  mx: "auto",
  maxWidth: 340,
};

const eyebrowSx = {
  fontSize: "14px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const lineSx = {
  width: 28,
  height: 2,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary)",
  mx: "auto",
  mt: 1.3,
  mb: 2,
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
  maxWidth: 310,
  fontSize: { xs: "12.8px", sm: "13.4px" },
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const benefitCardSx = {
  minHeight: 74,
  display: "flex",
  alignItems: "center",
  gap: 1.1,
  px: 1.15,
  py: 1.15,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-sm)",
};

const iconBoxSx = (tone) => ({
  width: 44,
  height: 44,
  minWidth: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  fontSize: "23px",
  bgcolor: `var(--app-color-${tone}-soft)`,
  color: `var(--app-color-${tone})`,
});

const benefitTitleSx = {
  m: 0,
  fontSize: { xs: "11.6px", sm: "12.4px" },
  lineHeight: 1.22,
  color: "var(--app-color-text)",
};

const benefitDescSx = {
  mt: 0.45,
  fontSize: { xs: "9.8px", sm: "10.5px" },
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const impactCardSx = {
  mt: 3,
  px: { xs: 1.5, sm: 1.8 },
  py: 2,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const impactTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-primary)",
};

const smallLineSx = {
  width: 26,
  height: 2,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary)",
  mx: "auto",
  mt: 1,
};

const statIconSx = {
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "14px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-primary)",
  fontSize: "18px",
};

const statValueSx = {
  mt: 1,
  mb: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1,
  letterSpacing: "-0.5px",
  color: "var(--app-color-primary)",
};

const statLabelSx = {
  mt: 0.55,
  fontSize: { xs: "8.8px", sm: "9.5px" },
  lineHeight: "12px",
  color: "var(--app-color-text-muted)",
};

const trustedTextSx = {
  fontSize: "10.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
};

const ctaCardSx = {
  mt: 2.4,
  overflow: "hidden",
  px: 1.8,
  py: 1.8,
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  boxShadow: "var(--app-shadow-md)",
};

const ctaTitleSx = {
  m: 0,
  maxWidth: 185,
  fontSize: { xs: "14px", sm: "15px" },
  lineHeight: "21px",
  color: "var(--app-color-primary-contrast)",
};

const ctaButtonSx = {
  mt: 2,
  height: 38,
  px: 1.7,
  minWidth: "unset",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-primary)",
  fontSize: "11.5px",
  fontWeight: 800,
  boxShadow: "var(--app-shadow-sm)",
  "&:hover": {
    bgcolor: "var(--app-color-surface-alt)",
  },
};

export default MobileBenefitsSection;
