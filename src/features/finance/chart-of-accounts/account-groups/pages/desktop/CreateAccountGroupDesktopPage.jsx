import React from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronRight,
  FiLayers,
  FiUpload,
  FiDownload,
  FiPlus,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
  PageHeader,
} from "@/components";

const CreateAccountGroupDesktopPage = ({
  formData,
  formErrors,
  isLoading,
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
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header with breadcrumbs */}
        <PageHeader
          title="Create Account Group"
          subtitle="Add a new account group to organize your chart of accounts."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Chart Of Accounts" },
                { label: "Account Groups", onClick: handleCancel },
                { label: "Create Account Group", current: true },
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

        {/* Two column grid */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          {/* Left Form Section */}
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
                {/* Form header title */}
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Account Group Information
                  </AppHeading>
                </div>

                <div className="p-5 space-y-5">
                  {/* Server error if any */}
                  {serverError && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md flex items-center justify-between">
                      <span>{serverError}</span>
                      <button
                        type="button"
                        onClick={clearError}
                        className="text-danger hover:underline font-bold ml-2"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Form Submission error if any */}
                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Group Name & Group Code Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Group Name</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={(e) => handleFieldChange("groupName", e.target.value)}
                        placeholder="Enter group name"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.groupName ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        e.g., Assets, Liabilities, Income
                      </span>
                      {formErrors.groupName && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.groupName}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Group Code</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="groupCode"
                        value={formData.groupCode}
                        onChange={(e) => handleFieldChange("groupCode", e.target.value)}
                        placeholder="Enter group code"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.groupCode ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        e.g., GRP-001
                      </span>
                      {formErrors.groupCode && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.groupCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Parent Group & Group Level Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Parent Group (Under Group)</label>
                      </div>
                      <AppSelect
                        name="parentGroupId"
                        value={formData.parentGroupId}
                        onChange={(e) => handleFieldChange("parentGroupId", e.target.value)}
                        options={parentGroupOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Select a parent group if this is a sub group
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Group Level (Auto)</label>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={computedLevel}
                        className="w-full px-3 py-1.5 text-[12.5px] rounded-md border border-border bg-surface-alt text-text focus:outline-none cursor-not-allowed opacity-85"
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Level in the chart of accounts hierarchy (1 for top level)
                      </span>
                    </div>
                  </div>

                  {/* Nature Selection dropdown */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-[12px] font-bold text-text">Nature</label>
                      <span className="text-danger">*</span>
                    </div>
                    <AppSelect
                      name="nature"
                      value={formData.nature}
                      onChange={(e) => handleFieldChange("nature", e.target.value)}
                      options={natureOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Select the nature of this account group
                    </span>
                    {formErrors.nature && (
                      <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                        {formErrors.nature}
                      </span>
                    )}

                    {/* Nature Options Info Box */}
                    <div className="border border-border bg-surface-alt/40 rounded-lg p-4 mt-3">
                      <div className="flex items-center gap-2 mb-3 text-[12.5px] font-bold text-text">
                        <FiInfo className="text-primary" />
                        <span>Nature Options</span>
                      </div>
                      <div className="grid grid-cols-5 gap-4 text-[12.5px]">
                        <div className="flex flex-col gap-1 items-start">
                          <AppTag label="Asset" variant="soft" colorVariant="primary" rounded="sm" sx={tagSx} />
                          <span className="text-text-muted text-[10.5px]">Asset related groups</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <AppTag label="Liability" variant="soft" colorVariant="warning" rounded="sm" sx={tagSx} />
                          <span className="text-text-muted text-[10.5px]">Liability related groups</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <AppTag label="Income" variant="soft" colorVariant="success" rounded="sm" sx={tagSx} />
                          <span className="text-text-muted text-[10.5px]">Income related groups</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <AppTag label="Expense" variant="soft" colorVariant="danger" rounded="sm" sx={tagSx} />
                          <span className="text-text-muted text-[10.5px]">Expense related groups</span>
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <AppTag label="Equity" variant="soft" colorVariant="purple" rounded="sm" sx={tagSx} />
                          <span className="text-text-muted text-[10.5px]">Equity related groups</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[12px] font-bold text-text">Description (Optional)</label>
                      <span className="text-[10px] text-text-muted font-semibold">
                        {(formData.description || "").length} / 500
                      </span>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleFieldChange("description", e.target.value.slice(0, 500))}
                      placeholder="Enter description for this account group"
                      rows={3}
                      className="w-full px-3 py-2 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Provide a brief description of this group's purpose
                    </span>
                  </div>

                  {/* Status Radio Selection cards */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <label className="text-[12px] font-bold text-text">Status</label>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                          formData.status === "active"
                            ? "border-success bg-success-soft/10"
                            : "border-border bg-surface hover:bg-surface-hover/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === "active"}
                          onChange={(e) => handleFieldChange("status", e.target.value)}
                          className="mt-1 accent-success"
                        />
                        <div>
                          <span className="text-[12.5px] font-bold text-text block">Active</span>
                          <span className="text-[10.5px] text-text-muted block mt-0.5">
                            Group is active and available for use
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                          formData.status === "inactive"
                            ? "border-neutral bg-surface-alt/50"
                            : "border-border bg-surface hover:bg-surface-hover/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === "inactive"}
                          onChange={(e) => handleFieldChange("status", e.target.value)}
                          className="mt-1 accent-neutral"
                        />
                        <div>
                          <span className="text-[12.5px] font-bold text-text block">Inactive</span>
                          <span className="text-[10.5px] text-text-muted block mt-0.5">
                            Group is inactive and hidden
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Footer Action buttons */}
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
                    disabled={isLoading}
                    sx={actionBtnSx}
                  >
                    Create Account Group
                  </AppButton>
                </div>
              </AppCard>
            </form>
          </div>

          {/* Right Sidebar Section */}
          <div className="space-y-4">
            {/* Help & Tips widget card */}
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
                  <span className="font-bold text-text block mb-1">Group Code</span>
                  <span className="text-text-muted">
                    Keep group code short, unique and easy to remember.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Parent Group</span>
                  <span className="text-text-muted">
                    Choose the correct parent group to maintain proper hierarchy.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Nature</span>
                  <span className="text-text-muted">
                    Select the nature carefully. It helps in financial reporting.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Status</span>
                  <span className="text-text-muted">
                    You can change the status later if required.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">System Groups</span>
                  <span className="text-text-muted">
                    System groups are created automatically and cannot be deleted.
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

// CSS-in-JS style rules matching global styles
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
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

const selectFieldSx = {
  width: "100%",
};

const selectInputSx = {
  height: 35,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
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

const tagSx = {
  height: 22,
  px: 1.2,
  fontSize: "10.5px",
  fontWeight: 700,
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default CreateAccountGroupDesktopPage;
