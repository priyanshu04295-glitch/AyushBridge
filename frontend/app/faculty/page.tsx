"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  title: string;
  organization: string;
  date: string;
  type: string;
};

type FacultyDashboard = {
  name: string;
  department: string;
  expertise: string[];
  active_collaborations: number;
  research_projects: number;
  mentorship_requests: number;
  industry_engagements: number;
  upcoming_events: Event[];
  ai_insight: string;
};

export default function FacultyDashboardPage() {
  const [data, setData] =
    useState<FacultyDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/faculty/dashboard"
        );

        if (response.ok) {
          setData(await response.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">
            Loading faculty dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
            <p className="font-semibold text-red-400">
              Unable to load faculty dashboard.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please make sure the AyushBridge backend is running.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">

          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Faculty Intelligence
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Faculty Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {data.name} · {data.department}
          </p>

        </header>

        {/* EXPERTISE */}
        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Expertise
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Faculty Expertise
            </h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {data.expertise.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-2 text-sm text-emerald-400"
              >
                {item}
              </span>
            ))}
          </div>

        </section>

        {/* METRICS */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <Metric
            label="Active Collaborations"
            value={data.active_collaborations}
          />

          <Metric
            label="Research Projects"
            value={data.research_projects}
          />

          <Metric
            label="Mentorship Requests"
            value={data.mentorship_requests}
          />

          <Metric
            label="Industry Engagements"
            value={data.industry_engagements}
          />

        </div>

        {/* UPCOMING ENGAGEMENTS */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          <div className="flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Schedule
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Upcoming Engagements
              </h2>
            </div>

            <Link
              href="/faculty/collaborations"
              className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              View all →
            </Link>

          </div>

          <div className="mt-6 space-y-3">

            {data.upcoming_events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-7 text-center">
                <p className="text-sm text-slate-500">
                  No upcoming engagements.
                </p>
              </div>
            ) : (
              data.upcoming_events.map((event) => (
                <div
                  key={`${event.title}-${event.date}`}
                  className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5 transition hover:border-white/[0.1]"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                      <h3 className="font-medium text-white">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.organization}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400">
                        {event.type}
                      </span>

                      <span className="text-sm font-medium text-emerald-400">
                        {event.date}
                      </span>

                    </div>

                  </div>
                </div>
              ))
            )}

          </div>

        </section>

        {/* QUICK ACTIONS
        <section className="mt-6">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Quick Access
          </p>

          <div className="grid gap-3 md:grid-cols-3">

            <ActionCard
              title="Industry Collaborations"
              href="/faculty/collaborations"
            />

            <ActionCard
              title="Student Mentorship"
              href="/faculty/mentorship"
            />

            <ActionCard
              title="Research & Consultancy"
              href="/faculty/research"
            />

          </div>

        </section> */}

      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">

      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}

function ActionCard({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-slate-900/70 p-5 transition hover:border-emerald-400/20 hover:bg-slate-900"
    >
      <span className="text-sm font-medium text-slate-300 group-hover:text-white">
        {title}
      </span>

      <span className="text-sm text-slate-600 transition group-hover:text-emerald-400">
        →
      </span>
    </Link>
  );
}