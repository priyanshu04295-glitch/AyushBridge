"use client";

import { useEffect, useMemo, useState } from "react";

type Collaboration = {
  id: number;
  title: string;
  organization: string;
  type: string;
  status: string;
  participants: number;
};

export default function FacultyCollaborations() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCollaborations() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/faculty/collaborations"
        );

        if (response.ok) {
          setCollaborations(await response.json());
        }
      } finally {
        setLoading(false);
      }
    }

    loadCollaborations();
  }, []);

  const types = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(collaborations.map((item) => item.type))),
    ];
  }, [collaborations]);

  const filteredCollaborations =
    filter === "All"
      ? collaborations
      : collaborations.filter((item) => item.type === filter);

  const activeCollaborations = collaborations.filter(
    (item) => item.status === "Active"
  ).length;

  const totalParticipants = collaborations.reduce(
    (total, item) => total + item.participants,
    0
  );

  function handleRequest(collaboration: Collaboration) {
    setMessage(
      `Collaboration request initiated for "${collaboration.title}".`
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
            Academia–Industry Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Industry Collaborations
          </h2>

          <p className="mt-2 max-w-3xl text-slate-400">
            Discover and connect with industry opportunities across faculty
            training, research, mentorship, workshops, consultancy and live
            projects.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Metric
            label="Available Opportunities"
            value={collaborations.length}
          />

          <Metric
            label="Active Collaborations"
            value={activeCollaborations}
          />

          <Metric
            label="Participants Connected"
            value={totalParticipants}
          />
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
            {message}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Collaboration Type
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Filter opportunities by faculty–industry engagement type.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === type
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-400">
            Loading collaborations...
          </div>
        ) : filteredCollaborations.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-400">
            No collaboration opportunities found for this category.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredCollaborations.map((collaboration) => (
              <div
                key={collaboration.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-900"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {collaboration.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          collaboration.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {collaboration.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {collaboration.organization}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                        {collaboration.type}
                      </span>

                      <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                        {collaboration.participants} participants
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequest(collaboration)}
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                  >
                    Request Collaboration
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <p className="text-sm font-medium text-emerald-400">
            Faculty–Industry Engagement Loop
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            From Expertise to Collaboration
          </h3>

          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {[
              "Faculty Expertise",
              "Industry Need",
              "Collaboration",
              "Knowledge Exchange",
              "Verified Outcome",
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

          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-400">
            The collaboration hub connects faculty expertise with industry
            requirements and creates structured pathways for training,
            research, mentorship, workshops and other academic–industry
            engagements.
          </p>
        </div>
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