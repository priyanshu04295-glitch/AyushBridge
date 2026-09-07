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
    fetch("http://127.0.0.1:8000/admin/dashboard")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load admin dashboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading admin dashboard...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <h2 className="text-xl font-semibold">Unable to load dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">
            Make sure the AyushBridge backend is running.
          </p>
        </div>
      </main>
    );
  }

  const platformActivity = [
    ["Students", data.students, "65%"],
    ["Faculty", data.faculty, "72%"],
    ["Industry Partners", data.industry_partners, "54%"],
    ["Institutions", data.institutions, "81%"],
  ];

  const summaryCards = [
    ["Total Users", data.total_users],
    ["Verified Industries", data.industry_partners],
    ["Active Opportunities", data.active_opportunities],
    ["Pending Verifications", data.pending_verifications],
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AyushBridge</h1>
            <p className="text-xs text-slate-400">
              Academia–Industry Competency Intelligence Platform
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">Platform Administrator</p>
            <p className="text-xs text-slate-400">
              Governance &amp; Verification
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-8">
          <p className="text-sm text-emerald-400">Platform Intelligence</p>

          <h2 className="mt-1 text-3xl font-bold">Admin Dashboard</h2>

          <p className="mt-2 max-w-3xl text-slate-400">
            Monitor the AyushBridge ecosystem, verify opportunities and
            evidence, manage competency intelligence and maintain platform
            governance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {summaryCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">{label}</p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <div>
              <h3 className="text-lg font-semibold">Platform Activity</h3>

              <p className="mt-1 text-sm text-slate-400">
                Current ecosystem activity across AyushBridge
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {platformActivity.map(([label, value, percentage]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">{label}</span>

                    <span className="text-sm text-emerald-400">
                      {Number(value).toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: percentage as string }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
            <p className="text-sm font-medium text-amber-400">
              Admin Attention
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              {data.pending_verifications} items need verification
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Pending items include industry opportunities, student evidence,
              faculty profiles and organization verification requests.
            </p>

            <a
              href="/admin/verification"
              className="mt-6 block rounded-xl bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Review Verification Queue
            </a>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-lg font-semibold">Recent Platform Activity</h3>

            <p className="mt-1 text-sm text-slate-400">
              Recent governance and verification events
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {data.recent_activity.map((activity, index) => (
              <div
                key={`${activity.entity}-${index}`}
                className="rounded-xl border border-white/10 bg-slate-900/50 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {activity.entity} · {activity.actor}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/users"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
          >
            <p className="text-sm font-medium text-emerald-400">
              User Management
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Manage Users &amp; Roles
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manage students, faculty, institutions, industries and access
              roles.
            </p>
          </a>

          <a
            href="/admin/opportunities"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
          >
            <p className="text-sm font-medium text-emerald-400">
              Opportunities
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Verify Opportunities
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Review industry jobs, internships, projects and apprenticeships.
            </p>
          </a>

          <a
            href="/admin/skills"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
          >
            <p className="text-sm font-medium text-emerald-400">
              Competency Intelligence
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Skills &amp; Competencies
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manage skills, competencies, mappings and industry demand data.
            </p>
          </a>

          <a
            href="/admin/verification"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
          >
            <p className="text-sm font-medium text-emerald-400">
              Verification
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Evidence &amp; Trust
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Verify credentials, skills, organizations and portfolio
              evidence.
            </p>
          </a>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-lg font-semibold">
              Governance &amp; Intelligence
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Core controls supporting the trusted Academia–Industry
              ecosystem.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
              <p className="text-sm font-medium text-emerald-400">
                Verification
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Maintain trusted student, faculty, institution and industry
                profiles through evidence-based verification.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
              <p className="text-sm font-medium text-emerald-400">
                Competency Governance
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Keep the competency framework aligned with changing industry
                requirements and learning pathways.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
              <p className="text-sm font-medium text-emerald-400">
                Audit &amp; Analytics
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Track platform activity, verification actions, outcomes and
                ecosystem performance.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <p className="text-sm font-medium text-emerald-400">
            AI Platform Insight
          </p>

          <h3 className="mt-3 text-xl font-semibold">
            {data.ai_insight.title}
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            {data.ai_insight.description}
          </p>

          <div className="mt-4 rounded-xl border border-emerald-400/10 bg-slate-950/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
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