"use client";

import { useState, useEffect } from "react";

interface Experience {
  role: string;
  company: string;
  period: string;
  current: boolean;
  description: string;
  tags: string[];
}

interface ExperienceData {
  heading: string;
  experiences: Experience[];
}

export default function ExperienceEditor() {
  const [data, setData] = useState<ExperienceData>({
    heading: "",
    experiences: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Experience>({
    role: "",
    company: "",
    period: "",
    current: false,
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.experience) setData(json.experience);
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
        body: JSON.stringify({ section: "experience", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Experience content saved successfully!");
    } catch {
      showToast("error", "Failed to save experience content.");
    } finally {
      setSaving(false);
    }
  };

  const startNew = () => {
    setEditingIndex(-1);
    setEditForm({ role: "", company: "", period: "", current: false, description: "", tags: [] });
    setTagInput("");
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...data.experiences[index] });
    setTagInput(data.experiences[index].tags.join(", "));
  };

  const saveEdit = () => {
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const experience = { ...editForm, tags };
    const newExperiences = [...data.experiences];
    if (editingIndex === -1) {
      newExperiences.push(experience);
    } else if (editingIndex !== null) {
      newExperiences[editingIndex] = experience;
    }
    setData({ ...data, experiences: newExperiences });
    setEditingIndex(null);
  };

  const deleteExperience = (index: number) => {
    setData({ ...data, experiences: data.experiences.filter((_, i) => i !== index) });
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
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
        Edit Experience Section
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
          Heading
          <input
            type="text"
            value={data.heading}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            style={inputStyle}
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
              Experiences ({data?.experiences?.length})
            </span>
            <button
              onClick={startNew}
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
              + Add Experience
            </button>
          </div>

          {editingIndex !== null && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                background: "var(--color-surface, #1a1a2e)",
                borderRadius: "8px",
                border: "1px solid var(--color-primary, #3b82f6)",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)", marginBottom: "0.75rem" }}>
                {editingIndex === -1 ? "New Experience" : "Edit Experience"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Role
                  <input type="text" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Company
                  <input type="text" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Period
                  <input type="text" value={editForm.period} onChange={(e) => setEditForm({ ...editForm, period: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  <input
                    type="checkbox"
                    checked={editForm.current}
                    onChange={(e) => setEditForm({ ...editForm, current: e.target.checked })}
                  />
                  Currently working here
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Description
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Tags (comma-separated)
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} style={inputStyle} />
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveEdit} style={{ padding: "0.5rem 1rem", background: "var(--color-primary, #3b82f6)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.75rem" }}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={{ padding: "0.5rem 1rem", background: "var(--color-border, #333)", color: "var(--color-text, #e0e0e0)", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.75rem" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {data?.experiences?.map((exp, index) => (
            <div
              key={index}
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "0.5rem",
                background: "var(--color-surface, #1a1a2e)",
                borderRadius: "6px",
                border: "1px solid var(--color-border, #333)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text, #e0e0e0)" }}>
                  {exp.role}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--color-muted, #999)", marginLeft: "0.5rem" }}>
                  at {exp.company}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted, #999)", marginLeft: "0.5rem" }}>
                  {exp.period}
                </span>
                {exp.current && (
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.125rem 0.375rem",
                      background: "var(--color-success, #22c55e)",
                      color: "#fff",
                      borderRadius: "3px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <button
                  onClick={() => startEdit(index)}
                  style={{ padding: "0.25rem 0.5rem", background: "var(--color-primary, #3b82f6)", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.7rem" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExperience(index)}
                  style={{ padding: "0.25rem 0.5rem", background: "var(--color-error, #ef4444)", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.7rem" }}
                >
                  Delete
                </button>
              </div>
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
