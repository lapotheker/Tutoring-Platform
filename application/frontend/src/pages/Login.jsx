import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Allow redirecting to a specific page after login; defaults to home
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // Simple validation for @sfsu.edu emails (demo only, no real authentication)
    const ok = /^[^@\s]+@sfsu\.edu$/i.test(email.trim());
    if (!ok) {
      setErr("Please use your @sfsu.edu email to sign in (demo).");
      return;
    }

    // Demo: store login state in localStorage or sessionStorage depending on 'Remember me'
    const payload = JSON.stringify({ email: email.trim(), at: Date.now() });
    (remember ? localStorage : sessionStorage).setItem("demoUser", payload);

    // Redirect after successful login
    navigate(next, { replace: true });
  }

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-xl font-extrabold tracking-wide">SFSU TUTORING PLATFORM</h1>
        <h2 className="mt-2 text-lg font-bold">LOGIN</h2>
      </div>

      {/* Login Form */}
      <form onSubmit={onSubmit} className="grid gap-4">
        {/* Email Field */}
        <label className="block">
          <div className="text-sm text-slate-700 mb-1">Email:</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@sfsu.edu"
            className={inputStyle}
            required
            autoComplete="email"
          />
          <p className="text-xs text-slate-500 mt-1">(Must use @sfsu.edu email)</p>
        </label>

        {/* Password Field */}
        <label className="block">
          <div className="text-sm text-slate-700 mb-1">Password:</div>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="••••••••"
            className={inputStyle}
            required
            autoComplete="current-password"
          />
        </label>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <Link to="/forgot" className="text-sm font-medium text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {err && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm px-3 py-2">
            {err}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-black"
        >
          LOGIN
        </button>

        {/* Sign Up Redirect */}
        <p className="text-sm text-slate-700 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline text-blue-600 hover:no-underline">
            Sign up!
          </Link>
        </p>
      </form>
    </section>
  );
}
