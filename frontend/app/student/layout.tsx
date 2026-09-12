"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
    },
    {
      label: "My Skills",
      href: "/student/results",
    },
    {
      label: "Skill Assessment",
      href: "/student/assessment",
    },
    {
      label: "Opportunities",
      href: "/student/opportunities",
    },
    {
      label: "Applications",
      href: "/student/applications",
    },
    {
      label: "Portfolio",
      href: "/student/portfolio",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ayushbridge_token");
    localStorage.removeItem("ayushbridge_role");

    document.cookie =
      "ayushbridge_token=; path=/; max-age=0";

    document.cookie =
      "ayushbridge_role=; path=/; max-age=0";

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Student Sidebar */}
        <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 lg:block">
          <div className="flex h-full flex-col p-6">

            {/* Brand */}
            <Link href="/" className="mb-10 block">
              <div className="flex items-center gap-3">

                {/* Logo */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-lg font-bold text-emerald-400">
                  A
                </div>

                {/* Brand Text */}
                <div>
                  <div className="text-lg font-bold tracking-tight text-white">
                    AyushBridge
                  </div>

                  <div className="mt-0.5 text-[10px] text-slate-500">
                    Competency Intelligence
                  </div>
                </div>

              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">

              {navigation.map((item) => {
                const isActive =
                  item.href === "/student/dashboard"
                    ? pathname === "/student/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

            </nav>

            {/* Profile Section */}
            <div className="relative border-t border-slate-800 pt-5">

              {/* Profile Button */}
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-900"
              >

                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-semibold text-emerald-400">
                  AS
                </div>

                {/* Profile Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    Aarav Sharma
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    Student · BAMS
                  </p>
                </div>

                {/* Arrow */}
                <span
                  className={`text-xs text-slate-500 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>

              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute bottom-16 left-0 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">

                  <Link
                    href="/student/portfolio"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="block px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    View Portfolio
                  </Link>

                  <Link
                    href="/student/applications"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="block px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    My Applications
                  </Link>

                  <Link
                    href="/student/results"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="block px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    My Skills
                  </Link>

                  <div className="border-t border-slate-800" />

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Sign out
                  </button>

                </div>
              )}

            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-screen flex-1 lg:ml-64">
          {children}
        </main>

      </div>
    </div>
  );
}