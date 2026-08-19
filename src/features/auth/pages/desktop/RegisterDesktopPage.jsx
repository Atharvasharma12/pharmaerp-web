import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ShieldCheck, Check } from "lucide-react";

import { ROUTES } from "@/constants";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthPasswordInput from "../../components/AuthPasswordInput";
import SocialButton from "../../components/SocialButton";
import DashboardPreview from "../../components/DashboardPreview";

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
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 selection:bg-primary-soft selection:text-primary">
      {/* Background ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary-soft blur-3xl opacity-60" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-blue-500/10 blur-3xl opacity-60" />
      </div>

      {/* Main Outer Container: Multi-Device Responsive (max-w-[1200px], rounded-[16px], my-auto for short screen scrolling) */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(12px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto grid w-full max-w-[1200px] overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--app-shadow-lg)] lg:grid-cols-12"
      >
        {/* ── LEFT PANEL: Form (Responsive for Tablets & Desktops) ───── */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-8 xl:p-10 lg:col-span-6 xl:col-span-5">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-slate-900 text-white shadow-xs dark:bg-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L2 7.5V16.5L12 22L22 16.5V7.5L12 2ZM13 7V11H17V13H13V17H11V13H7V11H11V7H13Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </div>

          {/* Form Content: Centered constraint on tablets, full on desktop split */}
          <div className="my-auto mx-auto w-full max-w-[420px] py-4 lg:mx-0">
            <div>
              {/* Page Title: Exactly one <h1> per page, 28px font-extrabold per DESIGN_STANDARDS §1.2 */}
              <h1 className="text-[28px] font-extrabold tracking-tight text-text leading-tight">
                Create an Account
              </h1>
              {/* Secondary Body Text: 14px leading-[1.6] per DESIGN_STANDARDS §1.2 */}
              <p className="mt-1.5 text-sm text-text-muted leading-[1.6]">
                Join now to streamline your pharmacy operations from day one.
              </p>
            </div>

            {/* Error Banner */}
            {(error || formErrors.submit) && (
              <div
                className="mt-4 flex items-start gap-2.5 rounded-[8px] border border-error/30 bg-error-soft px-4 py-2.5"
                role="alert"
              >
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-error" />
                <p className="text-xs font-medium text-error leading-[1.4]">
                  {error || formErrors.submit}
                </p>
              </div>
            )}

            {/* Registration Form: gap-3.5 per DESIGN_STANDARDS §2.2 */}
            <form onSubmit={handleSubmit} noValidate className="mt-5">
              <div className="flex flex-col gap-3.5">
                {/* Full Name Input */}
                <AuthInput
                  id="desktop-name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Full Name"
                  autoComplete="name"
                  required
                  icon={<User size={16} />}
                  error={formErrors.fullName}
                />

                {/* Email Address Input */}
                <AuthInput
                  id="desktop-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Email Address"
                  autoComplete="email"
                  required
                  icon={<Mail size={16} />}
                  error={formErrors.email}
                />

                {/* Optional Phone Input */}
                <AuthInput
                  id="desktop-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="10-Digit Mobile (Optional)"
                  autoComplete="tel"
                  icon={<Phone size={16} />}
                  error={formErrors.phone}
                  maxLength={10}
                />

                {/* Password Input */}
                <AuthPasswordInput
                  id="desktop-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  icon={<Lock size={16} />}
                  error={formErrors.password}
                />

                {/* Confirm Password Input */}
                <AuthPasswordInput
                  id="desktop-confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  required
                  icon={<Lock size={16} />}
                  error={formErrors.confirmPassword}
                />

                {/* Terms of Service & Privacy Policy Checkbox */}
                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={handleAgreeChange}
                        disabled={isLoading}
                        className="peer sr-only"
                      />
                      <div className="size-4 rounded-[4px] border border-border bg-surface transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 flex items-center justify-center text-white">
                        {agree && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted leading-[1.4]">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="font-semibold text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="font-semibold text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {formErrors.agree && (
                    <p className="mt-1 text-xs font-medium text-error leading-[1.4]">
                      {formErrors.agree}
                    </p>
                  )}
                </div>

                {/* Register CTA Button */}
                <AuthButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  className="mt-1.5"
                >
                  {isLoading ? "Creating Account..." : "Register"}
                </AuthButton>
              </div>
            </form>

            {/* Divider "Or Register With" */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-surface px-3 text-xs text-text-muted">
                Or Register With
              </span>
            </div>

            {/* Social Google Button & Sign In Link with uncollapsible gap-5 */}
            <div className="flex flex-col gap-5">
              <SocialButton
                provider="google"
                label="Sign in with Google"
                disabled={isLoading}
                fullWidth
              />

              <p className="text-center text-sm text-text-muted leading-[1.6]">
                Already Have An Account?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-bold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
                >
                  Sign In.
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom subtle footer */}
          <div className="flex items-center justify-between text-xs text-text-muted/70 leading-[1.5]">
            <span>© {new Date().getFullYear()} PharmaERP Enterprises Ltd.</span>
            <Link to="/privacy" className="hover:text-text hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL: Hero Card (Auto-hidden on Tablet single-col, visible on lg+) ── */}
        <div className="relative hidden p-4 lg:col-span-6 xl:col-span-7 lg:flex">
          <div
            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[14px] p-6 lg:p-8"
            style={{
              background:
                "linear-gradient(135deg, var(--app-color-primary, #00994a) 0%, #1e40af 100%)",
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

export default RegisterDesktopPage;
