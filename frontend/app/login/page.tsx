"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8000";

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Skills, learning & opportunities",
    route: "/student/dashboard",
    short: "Career Intelligence",
  },
  {
    id: "industry",
    label: "Industry",
    description: "Talent & opportunities",
    route: "/industry",
    short: "Talent Intelligence",
  },
  {
    id: "faculty",
    label: "Faculty",
    description: "Research & collaboration",
    route: "/faculty",
    short: "Academic Collaboration",
  },
  {
    id: "institution",
    label: "Institution",
    description: "Skill & outcome intelligence",
    route: "/institution/dashboard",
    short: "Institutional Intelligence",
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Governance & verification",
    route: "/admin",
    short: "Platform Governance",
  },
];

const intelligenceItems = [
  {
    number: "01",
    title: "Competency Mapping",
    text: "Translate industry needs into measurable skills.",
  },
  {
    number: "02",
    title: "Explainable Matching",
    text: "Understand why people and opportunities fit.",
  },
  {
    number: "03",
    title: "Verified Skills",
    text: "Build evidence-backed competency profiles.",
  },
  {
    number: "04",
    title: "Institutional Intelligence",
    text: "Turn skill data into actionable decisions.",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = roles.find(
    (role) => role.id === selectedRole
  );

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const messages = data.detail
            .map(
              (item: { msg?: string }) =>
                item.msg || "Invalid input."
            )
            .join(" ");

          throw new Error(messages);
        }

        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      const userRole = data.user.role;

      if (userRole !== selectedRole) {
        localStorage.removeItem("ayushbridge_token");
        localStorage.removeItem("ayushbridge_user");

        document.cookie =
          "ayushbridge_token=; path=/; max-age=0; SameSite=Lax";

        document.cookie =
          "ayushbridge_role=; path=/; max-age=0; SameSite=Lax";

        const roleLabel =
          roles.find(
            (role) => role.id === userRole
          )?.label || userRole;

        throw new Error(
          `This account belongs to ${roleLabel}. Please select ${roleLabel} before signing in.`
        );
      }

      const userRoute = roles.find(
        (role) => role.id === userRole
      )?.route;

      if (!userRoute) {
        throw new Error(
          "No dashboard found for this user role."
        );
      }

      localStorage.setItem(
        "ayushbridge_token",
        data.access_token
      );

      localStorage.setItem(
        "ayushbridge_user",
        JSON.stringify(data.user)
      );

      document.cookie = `ayushbridge_token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;

      document.cookie = `ayushbridge_role=${data.user.role}; path=/; max-age=3600; SameSite=Lax`;

      router.push(userRoute);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("student@ayushbridge.demo");
    setPassword("student123");
    setSelectedRole("student");
    setError("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-emerald-500/[0.07] blur-[130px]" />

        <div className="absolute bottom-[-220px] right-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[130px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.025] blur-[100px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-20 border-b border-white/[0.06] bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Same logo as homepage */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <span className="text-lg font-bold text-emerald-400">
                A
              </span>
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                AyushBridge
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Competency Intelligence Platform
              </div>
            </div>
          </Link>

          {/* Redesigned Back button */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-400 shadow-sm backdrop-blur-sm transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.06] hover:text-white"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>

            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-12 lg:px-8">
        <div className="grid w-full gap-16 lg:grid-cols-[1fr_460px] lg:items-center">
          {/* LEFT SIDE */}
          <section className="hidden lg:block">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-2 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Academia × Industry × Intelligence
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                One bridge between{" "}
                <span className="text-emerald-400">
                  skills
                </span>{" "}
                and opportunity.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
                Enter a connected ecosystem where industry
                requirements, academic capabilities, student
                development and verified opportunities work
                together through competency intelligence.
              </p>
            </div>

            {/* Intelligence cards */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3">
              {intelligenceItems.map((item) => (
                <div
                  key={item.number}
                  className="group rounded-2xl border border-white/[0.07] bg-slate-900/55 p-5 backdrop-blur-sm transition hover:border-emerald-400/20 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400">
                      {item.number}
                    </span>

                    <span className="text-slate-700 transition group-hover:text-emerald-400">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Intelligence flow */}
            <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-600">
              <span>Industry</span>
              <span className="text-emerald-500/50">
                →
              </span>

              <span>Competencies</span>
              <span className="text-emerald-500/50">
                →
              </span>

              <span>Skills</span>
              <span className="text-emerald-500/50">
                →
              </span>

              <span>Opportunity</span>
              <span className="text-emerald-500/50">
                →
              </span>

              <span>Verified Outcome</span>
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="mx-auto w-full max-w-[460px]">
            <div className="rounded-3xl border border-white/[0.09] bg-slate-900/80 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              {/* Card heading */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select your role and enter your credentials
                  to continue.
                </p>
              </div>

              {/* ROLE SELECTION */}
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Continue as
                  </label>

                  <span className="text-xs text-emerald-400">
                    {selected?.short}
                  </span>
                </div>

                {/* 4 top roles */}
                <div className="grid grid-cols-2 gap-2">
                  {roles.slice(0, 4).map((role) => {
                    const active =
                      selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setError("");
                        }}
                        className={`group rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                            : "border-white/[0.07] bg-slate-950/70 hover:border-slate-600 hover:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              active
                                ? "text-emerald-300"
                                : "text-slate-300"
                            }`}
                          >
                            {role.label}
                          </span>

                          {active && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-950">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] leading-4 text-slate-600">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Centered Administrator */}
                <div className="mt-2 flex justify-center">
                  {(() => {
                    const role = roles[4];
                    const active =
                      selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setError("");
                        }}
                        className={`w-[calc(50%-4px)] rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                            : "border-white/[0.07] bg-slate-950/70 hover:border-slate-600 hover:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              active
                                ? "text-emerald-300"
                                : "text-slate-300"
                            }`}
                          >
                            {role.label}
                          </span>

                          {active && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-950">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] leading-4 text-slate-600">
                          {role.description}
                        </p>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* FORM */}
              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-slate-400"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-slate-400"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleLogin();
                      }
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
                    <div className="flex gap-2">
                      <span className="text-red-400">
                        !
                      </span>

                      <p className="text-xs leading-5 text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* LOGIN */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : `Continue as ${selected?.label}`}

                  {!loading && (
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                {/* DEMO */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Use Student Demo Account
                </button>
              </div>

              {/* Selected role */}
              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />

                <p className="text-[11px] text-slate-600">
                  Signing in to{" "}
                  <span className="text-slate-400">
                    {selected?.label}
                  </span>{" "}
                  workspace
                </p>
              </div>
            </div>

            {/* Security note */}
            <p className="mt-5 text-center text-[10px] leading-5 text-slate-700">
              Secure authentication · Role-based access ·
              AyushBridge Intelligence Platform
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}