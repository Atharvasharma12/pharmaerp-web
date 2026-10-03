import React from "react";
import { motion } from "framer-motion";

const PremiumAppLoader = ({ message = "Preparing workspace..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg/90 backdrop-blur-sm"
    >
      <div className="relative mb-12 flex h-16 w-16 items-center justify-center">
        {/* Overlapping rotating geometric rectangles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-2xl border-[1.5px] border-primary/40"
            initial={{ rotate: i * 30, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 180 + i * 30, scale: 1, opacity: 1 }}
            transition={{
              rotate: {
                duration: 2,
                ease: [0.77, 0, 0.175, 1],
                repeat: Infinity,
                repeatType: "mirror",
                repeatDelay: 0.5,
                delay: i * 0.1,
              },
              scale: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
              opacity: { duration: 0.4 },
            }}
          />
        ))}
        {/* Core resting block with a spring entrance */}
        <motion.div
          className="h-6 w-6 rounded-lg bg-primary"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        className="flex flex-col items-center space-y-4"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
            },
          }}
          className="text-lg font-medium tracking-tight text-text"
        >
          {message}
        </motion.div>

        {/* Eased indeterminate progress pill */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
            },
          }}
          className="h-1 w-24 overflow-hidden rounded-full bg-border"
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              ease: [0.77, 0, 0.175, 1],
              repeat: Infinity,
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumAppLoader;
