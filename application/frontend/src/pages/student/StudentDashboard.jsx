import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { API_BASE_URL } from "../../services/api";

const fmtDateTime = (d) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    typeof d === "string" ? new Date(d) : d
  );

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [query, setQuery] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);

  const [composeTo, setComposeTo] = useState(null);

  const tab = new URLSearchParams(location.search).get("tab");

  // Fetch messages when user is set
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        return (
          JSON.parse(localStorage.getItem("demoUser")) ||
          JSON.parse(sessionStorage.getItem("demoUser"))
        );
      } catch {
        return null;
      }
    };

    const userData = getUserFromStorage();
    if (userData?.user_id) {
      setUser(userData);
      setCurrentUserId(userData.user_id);
      // Fetch messages when user is set
      if (userData.user_id) {
        fetchMessages(userData.user_id);
        fetchSessions(userData.user_id);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      // Fetch both sent and received messages
      const [sentRes, receivedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/messages/sent/${userId}`),
        fetch(`${API_BASE_URL}/messages/received/${userId}`),
      ]);

      const sentData = await sentRes.json();
      const receivedData = await receivedRes.json();

      if (sentData.success) {
        setSentMessages(sentData.data || []);
      } else {
        console.error("Failed to fetch sent messages:", sentData.error);
        setSentMessages([]);
      }

      if (receivedData.success) {
        setReceivedMessages(receivedData.data || []);
      } else {
        console.error("Failed to fetch received messages:", receivedData.error);
        setReceivedMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSentMessages([]);
      setReceivedMessages([]);
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
        console.error("Failed to fetch sessions:", data.error);
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
    if (!user?.email) return "Student";
    const left = user.email.split("@")[0];
    if (!left) return "Student";
    return left.charAt(0).toUpperCase() + left.slice(1);
  }, [user]);

  const isAlreadyTutor = user?.role === 2;

  const handleBecomeTutor = async () => {
    setAcceptingTerms(true);
    try {
      // Update user role to tutor (role 2)
      const response = await fetch(`${API_BASE_URL}/auth/upgrade-to-tutor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage with new role
        const updatedUser = { ...user, role: 2 };
        const storage = localStorage.getItem("demoUser") ? localStorage : sessionStorage;
        storage.setItem("demoUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowTermsModal(false);
        // Redirect to tutor dashboard
        navigate("/tutor/dashboard");
      } else {
        alert("Failed to upgrade account. Please try again.");
      }
    } catch (error) {
      console.error("Error upgrading to tutor:", error);
      alert("Failed to upgrade account. Please try again.");
    } finally {
      setAcceptingTerms(false);
    }
  };

  if (tab === "messages") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
        <section className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-purple-200/50">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-extrabold tracking-wide text-purple-900">
                Student Messages
              </h1>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Messages Sent to Tutors */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-900 mb-4">
                Messages Sent to Tutors ({sentMessages.length})
              </h2>
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
                  existingMessages={[...sentMessages, ...receivedMessages]}
                />
              )}

              {loadingMessages ? (
                <p className="text-sm text-purple-600">Loading sent messages...</p>
              ) : sentMessages.length === 0 ? (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                  <p className="text-purple-700 font-medium">No messages sent yet.</p>
                </div>
              ) : (
                <MessagesList messages={sentMessages} currentUserId={currentUserId} />
              )}
            </div>

            {/* Messages Received from Tutors */}
            <div>
              <h2 className="text-lg font-bold text-purple-900 mb-4">
                Messages Received from Tutors ({receivedMessages.length})
              </h2>
              {loadingMessages ? (
                <p className="text-sm text-purple-600">Loading received messages...</p>
              ) : receivedMessages.length === 0 ? (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                  <p className="text-purple-700 font-medium">No messages received yet.</p>
                </div>
              ) : (
                <MessagesList messages={receivedMessages} currentUserId={currentUserId} />
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  function onSearch(e) {
    e.preventDefault();
    const target = query.trim();
    if (!target) return navigate("/results");
    navigate(`/results?search=${encodeURIComponent(target)}`);
  }

  const upcoming = sessions
    .filter((s) => s.status === "upcoming")
    .sort((a, b) => new Date(a.session_datetime) - new Date(b.session_datetime));
  const completed = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => new Date(b.session_datetime) - new Date(a.session_datetime));

  const card =
    "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <section className="max-w-5xl mx-auto space-y-6">
        {/* ===== Header Section ===== */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ring-4 ring-amber-400 overflow-hidden">
                <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-extrabold text-purple-900">
                  Welcome, {displayName}!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isAlreadyTutor && (
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-5 py-2.5 text-sm font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                >
                  Become a Tutor
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center mt-6">
            <div className="inline-flex h-20 w-20 items-center justify-center mb-2">
              <img src={logo} alt="ScholarlyGator Logo" className="h-full w-full object-contain" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              SCHOLARLYGATOR
            </h1>
          </div>

          <div className="mt-6">
            <h2 className="text-center text-lg md:text-xl font-bold text-purple-800 mb-3">
              Find A Tutor
            </h2>
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
            {loadingSessions ? (
              <p className="text-sm text-purple-600">Loading sessions...</p>
            ) : upcoming.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No upcoming sessions scheduled.</p>
                <p className="mt-1 text-purple-600 text-sm">
                  Find a tutor and book your first session!
                </p>
              </div>
            ) : (
              upcoming.map((s) => (
                <div
                  key={s.session_id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.course_info}</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 border border-blue-300">
                      {s.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{s.tutor_name || "TBA"}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {fmtDateTime(s.session_datetime)} · {s.location_mode}
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
            {loadingSessions ? (
              <p className="text-sm text-purple-600">Loading sessions...</p>
            ) : completed.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No completed sessions yet.</p>
                <p className="mt-1 text-purple-600 text-sm">Book a session to see it here.</p>
              </div>
            ) : (
              completed.map((s) => (
                <div
                  key={s.session_id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.course_info}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 border border-emerald-300">
                      {s.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{s.tutor_name || "TBA"}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {fmtDateTime(s.session_datetime)} · {s.location_mode}
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
            <Link
              to="/dashboard?tab=messages"
              className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div>
            {loadingMessages ? (
              <p className="text-sm text-purple-600">Loading messages...</p>
            ) : (
              <MessagesPreview
                messages={[...sentMessages, ...receivedMessages]}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-8 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-extrabold text-purple-900 mb-4">
              Become a Tutor - Terms and Conditions
            </h2>

            <div className="space-y-4 text-sm text-slate-700 mb-6">
              <p className="font-semibold text-purple-800">
                By becoming a tutor on ScholarlyGator, you agree to:
              </p>

              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>Provide accurate and truthful information in your tutor profile</li>
                <li>Maintain professional conduct in all interactions with students</li>
                <li>
                  Honor all scheduled tutoring sessions or provide reasonable notice for
                  cancellations
                </li>
                <li>Protect student privacy and confidentiality</li>
                <li>Follow all SFSU policies and guidelines</li>
                <li>Keep your availability and profile information up to date</li>
                <li>Respond to student inquiries in a timely manner</li>
                <li>Deliver quality tutoring services as advertised</li>
              </ol>

              <p className="font-semibold text-purple-800 mt-6">Code of Conduct:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Treat all students with respect and professionalism</li>
                <li>Maintain appropriate boundaries in tutor-student relationships</li>
                <li>Do not engage in academic dishonesty or help students cheat</li>
                <li>Report any violations of platform policies to administrators</li>
              </ul>

              <p className="mt-4 text-xs text-slate-600 italic">
                Note: Your tutor profile will be subject to administrator review before being
                published to students.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBecomeTutor}
                disabled={acceptingTerms}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-bold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acceptingTerms ? "Processing..." : "I Accept - Become a Tutor"}
              </button>
              <button
                onClick={() => setShowTermsModal(false)}
                disabled={acceptingTerms}
                className="flex-1 rounded-xl border-2 border-purple-300 bg-white px-6 py-3 font-bold text-purple-700 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

  async function handleSend() {
    if (!text.trim()) {
      setError("Please enter a message.");
      return;
    }
    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_user_id: currentUserId,
          recipient_user_id: composeTo.id,
          message_content: text.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setText("");
        onSent();
      } else {
        setError(data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  if (alreadyMessaged) return null;

  return (
    <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-4 mb-4">
      <h3 className="text-sm font-bold text-blue-900 mb-2">Send message to {composeTo?.name}</h3>
      <textarea
        className="w-full rounded-lg border-2 border-blue-200 p-3 text-sm focus:border-blue-400 focus:outline-none resize-none"
        rows={3}
        placeholder="Type your message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {sending ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => onSent()}
          className="px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function MessagesList({ messages, currentUserId }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
        <p className="text-purple-700 font-medium">No messages yet.</p>
        <p className="mt-1 text-purple-600 text-sm">Start a conversation with a tutor!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => {
        const isSender = msg.sender_user_id === currentUserId;
        const displayName = isSender ? msg.recipient_name : msg.sender_name;
        const timeStr = new Date(msg.created_at).toLocaleString();

        return (
          <div
            key={msg.message_id}
            className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-900">
                {isSender ? `To: ${displayName}` : `From: ${displayName}`}
              </span>
              <span className="text-xs text-purple-600">{timeStr}</span>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
          </div>
        );
      })}
    </div>
  );
}

function MessagesPreview({ messages, currentUserId }) {
  const preview = messages.slice(0, 3);

  if (preview.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
        <p className="text-purple-700 font-medium">No messages yet.</p>
        <p className="mt-1 text-purple-600 text-sm">Start a conversation with a tutor!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {preview.map((msg) => {
        const isSender = msg.sender_user_id === currentUserId;
        const displayName = isSender ? msg.recipient_name : msg.sender_name;
        const timeStr = new Date(msg.created_at).toLocaleString();

        return (
          <div
            key={msg.message_id}
            className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-900">
                {isSender ? `To: ${displayName}` : `From: ${displayName}`}
              </span>
              <span className="text-xs text-purple-600">{timeStr}</span>
            </div>
            <p className="text-sm text-slate-700 line-clamp-2">{msg.message}</p>
          </div>
        );
      })}
    </div>
  );
}
