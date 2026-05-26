// src/features/landing/components/mobile/MobileTestimonialsSection.jsx

import {
  FiArrowRight,
  FiHeadphones,
  FiMapPin,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import { AppBox, AppButton, AppCard, AppHeading, AppText } from "@/components";

const MobileTestimonialsSection = () => {
  const stats = [
    {
      icon: <FiUsers />,
      value: "5,000+",
      label: "Happy Customers",
    },
    {
      icon: <FaStar />,
      value: "4.8/5",
      label: "Average Rating",
    },
    {
      icon: <FiShield />,
      value: "99.9%",
      label: "Uptime",
    },
    {
      icon: <FiHeadphones />,
      value: "24/7",
      label: "Support",
    },
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      store: "Sharma Medical Store",
      city: "Jaipur, Rajasthan",
      image: "https://i.pravatar.cc/100?img=11",
      text: "PharmaERP has completely transformed the way we manage our pharmacy. Billing is faster, stock tracking is accurate and reports help us make better decisions.",
    },
    {
      name: "Neha Patel",
      store: "Patel Pharmacy",
      city: "Surat, Gujarat",
      image: "https://i.pravatar.cc/100?img=47",
      text: "The expiry alerts and stock management features are excellent. It has reduced our losses and improved our profits significantly.",
    },
    {
      name: "Ramesh Verma",
      store: "Verma Medicals",
      city: "Lucknow, Uttar Pradesh",
      image: "https://i.pravatar.cc/100?img=12",
      text: "Very easy to use and the support team is always there to help. Best pharmacy management software for Indian businesses.",
    },
  ];

  const logos = ["Apollo", "MedPlus", "netmeds", "Wellness", "Lifecare"];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={sectionSx}>
        <AppBox sx={headerSx}>
          <AppText variant="body2" weight={700} align="center" sx={eyebrowSx}>
            Testimonials
          </AppText>

          <AppHeading level={2} weight={750} align="center" sx={titleSx}>
            Trusted by Thousands of
            <span className="block text-primary">
              Pharmacy Owners Across India
            </span>
          </AppHeading>

          <AppText variant="body2" weight={500} align="center" sx={subtitleSx}>
            See what pharmacy owners are saying about PharmaERP and how it’s
            helping their business grow.
          </AppText>
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={statsCardSx}
        >
          <div className="grid grid-cols-4 divide-x divide-border">
            {stats.map((item) => (
              <StatItem key={item.label} {...item} />
            ))}
          </div>
        </AppCard>

        <div className="mt-3 space-y-2.5">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-2 w-6 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={logoSectionSx}
        >
          <AppHeading level={3} weight={700} align="center" sx={logoTitleSx}>
            Trusted by Leading Pharmacy Stores
          </AppHeading>

          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {logos.map((logo) => (
              <LogoCard key={logo} logo={logo} />
            ))}
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <AppBox sx={ctaIconSx}>
                <FiShield />
              </AppBox>

              <div className="min-w-0">
                <AppHeading level={3} weight={700} sx={ctaTitleSx}>
                  Join 5,000+ successful pharmacies
                </AppHeading>

                <AppText variant="body2" weight={500} sx={ctaTextSx}>
                  Simplify operations and grow your business.
                </AppText>
              </div>
            </div>

            <AppButton
              variant="contained"
              colorVariant="primary"
              rounded="md"
              endIcon={<FiArrowRight />}
              sx={ctaButtonSx}
            >
              Start Trial
            </AppButton>
          </div>
        </AppCard>
      </AppBox>
    </section>
  );
};

const StatItem = ({ icon, value, label }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-1 py-2.5 text-center">
      <div className="text-[20px] leading-none text-primary">{icon}</div>

      <AppHeading level={3} weight={750} sx={statValueSx}>
        {value}
      </AppHeading>

      <AppText variant="body2" weight={600} sx={statLabelSx}>
        {label}
      </AppText>
    </div>
  );
};

const TestimonialCard = ({ image, name, store, city, text }) => {
  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={testimonialCardSx}
    >
      <div className="flex items-start gap-2.5">
        <img
          src={image}
          alt={name}
          className="h-[50px] w-[50px] shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <AppHeading level={3} weight={700} sx={personNameSx}>
                {name}
              </AppHeading>

              <AppText variant="body2" weight={550} sx={storeSx}>
                {store}
              </AppText>

              <div className="mt-1 flex items-center gap-1">
                <FiMapPin className="shrink-0 text-[11px] text-primary" />

                <AppText variant="body2" weight={550} sx={citySx}>
                  {city}
                </AppText>
              </div>
            </div>

            <div className="mt-1 flex shrink-0 items-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar key={index} className="text-[11px]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AppText variant="body2" weight={500} sx={testimonialTextSx}>
        {text}
      </AppText>
    </AppCard>
  );
};

const LogoCard = ({ logo }) => {
  return (
    <div className="flex h-[40px] min-w-[70px] items-center justify-center rounded-xl border border-border bg-surface px-2 shadow-sm">
      <span className="truncate text-[9.5px] font-bold text-primary">
        {logo}
      </span>
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

const headerSx = {
  textAlign: "center",
};

const eyebrowSx = {
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const titleSx = {
  mt: 2.2,
  mb: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.24,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mx: "auto",
  mt: 1.3,
  maxWidth: 320,
  fontSize: { xs: "12px", sm: "12.6px" },
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const statsCardSx = {
  mt: 3.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-border)",
};

const statValueSx = {
  mt: 0.9,
  mb: 0,
  fontSize: { xs: "16px", sm: "17px" },
  lineHeight: 1,
  letterSpacing: "-0.3px",
  color: "var(--app-color-primary)",
};

const statLabelSx = {
  mt: 0.7,
  fontSize: "8.8px",
  lineHeight: 1.2,
  color: "var(--app-color-text-muted)",
};

const testimonialCardSx = {
  px: 1.8,
  py: 1.8,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const personNameSx = {
  m: 0,
  fontSize: "13.4px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const storeSx = {
  mt: 0.4,
  fontSize: "10.8px",
  lineHeight: 1.2,
  color: "var(--app-color-text-muted)",
};

const citySx = {
  fontSize: "10.3px",
  lineHeight: 1.2,
  color: "var(--app-color-text-muted)",
};

const testimonialTextSx = {
  mt: 1.6,
  fontSize: "11.8px",
  lineHeight: "18.5px",
  color: "var(--app-color-text)",
};

const logoSectionSx = {
  mt: 4,
  px: 1.5,
  py: 1.8,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-border)",
};

const logoTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const ctaCardSx = {
  mt: 2.5,
  px: 1.6,
  py: 1.5,
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
};

const ctaIconSx = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "23px",
};

const ctaTitleSx = {
  m: 0,
  fontSize: "12.2px",
  lineHeight: 1.25,
  color: "var(--app-color-primary-contrast)",
};

const ctaTextSx = {
  mt: 0.35,
  fontSize: "9.5px",
  lineHeight: "14px",
  color: "var(--app-color-primary-contrast)",
  opacity: 0.92,
};

const ctaButtonSx = {
  flexShrink: 0,
  minWidth: "unset",
  height: 38,
  px: 1.4,
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-primary)",
  fontSize: "10.2px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  boxShadow: "var(--app-shadow-sm)",
  "&:hover": {
    bgcolor: "var(--app-color-surface-alt)",
  },
};

export default MobileTestimonialsSection;
