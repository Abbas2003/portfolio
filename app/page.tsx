"use client";

import ThemeToggle from "@/component/ThemeToggle";
import HorizontalScroll from "@/component/HorizontalScroll";
import CustomCursor from "@/component/CustomCursor";
import Preloader from "@/component/Preloader";
import Hero from "@/component/sections/Hero";
import About from "@/component/sections/About";
import Skills from "@/component/sections/Skills";
import Projects from "@/component/sections/Projects";
import Experience from "@/component/sections/Experience";
import Contact from "@/component/sections/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <ThemeToggle />

      {/* Decorative bottom watermark */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 max-md:hidden flex flex-col items-center"
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(100px, 15vw, 220px)",
            fontWeight: 400,
            lineHeight: 1,
            color: "var(--color-foreground)",
            opacity: 0.04,
            letterSpacing: "0.05em",
          }}
        >
          M.ABBAS
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(12px, 2vw, 22px)",
            fontWeight: 500,
            lineHeight: 1,
            color: "var(--color-foreground)",
            opacity: 0.06,
            letterSpacing: "0.5em",
            width: "100%",
            textAlign: "center",
          }}
        >
          PORTFOLIO
        </div>
      </div>

      <HorizontalScroll>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </HorizontalScroll>
    </>
  );
}
