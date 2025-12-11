import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const emailTrimmed = email.trim().toLowerCase();

    // Basic validation
    if (!/^[^@\s]+@sfsu\.edu$/i.test(emailTrimmed)) {
      setErr("Please use your @sfsu.edu email to sign in.");
      return;
    }

    if (!pwd) {
      setErr("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sfsu_email: emailTrimmed,
          password: pwd,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store complete user data including user_id
        const userData = {
          user_id: data.user.user_id,
          email: data.user.sfsu_email,
          full_name: data.user.full_name,
          role: data.user.role,
          at: Date.now(),
        };

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("demoUser", JSON.stringify(userData));

        // Navigate based on role
        if (data.user.role === 3) {
          navigate("/admin", { replace: true });
        } else if (data.user.role === 2) {
          navigate("/tutor/dashboard", { replace: true });
        } else {
          navigate(next, { replace: true });
        }
      } else {
        setErr(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/"
        className="inline-block mb-3 text-slate-600 text-sm font-medium hover:text-blue-600"
      >
        ← Back to Home
      </Link>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-wide">SFSU TUTORING PLATFORM</h1>
          <h2 className="mt-2 text-lg font-bold">LOGIN</h2>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
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

          {err && (
            <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 text-sm px-3 py-2">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="text-sm text-slate-700 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
