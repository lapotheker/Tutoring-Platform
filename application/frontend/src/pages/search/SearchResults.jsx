import { useState } from "react";

// Mock tutor data
const MOCK_TUTORS = [
  {
    tutor_profile_id: 1,
    display_name: "ALICE NGUYEN",
    full_name: "Alice Nguyen",
    hourly_rate: 25,
    courses: "CSC 340, CSC 648",
    subject_tags: "Computer Science, Data Structures",
    languages: "English, Vietnamese",
    availability_summary: "Mon-Fri 2-6pm",
    profile_photo: null,
  },
  {
    tutor_profile_id: 2,
    display_name: "PRIYA PATEL",
    full_name: "Priya Patel",
    hourly_rate: 30,
    courses: "MATH 227, MATH 325",
    subject_tags: "Calculus, Linear Algebra",
    languages: "English, Hindi",
    availability_summary: "Tue-Thu 3-7pm",
    profile_photo: null,
  },
  {
    tutor_profile_id: 3,
    display_name: "DAVID KIM",
    full_name: "David Kim",
    hourly_rate: 28,
    courses: "CSC 648, CSC 642",
    subject_tags: "Software Engineering, Agile",
    languages: "English, Korean",
    availability_summary: "Mon-Wed 1-5pm",
    profile_photo: null,
  },
];

// Filter sidebar component
function FiltersSidebar({ filters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-lg shadow-purple-100 sticky top-6">
      <h3 className="text-lg font-bold text-purple-900 mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">Subject</label>
          <select
            value={localFilters.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            <option value="">All Subjects</option>
            <option value="computer-science">Computer Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">Language</label>
          <select
            value={localFilters.language || ""}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            <option value="">All Languages</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="mandarin">Mandarin</option>
          </select>
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">Hourly Rate</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minRate || ""}
              onChange={(e) => handleChange("minRate", e.target.value)}
              className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxRate || ""}
              onChange={(e) => handleChange("maxRate", e.target.value)}
              className="w-full rounded-lg border-2 border-purple-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            const cleared = { subject: "", language: "", minRate: "", maxRate: "", days: [], times: [] };
            setLocalFilters(cleared);
            onFiltersChange(cleared);
          }}
          className="w-full rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    language: "",
    minRate: "",
    maxRate: "",
    days: [],
    times: [],
  });
  const [tutors] = useState(MOCK_TUTORS);
  const [showHome, setShowHome] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  if (showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12 md:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-2xl ring-4 ring-amber-400">
              <span className="text-4xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                SG
              </span>
            </div>
            <div className="text-left">
              <p className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                ScholarlyGator
              </p>
              <p className="text-sm text-purple-600">Your SFSU study companion</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
            Welcome to ScholarlyGator!
          </h1>

          <button
            onClick={() => setShowHome(false)}
            className="mt-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Back to Search Results
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP HEADER */}
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-purple-200/50 text-center relative mb-8">
          <button
            onClick={() => setShowHome(true)}
            className="absolute left-6 top-6 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </button>

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg ring-2 ring-amber-400 mb-3">
            <span className="text-xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              SG
            </span>
          </div>
          
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            ScholarlyGator
          </h1>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border-2 border-purple-300 bg-white px-5 py-2.5 w-full max-w-lg shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200 transition-all">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by keyword or course"
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <button
                onClick={handleSearch}
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
                Search Results – "<span className="text-amber-600">All Tutors</span>"
              </h2>
              <div className="text-sm text-purple-600 font-semibold">Showing 1–{tutors.length}</div>
            </div>

            <div className="space-y-5">
              {tutors.map((t) => (
                <article
                  key={t.tutor_profile_id}
                  className="rounded-2xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-5 shadow-lg shadow-purple-100 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 transition-all transform hover:-translate-y-1 duration-300"
                >
                  <div className="flex gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 grid place-items-center text-white text-xl font-bold overflow-hidden flex-shrink-0 shadow-md ring-2 ring-amber-400">
                      {t.display_name.split(" ").map(n => n[0]).join("")}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-extrabold tracking-wide text-purple-900 text-lg">
                          {t.display_name}
                        </h3>
                        <div className="font-bold text-amber-600 text-lg">${t.hourly_rate}/hr</div>
                      </div>

                      <div className="text-sm mt-2 space-y-1 text-slate-700">
                        <div><span className="font-semibold text-purple-700">Name:</span> {t.full_name}</div>
                        <div><span className="font-semibold text-purple-700">Courses:</span> {t.courses}</div>
                        <div><span className="font-semibold text-purple-700">Subjects:</span> {t.subject_tags}</div>
                        <div><span className="font-semibold text-purple-700">Languages:</span> {t.languages}</div>
                        <div><span className="font-semibold text-purple-700">Availability:</span> {t.availability_summary}</div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-5 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm">
                          VIEW PROFILE
                        </button>

                        <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-5 py-2 text-sm font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg">
                          CONTACT
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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