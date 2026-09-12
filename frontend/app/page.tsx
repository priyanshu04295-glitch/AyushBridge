"use client";

import Link from "next/link";

const platformFeatures = [
  {
    number: "01",
    title: "Competency Mapping",
    description:
      "Translate evolving industry requirements into measurable competencies and skills.",
  },
  {
    number: "02",
    title: "Skill Gap Intelligence",
    description:
      "Identify exactly where students need development using assessment-driven intelligence.",
  },
  {
    number: "03",
    title: "Explainable Matching",
    description:
      "Match students with opportunities using transparent competency, evidence and eligibility signals.",
  },
  {
    number: "04",
    title: "Verified Skills",
    description:
      "Build trusted profiles through assessments, projects, certificates and industry verification.",
  },
];

const ecosystem = [
  {
    role: "Students",
    title: "Know what to learn. Know where you fit.",
    description:
      "Build competency profiles, discover skill gaps, follow learning paths and find opportunities aligned with your capabilities.",
    tag: "Career Intelligence",
  },
  {
    role: "Industry",
    title: "Find talent by competency, not just resumes.",
    description:
      "Define required competencies, discover suitable candidates and understand why each candidate matches.",
    tag: "Talent Intelligence",
  },
  {
    role: "Faculty",
    title: "Turn expertise into industry collaboration.",
    description:
      "Connect academic expertise with research, mentorship, training, live projects and industry needs.",
    tag: "Academic Collaboration",
  },
  {
    role: "Institutions",
    title: "Turn skill data into institutional action.",
    description:
      "Understand competency gaps, industry demand and training priorities to improve employability outcomes.",
    tag: "Institutional Intelligence",
  },
];

const flow = [
  "Industry Demand",
  "Competency Mapping",
  "Student Assessment",
  "Skill Gap",
  "Learning",
  "Opportunity Match",
  "Verified Outcome",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      {/* NAVBAR */}
      <header className="relative z-20 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <span className="text-lg font-bold text-emerald-400">
                A
              </span>
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                AyushBridge
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Competency Intelligence Platform
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a
              href="#platform"
              className="transition hover:text-white"
            >
              Platform
            </a>

            <a
              href="#ecosystem"
              className="transition hover:text-white"
            >
              Ecosystem
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-400/15"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Academia × Industry × Intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Bridge the gap between{" "}
              <span className="text-emerald-400">
                skills
              </span>{" "}
              and opportunity.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              AyushBridge is an AI-powered competency intelligence
              platform that connects industry requirements,
              student capabilities, learning and verified
              opportunities into one continuous ecosystem.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Enter AyushBridge
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
              >
                See how it works
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.06] pt-7">
              <div>
                <div className="text-xl font-bold">
                  4
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Ecosystem roles
                </div>
              </div>

              <div>
                <div className="text-xl font-bold">
                  7
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Intelligence stages
                </div>
              </div>

              <div>
                <div className="text-xl font-bold">
                  1
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Connected ecosystem
                </div>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-emerald-400/5 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Competency Intelligence
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Talent → Opportunity
                  </h2>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  LIVE MODEL
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/[0.07] bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Industry Requirement
                    </span>
                    <span className="text-xs text-emerald-400">
                      92%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[92%] rounded-full bg-emerald-400" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Clinical Research",
                      "Research Methodology",
                      "Biostatistics",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center py-1 text-emerald-400">
                  ↓
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      Aarav Sharma
                    </span>
                    <span className="text-lg font-bold text-emerald-400">
                      82%
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Clinical Research Intern
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-slate-900 p-3">
                      <div className="text-sm font-semibold text-emerald-400">
                        92%
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        Competency
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3">
                      <div className="text-sm font-semibold text-cyan-400">
                        78%
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        Evidence
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3">
                      <div className="text-sm font-semibold text-white">
                        100%
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        Eligible
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-4">
                  <div className="text-xs font-semibold text-amber-300">
                    PRIORITY GAP
                  </div>

                  <div className="mt-1 text-sm text-slate-300">
                    Biostatistics
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Recommended learning pathway generated from
                    competency intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section
        id="platform"
        className="relative z-10 border-y border-white/[0.06] bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              The Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than a job or internship portal.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              AyushBridge builds a continuous intelligence loop between
              what industry needs and what academia develops.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature) => (
              <div
                key={feature.number}
                className="bg-slate-950 p-7 transition hover:bg-slate-900"
              >
                <div className="text-xs font-semibold text-emerald-400">
                  {feature.number}
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative z-10"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              One continuous competency loop.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              From industry demand to verified outcomes and back into
              institutional decision-making.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-7">
            {flow.map((item, index) => (
              <div
                key={item}
                className="relative rounded-xl border border-white/[0.07] bg-slate-900/60 p-5 text-center"
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400">
                  {index + 1}
                </div>

                <p className="mt-3 text-xs font-medium leading-5 text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section
        id="ecosystem"
        className="relative z-10 border-y border-white/[0.06] bg-slate-900/25"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                One platform. Four perspectives.
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Built for the entire ecosystem.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Each stakeholder sees the intelligence relevant to their
              role while contributing to the same connected ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {ecosystem.map((item, index) => (
              <div
                key={item.role}
                className="group rounded-2xl border border-white/[0.07] bg-slate-950 p-7 transition hover:-translate-y-1 hover:border-emerald-400/20"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    {item.tag}
                  </span>

                  <span className="text-xs text-slate-700">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  {item.role}
                </h3>

                <h4 className="mt-2 text-base font-medium text-slate-300">
                  {item.title}
                </h4>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Why AyushBridge
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Intelligence that connects the whole journey.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                Instead of treating assessment, learning, internships,
                placements and institutional planning as separate
                systems, AyushBridge connects them through competency
                intelligence.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [
                  "01",
                  "Competency Intelligence",
                  "Convert industry requirements into measurable skill signals.",
                ],
                [
                  "02",
                  "Explainable Matching",
                  "Show why a student matches an opportunity and where gaps remain.",
                ],
                [
                  "03",
                  "Verified Skill Loop",
                  "Turn evidence and industry validation into trusted competency signals.",
                ],
                [
                  "04",
                  "Institutional Intelligence",
                  "Transform aggregate skill and demand data into training decisions.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6"
                >
                  <span className="text-xs font-bold text-emerald-400">
                    {number}
                  </span>

                  <h3 className="mt-5 font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AYUSH SHOWCASE */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-400/[0.08] via-slate-900 to-slate-950 p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Demonstration ecosystem
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Demonstrated through the AYUSH ecosystem.
                </h2>

                <p className="mt-5 max-w-2xl leading-7 text-slate-400">
                  AyushBridge is designed as a generic academia–industry
                  competency intelligence platform, demonstrated through
                  AYUSH-focused skills, research, healthcare and industry
                  opportunities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {[
                  "Clinical Research",
                  "Biostatistics",
                  "Drug Safety",
                  "Healthcare Data",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="rounded-xl border border-white/[0.07] bg-slate-950/70 px-4 py-3 text-center text-xs text-slate-300"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Start the bridge
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Turn skills into meaningful opportunities.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Connect academia and industry through measurable competencies,
            explainable intelligence and verified outcomes.
          </p>

          <Link
            href="/login"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Enter AyushBridge
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            © 2026 AyushBridge
          </div>

          <div>
            Academia–Industry Competency Intelligence Platform
          </div>
        </div>
      </footer>
    </main>
  );
}