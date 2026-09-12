"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

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

      setMessage(
        "Portfolio evidence added successfully."
      );

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
    (item) =>
      item.verification_status === "Verified"
  );

  const pendingEvidence = evidence.filter(
    (item) =>
      item.verification_status !== "Verified"
  );

  const projectCount = evidence.filter(
    (item) =>
      item.evidence_type === "Project"
  ).length;

  const certificateCount = evidence.filter(
    (item) =>
      item.evidence_type === "Certificate"
  ).length;

  const portfolioStrength = Math.min(
    100,
    78 + verifiedEvidence.length * 3
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Verified Digital Portfolio
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              My Portfolio
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Build evidence-backed competencies that strengthen your
              industry profile.
            </p>
          </div>

          <Link
            href="/student/dashboard"
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white md:block"
          >
            ← Dashboard
          </Link>

        </div>

        {/* Profile Overview */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center gap-4 lg:block lg:text-center">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl font-bold text-emerald-400 lg:mx-auto">
                AS
              </div>

              <div className="lg:mt-4">
                <h2 className="text-xl font-semibold">
                  Aarav Sharma
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  BAMS · Clinical Research Track
                </p>
              </div>

            </div>

            {/* Strength */}
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">

              <p className="text-xs text-slate-500">
                Portfolio Strength
              </p>

              <p className="mt-1 text-4xl font-bold text-emerald-400">
                {portfolioStrength}%
              </p>

              <p className="mt-1 text-xs font-medium text-emerald-400">
                Industry Ready
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${portfolioStrength}%`,
                  }}
                />
              </div>

            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-2">

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {defaultSkills.length}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Skills
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {projectCount || 3}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Projects
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {certificateCount || 5}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Certificates
                </p>
              </div>

            </div>

          </div>

          {/* Competency Profile */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Competency Intelligence
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Verified Competencies
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Skills supported by assessments, projects and credentials.
                </p>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                ✓ Verified Profile
              </span>

            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">

              {defaultSkills.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.evidence}
                      </p>
                    </div>

                    <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                      VERIFIED
                    </span>

                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Competency strength
                    </span>

                    <span className="text-sm font-bold text-white">
                      {item.score}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
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
        </div>

        {/* Add Evidence */}
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-7">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Build Evidence
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Add Portfolio Evidence
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Add projects, certificates, research or other achievements that
              demonstrate your competencies.
            </p>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Evidence Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Clinical Research Mini Project"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Evidence Type
              </label>

              <select
                value={evidenceType}
                onChange={(event) =>
                  setEvidenceType(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
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
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Skill / Competency
              </label>

              <select
                value={skill}
                onChange={(event) =>
                  setSkill(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
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
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Description
              </label>

              <input
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="What does this evidence demonstrate?"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Adding Evidence..."
                  : "+ Add Evidence"}
              </button>
            </div>

          </form>
        </div>

        {/* Evidence List */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Evidence Vault
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Evidence & Credentials
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Evidence that supports your verified competency profile.
              </p>
            </div>

            <div className="flex gap-2">

              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                {verifiedEvidence.length} Verified
              </span>

              <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
                {pendingEvidence.length} Pending
              </span>

            </div>

          </div>

          <div className="mt-6 space-y-3">

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-sm text-slate-500">
                Loading portfolio evidence...
              </div>
            ) : evidence.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  +
                </div>

                <p className="mt-4 text-sm font-medium">
                  No new evidence added yet.
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Add your first project, certificate or research achievement
                  above.
                </p>

              </div>
            ) : (
              evidence.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="flex gap-4">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          item.verification_status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {item.verification_status ===
                        "Verified"
                          ? "✓"
                          : "•"}
                      </div>

                      <div>

                        <p className="text-sm font-semibold">
                          {item.title}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                            {item.evidence_type}
                          </span>

                          <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                            {item.skill}
                          </span>

                        </div>

                        <p className="mt-3 text-xs leading-5 text-slate-400">
                          {item.description}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0 md:text-right">

                      <span
                        className={
                          item.verification_status === "Verified"
                            ? "rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
                            : "rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400"
                        }
                      >
                        {item.verification_status}
                      </span>

                      <p className="mt-2 text-[10px] text-slate-600">
                        {item.evidence_level}
                      </p>

                    </div>

                  </div>

                </div>
              ))
            )}

          </div>
        </div>

        {/* Verification Activity */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Verification
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Recent Activity
            </h2>

            <div className="mt-6 space-y-5">

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
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Portfolio Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Strengthen your evidence profile
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Add real projects, certifications and research evidence, then
              complete verification to increase confidence in your competency
              profile.
            </p>

            <div className="mt-6">

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Portfolio Strength
                </span>

                <span className="font-semibold text-emerald-400">
                  {portfolioStrength}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${portfolioStrength}%`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Verified Skill Loop */}
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-7">

          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Verified Skill Loop
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            From learning to verified capability
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-5">

            {[
              "Learn",
              "Assess",
              "Build Evidence",
              "Mentor Verify",
              "Portfolio",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >

                <p className="text-xs font-bold text-emerald-400">
                  0{index + 1}
                </p>

                <p className="mt-2 text-sm font-medium">
                  {step}
                </p>

                {index < 4 && (
                  <p className="mt-2 text-[10px] text-slate-600">
                    →
                  </p>
                )}

              </div>
            ))}

          </div>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-400">
            AyushBridge turns learning, assessment and real-world evidence
            into verified competencies that can strengthen explainable
            industry matching.
          </p>

        </div>

        {/* Mobile Dashboard */}
        <Link
          href="/student/dashboard"
          className="mt-6 block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white md:hidden"
        >
          ← Back to Dashboard
        </Link>

      </section>
    </main>
  );
}