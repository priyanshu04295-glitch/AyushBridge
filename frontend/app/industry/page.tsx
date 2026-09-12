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

export default function IndustryDashboard() {
  const [data, setData] = useState<IndustryData | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [collaborationType, setCollaborationType] = useState(
    "Research Collaboration"
  );
  const [competencies, setCompetencies] = useState(
    "Clinical Research, Biostatistics"
  );
  const [message, setMessage] = useState(
    "We would like to collaborate on clinical research and competency development."
  );

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardResponse, collaborationResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/industry/dashboard"),
            fetch(
              "http://127.0.0.1:8000/industry/faculty-collaborations"
            ),
          ]);

        if (!dashboardResponse.ok) {
          throw new Error("Failed to load industry dashboard");
        }

        if (!collaborationResponse.ok) {
          throw new Error("Failed to load faculty collaborations");
        }

        const dashboardResult = await dashboardResponse.json();
        const collaborationResult =
          await collaborationResponse.json();

        setData(dashboardResult);
        setCollaborations(collaborationResult);
      } catch {
        setError("Unable to connect to AyushBridge API");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function sendCollaborationRequest() {
    setSending(true);
    setSuccess("");
    setError("");

    try {
      const params = new URLSearchParams({
        collaboration_type: collaborationType,
        competencies,
        message,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/industry/faculty-collaboration?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to send collaboration request."
        );
      }

      setCollaborations((current) => [
        result.collaboration,
        ...current,
      ]);

      setSuccess("Collaboration request sent successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send collaboration request."
      );
    } finally {
      setSending(false);
    }
  }

  async function updateCollaboration(
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
        throw new Error("Failed to update collaboration.");
      }

      setCollaborations((current) =>
        current.map((item) =>
          item.id === collaborationId
            ? { ...item, status }
            : item
        )
      );
    } catch {
      setError("Unable to update collaboration status.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-3xl border border-white/[0.07] bg-slate-900/70 p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading industry intelligence...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">
              {error || "No dashboard data found."}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is running on port 8000.
            </p>
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
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Industry Intelligence
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {data.name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Discover verified talent, define competency requirements,
            and build stronger academia–industry opportunities.
          </p>
        </header>

        {/* CORE METRICS */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Opportunities"
            value={data.active_opportunities}
            description="Currently active"
            accent
          />

          <StatCard
            label="Applications"
            value={data.applications}
            description="Candidate applications"
          />

          <StatCard
            label="Shortlisted"
            value={data.shortlisted}
            description="Candidates selected"
          />

          <StatCard
            label="Verified Candidates"
            value={data.verified_candidates}
            description="Evidence-backed profiles"
            accent
          />
        </div>

        {/* INTELLIGENCE */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* SKILL DEMAND */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 lg:col-span-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Demand Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Industry Skill Demand
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Competencies currently driving talent demand.
              </p>
            </div>

            <div className="mt-7 space-y-6">
              {data.top_demand.map((item, index) => (
                <div key={item.skill}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-700">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-medium text-slate-300">
                        {item.skill}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-emerald-400">
                      {item.demand}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${item.demand}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI INSIGHT */}
          <section className="rounded-2xl border border-emerald-400/10 bg-gradient-to-b from-emerald-400/[0.05] to-slate-900/70 p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-sm text-emerald-400">
                ✦
              </span>

              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                AI Industry Insight
              </p>
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              Competency Intelligence
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {data.ai_insight}
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-slate-950/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Recommended Action
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create competency-based opportunities and use
                explainable matching to identify candidates with
                the strongest verified evidence.
              </p>
            </div>
          </section>
        </div>

        {/* FACULTY COLLABORATION */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Academia–Industry Collaboration
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Connect with Faculty
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Collaborate with faculty on research, mentorship,
                training and competency development.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-2">
              <span className="text-xs text-slate-500">
                Faculty Partner
              </span>

              <p className="mt-1 text-sm font-semibold text-white">
                Dr. Meera Sharma
              </p>
            </div>
          </div>

          {/* REQUEST FORM */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">

            <div>
              <label className="text-xs font-medium text-slate-400">
                Collaboration Type
              </label>

              <select
                value={collaborationType}
                onChange={(e) =>
                  setCollaborationType(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-emerald-400/40"
              >
                <option>Research Collaboration</option>
                <option>Student Mentorship</option>
                <option>Guest Lecture</option>
                <option>Faculty Training</option>
                <option>Consultancy</option>
                <option>Live Project</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">
                Required Competencies
              </label>

              <input
                value={competencies}
                onChange={(e) =>
                  setCompetencies(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40"
                placeholder="Clinical Research, Biostatistics"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">
                Collaboration Message
              </label>

              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40"
                placeholder="Describe the collaboration requirement"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={sendCollaborationRequest}
              disabled={sending}
              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending
                ? "Sending Request..."
                : "Send Collaboration Request"}
            </button>

            {success && (
              <p className="text-sm text-emerald-400">
                {success}
              </p>
            )}
          </div>

          {/* EXISTING REQUESTS */}
          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Collaboration Requests
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Industry–Faculty Activity
                </h3>
              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {collaborations.length} request
                {collaborations.length !== 1 ? "s" : ""}
              </span>
            </div>

            {collaborations.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] p-6 text-center">
                <p className="text-sm text-slate-500">
                  No faculty collaboration requests yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {collaborations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-semibold text-slate-200">
                            {item.faculty_name}
                          </h4>

                          <StatusBadge status={item.status} />
                        </div>

                        <p className="mt-1 text-sm text-emerald-400">
                          {item.collaboration_type}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          Competencies:{" "}
                          <span className="text-slate-400">
                            {item.competencies || "Not specified"}
                          </span>
                        </p>

                        {item.message && (
                          <p className="mt-2 text-xs leading-5 text-slate-600">
                            {item.message}
                          </p>
                        )}
                      </div>

                      {item.status === "Accepted" && (
                        <button
                          onClick={() =>
                            updateCollaboration(
                              item.id,
                              "Active"
                            )
                          }
                          className="shrink-0 rounded-xl border border-emerald-400/20 px-4 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-400/10"
                        >
                          Activate Collaboration
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Pending:
      "bg-amber-400/10 text-amber-400 border-amber-400/10",
    Accepted:
      "bg-emerald-400/10 text-emerald-400 border-emerald-400/10",
    Active:
      "bg-blue-400/10 text-blue-400 border-blue-400/10",
    Rejected:
      "bg-red-400/10 text-red-400 border-red-400/10",
    Completed:
      "bg-slate-400/10 text-slate-400 border-slate-400/10",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] ||
        "border-white/[0.08] bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
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

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}