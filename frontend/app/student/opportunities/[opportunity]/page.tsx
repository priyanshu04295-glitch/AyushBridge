"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type SkillAnalysis = {
  skill: string;
  student_score: number;
  evidence_score: number;
  competency_component: number;
  evidence_component: number;
  readiness_component: number;
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

  match_score: number;
  competency_match: number;
  evidence_strength: number;
  eligibility: number;

  skills: string[];
  matched_skills: string[];
  skill_gaps: string[];
  priority_gap: string | null;

  skill_analysis: SkillAnalysis[];
  verified_evidence: string[];

  recommendation: string;

  explanation: {
    method: string;
    competency_match: number;
    evidence_strength: number;
    eligibility: number;
  };
};

export default function OpportunityPage({
  params,
}: {
  params: Promise<{ opportunity: string }>;
}) {
  const { opportunity } = use(params);

  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/opportunities/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load opportunity");
        }

        return response.json();
      })
      .then((opportunities: Opportunity[]) => {
        const selected = opportunities.find(
          (item) => item.id === Number(opportunity)
        );

        if (!selected) {
          throw new Error("Opportunity not found");
        }

        setData(selected);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load this opportunity.");
        setLoading(false);
      });
  }, [opportunity]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading opportunity...
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/student/opportunities"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="text-red-400">
              {error || "Opportunity not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const matchLabel =
    data.match_score >= 85
      ? "Excellent fit"
      : data.match_score >= 70
      ? "Good fit"
      : data.match_score >= 50
      ? "Developing fit"
      : "Needs development";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/student/opportunities"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Opportunities
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}

          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {data.type.toUpperCase()}
              </span>

              <h1 className="mt-4 text-4xl font-bold">
                {data.title}
              </h1>

              <p className="mt-3 text-lg text-slate-300">
                {data.organization}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                <span>📍 {data.mode}</span>
                <span>⏱ {data.duration}</span>
                <span>📅 Apply by 30 September 2026</span>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-6 text-center">
              <p className="text-sm text-slate-400">
                Your Match
              </p>

              <p className="mt-1 text-5xl font-bold text-emerald-400">
                {data.match_score}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {matchLabel}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Explainable Match Intelligence */}
          {/* ------------------------------------------------ */}

          <div className="mt-8 rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Why this match?
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  AyushBridge explains your fit using competency,
                  evidence and eligibility signals.
                </p>
              </div>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                Explainable Match
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Competency Match
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {data.competency_match}%
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.min(
                        data.competency_match,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Alignment between your assessed skills and
                  required competencies.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Evidence Strength
                </p>

                <p className="mt-2 text-3xl font-bold text-sky-400">
                  {data.evidence_strength}%
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{
                      width: `${Math.min(
                        data.evidence_strength,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Strength of supporting portfolio evidence.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Eligibility
                </p>

                <p className="mt-2 text-3xl font-bold text-violet-400">
                  {data.eligibility}%
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{
                      width: `${Math.min(
                        data.eligibility,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Current alignment with opportunity requirements.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Matching methodology
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {data.explanation.method}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Main content */}
          {/* ------------------------------------------------ */}

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* About */}

              <h2 className="text-xl font-bold">
                About the opportunity
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Work with a research team on clinical research
                activities, literature review, research documentation
                and analysis of healthcare data within the AYUSH
                ecosystem.
              </p>

              {/* Required competencies */}

              <h2 className="mt-8 text-xl font-bold">
                Required competencies
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {data.skills.map((skill) => {
                  const matched =
                    data.matched_skills.includes(skill);

                  return (
                    <span
                      key={skill}
                      className={`rounded-xl px-4 py-2 text-sm ${
                        matched
                          ? "border border-emerald-800/50 bg-emerald-950/20 text-emerald-300"
                          : "border border-amber-800/50 bg-amber-950/20 text-amber-300"
                      }`}
                    >
                      {matched ? "✓" : "△"} {skill}
                    </span>
                  );
                })}
              </div>

              {/* Skill analysis */}

              <h2 className="mt-8 text-xl font-bold">
                Competency breakdown
              </h2>

              <div className="mt-4 space-y-3">
                {data.skill_analysis.map((item) => (
                  <div
                    key={item.skill}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <p className="font-semibold text-slate-200">
                          {item.skill}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Competency {item.student_score}% · Evidence{" "}
                          {item.evidence_score}%
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p
                          className={`text-xl font-bold ${
                            item.strength === "Strong"
                              ? "text-emerald-400"
                              : item.strength === "Moderate"
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {item.final_score}%
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.strength}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.min(
                            item.final_score,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        Competency contribution:{" "}
                        {item.competency_component}%
                      </span>

                      <span>
                        Evidence contribution:{" "}
                        {item.evidence_component}%
                      </span>

                      <span>
                        Readiness contribution:{" "}
                        {item.readiness_component}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Why matched */}

              <h2 className="mt-8 text-xl font-bold">
                Why AyushBridge matched you
              </h2>

              <div className="mt-4 space-y-3">
                {data.matched_skills.length > 0 ? (
                  data.matched_skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"
                    >
                      <span className="mr-2 text-emerald-400">
                        ✓
                      </span>

                      Your competency profile demonstrates alignment
                      with <strong>{skill}</strong>.
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                    No strong competency matches identified yet.
                  </div>
                )}
              </div>

              {/* Verified evidence */}

              <h2 className="mt-8 text-xl font-bold">
                Verified evidence
              </h2>

              {data.verified_evidence.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {data.verified_evidence.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-sky-800/50 bg-sky-950/20 px-4 py-2 text-sm text-sky-300"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-500">
                  No industry-verified evidence is currently attached
                  to the matched competencies.
                </div>
              )}

              {/* AI recommendation */}

              <div className="mt-8 rounded-2xl border border-violet-900/40 bg-violet-950/10 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">
                  AyushBridge Recommendation
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  {data.recommendation}
                </p>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* Sidebar */}
            {/* ------------------------------------------------ */}

            <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h2 className="text-lg font-bold">
                Your skill gap
              </h2>

              {data.skill_gaps.length > 0 ? (
                <>
                  <div className="mt-5 space-y-3">
                    {data.skill_gaps.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-xl bg-amber-500/10 p-4"
                      >
                        <p className="font-semibold text-amber-400">
                          {skill}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Your current proficiency is below the
                          matching threshold.
                        </p>

                        {data.priority_gap === skill && (
                          <p className="mt-3 text-xs font-semibold text-amber-300">
                            Priority development area
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Improve these competencies to increase your
                    readiness for this opportunity.
                  </p>
                </>
              ) : (
                <div className="mt-5 rounded-xl bg-emerald-500/10 p-4">
                  <p className="font-semibold text-emerald-400">
                    No major skill gaps
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Your current competency profile covers the
                    required skills.
                  </p>
                </div>
              )}

              <Link
                href="/student/results"
                className="mt-5 block text-center text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                View recommended learning →
              </Link>

              <Link
                href={`/student/opportunities/${data.id}/apply`}
                className="mt-6 block w-full rounded-xl bg-emerald-500 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Apply Now
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}