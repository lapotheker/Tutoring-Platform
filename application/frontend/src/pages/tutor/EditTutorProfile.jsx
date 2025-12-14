// src/pages/tutor/EditTutorProfile.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

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
    else if (Number(form.hourlyRate) <= 0) e.hourlyRate = "Hourly rate must be positive.";

    const anySlotSelected = DAYS.some((day) => TIMES.some((t) => form.availability[day][t]));
    if (!anySlotSelected) e.availability = "Select at least one availability slot.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSavedMsg("");

    if (!validate()) return;

    const availabilityPayload = [];
    for (const day of DAYS) {
      for (const slot of TIMES) {
        if (form.availability[day][slot]) {
          availabilityPayload.push({ day, slot });
        }
      }
    }

    const payload = {
      fullName: "Updated Tutor Profile",
      hourlyRate: Number(form.hourlyRate),
      courses: form.courses.trim(),
      subjects: form.subjectTags.trim(),
      availability: availabilityPayload,
      bio: "",
      mode: "Online",
    };

    try {
      const res = await fetch(`${API_BASE_URL}/tutors/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSavedMsg("Your updated tutor profile has been resubmitted for admin review.");
      } else {
        alert(data.error || "Failed to submit profile. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting tutor profile:", err);
      alert("Network error – please try again.");
    }
  }

  const inputClass = "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";
  const labelClass = "block text-sm font-bold text-purple-900 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl shadow-purple-200/50 max-w-3xl mx-auto">
        <Link
          to="/tutor/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ring-2 ring-amber-400">
            <span className="text-2xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              SG
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Edit Tutor Profile
            </h1>
            <p className="text-sm text-purple-600 font-medium">
              Update your tutoring information
            </p>
          </div>
        </div>

        {savedMsg && (
          <div className="mb-6 rounded-xl border-2 border-green-300 bg-green-50 p-4 flex items-start gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm text-green-900 font-medium">{savedMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className={labelClass}>Courses you tutor</label>
            <p className="text-xs text-purple-600 mb-2 font-medium">Example: CSC 210, CSC 220, MATH 227</p>
            <textarea
              rows={2}
              value={form.courses}
              onChange={(e) => update("courses", e.target.value)}
              className={inputClass}
            />
            {errors.courses && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.courses}</p>}
          </div>

          <div>
            <label className={labelClass}>Subjects / topics</label>
            <p className="text-xs text-purple-600 mb-2 font-medium">
              Example: Web development, Data structures, Calculus
            </p>
            <textarea
              rows={2}
              value={form.subjectTags}
              onChange={(e) => update("subjectTags", e.target.value)}
              className={inputClass}
            />
            {errors.subjectTags && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.subjectTags}</p>}
          </div>

          <div>
            <label className={labelClass}>Languages you speak</label>
            <p className="text-xs text-purple-600 mb-2 font-medium">Example: English, Spanish, Mandarin</p>
            <input
              type="text"
              value={form.languages}
              onChange={(e) => update("languages", e.target.value)}
              className={inputClass}
            />
            {errors.languages && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.languages}</p>}
          </div>

          <div>
            <label className={labelClass}>Hourly rate (USD)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.hourlyRate}
              onChange={(e) => update("hourlyRate", e.target.value)}
              className="w-48 rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
            />
            {errors.hourlyRate && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.hourlyRate}</p>}
          </div>

          <div>
            <label className={labelClass}>Weekly availability</label>
            <p className="text-xs text-purple-600 mb-3 font-medium">
              Select the days and general times you&apos;re available for tutoring.
            </p>

            <div className="space-y-3 bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl p-5 border-2 border-purple-200">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <div className="w-28 font-bold text-purple-900">{day}</div>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleAvailability(day, slot)}
                        className={`rounded-full border-2 px-4 py-1.5 font-semibold transition-all shadow-sm ${
                          form.availability[day][slot]
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-700 shadow-md"
                            : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
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
              <p className="mt-2 text-xs text-red-600 font-medium">{errors.availability}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3 text-purple-900 font-bold shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}