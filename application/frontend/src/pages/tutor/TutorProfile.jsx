// src/pages/tutor/TutorProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tutorAPI } from "../../services/api";

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const backHref = useMemo(() => ({ pathname: "/results", search }), [search]);

  function goContact() {
    const params = new URLSearchParams(search);
    if (data?.display_name) {
      params.set("to", data.display_name);
    }
    navigate({
      pathname: `/tutor/request/${data.tutor_profile_id}`,
      search: `?${params.toString()}`,
    });
  }

  function handleReport() {
    alert("Thank you. Your report about this tutor profile has been submitted for review.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
        <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 max-w-5xl mx-auto">
          <div className="text-sm text-purple-600 font-medium flex items-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            Loading tutor profile...
          </div>
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
        <section className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 max-w-5xl mx-auto">
          <div className="text-sm text-red-600 font-medium">{error || "Tutor not found."}</div>
          <div className="mt-4">
            <Link to={backHref} className="text-purple-600 font-semibold hover:text-purple-800 hover:underline">
              Back to Results
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50">
          {/* Back to result list */}
          <Link to={backHref} className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mb-6">
            ← BACK TO RESULTS
          </Link>

          {/* Header row: avatar + names */}
          <div className="flex items-start gap-5 mb-8">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 grid place-items-center text-white text-4xl overflow-hidden shadow-lg ring-4 ring-amber-400 flex-shrink-0">
              {data.profile_photo ? (
                <img
                  src={data.profile_photo}
                  alt={data.display_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                "&#128100;"
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                {data.display_name?.toUpperCase()}
              </h1>
              <div className="text-lg text-slate-700 font-medium mt-1">{data.full_name}</div>
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
                <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">&#128218;</span>
                  Courses Covered
                </div>
                <div className="text-sm text-slate-700">{data.courses || "N/A"}</div>
              </div>

              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">&#127919;</span>
                  Subject Tags
                </div>
                <div className="text-sm text-slate-700">{data.subject_tags || "N/A"}</div>
              </div>

              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">&#127760;</span>
                  Languages Spoken
                </div>
                <div className="text-sm text-slate-700">{data.languages || "N/A"}</div>
              </div>

              {/* Text-based summary for backward compatibility */}
              {data.availability_summary && (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5">
                  <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">&#128197;</span>
                    Availability Summary
                  </div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{data.availability_summary}</div>
                </div>
              )}
            </div>

            {/* Right column: structured Weekly Availability */}
            <aside className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 shadow-lg h-fit sticky top-6">
              <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span className="text-xl">&#128197;</span>
                Weekly Availability
              </h2>

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
                        <div key={day} className="bg-white rounded-xl p-3 border border-purple-200 shadow-sm">
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

                  {/* Any non-standard day strings */}
                  {Object.keys(availabilityByDay)
                    .filter(
                      (day) =>
                        ![
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].includes(day)
                    )
                    .map((day) => {
                      const slots = availabilityByDay[day];
                      return (
                        <div key={day} className="bg-white rounded-xl p-3 border border-purple-200 shadow-sm">
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

          {/* Actions: contact + simple report */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={goContact}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-bold text-white shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transition-all"
            >
              CONTACT TUTOR
            </button>

            <button
              onClick={handleReport}
              className="inline-flex items-center justify-center rounded-xl border-2 border-red-300 bg-white px-6 py-3 font-bold text-red-600 hover:bg-red-50 hover:border-red-400 transition-all shadow-sm"
            >
              REPORT TUTOR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
