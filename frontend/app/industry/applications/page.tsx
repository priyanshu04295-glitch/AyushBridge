"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Application = {
  id: number;
  candidate_id: number;
  candidate: string;
  opportunity: string;
  match_score: number;
  status: string;
  stage: string;
};

export default function IndustryApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [shortlisting, setShortlisting] = useState<number | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/industry/applications/"
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } finally {
      setLoading(false);
    }
  }

  const averageMatch = useMemo(() => {
    if (applications.length === 0) return 0;

    return Math.round(
      applications.reduce(
        (sum, application) =>
          sum + application.match_score,
        0
      ) / applications.length
    );
  }, [applications]);

  const shortlisted = applications.filter(
    (application) =>
      application.status.toLowerCase() === "shortlisted" ||
      application.stage.toLowerCase().includes("shortlist")
  ).length;

  async function shortlistCandidate(
    application: Application
  ) {
    setShortlisting(application.id);
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/industry/shortlist/${application.id}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            result.message ||
            "Unable to shortlist candidate."
        );
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                status: "Shortlisted",
                stage: "Shortlisted",
              }
            : item
        )
      );

      setMessage(
        `${application.candidate} has been shortlisted successfully.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to shortlist candidate."
      );
    } finally {
      setShortlisting(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Talent Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review candidate applications, competency match,
            and recruitment progress.
          </p>
        </header>

        {/* SUMMARY */}
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Applications"
            value={applications.length}
          />

          <SummaryCard
            label="Average Match"
            value={`${averageMatch}%`}
            accent
          />

          <SummaryCard
            label="Shortlisted"
            value={shortlisted}
          />
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {/* APPLICATIONS */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Review Queue
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Candidate Applications
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {applications.length} total
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-8">
              <p className="text-sm text-slate-500">
                Loading applications...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
              <p className="text-sm text-slate-500">
                No applications available.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/70">

              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b border-white/[0.06] bg-slate-950/70">
                    <tr>
                      <TableHeader>Candidate</TableHeader>
                      <TableHeader>Opportunity</TableHeader>
                      <TableHeader>Match</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Stage</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application) => {
                      const isShortlisted =
                        application.status
                          .toLowerCase()
                          .includes("shortlist");

                      return (
                        <tr
                          key={application.id}
                          className="border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.015]"
                        >
                          <td className="px-5 py-5">
                            <p className="font-medium text-white">
                              {application.candidate}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              #{application.id}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="max-w-[240px] text-sm text-slate-300">
                              {application.opportunity}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`font-semibold ${
                                application.match_score >= 80
                                  ? "text-emerald-400"
                                  : application.match_score >= 60
                                    ? "text-amber-400"
                                    : "text-slate-400"
                              }`}
                            >
                              {application.match_score}%
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge
                              status={application.status}
                            />
                          </td>

                          <td className="px-5 py-5">
                            <span className="text-sm text-slate-400">
                              {application.stage}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex flex-col items-start gap-2">

                              <Link
                                href={`/industry/candidates/${application.candidate_id}`}
                                className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                              >
                                View Candidate →
                              </Link>

                              {!isShortlisted && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    shortlistCandidate(
                                      application
                                    )
                                  }
                                  disabled={
                                    shortlisting ===
                                    application.id
                                  }
                                  className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-400/10 disabled:opacity-50"
                                >
                                  {shortlisting ===
                                  application.id
                                    ? "Shortlisting..."
                                    : "Shortlist"}
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE LIST */}
              <div className="divide-y divide-white/[0.05] md:hidden">
                {applications.map((application) => {
                  const isShortlisted =
                    application.status
                      .toLowerCase()
                      .includes("shortlist");

                  return (
                    <div
                      key={application.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium">
                            {application.candidate}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            Application #{application.id}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-lg font-bold ${
                            application.match_score >= 80
                              ? "text-emerald-400"
                              : application.match_score >= 60
                                ? "text-amber-400"
                                : "text-slate-400"
                          }`}
                        >
                          {application.match_score}%
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-slate-400">
                        {application.opportunity}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <StatusBadge
                          status={application.status}
                        />

                        <span className="rounded-lg bg-slate-800/70 px-3 py-1.5 text-xs text-slate-400">
                          {application.stage}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/industry/candidates/${application.candidate_id}`}
                          className="text-sm font-semibold text-emerald-400"
                        >
                          View Candidate →
                        </Link>

                        {!isShortlisted && (
                          <button
                            type="button"
                            onClick={() =>
                              shortlistCandidate(
                                application
                              )
                            }
                            disabled={
                              shortlisting ===
                              application.id
                            }
                            className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-400 disabled:opacity-50"
                          >
                            {shortlisting ===
                            application.id
                              ? "Shortlisting..."
                              : "Shortlist"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          accent
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  const isPositive =
    normalized.includes("shortlist") ||
    normalized.includes("selected") ||
    normalized.includes("accepted");

  return (
    <span
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
        isPositive
          ? "bg-emerald-400/10 text-emerald-400"
          : "bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}