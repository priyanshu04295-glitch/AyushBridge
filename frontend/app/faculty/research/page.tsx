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
      } catch {
        setMessage("Unable to load research opportunities.");
      } finally {
        setLoading(false);
      }
    }

    loadResearch();
  }, []);

  const types = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(projects.map((project) => project.type))
      ),
    ];
  }, [projects]);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (project) => project.type === filter
        );

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
      "Research interest saved. Your profile can now be used for future collaboration matching."
    );

    setTimeout(() => {
      setMessage("");
    }, 4000);
  }

  function handleViewDetails(project: ResearchProject) {
    setMessage(
      `Collaboration selected: ${project.title} with ${project.industry_partner}.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Faculty Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Research & Consultancy
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Connect faculty expertise with research, consultancy,
              training and industry collaboration opportunities.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:w-auto"
          >
            + Add Research Interest
          </button>
        </header>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {/* RESEARCH INTEREST FORM */}
        {showForm && (
          <section className="mb-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Matching Profile
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Add Research Interest
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Define your preferred collaboration areas.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Research area"
              />

              <Input
                placeholder="Preferred industry / organization"
              />

              <select className="rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-emerald-400">
                <option>Research Project</option>
                <option>Consultancy</option>
                <option>Faculty Training</option>
                <option>Guest Lecture</option>
                <option>Live Project</option>
              </select>

              <Input
                placeholder="Expected collaboration duration"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleInterestSaved}
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Save Interest
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* METRICS */}
        <section className="grid gap-3 sm:grid-cols-3">
          <Metric
            label="Active Research"
            value={activeProjects}
            note="Currently active"
          />

          <Metric
            label="Consultancy"
            value={consultancyProjects}
            note="Industry-linked"
          />

          <Metric
            label="Industry Requests"
            value={industryRequests}
            note="Research & collaboration"
            amber
          />
        </section>

        {/* FILTER */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Opportunities
              </p>

              <h2 className="mt-1 text-base font-semibold">
                Engagement Type
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    filter === type
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/[0.07] bg-slate-950 text-slate-500 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Matched Opportunities
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Research & Consultancy Opportunities
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {filteredProjects.length} shown
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-7">
              <p className="text-sm text-slate-500">
                Loading research opportunities...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
              <p className="text-sm text-slate-500">
                No research opportunities found for this category.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 transition hover:border-white/[0.12]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {project.title}
                        </h3>

                        <StatusBadge status={project.status} />
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Industry Partner:{" "}
                        <span className="text-slate-300">
                          {project.industry_partner}
                        </span>
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                          {project.type}
                        </span>

                        {project.status === "Active" && (
                          <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-400">
                            Open for Engagement
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(project)}
                      className="w-full rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white lg:w-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI COLLABORATION INSIGHT */}
        <section className="mt-8 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
              AI Collaboration Insight
            </p>

            <h2 className="text-xl font-semibold">
              Where Faculty Expertise Meets Industry Demand
            </h2>

            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              AyushBridge can identify collaboration areas by comparing
              faculty expertise with emerging industry requirements,
              helping surface relevant research, consultancy, training
              and live project opportunities.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Research Collaboration",
              "Consultancy",
              "Faculty Training",
              "Live Projects",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-4"
              >
                <p className="text-xs font-semibold text-emerald-400">
                  0{index + 1}
                </p>

                <p className="mt-2 text-sm font-medium text-slate-200">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* OUTCOME LOOP */}
        <section className="mt-8 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Collaboration Intelligence
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Faculty–Industry Outcome Loop
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Collaboration outcomes create a feedback loop that helps
              institutions understand industry engagement and strengthen
              future academic–industry partnerships.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Faculty Expertise",
              "Industry Need",
              "Research / Consultancy",
              "Knowledge Exchange",
              "Verified Outcome",
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

function Input({
  placeholder,
}: {
  placeholder: string;
}) {
  return (
    <input
      placeholder={placeholder}
      className="rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400"
    />
  );
}

function Metric({
  label,
  value,
  note,
  amber = false,
}: {
  label: string;
  value: number;
  note: string;
  amber?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p
        className={`mt-2 text-xs ${
          amber ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const className =
    status === "Active"
      ? "bg-emerald-400/10 text-emerald-400"
      : status === "Completed"
        ? "bg-slate-800 text-slate-400"
        : "bg-amber-400/10 text-amber-300";

  return (
    <span
      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${className}`}
    >
      {status}
    </span>
  );
}