"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileNavProps {
  sections: string[];
  activeSection: number;
  onNavigate: (index: number) => void;
}

const sectionLabels: Record<string, string> = {
  hero: "Home",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  contact: "Contact",
};

export default function MobileNav({ sections, activeSection, onNavigate }: MobileNavProps) {
  const progress = ((activeSection) / (sections.length - 1)) * 100;
  const isFirst = activeSection === 0;
  const isLast = activeSection === sections.length - 1;

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.5, duration: 0.7, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Progress bar */}
      <div className="h-[2px] w-full" style={{ background: "var(--color-border)" }}>
        <motion.div
          className="h-full"
          style={{ background: "var(--color-accent)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        />
      </div>

      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{
          background: "color-mix(in srgb, var(--color-card) 85%, transparent)",
          borderTop: "1px solid var(--color-border)",
          backdropFilter: "blur(16px) saturate(1.2)",
          WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        }}
      >
        {/* Prev button */}
        <motion.button
          onClick={() => onNavigate(Math.max(0, activeSection - 1))}
          disabled={isFirst}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-15"
          style={{
            background: "var(--color-background)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
          }}
          aria-label="Previous section"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </motion.button>

        {/* Center - dots + section info */}
        <div className="flex flex-col items-center gap-1.5">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {sections.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => onNavigate(i)}
                whileTap={{ scale: 0.8 }}
                animate={{
                  width: i === activeSection ? 24 : 6,
                  background: i === activeSection ? "var(--color-accent)" : "var(--color-border)",
                }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                className="h-1.5 rounded-full"
                aria-label={`Go to ${sectionLabels[sections[i]]}`}
              />
            ))}
          </div>

          {/* Section name + counter */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSection}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-muted)",
                }}
              >
                {sectionLabels[sections[activeSection]] || sections[activeSection]}
              </motion.span>
            </AnimatePresence>
            <span
              className="text-[9px] font-medium tabular-nums"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-accent)",
              }}
            >
              {String(activeSection + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => onNavigate(Math.min(sections.length - 1, activeSection + 1))}
          disabled={isLast}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-15"
          style={{
            background: "var(--color-foreground)",
            color: "var(--color-background)",
          }}
          aria-label="Next section"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.nav>
  );
}
