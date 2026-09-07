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
  const [verifyingId, setVerifyingId] = useState<number | null>(
    null
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setError("");

      const [
        candidateResponse,
        evidenceResponse,
      ] = await Promise.all([
        fetch(
          `http://127.0.0.1:8000/industry/candidates/${candidate}`
        ),
        fetch(
          `http://127.0.0.1:8000/industry/verification/${candidate}`
        ),
      ]);

      if (!candidateResponse.ok) {
        throw new Error("Failed to load candidate.");
      }

      if (!evidenceResponse.ok) {
        throw new Error("Failed to load candidate evidence.");
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
    let isCurrent = true;

    async function loadInitialData() {
      try {
        const [candidateResponse, evidenceResponse] = await Promise.all([
          fetch(
            `http://127.0.0.1:8000/industry/candidates/${candidate}`
          ),
          fetch(
            `http://127.0.0.1:8000/industry/verification/${candidate}`
          ),
        ]);

        if (!candidateResponse.ok || !evidenceResponse.ok) {
          throw new Error("Failed to load candidate information.");
        }

        const candidateDataResponse = await candidateResponse.json();
        const evidenceData = await evidenceResponse.json();

        if (isCurrent) {
          setCandidateData(candidateDataResponse);
          setEvidence(evidenceData);
          setError("");
        }
      } catch {
        if (isCurrent) {
          setError("Unable to load candidate information.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isCurrent = false;
    };
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
        "Evidence verified successfully. The candidate's verified portfolio has been updated."
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
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-400">
            Loading candidate profile...
          </p>
        </div>
      </main>
    );
  }

  if (!candidateData) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">

        {/* Back */}
        <Link
          href="/industry/candidates"
          className="inline-flex items-center text-sm text-slate-400 hover:text-white"
        >
          ← Back to Candidates
        </Link>

        {/* Header */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-bold text-emerald-400">
                {candidateData.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <p className="text-sm text-emerald-400">
                  Candidate Profile
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  {candidateData.name}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  {candidateData.program} ·{" "}
                  {candidateData.institution}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Target Role:{" "}
                  <span className="font-medium text-white">
                    {candidateData.target_role}
                  </span>
                </p>
              </div>

            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 text-center">
              <p className="text-xs text-slate-400">
                Readiness Score
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-400">
                {candidateData.readiness_score}%
              </p>
            </div>

          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Verified Evidence
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {verifiedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Pending Evidence
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Evidence Strength
            </p>

            <p className="mt-2 text-2xl font-bold">
              {evidence.length > 0
                ? Math.round(
                    (verifiedCount /
                      evidence.length) *
                      100
                  )
                : 0}
              %
            </p>
          </div>

        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">

          {/* Skills */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

            <h2 className="text-lg font-semibold">
              Competency Profile
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Current competency strength for the candidate.
            </p>

            <div className="mt-6 space-y-5">

              {candidateData.skills?.map(
                (skill) => (
                  <div key={skill.name}>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {skill.name}
                      </span>

                      <span className="text-sm font-semibold">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${skill.score}%`,
                        }}
                      />
                    </div>

                  </div>
                )
              )}

            </div>

          </section>

          {/* Evidence */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>
                <h2 className="text-lg font-semibold">
                  Evidence Review
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review evidence supporting the candidate&apos;s competencies.
                </p>
              </div>

              <span className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                Industry Verification
              </span>

            </div>

            <div className="mt-6 space-y-4">

              {evidence.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
                  <p className="text-sm text-slate-400">
                    No portfolio evidence available.
                  </p>
                </div>
              ) : (
                evidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >

                    <div className="flex flex-col gap-4">

                      <div className="flex flex-col justify-between gap-3 md:flex-row">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {item.title}
                            </h3>

                            <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                              {item.evidence_type}
                            </span>

                          </div>

                          <p className="mt-2 text-sm font-medium text-emerald-400">
                            {item.skill}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {item.description}
                          </p>
                        </div>

                        <div className="shrink-0">

                          <span
                            className={
                              item.verification_status ===
                              "Verified"
                                ? "rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400"
                                : "rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400"
                            }
                          >
                            {item.verification_status}
                          </span>

                        </div>

                      </div>

                      <div className="flex flex-col justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-row sm:items-center">

                        <div>
                          <p className="text-xs text-slate-500">
                            Evidence Level
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {item.evidence_level}
                          </p>

                          {item.verified_by && (
                            <p className="mt-1 text-xs text-slate-500">
                              Verified by:{" "}
                              {item.verified_by}
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
                            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {verifyingId === item.id
                              ? "Verifying..."
                              : "Verify Evidence"}
                          </button>
                        )}

                        {item.verification_status ===
                          "Verified" && (
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5 text-sm font-medium text-emerald-400">
                            ✓ Industry Verified
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </section>

        </div>

        {/* Matching Insight */}
        <section className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <p className="text-sm font-semibold text-emerald-400">
            Industry Matching Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Verified evidence strengthens candidate confidence
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Industry verification converts self-declared
            portfolio evidence into trusted competency evidence.
            This evidence can be used alongside assessments and
            skill scores when evaluating candidates for
            internships, projects and employment opportunities.
          </p>

        </section>

      </div>
    </main>
  );
}
