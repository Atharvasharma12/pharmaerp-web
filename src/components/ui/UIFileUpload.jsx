import React, { forwardRef, useState, useRef } from "react";
import {
  UploadCloud,
  File,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * UIFileUpload (#40)
 *
 * Drag-and-drop file upload zone and attachment manager for invoices,
 * drug COA certificates, prescription scans, and vendor documents.
 *
 * Features:
 * - Drag-and-drop zone with animated highlight feedback
 * - File restrictions: `accept`, `maxSize` (in MB), `maxFiles`
 * - Live file preview list with file size formatting, icons, and delete buttons
 * - Upload progress simulator / status indicators
 * - Multi-file and single-file modes
 */
export const UIFileUpload = forwardRef(
  (
    {
      value = [], // Array<File | { id, name, size, type, progress?, url? }>
      onChange,
      onUpload,
      accept = ".pdf,.png,.jpg,.jpeg,.csv,.xlsx",
      maxSize = 10, // in MB
      maxFiles = 5,
      multiple = true,
      disabled = false,
      title = "Upload Document or Invoice",
      description = "Drag & drop files here, or click to browse from device",
      className,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const inputRef = useRef(null);

    const formatBytes = (bytes) => {
      if (bytes === 0 || !bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const getFileIcon = (fileName = "") => {
      const ext = fileName.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext)) {
        return <ImageIcon className="size-4 text-purple-500" />;
      }
      if (["pdf"].includes(ext)) {
        return <FileText className="size-4 text-error" />;
      }
      if (["csv", "xlsx", "xls"].includes(ext)) {
        return <FileText className="size-4 text-success" />;
      }
      return <File className="size-4 text-primary" />;
    };

    const handleFiles = (incomingFiles) => {
      setErrorMessage(null);
      const filesArray = Array.from(incomingFiles);

      if (!multiple && filesArray.length > 1) {
        setErrorMessage("Only single file upload is permitted.");
        return;
      }

      if (value.length + filesArray.length > maxFiles) {
        setErrorMessage(`You can upload a maximum of ${maxFiles} files.`);
        return;
      }

      const validFiles = [];
      for (const file of filesArray) {
        if (file.size > maxSize * 1024 * 1024) {
          setErrorMessage(`File "${file.name}" exceeds the ${maxSize}MB size limit.`);
          return;
        }
        validFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          progress: 100,
        });
      }

      const nextFiles = multiple ? [...value, ...validFiles] : validFiles;
      onChange?.(nextFiles);
      onUpload?.(validFiles);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleRemove = (fileId) => {
      const nextFiles = value.filter((f) => f.id !== fileId);
      onChange?.(nextFiles);
    };

    return (
      <div
        ref={ref}
        className={cn("w-full flex flex-col gap-3 font-sans", className)}
        {...props}
      >
        {/* Dropzone Container */}
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none",
            isDragging
              ? "border-primary bg-primary-soft/40 scale-[1.01] shadow-md"
              : "border-border/80 bg-surface-alt/30 hover:bg-surface-hover hover:border-border-strong",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />

          <div
            className={cn(
              "size-12 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200",
              isDragging ? "bg-primary text-primary-contrast scale-110" : "bg-primary-soft text-primary"
            )}
          >
            <UploadCloud className="size-6" />
          </div>

          <span className="text-sm sm:text-[15px] font-bold text-text">
            {title}
          </span>
          <span className="text-xs text-text-muted mt-1 max-w-sm leading-relaxed">
            {description}
          </span>

          <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-text-muted bg-surface px-2.5 py-1 rounded-lg border border-border/60">
            <span>Supports: {accept}</span>
            <span>•</span>
            <span>Max {maxSize}MB</span>
          </div>
        </div>

        {/* Error Validation Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-error/15 border border-error/30 text-error flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Uploaded Files List */}
        {value.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-text-muted flex items-center justify-between">
              <span>Attached Files ({value.length})</span>
              {value.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange?.([])}
                  className="text-error hover:underline cursor-pointer font-semibold text-[11px]"
                >
                  Remove all
                </button>
              )}
            </div>

            <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-surface overflow-hidden">
              <AnimatePresence>
                {value.map((file) => (
                  <motion.div
                    key={file.id || file.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="size-8 rounded-lg bg-surface-alt flex items-center justify-center shrink-0 border border-border/60">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-text truncate">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-text-muted font-mono">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(file.id);
                      }}
                      aria-label={`Remove ${file.name}`}
                      className="size-7 rounded-lg hover:bg-error/15 hover:text-error flex items-center justify-center text-text-muted transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    );
  }
);
UIFileUpload.displayName = "UIFileUpload";

export default UIFileUpload;
