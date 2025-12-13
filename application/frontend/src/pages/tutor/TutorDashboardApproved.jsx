// src/pages/TutorDashboardApproved.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TutorDashboardApproved() {
  const { search } = useLocation();
  
  // Read demo user to display greeting
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
    if (!user?.email) return "Sarah"; // default like storyboard
    const beforeAt = user.email.split("@")[0] || "Tutor";
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  // Allow overriding tutor id & approval date via query (?id=1&approved=2025-10-28)
  const params = new URLSearchParams(search);
  const tutorId = params.get("id") || "1";
  const approved = params.get("approved") || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  // Demo data for upcoming sessions
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

  // Demo data for completed sessions
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

  // Demo messages
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
    <section className="space-y-6">
      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-3xl">
              👤
            </div>
            <div className="text-2xl font-extrabold">Welcome, {displayName}!</div>
          </div>
          {/* Icons with mail badge (1) */}
          <div className="relative flex items-center gap-4 text-2xl">
            <Link to="/inbox" title="Messages" className="relative hover:opacity-80">
              ✉️
              <span className="absolute -top-2 -right-3 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white text-[10px]">
                1
              </span>
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>
        <h1 className={`mt-4 text-center ${bigTitle}`}>
          SFSU TUTORING PLATFORM
        </h1>
      </div>

      {/* ===== Profile Status (ACTIVE) ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">PROFILE STATUS</h2>
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p className="font-extrabold">✓ STATUS: ACTIVE</p>
          <p className="mt-1">Your profile is now visible in search results!</p>
          <p className="mt-1">
            Approved on:{" "}
            <span className="font-semibold">
              {new Date(approved).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
          </p>
          <div className="mt-4">
            <Link
              to={`/tutors/${tutorId}`}
              className="inline-block rounded-md border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              VIEW PUBLIC PROFILE
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Upcoming Sessions Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">
            UPCOMING SESSIONS
          </h2>
          <span className="text-xs text-slate-500">
            {upcomingSessions.length} scheduled
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {upcomingSessions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {s.student}
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  {s.status}
                </span>
              </div>

              <div className="mt-1 text-xs text-slate-700">
                {s.date} · {s.course}
              </div>

              <div className="mt-1 text-xs text-slate-600">
                {s.time} · {s.mode}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Recent Activity Section (Completed Sessions) ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">
            RECENT ACTIVITY
          </h2>
          <span className="text-xs text-slate-500">
            Last {completedSessions.length} sessions
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {completedSessions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {s.student}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  {s.status}
                </span>
              </div>

              <div className="mt-1 text-xs text-slate-700">
                {s.date} · {s.course}
              </div>

              <div className="mt-1 text-xs text-slate-600">
                {s.time} · {s.mode}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Messages Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">MESSAGES</h2>
          <span className="text-xs text-slate-500">
            {messages.filter((m) => m.unread).length} unread
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((msg) => (
            <button
              key={msg.id}
              type="button"
              className={`w-full rounded-xl border p-3 text-left text-sm transition hover:bg-slate-50 ${
                msg.unread
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {msg.student}
                </span>
                <span className="text-xs text-slate-600">{msg.time}</span>
              </div>

              <p className="mt-1 line-clamp-2 text-xs text-slate-700">
                {msg.snippet}
              </p>

              {msg.unread && (
                <span className="mt-2 inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          * These are demo messages to be replaced with backend data later.
        </p>
      </div>
    </section>
  );
}