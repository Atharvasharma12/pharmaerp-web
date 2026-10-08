import React, { useState, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIFormSection,
  UIInput,
  UISelect,
  UICheckbox,
  UIButton,
  UIAlert,
  UIKeyValueList,
  UIBadge,
} from "@/components/ui";

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

const getDefaultDates = () => {
  const today = new Date();
  const fyYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  const startDate = `${fyYear}-04-01`;
  const endDate = `${fyYear + 1}-03-31`;
  const periodCode = `FY-${fyYear}-${String(fyYear + 1).slice(2)}`;
  return { startDate, endDate, periodCode };
};

const INITIAL_FORM = {
  startDate: "",
  endDate: "",
  periodType: "YEAR",
  periodCode: "",
  isCurrent: false,
  status: "OPEN",
};

export function FinancialPeriodDialog({
  isOpen,
  onClose,
  mode = "create",
  periodData = null,
  onSubmitCreate,
  onUpdateStatus,
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (mode === "create") {
        const defaults = getDefaultDates();
        setFormData({
          startDate: defaults.startDate,
          endDate: defaults.endDate,
          periodType: "YEAR",
          periodCode: defaults.periodCode,
          isCurrent: false,
          status: "OPEN",
        });
      }
      setFormErrors({});
      setServerError(null);
    } else {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, mode]);

  const handleFieldChange = (name, valueOrEvent) => {
    let val = valueOrEvent;
    if (valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent) {
      val = valueOrEvent.target.type === "checkbox" ? valueOrEvent.target.checked : valueOrEvent.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.startDate) errors.startDate = "Select start date";
    if (!formData.endDate) errors.endDate = "Select end date";

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        errors.endDate = "End date must be after start date";
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const payload = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      periodType: formData.periodType,
      periodCode: String(formData.periodCode || "").trim() || undefined,
      isCurrent: formData.isCurrent,
      status: formData.status,
    };

    try {
      await onSubmitCreate(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to create financial period.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (newStatus) => {
    if (!periodData?._id) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onUpdateStatus(periodData._id, newStatus);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to update period status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const title = isView ? "Financial Period Details" : "Create Financial Period";
  const subtitle = isView
    ? "View fiscal calendar period details and status."
    : "Define a new fiscal calendar period window.";

  const statusVariantMap = {
    OPEN: "success",
    CLOSED: "warning",
    LOCKED: "danger",
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      mobileSheet
      className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
    >
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && periodData && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Period Code / Name", value: periodData.periodCode || periodData.name || "N/A" },
                {
                  label: "Period Type",
                  value: periodData.periodType || "YEAR",
                },
                {
                  label: "Start Date",
                  value: periodData.startDate ? new Date(periodData.startDate).toLocaleDateString("en-IN") : "N/A",
                },
                {
                  label: "End Date",
                  value: periodData.endDate ? new Date(periodData.endDate).toLocaleDateString("en-IN") : "N/A",
                },
                {
                  label: "Active Period",
                  value: periodData.isCurrent ? "Yes (Current Active Period)" : "No",
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={statusVariantMap[periodData.status] || "neutral"}>
                      {periodData.status}
                    </UIBadge>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* CREATE MODE */}
        {!isView && (
          <form id="financial-period-form" onSubmit={handleSubmit} className="space-y-4">
            <UIFormSection title="Period Dates & Type">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange("startDate", e.target.value)}
                  error={Boolean(formErrors.startDate)}
                  helperText={formErrors.startDate}
                  required
                />
                <UIInput
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange("endDate", e.target.value)}
                  error={Boolean(formErrors.endDate)}
                  helperText={formErrors.endDate}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UISelect
                  label="Period Type"
                  value={formData.periodType}
                  onChange={(val) => handleFieldChange("periodType", val)}
                  options={typeOptions}
                  required
                />
                <UIInput
                  label="Period Code (Optional)"
                  placeholder="e.g. FY-2026-27"
                  value={formData.periodCode}
                  onChange={(e) => handleFieldChange("periodCode", e.target.value)}
                  helperText="Leave blank for auto code"
                />
              </div>

              <UISelect
                label="Initial Period Status"
                value={formData.status}
                onChange={(val) => handleFieldChange("status", val)}
                options={statusOptions}
                required
              />

              <div className="pt-2">
                <UICheckbox
                  label="Set as Current Active Period"
                  checked={formData.isCurrent}
                  onChange={(checked) => handleFieldChange("isCurrent", checked)}
                  helperText="Only one period can be active at a time."
                />
              </div>
            </UIFormSection>
          </form>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </UIButton>

        {isView && periodData && (
          <>
            {periodData.status === "OPEN" && (
              <UIButton
                variant="warning"
                onClick={() => handleToggleStatus("CLOSED")}
                isLoading={isSubmitting}
              >
                Close Period
              </UIButton>
            )}
            {periodData.status === "CLOSED" && (
              <UIButton
                variant="primary"
                onClick={() => handleToggleStatus("OPEN")}
                isLoading={isSubmitting}
              >
                Re-open Period
              </UIButton>
            )}
          </>
        )}

        {!isView && (
          <UIButton
            variant="primary"
            type="submit"
            form="financial-period-form"
            isLoading={isSubmitting}
          >
            Create Period
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default FinancialPeriodDialog;
