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
    return validRows.filter(r => r.data.type === "CR").reduce((sum, row) => sum + (row.data.amount || 0), 0);
  }, [validRows]);

  const totalDebitToImport = useMemo(() => {
    return validRows.filter(r => r.data.type === "DR").reduce((sum, row) => sum + (row.data.amount || 0), 0);
  }, [validRows]);

  const groupedSuppliers = useMemo(() => {
    const map = new Map();
    localData.forEach(row => {
      const name = row.data?.supplierName || "Unknown Supplier";
      if (!map.has(name)) {
        map.set(name, {
          supplierName: name,
          matchStatus: row.matchStatus,
          totalBills: 0,
          validBills: 0,
          validAmount: 0,
          totalCr: 0,
          totalDr: 0,
          netOutstanding: 0
        });
      }
      const group = map.get(name);
      group.totalBills += 1;
      
      const amt = row.data?.amount || 0;
      if (row.data?.type === "CR") {
        group.totalCr += amt;
      } else if (row.data?.type === "DR") {
        group.totalDr += amt;
      }
      group.netOutstanding = group.totalCr - group.totalDr;

      if (row.isValid) {
        group.validBills += 1;
        if (row.data?.type === "CR") {
          group.validAmount += amt;
        } else if (row.data?.type === "DR") {
          group.validAmount -= amt;
        }
      }
      if (row.matchStatus === "NOT_FOUND") {
        group.matchStatus = "NOT_FOUND";
      }
    });
    return Array.from(map.values()).map((g, i) => ({ ...g, rowNumber: i + 1 }));
  }, [localData]);

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
      label: "#",
      key: "rowNumber",
      render: (val) => <span className="text-text-muted">{val}</span>,
    },
    {
      label: "Supplier Name",
      key: "supplierName",
      render: (val) => <span className="font-medium text-text">{val}</span>
    },
    {
      label: "Match Status",
      key: "matchStatus",
      render: (val) => {
        if (val === "MATCHED") return <span className="text-success font-semibold">MATCHED</span>;
        if (val === "NOT_FOUND") return <span className="text-danger font-semibold">NOT FOUND</span>;
        return <span className="text-warning font-semibold">{val}</span>;
      }
    },
    {
      label: "Total Cr",
      key: "totalCr",
      render: (val) => <span className="text-success">{formatCurrency(val)}</span>
    },
    {
      label: "Total Dr",
      key: "totalDr",
      render: (val) => <span className="text-danger">{formatCurrency(val)}</span>
    },
    {
      label: "Net Outstanding",
      key: "netOutstanding",
      render: (val) => <span className="font-bold">{formatCurrency(Math.abs(val))} {val >= 0 ? 'Cr' : 'Dr'}</span>
    },
    {
      label: "Valid TXs",
      key: "validBills",
      render: (val) => <span className="text-success font-medium">{val}</span>
    },
    {
      label: "Valid Net Amount",
      key: "validAmount",
      render: (val) => <span className="font-medium text-primary">{formatCurrency(Math.abs(val))} {val >= 0 ? 'Cr' : 'Dr'}</span>
    }
  ];

  return (
    <UIModal isOpen={isOpen} onClose={onClose} className="max-w-6xl w-full h-[90vh] flex flex-col">
      <UIModalHeader>
        <UIModalTitle>Preview Supplier Outstanding Import</UIModalTitle>
        <UIModalDescription>
          Review the transactions before importing. Valid CREDIT and DEBIT transactions will be processed.
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
            <p className="text-xs text-success font-medium">Valid TXs</p>
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
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <p className="text-xs text-primary font-medium">Total Cr ₹</p>
            <p className="text-lg font-bold text-primary mt-1">{formatCurrency(totalAmountToImport)}</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <p className="text-xs text-primary font-medium">Total Dr ₹</p>
            <p className="text-lg font-bold text-primary mt-1">{formatCurrency(totalDebitToImport)}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-surface border border-border rounded-xl shadow-sm flex flex-col">
          <AppTable 
            rows={groupedSuppliers} 
            columns={columns} 
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
          disabled={isConfirming || validRows.length === 0}
        >
          {isConfirming ? "Importing..." : `Import ${validRows.length} Bills`}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default SupplierOutstandingImportPreviewModal;
