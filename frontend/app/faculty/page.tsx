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
  const [data, setData] = useState<FacultyDashboard | null>(null);
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
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading faculty dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
          <p className="font-semibold text-red-400">
            Unable to load faculty dashboard.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Please make sure the AyushBridge backend is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm text-emerald-400">
            Academia–Industry Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Faculty Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Welcome, {data.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {data.department}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">
            Faculty Expertise
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {data.expertise.map((item) => (
              <span
                key={item}
                className="rounded-full border border-emerald-900 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-400">
                  Collaboration Ecosystem
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Upcoming Engagements
                </h2>
              </div>

              <Link
                href="/faculty/collaborations"
                className="text-sm text-emerald-400"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {data.upcoming_events.map((event) => (
                <div
                  key={`${event.title}-${event.date}`}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <h3 className="font-medium">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {event.organization}
                      </p>
                    </div>

                    <span className="h-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                      {event.type}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-emerald-400">
                    {event.date}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
            <p className="text-sm font-medium text-emerald-400">
              AI Faculty–Industry Insight
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Collaboration Intelligence
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              {data.ai_insight}
            </p>

            <div className="mt-6 rounded-xl border border-emerald-900 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Suggested Focus Areas
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                  Healthcare Data Analysis
                </span>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                  Biostatistics
                </span>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                  Clinical Research
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ActionCard
            title="Industry Collaborations"
            description="Connect with organizations for workshops, training, research, consultancy, and live projects."
            href="/faculty/collaborations"
          />

          <ActionCard
            title="Student Mentorship"
            description="Manage student mentorship and research guidance aligned with competency development."
            href="/faculty/mentorship"
          />

          <ActionCard
            title="Research & Consultancy"
            description="Track industry-linked research projects, consultancy, and innovation opportunities."
            href="/faculty/research"
          />
        </div>
      </div>
    </div>
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-900"
    >
      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <p className="mt-4 text-sm text-emerald-400">
        Open module →
      </p>
    </Link>
  );
}