// src/features/access-control/pages/desktop/AssignAccessDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiGitBranch,
  FiInfo,
  FiKey,
  FiRefreshCcw,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiSliders,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppKeyValue,
  AppMultiSelect,
  AppSelect,
  AppStack,
  AppSwitch,
  AppTag,
  AppText,
} from "@/components";

const AssignAccessDesktopPage = ({
  formData,
  formErrors = {},

  memberOptions = [],
  companyOptions = [],
  branchOptions = [],
  selectedMember,
  accessSummary,

  isLoading = false,
  isLoadingMembers = false,
  isLoadingCompanies = false,
  isLoadingBranches = false,
  isSubmitting = false,
  error,
  message,

  handleChange,
  handleToggleChange,
  handleMultiSelectChange,
  handleSubmit,
  handleReset,
  handleRefresh,
  handleBack,
  handleBackToAccessControl,
  handleViewMembers,
  handleViewAccessList,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1380px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBack}
          onAccessControl={handleBackToAccessControl || handleBack}
          onRefresh={handleRefresh}
          onViewAccessList={handleViewAccessList}
        />

        {message ? (
          <AppAlert
            severity="success"
            variant="soft"
            title={message}
            rounded="md"
            sx={alertSx}
          />
        ) : null}

        {error && !formErrors.submit ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            rounded="md"
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_390px] gap-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={formCardSx}
          >
            <AppBox component="form" onSubmit={handleSubmit}>
              <AppStack direction="row" align="flex-start" gap={1.2}>
                <IconBox icon={<FiSliders />} large />

                <AppBox sx={{ minWidth: 0, flex: 1 }}>
                  <AppHeading level={2} weight={650} sx={sectionTitleSx}>
                    Assign Member Access
                  </AppHeading>

                  <AppText variant="body2" sx={sectionSubtitleSx}>
                    Configure company and branch visibility for an active
                    workspace member. Workspace owners already have full access
                    and cannot be restricted.
                  </AppText>
                </AppBox>
              </AppStack>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <AppSelect
                  label="Workspace Member"
                  name="memberUserId"
                  value={formData.memberUserId || ""}
                  onChange={handleChange}
                  options={memberOptions}
                  disabled={isSubmitting || isLoadingMembers}
                  loading={isLoadingMembers}
                  placeholder="Select active member"
                  fullWidth
                  required
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiUserCheck />}
                  error={Boolean(formErrors.memberUserId)}
                  helperText={
                    formErrors.memberUserId ||
                    "Only active non-owner members can be assigned restricted access."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                  renderOption={(option) => <MemberOption option={option} />}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <AccessToggleCard
                  icon={<FiBriefcase />}
                  title="Company Access"
                  description="Allow access to all companies or choose specific companies."
                  checked={formData.accessAllCompanies}
                  name="accessAllCompanies"
                  label="Access all companies"
                  disabled={isSubmitting}
                  onChange={handleToggleChange}
                />

                <AccessToggleCard
                  icon={<FiGitBranch />}
                  title="Branch Access"
                  description="Allow access to all branches or choose specific branches."
                  checked={formData.accessAllBranches}
                  name="accessAllBranches"
                  label="Access all branches"
                  disabled={isSubmitting}
                  onChange={handleToggleChange}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <AppMultiSelect
                  label="Companies"
                  name="companyIds"
                  value={formData.companyIds || []}
                  onChange={(value) =>
                    handleMultiSelectChange("companyIds", value)
                  }
                  options={companyOptions}
                  disabled={isSubmitting || formData.accessAllCompanies}
                  loading={isLoadingCompanies}
                  placeholder="Select companies"
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiBriefcase />}
                  showCheckbox
                  showChips
                  showSelectAll
                  clearable
                  onClear={() => handleMultiSelectChange("companyIds", [])}
                  error={Boolean(formErrors.companyIds)}
                  helperText={
                    formErrors.companyIds ||
                    (formData.accessAllCompanies
                      ? "Disabled because all company access is enabled."
                      : "Select one or more active companies.")
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <AppMultiSelect
                  label="Branches"
                  name="branchIds"
                  value={formData.branchIds || []}
                  onChange={(value) =>
                    handleMultiSelectChange("branchIds", value)
                  }
                  options={branchOptions}
                  disabled={isSubmitting || formData.accessAllBranches}
                  loading={isLoadingBranches}
                  placeholder="Select branches"
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiGitBranch />}
                  showCheckbox
                  showChips
                  showSelectAll
                  clearable
                  onClear={() => handleMultiSelectChange("branchIds", [])}
                  error={Boolean(formErrors.branchIds)}
                  helperText={
                    formErrors.branchIds ||
                    (formData.accessAllBranches
                      ? "Disabled because all branch access is enabled."
                      : "Select one or more active branches.")
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />
              </div>

              {formErrors.submit ? (
                <AppAlert
                  severity="error"
                  variant="soft"
                  rounded="md"
                  sx={submitAlertSx}
                >
                  {formErrors.submit}
                </AppAlert>
              ) : null}

              <AppStack
                direction="row"
                align="center"
                justify="space-between"
                gap={1.2}
                sx={actionsSx}
              >
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiRefreshCcw />}
                  onClick={handleReset}
                  disabled={isSubmitting}
                  sx={secondaryButtonSx}
                >
                  Reset
                </AppButton>

                <AppStack direction="row" align="center" gap={1}>
                  <AppButton
                    type="button"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    startIcon={<FiArrowLeft />}
                    onClick={handleBack}
                    disabled={isSubmitting}
                    sx={secondaryButtonSx}
                  >
                    Back
                  </AppButton>

                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiSave />}
                    loading={isSubmitting}
                    disabled={isSubmitting || isLoading}
                    sx={primaryButtonSx}
                  >
                    Assign Access
                  </AppButton>
                </AppStack>
              </AppStack>
            </AppBox>
          </AppCard>

          <AppStack direction="column" gap={1.5}>
            <SelectedMemberCard
              member={selectedMember}
              onViewMembers={handleViewMembers}
            />
            <AccessSummaryCard
              accessSummary={accessSummary}
              formData={formData}
            />
            <AccessInfoCard />
          </AppStack>
        </div>
      </div>
    </section>
  );
};

const PageHeader = ({
  isLoading,
  onBack,
  onAccessControl,
  onRefresh,
  onViewAccessList,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiKey />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Assign Access
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Access Control", onClick: onAccessControl },
            { label: "Member Access", onClick: onBack },
            { label: "Assign", current: true },
          ]}
          sx={breadcrumbSx}
          itemSx={breadcrumbItemSx}
          currentItemSx={breadcrumbCurrentSx}
        />
      </AppBox>
    </AppStack>

    <AppStack direction="row" align="center" gap={0.8}>
      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={onBack}
        disabled={isLoading}
        sx={secondaryButtonSx}
      >
        Member Access
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiRefreshCw />}
        onClick={onRefresh}
        loading={isLoading}
        disabled={isLoading}
        sx={secondaryButtonSx}
      >
        Refresh
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiShield />}
        onClick={onViewAccessList}
        disabled={isLoading}
        sx={primaryButtonSx}
      >
        View Access
      </AppButton>
    </AppStack>
  </AppStack>
);

const MemberOption = ({ option }) => (
  <AppStack direction="row" align="center" justify="space-between" gap={1}>
    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={optionTitleSx}>
        {option?.displayName || option?.label}
      </AppText>

      <AppText variant="body2" sx={optionSubtitleSx}>
        {option?.displayEmail || "-"} · {option?.displayRole || "Staff"}
      </AppText>
    </AppBox>

    {option?.isOwner ? (
      <AppTag
        label="Owner"
        variant="soft"
        colorVariant="warning"
        size="small"
        rounded="full"
      />
    ) : null}
  </AppStack>
);

const AccessToggleCard = ({
  icon,
  title,
  description,
  checked,
  name,
  label,
  disabled,
  onChange,
}) => (
  <AppCard
    variant="soft"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={toggleCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1}>
      <IconBox icon={icon} colorVariant={checked ? "success" : "warning"} />

      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppHeading level={3} weight={650} sx={toggleTitleSx}>
          {title}
        </AppHeading>

        <AppText variant="body2" sx={toggleDescriptionSx}>
          {description}
        </AppText>

        <AppSwitch
          name={name}
          label={label}
          checked={Boolean(checked)}
          onChange={onChange}
          disabled={disabled}
          colorVariant="primary"
          size="small"
          sx={switchSx}
          labelSx={switchLabelSx}
        />
      </AppBox>
    </AppStack>
  </AppCard>
);

const SelectedMemberCard = ({ member, onViewMembers }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiUserCheck />} colorVariant="primary" />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Selected Member
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Access will be assigned to this member.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue label="Name" value={member?.displayName || "Not selected"} />
      <AppKeyValue label="Email" value={member?.displayEmail || "-"} />
      <AppKeyValue label="Phone" value={member?.displayPhone || "-"} />
      <AppKeyValue label="Role" value={member?.displayRole || "-"} />
      <AppKeyValue label="Status" value={member?.status || "-"} />
    </div>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant="primary"
      rounded="md"
      fullWidth
      startIcon={<FiUsers />}
      onClick={onViewMembers}
      sx={sideButtonSx}
    >
      View Members
    </AppButton>
  </AppCard>
);

const AccessSummaryCard = ({ accessSummary, formData }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiCheckCircle />} colorVariant="success" />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Access Summary
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Review the final payload before saving.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue
        label="Companies"
        value={accessSummary?.companyAccessLabel || "-"}
      />
      <AppKeyValue
        label="Branches"
        value={accessSummary?.branchAccessLabel || "-"}
      />
    </div>

    {!formData.accessAllCompanies ? (
      <PreviewList
        title="Selected Companies"
        values={accessSummary?.selectedCompanies}
      />
    ) : null}

    {!formData.accessAllBranches ? (
      <PreviewList
        title="Selected Branches"
        values={accessSummary?.selectedBranches}
      />
    ) : null}
  </AppCard>
);

const PreviewList = ({ title, values = [] }) => (
  <div className="mt-3 rounded-xl border border-border bg-surface-alt px-3 py-2">
    <AppText variant="body2" sx={previewTitleSx}>
      {title}
    </AppText>

    <div className="mt-2 flex flex-wrap gap-1.5">
      {values.length ? (
        values
          .slice(0, 8)
          .map((value) => (
            <AppTag
              key={value}
              label={value}
              variant="soft"
              colorVariant="primary"
              size="small"
              rounded="full"
            />
          ))
      ) : (
        <AppText variant="body2" sx={previewEmptySx}>
          No records selected
        </AppText>
      )}

      {values.length > 8 ? (
        <AppTag
          label={`+${values.length - 8} more`}
          variant="soft"
          colorVariant="neutral"
          size="small"
          rounded="full"
        />
      ) : null}
    </div>
  </div>
);

const AccessInfoCard = () => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiInfo />} colorVariant="info" />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Assignment Rules
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Backend validation requires selected records when all access is
          disabled.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <RuleItem
        icon={<FiShield />}
        text="Only workspace owners can manage member access."
      />
      <RuleItem
        icon={<FiUsers />}
        text="Workspace owner access cannot be changed."
      />
      <RuleItem
        icon={<FiBriefcase />}
        text="Choose companies when company access is limited."
      />
      <RuleItem
        icon={<FiGitBranch />}
        text="Choose branches when branch access is limited."
      />
    </div>
  </AppCard>
);

const RuleItem = ({ icon, text }) => (
  <AppStack direction="row" align="flex-start" gap={0.8}>
    <span className="mt-[2px] text-[13px] text-primary">{icon}</span>

    <AppText variant="body2" sx={ruleTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 42 : 38,
      height: large ? 42 : 38,
      minWidth: large ? 42 : 38,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: large ? "22px" : "19px",
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.18,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = { mt: 0.4 };

const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const primaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 34,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const formCardSx = {
  px: 3,
  py: 2.6,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.45,
  maxWidth: 720,
  fontSize: "12px",
  lineHeight: 1.6,
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const inputSx = {
  minHeight: 37,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const helperTextSx = {
  fontSize: "10.8px",
  lineHeight: 1.45,
};

const toggleCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface-alt)",
  borderColor: "var(--app-color-border)",
};

const toggleTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const toggleDescriptionSx = {
  mt: 0.35,
  minHeight: 34,
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--app-color-text-muted)",
};

const switchSx = {
  mt: 1,
};

const switchLabelSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const submitAlertSx = {
  mt: 3,
};

const actionsSx = {
  mt: 4,
  pt: 2.2,
  borderTop: "1px solid var(--app-color-border)",
};

const sideCardSx = {
  px: 1.55,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "14px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const sideSubtitleSx = {
  mt: 0.3,
  fontSize: "11px",
  lineHeight: 1.45,
  color: "var(--app-color-text-muted)",
};

const sideButtonSx = {
  mt: 1.5,
  height: 34,
  fontSize: "12px",
  fontWeight: 700,
};

const optionTitleSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const optionSubtitleSx = {
  mt: 0.2,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const previewTitleSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const previewEmptySx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const ruleTextSx = {
  fontSize: "11.5px",
  lineHeight: 1.5,
  color: "var(--app-color-text-muted)",
};

export default AssignAccessDesktopPage;
