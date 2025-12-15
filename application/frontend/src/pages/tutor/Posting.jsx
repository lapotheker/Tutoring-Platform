import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import logo from "../../assets/logo.svg";

export default function Posting() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    profilePhotoUrl: "",
    bio: "",
    subjects: "",
    courses: "",
    languages: "",
    hourlyRate: "",
    mode: "online",
    availabilityDays: [],
    availabilityTimes: [],
    contactMethod: "platform",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const inputClass =
    "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";
  const labelClass = "block text-sm font-bold text-purple-900 mb-2";
  const errClass = "mt-1.5 text-xs text-red-600 font-medium";

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    if (!form.subjects.trim()) e.subjects = "Enter at least one subject";
    if (!form.courses.trim()) e.courses = "Enter at least one course";
    if (!form.languages.trim()) e.languages = "Enter at least one language";
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0)
      e.hourlyRate = "Enter a valid hourly rate";
    if (form.availabilityDays.length === 0) e.availabilityDays = "Select at least one day";
    if (form.availabilityTimes.length === 0) e.availabilityTimes = "Select at least one time slot";

    // Validate profile photo URL if provided
    if (
      form.profilePhotoUrl &&
      !form.profilePhotoUrl.startsWith("http://") &&
      !form.profilePhotoUrl.startsWith("https://")
    ) {
      e.profilePhotoUrl = "Profile photo must be a valid URL starting with http:// or https://";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setMessage("Submitting profile...");

    try {
      // Get the logged-in user's ID
      const demoUser = JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "{}"
      );
      const tutorUserId = demoUser?.user_id || demoUser?.id;

      if (!tutorUserId) {
        setMessage("Failed: You must be logged in to create a profile");
        return;
      }

      // Build structured availability array
      const availabilityArray = [];
      const dayMapping = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
        Sun: "Sunday",
      };

      const timeSlotMapping = {
        morning: {
          slot: "Morning",
          start: "09:00:00",
          end: "12:00:00",
        },
        afternoon: {
          slot: "Afternoon",
          start: "13:00:00",
          end: "17:00:00",
        },
        evening: {
          slot: "Evening",
          start: "18:00:00",
          end: "22:00:00",
        },
      };

      form.availabilityDays.forEach((day) => {
        form.availabilityTimes.forEach((time) => {
          const timeInfo = timeSlotMapping[time];
          availabilityArray.push({
            day_of_week: dayMapping[day],
            time_slot: timeInfo.slot,
            time_start: timeInfo.start,
            time_end: timeInfo.end,
          });
        });
      });

      const response = await fetch(`${API_BASE_URL}/tutors/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorUserId: tutorUserId,
          fullName: form.fullName,
          profilePhotoUrl: form.profilePhotoUrl || null,
          bio: form.bio,
          subjects: form.subjects,
          courses: form.courses,
          languages: form.languages,
          hourlyRate: form.hourlyRate,
          mode: form.mode,
          availability: availabilityArray, // Send as structured array
          contactMethod: form.contactMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        navigate("/tutor/dashboard");
      } else {
        setMessage(
          "Failed to submit profile: " + (data?.error || data?.message || `HTTP ${response.status}`)
        );
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      setMessage("Network error - please try again");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/tutor/dashboard"
          className="inline-flex items-center gap-1 mb-4 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 space-y-6">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center mb-4">
              <img src={logo} alt="ScholarlyGator Logo" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              BECOME A TUTOR
            </h1>
            <p className="text-sm text-purple-600 font-medium mt-2">
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
              <label className={labelClass}>Profile Photo URL (optional)</label>
              <input
                type="url"
                className={inputClass}
                value={form.profilePhotoUrl}
                onChange={(e) => update("profilePhotoUrl", e.target.value)}
                placeholder="e.g., https://i.pravatar.cc/400 or https://images.unsplash.com/photo-..."
              />
              <p className="mt-1.5 text-xs text-purple-600 font-medium">
                Use a public image URL (Unsplash, Pravatar, etc.). Leave blank to use default
                avatar.
              </p>
              {errors.profilePhotoUrl && <p className={errClass}>{errors.profilePhotoUrl}</p>}
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
              <label className={labelClass}>Languages (comma-separated) *</label>
              <input
                className={inputClass}
                value={form.languages}
                onChange={(e) => update("languages", e.target.value)}
                placeholder="e.g., English, Spanish, Mandarin"
              />
              {errors.languages && <p className={errClass}>{errors.languages}</p>}
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
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all shadow-sm border-2 ${
                      form.availabilityDays.includes(day)
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-700 shadow-md"
                        : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
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
              <div className="space-y-2 mt-2 bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl p-4 border-2 border-purple-200">
                {[
                  { value: "morning", label: "Morning (8am–12pm)" },
                  { value: "afternoon", label: "Afternoon (12pm–5pm)" },
                  { value: "evening", label: "Evening (5pm–10pm)" },
                ].map((time) => (
                  <label key={time.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.availabilityTimes.includes(time.value)}
                      onChange={(e) => {
                        const times = e.target.checked
                          ? [...form.availabilityTimes, time.value]
                          : form.availabilityTimes.filter((t) => t !== time.value);
                        update("availabilityTimes", times);
                      }}
                      className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold text-purple-900">{time.label}</span>
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
                    profilePhotoUrl: "",
                    bio: "",
                    subjects: "",
                    courses: "",
                    languages: "",
                    hourlyRate: "",
                    mode: "online",
                    availabilityDays: [],
                    availabilityTimes: [],
                    contactMethod: "platform",
                  })
                }
                className="rounded-xl border-2 border-purple-300 bg-white px-6 py-2.5 text-purple-700 font-bold hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2.5 text-purple-900 font-bold shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transition-all"
              >
                Save Profile
              </button>
            </div>

            {message && (
              <div
                className={`rounded-xl border-2 px-4 py-3 flex items-start gap-2 text-sm ${
                  message.includes("successfully")
                    ? "border-green-300 bg-green-50 text-green-900"
                    : "border-red-300 bg-red-50 text-red-900"
                }`}
              >
                <span className="text-lg">{message.includes("successfully") ? "✓" : "⚠️"}</span>
                <span className="font-medium">{message}</span>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
