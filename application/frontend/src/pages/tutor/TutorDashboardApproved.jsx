// src/pages/TutorDashboardApproved.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TutorDashboardApproved() {
  const { search } = useLocation();

  // Read demo user to display greeting
  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);
  const displayName = useMemo(() => {
    if (!user?.email) return "Sarah"; // default like storyboard
    const beforeAt = user.email.split("@")[0] || "Tutor";
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  // Allow overriding tutor id & approval date via query (?id=1&approved=2025-10-28)
  const params = new URLSearchParams(search);
  const tutorId = params.get("id") || "1";
  const approved = params.get("approved") || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";

  return (
    <section className="space-y-6">
      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-3xl">
              👤
            </div>
            <div className="text-2xl font-extrabold">Welcome, {displayName}!</div>
          </div>

          {/* Icons with mail badge (1) */}
          <div className="relative flex items-center gap-4 text-2xl">
            <Link to="/inbox" title="Messages" className="relative hover:opacity-80">
              ✉️
              <span className="absolute -top-2 -right-3 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white text-[10px]">
                1
              </span>
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <h1 className="mt-4 text-center text-2xl md:text-3xl font-extrabold tracking-wide">
          SFSU TUTORING PLATFORM
        </h1>
      </div>

      {/* ===== Profile Status (ACTIVE) ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">PROFILE STATUS</h2>

        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="font-extrabold">✓ STATUS: ACTIVE</p>
          <p className="mt-1">Your profile is now visible in search results!</p>
          <p className="mt-1">
            Approved on:{" "}
            <span className="font-semibold">
              {new Date(approved).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
          </p>

          <div className="mt-4">
            <Link
              to={`/tutors/${tutorId}`}
              className="inline-block rounded-md border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              VIEW PUBLIC PROFILE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
