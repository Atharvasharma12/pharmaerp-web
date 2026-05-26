import { FiLock, FiSmartphone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { ROUTES } from "@/constants";

import {
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

const LoginMobilePage = ({
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,color-mix(in_srgb,var(--app-color-primary)_9%,transparent),transparent_36%)]" />

      <AppBox
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: 390, sm: 430, md: 460 },
          minHeight: "100vh",
          mx: "auto",
          px: { xs: 2, sm: 2.5 },
          pt: { xs: 2.4, sm: 3 },
          pb: { xs: 2, sm: 2.5 },
        }}
      >
        <AppBox
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            mt: { xs: 1.2, sm: 1.6 },
          }}
        >
          <AppHeading level={2} weight={800} align="center" sx={welcomeSx}>
            Welcome Back!
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            Login to access your pharmacy dashboard
          </AppText>
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="md"
          padding="none"
          sx={{
            mt: 3,
            width: "100%",
            px: { xs: 2.2, sm: 2.8 },
            pt: { xs: 3, sm: 3.5 },
            pb: { xs: 3, sm: 3.4 },
            bgcolor: "var(--app-color-surface)",
            borderColor: "var(--app-color-border)",
            boxShadow: "var(--app-shadow-md)",
          }}
        >
          {error && (
            <AppBox
              sx={{
                mb: 1.5,
                px: 1.3,
                py: 1,
                borderRadius: "10px",
                border: "1px solid var(--app-color-error)",
                bgcolor: "var(--app-color-error-soft)",
                color: "var(--app-color-error)",
                fontSize: "11.5px",
                fontWeight: 600,
              }}
            >
              {error}
            </AppBox>
          )}

          <AppBox
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <AppStack
              direction="column"
              align="stretch"
              gap={1.5}
              sx={{ width: "100%" }}
            >
              <AppInput
                label="Mobile Number / Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter mobile number or email"
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                startIcon={<FiSmartphone />}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              <AppPasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your password"
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                startIcon={<FiLock />}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              <AppBox
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 0.2,
                }}
              >
                <AppCheckbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={isLoading}
                  colorVariant="primary"
                  size="small"
                  sx={{ m: 0, height: 20 }}
                  checkboxSx={{ p: 0.25 }}
                  labelSx={{
                    fontSize: "11.4px",
                    fontWeight: 650,
                    color: "var(--app-color-text-muted)",
                  }}
                />

                <AppLink
                  href={ROUTES.FORGOT_PASSWORD}
                  underline="none"
                  sx={{
                    fontSize: "11.3px",
                    fontWeight: 750,
                    color: "var(--app-color-primary)",
                  }}
                >
                  Forgot Password?
                </AppLink>
              </AppBox>

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: 0.8,
                  height: 46,
                  fontSize: "13.5px",
                  fontWeight: 750,
                  boxShadow: "var(--app-shadow-sm)",
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </AppButton>

              <AppStack
                direction="row"
                align="center"
                justify="center"
                gap={1.1}
                sx={{ width: "100%", my: 0.3 }}
              >
                <AppBox sx={dividerSx} />
                <AppText variant="body2" weight={650} sx={orSx}>
                  OR
                </AppText>
                <AppBox sx={dividerSx} />
              </AppStack>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                fullWidth
                startIcon={<FaWhatsapp />}
                disabled={isLoading}
                sx={{
                  height: 44,
                  fontSize: "12.8px",
                  fontWeight: 750,
                  bgcolor: "var(--app-color-surface)",
                  borderColor: "var(--app-color-border-strong)",
                  color: "var(--app-color-primary)",
                }}
              >
                Login with WhatsApp
              </AppButton>
            </AppStack>
          </AppBox>
        </AppCard>

        <AppBox sx={{ width: "100%", textAlign: "center", mt: 1.75 }}>
          <AppText variant="body2" weight={650} sx={createSx}>
            Don&apos;t have an account?{" "}
            <AppLink
              href={ROUTES.REGISTER}
              underline="none"
              sx={{ color: "var(--app-color-primary)", fontWeight: 800 }}
            >
              Create Account
            </AppLink>
          </AppText>
        </AppBox>

        <AppBox
          sx={{
            width: "100%",
            mt: 2.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.55,
            textAlign: "center",
          }}
        >
          <FiLock style={{ color: "var(--app-color-primary)", fontSize: 13 }} />
          <AppText variant="body2" weight={650} sx={safeTextSx}>
            Your data is safe and secure with us.
          </AppText>
        </AppBox>
      </AppBox>
    </section>
  );
};

const labelSx = {
  mb: 0.35,
  fontSize: "11.6px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const welcomeSx = {
  fontSize: { xs: "20px", sm: "23px" },
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.45,
  fontSize: { xs: "11.8px", sm: "13px" },
  color: "var(--app-color-text-muted)",
};

const dividerSx = {
  height: 1,
  flex: 1,
  bgcolor: "var(--app-color-divider)",
};

const orSx = {
  width: "auto",
  flexShrink: 0,
  color: "var(--app-color-text-muted)",
  fontSize: "10.6px",
};

const createSx = {
  fontSize: "12.4px",
  color: "var(--app-color-text)",
};

const safeTextSx = {
  fontSize: "11.7px",
  color: "var(--app-color-text-muted)",
};

export default LoginMobilePage;
