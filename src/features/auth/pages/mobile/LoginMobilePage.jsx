import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";

import { ROUTES } from "@/constants";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import AuthPasswordInput from "../../components/AuthPasswordInput";
import SocialButton from "../../components/SocialButton";
import PharmacyIllustration from "../../components/PharmacyIllustration";

const LoginMobilePage = ({
  formData,
  formErrors,
  isLoading,
  error,
  handleChange,
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
        {/* ── TOP ILLUSTRATION ─────────────────────────────────────────── */}
        <div className="flex justify-center pb-2">
          <PharmacyIllustration className="flex justify-center" />
        </div>

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="text-center mt-2">
          {/* Mobile Title: Exactly one <h1> per screen, 22px font-extrabold per DESIGN_STANDARDS §1.3 */}
          <h1 className="text-[22px] font-extrabold tracking-tight text-text leading-[1.2]">
            Sign In
          </h1>
          {/* Mobile Secondary Body: 13px per DESIGN_STANDARDS §1.3 */}
          <p className="mt-1 text-[13px] text-text-muted leading-[1.55]">
            Enter valid email & password to continue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mt-3 flex items-start gap-2 rounded-[8px] border border-error/30 bg-error-soft px-3.5 py-2.5"
            role="alert"
          >
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-error" />
            <p className="text-xs font-medium text-error leading-[1.4]">{error}</p>
          </div>
        )}

        {/* ── FORM: gap-3 per DESIGN_STANDARDS §2.2 ─────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <div className="flex flex-col gap-3">
            {/* Email or Phone Field */}
            <AuthInput
              id="mobile-email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Email or 10-Digit Mobile"
              autoComplete="username"
              required
              icon={<Mail size={16} />}
              error={formErrors.email}
            />

            {/* Password Field */}
            <div>
              <AuthPasswordInput
                id="mobile-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Password"
                autoComplete="current-password"
                required
                icon={<Lock size={16} />}
                error={formErrors.password}
              />

              {/* Forgot Password Link */}
              <div className="mt-1.5 flex justify-end">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
                >
                  Forget password
                </Link>
              </div>
            </div>

            {/* Primary Login Button */}
            <AuthButton
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              className="mt-1.5"
            >
              {isLoading ? "Signing in..." : "Login"}
            </AuthButton>
          </div>
        </form>

        {/* ── DIVIDER: Or Continue with ─────────────────────────────────── */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-3 text-xs font-medium text-text-muted">
            Or Continue with
          </span>
        </div>

        {/* ── LONG GOOGLE SSO BUTTON & SIGN UP CONTAINER ────────────────── */}
        <div className="flex flex-col gap-5">
          <SocialButton
            provider="google"
            label="Sign in with Google"
            disabled={isLoading}
            fullWidth
          />

          <p className="text-center text-[13px] text-text-muted leading-[1.55]">
            Haven&apos;t any account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="font-bold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginMobilePage;
