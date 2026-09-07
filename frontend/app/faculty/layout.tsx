import Link from "next/link";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Faculty Sidebar */}
        <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 lg:block">
          <div className="flex h-full flex-col p-6">
            {/* Brand */}
            <Link href="/" className="mb-10 block">
              <div className="text-xl font-bold tracking-tight text-emerald-400">
                AyushBridge
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Faculty Portal
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <Link
                href="/faculty"
                className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/faculty/collaborations"
                className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                Collaborations
              </Link>

              <Link
                href="/faculty/mentorship"
                className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                Mentorship
              </Link>

              <Link
                href="/faculty/research"
                className="block rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                Research
              </Link>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-800 pt-5">
              <p className="text-xs text-slate-600">
                AyushBridge · Faculty
              </p>

              <p className="mt-1 text-xs text-slate-700">
                Academia–Industry Intelligence
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-screen flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}