import React, { forwardRef, useState } from "react";
import { Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * UIDetailRow (#31)
 *
 * Micro-component for displaying structured Label -> Value pairs across forms,
 * invoice breakdowns, detail drawers, audit cards, and modal dialogs.
 *
 * Features:
 * - Layout variants: "horizontal" (label left, value right), "vertical" (stacked), "inline" (compact)
 * - Copyable value with animated checkmark feedback tooltip
 * - Formats: plain text, monospace numbers/codes, badges, links, custom nodes
 * - Border dividers: "border" | "dashed" | "dotted" | "none"
 * - Highlight modes: "default" | "highlight" | "subdued" | "success" | "warning" | "error"
 */
export const UIDetailRow = forwardRef(
  (
    {
      label,
      value,
      icon,
      helpText,
      copyable = false,
      copyValue,
      mono = false,
      badge,
      href,
      target = "_blank",
      onClick,
      variant = "horizontal", // "horizontal" | "vertical" | "inline"
      divider = "border", // "border" | "dashed" | "dotted" | "none"
      highlight = "default", // "default" | "highlight" | "subdued" | "success" | "warning" | "error"
      size = "md", // "sm" | "md" | "lg"
      labelWidth, // e.g. "w-36", "w-48"
      className,
      labelClassName,
      valueClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
      e.stopPropagation();
      const textToCopy = String(copyValue !== undefined ? copyValue : value ?? "");
      if (textToCopy && navigator?.clipboard) {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    };

    const sizeStyles = {
      sm: {
        row: "py-1.5 text-xs",
        label: "text-xs",
        value: "text-xs",
        iconSize: "size-3.5",
        copyBtn: "size-5",
      },
      md: {
        row: "py-2.5 text-sm",
        label: "text-xs sm:text-[13px]",
        value: "text-xs sm:text-sm",
        iconSize: "size-4",
        copyBtn: "size-6",
      },
      lg: {
        row: "py-3.5 text-base",
        label: "text-sm sm:text-base",
        value: "text-sm sm:text-base font-semibold",
        iconSize: "size-4.5",
        copyBtn: "size-7",
      },
    };

    const curSize = sizeStyles[size] || sizeStyles.md;

    const dividerClasses = {
      border: "border-b border-border/70 last:border-b-0",
      dashed: "border-b border-dashed border-border/70 last:border-b-0",
      dotted: "border-b border-dotted border-border/70 last:border-b-0",
      none: "",
    };

    const highlightClasses = {
      default: "text-text",
      highlight: "text-primary font-bold bg-primary-soft/30 px-2 py-0.5 rounded-md",
      subdued: "text-text-muted",
      success: "text-success font-semibold",
      warning: "text-warning font-semibold",
      error: "text-error font-semibold",
    };

    const renderValue = () => {
      if (children) return children;

      if (href) {
        return (
          <a
            href={href}
            target={target}
            rel="noreferrer"
            className={cn(
              "text-primary hover:underline font-medium inline-flex items-center gap-1 transition-colors",
              mono && "font-mono tabular-nums"
            )}
          >
            {value}
          </a>
        );
      }

      if (onClick) {
        return (
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "text-primary hover:underline font-medium text-left cursor-pointer transition-colors",
              mono && "font-mono tabular-nums"
            )}
          >
            {value}
          </button>
        );
      }

      return (
        <span
          className={cn(
            "text-right sm:text-left transition-colors break-words",
            mono && "font-mono tabular-nums tracking-tight",
            highlightClasses[highlight] || highlightClasses.default,
            valueClassName
          )}
        >
          {value ?? "—"}
        </span>
      );
    };

    if (variant === "vertical") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-1 font-sans",
            curSize.row,
            dividerClasses[divider],
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-1.5 text-text-muted select-none">
            {icon && <span className={cn("shrink-0 text-text-muted", curSize.iconSize)}>{icon}</span>}
            <span className={cn("font-medium text-text-muted", curSize.label, labelClassName)}>
              {label}
            </span>
            {helpText && (
              <span title={helpText} className="cursor-help text-text-muted hover:text-text">
                <Info className="size-3" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 font-medium text-text min-w-0">
            {renderValue()}
            {badge && <div className="shrink-0">{badge}</div>}
            {copyable && (
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? "Copied to clipboard!" : "Copy value"}
                aria-label="Copy value"
                className={cn(
                  "inline-flex items-center justify-center rounded-md hover:bg-surface-hover transition-colors text-text-muted hover:text-text cursor-pointer shrink-0",
                  curSize.copyBtn
                )}
              >
                {copied ? (
                  <Check className="size-3 text-success animate-in zoom-in duration-150" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            )}
          </div>
        </div>
      );
    }

    if (variant === "inline") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 font-sans",
            curSize.row,
            className
          )}
          {...props}
        >
          <span className={cn("font-medium text-text-muted select-none", curSize.label, labelClassName)}>
            {label}:
          </span>
          <div className="inline-flex items-center gap-1.5">
            {renderValue()}
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
        </div>
      );
    }

    // Default: Horizontal
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start sm:items-center justify-between gap-3 font-sans w-full",
          curSize.row,
          dividerClasses[divider],
          className
        )}
        {...props}
      >
        {/* Left: Label + Icon + Help */}
        <div
          className={cn(
            "flex items-center gap-2 shrink-0 select-none text-text-muted",
            labelWidth || "w-auto sm:min-w-[120px]"
          )}
        >
          {icon && <span className={cn("shrink-0 text-text-muted", curSize.iconSize)}>{icon}</span>}
          <span className={cn("font-medium text-text-muted", curSize.label, labelClassName)}>
            {label}
          </span>
          {helpText && (
            <span title={helpText} className="cursor-help text-text-muted hover:text-text">
              <Info className="size-3" />
            </span>
          )}
        </div>

        {/* Right: Value + Badge + Copy Trigger */}
        <div className="flex items-center justify-end flex-1 gap-2 min-w-0 text-right">
          {renderValue()}
          {badge && <div className="shrink-0">{badge}</div>}
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied to clipboard!" : "Copy value"}
              aria-label="Copy value"
              className={cn(
                "inline-flex items-center justify-center rounded-md hover:bg-surface-hover transition-colors text-text-muted hover:text-text cursor-pointer shrink-0 ml-1",
                curSize.copyBtn
              )}
            >
              {copied ? (
                <Check className="size-3 text-success animate-in zoom-in duration-150" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);
UIDetailRow.displayName = "UIDetailRow";

export default UIDetailRow;
