"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Config {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  author: string;
  watermark: { name: string; text: string };
  theme: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setToast({ type: "success", message: "Settings saved successfully!" });
      } else {
        setToast({ type: "error", message: "Failed to save settings" });
      }
    } catch {
      setToast({ type: "error", message: "Failed to save settings" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const updateThemeColor = (mode: "light" | "dark", key: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        [mode]: { ...config.theme[mode], [key]: value },
      },
    });
  };

  if (loading || !config) {
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
          Settings
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
        Site metadata and theme configuration
      </p>

      {/* Toast */}
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

      {/* Site Metadata */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
          Site Metadata
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
              Site Title
            </label>
            <input
              value={config.siteTitle}
              onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
              Site Description
            </label>
            <textarea
              value={config.siteDescription}
              onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                Author
              </label>
              <input
                value={config.author}
                onChange={(e) => setConfig({ ...config, author: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                Keywords (comma-separated)
              </label>
              <input
                value={config.keywords.join(", ")}
                onChange={(e) => setConfig({ ...config, keywords: e.target.value.split(",").map((k) => k.trim()) })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
          Watermark
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
              Name
            </label>
            <input
              value={config.watermark.name}
              onChange={(e) => setConfig({ ...config, watermark: { ...config.watermark, name: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
              Subtitle
            </label>
            <input
              value={config.watermark.text}
              onChange={(e) => setConfig({ ...config, watermark: { ...config.watermark, text: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* Theme Colors */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
          Theme Colors
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {(["light", "dark"] as const).map((mode) => (
            <div key={mode}>
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                {mode} mode
              </h3>
              <div className="space-y-2">
                {Object.entries(config.theme[mode]).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateThemeColor(mode, key, e.target.value)}
                      className="w-8 h-8 rounded-lg border cursor-pointer"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="text-xs flex-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                      {key}
                    </span>
                    <input
                      value={value}
                      onChange={(e) => updateThemeColor(mode, key, e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                      style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)", fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
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
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
