"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: number;
  title: string;
  type: string;
  status: string;
  applicants: number;
  shortlisted: number;
  verified_matches: number;
  top_competencies: string[];
};

export default function IndustryOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/industry/opportunities/"
        );

        if (!response.ok) {
          throw new Error("Failed to load opportunities");
        }

        const data = await response.json();
        setOpportunities(data);
      } catch {
        setError("Unable to connect to AyushBridge API");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-slate-400">Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Industry Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Opportunities
            </h1>

            <p className="mt-2 text-slate-400">
              Manage competency-based internships, projects and industry
              opportunities.
            </p>
          </div>

          <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
            + Create Opportunity
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total Opportunities"
            value={opportunities.length}
          />

          <StatCard
            label="Total Applicants"
            value={opportunities.reduce(
              (sum, item) => sum + item.applicants,
              0
            )}
          />

          <StatCard
            label="Shortlisted"
            value={opportunities.reduce(
              (sum, item) => sum + item.shortlisted,
              0
            )}
          />

          <StatCard
            label="Verified Matches"
            value={opportunities.reduce(
              (sum, item) => sum + item.verified_matches,
              0
            )}
          />
        </div>

        <div className="mt-8 space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {opportunity.title}
                    </h2>

                    <span className="rounded-full border border-emerald-900 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
                      {opportunity.status}
                    </span>

                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                      {opportunity.type}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {opportunity.top_competencies.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 lg:min-w-[390px]">
                  <Metric
                    label="Applicants"
                    value={opportunity.applicants}
                  />

                  <Metric
                    label="Shortlisted"
                    value={opportunity.shortlisted}
                  />

                  <Metric
                    label="Verified Matches"
                    value={opportunity.verified_matches}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-5">
                <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  View Opportunity
                </button>

                <button className="rounded-lg border border-emerald-800 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-950">
                  Find Matching Candidates
                </button>

                <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800">
                  Manage Applications
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <p className="text-sm font-medium text-emerald-400">
            AI Opportunity Intelligence
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Match opportunities to verified competencies
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            AyushBridge can translate opportunity requirements into
            competencies, identify candidates with matching evidence and
            highlight the exact skill gaps before an industry partner
            shortlists a candidate.
          </p>
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
      <p className="mt-3 text-3xl font-bold">{value}</p>
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
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}