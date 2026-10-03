"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Navigation from "./Navigation";
import MobileNav from "./MobileNav";

const sections = ["hero", "about", "skills", "projects", "experience", "contact"];
const scrollableSections = ["projects", "experience"];

export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isScrolling = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, sections.length - 1));

      if (isMobile) {
        const el = document.getElementById(sections[clamped]);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(clamped);
        }
      } else {
        const container = containerRef.current;
        if (container && !isScrolling.current) {
          isScrolling.current = true;
          container.scrollTo({
            left: clamped * window.innerWidth,
            behavior: "smooth",
          });
          setActiveSection(clamped);
          setTimeout(() => {
            isScrolling.current = false;
          }, 600);
        }
      }
    },
    [isMobile]
  );

  // Wheel handler for horizontal scroll (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      const currentSectionKey = sections[activeSection];
      const isCurrentScrollable = scrollableSections.includes(currentSectionKey);

      if (isCurrentScrollable) {
        const sectionEl = container.children[activeSection] as HTMLElement;
        if (sectionEl) {
          const { scrollTop, scrollHeight, clientHeight } = sectionEl;
          const atTop = scrollTop <= 0;
          const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

          if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
            return;
          }
        }
      }

      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      if (Math.abs(delta) > 30) {
        if (delta > 0) {
          scrollToSection(activeSection + 1);
        } else {
          scrollToSection(activeSection - 1);
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isMobile, activeSection, scrollToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, scrollToSection]);

  // Sync active section on scroll — desktop (scrollLeft)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;
      const scrollLeft = container.scrollLeft;
      const sectionWidth = window.innerWidth;
      const index = Math.round(scrollLeft / sectionWidth);
      setActiveSection(Math.min(Math.max(index, 0), sections.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Sync active section on scroll — mobile (viewport mid-line detection)
  // Note: ratio-based IntersectionObserver fails for sections taller than
  // the viewport (e.g. Projects) — mid-line check works for any height.
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const mid = window.innerHeight * 0.5;
      let active = 0;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= mid) active = i;
      });
      setActiveSection(active);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <>
      <Navigation
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <MobileNav
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {isMobile ? (
        <div>
          {sections.map((section, i) => {
            const isScrollable = scrollableSections.includes(section);
            return (
              <div
                key={section}
                id={section}
                className={`section-panel ${isScrollable ? "section-panel-scrollable" : ""}`}
              >
                {Array.isArray(children) ? children[i] : children}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="horizontal-scroll-container overflow-x-hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {Array.isArray(children)
            ? children.map((child, i) => {
                const isScrollable = scrollableSections.includes(sections[i]);
                return (
                  <div
                    key={sections[i]}
                    className={`section-panel ${isScrollable ? "section-panel-scrollable" : ""}`}
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {child}
                  </div>
                );
              })
            : children}
        </div>
      )}
    </>
  );
}
