import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");

  // Try to read demo user from storage (set by Login.jsx). Prefer localStorage, then sessionStorage.
  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Derive a friendly display name from email (e.g., james@sfsu.edu -> James)
  const displayName = useMemo(() => {
    if (!user?.email) return "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  // Submit handler: navigate to Home with a query param so Home can perform a search
  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/");
    navigate(`/?q=${encodeURIComponent(target)}`);
  }

  return (
    <section className="space-y-8">
      {/* ===== Header Card ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          {/* Left: avatar + welcome */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-2xl">
              👤
            </div>
            <div className="text-lg md:text-xl font-semibold">Welcome, {displayName}!</div>
          </div>

          {/* Right: quick actions */}
          <div className="flex items-center gap-3 text-2xl">
            <Link to="/inbox" title="Messages" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
            SFSU TUTORING PLATFORM
          </h1>
          <h2 className="mt-2 text-lg md:text-xl font-bold">Find A Tutor</h2>

          {/* Search bar */}
          <form onSubmit={onSearch} className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 w-full max-w-lg bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course, subject, or name"
                className="flex-1 outline-none text-sm"
              />
              <button
                type="submit"
                className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-black"
                aria-label="Search"
              >
                {/* simple magnifier icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold">Recent Activity</div>
        <div className="p-4 text-sm text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p>No scheduled tutoring sessions yet.</p>
            <p>Start by finding a tutor!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
