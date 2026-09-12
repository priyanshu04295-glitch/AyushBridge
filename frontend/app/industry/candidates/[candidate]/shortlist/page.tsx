"use client";

import { use, useState } from "react";
import Link from "next/link";

export default function ShortlistPage({
  params,
}: {
  params: Promise<{ candidate: string }>;
}) {
  const { candidate: candidateId } = use(params);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function shortlist() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/industry/shortlist/${candidateId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-2xl">

        {/* BACK */}
        <Link
          href={`/industry/candidates/${candidateId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <span>←</span>
          Back to Candidate
        </Link>

        {/* CONTENT */}
        <section className="mt-8 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-7 sm:p-9">

          {!success ? (
            <>
              {/* HEADER */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Talent Review
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Shortlist Candidate
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Confirm that this candidate should move to the
                  Industry Review stage.
                </p>
              </div>

              {/* ACTION */}
              <div className="mt-8 border-t border-white/[0.06] pt-7">

                <button
                  type="button"
                  onClick={shortlist}
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Shortlisting..."
                    : "Confirm Shortlist"}
                </button>

                <Link
                  href={`/industry/candidates/${candidateId}`}
                  className="mt-3 block text-center text-sm text-slate-500 transition hover:text-slate-300"
                >
                  Cancel
                </Link>

              </div>
            </>
          ) : (
            <>
              {/* SUCCESS */}
              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-400">
                  ✓
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Shortlisted
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight">
                  Candidate shortlisted
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  The candidate has been moved to the Industry
                  Review stage.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

                  <Link
                    href={`/industry/candidates/${candidateId}`}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Back to Candidate
                  </Link>

                  <Link
                    href="/industry/applications"
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    View Applications
                  </Link>

                </div>

              </div>
            </>
          )}

        </section>

      </div>
    </main>
  );
}