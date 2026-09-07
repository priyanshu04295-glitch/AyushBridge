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
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/industry/candidates/${candidateId}`}
          className="text-sm text-emerald-400"
        >
          ← Back to Candidate
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm text-emerald-400">
            Industry Talent Workflow
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            Shortlist Candidate
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            Shortlisting moves the candidate into the Industry Review stage.
            The candidate&apos;s verified competency evidence and skill gaps
            remain available to the industry partner.
          </p>

          {success ? (
            <div className="mt-8 rounded-xl border border-emerald-800 bg-emerald-950/30 p-5">
              <p className="font-semibold text-emerald-400">
                Candidate shortlisted successfully.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Next stage: Industry Review
              </p>

              <Link
                href="/industry/applications"
                className="mt-5 inline-block rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                View Applications
              </Link>
            </div>
          ) : (
            <button
              onClick={shortlist}
              disabled={loading}
              className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
            >
              {loading ? "Shortlisting..." : "Confirm Shortlist"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}