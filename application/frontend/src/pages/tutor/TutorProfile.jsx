// src/pages/tutor/TutorProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tutorAPI } from "../../services/api";

export default function TutorProfile() {
  const { id } = useParams(); // route: /tutors/:id
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState(null); // full tutor record from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format time
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

  // Group availability slots by day of the week
  const availabilityByDay = useMemo(() => {
    if (!data?.availability || !Array.isArray(data.availability)) return {};

    const grouped = {};
    for (const slot of data.availability) {
      const day = slot.day_of_week || "Other";
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(slot);
    }

    // Sort each day's slots by start time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        const aTime = a.time_start || "";
        const bTime = b.time_start || "";
        return String(aTime).localeCompare(String(bTime));
      });
    });

    return grouped;
  }, [data]);

  // Fetch tutor data when component mounts or id changes
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

  // Preserve original search params so "Back to Results" restores previous filters
  const backHref = useMemo(() => ({ pathname: "/results", search }), [search]);

  // Navigate to contact/request page for this tutor
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

  // Simple "Report tutor" handler (front-end only for now)
  function handleReport() {
    // Minimal implementation: show confirmation to the student.
    // This is enough to demonstrate the "report tutor profile" requirement.
    alert("Thank you. Your report about this tutor profile has been submitted for review.");
  }

  // Loading / error states
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">Loading tutor profile...</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">{error || "Tutor not found."}</div>
        <div className="mt-3">
          <Link to={backHref} className="text-blue-600 hover:underline">
            Back to Results
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        {/* Back to result list */}
        <Link to={backHref} className="text-sm font-medium text-blue-600 hover:underline">
          &lt; BACK TO RESULTS
        </Link>

        {/* Header row: avatar + names */}
        <div className="mt-4 flex items-start gap-4">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-3xl overflow-hidden">
            {data.profile_photo && (
              <img
                src={data.profile_photo}
                alt={data.display_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // If image URL is broken, hide img and show fallback icon
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {!data.profile_photo && "👤"}
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-wide">
              {data.display_name?.toUpperCase()}
            </h1>
            <div className="text-sm text-slate-700">{data.full_name}</div>
          </div>
        </div>

        {/* Body: left info + right availability */}
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Left column: core info */}
          <div className="space-y-4 max-w-2xl">
            <div>
              <div className="font-semibold">Hourly Rate</div>
              <div>${data.hourly_rate}/hour</div>
            </div>

            <div>
              <div className="font-semibold">Courses Covered</div>
              <div className="text-sm">{data.courses || "N/A"}</div>
            </div>

            <div>
              <div className="font-semibold">Subject Tags</div>
              <div className="text-sm">{data.subject_tags || "N/A"}</div>
            </div>

            <div>
              <div className="font-semibold">Languages Spoken</div>
              <div className="text-sm">{data.languages || "N/A"}</div>
            </div>

            {/* Text-based summary from GROUP_CONCAT for backward compatibility */}
            {data.availability_summary && (
              <div>
                <div className="font-semibold">Availability Summary</div>
                <div className="text-sm whitespace-pre-wrap">{data.availability_summary}</div>
              </div>
            )}
          </div>

          {/* Right column: structured Weekly Availability */}
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Weekly Availability</h2>

            {Object.keys(availabilityByDay).length === 0 ? (
              <p className="text-sm text-slate-500">
                This tutor has not added detailed availability yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                {/* Standard Monday–Sunday order */}
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                  .filter((day) => availabilityByDay[day])
                  .map((day) => {
                    const slots = availabilityByDay[day];
                    if (!slots || slots.length === 0) return null;

                    return (
                      <div key={day} className="flex gap-3 text-sm">
                        <div className="w-20 shrink-0 font-medium text-slate-700">{day}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {slots.map((slot) => {
                            const start = slot.time_start;
                            const end = slot.time_end;
                            const hasRange = start && end;
                            const label = slot.time_slot;

                            return (
                              <span
                                key={slot.availability_id}
                                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800"
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

                {/* Any non-standard day strings, e.g. abbreviations */}
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
                      <div key={day} className="flex gap-3 text-sm">
                        <div className="w-24 shrink-0 font-medium text-slate-700">{day}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {slots.map((slot) => {
                            const start = slot.time_start;
                            const end = slot.time_end;
                            const hasRange = start && end;
                            const label = slot.time_slot;

                            return (
                              <span
                                key={slot.availability_id}
                                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800"
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
        <div className="mt-6 flex gap-3">
          <button
            onClick={goContact}
            className="rounded border px-4 py-2 font-semibold hover:bg-slate-50"
          >
            CONTACT
          </button>

          <button
            onClick={handleReport}
            className="rounded border px-4 py-2 font-semibold text-red-600 border-red-400 hover:bg-red-50"
          >
            REPORT TUTOR
          </button>
        </div>
      </div>
    </section>
  );
}
