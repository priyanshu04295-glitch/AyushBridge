"use client";

import { useEffect, useMemo, useState } from "react";

type ResearchProject = {
  id: number;
  title: string;
  type: string;
  status: string;
  industry_partner: string;
};

export default function FacultyResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadResearch() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/faculty/research"
        );

        if (response.ok) {
          setProjects(await response.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadResearch();
  }, []);

  const types = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(projects.map((project) => project.type))),
    ];
  }, [projects]);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.type === filter);

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const consultancyProjects = projects.filter(
    (project) => project.type === "Consultancy"
  ).length;

  const industryRequests = projects.length;

  function handleInterestSaved() {
    setShowForm(false);
    setMessage(
      "Research interest saved. The platform can use this profile for future industry collaboration matching."
    );

    setTimeout(() => {
      setMessage("");
    }, 4000);
  }

  function handleViewDetails(project: ResearchProject) {
    setMessage(
      `Collaboration details selected: ${project.title} with ${project.industry_partner}.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="min-h-screen">
        <header className="border-b border-slate-800 px-6 py-5 lg:px-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-emerald-400">
                Faculty Workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                Research & Consultancy
              </h1>

              <p className="mt-1 max-w-3xl text-sm text-slate-400">
                Connect faculty expertise with industry research,
                consultancy, training, innovation and live project
                opportunities.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              + Add Research Interest
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
              {message}
            </div>
          )}

          {showForm && (
            <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <p className="text-sm text-emerald-400">
                Faculty–Industry Matching Profile
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Research Interest
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add your preferred areas so relevant industry opportunities
                can be identified.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Research area"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  placeholder="Preferred industry / organization"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />

                <select className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-500">
                  <option>Research Project</option>
                  <option>Consultancy</option>
                  <option>Faculty Training</option>
                  <option>Guest Lecture</option>
                  <option>Live Project</option>
                </select>

                <input
                  placeholder="Expected collaboration duration"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleInterestSaved}
                  className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Save Interest
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium hover:bg-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            <Metric
              label="Active Research Projects"
              value={activeProjects}
              note="Currently active"
              noteClass="text-emerald-400"
            />

            <Metric
              label="Consultancy Opportunities"
              value={consultancyProjects}
              note="Industry-linked"
              noteClass="text-emerald-400"
            />

            <Metric
              label="Industry Requests"
              value={industryRequests}
              note="Research & collaboration"
              noteClass="text-amber-400"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Opportunity Type
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Filter faculty–industry opportunities by engagement type.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      filter === type
                        ? "bg-emerald-400 text-slate-950"
                        : "border border-white/10 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Research & Consultancy Opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Opportunities matched with your faculty expertise.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
                Loading research opportunities...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
                No research opportunities found for this category.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-emerald-900"
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              project.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : project.status === "Completed"
                                  ? "bg-slate-700 text-slate-300"
                                  : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Industry Partner:{" "}
                          <span className="text-slate-300">
                            {project.industry_partner}
                          </span>
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                            {project.type}
                          </span>

                          <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                            Faculty Collaboration
                          </span>

                          {project.status === "Active" && (
                            <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                              Open for Engagement
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(project)}
                        className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium hover:bg-slate-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="text-sm font-medium text-emerald-400">
              AI Collaboration Insight
            </p>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              Industry demand is increasing for expertise in clinical
              research methodology, evidence-based Ayurveda and healthcare
              data analysis. Your current expertise profile shows strong
              alignment with these emerging collaboration areas.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                "Research Collaboration",
                "Consultancy",
                "Faculty Training",
                "Live Projects",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-xl border border-emerald-900/40 bg-slate-950/50 p-4"
                >
                  <p className="text-xs text-emerald-400">
                    0{index + 1}
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold">
              Faculty–Industry Outcome Loop
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {[
                "Faculty Expertise",
                "Industry Need",
                "Research / Consultancy",
                "Knowledge Exchange",
                "Verified Outcome",
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
              Faculty collaboration data can feed institutional intelligence,
              helping institutions understand which expertise areas are
              generating industry engagement and where new partnerships
              should be developed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  note,
  noteClass,
}: {
  label: string;
  value: number;
  note: string;
  noteClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>

      <p className={`mt-2 text-xs ${noteClass}`}>
        {note}
      </p>
    </div>
  );
}