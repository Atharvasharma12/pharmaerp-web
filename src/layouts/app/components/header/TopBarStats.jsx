import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const intentColors = {
  primary: { dot: "bg-primary", ring: "ring-primary/20" },
  success: { dot: "bg-success", ring: "ring-success/20" },
  error: { dot: "bg-error", ring: "ring-error/20" },
  warning: { dot: "bg-warning", ring: "ring-warning/20" },
  default: { dot: "bg-border-strong", ring: "ring-border-strong/20" },
};

export const TopBarStats = ({ stats = [] }) => {
  const portalTarget = document.getElementById("header-stats-portal");
  
  // Local loading state to simulate the skeleton delay
  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading state on mount or when stats array significantly changes length/identity
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms delay to let the title settle first
    return () => clearTimeout(timer);
  }, [stats.map(s => s.label).join(',')]); // Depend on labels to trigger on page navigation

  if (!portalTarget || stats.length === 0) return null;

  return createPortal(
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="flex items-center gap-3 text-[11px] font-semibold bg-surface-alt/50 px-2 py-0.5 rounded-md border border-border overflow-hidden relative"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          // Skeleton View
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, position: "absolute" }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            {stats.map((stat, i) => {
              const color = intentColors[stat.intent] || intentColors.default;
              return (
                <span key={i} className="inline-flex items-center gap-1 text-text">
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    className={`size-2 rounded-full ${color.dot} ring-2 ${color.ring}`} 
                  />
                  <div className="h-3 w-8 bg-border/60 rounded-sm animate-pulse ml-1" />
                  <div className="h-3 w-4 bg-border/80 rounded-sm animate-pulse ml-0.5" />
                </span>
              );
            })}
          </motion.div>
        ) : (
          // Actual Data View
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-3"
          >
            {stats.map((stat, i) => {
              const color = intentColors[stat.intent] || intentColors.default;
              return (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: i * 0.08 }}
                  className="inline-flex items-center gap-1 text-text"
                >
                  <span className={`size-2 rounded-full ${color.dot} ring-2 ${color.ring}`} />
                  {stat.label}{" "}
                  <strong className="font-mono tabular-nums text-text font-bold">
                    {stat.value}
                  </strong>
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    portalTarget
  );
};
