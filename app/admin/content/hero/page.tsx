"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeroData {
  name: string;
  role: string;
  headline: [string, string, string];
  description: string;
  image: string;
  ctaPrimary: { label: string; link: string };
  ctaSecondary: { label: string; link: string };
}

export default function HeroEditor() {
  const [data, setData] = useState<HeroData>({
    name: "",
    role: "",
    headline: ["", "", ""],
    description: "",
    image: "",
    ctaPrimary: { label: "", link: "" },
    ctaSecondary: { label: "", link: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.hero) setData(json.hero);
        setLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to load data." });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ type: "success", message: "Hero content saved successfully!" });
    } catch {
      setToast({ type: "error", message: "Failed to save hero content." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const updateHeadline = (index: number, value: string) => {
    const newHeadline = [...data.headline] as [string, string, string];
    newHeadline[index] = value;
    setData({ ...data, headline: newHeadline });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-wider transition-colors"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        >
          Dashboard
        </Link>
        <span style={{ color: "var(--color-muted)" }}>/</span>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}
        >
          Edit Hero Section
        </h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Main landing section content
      </p>

      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg"
          style={{
            background: toast.type === "success" ? "#22c55e" : "#cc3333",
            color: "white",
            fontFamily: "var(--font-mono)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-5">
        <div className="p-6 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Name</label>
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Role</label>
              <input
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>Headline</h2>
          <div className="space-y-3">
            {data.headline.map((line, i) => (
              <div key={i}>
                <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                  Line {i + 1}
                </label>
                <input
                  value={line}
                  onChange={(e) => updateHeadline(i, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>CTA Primary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Label</label>
              <input
                value={data.ctaPrimary.label}
                onChange={(e) => setData({ ...data, ctaPrimary: { ...data.ctaPrimary, label: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Link</label>
              <input
                value={data.ctaPrimary.link}
                onChange={(e) => setData({ ...data, ctaPrimary: { ...data.ctaPrimary, link: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>CTA Secondary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Label</label>
              <input
                value={data.ctaSecondary.label}
                onChange={(e) => setData({ ...data, ctaSecondary: { ...data.ctaSecondary, label: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>Link</label>
              <input
                value={data.ctaSecondary.link}
                onChange={(e) => setData({ ...data, ctaSecondary: { ...data.ctaSecondary, link: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{
            background: "var(--color-accent)",
            color: "white",
            fontFamily: "var(--font-mono)",
          }}
        >
          {saving ? "Saving..." : "Save Hero"}
        </button>
      </div>
    </div>
  );
}
