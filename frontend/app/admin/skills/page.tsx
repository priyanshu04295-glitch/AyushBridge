"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  category: string;
  competency: string;
  status: string;
  usage: number;
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/skills")
      .then((response) => response.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load skills:", error);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(skills.map((skill) => skill.category))
    ),
  ];

  const filteredSkills = skills.filter((skill) => {
    return (
      selectedCategory === "All" ||
      skill.category === selectedCategory
    );
  });

  const totalSkills = skills.length;

  const publishedSkills = skills.filter(
    (skill) => skill.status === "Published"
  ).length;

  const totalUsage = skills.reduce(
    (total, skill) => total + skill.usage,
    0
  );

  const competencyCount = new Set(
    skills.map((skill) => skill.competency)
  ).size;

  const pendingSkills = skills.filter(
    (skill) => skill.status !== "Published"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-500">
          Loading skills...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Competency Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Skills &amp; Competencies
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the platform skill taxonomy and competency
            framework that powers matching, assessment and
            skill-gap intelligence.
          </p>
        </header>

        {/* CORE METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total Skills"
            value={totalSkills}
          />

          <Metric
            label="Competencies"
            value={competencyCount}
          />

          <Metric
            label="Skill Usage"
            value={totalUsage}
          />

          <Metric
            label="Published Skills"
            value={publishedSkills}
          />
        </section>

        {/* ADMIN ATTENTION */}
        {pendingSkills > 0 && (
          <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Admin Attention
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {pendingSkills} skill
                  {pendingSkills !== 1 ? "s" : ""} require review
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review unpublished skills before they are used
                  in competency mapping and recommendation workflows.
                </p>
              </div>

              <button
                onClick={() => setSelectedCategory("All")}
                className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Review Taxonomy
              </button>
            </div>
          </section>
        )}

        {/* SKILL TAXONOMY */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Taxonomy
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Skill Taxonomy
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Skills mapped to competencies, industry demand
                and platform usage.
              </p>
            </div>

            <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              + Add Skill
            </button>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  selectedCategory === category
                    ? "bg-emerald-400 text-slate-950"
                    : "border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FILTER SUMMARY */}
          <div className="mt-5">
            <div className="inline-flex rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm text-slate-500">
              Showing{" "}
              <span className="mx-1 font-medium text-slate-300">
                {filteredSkills.length}
              </span>
              skills
            </div>
          </div>

          {/* SKILLS TABLE */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] text-xs uppercase tracking-wide text-slate-600">
                  <th className="px-4 py-4">
                    Skill
                  </th>

                  <th className="px-4 py-4">
                    Category
                  </th>

                  <th className="px-4 py-4">
                    Competency
                  </th>

                  <th className="px-4 py-4">
                    Usage
                  </th>

                  <th className="px-4 py-4">
                    Status
                  </th>

                  <th className="px-4 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
                  >
                    {/* SKILL */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-xs font-semibold text-emerald-400">
                          {skill.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>

                        <p className="font-medium text-slate-200">
                          {skill.name}
                        </p>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-5">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {skill.category}
                      </span>
                    </td>

                    {/* COMPETENCY */}
                    <td className="px-4 py-5 text-sm text-slate-300">
                      {skill.competency}
                    </td>

                    {/* USAGE */}
                    <td className="px-4 py-5">
                      <span className="font-medium text-emerald-400">
                        {skill.usage.toLocaleString()}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          skill.status === "Published"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {skill.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-5">
                      <button
                        onClick={() =>
                          setSelectedSkill(skill)
                        }
                        className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filteredSkills.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-sm text-slate-500">
              No skills found for this category.
            </div>
          )}
        </section>

        {/* SELECTED SKILL */}
        {selectedSkill && (
          <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">

            {/* DETAIL HEADER */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Skill Intelligence
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedSkill.name}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {selectedSkill.category} ·{" "}
                  {selectedSkill.competency}
                </p>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* SKILL DETAILS */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ReviewItem
                label="Category"
                value={selectedSkill.category}
              />

              <ReviewItem
                label="Competency"
                value={selectedSkill.competency}
                highlight
              />

              <ReviewItem
                label="Platform Usage"
                value={selectedSkill.usage.toLocaleString()}
              />

              <ReviewItem
                label="Status"
                value={selectedSkill.status}
                highlight
              />
            </div>

            {/* COMPETENCY MAPPING */}
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-300">
                Competency Mapping
              </p>

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-slate-950/60 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                    {selectedSkill.name}
                  </div>

                  <span className="text-slate-600">
                    →
                  </span>

                  <div className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
                    {selectedSkill.competency}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Edit Skill
              </button>

              <button className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                Manage Mapping
              </button>

              <button className="rounded-xl border border-red-400/30 px-5 py-3 text-sm text-red-400 transition hover:bg-red-400/10">
                Deactivate
              </button>
            </div>
          </section>
        )}

        {/* AI TAXONOMY INSIGHT */}
        <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            AI Taxonomy Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Competency intelligence connects skills to industry demand
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
            The competency framework connects individual skills
            with broader competency areas. This structure can power
            skill-gap analysis, learning recommendations and
            explainable opportunity matching across AyushBridge.
          </p>
        </section>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value.toLocaleString()}
      </p>

      <p className="mt-2 text-xs text-emerald-400">
        Platform intelligence
      </p>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-5">
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          highlight
            ? "text-emerald-400"
            : "text-slate-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}