import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { tutorAPI } from "../../services/api";

export default function SearchResults() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // State
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read query params
  const searchText = params.get("search") || "";
  const subject = params.get("subject") || "";
  const course = params.get("course") || "";
  const language = params.get("language") || "";
  const minRate = params.get("minRate") || "";
  const maxRate = params.get("maxRate") || "";
  const days = params.get("days") || "";
  const times = params.get("times") || "";

  // Fetch tutors from API
  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      setError(null);

      try {
        const searchParams = {
          search: searchText,
          subject,
          course,
          language,
          minRate,
          maxRate,
          days,
          times,
        };

        const response = await tutorAPI.searchTutors(searchParams);

        if (response.success) {
          setTutors(response.data);
        } else {
          setError("Failed to load tutors");
        }
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, [searchText, subject, course, language, minRate, maxRate, days, times]);

  const showingLabel = tutors.length ? `Showing 1–${tutors.length}` : "Showing 0";
  const searchTitle = course || searchText || subject || "All";

  return (
    <section className="space-y-6">
      {/* ===== Header Bar ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm text-center relative">
        <Link
          to="/"
          className="absolute left-6 top-6 text-slate-600 text-sm font-medium hover:text-blue-600"
        >
          ← Back to Home
        </Link>

        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">SFSU TUTORING PLATFORM</h1>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 w-full max-w-lg bg-white">
            <input
              type="text"
              defaultValue={searchText || course}
              placeholder="Search by keyword or course"
              className="flex-1 outline-none text-sm"
              readOnly
            />
            <div className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Results Header ===== */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">Search Results – "{searchTitle}"</h2>
          <div className="text-sm text-slate-600">{showingLabel}</div>
        </div>

        {/* ===== Loading State ===== */}
        {loading && <div className="mt-8 text-center text-slate-600">Loading tutors...</div>}

        {/* ===== Error State ===== */}
        {error && <div className="mt-8 text-center text-red-600">{error}</div>}

        {/* ===== Result Cards ===== */}
        {!loading && !error && (
          <div className="mt-4 space-y-5">
            {tutors.map((t) => (
              <article
                key={t.tutor_profile_id}
                className="rounded border border-slate-300 bg-white p-4"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-xl overflow-hidden">
                    {t.profile_photo ? (
                      <img
                        src={t.profile_photo}
                        alt={t.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold tracking-wide">
                        {t.display_name.toUpperCase()}
                      </h3>
                      <div className="font-semibold">${t.hourly_rate}/hour</div>
                    </div>

                    <div className="text-sm">
                      <div>{t.full_name}</div>
                      <div>Courses: {t.courses || "N/A"}</div>
                      <div>Subject Tags: {t.subject_tags || "N/A"}</div>
                      <div>Languages: {t.languages || "N/A"}</div>
                      <div>Availability: {t.availability_summary}</div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/tutors/${t.tutor_profile_id}${search}`}
                        className="inline-block rounded border px-4 py-1 text-sm font-medium hover:bg-slate-50"
                      >
                        VIEW PROFILE
                      </Link>

                      <Link
                        to={{
                          pathname: `/tutor/request/${t.tutor_profile_id}`,
                          search: `?to=${encodeURIComponent(t.display_name)}${
                            search ? `&${search.slice(1)}` : ""
                          }`,
                        }}
                        className="inline-block rounded bg-slate-900 text-white px-4 py-1 text-sm font-medium hover:bg-black"
                      >
                        CONTACT
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Empty state */}
            {tutors.length === 0 && (
              <div className="text-slate-600 text-center">
                No results found. Try adjusting your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
