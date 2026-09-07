"use client";

import { useEffect, useState } from "react";

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

export default function ResultsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);

  const [learning, setLearning] =
    useState<LearningResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      try {
        const [
          skillsResponse,
          assessmentResponse,
          learningResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/skills/"),

          fetch(
            "http://127.0.0.1:8000/students/1/assessment/result"
          ),

          fetch(
            "http://127.0.0.1:8000/skills/learning?student_id=1"
          ),
        ]);

        if (
          !skillsResponse.ok ||
          !assessmentResponse.ok ||
          !learningResponse.ok
        ) {
          throw new Error("Failed to load results");
        }

        const skillsData = await skillsResponse.json();
        const assessmentData =
          await assessmentResponse.json();
        const learningData =
          await learningResponse.json();

        setSkills(skillsData);
        setAssessment(assessmentData);
        setLearning(learningData);
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

  const averageSkillScore =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + skill.score,
            0
          ) / skills.length
        )
      : 0;

  const assessmentScore = assessment?.score ?? 0;

  const strongSkills = skills.filter(
    (skill) => skill.score >= 75
  );

  const skillGaps = skills.filter(
    (skill) => skill.score < 60
  );

  const assessmentGaps =
    assessment?.competencies.filter(
      (item) => item.status === "Needs Development"
    ) ?? [];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-emerald-400">
            Competency Intelligence
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            My Skills
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Your competency profile, assessment results and
            AI-powered skill gap analysis.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading your competency results from AyushBridge API...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">
              {error}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is running on port 8000.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">
                  Assessment Score
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {assessmentScore}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {assessment?.correct_answers ?? 0} /{" "}
                  {assessment?.total_questions ?? 0} correct
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">
                  Skills Assessed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {skills.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">
                  Strong Skills
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {strongSkills.length}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
                <p className="text-sm text-amber-400">
                  Assessment Gaps
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {assessmentGaps.length}
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Latest Assessment
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Competency assessment completed
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Your assessment has been evaluated against
                    the competencies required for your target
                    career track.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/50 px-6 py-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Overall Score
                  </p>

                  <p className="mt-1 text-3xl font-bold text-emerald-400">
                    {assessmentScore}%
                  </p>
                </div>
              </div>
            </div>

            {assessment &&
              assessment.competencies.length > 0 && (
                <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                      Assessment Competencies
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Competency-level results from your latest
                      assessment.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {assessment.competencies.map((item) => (
                      <div
                        key={item.competency}
                        className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium text-slate-200">
                            {item.competency}
                          </p>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.status === "Strong"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-amber-400/10 text-amber-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-slate-500">
                              Score
                            </span>

                            <span className="font-semibold text-emerald-400">
                              {item.score}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${item.score}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    Competency Profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Skills retrieved from your AyushBridge competency
                    profile.
                  </p>
                </div>

                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            {skill.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {skill.category} · {skill.level}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-emerald-400">
                          {skill.score}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${skill.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {skills.length > 0 && (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Average Skill Score
                      </span>

                      <span className="text-lg font-bold text-emerald-400">
                        {averageSkillScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
                  <p className="text-sm font-medium text-emerald-400">
                    AI Skill Gap Analysis
                  </p>

                  <h2 className="mt-3 text-lg font-semibold">
                    Focus on your emerging gaps
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Your assessment identifies areas where
                    additional development can improve your
                    readiness for clinical research opportunities.
                  </p>

                  <div className="mt-5 space-y-3">
                    {assessmentGaps.length > 0 ? (
                      assessmentGaps.slice(0, 3).map((item) => (
                        <div
                          key={item.competency}
                          className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-200">
                              {item.competency}
                            </span>

                            <span className="text-xs font-medium text-amber-400">
                              Needs Development
                            </span>
                          </div>
                        </div>
                      ))
                    ) : skillGaps.length > 0 ? (
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
                      <p className="text-sm text-emerald-400">
                        No major skill gaps detected.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">
                    Target Career Track
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Clinical Research
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Recommended based on your competency profile
                    and current opportunity matches.
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-800/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Next Recommended Step
                    </p>

                    <p className="mt-2 text-sm font-medium text-emerald-400">
                      Strengthen Biostatistics and Clinical Data
                      Management
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Personalized Development
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Recommended Learning
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Learning recommendations are generated from your
                    current competency gaps and prioritized according
                    to the skills that need the most development.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Skill Gaps
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-400">
                    {learning?.gap_count ?? skillGaps.length}
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
                        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
                              {recommendation.skill}
                            </p>

                            <h3 className="mt-2 text-lg font-semibold">
                              {recommendation.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {recommendation.provider}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                              recommendation.priority === "High"
                                ? "bg-amber-400/10 text-amber-400"
                                : "bg-emerald-400/10 text-emerald-400"
                            }`}
                          >
                            {recommendation.priority} Priority
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                            Current: {recommendation.current_score}%
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                            {recommendation.type}
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                            {recommendation.duration}
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                            {recommendation.level}
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Why this is recommended
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {recommendation.reason}
                          </p>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
                          <p className="text-xs font-medium text-slate-500">
                            Learning Focus
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {recommendation.focus}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="mt-5 w-full rounded-xl border border-emerald-800/50 px-4 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-900/20"
                        >
                          View Learning Program
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-5">
                  <p className="font-medium text-emerald-400">
                    No learning recommendations needed right now.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Your current competency profile does not show
                    any major development gaps.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}