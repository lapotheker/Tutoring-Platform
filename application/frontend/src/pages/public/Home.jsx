import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { dataAPI } from "../../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await dataAPI.getSubjects();
        if (!ignore && res?.success) setSubjects(res.data || []);
      } catch (e) {
        console.error("Failed to load subjects", e);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const canSearch = useMemo(() => q.trim().length > 0 || subject !== "", [q, subject]);

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (subject) params.set("subject", subject);
    navigate(`/results?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-sm">
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

        <div className="mt-8 mx-auto max-w-4xl text-left">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Search</label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, subjects, or tutors (e.g., CSC 648, Software Engineering, Alice)…"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                aria-label="Search"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                aria-label="Subject"
              >
                <option value="">All subjects</option>
                {subjects.map((s) => (
                  <option
                    key={s.subject_id || s.slug || s.name}
                    value={s.slug || s.name || s.subject_name}
                  >
                    {s.name || s.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!canSearch}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium text-sm shadow hover:bg-blue-700 transition whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>

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
