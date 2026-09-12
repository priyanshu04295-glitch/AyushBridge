"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Skill = {
  name: string;
  category: string;
  level: string;
  score: number;
};

type AssessmentCompetency = {
  competency: string;
  selected_answer: string;
  correct_answer: string;
  score: number;
  status: string;
};

type AssessmentResult = {
  student_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  competencies: AssessmentCompetency[];
  gaps: string[];
};

type LearningRecommendation = {
  skill: string;
  current_score: number;
  priority: string;
  reason: string;
  title: string;
  type: string;
  provider: string;
  duration: string;
  level: string;
  focus: string;
};

type LearningResponse = {
  student_id: number;
  gap_count: number;
  skill_gaps: {
    name: string;
    score: number;
    level: string;
  }[];
  recommendations: LearningRecommendation[];
};

type Mentorship = {
  id: number;
  student_id: number;
  student: string;
  faculty_id: number;
  faculty: string;
  area: string;
  type: string;
  message: string;
  status: string;
};

export default function ResultsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);
  const [learning, setLearning] =
    useState<LearningResponse | null>(null);

  const [mentorship, setMentorship] =
    useState<Mentorship[]>([]);

  const [mentorshipMessage, setMentorshipMessage] =
    useState("");

  const [requestingMentorship, setRequestingMentorship] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      try {
        const [
          skillsResponse,
          assessmentResponse,
          learningResponse,
          mentorshipResponse,
        ] = await Promise.all([
          fetch(
            "http://127.0.0.1:8000/skills/"
          ),
          fetch(
            "http://127.0.0.1:8000/students/1/assessment/result"
          ),
          fetch(
            "http://127.0.0.1:8000/skills/learning?student_id=1"
          ),
          fetch(
            "http://127.0.0.1:8000/faculty/mentorship"
          ),
        ]);

        if (
          !skillsResponse.ok ||
          !assessmentResponse.ok ||
          !learningResponse.ok ||
          !mentorshipResponse.ok
        ) {
          throw new Error(
            "Failed to load results"
          );
        }

        const skillsData =
          await skillsResponse.json();

        const assessmentData =
          await assessmentResponse.json();

        const learningData =
          await learningResponse.json();

        const mentorshipData =
          await mentorshipResponse.json();

        setSkills(skillsData);
        setAssessment(assessmentData);
        setLearning(learningData);
        setMentorship(mentorshipData);
      } catch {
        setError(
          "Unable to connect to AyushBridge API."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, []);

  const requestMentorship = async (
    area: string
  ) => {
    setRequestingMentorship(true);
    setMentorshipMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/faculty/mentorship/request?student_id=1&student_name=Aarav%20Sharma&area=${encodeURIComponent(
          area
        )}&message=${encodeURIComponent(
          `I need guidance to improve my ${area} competency.`
        )}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMentorshipMessage(
          data.detail || "Request failed."
        );
        return;
      }

      setMentorshipMessage(
        "Mentorship request sent successfully."
      );

      const updatedResponse =
        await fetch(
          "http://127.0.0.1:8000/faculty/mentorship"
        );

      if (updatedResponse.ok) {
        const updatedData =
          await updatedResponse.json();

        setMentorship(updatedData);
      }
    } catch {
      setMentorshipMessage(
        "Unable to connect to AyushBridge API."
      );
    } finally {
      setRequestingMentorship(false);
    }
  };

  const averageSkillScore =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) =>
              total + skill.score,
            0
          ) / skills.length
        )
      : 0;

  const assessmentScore =
    assessment?.score ?? 0;

  const strongSkills = skills.filter(
    (skill) => skill.score >= 75
  );

  const developingSkills = skills.filter(
    (skill) =>
      skill.score >= 60 &&
      skill.score < 75
  );

  const skillGaps = skills.filter(
    (skill) => skill.score < 60
  );

  const assessmentGaps =
    assessment?.competencies.filter(
      (item) =>
        item.status ===
        "Needs Development"
    ) ?? [];

  const readinessLabel =
    averageSkillScore >= 75
      ? "Strong"
      : averageSkillScore >= 60
      ? "Developing"
      : "Building";

  const existingMentorship =
    mentorship.find(
      (item) =>
        item.student_id === 1 &&
        item.faculty_id === 1
    );

  const mentorshipArea =
    skillGaps[0]?.name ||
    assessmentGaps[0]?.competency ||
    "Biostatistics";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-3xl border border-white/[0.07] bg-slate-900/70 p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading your competency intelligence...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">
              {error}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is running
              on port 8000.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Competency Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Competencies
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Understand your current capabilities, identify
              development gaps and follow a personalized path
              toward your target opportunities.
            </p>
          </div>

          <Link
            href="/student/assessment"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-center text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Retake Assessment →
          </Link>
        </header>

        {/* TOP SUMMARY */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-emerald-400/[0.07] via-slate-900 to-slate-900 p-7 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_250px] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Current competency status
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Your profile is{" "}
                <span className="text-emerald-400">
                  {readinessLabel.toLowerCase()}
                </span>
                .
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Your competency profile is evaluated using your
                current skill scores and assessment performance.
                AyushBridge uses these signals to identify
                development priorities and opportunity readiness.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5 text-xs text-emerald-400">
                  {strongSkills.length} Strong
                </span>

                <span className="rounded-full border border-white/[0.06] bg-slate-950/50 px-3 py-1.5 text-xs text-slate-400">
                  {developingSkills.length} Developing
                </span>

                <span className="rounded-full border border-amber-400/10 bg-amber-400/[0.04] px-3 py-1.5 text-xs text-amber-400">
                  {skillGaps.length} Gaps
                </span>
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
                      averageSkillScore >= 50
                        ? "rgb(52 211 153)"
                        : "rgb(30 41 59)",
                    borderBottomColor:
                      averageSkillScore >= 75
                        ? "rgb(52 211 153)"
                        : "rgb(30 41 59)",
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-400">
                    {averageSkillScore}%
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-600">
                    Skill Readiness
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
              Assessment Score
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {assessmentScore}%
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {assessment?.correct_answers ?? 0} /{" "}
              {assessment?.total_questions ?? 0} correct
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Competencies
            </p>

            <p className="mt-3 text-3xl font-bold">
              {skills.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Currently tracked
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
            <p className="text-xs uppercase tracking-wider text-emerald-500/70">
              Strong Skills
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {strongSkills.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Score ≥ 75%
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-amber-500/70">
              Development Gaps
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-400">
              {skillGaps.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Score below 60%
            </p>
          </div>
        </div>

        {/* ASSESSMENT RESULTS */}
        {assessment &&
          assessment.competencies.length > 0 && (
            <section className="mb-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Assessment
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Latest competency assessment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your performance across the assessed competency areas.
                  </p>
                </div>

                <div className="text-sm font-semibold text-emerald-400">
                  {assessmentScore}% overall
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {assessment.competencies.map(
                  (item) => (
                    <div
                      key={item.competency}
                      className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-200">
                          {item.competency}
                        </p>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                            item.status ===
                            "Strong"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-amber-400/10 text-amber-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-slate-600">
                            Score
                          </span>

                          <span className="text-sm font-bold text-emerald-400">
                            {item.score}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{
                              width: `${item.score}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

        {/* PROFILE + GAP */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* SKILL PROFILE */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Skill Profile
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Your competency landscape
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current capability across your tracked skills.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {skill.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        {skill.category}{" "}
                        <span className="mx-1">
                          ·
                        </span>
                        {skill.level}
                      </p>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        skill.score >= 75
                          ? "text-emerald-400"
                          : skill.score >= 60
                          ? "text-slate-300"
                          : "text-amber-400"
                      }`}
                    >
                      {skill.score}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        skill.score >= 75
                          ? "bg-emerald-400"
                          : skill.score >= 60
                          ? "bg-slate-500"
                          : "bg-amber-400"
                      }`}
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {skills.length === 0 && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-500">
                Complete your skill assessment to build
                your competency profile.
              </div>
            )}
          </section>

          {/* GAP ANALYSIS */}
          <section className="rounded-2xl border border-amber-400/10 bg-gradient-to-b from-amber-400/[0.04] to-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              AI Gap Analysis
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Priority development
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Focus on these competencies to improve your
              career readiness.
            </p>

            <div className="mt-6 space-y-2">
              {skillGaps.length > 0 ? (
                skillGaps
                  .sort(
                    (a, b) =>
                      a.score - b.score
                  )
                  .slice(0, 4)
                  .map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-3.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-200">
                            {skill.name}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            {skill.level}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-amber-400">
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                  <p className="text-sm font-medium text-emerald-400">
                    No major gaps detected.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Continue strengthening your existing
                    competencies.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/student/opportunities"
              className="mt-5 block rounded-xl border border-amber-400/20 px-4 py-3 text-center text-xs font-semibold text-amber-400 transition hover:bg-amber-400/[0.05]"
            >
              Find Opportunities →
            </Link>
          </section>
        </div>

        {/* FACULTY MENTORSHIP */}
        <section className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Faculty Connection
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Get Faculty Mentorship
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Connect with faculty expertise to improve your
                priority competency gaps.
              </p>
            </div>

            {existingMentorship && (
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  existingMentorship.status === "Accepted"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : existingMentorship.status === "Pending"
                    ? "bg-amber-400/10 text-amber-400"
                    : existingMentorship.status === "Completed"
                    ? "bg-blue-400/10 text-blue-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {existingMentorship.status === "Accepted"
                  ? "Mentorship Active"
                  : existingMentorship.status === "Completed"
                  ? "Mentorship Completed"
                  : `Request ${existingMentorship.status}`}
              </span>
            )}
          </div>

          {mentorshipMessage && (
            <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3 text-sm text-emerald-400">
              {mentorshipMessage}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-slate-950/60 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 font-semibold text-emerald-400">
                    DM
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Dr. Meera Sharma
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Ayurveda Research · Faculty Mentor
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    Clinical Research
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    Research Methodology
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    Biostatistics
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    Scientific Writing
                  </span>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Recommended for your{" "}
                  <span className="text-amber-400">
                    {mentorshipArea}
                  </span>{" "}
                  development need.
                </p>
              </div>

              {!existingMentorship ? (
                <button
                  onClick={() =>
                    requestMentorship(
                      mentorshipArea
                    )
                  }
                  disabled={requestingMentorship}
                  className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {requestingMentorship
                    ? "Sending..."
                    : "Request Mentorship →"}
                </button>
              ) : (
                <div className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-center text-xs font-semibold text-slate-400">
                  {existingMentorship.status ===
                  "Accepted"
                    ? "Mentorship Active ✓"
                    : existingMentorship.status ===
                      "Completed"
                    ? "Completed ✓"
                    : existingMentorship.status ===
                      "Rejected"
                    ? "Request Rejected"
                    : "Request Sent ✓"}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LEARNING */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Personalized Development
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Recommended Learning
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Learning recommendations are prioritized from
                your competency gaps.
              </p>
            </div>

            <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.03] px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Priority Gaps
              </p>

              <p className="mt-1 text-xl font-bold text-amber-400">
                {learning?.gap_count ??
                  skillGaps.length}
              </p>
            </div>
          </div>

          {learning?.recommendations &&
          learning.recommendations.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {learning.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={`${recommendation.title}-${index}`}
                    className="rounded-2xl border border-white/[0.06] bg-slate-950/60 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                          {recommendation.skill}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {recommendation.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-600">
                          {recommendation.provider}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          recommendation.priority ===
                          "High"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {recommendation.priority}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
                        Current{" "}
                        {recommendation.current_score}%
                      </span>

                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
                        {recommendation.type}
                      </span>

                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
                        {recommendation.duration}
                      </span>

                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
                        {recommendation.level}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                        Why this is recommended
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {recommendation.reason}
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.05] bg-slate-900 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Learning Focus
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {recommendation.focus}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full rounded-xl border border-emerald-400/15 px-4 py-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-400/[0.05]"
                    >
                      View Learning Program →
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
              <p className="font-medium text-emerald-400">
                No learning recommendations currently available.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your current competency profile does not
                require a major development intervention.
              </p>
            </div>
          )}
        </section>

        {/* NEXT ACTION */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Next Best Action
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                {skillGaps.length > 0
                  ? `Strengthen ${skillGaps[0].name}.`
                  : "Explore opportunities aligned with your profile."}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {skillGaps.length > 0
                  ? "Improving your priority competency can increase your readiness and opportunity match."
                  : "Your current competency profile is ready for opportunity exploration."}
              </p>
            </div>

            <Link
              href={
                skillGaps.length > 0
                  ? "/student/assessment"
                  : "/student/opportunities"
              }
              className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 text-center text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              {skillGaps.length > 0
                ? "Improve Competency →"
                : "Explore Opportunities →"}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}