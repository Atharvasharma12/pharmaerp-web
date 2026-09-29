import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Store, ArrowRight, Loader2 } from "lucide-react";

const ContextSwitchLoader = ({ isOpen, type, fromName, toName }) => {
  if (!isOpen) return null;

  const Icon = type === "company" ? Building2 : Store;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto bg-surface/60"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -5 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center justify-center p-8 max-w-sm w-full mx-4 bg-surface rounded-[24px] border border-border shadow-[var(--app-shadow-2xl)]"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Animated Icon & Spinner */}
            <div className="relative flex items-center justify-center size-16 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
              />
              <div className="flex items-center justify-center size-10 rounded-full bg-primary-soft text-primary">
                <Icon className="size-5" />
              </div>
            </div>

            {/* Dynamic Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-text tracking-tight">
                Switching {type === "company" ? "Company" : "Branch"}
              </h3>
              
              <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-text-muted">
                <span className="truncate max-w-[120px]" title={fromName}>
                  {fromName || "Previous"}
                </span>
                <ArrowRight className="size-3.5 shrink-0 opacity-50" />
                <span className="truncate max-w-[120px] text-primary" title={toName}>
                  {toName || "New"}
                </span>
              </div>
            </div>
            
            {/* Subtle Progress Bar */}
            <div className="w-full h-1 mt-8 bg-surface-hover rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ContextSwitchLoader;
