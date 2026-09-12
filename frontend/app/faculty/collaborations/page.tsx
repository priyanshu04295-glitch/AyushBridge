"use client";

import { useEffect, useMemo, useState } from "react";

type Collaboration = {
  id: number;
  industry_name: string;
  faculty_id: number;
  faculty_name: string;
  collaboration_type: string;
  competencies: string;
  message: string;
  status: string;
};

export default function FacultyCollaborations() {
  const [collaborations, setCollaborations] = useState<
    Collaboration[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCollaborations();
  }, []);

  async function loadCollaborations() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/industry/faculty-collaborations"
      );

      if (response.ok) {
        setCollaborations(await response.json());
      }
    } catch {
      setMessage("Unable to connect to AyushBridge API.");
    } finally {
      setLoading(false);
    }
  }

  const types = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          collaborations.map(
            (item) => item.collaboration_type
          )
        )
      ),
    ];
  }, [collaborations]);

  const filteredCollaborations =
    filter === "All"
      ? collaborations
      : collaborations.filter(
          (item) =>
            item.collaboration_type === filter
        );

  const pendingCount = collaborations.filter(
    (item) => item.status === "Pending"
  ).length;

  const activeCount = collaborations.filter(
    (item) =>
      item.status === "Accepted" ||
      item.status === "Active"
  ).length;

  async function updateStatus(
    collaborationId: number,
    status: string
  ) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/industry/faculty-collaboration/${collaborationId}?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setCollaborations((current) =>
        current.map((item) =>
          item.id === collaborationId
            ? { ...item, status }
            : item
        )
      );

      setMessage(
        status === "Accepted"
          ? "Collaboration request accepted."
          : "Collaboration request rejected."
      );

      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch {
      setMessage(
        "Unable to update collaboration status."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Faculty Collaboration
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Industry Collaborations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review industry collaboration requests and
            build meaningful academia–industry partnerships.
          </p>
        </header>

        {/* METRICS */}
        <div className="grid gap-3 sm:grid-cols-3">

          <Metric
            label="Collaboration Requests"
            value={collaborations.length}
          />

          <Metric
            label="Pending Requests"
            value={pendingCount}
            accent
          />

          <Metric
            label="Active Collaborations"
            value={activeCount}
          />

        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {/* FILTER */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Filter
              </p>

              <h2 className="mt-1 text-base font-semibold">
                Collaboration Type
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilter(type)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    filter === type
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/[0.07] bg-slate-950 text-slate-500 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>

        </section>

        {/* REQUESTS */}
        <section className="mt-7">

          <div className="mb-4 flex items-end justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Incoming Requests
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Industry–Faculty Requests
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {filteredCollaborations.length} shown
            </span>

          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-8">
              <p className="text-sm text-slate-500">
                Loading collaboration requests...
              </p>
            </div>
          ) : filteredCollaborations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
              <p className="text-sm text-slate-500">
                No industry collaboration requests found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredCollaborations.map(
                (collaboration) => (
                  <div
                    key={collaboration.id}
                    className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 transition hover:border-white/[0.12]"
                  >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                      {/* DETAILS */}
                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold">
                            {collaboration.industry_name}
                          </h3>

                          <StatusBadge
                            status={
                              collaboration.status
                            }
                          />

                        </div>

                        <p className="mt-2 text-sm text-emerald-400">
                          {collaboration.collaboration_type}
                        </p>

                        <div className="mt-4">

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Required Competencies
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {collaboration.competencies
                              ? collaboration.competencies
                                  .split(",")
                                  .map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-lg bg-slate-800/70 px-3 py-2 text-xs text-slate-400"
                                    >
                                      {skill.trim()}
                                    </span>
                                  ))
                              : (
                                <span className="text-xs text-slate-600">
                                  No competencies specified
                                </span>
                              )}
                          </div>

                        </div>

                        {collaboration.message && (
                          <div className="mt-5 rounded-xl border border-white/[0.06] bg-slate-950/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Industry Message
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {collaboration.message}
                            </p>
                          </div>
                        )}

                      </div>

                      {/* ACTIONS */}
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">

                        {collaboration.status ===
                          "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  collaboration.id,
                                  "Accepted"
                                )
                              }
                              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                            >
                              Accept Collaboration
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  collaboration.id,
                                  "Rejected"
                                )
                              }
                              className="rounded-xl border border-red-400/20 bg-red-400/[0.03] px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-400/10"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {collaboration.status ===
                          "Accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                collaboration.id,
                                "Active"
                              )
                            }
                            className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400/10"
                          >
                            Activate Collaboration
                          </button>
                        )}

                        {collaboration.status ===
                          "Active" && (
                          <span className="rounded-xl border border-blue-400/20 bg-blue-400/[0.03] px-5 py-3 text-center text-sm font-semibold text-blue-400">
                            Collaboration Active
                          </span>
                        )}

                        {collaboration.status ===
                          "Rejected" && (
                          <span className="rounded-xl border border-red-400/10 bg-red-400/[0.03] px-5 py-3 text-center text-sm font-semibold text-red-400">
                            Request Rejected
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* COLLABORATION INTELLIGENCE */}
        <section className="mt-7 rounded-2xl border border-emerald-400/10 bg-gradient-to-b from-emerald-400/[0.05] to-slate-900/70 p-6">

          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-sm text-emerald-400">
              ✦
            </span>

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Collaboration Intelligence
            </p>
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            From Industry Need to Academic Expertise
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Industry requirements can be connected with faculty
            expertise to support research, mentorship, training,
            consultancy and live projects.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-4">

            <IntelligenceStep
              number="01"
              title="Industry Need"
              description="Identify the collaboration requirement."
            />

            <IntelligenceStep
              number="02"
              title="Faculty Expertise"
              description="Connect the requirement with academic expertise."
            />

            <IntelligenceStep
              number="03"
              title="Collaboration"
              description="Establish research, training or mentorship."
            />

            <IntelligenceStep
              number="04"
              title="Outcome"
              description="Create measurable academic–industry outcomes."
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Pending:
      "bg-amber-400/10 text-amber-300",
    Accepted:
      "bg-emerald-400/10 text-emerald-400",
    Active:
      "bg-blue-400/10 text-blue-400",
    Rejected:
      "bg-red-400/10 text-red-400",
    Completed:
      "bg-slate-400/10 text-slate-400",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
        styles[status] ||
        "bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

function IntelligenceStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-4">
      <span className="text-xs font-bold text-emerald-400">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-semibold text-slate-200">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {description}
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
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-emerald-400/10 bg-emerald-400/[0.03]"
          : "border-white/[0.07] bg-slate-900/70"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          accent
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}