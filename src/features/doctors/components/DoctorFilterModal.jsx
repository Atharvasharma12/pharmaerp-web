import React from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UISelect,
  UIButton,
} from "@/components/ui";
import { Filter, Award, CheckCircle2, ArrowUpDown } from "lucide-react";
import { DOCTOR_SPECIALTIES } from "./DoctorDialog";

export const SPECIALTY_FILTER_OPTIONS = [
  { label: "All Specialties", value: "all" },
  ...DOCTOR_SPECIALTIES.map((s) => ({ label: s.label, value: s.value })),
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Active Practitioners", value: "active" },
  { label: "Inactive / On Leave", value: "inactive" },
];

export const SORT_SELECT_OPTIONS = [
  { label: "Newest First", value: "createdAt-desc" },
  { label: "Oldest First", value: "createdAt-asc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

export const DoctorFilterModal = ({
  isOpen,
  onClose,
  selectedSpecialty = "all",
  onChangeSpecialty,
  selectedStatus = "all",
  onChangeStatus,
  sortOption = "createdAt-desc",
  onChangeSort,
  onReset,
}) => {
  return (
    <UIModal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <UIModalHeader>
        <UIModalTitle className="flex items-center gap-2 text-base font-bold text-text">
          <Filter className="size-4.5 text-primary" />
          Filter & Sort Doctors
        </UIModalTitle>
        <UIModalDescription>
          Configure clinical specialty domains, practicing availability, and sorting sequence.
        </UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4 py-2">
          {/* 1. Clinical Specialty */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="size-3.5 text-primary" /> Clinical Specialty
              </span>
              {selectedSpecialty !== "all" && (
                <span className="text-[11px] text-primary font-bold">Active Filter</span>
              )}
            </label>
            <UISelect
              value={selectedSpecialty}
              onChange={(val) => onChangeSpecialty && onChangeSpecialty(val)}
              options={SPECIALTY_FILTER_OPTIONS}
              placeholder="All Specialties"
              size="md"
            />
          </div>

          {/* 2. Practicing Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Practicing Status
              </span>
              {selectedStatus !== "all" && (
                <span className="text-[11px] text-primary font-bold">Active Filter</span>
              )}
            </label>
            <UISelect
              value={selectedStatus}
              onChange={(val) => onChangeStatus && onChangeStatus(val)}
              options={STATUS_FILTER_OPTIONS}
              placeholder="All Statuses"
              size="md"
            />
          </div>

          {/* 3. Sort Sequence */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="size-3.5 text-purple-600" /> Sort Sequence
              </span>
              {sortOption !== "createdAt-desc" && (
                <span className="text-[11px] text-primary font-bold">Custom Sort</span>
              )}
            </label>
            <UISelect
              value={sortOption}
              onChange={(val) => onChangeSort && onChangeSort(val)}
              options={SORT_SELECT_OPTIONS}
              placeholder="Sort Sequence"
              size="md"
            />
          </div>
        </div>
      </UIModalBody>

      <UIModalFooter className="flex items-center justify-between">
        <UIButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (onReset) onReset();
          }}
          className="text-text-muted hover:text-text text-xs"
        >
          Reset Filters
        </UIButton>
        <UIButton
          type="button"
          variant="primary"
          size="sm"
          onClick={onClose}
          className="px-4 text-xs font-semibold shadow-xs"
        >
          Apply Filters
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default DoctorFilterModal;
