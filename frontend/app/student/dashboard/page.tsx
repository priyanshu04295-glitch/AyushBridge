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
          skills.reduce((total, skill) => total + skill.score, 0) /
            skills.length
        )
      : 0;

  const skillGaps = skills.filter((skill) => skill.score < 60);

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

  const matchedOpportunities = opportunities.filter(
    (opportunity) => opportunity.match_score >= 60
  );

  const recommendedOpportunities = [...opportunities]
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading your dashboard from AyushBridge API...
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
              {error || "Unable to load student profile."}
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
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-400">
              Student Competency Intelligence
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {student.name.split(" ")[0]}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {student.program} · Target Role: {student.target_role}
            </p>
          </div>

          <Link
            href="/student/assessment"
            className="rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Take Skill Assessment
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Readiness Score</p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {readinessScore}%
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Based on current competency profile
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Skills Assessed</p>

            <p className="mt-2 text-3xl font-bold">
              {skillsAssessed}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Competencies evaluated
            </p>
          </div>

          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
            <p className="text-sm text-amber-400">Skill Gaps</p>

            <p className="mt-2 text-3xl font-bold">
              {gapCount}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Priority areas
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Matched Opportunities
            </p>

            <p className="mt-2 text-3xl font-bold">
              {matchedOpportunities.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              AI-ranked opportunities
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Competency Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your strongest and emerging competencies.
                </p>
              </div>

              <Link
                href="/student/results"
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-5">
              {skills.slice(0, 5).map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {skill.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {skill.level}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-emerald-400">
                      {skill.score}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
            <p className="text-sm font-medium text-emerald-400">
              AI Gap Analysis
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              Strengthen priority competencies
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your competency profile shows where additional development
              can improve your readiness for clinical research opportunities.
            </p>

            <div className="mt-5 space-y-3">
              {skillGaps.length > 0 ? (
                skillGaps.slice(0, 3).map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-200">
                        {skill.name}
                      </span>

                      <span className="text-xs font-medium text-amber-400">
                        {skill.score}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
                  <p className="text-sm text-emerald-400">
                    No major skill gaps detected.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/student/results"
              className="mt-5 block rounded-xl border border-emerald-800/50 px-4 py-3 text-center text-sm font-medium text-emerald-400 transition hover:bg-emerald-900/20"
            >
              View Skill Gap Analysis
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recommended Opportunities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-ranked based on your competency profile.
                </p>
              </div>

              <Link
                href="/student/opportunities"
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                Explore →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {recommendedOpportunities.length > 0 ? (
                recommendedOpportunities.map((opportunity) => (
                  <Link
                    key={opportunity.id}
                    href={`/student/opportunities/${opportunity.id}`}
                    className="block rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-emerald-800/60"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">
                          {opportunity.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {opportunity.organization}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-emerald-400">
                        {opportunity.match_score}%
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.matched_skills
                        .slice(0, 2)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-950/50 px-2.5 py-1 text-xs text-emerald-400"
                          >
                            {skill}
                          </span>
                        ))}

                      {opportunity.skill_gaps.length > 0 && (
                        <span className="rounded-full bg-amber-950/40 px-2.5 py-1 text-xs text-amber-400">
                          Gap: {opportunity.skill_gaps[0]}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-500">
                  No matched opportunities available yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Your Development Loop
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Turn skill gaps into verified career outcomes.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Assess skills",
                "Identify competency gaps",
                "Complete recommended learning",
                "Apply to matched opportunities",
                "Get skills and outcomes verified",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-300">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}