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

const supplierTypeOptions = [
  { label: "Distributor", value: "distributor" },
  { label: "Manufacturer", value: "manufacturer" },
  { label: "Wholesaler", value: "wholesaler" },
  { label: "Local Vendor", value: "local_vendor" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

const balanceTypeOptions = [
  { label: "Credit (Cr - We owe them)", value: "cr" },
  { label: "Debit (Dr - They owe us)", value: "dr" },
];

const INITIAL_FORM = {
  businessName: "",
  supplierType: "distributor",
  contactPersonName: "",
  mobile: "",
  alternateMobile: "",
  email: "",
  status: "active",

  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  billingState: "",
  billingPincode: "",

  gstNumber: "",
  panNumber: "",
  drugLicenseNumber: "",

  bankName: "",
  bankAccountNumber: "",
  bankIfscCode: "",
  bankBranchName: "",

  creditLimit: 0,
  creditDays: 0,
  openingBalance: 0,
  openingBalanceType: "cr",
  notes: "",
};

export function SupplierDialog({
  isOpen,
  onClose,
  mode = "create",
  supplierData = null,
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
      if ((mode === "edit" || mode === "view") && supplierData) {
        const bAddr = supplierData.billingAddress || supplierData.address || {};
        const bank = supplierData.bankDetails || {};
        setFormData({
          businessName: supplierData.businessName || supplierData.name || "",
          supplierType: supplierData.supplierType || supplierData.type || "distributor",
          contactPersonName: supplierData.contactPersonName || supplierData.contactPerson || "",
          mobile: supplierData.mobile || supplierData.phone || "",
          alternateMobile: supplierData.alternateMobile || "",
          email: supplierData.email || "",
          status: supplierData.status || "active",

          billingAddressLine1: bAddr.addressLine1 || supplierData.addressLine1 || "",
          billingAddressLine2: bAddr.addressLine2 || "",
          billingCity: bAddr.city || supplierData.city || "",
          billingState: bAddr.state || supplierData.state || "",
          billingPincode: bAddr.pincode || supplierData.pincode || "",

          gstNumber: supplierData.gstNumber || supplierData.gstin || "",
          panNumber: supplierData.panNumber || supplierData.pan || "",
          drugLicenseNumber: supplierData.drugLicenseNumber || supplierData.dlNumber || "",

          bankName: bank.bankName || supplierData.bankName || "",
          bankAccountNumber: bank.accountNumber || supplierData.accountNumber || "",
          bankIfscCode: bank.ifscCode || supplierData.ifscCode || "",
          bankBranchName: bank.branchName || supplierData.branchName || "",

          creditLimit: supplierData.creditLimit || 0,
          creditDays: supplierData.creditDays || 0,
          openingBalance: supplierData.openingBalance || 0,
          openingBalanceType: supplierData.openingBalanceType || "cr",
          notes: supplierData.notes || "",
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
  }, [isOpen, mode, supplierData]);

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
    if (!formData.businessName.trim()) {
      errors.businessName = "Business / Supplier name is required";
    } else if (formData.businessName.trim().length < 2) {
      errors.businessName = "Supplier name must be at least 2 characters";
    }

    if (formData.mobile && !/^[6-9][0-9]{9}$/.test(formData.mobile.trim())) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(formData.gstNumber.trim().toUpperCase())) {
      errors.gstNumber = "Enter a valid 15-character GSTIN";
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
      businessName: formData.businessName.trim(),
      supplierType: formData.supplierType || "distributor",
      contactPersonName: formData.contactPersonName.trim() || null,
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

      gstNumber: formData.gstNumber.trim().toUpperCase() || null,
      panNumber: formData.panNumber.trim().toUpperCase() || null,
      drugLicenseNumber: formData.drugLicenseNumber.trim().toUpperCase() || null,

      bankDetails: {
        bankName: formData.bankName.trim() || null,
        accountNumber: formData.bankAccountNumber.trim() || null,
        ifscCode: formData.bankIfscCode.trim().toUpperCase() || null,
        branchName: formData.bankBranchName.trim() || null,
      },

      creditLimit: Number(formData.creditLimit) || 0,
      creditDays: Number(formData.creditDays) || 0,
      openingBalance: Number(formData.openingBalance) || 0,
      openingBalanceType: formData.openingBalanceType || "cr",
      notes: formData.notes.trim() || null,
    };

    try {
      if (mode === "create") {
        await onSubmitCreate(payload);
      } else if (mode === "edit" && supplierData?._id) {
        await onSubmitUpdate(supplierData._id, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to save supplier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = isCreate
    ? "Add Supplier"
    : isEdit
    ? "Edit Supplier"
    : "Supplier Details";

  const subtitle = isCreate
    ? "Add a new vendor or distributor profile for purchasing and payments."
    : isEdit
    ? "Update supplier contact, address, or payment terms."
    : "View supplier contact, GSTIN, bank details, and ledger terms.";

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
        {isView && supplierData && (
          <div className="space-y-4">
            <UIKeyValueList
              items={[
                { label: "Business / Vendor Name", value: supplierData.businessName || supplierData.name || "N/A" },
                { label: "Supplier Type", value: (supplierData.supplierType || "distributor").toUpperCase() },
                { label: "Contact Person", value: supplierData.contactPersonName || "N/A" },
                { label: "Mobile Phone", value: supplierData.mobile || supplierData.phone || "N/A", copyable: true },
                { label: "Email", value: supplierData.email || "N/A", copyable: true },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={statusVariantMap[supplierData.status] || "neutral"}>
                      {(supplierData.status || "active").toUpperCase()}
                    </UIBadge>
                  ),
                },
                {
                  label: "GSTIN",
                  value: supplierData.gstNumber || supplierData.gstin || "Not Registered",
                  copyable: Boolean(supplierData.gstNumber || supplierData.gstin),
                },
                {
                  label: "Drug License",
                  value: supplierData.drugLicenseNumber || supplierData.dlNumber || "N/A",
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
                  label: "Bank Account",
                  value: formData.bankAccountNumber
                    ? `${formData.bankName || "Bank"} — A/C: ${formData.bankAccountNumber} (IFSC: ${formData.bankIfscCode})`
                    : "No bank details",
                },
                {
                  label: "Credit Days",
                  value: `${supplierData.creditDays || 0} Days`,
                },
                {
                  label: "Opening Balance",
                  value: `₹${Number(supplierData.openingBalance || 0).toLocaleString("en-IN")} (${(supplierData.openingBalanceType || "cr").toUpperCase()})`,
                },
                { label: "Notes", value: supplierData.notes || "No notes" },
              ]}
            />
          </div>
        )}

        {/* CREATE / EDIT MODE */}
        {!isView && (
          <form id="supplier-dialog-form" onSubmit={handleSubmit} className="space-y-5">
            <UIFormSection title="Basic Profile & Contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Business / Vendor Name"
                  placeholder="e.g. Cipla Healthcare Ltd"
                  value={formData.businessName}
                  onChange={(e) => handleFieldChange("businessName", e.target.value)}
                  error={Boolean(formErrors.businessName)}
                  helperText={formErrors.businessName}
                  required
                />

                <UISelect
                  label="Supplier Type"
                  value={formData.supplierType}
                  onChange={(val) => handleFieldChange("supplierType", val)}
                  options={supplierTypeOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="Contact Person"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.contactPersonName}
                  onChange={(e) => handleFieldChange("contactPersonName", e.target.value)}
                />

                <UIInput
                  label="Mobile Number"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange("mobile", e.target.value)}
                  error={Boolean(formErrors.mobile)}
                  helperText={formErrors.mobile}
                />

                <UIInput
                  label="Email (Optional)"
                  placeholder="orders@supplier.com"
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
                placeholder="Building No, Industrial Estate, Street"
                value={formData.billingAddressLine1}
                onChange={(e) => handleFieldChange("billingAddressLine1", e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="City"
                  placeholder="e.g. Ahmedabad"
                  value={formData.billingCity}
                  onChange={(e) => handleFieldChange("billingCity", e.target.value)}
                />
                <UIInput
                  label="State"
                  placeholder="e.g. Gujarat"
                  value={formData.billingState}
                  onChange={(e) => handleFieldChange("billingState", e.target.value)}
                />
                <UIInput
                  label="Pincode"
                  placeholder="e.g. 380001"
                  value={formData.billingPincode}
                  onChange={(e) => handleFieldChange("billingPincode", e.target.value)}
                />
              </div>
            </UIFormSection>

            <UIFormSection title="GST & Drug License">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UIInput
                  label="GSTIN (Optional)"
                  placeholder="24AAAAA0000A1Z5"
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
                  label="Drug License No"
                  placeholder="DL-20B-12345"
                  value={formData.drugLicenseNumber}
                  onChange={(e) => handleFieldChange("drugLicenseNumber", e.target.value)}
                />
              </div>
            </UIFormSection>

            <UIFormSection title="Bank Details for Payments">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="Bank Name"
                  placeholder="e.g. HDFC Bank"
                  value={formData.bankName}
                  onChange={(e) => handleFieldChange("bankName", e.target.value)}
                />
                <UIInput
                  label="Account Number"
                  placeholder="50100012345678"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleFieldChange("bankAccountNumber", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  label="IFSC Code"
                  placeholder="HDFC0000123"
                  value={formData.bankIfscCode}
                  onChange={(e) => handleFieldChange("bankIfscCode", e.target.value)}
                />
                <UIInput
                  label="Branch Name"
                  placeholder="e.g. MG Road Branch"
                  value={formData.bankBranchName}
                  onChange={(e) => handleFieldChange("bankBranchName", e.target.value)}
                />
              </div>
            </UIFormSection>

            <UIFormSection title="Credit Terms & Opening Balance">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UIInput
                  type="number"
                  label="Credit Days"
                  placeholder="e.g. 30"
                  value={formData.creditDays}
                  onChange={(e) => handleFieldChange("creditDays", e.target.value)}
                />
                <UIInput
                  type="number"
                  label="Credit Limit (₹)"
                  placeholder="0.00"
                  value={formData.creditLimit}
                  onChange={(e) => handleFieldChange("creditLimit", e.target.value)}
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
                placeholder="Payment terms, delivery instructions..."
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
          <UIButton variant="primary" type="submit" form="supplier-dialog-form" isLoading={isSubmitting}>
            {isCreate ? "Create Supplier" : "Save Changes"}
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default SupplierDialog;
