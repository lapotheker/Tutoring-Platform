// src/pages/TutorDashboardApproved.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TutorDashboardApproved() {
  const { search } = useLocation();
  
  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    if (!user?.email) return "Sarah";
    const beforeAt = user.email.split("@")[0] || "Tutor";
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  const params = new URLSearchParams(search);
  const tutorId = params.get("id") || "1";
  const approved = params.get("approved") || new Date().toISOString().slice(0, 10);

  const card = "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";

  const upcomingSessions = [
    {
      id: 1,
      date: "Thu, Nov 28",
      time: "2:00 PM – 3:00 PM",
      student: "Brian Lee",
      course: "CSC 220 – Data Structures",
      mode: "Online",
      status: "upcoming",
    },
    {
      id: 2,
      date: "Fri, Nov 29",
      time: "10:00 AM – 11:00 AM",
      student: "Alice Chen",
      course: "CSC 210 – Intro to Programming",
      mode: "In-person",
      status: "upcoming",
    },
  ];

  const completedSessions = [
    {
      id: 3,
      date: "Mon, Nov 25",
      time: "3:00 PM – 4:00 PM",
      student: "Daniel Martinez",
      course: "CSC 415 – Operating Systems",
      mode: "Online",
      status: "completed",
    },
    {
      id: 4,
      date: "Sun, Nov 24",
      time: "1:00 PM – 2:00 PM",
      student: "Sarah Johnson",
      course: "CSC 340 – Programming Methodology",
      mode: "In-person",
      status: "completed",
    },
  ];

  const messages = [
    {
      id: 1,
      student: "Alice Chen",
      snippet: "Hi, I need help with CSC 340 and some algorithm questions…",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      student: "Brian Wu",
      snippet: "Are you available next Monday afternoon?",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      student: "Maya Patel",
      snippet: "Thank you for the last session, it really helped!",
      time: "2 days ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <section className="max-w-5xl mx-auto space-y-6">
        {/* ===== Header ===== */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-amber-400">
                👤
              </div>
              <div className="text-xl font-extrabold text-purple-900">Welcome, {displayName}!</div>
            </div>
            
            {/* Icons with mail badge (1) */}
            <div className="relative flex items-center gap-4 text-2xl">
              <Link to="/inbox" title="Messages" className="relative hover:opacity-80 transition-opacity">
                ✉️
                <span className="absolute -top-2 -right-3 grid h-5 w-5 place-items-center rounded-full bg-amber-500 text-white text-xs font-bold ring-2 ring-amber-200">
                  1
                </span>
              </Link>
              <Link to="/" title="Home" className="hover:opacity-80 transition-opacity">
                🏠
              </Link>
            </div>
          </div>
          
          <h1 className="mt-6 text-center text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            ScholarlyGator
          </h1>
        </div>

        {/* ===== Profile Status (ACTIVE) ===== */}
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>
          <div className="rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <p className="font-extrabold text-green-900 text-lg mb-2">✓ STATUS: ACTIVE</p>
            <p className="text-slate-800 mb-2">Your profile is now visible in search results!</p>
            <p className="text-slate-800 mb-4">
              Approved on:{" "}
              <span className="font-bold text-purple-700">
                {new Date(approved).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </p>
            <div>
              <Link
                to={`/tutors/${tutorId}`}
                className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-5 py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                VIEW PUBLIC PROFILE
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Upcoming Sessions Section ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">
              UPCOMING SESSIONS
            </h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {upcomingSessions.length} scheduled
            </span>
          </div>

          <div className="space-y-3">
            {upcomingSessions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">
                    {s.student}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 border border-blue-300">
                    {s.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-700">
                  {s.date} · {s.course}
                </div>

                <div className="mt-1 text-sm text-slate-600">
                  {s.time} · {s.mode}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Recent Activity Section (Completed Sessions) ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">
              RECENT ACTIVITY
            </h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Last {completedSessions.length} sessions
            </span>
          </div>

          <div className="space-y-3">
            {completedSessions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">
                    {s.student}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 border border-emerald-300">
                    {s.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-700">
                  {s.date} · {s.course}
                </div>

                <div className="mt-1 text-sm text-slate-600">
                  {s.time} · {s.mode}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Messages Section ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">MESSAGES</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              {messages.filter((m) => m.unread).length} unread
            </span>
          </div>

          <div className="space-y-3">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  msg.unread
                    ? "border-blue-300 bg-blue-50 hover:border-blue-400"
                    : "border-purple-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">
                    {msg.student}
                  </span>
                  <span className="text-xs text-purple-600">{msg.time}</span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                  {msg.snippet}
                </p>

                {msg.unread && (
                  <span className="mt-3 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white border border-blue-700">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-purple-500 italic">
            * These are demo messages to be replaced with backend data later.
          </p>
        </div>
      </section>
    </div>
  );
}