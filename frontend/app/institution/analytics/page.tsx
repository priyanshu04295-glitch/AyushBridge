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
          <p className="text-sm text-slate-500">
            Loading institution analytics...
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="font-medium text-red-400">
              Unable to load institution analytics.
            </p>

            <p className="mt-2 text-sm text-slate-500">
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
      ? [...data.skill_gap_trend].sort(
          (a, b) => b.gap - a.gap
        )[0]
      : null;

  const topDemand =
    data.industry_demand.length > 0
      ? [...data.industry_demand].sort(
          (a, b) => b.demand - a.demand
        )[0]
      : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Institution Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Analytics & Outcomes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Analyse competency gaps, industry demand, student readiness
            and the impact of institutional training.
          </p>
        </header>

        {/* KEY METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Industry Ready"
            value={`${data.placement_readiness.ready}%`}
            note="Current readiness"
          />

          <Metric
            label="Developing"
            value={`${data.placement_readiness.developing}%`}
            note="Further development"
          />

          <Metric
            label="Needs Intervention"
            value={`${data.placement_readiness.needs_intervention}%`}
            note="Priority group"
            warning
          />

          <Metric
            label="Training Reach"
            value={totalTrainingStudents.toString()}
            note="Students reached"
          />
        </section>

        {/* TOP SIGNALS */}
        <section className="mt-7 grid gap-3 md:grid-cols-2">
          {topSkillGap && (
            <SignalCard
              label="Highest Skill Gap"
              title={topSkillGap.skill}
              value={`${topSkillGap.gap}%`}
              description="Development gap"
              type="gap"
            />
          )}

          {topDemand && (
            <SignalCard
              label="Highest Industry Demand"
              title={topDemand.skill}
              value={`${topDemand.demand}%`}
              description="Current demand"
              type="demand"
            />
          )}
        </section>

        {/* INDUSTRY DEMAND */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
              Market Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Industry Demand
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current demand signals across tracked competencies.
            </p>
          </div>

          <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {data.industry_demand.map((item) => (
              <div key={item.skill}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-200">
                    {item.skill}
                  </p>

                  <span className="text-xs font-semibold text-blue-400">
                    {item.demand}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
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
        </section>

        {/* SKILL GAP ANALYSIS */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
              Competency Analysis
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Skill Gap Priorities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Competencies requiring institutional development.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wider text-slate-600">
                  <th className="px-3 py-3 font-medium">
                    Competency
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Gap
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Priority
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Recommended Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.skill_gap_trend.map((item) => {
                  const priority =
                    item.gap >= 35
                      ? "High"
                      : item.gap >= 15
                        ? "Medium"
                        : "Low";

                  return (
                    <tr
                      key={item.skill}
                      className="border-b border-white/[0.05] transition hover:bg-slate-800/30"
                    >
                      <td className="px-3 py-4 text-sm font-medium text-slate-200">
                        {item.skill}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
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

                          <span className="text-xs font-semibold text-amber-400">
                            {item.gap}%
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <PriorityBadge priority={priority} />
                      </td>

                      <td className="px-3 py-4 text-xs text-slate-500">
                        {priority === "High"
                          ? "Launch targeted training"
                          : priority === "Medium"
                            ? "Add practical workshop"
                            : "Monitor competency trend"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* READINESS + TRAINING */}
        <section className="mt-7 grid gap-6 lg:grid-cols-2">

          {/* READINESS */}
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Student Outcomes
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Placement Readiness
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current institutional readiness distribution.
              </p>
            </div>

            <div className="mt-7 space-y-6">
              <ReadinessBar
                label="Industry Ready"
                value={data.placement_readiness.ready}
                className="bg-emerald-500"
              />

              <ReadinessBar
                label="Developing"
                value={data.placement_readiness.developing}
                className="bg-blue-400"
              />

              <ReadinessBar
                label="Needs Intervention"
                value={data.placement_readiness.needs_intervention}
                className="bg-amber-400"
              />
            </div>
          </div>

          {/* TRAINING */}
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Development Impact
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Training Impact
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students reached through competency development programs.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {data.training_impact.map((item) => (
                <div key={item.program}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-300">
                      {item.program}
                    </p>

                    <p className="text-sm font-semibold text-emerald-400">
                      {item.students}
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          (item.students /
                            Math.max(totalTrainingStudents, 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI INSIGHT */}
        <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            AI Outcome Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Institutional Performance Signal
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
            {data.ai_insight}
          </p>

          {topSkillGap && (
            <div className="mt-6 rounded-xl border border-amber-400/15 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-600">
                Recommended focus
              </p>

              <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-200">
                  {topSkillGap.skill}
                </p>

                <p className="text-xs text-amber-400">
                  {topSkillGap.gap}% development gap
                </p>
              </div>
            </div>
          )}
        </section>

        {/* DECISION LOOP */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Institutional Intelligence
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Data-to-Decision Loop
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Industry Demand",
              "Skill Gap",
              "Training",
              "Student Readiness",
              "Outcome Feedback",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-4"
              >
                <p className="text-xs font-semibold text-emerald-400">
                  0{index + 1}
                </p>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({
  label,
  value,
  note,
  warning = false,
}: {
  label: string;
  value: string;
  note: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          warning ? "text-amber-400" : "text-white"
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-2 text-xs ${
          warning ? "text-amber-400/80" : "text-emerald-400"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function SignalCard({
  label,
  title,
  value,
  description,
  type,
}: {
  label: string;
  title: string;
  value: string;
  description: string;
  type: "gap" | "demand";
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        type === "gap"
          ? "border-amber-400/15 bg-amber-400/[0.04]"
          : "border-blue-400/15 bg-blue-400/[0.04]"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          type === "gap"
            ? "text-amber-400"
            : "text-blue-400"
        }`}
      >
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <p
          className={`text-2xl font-bold ${
            type === "gap"
              ? "text-amber-400"
              : "text-blue-400"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const className =
    priority === "High"
      ? "bg-red-400/10 text-red-400"
      : priority === "Medium"
        ? "bg-amber-400/10 text-amber-400"
        : "bg-slate-800 text-slate-500";

  return (
    <span
      className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${className}`}
    >
      {priority}
    </span>
  );
}

function ReadinessBar({
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
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">
          {label}
        </p>

        <p className="text-xs text-slate-500">
          {value}%
        </p>
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