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
        console.error("Failed to load verification queue:", error);
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
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedItem(null);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading verification queue...
        </p>
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
              Verification Center
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Review profiles, organizations, opportunities and evidence
              before they become trusted platform data.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              Platform Administrator
            </p>

            <p className="text-xs text-slate-400">
              Trust, Safety &amp; Verification
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["Pending Review", pendingCount],
            ["Verified", verifiedCount],
            ["High Priority", highPriorityCount],
            ["Audit Records", 1284],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">
                {label}
              </p>

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
                Verification Queue
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review submitted records and maintain trusted ecosystem data.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-400"
            >
              <option value="All">All Records</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
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
                        Verification status:{" "}
                        <span className="text-slate-300">
                          {item.status}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No verification records match the selected filter.
            </div>
          )}
        </section>

        {selectedItem && (
          <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Verification Review
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedItem.item}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {selectedItem.type} · {selectedItem.submitted_by}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Record Type
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedItem.type}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Submitted By
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedItem.submitted_by}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Current Status
                </p>

                <p
                  className={`mt-2 text-sm font-medium ${
                    selectedItem.status === "Verified"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {selectedItem.status}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Priority
                </p>

                <p className="mt-2 text-sm font-medium">
                  {selectedItem.priority}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-medium">
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
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/40 text-xs text-emerald-400">
                      ✓
                    </div>

                    {check}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedItem.status !== "Verified" && (
                <button
                  onClick={() =>
                    updateStatus(selectedItem.id, "Verified")
                  }
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  Approve &amp; Verify
                </button>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-amber-400/30 px-5 py-3 text-sm font-medium text-amber-400 hover:bg-amber-400/10"
              >
                Request Changes
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-red-400/30 px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10"
              >
                Reject
              </button>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <p className="text-sm font-medium text-emerald-400">
              Trust &amp; Safety
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Verification creates trusted platform intelligence
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Verified profiles, organizations, opportunities and skill
              evidence improve the reliability of matching, recommendations
              and institutional analytics.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium text-slate-300">
              Audit Trail
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Every verification decision is traceable
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Verification actions should record the administrator,
              timestamp, decision and reason so that platform governance
              remains transparent and accountable.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}