// src/components/FiltersSidebar.jsx
export default function FiltersSidebar({ filters, onFiltersChange }) {
  const {
    subject = "",
    language = "",
    minRate = "",
    maxRate = "",
    days = [],
    times = [],
  } = filters || {};

  function update(patch) {
    onFiltersChange({
      ...filters,
      ...patch,
    });
  }

  function handleSubjectChange(e) {
    const value = e.target.value;
    update({ subject: value || "" });
  }

  function handleLanguageChange(e) {
    const value = e.target.value;
    update({ language: value || "" });
  }

  function handleMinRateChange(e) {
    update({ minRate: e.target.value });
  }

  function handleMaxRateChange(e) {
    update({ maxRate: e.target.value });
  }

  function toggleDay(day) {
    const set = new Set(days || []);
    if (set.has(day)) {
      set.delete(day);
    } else {
      set.add(day);
    }
    update({ days: Array.from(set) });
  }

  function toggleTime(timeKey) {
    const set = new Set(times || []);
    if (set.has(timeKey)) {
      set.delete(timeKey);
    } else {
      set.add(timeKey);
    }
    update({ times: Array.from(set) });
  }

  const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeOptions = [
    { key: "morning", label: "Morning (8am–12pm)" },
    { key: "afternoon", label: "Afternoon (12pm–5pm)" },
    { key: "evening", label: "Evening (5pm–10pm)" },
  ];

  const card = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
  const label = "text-xs font-semibold text-slate-700 tracking-wide";
  const select =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900";
  const input =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900";
  const dayBtnBase = "px-3 py-1 rounded-full border text-xs font-medium transition-colors";
  const dayBtnActive = "bg-slate-900 text-white border-slate-900";
  const dayBtnInactive = "bg-white text-slate-700 border-slate-300 hover:bg-slate-100";

  return (
    <aside className={card}>
      <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
      <p className="mt-1 text-xs text-slate-500">
        Narrow down tutors by subject, language, rate, and availability.
      </p>

      {/* SUBJECT */}
      <div className="mt-4 space-y-1">
        <div className={label}>SUBJECT</div>
        <select value={subject} onChange={handleSubjectChange} className={select}>
          <option value="">Any subject</option>
          <option value="cs">Computer Science</option>
          <option value="math">Math</option>
          <option value="writing">Writing</option>
          <option value="statistics">Statistics</option>
        </select>
      </div>

      {/* LANGUAGE */}
      <div className="mt-4 space-y-1">
        <div className={label}>LANGUAGE</div>
        <select value={language} onChange={handleLanguageChange} className={select}>
          <option value="">Any language</option>
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
          <option value="Spanish">Spanish</option>
          <option value="Hindi">Hindi</option>
          <option value="Italian">Italian</option>
        </select>
      </div>

      {/* HOURLY RATE */}
      <div className="mt-4 space-y-1">
        <div className={label}>HOURLY RATE ($)</div>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Min"
            className={input}
            value={minRate}
            onChange={handleMinRateChange}
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Max"
            className={input}
            value={maxRate}
            onChange={handleMaxRateChange}
          />
        </div>
      </div>

      {/* DAYS */}
      <div className="mt-4 space-y-1">
        <div className={label}>DAYS</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {dayOptions.map((d) => {
            const active = (days || []).includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`${dayBtnBase} ${active ? dayBtnActive : dayBtnInactive}`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* TIMES */}
      <div className="mt-4 space-y-1">
        <div className={label}>TIMES</div>
        <div className="mt-1 space-y-1 text-xs text-slate-700">
          {timeOptions.map((t) => (
            <label key={t.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={(times || []).includes(t.key)}
                onChange={() => toggleTime(t.key)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
