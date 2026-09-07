"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
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

    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/industry"
          className="text-sm text-emerald-400"
        >
          ← Back to Industry Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm text-emerald-400">
            Industry Talent Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Applications
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Review candidates using explainable competency matching,
            verified evidence, and application workflow stages.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading applications...
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Candidate
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Opportunity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Match
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Stage
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-slate-800 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium">
                          {application.candidate}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Application #{application.id}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-300">
                          {application.opportunity}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-emerald-950 px-3 py-1 text-sm font-semibold text-emerald-400">
                          {application.match_score}%
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                          {application.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-400">
                          {application.stage}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/industry/candidates/${application.candidate_id}`}
                          className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                        >
                          View Candidate →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Explainable Matching"
            description="Industry teams can review why a candidate matches an opportunity."
          />

          <InfoCard
            title="Verified Evidence"
            description="Candidate skills are supported by assessments, projects, certificates, and mentor verification."
          />

          <InfoCard
            title="Workflow Intelligence"
            description="Applications move through structured review, assessment, interview, and selection stages."
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}
