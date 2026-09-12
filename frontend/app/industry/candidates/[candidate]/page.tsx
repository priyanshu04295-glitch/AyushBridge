"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type Candidate = {
  id: number;
  name: string;
  program: string;
  institution: string;
  target_role: string;
  readiness_score: number;
  skills: {
    name: string;
    score: number;
  }[];
};

type Evidence = {
  id: number;
  student_id: number;
  title: string;
  evidence_type: string;
  skill: string;
  description: string;
  verification_status: string;
  verified_by: string;
  evidence_level: string;
};

export default function CandidateProfilePage({
  params,
}: {
  params: Promise<{ candidate: string }>;
}) {
  const { candidate } = use(params);

  const [candidateData, setCandidateData] =
    useState<Candidate | null>(null);

  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setError("");

      const [candidateResponse, evidenceResponse] =
        await Promise.all([
          fetch(
            `http://127.0.0.1:8000/industry/candidates/${candidate}`
          ),
          fetch(
            `http://127.0.0.1:8000/industry/verification/${candidate}`
          ),
        ]);

      if (
        !candidateResponse.ok ||
        !evidenceResponse.ok
      ) {
        throw new Error(
          "Failed to load candidate information."
        );
      }

      const candidateDataResponse =
        await candidateResponse.json();

      const evidenceData =
        await evidenceResponse.json();

      setCandidateData(candidateDataResponse);
      setEvidence(evidenceData);
    } catch {
      setError(
        "Unable to load candidate information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [candidate]);

  async function verifyEvidence(evidenceId: number) {
    setVerifyingId(evidenceId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/industry/verification/${evidenceId}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verified_by:
              "Ayurveda Research Institute",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to verify evidence."
        );
      }

      setMessage(
        "Evidence verified successfully. The candidate portfolio has been updated."
      );

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify evidence."
      );
    } finally {
      setVerifyingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">
            Loading candidate profile...
          </p>
        </div>
      </main>
    );
  }

  if (!candidateData) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm text-red-400">
              {error || "Candidate not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const verifiedCount = evidence.filter(
    (item) =>
      item.verification_status === "Verified"
  ).length;

  const pendingCount = evidence.filter(
    (item) =>
      item.verification_status !== "Verified"
  ).length;

  const evidenceStrength =
    evidence.length > 0
      ? Math.round(
          (verifiedCount / evidence.length) * 100
        )
      : 0;

  const initials = candidateData.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/industry/candidates"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <span>←</span>
            Back to Candidates
          </Link>
        </div>

        {/* PROFILE HEADER */}
        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 sm:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] text-lg font-bold text-emerald-400">
                {initials}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Candidate Profile
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  {candidateData.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {candidateData.program} ·{" "}
                  {candidateData.institution}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Target Role{" "}
                  <span className="text-emerald-400">
                    {candidateData.target_role}
                  </span>
                </p>
              </div>

            </div>

            {/* READINESS */}
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] px-7 py-4 text-center">

              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Readiness
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-400">
                {candidateData.readiness_score}%
              </p>

            </div>

          </div>

        </section>

        {/* MESSAGES */}
        {message && (
          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* EVIDENCE SUMMARY */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <SummaryCard
            label="Verified Evidence"
            value={verifiedCount}
            valueClass="text-emerald-400"
          />

          <SummaryCard
            label="Pending Review"
            value={pendingCount}
            valueClass="text-amber-400"
          />

          <SummaryCard
            label="Evidence Strength"
            value={`${evidenceStrength}%`}
            valueClass="text-white"
          />

        </div>

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* COMPETENCIES */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Competencies
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Competency Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current competency strength.
              </p>
            </div>

            <div className="mt-7 space-y-5">

              {candidateData.skills?.length > 0 ? (
                candidateData.skills.map((skill) => (
                  <div key={skill.name}>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-300">
                        {skill.name}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{
                          width: `${Math.min(
                            skill.score,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No competency data available.
                </p>
              )}

            </div>

          </section>

          {/* EVIDENCE */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Verification
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Evidence
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review evidence supporting candidate competencies.
                </p>
              </div>

              <span className="text-xs text-slate-600">
                {evidence.length} items
              </span>

            </div>

            <div className="mt-6 space-y-3">

              {evidence.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No evidence available for review.
                  </p>
                </div>
              ) : (
                evidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-5"
                  >

                    {/* Evidence Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-white">
                            {item.title}
                          </h3>

                          <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-400">
                            {item.evidence_type}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-medium text-emerald-400">
                          {item.skill}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                          item.verification_status ===
                          "Verified"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {item.verification_status}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>

                    {/* Evidence Footer */}
                    <div className="mt-4 flex flex-col gap-4 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-600">
                          Evidence Level
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {item.evidence_level}
                        </p>

                        {item.verified_by && (
                          <p className="mt-1 text-xs text-slate-600">
                            Verified by {item.verified_by}
                          </p>
                        )}
                      </div>

                      {item.verification_status !==
                        "Verified" && (
                        <button
                          type="button"
                          onClick={() =>
                            verifyEvidence(item.id)
                          }
                          disabled={
                            verifyingId === item.id
                          }
                          className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {verifyingId === item.id
                            ? "Verifying..."
                            : "Verify Evidence"}
                        </button>
                      )}

                      {item.verification_status ===
                        "Verified" && (
                        <span className="text-sm font-medium text-emerald-400">
                          ✓ Verified
                        </span>
                      )}

                    </div>

                  </div>
                ))
              )}

            </div>

          </section>

        </div>

      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string | number;
  valueClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}