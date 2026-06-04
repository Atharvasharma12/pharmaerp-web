import { FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

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

const RegisterMobilePage = ({
  formData,
  formErrors,
  agree,
  isLoading,
  error,
  handleChange,
  handleAgreeChange,
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
        <AppBox sx={headerSx}>
          <AppHeading level={2} weight={800} align="center" sx={titleSx}>
            Create Account
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            Register to start managing your pharmacy smarter
          </AppText>
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="md"
          padding="none"
          sx={cardSx}
        >
          {error && <AppBox sx={errorBoxSx}>{error}</AppBox>}

          <AppBox
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <AppStack
              direction="column"
              align="stretch"
              gap={1.25}
              sx={{ width: "100%" }}
            >
              <MobileInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                error={Boolean(formErrors.fullName)}
                helperText={formErrors.fullName}
                placeholder="Enter your full name"
                startIcon={<FiUser />}
              />

              <MobileInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                placeholder="Enter your email address"
                startIcon={<FiMail />}
              />

              <MobileInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                error={Boolean(formErrors.phone)}
                helperText={
                  formErrors.phone || "Optional 10-digit Indian mobile number"
                }
                placeholder="Enter your phone number"
                startIcon={<FiPhone />}
                prefix="+91"
                inputProps={{ maxLength: 10 }}
              />

              <MobilePassword
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password || "Minimum 6 characters"}
                placeholder="Create a password"
              />

              <MobilePassword
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                error={Boolean(formErrors.confirmPassword)}
                helperText={formErrors.confirmPassword}
                placeholder="Confirm your password"
              />

              <AppStack
                direction="row"
                align="flex-start"
                gap={0.7}
                sx={{ mt: 0.4 }}
              >
                <AppCheckbox
                  checked={agree}
                  onChange={handleAgreeChange}
                  disabled={isLoading}
                  colorVariant="primary"
                  size="small"
                  sx={{
                    m: 0,
                    mt: 0.1,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                  checkboxSx={{ p: 0.25 }}
                />

                <AppText variant="body2" sx={agreeTextSx}>
                  I agree to the{" "}
                  <AppLink href="/terms" underline="none" sx={linkSx}>
                    Terms
                  </AppLink>{" "}
                  and{" "}
                  <AppLink href="/privacy" underline="none" sx={linkSx}>
                    Privacy Policy
                  </AppLink>
                </AppText>
              </AppStack>

              {formErrors.agree && (
                <AppText variant="body2" sx={agreeErrorSx}>
                  {formErrors.agree}
                </AppText>
              )}

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                fullWidth
                disabled={isLoading}
                sx={submitButtonSx}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </AppButton>

              <AppStack
                direction="row"
                align="center"
                justify="center"
                gap={1.1}
                sx={{ width: "100%", my: 0.2 }}
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
                colorVariant="neutral"
                rounded="md"
                fullWidth
                startIcon={<FcGoogle />}
                disabled={isLoading}
                sx={googleButtonSx}
              >
                Continue with Google
              </AppButton>
            </AppStack>
          </AppBox>
        </AppCard>

        <AppBox sx={{ width: "100%", textAlign: "center", mt: 1.75 }}>
          <AppText variant="body2" weight={650} sx={loginTextSx}>
            Already have an account?{" "}
            <AppLink href={ROUTES.LOGIN} underline="none" sx={linkSx}>
              Login
            </AppLink>
          </AppText>
        </AppBox>

        <AppBox sx={footerSx}>
          <FiLock style={{ color: "var(--app-color-primary)", fontSize: 13 }} />

          <AppText variant="body2" weight={650} sx={safeTextSx}>
            Your data is safe and secure with us.
          </AppText>
        </AppBox>
      </AppBox>
    </section>
  );
};

const headerSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  mt: { xs: 1.2, sm: 1.6 },
};

const titleSx = {
  fontSize: { xs: "20px", sm: "23px" },
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.45,
  fontSize: { xs: "11.8px", sm: "13px" },
  color: "var(--app-color-text-muted)",
};

const cardSx = {
  mt: 3,
  width: "100%",
  px: { xs: 2.2, sm: 2.8 },
  pt: { xs: 2.6, sm: 3 },
  pb: { xs: 2.8, sm: 3.2 },
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const errorBoxSx = {
  mb: 1.5,
  px: 1.3,
  py: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-error)",
  bgcolor: "var(--app-color-error-soft)",
  color: "var(--app-color-error)",
  fontSize: "11.5px",
  fontWeight: 600,
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

const agreeTextSx = {
  fontSize: "11.4px",
  lineHeight: "18px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const agreeErrorSx = {
  mt: -0.4,
  fontSize: "11.2px",
  fontWeight: 600,
  color: "var(--app-color-error)",
};

const linkSx = {
  color: "var(--app-color-primary)",
  fontWeight: 800,
};

const submitButtonSx = {
  mt: 0.6,
  height: 46,
  fontSize: "13.5px",
  fontWeight: 750,
  boxShadow: "var(--app-shadow-sm)",
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

const googleButtonSx = {
  height: 44,
  fontSize: "12.8px",
  fontWeight: 750,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const loginTextSx = {
  fontSize: "12.4px",
  color: "var(--app-color-text)",
};

const footerSx = {
  width: "100%",
  mt: 2.1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.55,
  textAlign: "center",
};

const safeTextSx = {
  fontSize: "11.7px",
  color: "var(--app-color-text-muted)",
};

const MobileInput = ({
  label,
  type = "text",
  placeholder,
  startIcon,
  prefix,
  name,
  value,
  onChange,
  disabled,
  error,
  helperText,
  inputProps,
}) => (
  <AppInput
    label={label}
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    fullWidth
    size="small"
    variant="bordered"
    rounded="md"
    startIcon={startIcon}
    prefix={prefix}
    error={error}
    helperText={helperText}
    inputProps={inputProps}
    labelSx={labelSx}
    inputSx={inputSx}
  />
);

const MobilePassword = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  error,
  helperText,
}) => (
  <AppPasswordInput
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    fullWidth
    size="small"
    variant="bordered"
    rounded="md"
    startIcon={<FiLock />}
    error={error}
    helperText={helperText}
    labelSx={labelSx}
    inputSx={inputSx}
  />
);

export default RegisterMobilePage;
