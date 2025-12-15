import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function getCurrentUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("demoUser")) || JSON.parse(sessionStorage.getItem("demoUser"))
    );
  } catch {
    return null;
  }
}

// Student testimonials about tutors
const TESTIMONIALS = [
  {
    id: 1,
    student: "Emily Chen",
    major: "Computer Science",
    text: "Alice helped me ace CSC 340! Her explanations of data structures made everything click. I went from struggling to getting an A on my final project.",
    tutor: "Alice Nguyen",
    course: "CSC 340",
    rating: 5,
  },
  {
    id: 2,
    student: "Marcus Johnson",
    major: "Math",
    text: "Priya's patience and teaching style are incredible. She breaks down complex calculus problems into simple steps. Highly recommend!",
    tutor: "Priya Patel",
    course: "MATH 227",
    rating: 5,
  },
  {
    id: 3,
    student: "Sarah Rodriguez",
    major: "Software Engineering",
    text: "David is amazing! He helped our team understand Agile methodology and we finished our CSC 648 project ahead of schedule.",
    tutor: "David Kim",
    course: "CSC 648",
    rating: 5,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(getCurrentUser());

  // keep user state in sync if storage changes
  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const isLoggedIn = useMemo(() => !!user, [user]);

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/results");
    navigate(`/results?q=${encodeURIComponent(target)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12 md:py-16">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl text-center mb-16">
        {/* gator logo */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            className="flex h-20 w-20 items-center justify-center"
          >
            <img
              src="/src/assets/logo.svg"
              alt="ScholarlyGator Logo"
              className="h-full w-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          <div className="text-left">
            <p className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              ScholarlyGator
            </p>
            <p className="text-sm text-purple-600">Your SFSU study companion</p>
          </div>
        </div>

        {/* welcome header */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent"
        >
          Welcome to ScholarlyGator!
          <br />
          Let&apos;s Find Your Perfect Tutor
        </motion.h1>

        {/* tag */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-4 text-lg md:text-xl text-slate-700 max-w-2xl mx-auto"
        >
          We&apos;re here to help you feel more confident in your classes. Connect with fellow SFSU
          students and tutors who understand your professors and your courses.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-2 text-base text-purple-600 max-w-xl mx-auto font-medium"
        >
          Not sure where to start? Try searching the class you need help with.
        </motion.p>

        {/* Search bar */}
        <div className="mt-10 flex items-center justify-center">
          <form onSubmit={onSearch} className="w-full max-w-xl">
            <div className="flex items-center gap-3 rounded-full border-2 border-purple-300 bg-white px-5 py-3 shadow-2xl shadow-purple-200/50 transition-all hover:shadow-2xl hover:border-purple-400 focus-within:shadow-2xl focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200">
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
                className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                aria-label="Search"
              >
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Auth buttons: hidden when logged in */}
        {!isLoggedIn && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-7 py-3 text-white font-semibold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transition-all text-sm sm:text-base text-center"
            >
              I&apos;m new here – Get started
            </Link>
            <span className="text-purple-400 font-semibold hidden sm:inline">or</span>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-purple-900 font-semibold shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transition-all text-sm sm:text-base text-center"
            >
              Already have an account? Log in
            </Link>
          </div>
        )}
      </section>

      {/* Why ScholarlyGator Section */}
      <section className="mx-auto max-w-5xl mb-16">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-xl shadow-purple-100">
          <h2 className="text-2xl font-extrabold text-purple-900 text-center mb-6">
            Why students use ScholarlyGator
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <span className="text-2xl">&#10004;</span>
              <div>
                <div className="font-bold text-purple-900">Verified Tutors</div>
                <div className="text-sm text-slate-700 mt-1">
                  All tutors are verified SFSU students or faculty.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <span className="text-2xl">&#9733;</span>
              <div>
                <div className="font-bold text-purple-900">Course-Specific Help</div>
                <div className="text-sm text-slate-700 mt-1">
                  Find help by course, subject, or the exact class you&apos;re taking.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <span className="text-2xl">&#9993;</span>
              <div>
                <div className="font-bold text-purple-900">Secure Messaging</div>
                <div className="text-sm text-slate-700 mt-1">
                  Message tutors through the platform—no need to share personal contact info.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <span className="text-2xl">&#9776;</span>
              <div>
                <div className="font-bold text-purple-900">Flexible Scheduling</div>
                <div className="text-sm text-slate-700 mt-1">
                  Schedule sessions that work around your life, not the other way around.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent mb-3">
            What Students Say
          </h2>
          <p className="text-slate-600 text-lg">
            Real feedback from SFSU students who found their perfect tutor
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 transition-all"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">
                    &#9733;
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Student Info */}
              <div className="border-t-2 border-purple-100 pt-4">
                <div className="font-bold text-purple-900">{testimonial.student}</div>
                <div className="text-xs text-purple-600 mt-1">{testimonial.major}</div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-amber-100 text-purple-800 font-semibold border border-purple-200">
                    Tutor: {testimonial.tutor}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                    {testimonial.course}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Ready to get the help you need?</p>
          <Link
            to="/results"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-4 text-white font-bold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transition-all"
          >
            Browse All Tutors →
          </Link>
        </div>
      </section>
    </div>
  );
}
