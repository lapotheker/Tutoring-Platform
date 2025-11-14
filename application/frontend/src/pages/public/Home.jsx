import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { dataAPI } from "../../services/api";

export default function Home() {
  const navigate = useNavigate();
  

  // Separate search inputs
  const [tutorName, setTutorName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [language, setLanguage] = useState("");

  // Dropdown data from API
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rates, setRates] = useState({ under20: false, between21_40: false, over41: false });
  const [days, setDays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [daytimes, setDaytimes] = useState({ Morning: false, Afternoon: false, Evening: false });

  // Load dropdown data from API
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [coursesRes, subjectsRes, languagesRes] = await Promise.all([
          dataAPI.getCourses(),
          dataAPI.getSubjects(),
          dataAPI.getLanguages(),
        ]);

        if (coursesRes.success) setCourses(coursesRes.data);
        if (subjectsRes.success) setSubjects(subjectsRes.data);
        if (languagesRes.success) setLanguages(languagesRes.data);
      } catch (error) {
        console.error("Failed to load dropdown data:", error);
      }
    }
    loadDropdowns();
  }, []);

  function toggle(setter, key) {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function clearAdvanced() {
    setRates({ under20: false, between21_40: false, over41: false });
    setDays({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
    setDaytimes({ Morning: false, Afternoon: false, Evening: false });
  }

  function performSearch() {
    const params = new URLSearchParams();

    // Add each field separately
    if (tutorName.trim()) params.set("search", tutorName.trim());
    if (courseCode.trim()) params.set("course", courseCode.trim());
    if (subjectQuery.trim()) params.set("subject", subjectQuery.trim());
    if (language) params.set("language", language);

    // Hourly rate filters - convert to min/max
    const rateRanges = [];
    if (rates.under20) rateRanges.push({ min: 0, max: 20 });
    if (rates.between21_40) rateRanges.push({ min: 21, max: 40 });
    if (rates.over41) rateRanges.push({ min: 41, max: 999 });

    if (rateRanges.length > 0) {
      const minRate = Math.min(...rateRanges.map((r) => r.min));
      const maxRate = Math.max(...rateRanges.map((r) => r.max));
      params.set("minRate", minRate.toString());
      params.set("maxRate", maxRate.toString());
    }

    // Days filter
    const chosenDays = Object.keys(days).filter((k) => days[k]);
    if (chosenDays.length) params.set("days", chosenDays.join(","));

    // Times filter
    const chosenTimes = Object.keys(daytimes).filter((k) => daytimes[k]);
    if (chosenTimes.length) params.set("times", chosenTimes.join(","));

    navigate(`/results?${params.toString()}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    performSearch();
  }

  function handleApplyFilters(e) {
    e.preventDefault();
    performSearch();
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-sm">
        {/* Title and tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold tracking-wide"
        >
          Find Your Perfect Tutor
        </motion.h1>

        <motion.p className="mt-3 text-base md:text-lg text-slate-600">
          Connect with verified SFSU students and faculty
        </motion.p>

        {/* Search Section */}
        <div className="mt-8 text-left mx-auto max-w-4xl">
          {/* Compact search form */}
          <form onSubmit={handleSearch} className="mt-6">
            {/* Single row with all basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-2 items-end">
              {/* Tutor Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tutor Name</label>
                <input
                  type="text"
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., CSC 648"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="e.g., Software Eng"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Any</option>
                  {languages.map((lang) => (
                    <option key={lang.language_id} value={lang.language_name}>
                      {lang.language_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium text-sm shadow hover:bg-blue-700 transition whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Advanced filters toggle */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAdvanced ? "− Hide filters" : "+ Advanced filters"}
            </button>
          </div>

          {/* Advanced filters expanded panel */}
          {showAdvanced && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-800 mb-3 text-sm">Advanced Filters</h4>

              {/* Hourly Rate */}
              <div className="mb-4">
                <div className="font-medium text-xs text-slate-700 mb-2">Hourly Rate:</div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rates.under20}
                      onChange={() => toggle(setRates, "under20")}
                      className="rounded"
                    />
                    <span>$0–20</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rates.between21_40}
                      onChange={() => toggle(setRates, "between21_40")}
                      className="rounded"
                    />
                    <span>$21–40</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rates.over41}
                      onChange={() => toggle(setRates, "over41")}
                      className="rounded"
                    />
                    <span>$41+</span>
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="font-medium text-xs text-slate-700 mb-2">Days:</div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {Object.keys(days).map((d) => (
                      <label key={d} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={days[d]}
                          onChange={() => toggle(setDays, d)}
                          className="rounded"
                        />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-xs text-slate-700 mb-2">Times:</div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {Object.keys(daytimes).map((t) => (
                      <label key={t} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={daytimes[t]}
                          onChange={() => toggle(setDaytimes, t)}
                          className="rounded"
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear / Apply buttons */}
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={clearAdvanced}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-white font-medium shadow hover:bg-black transition"
          >
            GET STARTED
          </Link>
          <span className="text-slate-500 font-semibold">or</span>
          <Link
            to="/login"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            LOGIN
          </Link>
        </div>

        {/* Why Section */}
        <div className="mt-8 text-left mx-auto max-w-xl">
          <h2 className="text-lg font-extrabold">WHY SFSU TUTORING PLATFORM?</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Verified SFSU tutors only</li>
            <li>Browse by course or subject</li>
            <li>Direct messaging system</li>
            <li>Flexible scheduling</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
