"use client";

import { useEffect, useState } from "react";

type Activity = {
  action: string;
  entity: string;
  actor: string;
  status: string;
};

type AdminData = {
  total_users: number;
  students: number;
  faculty: number;
  industry_partners: number;
  institutions: number;
  pending_verifications: number;
  active_opportunities: number;
  flagged_opportunities: number;
  skill_taxonomy: number;
  verified_evidence: number;
  recent_activity: Activity[];
  ai_insight: {
    title: string;
    description: string;
    recommendation: string;
  };
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/dashboard"
        );

        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-500">
          Loading platform intelligence...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.04] p-7 text-center">
          <h2 className="text-xl font-semibold">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Make sure the AyushBridge backend is running.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Platform Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Monitor the AyushBridge ecosystem, manage platform
            governance and maintain trusted competency intelligence.
          </p>
        </header>

        {/* CORE METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total Users"
            value={data.total_users}
            note={`${data.students} students · ${data.faculty} faculty`}
          />

          <Metric
            label="Industry Partners"
            value={data.industry_partners}
            note={`${data.institutions} institutions connected`}
          />

          <Metric
            label="Active Opportunities"
            value={data.active_opportunities}
            note="Currently active"
          />

          <Metric
            label="Pending Verification"
            value={data.pending_verifications}
            note="Requires review"
            warning
          />
        </section>

        {/* ADMIN ATTENTION */}
        <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                Admin Attention
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {data.pending_verifications} items need verification
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review pending opportunities, evidence, profiles
                and organization verification requests.
              </p>
            </div>

            <a
              href="/admin/verification"
              className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Review Queue
            </a>
          </div>
        </section>

        {/* PLATFORM ACTIVITY + HEALTH */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">

          {/* PLATFORM ACTIVITY */}
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Ecosystem Overview
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Platform Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current participation across the AyushBridge ecosystem.
            </p>

            <div className="mt-7 space-y-6">
              <ActivityBar
                label="Students"
                value={data.students}
                percentage={65}
              />

              <ActivityBar
                label="Faculty"
                value={data.faculty}
                percentage={72}
              />

              <ActivityBar
                label="Industry Partners"
                value={data.industry_partners}
                percentage={54}
              />

              <ActivityBar
                label="Institutions"
                value={data.institutions}
                percentage={81}
              />
            </div>
          </div>

          {/* PLATFORM HEALTH */}
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Platform Health
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Trust & Intelligence
            </h2>

            <div className="mt-6 space-y-3">
              <HealthItem
                label="Verified Evidence"
                value={data.verified_evidence}
              />

              <HealthItem
                label="Skill Taxonomy"
                value={data.skill_taxonomy}
              />

              <HealthItem
                label="Flagged Opportunities"
                value={data.flagged_opportunities}
                warning
              />
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Governance
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Recent Platform Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent verification and governance events.
          </p>

          <div className="mt-6 space-y-3">
            {data.recent_activity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
                No recent activity available.
              </div>
            ) : (
              data.recent_activity.map((activity, index) => (
                <div
                  key={`${activity.entity}-${index}`}
                  className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {activity.action}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {activity.entity} · {activity.actor}
                      </p>
                    </div>

                    <span className="w-fit rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ADMIN CONTROLS */}
        <section className="mt-7">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Administration
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Platform Controls
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AdminAction
              href="/admin/users"
              title="Users"
              description="Manage users and access roles."
            />

            <AdminAction
              href="/admin/opportunities"
              title="Opportunities"
              description="Review and manage industry opportunities."
            />

            <AdminAction
              href="/admin/skills"
              title="Skills"
              description="Manage skills and competency mappings."
            />

            <AdminAction
              href="/admin/verification"
              title="Verification"
              description="Review evidence and verification requests."
            />
          </div>
        </section>

        {/* AI PLATFORM INSIGHT */}
        <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            AI Platform Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {data.ai_insight.title}
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
            {data.ai_insight.description}
          </p>

          <div className="mt-5 rounded-xl border border-white/[0.06] bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Recommended Action
            </p>

            <p className="mt-2 text-sm text-slate-300">
              {data.ai_insight.recommendation}
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({
  label,
  value,
  note,
  warning = false,
}: {
  label: string;
  value: number;
  note: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          warning ? "text-amber-400" : "text-white"
        }`}
      >
        {value.toLocaleString()}
      </p>

      <p
        className={`mt-2 text-xs ${
          warning ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function ActivityBar({
  label,
  value,
  percentage,
}: {
  label: string;
  value: number;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-300">
          {label}
        </span>

        <span className="text-sm font-medium text-emerald-400">
          {value.toLocaleString()}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function HealthItem({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-950/60 px-4 py-4">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span
        className={`text-lg font-semibold ${
          warning ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function AdminAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 transition hover:border-emerald-400/20 hover:bg-slate-900"
    >
      <p className="text-sm font-semibold text-emerald-400">
        {title}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-400">
        {description}
      </p>
    </a>
  );
}