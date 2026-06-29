import React from "react";
import { FiArrowLeft } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const typeOptions = [
  { label: "Financial Year", value: "YEAR" },
  { label: "Quarterly Period", value: "QUARTER" },
  { label: "Monthly Period", value: "MONTH" },
  { label: "Adjustment Period", value: "ADJUSTMENT" },
];

const statusOptions = [
  { label: "Open (Postings Allowed)", value: "OPEN" },
  { label: "Closed (Locked Temporarily)", value: "CLOSED" },
  { label: "Locked (Strict Finalized)", value: "LOCKED" },
];

const CreateFinancialPeriodMobilePage = ({
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
    <section className="w-full bg-bg pb-20">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleCancel}
              sx={actionHeaderIconBtnSx}
            />
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                New Period
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Define new fiscal calendar bounds
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Content Stack */}
        <div className="px-2 space-y-4">
          {/* Server / Validation Errors */}
          {serverError && (
            <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex justify-between items-center">
              <span>{serverError}</span>
              <button
                type="button"
                onClick={clearError}
                className="text-danger font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {formErrors.submit && (
            <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md">
              {formErrors.submit}
            </div>
          )}

          {/* Parameters card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Period Range Configuration
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5">
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
                size="small"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.periodType)}
                helperText={formErrors.periodType}
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
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
                helperText="Leave blank to auto-generate"
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
                size="small"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.status)}
                helperText={formErrors.status}
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Is Current Checklist */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => handleFieldChange("isCurrent", e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                  />
                  <span className="text-[12px] font-bold text-text">
                    Set as Current Active Period
                  </span>
                </label>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Fixed bottom controls */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 py-2 text-[12px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition"
          >
            {isLoading ? "Saving..." : "Define Period"}
          </button>
        </div>
      </AppBox>
    </section>
  );
};

// MUI style configurations
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const labelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const inputSx = {
  minHeight: 35,
  fontSize: "12.0px",
  bgcolor: "var(--app-color-surface)",
};

export default CreateFinancialPeriodMobilePage;
