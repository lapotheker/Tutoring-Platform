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
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [composeTo, setComposeTo] = useState(null);

  const tab = new URLSearchParams(location.search).get("tab");

  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try { 
        const userData = JSON.parse(raw);
        setUser(userData);
        if (userData?.user_id) {
          fetchMessages(userData.user_id);
        }
      } catch { 
        setUser(null); 
      }
    }
    if (location.state?.composeTo) {
      setComposeTo(location.state.composeTo);
    }
  }, [location.state]);

  const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:3000/api/messages/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data || []);
      } else {
        console.error("Failed to fetch messages:", data.error);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const displayName = useMemo(() => {
    if (!user?.email) return "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  const currentUserId = user?.user_id ?? user?.id;

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
              onSent={() => {
                setComposeTo(null);
                if (currentUserId) {
                  fetchMessages(currentUserId);
                }
              }}
              currentUserId={currentUserId}
              existingMessages={messages}
            />
          )}

          {loadingMessages ? (
            <p className="text-sm text-slate-600">Loading messages...</p>
          ) : (
            <MessagesList 
              messages={messages} 
              currentUserId={currentUserId} 
            />
          )}
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
  const completed = FAKE_SESSIONS.filter((s) => s.status === "completed").sort((a, b) => b.when - a.when);

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  return (
    <section className="space-y-6">
      {/* ===== Header Section ===== */}
      <div className={card}>
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
          <h1 className={bigTitle}>SFSU TUTORING PLATFORM</h1>
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

      {/* ===== Upcoming Sessions ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">UPCOMING SESSIONS</h2>
          <span className="text-xs text-slate-500">{upcoming.length} scheduled</span>
        </div>

        <div className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p>No upcoming sessions scheduled.</p>
              <p className="mt-1 text-slate-600">Find a tutor and book your first session!</p>
            </div>
          ) : (
            upcoming.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    {s.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-700">
                  {s.course} · with <span className="font-medium">{s.tutor.name}</span>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== Recent Activity (Completed Sessions) ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">RECENT ACTIVITY</h2>
          <span className="text-xs text-slate-500">
            Last {completed.length} sessions
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {completed.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p>No completed sessions yet.</p>
              <p className="mt-1 text-slate-600">Book a session to see it here.</p>
            </div>
          ) : (
            completed.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    {s.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-700">
                  {s.course} · with <span className="font-medium">{s.tutor.name}</span>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== Messages Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">MESSAGES</h2>
          <Link to="/dashboard?tab=messages" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-4">
          {loadingMessages ? (
            <p className="text-sm text-slate-600">Loading messages...</p>
          ) : (
            <MessagesPreview 
              messages={messages} 
              currentUserId={currentUserId} 
            />
          )}
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          * These are demo messages to be replaced with backend data later.
        </p>
      </div>
    </section>
  );
}

function ComposeBar({ composeTo, onSent, currentUserId, existingMessages }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const alreadyMessaged = existingMessages.some(
    (m) => m.sender_user_id === currentUserId && m.recipient_user_id === composeTo.id
  );

  const send = async () => {
    if (!text.trim()) {
      setError("Message cannot be empty");
      return;
    }

    if (alreadyMessaged) {
      setError("You have already sent a message to this tutor");
      return;
    }

    setError("");
    setSending(true);

    try {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_user_id: currentUserId,
          recipient_user_id: composeTo.id,
          message: text.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setText("");
        onSent?.();
        alert(`Message sent to ${composeTo.name} successfully!`);
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Network error - please try again");
    } finally {
      setSending(false);
    }
  };

  if (alreadyMessaged) {
    return (
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3">
        <div className="text-sm text-amber-800">
          ⚠️ You have already sent a message to <span className="font-medium">{composeTo.name}</span>.
          Only one message per tutor is allowed to prevent spam.
        </div>
      </div>
    );
  }

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
          disabled={sending}
        />
        <button
          onClick={send}
          disabled={sending}
          className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-600">{error}</div>
      )}
      <div className="mt-1 text-xs text-slate-500">
        Note: You can only send one message per tutor to keep communication simple.
      </div>
    </div>
  );
}

function MessagesPreview({ messages, currentUserId }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>No messages yet.</p>
        <p className="mt-1">Connect with tutors to start messaging.</p>
      </div>
    );
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
              <div className="font-medium">
                {isSent ? `To ${m.recipient_name}` : `From ${m.sender_name}`}
              </div>
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

function MessagesList({ messages, currentUserId }) {
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
                {isSent ? `To ${m.recipient_name}` : `From ${m.sender_name}`}
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