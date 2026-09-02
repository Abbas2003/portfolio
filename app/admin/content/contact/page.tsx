"use client";

import { useState, useEffect } from "react";

interface SocialLink {
  name: string;
  url: string;
}

interface ContactData {
  heading: [string, string];
  description: string;
  email: string;
  location: string;
  socials: SocialLink[];
}

export default function ContactEditor() {
  const [data, setData] = useState<ContactData>({
    heading: ["", ""],
    description: "",
    email: "",
    location: "",
    socials: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((json) => {
        if (json.contact) setData(json.contact);
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
        body: JSON.stringify({ section: "contact", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Contact content saved successfully!");
    } catch {
      showToast("error", "Failed to save contact content.");
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setData({ ...data, socials: [...data.socials, { name: "", url: "" }] });
  };

  const removeSocial = (index: number) => {
    setData({ ...data, socials: data.socials.filter((_, i) => i !== index) });
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const newSocials = [...data.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setData({ ...data, socials: newSocials });
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
        Edit Contact Section
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
          Description
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Email
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            style={inputStyle}
          />
        </label>

        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Location
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
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
              Social Links
            </span>
            <button
              onClick={addSocial}
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
              + Add Social Link
            </button>
          </div>

          {data?.socials?.map((social, i) => (
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
                Name
                <input
                  type="text"
                  value={social.name}
                  onChange={(e) => updateSocial(i, "name", e.target.value)}
                  placeholder="e.g. GitHub, LinkedIn"
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-muted)" }}>
                URL
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <button
                onClick={() => removeSocial(i)}
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
