"use client";

import { FormEvent, useState } from "react";

const competencyOptions = [
  "Clinical Research",
  "Research Methodology",
  "Biostatistics",
  "Scientific Writing",
  "Ayurvedic Pharmacology",
  "Healthcare Data Analysis",
  "Clinical Data Management",
  "Quality Control",
];

export default function CreateOpportunityPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Internship");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("6 months");
  const [mode, setMode] = useState("Hybrid");
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleCompetency(skill: string) {
    setCompetencies((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title || !description || competencies.length === 0) {
      setMessage(
        "Please enter the opportunity details and select at least one competency."
      );
      setCreated(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/industry/create-opportunity/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            opportunity_type: type,
            description,
            duration,
            mode,
            competencies,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create opportunity");
      }

      const data = await response.json();

      setCreated(true);
      setMessage(data.message);
    } catch {
      setCreated(false);
      setMessage("Unable to connect to AyushBridge API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">
            Industry Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Create Opportunity
          </h1>

          <p className="mt-2 text-slate-400">
            Define an industry opportunity using competency-based
            requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Opportunity Details
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Opportunity Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Clinical Research Intern"
                  className="input"
                />
              </Field>

              <Field label="Opportunity Type">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input"
                >
                  <option>Internship</option>
                  <option>Research Project</option>
                  <option>Apprenticeship</option>
                  <option>Consultancy</option>
                  <option>Job</option>
                </select>
              </Field>

              <Field label="Duration">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input"
                >
                  <option>3 months</option>
                  <option>4 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </Field>

              <Field label="Mode">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="input"
                >
                  <option>Hybrid</option>
                  <option>On-site</option>
                  <option>Remote</option>
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the project, responsibilities and expected outcomes..."
                  className="input"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Required Competencies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the competencies candidates should demonstrate.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {competencyOptions.map((skill) => {
                const selected = competencies.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleCompetency(skill)}
                    className={`rounded-xl border p-4 text-left text-sm transition ${
                      selected
                        ? "border-emerald-500 bg-emerald-950/50 text-emerald-300"
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{skill}</span>

                      {selected && (
                        <span className="text-emerald-400">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
            <p className="text-sm font-medium text-emerald-400">
              AI Competency Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Requirements → Competencies → Matching
            </h2>

            <p className="mt-3 leading-7 text-slate-300">
              AyushBridge converts opportunity requirements into measurable
              competencies. These competencies are then used to identify
              candidates with relevant verified evidence and explain their
              match.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoCard title="1" text="Define Industry Need" />
              <InfoCard title="2" text="Map Competencies" />
              <InfoCard title="3" text="Match Verified Talent" />
            </div>
          </section>

          {message && (
            <div
              className={`rounded-xl border p-4 ${
                created
                  ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                  : "border-red-900 bg-red-950/30 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="text-sm font-bold text-emerald-400">{title}</div>
      <p className="mt-2 text-sm text-slate-300">{text}</p>
    </div>
  );
}