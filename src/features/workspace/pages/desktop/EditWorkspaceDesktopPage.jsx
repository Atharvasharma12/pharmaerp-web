// src/features/workspace/pages/desktop/EditWorkspaceDesktopPage.jsx

import { memo, useMemo } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiEdit2,
  FiEye,
  FiGlobe,
  FiImage,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppGrid,
  AppHeading,
  AppInput,
  AppPageLoader,
  AppPhoneInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const EditWorkspaceDesktopPage = memo(
  ({
    workspace,
    formData,
    formErrors = {},

    workspaceTypeOptions = [],
    currencyOptions = [],
    timeFormatOptions = [],

    isLoading = false,
    isSubmitting = false,

    handleChange,
    handleSubmit,
    handleBack,
    handleViewDetails,
  }) => {
    const breadcrumbItems = useMemo(
      () => [
        { label: "Workspace", onClick: handleBack },
        { label: "Edit Workspace", current: true },
      ],
      [handleBack],
    );

    if (isLoading) {
      return <AppPageLoader text="Loading workspace..." />;
    }

    if (!workspace) {
      return (
        <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
          <div className="mx-auto w-full max-w-[1500px]">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={missingCardSx}
            >
              <AppHeading level={1} weight={700} sx={missingTitleSx}>
                No workspace selected
              </AppHeading>

              <AppText variant="body2" sx={missingTextSx}>
                Please go back and select a workspace before editing.
              </AppText>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                startIcon={<FiArrowLeft />}
                onClick={handleBack}
                sx={{ mt: 2 }}
              >
                Back to Workspace
              </AppButton>
            </AppCard>
          </div>
        </section>
      );
    }

    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 pb-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="sticky top-0 z-30 -mx-5 mb-3 flex w-[calc(100%+40px)] items-center justify-between border-b border-border bg-bg/95 px-5 py-2 backdrop-blur">
            <AppStack direction="row" align="center" gap={1}>
              <IconBox icon={<FiEdit2 />} large />

              <AppBox>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  Edit Workspace
                </AppHeading>

                <AppBreadcrumb
                  size="small"
                  variant="text"
                  items={breadcrumbItems}
                  sx={breadcrumbSx}
                  itemSx={breadcrumbItemSx}
                  currentItemSx={breadcrumbCurrentSx}
                />
              </AppBox>
            </AppStack>

            <AppStack direction="row" align="center" gap={1}>
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleBack}
                disabled={isSubmitting}
                sx={toolbarButtonSx}
              >
                Back
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiEye />}
                onClick={handleViewDetails}
                disabled={isSubmitting}
                sx={toolbarButtonSx}
              >
                View Details
              </AppButton>
            </AppStack>
          </div>

          <AppBox component="form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-3.5">
              <div>
                <AppCard
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={mainCardSx}
                >
                  <FormSection
                    icon={<FiBriefcase />}
                    title="Basic Information"
                    subtitle="Update workspace identity and contact details."
                  >
                    <AppGrid columns={3} gap={1.25} columnGap={2}>
                      <AppInput
                        label="Workspace Name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter workspace name"
                        required
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiBriefcase />}
                        error={Boolean(formErrors.name)}
                        helperText={formErrors.name}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppSelect
                        label="Workspace Type"
                        name="type"
                        value={formData.type || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        options={workspaceTypeOptions}
                        fullWidth
                        required
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.type)}
                        helperText={formErrors.type}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="workspace@example.com"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiMail />}
                        error={Boolean(formErrors.email)}
                        helperText={formErrors.email}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppPhoneInput
                        label="Phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        countryCode="+91"
                        showCountryCode
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.phone)}
                        helperText={
                          formErrors.phone ||
                          "Optional 10-digit Indian mobile number"
                        }
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Logo URL"
                        name="logoUrl"
                        value={formData.logoUrl || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="https://example.com/logo.png"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiImage />}
                        error={Boolean(formErrors.logoUrl)}
                        helperText={formErrors.logoUrl}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Logo Public ID"
                        name="logoPublicId"
                        value={formData.logoPublicId || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Cloud image public id"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiImage />}
                        error={Boolean(formErrors.logoPublicId)}
                        helperText={formErrors.logoPublicId}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />
                    </AppGrid>
                  </FormSection>

                  <FormSection
                    icon={<FiMapPin />}
                    title="Address"
                    subtitle="Used for workspace records and business profile."
                    divided
                    green
                  >
                    <AppGrid columns={3} gap={1.25} columnGap={2}>
                      <AppInput
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1 || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter address line 1"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiMapPin />}
                        error={Boolean(formErrors.addressLine1)}
                        helperText={formErrors.addressLine1}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Address Line 2"
                        name="addressLine2"
                        value={formData.addressLine2 || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter address line 2"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.addressLine2)}
                        helperText={formErrors.addressLine2}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="City"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter city"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.city)}
                        helperText={formErrors.city}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="State"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter state"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.state)}
                        helperText={formErrors.state}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Country"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="India"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.country)}
                        helperText={formErrors.country}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter pincode"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.pincode)}
                        helperText={formErrors.pincode}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />
                    </AppGrid>
                  </FormSection>

                  <FormSection
                    icon={<FiSettings />}
                    title="Workspace Settings"
                    subtitle="Regional preferences used across workspace modules."
                    divided
                    green
                  >
                    <AppGrid columns={4} gap={1.25} columnGap={2}>
                      <AppInput
                        label="Timezone"
                        name="timezone"
                        value={formData.timezone || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Asia/Kolkata"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiGlobe />}
                        error={Boolean(formErrors.timezone)}
                        helperText={formErrors.timezone}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppSelect
                        label="Currency"
                        name="currency"
                        value={formData.currency || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        options={currencyOptions}
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.currency)}
                        helperText={formErrors.currency}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppInput
                        label="Date Format"
                        name="dateFormat"
                        value={formData.dateFormat || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="DD/MM/YYYY"
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiCalendar />}
                        error={Boolean(formErrors.dateFormat)}
                        helperText={formErrors.dateFormat}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />

                      <AppSelect
                        label="Time Format"
                        name="timeFormat"
                        value={formData.timeFormat || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        options={timeFormatOptions}
                        fullWidth
                        size="small"
                        variant="bordered"
                        rounded="md"
                        error={Boolean(formErrors.timeFormat)}
                        helperText={formErrors.timeFormat}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />
                    </AppGrid>
                  </FormSection>
                </AppCard>

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

                <div className="mt-2 flex w-full justify-end">
                  <AppStack
                    direction="row"
                    align="center"
                    justify="flex-end"
                    gap={1}
                  >
                    <AppButton
                      type="button"
                      variant="outlined"
                      colorVariant="neutral"
                      rounded="md"
                      size="small"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      sx={cancelButtonSx}
                    >
                      Cancel
                    </AppButton>

                    <AppButton
                      type="submit"
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      size="small"
                      startIcon={<FiSave />}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      sx={saveButtonSx}
                    >
                      Save Changes
                    </AppButton>
                  </AppStack>
                </div>
              </div>

              <EditAssistSidebar workspace={workspace} />
            </div>
          </AppBox>
        </div>
      </section>
    );
  },
);

EditWorkspaceDesktopPage.displayName = "EditWorkspaceDesktopPage";

const FormSection = memo(
  ({ icon, title, subtitle, children, divided = false, green = false }) => (
    <AppBox sx={divided ? sectionDividedSx : sectionSx}>
      <AppStack direction="row" align="flex-start" gap={0.85} sx={{ mb: 1.35 }}>
        <span
          className={[
            "mt-0.5 flex text-[15px]",
            green ? "text-primary" : "text-text-muted",
          ].join(" ")}
        >
          {icon}
        </span>

        <AppBox>
          <AppHeading level={2} weight={650} sx={sectionTitleSx}>
            {title}
          </AppHeading>

          {subtitle ? (
            <AppText variant="body2" sx={sectionSubtitleSx}>
              {subtitle}
            </AppText>
          ) : null}
        </AppBox>
      </AppStack>

      {children}
    </AppBox>
  ),
);

FormSection.displayName = "FormSection";

const EditAssistSidebar = memo(({ workspace }) => (
  <aside className="self-start">
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={assistCardSx}
    >
      <SidebarHeader
        icon={<FiBriefcase />}
        title="Workspace Update"
        subtitle="Changes apply to the selected workspace after saving."
      />

      <div className="my-3 h-px bg-border" />

      <AppStack direction="column" gap={0.9}>
        <SidebarInfoRow
          icon={<FiInfo />}
          title="Slug updates automatically"
          text="Changing the workspace name updates the slug on the backend."
        />

        <SidebarInfoRow
          icon={<FiPhone />}
          title="Contact validation"
          text="Phone must be a valid 10-digit Indian mobile number."
        />

        <SidebarInfoRow
          icon={<FiCreditCard />}
          title="Settings"
          text="Currency, date format and time format affect workspace defaults."
        />

        <SidebarInfoRow
          icon={<FiImage />}
          title="Logo"
          text="Logo requires a valid URL. Leave blank to remove logo details."
        />
      </AppStack>

      <AppBox sx={assistNoteSx}>
        <AppText variant="body2" weight={700} sx={assistNoteTitleSx}>
          Current workspace
        </AppText>

        <AppText variant="caption" sx={assistNoteTextSx}>
          {workspace?.workspaceCode || workspace?.slug || workspace?._id || "-"}
        </AppText>
      </AppBox>
    </AppCard>
  </aside>
));

EditAssistSidebar.displayName = "EditAssistSidebar";

const SidebarHeader = memo(({ icon, title, subtitle }) => (
  <AppStack direction="row" align="center" gap={0.85}>
    <IconBox icon={icon} />

    <AppBox>
      <AppHeading level={2} weight={700} sx={assistTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={assistSubtitleSx}>
        {subtitle}
      </AppText>
    </AppBox>
  </AppStack>
));

SidebarHeader.displayName = "SidebarHeader";

const SidebarInfoRow = memo(({ icon, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={0.9}>
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[13px] text-primary">
      {icon}
    </span>

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" weight={700} sx={assistStepTitleSx}>
        {title}
      </AppText>

      <AppText variant="caption" sx={assistStepTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
));

SidebarInfoRow.displayName = "SidebarInfoRow";

const IconBox = memo(({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 34 : 30,
      height: large ? 34 : 30,
      minWidth: large ? 34 : 30,
      borderRadius: large ? "9px" : "8px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "18px" : "15px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
));

IconBox.displayName = "IconBox";

const pageTitleSx = {
  m: 0,
  fontSize: "17px",
  lineHeight: 1.05,
  letterSpacing: "-0.25px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = { mt: 0, lineHeight: 1 };

const breadcrumbItemSx = {
  fontSize: "10.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const toolbarButtonSx = {
  height: 30,
  px: 1.25,
  fontSize: "11px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const mainCardSx = {
  px: 2,
  py: 1.4,
  bgcolor: "var(--app-color-surface)",
};

const sectionSx = { m: 0 };

const sectionDividedSx = {
  mt: 1.85,
  pt: 1.55,
  borderTop: "1px solid var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "12.7px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.25,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  mb: 0.3,
  fontSize: "11.3px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 35,
  fontSize: "12.3px",
  fontWeight: 500,
  bgcolor: "var(--app-color-surface-alt)",
};

const submitAlertSx = {
  mt: 1,
  py: 0.8,
  fontSize: "12px",
};

const cancelButtonSx = {
  height: 36,
  px: 2,
  fontSize: "12px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const saveButtonSx = {
  height: 36,
  px: 2.4,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const assistCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const assistTitleSx = {
  m: 0,
  fontSize: "13.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const assistSubtitleSx = {
  mt: 0.3,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const assistStepTitleSx = {
  m: 0,
  fontSize: "11.8px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const assistStepTextSx = {
  mt: 0.1,
  display: "block",
  fontSize: "10.8px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

const assistNoteSx = {
  mt: 1.25,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const assistNoteTitleSx = {
  m: 0,
  fontSize: "11.4px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const assistNoteTextSx = {
  display: "block",
  mt: 0.45,
  fontSize: "10.8px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

const missingCardSx = {
  maxWidth: 520,
  mx: "auto",
  mt: 8,
  px: 3,
  py: 3,
  textAlign: "center",
  bgcolor: "var(--app-color-surface)",
};

const missingTitleSx = {
  m: 0,
  fontSize: "20px",
  color: "var(--app-color-text)",
};

const missingTextSx = {
  mt: 0.75,
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

export default EditWorkspaceDesktopPage;
