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
            fetch(
              "http://127.0.0.1:8000/institution/skill-intelligence"
            ),
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
          <p className="text-sm text-slate-500">
            Loading institution intelligence...
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
              Unable to load institution dashboard.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is running.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Institution Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.institution}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor student competencies, industry demand and
            institutional skill gaps.
          </p>
        </header>

        {/* CORE METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Students Assessed"
            value={data.students_assessed.toLocaleString()}
            note={`${data.profile_completion}% profile completion`}
          />

          <Metric
            label="Industry Partnerships"
            value={data.industry_partnerships.toString()}
            note={`${data.new_partnerships} new this year`}
          />

          <Metric
            label="Internship Opportunities"
            value={data.internship_opportunities.toString()}
            note={`${data.active_internships} currently active`}
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
                : `${data.critical_gaps_immediate_action} need action`
            }
            warning
          />
        </section>

        {/* TOP SKILL GAP */}
        {intelligence?.top_gap && (
          <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Priority Skill Gap
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {intelligence.top_gap.skill}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {intelligence.institutional_recommendation}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <InsightMetric
                  label="Readiness"
                  value={`${intelligence.top_gap.student_readiness}%`}
                  type="readiness"
                />

                <InsightMetric
                  label="Demand"
                  value={`${intelligence.top_gap.industry_demand}%`}
                  type="demand"
                />

                <InsightMetric
                  label="Gap"
                  value={`${intelligence.top_gap.skill_gap}%`}
                  type="gap"
                />
              </div>
            </div>
          </section>
        )}

        {/* DEMAND VS READINESS + AI INSIGHT */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">

          {/* DEMAND */}
          <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Skill Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Industry Demand vs Student Readiness
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Identify where institutional capability is falling
                behind industry demand.
              </p>
            </div>

            <div className="mt-7 space-y-6">
              {intelligence
                ? intelligence.skill_intelligence
                    .slice(0, 6)
                    .map((item) => (
                      <SkillBar
                        key={item.skill}
                        skill={item.skill}
                        readiness={item.student_readiness}
                        demand={item.industry_demand}
                      />
                    ))
                : data.skill_demand.map((item) => (
                    <SkillBar
                      key={item.skill}
                      skill={item.skill}
                      readiness={item.students}
                      demand={item.demand}
                    />
                  ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-500">
              <Legend
                label="Student Readiness"
                className="bg-emerald-400"
              />

              <Legend
                label="Industry Demand"
                className="bg-blue-400"
              />
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
              AI Institutional Insight
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              {data.ai_insight.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {data.ai_insight.description}
            </p>

            {intelligence?.top_gap && (
              <div className="mt-5 rounded-xl border border-amber-400/15 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">
                  Highest-priority competency
                </p>

                <p className="mt-2 font-medium text-amber-300">
                  {intelligence.top_gap.skill}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {intelligence.top_gap.skill_gap}% gap against
                  industry demand.
                </p>
              </div>
            )}

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-slate-950/60 p-4">
              <p className="text-xs text-slate-500">
                Recommended intervention
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200">
                {intelligence?.top_gap
                  ? intelligence.top_gap.recommended_action
                  : data.ai_insight.recommendation}
              </p>

              <p className="mt-3 text-xs text-emerald-400">
                Potentially impacts{" "}
                {data.ai_insight.potential_students} students
              </p>
            </div>
          </div>
        </section>

        {/* TRAINING NEEDS */}
        <section className="mt-7">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Institutional Action
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Priority Training Needs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recommended interventions based on identified skill gaps.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {data.training_needs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                      item.priority === "High"
                        ? "bg-amber-400/10 text-amber-400"
                        : "bg-blue-400/10 text-blue-400"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-2xl font-bold">
                    {item.students}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    students needing development
                  </p>
                </div>

                <button className="mt-5 w-full rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* INTELLIGENCE LOOP */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/40 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Institutional Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Competency Intelligence Loop
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              AyushBridge connects industry requirements with student
              competency data and institutional training decisions.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Industry Demand",
              "Skill Mapping",
              "Student Gaps",
              "Training",
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

function InsightMetric({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "readiness" | "demand" | "gap";
}) {
  const valueClass =
    type === "readiness"
      ? "text-emerald-400"
      : type === "demand"
        ? "text-blue-400"
        : "text-amber-400";

  return (
    <div className="min-w-[75px] rounded-xl border border-white/[0.07] bg-slate-950/70 px-3 py-3 text-center sm:min-w-[90px]">
      <p className={`text-lg font-bold ${valueClass}`}>
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {label}
      </p>
    </div>
  );
}

function SkillBar({
  skill,
  readiness,
  demand,
}: {
  skill: string;
  readiness: number;
  demand: number;
}) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-200">
          {skill}
        </p>

        <p className="text-[11px] text-slate-600">
          {readiness}% readiness · {demand}% demand
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${readiness}%` }}
          />
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-400"
            style={{ width: `${demand}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}