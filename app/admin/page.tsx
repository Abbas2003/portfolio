"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  unreadMessages: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experience: 0, unreadMessages: 0 });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/data").then((r) => r.json()),
      fetch("/api/admin/messages").then((r) => r.json()),
    ]).then(([data, messages]) => {
      const totalSkills = data.skills?.categories?.reduce(
        (acc: number, cat: { skills: string[] }) => acc + cat.skills.length,
        0
      ) || 0;

      setStats({
        projects: data.projects?.items?.length || 0,
        skills: totalSkills,
        experience: data.experience?.items?.length || 0,
        unreadMessages: messages.filter((m: Message) => !m.read).length,
      });
      setRecentMessages(messages.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Projects", value: stats.projects, href: "/admin/content/projects", color: "#ff4d00" },
    { label: "Skills", value: stats.skills, href: "/admin/content/skills", color: "#6b3fa0" },
    { label: "Experience", value: stats.experience, href: "/admin/content/experience", color: "#0066cc" },
    { label: "Unread Messages", value: stats.unreadMessages, href: "/admin/messages", color: "#cc3333" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}
      >
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
        Overview of your portfolio content
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-5 rounded-xl transition-all hover:shadow-lg"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
              {card.label}
            </p>
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: card.color }}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
          Quick Edit
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Hero Section", href: "/admin/content/hero", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { label: "About Section", href: "/admin/content/about", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { label: "Skills", href: "/admin/content/skills", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
            { label: "Projects", href: "/admin/content/projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            { label: "Experience", href: "/admin/content/experience", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { label: "Contact Info", href: "/admin/content/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-md"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
            Recent Messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs font-medium uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
          >
            View All
          </Link>
        </div>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {recentMessages.length === 0 ? (
            <p className="p-6 text-sm text-center" style={{ color: "var(--color-muted)" }}>
              No messages yet
            </p>
          ) : (
            recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: msg.read ? "var(--color-border)" : "var(--color-accent)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-foreground)" }}>
                    {msg.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--color-muted)" }}>
                    {msg.message}
                  </p>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
