import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

// false = demo user allowed
// true  = redirect to login if no user found
const ENFORCE_LOGIN = false;

export default function TutorDashboard() {
  const navigate = useNavigate();

  // Load saved user or use demo user (when login is not enforced)
  const user = useMemo(() => {
    try {
      const stored =
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");

      if (!stored && !ENFORCE_LOGIN) {
        return { email: "demo_tutor@sfsu.edu" };
      }
      if (!stored) return null;

      return JSON.parse(stored);
    } catch {
      if (!ENFORCE_LOGIN) return { email: "demo_tutor@sfsu.edu" };
      return null;
    }
  }, []);

  // Create display name from email
  const displayName = useMemo(() => {
    if (!user?.email) return "Tutor";
    const beforeAt = user.email.split("@")[0];
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  // Redirect only when login is required
  useEffect(() => {
    if (ENFORCE_LOGIN && !user) {
      navigate(`/login?next=${encodeURIComponent("/tutor/dashboard")}`, {
        replace: true,
      });
    }
  }, [user, navigate]);

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  return (
    <section className="space-y-6">
      {/* Header */}
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
            <Link to="/inbox" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <h1 className={`mt-4 text-center ${bigTitle}`}>SFSU Tutoring Page</h1>
      </div>

      {/* Profile Status */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">Profile Status</h2>

        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <div className="text-lg md:text-xl font-extrabold">
            YOU DON&apos;T HAVE A TUTOR PROFILE YET
          </div>
          <p className="mt-2 text-slate-800">
            Create your profile to start offering tutoring services.
          </p>
          <p className="mt-1 text-slate-800">
            <span className="underline underline-offset-2">
              Your profile will be reviewed.
            </span>{" "}
            before appearing in search results.
          </p>

          <div className="mt-5">
            <button
              onClick={() => navigate("/tutor/profile-submitted")}
              className="rounded-md border px-5 py-2 font-semibold hover:bg-white"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
