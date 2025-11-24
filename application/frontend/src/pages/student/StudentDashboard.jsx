import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const now = new Date();
const daysFromNow = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d;
};

const FAKE_SESSIONS = [
  {
    id: "sess_1001",
    title: "Data Structures – Linked Lists",
    course: "CSC 340",
    tutor: { id: 201, name: "Alice Nguyen" },
    when: daysFromNow(1),
    durationMin: 60,
    mode: "Online (Zoom)",
    status: "upcoming",
    meetingUrl: "https://zoom.us/j/123456789",
  },
  {
    id: "sess_1000",
    title: "Software Engineering – Project Setup",
    course: "CSC 648",
    tutor: { id: 202, name: "David Kim" },
    when: daysFromNow(-2),
    durationMin: 90,
    mode: "In-person · Library Room 210",
    status: "completed",
    ratingGiven: 5,
    notes: `Agenda:
- Functional and nonfunctional requirements walkthrough
- UI design principles and example mockups

Homework:
- Update search based on new simplified design`,
  },
  {
    id: "sess_0999",
    title: "Calculus II – Convergent Series Practice",
    course: "MATH 227",
    tutor: { id: 203, name: "Priya Patel" },
    when: daysFromNow(-6),
    durationMin: 60,
    mode: "Online (Google Meet)",
    status: "completed",
    ratingGiven: 4,
    notes: `Covered:
- Integral Test
- Comparsion Test`,
  },
];

const FAKE_MESSAGES_TEMPLATE = (currentUserId = 5) => [
  {
    message_id: "m_5007",
    sender_user_id: currentUserId,
    recipient_user_id: 202,
    to_name: "David Kim",
    from_name: "You",
    message: "Hi David! Are you available this Friday at 2pm?",
    created_at: daysFromNow(-1).toISOString(),
  },
  {
    message_id: "m_5006",
    sender_user_id: 202,
    recipient_user_id: currentUserId,
    to_name: "You",
    from_name: "David Kim",
    message: "Hi! Yes, Friday 2pm works. I’ll send a Zoom link.",
    created_at: daysFromNow(-1).toISOString(),
  },
  {
    message_id: "m_5005",
    sender_user_id: currentUserId,
    recipient_user_id: 201,
    to_name: "Alice Nguyen",
    from_name: "You",
    message: "Thanks for the tips on linked lists — super helpful!",
    created_at: daysFromNow(-5).toISOString(),
  },
  {
    message_id: "m_5004",
    sender_user_id: 203,
    recipient_user_id: currentUserId,
    to_name: "You",
    from_name: "Priya Patel",
    message: "Uploading the induction worksheet shortly.",
    created_at: daysFromNow(-6).toISOString(),
  },
];

const fmtDateTime = (d) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
    .format(typeof d === "string" ? new Date(d) : d);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");

  const [composeTo, setComposeTo] = useState(null);

  const [openNotesFor, setOpenNotesFor] = useState(null);

  const tab = new URLSearchParams(location.search).get("tab");

  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { setUser(null); }
    }
    if (location.state?.composeTo) {
      setComposeTo(location.state.composeTo);
    }
  }, [location.state]);

  const displayName = useMemo(() => {
    if (!user?.email) return "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  const handleMessageTutor = (tutor) => {
    navigate("/dashboard?tab=messages", {
      state: { composeTo: { id: tutor.id, name: tutor.name } },
      replace: false,
    });
  };

  const handleRebookTutor = (tutor) => {
    const tutorId = String(tutor.user_id ?? tutor.id);
    const search = location.search || "";
    navigate({ pathname: `/tutor/request/${tutorId}`, search });
  };

  const handleViewNotes = (session) => setOpenNotesFor(session);
  const handleJoinLink = (url) =>
    window.open(url || "https://zoom.us/j/123456789", "_blank", "noopener,noreferrer");

  if (tab === "messages") {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-extrabold tracking-wide">Inbox</h1>
            <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>

          {composeTo && (
            <ComposeBar
              composeTo={composeTo}
              onSent={() => setComposeTo(null)}
              currentUserId={user?.user_id ?? user?.id ?? 5}
            />
          )}

          <MessagesList currentUserId={user?.user_id ?? user?.id ?? 5} />
        </div>
      </section>
    );
  }

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/results");
    navigate(`/results?q=${encodeURIComponent(target)}`);
  }

  const upcoming = FAKE_SESSIONS.filter((s) => s.status === "upcoming").sort((a, b) => a.when - b.when);
  const recent = FAKE_SESSIONS.filter((s) => s.status === "completed").sort((a, b) => b.when - a.when);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xl font-bold">
              &#128100;
            </div>
            <div className="text-lg md:text-xl font-semibold">Welcome, {displayName}!</div>
          </div>

          <div className="flex items-center gap-3 text-xl">
            <Link to="/dashboard?tab=messages" title="Messages" className="hover:opacity-80">
              &#9993;
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              &#127968;
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">SFSU TUTORING PLATFORM</h1>
          <h2 className="mt-2 text-lg md:text-xl font-bold">Find A Tutor</h2>

          <form onSubmit={onSearch} className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 w-full max-w-lg bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course, subject, or name"
                className="flex-1 outline-none text-sm"
                aria-label="Search"
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
      </div>

      {/* ===== Upcoming ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold">Upcoming Session</div>
        <div className="p-4 text-sm text-slate-700">
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p>No upcoming sessions scheduled.</p>
              <p>Find a tutor and book your first session!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((s) => (
                <li key={s.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{s.title}</div>
                    <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {s.course} · with <span className="font-medium">{s.tutor.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="rounded-md bg-slate-900 text-white px-3 py-1 text-xs hover:bg-black"
                      onClick={() => handleJoinLink(s.meetingUrl)}
                    >
                      Join / Open Link
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() => handleMessageTutor(s.tutor)}
                    >
                      Message Tutor
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold">Recent Activity</div>
        <div className="p-4 text-sm text-slate-700">
          {recent.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p>No completed sessions yet.</p>
              <p>Book a session to see it here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((s) => (
                <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{s.title}</div>
                    <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">
                      COMPLETED
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {s.course} · with <span className="font-medium">{s.tutor.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() => handleViewNotes(s)}
                    >
                      View Notes
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() => handleRebookTutor(s.tutor)}
                    >
                      Rebook Tutor
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() => handleMessageTutor(s.tutor)}
                    >
                      Message Tutor
                    </button>
                    <span className="text-xs text-slate-500 ml-auto">
                      {s.ratingGiven ? `Your Rating: ${"★".repeat(s.ratingGiven)}` : "Not rated"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold flex items-center justify-between">
          <span>Messages</span>
          <Link to="/dashboard?tab=messages" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="p-4">
          <MessagesPreview currentUserId={user?.user_id ?? user?.id ?? 5} />
        </div>
      </div>

      {/* Notes Modal */}
      {openNotesFor && (
        <NotesModal session={openNotesFor} onClose={() => setOpenNotesFor(null)} />
      )}
    </section>
  );
}


function ComposeBar({ composeTo, onSent }) {
  const [text, setText] = useState("");

  const send = () => {
    setText("");
    onSent?.();
    alert(`Message sent to ${composeTo.name} (demo)`);
  };

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-sm mb-2">
        Compose to <span className="font-medium">{composeTo.name}</span>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-1.5 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
        />
        <button
          onClick={send}
          className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-black"
        >
          Send
        </button>
      </div>
      <div className="mt-1 text-xs text-slate-500">Demo only — wire to POST /api/messages later.</div>
    </div>
  );
}

function MessagesPreview({ currentUserId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(FAKE_MESSAGES_TEMPLATE(currentUserId));
  }, [currentUserId]);

  if (messages.length === 0) {
    return <p className="text-sm text-slate-600">No messages yet.</p>;
  }

  const lastThree = messages
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <ul className="space-y-3">
      {lastThree.map((m) => {
        const isSent = m.sender_user_id === currentUserId;
        return (
          <li key={m.message_id} className="border p-3 rounded bg-slate-50 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{isSent ? `To ${m.to_name}` : `From ${m.from_name}`}</div>
              <div className="text-xs text-slate-500">{fmtDateTime(m.created_at)}</div>
            </div>
            <p className="mt-1">{m.message}</p>
            <div className="mt-2 text-xs">
              <span
                className={`inline-block rounded-full px-2 py-0.5 ${
                  isSent ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {isSent ? "Sent" : "Received"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function MessagesList({ currentUserId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(FAKE_MESSAGES_TEMPLATE(currentUserId));
  }, [currentUserId]);

  if (messages.length === 0) {
    return <p className="text-sm text-slate-600">No messages yet.</p>;
  }

  const sorted = messages.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <ul className="space-y-3">
      {sorted.map((m) => {
        const isSent = m.sender_user_id === currentUserId;
        return (
          <li key={m.message_id} className="border p-3 rounded bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {isSent ? `To ${m.to_name}` : `From ${m.from_name}`}
              </div>
              <div className="text-xs text-slate-500">{fmtDateTime(m.created_at)}</div>
            </div>
            <p className="text-sm mt-1">{m.message}</p>
            <p className="text-xs text-slate-500 mt-1">
              From #{m.sender_user_id} → To #{m.recipient_user_id}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                  isSent ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {isSent ? "Sent" : "Received"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function NotesModal({ session, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(640px,92vw)] rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="font-semibold text-slate-800 text-sm">
            Session Notes — {session.title}
          </div>
          <button
            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          <div className="text-xs text-slate-600 mb-2">
            {session.course} · {fmtDateTime(session.when)} · {session.durationMin} min
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-200">
{session.notes || "No notes available for this session (demo)."}
          </pre>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100">
              Download (.txt)
            </button>
            <button className="rounded-md bg-blue-600 text-white px-3 py-1 text-xs hover:bg-blue-700">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
