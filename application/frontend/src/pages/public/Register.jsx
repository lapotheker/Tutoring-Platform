// src/pages/public/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
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
      // In real app, this would call your API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fullName: `${form.firstName} ${form.lastName}`,
      //     email: form.email,
      //     password: form.password,
      //     role: 1, // Everyone registers as Student (role = 1)
      //   }),
      // });

      await new Promise((r) => setTimeout(r, 700)); // demo delay
      setServerMsg("Demo: Account created as Student. Connect API to persist.");
    } catch (err) {
      setServerMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700";
  const errClass = "mt-1 text-xs text-red-600";

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/"
        className="inline-block mb-3 text-slate-600 text-sm font-medium hover:text-blue-600"
      >
        ← Back to Home
      </Link>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <h1 className="text-center text-2xl font-extrabold tracking-wide">REGISTER NEW ACCOUNT</h1>
        <p className="text-center text-sm text-slate-600 mt-2">
          All users register as Students. You can upgrade to Tutor later.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@sfsu.edu"
              autoComplete="email"
            />
            <p className="text-xs text-slate-500 mt-1">(Must use @sfsu.edu email)</p>
            {errors.email && <p className={errClass}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500 mt-1">(Min. 8 characters)</p>
            {errors.password && <p className={errClass}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass} htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              className={inputClass}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className={errClass}>{errors.confirmPassword}</p>}
          </div>

          {/* First / Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="first">
                First Name
              </label>
              <input
                id="first"
                type="text"
                className={inputClass}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                autoComplete="given-name"
              />
              {errors.firstName && <p className={errClass}>{errors.firstName}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="last">
                Last Name
              </label>
              <input
                id="last"
                type="text"
                className={inputClass}
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                autoComplete="family-name"
              />
              {errors.lastName && <p className={errClass}>{errors.lastName}</p>}
            </div>
          </div>

          {/* Terms acceptance */}
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.acceptTos}
                onChange={(e) => update("acceptTos", e.target.checked)}
              />
              <span className="leading-tight">
                I agree to{" "}
                <a className="underline" href="/terms" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="underline" href="/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptTos && <p className={errClass}>{errors.acceptTos}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Registering..." : "REGISTER"}
          </button>

          {/* Footnote */}
          <p className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <Link className="underline text-blue-600 hover:no-underline" to="/login">
              Login
            </Link>
          </p>

          {serverMsg && <p className="text-sm text-center mt-2">{serverMsg}</p>}
        </form>
      </section>
    </div>
  );
}
