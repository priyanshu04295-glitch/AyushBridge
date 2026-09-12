"use client";

import { useEffect, useState } from "react";

type Mentorship = {
  id: number;
  student_id: number;
  student: string;
  faculty_id: number;
  faculty: string;
  area: string;
  type: string;
  message: string;
  status: string;
};

export default function FacultyMentorshipPage() {
  const [requests, setRequests] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/faculty/mentorship"
      );

      const data = await response.json();
      setRequests(data);
    } catch {
      console.error("Failed to load mentorship requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/faculty/mentorship/${id}?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        loadRequests();
      }
    } catch {
      console.error("Failed to update mentorship");
    }
  };

  const pending = requests.filter(
    (item) => item.status === "Pending"
  );

  const active = requests.filter(
    (item) => item.status === "Accepted"
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-400">
          Faculty Intelligence
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Student Mentorship
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Connect your expertise with students who need targeted
          competency development.
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">

        <Metric
          label="Total Requests"
          value={requests.length}
        />

        <Metric
          label="Pending Requests"
          value={pending.length}
        />

        <Metric
          label="Active Mentorships"
          value={active.length}
        />

      </div>

      {/* Attention */}
      {pending.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Faculty Attention
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            {pending.length} mentorship request
            {pending.length > 1 ? "s" : ""} awaiting review
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Review student competency needs and accept relevant
            mentorship requests.
          </p>
        </div>
      )}

      {/* Requests */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Mentorship Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Student requests matched to your expertise.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
            Loading mentorship requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
            No mentorship requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 font-semibold text-emerald-400">
                        {request.student
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {request.student}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Student · {request.area}
                        </p>
                      </div>
                    </div>

                    {request.message && (
                      <p className="mt-4 max-w-2xl text-sm text-slate-400">
                        “{request.message}”
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        request.status === "Accepted"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : request.status === "Pending"
                          ? "bg-amber-400/10 text-amber-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {request.status}
                    </span>

                    {request.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "Accepted"
                            )
                          }
                          className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "Rejected"
                            )
                          }
                          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {request.status === "Accepted" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "Completed"
                          )
                        }
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                      >
                        Mark Completed
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Intelligence */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Faculty Mentorship Intelligence
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Competency-Based Mentorship
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-4">

          <Step
            number="01"
            title="Review Student"
            text="Understand the student's competency profile and development needs."
          />

          <Step
            number="02"
            title="Identify Skill Gaps"
            text="Focus mentorship on competencies requiring improvement."
          />

          <Step
            number="03"
            title="Guide Development"
            text="Provide targeted mentoring, projects and learning guidance."
          />

          <Step
            number="04"
            title="Improve Readiness"
            text="Help students become better aligned with industry requirements."
          />

        </div>
      </section>

    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs font-semibold text-emerald-400">
        {number}
      </p>

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}