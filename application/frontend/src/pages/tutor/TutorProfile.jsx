// src/pages/tutor/TutorProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tutorAPI } from "../../services/api";
import defaultProfileImage from "../../assets/default-profile.jpg";

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const demoUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  function formatTime(timeStr) {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(":");
    let h = Number(hStr);
    const minutes = mStr ?? "00";
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${minutes}${period}`;
  }

  const availabilityByDay = useMemo(() => {
    if (!data?.availability || !Array.isArray(data.availability)) return {};

    const grouped = {};
    for (const slot of data.availability) {
      const day = slot.day_of_week || "Other";
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(slot);
    }

    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        const aTime = a.time_start || "";
        const bTime = b.time_start || "";
        return String(aTime).localeCompare(String(bTime));
      });
    });

    return grouped;
  }, [data]);

  useEffect(() => {
    async function fetchTutor() {
      setLoading(true);
      setError(null);

      try {
        const response = await tutorAPI.getTutorById(id);

        if (response.success) {
          setData(response.data);
        } else {
          setError("Tutor not found");
        }
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTutor();
    }
  }, [id]);

  function handleContact() {
    if (!demoUser) {
      const next = encodeURIComponent(`/tutor/request/${id}`);
      navigate(`/login?next=${next}`);
    } else {
      navigate({ pathname: `/tutor/request/${id}`, search });
    }
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
          <p className="text-red-600 font-medium mb-4">{error || "Profile not found"}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50">
          <Link
            to={{ pathname: "/results", search }}
            className="inline-flex items-center gap-1 mb-6 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← BACK TO RESULTS
          </Link>

          {/* Header row: avatar + info */}
          <div className="flex items-start gap-5 mb-8">
            <div
              className={`h-24 w-24 md:h-28 md:w-28 rounded-2xl grid place-items-center overflow-hidden shadow-md border-2 flex-shrink-0 ${
                data.profile_photo
                  ? "bg-purple-700 border-amber-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            >
              <img
                src={data.profile_photo || defaultProfileImage}
                alt={data.display_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultProfileImage;
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                {data.display_name?.toUpperCase()}
              </h1>
              <div className="text-sm text-purple-600 font-medium mt-1">{data.sfsu_email}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-2xl font-bold text-amber-600">
                ${data.hourly_rate}
                <span className="text-base font-medium text-slate-600">/hour</span>
              </div>
            </div>
          </div>

          {/* Body: left info + right availability */}
          <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            {/* Left column: core info */}
            <div className="space-y-5">
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2">Courses Covered</div>
                <div className="text-sm text-slate-700">{data.courses || "N/A"}</div>
              </div>

              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2">Subject Tags</div>
                <div className="text-sm text-slate-700">{data.subject_tags || "N/A"}</div>
              </div>

              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2">Languages Spoken</div>
                <div className="text-sm text-slate-700">{data.languages || "N/A"}</div>
              </div>

              {/* Tutoring Mode */}
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2">Tutoring Mode</div>
                <div className="text-sm text-slate-700">
                  {data.mode || "Online and In-person available"}
                </div>
              </div>
            </div>

            {/* Right column: structured Weekly Availability */}
            <aside className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 shadow-lg h-fit sticky top-6">
              <h2 className="text-lg font-bold text-purple-900 mb-4">Weekly Availability</h2>

              {Object.keys(availabilityByDay).length === 0 ? (
                <p className="text-sm text-purple-600">
                  This tutor has not added detailed availability yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {/* Standard Monday–Sunday order */}
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                    .filter((day) => availabilityByDay[day])
                    .map((day) => {
                      const slots = availabilityByDay[day];
                      if (!slots || slots.length === 0) return null;

                      return (
                        <div
                          key={day}
                          className="bg-white rounded-xl p-3 border border-purple-200 shadow-sm"
                        >
                          <div className="font-bold text-purple-900 mb-2 text-sm">{day}</div>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => {
                              const start = slot.time_start;
                              const end = slot.time_end;
                              const hasRange = start && end;
                              const label = slot.time_slot;

                              return (
                                <span
                                  key={slot.availability_id}
                                  className="inline-flex items-center rounded-full bg-purple-100 border border-purple-300 px-3 py-1 text-xs font-semibold text-purple-800"
                                >
                                  {hasRange
                                    ? `${formatTime(start)} – ${formatTime(end)}`
                                    : label || "Time not specified"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </aside>
          </div>

          {/* Contact and Report buttons */}
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
            >
              REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
