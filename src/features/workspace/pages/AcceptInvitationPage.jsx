// src/features/workspace/pages/AcceptInvitationPage.jsx

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiShield,
  FiShoppingBag,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

import { ROUTES, API_STATUS } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "../hooks/useWorkspace";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppInput,
  AppStack,
  AppText,
  AppHeading,
} from "@/components";

const AcceptInvitationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, user, setCredentials } = useAuth();
  const {
    getPublicInvitationDetails,
    acceptWorkspaceInvitation,
    acceptWorkspaceInvitationSignup,
    getPublicInvitationDetailsStatus,
    acceptWorkspaceInvitationStatus,
    acceptWorkspaceInvitationSignupStatus,
    publicInvitationDetails,
  } = useWorkspace();

  const [signupForm, setSignupForm] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);

  const isLoadingDetails =
    getPublicInvitationDetailsStatus === API_STATUS.LOADING;
  const isAcceptingAuth =
    acceptWorkspaceInvitationStatus === API_STATUS.LOADING;
  const isAcceptingSignup =
    acceptWorkspaceInvitationSignupStatus === API_STATUS.LOADING;
  const isSubmitting = isAcceptingAuth || isAcceptingSignup;

  useEffect(() => {
    if (!token) return;

    getPublicInvitationDetails(token).catch((err) => {
      setFetchError(err || "Invitation not found or has expired.");
    });
  }, [token, getPublicInvitationDetails]);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcceptLoggedIn = useCallback(async () => {
    try {
      setFormErrors({});
      await acceptWorkspaceInvitation(token);
      navigate(ROUTES.WORKSPACE, { replace: true });
    } catch (err) {
      setFormErrors({
        submit: err || "Failed to accept workspace invitation.",
      });
    }
  }, [acceptWorkspaceInvitation, token, navigate]);

  const handleSignupAndAccept = useCallback(
    async (e) => {
      e.preventDefault();
      const errors = {};

      if (!signupForm.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!signupForm.password) {
        errors.password = "Password is required";
      } else if (signupForm.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      try {
        setFormErrors({});
        const res = await acceptWorkspaceInvitationSignup(token, {
          fullName: signupForm.fullName.trim(),
          password: signupForm.password,
          phone: signupForm.phone.trim() || undefined,
        });

        if (res?.user && res?.token) {
          setCredentials({ user: res.user, token: res.token });
        }

        navigate(ROUTES.WORKSPACE, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: err || "Failed to create account and join workspace.",
        });
      }
    },
    [
      signupForm,
      token,
      acceptWorkspaceInvitationSignup,
      setCredentials,
      navigate,
    ],
  );

  if (isLoadingDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-text-muted">
            Verifying invitation token...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError || !publicInvitationDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          className="w-full max-w-md p-6 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <FiAlertCircle className="text-2xl" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-text">
            Invitation Expired or Invalid
          </h2>
          <p className="mt-2 text-xs text-text-muted leading-relaxed">
            {fetchError ||
              "This invitation link has expired, been revoked, or already accepted."}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to={ROUTES.LOGIN}>
              <AppButton variant="outlined" colorVariant="neutral" size="small">
                Go to Login
              </AppButton>
            </Link>
            <Link to={ROUTES.HOME}>
              <AppButton variant="contained" colorVariant="primary" size="small">
                Back to Home
              </AppButton>
            </Link>
          </div>
        </AppCard>
      </div>
    );
  }

  const {
    workspaceName,
    workspaceCode,
    invitedEmail,
    invitedByName,
    roleName,
    branchAccess = [],
    accessAllBranches,
    accessAllCompanies,
    expiresAt,
  } = publicInvitationDetails;

  const isEmailMatching =
    isAuthenticated &&
    user?.email?.toLowerCase() === invitedEmail?.toLowerCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-[560px]">
        {/* Workspace Brand Badge */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Pharmacy Workspace Invitation
          </span>
          <h1 className="mt-2 text-2xl font-bold text-text tracking-tight">
            You're Invited to Join {workspaceName}
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Invited by <strong className="text-text">{invitedByName}</strong> for{" "}
            <strong className="text-text">{invitedEmail}</strong>
          </p>
        </div>

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          className="p-5"
        >
          {/* Assigned Scope & Roles Overview */}
          <div className="rounded-lg border border-border/80 bg-surface-alt/40 p-3.5 mb-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Assigned Workspace Role
                </span>
                <span className="text-sm font-bold text-primary flex items-center gap-1.5 mt-0.5">
                  <FiShield className="text-xs" />
                  {roleName || "Staff"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Workspace Code
                </span>
                <span className="text-xs font-mono font-semibold text-text mt-0.5 block">
                  {workspaceCode || "-"}
                </span>
              </div>
            </div>

            {/* Store Facilities footprint */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-text block mb-1.5">
                Assigned Store Facilities (PBAC):
              </span>

              {accessAllBranches ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                  <FiCheckCircle className="text-sm" />
                  <span>Full access to all pharmacy stores and branches</span>
                </div>
              ) : branchAccess.length === 0 ? (
                <p className="text-xs text-text-muted italic">
                  Workspace-level access only (No dedicated branches)
                </p>
              ) : (
                <div className="space-y-1.5 mt-2">
                  {branchAccess.map((ba, idx) => (
                    <div
                      key={ba.branchId?._id || idx}
                      className="p-2 rounded-md border border-border/60 bg-surface flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-primary text-xs" />
                        <div>
                          <span className="font-semibold text-text">
                            {ba.branchId?.name || "Pharmacy Branch"}
                          </span>
                          <span className="text-[10px] text-text-muted block font-mono">
                            {ba.branchId?.branchCode || "STORE"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] rounded bg-primary/10 text-primary font-medium">
                          {ba.roleId?.name || roleName || "Staff"}
                        </span>
                        {ba.canOperateMarketplaceStore && (
                          <span
                            title="Marketplace Operator"
                            className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-500 font-semibold flex items-center gap-1"
                          >
                            <FiShoppingBag className="text-[10px]" />
                            <span>Operator</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {formErrors.submit && (
            <AppAlert
              severity="error"
              variant="soft"
              rounded="md"
              className="mb-4"
            >
              {formErrors.submit}
            </AppAlert>
          )}

          {/* Conditional Action: Authenticated vs Unauthenticated */}
          {isAuthenticated ? (
            <div>
              {!isEmailMatching && (
                <AppAlert
                  severity="warning"
                  variant="soft"
                  rounded="md"
                  className="mb-4"
                >
                  You are logged in as <strong>{user?.email}</strong>. This
                  invitation was originally addressed to{" "}
                  <strong>{invitedEmail}</strong>. You can proceed to link it to
                  your current active session.
                </AppAlert>
              )}

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                fullWidth
                size="large"
                loading={isSubmitting}
                onClick={handleAcceptLoggedIn}
                startIcon={<FiCheckCircle />}
              >
                Accept Invitation & Enter Workspace
              </AppButton>
            </div>
          ) : (
            <div>
              <div className="mb-4 pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-text">
                  Complete Your Profile to Join
                </h3>
                <p className="text-xs text-text-muted">
                  Create your login password to activate your access.
                </p>
              </div>

              <form onSubmit={handleSignupAndAccept} className="space-y-3">
                <AppInput
                  label="Email Address"
                  value={invitedEmail}
                  disabled
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiMail />}
                  helperText="Pre-verified invitation email address"
                />

                <AppInput
                  label="Full Name"
                  name="fullName"
                  value={signupForm.fullName}
                  onChange={handleSignupChange}
                  placeholder="e.g. Dr. John Doe"
                  fullWidth
                  required
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiUser />}
                  error={Boolean(formErrors.fullName)}
                  helperText={formErrors.fullName}
                />

                <div className="grid grid-cols-2 gap-2.5">
                  <AppInput
                    label="Create Password"
                    name="password"
                    type="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                    fullWidth
                    required
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiLock />}
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password || "Min 6 characters"}
                  />

                  <AppInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                    fullWidth
                    required
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiLock />}
                    error={Boolean(formErrors.confirmPassword)}
                    helperText={formErrors.confirmPassword}
                  />
                </div>

                <AppInput
                  label="Phone Number (Optional)"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  placeholder="9876543210"
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiPhone />}
                />

                <div className="pt-2">
                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    fullWidth
                    size="large"
                    loading={isSubmitting}
                    endIcon={<FiArrowRight />}
                  >
                    Create Account & Join Workspace
                  </AppButton>
                </div>

                <p className="text-center text-xs text-text-muted pt-1">
                  Already have an account with this email?{" "}
                  <Link
                    to={`${ROUTES.LOGIN}?redirect=/workspace-invitations/${token}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign In First
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* Expiry Timestamp */}
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <FiClock className="text-xs" />
              Expires in 72 hours
            </span>
            <span>
              {expiresAt
                ? new Date(expiresAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </AppCard>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
