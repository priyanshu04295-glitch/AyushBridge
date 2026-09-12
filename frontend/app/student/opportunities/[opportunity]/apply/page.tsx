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
        setError(
          result.message || "Unable to submit application."
        );
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
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-800" />
            <div className="mt-5 h-10 w-2/3 rounded bg-slate-800" />
            <div className="mt-8 h-96 rounded-3xl bg-slate-900" />
          </div>
        </section>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

          <Link
            href="/student/opportunities"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              !
            </div>

            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          </div>

        </section>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">

          <Link
            href={`/student/opportunities/${data.id}`}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Opportunity
          </Link>

          <Link
            href="/student/dashboard"
            className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white md:block"
          >
            Dashboard
          </Link>

        </div>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="mt-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Application Centre
              </p>

              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                Review your application
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review the opportunity and your competency match before
                submitting your application.
              </p>

            </div>

            {/* Main Grid */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* Application Card */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

                {/* Opportunity */}
                <div className="border-b border-white/10 pb-7">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Applying for
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold">
                    {data.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {data.organization}
                  </p>

                </div>

                {/* Applicant */}
                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Applicant
                  </p>

                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-lg font-bold text-emerald-400">
                      AS
                    </div>

                    <div>
                      <p className="font-semibold">
                        Aarav Sharma
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        BAMS · Clinical Research Intern
                      </p>
                    </div>

                  </div>

                </div>

                {/* Match */}
                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Your Opportunity Fit
                  </p>

                  <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm font-semibold">
                          Competency Match
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Based on your current competency profile.
                        </p>
                      </div>

                      <p className="text-3xl font-bold text-emerald-400">
                        {data.match_score}%
                      </p>

                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${data.match_score}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

                {/* Submission Information */}
                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    What will be submitted
                  </p>

                  <div className="mt-4 space-y-3">

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <span className="text-emerald-400">
                        ✓
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Competency Profile
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Your assessed skills and competency results.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <span className="text-emerald-400">
                        ✓
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Verified Evidence
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Evidence associated with your portfolio.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <span className="text-emerald-400">
                        ✓
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Match Information
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Your opportunity compatibility score.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={submitApplication}
                  disabled={submitting}
                  className="mt-8 w-full rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Submitting Application..."
                    : "Confirm & Submit Application →"}
                </button>

                <Link
                  href={`/student/opportunities/${data.id}`}
                  className="mt-5 block text-center text-sm text-slate-500 transition hover:text-white"
                >
                  Review Opportunity Again
                </Link>

              </div>

              {/* Intelligence Sidebar */}
              <aside className="space-y-4">

                {/* Application Status */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Application Ready
                      </p>

                      <p className="text-xs text-slate-500">
                        Profile information available
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Applicant
                      </span>

                      <span className="text-slate-300">
                        Aarav Sharma
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Match
                      </span>

                      <span className="font-semibold text-emerald-400">
                        {data.match_score}%
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Stage
                      </span>

                      <span className="text-slate-300">
                        Ready to Submit
                      </span>
                    </div>

                  </div>

                </div>

                {/* Process */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-sm font-semibold">
                    Application Journey
                  </p>

                  <div className="mt-5 space-y-5">

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950">
                        1
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          Submit
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Application is sent to the organization.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-slate-500">
                        2
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-300">
                          Industry Review
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Organization reviews your profile and fit.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-slate-500">
                        3
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-300">
                          Next Stage
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Shortlisting or interview based on review.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Intelligence Note */}
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">

                  <p className="text-xs font-semibold text-emerald-400">
                    AyushBridge Intelligence
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Your application carries competency and evidence context
                    instead of relying only on a traditional profile.
                  </p>

                </div>

              </aside>

            </div>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="mx-auto mt-10 max-w-3xl">

            <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-white/[0.03]">

              <div className="border-b border-white/10 p-8 text-center md:p-10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-400">
                  ✓
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Application Submitted
                </p>

                <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                  Application Successful
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                  Your application for{" "}
                  <span className="font-semibold text-white">
                    {data.title}
                  </span>{" "}
                  has been submitted to{" "}
                  <span className="font-semibold text-white">
                    {data.organization}
                  </span>
                  .
                </p>

              </div>

              {/* Success Details */}
              <div className="grid border-b border-white/10 sm:grid-cols-3">

                <div className="border-b border-white/10 p-5 text-center sm:border-b-0 sm:border-r">
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="mt-2 font-semibold text-emerald-400">
                    Submitted
                  </p>
                </div>

                <div className="border-b border-white/10 p-5 text-center sm:border-b-0 sm:border-r">
                  <p className="text-xs text-slate-500">
                    Match Score
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {data.match_score}%
                  </p>
                </div>

                <div className="p-5 text-center">
                  <p className="text-xs text-slate-500">
                    Next Stage
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    Industry Review
                  </p>
                </div>

              </div>

              <div className="p-8">

                {/* Journey */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">

                  <p className="text-sm font-semibold">
                    What happens next?
                  </p>

                  <div className="mt-5 space-y-4">

                    <div className="flex gap-3">
                      <span className="text-emerald-400">
                        ✓
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Application received
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Your application has been successfully recorded.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500">
                        2
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Industry review
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          The organization will review your profile and
                          competency match.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500">
                        3
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Selection process
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          You may progress to shortlisting or an interview.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/student/applications"
                    className="flex-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Track My Application
                  </Link>

                  <Link
                    href="/student/opportunities"
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Explore More Opportunities
                  </Link>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Mobile Dashboard */}
        <Link
          href="/student/dashboard"
          className="mt-6 block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-slate-300 md:hidden"
        >
          ← Back to Dashboard
        </Link>

      </section>
    </main>
  );
}