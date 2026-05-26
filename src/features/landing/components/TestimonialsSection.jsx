import React from "react";
import {
  FiUsers,
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

import { AppBadge, AppBox, AppCard, AppHeading, AppText } from "@/components";

const TestimonialsSection = () => {
  const stats = [
    {
      icon: <FiHome />,
      value: "5,000+",
      title: "Pharmacies",
      desc: "Trust PharmaERP",
    },
    {
      icon: <FiUsers />,
      value: "20,000+",
      title: "Users",
      desc: "Across India",
    },
    {
      icon: <FiFileText />,
      value: "1 Cr+",
      title: "Bills Generated",
      desc: "Every Month",
    },
    {
      icon: <FiTrendingUp />,
      value: "99.9%",
      title: "Uptime",
      desc: "Reliable & Secure",
    },
  ];

  const testimonials = [
    {
      text: "PharmaERP has completely transformed the way we run our pharmacy. Billing is faster, stock management is effortless and reports help us make better decisions.",
      name: "Amit Sharma",
      store: "Sharma Medical Store",
      city: "Jaipur, Rajasthan",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      text: "The expiry alerts and stock tracking features have reduced our losses significantly. Support team is very responsive and the system is very easy to use.",
      name: "Neha Patel",
      store: "Patel Pharmacy",
      city: "Surat, Gujarat",
      image: "https://i.pravatar.cc/100?img=47",
    },
    {
      text: "Best pharmacy management system we have used. GST billing, purchase management, customer history — everything is so well organized in one place.",
      name: "Ramesh Verma",
      store: "Verma Medicals",
      city: "Lucknow, Uttar Pradesh",
      image: "https://i.pravatar.cc/100?img=12",
    },
  ];

  const logos = [
    "Apollo PHARMACY",
    "MedPlus ✚",
    "Wellness Forever",
    "netmeds",
    "FRANK ROSS",
    "LIFECARE",
  ];

  const logoColorVariants = [
    "success",
    "error",
    "primary",
    "info",
    "textMuted",
    "text",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-bg py-10">
      <DecorDots className="left-0 top-[300px]" />
      <DecorDots className="right-0 bottom-[115px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <AppBadge
            variant="soft"
            colorVariant="success"
            rounded="full"
            startIcon={<FiUsers />}
            label="Trusted by Pharmacy Owners"
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
            Loved by Thousands of
            <span className="block text-primary">
              Pharmacy Owners Across India
            </span>
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
            PharmaERP is trusted by retail pharmacy stores of all sizes to
            simplify operations, improve efficiency and grow their business.
          </AppText>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 3,
            px: 2.5,
            py: 2.5,
            borderColor: "var(--app-color-success-soft)",
            bgcolor: "var(--app-color-readonly-bg)",
          }}
        >
          <AppHeading
            level={3}
            weight={700}
            sx={{
              m: 0,
              textAlign: "center",
              fontSize: "18px",
              color: "var(--app-color-text)",
            }}
          >
            Trusted by Leading Pharmacy Stores
          </AppHeading>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {logos.map((logo, index) => (
              <LogoCard
                key={logo}
                logo={logo}
                colorVariant={logoColorVariants[index]}
              />
            ))}
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const StatCard = ({ icon, value, title, desc }) => {
  return (
    <AppCard
      variant="default"
      bordered
      rounded="lg"
      shadow="sm"
      padding="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2.5,
        py: 2,
        bgcolor: "var(--app-color-surface)",
      }}
    >
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
          bgcolor: "var(--app-color-success-soft)",
          color: "var(--app-color-success)",
          fontSize: "27px",
          lineHeight: 0,
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
            fontSize: "26px",
            lineHeight: 1,
            color: "var(--app-color-text)",
          }}
        >
          {value}
        </AppHeading>

        <AppText
          variant="body2"
          weight={700}
          sx={{
            mt: 0.5,
            fontSize: "15px",
            lineHeight: 1,
            color: "var(--app-color-text)",
          }}
        >
          {title}
        </AppText>

        <AppText
          variant="body2"
          sx={{
            mt: 1,
            fontSize: "12.5px",
            lineHeight: "20px",
            color: "var(--app-color-text-muted)",
          }}
        >
          {desc}
        </AppText>
      </AppBox>
    </AppCard>
  );
};

const TestimonialCard = ({ text, name, store, city, image }) => {
  return (
    <AppCard
      variant="default"
      bordered
      rounded="lg"
      shadow="sm"
      padding="none"
      sx={{
        px: 2.5,
        py: 2.5,
        bgcolor: "var(--app-color-surface)",
      }}
    >
      <FaQuoteLeft className="text-[24px] text-primary" />

      <AppText
        variant="body2"
        sx={{
          mt: 2,
          minHeight: 108,
          fontSize: "14px",
          lineHeight: "24px",
          color: "var(--app-color-text)",
        }}
      >
        {text}
      </AppText>

      <AppBox
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid var(--app-color-border)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={image}
              alt={name}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <AppHeading
                level={4}
                weight={700}
                sx={{
                  m: 0,
                  fontSize: "14px",
                  color: "var(--app-color-text)",
                }}
              >
                {name}
              </AppHeading>

              <AppText
                variant="body2"
                weight={600}
                sx={{
                  mt: 0.5,
                  fontSize: "12px",
                  color: "var(--app-color-text)",
                }}
              >
                {store}
              </AppText>

              <p className="mt-1 flex items-center gap-1 text-[11.5px] text-text-muted">
                <FiMapPin className="shrink-0 text-primary" />
                {city}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 text-warning">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[13px]" />
            ))}
          </div>
        </div>
      </AppBox>
    </AppCard>
  );
};

const LogoCard = ({ logo, colorVariant = "text" }) => {
  const colorMap = {
    primary: "var(--app-color-primary)",
    success: "var(--app-color-success)",
    error: "var(--app-color-error)",
    warning: "var(--app-color-warning)",
    info: "var(--app-color-info)",
    text: "var(--app-color-text)",
    textMuted: "var(--app-color-text-muted)",
  };

  return (
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 64,
        px: 1.5,
        borderRadius: "8px",
        bgcolor: "var(--app-color-surface)",
        boxShadow: "var(--app-shadow-sm)",
      }}
    >
      <AppText
        variant="body2"
        weight={800}
        align="center"
        sx={{
          fontSize: "15px",
          lineHeight: 1.25,
          color: colorMap[colorVariant] || "var(--app-color-text)",
        }}
      >
        {logo}
      </AppText>
    </AppBox>
  );
};

const DecorDots = ({ className = "" }) => {
  return (
    <div
      className={`pointer-events-none absolute hidden h-[120px] w-[90px] opacity-35 lg:block ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--app-color-primary) 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
      }}
    />
  );
};

export default TestimonialsSection;
