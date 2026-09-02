"use client";

import { useState, useEffect } from "react";

interface Stat {
  value: string;
  suffix: string;
  label: string;
}

interface AboutData {
  heading: [string, string];
  paragraphs: [string, string];
  stats: Stat[];
}

export default function AboutEditor() {
  const [data, setData] = useState<AboutData>({
    heading: ["", ""],
    paragraphs: ["", ""],
    stats: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.about) setData(json.about);
        setLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to load data." });
        setLoading(false);
      });
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "About content saved successfully!");
    } catch {
      showToast("error", "Failed to save about content.");
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setData({ ...data, stats: [...data.stats, { value: "", suffix: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "var(--color-text)" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <a
        href="/admin"
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "1.5rem",
        }}
      >
        &larr; Back to Dashboard
      </a>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          color: "var(--color-heading)",
          marginBottom: "2rem",
        }}
      >
        Edit About Section
      </h1>

      {toast && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            background: toast.type === "success" ? "var(--color-success-bg, #d4edda)" : "var(--color-error-bg, #f8d7da)",
            color: toast.type === "success" ? "var(--color-success, #155724)" : "var(--color-error, #721c24)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Heading Line 1
          <input
            type="text"
            value={data.heading[0]}
            onChange={(e) => {
              const newHeading: [string, string] = [e.target.value, data.heading[1]];
              setData({ ...data, heading: newHeading });
            }}
            style={inputStyle}
          />
        </label>

        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Heading Line 2
          <input
            type="text"
            value={data.heading[1]}
            onChange={(e) => {
              const newHeading: [string, string] = [data.heading[0], e.target.value];
              setData({ ...data, heading: newHeading });
            }}
            style={inputStyle}
          />
        </label>

        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Paragraph 1
          <textarea
            value={data.paragraphs[0]}
            onChange={(e) => {
              const newParagraphs: [string, string] = [e.target.value, data.paragraphs[1]];
              setData({ ...data, paragraphs: newParagraphs });
            }}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Paragraph 2
          <textarea
            value={data.paragraphs[1]}
            onChange={(e) => {
              const newParagraphs: [string, string] = [data.paragraphs[0], e.target.value];
              setData({ ...data, paragraphs: newParagraphs });
            }}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
              Stats
            </span>
            <button
              onClick={addStat}
              style={{
                padding: "0.375rem 0.75rem",
                background: "var(--color-success, #22c55e)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              + Add Stat
            </button>
          </div>

          {data.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-end",
                marginBottom: "0.75rem",
                padding: "0.75rem",
                background: "var(--color-surface, #1a1a2e)",
                borderRadius: "6px",
                border: "1px solid var(--color-border, #333)",
              }}
            >
              <label style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                Value
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                Suffix
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => updateStat(i, "suffix", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                Label
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <button
                onClick={() => removeStat(i)}
                style={{
                  padding: "0.5rem",
                  background: "var(--color-error, #ef4444)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  marginBottom: "1px",
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--color-primary, #3b82f6)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            alignSelf: "flex-start",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "0.375rem",
  padding: "0.625rem 0.75rem",
  background: "var(--color-surface, #1a1a2e)",
  border: "1px solid var(--color-border, #333)",
  borderRadius: "6px",
  color: "var(--color-text, #e0e0e0)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  boxSizing: "border-box",
};
