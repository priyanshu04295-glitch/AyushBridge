"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
      setMessage(
        "Unable to connect to AyushBridge API."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-7 text-white lg:px-10 lg:py-9">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Opportunity Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Opportunity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Define an industry opportunity and specify the
            competencies candidates should demonstrate.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* OPPORTUNITY DETAILS */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 sm:p-7">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                01 · Opportunity
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Opportunity Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the basic information about the opportunity.
              </p>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <Field label="Opportunity Title">
                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Clinical Research Intern"
                  className="input"
                />
              </Field>

              <Field label="Opportunity Type">
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
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
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
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
                  onChange={(e) =>
                    setMode(e.target.value)
                  }
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
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={6}
                  placeholder="Describe the project, responsibilities and expected outcomes..."
                  className="input resize-none"
                />
              </Field>
            </div>

          </section>

          {/* COMPETENCIES */}
          <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 sm:p-7">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  02 · Competency Requirements
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Required Competencies
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the competencies candidates should demonstrate.
                </p>
              </div>

              <span className="text-xs text-slate-600">
                {competencies.length} selected
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {competencyOptions.map((skill) => {
                const selected =
                  competencies.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      toggleCompetency(skill)
                    }
                    className={`group rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
                        : "border-white/[0.06] bg-slate-950/60 text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">

                      <span className="text-sm">
                        {skill}
                      </span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                          selected
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : "border-slate-700 text-transparent"
                        }`}
                      >
                        ✓
                      </span>

                    </div>
                  </button>
                );
              })}
            </div>

            {competencies.length === 0 && (
              <p className="mt-4 text-xs text-slate-600">
                Select at least one competency to continue.
              </p>
            )}

          </section>

          {/* MESSAGE */}
          {message && (
            <div
              className={`rounded-xl border p-4 ${
                created
                  ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
                  : "border-red-900/50 bg-red-950/20 text-red-300"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm">
                  {message}
                </p>

                {created && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/industry/opportunities"
                      )
                    }
                    className="shrink-0 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    View Opportunities →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/industry/opportunities"
                )
              }
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Opportunity"}
            </button>

          </div>

        </form>
      </div>

      {/* INPUT STYLES */}
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(51 65 85);
          background: rgb(2 6 23 / 0.7);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition: border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .input::placeholder {
          color: rgb(71 85 105);
        }

        .input:focus {
          border-color: rgb(52 211 153 / 0.5);
          box-shadow: 0 0 0 3px
            rgb(52 211 153 / 0.06);
        }

        select.input option {
          background: rgb(15 23 42);
          color: white;
        }
      `}</style>
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      {children}
    </label>
  );
}