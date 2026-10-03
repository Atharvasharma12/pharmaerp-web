import React, { forwardRef, useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UIDetailRow } from "./UIDetailRow";

/**
 * UIKeyValueList (#32)
 *
 * Structured container for grouping multiple key-value rows.
 *
 * Features:
 * - Layout options: "list" (vertical stack), "grid" (multi-column), "striped" (alternating zebra stripes), "bordered", "card"
 * - Columns: 1, 2, 3, or 4 columns (for "grid" layout)
 * - Copy All capability (serializes all rows to clipboard: "Label: Value\n...")
 * - Collapsible accordion header option
 * - Supports declarative `items` array or nested `<UIDetailRow />` children
 */
export const UIKeyValueList = forwardRef(
  (
    {
      title,
      subtitle,
      items = [], // Array<{ label: string, value: string | ReactNode, icon?, helpText?, copyable?, mono?, badge?, href?, highlight?, labelWidth? }>
      layout = "list", // "list" | "grid" | "striped" | "card" | "bordered"
      columns = 2, // 1 | 2 | 3 | 4 (applicable when layout="grid")
      size = "md", // "sm" | "md" | "lg"
      divider = "border", // "border" | "dashed" | "dotted" | "none"
      allowCopyAll = false,
      collapsible = false,
      defaultExpanded = true,
      isExpanded: controlledExpanded,
      onToggle,
      emptyMessage = "No details available",
      actions,
      headerClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [copiedAll, setCopiedAll] = useState(false);
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    const handleToggle = () => {
      if (!collapsible) return;
      const next = !isExpanded;
      if (!isControlled) {
        setInternalExpanded(next);
      }
      onToggle?.(next);
    };

    const handleCopyAll = (e) => {
      e.stopPropagation();
      if (!items || items.length === 0) return;
      const textToCopy = items
        .map((item) => `${item.label}: ${typeof item.value === "string" || typeof item.value === "number" ? item.value : ""}`)
        .join("\n");
      if (textToCopy && navigator?.clipboard) {
        navigator.clipboard.writeText(textToCopy);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    };

    const gridColsClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    const layoutContainerClasses = {
      list: "flex flex-col",
      grid: cn("grid gap-x-6 gap-y-1.5", gridColsClasses[columns] || gridColsClasses[2]),
      striped: "flex flex-col divide-y divide-border/60 rounded-xl overflow-hidden border border-border/80 [&>*:nth-child(odd)]:bg-surface-alt/40 [&>*:nth-child(even)]:bg-surface [&>*]:px-3.5",
      card: "flex flex-col p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs",
      bordered: "flex flex-col p-3.5 rounded-xl border border-border/80 bg-surface-alt/30",
    };

    const hasHeader = title || subtitle || allowCopyAll || actions || collapsible;

    return (
      <div
        ref={ref}
        className={cn("w-full font-sans", className)}
        {...props}
      >
        {/* Optional Header */}
        {hasHeader && (
          <div
            onClick={collapsible ? handleToggle : undefined}
            className={cn(
              "flex items-center justify-between gap-3 pb-2.5 mb-2 select-none border-b border-border/60",
              collapsible && "cursor-pointer group",
              headerClassName
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              {collapsible && (
                <ChevronDown
                  className={cn(
                    "size-4 text-text-muted transition-transform duration-200 ease-out group-hover:text-text",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
              <div className="flex flex-col min-w-0">
                {title && (
                  <span className="text-sm sm:text-[15px] font-bold text-text truncate">
                    {title}
                  </span>
                )}
                {subtitle && (
                  <span className="text-xs text-text-muted truncate">
                    {subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {actions}
              {allowCopyAll && items.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-text-muted hover:text-text bg-surface-alt hover:bg-surface-hover border border-border rounded-lg transition-colors cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <Check className="size-3 text-success animate-in zoom-in" />
                      <span className="text-success">Copied All</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        {collapsible ? (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="keyvalue-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                  transitionEnd: { overflow: "visible" },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                }}
                className="overflow-hidden"
              >
                <div className={cn(layoutContainerClasses[layout] || layoutContainerClasses.list)}>
                  {items.length > 0
                    ? items.map((item, idx) => (
                        <UIDetailRow
                          key={item.key || idx}
                          label={item.label}
                          value={item.value}
                          icon={item.icon}
                          helpText={item.helpText}
                          copyable={item.copyable}
                          copyValue={item.copyValue}
                          mono={item.mono}
                          badge={item.badge}
                          href={item.href}
                          onClick={item.onClick}
                          highlight={item.highlight}
                          size={size}
                          divider={layout === "grid" || layout === "striped" ? "none" : divider}
                          variant={layout === "grid" ? "vertical" : "horizontal"}
                          labelWidth={item.labelWidth}
                        />
                      ))
                    : children || (
                        <span className="text-xs text-text-muted py-2 italic">
                          {emptyMessage}
                        </span>
                      )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className={cn(layoutContainerClasses[layout] || layoutContainerClasses.list)}>
            {items.length > 0
              ? items.map((item, idx) => (
                  <UIDetailRow
                    key={item.key || idx}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                    helpText={item.helpText}
                    copyable={item.copyable}
                    copyValue={item.copyValue}
                    mono={item.mono}
                    badge={item.badge}
                    href={item.href}
                    onClick={item.onClick}
                    highlight={item.highlight}
                    size={size}
                    divider={layout === "grid" || layout === "striped" ? "none" : divider}
                    variant={layout === "grid" ? "vertical" : "horizontal"}
                    labelWidth={item.labelWidth}
                  />
                ))
              : children || (
                  <span className="text-xs text-text-muted py-2 italic">
                    {emptyMessage}
                  </span>
                )}
          </div>
        )}
      </div>
    );
  }
);
UIKeyValueList.displayName = "UIKeyValueList";

export default UIKeyValueList;
