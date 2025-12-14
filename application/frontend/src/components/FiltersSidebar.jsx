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

  const card = "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";
  const label = "text-xs font-bold text-purple-900 tracking-wide uppercase";
  const select =
    "mt-2 w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white";
  const input =
    "w-full rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white";
  const dayBtnBase = "px-4 py-2 rounded-full border-2 text-xs font-bold transition-all shadow-sm";
  const dayBtnActive = "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-700 shadow-md";
  const dayBtnInactive = "bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400";

  return (
    <aside className={card}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-extrabold text-purple-900">Filters</h3>
      </div>
      <p className="text-xs text-purple-600 font-medium">
        Narrow down tutors by subject, language, rate, and availability.
      </p>

      {/* SUBJECT */}
      <div className="mt-6 space-y-1">
        <div className={label}>Subject</div>
        <select value={subject} onChange={handleSubjectChange} className={select}>
          <option value="">Any subject</option>
          <option value="cs">Computer Science</option>
          <option value="math">Math</option>
          <option value="writing">Writing</option>
          <option value="statistics">Statistics</option>
        </select>
      </div>

      {/* LANGUAGE */}
      <div className="mt-5 space-y-1">
        <div className={label}>Language</div>
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
      <div className="mt-5 space-y-1">
        <div className={label}>Hourly Rate ($)</div>
        <div className="mt-2 flex gap-2">
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
      <div className="mt-5 space-y-1">
        <div className={label}>Days Available</div>
        <div className="mt-2 flex flex-wrap gap-2">
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
      <div className="mt-5 space-y-1">
        <div className={label}>Time Slots</div>
        <div className="mt-2 space-y-2 bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl p-4 border-2 border-purple-200">
          {timeOptions.map((t) => (
            <label key={t.key} className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                checked={(times || []).includes(t.key)}
                onChange={() => toggleTime(t.key)}
              />
              <span className="text-sm font-semibold text-purple-900">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => onFiltersChange({
            subject: "",
            language: "",
            minRate: "",
            maxRate: "",
            days: [],
            times: [],
          })}
          className="w-full rounded-xl border-2 border-purple-300 bg-white px-4 py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}