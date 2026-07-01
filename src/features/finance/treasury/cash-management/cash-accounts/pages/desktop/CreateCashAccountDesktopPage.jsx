import React from "react";
import {
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  PageHeader,
} from "@/components";

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const CreateCashAccountDesktopPage = ({
  formData,
  formErrors = {},
  denominations = [],
  physicalTotal = 0,
  isLoading = false,
  branchOptions = [],
  handleFieldChange,
  handleQtyChange,
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
          title="Create Cash Account"
          subtitle="Register a new cash register chest or petty cash till in the treasury module."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Cash Accounts", onClick: handleCancel },
                { label: "Create Cash Account", current: true },
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
          {/* Form Card */}
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
                    Cash Account Parameters
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

                  {/* Submit error */}
                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5">
                    {/* Account Name */}
                    <AppInput
                      label="Cash Account Name / Label"
                      name="accountName"
                      value={formData.accountName}
                      onChange={(e) => handleFieldChange("accountName", e.target.value)}
                      placeholder="e.g. Head Office Cash Register"
                      required
                      error={Boolean(formErrors.accountName)}
                      helperText={formErrors.accountName || "The unique name of this cash drawer"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <div className="grid grid-cols-[1fr_120px] gap-3">
                      {/* Opening Balance */}
                      <AppInput
                        label="Opening Balance (₹)"
                        name="openingBalance"
                        type="number"
                        value={formData.openingBalance}
                        onChange={(e) => handleFieldChange("openingBalance", Number(e.target.value))}
                        placeholder="0.00"
                        error={Boolean(formErrors.openingBalance)}
                        helperText={formErrors.openingBalance || "Starting cash amount in hand"}
                        labelSx={labelSx}
                        inputSx={inputSx}
                      />
                      {/* Balance Type */}
                      <AppSelect
                        label="Type"
                        name="openingBalanceType"
                        value={formData.openingBalanceType}
                        onChange={(e) => handleFieldChange("openingBalanceType", e.target.value)}
                        options={[
                          { label: "Debit (Dr)", value: "dr" },
                          { label: "Credit (Cr)", value: "cr" },
                        ]}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                        labelSx={labelSx}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Primary Flag */}
                    <AppSelect
                      label="Primary Account"
                      name="isPrimary"
                      value={formData.isPrimary ? "true" : "false"}
                      onChange={(e) => handleFieldChange("isPrimary", e.target.value === "true")}
                      options={booleanOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Makes this the default cash chest for general business cash sales"
                      labelSx={labelSx}
                    />

                    {/* Branch selection */}
                    <AppSelect
                      label="Linked Branch (Optional)"
                      name="branchId"
                      value={formData.branchId || ""}
                      onChange={(e) => handleFieldChange("branchId", e.target.value)}
                      options={branchOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Assigns this cash drawer to a specific branch location"
                      labelSx={labelSx}
                    />
                  </div>

                  {/* Denomination breakdown sheet (Optional for opening balance) */}
                  {Number(formData.openingBalance) > 0 && (
                    <div className="border border-border rounded-md overflow-hidden bg-surface-alt/5">
                      <div className="px-4 py-3 border-b border-border bg-surface-alt/10 flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-text">
                          Opening Balance Denomination Breakdown (Optional)
                        </span>
                        {formErrors.denominations && (
                          <span className="text-[11.5px] text-danger font-semibold">
                            {formErrors.denominations}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <table className="w-full text-left border-collapse text-[12px]">
                          <thead>
                            <tr className="border-b border-border text-text-muted">
                              <th className="py-1.5 px-3 font-semibold w-[120px]">Denomination</th>
                              <th className="py-1.5 px-3 font-semibold w-[50px] text-center">Multiplier</th>
                              <th className="py-1.5 px-3 font-semibold w-[180px]">Quantity</th>
                              <th className="py-1.5 px-3 font-semibold text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {denominations.map((d) => {
                              const subTotal = d.denomination * d.quantity;
                              return (
                                <tr key={d.denomination} className="border-b border-border/40 hover:bg-surface-hover/10 transition">
                                  <td className="py-1.5 px-3 font-bold text-text font-mono">
                                    ₹ {d.denomination}
                                  </td>
                                  <td className="py-1.5 px-3 text-center text-text-muted font-mono">
                                    ×
                                  </td>
                                  <td className="py-1.5 px-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={d.quantity || ""}
                                      onChange={(e) => handleQtyChange(d.denomination, e.target.value)}
                                      placeholder="0"
                                      className="w-full max-w-[100px] px-2 py-0.5 text-[12px] border border-border rounded bg-surface text-text font-bold font-mono text-center focus:outline-none focus:border-primary"
                                    />
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-extrabold text-text font-mono">
                                    ₹ {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="bg-surface-alt/10 font-bold">
                              <td colSpan="3" className="py-2.5 px-3 text-[12.5px] text-text font-bold">
                                Total Denomination Value:
                              </td>
                              <td className="py-2.5 px-3 text-right font-black text-text text-[14px] font-mono">
                                ₹ {physicalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <AppInput
                    label="Description / Purpose (Optional)"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value.slice(0, 500))}
                    placeholder="Enter context, e.g. Petty cash drawer managed by receptionist"
                    multiline
                    rows={3}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </div>

                {/* Form Footer */}
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
                  <span className="font-bold text-text block mb-1">Ledger Auto-creation</span>
                  <span className="text-text-muted">
                    The ERP system automatically generates a unique ledger code and account under your chart of accounts for cash tracking.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Opening Balance</span>
                  <span className="text-text-muted">
                    This balance will initialize your cash ledger. Ensure matching cash inventory counts are complete before configuring.
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

export default CreateCashAccountDesktopPage;
