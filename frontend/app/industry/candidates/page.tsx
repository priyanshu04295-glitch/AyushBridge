"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading candidates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">
            Industry Talent Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Find Candidates
          </h1>

          <p className="mt-2 text-slate-400">
            Discover candidates using competency matching and verified
            evidence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat
            label="Candidates"
            value={candidates.length}
          />

          <Stat
            label="Average Match"
            value={`${Math.round(
              candidates.reduce(
                (sum, candidate) => sum + candidate.match_score,
                0
              ) / candidates.length
            )}%`}
          />

          <Stat
            label="Available"
            value={
              candidates.filter(
                (candidate) => candidate.status === "Available"
              ).length
            }
          />
        </div>

        <div className="mt-8 space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {candidate.name}
                    </h2>

                    <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-400">
                      {candidate.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {candidate.program} · {candidate.institution}
                  </p>

                  <p className="mt-3 text-sm text-slate-300">
                    Target role:{" "}
                    <span className="text-emerald-400">
                      {candidate.target_role}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                      {candidate.verified_skills} verified skills
                    </span>

                    <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                      Gap: {candidate.skill_gap}
                    </span>

                    <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-emerald-400">
                      {candidate.verification}
                    </span>
                  </div>
                </div>

                <div className="flex min-w-[220px] flex-col items-start justify-between gap-4 lg:items-end">
                  <div>
                    <p className="text-xs text-slate-500">
                      Explainable Match
                    </p>

                    <p className="mt-1 text-4xl font-bold text-emerald-400">
                      {candidate.match_score}%
                    </p>
                  </div>

                  <Link
                    href={`/industry/candidates/${candidate.id}`}
                    className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                  >
                    View Candidate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <p className="text-sm font-medium text-emerald-400">
            AI Matching
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Match score is more than a number
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            AyushBridge combines competency alignment, verified evidence,
            readiness and skill gaps to explain why a candidate matches an
            opportunity.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}