// src/pages/tutor/TutorProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tutorAPI, API_BASE_URL } from "../../services/api";
import defaultProfileImage from "../../assets/default-profile.jpg";

export default function TutorProfile() {
  const { id } = useParams(); // route: /tutors/:id
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logged-in user (student)
  const demoUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") ||
          sessionStorage.getItem("demoUser") ||
          "null"
      );
    } catch {
      return null;
    }
  }, []);

  // If backend returns relative file paths (e.g. "/uploads/x.jpg"), build a full URL.
  // If it's already http(s), return as-is.
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return defaultProfileImage;
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://"))
      return photoPath;

    const baseUrl = import.meta.env.VITE_API_URL || API_BASE_URL || "";
    return `${baseUrl}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
  };

  // Fetch tutor
  useEffect(() => {
    async function fetchTutor() {
      setLoading(true);
      setError(null);

      try {
        const res = await tutorAPI.getTutorById(id);
        if (res?.success) setData(res.data);
        else setError(res?.error || "Tutor not found");
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTutor();
  }, [id]);

  // Format time like "13:00:00" -> "1:00PM"
  function formatTime(timeStr) {
    if (!timeStr) return "";
    const [hStr, mStr = "00"] = String(timeStr).split(":");
    let h = Number(hStr);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${mStr}${ampm}`;
  }

  // Group availability by day (Monday..Sunday)
  const availabilityByDay = useMemo(() => {
    if (!data?.availability || !Array.isArray(data.availability)) return {};

    const grouped = {};
    for (const slot of data.availability) {
      const day = slot.day_of_week || "Other";
      grouped[day] ??= [];
      grouped[day].push(slot);
    }

    // Sort by time_start if present
    Object.values(grouped).forEach((slots) => {
      slots.sort((a, b) =>
        String(a.time_start || "").localeCompare(String(b.time_start || ""))
      );
    });

    return grouped;
  }, [data]);

  // Contact (login-safe + preserves filters + adds ?to=name)
  function handleContact() {
    if (!demoUser) {
      const next = encodeURIComponent(`/tutor/request/${id}`);
      navigate(`/login?next=${next}`);
      return;
    }

    const params = new URLSearchParams(search);
    if (data?.display_name) params.set("to", data.display_name);

    navigate({
      pathname: `/tutor/request/${id}`,
      search: `?${params.toString()}`,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">
            {error || "Profile not found"}
          </p>
          <Link
            to={{ pathname: "/results", search }}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← Back to Results
          </Link>
        </div>
      </div>
    );
  }

  const orderedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50">
          <Link
            to={{ pathname: "/results", search }}
            className="inline-flex items-center gap-1 mb-6 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← BACK TO RESULTS
          </Link>

          {/* Header */}
          <div className="flex items-start gap-5 mb-8">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden shadow-md border-2 border-amber-500 flex-shrink-0 bg-purple-50">
              <img
                src={getProfilePhotoUrl(data.profile_photo)}
                alt={data.display_name || "Tutor profile"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultProfileImage;
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                {(data.display_name || "").toUpperCase()}
              </h1>

              <div className="text-sm text-purple-600 font-medium mt-1">
                {data.sfsu_email}
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-2xl font-bold text-amber-600">
                ${data.hourly_rate}
                <span className="text-base font-medium text-slate-600">
                  /hour
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            {/* Left */}
            <div className="space-y-5">
              <Info label="Courses Covered" value={data.courses} />
              <Info label="Subject Tags" value={data.subject_tags} />
              <Info label="Languages Spoken" value={data.languages} />
              <Info
                label="Tutoring Mode"
                value={data.mode || "Online & In-person"}
              />
            </div>

            {/* Right */}
            <aside className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 shadow-lg h-fit sticky top-6">
              <h2 className="text-lg font-bold text-purple-900 mb-4">
                Weekly Availability
              </h2>

              {Object.keys(availabilityByDay).length === 0 ? (
                <p className="text-sm text-purple-600">
                  No availability added yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {orderedDays
                    .filter((day) => availabilityByDay[day]?.length)
                    .map((day) => (
                      <div
                        key={day}
                        className="bg-white rounded-xl p-3 border border-purple-200 shadow-sm"
                      >
                        <div className="font-bold text-purple-900 mb-2 text-sm">
                          {day}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {availabilityByDay[day].map((slot) => (
                            <span
                              key={slot.availability_id}
                              className="inline-flex items-center rounded-full bg-purple-100 border border-purple-300 px-3 py-1 text-xs font-semibold text-purple-800"
                            >
                              {slot.time_start && slot.time_end
                                ? `${formatTime(slot.time_start)} – ${formatTime(
                                    slot.time_end
                                  )}`
                                : slot.time_slot || "Time not specified"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </aside>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleContact}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3 text-purple-900 font-bold shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transition-all"
            >
              CONTACT TUTOR
            </button>

            <button
              className="rounded-xl border-2 border-red-300 bg-white px-8 py-3 text-red-700 font-bold hover:bg-red-50 hover:border-red-400 transition-all shadow-sm cursor-not-allowed opacity-60"
              title="Report feature not yet implemented"
              disabled
            >
              REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
      <div className="font-bold text-purple-900 mb-2">{label}</div>
      <div className="text-sm text-slate-700">{value || "N/A"}</div>
    </div>
  );
}
