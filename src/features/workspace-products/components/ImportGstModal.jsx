// src/features/workspace-products/components/ImportGstModal.jsx

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";
import workspaceProductService from "../services/workspaceProductService";

export const ImportGstModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an Excel (.xlsx, .xls) or CSV (.csv) file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await workspaceProductService.importWorkspaceProductsGst(formData);
      const data = res?.data?.data || res?.data || res;
      setResult(data);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to import GST and HSN data");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setResult(null);
  };

  const totalRows = result?.totalRows ?? result?.data?.totalRows ?? 0;
  const matchedRowsCount = result?.matchedRowsCount ?? result?.data?.matchedRowsCount ?? 0;
  const updatedProductsCount = result?.updatedProductsCount ?? result?.data?.updatedProductsCount ?? 0;
  const skippedRowsCount = result?.skippedRowsCount ?? result?.data?.skippedRowsCount ?? 0;
  const errorsList = result?.errors ?? result?.data?.errors ?? [];

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Upload className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text">Import GST & HSN Rates</h3>
              <p className="text-xs text-text-muted">
                Bulk update HSN codes & GST tax rates mapped by Item Code
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Expected Format Notice */}
        <div className="mb-4 rounded-xl bg-info/10 p-3.5 border border-info/20 text-xs text-text">
          <div className="flex items-start gap-2">
            <Info className="size-4 text-info shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text mb-1">Expected Excel / CSV Columns:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-text-muted text-[11px]">
                <span>• <strong className="text-text">ItemCode / ItemID:</strong> Product code</span>
                <span>• <strong className="text-text">HSNCode / HSN:</strong> HSN Number</span>
                <span>• <strong className="text-text">SGST + CGST:</strong> e.g. 2.5 + 2.5 (5%)</span>
                <span>• <strong className="text-text">LocalTax / GST%:</strong> Tax Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!result ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-surface-hover"
              }`}
            >
              <input
                type="file"
                id="gst-file-input"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="gst-file-input" className="cursor-pointer block w-full">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="size-8 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text">{file.name}</p>
                      <p className="text-xs text-text-muted">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <Upload className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        Click to upload or drag & drop file
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Supports Excel (.xlsx, .xls) or CSV (.csv)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <div className="rounded-xl border border-success/30 bg-success/10 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-success font-bold text-sm">
                <CheckCircle2 className="size-5" />
                <span>GST & HSN Import Completed!</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-text">
                <div className="bg-surface/80 p-2.5 rounded-lg border border-border">
                  <span className="text-text-muted block">Total Rows:</span>
                  <span className="font-bold text-sm">{totalRows}</span>
                </div>
                <div className="bg-surface/80 p-2.5 rounded-lg border border-border">
                  <span className="text-text-muted block">Matched Products:</span>
                  <span className="font-bold text-sm text-primary">{matchedRowsCount}</span>
                </div>
                <div className="bg-surface/80 p-2.5 rounded-lg border border-border">
                  <span className="text-text-muted block">Updated Products:</span>
                  <span className="font-bold text-sm text-success">{updatedProductsCount}</span>
                </div>
                <div className="bg-surface/80 p-2.5 rounded-lg border border-border">
                  <span className="text-text-muted block">Skipped Rows:</span>
                  <span className="font-bold text-sm text-warning">{skippedRowsCount}</span>
                </div>
              </div>
              {errorsList.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-text-muted max-h-24 overflow-y-auto">
                  <p className="font-semibold text-warning mb-1">Unmatched Row Warnings:</p>
                  {errorsList.slice(0, 5).map((err, idx) => (
                    <div key={idx}>
                      Row {err.row}: ItemCode "{err.itemCode}" - {err.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-error/10 border border-error/30 p-3 flex items-start gap-2 text-xs text-error">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            {result ? (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text transition-colors"
                >
                  Import Another File
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-contrast hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-contrast hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Updating GST...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      <span>Upload & Update GST</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportGstModal;
