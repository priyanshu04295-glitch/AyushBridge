"use client";

import { useEffect, useState } from "react";

type IndustryData = {
  name: string;
  active_opportunities: number;
  applications: number;
  shortlisted: number;
  verified_candidates: number;
  top_demand: {
    skill: string;
    demand: number;
  }[];
  ai_insight: string;
};

export default function IndustryDashboard() {
  const [data, setData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/industry/dashboard"
        );

        if (!response.ok) {
          throw new Error("Failed to load industry dashboard");
        }

        const result = await response.json();
        setData(result);
      } catch {
        setError("Unable to connect to AyushBridge API");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-slate-400">Loading industry intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-red-400">{error || "No dashboard data found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">
            Industry Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {data.name}
          </h1>

          <p className="mt-2 text-slate-400">
            Discover talent, define competencies and build academia-industry
            opportunities.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Active Opportunities"
            value={data.active_opportunities}
          />
          <StatCard label="Applications" value={data.applications} />
          <StatCard label="Shortlisted" value={data.shortlisted} />
          <StatCard
            label="Verified Candidates"
            value={data.verified_candidates}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">Industry Skill Demand</h2>

            <p className="mt-1 text-sm text-slate-500">
              Competencies currently driving talent demand.
            </p>

            <div className="mt-6 space-y-5">
              {data.top_demand.map((item) => (
                <div key={item.skill}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      {item.skill}
                    </span>

                    <span className="text-sm font-semibold text-emerald-400">
                      {item.demand}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${item.demand}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
            <p className="text-sm font-medium text-emerald-400">
              AI Industry Insight
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Competency Intelligence
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              {data.ai_insight}
            </p>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Recommended Action
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Create competency-based opportunities and use explainable
                matching to identify candidates with the strongest verified
                evidence.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Industry → Academia Loop</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {[
              "Define Industry Need",
              "Map Competencies",
              "Discover Talent",
              "Enable Internship / Project",
              "Verify Outcomes",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="text-sm font-bold text-emerald-400">
                  0{index + 1}
                </div>

                <p className="mt-2 text-sm font-medium text-slate-200">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}