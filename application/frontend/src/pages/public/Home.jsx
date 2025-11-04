// src/pages/public/Home.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Basic search inputs
  const [query, setQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [language, setLanguage] = useState("");

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

  function toggle(setter, key) {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function clearAdvanced() {
    setRates({ under20: false, between21_40: false, over41: false });
    setDays({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
    setDaytimes({ Morning: false, Afternoon: false, Evening: false });
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query.trim());
    if (subjectQuery) params.set("subject", subjectQuery.trim());
    if (language) params.set("language", language.trim());

    const chosenRates = [
      rates.under20 ? "$0-20" : null,
      rates.between21_40 ? "$21-40" : null,
      rates.over41 ? "$41+" : null,
    ].filter(Boolean);
    if (chosenRates.length) params.set("rates", chosenRates.join(","));

    const chosenDays = Object.keys(days).filter((k) => days[k]);
    if (chosenDays.length) params.set("days", chosenDays.join(","));

    const chosenTimes = Object.keys(daytimes).filter((k) => daytimes[k]);
    if (chosenTimes.length) params.set("times", chosenTimes.join(","));

    navigate(`/results?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-sm">
        {/* Title and tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-extrabold tracking-wide"
        >
          SFSU TUTORING PLATFORM
        </motion.h1>

        <motion.p className="mt-4 text-base md:text-lg">Find Your Perfect Tutor</motion.p>
        <motion.p className="text-base md:text-lg">Connect with SFSU students and faculty</motion.p>

        {/* Find a Tutor */}
        <div className="mt-8 text-left mx-auto max-w-5xl">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-center">Find a Tutor</h3>
          <p className="text-slate-600 mt-1 text-center">
            Enter your criteria and view results instantly.
          </p>

          {/* Input row */}
          <form
            onSubmit={handleSearch}
            className="mt-4 grid gap-3 md:grid-cols-[2fr_1.5fr_1fr_auto] items-center"
          >
            {/* Name/Course */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tutor name or course (e.g., CSC 648)"
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />

            {/* Subject */}
            <input
              type="text"
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
              placeholder="Subject (e.g., Software Engineering)"
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />

            {/* Language dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
            </select>

            {/* Search button */}
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-white font-medium shadow hover:bg-blue-700 transition md:self-stretch"
            >
              Search
            </button>
          </form>

          {/* Advanced filters toggle */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm text-slate-600 hover:underline"
            >
              {showAdvanced ? "Hide advanced filters" : "Advanced filters"}
            </button>
          </div>

          {/* Advanced filters expanded panel */}
          {showAdvanced && (
            <div className="mt-4 rounded-2xl border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800 mb-3">Advanced Filters</h4>

              {/* Hourly Rate */}
              <div className="mt-2">
                <div className="font-semibold text-sm">Hourly Rate:</div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rates.under20}
                      onChange={() => toggle(setRates, "under20")}
                    />
                    <span>$0–20</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rates.between21_40}
                      onChange={() => toggle(setRates, "between21_40")}
                    />
                    <span>$21–40</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rates.over41}
                      onChange={() => toggle(setRates, "over41")}
                    />
                    <span>$41+</span>
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="font-semibold text-sm">Availability (Days):</div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {Object.keys(days).map((d) => (
                      <label key={d} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={days[d]}
                          onChange={() => toggle(setDays, d)}
                        />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-sm">Availability (Times):</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    {Object.keys(daytimes).map((t) => (
                      <label key={t} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={daytimes[t]}
                          onChange={() => toggle(setDaytimes, t)}
                        />
                        <span>{t}s</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear / Apply buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={clearAdvanced}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                >
                  CLEAR
                </button>
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  APPLY FILTERS
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
