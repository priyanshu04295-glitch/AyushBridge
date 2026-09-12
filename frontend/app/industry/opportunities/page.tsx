"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  const totalApplicants = opportunities.reduce(
    (sum, item) => sum + item.applicants,
    0
  );

  const totalShortlisted = opportunities.reduce(
    (sum, item) => sum + item.shortlisted,
    0
  );

  const totalVerified = opportunities.reduce(
    (sum, item) => sum + item.verified_matches,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-3xl border border-white/[0.07] bg-slate-900/70 p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading opportunities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-7 text-white lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Opportunity Management
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Opportunities
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage competency-based internships, projects and
                industry opportunities.
              </p>
            </div>

            <Link
              href="/industry/create-opportunity"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              + Create Opportunity
            </Link>
          </div>
        </header>

        {/* SUMMARY */}
        <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Opportunities"
            value={opportunities.length}
            accent
          />

          <StatCard
            label="Total Applicants"
            value={totalApplicants}
          />

          <StatCard
            label="Shortlisted"
            value={totalShortlisted}
          />

          <StatCard
            label="Verified Matches"
            value={totalVerified}
            accent
          />
        </div>

        {/* OPPORTUNITY LIST */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Your Opportunities
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Active opportunity portfolio
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {opportunities.length}{" "}
              {opportunities.length === 1
                ? "opportunity"
                : "opportunities"}
            </span>
          </div>

          <div className="space-y-4">
            {opportunities.length > 0 ? (
              opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-10 text-center">
                <p className="text-sm font-medium text-slate-300">
                  No opportunities created yet.
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Create your first competency-based opportunity.
                </p>

                <Link
                  href="/industry/create-opportunity"
                  className="mt-5 inline-flex rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  Create Opportunity
                </Link>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 transition hover:border-white/[0.12]">

      {/* TOP */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row">

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">

            <h2 className="text-xl font-semibold tracking-tight text-white">
              {opportunity.title}
            </h2>

            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
              {opportunity.status}
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-[10px] font-medium text-slate-500">
              {opportunity.type}
            </span>

          </div>

          {/* COMPETENCIES */}
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Required Competencies
            </p>

            <div className="flex flex-wrap gap-2">
              {opportunity.top_competencies.map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/[0.05] bg-slate-950/70 px-3 py-2 text-xs text-slate-300"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid shrink-0 grid-cols-3 gap-5 border-t border-white/[0.05] pt-4 lg:min-w-[390px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

          <Metric
            label="Applicants"
            value={opportunity.applicants}
          />

          <Metric
            label="Shortlisted"
            value={opportunity.shortlisted}
          />

          <Metric
            label="Verified"
            value={opportunity.verified_matches}
            accent
          />

        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-2.5 border-t border-white/[0.05] pt-5">

        <Link
          href={`/industry/opportunities/${opportunity.id}`}
          className="rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          View Opportunity
        </Link>

        <Link
          href="/industry/candidates"
          className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-400/[0.08]"
        >
          Find Matching Candidates
        </Link>

        <Link
          href="/industry/applications"
          className="rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          Manage Applications
        </Link>

      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-emerald-400/10 bg-emerald-400/[0.03]"
          : "border-white/[0.07] bg-slate-900/70"
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-bold ${
          accent ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          accent ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}