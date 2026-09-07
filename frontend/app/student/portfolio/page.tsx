"use client";

import { FormEvent, useEffect, useState } from "react";

type Evidence = {
  id: number;
  student_id: number;
  title: string;
  evidence_type: string;
  skill: string;
  description: string;
  verification_status: string;
  verified_by: string;
  evidence_level: string;
};

type Skill = {
  name: string;
  score: number;
  evidence: string;
  verification: string;
};

const defaultSkills: Skill[] = [
  {
    name: "Clinical Research",
    score: 88,
    evidence: "Assessment + Research Project",
    verification: "Verified",
  },
  {
    name: "Research Methodology",
    score: 86,
    evidence: "Assessment + Certificate",
    verification: "Verified",
  },
  {
    name: "Literature Review",
    score: 84,
    evidence: "Assessment + Project",
    verification: "Verified",
  },
  {
    name: "Scientific Writing",
    score: 78,
    evidence: "Assessment + Certificate",
    verification: "Verified",
  },
];

export default function PortfolioPage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState("Project");
  const [skill, setSkill] = useState("Clinical Research");
  const [description, setDescription] = useState("");

  async function loadPortfolio() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/portfolio/1"
      );

      if (!response.ok) {
        throw new Error("Failed to load portfolio");
      }

      const data = await response.json();

      setEvidence(data);
    } catch {
      setError("Unable to connect to AyushBridge API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCurrent = true;

    async function loadInitialPortfolio() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/portfolio/1"
        );

        if (!response.ok) {
          throw new Error("Failed to load portfolio");
        }

        const data = await response.json();

        if (isCurrent) {
          setEvidence(data);
        }
      } catch {
        if (isCurrent) {
          setError("Unable to connect to AyushBridge API.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    void loadInitialPortfolio();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/portfolio/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: 1,
            title,
            evidence_type: evidenceType,
            skill,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to add evidence."
        );
      }

      setMessage("Portfolio evidence added successfully.");

      setTitle("");
      setEvidenceType("Project");
      setSkill("Clinical Research");
      setDescription("");

      await loadPortfolio();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add portfolio evidence."
      );
    } finally {
      setSaving(false);
    }
  }

  const verifiedEvidence = evidence.filter(
    (item) => item.verification_status === "Verified"
  );

  const pendingEvidence = evidence.filter(
    (item) => item.verification_status !== "Verified"
  );

  const projectCount = evidence.filter(
    (item) => item.evidence_type === "Project"
  ).length;

  const certificateCount = evidence.filter(
    (item) => item.evidence_type === "Certificate"
  ).length;

  const portfolioStrength = Math.min(
    100,
    78 + verifiedEvidence.length * 3
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="flex-1">

        {/* Header */}
        <header className="border-b border-slate-800 px-6 py-5 lg:px-10">
          <p className="text-sm text-emerald-400">
            Verified Digital Portfolio
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Aarav Sharma
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            BAMS · Student · Clinical Research Track
          </p>
        </header>

        <div className="p-6 lg:p-10">

          {/* Profile + Main Content */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-3xl font-bold text-emerald-400">
                AS
              </div>

              <div className="mt-5 text-center">
                <h2 className="text-xl font-semibold">
                  Aarav Sharma
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  BAMS · Clinical Research
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs text-slate-400">
                  Portfolio Strength
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  {portfolioStrength}%
                </p>

                <p className="mt-1 text-xs text-emerald-300">
                  Industry Ready
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Verified Skills
                  </span>

                  <span className="font-medium">
                    {defaultSkills.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Projects
                  </span>

                  <span className="font-medium">
                    {projectCount || 3}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Certifications
                  </span>

                  <span className="font-medium">
                    {certificateCount || 5}
                  </span>
                </div>

              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6">

              {/* Verified Competencies */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                  <div>
                    <h2 className="text-xl font-semibold">
                      Verified Competencies
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Skills supported by assessments, projects,
                      certificates or mentor verification.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    ✓ Verified Profile
                  </span>

                </div>

                <div className="mt-6 space-y-5">

                  {defaultSkills.map((item) => (
                    <div key={item.name}>

                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.evidence}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">

                          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
                            {item.verification}
                          </span>

                          <span className="text-sm font-semibold">
                            {item.score}%
                          </span>

                        </div>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${item.score}%`,
                          }}
                        />
                      </div>

                    </div>
                  ))}

                </div>
              </div>

              {/* Add Evidence */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

                <div className="mb-5">
                  <p className="text-sm font-semibold text-emerald-400">
                    Build Evidence
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Add Portfolio Evidence
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Add projects, certificates, assessments or
                    research evidence that supports your competencies.
                  </p>
                </div>

                {message && (
                  <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="grid gap-5 md:grid-cols-2"
                >

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Evidence Title
                    </label>

                    <input
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="Clinical Research Mini Project"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Evidence Type
                    </label>

                    <select
                      value={evidenceType}
                      onChange={(event) =>
                        setEvidenceType(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    >
                      <option>Project</option>
                      <option>Certificate</option>
                      <option>Assessment</option>
                      <option>Internship</option>
                      <option>Research</option>
                      <option>Publication</option>
                      <option>Workshop</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Skill / Competency
                    </label>

                    <select
                      value={skill}
                      onChange={(event) =>
                        setSkill(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    >
                      <option>Clinical Research</option>
                      <option>Research Methodology</option>
                      <option>Literature Review</option>
                      <option>Scientific Writing</option>
                      <option>Biostatistics</option>
                      <option>Clinical Data Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Description
                    </label>

                    <input
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Describe what this evidence demonstrates"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Adding Evidence..."
                        : "Add Evidence"}
                    </button>
                  </div>

                </form>
              </div>

              {/* Evidence & Credentials */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Evidence & Credentials
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Evidence that strengthens your verified competency profile.
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs">
                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
                      {verifiedEvidence.length} Verified
                    </span>

                    <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-amber-400">
                      {pendingEvidence.length} Pending
                    </span>
                  </div>

                </div>

                <div className="mt-5 space-y-3">

                  {loading ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
                      Loading portfolio evidence...
                    </div>
                  ) : evidence.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">

                      <p className="text-sm font-medium text-slate-300">
                        No new evidence added yet.
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Add your first project, certificate or research
                        achievement above.
                      </p>

                    </div>
                  ) : (
                    evidence.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                          <div className="flex items-start gap-3">

                            <span
                              className={
                                item.verification_status ===
                                "Verified"
                                  ? "mt-1 text-emerald-400"
                                  : "mt-1 text-amber-400"
                              }
                            >
                              {item.verification_status ===
                              "Verified"
                                ? "✓"
                                : "•"}
                            </span>

                            <div>
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {item.skill} · {item.evidence_type}
                              </p>

                              <p className="mt-2 text-xs leading-5 text-slate-400">
                                {item.description}
                              </p>
                            </div>

                          </div>

                          <div className="shrink-0">

                            <span
                              className={
                                item.verification_status ===
                                "Verified"
                                  ? "rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
                                  : "rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400"
                              }
                            >
                              {item.verification_status}
                            </span>

                            <p className="mt-2 text-right text-xs text-slate-600">
                              {item.evidence_level}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))
                  )}

                </div>
              </div>

              {/* Existing Verification Activity */}
              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                  <h2 className="text-lg font-semibold">
                    Recent Verification Activity
                  </h2>

                  <div className="mt-5 space-y-5">

                    <div className="flex gap-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />

                      <div>
                        <p className="text-sm">
                          Research Methodology verified
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Faculty assessment · Recently
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />

                      <div>
                        <p className="text-sm">
                          Clinical Research evidence added
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Student project · Recently
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />

                      <div>
                        <p className="text-sm">
                          Biostatistics verification pending
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Mentor review required
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Portfolio Progress */}
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">

                  <p className="text-sm font-medium text-emerald-400">
                    Portfolio Progress
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Your profile is {portfolioStrength}% complete
                  </h2>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${portfolioStrength}%`,
                      }}
                    />
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Add project evidence and certificates, then
                    complete mentor verification to strengthen your
                    profile for industry matching.
                  </p>

                </div>

              </div>

              {/* Verified Skill Loop */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

                <p className="text-sm font-semibold text-emerald-400">
                  Verified Skill Loop
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-5">

                  {[
                    "Learn",
                    "Assess",
                    "Build Evidence",
                    "Mentor Verify",
                    "Portfolio",
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

                <p className="mt-5 text-sm leading-6 text-slate-300">
                  AyushBridge converts learning and real-world
                  evidence into verified competencies that can be
                  used for explainable industry matching.
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
