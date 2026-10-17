import React from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Stethoscope,
  Building2,
  Award,
  Phone,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Hash,
} from "lucide-react";
import {
  UIButton,
  UIInput,
  UIBadge,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
} from "@/components/ui";

const getInitials = (name) => {
  if (!name) return "DR";
  const clean = name.replace(/^(dr\.?|dr)\s+/i, "");
  return clean
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const DoctorsMobilePage = ({
  doctors = [],
  total = 0,
  page = 1,
  limit = 20,
  totalPages = 1,
  summary = {},
  isLoading = false,
  filters = {},
  onSearchChange,
  onSpecialtyChange,
  onStatusChange,
  onRefresh,
  onPageChange,
  onOpenCreateDialog,
  onOpenEditDialog,
  onOpenViewDialog,
  onOpenDeleteConfirm,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
      {/* ── HEADER & SEARCH ───────────────────────────────────────── */}
      <div className="p-4 border-b border-border bg-surface shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
              <Stethoscope className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">Doctors</h2>
              <p className="text-[11px] text-text-muted">
                {Number(summary.totalDoctors || total || 0).toLocaleString("en-IN")} Registered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isLoading}
              className="size-8 p-0 flex items-center justify-center"
            >
              <RefreshCw className="size-3.5" />
            </UIButton>
            <UIButton
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-3.5" />}
              onClick={onOpenCreateDialog}
              className="h-8 px-3 text-xs"
            >
              Add
            </UIButton>
          </div>
        </div>

        {/* Search */}
        <UIInput
          placeholder="Search doctor, hospital, reg #..."
          value={filters.search || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          startIcon={<Search className="size-4 text-text-muted" />}
          size="sm"
          className="h-9 text-xs"
        />

        {/* Quick status filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onStatusChange(item.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                (filters.status || "all") === item.value
                  ? "bg-primary text-white"
                  : "bg-surface-alt text-text-muted hover:bg-surface-hover"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CARD LIST ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-xs text-text-muted">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-surface-alt/40 space-y-3">
            <div className="size-12 rounded-2xl bg-sky-500/10 text-sky-600 mx-auto flex items-center justify-center">
              <Stethoscope className="size-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">No doctors found</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Add a prescribing doctor for instant billing lookup
              </p>
            </div>
            <UIButton variant="primary" size="sm" onClick={onOpenCreateDialog}>
              Add Doctor
            </UIButton>
          </div>
        ) : (
          doctors.map((doctor) => {
            const id = doctor._id || doctor.id;
            const initials = getInitials(doctor.name);

            return (
              <div
                key={id}
                onClick={() => onOpenViewDialog(doctor)}
                className="p-4 rounded-2xl border border-border bg-surface shadow-2xs hover:border-sky-500/30 transition-all active:scale-[0.99] cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-sky-500/10 text-sky-600 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-500/20">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-text truncate">
                        {doctor.name}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono flex items-center gap-1 mt-0.5">
                        <span>{doctor.doctorCode || "DOC"}</span>
                        {doctor.registrationNumber && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">
                              {doctor.registrationNumber}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <UIBadge
                      variant={doctor.status === "active" ? "success" : "neutral"}
                      size="sm"
                    >
                      {(doctor.status || "active").toUpperCase()}
                    </UIBadge>

                    <UIDropdown>
                      <UIDropdownTrigger asChild>
                        <UIButton
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0 flex items-center justify-center text-text-muted"
                        >
                          <MoreVertical className="size-4" />
                        </UIButton>
                      </UIDropdownTrigger>
                      <UIDropdownMenu align="end" className="w-36">
                        <UIDropdownItem
                          icon={<Eye className="size-4" />}
                          onClick={() => onOpenViewDialog(doctor)}
                        >
                          View
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Edit3 className="size-4" />}
                          onClick={() => onOpenEditDialog(doctor)}
                        >
                          Edit
                        </UIDropdownItem>
                        <UIDropdownDivider />
                        <UIDropdownItem
                          icon={<Trash2 className="size-4" />}
                          destructive
                          onClick={() => onOpenDeleteConfirm(doctor)}
                        >
                          Delete
                        </UIDropdownItem>
                      </UIDropdownMenu>
                    </UIDropdown>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted pt-1 border-t border-border/50">
                  <span className="inline-flex items-center gap-1 font-medium text-sky-700 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md text-[11px]">
                    <Award className="size-3" />
                    {doctor.specialty || "General"}
                  </span>

                  {doctor.hospitalName && (
                    <span className="flex items-center gap-1 text-[11px] text-text-muted truncate max-w-[150px]">
                      <Building2 className="size-3" />
                      {doctor.hospitalName}
                    </span>
                  )}

                  {doctor.mobile && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted ml-auto">
                      <Phone className="size-3" />
                      {doctor.mobile}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── MOBILE PAGINATION ─────────────────────────────────────── */}
      {!isLoading && total > 0 && (
        <div className="p-3 border-t border-border bg-surface flex items-center justify-between text-xs text-text-muted shrink-0">
          <div>
            Page {page} of {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-7 text-xs px-2.5"
            >
              Prev
            </UIButton>
            <UIButton
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-7 text-xs px-2.5"
            >
              Next
            </UIButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsMobilePage;
