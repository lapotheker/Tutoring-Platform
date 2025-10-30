// src/pages/TutorSearch.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const MOCK = [
  {
    id: 1,
    name: "Alex Chen",
    subjects: ["CSC 415", "Data Structures"],
    language: "English",
    rate: 30,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Maya Singh",
    subjects: ["Math 227", "Linear Algebra"],
    language: "Hindi",
    rate: 28,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Sofia Lopez",
    subjects: ["ENG 214", "Academic Writing"],
    language: "Spanish",
    rate: 25,
    rating: 4.9,
  },
];

export default function TutorSearch() {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [language, setLanguage] = useState("All");

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(q.trim());
  };

  const list = MOCK.filter((t) => {
    const matchText =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.subjects.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchSubject = subject === "All" || t.subjects.some((s) => s.includes(subject));
    const matchLanguage = language === "All" || t.language === language;
    return matchText && matchSubject && matchLanguage;
  });

  return (
    <section className="space-y-6">
      {/* Header Section */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-4">
          <svg viewBox="0 0 48 48" className="h-10 w-10 rounded-lg shadow-sm" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="48" height="48" rx="10" fill="url(#g)" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
              fontSize="22"
              fontWeight="700"
              fill="#fffbea"
            >
              T
            </text>
          </svg>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">SFSU Tutor</h1>
        </div>

        {/* Subtitle */}
        <h2 className="text-xl font-semibold text-slate-800">Find a Tutor</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-3 flex gap-2 items-center w-full">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, course, or skill…"
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Filter Row */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-slate-600">Subject:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>All</option>
              <option>CSC 415</option>
              <option>Math 227</option>
              <option>ENG 214</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-slate-600">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>All</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </label>
        </div>
      </header>

      {/* Results Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {list.length > 0 ? (
          list.map((t) => (
            <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-slate-600 mt-1">{t.subjects.join(", ")}</div>
              <div className="text-sm mt-2">
                Rate: ${t.rate}/hr · Rating: {t.rating} · Language: {t.language}
              </div>
              <div className="mt-3">
                <Link
                  to={`/tutor/request/${t.id}`}
                  className="inline-flex items-center rounded-xl bg-blue-600 px-3 py-1.5 text-white text-sm hover:bg-blue-700"
                >
                  Request Session
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center text-slate-500 italic">
            No tutors found. Try another keyword or filter.
          </div>
        )}
      </div>
    </section>
  );
}
