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
  const students = users.filter((user) => user.role === "Student").length;
  const faculty = users.filter((user) => user.role === "Faculty").length;
  const industries = users.filter((user) => user.role === "Industry").length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading users...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm text-emerald-400">
              Platform Governance
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              User Management
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage users, roles, verification status and platform access.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              Platform Administrator
            </p>

            <p className="text-xs text-slate-400">
              Governance &amp; Verification
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            ["Total Users", totalUsers],
            ["Students", students],
            ["Faculty", faculty],
            ["Industry Partners", industries],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">
                {label}
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Platform Users
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review registered users and their current platform status.
              </p>
            </div>

            <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
              + Add User
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-400"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Industry">Industry</option>
              <option value="Institution">Institution</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Verification
                  </th>

                  <th className="px-4 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-5">
                      <p className="font-medium">
                        {user.name}
                      </p>
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-400">
                      {user.email}
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          user.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

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

                    <td className="px-4 py-5">
                      <button className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No users match the selected filters.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <p className="text-sm font-medium text-amber-400">
            Admin Insight
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Verification is the foundation of trusted matching
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            Verified users and organizations improve the reliability of
            competency matching, opportunity discovery and digital
            portfolios. Pending accounts should be reviewed before receiving
            higher-trust platform permissions.
          </p>
        </section>
      </div>
    </main>
  );
}