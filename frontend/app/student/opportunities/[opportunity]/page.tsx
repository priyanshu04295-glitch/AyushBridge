"use client";

import { use, useEffect, useState } from "react";
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
  description?: string;
  skills: string[];
  match_score: number;
  competency_match?: number;
  evidence_strength?: number;
  eligibility?: number;
  matched_skills: string[];
  skill_gaps: string[];
  skill_gap: string | null;
  skill_analysis: SkillAnalysis[];
  verified_evidence: string[];
  recommendation?: string;
  explanation: {
    method: string;
    verified_evidence_count: number;
    matched_skill_count: number;
    skill_gap_count: number;
  };
};

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ opportunity: string }>;
}) {
  const { opportunity } = use(params);

  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/opportunities/${opportunity}`
        );

        if (!response.ok) {
          throw new Error("Failed to load opportunity");
        }

        const result = await response.json();

        setData(result);
      } catch {
        setError("Unable to load this opportunity.");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [opportunity]);

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
            <div className="h-4 w-36 rounded bg-slate-800" />
            <div className="mt-5 h-10 w-2/3 rounded bg-slate-800" />
            <div className="mt-3 h-4 w-1/3 rounded bg-slate-800" />
            <div className="mt-8 h-64 rounded-3xl bg-slate-900" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <Link
            href="/student/opportunities"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <p className="text-sm text-red-400">
              {error || "Opportunity not found."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/student/opportunities"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <Link
            href="/student/dashboard"
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white md:block"
          >
            Dashboard
          </Link>
        </div>

        {/* Opportunity Hero */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 p-6 md:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

              <div className="max-w-3xl">

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    {data.type}
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    {data.mode}
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    {data.duration}
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Opportunity Intelligence
                </p>

                <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                  {data.title}
                </h1>

                <p className="mt-3 text-base text-slate-400">
                  {data.organization}
                </p>

                {data.description && (
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
                    {data.description}
                  </p>
                )}

              </div>

              {/* Main Match Score */}
              <div className="shrink-0 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center lg:min-w-[190px]">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Your Match
                </p>

                <p className="mt-2 text-5xl font-bold text-emerald-400">
                  {data.match_score}%
                </p>

                <span
                  className={`mt-3 inline-block rounded-full border px-3 py-1.5 text-xs font-semibold ${getMatchClass(
                    data.match_score
                  )}`}
                >
                  {getMatchLabel(data.match_score)}
                </span>

              </div>

            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid border-b border-white/10 sm:grid-cols-3">

            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
              <p className="text-xs text-slate-500">
                Competency Match
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {data.competency_match ?? data.match_score}%
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Capability alignment
              </p>
            </div>

            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
              <p className="text-xs text-slate-500">
                Evidence Strength
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {data.evidence_strength ?? 0}%
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Verified achievements
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs text-slate-500">
                Eligibility
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {data.eligibility ?? 100}%
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Opportunity fit
              </p>
            </div>

          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

              {/* Left */}
              <div>

                {/* Explainable Matching */}
                <div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Explainable Matching
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      Why this opportunity matches you
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {data.explanation.method}
                    </p>
                  </div>

                  {/* Skill Analysis */}
                  <div className="mt-7 space-y-6">

                    {data.skill_analysis.map((item) => (

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

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
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

                    ))}

                  </div>
                </div>

                {/* Competencies */}
                <div className="mt-10 border-t border-white/10 pt-7">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Required Competencies
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {data.skills.map((skill) => {

                      const matched =
                        data.matched_skills.includes(skill);

                      return (
                        <span
                          key={skill}
                          className={`rounded-xl border px-3 py-2 text-xs ${
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

                {/* Skill Gaps */}
                {data.skill_gaps.length > 0 && (
                  <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

                    <p className="text-sm font-semibold text-amber-400">
                      Development Areas
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      These competencies may improve your match if developed.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {data.skill_gaps.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-400"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>
                )}

              </div>

              {/* Right Sidebar */}
              <aside className="space-y-4">

                {/* Recommendation */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      ✦
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        AI Recommendation
                      </p>

                      <p className="text-xs text-slate-500">
                        Based on your profile
                      </p>
                    </div>

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-300">
                    {data.recommendation ||
                      "This opportunity aligns with your current competency profile and can contribute to your career development."}
                  </p>

                </div>

                {/* Verified Evidence */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-sm font-semibold">
                    Verified Evidence
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Evidence supporting your match
                  </p>

                  {data.verified_evidence.length > 0 ? (
                    <div className="mt-4 space-y-3">

                      {data.verified_evidence.map((evidence) => (
                        <div
                          key={evidence}
                          className="flex gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3"
                        >
                          <span className="text-emerald-400">
                            ✓
                          </span>

                          <span className="text-xs leading-5 text-slate-300">
                            {evidence}
                          </span>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500">
                      No verified evidence is currently contributing to this
                      opportunity.
                    </p>
                  )}

                </div>

                {/* Match Summary */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-sm font-semibold">
                    Match Summary
                  </p>

                  <div className="mt-5 space-y-4">

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Matched competencies
                      </span>

                      <span className="font-semibold text-emerald-400">
                        {data.explanation.matched_skill_count}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Skill gaps
                      </span>

                      <span className="font-semibold text-amber-400">
                        {data.explanation.skill_gap_count}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Verified evidence
                      </span>

                      <span className="font-semibold text-emerald-400">
                        {data.explanation.verified_evidence_count}
                      </span>
                    </div>

                  </div>

                </div>

              </aside>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-7">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Next Step
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Ready to apply?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    Your competency profile, match score and verified evidence
                    will be considered during the application process.
                  </p>
                </div>

                <Link
                  href={`/student/opportunities/${data.id}/apply`}
                  className="rounded-xl bg-emerald-500 px-7 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Apply Now →
                </Link>

              </div>

            </div>

          </div>
        </div>

        {/* Mobile Dashboard */}
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