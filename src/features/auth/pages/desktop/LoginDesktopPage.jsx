import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";

import { ROUTES } from "@/constants";
import { UIButton, UIInput, UIAlert } from "@/components/ui";
import SocialButton from "../../components/SocialButton";
import DashboardPreview from "../../components/DashboardPreview";

const LoginDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  error,
  handleChange,
  handleSubmit,
}) => {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6 selection:bg-primary-soft selection:text-primary">
      {/* Background ambient glows using theme tokens */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary-soft blur-3xl opacity-60" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-info-soft blur-3xl opacity-60" />
      </div>

      {/* Main Outer Container: Multi-Device Responsive (max-w-[1140px], rounded-[16px]) */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(12px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto grid w-full max-w-[1140px] overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--app-shadow-lg)] lg:grid-cols-12"
      >
        {/* ── LEFT PANEL: Form (Responsive for Tablets & Desktops) ───── */}
        <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-7 xl:p-8 lg:col-span-6 xl:col-span-5">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-primary text-primary-contrast shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L2 7.5V16.5L12 22L22 16.5V7.5L12 2ZM13 7V11H17V13H13V17H11V13H7V11H11V7H13Z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </div>

          {/* Form Content: Centered constraint on tablets, full on desktop split */}
          <div className="my-auto mx-auto w-full max-w-[390px] py-2 lg:mx-0">
            <div>
              {/* Page Title: Exactly one <h1> per page */}
              <h1 className="text-[25px] font-extrabold tracking-tight text-text leading-tight">
                Log in to your account.
              </h1>
              {/* Secondary Body Text */}
              <p className="mt-1 text-sm text-text-muted leading-[1.5]">
                Enter your email address and password to log in.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <UIAlert
                type="error"
                variant="soft"
                icon={<ShieldCheck size={16} className="shrink-0 text-error" />}
                className="mt-3 p-2.5 rounded-[8px] text-xs font-medium"
              >
                {error}
              </UIAlert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-4">
              <div className="flex flex-col gap-3.5">
                {/* Email or Phone Input */}
                <UIInput
                  id="desktop-email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Email or 10-Digit Mobile"
                  autoComplete="username"
                  required
                  size="md"
                  variant="outline"
                  containerClassName="h-[42px] rounded-[10px]"
                  startIcon={<Mail size={16} />}
                  error={formErrors.email}
                />

                {/* Password Input */}
                <div>
                  <UIInput
                    id="desktop-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    showPasswordToggle={true}
                    size="md"
                    variant="outline"
                    containerClassName="h-[42px] rounded-[10px]"
                    startIcon={<Lock size={16} />}
                    error={formErrors.password}
                  />

                  {/* Forgot Password Link */}
                  <div className="mt-1.5 flex justify-end">
                    <Link
                      to={ROUTES.FORGOT_PASSWORD}
                      className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <UIButton
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  className="mt-1 h-[42px] rounded-[8px] text-sm font-bold shadow-[var(--app-shadow-sm)] hover:shadow-[var(--app-shadow-md)]"
                >
                  Login
                </UIButton>
              </div>
            </form>

            {/* Divider "or" */}
            <div className="relative my-3.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-surface px-3 text-xs text-text-muted">
                or
              </span>
            </div>

            {/* Social Logins & Sign Up Container */}
            <div className="flex flex-col gap-3.5">
              <SocialButton
                provider="google"
                label="Sign in with Google"
                disabled={isLoading}
                fullWidth
              />

              <p className="text-center text-sm text-text-muted leading-[1.5]">
                Don&apos;t you have an account?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-bold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom subtle copyright */}
          <div className="mt-2 text-xs text-text-muted/70 leading-[1.5]">
            © {new Date().getFullYear()} PharmaERP. All rights reserved.
          </div>
        </div>

        {/* ── RIGHT PANEL: Hero Card (Auto-hidden on Tablet single-col, visible on lg+) ── */}
        <div className="relative hidden p-3.5 lg:col-span-6 xl:col-span-7 lg:flex">
          <div
            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[14px] p-5 lg:p-6"
            style={{
              background:
                "linear-gradient(135deg, var(--app-color-primary, #00994a) 0%, var(--app-color-info-hover, #1d4ed8) 100%)",
            }}
          >
            {/* Ambient geometric background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.14),transparent_45%)]" />

            {/* Dashboard UI Preview Component */}
            <DashboardPreview />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginDesktopPage;
