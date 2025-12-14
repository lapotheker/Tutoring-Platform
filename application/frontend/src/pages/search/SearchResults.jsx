import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tutorAPI } from "../../services/api";
import FiltersSidebar from "../../components/FiltersSidebar";
import defaultProfileImage from "../../assets/default-profile.jpg";

export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  // URL → state
  const searchText = params.get("search") || "";
  const subject = params.get("subject") || "";
  const course = params.get("course") || "";
  const language = params.get("language") || "";
  const minRate = params.get("minRate") || "";
  const maxRate = params.get("maxRate") || "";
  const daysParam = params.get("days") || "";
  const timesParam = params.get("times") || "";
  const days = daysParam ? daysParam.split(",") : [];
  const times = timesParam ? timesParam.split(",") : [];

  // State for results
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  // State for top input bar
  const [q, setQ] = useState(searchText || course);
  useEffect(() => {
    setQ(searchText || course);
  }, [searchText, course]);

  // Filters object for sidebar
  const filters = {
    subject,
    language,
    minRate,
    maxRate,
    days,
    times,
  };

  // Update URL when filters change
  function updateFilters(next) {
    const p = new URLSearchParams(search);

    next.subject ? p.set("subject", next.subject) : p.delete("subject");
    next.language ? p.set("language", next.language) : p.delete("language");
    next.minRate ? p.set("minRate", next.minRate) : p.delete("minRate");
    next.maxRate ? p.set("maxRate", next.maxRate) : p.delete("maxRate");
    next.days?.length ? p.set("days", next.days.join(",")) : p.delete("days");
    next.times?.length ? p.set("times", next.times.join(",")) : p.delete("times");

    navigate(`/results?${p.toString()}`);
  }

  const handleImageError = (tutorProfileId) => {
    setFailedImages((prev) => new Set(prev).add(tutorProfileId));
  };

  const getProfilePhotoUrl = (tutor) => {
    if (failedImages.has(tutor.tutor_profile_id)) {
      return getDefaultProfilePhoto();
    }

    if (!tutor.profile_photo) {
      return getDefaultProfilePhoto();
    }

    if (tutor.profile_photo.startsWith("http")) {
      return tutor.profile_photo;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "";
    return `${baseUrl}${tutor.profile_photo.startsWith("/") ? "" : "/"}${tutor.profile_photo}`;
  };

  const getDefaultProfilePhoto = () => {
    return defaultProfileImage;
  };

  // Fetch tutors whenever search parameters change
  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      setError(null);
      setFailedImages(new Set());

      try {
        const response = await tutorAPI.searchTutors({
          search: searchText,
          subject,
          course,
          language,
          minRate,
          maxRate,
          days: daysParam,
          times: timesParam,
        });

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
  }, [searchText, subject, course, language, minRate, maxRate, daysParam, timesParam]);

  const showingLabel = tutors.length ? `Showing 1–${tutors.length}` : "Showing 0";
  const searchTitle = course || searchText || subject || "All";

  function submitHeaderSearch() {
    const p = new URLSearchParams(search);
    const value = q.trim();

    value ? p.set("search", value) : p.delete("search");

    navigate(`/results?${p.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP HEADER */}
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-purple-200/50 text-center relative mb-8">
          <Link
            to="/"
            className="absolute left-6 top-6 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg ring-2 ring-amber-400 mb-3">
            <span className="text-2xl">🐊</span>
          </div>
          
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            ScholarlyGator
          </h1>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border-2 border-purple-300 bg-white px-5 py-2.5 w-full max-w-lg shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200 transition-all">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitHeaderSearch()}
                placeholder="Search by keyword or course"
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <button
                type="button"
                onClick={submitHeaderSearch}
                className="grid place-items-center h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
              >
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
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT: RESULTS LEFT + SIDEBAR RIGHT */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT COLUMN – Tutor Results */}
          <div className="flex-1 max-w-4xl">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-purple-900">
                Search Results – "<span className="text-amber-600">{searchTitle}</span>"
              </h2>
              <div className="text-sm text-purple-600 font-semibold">{showingLabel}</div>
            </div>

            {loading && <div className="mt-8 text-center text-purple-600 font-medium">Loading tutors...</div>}

            {error && <div className="mt-8 text-center text-red-600 font-medium">{error}</div>}

            {!loading && !error && (
              <div className="space-y-5">
                {tutors.map((t) => {
                  const photoUrl = getProfilePhotoUrl(t);
                  const isDefaultAvatar = photoUrl.includes("default-avatar.png");

                  return (
                    <article
                      key={t.tutor_profile_id}
                      className="rounded-2xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-5 shadow-lg shadow-purple-100 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 transition-all"
                    >
                      <div className="flex gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 grid place-items-center text-white text-2xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-amber-400">
                          {!isDefaultAvatar ? (
                            <img
                              src={photoUrl}
                              alt={`${t.display_name}'s profile`}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(t.tutor_profile_id)}
                              loading="lazy"
                            />
                          ) : (
                            <img
                              src={photoUrl}
                              alt="Default avatar"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-extrabold tracking-wide text-purple-900 text-lg">
                              {t.display_name.toUpperCase()}
                            </h3>
                            <div className="font-bold text-amber-600 text-lg">${t.hourly_rate}/hr</div>
                          </div>

                          <div className="text-sm mt-2 space-y-1 text-slate-700">
                            <div><span className="font-semibold text-purple-700">Name:</span> {t.full_name}</div>
                            <div><span className="font-semibold text-purple-700">Courses:</span> {t.courses || "N/A"}</div>
                            <div><span className="font-semibold text-purple-700">Subjects:</span> {t.subject_tags || "N/A"}</div>
                            <div><span className="font-semibold text-purple-700">Languages:</span> {t.languages || "N/A"}</div>
                            <div><span className="font-semibold text-purple-700">Availability:</span> {t.availability_summary}</div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <Link
                              to={`/tutors/${t.tutor_profile_id}${search}`}
                              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-5 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
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
                              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-5 py-2 text-sm font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                            >
                              CONTACT
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {tutors.length === 0 && (
                  <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-8 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="text-purple-700 font-semibold">
                      No results found. Try adjusting your filters.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN – Filters Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <FiltersSidebar filters={filters} onFiltersChange={updateFilters} />
          </div>
        </div>
      </div>
    </div>
  );
}