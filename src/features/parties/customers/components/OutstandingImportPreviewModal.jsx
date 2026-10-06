import React, { useState, useEffect, useMemo } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert
} from "@/components/ui";
import { AppTable } from "@/components";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import customerService from "../services/customerService";
import { formatCurrency } from "@/utils";

const OutstandingImportPreviewModal = ({
  isOpen,
  onClose,
  previewData,
  onImportSuccess,
  importType
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(previewData || []);
  }, [previewData]);

  const validRows = localData.filter((row) => row.isValid);
  const invalidRows = localData.filter((row) => !row.isValid);

  const groupedCustomers = useMemo(() => {
    const map = new Map();
    localData.forEach(row => {
      const name = row.data?.name || "Unknown Customer";
      if (!map.has(name)) {
        map.set(name, {
          customerName: name,
          status: row.isValid ? "VALID" : "INVALID",
          totalInvoices: 0,
          validInvoices: 0,
          totalBillAmount: 0,
          totalOutstanding: 0,
          errors: new Set(),
          suggestedCustomer: row.suggestedCustomer || null
        });
      }
      const group = map.get(name);
      group.totalInvoices += 1;
      
      const billAmt = row.data?.billAmount || 0;
      const outAmt = row.data?.openingBalance || 0;
      
      group.totalBillAmount += billAmt;
      group.totalOutstanding += outAmt;

      if (row.isValid) {
        group.validInvoices += 1;
        if (group.status === "INVALID") group.status = "PARTIAL";
      } else {
        if (group.status === "VALID") group.status = "PARTIAL";
        if (row.errors) {
          row.errors.forEach(e => group.errors.add(e));
        }
      }
    });
    
    return Array.from(map.values()).map((g, i) => ({ 
      ...g, 
      rowNumber: i + 1,
      errors: Array.from(g.errors)
    }));
  }, [localData]);

  const handleAcceptSuggestion = (originalName, suggestedCustomer) => {
    setLocalData(prev => prev.map(row => {
      if (row.data.name === originalName && row.suggestedCustomer === suggestedCustomer) {
        const newErrors = row.errors.filter(e => !e.includes("Did you mean"));
        return {
          ...row,
          isValid: newErrors.length === 0,
          errors: newErrors,
          suggestedCustomer: null,
          data: {
            ...row.data,
            name: suggestedCustomer
          }
        };
      }
      return row;
    }));
  };

  const totalOutstandingToImport = useMemo(() => {
    return validRows.reduce((sum, row) => sum + (row.data.openingBalance || 0), 0);
  }, [validRows]);

  const handleConfirm = async () => {
    if (validRows.length === 0) return;
    
    setIsConfirming(true);
    setError("");

    try {
      const invoicesToImport = validRows.map(row => row.data);
      const res = await customerService.confirmImport(invoicesToImport, importType);
      
      const { successful, failed, errors } = res.data?.data || {};
      onImportSuccess(successful, failed, errors);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to import outstanding invoices. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const columns = [
    {
      id: "row",
      key: "rowNumber",
      label: "#",
      render: (_, row) => <span className="text-xs text-text-muted">{row.rowNumber}</span>
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      render: (_, row) => {
        if (row.validInvoices === row.totalInvoices && row.totalInvoices > 0) {
          return <span className="inline-flex items-center gap-1 text-success text-xs font-semibold"><CheckCircle2 className="size-3.5" /> Valid</span>;
        } else if (row.validInvoices === 0) {
          return <span className="inline-flex items-center gap-1 text-error text-xs font-semibold"><XCircle className="size-3.5" /> Error</span>;
        } else {
          return <span className="inline-flex items-center gap-1 text-warning text-xs font-semibold"><AlertCircle className="size-3.5" /> Partial</span>;
        }
      }
    },
    {
      id: "customer",
      key: "customerName",
      label: "Customer Name",
      render: (_, row) => (
        <span className="font-semibold text-[13px] block min-w-[150px]">{row.customerName || "-"}</span>
      )
    },
    {
      id: "totalInvoices",
      key: "totalInvoices",
      label: "Total Invoices",
      render: (_, row) => <span className="text-xs font-medium">{row.totalInvoices}</span>
    },
    {
      id: "validInvoices",
      key: "validInvoices",
      label: "Valid Invoices",
      render: (_, row) => <span className="text-xs font-medium text-success">{row.validInvoices}</span>
    },
    {
      id: "totalOutstanding",
      key: "totalOutstanding",
      label: "Total Outstanding",
      render: (_, row) => (
        <span className="text-xs font-semibold text-rose-600">
          {formatCurrency(row.totalOutstanding)} DR
        </span>
      )
    },
    {
      id: "errors",
      key: "errors",
      label: "Issues",
      render: (_, row) => (
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          {row.errors && row.errors.length > 0 ? (
            <div className="flex flex-col gap-1">
              {row.errors.map((err, idx) => (
                <span key={idx} className="text-[11px] text-error flex items-center gap-1 leading-tight">
                  <AlertCircle className="size-3 shrink-0" /> {err}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-text-muted">None</span>
          )}
          {row.suggestedCustomer && (
            <label className="flex items-center gap-1.5 mt-0.5 cursor-pointer hover:bg-surface-elevated p-1 -ml-1 rounded transition-colors w-fit">
              <input 
                type="checkbox" 
                className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" 
                onChange={() => handleAcceptSuggestion(row.customerName, row.suggestedCustomer)} 
              />
              <span className="text-[11px] font-semibold text-primary">Yes, use "{row.suggestedCustomer}"</span>
            </label>
          )}
        </div>
      )
    }
  ];

  return (
    <UIModal isOpen={isOpen} onClose={!isConfirming ? onClose : undefined} className="max-w-6xl w-full h-[90vh] flex flex-col">
      <UIModalHeader>
        <UIModalTitle>Import Outstanding Invoices Preview</UIModalTitle>
        <UIModalDescription>
          Review parsed outstanding invoices grouped by customer. Only valid non-duplicate rows will be imported as Historical Credit Sales.
        </UIModalDescription>
      </UIModalHeader>
      
      <UIModalBody className="flex-1 overflow-hidden flex flex-col gap-4">
        {error && (
          <UIAlert intent="danger" title="Import Error" description={error} />
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Total Invoices</p>
            <p className="text-xl font-bold text-text mt-1">{localData.length}</p>
          </div>
          <div className="bg-success/10 p-4 rounded-xl border border-success/20">
            <p className="text-xs text-success font-medium">Valid Invoices</p>
            <p className="text-xl font-bold text-success mt-1">{validRows.length}</p>
          </div>
          <div className="bg-error/10 p-4 rounded-xl border border-error/20">
            <p className="text-xs text-error font-medium">Skipped/Invalid</p>
            <p className="text-xl font-bold text-error mt-1">{invalidRows.length}</p>
          </div>
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Unique Customers</p>
            <p className="text-xl font-bold text-text mt-1">{groupedCustomers.length}</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 col-span-2">
            <p className="text-xs text-primary font-medium">Valid Outstanding to Import</p>
            <p className="text-lg font-bold text-primary mt-1">{formatCurrency(totalOutstandingToImport)} DR</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-surface border border-border rounded-xl shadow-sm flex flex-col">
          <AppTable
            columns={columns}
            rows={groupedCustomers}
            getRowId={(row) => row.rowNumber}
            isLoading={false}
            sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
            containerSx={{ flex: 1, minHeight: 0 }}
            stickyHeader
          />
        </div>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose} disabled={isConfirming}>
          Cancel
        </UIButton>
        <UIButton 
          variant="primary" 
          onClick={handleConfirm} 
          disabled={validRows.length === 0 || isConfirming}
        >
          {isConfirming ? "Importing..." : `Import ${validRows.length} Invoices`}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default OutstandingImportPreviewModal;


