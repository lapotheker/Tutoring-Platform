import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tutorAPI } from "../../services/api";
import FiltersSidebar from "../../components/FiltersSidebar";

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
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed image loads

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

    // Subject
    next.subject ? p.set("subject", next.subject) : p.delete("subject");

    // Language
    next.language ? p.set("language", next.language) : p.delete("language");

    // Rate
    next.minRate ? p.set("minRate", next.minRate) : p.delete("minRate");
    next.maxRate ? p.set("maxRate", next.maxRate) : p.delete("maxRate");

    // Days
    next.days?.length ? p.set("days", next.days.join(",")) : p.delete("days");

    // Times
    next.times?.length ? p.set("times", next.times.join(",")) : p.delete("times");

    navigate(`/results?${p.toString()}`);
  }

  // Handle image loading errors
  const handleImageError = (tutorProfileId) => {
    setFailedImages(prev => new Set(prev).add(tutorProfileId));
  };

  // Get proper photo URL - handles backend paths and default images
  const getProfilePhotoUrl = (tutor) => {
    // If image failed to load previously, use default
    if (failedImages.has(tutor.tutor_profile_id)) {
      return getDefaultProfilePhoto();
    }

    // If no profile photo, use default
    if (!tutor.profile_photo) {
      return getDefaultProfilePhoto();
    }

    // If it's already a full URL, use it directly
    if (tutor.profile_photo.startsWith('http')) {
      return tutor.profile_photo;
    }

    // If it's a relative path from backend, construct full URL
    // Adjust this base URL according to your backend setup
    const baseUrl = process.env.REACT_APP_API_URL || '';
    return `${baseUrl}${tutor.profile_photo.startsWith('/') ? '' : '/'}${tutor.profile_photo}`;
  };

  // Get default profile photo
  const getDefaultProfilePhoto = () => {
    // You can use a local image or an external default avatar
    return '/images/default-avatar.png'; // Make sure this file exists in your public folder
  };

  // Fetch tutors whenever search parameters change
  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      setError(null);
      setFailedImages(new Set()); // Reset failed images on new search

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
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* TOP HEADER */}
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitHeaderSearch()}
              placeholder="Search by keyword or course"
              className="flex-1 outline-none text-sm"
            />
            <button
              type="button"
              onClick={submitHeaderSearch}
              className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white"
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
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* LEFT COLUMN – Tutor Results */}
        <div className="flex-1 max-w-4xl">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg md:text-xl font-extrabold">Search Results – "{searchTitle}"</h2>
            <div className="text-sm text-slate-600">{showingLabel}</div>
          </div>

          {loading && <div className="mt-8 text-center text-slate-600">Loading tutors...</div>}

          {error && <div className="mt-8 text-center text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="mt-4 space-y-5">
              {tutors.map((t) => {
                const photoUrl = getProfilePhotoUrl(t);
                const isDefaultAvatar = photoUrl.includes('default-avatar.png');

                return (
                  <article
                    key={t.tutor_profile_id}
                    className="rounded border border-slate-300 bg-white p-4"
                  >
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-xl overflow-hidden flex-shrink-0">
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
                );
              })}

              {tutors.length === 0 && (
                <div className="text-slate-600 text-center">
                  No results found. Try adjusting your filters.
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
  );
}
