import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    roleStudent: false,
    roleTutor: false,
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

    // Email must be SFSU
    if (!form.email) e.email = "Email is required";
    else if (!/^[^@\s]+@sfsu\.edu$/i.test(form.email)) e.email = "Must use @sfsu.edu email";

    // Password
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";

    // Names
    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";

    // Role — enforce exactly one selection to match intent (two checkboxes in wireframe)
    const selected = Number(!!form.roleStudent) + Number(!!form.roleTutor);
    if (selected === 0) e.role = "Select a role";
    if (selected > 1) e.role = "Please choose only one role";

    // Terms
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
      // Hook up to your backend
      // const base = import.meta.env.VITE_API_BASE_URL || "";
      // const res = await fetch(`${base}/api/auth/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email: form.email.trim(),
      //     password: form.password,
      //     firstName: form.firstName.trim(),
      //     lastName: form.lastName.trim(),
      //     role: form.roleStudent ? "student" : "tutor",
      //     acceptTos: form.acceptTos,
      //   }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Registration failed");
      // setServerMsg("Registration successful. Please check your email.");

      // Demo fallback while backend isn't ready
      await new Promise((r) => setTimeout(r, 700));
      setServerMsg("Demo: submitted. Connect API to persist.");
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
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <h1 className="text-center text-2xl font-extrabold tracking-wide">REGISTER NEW ACCOUNT</h1>

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

        {/* Roles (checkboxes) */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">I am a:</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.roleStudent}
              onChange={(e) => update("roleStudent", e.target.checked)}
            />
            <span>Student seeking tutoring</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.roleTutor}
              onChange={(e) => update("roleTutor", e.target.checked)}
            />
            <span>Tutor offering services</span>
          </label>
          {errors.role && <p className={errClass}>{errors.role}</p>}
        </fieldset>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.acceptTos}
            onChange={(e) => update("acceptTos", e.target.checked)}
          />
          <span>
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
          <a className="underline" href="/login">
            Login
          </a>
        </p>

        {serverMsg && <p className="text-sm text-center mt-2">{serverMsg}</p>}
      </form>
    </section>
  );
}
