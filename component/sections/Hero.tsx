"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";

const wordReveal = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.8 + i * 0.08,
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 1.4 + i * 0.1,
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

interface HeroProps {
  data?: {
    name: string;
    role: string;
    headline: string[];
    description: string;
    image: string;
    ctaPrimary: { label: string; link: string };
    ctaSecondary: { label: string; link: string };
  };
}

export default function Hero({ data }: HeroProps) {
  const ref = useRef(null);

  return (
    <div ref={ref} className="w-full h-full flex items-center relative overflow-hidden">
      {/* Decorative background number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(200px, 30vw, 400px)",
          fontWeight: 400,
          lineHeight: 1,
          color: "var(--color-foreground)",
        }}
      >
        01
      </motion.div>

      {/* Decorative floating shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-32 right-[45%] max-md:hidden"
      >
        <div
          className="w-20 h-20 rounded-full border border-accent"
          style={{ animation: "float-slow 8s ease-in-out infinite" }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 2.3, duration: 1 }}
        className="absolute bottom-40 right-[42%] max-md:hidden"
      >
        <div
          className="w-3 h-3 rounded-full bg-accent"
          style={{ animation: "float-medium 6s ease-in-out infinite" }}
        />
      </motion.div>

      <div className="w-full flex items-center gap-12 max-md:flex-col relative z-10">
        {/* Left content */}
        <div className="flex-1 max-w-2xl">
          {/* Name */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-foreground text-lg md:text-xl font-medium mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {data?.name || "Muhammad Abbas"}
          </motion.p>

          {/* Role label */}
          <motion.div
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="section-label mb-6"
          >
            {data?.role || "Full Stack Developer / AI Engineer / Ethical Hacker"}
          </motion.div>

          {/* Headline with word reveal */}
          <div className="mb-6">
            <div className="overflow-hidden">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                {(data?.headline?.[0] || "Building").split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    custom={1}
                    variants={wordReveal}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight gradient-text"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                {(data?.headline?.[1] || "the future").split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    custom={2 + i}
                    variants={wordReveal}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {(data?.headline?.[2] || "& breaking it").split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    custom={4 + i}
                    variants={wordReveal}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
          </div>

          {/* Animated line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ delay: 1.6, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
            className="h-[2px] bg-accent mb-6"
          />

          {/* Description */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-muted text-base md:text-lg max-w-md mb-8 leading-[1.7]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {data?.description || "I craft high-performance web applications, engineer intelligent AI solutions, and break systems to make them stronger."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex gap-4 items-center"
          >
            <motion.a
              href={data?.ctaPrimary?.link || "#projects"}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group px-7 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300"
              style={{
                background: "var(--color-foreground)",
                color: "var(--color-background)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {data?.ctaPrimary?.label || "View Projects"}
              <ArrowDownRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform -rotate-90"
              />
            </motion.a>

            <motion.a
              href={data?.ctaSecondary?.link || "#contact"}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full text-sm font-medium border transition-all duration-300 hover:border-foreground"
              style={{
                borderColor: "var(--color-border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {data?.ctaSecondary?.label || "Get in Touch"}
            </motion.a>
          </motion.div>
        </div>

        {/* Right - Profile image */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ delay: 1, duration: 1, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          className="flex-shrink-0 max-md:mx-auto max-md:mt-8"
        >
          <div className="image-hacker relative w-full max-w-[200px] md:max-w-none md:w-[320px] aspect-[3/4]">
            <Image
              src={data?.image || "/my-pix/image-3.jpeg"}
              alt={data?.name || "Muhammad Abbas"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 200px, 320px"
              preload
            />
            {/* Scan line overlay effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,77,0,0.02) 3px, rgba(255,77,0,0.02) 4px)",
              }}
            />
          </div>
          {/* Caption under image */}
          <p
            className="mt-3 text-[10px] uppercase tracking-wider text-muted text-center"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {"// system.override"}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 max-md:hidden"
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDownRight size={14} className="text-muted rotate-45" />
        </motion.div>
      </motion.div>
    </div>
  );
}
