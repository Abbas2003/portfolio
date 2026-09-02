"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...msg, read: true }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

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
          Messages
        </h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        {unreadCount > 0 ? `${unreadCount} unread` : "All messages read"}
      </p>

      {messages.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            No messages yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: "var(--color-card)",
                border: `1px solid ${msg.read ? "var(--color-border)" : "var(--color-accent)"}`,
              }}
            >
              <button
                onClick={() => {
                  setExpandedId(expandedId === msg.id ? null : msg.id);
                  markAsRead(msg.id);
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: msg.read ? "var(--color-border)" : "var(--color-accent)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                      {msg.name}
                    </span>
                    <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                      {msg.email}
                    </span>
                  </div>
                  <p className="text-sm truncate" style={{ color: "var(--color-muted)" }}>
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`transition-transform ${expandedId === msg.id ? "rotate-180" : ""}`}
                    style={{ color: "var(--color-muted)" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {expandedId === msg.id && (
                <div className="px-5 pb-4 pt-0">
                  <div
                    className="p-4 rounded-lg mb-3"
                    style={{ background: "var(--color-background)" }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-foreground)" }}>
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "#cc3333",
                        background: "rgba(204, 51, 51, 0.1)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
