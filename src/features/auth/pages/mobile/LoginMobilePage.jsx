import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";

import { ROUTES } from "@/constants";
import { UIButton, UIInput, UIAlert } from "@/components/ui";
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
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-bg px-3.5 sm:px-4 pt-3 pb-8 sm:pb-12 selection:bg-primary-soft selection:text-primary">
      {/* Background ambient decorative glows using theme tokens */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/6 -left-16 size-56 rounded-full bg-primary-soft blur-3xl opacity-60" />
        <div className="absolute bottom-1/6 -right-16 size-56 rounded-full bg-info-soft blur-3xl opacity-60" />
      </div>

      {/* Mobile Card Container */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto w-full max-w-[390px] overflow-hidden rounded-[16px] border border-border bg-surface p-4 sm:p-5 shadow-[var(--app-shadow-lg)]"
      >
        {/* ── TOP ILLUSTRATION ─────────────────────────────────────────── */}
        <div className="flex justify-center pb-1">
          <PharmacyIllustration className="flex justify-center max-w-[150px]" />
        </div>

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="text-center mt-1">
          {/* Mobile Title: Exactly one <h1> per screen */}
          <h1 className="text-[20px] font-extrabold tracking-tight text-text leading-[1.2]">
            Sign In
          </h1>
          {/* Mobile Secondary Body */}
          <p className="mt-0.5 text-xs text-text-muted leading-[1.5]">
            Enter valid email & password to continue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <UIAlert
            type="error"
            variant="soft"
            icon={<ShieldCheck size={15} className="shrink-0 text-error" />}
            className="mt-2.5 p-2 rounded-[8px] text-xs font-medium"
          >
            {error}
          </UIAlert>
        )}

        {/* ── FORM ──────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="mt-3.5">
          <div className="flex flex-col gap-2.5">
            {/* Email or Phone Field */}
            <UIInput
              id="mobile-email"
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
              containerClassName="h-[40px] rounded-[10px]"
              startIcon={<Mail size={15} />}
              error={formErrors.email}
            />

            {/* Password Field */}
            <div>
              <UIInput
                id="mobile-password"
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
                containerClassName="h-[40px] rounded-[10px]"
                startIcon={<Lock size={15} />}
                error={formErrors.password}
              />

              {/* Forgot Password Link */}
              <div className="mt-1 flex justify-end">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-[4px]"
                >
                  Forget password?
                </Link>
              </div>
            </div>

            {/* Primary Login Button */}
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

        {/* ── DIVIDER: Or Continue with ─────────────────────────────────── */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-2.5 text-xs font-medium text-text-muted">
            Or Continue with
          </span>
        </div>

        {/* ── LONG GOOGLE SSO BUTTON & SIGN UP CONTAINER ────────────────── */}
        <div className="flex flex-col gap-3">
          <SocialButton
            provider="google"
            label="Sign in with Google"
            disabled={isLoading}
            fullWidth
          />

          <p className="text-center text-xs text-text-muted leading-[1.5]">
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
