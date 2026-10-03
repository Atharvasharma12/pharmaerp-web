import React, { forwardRef } from "react";
import { Save, X, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIButton } from "./UIButton";

/**
 * ============================================================================
 * UIFormActions (#23 Component)
 * ============================================================================
 * Save / Cancel / Submit / Delete action bar for forms and drawers.
 * Supports inline, sticky bottom bar, and floating island layouts.
 */
const UIFormActions = forwardRef(
  (
    {
      onSave,
      onCancel,
      onDelete,
      onReset,
      saveText = "Save Changes",
      cancelText = "Cancel",
      deleteText = "Delete",
      resetText = "Reset",
      saveVariant = "primary",
      saveIcon = <Save className="size-4" />,
      cancelIcon,
      deleteIcon = <Trash2 className="size-4" />,
      resetIcon = <RotateCcw className="size-4" />,
      isLoading = false,
      loadingText = "Saving...",
      disabled = false,
      position = "inline",
      align = "right",
      statusMessage,
      statusType = "info",
      extraActions,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isSticky = position === "sticky";
    const isFloating = position === "floating";

    const alignClasses = {
      right: "justify-end",
      left: "justify-start",
      center: "justify-center",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-sans transition-all duration-200",
          position === "inline" && "pt-5 sm:pt-6 mt-6 sm:mt-8 border-t border-border/80",
          isSticky &&
            "sticky bottom-0 z-30 bg-surface/90 backdrop-blur-md border-t border-border/80 px-4 sm:px-6 py-3.5 sm:py-4 shadow-md pb-[max(0.875rem,env(safe-area-inset-bottom))]",
          isFloating &&
            "sticky bottom-4 z-30 mx-auto max-w-2xl rounded-2xl border border-border bg-surface/95 backdrop-blur-md p-3 sm:p-4 shadow-lg",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
            align === "between" || onDelete || onReset || statusMessage
              ? "justify-between"
              : alignClasses[align] || "justify-end"
          )}
        >
          {/* Left Slot: Destructive / Reset Actions or Status Message */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto shrink-0 justify-start">
            {statusMessage && (
              <span
                className={cn(
                  "text-xs font-medium",
                  statusType === "error" && "text-error",
                  statusType === "success" && "text-success",
                  statusType === "warning" && "text-warning",
                  statusType === "info" && "text-text-muted"
                )}
              >
                {statusMessage}
              </span>
            )}

            {onDelete && (
              <UIButton
                type="button"
                variant="destructive"
                size="sm"
                startIcon={deleteIcon}
                disabled={disabled || isLoading}
                onClick={onDelete}
              >
                {deleteText}
              </UIButton>
            )}

            {onReset && (
              <UIButton
                type="button"
                variant="ghost"
                size="sm"
                startIcon={resetIcon}
                disabled={disabled || isLoading}
                onClick={onReset}
              >
                {resetText}
              </UIButton>
            )}

            {extraActions}
          </div>

          {/* Right Slot: Cancel and Primary Save CTA */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0 justify-end">
            {children}

            {onCancel && (
              <UIButton
                type="button"
                variant="outline"
                size="sm"
                startIcon={cancelIcon}
                disabled={disabled || isLoading}
                onClick={onCancel}
              >
                {cancelText}
              </UIButton>
            )}

            {onSave && (
              <UIButton
                type="submit"
                variant={saveVariant}
                size="sm"
                startIcon={!isLoading ? saveIcon : undefined}
                isLoading={isLoading}
                loadingText={loadingText}
                disabled={disabled}
                onClick={onSave}
              >
                {saveText}
              </UIButton>
            )}
          </div>
        </div>
      </div>
    );
  }
);
UIFormActions.displayName = "UIFormActions";

export { UIFormActions };
export default UIFormActions;
