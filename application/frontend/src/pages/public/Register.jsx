import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTos: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [showHome, setShowHome] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^@\s]+@sfsu\.edu$/i.test(form.email)) e.email = "Must use @sfsu.edu email";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";

    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";

    if (!form.acceptTos) e.acceptTos = "You must agree to Terms and Privacy Policy";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    setSubmitting(true);
    
    // Simulate successful registration
    setTimeout(() => {
      setServerMsg("✓ Account created successfully! Redirecting to login...");
      setSubmitting(false);
      setTimeout(() => setShowLogin(true), 2000);
    }, 1500);
  }

  const inputStyle =
    "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-2xl ring-4 ring-amber-400 mb-6">
            <span className="text-4xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              SG
            </span>
          </div>
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Welcome to ScholarlyGator!</h2>
          <p className="text-slate-700 mb-6">Your account has been created successfully.</p>
          <button
            onClick={() => setShowLogin(false)}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white font-bold shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12 md:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-2xl ring-4 ring-amber-400">
              <span className="text-4xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                SG
              </span>
            </div>
            <div className="text-left">
              <p className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                ScholarlyGator
              </p>
              <p className="text-sm text-purple-600">Your SFSU study companion</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
            Welcome to ScholarlyGator!
          </h1>

          <button
            onClick={() => setShowHome(false)}
            className="mt-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Back to Register
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => setShowHome(true)}
          className="inline-flex items-center gap-1 mb-4 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors"
        >
          ← Back to Home
        </button>

        <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 space-y-6">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg ring-4 ring-amber-400 mb-4">
              <span className="text-2xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                SG
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              SCHOLARLYGATOR
            </h1>
            <h2 className="mt-2 text-xl font-bold text-purple-800">CREATE ACCOUNT</h2>
          </div>

          <div className="grid gap-5">
            <label className="block">
              <div className="text-sm font-semibold text-purple-900 mb-2">Email:</div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@sfsu.edu"
                className={inputStyle}
                required
              />
              {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-semibold text-purple-900 mb-2">First Name:</div>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="John"
                  className={inputStyle}
                  required
                />
                {errors.firstName && <p className="text-xs text-red-600 mt-1.5">{errors.firstName}</p>}
              </label>

              <label className="block">
                <div className="text-sm font-semibold text-purple-900 mb-2">Last Name:</div>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Smith"
                  className={inputStyle}
                  required
                />
                {errors.lastName && <p className="text-xs text-red-600 mt-1.5">{errors.lastName}</p>}
              </label>
            </div>

            <label className="block">
              <div className="text-sm font-semibold text-purple-900 mb-2">Password:</div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                className={inputStyle}
                required
              />
              {errors.password && <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>}
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-purple-900 mb-2">Confirm Password:</div>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="••••••••"
                className={inputStyle}
                required
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1.5">{errors.confirmPassword}</p>
              )}
            </label>

            <label className="inline-flex items-start gap-2 text-sm text-slate-700 cursor-pointer bg-purple-50 p-3 rounded-lg border border-purple-200">
              <input
                type="checkbox"
                checked={form.acceptTos}
                onChange={(e) => update("acceptTos", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span>
                I agree to the{" "}
                <span className="font-semibold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.acceptTos && <p className="text-xs text-red-600">{errors.acceptTos}</p>}

            {serverMsg && (
              <div
                className={`rounded-xl border-2 px-4 py-3 text-sm flex items-start gap-2 ${
                  serverMsg.startsWith("✓")
                    ? "border-green-300 bg-green-50 text-green-900"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
              >
                <span className="text-lg">{serverMsg.startsWith("✓") ? "✓" : "⚠️"}</span>
                <span>{serverMsg}</span>
              </div>
            )}

            <button
              onClick={onSubmit}
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white font-bold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>

            <p className="text-sm text-slate-700 text-center">
              Already have an account?{" "}
              <button 
                onClick={() => setShowLogin(true)}
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}