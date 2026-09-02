"use client";

import { useState, useEffect } from "react";

interface SkillCategory {
  title: string;
  color: string;
  icon: string;
  skills: string[];
}

interface SkillsData {
  heading: string;
  categories: SkillCategory[];
}

export default function SkillsEditor() {
  const [data, setData] = useState<SkillsData>({
    heading: "",
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.skills) setData(json.skills);
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
        body: JSON.stringify({ section: "skills", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Skills content saved successfully!");
    } catch {
      showToast("error", "Failed to save skills content.");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    setData({
      ...data,
      categories: [...data.categories, { title: "", color: "#3b82f6", icon: "", skills: [] }],
    });
  };

  const removeCategory = (index: number) => {
    setData({ ...data, categories: data.categories.filter((_, i) => i !== index) });
  };

  const updateCategory = (index: number, field: keyof SkillCategory, value: string | string[]) => {
    const newCategories = [...data.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setData({ ...data, categories: newCategories });
  };

  const addSkillsFromInput = (catIndex: number) => {
    const input = skillInputs[catIndex] || "";
    const newSkills = input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (newSkills.length > 0) {
      updateCategory(catIndex, "skills", [...data.categories[catIndex].skills, ...newSkills]);
      setSkillInputs({ ...skillInputs, [catIndex]: "" });
    }
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const newSkills = data.categories[catIndex].skills.filter((_, i) => i !== skillIndex);
    updateCategory(catIndex, "skills", newSkills);
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
        Edit Skills Section
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
              Categories
            </span>
            <button
              onClick={addCategory}
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
              + Add Category
            </button>
          </div>

          {data.categories.map((cat, catIndex) => (
            <div
              key={catIndex}
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                background: "var(--color-surface, #1a1a2e)",
                borderRadius: "8px",
                border: "1px solid var(--color-border, #333)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  Category {catIndex + 1}
                </span>
                <button
                  onClick={() => removeCategory(catIndex)}
                  style={{
                    padding: "0.25rem 0.5rem",
                    background: "var(--color-error, #ef4444)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                  }}
                >
                  Remove
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Title
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => updateCategory(catIndex, "title", e.target.value)}
                    style={inputStyle}
                  />
                </label>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <label style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                    Color (hex)
                    <input
                      type="text"
                      value={cat.color}
                      onChange={(e) => updateCategory(catIndex, "color", e.target.value)}
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                    Icon
                    <input
                      type="text"
                      value={cat.icon}
                      onChange={(e) => updateCategory(catIndex, "icon", e.target.value)}
                      style={inputStyle}
                    />
                  </label>
                </div>

                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Add Skills (comma-separated)
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={skillInputs[catIndex] || ""}
                      onChange={(e) => setSkillInputs({ ...skillInputs, [catIndex]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkillsFromInput(catIndex);
                        }
                      }}
                      placeholder="e.g. React, TypeScript, Node.js"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => addSkillsFromInput(catIndex)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "var(--color-primary, #3b82f6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                      }}
                    >
                      Add
                    </button>
                  </div>
                </label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {cat.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.25rem 0.5rem",
                        background: cat.color + "22",
                        color: cat.color,
                        border: `1px solid ${cat.color}44`,
                        borderRadius: "4px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(catIndex, skillIndex)}
                        style={{
                          background: "none",
                          border: "none",
                          color: cat.color,
                          cursor: "pointer",
                          padding: 0,
                          fontSize: "0.875rem",
                          lineHeight: 1,
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
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
