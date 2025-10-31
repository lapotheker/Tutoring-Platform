import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchFilters() {
  const navigate = useNavigate();

  // --- Primary search fields ---
  const [subject, setSubject] = useState("Computer Science");
  const [course, setCourse] = useState("");

  // --- Hourly rate ranges (checkboxes, multiple allowed) ---
  const [rates, setRates] = useState({ under20: false, between21_40: false, over41: false });

  // --- Availability (days and times) ---
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

  // --- Languages ---
  const [langs, setLangs] = useState({ English: false, Spanish: false, Chinese: false });

  function toggle(setter, key) {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function clearAll() {
    setSubject("Computer Science");
    setCourse("");
    setRates({ under20: false, between21_40: false, over41: false });
    setDays({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
    setDaytimes({ Morning: false, Afternoon: false, Evening: false });
    setLangs({ English: false, Spanish: false, Chinese: false });
  }

  function applyFilters(e) {
    e?.preventDefault?.();

    // Build query params for results page
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (course) params.set("course", course);

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

    const chosenLangs = Object.keys(langs).filter((k) => langs[k]);
    if (chosenLangs.length) params.set("langs", chosenLangs.join(","));

    // ⬇️ 跳到 /results，并把筛选条件带过去
    navigate(`/results?${params.toString()}`);
  }

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const sectionTitle = "text-lg font-extrabold";
  const label = "text-sm font-medium text-slate-700";

  return (
    <section className="space-y-6">
      {/* ===== Header Bar (avatar + icons) ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-2xl">
              👤
            </div>
          </div>
          <div className="flex items-center gap-3 text-2xl">
            <Link to="/inbox" title="Messages" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <h1 className="mt-4 text-center text-xl md:text-2xl font-extrabold tracking-wide">
          SFSU TUTORING PLATFORM
        </h1>
      </div>

      {/* ===== Search By ===== */}
      <div className={card}>
        <h2 className={sectionTitle}>Search By</h2>

        <form className="mt-4 space-y-4" onSubmit={applyFilters}>
          {/* Subject */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-3">
            <label className={label}>Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
            >
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Business</option>
              <option>English</option>
            </select>
          </div>

          {/* Course number */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-3">
            <label className={label}>Course Number</label>
            <input
              type="text"
              placeholder="e.g., CSC 648"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              SEARCH
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            >
              CLEAR
            </button>
          </div>
        </form>
      </div>

      {/* ===== Filters ===== */}
      <div className={card}>
        <h2 className={sectionTitle}>Filters</h2>

        {/* Hourly Rate */}
        <div className="mt-3">
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

        {/* Availability (days + times) */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="font-semibold text-sm">Availability (Days):</div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {Object.keys(days).map((d) => (
                <label key={d} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={days[d]} onChange={() => toggle(setDays, d)} />
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

        {/* Languages */}
        <div className="mt-4">
          <div className="font-semibold text-sm">Languages:</div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            {Object.keys(langs).map((l) => (
              <label key={l} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={langs[l]} onChange={() => toggle(setLangs, l)} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={applyFilters}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </section>
  );
}
