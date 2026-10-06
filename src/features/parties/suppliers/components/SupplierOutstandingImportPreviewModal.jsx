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
import supplierService from "../services/supplierService";
import { formatCurrency, formatDate } from "@/utils";

const SupplierOutstandingImportPreviewModal = ({
  isOpen,
  onClose,
  previewData,
  onImportSuccess
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(previewData || []);
  }, [previewData]);

  const validRows = localData.filter((row) => row.isValid);
  const invalidRows = localData.filter((row) => !row.isValid);
  const duplicatesInFile = localData.filter(r => r.status === "DUPLICATE_IN_FILE").length;
  const alreadyImported = localData.filter(r => r.status === "ALREADY_IMPORTED").length;
  const missingSuppliers = localData.filter(r => r.status === "SUPPLIER_NOT_FOUND").length;
  const debitTransactions = localData.filter(r => r.status === "DEBIT_TRANSACTION").length;

  const totalAmountToImport = useMemo(() => {
    return validRows.reduce((sum, row) => sum + (row.data.amount || 0), 0);
  }, [validRows]);

  const handleConfirm = async () => {
    if (validRows.length === 0) return;
    
    setIsConfirming(true);
    setError("");

    try {
      const transactionsToImport = validRows.map(row => row.data);
      const res = await supplierService.confirmImport(transactionsToImport, "outstanding");
      
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
      label: "Row",
      key: "rowNumber",
      render: (val) => <span className="text-text-muted">{val}</span>,
    },
    {
      label: "Status",
      key: "isValid",
      render: (val, row) => {
        if (row.isValid) {
          return (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="size-4" />
              <span className="font-medium">Valid</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1.5 text-danger">
            <XCircle className="size-4" />
            <span className="font-medium">
              {row.status === "SUPPLIER_NOT_FOUND" ? "Not Found" : 
               row.status === "ALREADY_IMPORTED" ? "Already Imported" : 
               row.status === "DUPLICATE_IN_FILE" ? "Duplicate in File" : 
               row.status === "DEBIT_TRANSACTION" ? "Debit (Skip)" : 
               row.status === "MISSING_INVOICE_NUMBER" ? "No Invoice #" : "Invalid"}
            </span>
          </div>
        );
      }
    },
    {
      label: "Match",
      key: "matchStatus",
      render: (val) => {
        if (val === "MATCHED") return <span className="text-success font-semibold">MATCHED</span>;
        if (val === "NOT_FOUND") return <span className="text-danger font-semibold">NOT FOUND</span>;
        return <span className="text-warning font-semibold">{val}</span>;
      }
    },
    {
      label: "Supplier Name",
      key: "data",
      render: (val) => <span className="font-medium text-text">{val?.supplierName || "-"}</span>
    },
    {
      label: "Invoice No",
      key: "data",
      render: (val) => val?.invoiceNumber || "-"
    },
    {
      label: "Date",
      key: "data",
      render: (val) => val?.invoiceDate || "-"
    },
    {
      label: "Amount",
      key: "data",
      render: (val) => <span className="font-medium">{formatCurrency(val?.amount)}</span>
    },
    {
      label: "Type",
      key: "data",
      render: (val) => val?.type || "-"
    }
  ];

  return (
    <UIModal isOpen={isOpen} onClose={onClose} className="max-w-6xl w-full h-[90vh] flex flex-col">
      <UIModalHeader>
        <UIModalTitle>Preview Supplier Outstanding Import</UIModalTitle>
        <UIModalDescription>
          Review the transactions before importing. Only valid CREDIT transactions will be imported as Purchase Bills.
        </UIModalDescription>
      </UIModalHeader>

      <UIModalBody className="flex-1 overflow-hidden flex flex-col gap-4">
        {error && <UIAlert intent="danger" title="Import Error" description={error} />}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Total Rows</p>
            <p className="text-xl font-bold text-text mt-1">{localData.length}</p>
          </div>
          <div className="bg-success/10 p-4 rounded-xl border border-success/20">
            <p className="text-xs text-success font-medium">Valid Bills</p>
            <p className="text-xl font-bold text-success mt-1">{validRows.length}</p>
          </div>
          <div className="bg-danger/10 p-4 rounded-xl border border-danger/20">
            <p className="text-xs text-danger font-medium">Invalid/Skipped</p>
            <p className="text-xl font-bold text-danger mt-1">{invalidRows.length}</p>
          </div>
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Already Imported</p>
            <p className="text-xl font-bold text-text mt-1">{alreadyImported}</p>
          </div>
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Dup In File</p>
            <p className="text-xl font-bold text-text mt-1">{duplicatesInFile}</p>
          </div>
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Not Found</p>
            <p className="text-xl font-bold text-danger mt-1">{missingSuppliers}</p>
          </div>
          <div className="bg-surface-elevated p-4 rounded-xl border border-border">
            <p className="text-xs text-text-muted font-medium">Debit</p>
            <p className="text-xl font-bold text-text mt-1">{debitTransactions}</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <p className="text-xs text-primary font-medium">Total Valid ₹</p>
            <p className="text-lg font-bold text-primary mt-1">{formatCurrency(totalAmountToImport)}</p>
          </div>
        </div>

        <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <AppTable 
            rows={localData} 
            columns={columns} 
            getRowId={(row) => row.rowNumber}
            isLoading={false} 
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
          disabled={isConfirming || validRows.length === 0}
        >
          {isConfirming ? "Importing..." : `Import ${validRows.length} Bills`}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default SupplierOutstandingImportPreviewModal;
