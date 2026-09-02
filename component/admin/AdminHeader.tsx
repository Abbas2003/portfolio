"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header
      className="h-14 border-b flex items-center justify-end px-6"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--color-background)]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </header>
  );
}
