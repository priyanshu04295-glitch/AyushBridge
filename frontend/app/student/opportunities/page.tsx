"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SkillAnalysis = {
  skill: string;
  student_score: number;
  evidence_score: number;
  skill_component: number;
  evidence_component: number;
  final_score: number;
  strength: string;
};

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  type: string;
  mode: string;
  duration: string;
  skills: string[];
  match_score: number;
  matched_skills: string[];
  skill_gaps: string[];
  skill_gap: string | null;
  skill_analysis: SkillAnalysis[];
  verified_evidence: string[];
  explanation: {
    method: string;
    verified_evidence_count: number;
    matched_skill_count: number;
    skill_gap_count: number;
  };
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/opportunities/"
        );

        if (!response.ok) {
          throw new Error("Failed to load opportunities.");
        }

        const data = await response.json();

        setOpportunities(data);
      } catch {
        setError("Unable to connect to AyushBridge API.");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  function getMatchLabel(score: number) {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Development";
  }

  function getMatchClass(score: number) {
    if (score >= 80) {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (score >= 60) {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  function getStrengthClass(strength: string) {
    if (strength === "Strong") return "text-emerald-400";
    if (strength === "Moderate") return "text-amber-400";
    return "text-red-400";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="animate-pulse">
            <div className="h-3 w-40 rounded bg-slate-800" />
            <div className="mt-4 h-8 w-64 rounded bg-slate-800" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-800" />

            <div className="mt-10 h-32 rounded-2xl bg-slate-900" />

            <div className="mt-6 h-96 rounded-3xl bg-slate-900" />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05]"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Opportunity Intelligence
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Opportunities
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Discover internships, projects and roles matched to your
              competency profile, skill evidence and career goals.
            </p>
          </div>

          <Link
            href="/student/dashboard"
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white md:block"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Intelligence Hero */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.02] to-transparent">
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-emerald-400">
                      Explainable Matching
                    </p>

                    <p className="text-xs text-slate-500">
                      Competency-aware opportunity intelligence
                    </p>
                  </div>
                </div>

                <h2 className="mt-5 text-xl font-semibold md:text-2xl">
                  Find opportunities that fit your actual capabilities.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  AyushBridge evaluates competency strength, verified evidence
                  and skill gaps to explain why each opportunity matches you.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:min-w-[250px]">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    80%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Competency Match
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    20%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Evidence
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-500">
              Opportunities Found
            </p>

            <p className="mt-2 text-2xl font-bold">
              {opportunities.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Based on your current profile
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-500">
              Strongest Match
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {opportunities.length
                ? Math.max(
                    ...opportunities.map(
                      (item) => item.match_score
                    )
                  )
                : 0}
              %
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Highest compatibility score
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-slate-500">
              Matching Approach
            </p>

            <p className="mt-2 text-lg font-bold">
              Explainable
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Skills + evidence + eligibility
            </p>
          </div>
        </div>

        {/* Opportunity List */}
        <div className="mt-8">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recommended Opportunities
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Ranked according to your competency profile.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
              {opportunities.length} results
            </span>
          </div>

          <div className="space-y-5">

            {opportunities.map((opportunity) => (

              <article
                key={opportunity.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/15"
              >

                {/* Opportunity Header */}
                <div className="border-b border-white/10 p-6 md:p-7">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                          {opportunity.type}
                        </span>

                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                          {opportunity.mode}
                        </span>

                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                          {opportunity.duration}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-semibold md:text-2xl">
                        {opportunity.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {opportunity.organization}
                      </p>

                    </div>

                    {/* Match */}
                    <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center lg:min-w-[150px]">
                      <p className="text-xs text-slate-500">
                        Match Score
                      </p>

                      <p className="mt-1 text-4xl font-bold text-emerald-400">
                        {opportunity.match_score}%
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold ${getMatchClass(
                          opportunity.match_score
                        )}`}
                      >
                        {getMatchLabel(
                          opportunity.match_score
                        )}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Intelligence Content */}
                <div className="p-6 md:p-7">

                  <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

                    {/* Skill Analysis */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            Match Intelligence
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            How your competencies contribute to this match.
                          </p>
                        </div>

                        {opportunity.verified_evidence.length > 0 && (
                          <span className="hidden rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 sm:block">
                            ✓{" "}
                            {
                              opportunity.explanation
                                .verified_evidence_count
                            }{" "}
                            verified
                          </span>
                        )}
                      </div>

                      <div className="mt-5 space-y-5">

                        {opportunity.skill_analysis.map(
                          (item) => (

                            <div key={item.skill}>

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-sm font-semibold ${getStrengthClass(
                                      item.strength
                                    )}`}
                                  >
                                    {item.strength === "Strong"
                                      ? "✓"
                                      : item.strength === "Moderate"
                                        ? "•"
                                        : "⚠"}
                                  </span>

                                  <span className="text-sm font-medium">
                                    {item.skill}
                                  </span>

                                  {item.evidence_score >= 90 && (
                                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-bold tracking-wide text-emerald-400">
                                      VERIFIED
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-slate-500">
                                    Skill {item.student_score}%
                                  </span>

                                  <span className="text-slate-700">
                                    +
                                  </span>

                                  <span
                                    className={
                                      item.evidence_score > 0
                                        ? "text-emerald-400"
                                        : "text-slate-600"
                                    }
                                  >
                                    Evidence {item.evidence_score}%
                                  </span>

                                  <span className="font-semibold text-white">
                                    → {item.final_score}%
                                  </span>
                                </div>

                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className={`h-full rounded-full ${
                                    item.strength === "Strong"
                                      ? "bg-emerald-500"
                                      : item.strength === "Moderate"
                                        ? "bg-amber-400"
                                        : "bg-red-400"
                                  }`}
                                  style={{
                                    width: `${item.final_score}%`,
                                  }}
                                />
                              </div>

                            </div>
                          )
                        )}

                      </div>
                    </div>

                    {/* Match Summary */}
                    <div className="space-y-3">

                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <p className="text-xs text-slate-500">
                          Matched Competencies
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-400">
                          {
                            opportunity.explanation
                              .matched_skill_count
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          of {opportunity.skills.length} required
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <p className="text-xs text-slate-500">
                          Skill Gaps
                        </p>

                        <p className="mt-2 text-2xl font-bold text-amber-400">
                          {
                            opportunity.explanation
                              .skill_gap_count
                          }
                        </p>

                        {opportunity.skill_gaps.length > 0 && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {opportunity.skill_gaps.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <p className="text-xs text-slate-500">
                          Verified Evidence
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-400">
                          {
                            opportunity.explanation
                              .verified_evidence_count
                          }
                        </p>

                        {opportunity.verified_evidence.length > 0 && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {opportunity.verified_evidence.join(", ")}
                          </p>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Required Competencies */}
                  <div className="mt-7 border-t border-white/10 pt-6">

                    <p className="text-sm font-semibold">
                      Required Competencies
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => {
                        const matched =
                          opportunity.matched_skills.includes(skill);

                        return (
                          <span
                            key={skill}
                            className={`rounded-lg border px-3 py-1.5 text-xs ${
                              matched
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                                : "border-red-500/20 bg-red-500/5 text-red-400"
                            }`}
                          >
                            {matched ? "✓ " : "⚠ "}
                            {skill}
                          </span>
                        );
                      })}
                    </div>

                  </div>

                  {/* Explanation */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Why this match?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {opportunity.explanation.method}
                    </p>

                    {opportunity.skill_gap && (
                      <p className="mt-3 text-xs text-amber-400">
                        Priority development area:{" "}
                        <span className="font-semibold">
                          {opportunity.skill_gap}
                        </span>
                      </p>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <Link
                      href={`/student/opportunities/${opportunity.id}`}
                      className="rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      View Opportunity
                    </Link>

                    <Link
                      href={`/student/opportunities/${opportunity.id}/apply`}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:text-emerald-400"
                    >
                      Apply Now
                    </Link>

                  </div>

                </div>
              </article>
            ))}

          </div>

          {/* Empty State */}
          {opportunities.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                ◎
              </div>

              <h3 className="mt-4 font-semibold">
                No opportunities found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Complete your competency assessment to improve opportunity
                recommendations.
              </p>

              <Link
                href="/student/assessment"
                className="mt-5 inline-block rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Take Assessment
              </Link>
            </div>
          )}

        </div>

        {/* Mobile Back */}
        <Link
          href="/student/dashboard"
          className="mt-6 block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-slate-300 md:hidden"
        >
          ← Back to Dashboard
        </Link>

      </section>
    </main>
  );
}