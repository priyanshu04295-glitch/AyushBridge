"use client";

import { useEffect, useState } from "react";

type SkillDemand = {
  skill: string;
  students: number;
  demand: number;
};

type TrainingNeed = {
  title: string;
  students: number;
  priority: string;
  action: string;
};

type DashboardData = {
  institution: string;
  students_assessed: number;
  profile_completion: number;
  industry_partnerships: number;
  new_partnerships: number;
  internship_opportunities: number;
  active_internships: number;
  critical_skill_gaps: number;
  critical_gaps_immediate_action: number;
  skill_demand: SkillDemand[];
  training_needs: TrainingNeed[];
  ai_insight: {
    title: string;
    description: string;
    recommendation: string;
    potential_students: number;
  };
};

type SkillIntelligence = {
  skill: string;
  student_readiness: number;
  industry_demand: number;
  skill_gap: number;
  opportunity_count: number;
  priority: string;
  recommended_action: string;
};

type IntelligenceData = {
  institution: string;
  students_analysed: number;
  skills_analysed: number;
  high_priority_gaps: number;
  skill_intelligence: SkillIntelligence[];
  top_gap: SkillIntelligence | null;
  institutional_recommendation: string;
};

export default function InstitutionDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [intelligence, setIntelligence] =
    useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardResponse, intelligenceResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/institution/dashboard"),
            fetch("http://127.0.0.1:8000/institution/skill-intelligence"),
          ]);

        if (dashboardResponse.ok) {
          setData(await dashboardResponse.json());
        }

        if (intelligenceResponse.ok) {
          setIntelligence(await intelligenceResponse.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-400">
            Loading institution intelligence...
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-red-400">
              Unable to load institution dashboard.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Make sure the FastAPI backend is running.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-950 p-6 lg:block">
          <div className="mb-10">
            <div className="text-2xl font-bold text-emerald-400">
              AyushBridge
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Academia–Industry Intelligence
            </p>
          </div>

          <nav className="space-y-2 text-sm">
            <a
              href="/institution/dashboard"
              className="block rounded-xl bg-emerald-500/10 px-4 py-3 font-medium text-emerald-400"
            >
              Dashboard
            </a>

            <a
              href="/institution/analytics"
              className="block rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900"
            >
              Analytics
            </a>

            <a
              href="/student/dashboard"
              className="block rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900"
            >
              Student Intelligence
            </a>

            <a
              href="/industry"
              className="block rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900"
            >
              Industry Demand
            </a>

            <a
              href="/faculty"
              className="block rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900"
            >
              Faculty Network
            </a>
          </nav>
        </aside>

        <section className="flex-1">
          <header className="border-b border-slate-800 px-6 py-5 lg:px-10">
            <p className="text-sm text-emerald-400">
              Institution Intelligence
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {data.institution}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Monitor student competencies, industry demand and
              institutional skill gaps.
            </p>
          </header>

          <div className="p-6 lg:p-10">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric
                label="Students Assessed"
                value={data.students_assessed.toLocaleString()}
                note={`${data.profile_completion}% profile completion`}
                noteClass="text-emerald-400"
              />

              <Metric
                label="Industry Partnerships"
                value={data.industry_partnerships.toString()}
                note={`${data.new_partnerships} new this year`}
                noteClass="text-emerald-400"
              />

              <Metric
                label="Internship Opportunities"
                value={data.internship_opportunities.toString()}
                note={`${data.active_internships} currently active`}
                noteClass="text-emerald-400"
              />

              <Metric
                label="Critical Skill Gaps"
                value={
                  intelligence
                    ? intelligence.high_priority_gaps.toString()
                    : data.critical_skill_gaps.toString()
                }
                note={
                  intelligence
                    ? `${intelligence.skills_analysed} competencies analysed`
                    : `${data.critical_gaps_immediate_action} require immediate action`
                }
                noteClass="text-amber-400"
                valueClass="text-amber-400"
              />
            </div>

            {intelligence?.top_gap && (
              <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-400">
                      Institutional Skill Intelligence
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {intelligence.top_gap.skill} is the top identified gap
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                      {intelligence.institutional_recommendation}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                      <p className="text-xl font-bold text-white">
                        {intelligence.top_gap.student_readiness}%
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Readiness
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                      <p className="text-xl font-bold text-blue-400">
                        {intelligence.top_gap.industry_demand}%
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Demand
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                      <p className="text-xl font-bold text-amber-400">
                        {intelligence.top_gap.skill_gap}%
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Gap
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Industry Demand vs Student Capability
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Compare institutional competency strength with
                    current industry demand.
                  </p>
                </div>

                <div className="mt-7 space-y-6">
                  {intelligence
                    ? intelligence.skill_intelligence
                        .slice(0, 6)
                        .map((item) => (
                          <div key={item.skill}>
                            <div className="flex justify-between gap-4">
                              <p className="text-sm font-medium">
                                {item.skill}
                              </p>

                              <p className="text-xs text-slate-500">
                                {item.student_readiness}% readiness ·{" "}
                                {item.industry_demand}% demand
                              </p>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div>
                                <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                                  <span>Student Readiness</span>
                                  <span>
                                    {item.student_readiness}%
                                  </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                      width: `${item.student_readiness}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                                  <span>Industry Demand</span>
                                  <span>
                                    {item.industry_demand}%
                                  </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full rounded-full bg-blue-400"
                                    style={{
                                      width: `${item.industry_demand}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    : data.skill_demand.map((item) => (
                        <div key={item.skill}>
                          <div className="flex justify-between gap-4">
                            <p className="text-sm font-medium">
                              {item.skill}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.students}% student readiness ·{" "}
                              {item.demand}% demand
                            </p>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{
                                  width: `${item.students}%`,
                                }}
                              />
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-blue-400"
                                style={{
                                  width: `${item.demand}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <p className="text-sm font-semibold text-emerald-400">
                  AI Institutional Insight
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  {data.ai_insight.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {data.ai_insight.description}
                </p>

                {intelligence?.top_gap && (
                  <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-xs text-amber-400">
                      Live competency intelligence
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {intelligence.top_gap.skill}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {intelligence.top_gap.skill_gap}% competency gap
                      against current industry demand.
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">
                    Recommended intervention
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {intelligence?.top_gap
                      ? intelligence.top_gap.recommended_action
                      : data.ai_insight.recommendation}
                  </p>

                  <p className="mt-2 text-xs text-emerald-400">
                    Potentially impacts{" "}
                    {data.ai_insight.potential_students} students
                  </p>
                </div>
              </div>
            </div>

            {intelligence && (
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">
                      Competency Intelligence
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Institution-wide skill gap analysis
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Live analysis of competencies against industry
                      opportunity demand.
                    </p>
                  </div>

                  <div className="text-xs text-slate-500">
                    {intelligence.students_analysed.toLocaleString()} students
                    · {intelligence.skills_analysed} competencies
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs text-slate-500">
                        <th className="px-3 py-3 font-medium">
                          Competency
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Readiness
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Demand
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Gap
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Priority
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {intelligence.skill_intelligence.map((item) => (
                        <tr
                          key={item.skill}
                          className="border-b border-slate-800/70"
                        >
                          <td className="px-3 py-4 font-medium">
                            {item.skill}
                          </td>

                          <td className="px-3 py-4 text-emerald-400">
                            {item.student_readiness}%
                          </td>

                          <td className="px-3 py-4 text-blue-400">
                            {item.industry_demand}%
                          </td>

                          <td className="px-3 py-4 font-semibold text-amber-400">
                            {item.skill_gap}%
                          </td>

                          <td className="px-3 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                item.priority === "High"
                                  ? "bg-red-500/10 text-red-400"
                                  : item.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>

                          <td className="px-3 py-4 text-xs text-slate-400">
                            {item.recommended_action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8">
              <div>
                <h2 className="text-xl font-semibold">
                  Priority Training Needs
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Data-driven recommendations for institutional
                  skill development.
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {data.training_needs.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          item.priority === "High"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold">
                      {item.students}
                    </p>

                    <p className="text-xs text-slate-500">
                      students needing development
                    </p>

                    <button className="mt-5 w-full rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium hover:bg-slate-800">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-lg font-semibold">
                Competency Intelligence Loop
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {[
                  "Industry Demand",
                  "Skill Mapping",
                  "Student Gaps",
                  "Training",
                  "Outcome Feedback",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-xs text-emerald-400">
                      0{index + 1}
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                AyushBridge turns industry demand and student
                competency data into actionable institutional
                intelligence for training, curriculum planning and
                employability improvement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  note,
  noteClass,
  valueClass = "text-white",
}: {
  label: string;
  value: string;
  note: string;
  noteClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
        {value}
      </p>

      <p className={`mt-2 text-xs ${noteClass}`}>
        {note}
      </p>
    </div>
  );
}