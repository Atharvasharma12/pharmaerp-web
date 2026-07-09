import {
  FiBarChart2,
  FiCloud,
  FiHeadphones,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiCheck,
} from "react-icons/fi";
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
  AppSwitch,
} from "@/components";


const RegisterDesktopPage = ({
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

            <AppHeading level={1} weight={700} sx={brandTitleSx}>
              Pharma<span className="text-primary">ERP</span>
            </AppHeading>
          </AppStack>

          <AppHeading level={2} weight={700} sx={heroTitleSx}>
            Create Your Account and Get Started
          </AppHeading>

          <AppText variant="body2" sx={heroSubtitleSx}>
            Manage your pharmacy operations smarter, faster and easier with{" "}
            <span className="font-bold text-primary">PharmaERP</span>.
          </AppText>

          <AppStack direction="column" gap={1.7} sx={{ mt: 3 }}>
            <FeatureItem
              icon={<FiShield />}
              title="Secure & Reliable"
              text="Your data is safe with us. 100% secure."
            />
            <FeatureItem
              icon={<FiCloud />}
              title="Cloud Based"
              text="Access your business from anywhere, anytime."
            />
            <FeatureItem
              icon={<FiBarChart2 />}
              title="Powerful Insights"
              text="Get real-time reports and grow your business."
            />
            <FeatureItem
              icon={<FiHeadphones />}
              title="Dedicated Support"
              text="Our support team is always ready to help you."
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
            sx={cardSx}
          >
            <AppHeading level={2} weight={700} sx={formTitleSx}>
              Create Account
            </AppHeading>

            <AppText variant="body2" sx={formSubtitleSx}>
              Fill in the details below to create your PharmaERP account.
            </AppText>

            {error && <AppBox sx={errorBoxSx}>{error}</AppBox>}

            <AppBox component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">
                <CompactInput
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

                <CompactInput
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

                <CompactInput
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



                <CompactPassword
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password || "Minimum 6 characters"}
                  placeholder="Create a password"
                />
                 <CompactPassword
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={Boolean(formErrors.confirmPassword)}
                  helperText={formErrors.confirmPassword}
                  placeholder="Confirm your password"
                />

              </div>

              <AppStack
                direction="row"
                align="center"
                gap={0.7}
                sx={{ mt: 1.5, height: 24 }}
              >
                <AppCheckbox
                  checked={agree}
                  onChange={handleAgreeChange}
                  disabled={isLoading}
                  colorVariant="primary"
                  size="small"
                  sx={{
                    m: 0,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                  }}
                />

                <AppText variant="body2" sx={agreeTextSx}>
                  I agree to the{" "}
                  <AppLink href="/terms" underline="none" sx={linkSx}>
                    Terms of Service
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

              {formErrors.submit && (
                <AppText variant="body2" sx={{ mt: 0.5, fontSize: "12px", fontWeight: 500, color: "var(--app-color-error)" }}>
                  {formErrors.submit}
                </AppText>
              )}

              <AppStack direction="column" gap={1.25} sx={{ mt: 1.6 }}>
                <AppButton
                  type="submit"
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  sx={submitButtonSx}
                >
                  Register & Get Started
                </AppButton>

                <AppStack direction="row" align="center" gap={1.5}>
                  <AppBox sx={dividerSx} />

                  <AppText variant="body2" weight={600} sx={orTextSx}>
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

                <AppText variant="body2" align="center" sx={loginTextSx}>
                  Already have an account?{" "}
                  <AppLink href={ROUTES.LOGIN} underline="none" sx={linkSx}>
                    Login
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
            sx={trustRowSx}
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

const brandTitleSx = {
  m: 0,
  fontSize: { xs: "24px", lg: "28px" },
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const heroTitleSx = {
  mt: 4.2,
  mb: 0,
  maxWidth: 430,
  fontSize: { xs: "26px", lg: "31px" },
  lineHeight: 1.22,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const heroSubtitleSx = {
  mt: 1.2,
  maxWidth: 420,
  fontSize: "13.5px",
  lineHeight: "22px",
  color: "var(--app-color-text-muted)",
};

const cardSx = {
  width: "100%",
  maxWidth: 760,
  ml: { lg: "auto" },
  px: { xs: 3, sm: 4, lg: 4.5 },
  py: { xs: 3, lg: 3.4 },
  bgcolor: "color-mix(in srgb, var(--app-color-surface) 88%, transparent)",
  backdropFilter: "blur(16px)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const formTitleSx = {
  m: 0,
  fontSize: { xs: "24px", lg: "28px" },
  color: "var(--app-color-text)",
};

const formSubtitleSx = {
  mt: 0.5,
  fontSize: "15px",
  color: "var(--app-color-text-muted)",
};

const errorBoxSx = {
  mt: 2,
  px: 2,
  py: 1.4,
  borderRadius: "8px",
  border: "1px solid var(--app-color-error)",
  bgcolor: "var(--app-color-error-soft)",
  color: "var(--app-color-error)",
  fontSize: "13px",
  fontWeight: 500,
};

const labelSx = {
  mb: 0.45,
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 44,
  fontSize: "13.5px",
  bgcolor: "var(--app-color-surface-alt)",
};

const agreeTextSx = {
  fontSize: "12.5px",
  lineHeight: "24px",
  color: "var(--app-color-text)",
};

const agreeErrorSx = {
  mt: 0.5,
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--app-color-error)",
};

const linkSx = {
  fontWeight: 700,
  color: "var(--app-color-primary)",
};

const submitButtonSx = {
  height: 46,
  fontSize: "14px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const dividerSx = {
  height: 1,
  flex: 1,
  bgcolor: "var(--app-color-border)",
};

const orTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const googleButtonSx = {
  height: 44,
  fontSize: "13.5px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface-alt)",
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
};

const loginTextSx = {
  mt: 0.1,
  fontSize: "13.5px",
  color: "var(--app-color-text-muted)",
};

const trustRowSx = {
  mt: 2,
  width: "100%",
  maxWidth: 760,
  ml: { lg: "auto" },
  flexWrap: "nowrap",
  height: 24,
};

const CompactInput = ({
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
  children,
  ...props
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
    size="medium"
    variant="bordered"
    rounded="md"
    startIcon={startIcon}
    prefix={prefix}
    error={error}
    helperText={helperText}
    inputProps={inputProps}
    labelSx={labelSx}
    inputSx={inputSx}
    {...props}
  >
    {children}
  </AppInput>
);

const CompactPassword = ({
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
    size="medium"
    variant="bordered"
    rounded="md"
    startIcon={<FiLock />}
    error={error}
    helperText={helperText}
    labelSx={labelSx}
    inputSx={inputSx}
  />
);

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
    sx={{
      gap: 0.7,
      px: { xs: 1, md: 1.8 },
      height: 24,
      whiteSpace: "nowrap",
    }}
  >
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        fontSize: "15px",
        lineHeight: 1,
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

export default RegisterDesktopPage;
