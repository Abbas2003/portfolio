"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code,
  Brain,
  Shield,
  Server,
  Wrench,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code,
    size: "large",
    color: "#ff4d00",
    skills: [
      "React", "Next.js", "TypeScript", "Tailwind CSS",
      "Vue.js", "HTML/CSS", "Framer Motion", "Redux",
    ],
  },
  {
    title: "AI / ML",
    icon: Brain,
    size: "large",
    color: "#6b3fa0",
    skills: [
      "TensorFlow", "PyTorch", "LangChain", "OpenAI API",
      "Hugging Face", "Scikit-learn", "Pandas", "RAG",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    size: "small",
    color: "#0066cc",
    skills: [
      "Node.js", "Python", "PostgreSQL", "MongoDB",
      "Express", "FastAPI", "Redis", "GraphQL",
    ],
  },
  {
    title: "Security",
    icon: Shield,
    size: "small",
    color: "#cc3333",
    skills: [
      "Pen Testing", "Bug Bounty", "OWASP",
      "Kali Linux", "Burp Suite", "Nmap",
    ],
  },
  {
    title: "DevOps",
    icon: Wrench,
    size: "small",
    color: "#22883e",
    skills: [
      "Docker", "Kubernetes", "AWS", "CI/CD",
      "Git", "Linux", "Terraform",
    ],
  },
];

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full h-full flex items-center max-md:flex-col max-md:justify-center px-8 md:px-16">
      <div className="w-full max-w-6xl">
        <motion.p
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="section-label mb-6"
        >
          Tech Stack
        </motion.p>

        <motion.h2
          custom={1}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl mb-10 leading-[0.9]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Skills & Technologies
        </motion.h2>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              custom={2 + catIndex}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
              }}
              className={`group p-6 rounded-2xl cursor-default transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${
                category.size === "large" ? "lg:row-span-1" : ""
              }`}
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${category.color}12` }}
                >
                  <category.icon size={18} style={{ color: category.color }} />
                </div>
                <h3
                  className="text-xs font-medium uppercase tracking-wider text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {category.title}
                </h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: 0.3 + catIndex * 0.08 + i * 0.03,
                      duration: 0.4,
                      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
                    }}
                    className="skill-badge px-3 py-1.5 rounded-full text-xs font-medium cursor-default"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "var(--color-background)",
                      color: "var(--color-foreground)",
                      border: "1px solid var(--color-border)",
                    }}
                    data-cursor-hover
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
