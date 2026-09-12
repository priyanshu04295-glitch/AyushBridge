"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Student = {
  student_id: number;
  name: string;
  program: string;
  target_role: string;
  readiness_score: number;
  skills_assessed: number;
  skill_gaps: number;
};

type Skill = {
  name: string;
  category: string;
  level: string;
  score: number;
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
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/students/1").then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load student");
        }

        return response.json();
      }),

      fetch("http://127.0.0.1:8000/skills/").then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load skills");
        }

        return response.json();
      }),

      fetch("http://127.0.0.1:8000/opportunities/").then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load opportunities");
        }

        return response.json();
      }),
    ])
      .then(([studentData, skillsData, opportunitiesData]) => {
        setStudent(studentData);
        setSkills(skillsData);
        setOpportunities(opportunitiesData);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to AyushBridge API.");
        setLoading(false);
      });
  }, []);

  const averageSkillScore =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + skill.score,
            0
          ) / skills.length
        )
      : 0;

  const skillGaps = skills.filter(
    (skill) => skill.score < 60
  );

  const readinessScore =
    skills.length > 0
      ? averageSkillScore
      : student?.readiness_score ?? 0;

  const skillsAssessed =
    skills.length > 0
      ? skills.length
      : student?.skills_assessed ?? 0;

  const gapCount =
    skills.length > 0
      ? skillGaps.length
      : student?.skill_gaps ?? 0;

  const matchedOpportunities =
    opportunities.filter(
      (opportunity) =>
        opportunity.match_score >= 60
    );

  const recommendedOpportunities =
    [...opportunities]
      .sort(
        (a, b) =>
          b.match_score - a.match_score
      )
      .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
            Loading your competency intelligence...
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">
              {error ||
                "Unable to load student profile."}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is
              running on port 8000.
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
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Student Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back,{" "}
              {student.name.split(" ")[0]}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {student.program}{" "}
              <span className="mx-1 text-slate-700">
                ·
              </span>{" "}
              Targeting{" "}
              <span className="text-slate-300">
                {student.target_role}
              </span>
            </p>
          </div>
        </header>

        {/* HERO STATUS */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-400/[0.08] via-slate-900 to-slate-900 p-7 sm:p-8">
          <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-72 w-72 rounded-full bg-emerald-400/[0.06] blur-[90px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Career Readiness
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                Your competency profile is{" "}
                {readinessScore >= 75
                  ? "strong"
                  : readinessScore >= 50
                  ? "developing"
                  : "building"}.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                AyushBridge continuously compares your
                capabilities with opportunity requirements
                to identify where you can improve and where
                you already fit.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/student/assessment"
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  {skillsAssessed > 0
                    ? "Retake Assessment"
                    : "Take Assessment"}
                </Link>

                <Link
                  href="/student/opportunities"
                  className="rounded-xl border border-slate-700 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
                >
                  Explore Opportunities
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-950/70">
                <div
                  className="absolute inset-3 rounded-full border-4 border-slate-800"
                  style={{
                    borderTopColor:
                      "rgb(52 211 153)",
                    borderRightColor:
                      readinessScore >= 50
                        ? "rgb(52 211 153)"
                        : "rgb(30 41 59)",
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-400">
                    {readinessScore}%
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
                    Readiness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Readiness Score
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {readinessScore}%
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Current competency readiness
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Skills Assessed
            </p>

            <p className="mt-3 text-3xl font-bold">
              {skillsAssessed}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Competencies evaluated
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-amber-500/70">
              Skill Gaps
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-400">
              {gapCount}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Areas needing development
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Relevant Opportunities
            </p>

            <p className="mt-3 text-3xl font-bold">
              {matchedOpportunities.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Match score ≥ 60%
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* COMPETENCY PROFILE */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Competency Profile
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Your current capabilities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Based on your latest competency data.
                </p>
              </div>

              <Link
                href="/student/results"
                className="shrink-0 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                View all →
              </Link>
            </div>

            <div className="mt-7 space-y-5">
              {skills.slice(0, 5).map(
                (skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {skill.name}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-600">
                          {skill.level}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-emerald-400">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{
                          width: `${skill.score}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}

              {skills.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-500">
                  Complete your skill assessment to
                  build your competency profile.
                </div>
              )}
            </div>
          </section>

          {/* GAP ANALYSIS */}
          <section className="rounded-2xl border border-amber-400/10 bg-gradient-to-b from-amber-400/[0.04] to-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              AI Gap Analysis
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              What should you improve?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              These competencies currently have the
              greatest development opportunity.
            </p>

            <div className="mt-6 space-y-2">
              {skillGaps.length > 0 ? (
                skillGaps
                  .slice(0, 4)
                  .map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-950/60 p-3.5"
                    >
                      <div>
                        <p className="text-sm text-slate-200">
                          {skill.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Needs development
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-amber-400">
                        {skill.score}%
                      </span>
                    </div>
                  ))
              ) : (
                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                  <p className="text-sm font-medium text-emerald-400">
                    No major gaps detected.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Continue developing your existing
                    competencies.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/student/results"
              className="mt-5 block rounded-xl border border-amber-400/20 px-4 py-3 text-center text-xs font-semibold text-amber-400 transition hover:bg-amber-400/[0.05]"
            >
              Open Gap Analysis →
            </Link>
          </section>
        </div>

        {/* OPPORTUNITIES */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Opportunity Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Recommended for you
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ranked using competency fit and skill
                requirements.
              </p>
            </div>

            <Link
              href="/student/opportunities"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Explore all opportunities →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {recommendedOpportunities.length > 0 ? (
              recommendedOpportunities.map(
                (opportunity) => (
                  <Link
                    key={opportunity.id}
                    href={`/student/opportunities/${opportunity.id}`}
                    className="group rounded-2xl border border-white/[0.06] bg-slate-950/60 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-600">
                          {opportunity.type}
                        </span>

                        <h3 className="mt-2 text-sm font-semibold leading-5 text-slate-200 group-hover:text-white">
                          {opportunity.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-600">
                          {opportunity.organization}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-xs font-bold text-emerald-400">
                        {opportunity.match_score}%
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {opportunity.matched_skills
                        .slice(0, 2)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-400/[0.06] px-2 py-1 text-[10px] text-emerald-400"
                          >
                            {skill}
                          </span>
                        ))}

                      {opportunity.skill_gaps
                        .length > 0 && (
                        <span className="rounded-full bg-amber-400/[0.06] px-2 py-1 text-[10px] text-amber-400">
                          Gap:{" "}
                          {opportunity.skill_gaps[0]}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4">
                      <span className="text-[10px] text-slate-600">
                        {opportunity.mode} ·{" "}
                        {opportunity.duration}
                      </span>

                      <span className="text-xs text-slate-600 transition group-hover:text-emerald-400">
                        View →
                      </span>
                    </div>
                  </Link>
                )
              )
            ) : (
              <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center text-sm text-slate-500">
                No opportunities available yet.
              </div>
            )}
          </div>
        </section>

        {/* NEXT ACTION */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Recommended Next Step
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                {skillsAssessed === 0
                  ? "Complete your skill assessment."
                  : gapCount > 0
                  ? "Work on your highest-priority skill gaps."
                  : "Explore opportunities aligned with your profile."}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {skillsAssessed === 0
                  ? "Your assessment will create the competency baseline used by AyushBridge."
                  : gapCount > 0
                  ? "Improving these competencies can increase your opportunity match scores."
                  : "Your current profile is ready to explore relevant opportunities."}
              </p>
            </div>

            <Link
              href={
                skillsAssessed === 0
                  ? "/student/assessment"
                  : gapCount > 0
                  ? "/student/results"
                  : "/student/opportunities"
              }
              className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 text-center text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              {skillsAssessed === 0
                ? "Start Assessment →"
                : gapCount > 0
                ? "Improve Skills →"
                : "Find Opportunities →"}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}