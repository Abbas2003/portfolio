"use client";

import { motion } from "framer-motion";

interface NavigationProps {
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

export default function Navigation({ sections, activeSection, onNavigate }: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-5 max-md:hidden"
    >
      {/* Progress line behind dots */}
      <div className="absolute right-[3px] top-0 bottom-0 w-[2px] rounded-full overflow-hidden"
        style={{ background: "var(--color-border)" }}>
        <motion.div
          className="w-full rounded-full"
          style={{ background: "var(--color-accent)" }}
          animate={{
            height: `${((activeSection) / (sections.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        />
      </div>

      {sections.map((section, i) => (
        <button
          key={section}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-4 relative"
          aria-label={`Go to ${sectionLabels[section] || section}`}
        >
          {/* Label */}
          <span
            className={`text-[11px] uppercase tracking-wider transition-all duration-300 font-medium ${
              i === activeSection
                ? "opacity-100 translate-x-0"
                : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            }`}
            style={{
              fontFamily: "var(--font-mono)",
              color: i === activeSection ? "var(--color-accent)" : "var(--color-foreground)",
            }}
          >
            {sectionLabels[section] || section}
          </span>

          {/* Dot */}
          <div className="relative">
            <div
              className={`nav-dot ${i === activeSection ? "active" : ""}`}
            />
          </div>
        </button>
      ))}
    </motion.nav>
  );
}
