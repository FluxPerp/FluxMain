"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function PreloadScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090b]"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: [0, 1, 1, 1], scale: [1, 1, 1.05, 1] }}
        transition={{
          duration: 1.45,
          times: [0, 0.2, 0.82, 1],
          ease: EASE,
        }}
      >
        <Image
          src="/logo_without_background.png"
          alt="FluxPerp"
          width={44}
          height={44}
          priority
          className="h-11 w-11 object-contain"
        />
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          FluxPerp
        </span>
      </motion.div>
    </motion.div>
  );
}
