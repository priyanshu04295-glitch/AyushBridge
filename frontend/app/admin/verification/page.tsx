"use client";

import { useEffect, useState } from "react";

type VerificationItem = {
  id: number;
  type: string;
  item: string;
  submitted_by: string;
  status: string;
  priority: string;
};

export default function AdminVerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] =
    useState<VerificationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/verification")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to load verification queue:",
          error
        );
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "All") {
      return true;
    }

    return item.status === filter;
  });

  const pendingCount = items.filter(
    (item) => item.status === "Pending"
  ).length;

  const verifiedCount = items.filter(
    (item) => item.status === "Verified"
  ).length;

  const highPriorityCount = items.filter(
    (item) => item.priority === "High"
  ).length;

  const updateStatus = (id: number, status: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );

    setSelectedItem(null);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-500">
          Loading verification queue...
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
            Verification Center
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review profiles, organizations, opportunities and
            evidence before they become trusted platform data.
          </p>
        </header>

        {/* CORE METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Pending Review"
            value={pendingCount}
            warning={pendingCount > 0}
          />

          <Metric
            label="Verified"
            value={verifiedCount}
          />

          <Metric
            label="High Priority"
            value={highPriorityCount}
            warning={highPriorityCount > 0}
          />

          <Metric
            label="Audit Records"
            value={0}
          />
        </section>

        {/* ADMIN ATTENTION */}
        {pendingCount > 0 && (
          <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Admin Attention
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {pendingCount} record
                  {pendingCount !== 1 ? "s" : ""} require review
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Prioritize pending and high-priority records
                  to maintain trusted platform data.
                </p>
              </div>

              <button
                onClick={() => setFilter("Pending")}
                className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Review Queue
              </button>
            </div>
          </section>
        )}

        {/* VERIFICATION QUEUE */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Trust &amp; Safety
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Verification Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review submitted records and maintain trusted
                ecosystem data.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-emerald-400"
            >
              <option value="All">All Records</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          {/* FILTER SUMMARY */}
          <div className="mt-5">
            <div className="inline-flex rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm text-slate-500">
              Showing{" "}
              <span className="mx-1 font-medium text-slate-300">
                {filteredItems.length}
              </span>
              records
            </div>
          </div>

          {/* QUEUE */}
          <div className="mt-6 space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/[0.07] bg-slate-950/60 p-6 transition hover:border-white/[0.12]"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                  {/* RECORD DETAILS */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-200">
                        {item.item}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          item.status === "Verified"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          item.priority === "High"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {item.type} · {item.submitted_by}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">
                      <span>
                        Submitted by:{" "}
                        <span className="text-slate-300">
                          {item.submitted_by}
                        </span>
                      </span>

                      <span>
                        Status:{" "}
                        <span className="text-slate-300">
                          {item.status}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* REVIEW BUTTON */}
                  <button
                    onClick={() =>
                      setSelectedItem(item)
                    }
                    className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-sm text-slate-500">
              No verification records match the selected filter.
            </div>
          )}
        </section>

        {/* SELECTED RECORD */}
        {selectedItem && (
          <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">

            {/* REVIEW HEADER */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Verification Review
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedItem.item}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {selectedItem.type} ·{" "}
                  {selectedItem.submitted_by}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* REVIEW DETAILS */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ReviewItem
                label="Record Type"
                value={selectedItem.type}
              />

              <ReviewItem
                label="Submitted By"
                value={selectedItem.submitted_by}
              />

              <ReviewItem
                label="Current Status"
                value={selectedItem.status}
                highlight={
                  selectedItem.status === "Verified"
                }
              />

              <ReviewItem
                label="Priority"
                value={selectedItem.priority}
                warning={
                  selectedItem.priority === "High"
                }
              />
            </div>

            {/* VERIFICATION CHECKLIST */}
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-slate-950/60 p-5">
              <p className="text-sm font-medium text-slate-300">
                Verification Checklist
              </p>

              <div className="mt-4 space-y-3">
                {[
                  "Identity / organization information",
                  "Institutional or industry affiliation",
                  "Submitted documents or evidence",
                  "Eligibility and competency requirements",
                  "Platform policy compliance",
                ].map((check) => (
                  <div
                    key={check}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 text-xs text-emerald-400">
                      ✓
                    </div>

                    {check}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              {selectedItem.status !== "Verified" && (
                <button
                  onClick={() =>
                    updateStatus(
                      selectedItem.id,
                      "Verified"
                    )
                  }
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Approve &amp; Verify
                </button>
              )}

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="rounded-xl border border-amber-400/30 px-5 py-3 text-sm font-medium text-amber-400 transition hover:bg-amber-400/10"
              >
                Request Changes
              </button>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="rounded-xl border border-red-400/30 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-400/10"
              >
                Reject
              </button>
            </div>
          </section>
        )}

        {/* TRUST & SAFETY INSIGHT */}
        <section className="mt-7 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Trust &amp; Safety
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Verification creates trusted platform intelligence
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Verified profiles, organizations, opportunities and
              skill evidence improve the reliability of matching,
              recommendations and institutional analytics.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Audit Trail
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Verification decisions should remain traceable
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Verification actions should record the administrator,
              timestamp, decision and reason so that platform
              governance remains transparent and accountable.
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
          warning
            ? "text-amber-400"
            : "text-white"
        }`}
      >
        {value.toLocaleString()}
      </p>

      <p
        className={`mt-2 text-xs ${
          warning
            ? "text-amber-400"
            : "text-emerald-400"
        }`}
      >
        Verification records
      </p>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  highlight = false,
  warning = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5">
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          warning
            ? "text-red-400"
            : highlight
              ? "text-emerald-400"
              : "text-slate-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}