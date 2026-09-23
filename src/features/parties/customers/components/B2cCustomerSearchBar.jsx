// src/features/parties/customers/components/B2cCustomerSearchBar.jsx

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import { Search, X, Loader2, User, Phone, Stethoscope, CreditCard, Plus, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import customerService from "../services/customerService";
import { POS_DEFAULT_CUSTOMERS } from "@/features/sales/constants/salesData";

/**
 * B2cCustomerSearchBar
 * Dedicated search bar for B2C Retail Customers & Patients (excluding Wholesalers & Retailers).
 * Supports real-time debounced search by customer name, phone, email, or doctor name.
 */
export const B2cCustomerSearchBar = forwardRef(
  (
    {
      value: controlledValue,
      selectedCustomer,
      onSelectCustomer,
      placeholder = "Search B2C customer by name, phone, or doctor...",
      size = "md", // "sm" | "md" | "lg"
      debounceMs = 250,
      disabled = false,
      autoFocus = false,
      showAddNewAction = true,
      onAddNewCustomer,
      className = "",
      inputClassName = "",
      dropdownClassName = "",
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [searchTerm, setSearchTerm] = useState(selectedCustomer?.name || "");
    const currentValue = isControlled ? controlledValue : searchTerm;

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: handleClear,
      input: inputRef.current,
    }));

    // Local & API B2C Customer Filter (excluding wholesalers & retailers)
    const executeSearch = useCallback(
      async (query) => {
        setIsLoading(true);

        const q = (query || "").trim().toLowerCase();

        // 1. Filter local B2C retail customers
        const localMatches = POS_DEFAULT_CUSTOMERS.filter((cust) => {
          // Exclude any wholesaler or retailer parties
          const partyType = (cust.partyType || "").toLowerCase();
          if (partyType === "wholesaler" || partyType === "retailer") {
            return false;
          }

          if (!q) return true;

          const nameMatch = cust.name?.toLowerCase().includes(q);
          const phoneMatch = cust.phone?.toLowerCase().includes(q);
          const docMatch = cust.doctor?.toLowerCase().includes(q);
          const emailMatch = cust.email?.toLowerCase().includes(q);

          return nameMatch || phoneMatch || docMatch || emailMatch;
        });

        let apiResults = [];
        try {
          if (q) {
            const res = await customerService.getCustomers({ search: q, limit: 10 });
            const list = res.data?.data?.customers || res.data?.customers || res.data?.data || [];
            if (Array.isArray(list)) {
              // Filter out wholesaler and retailer parties from API response
              apiResults = list.filter((c) => {
                const type = (c.customerType || c.partyType || c.type || "").toLowerCase();
                return type !== "wholesale" && type !== "wholesaler" && type !== "retail" && type !== "retailer";
              });
            }
          }
        } catch (err) {
          // Fallback gracefully to local matches if backend offline
          console.warn("API Customer search fallback to local:", err);
        }

        // Combine local and API results removing duplicates
        const combined = [...localMatches];
        apiResults.forEach((apiCust) => {
          if (!combined.some((c) => c.id === apiCust._id || c.id === apiCust.id || c.phone === apiCust.phone)) {
            combined.push({
              id: apiCust._id || apiCust.id,
              name: apiCust.name || apiCust.displayName,
              phone: apiCust.phone || apiCust.mobile || "",
              email: apiCust.email || "",
              doctor: apiCust.doctor || apiCust.prescribingDoctor || "Dr. Self",
              creditBalance: apiCust.creditBalance || apiCust.balance || 0,
              billingType: "B2C",
            });
          }
        });

        setResults(combined);
        setIsLoading(false);
      },
      []
    );

    // Initial load and query change effect
    useEffect(() => {
      const timer = setTimeout(() => {
        executeSearch(currentValue);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [currentValue, debounceMs, executeSearch]);

    // Keep input text synced with selected customer if not actively typing
    useEffect(() => {
      if (selectedCustomer && !isOpen) {
        setSearchTerm(selectedCustomer.name);
      }
    }, [selectedCustomer, isOpen]);

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
      const val = e.target.value;
      if (!isControlled) {
        setSearchTerm(val);
      }
      setIsOpen(true);
      setSelectedIndex(-1);
    };

    const handleClear = () => {
      if (!isControlled) {
        setSearchTerm("");
      }
      setSelectedIndex(-1);
      setIsOpen(true);
      inputRef.current?.focus();
    };

    const handleSelect = (customer) => {
      if (!isControlled) {
        setSearchTerm(customer.name);
      }
      setIsOpen(false);
      if (onSelectCustomer) {
        onSelectCustomer(customer);
      }
    };

    const handleKeyDown = (e) => {
      if (!isOpen && e.key === "ArrowDown") {
        setIsOpen(true);
        return;
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const sizeClasses = {
      sm: "h-8.5 text-xs px-2.5 rounded-lg",
      md: "h-10 text-sm px-3 rounded-xl",
      lg: "h-11.5 text-base px-3.5 rounded-xl",
    }[size] || "h-10 text-sm px-3 rounded-xl";

    return (
      <div ref={containerRef} className={cn("relative w-full select-none", className)}>
        {/* Search Input Box */}
        <div
          className={cn(
            "group relative flex items-center w-full bg-surface border border-border shadow-2xs transition-all duration-150 ease-out",
            "hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            disabled && "opacity-60 bg-surface-alt cursor-not-allowed pointer-events-none",
            sizeClasses,
            inputClassName
          )}
        >
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 shrink-0 mr-2.5">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <User className="size-4" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className="w-full h-full bg-transparent border-0 outline-none text-text placeholder:text-text-muted/60 font-medium"
          />

          {currentValue && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="p-1 text-text-muted hover:text-text rounded-md hover:bg-surface-hover transition-colors cursor-pointer ml-1.5"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results List */}
        {isOpen && (
          <div
            className={cn(
              "absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--app-shadow-xl)] animate-in fade-in-50 zoom-in-95 duration-100",
              dropdownClassName
            )}
          >
            {/* Dropdown Top Bar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-surface-alt/60 px-3.5 py-2 text-[11px] font-semibold text-text-muted">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <User className="size-3" /> Retail Customers & Patients (B2C)
              </span>
              <span className="text-[10px] text-text-muted/70">
                {results.length} found
              </span>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[280px] overflow-y-auto p-1.5 space-y-1">
              {results.length > 0 ? (
                results.map((cust, idx) => {
                  const isSelected = selectedCustomer?.id === cust.id || idx === selectedIndex;

                  return (
                    <div
                      key={cust.id || idx}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleSelect(cust)}
                      className={cn(
                        "group/item relative flex items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer border",
                        isSelected
                          ? "bg-primary-soft/60 border-primary/30 text-primary font-bold shadow-2xs"
                          : "border-transparent hover:bg-surface-hover text-text"
                      )}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors mt-0.5",
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          )}
                        >
                          <User className="size-4" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs truncate text-text group-hover/item:text-primary transition-colors">
                              {cust.name}
                            </span>
                            {cust.id === "cust-walkin" && (
                              <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                                Walk-In
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-text-muted mt-0.5">
                            {cust.phone && (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="size-3" /> {cust.phone}
                              </span>
                            )}
                            {cust.doctor && (
                              <span className="flex items-center gap-1 truncate max-w-[160px]">
                                <Stethoscope className="size-3 text-blue-500" /> {cust.doctor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {cust.creditBalance > 0 && (
                          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Due: ₹{cust.creditBalance}
                          </span>
                        )}
                        {isSelected && <Check className="size-4 text-primary" />}
                      </div>
                    </div>
                  );
                })
              ) : !isLoading ? (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold text-text">No B2C customer found</p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    No matching retail customer for &quot;{currentValue}&quot;
                  </p>

                  {showAddNewAction && (
                    <button
                      type="button"
                      onClick={() => {
                        const newCust = {
                          id: `cust-custom-${Date.now()}`,
                          name: currentValue || "New Customer",
                          phone: "",
                          doctor: "Dr. Self",
                          billingType: "B2C",
                        };
                        handleSelect(newCust);
                        if (onAddNewCustomer) onAddNewCustomer(currentValue);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <Plus className="size-3.5" /> Use &quot;{currentValue}&quot; as Customer
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
);

B2cCustomerSearchBar.displayName = "B2cCustomerSearchBar";
export default B2cCustomerSearchBar;
