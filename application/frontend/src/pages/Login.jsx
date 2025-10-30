// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Allow redirecting to a specific page after login
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/tutor";

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // Classroom demonstration: Only verify the @sfsu.edu domain, do not perform actual authentication
    const ok = /@sfsu\.edu$/i.test(email.trim());
    if (!ok) {
      setErr("Please use your @sfsu.edu email to sign in (demo).");
      return;
    }

    // Demo：Write to local storage so the frontend can determine if the user is logged in.
    localStorage.setItem("demoUser", JSON.stringify({ email, at: Date.now() }));

    // Redirecting after login
    navigate(next, { replace: true });
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Demo-only login. Private actions (e.g., contacting tutors) require an{" "}
          <code>@sfsu.edu</code> account.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 max-w-md"
      >
        <div className="grid gap-4">
          <label className="block">
            <div className="text-sm text-slate-600 mb-1">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@sfsu.edu"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm text-slate-600 mb-1">Password</div>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          {err && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm px-3 py-2">
              {err}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-medium hover:bg-black"
          >
            Sign in
          </button>

          <div className="text-xs text-slate-500">
            * Demo only. No real authentication or payments.
          </div>
        </div>
      </form>

      <div className="text-sm text-slate-600">
        Prefer to browse first?{" "}
        <Link to="/tutor" className="text-blue-600 hover:underline">
          Continue as guest
        </Link>
      </div>
    </section>
  );
}
