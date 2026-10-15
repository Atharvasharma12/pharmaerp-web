import React, { useState, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIInput,
  UISelect,
  UIButton,
  UIAlert,
  UIBadge,
  UIKeyValueList,
} from "@/components/ui";
import {
  Stethoscope,
  Building2,
  Award,
  Hash,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";

export const DOCTOR_SPECIALTIES = [
  { label: "General Physician", value: "General Physician" },
  { label: "Pediatrician (Child Specialist)", value: "Pediatrician" },
  { label: "Cardiologist (Heart Specialist)", value: "Cardiologist" },
  { label: "Orthopedic Surgeon (Bone & Joint)", value: "Orthopedic" },
  { label: "Gynecologist & Obstetrician", value: "Gynecologist" },
  { label: "Dermatologist (Skin & Hair)", value: "Dermatologist" },
  { label: "ENT Specialist (Ear, Nose, Throat)", value: "ENT Specialist" },
  { label: "Neurologist / Neurosurgeon", value: "Neurologist" },
  { label: "Ophthalmologist (Eye Specialist)", value: "Ophthalmologist" },
  { label: "Gastroenterologist", value: "Gastroenterologist" },
  { label: "Pulmonologist (Chest & Lungs)", value: "Pulmonologist" },
  { label: "Psychiatrist", value: "Psychiatrist" },
  { label: "Dentist / Dental Surgeon", value: "Dentist" },
  { label: "General Surgeon", value: "General Surgeon" },
  { label: "Ayurvedic Practitioner (BAMS)", value: "Ayurvedic" },
  { label: "Homeopathic Practitioner (BHMS)", value: "Homeopathic" },
  { label: "Other Specialty", value: "Other" },
];

const statusOptions = [
  { label: "Active Practitioner", value: "active" },
  { label: "Inactive / On Leave", value: "inactive" },
];

const INITIAL_FORM = {
  name: "",
  hospitalName: "",
  specialty: "General Physician",
  customSpecialty: "",
  registrationNumber: "",
  address: "",
  mobile: "",
  email: "",
  status: "active",
};

// Mini Interactive Live Preview Card for Create/Edit
function DoctorCardPreview({
  name,
  hospitalName,
  specialty,
  registrationNumber,
  mobile,
  status,
}) {
  const cleanName = (name || "Doctor").replace(/^(dr\.?|dr)\s+/i, "");
  const initials = cleanName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-surface to-surface p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {initials || "DR"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-base text-text truncate max-w-[220px] sm:max-w-[320px]">
                {name || "Dr. Practitioner Name"}
              </h4>
              <UIBadge
                variant={status === "active" ? "success" : "neutral"}
                size="sm"
              >
                {(status || "active").toUpperCase()}
              </UIBadge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-muted flex-wrap">
              <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Award className="size-3" /> {specialty || "General Physician"}
              </span>
              {hospitalName && (
                <span className="flex items-center gap-1 font-medium text-text-muted truncate max-w-[200px]">
                  <Building2 className="size-3 text-text-muted" /> {hospitalName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:text-right shrink-0">
          <div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Reg #
            </div>
            <div className="text-xs font-bold text-text font-mono truncate max-w-[120px]">
              {registrationNumber || "Not Specified"}
            </div>
          </div>
          {mobile && (
            <div className="hidden sm:block pl-3 border-l border-border">
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Mobile
              </div>
              <div className="text-xs font-bold text-text font-mono truncate max-w-[120px]">
                {mobile}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DoctorDialog({
  isOpen,
  onClose,
  mode = "create", // "create" | "edit" | "view"
  doctorData = null,
  onSubmitCreate,
  onSubmitUpdate,
  onSuccess,
}) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if ((currentMode === "edit" || currentMode === "view") && doctorData) {
        const isStandardSpecialty = DOCTOR_SPECIALTIES.some(
          (s) =>
            s.value.toLowerCase() === (doctorData.specialty || "").toLowerCase()
        );

        setFormData({
          name: doctorData.name || "",
          hospitalName: doctorData.hospitalName || "",
          specialty: isStandardSpecialty
            ? doctorData.specialty
            : doctorData.specialty
            ? "Other"
            : "General Physician",
          customSpecialty: isStandardSpecialty ? "" : doctorData.specialty || "",
          registrationNumber: doctorData.registrationNumber || "",
          address: doctorData.address || "",
          mobile: doctorData.mobile || doctorData.phone || "",
          email: doctorData.email || "",
          status: doctorData.status || "active",
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
  }, [isOpen, currentMode, doctorData]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (name, valueOrEvent) => {
    let val = valueOrEvent;
    if (
      valueOrEvent &&
      typeof valueOrEvent === "object" &&
      "target" in valueOrEvent
    ) {
      val =
        valueOrEvent.target.type === "checkbox"
          ? valueOrEvent.target.checked
          : valueOrEvent.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Doctor name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Doctor name must be at least 2 characters";
    }

    if (formData.specialty === "Other" && !formData.customSpecialty.trim()) {
      errors.customSpecialty = "Please enter the specialty name";
    }

    if (formData.mobile && !/^[6-9][0-9]{9}$/.test(formData.mobile.trim())) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Enter a valid email address";
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

    const resolvedSpecialty =
      formData.specialty === "Other"
        ? formData.customSpecialty.trim()
        : formData.specialty;

    const payload = {
      name: formData.name.trim(),
      hospitalName: formData.hospitalName.trim() || null,
      specialty: resolvedSpecialty || null,
      registrationNumber: formData.registrationNumber.trim().toUpperCase() || null,
      address: formData.address.trim() || null,
      mobile: formData.mobile.trim() || null,
      email: formData.email.trim().toLowerCase() || null,
      status: formData.status,
    };

    try {
      if (currentMode === "create") {
        if (onSubmitCreate) {
          await onSubmitCreate(payload);
        }
      } else if (currentMode === "edit" && doctorData) {
        const id = doctorData._id || doctorData.id;
        if (onSubmitUpdate) {
          await onSubmitUpdate(id, payload);
        }
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred while saving the doctor";
      setServerError(msg);
      setFormErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isCreate = currentMode === "create";

  const title = isCreate
    ? "Add Doctor"
    : isEdit
    ? "Edit Doctor"
    : "Doctor Profile";

  const subtitle = isCreate
    ? "Register a new prescribing physician for patient prescription references and billing."
    : isEdit
    ? "Update doctor credentials, affiliated hospital, or contact information."
    : "Comprehensive view of doctor identity, medical registration, and clinical practice.";

  const cleanDoctorName = (
    doctorData?.name ||
    doctorData?.doctorName ||
    "Doctor"
  ).replace(/^(dr\.?|dr)\s+/i, "");

  const doctorInitials = cleanDoctorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      mobileSheet
      className="w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden font-sans"
    >
      <UIModalHeader>
        <div className="flex items-center gap-2">
          <UIModalTitle>{title}</UIModalTitle>
          <UIBadge
            variant={isCreate ? "info" : isEdit ? "warning" : "success"}
            size="sm"
          >
            {isCreate ? "NEW RECORD" : isEdit ? "EDITING" : "VERIFIED"}
          </UIBadge>
        </div>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        {serverError && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW MODE
           ══════════════════════════════════════════════════════════════════ */}
        {isView && doctorData && (
          <div className="space-y-6">
            {/* Top Doctor Hero Card */}
            <div className="rounded-2xl border border-border/80 bg-linear-to-br from-primary/10 via-surface to-surface-alt/40 p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
                    {doctorInitials || "DR"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-bold text-text truncate">
                        {doctorData.name || "Unnamed Doctor"}
                      </h3>
                      {doctorData.doctorCode && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface border border-border px-2 py-0.5 text-xs font-mono font-semibold text-text-muted">
                          <Hash className="size-3" /> {doctorData.doctorCode}
                        </span>
                      )}
                      <UIBadge
                        variant={
                          doctorData.status === "active" ? "success" : "neutral"
                        }
                      >
                        {(doctorData.status || "active").toUpperCase()}
                      </UIBadge>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
                      <span className="font-semibold text-primary bg-primary/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="size-3" />{" "}
                        {doctorData.specialty || "General Physician"}
                      </span>
                      {doctorData.hospitalName && (
                        <span className="flex items-center gap-1 font-medium text-text">
                          <Building2 className="size-3.5 text-text-muted" />{" "}
                          {doctorData.hospitalName}
                        </span>
                      )}
                      {(doctorData.mobile || doctorData.phone) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              doctorData.mobile || doctorData.phone,
                              "mobile"
                            )
                          }
                          className="flex items-center gap-1 hover:text-primary transition cursor-pointer font-mono font-medium"
                        >
                          <Phone className="size-3.5" />{" "}
                          {doctorData.mobile || doctorData.phone}
                          {copiedKey === "mobile" ? (
                            <Check className="size-3 text-success" />
                          ) : (
                            <Copy className="size-3 text-text-muted" />
                          )}
                        </button>
                      )}
                      {doctorData.email && (
                        <button
                          type="button"
                          onClick={() => handleCopy(doctorData.email, "email")}
                          className="flex items-center gap-1 hover:text-primary transition cursor-pointer font-medium"
                        >
                          <Mail className="size-3.5" /> {doctorData.email}
                          {copiedKey === "email" ? (
                            <Check className="size-3 text-success" />
                          ) : (
                            <Copy className="size-3 text-text-muted" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <UIButton
                  variant="outline"
                  size="sm"
                  startIcon={<Edit2 className="size-3.5" />}
                  onClick={() => setCurrentMode("edit")}
                  className="shrink-0 self-start md:self-center"
                >
                  Edit Profile
                </UIButton>
              </div>
            </div>

            {/* 4 Clinical & Reference Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <span>Practicing Status</span>
                  <CheckCircle2 className="size-4 text-sky-500" />
                </div>
                <div className="mt-1.5 text-base font-bold text-text">
                  <UIBadge
                    variant={
                      doctorData.status === "active" ? "success" : "neutral"
                    }
                    size="sm"
                  >
                    {(doctorData.status || "active").toUpperCase()}
                  </UIBadge>
                </div>
                <div className="mt-1 text-[11px] text-text-muted">
                  POS prescription active
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <span>Specialty Domain</span>
                  <Award className="size-4 text-purple-600" />
                </div>
                <div className="mt-1.5 text-base font-bold text-text truncate">
                  {doctorData.specialty || "General Physician"}
                </div>
                <div className="mt-1 text-[11px] text-text-muted">
                  Clinical discipline
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <span>Medical Reg #</span>
                  <ShieldCheck className="size-4 text-emerald-600" />
                </div>
                <div className="mt-1.5 text-base font-bold text-text font-mono truncate">
                  {doctorData.registrationNumber || "Not Specified"}
                </div>
                <div className="mt-1 text-[11px] text-text-muted">
                  Medical Council Registration
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <span>Prescription Scope</span>
                  <Clock className="size-4 text-amber-500" />
                </div>
                <div className="mt-1.5 text-base font-bold text-text">
                  Company-Wide
                </div>
                <div className="mt-1 text-[11px] text-text-muted">
                  Available in all branches
                </div>
              </div>
            </div>

            {/* Detailed Key Value List */}
            <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-2.5">
                Professional & Contact Profile
              </h4>
              <UIKeyValueList
                items={[
                  {
                    label: "Doctor Full Name",
                    value: doctorData.name || "N/A",
                  },
                  {
                    label: "Medical Registration #",
                    value:
                      doctorData.registrationNumber || "Unregistered / OTC",
                    copyable: Boolean(doctorData.registrationNumber),
                  },
                  {
                    label: "Clinical Specialty",
                    value: doctorData.specialty || "General Practice",
                  },
                  {
                    label: "Affiliated Hospital / Clinic",
                    value:
                      doctorData.hospitalName || "Private Practice / Independent",
                  },
                  {
                    label: "Clinic / Hospital Address",
                    value: doctorData.address || "No address documented",
                  },
                  {
                    label: "Mobile Contact",
                    value: doctorData.mobile || doctorData.phone || "None",
                    copyable: Boolean(
                      doctorData.mobile || doctorData.phone
                    ),
                  },
                  {
                    label: "Email Address",
                    value: doctorData.email || "None",
                    copyable: Boolean(doctorData.email),
                  },
                  {
                    label: "Registered On",
                    value: doctorData.createdAt
                      ? new Date(doctorData.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Recently",
                  },
                ]}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CREATE / EDIT MODE
           ══════════════════════════════════════════════════════════════════ */}
        {!isView && (
          <form
            id="doctor-dialog-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Live Interactive Card Header */}
            <DoctorCardPreview
              name={formData.name}
              hospitalName={formData.hospitalName}
              specialty={
                formData.specialty === "Other"
                  ? formData.customSpecialty
                  : formData.specialty
              }
              registrationNumber={formData.registrationNumber}
              mobile={formData.mobile}
              status={formData.status}
            />

            {/* SECTION 1: Professional Identity */}
            <div className="rounded-2xl border border-border/80 bg-surface-alt/40 p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                    Doctor Identity & Specialty
                  </h3>
                  <p className="text-xs text-text-muted">
                    Full name, clinical specialty, and affiliated hospital / medical council info
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <UIInput
                    label="Doctor Full Name *"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    error={Boolean(formErrors.name)}
                    helperText={
                      formErrors.name ||
                      "Doctor's name as it appears on medical prescriptions"
                    }
                    required
                    size="md"
                  />
                </div>

                <UISelect
                  label="Medical Specialty"
                  value={formData.specialty}
                  onChange={(val) => handleFieldChange("specialty", val)}
                  options={DOCTOR_SPECIALTIES}
                  required
                  size="md"
                />

                {formData.specialty === "Other" && (
                  <div className="sm:col-span-3">
                    <UIInput
                      label="Specify Specialty *"
                      placeholder="e.g. Pulmonologist / Nephrologist"
                      value={formData.customSpecialty}
                      onChange={(e) =>
                        handleFieldChange("customSpecialty", e.target.value)
                      }
                      error={Boolean(formErrors.customSpecialty)}
                      helperText={formErrors.customSpecialty}
                      required
                      size="md"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <UIInput
                    label="Affiliated Hospital / Clinic Name"
                    placeholder="e.g. Apollo Hospital / LifeCare Clinic"
                    value={formData.hospitalName}
                    onChange={(e) =>
                      handleFieldChange("hospitalName", e.target.value)
                    }
                    size="md"
                  />
                </div>

                <UIInput
                  label="Registration # (MCI / Council No.)"
                  placeholder="e.g. MCI-2019-89745"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    handleFieldChange(
                      "registrationNumber",
                      e.target.value.toUpperCase()
                    )
                  }
                  size="md"
                />
              </div>
            </div>

            {/* SECTION 2: Premises & Contact Details */}
            <div className="rounded-2xl border border-border/80 bg-surface-alt/40 p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                    Premises & Contact Details
                  </h3>
                  <p className="text-xs text-text-muted">
                    Hospital address, phone contact, and operational practicing status
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <UIInput
                    label="Clinic / Hospital Address"
                    placeholder="e.g. 104 Medical Enclave, Civil Lines, Nagpur"
                    value={formData.address}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    size="md"
                  />
                </div>

                <UIInput
                  label="Mobile Number (Optional)"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange("mobile", e.target.value)}
                  error={Boolean(formErrors.mobile)}
                  helperText={
                    formErrors.mobile ||
                    "10-digit mobile number for communication"
                  }
                  size="md"
                />

                <UIInput
                  label="Email Address (Optional)"
                  placeholder="doctor@hospital.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  size="md"
                />

                <div className="sm:col-span-2">
                  <UISelect
                    label="Practicing Status"
                    value={formData.status}
                    onChange={(val) => handleFieldChange("status", val)}
                    options={statusOptions}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </UIModalBody>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <UIModalFooter className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between">
        {isView ? (
          <>
            <UIButton variant="outline" onClick={onClose}>
              Close
            </UIButton>
            <UIButton
              variant="primary"
              startIcon={<Edit2 className="size-3.5" />}
              onClick={() => setCurrentMode("edit")}
            >
              Edit Details
            </UIButton>
          </>
        ) : (
          <>
            <UIButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </UIButton>
            <div className="flex items-center gap-2">
              <UIButton
                type="submit"
                form="doctor-dialog-form"
                variant="primary"
                isLoading={isSubmitting}
                loadingText={currentMode === "edit" ? "Saving..." : "Creating..."}
              >
                {currentMode === "edit" ? "Update Doctor" : "Create Doctor"}
              </UIButton>
            </div>
          </>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

// Named alias wrappers
export const CreateDoctorDialog = (props) => (
  <DoctorDialog {...props} mode="create" />
);

export const EditDoctorDialog = (props) => (
  <DoctorDialog {...props} mode="edit" />
);

export const ViewDoctorDialog = (props) => (
  <DoctorDialog {...props} mode="view" />
);

export default DoctorDialog;
