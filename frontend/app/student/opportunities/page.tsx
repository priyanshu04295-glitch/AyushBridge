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
  const [opportunities, setOpportunities] = useState<
    Opportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/opportunities/"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load opportunities."
          );
        }

        const data = await response.json();

        setOpportunities(data);
      } catch {
        setError(
          "Unable to connect to AyushBridge API."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  function getMatchLabel(score: number) {
    if (score >= 80) {
      return "Excellent Match";
    }

    if (score >= 60) {
      return "Good Match";
    }

    return "Needs Development";
  }

  function getMatchClass(score: number) {
    if (score >= 80) {
      return "bg-emerald-500/10 text-emerald-400";
    }

    if (score >= 60) {
      return "bg-amber-500/10 text-amber-400";
    }

    return "bg-red-500/10 text-red-400";
  }

  function getStrengthClass(strength: string) {
    if (strength === "Strong") {
      return "text-emerald-400";
    }

    if (strength === "Moderate") {
      return "text-amber-400";
    }

    return "text-red-400";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-sm text-slate-400">
            Loading matched opportunities...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="p-6 lg:p-10">

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm font-medium text-emerald-400">
            AI Opportunity Matching
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Opportunities
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Discover internships, projects and roles matched
            to your competency profile and verified evidence.
          </p>

        </div>

        {/* Matching Intelligence Banner */}
        <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Explainable Matching
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Your matches consider skills and evidence
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                AyushBridge combines competency strength with
                evidence confidence so verified achievements
                can strengthen your opportunity match.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">

              <div className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-4">
                <p className="text-xl font-bold text-emerald-400">
                  80%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Competency
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-4">
                <p className="text-xl font-bold text-emerald-400">
                  20%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Evidence
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Opportunities */}
        <div className="space-y-6">

          {opportunities.map((opportunity) => (

            <div
              key={opportunity.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
            >

              {/* Opportunity Header */}
              <div className="border-b border-slate-800 p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {opportunity.type}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {opportunity.mode}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {opportunity.duration}
                      </span>

                    </div>

                    <h2 className="mt-4 text-xl font-semibold">
                      {opportunity.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {opportunity.organization}
                    </p>

                  </div>

                  {/* Match Score */}
                  <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">

                    <p className="text-xs text-slate-500">
                      Match Score
                    </p>

                    <p className="mt-1 text-4xl font-bold text-emerald-400">
                      {opportunity.match_score}%
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getMatchClass(
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

              <div className="p-6">

                {/* Explanation */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Why this is a{" "}
                        {opportunity.match_score}% match
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {opportunity.explanation.method}
                      </p>
                    </div>

                    {opportunity.verified_evidence.length > 0 && (
                      <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        ✓{" "}
                        {
                          opportunity.explanation
                            .verified_evidence_count
                        }{" "}
                        verified evidence
                      </span>
                    )}

                  </div>

                  {/* Skill Analysis */}
                  <div className="mt-5 space-y-4">

                    {opportunity.skill_analysis.map(
                      (item) => (

                        <div key={item.skill}>

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                              <span
                                className={`text-sm font-medium ${getStrengthClass(
                                  item.strength
                                )}`}
                              >
                                {item.strength ===
                                "Strong"
                                  ? "✓"
                                  : item.strength ===
                                    "Moderate"
                                  ? "•"
                                  : "⚠"}
                              </span>

                              <span className="text-sm">
                                {item.skill}
                              </span>

                              {item.evidence_score >=
                                90 && (
                                <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                                  INDUSTRY VERIFIED
                                </span>
                              )}

                            </div>

                            <div className="flex items-center gap-3 text-xs">

                              <span className="text-slate-500">
                                Skill{" "}
                                {item.student_score}%
                              </span>

                              <span className="text-slate-700">
                                +
                              </span>

                              <span
                                className={
                                  item.evidence_score >
                                  0
                                    ? "text-emerald-400"
                                    : "text-slate-600"
                                }
                              >
                                Evidence{" "}
                                {item.evidence_score}%
                              </span>

                              <span className="font-semibold text-white">
                                → {item.final_score}%
                              </span>

                            </div>

                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                            <div
                              className={`h-full rounded-full ${
                                item.strength ===
                                "Strong"
                                  ? "bg-emerald-500"
                                  : item.strength ===
                                    "Moderate"
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                              style={{
                                width: `${item.final_score}%`,
                              }}
                            />

                          </div>

                          {item.evidence_score >
                            0 && (
                            <p className="mt-1 text-[11px] text-emerald-400">
                              Evidence contributes{" "}
                              {
                                item.evidence_component
                              }{" "}
                              points to this competency.
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* Summary */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

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

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Skill Gaps
                    </p>

                    <p className="mt-2 text-2xl font-bold text-amber-400">
                      {
                        opportunity.explanation
                          .skill_gap_count
                      }
                    </p>

                    {opportunity.skill_gaps.length >
                      0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {opportunity.skill_gaps.join(
                          ", "
                        )}
                      </p>
                    )}

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Verified Evidence
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      {
                        opportunity.explanation
                          .verified_evidence_count
                      }
                    </p>

                    {opportunity.verified_evidence
                      .length > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {opportunity.verified_evidence.join(
                          ", "
                        )}
                      </p>
                    )}

                  </div>

                </div>

                {/* Required Skills */}
                <div className="mt-6">

                  <p className="text-sm font-medium">
                    Required Competencies
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {opportunity.skills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className={`rounded-lg border px-3 py-1.5 text-xs ${
                            opportunity.matched_skills.includes(
                              skill
                            )
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                              : "border-red-500/20 bg-red-500/5 text-red-400"
                          }`}
                        >
                          {opportunity.matched_skills.includes(
                            skill
                          )
                            ? "✓ "
                            : "⚠ "}
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    href={`/student/opportunities/${opportunity.id}`}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    View Opportunity
                  </Link>

                  <Link
                    href={`/student/opportunities/${opportunity.id}/apply`}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-400"
                  >
                    Apply Now
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>
    </main>
  );
}