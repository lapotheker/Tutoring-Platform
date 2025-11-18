// src/pages/TutorDashboard.jsx
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TutorDashboard() {
  const navigate = useNavigate();

  // Load demo user from local or session storage
  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  // Extract name from email or use fallback
  const displayName = useMemo(() => {
    if (!user?.email) return "Tutor";
    const beforeAt = user.email.split("@")[0] || "Tutor";
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  return (
    <section className="space-y-6">
      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-3xl">
              👤
            </div>
            <div>
              <div className="text-2xl font-extrabold">Welcome, {displayName}!</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-2xl">
            <Link to="/inbox" title="Messages" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <h1 className={`mt-4 text-center ${bigTitle}`}>SFSU TUTORING PLATFORM</h1>
      </div>

      {/* ===== Profile Status ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">PROFILE STATUS</h2>

        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <div className="text-lg md:text-xl font-extrabold">
            YOU DON'T HAVE A TUTOR PROFILE YET
          </div>
          <p className="mt-2 text-slate-800">
            Create your profile to start offering tutoring services.
          </p>
          <p className="mt-1 text-slate-800">
            <span className="underline underline-offset-2">
              Your profile will be reviewed by administrators
            </span>{" "}
            before appearing in search results.
          </p>

          <div className="mt-5">
            <button
              onClick={() => navigate("/tutor/posting")}
              className="rounded-md border px-5 py-2 font-semibold hover:bg-white"
            >
              CREATE PROFILE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
