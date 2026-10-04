import React, { useState, useEffect } from "react";
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
      label: "Row",
      render: (_, row) => <span className="text-xs text-text-muted">{row.rowNumber}</span>
    },
    {
      id: "status",
      key: "isValid",
      label: "Status",
      render: (_, row) => (
        row.isValid ? 
        <span className="inline-flex items-center gap-1 text-success text-xs font-semibold">
          <CheckCircle2 className="size-3.5" /> Valid
        </span> : 
        <span className="inline-flex items-center gap-1 text-error text-xs font-semibold">
          <XCircle className="size-3.5" /> Error
        </span>
      )
    },
    {
      id: "customer",
      key: "data.name",
      label: "Customer Name",
      render: (_, row) => (
        <span className="font-semibold text-[13px] block min-w-[150px]">{row.data.name || "-"}</span>
      )
    },
    {
      id: "invoiceNo",
      key: "data.invoiceNumber",
      label: "Invoice No",
      render: (_, row) => (
        <span className="text-xs font-mono">{row.data.invoiceNumber || "-"}</span>
      )
    },
    {
      id: "invoiceDate",
      key: "data.invoiceDate",
      label: "Date",
      render: (_, row) => (
        <span className="text-xs">{row.data.invoiceDate || "-"}</span>
      )
    },
    {
      id: "billAmount",
      key: "data.billAmount",
      label: "Bill Amount",
      render: (_, row) => (
        <span className="text-xs">
          ₹{(row.data.billAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      id: "balance",
      key: "data.openingBalance",
      label: "Outstanding",
      render: (_, row) => (
        <span className="text-xs font-semibold text-rose-600">
          ₹{(row.data.openingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} DR
        </span>
      )
    },
    {
      id: "dueDays",
      key: "data.dueDays",
      label: "Due Days",
      render: (_, row) => (
        <span className="text-xs">{row.data.dueDays || 0}</span>
      )
    },
    {
      id: "errors",
      key: "errors",
      label: "Issues",
      render: (_, row) => (
        row.errors && row.errors.length > 0 ? (
          <div className="flex flex-col gap-1 min-w-[150px]">
            {row.errors.map((err, idx) => (
              <span key={idx} className="text-[11px] text-error flex items-center gap-1 leading-tight">
                <AlertCircle className="size-3 shrink-0" /> {err}
              </span>
            ))}
          </div>
        ) : <span className="text-[11px] text-text-muted">None</span>
      )
    }
  ];

  return (
    <UIModal isOpen={isOpen} onClose={!isConfirming ? onClose : undefined} className="max-w-[95vw]">
      <UIModalHeader>
        <UIModalTitle>Import Outstanding Invoices Preview</UIModalTitle>
        <UIModalDescription>
          Review parsed outstanding invoices. Only valid non-duplicate rows will be imported as Historical Credit Sales.
        </UIModalDescription>
      </UIModalHeader>
      
      <UIModalBody className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-4 py-2">
          {error && (
            <UIAlert intent="danger" title="Import Error" description={error} />
          )}

          <div className="flex gap-4 mb-2">
            <div className="bg-surface-alt px-4 py-2 rounded-lg border border-border flex flex-col items-center">
              <span className="text-xl font-bold text-text">{localData.length}</span>
              <span className="text-xs font-semibold text-text-muted uppercase">Total Rows</span>
            </div>
            <div className="bg-success/10 px-4 py-2 rounded-lg border border-success/20 flex flex-col items-center">
              <span className="text-xl font-bold text-success">{validRows.length}</span>
              <span className="text-xs font-semibold text-success uppercase">Valid Invoices</span>
            </div>
            <div className="bg-error/10 px-4 py-2 rounded-lg border border-error/20 flex flex-col items-center">
              <span className="text-xl font-bold text-error">{invalidRows.length}</span>
              <span className="text-xs font-semibold text-error uppercase">Skipped/Invalid</span>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-x-auto">
            <div className="min-w-max">
              <AppTable
                columns={columns}
                rows={localData}
                hover
                bordered={false}
              />
            </div>
          </div>
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
