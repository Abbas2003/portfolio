"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, ArrowUpRight } from "lucide-react";

interface ContactProps {
  data?: {
    heading: string[];
    description: string;
    email: string;
    location: string;
    social: { name: string; url: string }[];
  };
}

export default function Contact({ data }: ContactProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

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

  return (
    <div ref={ref} className="w-full h-full flex items-center max-md:flex-col max-md:justify-center relative">
      {/* Decorative background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.03 } : {}}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute right-20 top-1/2 -translate-y-1/2 select-none pointer-events-none max-md:hidden"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(150px, 20vw, 300px)",
          fontWeight: 400,
          lineHeight: 1,
          color: "var(--color-foreground)",
        }}
      >
        HELLO
      </motion.div>

      <div className="w-full max-w-5xl flex gap-16 max-md:gap-10 max-md:flex-col relative z-10">
        {/* Left - Info */}
        <div className="flex-1">
          <motion.p
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="section-label mb-6"
          >
            Contact
          </motion.p>

          <motion.h2
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl mb-5 leading-[0.9]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            {data?.heading?.[0] || "Let's Work"}
            <br />
            <span className="gradient-text">{data?.heading?.[1] || "Together"}</span>
          </motion.h2>

          <motion.p
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-muted leading-[1.7] mb-8 max-w-md text-base"
          >
            {data?.description || "Have a project in mind, need a security audit, or want to collaborate on AI research? I'd love to hear from you."}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="space-y-4 mb-10"
          >
            <div className="flex items-center gap-3 text-sm text-muted">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-cream)" }}
              >
                <Mail size={16} style={{ color: "var(--color-accent)" }} />
              </div>
              <span>{data?.email || "hello@yourdomain.com"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-cream)" }}
              >
                <MapPin size={16} style={{ color: "var(--color-accent)" }} />
              </div>
              <span>{data?.location || "Available Worldwide / Remote"}</span>
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            custom={4}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="flex gap-3"
          >
            {(data?.social || [
              { name: "GitHub", url: "https://github.com/" },
              { name: "LinkedIn", url: "https://linkedin.com/" },
              { name: "X / Twitter", url: "https://x.com/" },
            ]).map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="group flex items-center gap-2 px-4 py-3 rounded-full text-xs font-medium transition-all duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  border: "1px solid var(--color-border)",
                }}
                data-cursor-hover
              >
                {social.name}
                <ArrowUpRight
                  size={12}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right - Form */}
        <motion.div
          custom={2}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex-1"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] uppercase tracking-wider text-muted mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl text-sm input-glow transition-all duration-300 focus:outline-none"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-sans)",
                }}
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[11px] uppercase tracking-wider text-muted mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl text-sm input-glow transition-all duration-300 focus:outline-none"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-sans)",
                }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[11px] uppercase tracking-wider text-muted mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl text-sm input-glow transition-all duration-300 focus:outline-none resize-none"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-sans)",
                }}
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
              style={{
                fontFamily: "var(--font-mono)",
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
                color: "white",
              }}
            >
              {status === "loading" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : status === "success" ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Message Sent!
                </motion.span>
              ) : (
                <>
                  Send Message <Send size={14} />
                </>
              )}
            </motion.button>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center"
                style={{ color: "#cc3333" }}
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
