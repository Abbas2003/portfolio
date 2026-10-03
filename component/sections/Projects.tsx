"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Code2, ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "proj_1",
    title: "AI Code Reviewer",
    description:
      "An AI-powered tool that automatically reviews pull requests, suggests improvements, and detects potential security vulnerabilities using LLMs.",
    tags: ["Python", "OpenAI", "GitHub API", "FastAPI"],
    category: "ai",
    featured: true,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
  {
    id: "proj_2",
    title: "SecureChat",
    description:
      "End-to-end encrypted messaging platform with zero-knowledge architecture and forward secrecy.",
    tags: ["React", "Node.js", "WebSocket", "Crypto"],
    category: "security",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
  {
    id: "proj_3",
    title: "Nexus SaaS Platform",
    description:
      "Multi-tenant SaaS application with subscription billing, RBAC, and real-time analytics.",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Tailwind"],
    category: "fullstack",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
  {
    id: "proj_4",
    title: "VulnScanner Pro",
    description:
      "Automated vulnerability scanner that identifies OWASP Top 10 security flaws.",
    tags: ["Python", "BeautifulSoup", "Nmap", "Docker"],
    category: "security",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
  {
    id: "proj_5",
    title: "AI Content Generator",
    description:
      "Content generation platform using fine-tuned language models for marketing copy and blog posts.",
    tags: ["Next.js", "LangChain", "RAG", "Vector DB"],
    category: "ai",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
  {
    id: "proj_6",
    title: "CloudDeploy",
    description:
      "One-click deployment platform with auto-scaling, monitoring, and CI/CD integration.",
    tags: ["React", "Kubernetes", "Docker", "AWS"],
    category: "fullstack",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  },
];

const categories = [
  { value: "all", label: "All" },
  { value: "fullstack", label: "Full Stack" },
  { value: "ai", label: "AI / ML" },
  { value: "security", label: "Security" },
];

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

interface ProjectsProps {
  data?: {
    heading: string;
    items: {
      id: string;
      title: string;
      description: string;
      tags: string[];
      category: string;
      featured: boolean;
      image: string;
      codeUrl: string;
      liveUrl: string;
    }[];
  };
}

export default function Projects({ data }: ProjectsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("all");

  const projectsData = data?.items || projects;
  const filtered =
    filter === "all"
      ? projectsData
      : projectsData.filter((p) => p.category === filter);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div ref={ref} className="w-full h-full max-md:flex-col max-md:justify-center py-4 max-md:py-0">
      <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto">
        <motion.p
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="section-label mb-6"
        >
          Portfolio
        </motion.p>

        <motion.h2
          custom={1}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl mb-6 leading-[0.9]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          {data?.heading || "Selected Projects"}
        </motion.h2>

        {/* Filter pills */}
        <motion.div
          custom={2}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex flex-wrap gap-2 mb-6"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-3 rounded-full text-xs font-medium transition-all duration-300 ${
                filter === cat.value
                  ? "text-background"
                  : "text-muted hover:text-foreground"
              }`}
              style={{
                fontFamily: "var(--font-mono)",
                background:
                  filter === cat.value
                    ? "var(--color-foreground)"
                    : "var(--color-card)",
                border: `1px solid ${
                  filter === cat.value
                    ? "var(--color-foreground)"
                    : "var(--color-border)"
                }`,
              }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured project */}
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div
              key={featured.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-5"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group p-8 max-md:p-5 rounded-2xl cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-8 max-md:gap-5"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
                data-cursor-hover
              >
                {/* Image placeholder */}
                <div
                  className="flex-1 h-56 md:h-64 rounded-xl overflow-hidden relative"
                  style={{ background: "var(--color-cream)" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-muted text-sm"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    Project Screenshot
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    style={{ background: "rgba(10, 10, 10, 0.6)" }}
                  >
                    <ArrowUpRight size={32} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: "var(--color-accent)",
                        color: "white",
                      }}
                    >
                      Featured
                    </span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl mb-3 leading-[0.95]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                  >
                    {featured.title}
                  </h3>
                   <p className="text-muted text-sm leading-[1.7] mb-5">
                    {featured.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[10px] font-medium"
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
                   <div className="flex gap-3">
                    <a
                      href={featured.codeUrl || "#"}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors p-2 -m-2 rounded-lg"
                      style={{ fontFamily: "var(--font-mono)" }}
                      data-cursor-hover
                    >
                      <Code2 size={14} /> Code
                    </a>
                    <a
                      href={featured.liveUrl || "#"}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors p-2 -m-2 rounded-lg"
                      style={{ fontFamily: "var(--font-mono)" }}
                      data-cursor-hover
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {rest.map((project) => (
              <motion.div
                key={project.title}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group h-full p-6 rounded-2xl cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                  data-cursor-hover
                >
                  {/* Image placeholder */}
                  <div
                    className="h-36 rounded-xl mb-5 overflow-hidden relative"
                    style={{ background: "var(--color-cream)" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-muted text-xs"
                      style={{ fontFamily: "var(--font-mono)" }}>
                      Screenshot
                    </div>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                      style={{ background: "rgba(10, 10, 10, 0.6)" }}
                    >
                      <ArrowUpRight size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-lg leading-[0.95]"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      <a href={project.codeUrl || "#"} className="text-muted hover:text-foreground transition-colors" data-cursor-hover>
                        <Code2 size={14} />
                      </a>
                      <a href={project.liveUrl || "#"} className="text-muted hover:text-foreground transition-colors" data-cursor-hover>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  <p className="text-muted text-sm leading-[1.7] mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
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
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
