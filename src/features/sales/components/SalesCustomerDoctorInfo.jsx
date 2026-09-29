import React, { useRef } from "react";
import { B2cCustomerSearchBar } from "@/features/parties/customers/components/B2cCustomerSearchBar";

export const SalesCustomerDoctorInfo = ({
  selectedCustomer,
  onSelectCustomer,
  customerName,
  onChangeCustomerName,
  customerPhone,
  onChangeCustomerPhone,
  doctorName,
  onChangeDoctorName,
  saleDate,
  onChangeSaleDate,
  onAddNewCustomer,
}) => {
  const searchBarRef = useRef(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full items-end">
      {/* 1. Name / Search */}
      <div className="w-full">
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
          Patient / Customer Name *
        </span>
        <B2cCustomerSearchBar
          ref={searchBarRef}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={(cust) => {
            onSelectCustomer(cust);
            if (cust?.name && !customerName) {
              onChangeCustomerName(cust.name);
            }
            if (cust?.phone && !customerPhone) {
              onChangeCustomerPhone(cust.phone);
            }
          }}
          onInputChange={(val) => {
            if (selectedCustomer) {
               onSelectCustomer(null);
            }
            onChangeCustomerName(val);
          }}
          showAddNewAction={true}
          onAddNewCustomer={onAddNewCustomer}
          placeholder="Search name or type new..."
          size="sm"
        />
      </div>

      {/* 2. Phone */}
      <div className="w-full">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Phone Number
        </span>
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => onChangeCustomerPhone(e.target.value)}
          className="w-full h-[38px] rounded-xl border border-border px-3 text-sm bg-surface text-text shadow-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-shadow"
          placeholder="10-digit number"
        />
      </div>

      {/* 3. Doctor */}
      <div className="w-full">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Doctor Name
        </span>
        <input
          type="text"
          value={doctorName}
          onChange={(e) => onChangeDoctorName(e.target.value)}
          className="w-full h-[38px] rounded-xl border border-border px-3 text-sm bg-surface text-text shadow-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-shadow"
          placeholder="Dr. Name"
        />
      </div>

      {/* 4. Date */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Sale Date
          </span>
          <input
            type="date"
            value={saleDate}
            readOnly
            disabled
            className="w-full h-[38px] rounded-xl border border-border px-3 text-sm bg-surface-alt text-text-muted shadow-sm outline-none cursor-not-allowed"
          />
        </div>
        <div className="text-xs text-text-muted shrink-0 text-right bg-surface-alt/70 px-3 h-[38px] flex flex-col justify-center rounded-xl border border-border/60">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted leading-tight">
            Mode
          </span>
          <span className="font-bold text-text leading-tight">B2C</span>
        </div>
      </div>
    </div>
  );
};
