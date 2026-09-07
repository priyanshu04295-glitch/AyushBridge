"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Skills, learning & opportunities",
    route: "/student/dashboard",
  },
  {
    id: "industry",
    label: "Industry",
    description: "Talent & opportunities",
    route: "/industry",
  },
  {
    id: "faculty",
    label: "Faculty",
    description: "Research & collaboration",
    route: "/faculty",
  },
  {
    id: "institution",
    label: "Institution",
    description: "Skill & outcome intelligence",
    route: "/institution/dashboard",
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Governance & verification",
    route: "/admin",
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
        `http://127.0.0.1:8000/auth/login?email=${encodeURIComponent(
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

      // Get the actual role from the authenticated backend account.
      const userRole = data.user.role;

      // IMPORTANT:
      // The selected role must match the actual account role.
      if (userRole !== selectedRole) {
        // Clear any old authentication data.
        localStorage.removeItem("ayushbridge_token");
        localStorage.removeItem("ayushbridge_user");

        document.cookie =
          "ayushbridge_token=; path=/; max-age=0; SameSite=Lax";

        document.cookie =
          "ayushbridge_role=; path=/; max-age=0; SameSite=Lax";

        const roleLabel =
          roles.find((role) => role.id === userRole)?.label ||
          userRole;

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

      // Store authentication only AFTER role validation succeeds.
      localStorage.setItem(
        "ayushbridge_token",
        data.access_token
      );

      localStorage.setItem(
        "ayushbridge_user",
        JSON.stringify(data.user)
      );

      // Store authentication data in cookies so
      // Next.js middleware can enforce RBAC.
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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-8">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-emerald-400"
              >
                AyushBridge
              </Link>

              <p className="mt-2 text-sm text-slate-500">
                Academia–Industry Intelligence Platform
              </p>
            </div>

            <p className="text-sm font-medium text-emerald-400">
              Smart India Hackathon 2026
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Connect skills with the right opportunities.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              AyushBridge connects students, industry, faculty and
              institutions through competency intelligence,
              explainable matching and verified outcomes.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [
                  "Skill Intelligence",
                  "Understand strengths and skill gaps",
                ],
                [
                  "Smart Matching",
                  "Match people with relevant opportunities",
                ],
                [
                  "Verified Portfolio",
                  "Build evidence-backed profiles",
                ],
                [
                  "Institutional Insights",
                  "Turn skill data into decisions",
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Select your role to continue.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError("");
                  }}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedRole === role.id
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-white/10 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      selectedRole === role.id
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >
                    {role.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : `Sign In as ${selected?.label}`}
              </button>

              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Use Demo Account
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              Authentication is powered by the AyushBridge backend.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}