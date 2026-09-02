"use client";

import { useState, useEffect } from "react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  category: "ai" | "security" | "fullstack";
  featured: boolean;
  image: string;
  codeUrl: string;
  liveUrl: string;
}

interface ProjectsData {
  heading: string;
  projects: Project[];
}

export default function ProjectsEditor() {
  const [data, setData] = useState<ProjectsData>({
    heading: "",
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Project>({
    title: "",
    description: "",
    tags: [],
    category: "fullstack",
    featured: false,
    image: "",
    codeUrl: "",
    liveUrl: "",
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.projects) setData(json.projects);
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
        body: JSON.stringify({ section: "projects", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Projects content saved successfully!");
    } catch {
      showToast("error", "Failed to save projects content.");
    } finally {
      setSaving(false);
    }
  };

  const startNew = () => {
    setEditingIndex(-1);
    setEditForm({
      title: "",
      description: "",
      tags: [],
      category: "fullstack",
      featured: false,
      image: "",
      codeUrl: "",
      liveUrl: "",
    });
    setTagInput("");
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...data.projects[index] });
    setTagInput(data.projects[index].tags.join(", "));
  };

  const saveEdit = () => {
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const project = { ...editForm, tags };
    const newProjects = [...data.projects];
    if (editingIndex === -1) {
      newProjects.push(project);
    } else if (editingIndex !== null) {
      newProjects[editingIndex] = project;
    }
    setData({ ...data, projects: newProjects });
    setEditingIndex(null);
  };

  const deleteProject = (index: number) => {
    setData({ ...data, projects: data.projects.filter((_, i) => i !== index) });
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
        Edit Projects Section
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
              Projects ({data?.projects?.length})
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
              + Add Project
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
                {editingIndex === -1 ? "New Project" : "Edit Project"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Title
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Description
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Tags (comma-separated)
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Category
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Project["category"] })}
                    style={inputStyle}
                  >
                    <option value="ai">AI</option>
                    <option value="security">Security</option>
                    <option value="fullstack">Fullstack</option>
                  </select>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Image URL
                  <input type="text" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Code URL
                  <input type="text" value={editForm.codeUrl} onChange={(e) => setEditForm({ ...editForm, codeUrl: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                  Live URL
                  <input type="text" value={editForm.liveUrl} onChange={(e) => setEditForm({ ...editForm, liveUrl: e.target.value })} style={inputStyle} />
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

          {data?.projects?.map((project, index) => (
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
                  {project.title}
                </span>
                {project.featured && (
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.125rem 0.375rem",
                      background: "var(--color-warning, #f59e0b)",
                      color: "#000",
                      borderRadius: "3px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                    }}
                  >
                    Featured
                  </span>
                )}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.125rem 0.375rem",
                    background: "var(--color-border, #333)",
                    color: "var(--color-muted, #999)",
                    borderRadius: "3px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                  }}
                >
                  {project.category}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <button
                  onClick={() => startEdit(index)}
                  style={{ padding: "0.25rem 0.5rem", background: "var(--color-primary, #3b82f6)", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.7rem" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(index)}
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
