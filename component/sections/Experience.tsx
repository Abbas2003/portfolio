"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    period: "2023 — Present",
    current: true,
    description:
      "Leading development of microservices architecture, implementing CI/CD pipelines, and mentoring junior developers on security best practices.",
    tags: ["React", "Node.js", "AWS", "Docker"],
  },
  {
    role: "AI Engineer",
    company: "AI Labs",
    period: "2022 — 2023",
    current: false,
    description:
      "Designed and deployed machine learning models for NLP, built RAG pipelines, and integrated LLMs into production applications.",
    tags: ["Python", "PyTorch", "LangChain", "OpenAI"],
  },
  {
    role: "Security Consultant",
    company: "CyberShield",
    period: "2021 — 2022",
    current: false,
    description:
      "Conducted penetration testing for enterprise clients, discovered critical vulnerabilities, and developed automated security scanning tools.",
    tags: ["Kali Linux", "Burp Suite", "OWASP", "Python"],
  },
  {
    role: "Junior Developer",
    company: "StartUp Co.",
    period: "2020 — 2021",
    current: false,
    description:
      "Built responsive web applications, contributed to open-source projects, and learned the fundamentals of secure coding practices.",
    tags: ["React", "TypeScript", "PostgreSQL", "Git"],
  },
];

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

interface ExperienceProps {
  data?: {
    heading: string;
    items: {
      id: string;
      role: string;
      company: string;
      period: string;
      current: boolean;
      description: string;
      tags: string[];
    }[];
  };
}

export default function Experience({ data }: ExperienceProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full h-full max-md:flex-col max-md:justify-center py-4 max-md:py-0">
      <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto">
        <motion.p
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="section-label mb-6"
        >
          Experience
        </motion.p>

        <motion.h2
          custom={1}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl mb-10 leading-[0.9]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          {data?.heading || "Work Timeline"}
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="timeline-line" />

          {/* Animated progress line */}
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
            className="timeline-line-progress"
          />

          {(data?.items || experiences).map((exp, i) => (
            <motion.div
              key={exp.role}
              custom={2 + i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              className={`relative flex items-center mb-10 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } max-md:flex-row`}
            >
              {/* Timeline dot */}
              <div className="absolute left-[50%] -translate-x-1/2 z-10 max-md:left-[16px]">
                <div
                  className={`w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex items-center justify-center ${
                    exp.current ? "" : ""
                  }`}
                  style={{
                    background: exp.current ? "var(--color-accent)" : "var(--color-card)",
                    border: `2px solid ${exp.current ? "var(--color-accent)" : "var(--color-border)"}`,
                    animation: exp.current ? "pulse-accent 2s ease-in-out infinite" : "none",
                  }}
                >
                  <Briefcase
                    size={14}
                    style={{ color: exp.current ? "white" : "var(--color-muted)" }}
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className={`w-[calc(50%-40px)] max-md:w-full max-md:ml-12 ${
                  i % 2 === 0 ? "md:text-right md:pr-10" : "md:text-left md:pl-10"
                }`}
              >
                <div
                  className={`p-6 max-md:p-4 rounded-2xl transition-all duration-300 ${
                    exp.current ? "" : ""
                  }`}
                  style={{
                    background: "var(--color-card)",
                    border: `1px solid ${exp.current ? "var(--color-accent)" : "var(--color-border)"}`,
                    boxShadow: exp.current ? "0 4px 20px rgba(255, 77, 0, 0.08)" : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {exp.current && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: "var(--color-accent)",
                          color: "white",
                        }}
                      >
                        Current
                      </span>
                    )}
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: exp.current ? "var(--color-accent)" : "var(--color-muted)",
                      }}
                    >
                      {exp.period}
                    </p>
                  </div>

                  <h3
                    className="text-lg mb-1 leading-[0.95]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                  >
                    {exp.role}
                  </h3>
                  <p className="text-muted text-sm mb-3">{exp.company}</p>
                  <p className="text-muted text-sm leading-[1.7] mb-4">
                    {exp.description}
                  </p>

                  <div
                    className={`flex flex-wrap gap-1.5 ${
                      i % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}
                  >
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: "var(--color-background)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden md:block w-[calc(50%-40px)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
