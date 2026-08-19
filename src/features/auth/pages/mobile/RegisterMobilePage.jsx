import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, Check } from "lucide-react";

import { ROUTES } from "@/constants";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthPasswordInput from "../../components/AuthPasswordInput";
import SocialButton from "../../components/SocialButton";
import RegisterIllustration from "../../components/RegisterIllustration";

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
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-bg px-3.5 sm:px-4 pt-4 pb-16 sm:pb-20 selection:bg-primary-soft selection:text-primary">
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/6 -left-16 size-56 rounded-full bg-primary-soft blur-3xl opacity-60" />
        <div className="absolute bottom-1/6 -right-16 size-56 rounded-full bg-blue-500/10 blur-3xl opacity-60" />
      </div>

      {/* Mobile Card Container per DESIGN_STANDARDS §4 (rounded-[18px]) & §2.2 */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto w-full max-w-[390px] overflow-hidden rounded-[18px] border border-border bg-surface p-5 sm:p-6 shadow-[var(--app-shadow-lg)]"
      >
        {/* ── TOP ILLUSTRATION MATCHING REFERENCE IMAGE 2 ─────────────── */}
        <div className="flex justify-center pb-1">
          <RegisterIllustration className="flex justify-center" />
        </div>

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="text-center mt-1">
          {/* Mobile Title: Exactly one <h1> per screen, 22px font-extrabold per DESIGN_STANDARDS §1.3 */}
          <h1 className="text-[22px] font-extrabold tracking-tight text-text leading-[1.2]">
            Sign Up
          </h1>
          {/* Mobile Secondary Body: 13px per DESIGN_STANDARDS §1.3 */}
          <p className="mt-1 text-[13px] text-text-muted leading-[1.55]">
            Use proper information to continue
          </p>
        </div>

        {/* Error message banner */}
        {(error || formErrors.submit) && (
          <div
            className="mt-3 flex items-start gap-2 rounded-[8px] border border-error/30 bg-error-soft px-3.5 py-2.5"
            role="alert"
          >
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-error" />
            <p className="text-xs font-medium text-error leading-[1.4]">
              {error || formErrors.submit}
            </p>
          </div>
        )}

        {/* ── FORM: gap-3 per DESIGN_STANDARDS §2.2 ─────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="flex flex-col gap-3">
            {/* Full Name Field */}
            <AuthInput
              id="mobile-name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Full name"
              autoComplete="name"
              required
              icon={<User size={16} />}
              error={formErrors.fullName}
            />

            {/* Email Address Field */}
            <AuthInput
              id="mobile-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Email address"
              autoComplete="email"
              required
              icon={<Mail size={16} />}
              error={formErrors.email}
            />

            {/* Password Field */}
            <AuthPasswordInput
              id="mobile-password"
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

            {/* Confirm Password Field */}
            <AuthPasswordInput
              id="mobile-confirm-password"
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

            {/* Terms & Conditions Notice per Reference Image 2 */}
            <div className="mt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <div className="relative mt-0.5 flex items-center justify-center shrink-0">
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
                <span className="text-[11.5px] text-text-muted leading-[1.45]">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="font-bold text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-bold text-primary hover:underline">
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

            {/* Primary Create Account Button */}
            <AuthButton
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              className="mt-1.5"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </AuthButton>
          </div>
        </form>

        {/* ── DIVIDER: Or Continue with ─────────────────────────────────── */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-3 text-xs font-medium text-text-muted">
            Or Continue with
          </span>
        </div>

        {/* ── GOOGLE SSO BUTTON & SIGN IN CONTAINER ────────────────────── */}
        <div className="flex flex-col gap-4">
          <SocialButton
            provider="google"
            label="Sign in with Google"
            disabled={isLoading}
            fullWidth
          />

          <p className="text-center text-[13px] text-text-muted leading-[1.55]">
            Already have an Account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default RegisterMobilePage;
