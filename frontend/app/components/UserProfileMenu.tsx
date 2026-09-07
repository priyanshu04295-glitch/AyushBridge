"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserProfileMenu() {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const logout = () => {
    localStorage.removeItem("ayushbridge_token");
    localStorage.removeItem("ayushbridge_role");
    localStorage.removeItem("ayushbridge_user");

    document.cookie =
      "ayushbridge_token=; path=/; max-age=0";

    document.cookie =
      "ayushbridge_role=; path=/; max-age=0";

    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={logout}
      aria-label="Logout"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        left: "20px",
        bottom: "20px",
        zIndex: 2147483647,
        width: "42px",
        height: "42px",
        borderRadius: "9999px",
        border: "1px solid rgb(51 65 85)",
        background: hover
          ? "rgb(127 29 29)"
          : "rgb(15 23 42)",
        color: "rgb(248 113 113)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
      }}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </svg>
    </button>
  );
}