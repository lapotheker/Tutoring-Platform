import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import logo from "../../assets/logo.svg";

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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sfsu_email: emailTrimmed,
          password: pwd,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = {
          user_id: data.user.user_id,
          email: data.user.sfsu_email,
          full_name: data.user.full_name,
          role: data.user.role,
          at: Date.now(),
        };

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("demoUser", JSON.stringify(userData));

        // Track login event
        if (window.gtag) {
          window.gtag("event", "login", {
            method: "email",
            role: data.user.role,
          });
        }

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
    "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 mb-4 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors"
        >
          ← Back to Home
        </Link>

        <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 space-y-6">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center mb-4">
              <img src={logo} alt="ScholarlyGator Logo" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              SCHOLARLYGATOR
            </h1>
            <h2 className="mt-2 text-xl font-bold text-purple-800">LOGIN</h2>
          </div>

          <form onSubmit={onSubmit} className="grid gap-5">
            <label className="block">
              <div className="text-sm font-semibold text-purple-900 mb-2">Email:</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sfsu.edu"
                className={inputStyle}
                required
                autoComplete="email"
              />
              <p className="text-xs text-purple-600 mt-1.5">(Must use @sfsu.edu email)</p>
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-purple-900 mb-2">Password:</div>
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
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot"
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {err && (
              <div className="rounded-xl border-2 border-red-300 bg-red-50 text-red-900 text-sm px-4 py-3 flex items-start gap-2">
                <span className="text-lg"></span>
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white font-bold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p className="text-sm text-slate-700 text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
