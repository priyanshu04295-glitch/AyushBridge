"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: number;
  opportunity_title: string;
  organization: string;
  match_score: number;
  status: string;
  stage: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applications/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load applications");
        }

        return response.json();
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to AyushBridge API.");
        setLoading(false);
      });
  }, []);

  const shortlisted = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const underReview = applications.filter(
    (application) => application.status === "Under Review"
  ).length;

  const averageMatch =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (total, application) => total + application.match_score,
            0
          ) / applications.length
        )
      : 0;

  const strongestApplication =
    applications.length > 0
      ? applications.reduce((strongest, application) =>
          application.match_score > strongest.match_score
            ? application
            : strongest
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-emerald-400">
            Career Opportunity Tracking
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            My Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Track your applications, industry reviews, interviews and
            verification milestones.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading applications from AyushBridge API...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="font-medium text-red-400">{error}</p>

            <p className="mt-2 text-sm text-slate-500">
              Make sure the FastAPI backend is running on port 8000.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">Total Applications</p>

                <p className="mt-2 text-3xl font-bold">
                  {applications.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">Under Review</p>

                <p className="mt-2 text-3xl font-bold">
                  {underReview}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
                <p className="text-sm text-emerald-400">Shortlisted</p>

                <p className="mt-2 text-3xl font-bold">
                  {shortlisted}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-500">Average Match</p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {averageMatch}%
                </p>
              </div>
            </div>

            {strongestApplication && (
              <div className="mb-6 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
                <p className="text-sm font-medium text-emerald-400">
                  AI Application Insight
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your strongest application is{" "}
                  <span className="font-semibold text-white">
                    {strongestApplication.opportunity_title}
                  </span>{" "}
                  with a{" "}
                  <span className="font-semibold text-emerald-400">
                    {strongestApplication.match_score}% competency match
                  </span>
                  . Its current stage is{" "}
                  <span className="font-semibold text-white">
                    {strongestApplication.stage}
                  </span>
                  .
                </p>
              </div>
            )}

            {applications.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                <p className="text-slate-400">
                  You have not submitted any applications yet.
                </p>

                <Link
                  href="/student/opportunities"
                  className="mt-5 inline-block rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Explore Opportunities
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold">
                            {application.opportunity_title}
                          </h2>

                          <span className="rounded-full border border-emerald-800/50 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400">
                            {application.match_score}% Match
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {application.organization}
                        </p>

                        <div className="mt-5">
                          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                            Application Pipeline
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              "Apply",
                              "Industry Review",
                              "Interview",
                              "Mentor Verification",
                              "Verified Portfolio",
                            ].map((stage, index) => {
                              const currentStage =
                                application.stage === stage;

                              const stageReached =
                                [
                                  "Apply",
                                  "Industry Review",
                                  "Interview",
                                  "Mentor Verification",
                                  "Verified Portfolio",
                                ].indexOf(application.stage) >= index;

                              return (
                                <div
                                  key={stage}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    className={`rounded-lg px-3 py-1.5 text-xs ${
                                      currentStage
                                        ? "bg-emerald-500 font-semibold text-slate-950"
                                        : stageReached
                                        ? "bg-emerald-950/40 text-emerald-400"
                                        : "bg-slate-800 text-slate-500"
                                    }`}
                                  >
                                    {stage}
                                  </span>

                                  {index < 4 && (
                                    <span className="text-slate-700">
                                      →
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 lg:w-40">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Current Status
                        </p>

                        <p className="mt-2 text-sm font-semibold text-emerald-400">
                          {application.status}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {application.stage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/student/opportunities"
                className="inline-block rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Explore More Opportunities
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}