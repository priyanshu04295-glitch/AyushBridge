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

  const filteredOpportunities = opportunities.filter(
    (opportunity) => {
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
    }
  );

  const totalOpportunities = opportunities.length;

  const pendingReview = opportunities.filter(
    (opportunity) =>
      opportunity.status === "Pending Review"
  ).length;

  const verified = opportunities.filter(
    (opportunity) =>
      opportunity.verification === "Verified"
  ).length;

  const flagged = opportunities.filter(
    (opportunity) =>
      opportunity.status === "Flagged"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-500">
          Loading opportunities...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Platform Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Opportunity Verification
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review and verify industry opportunities before
            they become visible across the platform.
          </p>
        </header>

        {/* CORE METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total Opportunities"
            value={totalOpportunities}
          />

          <Metric
            label="Pending Review"
            value={pendingReview}
            warning={pendingReview > 0}
          />

          <Metric
            label="Verified"
            value={verified}
          />

          <Metric
            label="Flagged"
            value={flagged}
            warning={flagged > 0}
          />
        </section>

        {/* ADMIN ATTENTION */}
        {pendingReview > 0 && (
          <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Admin Attention
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {pendingReview} opportunit
                  {pendingReview === 1 ? "y" : "ies"} require review
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review opportunity details, organization information
                  and competency requirements before publication.
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedStatus("Pending Review")
                }
                className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Review Queue
              </button>
            </div>
          </section>
        )}

        {/* OPPORTUNITY DIRECTORY */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Directory
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Industry Opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review opportunity details, applications and
                verification status.
              </p>
            </div>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">
                Pending Review
              </option>
              <option value="Verified">
                Verified
              </option>
              <option value="Flagged">
                Flagged
              </option>
            </select>
          </div>

          {/* FILTER SUMMARY */}
          <div className="mt-5 flex items-center">
            <div className="rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-300">
                {filteredOpportunities.length}
              </span>{" "}
              opportunities
            </div>
          </div>

          {/* OPPORTUNITY LIST */}
          <div className="mt-6 space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-white/[0.07] bg-slate-950/60 p-6 transition hover:border-white/[0.12]"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                  {/* DETAILS */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-200">
                        {opportunity.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          opportunity.verification ===
                          "Verified"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : opportunity.status ===
                                "Flagged"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {opportunity.verification}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {opportunity.organization} ·{" "}
                      {opportunity.type}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {opportunity.type}
                      </span>

                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs ${
                          opportunity.status === "Flagged"
                            ? "bg-red-400/10 text-red-400"
                            : opportunity.status ===
                                "Pending Review"
                              ? "bg-amber-400/10 text-amber-400"
                              : "bg-slate-800 text-slate-300"
                        }`}
                      >
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

                  {/* ACTION */}
                  <button
                    onClick={() =>
                      setSelectedOpportunity(opportunity)
                    }
                    className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Review Opportunity
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredOpportunities.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-sm text-slate-500">
              No opportunities match the selected filter.
            </div>
          )}
        </section>

        {/* SELECTED OPPORTUNITY */}
        {selectedOpportunity && (
          <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">

            {/* REVIEW HEADER */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
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
                onClick={() =>
                  setSelectedOpportunity(null)
                }
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* REVIEW DETAILS */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ReviewItem
                label="Organization"
                value={selectedOpportunity.organization}
              />

              <ReviewItem
                label="Opportunity Type"
                value={selectedOpportunity.type}
              />

              <ReviewItem
                label="Applications"
                value={selectedOpportunity.applications.toString()}
              />

              <ReviewItem
                label="Verification"
                value={selectedOpportunity.verification}
              />
            </div>

            {/* REVIEW ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Approve &amp; Verify
              </button>

              <button className="rounded-xl border border-amber-400/30 px-5 py-3 text-sm font-medium text-amber-400 transition hover:bg-amber-400/10">
                Request Changes
              </button>

              <button className="rounded-xl border border-red-400/30 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-400/10">
                Flag Opportunity
              </button>
            </div>
          </section>
        )}

        {/* AI VERIFICATION INSIGHT */}
        <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            AI Verification Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Competency quality should be checked before publishing
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
            Verification helps ensure that industry opportunities
            contain clear role descriptions, appropriate competencies,
            valid organizations and trustworthy requirements before
            they influence student recommendations and matching scores.
          </p>
        </section>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: number;
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
        Platform opportunities
      </p>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5">
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}