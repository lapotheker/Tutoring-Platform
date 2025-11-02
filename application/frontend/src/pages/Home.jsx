// src/pages/Home.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // ---- Search form states ----
  const [nameQuery, setNameQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  function handleSearch(e) {
    e?.preventDefault?.();

    // Build query string for /results
    const params = new URLSearchParams();
    if (nameQuery) params.set("name", nameQuery.trim());
    if (subjectQuery) params.set("subject", subjectQuery.trim());
    if (courseQuery) params.set("course", courseQuery.trim());
    if (minRate) params.set("minRate", String(minRate));
    if (maxRate) params.set("maxRate", String(maxRate));

    navigate(`/results?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      {/* -------- HERO -------- */}
      <section className="rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-sm">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-extrabold tracking-wide"
        >
          SFSU TUTORING PLATFORM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mt-4 text-base md:text-lg"
        >
          Find Your Perfect Tutor
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-base md:text-lg"
        >
          Connect with SFSU students and faculty
        </motion.p>

        {/* CTA: GET STARTED / LOGIN */}
        <div className="mt-6 flex items-center justify-center gap-4">
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

        {/* WHY Section */}
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

      {/* -------- FIND A TUTOR -------- */}
      <section id="search" className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-2xl font-bold tracking-tight">Find a Tutor</h3>
        <p className="text-slate-600 mt-1">Enter your criteria and view results instantly.</p>

        <form onSubmit={handleSearch} className="mt-4 grid gap-3 md:grid-cols-5">
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Tutor name"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={subjectQuery}
            onChange={(e) => setSubjectQuery(e.target.value)}
            placeholder="Subject (e.g., Software Eng.)"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={courseQuery}
            onChange={(e) => setCourseQuery(e.target.value)}
            placeholder="Course (e.g., CSC 648)"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
            placeholder="Min $/hr"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            placeholder="Max $/hr"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          <div className="md:col-span-5 flex items-center justify-between">
            <Link
              to="/search"
              className="text-sm text-slate-600 hover:underline"
              title="Open advanced filters"
            >
              Advanced filters
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* -------- POLICIES -------- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Policies & Rules (Summary)</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>
            Unregistered users may browse/search tutor profiles; contact form requires{" "}
            <code>@sfsu.edu</code> login.
          </li>
          <li>Students can message tutors; tutors cannot reply in-app.</li>
          <li>No payments in the app; hourly rate is display-only.</li>
          <li>
            New or edited tutor profiles appear only after admin approval; all admin actions are
            logged.
          </li>
        </ul>
      </section>
    </div>
  );
}
