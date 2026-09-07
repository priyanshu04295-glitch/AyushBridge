"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  skill_gap_trend: {
    skill: string;
    gap: number;
  }[];
  industry_demand: {
    skill: string;
    demand: number;
  }[];
  placement_readiness: {
    ready: number;
    developing: number;
    needs_intervention: number;
  };
  training_impact: {
    program: string;
    students: number;
  }[];
  ai_insight: string;
};

export default function InstitutionAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/institution/analytics"
        );

        if (response.ok) {
          setData(await response.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-400">
            Loading institution analytics...
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
              Unable to load institution analytics.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Make sure the FastAPI backend is running.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalTrainingStudents = data.training_impact.reduce(
    (total, item) => total + item.students,
    0
  );

  const topSkillGap =
    data.skill_gap_trend.length > 0
      ? [...data.skill_gap_trend].sort((a, b) => b.gap - a.gap)[0]
      : null;

  const topDemand =
    data.industry_demand.length > 0
      ? [...data.industry_demand].sort((a, b) => b.demand - a.demand)[0]
      : null;

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
              className="block rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900"
            >
              Dashboard
            </a>

            <a
              href="/institution/analytics"
              className="block rounded-xl bg-emerald-500/10 px-4 py-3 font-medium text-emerald-400"
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
              Institution Analytics
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Employability & Outcome Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Track competency readiness, industry demand, training
              impact and placement outcomes.
            </p>
          </header>

          <div className="p-6 lg:p-10">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric
                label="Industry Readiness"
                value={`${data.placement_readiness.ready}%`}
                note="Currently industry ready"
              />

              <Metric
                label="Developing Students"
                value={`${data.placement_readiness.developing}%`}
                note="Require further development"
              />

              <Metric
                label="Needs Intervention"
                value={`${data.placement_readiness.needs_intervention}%`}
                note="Priority intervention group"
                valueClass="text-amber-400"
              />

              <Metric
                label="Training Reach"
                value={totalTrainingStudents.toString()}
                note="Students reached by programs"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold">
                  Industry Demand
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Current demand signals across tracked competencies.
                </p>

                <div className="mt-7 space-y-5">
                  {data.industry_demand.map((item) => (
                    <div key={item.skill}>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm font-medium">
                          {item.skill}
                        </span>

                        <span className="text-xs text-blue-400">
                          {item.demand}% demand
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-400"
                          style={{
                            width: `${item.demand}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {topDemand && (
                  <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="text-xs text-slate-500">
                      Highest current demand
                    </p>

                    <p className="mt-2 font-semibold">
                      {topDemand.skill}
                    </p>

                    <p className="mt-1 text-xs text-blue-400">
                      {topDemand.demand}% industry demand
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <p className="text-sm font-semibold text-emerald-400">
                  AI Outcome Insight
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Industry alignment is improving.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {data.ai_insight}
                </p>

                {topSkillGap && (
                  <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-xs text-slate-500">
                      Priority skill gap
                    </p>

                    <p className="mt-2 font-semibold">
                      {topSkillGap.skill}
                    </p>

                    <p className="mt-1 text-xs text-amber-400">
                      {topSkillGap.gap}% development gap
                    </p>
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">
                    Institutional decision signal
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    Prioritize training interventions where skill gaps
                    remain highest against industry demand.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold">
                Skill Gap Priorities
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Competencies with the largest development gaps.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-4">Competency</th>
                      <th className="pb-4">Gap</th>
                      <th className="pb-4">Priority</th>
                      <th className="pb-4">Recommended Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.skill_gap_trend.map((item) => (
                      <tr
                        key={item.skill}
                        className="border-b border-slate-800/70"
                      >
                        <td className="py-5 font-medium">
                          {item.skill}
                        </td>

                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-amber-400"
                                style={{
                                  width: `${Math.min(
                                    item.gap * 2,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="text-xs text-amber-400">
                              {item.gap}%
                            </span>
                          </div>
                        </td>

                        <td className="py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              item.gap >= 35
                                ? "bg-red-500/10 text-red-400"
                                : item.gap >= 15
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {item.gap >= 35
                              ? "High"
                              : item.gap >= 15
                                ? "Medium"
                                : "Low"}
                          </span>
                        </td>

                        <td className="py-5 text-slate-400">
                          {item.gap >= 35
                            ? "Launch targeted training"
                            : item.gap >= 15
                              ? "Add practical workshop"
                              : "Monitor competency trend"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold">
                  Placement Readiness
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Current institutional readiness distribution.
                </p>

                <div className="mt-6 space-y-5">
                  <ReadinessRow
                    label="Industry Ready"
                    value={data.placement_readiness.ready}
                    className="bg-emerald-500"
                  />

                  <ReadinessRow
                    label="Developing"
                    value={data.placement_readiness.developing}
                    className="bg-blue-400"
                  />

                  <ReadinessRow
                    label="Needs Intervention"
                    value={data.placement_readiness.needs_intervention}
                    className="bg-amber-400"
                  />
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">
                    Interpretation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The readiness distribution helps the institution
                    identify students who are already opportunity-ready,
                    those who need targeted development and those who
                    require stronger intervention.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold">
                  Training Impact
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Students reached through competency development
                  programs.
                </p>

                <div className="mt-6 space-y-4">
                  {data.training_impact.map((item) => (
                    <div
                      key={item.program}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">
                          {item.program}
                        </p>

                        <p className="text-xl font-bold text-emerald-400">
                          {item.students}
                        </p>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(
                              (item.students / 150) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        students reached
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-lg font-semibold">
                Data-to-Decision Loop
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {[
                  "Collect Skills",
                  "Map Demand",
                  "Identify Gaps",
                  "Train Students",
                  "Measure Outcomes",
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
                Institution analytics closes the feedback loop by
                connecting student competencies, industry demand,
                training interventions and verified career outcomes.
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
  valueClass = "text-white",
}: {
  label: string;
  value: string;
  note: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
        {value}
      </p>

      <p className="mt-2 text-xs text-emerald-400">
        {note}
      </p>
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>

        <span className="text-slate-400">
          {value}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}