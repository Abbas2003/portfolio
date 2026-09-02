"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: "var(--color-foreground)" }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated name reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
              className="overflow-hidden"
            >
              <motion.h1
                className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-background)",
                }}
              >
                {"Muhammad Abbas".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.3 + i * 0.05,
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-4 text-sm tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-accent)",
              }}
            >
              Loading
            </motion.p>

            {/* Animated line */}
            <motion.div
              className="mt-6 h-[1px] bg-accent"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
