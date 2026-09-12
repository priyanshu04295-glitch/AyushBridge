"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    competency: "Research Methodology",
    question:
      "Which study design is generally most suitable for evaluating the effectiveness of an intervention?",
    options: [
      "Randomized controlled trial",
      "Case report",
      "Cross-sectional study",
      "Case series",
    ],
  },
  {
    competency: "Biostatistics",
    question:
      "Which measure is commonly used to describe the average value of a dataset?",
    options: ["Mean", "Range", "Variance", "Standard deviation"],
  },
  {
    competency: "Clinical Research",
    question:
      "What is the primary purpose of informed consent in clinical research?",
    options: [
      "Protect participant autonomy",
      "Increase sample size",
      "Reduce research cost",
      "Replace ethical review",
    ],
  },
];

export default function AssessmentPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const isLast = current === questions.length - 1;

  async function handleNext() {
    if (selected === null || submitting) return;

    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;
    setAnswers(updatedAnswers);

    if (!isLast) {
      setCurrent(current + 1);
      setSelected(null);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/students/1/assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: updatedAnswers.map((answer, index) => ({
              competency: questions[index].competency,
              question: questions[index].question,
              selected_answer: questions[index].options[answer],
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Assessment submission failed");
      }

      const result = await response.json();

      console.log("Assessment result:", result);

      router.push("/student/results");
    } catch (error) {
      console.error("Assessment submission error:", error);

      alert(
        "Unable to submit the assessment. Please make sure the backend server is running."
      );

      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Student Intelligence
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Skill Assessment
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Evaluate your competencies and strengthen your career readiness.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/student/dashboard")}
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white md:block"
          >
            ← Dashboard
          </button>
        </div>

        {/* Progress */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Assessment Progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Question {current + 1} of {questions.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-emerald-400">
                {Math.round(progress)}%
              </p>

              <p className="text-xs text-slate-500">
                Complete
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex gap-2">
            {questions.map((item, index) => (
              <div
                key={item.competency}
                className={`h-1 flex-1 rounded-full ${
                  index <= current
                    ? "bg-emerald-400"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Assessment Area */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">

          {/* Question Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

            {/* Question Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                {question.competency}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                Intermediate
              </span>
            </div>

            {/* Question */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Question {current + 1}
              </p>

              <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-9 md:text-3xl">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="mt-8 space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    selected === index
                      ? "border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_25px_rgba(52,211,153,0.08)]"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                      selected === index
                        ? "border-emerald-400 bg-emerald-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-400 group-hover:border-white/20 group-hover:text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span
                    className={`text-sm md:text-base ${
                      selected === index
                        ? "font-medium text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {option}
                  </span>

                  {selected === index && (
                    <span className="ml-auto text-emerald-400">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Your response contributes to your competency profile.
              </p>

              <button
                type="button"
                onClick={handleNext}
                disabled={selected === null || submitting}
                className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
                  selected === null || submitting
                    ? "cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
              >
                {submitting
                  ? "Analyzing Results..."
                  : isLast
                    ? "Submit Assessment →"
                    : "Next Question →"}
              </button>
            </div>
          </div>

          {/* Intelligence Panel */}
          <aside className="space-y-4">

            {/* Assessment Overview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
                  ◎
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Competency Intelligence
                  </p>

                  <p className="text-xs text-slate-500">
                    Assessment overview
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Questions
                    </span>

                    <span className="text-slate-300">
                      {questions.length}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Answered
                    </span>

                    <span className="text-emerald-400">
                      {current + (selected !== null ? 1 : 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Current competency
                    </span>

                    <span className="max-w-[130px] text-right text-slate-300">
                      {question.competency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold">
                What happens next?
              </p>

              <div className="mt-5 space-y-4">

                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                  <div>
                    <p className="text-xs font-medium text-white">
                      Competency Analysis
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your responses are evaluated against competency areas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                  <div>
                    <p className="text-xs font-medium text-white">
                      Gap Detection
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Development areas are identified from your results.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                  <div>
                    <p className="text-xs font-medium text-white">
                      Personalized Path
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Learning recommendations can be generated from your gaps.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Privacy */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-xs font-semibold text-slate-300">
                Assessment Privacy
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Your responses are used to build your competency profile and
                improve opportunity matching.
              </p>
            </div>

          </aside>
        </div>

        {/* Mobile Dashboard Button */}
        <button
          type="button"
          onClick={() => router.push("/student/dashboard")}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] md:hidden"
        >
          ← Back to Dashboard
        </button>

      </section>
    </main>
  );
}