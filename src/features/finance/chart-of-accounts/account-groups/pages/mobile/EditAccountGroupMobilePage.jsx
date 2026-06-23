import React from "react";
import {
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const EditAccountGroupMobilePage = ({
  formData,
  formErrors,
  isLoading,
  isFetching,
  computedLevel,
  parentGroupOptions,
  natureOptions,
  statusOptions,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  if (isFetching) {
    return (
      <div className="min-h-[calc(100vh-58px)] bg-bg flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>
            Loading account group details...
          </AppText>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-bg pb-6">
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
                Edit Group
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Update account group details
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Form container card */}
        <div className="px-2 space-y-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            {/* Header title */}
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Account Group Details
              </AppHeading>
            </div>

            <form onSubmit={handleSubmit} className="p-3.5 space-y-4">
              {/* Server error if any */}
              {serverError && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex items-center justify-between">
                  <span>{serverError}</span>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-danger hover:underline font-bold"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* Form Submission error if any */}
              {formErrors.submit && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md">
                  {formErrors.submit}
                </div>
              )}

              {/* Group Name field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Group Name</label>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={(e) => handleFieldChange("groupName", e.target.value)}
                  placeholder="Enter group name"
                  className={`w-full px-2.5 py-1.5 text-[12px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                    formErrors.groupName ? "border-danger" : "border-border"
                  }`}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  e.g., Assets, Liabilities, Income
                </span>
                {formErrors.groupName && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.groupName}
                  </span>
                )}
              </div>

              {/* Group Code field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Group Code</label>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={(e) => handleFieldChange("groupCode", e.target.value)}
                  placeholder="Enter group code"
                  className={`w-full px-2.5 py-1.5 text-[12px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                    formErrors.groupCode ? "border-danger" : "border-border"
                  }`}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  e.g., GRP-001
                </span>
                {formErrors.groupCode && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.groupCode}
                  </span>
                )}
              </div>

              {/* Parent Group field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Parent Group (Under Group)</label>
                </div>
                <AppSelect
                  name="parentGroupId"
                  value={formData.parentGroupId}
                  onChange={(e) => handleFieldChange("parentGroupId", e.target.value)}
                  options={parentGroupOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  Select a parent group if this is a sub group
                </span>
              </div>

              {/* Group Level (Auto) field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Group Level (Auto)</label>
                </div>
                <input
                  type="text"
                  readOnly
                  value={computedLevel}
                  className="w-full px-2.5 py-1.5 text-[12px] rounded-md border border-border bg-surface-alt text-text focus:outline-none cursor-not-allowed opacity-85"
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  Level in the chart of accounts hierarchy (1 for top level)
                </span>
              </div>

              {/* Nature field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Nature</label>
                  <span className="text-danger">*</span>
                </div>
                <AppSelect
                  name="nature"
                  value={formData.nature}
                  onChange={(e) => handleFieldChange("nature", e.target.value)}
                  options={natureOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  Select the nature of this account group
                </span>
                {formErrors.nature && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.nature}
                  </span>
                )}

                {/* Nature Options Info Box */}
                <div className="border border-border bg-surface-alt/40 rounded-lg p-3 mt-2.5">
                  <div className="flex items-center gap-1.5 mb-2 text-[11.5px] font-bold text-text">
                    <FiInfo className="text-primary" />
                    <span>Nature Options</span>
                  </div>
                  <div className="space-y-2 text-[11.5px]">
                    <div className="flex items-center gap-2">
                      <AppTag label="Asset" variant="soft" colorVariant="primary" rounded="sm" sx={mobileTagSx} />
                      <span className="text-text-muted text-[10px]">Asset related groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppTag label="Liability" variant="soft" colorVariant="warning" rounded="sm" sx={mobileTagSx} />
                      <span className="text-text-muted text-[10px]">Liability related groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppTag label="Income" variant="soft" colorVariant="success" rounded="sm" sx={mobileTagSx} />
                      <span className="text-text-muted text-[10px]">Income related groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppTag label="Expense" variant="soft" colorVariant="danger" rounded="sm" sx={mobileTagSx} />
                      <span className="text-text-muted text-[10px]">Expense related groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppTag label="Equity" variant="soft" colorVariant="purple" rounded="sm" sx={mobileTagSx} />
                      <span className="text-text-muted text-[10px]">Equity related groups</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11.5px] font-bold text-text">Description (Optional)</label>
                  <span className="text-[9.5px] text-text-muted font-semibold">
                    {(formData.description || "").length} / 500
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value.slice(0, 500))}
                  placeholder="Enter description for this account group"
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-[12px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  Provide a brief description of this group's purpose
                </span>
              </div>

              {/* Status field */}
              <div>
                <div className="flex items-center gap-0.5 mb-1.5">
                  <label className="text-[11.5px] font-bold text-text">Status</label>
                  <span className="text-danger">*</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      formData.status === "active"
                        ? "border-success bg-success-soft/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                      className="mt-0.5 accent-success"
                    />
                    <div>
                      <span className="text-[11.5px] font-bold text-text block">Active</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        Group is active and available for use
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      formData.status === "inactive"
                        ? "border-neutral bg-surface-alt/50"
                        : "border-border bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                      className="mt-0.5 accent-neutral"
                    />
                    <div>
                      <span className="text-[11.5px] font-bold text-text block">Inactive</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        Group is inactive and hidden
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons block arranged horizontally */}
              <div className="pt-3 flex gap-2 w-full">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface hover:bg-surface-hover/20 transition rounded-md text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 text-[12px] font-bold bg-success hover:bg-success/90 transition text-surface rounded-md"
                >
                  {isLoading ? "Saving..." : "Update Group"}
                </button>
              </div>
            </form>
          </AppCard>

          {/* Help & Tips list section */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border flex items-center gap-1.5">
              <FiInfo className="text-success text-[14px]" />
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Help & Tips
              </AppHeading>
            </div>
            <div className="p-3.5 space-y-3.5 text-[11px] leading-relaxed">
              <div>
                <span className="font-bold text-text block">Group Code</span>
                <span className="text-text-muted mt-0.5 block">
                  Keep group code short, unique and easy to remember.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">Parent Group</span>
                <span className="text-text-muted mt-0.5 block">
                  Choose the correct parent group to maintain proper hierarchy.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">Nature</span>
                <span className="text-text-muted mt-0.5 block">
                  Select the nature carefully. It helps in financial reporting.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">Status</span>
                <span className="text-text-muted mt-0.5 block">
                  You can change the status later if required.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">System Groups</span>
                <span className="text-text-muted mt-0.5 block">
                  System groups are created automatically and cannot be deleted.
                </span>
              </div>
            </div>
          </AppCard>
        </div>
      </AppBox>
    </section>
  );
};

// MUI style objects matching the look and feel
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
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
};

const mobileTagSx = {
  height: 18,
  px: 0.8,
  fontSize: "8.5px",
  fontWeight: 700,
};

export default EditAccountGroupMobilePage;
