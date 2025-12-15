import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (!raw) {
      const next = encodeURIComponent("/tutor/dashboard");
      navigate(`/login?next=${next}`, { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(raw);
      setUser(userData);
      if (userData?.user_id) {
        fetchSessions(userData.user_id);
        fetchMessages(userData.user_id);
        fetchTutorProfile(userData.user_id);
      }
    } catch {
      navigate(`/login?next=${encodeURIComponent("/tutor/dashboard")}`, { replace: true });
    }
  }, [navigate]);

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

  const currentUserId = user?.user_id ?? user?.id;

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
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg ring-2 ring-amber-400 mb-2">
              <span
                className="text-xl font-bold text-white leading-none tracking-tighter"
                style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                SG
              </span>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-extrabold text-purple-900">MESSAGES</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {messages.filter((m) => m.recipient_user_id === currentUserId).length} received
            </span>
          </div>

          <div className="space-y-3">
            {loadingMessages ? (
              <p className="text-sm text-purple-600">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
                <p className="text-purple-700 font-medium">No messages yet.</p>
              </div>
            ) : (
              messages.slice(0, 5).map((msg) => {
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
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
