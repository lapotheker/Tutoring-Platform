import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import logo from "../../assets/logo.svg";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};
const TIMES = ["Morning", "Afternoon", "Evening"];

export default function EditTutorProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    profilePhotoUrl: "",
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

  // Get logged-in user
  const demoUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  // Fetch existing tutor profile
  useEffect(() => {
    async function fetchProfile() {
      if (!demoUser?.user_id) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tutors/profile/by-user/${demoUser.user_id}`);
        const data = await response.json();

        if (data.success && data.data) {
          const profile = data.data;
          setTutorProfile(profile);

          // Fetch full details to get courses, subjects, languages, availability
          const detailResponse = await fetch(`${API_BASE_URL}/tutors/${profile.tutor_profile_id}`);
          const detailData = await detailResponse.json();

          if (detailData.success && detailData.data) {
            const details = detailData.data;

            // Pre-populate form with existing data
            const availabilityState = DAYS.reduce((acc, day) => {
              acc[day] = TIMES.reduce((tAcc, t) => {
                tAcc[t] = false;
                return tAcc;
              }, {});
              return acc;
            }, {});

            // Parse availability from the backend
            if (details.availability && Array.isArray(details.availability)) {
              details.availability.forEach((slot) => {
                const dayKey = Object.keys(DAY_NAMES).find(
                  (k) => DAY_NAMES[k] === slot.day_of_week
                );
                if (dayKey && slot.time_slot && availabilityState[dayKey]) {
                  availabilityState[dayKey][slot.time_slot] = true;
                }
              });
            }

            setForm({
              fullName: details.display_name || "",
              profilePhotoUrl: details.profile_photo || "",
              courses: details.courses || "",
              subjectTags: details.subject_tags || "",
              languages: details.languages || "",
              hourlyRate: details.hourly_rate ? String(details.hourly_rate) : "",
              availability: availabilityState,
            });
          }
        } else {
          // No profile exists
          navigate("/tutor/posting");
        }
      } catch (error) {
        console.error("Error fetching tutor profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [demoUser, navigate]);

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
    if (!form.hourlyRate) e.hourlyRate = "Hourly rate is required.";
    else if (Number(form.hourlyRate) <= 0) e.hourlyRate = "Hourly rate must be positive.";

    if (form.profilePhotoUrl && !form.profilePhotoUrl.startsWith("http")) {
      e.profilePhotoUrl = "Profile photo must be a valid URL starting with http:// or https://";
    }

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
      tutorUserId: demoUser?.user_id,
      fullName: form.fullName,
      profilePhotoUrl: form.profilePhotoUrl || null,
      hourlyRate: Number(form.hourlyRate),
      courses: form.courses.trim(),
      subjects: form.subjectTags.trim(),
      languages: form.languages.trim(),
      availability: availabilityPayload,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/tutors/profile/${tutorProfile.tutor_profile_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSavedMsg("✓ Your tutor profile has been updated successfully!");
        setTimeout(() => navigate("/tutor/dashboard"), 2000);
      } else {
        alert(data.error || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating tutor profile:", err);
      alert("Network error – please try again.");
    }
  }

  const inputClass =
    "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";
  const labelClass = "block text-sm font-bold text-purple-900 mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12 flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl shadow-purple-200/50 max-w-3xl mx-auto">
        <Link
          to="/tutor/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center mb-4">
            <img src={logo} alt="ScholarlyGator Logo" className="h-full w-full object-contain" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent text-center">
            Edit Tutor Profile
          </h1>
          <p className="text-sm text-purple-600 font-medium mt-1">
            Update your tutoring information (no admin approval needed)
          </p>
        </div>

        {savedMsg && (
          <div className="mb-6 rounded-xl border-2 border-green-300 bg-green-50 p-4 flex items-start gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm text-green-900 font-medium">{savedMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className={labelClass}>Display Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputClass}
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className={labelClass}>Profile Photo URL (optional)</label>
            <input
              type="url"
              value={form.profilePhotoUrl}
              onChange={(e) => update("profilePhotoUrl", e.target.value)}
              className={inputClass}
              placeholder="e.g., https://i.pravatar.cc/400"
            />
            <p className="mt-1.5 text-xs text-purple-600 font-medium">
              Use a public image URL. Leave blank for default avatar.
            </p>
            {errors.profilePhotoUrl && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.profilePhotoUrl}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Courses you tutor</label>
            <p className="text-xs text-purple-600 mb-2 font-medium">
              Example: CSC 210, CSC 220, MATH 227
            </p>
            <textarea
              rows={2}
              value={form.courses}
              onChange={(e) => update("courses", e.target.value)}
              className={inputClass}
            />
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
          </div>

          <div>
            <label className={labelClass}>Languages you speak</label>
            <p className="text-xs text-purple-600 mb-2 font-medium">
              Example: English, Spanish, Mandarin
            </p>
            <input
              type="text"
              value={form.languages}
              onChange={(e) => update("languages", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hourly rate (USD) *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.hourlyRate}
              onChange={(e) => update("hourlyRate", e.target.value)}
              className="w-48 rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
            />
            {errors.hourlyRate && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.hourlyRate}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Weekly availability</label>
            <p className="text-xs text-purple-600 mb-3 font-medium">
              Select the days and general times you&apos;re available for tutoring.
            </p>

            <div className="space-y-3 bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl p-5 border-2 border-purple-200">
              {DAYS.map((day) => (
                <div key={day} className="flex items-start gap-3 text-sm">
                  <div className="w-28 font-bold text-purple-900 pt-2">{DAY_NAMES[day]}</div>
                  <div className="flex-1 space-y-2">
                    {[
                      { value: "Morning", label: "Morning (8am–12pm)" },
                      { value: "Afternoon", label: "Afternoon (12pm–5pm)" },
                      { value: "Evening", label: "Evening (5pm–10pm)" },
                    ].map((time) => (
                      <label key={time.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.availability[day][time.value]}
                          onChange={() => toggleAvailability(day, time.value)}
                          className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-purple-900">{time.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3 text-purple-900 font-bold shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transition-all"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/tutor/dashboard")}
              className="rounded-xl border-2 border-purple-300 bg-white px-6 py-3 text-purple-700 font-bold hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
