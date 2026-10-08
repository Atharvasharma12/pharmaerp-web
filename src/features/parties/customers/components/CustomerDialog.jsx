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
  UIButton,
  UIAlert,
  UIKeyValueList,
  UIBadge,
} from "@/components/ui";

const customerTypeOptions = [
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Hospital", value: "hospital" },
  { label: "Clinic", value: "clinic" },
  { label: "Corporate", value: "corporate" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

const balanceTypeOptions = [
  { label: "Debit (Dr - They owe us)", value: "dr" },
  { label: "Credit (Cr - We owe them)", value: "cr" },
];

const INITIAL_FORM = {
  name: "",
  customerType: "retail",
  mobile: "",
  alternateMobile: "",
  email: "",
  status: "active",

  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  billingState: "",
  billingPincode: "",

  creditLimit: 0,
  creditDays: 0,
  openingBalance: 0,
  openingBalanceType: "dr",

  gstNumber: "",
  panNumber: "",
  drugLicenseNumber: "",
  notes: "",
};

export function CustomerDialog({
  isOpen,
  onClose,
  mode = "create",
  customerData = null,
  onSubmitCreate,
  onSubmitUpdate,
  onSuccess,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && customerData) {
        const bAddr = customerData.billingAddress || {};
        setFormData({
          name: customerData.name || customerData.customerName || "",
          customerType: customerData.customerType || "retail",
          mobile: customerData.mobile || customerData.phone || "",
          alternateMobile: customerData.alternateMobile || "",
          email: customerData.email || "",
          status: customerData.status || "active",

          billingAddressLine1: bAddr.addressLine1 || customerData.address || "",
          billingAddressLine2: bAddr.addressLine2 || "",
          billingCity: bAddr.city || customerData.city || "",
          billingState: bAddr.state || customerData.state || "",
          billingPincode: bAddr.pincode || customerData.pincode || "",

          creditLimit: customerData.creditLimit || 0,
          creditDays: customerData.creditDays || 0,
          openingBalance: customerData.openingBalance || 0,
          openingBalanceType: customerData.openingBalanceType || "dr",

          gstNumber: customerData.gstNumber || customerData.gstin || "",
          panNumber: customerData.panNumber || customerData.pan || "",
          drugLicenseNumber: customerData.drugLicenseNumber || "",
          notes: customerData.notes || "",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setFormErrors({});
      setServerError(null);
    } else {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, mode, customerData]);

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
    if (!formData.name.trim()) {
      errors.name = "Customer name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Customer name must be at least 2 characters";
    }

    if (formData.mobile && !/^[6-9][0-9]{9}$/.test(formData.mobile.trim())) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(formData.gstNumber.trim().toUpperCase())) {
      errors.gstNumber = "Enter a valid 15-character GSTIN (e.g. 27AAAAA0000A1Z5)";
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

    const payload = {
      name: formData.name.trim(),
      customerType: formData.customerType || "retail",
      mobile: formData.mobile.trim() || null,
      alternateMobile: formData.alternateMobile.trim() || null,
      email: formData.email.trim().toLowerCase() || null,
      status: formData.status || "active",

      billingAddress: {
        addressLine1: formData.billingAddressLine1.trim() || null,
        addressLine2: formData.billingAddressLine2.trim() || null,
        city: formData.billingCity.trim() || null,
        state: formData.billingState.trim() || null,
        country: "India",
        pincode: formData.billingPincode.trim() || null,
      },

      creditLimit: Number(formData.creditLimit) || 0,
      creditDays: Number(formData.creditDays) || 0,
      openingBalance: Number(formData.openingBalance) || 0,
      openingBalanceType: formData.openingBalanceType || "dr",

      gstNumber: formData.gstNumber.trim().toUpperCase() || null,
      panNumber: formData.panNumber.trim().toUpperCase() || null,
      drugLicenseNumber: formData.drugLicenseNumber.trim().toUpperCase() || null,
      notes: formData.notes.trim() || null,
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else if (mode === "edit" && customerData?._id) {
        await onSubmitUpdate(customerData._id, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Add Customer"
    : isEdit
    ? "Edit Customer"
    : "Customer Details";

  const subtitle = isCreate
    ? "Add a new customer profile for billing and credit tracking."
    : isEdit
    ? "Update customer contact, address, or credit settings."
    : "View customer details, GST info, and credit balance.";

  const statusVariantMap = {
    active: "success",
    inactive: "neutral",
    blocked: "danger",
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      mobileSheet
      className="w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
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
        {isView && customerData && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Customer Name", value: customerData.name || customerData.customerName || "N/A" },
                { label: "Customer Type", value: (customerData.customerType || "retail").toUpperCase() },
                { label: "Mobile Phone", value: customerData.mobile || customerData.phone || "N/A", copyable: true },
                { label: "Email", value: customerData.email || "N/A", copyable: true },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={statusVariantMap[customerData.status] || "neutral"}>
                      {(customerData.status || "active").toUpperCase()}
                    </UIBadge>
                  ),
                },
                {
                  label: "GSTIN",
                  value: customerData.gstNumber || customerData.gstin || "Not Registered",
                  copyable: Boolean(customerData.gstNumber || customerData.gstin),
                },
                {
                  label: "Address",
                  value: [
                    formData.billingAddressLine1,
                    formData.billingCity,
                    formData.billingState,
                    formData.billingPincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No address on file",
                },
                {
                  label: "Credit Limit",
                  value: `₹${Number(customerData.creditLimit || 0).toLocaleString("en-IN")}`,
                },
                {
                  label: "Opening Balance",
                  value: `₹${Number(customerData.openingBalance || 0).toLocaleString("en-IN")} (${(customerData.openingBalanceType || "dr").toUpperCase()})`,
                },
                { label: "Notes", value: customerData.notes || "No notes" },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && (
          <form id="customer-dialog-form" onSubmit={handleSubmit} className="space-y-5">
            <UIFormSection title="Basic Profile & Contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Customer Name"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  required
                />

                <UISelect
                  label="Customer Type"
                  value={formData.customerType}
                  onChange={(val) => handleFieldChange("customerType", val)}
                  options={customerTypeOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="Mobile Number"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange("mobile", e.target.value)}
                  error={Boolean(formErrors.mobile)}
                  helperText={formErrors.mobile}
                />

                <UIInput
                  label="Alt Mobile (Optional)"
                  placeholder="e.g. 9123456789"
                  value={formData.alternateMobile}
                  onChange={(e) => handleFieldChange("alternateMobile", e.target.value)}
                />

                <UIInput
                  label="Email (Optional)"
                  placeholder="ramesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                />
              </div>

              <UISelect
                label="Status"
                value={formData.status}
                onChange={(val) => handleFieldChange("status", val)}
                options={statusOptions}
              />
            </UIFormSection>

            <UIFormSection title="Address Details">
              <UIInput
                label="Address Line 1"
                placeholder="Shop/Flat No., Building Name, Street"
                value={formData.billingAddressLine1}
                onChange={(e) => handleFieldChange("billingAddressLine1", e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="City"
                  placeholder="e.g. Mumbai"
                  value={formData.billingCity}
                  onChange={(e) => handleFieldChange("billingCity", e.target.value)}
                />
                <UIInput
                  label="State"
                  placeholder="e.g. Maharashtra"
                  value={formData.billingState}
                  onChange={(e) => handleFieldChange("billingState", e.target.value)}
                />
                <UIInput
                  label="Pincode"
                  placeholder="e.g. 400001"
                  value={formData.billingPincode}
                  onChange={(e) => handleFieldChange("billingPincode", e.target.value)}
                />
              </div>
            </UIFormSection>

            <UIFormSection title="GST & Tax Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="GSTIN (Optional)"
                  placeholder="27AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => handleFieldChange("gstNumber", e.target.value)}
                  error={Boolean(formErrors.gstNumber)}
                  helperText={formErrors.gstNumber}
                />
                <UIInput
                  label="PAN Number (Optional)"
                  placeholder="ABCDE1234F"
                  value={formData.panNumber}
                  onChange={(e) => handleFieldChange("panNumber", e.target.value)}
                />
                <UIInput
                  label="Drug License (Optional)"
                  placeholder="DL-2026-101"
                  value={formData.drugLicenseNumber}
                  onChange={(e) => handleFieldChange("drugLicenseNumber", e.target.value)}
                />
              </div>
            </UIFormSection>

            <UIFormSection title="Credit & Opening Balance">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Credit Limit (₹)"
                  placeholder="0.00"
                  value={formData.creditLimit}
                  onChange={(e) => handleFieldChange("creditLimit", e.target.value)}
                />
                <UIInput
                  type="number"
                  label="Credit Days"
                  placeholder="e.g. 30"
                  value={formData.creditDays}
                  onChange={(e) => handleFieldChange("creditDays", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Opening Balance (₹)"
                  placeholder="0.00"
                  value={formData.openingBalance}
                  onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                />
                <UISelect
                  label="Balance Type"
                  value={formData.openingBalanceType}
                  onChange={(val) => handleFieldChange("openingBalanceType", val)}
                  options={balanceTypeOptions}
                />
              </div>

              <UIInput
                label="Notes / Instructions"
                placeholder="Specific customer instructions or remarks..."
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </UIFormSection>
          </form>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </UIButton>

        {!isView && (
          <UIButton variant="primary" type="submit" form="customer-dialog-form" isLoading={isSubmitting}>
            {isCreate ? "Create Customer" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default CustomerDialog;
