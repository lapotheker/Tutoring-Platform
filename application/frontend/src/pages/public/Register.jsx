import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
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

  async function onSubmit(e) {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${form.firstName} ${form.lastName}`,
          sfsu_email: form.email.toLowerCase(),
          password: form.password,
          role: 1, // Student role
        }),
      });

      const data = await response.json();

      if (data.success) {
        setServerMsg("✓ Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setServerMsg(data.error || "Registration failed");
      }
    } catch (err) {
      setServerMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
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
          <h2 className="mt-2 text-lg font-bold">CREATE ACCOUNT</h2>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="block">
            <div className="text-sm text-slate-700 mb-1">Email:</div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@sfsu.edu"
              className={inputStyle}
              required
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-700 mb-1">First Name:</div>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="John"
                className={inputStyle}
                required
              />
              {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
            </label>

            <label className="block">
              <div className="text-sm text-slate-700 mb-1">Last Name:</div>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Smith"
                className={inputStyle}
                required
              />
              {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
            </label>
          </div>

          <label className="block">
            <div className="text-sm text-slate-700 mb-1">Password:</div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
              className={inputStyle}
              required
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </label>

          <label className="block">
            <div className="text-sm text-slate-700 mb-1">Confirm Password:</div>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className={inputStyle}
              required
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </label>

          <label className="inline-flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.acceptTos}
              onChange={(e) => update("acceptTos", e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTos && <p className="text-xs text-red-600">{errors.acceptTos}</p>}

          {serverMsg && (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                serverMsg.startsWith("✓")
                  ? "border-green-300 bg-green-50 text-green-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              }`}
            >
              {serverMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating Account..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-sm text-slate-700 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
