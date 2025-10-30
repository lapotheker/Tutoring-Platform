// src/pages/RequestSession.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

// Simple local data (same mock tutors as used in TutorSearch)
const MOCK = [
  {
    id: 1,
    name: "Alex Chen",
    subjects: ["CSC 415", "Data Structures"],
    rate: 30,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Maya Singh",
    subjects: ["Math 227", "Linear Algebra"],
    rate: 28,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Sofia Lopez",
    subjects: ["ENG 214", "Academic Writing"],
    rate: 25,
    rating: 4.9,
  },
];

export default function RequestSession() {
  const { id } = useParams(); // Get tutor ID from URL (e.g., /tutor/request/1)
  const navigate = useNavigate();

  // Form state
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  // Check demo login status (Login.jsx stores demoUser in localStorage)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("demoUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // If user not logged in, redirect to login page
  // and return here after login using ?next=...
  useEffect(() => {
    if (!user) {
      const next = encodeURIComponent(`/tutor/request/${id}`);
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [user, id, navigate]);

  // Find the selected tutor from the mock list
  const tutor = useMemo(() => MOCK.find((t) => String(t.id) === String(id)), [id]);

  // If tutor not found (invalid ID in URL)
  if (!tutor) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold">Tutor not found</h1>
          <p className="text-slate-600 mt-2">
            The tutor you are trying to contact does not exist.{" "}
            <Link to="/tutor/search" className="text-blue-600 hover:underline">
              Back to search
            </Link>
          </p>
        </div>
      </section>
    );
  }

  // Handle form submission (demo only)
  function onSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true); // Mark as "sent" for success UI
  }

  return (
    <section className="space-y-6">
      {/* Header section */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Request a Session</h1>
        <p className="text-slate-600 mt-2 text-sm">
          One-way messaging (demo only): Students can send a single message to a tutor. Tutors
          cannot reply inside the app.
        </p>
      </header>

      {/* Tutor summary card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="font-semibold text-lg">{tutor.name}</div>
        <div className="text-sm text-slate-600 mt-1">{tutor.subjects.join(", ")}</div>
        <div className="text-sm mt-2">
          Rate: ${tutor.rate}/hr · Rating: {tutor.rating}
        </div>
      </div>

      {/* Show either success message or message form */}
      {sent ? (
        // Success confirmation
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 p-6">
          <div className="font-semibold">Request sent!</div>
          <p className="text-sm mt-1">
            Your message has been recorded for demo purposes. This is a one-way message—tutors
            cannot reply inside the app.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/tutor/search"
              className="rounded-xl bg-slate-900 px-4 py-2 text-white text-sm hover:bg-black"
            >
              Back to Search
            </Link>
            <Link
              to="/tutor"
              className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 text-sm hover:bg-slate-200"
            >
              Tutor Home
            </Link>
          </div>
        </div>
      ) : (
        // Request form
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <div className="text-sm text-slate-600 mb-1">Message (max 500 characters)</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="Briefly describe your course/topic, preferred time, and goals…"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <div className="mt-3 text-xs text-slate-500">
            * Demo only — no real emails or payments are sent.
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
            >
              Send Request
            </button>
            <Link
              to="/tutor/search"
              className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 text-sm hover:bg-slate-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
