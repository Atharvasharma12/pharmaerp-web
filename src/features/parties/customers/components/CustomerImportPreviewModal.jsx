import React, { useState, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert,
  UIIconButton,
} from "@/components/ui";
import { AppTable } from "@/components";
import { CheckCircle2, AlertCircle, XCircle, Edit2, Save, X } from "lucide-react";
import customerService from "../services/customerService";

const CustomerImportPreviewModal = ({
  isOpen,
  onClose,
  previewData,
  onImportSuccess,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  
  const [localData, setLocalData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
      const customersToImport = validRows.map(row => ({ ...row.data, customerType: "retail" }));
      const res = await customerService.confirmImport(customersToImport);
      
      const { successful, failed, errors } = res.data?.data || {};
      onImportSuccess(successful, failed, errors);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to import customers. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const startEdit = (row) => {
    setEditingRowId(row.rowNumber);
    setEditForm({
      name: row.data.name || "",
      mobile: row.data.mobile || "",
      email: row.data.email || "",
      gstNumber: row.data.gstNumber || "",
      addressLine1: row.data.address?.addressLine1 || "",
      openingBalance: row.data.openingBalance || 0,
      openingBalanceType: row.data.openingBalanceType || "cr",
    });
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setEditForm({});
  };

  const saveEdit = (rowNumber) => {
    setLocalData(prev => prev.map(row => {
      if (row.rowNumber === rowNumber) {
        // Basic re-validation
        const errors = [];
        if (!editForm.name) errors.push("Customer Name is required");
        if (editForm.mobile && !/^[6-9][0-9]{9}$/.test(editForm.mobile)) errors.push("Invalid mobile number format");
        if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) errors.push("Invalid email format");
        if (editForm.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]/.test(editForm.gstNumber)) errors.push("Invalid GST Number format");

        return {
          ...row,
          isValid: errors.length === 0,
          errors,
          data: {
            ...row.data,
            name: editForm.name,
            mobile: editForm.mobile || null,
            email: editForm.email || null,
            gstNumber: editForm.gstNumber || null,
            address: { addressLine1: editForm.addressLine1 || null },
            openingBalance: Number(editForm.openingBalance) || 0,
            openingBalanceType: editForm.openingBalanceType
          }
        };
      }
      return row;
    }));
    setEditingRowId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
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
      id: "name",
      key: "data.name",
      label: "Customer Name",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <input 
          type="text" name="name" 
          value={editForm.name} onChange={handleChange}
          className="w-full text-xs p-1 border rounded"
        /> : 
        <span className="font-semibold text-[13px]">{row.data.name || "-"}</span>
      )
    },
    {
      id: "mobile",
      key: "data.mobile",
      label: "Mobile",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <input 
          type="text" name="mobile" 
          value={editForm.mobile} onChange={handleChange}
          className="w-24 text-xs p-1 border rounded"
        /> : 
        <span className="text-xs">{row.data.mobile || "-"}</span>
      )
    },
    {
      id: "email",
      key: "data.email",
      label: "Email",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <input 
          type="email" name="email" 
          value={editForm.email} onChange={handleChange}
          className="w-32 text-xs p-1 border rounded"
        /> : 
        <span className="text-xs">{row.data.email || "-"}</span>
      )
    },
    {
      id: "gst",
      key: "data.gstNumber",
      label: "GST Number",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <input 
          type="text" name="gstNumber" 
          value={editForm.gstNumber} onChange={handleChange}
          className="w-28 text-xs p-1 border rounded"
        /> : 
        <span className="text-xs">{row.data.gstNumber || "-"}</span>
      )
    },
    {
      id: "address",
      key: "data.address.addressLine1",
      label: "Address 1",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <input 
          type="text" name="addressLine1" 
          value={editForm.addressLine1} onChange={handleChange}
          className="w-32 text-xs p-1 border rounded"
        /> : 
        <span className="text-xs max-w-[150px] truncate block" title={row.data.address?.addressLine1}>
          {row.data.address?.addressLine1 || "-"}
        </span>
      )
    },
    {
      id: "address2",
      key: "data.address.addressLine2",
      label: "Address 2",
      render: (_, row) => (
        <span className="text-xs max-w-[150px] truncate block" title={row.data.address?.addressLine2}>
          {row.data.address?.addressLine2 || "-"}
        </span>
      )
    },
    {
      id: "city",
      key: "data.address.city",
      label: "City",
      render: (_, row) => (
        <span className="text-xs">{row.data.address?.city || "-"}</span>
      )
    },
    {
      id: "state",
      key: "data.address.state",
      label: "State",
      render: (_, row) => (
        <span className="text-xs">{row.data.address?.state || "-"}</span>
      )
    },
    {
      id: "alternateMobile",
      key: "data.alternateMobile",
      label: "Alternate Mobile",
      render: (_, row) => (
        <span className="text-xs">{row.data.alternateMobile || "-"}</span>
      )
    },
    {
      id: "drugLicenseNumber",
      key: "data.drugLicenseNumber",
      label: "Licence No",
      render: (_, row) => (
        <span className="text-xs">{row.data.drugLicenseNumber || "-"}</span>
      )
    },
    {
      id: "panNumber",
      key: "data.panNumber",
      label: "PAN Number",
      render: (_, row) => (
        <span className="text-xs">{row.data.panNumber || "-"}</span>
      )
    },
    {
      id: "balance",
      key: "data.openingBalance",
      label: "Outstanding",
      render: (_, row) => (
        editingRowId === row.rowNumber ? 
        <div className="flex items-center gap-1">
          <input 
            type="number" name="openingBalance" 
            value={editForm.openingBalance} onChange={handleChange}
            className="w-20 text-xs p-1 border rounded"
          />
          <select name="openingBalanceType" value={editForm.openingBalanceType} onChange={handleChange} className="text-xs p-1 border rounded">
            <option value="cr">CR</option>
            <option value="dr">DR</option>
          </select>
        </div> : 
        <span className={`text-xs font-semibold ${String(row.data.openingBalanceType || '').toLowerCase() === 'dr' ? 'text-emerald-600' : 'text-rose-600'}`}>
          ₹{(row.data.openingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {row.data.openingBalanceType?.toUpperCase()}
        </span>
      )
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, row) => (
        editingRowId === row.rowNumber ? (
          <div className="flex items-center gap-1 justify-end">
            <UIIconButton size="sm" variant="ghost" className="text-success hover:text-success/80 h-7 w-7" onClick={() => saveEdit(row.rowNumber)}>
              <Save className="w-3.5 h-3.5" />
            </UIIconButton>
            <UIIconButton size="sm" variant="ghost" className="text-text-muted hover:text-text h-7 w-7" onClick={cancelEdit}>
              <X className="w-3.5 h-3.5" />
            </UIIconButton>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <UIIconButton size="sm" variant="ghost" className="text-text-muted hover:text-text h-7 w-7" onClick={() => startEdit(row)}>
              <Edit2 className="w-3.5 h-3.5" />
            </UIIconButton>
          </div>
        )
      )
    },
    {
      id: "errors",
      key: "errors",
      label: "Issues",
      render: (_, row) => (
        editingRowId === row.rowNumber ? (
          <span className="text-[11px] text-text-muted">Editing...</span>
        ) : row.errors && row.errors.length > 0 ? (
          <div className="flex flex-col gap-1 min-w-[120px]">
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
        <UIModalTitle>Import Customers Preview</UIModalTitle>
        <UIModalDescription>
          Review and edit the parsed data before importing. Only valid rows will be imported.
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
              <span className="text-xs font-semibold text-text-muted uppercase">Total</span>
            </div>
            <div className="bg-success/10 px-4 py-2 rounded-lg border border-success/20 flex flex-col items-center">
              <span className="text-xl font-bold text-success">{validRows.length}</span>
              <span className="text-xs font-semibold text-success uppercase">Valid</span>
            </div>
            <div className="bg-error/10 px-4 py-2 rounded-lg border border-error/20 flex flex-col items-center">
              <span className="text-xl font-bold text-error">{invalidRows.length}</span>
              <span className="text-xs font-semibold text-error uppercase">Invalid</span>
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
        <UIButton variant="ghost" onClick={onClose} disabled={isConfirming || editingRowId !== null}>
          Cancel
        </UIButton>
        <UIButton 
          variant="primary" 
          onClick={handleConfirm} 
          disabled={validRows.length === 0 || isConfirming || editingRowId !== null}
        >
          {isConfirming ? "Importing..." : `Import ${validRows.length} Customers`}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CustomerImportPreviewModal;
