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
    ...Array.from(new Set(skills.map((skill) => skill.category))),
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading skills...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm text-emerald-400">
              Competency Intelligence
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Skills &amp; Competencies
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage the platform skill taxonomy and competency framework.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              Platform Administrator
            </p>

            <p className="text-xs text-slate-400">
              Taxonomy Management
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["Total Skills", totalSkills],
            ["Competencies", competencyCount],
            ["Skill Usage", totalUsage],
            ["Published Skills", publishedSkills],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">{label}</p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Skill Taxonomy
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Skills mapped to competencies, industry demand and platform
                usage.
              </p>
            </div>

            <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
              + Add Skill
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  selectedCategory === category
                    ? "bg-emerald-400 text-slate-950"
                    : "border border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-4">Skill</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Competency</th>
                  <th className="px-4 py-4">Usage</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b border-white/5 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-5">
                      <p className="font-medium">{skill.name}</p>
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-400">
                      {skill.category}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-300">
                      {skill.competency}
                    </td>

                    <td className="px-4 py-5">
                      <span className="font-medium text-emerald-400">
                        {skill.usage.toLocaleString()}
                      </span>
                    </td>

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

                    <td className="px-4 py-5">
                      <button
                        onClick={() => setSelectedSkill(skill)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSkills.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No skills found for this category.
            </div>
          )}
        </section>

        {selectedSkill && (
          <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-400">
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
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Category
                </p>

                <p className="mt-2 font-semibold">
                  {selectedSkill.category}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Competency
                </p>

                <p className="mt-2 font-semibold text-emerald-400">
                  {selectedSkill.competency}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Platform Usage
                </p>

                <p className="mt-2 font-semibold">
                  {selectedSkill.usage.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs text-slate-500">
                  Status
                </p>

                <p className="mt-2 font-semibold text-emerald-400">
                  {selectedSkill.status}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium">
                Competency Mapping
              </p>

              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-slate-300">
                  {selectedSkill.name}
                </p>

                <div className="my-3 h-px bg-white/10" />

                <p className="text-sm text-emerald-300">
                  {selectedSkill.competency}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
                Edit Skill
              </button>

              <button className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800">
                Manage Mapping
              </button>

              <button className="rounded-xl border border-red-400/30 px-5 py-3 text-sm text-red-400 hover:bg-red-400/10">
                Deactivate
              </button>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <p className="text-sm font-medium text-emerald-400">
            AI Taxonomy Insight
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Competency intelligence connects skills to industry demand
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            The competency framework connects individual skills with broader
            competency areas. This structure can later power skill-gap
            analysis, learning recommendations and explainable opportunity
            matching.
          </p>
        </section>
      </div>
    </main>
  );
}