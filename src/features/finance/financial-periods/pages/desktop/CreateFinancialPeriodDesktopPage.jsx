import React from "react";
import { FiArrowLeft, FiInfo } from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
  PageHeader,
} from "@/components";

const typeOptions = [
  { label: "Financial Year (YEAR)", value: "YEAR" },
  { label: "Quarterly Period (QUARTER)", value: "QUARTER" },
  { label: "Monthly Period (MONTH)", value: "MONTH" },
  { label: "Adjustment Period (ADJUSTMENT)", value: "ADJUSTMENT" },
];

const statusOptions = [
  { label: "Open (Postings Allowed)", value: "OPEN" },
  { label: "Closed (Locked Temporarily)", value: "CLOSED" },
  { label: "Locked (Strict Finalized Log)", value: "LOCKED" },
];

const CreateFinancialPeriodDesktopPage = ({
  formData,
  formErrors = {},
  isLoading = false,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Create Financial Period"
          subtitle="Initialize a new fiscal calendar period and set up posting limits."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Financial Periods", onClick: handleCancel },
                { label: "New Period", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Layout Split */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          {/* Form Side */}
          <div className="min-w-0">
            <form onSubmit={handleSubmit}>
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                padding="none"
                sx={formCardSx}
              >
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Period Range & Configuration
                  </AppHeading>
                </div>

                <div className="p-5 space-y-5">
                  {/* Server / Validation Errors */}
                  {serverError && (
                    <div className="p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md flex justify-between items-center">
                      <span>{serverError}</span>
                      <button
                        type="button"
                        onClick={clearError}
                        className="text-danger hover:underline font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5">
                    {/* Start Date */}
                    <AppInput
                      type="date"
                      label="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleFieldChange("startDate", e.target.value)}
                      required
                      disabled={isLoading}
                      error={Boolean(formErrors.startDate)}
                      helperText={formErrors.startDate}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* End Date */}
                    <AppInput
                      type="date"
                      label="End Date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleFieldChange("endDate", e.target.value)}
                      required
                      disabled={isLoading}
                      error={Boolean(formErrors.endDate)}
                      helperText={formErrors.endDate}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* Period Type */}
                    <AppSelect
                      label="Period Type"
                      name="periodType"
                      value={formData.periodType}
                      onChange={(e) => handleFieldChange("periodType", e.target.value)}
                      options={typeOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      disabled={isLoading}
                      error={Boolean(formErrors.periodType)}
                      helperText={formErrors.periodType}
                      labelSx={labelSx}
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                    />

                    {/* Period Code */}
                    <AppInput
                      label="Period Code (Optional)"
                      name="periodCode"
                      value={formData.periodCode}
                      onChange={(e) => handleFieldChange("periodCode", e.target.value)}
                      placeholder="e.g. FY-2026-27"
                      disabled={isLoading}
                      error={Boolean(formErrors.periodCode)}
                      helperText="Leave blank to automatically generate period code based on dates"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* Initial Status */}
                    <AppSelect
                      label="Initial Period Status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                      options={statusOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      disabled={isLoading}
                      error={Boolean(formErrors.status)}
                      helperText={formErrors.status}
                      labelSx={labelSx}
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                    />

                    {/* Is Current active Period */}
                    <div className="flex flex-col justify-end pb-1.5">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isCurrent}
                          onChange={(e) => handleFieldChange("isCurrent", e.target.checked)}
                          disabled={isLoading}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                        />
                        <span className="text-[12.5px] font-bold text-text">
                          Set as Current Active Period
                        </span>
                      </label>
                      <span className="text-[11px] text-text-muted mt-1 block">
                        Only one period can be marked active at a time.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                  <AppButton
                    type="button"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    size="small"
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={actionBtnSx}
                  >
                    Cancel
                  </AppButton>

                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="success"
                    rounded="md"
                    size="small"
                    loading={isLoading}
                    sx={actionBtnSx}
                  >
                    Define Period
                  </AppButton>
                </div>
              </AppCard>
            </form>
          </div>

          {/* Right Sidebar Section */}
          <div className="space-y-4">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sideCardSx}
            >
              <div className="px-4 py-3.5 border-b border-border flex items-center gap-1.5">
                <FiInfo className="text-success text-[15px]" />
                <AppHeading level={3} weight={700} sx={sideCardTitleSx}>
                  Help & Tips
                </AppHeading>
              </div>
              <div className="p-4 space-y-4 text-[12px] leading-relaxed">
                <div>
                  <span className="font-bold text-text block mb-1">Start & End Date</span>
                  <span className="text-text-muted">
                    The calendar bounds defining this accounting period window.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Period Code</span>
                  <span className="text-text-muted">
                    Unique identifier used as a reference code during postings.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Active Status</span>
                  <span className="text-text-muted">
                    Specifies whether ledger entries are permitted inside this period.
                  </span>
                </div>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const formCardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const sideCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const sideCardTitleSx = {
  m: 0,
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const selectFieldSx = {
  width: "100%",
};

const selectInputSx = {
  height: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  minHeight: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

export default CreateFinancialPeriodDesktopPage;
