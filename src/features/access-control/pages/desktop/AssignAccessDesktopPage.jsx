// src/features/access-control/pages/desktop/AssignAccessDesktopPage.jsx

import {
  FiArrowLeft,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiGitBranch,
  FiHeadphones,
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
  PageHeader,
  PageRightSidebar,
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
  clearMessage,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Assign Access"
          subtitle="Configure company and branch access for a workspace member."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                {
                  label: "Access Control",
                  onClick: handleBackToAccessControl || handleBack,
                },
                { label: "Member Access", onClick: handleBack },
                { label: "Assign Access", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={1.1}
              sx={{ flexShrink: 0 }}
            >
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleBack}
                disabled={isSubmitting}
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
                onClick={handleRefresh}
                loading={isLoading}
                disabled={isLoading || isSubmitting}
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
                onClick={handleViewAccessList}
                disabled={isSubmitting}
                sx={primaryButtonSx}
              >
                View Access
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

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

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_290px] items-start gap-5">
          <main className="min-w-0 space-y-5">
            <HeroSummary
              selectedMember={selectedMember}
              accessSummary={accessSummary}
              companyOptions={companyOptions}
              branchOptions={branchOptions}
              formData={formData}
            />

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={formCardSx}
            >
              <AppBox component="form" onSubmit={handleSubmit}>
                <SectionHeader
                  icon={<FiSliders />}
                  title="Assign Member Access"
                  subtitle="Choose an active non-owner member, then decide whether they can access all companies and branches or only selected records."
                />

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

                <div className="mt-4 grid grid-cols-2 gap-4">
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

                <div className="mt-4 grid grid-cols-2 gap-4">
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
                    sx={secondaryLargeButtonSx}
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
                      sx={secondaryLargeButtonSx}
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
                      sx={primaryLargeButtonSx}
                    >
                      Assign Access
                    </AppButton>
                  </AppStack>
                </AppStack>
              </AppBox>
            </AppCard>
          </main>

          <AssignAccessRightSidebar
            selectedMember={selectedMember}
            accessSummary={accessSummary}
            formData={formData}
            onViewMembers={handleViewMembers}
          />
        </div>
      </div>
    </section>
  );
};

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
    <AppAlert
      severity="success"
      variant="filled"
      title={message}
      closable
      onClose={onClose}
      sx={toastSx}
    />
  </div>
);

const HeroSummary = ({
  selectedMember,
  accessSummary,
  companyOptions = [],
  branchOptions = [],
  formData,
}) => {
  const items = [
    {
      id: "member",
      title: "Selected Member",
      value: selectedMember?.displayName || "Not selected",
      subtitle: selectedMember?.displayRole || "Choose workspace member",
      icon: <FiUserCheck />,
      colorVariant: "success",
    },
    {
      id: "companies",
      title: "Company Access",
      value: accessSummary?.companyAccessLabel || "All companies",
      subtitle: `${companyOptions.length || 4} active companies available`,
      icon: <FiBriefcase />,
      colorVariant: "info",
    },
    {
      id: "branches",
      title: "Branch Access",
      value: accessSummary?.branchAccessLabel || "All branches",
      subtitle: `${branchOptions.length || 5} active branches available`,
      icon: <FiGitBranch />,
      colorVariant: "purple",
    },
    {
      id: "mode",
      title: "Access Mode",
      value:
        formData.accessAllCompanies && formData.accessAllBranches
          ? "Full Access"
          : "Restricted",
      subtitle: "Review before assigning",
      icon: <FiShield />,
      colorVariant:
        formData.accessAllCompanies && formData.accessAllBranches
          ? "success"
          : "warning",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <AppCard
          key={item.id}
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={summaryCardSx}
        >
          <AppStack direction="row" align="flex-start" gap={1.1}>
            <IconBox icon={item.icon} colorVariant={item.colorVariant} />

            <AppBox sx={{ minWidth: 0 }}>
              <AppText variant="body2" sx={summaryTitleSx}>
                {item.title}
              </AppText>

              <AppHeading level={3} weight={750} sx={summaryValueSx}>
                {item.value}
              </AppHeading>

              <AppText variant="body2" sx={summarySubtitleSx}>
                {item.subtitle}
              </AppText>
            </AppBox>
          </AppStack>
        </AppCard>
      ))}
    </div>
  );
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <AppStack direction="row" align="flex-start" gap={1.2}>
    <IconBox icon={icon} colorVariant="success" large />

    <AppBox sx={{ minWidth: 0, flex: 1 }}>
      <AppHeading level={2} weight={750} sx={sectionTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sectionSubtitleSx}>
        {subtitle}
      </AppText>
    </AppBox>
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
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={{
      ...toggleCardSx,
      borderColor: checked
        ? "var(--app-color-primary-soft)"
        : "var(--app-color-border)",
      bgcolor: checked
        ? "var(--app-color-primary-soft)"
        : "var(--app-color-surface-alt)",
    }}
  >
    <AppStack direction="row" align="flex-start" gap={1.1}>
      <IconBox icon={icon} colorVariant={checked ? "success" : "warning"} />

      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppHeading level={3} weight={700} sx={toggleTitleSx}>
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

const AssignAccessRightSidebar = ({
  selectedMember,
  accessSummary,
  formData,
  onViewMembers,
}) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Selected Member",
        icon: <FiUserCheck />,
        colorVariant: "success",
        variant: "default",
        custom: (
          <SelectedMemberContent
            member={selectedMember}
            onViewMembers={onViewMembers}
          />
        ),
      },
      {
        title: "Access Summary",
        icon: <FiCheckCircle />,
        colorVariant: "info",
        variant: "default",
        custom: (
          <AccessSummaryContent
            accessSummary={accessSummary}
            formData={formData}
          />
        ),
      },
      {
        title: "Assignment Rules",
        icon: <FiInfo />,
        colorVariant: "neutral",
        variant: "default",
        description:
          "Backend validation requires selected records when all access is disabled.",
        custom: <AccessRulesContent />,
      },
      {
        title: "Need Help?",
        icon: <FiHeadphones />,
        colorVariant: "neutral",
        variant: "default",
        description:
          "Learn more about member access and access management in PharmaERP.",
        actionLabel: "View User Guide",
        actionIcon: <FiBookOpen />,
      },
    ]}
  />
);

const SelectedMemberContent = ({ member, onViewMembers }) => (
  <div>
    <div className="space-y-2">
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
  </div>
);

const AccessSummaryContent = ({ accessSummary, formData }) => (
  <div>
    <div className="space-y-2">
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
  </div>
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

const AccessRulesContent = () => (
  <div className="mt-3 space-y-2.5">
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
      width: large ? 44 : 42,
      height: large ? 44 : 42,
      minWidth: large ? 44 : 42,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : "20px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageHeaderSx = { width: "100%" };

const pageHeaderContentSx = {
  minWidth: 0,

  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = { mb: 1 };

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
  height: 36,
  minWidth: 112,
  px: 1.7,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "0 10px 20px rgba(22, 163, 74, 0.18)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const primaryLargeButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "0 10px 20px rgba(22, 163, 74, 0.18)",
};

const secondaryLargeButtonSx = {
  height: 38,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const summaryCardSx = {
  minHeight: 104,
  px: 1.6,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const summaryTitleSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  m: 0,
  mt: 0.45,
  fontSize: "18px",
  lineHeight: 1.1,
  color: "var(--app-color-text)",
};

const summarySubtitleSx = {
  mt: 0.55,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

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
  maxWidth: 760,
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
  minHeight: 38,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const helperTextSx = {
  fontSize: "10.8px",
  lineHeight: 1.45,
};

const toggleCardSx = {
  px: 1.5,
  py: 1.4,
  transition: "border-color 160ms ease, background-color 160ms ease",
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

const switchSx = { mt: 1 };

const switchLabelSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const submitAlertSx = { mt: 3 };

const actionsSx = {
  mt: 4,
  pt: 2.2,
  borderTop: "1px solid var(--app-color-border)",
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

const sideButtonSx = {
  mt: 1.5,
  height: 34,
  fontSize: "12px",
  fontWeight: 700,
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

const toastSx = {
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
};

export default AssignAccessDesktopPage;
