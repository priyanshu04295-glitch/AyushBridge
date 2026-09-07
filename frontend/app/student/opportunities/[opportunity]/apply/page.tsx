"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  match_score: number;
};

export default function ApplyPage({
  params,
}: {
  params: Promise<{ opportunity: string }>;
}) {
  const { opportunity } = use(params);

  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/opportunities/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load opportunity");
        }

        return response.json();
      })
      .then((opportunities: Opportunity[]) => {
        const selected = opportunities.find(
          (item) => item.id === Number(opportunity)
        );

        if (!selected) {
          throw new Error("Opportunity not found");
        }

        setData(selected);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load this opportunity.");
        setLoading(false);
      });
  }, [opportunity]);

  const submitApplication = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/applications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: 1,
            opportunity_id: Number(opportunity),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to submit application.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setError("Unable to connect to AyushBridge API.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading application...
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/student/opportunities"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <Link href="/student/dashboard" className="text-xl font-bold">
            <span className="text-emerald-400">Ayush</span>Bridge
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          {!submitted ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
                ✓
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Application Ready
              </p>

              <h1 className="mt-3 text-3xl font-bold">{data.title}</h1>

              <p className="mt-3 text-slate-400">{data.organization}</p>

              <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-left">
                <p className="text-sm text-slate-500">Applicant</p>
                <p className="mt-1 font-semibold">Aarav Sharma</p>

                <p className="mt-5 text-sm text-slate-500">
                  Live Match Score
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {data.match_score}%
                </p>
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-400">
                Your profile, competency evidence and skill-match information
                will be submitted with this application.
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={submitApplication}
                disabled={submitting}
                className="mt-8 w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting Application..."
                  : "Confirm & Submit Application"}
              </button>

              <Link
                href="/student/opportunities"
                className="mt-5 block text-sm text-slate-400 hover:text-white"
              >
                ← Back to Opportunities
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-400">
                ✓
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Application Submitted
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Application Successful
              </h1>

              <p className="mt-3 text-slate-400">
                Your application for{" "}
                <span className="font-semibold text-white">
                  {data.title}
                </span>{" "}
                has been submitted to {data.organization}.
              </p>

              <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-left">
                <p className="text-sm text-slate-500">Application Status</p>

                <p className="mt-1 font-semibold text-emerald-400">
                  Submitted
                </p>

                <p className="mt-5 text-sm text-slate-500">Match Score</p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {data.match_score}%
                </p>

                <p className="mt-5 text-sm text-slate-500">Next Stage</p>

                <p className="mt-1 font-semibold text-white">
                  Industry Review
                </p>
              </div>

              <Link
                href="/student/applications"
                className="mt-8 block w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Track My Application
              </Link>

              <Link
                href="/student/opportunities"
                className="mt-5 block text-sm text-slate-400 hover:text-white"
              >
                ← Back to Opportunities
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}