import React from "react";
import {
  FiShield,
  FiSmile,
  FiLock,
  FiCloud,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiHeadphones,
  FiSend,
} from "react-icons/fi";

import {
  AppButton,
  AppBadge,
  AppText,
  AppHeading,
  AppBox,
  AppStack,
  AppGrid,
} from "@/components";

const HeroSection = () => {
  return (
    <section className="w-full overflow-hidden bg-bg pt-8 pb-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* HERO CONTENT */}
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT SIDE */}
          <AppBox sx={{ maxWidth: 590 }}>
            {/* Badge */}
            <AppBadge
              variant="soft"
              colorVariant="success"
              rounded="full"
              startIcon={<FiCheckCircle />}
              label="All-in-One Pharmacy Management Software"
              sx={{
                mb: 1.5,
                px: 1.5,
                py: 0.5,
                fontSize: "11px",
                fontWeight: 700,
              }}
            />

            {/* Heading */}
            <AppHeading
              level={1}
              weight={800}
              sx={{
                fontSize: {
                  xs: "34px",
                  sm: "40px",
                  lg: "44px",
                  xl: "46px",
                },
                lineHeight: 1.05,
                letterSpacing: "-1.1px",
                color: "var(--app-color-text)",
                m: 0,
              }}
            >
              <span className="block whitespace-nowrap">
                Simplify Your Pharmacy in development brach.
              </span>
              <span className="block whitespace-nowrap text-primary">
                Grow Your Business.
              </span>
            </AppHeading>

            {/* Description */}
            <AppText
              variant="body2"
              sx={{
                mt: 1.5,
                maxWidth: 520,
                fontSize: "14px",
                lineHeight: "24px",
                color: "var(--app-color-text-muted)",
              }}
            >
              PharmaERP helps pharmacies automate billing, manage inventory,
              track expiry, handle GST and grow smarter with real-time insights.
            </AppText>

            {/* Features */}
            <AppGrid
              xs={2}
              gap={0}
              sx={{
                mt: 2,
                maxWidth: 500,
                columnGap: 3,
                rowGap: 1.25,
              }}
            >
              <Feature icon={<FiShield />} text="GST Compliant" />
              <Feature icon={<FiSmile />} text="Easy to Use" />
              <Feature icon={<FiLock />} text="Secure & Reliable" />
              <Feature icon={<FiCloud />} text="Cloud Based" />
            </AppGrid>

            {/* Buttons */}
            <AppStack
              direction={{ xs: "column", sm: "row" }}
              gap={1.5}
              sx={{ mt: 2.5 }}
            >
              <AppButton
                variant="contained"
                colorVariant="success"
                rounded="md"
                startIcon={<FiSend />}
                sx={{
                  px: 2.5,
                  py: 1.25,
                  fontSize: "14px",
                  fontWeight: 700,
                  boxShadow: "var(--app-shadow-sm)",
                }}
              >
                Start Free Trial
              </AppButton>

              <AppButton
                variant="outlined"
                colorVariant="success"
                rounded="md"
                startIcon={<FiCalendar />}
                sx={{
                  px: 2.5,
                  py: 1.25,
                  fontSize: "14px",
                  fontWeight: 700,
                  bgcolor: "var(--app-color-surface)",
                }}
              >
                Book a Demo
              </AppButton>
            </AppStack>

            {/* Bottom Text */}
            <AppStack
              direction="row"
              align="center"
              gap={1}
              sx={{
                mt: 1.5,
                fontSize: "12px",
                color: "var(--app-color-text-muted)",
              }}
            >
              <FiCheckCircle className="text-primary" />
              <span>No credit card required</span>
              <span>•</span>
              <span>Setup in minutes</span>
            </AppStack>
          </AppBox>

          {/* RIGHT IMAGE */}
          <div className="hidden items-center justify-center lg:flex">
            <img
              src="/src/assets/dashboard-showcase/overview-dashboard.png"
              alt="ERP Dashboard"
              className="w-full max-w-[470px] rounded-xl object-contain drop-shadow-[0_14px_26px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>

        {/* TRUST SECTION */}
        <AppBox
          sx={{
            mx: "auto",
            mt: 3,
            maxWidth: "72rem",
            borderTop: "1px solid var(--app-color-border)",
            pt: 2.5,
          }}
        >
          <AppText
            variant="body1"
            align="center"
            weight={500}
            sx={{
              fontSize: "15px",
              color: "var(--app-color-text)",
            }}
          >
            Trusted by <span className="font-bold text-primary">5,000+</span>{" "}
            Pharmacies Across India
          </AppText>

          <AppGrid
            xs={1}
            sm={2}
            lg={4}
            gap={3}
            sx={{
              mt: 3,
            }}
          >
            <TrustItem
              icon={<FiShield />}
              title="100% Secure"
              text="Your data is safe and protected"
            />

            <TrustItem
              icon={<FiClock />}
              title="Save Time"
              text="Automate tasks and reduce manual work"
            />

            <TrustItem
              icon={<FiTrendingUp />}
              title="Grow Faster"
              text="Insights that help you make better decisions"
            />

            <TrustItem
              icon={<FiHeadphones />}
              title="Dedicated Support"
              text="We're here to help you succeed"
              noBorder
            />
          </AppGrid>
        </AppBox>
      </div>
    </section>
  );
};

const Feature = ({ icon, text }) => {
  return (
    <AppStack
      direction="row"
      align="center"
      gap={1.2}
      sx={{
        minHeight: 32,
      }}
    >
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 28,
          height: 28,
          minWidth: 28,
          borderRadius: "999px",
          bgcolor:
            "var(--app-color-success-soft, var(--app-color-surface-alt))",
          color: "var(--app-color-success, var(--app-color-primary))",
          fontSize: "14px",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {icon}
      </AppBox>

      <AppText
        variant="body2"
        weight={500}
        sx={{
          fontSize: "12.5px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          color: "var(--app-color-text)",
        }}
      >
        {text}
      </AppText>
    </AppStack>
  );
};

const TrustItem = ({ icon, title, text, noBorder }) => {
  return (
    <AppStack
      direction="row"
      align="flex-start"
      gap={2}
      sx={{
        pr: { lg: noBorder ? 0 : 3 },
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
          flexShrink: 0,
          color: "var(--app-color-success, var(--app-color-primary))",
          fontSize: "32px",
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
          {text}
        </AppText>
      </AppBox>
    </AppStack>
  );
};

export default HeroSection;
