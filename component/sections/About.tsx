"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Code, Shield, Brain, Zap } from "lucide-react";
import Image from "next/image";

function CountUp({ target, delay }: { target: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayVal(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, target, delay]);

  return <span ref={ref}>{displayVal}</span>;
}

const stats = [
  { icon: Code, value: 5, suffix: "+", label: "Years Experience" },
  { icon: Shield, value: 50, suffix: "+", label: "Projects Delivered" },
  { icon: Brain, value: 10, suffix: "+", label: "AI Models Built" },
  { icon: Zap, value: 20, suffix: "+", label: "Vulns Reported" },
];

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center max-md:flex-col max-md:justify-center relative"
    >
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 grid-pattern pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }}
      />

      <div className="w-full flex gap-8 max-md:flex-col relative z-10">
        {/* Left - Text content + image */}
        <div className="flex-[3] max-w-2xl">
          <motion.p
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="section-label mb-3"
          >
            About Me
          </motion.p>

          <motion.h2
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl mb-3 leading-[0.9]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Code. Intelligence.
            <br />
            <span className="gradient-text">Security.</span>
          </motion.h2>

          <motion.p
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-muted leading-[1.7] mb-3 text-[15px]"
          >
            I&apos;m a full stack developer with deep expertise in AI engineering and
            cybersecurity. I build scalable, intelligent applications while ensuring
            they stand resilient against modern threats.
          </motion.p>

          <motion.p
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-muted leading-[1.7] mb-5 text-[15px]"
          >
            From architecting microservices to training neural networks, from
            penetration testing to building AI-powered tools — I thrive at the
            edges where disciplines collide.
          </motion.p>

          {/* Inline image */}
          <motion.div
            custom={3.5}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="mb-6"
          >
            <div className="image-artist relative" style={{ width: "100%", maxWidth: "480px", height: "160px" }}>
              <Image
                src="/my-pix/image-2.jpeg"
                alt="Workspace"
                fill
                className="object-cover"
                sizes="480px"
              />
            </div>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
          >
            <motion.a
              href="/api/cv"
              download
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium border transition-all duration-300 hover:border-foreground group"
              style={{
                borderColor: "var(--color-border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span>Download CV</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="group-hover:translate-y-0.5 transition-transform"
              >
                <path
                  d="M7 1v10M3 7l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* Right - Stats */}
        <div className="flex-2 grid grid-cols-2 gap-2 max-w-xs">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={2 + i * 0.5}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-3 rounded-xl cursor-default transition-all duration-300"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <stat.icon
                size={16}
                className="mb-2 transition-colors duration-300 group-hover:text-accent"
                style={{ color: "var(--color-muted)" }}
              />
              <div
                className="text-xl md:text-2xl font-bold mb-0.5"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                <CountUp target={stat.value} delay={0.5 + i * 0.15} />
                <span className="gradient-text">{stat.suffix}</span>
              </div>
              <p
                className="text-[10px] uppercase tracking-wider text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
