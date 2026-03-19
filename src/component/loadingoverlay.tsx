"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ show, message }: { show: boolean; message?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-lg font-medium tracking-wide">
            {message || "Processing... Please wait"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
