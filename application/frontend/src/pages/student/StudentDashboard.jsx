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
        // Fetch messages when user is set
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
        <section className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-purple-200/50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-extrabold tracking-wide text-purple-900">Inbox</h1>
              <Link to="/dashboard" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
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
              <p className="text-sm text-purple-600">Loading messages...</p>
            ) : (
              <MessagesList 
                messages={messages} 
                currentUserId={currentUserId} 
              />
            )}
          </div>
        </section>
      </div>
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

  const card = "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <section className="max-w-5xl mx-auto space-y-6">
        {/* ===== Header Section ===== */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-amber-400">
                👤
              </div>
              <div>
                <div className="text-xl font-extrabold text-purple-900">Welcome, {displayName}!</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-2xl">
              <Link to="/dashboard?tab=messages" title="Messages" className="hover:opacity-80 transition-opacity">
                ✉️
              </Link>
              <Link to="/" title="Home" className="hover:opacity-80 transition-opacity">
                🏠
              </Link>
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            SCHOLARLYGATOR
          </h1>

          <div className="mt-6">
            <h2 className="text-center text-lg md:text-xl font-bold text-purple-800 mb-3">Find A Tutor</h2>
            <form onSubmit={onSearch} className="flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border-2 border-purple-300 pl-5 pr-2 py-2.5 w-full max-w-lg bg-white shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200 transition-all">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by course, subject, or name"
                  className="flex-1 outline-none text-sm bg-transparent"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="grid place-items-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
                  aria-label="Search"
                >
                  <span>🔍</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== Upcoming Sessions ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">UPCOMING SESSIONS</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {upcoming.length} scheduled
            </span>
          </div>

          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No upcoming sessions scheduled.</p>
                <p className="mt-1 text-purple-600 text-sm">Find a tutor and book your first session!</p>
              </div>
            ) : (
              upcoming.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.title}</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 border border-blue-300">
                      {s.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {s.course} · with <span className="font-semibold text-purple-700">{s.tutor.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Recent Activity (Completed Sessions) ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">RECENT ACTIVITY</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Last {completed.length} sessions
            </span>
          </div>

          <div className="space-y-3">
            {completed.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No completed sessions yet.</p>
                <p className="mt-1 text-purple-600 text-sm">Book a session to see it here.</p>
              </div>
            ) : (
              completed.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.title}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 border border-emerald-300">
                      {s.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {s.course} · with <span className="font-semibold text-purple-700">{s.tutor.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {fmtDateTime(s.when)} · {s.durationMin} min · {s.mode}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Messages Section ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">MESSAGES</h2>
            <Link to="/dashboard?tab=messages" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
              View all →
            </Link>
          </div>
          <div>
            {loadingMessages ? (
              <p className="text-sm text-purple-600">Loading messages...</p>
            ) : (
              <MessagesPreview 
                messages={messages} 
                currentUserId={currentUserId} 
              />
            )}
          </div>

          <p className="mt-4 text-xs text-purple-500 italic">
            * These are demo messages to be replaced with backend data later.
          </p>
        </div>
      </section>
    </div>
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
      <div className="mb-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-3">
        <div className="text-sm text-amber-800">
          ⚠️ You have already sent a message to <span className="font-semibold">{composeTo.name}</span>.
          Only one message per tutor is allowed to prevent spam.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
      <div className="text-sm font-semibold text-purple-900 mb-2">
        Compose to <span className="text-purple-700">{composeTo.name}</span>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border-2 border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          disabled={sending}
        />
        <button
          onClick={send}
          disabled={sending}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 text-sm font-bold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-600 font-medium">{error}</div>
      )}
      <div className="mt-2 text-xs text-purple-600">
        Note: You can only send one message per tutor to keep communication simple.
      </div>
    </div>
  );
}

function MessagesPreview({ messages, currentUserId }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
        <p className="text-purple-700 font-medium">No messages yet.</p>
        <p className="mt-1 text-purple-600 text-sm">Connect with tutors to start messaging.</p>
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
          <li key={m.message_id} className="border-2 border-purple-200 p-4 rounded-xl bg-white hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-purple-900">
                {isSent ? `To ${m.recipient_name}` : `From ${m.sender_name}`}
              </div>
              <div className="text-xs text-purple-600">{fmtDateTime(m.created_at)}</div>
            </div>
            <p className="mt-2 text-sm text-slate-700">{m.message}</p>
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  isSent ? "bg-indigo-100 text-indigo-700 border border-indigo-300" : "bg-slate-200 text-slate-700 border border-slate-300"
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
    return <p className="text-sm text-purple-600">No messages yet.</p>;
  }

  const sorted = messages.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <ul className="space-y-3">
      {sorted.map((m) => {
        const isSent = m.sender_user_id === currentUserId;
        return (
          <li key={m.message_id} className="border-2 border-purple-200 p-4 rounded-xl bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-purple-900">
                {isSent ? `To ${m.recipient_name}` : `From ${m.sender_name}`}
              </div>
              <div className="text-xs text-purple-600">{fmtDateTime(m.created_at)}</div>
            </div>
            <p className="text-sm mt-2 text-slate-700">{m.message}</p>
            <p className="text-xs text-purple-500 mt-2">
              From #{m.sender_user_id} → To #{m.recipient_user_id}
            </p>
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  isSent ? "bg-indigo-100 text-indigo-700 border border-indigo-300" : "bg-slate-200 text-slate-700 border border-slate-300"
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