// src/features/access-control/pages/mobile/AssignRoleMobilePage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiInfo,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiSliders,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const AssignRoleMobilePage = memo(
  ({
    formData,
    formErrors = {},
    memberOptions = [],
    roleOptions = [],
    selectedMember,
    assignmentSummary,
    isLoading = false,
    isSubmitting = false,
    error,
    handleChange,
    handleSubmit,
    handleReset,
    handleRefresh,
    handleBack,
  }) => {
    return (
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Top Strategic Overview Cards */}
          <AppBox sx={headerBlockSx}>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              Assign Access Role
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              Connect a team operator with a functional protection blueprint to
              adjust global authorizations.
            </AppText>
          </AppBox>

          {/* High-Density Summary Badges Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <SummaryBadge
              icon={<FiUserCheck />}
              title="Operator"
              value={selectedMember?.displayName || "Not selected"}
              subtitle={
                selectedMember?.displayEmail || "Awaiting target choice"
              }
              colorVariant="success"
            />
            <SummaryBadge
              icon={<FiShield />}
              title="Designation"
              value={assignmentSummary?.targetRole || "None Selected"}
              subtitle={`Current: ${assignmentSummary?.currentRole || "Staff"}`}
              colorVariant={selectedMember ? "primary" : "warning"}
            />
          </div>

          {/* Section 2: Central High-Density Form Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardContainerSx}
          >
            {(error || formErrors.submit) && (
              <AppText variant="body2" sx={submitErrorTextSx}>
                {formErrors.submit || error}
              </AppText>
            )}

            <AppStack direction="column" gap={1.4}>
              <AppSelect
                label="Workspace Member Target"
                name="memberUserId"
                value={formData.memberUserId || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "memberUserId", value: e.target.value },
                  })
                }
                options={memberOptions}
                disabled={isSubmitting || isLoading}
                placeholder="Choose active employee..."
                required
                error={Boolean(formErrors.memberUserId)}
                helperText={formErrors.memberUserId}
                labelSx={mobileLabelSx}
                inputSx={mobileInputSx}
              />

              <AppSelect
                label="Security Designation Blueprint"
                name="roleId"
                value={formData.roleId || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "roleId", value: e.target.value },
                  })
                }
                options={roleOptions}
                disabled={isSubmitting || isLoading}
                placeholder="Choose target strategy..."
                required
                error={Boolean(formErrors.roleId)}
                helperText={formErrors.roleId}
                labelSx={mobileLabelSx}
                inputSx={mobileInputSx}
              />
            </AppStack>
          </AppCard>

          {/* Section 3: Operational Constraints Advice Card Block */}
          <AppCard
            variant="soft"
            rounded="lg"
            bordered={false}
            shadow="none"
            padding="none"
            sx={securityFooterBannerSx}
          >
            <AppStack direction="row" align="flex-start" gap={1}>
              <FiInfo className="text-[15px] text-primary mt-0.5 shrink-0" />
              <AppBox sx={{ minWidth: 0 }}>
                <AppText
                  variant="body2"
                  weight={750}
                  sx={securityBannerTitleSx}
                >
                  RBAC Synchronization Rules
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  Reassigned users must re-authenticate or clear active sessions
                  to refresh structural context access vectors.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 4: Form Bottom Sticky Action Bars */}
          <AppBox sx={bottomStickyActionBarSx}>
            <AppStack direction="row" align="center" gap={1} fullWidth>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiRefreshCw />}
                onClick={handleRefresh}
                disabled={isSubmitting || isLoading}
                sx={actionButtonResetSx}
              >
                Sync
              </AppButton>

              <AppButton
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={actionButtonCancelSx}
              >
                Cancel
              </AppButton>

              <AppButton
                variant="contained"
                colorVariant="success"
                rounded="md"
                startIcon={<FiSave />}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || isLoading}
                sx={actionButtonSubmitSx}
              >
                Assign
              </AppButton>
            </AppStack>
          </AppBox>
        </AppBox>
      </section>
    );
  },
);

AssignRoleMobilePage.displayName = "AssignRoleMobilePage";

/* ==========================================================================
   PRESENTATIONAL HOUSING COMPONENT PIECES
   ========================================================================== */

const SummaryBadge = ({ icon, title, value, subtitle, colorVariant }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={summaryBadgeSx}
  >
    <AppStack direction="row" align="center" gap={0.65} fullWidth>
      <AppBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 26,
          height: 25,
          borderRadius: "6px",
          bgcolor: `var(--app-color-${colorVariant}-soft)`,
          color: `var(--app-color-${colorVariant})`,
          fontSize: "13px",
        }}
      >
        {icon}
      </AppBox>
      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <span className="block text-[10px] font-bold text-text-muted uppercase leading-none">
          {title}
        </span>
        <span className="block text-[11.5px] font-extrabold text-text truncate mt-0.5 leading-tight">
          {value}
        </span>
        <span className="block text-[9.5px] text-text-muted truncate mt-0.2">
          {subtitle}
        </span>
      </AppBox>
    </AppStack>
  </AppCard>
);

/* ==========================================================================
   STYLE TOKEN DICTIONARY DEFINITIONS (HIGH-DENSITY COMPACT BLUEPRINT)
   ========================================================================== */

const containerSx = {
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerBlockSx = {
  pt: 1.2,
  pb: 0.2,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const summaryBadgeSx = {
  p: 0.8,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  flex: 1,
  minWidth: 0,
};

const submitErrorTextSx = {
  mb: 1.2,
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-error)",
};

const formCardContainerSx = {
  mt: 1.4,
  p: 1.4,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

const formCardSectionHeaderSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const formCardSectionDescSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const mobileLabelSx = {
  mb: 0.45,
  fontSize: "11.8px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const mobileInputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
  "& input::placeholder": {
    fontSize: "12px",
  },
};

const securityFooterBannerSx = {
  mt: 1.5,
  p: 1,
  bgcolor: "var(--app-color-readonly-bg, #f8fafc)",
  border: "1px dashed var(--app-color-border)",
};

const securityBannerTitleSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const securityBannerDescSx = {
  mt: 0.15,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.3,
};

const bottomStickyActionBarSx = {
  mt: 2.2,
  mb: 1.5,
  width: "100%",
};

const actionButtonResetSx = {
  height: 40,
  width: 68,
  fontSize: "11.5px",
  fontWeight: 700,
  borderColor: "var(--app-color-border)",
  px: 0.5,
  "& svg": {
    mr: 0.2,
    fontSize: "11px",
  },
};

const actionButtonCancelSx = {
  height: 40,
  flex: 0.3,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonSubmitSx = {
  height: 40,
  flex: 0.7,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

export default AssignRoleMobilePage;
