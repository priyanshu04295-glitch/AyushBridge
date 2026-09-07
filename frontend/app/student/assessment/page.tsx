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
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Competency Assessment
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Measure your career-ready skills.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Answer the questions below to help AyushBridge understand your
            competency level and identify areas where additional learning may
            improve your opportunity matches.
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Assessment progress</span>

            <span className="text-emerald-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
              {question.competency}
            </span>

            <span className="text-xs text-slate-500">
              Difficulty: Intermediate
            </span>
          </div>

          <h2 className="mt-6 text-xl font-semibold leading-8 md:text-2xl">
            {question.question}
          </h2>

          <div className="mt-7 space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(index)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  selected === index
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm ${
                    selected === index
                      ? "border-emerald-400 bg-emerald-400 text-slate-950"
                      : "border-white/10 text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span
                  className={
                    selected === index
                      ? "font-medium text-white"
                      : "text-slate-300"
                  }
                >
                  {option}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            <p className="text-xs text-slate-500">
              Your responses contribute to your competency profile.
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
                ? "Submitting..."
                : isLast
                  ? "Submit Assessment"
                  : "Next Question →"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-medium">Skill Mapping</p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Questions are mapped to specific competencies.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-medium">Gap Detection</p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Results help identify skills that need development.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-medium">Recommendations</p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Assessment results can drive personalized learning paths.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
