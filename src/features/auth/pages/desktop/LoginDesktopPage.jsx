import {
  FiBarChart2,
  FiBox,
  FiFileText,
  FiHeadphones,
  FiLock,
  FiMail,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import { ROUTES } from "@/constants";

import {
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppCheckbox,
  AppHeading,
  AppInput,
  AppLink,
  AppPasswordInput,
  AppStack,
  AppText,
} from "@/components";

const LoginDesktopPage = ({
  formData,
  formErrors,
  rememberMe,
  isLoading,
  error,
  handleChange,
  handleRememberMeChange,
  handleSubmit,
}) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_34%),radial-gradient(circle_at_84%_12%,color-mix(in_srgb,var(--app-color-primary)_4.5%,transparent),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-start gap-8 px-8 py-8 lg:grid-cols-2 lg:px-12">
        <AppBox sx={{ pt: 0.5, maxWidth: 520 }}>
          <AppStack direction="row" align="center" gap={1}>
            <AppBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 32,
                height: 32,
                color: "var(--app-color-primary)",
                fontSize: "30px",
                lineHeight: 1,
              }}
            >
              ✚
            </AppBox>

            <AppHeading
              level={1}
              weight={700}
              sx={{
                m: 0,
                fontSize: { xs: "24px", lg: "28px" },
                letterSpacing: "-0.4px",
                color: "var(--app-color-text)",
              }}
            >
              Pharma<span className="text-primary">ERP</span>
            </AppHeading>
          </AppStack>

          <AppBadge
            variant="soft"
            colorVariant="primary"
            rounded="full"
            startIcon={<FiShield />}
            label="Smart Pharmacy Management"
            sx={{
              mt: 3,
              px: 1.1,
              py: 0.35,
              fontSize: "11px",
              fontWeight: 700,
            }}
          />

          <AppHeading
            level={2}
            weight={700}
            sx={{
              mt: 1.7,
              mb: 0,
              maxWidth: 430,
              fontSize: { xs: "26px", lg: "31px" },
              lineHeight: 1.22,
              letterSpacing: "-0.5px",
              color: "var(--app-color-text)",
            }}
          >
            Manage Your Pharmacy Business Smarter
          </AppHeading>

          <AppText
            variant="body2"
            sx={{
              mt: 1.2,
              maxWidth: 430,
              fontSize: "13.5px",
              lineHeight: "22px",
              color: "var(--app-color-text-muted)",
            }}
          >
            PharmaERP helps you streamline inventory, billing, purchases, and
            more — all in one place.
          </AppText>

          <AppStack direction="column" gap={1.7} sx={{ mt: 3 }}>
            <FeatureItem
              icon={<FiBarChart2 />}
              title="Real-time Insights"
              text="Get real-time reports and analytics."
            />
            <FeatureItem
              icon={<FiBox />}
              title="Inventory Management"
              text="Track stock, expiry, and alerts."
            />
            <FeatureItem
              icon={<FiFileText />}
              title="Easy Billing"
              text="Fast & simple POS billing."
            />
            <FeatureItem
              icon={<FiUsers />}
              title="Multi-store Management"
              text="Manage single or multiple stores."
            />
          </AppStack>
        </AppBox>

        <AppBox sx={{ pt: 0 }}>
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="md"
            padding="none"
            sx={{
              width: "100%",
              maxWidth: 640,
              ml: { lg: "auto" },
              px: { xs: 3, sm: 4, lg: 4.5 },
              py: { xs: 3, lg: 3.4 },
              bgcolor:
                "color-mix(in srgb, var(--app-color-surface) 88%, transparent)",
              backdropFilter: "blur(16px)",
              borderColor: "var(--app-color-border)",
              boxShadow: "var(--app-shadow-md)",
            }}
          >
            <AppHeading
              level={2}
              weight={700}
              sx={{
                m: 0,
                fontSize: { xs: "24px", lg: "28px" },
                color: "var(--app-color-text)",
              }}
            >
              Welcome Back!
            </AppHeading>

            <AppText
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: "15px",
                color: "var(--app-color-text-muted)",
              }}
            >
              Sign in to your PharmaERP account.
            </AppText>

            {error && (
              <AppBox
                sx={{
                  mt: 2,
                  px: 2,
                  py: 1.4,
                  borderRadius: "8px",
                  border: "1px solid var(--app-color-error)",
                  bgcolor: "var(--app-color-error-soft)",
                  color: "var(--app-color-error)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {error}
              </AppBox>
            )}

            <AppBox component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <AppStack direction="column" gap={1.35}>
                <AppInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your email address"
                  fullWidth
                  size="medium"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiMail />}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  labelSx={{
                    mb: 0.45,
                    fontSize: "12.5px",
                    fontWeight: 650,
                    color: "var(--app-color-text)",
                  }}
                  inputSx={{
                    height: 44,
                    fontSize: "13.5px",
                    bgcolor: "var(--app-color-surface-alt)",
                  }}
                />

                <AppPasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  fullWidth
                  size="medium"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiLock />}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                  labelSx={{
                    mb: 0.45,
                    fontSize: "12.5px",
                    fontWeight: 650,
                    color: "var(--app-color-text)",
                  }}
                  inputSx={{
                    height: 44,
                    fontSize: "13.5px",
                    bgcolor: "var(--app-color-surface-alt)",
                  }}
                />

                <AppStack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap={2}
                  sx={{ mt: 0.1, width: "100%", height: 24 }}
                >
                  <AppCheckbox
                    label="Remember me"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    disabled={isLoading}
                    colorVariant="primary"
                    size="small"
                    sx={{
                      m: 0,
                      display: "flex",
                      alignItems: "center",
                      height: 24,
                    }}
                    labelSx={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: "var(--app-color-text)",
                      lineHeight: "24px",
                    }}
                  />

                  <AppLink
                    href={ROUTES.FORGOT_PASSWORD}
                    underline="none"
                    sx={{
                      fontSize: "12.5px",
                      fontWeight: 700,
                      color: "var(--app-color-primary)",
                    }}
                  >
                    Forgot Password?
                  </AppLink>
                </AppStack>

                <AppButton
                  type="submit"
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 0.2,
                    height: 46,
                    fontSize: "14px",
                    fontWeight: 700,
                    boxShadow: "var(--app-shadow-sm)",
                  }}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </AppButton>

                <AppStack direction="row" align="center" gap={1.5}>
                  <AppBox
                    sx={{
                      height: 1,
                      flex: 1,
                      bgcolor: "var(--app-color-border)",
                    }}
                  />
                  <AppText
                    variant="body2"
                    weight={600}
                    sx={{
                      fontSize: "11.5px",
                      color: "var(--app-color-text-muted)",
                    }}
                  >
                    OR
                  </AppText>
                  <AppBox
                    sx={{
                      height: 1,
                      flex: 1,
                      bgcolor: "var(--app-color-border)",
                    }}
                  />
                </AppStack>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  fullWidth
                  startIcon={<FcGoogle />}
                  disabled={isLoading}
                  sx={{
                    height: 44,
                    fontSize: "13.5px",
                    fontWeight: 650,
                    bgcolor: "var(--app-color-surface-alt)",
                    borderColor: "var(--app-color-border)",
                    color: "var(--app-color-text)",
                  }}
                >
                  Sign in with Google
                </AppButton>

                <AppText
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 0.1,
                    fontSize: "13.5px",
                    color: "var(--app-color-text-muted)",
                  }}
                >
                  Don&apos;t have an account?{" "}
                  <AppLink
                    href={ROUTES.REGISTER}
                    underline="none"
                    sx={{ fontWeight: 700, color: "var(--app-color-primary)" }}
                  >
                    Create Account
                  </AppLink>
                </AppText>
              </AppStack>
            </AppBox>
          </AppCard>

          <AppStack
            direction="row"
            align="center"
            justify="center"
            gap={0}
            sx={{
              mt: 2,
              width: "100%",
              maxWidth: 640,
              ml: { lg: "auto" },
              flexWrap: "nowrap",
              height: 24,
            }}
          >
            <TrustText icon={<FiShield />} text="256-bit SSL Secured" />
            <TrustDivider />
            <TrustText icon={<FiLock />} text="Your Data is 100% Safe" />
            <TrustDivider />
            <TrustText icon={<FiHeadphones />} text="24/7 Customer Support" />
          </AppStack>
        </AppBox>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, text }) => (
  <AppStack direction="row" align="center" gap={1.3}>
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 38,
        height: 38,
        minWidth: 38,
        borderRadius: "999px",
        bgcolor: "var(--app-color-primary-soft)",
        color: "var(--app-color-primary)",
        fontSize: "19px",
        lineHeight: 0,
      }}
    >
      {icon}
    </AppBox>

    <AppBox>
      <AppText
        variant="body2"
        weight={650}
        sx={{
          fontSize: "13px",
          lineHeight: 1.15,
          color: "var(--app-color-text)",
        }}
      >
        {title}
      </AppText>

      <AppText
        variant="body2"
        sx={{
          mt: 0.3,
          fontSize: "12.5px",
          lineHeight: "18px",
          color: "var(--app-color-text-muted)",
        }}
      >
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const TrustText = ({ icon, text }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{ gap: 0.7, px: { xs: 1, md: 1.8 }, height: 24, whiteSpace: "nowrap" }}
  >
    <AppBox
      sx={{
        fontSize: "15px",
        color: "var(--app-color-text-muted)",
        mt: "-1px",
      }}
    >
      {icon}
    </AppBox>

    <AppText
      variant="body2"
      sx={{
        fontSize: "12.3px",
        lineHeight: "24px",
        color: "var(--app-color-text-muted)",
      }}
    >
      {text}
    </AppText>
  </AppBox>
);

const TrustDivider = () => (
  <AppBox
    sx={{
      width: "1px",
      height: 16,
      bgcolor: "var(--app-color-border)",
      display: { xs: "none", md: "block" },
    }}
  />
);

export default LoginDesktopPage;
