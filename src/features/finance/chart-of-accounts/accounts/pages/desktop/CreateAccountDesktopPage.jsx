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
  AppSelect,
  AppStack,
  AppTag,
  AppText,
  PageHeader,
} from "@/components";

const CreateAccountDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  groupOptions,
  categoryOptions,
  balanceTypeOptions,
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
          title="Create Account"
          subtitle="Add a new financial ledger under your account groups."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Chart Of Accounts" },
                { label: "Accounts", onClick: handleCancel },
                { label: "Create Account", current: true },
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
                {/* Section title */}
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Ledger Account Details
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
                        className="text-danger hover:underline font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Submit error if any */}
                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Account Name & Code Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Name</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={(e) => handleFieldChange("accountName", e.target.value)}
                        placeholder="Enter account name"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.accountName ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        e.g., Cash In Hand, Sales Ledger, Meds Purchase Ledger
                      </span>
                      {formErrors.accountName && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountName}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Code</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="accountCode"
                        value={formData.accountCode}
                        onChange={(e) => handleFieldChange("accountCode", e.target.value)}
                        placeholder="Enter account code"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.accountCode ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        e.g., ACC-001
                      </span>
                      {formErrors.accountCode && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Account Group & Category Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Group</label>
                        <span className="text-danger">*</span>
                      </div>
                      <AppSelect
                        name="accountGroupId"
                        value={formData.accountGroupId}
                        onChange={(e) => handleFieldChange("accountGroupId", e.target.value)}
                        options={groupOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Choose the group under which this ledger belongs
                      </span>
                      {formErrors.accountGroupId && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountGroupId}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Category</label>
                        <span className="text-danger">*</span>
                      </div>
                      <AppSelect
                        name="accountCategory"
                        value={formData.accountCategory}
                        onChange={(e) => handleFieldChange("accountCategory", e.target.value)}
                        options={categoryOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Select account category
                      </span>
                      {formErrors.accountCategory && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountCategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Opening Balance & Balance Type Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Opening Balance (Optional)</label>
                      </div>
                      <input
                        type="number"
                        name="openingBalance"
                        value={formData.openingBalance || ""}
                        onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                        placeholder="0.00"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.openingBalance ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Opening ledger balance
                      </span>
                      {formErrors.openingBalance && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.openingBalance}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Balance Type</label>
                      </div>
                      <AppSelect
                        name="openingBalanceType"
                        value={formData.openingBalanceType}
                        onChange={(e) => handleFieldChange("openingBalanceType", e.target.value)}
                        options={balanceTypeOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Debit (Dr) or Credit (Cr)
                      </span>
                    </div>
                  </div>

                  {/* Description field */}
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
                      placeholder="Enter description for this account ledger"
                      rows={3}
                      className="w-full px-3 py-2 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Provide a brief description of the ledger's transactions
                    </span>
                  </div>

                  {/* Status Selection cards */}
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
                            Account is active and available for ledger posting
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
                            Account is inactive and disabled
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
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
                    Create Account
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
                  <span className="font-bold text-text block mb-1">Account Code</span>
                  <span className="text-text-muted">
                    Keep account code short, unique and easy to remember.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Account Group</span>
                  <span className="text-text-muted">
                    Choose the correct parent group to organize financial ledgers properly.
                  </span>
                </div>

                <div>
                  <span className="font-bold text-text block mb-1">Opening Balance</span>
                  <span className="text-text-muted">
                    Initial balance at the beginning of active financial statement period.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Status</span>
                  <span className="text-text-muted">
                    Only active accounts accept transaction postings.
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

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default CreateAccountDesktopPage;
