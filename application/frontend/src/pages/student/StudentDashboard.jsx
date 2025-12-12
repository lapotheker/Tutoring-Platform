import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

const now = new Date();
const fmtDateTime = (d) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    typeof d === "string" ? new Date(d) : d
  );

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [composeTo, setComposeTo] = useState(null);
  const [openNotesFor, setOpenNotesFor] = useState(null);

  const tab = new URLSearchParams(location.search).get("tab");

  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try {
        const userData = JSON.parse(raw);
        setUser(userData);
        if (userData?.user_id) {
          fetchMessages(userData.user_id);
          fetchSessions(userData.user_id);
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
      const response = await fetch(`${API_BASE_URL}/messages/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSessions = async (userId) => {
    setLoadingSessions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/student/${userId}`);
      const data = await response.json();

      if (data.success) {
        setSessions(data.data || []);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const displayName = useMemo(() => {
    if (!user?.email && !user?.full_name) return "Student";
    if (user?.full_name) return user.full_name.split(" ")[0] || "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  const handleBecomeTutor = async () => {
    if (!user?.user_id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/upgrade-to-tutor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      const data = await res.json();
      if (data.success) {
        // Update stored user to role 2
        const updated = { ...user, role: 2 };
        localStorage.setItem("demoUser", JSON.stringify(updated));
        sessionStorage.setItem("demoUser", JSON.stringify(updated));
        setUser(updated);
        navigate("/tutor/dashboard", { replace: true });
      } else {
        alert(data.error || "Failed to upgrade to tutor");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("Network error upgrading to tutor");
    }
  };

  const currentUserId = user?.user_id ?? user?.id;

  const upcoming = sessions
    .filter((s) => s.status === "upcoming")
    .map((s) => ({
      id: s.session_id,
      title: s.course_info,
      course: s.course_info.split(" - ")[0] || s.course_info,
      tutor: { id: s.tutor_user_id, name: s.tutor_name },
      when: new Date(s.session_datetime),
      durationMin: s.duration_minutes || 60,
      mode: s.location_mode,
      status: s.status,
      meetingUrl: s.meeting_url,
    }))
    .sort((a, b) => a.when - b.when);

  const recent = sessions
    .filter((s) => s.status === "completed")
    .map((s) => ({
      id: s.session_id,
      title: s.course_info,
      course: s.course_info.split(" - ")[0] || s.course_info,
      tutor: { id: s.tutor_user_id, name: s.tutor_name },
      when: new Date(s.session_datetime),
      durationMin: s.duration_minutes || 60,
      mode: s.location_mode,
      status: s.status,
      ratingGiven: s.student_rating,
      notes: s.student_notes,
    }))
    .sort((a, b) => b.when - a.when);

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
            <MessagesList messages={messages} currentUserId={currentUserId} />
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

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xl font-bold">
              👤
            </div>
            <div className="text-lg md:text-xl font-semibold">Welcome, {displayName}!</div>
          </div>

          <div className="flex items-center gap-3 text-xl">
            <Link to="/dashboard?tab=messages" title="Messages" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
            SFSU TUTORING PLATFORM
          </h1>
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
                <span>🔍</span>
              </button>
            </div>
          </form>

          {/* Become a Tutor */}
          {user?.role !== 2 && user?.role !== 3 && (
            <div className="mt-4">
              <button
                onClick={handleBecomeTutor}
                className="rounded-full bg-green-600 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-green-700"
              >
                Become a Tutor (instant)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold">Upcoming Session</div>
        <div className="p-4 text-sm text-slate-700">
          {loadingSessions ? (
            <p className="text-sm text-slate-600">Loading sessions...</p>
          ) : upcoming.length === 0 ? (
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
                      onClick={() =>
                        window.open(
                          s.meetingUrl || "https://zoom.us/j/123456789",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Join / Open Link
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() =>
                        navigate("/dashboard?tab=messages", {
                          state: { composeTo: { id: s.tutor.id, name: s.tutor.name } },
                        })
                      }
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

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold">Recent Activity</div>
        <div className="p-4 text-sm text-slate-700">
          {loadingSessions ? (
            <p className="text-sm text-slate-600">Loading sessions...</p>
          ) : recent.length === 0 ? (
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
                      onClick={() => setOpenNotesFor(s)}
                    >
                      View Notes
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() =>
                        navigate({
                          pathname: `/tutor/request/${s.tutor.id}`,
                          search: location.search,
                        })
                      }
                    >
                      Rebook Tutor
                    </button>
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                      onClick={() =>
                        navigate("/dashboard?tab=messages", {
                          state: { composeTo: { id: s.tutor.id, name: s.tutor.name } },
                        })
                      }
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

      {/* Messages Preview */}
      <div className="rounded-2xl border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-4 font-semibold flex items-center justify-between">
          <span>Messages</span>
          <Link to="/dashboard?tab=messages" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="p-4">
          {loadingMessages ? (
            <p className="text-sm text-slate-600">Loading messages...</p>
          ) : (
            <MessagesPreview messages={messages} currentUserId={currentUserId} />
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {openNotesFor && <NotesModal session={openNotesFor} onClose={() => setOpenNotesFor(null)} />}
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
      const response = await fetch(`${API_BASE_URL}/messages`, {
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
          ⚠️ You have already sent a message to{" "}
          <span className="font-medium">{composeTo.name}</span>. Only one message per tutor is
          allowed to prevent spam.
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
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      <div className="mt-1 text-xs text-slate-500">
        Note: You can only send one message per tutor to keep communication simple.
      </div>
    </div>
  );
}

function MessagesPreview({ messages, currentUserId }) {
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
