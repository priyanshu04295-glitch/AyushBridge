import Link from "next/link";

const features = [
  {
    title: "Skill Intelligence",
    description:
      "Assess competencies, identify skill gaps, and understand what each role requires.",
    icon: "◈",
  },
  {
    title: "Smart Matching",
    description:
      "Match students with internships, jobs, projects, research and training opportunities.",
    icon: "⌁",
  },
  {
    title: "Verified Portfolio",
    description:
      "Build trusted profiles using assessments, projects, certificates and mentor verification.",
    icon: "✓",
  },
  {
    title: "Institutional Insights",
    description:
      "Help institutions understand industry demand, skill gaps and employability trends.",
    icon: "▥",
  },
];

const roles = [
  "Student",
  "Industry",
  "Faculty",
  "Institution",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              Ayush<span className="text-emerald-400">Bridge</span>
            </div>
            <div className="text-xs text-slate-400">
              Academia × Industry
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Platform
            </a>
            <a href="#roles" className="hover:text-white">
              Ecosystem
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              AI-Powered Competency Intelligence
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Bridge
              <span className="text-emerald-400"> Skills </span>
              to
              <span className="text-emerald-400"> Opportunities.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              AyushBridge connects academia and industry through skill
              assessment, competency mapping, intelligent opportunity
              matching, learning recommendations and verified outcomes.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-emerald-500 px-7 py-3.5 text-center font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Explore Opportunities →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-center font-semibold text-white hover:bg-white/10"
              >
                Assess My Skills
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <span>✓ Skill Gap Analysis</span>
              <span>✓ Explainable Matching</span>
              <span>✓ Verified Evidence</span>
            </div>
          </div>

          {/* Intelligence Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Student Competency</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Career Intelligence
                </h2>
              </div>

              <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                AI Analysis
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">Overall readiness</p>
                  <p className="mt-1 text-4xl font-bold">82%</p>
                </div>

                <p className="text-sm text-emerald-400">+12% this month</p>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[82%] rounded-full bg-emerald-400" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Research Methodology</span>
                  <span className="text-emerald-400">Strong</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Biostatistics</span>
                  <span className="text-amber-400">Skill Gap</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Clinical Research</span>
                  <span className="text-emerald-400">Strong</span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-200">
              AI recommendation: Complete a Biostatistics learning module to
              improve your Clinical Research Internship match.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              One connected ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From industry requirements to verified skills.
            </h2>

            <p className="mt-4 text-slate-400">
              AyushBridge creates a continuous loop between competency
              requirements, student development and real-world opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="text-3xl text-emerald-400">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="roles" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Connected ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              One platform. Four key stakeholders.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Every participant gets a role-specific experience while
              contributing to the same competency intelligence ecosystem.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {roles.map((role, index) => (
              <div
                key={role}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-lg font-bold text-emerald-400">
                  {index + 1}
                </div>

                <h3 className="mt-4 font-semibold">{role}</h3>

                <p className="mt-2 text-sm text-slate-400">
                  Role-based tools and insights
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>AyushBridge — AI-Powered Competency Intelligence Platform</p>
          <p>Smart India Hackathon 2026</p>
        </div>
      </footer>
    </main>
  );
}