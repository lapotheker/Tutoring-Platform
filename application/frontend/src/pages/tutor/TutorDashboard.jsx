import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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
      if (userData.user_id) {
        fetchTutorProfile(userData.user_id);
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
      // Fetch both sent and received messages FOR TUTORS
      const [sentRes, receivedRes] = await Promise.all([
        fetch(`http://localhost:3000/api/messages/tutor/sent/${userId}`),
        fetch(`http://localhost:3000/api/messages/tutor/received/${userId}`),
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
      const response = await fetch(`http://localhost:3000/api/sessions/tutor/${userId}`);
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

  const fetchTutorProfile = async (userId) => {
    setLoadingProfile(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tutors/profile/by-user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setTutorProfile(data.data);
      } else {
        // No profile exists
        setTutorProfile(null);
      }
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
      setTutorProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const displayName = useMemo(() => {
    if (user?.full_name) {
      return user.full_name;
    }
    if (user?.email) {
      const beforeAt = user.email.split("@")[0] || "Tutor";
      return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
    }
    return "Tutor";
  }, [user]);

  const card =
    "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";

  const upcomingSessions = sessions
    .filter((s) => s.status === "upcoming")
    .sort((a, b) => new Date(a.session_datetime) - new Date(b.session_datetime));
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => new Date(b.session_datetime) - new Date(a.session_datetime));

  const fmtDateTime = (d) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
      typeof d === "string" ? new Date(d) : d
    );

  // Determine profile status
  const getProfileStatusSection = () => {
    if (loadingProfile) {
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>
          <p className="text-sm text-purple-600">Loading profile status...</p>
        </div>
      );
    }

    if (!tutorProfile) {
      // No profile created yet
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>

          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
            <div className="text-lg md:text-xl font-extrabold text-amber-900 mb-3">
              YOU DON&apos;T HAVE A TUTOR PROFILE YET
            </div>

            <p className="text-slate-800 mb-2">
              Create your profile to start offering tutoring services.
            </p>

            <p className="text-slate-800 mb-4">
              <span className="underline underline-offset-2 font-semibold">
                Your profile will be reviewed by administrators
              </span>{" "}
              before appearing in search results.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/tutor/posting")}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-bold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                CREATE PROFILE
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Profile exists - show status
    const status = tutorProfile.approval_status;

    if (status === "Approved") {
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>

          <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
            <div className="text-lg md:text-xl font-extrabold text-emerald-900 mb-3">
              ✓ YOUR PROFILE IS APPROVED AND LIVE
            </div>

            <p className="text-slate-800 mb-4">
              Students can now find and contact you through the platform.
            </p>

            <div className="flex gap-3">
              <Link
                to="/tutor/profile/edit"
                className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-5 py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                Edit Profile
              </Link>
              <Link
                to={`/tutors/${tutorProfile.tutor_profile_id}`}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-2.5 text-sm font-bold text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm"
              >
                View Public Profile
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (status === "Pending") {
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>

          <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-sky-50 p-6">
            <div className="text-lg md:text-xl font-extrabold text-blue-900 mb-3">
              ⏳ YOUR PROFILE IS UNDER REVIEW
            </div>

            <p className="text-slate-800 mb-2">
              Your tutor profile has been submitted and is being reviewed by our administrators.
            </p>

            <p className="text-slate-800 mb-4">
              You will be notified once your profile is approved. This usually takes 1-2 business
              days.
            </p>

            <Link
              to="/tutor/profile/edit"
              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-5 py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      );
    }

    if (status === "Rejected") {
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>

          <div className="rounded-2xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-rose-50 p-6">
            <div className="text-lg md:text-xl font-extrabold text-red-900 mb-3">
              ✗ YOUR PROFILE WAS NOT APPROVED
            </div>

            <p className="text-slate-800 mb-4">
              Unfortunately, your tutor profile did not meet our requirements. Please review and
              update your profile to resubmit.
            </p>

            <Link
              to="/tutor/profile/edit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-bold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Update & Resubmit Profile
            </Link>
          </div>
        </div>
      );
    }

    if (status === "Removed") {
      return (
        <div className={card}>
          <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-4">PROFILE STATUS</h2>

          <div className="rounded-2xl border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 p-6">
            <div className="text-lg md:text-xl font-extrabold text-gray-900 mb-3">
              YOUR PROFILE HAS BEEN REMOVED
            </div>

            <p className="text-slate-800 mb-4">
              Your tutor profile has been removed by administrators. Please contact support for more
              information.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

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
          </div>

          <div className="flex flex-col items-center mt-6">
            <div className="inline-flex h-20 w-20 items-center justify-center mb-2">
              <img src={logo} alt="ScholarlyGator Logo" className="h-full w-full object-contain" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              SCHOLARLYGATOR
            </h1>
          </div>
        </div>

        {/* ===== Profile Status Section ===== */}
        {getProfileStatusSection()}

        {/* ===== Upcoming Sessions Section ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">UPCOMING SESSIONS</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {upcomingSessions.length} scheduled
            </span>
          </div>

          <div className="space-y-3">
            {loadingSessions ? (
              <p className="text-sm text-purple-600">Loading sessions...</p>
            ) : upcomingSessions.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No upcoming sessions scheduled.</p>
              </div>
            ) : (
              upcomingSessions.map((s) => (
                <div
                  key={s.session_id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.student_name || "Student"}</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 border border-blue-300">
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-700">
                    {fmtDateTime(s.session_datetime)} · {s.course_info}
                  </div>

                  <div className="mt-1 text-sm text-slate-600">{s.location_mode}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Recent Activity Section (Completed Sessions) ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">RECENT ACTIVITY</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Last {completedSessions.length} sessions
            </span>
          </div>

          <div className="space-y-3">
            {loadingSessions ? (
              <p className="text-sm text-purple-600">Loading sessions...</p>
            ) : completedSessions.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No completed sessions yet.</p>
              </div>
            ) : (
              completedSessions.map((s) => (
                <div
                  key={s.session_id}
                  className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{s.student_name || "Student"}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 border border-emerald-300">
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-700">
                    {fmtDateTime(s.session_datetime)} · {s.course_info}
                  </div>

                  <div className="mt-1 text-sm text-slate-600">{s.location_mode}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Messages Section ===== */}
        <div className={card}>
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900 mb-1">
              TUTOR MESSAGES
            </h2>
            <p className="text-sm text-purple-600">Messages related to your tutoring services</p>
          </div>

          {/* Messages Received from Students */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-purple-900">Messages from Students</h3>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {receivedMessages.length} received
              </span>
            </div>

            <div className="space-y-3">
              {loadingMessages ? (
                <p className="text-sm text-purple-600">Loading messages...</p>
              ) : receivedMessages.length === 0 ? (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                  <p className="text-purple-700 font-medium">No messages from students yet.</p>
                </div>
              ) : (
                receivedMessages.slice(0, 5).map((msg) => (
                  <MessageReplyCard
                    key={msg.message_id}
                    message={msg}
                    currentUserId={currentUserId}
                    onReplySent={() => {
                      fetchMessages(currentUserId);
                      fetchSessions(currentUserId);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Messages Sent to Students */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-purple-900">Messages Sent to Students</h3>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {sentMessages.length} sent
              </span>
            </div>

            <div className="space-y-3">
              {loadingMessages ? (
                <p className="text-sm text-purple-600">Loading messages...</p>
              ) : sentMessages.length === 0 ? (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                  <p className="text-purple-700 font-medium">No messages sent yet.</p>
                </div>
              ) : (
                sentMessages.slice(0, 5).map((msg) => {
                  const timeStr = new Date(msg.created_at).toLocaleString();
                  return (
                    <div
                      key={msg.message_id}
                      className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-purple-900">To: {msg.recipient_name}</span>
                        <span className="text-xs text-purple-600">{timeStr}</span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{msg.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function MessageReplyCard({ message, currentUserId, onReplySent }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [courseInfo, setCourseInfo] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessionTime, setSessionTime] = useState("");
    const [locationMode, setLocationMode] = useState("Online (Zoom)");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const timeStr = new Date(message.created_at).toLocaleString();

    const handleReply = async (confirmSession) => {
      if (!replyText.trim()) {
        setError("Please enter a message");
        return;
      }

      if (confirmSession && (!courseInfo.trim() || !sessionDate || !sessionTime)) {
        setError("Please fill in all session details to confirm");
        return;
      }

      setSending(true);
      setError("");

      try {
        // Combine date and time into ISO datetime string
        const sessionDateTime = confirmSession ? `${sessionDate}T${sessionTime}` : null;

        const response = await fetch("http://localhost:3000/api/messages/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tutor_user_id: currentUserId,
            student_user_id: message.sender_user_id,
            message: replyText.trim(),
            confirm_session: confirmSession,
            course_info: confirmSession ? courseInfo.trim() : null,
            session_datetime: sessionDateTime,
            location_mode: confirmSession ? locationMode : null,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setReplyText("");
          setCourseInfo("");
          setSessionDate("");
          setSessionTime("");
          setLocationMode("Online (Zoom)");
          setShowReply(false);
          onReplySent();
        } else {
          setError(data.error || "Failed to send reply");
        }
      } catch (err) {
        console.error("Error sending reply:", err);
        setError("Failed to send reply");
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="rounded-2xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-purple-900">From: {message.sender_name}</span>
          <span className="text-xs text-purple-600">{timeStr}</span>
        </div>
        <p className="text-sm text-slate-700 mb-3">{message.message}</p>

        {!showReply ? (
          <button
            onClick={() => setShowReply(true)}
            className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Reply to Student →
          </button>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
            <h4 className="text-sm font-bold text-purple-900 mb-3">
              Reply to {message.sender_name}
            </h4>

            <textarea
              className="w-full rounded-lg border-2 border-purple-200 p-3 text-sm focus:border-purple-400 focus:outline-none resize-none mb-3"
              rows={3}
              placeholder="Type your message here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sending}
            />

            {/* Session Details (shown when confirming) */}
            <div className="space-y-3 mb-3 p-3 rounded-lg bg-white border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-2">
                Session Details (required for confirmation):
              </p>

              <input
                type="text"
                className="w-full rounded-lg border-2 border-purple-200 p-2 text-sm focus:border-purple-400 focus:outline-none"
                placeholder="Course info (e.g., 'CSC 340 - Data Structures')"
                value={courseInfo}
                onChange={(e) => setCourseInfo(e.target.value)}
                disabled={sending}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-2 border-purple-200 p-2 text-sm focus:border-purple-400 focus:outline-none"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border-2 border-purple-200 p-2 text-sm focus:border-purple-400 focus:outline-none"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    disabled={sending}
                  />
                </div>
              </div>

              <select
                className="w-full rounded-lg border-2 border-purple-200 p-2 text-sm focus:border-purple-400 focus:outline-none"
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value)}
                disabled={sending}
              >
                <option value="Online (Zoom)">Online (Zoom)</option>
                <option value="Online (Google Meet)">Online (Google Meet)</option>
                <option value="In-person · Library">In-person · Library</option>
                <option value="In-person · Student Center">In-person · Student Center</option>
                <option value="In-person · Other">In-person · Other</option>
              </select>
            </div>

            {error && <p className="mt-2 text-xs text-red-600 mb-3">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => handleReply(true)}
                disabled={sending}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {sending ? "Confirming..." : "✓ Confirm Session"}
              </button>
              <button
                onClick={() => handleReply(false)}
                disabled={sending}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {sending ? "Declining..." : "✗ Decline Session"}
              </button>
              <button
                onClick={() => {
                  setShowReply(false);
                  setReplyText("");
                  setError("");
                }}
                disabled={sending}
                className="px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
