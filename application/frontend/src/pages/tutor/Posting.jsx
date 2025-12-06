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
    availabilityDays: [],
    availabilityTimes: [],
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
    if (form.availabilityDays.length === 0) e.availabilityDays = "Select at least one day";
    if (form.availabilityTimes.length === 0) e.availabilityTimes = "Select at least one time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setMessage("Submitting profile...");

    try {
      // Use absolute URL to your backend
      const response = await fetch("http://localhost:3000/api/tutors/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          bio: form.bio,
          subjects: form.subjects,
          courses: form.courses,
          hourlyRate: form.hourlyRate,
          mode: form.mode,
          availabilityDays: form.availabilityDays,
          availabilityTimes: form.availabilityTimes,
          contactMethod: form.contactMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profile submitted successfully! Awaiting admin approval.");
        // Clear form
        setForm({
          fullName: "",
          bio: "",
          subjects: "",
          courses: "",
          hourlyRate: "",
          mode: "online",
          availabilityDays: [],
          availabilityTimes: [],
          contactMethod: "platform",
        });
      } else {
        setMessage("Failed to submit profile: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      setMessage("Network error - please try again");
    }
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
              onChange={(e) => update("mode", e.target.value)}
            >
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className={labelClass}>Available Days *</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const days = form.availabilityDays.includes(day)
                      ? form.availabilityDays.filter((d) => d !== day)
                      : [...form.availabilityDays, day];
                    update("availabilityDays", days);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    form.availabilityDays.includes(day)
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.availabilityDays && <p className={errClass}>{errors.availabilityDays}</p>}
          </div>

          <div>
            <label className={labelClass}>Available Times *</label>
            <div className="space-y-2 mt-2">
              {[
                { value: "morning", label: "Morning (8am–12pm)" },
                { value: "afternoon", label: "Afternoon (12pm–5pm)" },
                { value: "evening", label: "Evening (5pm–10pm)" },
              ].map((time) => (
                <label key={time.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.availabilityTimes.includes(time.value)}
                    onChange={(e) => {
                      const times = e.target.checked
                        ? [...form.availabilityTimes, time.value]
                        : form.availabilityTimes.filter((t) => t !== time.value);
                      update("availabilityTimes", times);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{time.label}</span>
                </label>
              ))}
            </div>
            {errors.availabilityTimes && <p className={errClass}>{errors.availabilityTimes}</p>}
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
                  availabilityDays: [],
                  availabilityTimes: [],
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