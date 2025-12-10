import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/results");
    navigate(`/results?q=${encodeURIComponent(target)}`);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-50 via-slate-50 to-amber-50 px-4 py-12 md:py-16">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/95 p-8 md:p-10 text-center shadow-2xl">
        {/* gator logo */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 shadow-2xl ring-4 ring-emerald-100"
          >
            <span role="img" aria-label="gator mascot" className="text-3xl leading-none">
              🐊
            </span>
          </motion.div>

          <div className="text-left">
            <p className="text-sm font-semibold tracking-wide text-slate-800">ScholarlyGator</p>
            <p className="text-xs text-slate-500">Your friendly SFSU study companion</p>
          </div>
        </div>

        {/* welcome header */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold tracking-wide text-slate-900"
        >
          Welcome to SFSU Tutoring! Let&apos;s Find Your Perfect Tutor
        </motion.h1>

        {/* tag */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto"
        >
          We&apos;re here to help you feel more confident in your classes. Connect with fellow SFSU
          students and tutors who understand your professors and your courses.
        </motion.p>

        {/* easier navigation*/}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-2 text-sm text-slate-500 max-w-xl mx-auto"
        >
          Not sure where to start? Try searching the class you need help with.
        </motion.p>

        {/* updated search bar*/}
        <div className="mt-8 flex items-center justify-center">
          <form onSubmit={onSearch} className="w-full max-w-xl">
            <div
              className="
                flex items-center gap-3 rounded-full border border-slate-200 
                bg-white/95 px-5 py-2.5 md:py-3 
                shadow-md md:shadow-lg 
                transition-shadow 
                hover:shadow-xl 
                focus-within:shadow-xl 
                focus-within:border-indigo-200 
                focus-within:ring-2 focus-within:ring-indigo-200
              "
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Ex: "CSC 648", "calculus", or a tutor name'
                className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder:text-slate-400"
                aria-label="Search"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white text-lg hover:bg-slate-800 transition shadow"
                aria-label="Search"
              >
                <span>&#128269;</span>
              </button>
            </div>
          </form>
        </div>

        {/* better style buttons  */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto rounded-full bg-slate-900 px-7 py-3 text-white font-medium shadow-lg hover:bg-black transition text-sm sm:text-base text-center"
          >
            I&apos;m new here – Get started
          </Link>
          <span className="text-slate-500 font-semibold hidden sm:inline">or</span>
          <Link
            to="/login"
            className="w-full sm:w-auto rounded-full bg-blue-600 px-7 py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition text-sm sm:text-base text-center"
          >
            Already have an account? Log in
          </Link>
        </div>

        {/* editied why section */}
        <div className="mt-8 text-left mx-auto max-w-xl">
          <h2 className="text-lg font-extrabold text-slate-900">Why students use SFSU Tutoring</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-slate-700 text-sm md:text-base">
            <li>All tutors are verified SFSU students or faculty.</li>
            <li>Find help by course, subject, or the exact class you&apos;re taking.</li>
            <li>Message tutors through the platform—no need to share personal contact info.</li>
            <li>Schedule sessions that work around your life, not the other way around.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
