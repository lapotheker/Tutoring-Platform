// src/pages/tutor/EditTutorProfile.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["Morning", "Afternoon", "Evening"];

export default function EditTutorProfile() {
  const [form, setForm] = useState({
    courses: "",
    subjectTags: "",
    languages: "",
    hourlyRate: "",
    availability: DAYS.reduce((acc, day) => {
      acc[day] = TIMES.reduce((tAcc, t) => {
        tAcc[t] = false;
        return tAcc;
      }, {});
      return acc;
    }, {}),
  });

  const [errors, setErrors] = useState({});
  const [savedMsg, setSavedMsg] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleAvailability(day, slot) {
    setForm((f) => ({
      ...f,
      availability: {
        ...f.availability,
        [day]: { ...f.availability[day], [slot]: !f.availability[day][slot] },
      },
    }));
  }

  function validate() {
    const e = {};
    if (!form.courses.trim()) e.courses = "Please list at least one course.";
    if (!form.subjectTags.trim()) e.subjectTags = "Please list at least one subject.";
    if (!form.languages.trim()) e.languages = "Please list at least one language.";
    if (!form.hourlyRate) e.hourlyRate = "Hourly rate is required.";
    else if (Number(form.hourlyRate) <= 0) e.hourlyRate = "Hourly rate.";

    const anySlotSelected = DAYS.some((day) => TIMES.some((t) => form.availability[day][t]));
    if (!anySlotSelected) e.availability = "Select at least one availability slot.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Submit handler: validate form, build payload, and re-submit profile to backend
  async function handleSubmit(e) {
    e.preventDefault();
    setSavedMsg("");

    // Front-end validation only
    if (!validate()) return;

    // Build a simple availability payload for the backend
    // Each selected slot becomes { day, slot } (e.g. { day: "Monday", slot: "Morning" })
    const availabilityPayload = [];
    for (const day of DAYS) {
      for (const slot of TIMES) {
        if (form.availability[day][slot]) {
          availabilityPayload.push({ day, slot });
        }
      }
    }

    // Minimal payload that matches the existing createTutorProfile controller
    // fullName, hourlyRate, courses, subjects, availability, bio, mode
    const payload = {
      // A simple placeholder name for demo; can be replaced with real tutor name if available
      fullName: "Updated Tutor Profile",
      hourlyRate: Number(form.hourlyRate),
      courses: form.courses.trim(),
      subjects: form.subjectTags.trim(),
      availability: availabilityPayload,
      bio: "",
      mode: "Online",
    };

    try {
      // Call the existing POST /api/tutors/profile endpoint
      // This counts as "editing the profile and resubmitting for admin review"
      const res = await fetch("http://localhost:3000/api/tutors/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Show a clear message that the updated profile was re-submitted for review
        setSavedMsg("Your updated tutor profile has been resubmitted for admin review.");
      } else {
        alert(data.error || "Failed to submit profile. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting tutor profile:", err);
      alert("Network error – please try again.");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
      {/* Back to dashboard */}
      <Link
        to="/tutor/dashboard"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline mb-4"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide mb-2">Edit Tutor Profile</h1>
      <p className="text-sm text-slate-600 mb-6">
        Add the courses you tutor, your subjects, hourly rate, languages, and when you&apos;re
        available.
      </p>

      {savedMsg && <p className="mb-4 text-sm text-emerald-600">{savedMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Courses */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Courses you tutor</label>
          <p className="text-xs text-slate-500 mb-1">Example: CSC 210, CSC 220, MATH 227</p>
          <textarea
            rows={2}
            value={form.courses}
            onChange={(e) => update("courses", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.courses && <p className="mt-1 text-xs text-red-600">{errors.courses}</p>}
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Subjects / topics</label>
          <p className="text-xs text-slate-500 mb-1">
            Example: Web development, Data structures, Calculus
          </p>
          <textarea
            rows={2}
            value={form.subjectTags}
            onChange={(e) => update("subjectTags", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.subjectTags && <p className="mt-1 text-xs text-red-600">{errors.subjectTags}</p>}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Languages you speak
          </label>
          <p className="text-xs text-slate-500 mb-1">Example: English, Spanish, Mandarin</p>
          <input
            type="text"
            value={form.languages}
            onChange={(e) => update("languages", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.languages && <p className="mt-1 text-xs text-red-600">{errors.languages}</p>}
        </div>

        {/* Hourly rate */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Hourly rate (USD)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.hourlyRate}
            onChange={(e) => update("hourlyRate", e.target.value)}
            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.hourlyRate && <p className="mt-1 text-xs text-red-600">{errors.hourlyRate}</p>}
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Weekly availability
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Select the days and general times you&apos;re available for tutoring.
          </p>

          <div className="space-y-2">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3 text-sm">
                <div className="w-24 font-medium text-slate-700">{day}</div>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleAvailability(day, slot)}
                      className={`rounded-full border px-3 py-1 ${
                        form.availability[day][slot]
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.availability && (
            <p className="mt-2 text-xs text-red-600">{errors.availability}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Save profile
          </button>
        </div>
      </form>
    </section>
  );
}
