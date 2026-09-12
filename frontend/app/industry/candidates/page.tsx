"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Candidate = {
  id: number;
  name: string;
  program: string;
  institution: string;
  target_role: string;
  match_score: number;
  verified_skills: number;
  skill_gap: string;
  verification: string;
  status: string;
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCandidates() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/industry/candidates/"
        );

        if (!response.ok) {
          throw new Error();
        }

        setCandidates(await response.json());
      } catch {
        setError("Unable to connect to AyushBridge API");
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  const averageMatch = useMemo(() => {
    if (candidates.length === 0) return 0;

    return Math.round(
      candidates.reduce(
        (sum, candidate) => sum + candidate.match_score,
        0
      ) / candidates.length
    );
  }, [candidates]);

  const availableCandidates = candidates.filter(
    (candidate) => candidate.status === "Available"
  ).length;

  const verifiedCandidates = candidates.filter(
    (candidate) =>
      candidate.verification.toLowerCase().includes("verified")
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">
            Loading candidates...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5 text-sm text-red-300">
            {error}
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
              Talent Intelligence
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Candidates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Discover candidates based on competency alignment,
            verified skills, and readiness.
          </p>
        </header>

        {/* METRICS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Candidates"
            value={candidates.length}
          />

          <Stat
            label="Average Match"
            value={`${averageMatch}%`}
            accent
          />

          <Stat
            label="Available"
            value={availableCandidates}
          />

          <Stat
            label="Verified"
            value={verifiedCandidates}
          />
        </div>

        {/* CANDIDATES */}
        <section className="mt-8">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Talent Pool
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Matching Candidates
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {candidates.length} candidates
            </span>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-10 text-center">
              <p className="text-sm text-slate-500">
                No candidates available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="group rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 transition hover:border-white/[0.12]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                    {/* CANDIDATE */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {candidate.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            candidate.status === "Available"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {candidate.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {candidate.program} ·{" "}
                        {candidate.institution}
                      </p>

                      <p className="mt-3 text-sm text-slate-300">
                        Target role{" "}
                        <span className="text-emerald-400">
                          {candidate.target_role}
                        </span>
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Tag>
                          {candidate.verified_skills} verified skills
                        </Tag>

                        <Tag>
                          Gap: {candidate.skill_gap}
                        </Tag>

                        <Tag emerald>
                          {candidate.verification}
                        </Tag>
                      </div>

                    </div>

                    {/* MATCH */}
                    <div className="flex items-center justify-between gap-6 border-t border-white/[0.06] pt-4 lg:w-[300px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-600">
                          Match Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-emerald-400">
                          {candidate.match_score}%
                        </p>
                      </div>

                      <Link
                        href={`/industry/candidates/${candidate.id}`}
                        className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                      >
                        View Candidate
                      </Link>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
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

function Tag({
  children,
  emerald = false,
}: {
  children: React.ReactNode;
  emerald?: boolean;
}) {
  return (
    <span
      className={`rounded-lg px-3 py-2 text-xs ${
        emerald
          ? "bg-emerald-400/[0.06] text-emerald-400"
          : "bg-slate-800/70 text-slate-400"
      }`}
    >
      {children}
    </span>
  );
}