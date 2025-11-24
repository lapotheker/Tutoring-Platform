import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/");
    navigate(`/?q=${encodeURIComponent(target)}`);
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

        <div className="mt-8 flex items-center justify-center">
          <form onSubmit={onSearch} className="w-full max-w-lg">
            <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 bg-white shadow-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course, subject, or name"
                className="flex-1 outline-none text-sm"
              />
              <button
                type="submit"
                className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-black"
                aria-label="Search"
              >
                <span>&#128269;</span>
              </button>
            </div>
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
          <ul className="mt-2 list-disc pl-6 space-y-1 text-slate-700 text-sm">
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
