"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  verification: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load users:", error);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const roleMatch =
      selectedRole === "All" || user.role === selectedRole;

    const statusMatch =
      selectedStatus === "All" || user.status === selectedStatus;

    return roleMatch && statusMatch;
  });

  const totalUsers = users.length;
  const students = users.filter(
    (user) => user.role === "Student"
  ).length;

  const faculty = users.filter(
    (user) => user.role === "Faculty"
  ).length;

  const industries = users.filter(
    (user) => user.role === "Industry"
  ).length;

  const institutions = users.filter(
    (user) => user.role === "Institution"
  ).length;

  const pendingVerification = users.filter(
    (user) => user.verification === "Pending"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-500">
          Loading users...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10 lg:py-9">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Platform Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            User Management
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage platform users, roles, account status and
            verification across the AyushBridge ecosystem.
          </p>
        </header>

        {/* USER METRICS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Metric
            label="Total Users"
            value={totalUsers}
          />

          <Metric
            label="Students"
            value={students}
          />

          <Metric
            label="Faculty"
            value={faculty}
          />

          <Metric
            label="Industry"
            value={industries}
          />

          <Metric
            label="Institutions"
            value={institutions}
          />
        </section>

        {/* ADMIN ATTENTION */}
        {pendingVerification > 0 && (
          <section className="mt-7 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Admin Attention
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {pendingVerification} user
                  {pendingVerification !== 1 ? "s" : ""} require
                  verification
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review pending accounts before granting
                  higher-trust platform access.
                </p>
              </div>

              <a
                href="/admin/verification"
                className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Review Verification
              </a>
            </div>
          </section>
        )}

        {/* USERS */}
        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Directory
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Platform Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review registered users and their current platform status.
              </p>
            </div>

            <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              + Add User
            </button>
          </div>

          {/* FILTERS */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-emerald-400"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Industry">Industry</option>
              <option value="Institution">Institution</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex items-center rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm text-slate-500">
              Showing{" "}
              <span className="mx-1 font-medium text-slate-300">
                {filteredUsers.length}
              </span>
              users
            </div>
          </div>

          {/* TABLE */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-white/[0.07] text-left">
                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    User
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    Role
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    Email
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    Status
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    Verification
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
                  >
                    {/* USER */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-xs font-semibold text-emerald-400">
                          {user.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>

                        <p className="font-medium text-slate-200">
                          {user.name}
                        </p>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-5">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {user.role}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-5 text-sm text-slate-400">
                      {user.email}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          user.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : user.status === "Pending"
                              ? "bg-amber-400/10 text-amber-400"
                              : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* VERIFICATION */}
                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          user.verification === "Verified"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {user.verification}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-5">
                      <button className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filteredUsers.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-sm text-slate-500">
              No users match the selected filters.
            </div>
          )}
        </section>

        {/* ADMIN INSIGHT */}
        <section className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            Admin Insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Verification strengthens trusted matching
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
            Verified users and organizations improve the reliability
            of competency matching, opportunity discovery and digital
            portfolios. Pending accounts should be reviewed before
            receiving higher-trust platform permissions.
          </p>
        </section>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value.toLocaleString()}
      </p>

      <p className="mt-2 text-xs text-emerald-400">
        Platform users
      </p>
    </div>
  );
}