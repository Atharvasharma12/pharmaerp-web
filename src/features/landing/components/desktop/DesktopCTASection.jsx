import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";

import { ROUTES } from "@/constants";
import {
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppText,
} from "@/components";

const DesktopCTASection = () => {
  return (
    <section className="w-full bg-bg py-10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            px: { xs: 3, sm: 4, lg: 5 },
            py: { xs: 4, lg: 5 },
            borderColor: "var(--app-color-border)",
            bgcolor: "var(--app-color-surface)",
          }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <AppBadge
              variant="soft"
              colorVariant="primary"
              rounded="full"
              startIcon={<FiUsers />}
              label="Trusted by 5,000+ Pharmacies"
              sx={{
                mb: 2,
                px: 1.5,
                py: 0.75,
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
                  xs: "30px",
                  sm: "38px",
                  lg: "42px",
                },
                lineHeight: 1.08,
                letterSpacing: "-0.9px",
                color: "var(--app-color-text)",
              }}
            >
              Ready to Simplify Your
              <span className="block text-primary">Pharmacy Operations?</span>
            </AppHeading>

            <AppText
              variant="body1"
              sx={{
                mx: "auto",
                mt: 2,
                maxWidth: "42rem",
                fontSize: "16px",
                lineHeight: "28px",
                color: "var(--app-color-text-muted)",
              }}
            >
              Manage billing, inventory, expiry tracking and reports in one
              simple pharmacy management system.
            </AppText>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <MiniPoint text="No Credit Card Required" />
              <MiniPoint text="GST Compliant" />
              <MiniPoint text="Setup in Minutes" />
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AppButton
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                colorVariant="primary"
                rounded="md"
                endIcon={<FiArrowRight />}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  fontSize: "15px",
                  fontWeight: 800,
                  boxShadow: "var(--app-shadow-sm)",
                }}
              >
                Start Free Trial
              </AppButton>

              <AppButton
                component={Link}
                to={ROUTES.LOGIN}
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                startIcon={<FiCalendar />}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  fontSize: "15px",
                  fontWeight: 800,
                  bgcolor: "var(--app-color-surface)",
                }}
              >
                Sign In
              </AppButton>
            </div>

            <AppText
              variant="body2"
              sx={{
                mt: 3,
                fontSize: "13px",
                color: "var(--app-color-text-muted)",
              }}
            >
              Start your 7 days free trial today.
            </AppText>
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const MiniPoint = ({ text }) => {
  return (
    <AppBox
      display="flex"
      alignItems="center"
      sx={{
        gap: 1,
        borderRadius: "999px",
        border: "1px solid var(--app-color-border)",
        px: 1.5,
        py: 0.75,
        bgcolor: "var(--app-color-surface)",
      }}
    >
      <FiCheckCircle
        style={{
          fontSize: 15,
          color: "var(--app-color-primary)",
          flexShrink: 0,
        }}
      />

      <AppText
        variant="body2"
        weight={700}
        sx={{
          fontSize: "12.5px",
          lineHeight: 1,
          color: "var(--app-color-text)",
        }}
      >
        {text}
      </AppText>
    </AppBox>
  );
};

export default DesktopCTASection;
