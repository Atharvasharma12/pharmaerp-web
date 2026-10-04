import React, { useState, useRef } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UISelect,
  UIAlert
} from "@/components/ui";

const ImportConfigModal = ({ isOpen, onClose, onImportSubmit, isUploading }) => {
  const [importType, setImportType] = useState("b2b");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Please select a file to import.");
      return;
    }
    onImportSubmit(file, importType);
  };

  const handleClose = () => {
    if (isUploading) return;
    setFile(null);
    setImportType("b2b");
    setError("");
    onClose();
  };

  return (
    <UIModal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <UIModalHeader>
        <UIModalTitle>Import Data</UIModalTitle>
        <UIModalDescription>
          Select the type of data and upload your Excel/CSV file to begin the import process.
        </UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4 py-2">
          {error && <UIAlert intent="danger" title="Error" description={error} />}
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">Import Type</label>
            <UISelect
              value={importType}
              onChange={(val) => {
                setImportType(val);
                setError("");
              }}
              options={[
                { label: "Import B2B Customers", value: "b2b" },
                { label: "Import B2C Customers", value: "b2c" },
                { label: "Import B2B Outstanding", value: "b2b-outstanding" },
              ]}
              placeholder="Select import type..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">Select File</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors \${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileChange} 
              />
              {file ? (
                <div>
                  <p className="text-sm font-bold text-text truncate max-w-[250px] mx-auto">{file.name}</p>
                  <p className="text-xs text-text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-text">Click to upload or drag and drop</p>
                  <p className="text-xs text-text-muted mt-1">.xlsx, .xls, or .csv up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="ghost" onClick={handleClose} disabled={isUploading}>
          Cancel
        </UIButton>
        <UIButton variant="primary" onClick={handleSubmit} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Continue"}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default ImportConfigModal;
