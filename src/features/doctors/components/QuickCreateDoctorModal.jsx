import React, { useState, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UISelect,
} from "@/components/ui";
import { Stethoscope } from "lucide-react";
import doctorService from "../services/doctorService";
import { DOCTOR_SPECIALTIES } from "./DoctorDialog";

export const QuickCreateDoctorModal = ({
  open,
  onClose,
  defaultName = "",
  onSuccess,
}) => {
  const [name, setName] = useState(defaultName || "");
  const [specialty, setSpecialty] = useState("General Physician");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [mobile, setMobile] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setName(defaultName || "");
      setSpecialty("General Physician");
      setCustomSpecialty("");
      setHospitalName("");
      setMobile("");
      setRegistrationNumber("");
      setError(null);
    }
  }, [open, defaultName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Doctor name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const resolvedSpecialty =
      specialty === "Other" ? customSpecialty.trim() : specialty;

    const payload = {
      name: name.trim(),
      specialty: resolvedSpecialty || null,
      hospitalName: hospitalName.trim() || null,
      mobile: mobile.trim() || null,
      registrationNumber: registrationNumber.trim().toUpperCase() || null,
      status: "active",
    };

    try {
      const res = await doctorService.createDoctor(payload);
      const newDoctor = res.data?.data || res.data;
      if (onSuccess) onSuccess(newDoctor);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create doctor record"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={open} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <UIModalHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Stethoscope className="size-4" />
            </div>
            <div>
              <UIModalTitle>Quick Add Doctor</UIModalTitle>
              <UIModalDescription>
                Register a new prescribing physician to proceed with billing
              </UIModalDescription>
            </div>
          </div>
        </UIModalHeader>

        <UIModalBody className="space-y-4 p-5">
          {error && (
            <div className="p-3 rounded-xl bg-error-soft/60 border border-error/30 text-error text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 1. Doctor Name (Required) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Doctor Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma"
              required
              autoFocus
              className="w-full h-9 rounded-lg border border-border px-3 text-sm bg-surface text-text focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-text-muted/50"
            />
          </div>

          {/* 2. Specialty */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Clinical Specialty
            </label>
            <UISelect
              value={specialty}
              onChange={(val) => setSpecialty(val)}
              options={DOCTOR_SPECIALTIES}
              size="sm"
            />
          </div>

          {specialty === "Other" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Specify Specialty *
              </label>
              <input
                type="text"
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                placeholder="e.g. Pulmonologist"
                required
                className="w-full h-9 rounded-lg border border-border px-3 text-sm bg-surface text-text focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>
          )}

          {/* 3. Hospital / Clinic Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Hospital / Clinic Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g. Apollo Hospital / City Clinic"
              className="w-full h-9 rounded-lg border border-border px-3 text-sm bg-surface text-text focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-text-muted/50"
            />
          </div>

          {/* 4. Mobile & Registration Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Mobile
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Optional"
                className="w-full h-9 rounded-lg border border-border px-3 text-sm bg-surface text-text focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-text-muted/50 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Reg #
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) =>
                  setRegistrationNumber(e.target.value.toUpperCase())
                }
                placeholder="MCI / State"
                className="w-full h-9 rounded-lg border border-border px-3 text-sm bg-surface text-text uppercase focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-text-muted/50 font-mono"
              />
            </div>
          </div>
        </UIModalBody>

        <UIModalFooter className="p-4 bg-surface border-t border-border flex items-center justify-between">
          <UIButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </UIButton>
          <UIButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Creating..."
            disabled={isSubmitting || !name.trim()}
          >
            Save & Select Doctor
          </UIButton>
        </UIModalFooter>
      </form>
    </UIModal>
  );
};

export default QuickCreateDoctorModal;
