// src/features/landing/components/mobile/MobileHeroSection.jsx

import {
  FiArrowRight,
  FiBarChart2,
  FiBell,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiCloud,
  FiFileText,
  FiLock,
  FiShield,
  FiSmile,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const MobileHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_32%)]" />

      <AppBox
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: 390, sm: 430, md: 460 },
          mx: "auto",
          px: { xs: 2, sm: 2.5 },
          pt: { xs: 2.2, sm: 2.5 },
          pb: { xs: 1.8, sm: 2.2 },
        }}
      >
        <AppBox
          sx={{
            position: "relative",
            minHeight: { xs: 270, sm: 290 },
          }}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <AppBox
              sx={{
                position: "relative",
                zIndex: 3,
                maxWidth: { xs: 245, sm: 270 },
              }}
            >
              <AppHeading
                level={1}
                weight={800}
                sx={{
                  m: 0,
                  fontSize: { xs: "28px", sm: "30px" },
                  lineHeight: 1.24,
                  letterSpacing: "-0.7px",
                  color: "var(--app-color-text)",
                }}
              >
                Run Your Pharmacy Smarter with{" "}
                <span className="text-primary">PharmaERP</span>
              </AppHeading>

              <AppText
                variant="body2"
                weight={500}
                sx={{
                  mt: 1.5,
                  maxWidth: { xs: 235, sm: 255 },
                  fontSize: { xs: "12.6px", sm: "13.2px" },
                  lineHeight: "20px",
                  color: "var(--app-color-text-muted)",
                }}
              >
                Billing, Inventory, GST, Expiry Alerts & Reports — Everything in
                One Place
              </AppText>

              <div className="mt-4 grid max-w-[240px] grid-cols-2 gap-x-3 gap-y-2.5 sm:max-w-[255px]">
                <HeroPoint icon={<FiCheckCircle />} text="GST Compliant" />
                <HeroPoint icon={<FiSmile />} text="Easy to Use" />
                <HeroPoint icon={<FiLock />} text="Secure & Reliable" />
                <HeroPoint icon={<FiCloud />} text="Cloud Based" />
              </div>
            </AppBox>

            <img
              src="/src/assets/dashboard-showcase/mobile-app-preview.png"
              alt="PharmaERP Mobile Dashboard"
              className="relative z-[4] w-[112px] object-contain drop-shadow-xl sm:w-[124px]"
            />
          </div>
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 2.4,
            overflow: "hidden",
            bgcolor: "var(--app-color-readonly-bg)",
            borderColor: "var(--app-color-border)",
          }}
        >
          <div className="grid grid-cols-4 divide-x divide-border">
            <FeatureTile
              icon={<FiFileText />}
              title="GST Billing"
              sub="& E-Invoicing"
            />

            <FeatureTile icon={<FiBox />} title="Inventory" sub="Management" />

            <FeatureTile
              icon={<FiBell />}
              title="Expiry Alerts"
              sub="& Stock Alerts"
            />

            <FeatureTile
              icon={<FiBarChart2 />}
              title="Reports &"
              sub="Analytics"
            />
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 1.5,
            px: 1.4,
            py: 1.4,
            bgcolor: "var(--app-color-surface)",
            borderColor: "var(--app-color-border)",
          }}
        >
          <AppStack direction="row" align="center" justify="center" gap={0.6}>
            <FiShield className="text-primary text-[13px]" />

            <AppText
              variant="body2"
              weight={650}
              align="center"
              sx={{
                fontSize: "11.2px",
                lineHeight: 1.2,
                color: "var(--app-color-text)",
              }}
            >
              Trusted by 5,000+ Pharmacy Stores Across India
            </AppText>
          </AppStack>

          <div className="mt-3 grid grid-cols-5 items-center gap-1.5">
            <BrandLogo name="Apollo" sub="PHARMACY" />
            <BrandLogo name="MedPlus✚" danger />
            <BrandLogo name="netmeds" sub="India Ki Pharmacy" />
            <BrandLogo name="LIFECARE" sub="PHARMACY" />
            <BrandLogo name="FRANK ROSS" sub="PHARMACY" muted />
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1.5,
            textAlign: "center",
            bgcolor: "var(--app-color-readonly-bg)",
            borderColor: "var(--app-color-border)",
          }}
        >
          <AppHeading
            level={2}
            weight={700}
            sx={{
              m: 0,
              fontSize: "14.8px",
              lineHeight: 1.35,
              color: "var(--app-color-text)",
            }}
          >
            Start Managing Your Pharmacy Better Today
          </AppHeading>

          <AppText
            variant="body2"
            weight={500}
            sx={{
              mt: 0.6,
              fontSize: "11px",
              lineHeight: "17px",
              color: "var(--app-color-text-muted)",
            }}
          >
            Save time, reduce losses and grow your business with PharmaERP.
          </AppText>

          <AppStack direction="column" gap={0.8} sx={{ mt: 1.3 }}>
            <AppButton
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              endIcon={<FiArrowRight />}
              sx={{
                height: 36,
                fontSize: "11.8px",
                fontWeight: 650,
                boxShadow: "var(--app-shadow-sm)",
              }}
            >
              Start 7 Days Free Trial
            </AppButton>

            <AppButton
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              fullWidth
              startIcon={<FiCalendar />}
              sx={{
                height: 34,
                fontSize: "11.6px",
                fontWeight: 650,
                bgcolor: "var(--app-color-surface)",
              }}
            >
              Book a Free Demo
            </AppButton>
          </AppStack>
        </AppCard>
      </AppBox>
    </section>
  );
};

const HeroPoint = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-[13px] leading-none text-primary">
        {icon}
      </span>

      <span className="text-[10.6px] font-semibold leading-none text-text">
        {text}
      </span>
    </div>
  );
};

const FeatureTile = ({ icon, title, sub }) => {
  return (
    <div className="flex min-h-[68px] flex-col items-center justify-center px-1 py-1.8 text-center">
      <div className="mb-0.8 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[15px] text-primary shadow-sm">
        {icon}
      </div>

      <p className="m-0 text-[8.5px] font-semibold leading-[12px] text-text">
        {title}
      </p>

      <p className="m-0 text-[8.5px] font-medium leading-[12px] text-text">
        {sub}
      </p>
    </div>
  );
};

const BrandLogo = ({ name, sub, danger = false, muted = false }) => {
  return (
    <div className="text-center leading-none">
      <p
        className={[
          "m-0 text-[8.4px] font-semibold tracking-tight",
          danger ? "text-error" : muted ? "text-text" : "text-primary",
        ].join(" ")}
      >
        {name}
      </p>

      {sub && (
        <p className="m-0 mt-0.5 text-[4.8px] font-medium text-text-muted">
          {sub}
        </p>
      )}
    </div>
  );
};

export default MobileHeroSection;
