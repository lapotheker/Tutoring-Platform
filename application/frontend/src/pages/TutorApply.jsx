// src/pages/TutorApply.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TutorApply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subjects: "",
    rate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // Check login (same as RequestSession.jsx)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("demoUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      const next = encodeURIComponent("/tutor/apply");
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [user, navigate]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    // Demo only: no backend
    setSubmitted(true);
  }

  if (!user) return null;

  return (
    <section className="space-y-6">
      {!submitted ? (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 max-w-xl"
        >
          <h1 className="text-2xl font-bold">Become a Tutor</h1>
          <p className="text-slate-600 text-sm mt-1">
            Submit your details to apply as an SFSU Tutor. Applications are manually reviewed by
            admins (demo only).
          </p>

          <div className="mt-4 grid gap-4">
            <Field label="Full Name">
              <input name="name" value={form.name} onChange={onChange} className="ipt" required />
            </Field>

            <Field label="Email (must be @sfsu.edu)">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="ipt"
                required
              />
            </Field>

            <Field label="Subjects / Courses">
              <input
                name="subjects"
                value={form.subjects}
                onChange={onChange}
                className="ipt"
                placeholder="CSC 415, Math 227…"
              />
            </Field>

            <Field label="Rate ($/hr)">
              <input
                name="rate"
                type="number"
                min="0"
                step="1"
                value={form.rate}
                onChange={onChange}
                className="ipt"
              />
            </Field>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-white font-medium hover:bg-black"
            >
              Submit
            </button>
            <Link
              to="/tutor"
              className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 text-sm hover:bg-slate-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 p-6 max-w-xl">
          <h2 className="text-xl font-semibold">Application Submitted</h2>
          <p className="mt-2 text-sm">
            Thank you, {form.name || "Tutor"}! Your tutor profile is now <b>Pending Review</b>.
            Admin approval is required before your listing appears publicly.
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              to="/tutor"
              className="rounded-xl bg-slate-900 px-4 py-2 text-white text-sm hover:bg-black"
            >
              Back to Tutor Home
            </Link>
            <Link
              to="/tutor/search"
              className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 text-sm hover:bg-slate-200"
            >
              View Tutors
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}
