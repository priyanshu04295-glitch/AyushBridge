"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  type: string;
  status: string;
  verification: string;
  applications: number;
};

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/opportunities")
      .then((response) => response.json())
      .then((data) => {
        setOpportunities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load opportunities:", error);
        setLoading(false);
      });
  }, []);

  const filteredOpportunities = opportunities.filter((opportunity) => {
    if (selectedStatus === "All") {
      return true;
    }

    if (selectedStatus === "Pending Review") {
      return opportunity.status === "Pending Review";
    }

    if (selectedStatus === "Verified") {
      return opportunity.status === "Published";
    }

    if (selectedStatus === "Flagged") {
      return opportunity.status === "Flagged";
    }

    return true;
  });

  const totalOpportunities = opportunities.length;
  const pendingReview = opportunities.filter(
    (opportunity) => opportunity.status === "Pending Review"
  ).length;
  const verified = opportunities.filter(
    (opportunity) => opportunity.verification === "Verified"
  ).length;
  const flagged = opportunities.filter(
    (opportunity) => opportunity.status === "Flagged"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading opportunities...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm text-emerald-400">
              Platform Governance
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Opportunity Verification
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Review and verify industry opportunities before they become
              visible across the platform.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              Platform Administrator
            </p>

            <p className="text-xs text-slate-400">
              Governance &amp; Verification
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["Total Opportunities", totalOpportunities],
            ["Pending Review", pendingReview],
            ["Verified", verified],
            ["Flagged", flagged],
          ].map(([label, value]) => (
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

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Industry Opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review opportunity details, competencies and verification
                status.
              </p>
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {opportunity.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          opportunity.verification === "Verified"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : opportunity.status === "Flagged"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {opportunity.verification}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {opportunity.organization} · {opportunity.type}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {opportunity.type}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {opportunity.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">
                      <span>
                        Applications:{" "}
                        <span className="text-slate-300">
                          {opportunity.applications}
                        </span>
                      </span>

                      <span>
                        Verification:{" "}
                        <span className="text-slate-300">
                          {opportunity.verification}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Review Opportunity
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No opportunities match the selected filter.
            </div>
          )}
        </section>

        {selectedOpportunity && (
          <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Verification Review
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedOpportunity.title}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {selectedOpportunity.organization} ·{" "}
                  {selectedOpportunity.type}
                </p>
              </div>

              <button
                onClick={() => setSelectedOpportunity(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Organization
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedOpportunity.organization}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Opportunity Type
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedOpportunity.type}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Applications
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedOpportunity.applications}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Verification
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedOpportunity.verification}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
                Approve &amp; Verify
              </button>

              <button className="rounded-xl border border-amber-400/30 px-5 py-3 text-sm font-medium text-amber-400 hover:bg-amber-400/10">
                Request Changes
              </button>

              <button className="rounded-xl border border-red-400/30 px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10">
                Flag Opportunity
              </button>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <p className="text-sm font-medium text-amber-400">
            AI Verification Insight
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Competency quality should be checked before publishing
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            Verification helps ensure that industry opportunities contain
            clear role descriptions, appropriate competencies, valid
            organizations and trustworthy requirements before they influence
            student recommendations and matching scores.
          </p>
        </section>
      </div>
    </main>
  );
}