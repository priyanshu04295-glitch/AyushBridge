"use client";

import { useEffect, useMemo, useState } from "react";

type Mentorship = {
  id: number;
  student: string;
  area: string;
  type: string;
  status: string;
};

export default function FacultyMentorship() {
  const [students, setStudents] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMentorship() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/faculty/mentorship"
        );

        if (response.ok) {
          setStudents(await response.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadMentorship();
  }, []);

  const areas = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(students.map((student) => student.area))),
    ];
  }, [students]);

  const filteredStudents =
    filter === "All"
      ? students
      : students.filter((student) => student.area === filter);

  const studentsMentored = students.length;

  const activeMentorships = students.filter(
    (student) => student.status === "Active"
  ).length;

  const industryReady = students.filter(
    (student) => student.status === "Active"
  ).length;

  function handleMentorship(student: Mentorship) {
    setMessage(
      `Mentorship action initiated for ${student.student}.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  function handleViewStudent(student: Mentorship) {
    setMessage(
      `Opening competency profile for ${student.student}.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="mt-6">
          <p className="text-sm text-emerald-400">
            Faculty Development & Student Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Student Mentorship
          </h2>

          <p className="mt-2 max-w-3xl text-slate-400">
            Track student progress, competency development, research
            guidance and industry readiness through faculty mentorship.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Metric
            label="Students Mentored"
            value={studentsMentored}
          />

          <Metric
            label="Active Mentorships"
            value={activeMentorships}
          />

          <Metric
            label="Industry-Ready"
            value={industryReady}
          />
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
            {message}
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Mentorship Focus
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Filter mentees by competency or research area.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setFilter(area)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === area
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">
                Mentees
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Students currently connected to faculty mentorship.
              </p>
            </div>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
              {filteredStudents.length} visible records
            </span>
          </div>

          {loading ? (
            <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/50 p-6 text-slate-400">
              Loading mentorship records...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/50 p-6 text-slate-400">
              No mentorship records found for this area.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="rounded-xl border border-white/10 bg-slate-900/50 p-5 transition hover:border-emerald-900"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold">
                          {student.student}
                        </h4>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            student.status === "Active"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        {student.area}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                          {student.type}
                        </span>

                        <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                          Competency Development
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                      >
                        View Student
                      </button>

                      <button
                        onClick={() => handleMentorship(student)}
                        className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                      >
                        Manage Mentorship
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <p className="text-sm font-medium text-emerald-400">
            Faculty Mentorship Intelligence
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Competency-Based Mentorship
          </h3>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Mentorship connects faculty expertise with student competency
            gaps and career goals, helping learners strengthen the skills
            required for research, internships, projects and industry
            opportunities.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[
              "Review Student",
              "Identify Skill Gaps",
              "Guide Development",
              "Improve Readiness",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-emerald-900/40 bg-slate-950/50 p-4"
              >
                <p className="text-xs text-emerald-400">
                  0{index + 1}
                </p>

                <p className="mt-2 text-sm font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-3xl font-bold text-emerald-400">
        {value}
      </p>
    </div>
  );
}