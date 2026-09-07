"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const roleRoutes = {
  student: "/student/dashboard",
  industry: "/industry",
  faculty: "/faculty",
  institution: "/institution/dashboard",
  admin: "/admin",
};

function getRequiredRole(pathname: string) {
  if (pathname.startsWith("/student")) {
    return "student";
  }

  if (pathname.startsWith("/industry")) {
    return "industry";
  }

  if (pathname.startsWith("/faculty")) {
    return "faculty";
  }

  if (pathname.startsWith("/institution")) {
    return "institution";
  }

  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  return null;
}

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const requiredRole = getRequiredRole(pathname);

    // Public pages do not require authentication.
    if (!requiredRole) {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("ayushbridge_token");
    const storedUser = localStorage.getItem("ayushbridge_user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== requiredRole) {
        const correctRoute =
          roleRoutes[user.role as keyof typeof roleRoutes];

        if (correctRoute) {
          router.replace(correctRoute);
        } else {
          router.replace("/login");
        }

        return;
      }

      setChecking(false);
    } catch {
      localStorage.removeItem("ayushbridge_token");
      localStorage.removeItem("ayushbridge_user");
      router.replace("/login");
    }
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />

          <p className="mt-4 text-sm text-slate-400">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}