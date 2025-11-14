import { useState } from "react";
import { Link } from "react-router-dom";

export default function Posting() {
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    subjects: "",
    courses: "",
    hourlyRate: "",
    mode: "online",
    availability: "",
    contactMethod: "platform",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700";
  const errClass = "mt-1 text-xs text-red-600";

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    if (!form.subjects.trim()) e.subjects = "Enter at least one subject";
    if (!form.courses.trim()) e.courses = "Enter at least one course";
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0)
      e.hourlyRate = "Enter a valid hourly rate";
    if (!form.availability.trim()) e.availability = "Availability summary required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    console.log("Tutor Profile (Mock POST):", form);
    setMessage("Profile saved locally (M3 demo). Check console output.");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/tutor/dashboard"
        className="inline-block mb-3 text-slate-600 text-sm font-medium hover:text-blue-600"
      >
        ← Back to Dashboard
      </Link>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-wide">BECOME A TUTOR / UPDATE PROFILE</h1>
          <p className="text-sm text-slate-600 mt-1">
            Provide your teaching information so students can find you
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Basic Info */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g., John Doe"
            />
            {errors.fullName && <p className={errClass}>{errors.fullName}</p>}
          </div>

          <div>
            <label className={labelClass}>Short Bio *</label>
            <textarea
              className={inputClass + " min-h-24"}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Describe your background, experience, and teaching approach..."
            />
            {errors.bio && <p className={errClass}>{errors.bio}</p>}
          </div>

          {/* Teaching Info */}
          <div>
            <label className={labelClass}>Subjects (comma-separated) *</label>
            <input
              className={inputClass}
              value={form.subjects}
              onChange={(e) => update("subjects", e.target.value)}
              placeholder="e.g., Math, Physics, Computer Science"
            />
            {errors.subjects && <p className={errClass}>{errors.subjects}</p>}
          </div>

          <div>
            <label className={labelClass}>Courses Taught (comma-separated) *</label>
            <input
              className={inputClass}
              value={form.courses}
              onChange={(e) => update("courses", e.target.value)}
              placeholder="e.g., CSC 210, CSC 648"
            />
            {errors.courses && <p className={errClass}>{errors.courses}</p>}
          </div>

          <div>
            <label className={labelClass}>Hourly Rate (USD) *</label>
            <input
              type="number"
              className={inputClass}
              value={form.hourlyRate}
              onChange={(e) => update("hourlyRate", e.target.value)}
              placeholder="e.g., 35"
            />
            {errors.hourlyRate && <p className={errClass}>{errors.hourlyRate}</p>}
          </div>

          <div>
            <label className={labelClass}>Preference</label>
            <select
              className={inputClass}
              value={form.mode}
              onChange={(e) => update("Preference", e.target.value)}
            >
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className={labelClass}>Availability Summary *</label>
            <textarea
              className={inputClass + " min-h-20"}
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
              placeholder="e.g., Weekdays after 6pm; Weekends 10am–3pm"
            />
            {errors.availability && <p className={errClass}>{errors.availability}</p>}
          </div>

          {/* Contact Method */}
          <div>
            <label className={labelClass}>Preferred Contact</label>
            <select
              className={inputClass}
              value={form.contactMethod}
              onChange={(e) => update("contactMethod", e.target.value)}
            >
              <option value="platform">Platform Messaging</option>
              <option value="email_mask">Email (masked)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() =>
                setForm({
                  fullName: "",
                  bio: "",
                  subjects: "",
                  courses: "",
                  hourlyRate: "",
                  mode: "online",
                  availability: "",
                  contactMethod: "platform",
                })
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>

          {message && (
            <div className="rounded-xl border border-green-300 bg-green-50 text-green-800 text-sm px-3 py-2">
              {message}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
