import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

const fmtDateTime = (d) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    typeof d === "string" ? new Date(d) : d
  );

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local/session storage
  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (raw) {
      try {
        const userData = JSON.parse(raw);
        setUser(userData);
        if (userData?.user_id) {
          fetchDashboardData(userData.user_id);
        }
      } catch {
        setUser(null);
      }
    } else {
      const next = encodeURIComponent("/tutor/dashboard");
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    setLoading(true);
    try {
      // Fetch sessions
      const sessionsRes = await fetch(`${API_BASE_URL}/sessions/tutor/${userId}`);
      const sessionsData = await sessionsRes.json();
      if (sessionsData.success) {
        setSessions(sessionsData.data || []);
      }

      // Fetch messages
      const messagesRes = await fetch(`${API_BASE_URL}/messages/user/${userId}`);
      const messagesData = await messagesRes.json();
      if (messagesData.success) {
        const received = (messagesData.data || []).filter((m) => m.recipient_user_id === userId);
        setMessages(received);
      }

      // Fetch tutor profile (any status)
      const profileRes = await fetch(`${API_BASE_URL}/tutors/profile/by-user/${userId}`);
      const profileData = await profileRes.json();
      if (profileData.success) {
        setProfile(profileData.data);
      } else {
        setProfile(null); // no profile yet
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayName = useMemo(() => {
    if (!user?.full_name && !user?.email) return "Tutor";
    if (user.full_name) return user.full_name;
    const beforeAt = user.email.split("@")[0];
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  const upcomingSessions = sessions.filter(
    (s) => s.status === "upcoming" && new Date(s.session_datetime) > new Date()
  );

  const recentActivity = [
    ...sessions
      .filter((s) => s.status === "completed")
      .map((s) => ({
        id: `sess-${s.session_id}`,
        text: `Completed session with ${s.student_name} (${s.course_info})`,
        time: fmtDateTime(s.session_datetime),
        rawTime: new Date(s.session_datetime),
      })),
    ...messages.map((m) => ({
      id: `msg-${m.message_id}`,
      text: `Received a new message from ${m.sender_name}`,
      time: fmtDateTime(m.created_at),
      rawTime: new Date(m.created_at),
    })),
  ]
    .sort((a, b) => b.rawTime - a.rawTime)
    .slice(0, 5);

  // Profile status rendering
  const renderProfileStatus = () => {
    if (loading) {
      return <p className="text-sm text-slate-600">Loading profile status...</p>;
    }

    if (!profile) {
      // No profile created yet
      return (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <div className="text-lg md:text-xl font-extrabold">
            You don&apos;t have a tutor profile yet
          </div>
          <p className="mt-2 text-slate-800">
            Create your profile to start offering tutoring services.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/tutor/posting"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 transition"
            >
              Create Profile
            </Link>
          </div>
        </div>
      );
    }

    if (profile.approval_status === "Pending") {
      return (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="text-lg md:text-xl font-extrabold text-amber-900">
            Status: Pending Review
          </div>
          <p className="mt-2 text-slate-800">
            Your profile has been submitted and is awaiting admin review.
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Submitted on: {new Date(profile.created_at).toLocaleString()}
          </p>
        </div>
      );
    }

    if (profile.approval_status === "Rejected") {
      return (
        <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-4">
          <div className="text-lg md:text-xl font-extrabold text-rose-900">Status: Rejected</div>
          <p className="mt-2 text-slate-800">
            Your profile was rejected. Please update and resubmit.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/tutor/posting"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              Resubmit Profile
            </Link>
          </div>
        </div>
      );
    }

    if (profile.approval_status === "Approved") {
      return (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4">
          <div className="text-lg md:text-xl font-extrabold text-emerald-900">Status: Approved</div>
          <p className="mt-2 text-slate-800">
            Your profile is live. You can edit your profile anytime.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/tutor/profile/edit"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      );
    }

    // Fallback for any other status
    return (
      <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4">
        <div className="text-lg md:text-xl font-extrabold">
          Profile Status: {profile.approval_status}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      {/* ===== Header Section ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-200 text-3xl text-slate-600">
              👤
            </div>
            <div>
              <div className="text-2xl font-extrabold">Welcome, {displayName}!</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-2xl">
            <Link to="/inbox" title="Messages" className="hover:opacity-80">
              ✉️
            </Link>
            <Link to="/" title="Home" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>

        <h1 className={`mt-4 text-center ${bigTitle}`}>SFSU TUTORING PLATFORM</h1>
      </div>

      {/* ===== Profile Status Section ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">PROFILE STATUS</h2>
        {renderProfileStatus()}
      </div>

      {/* ===== Upcoming Sessions Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">UPCOMING SESSIONS</h2>
          <span className="text-xs text-slate-500">{upcomingSessions.length} scheduled</span>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading sessions...</p>
          ) : upcomingSessions.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming sessions scheduled.</p>
          ) : (
            upcomingSessions.map((s) => (
              <div
                key={s.session_id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{s.student_name}</span>
                  <span className="text-xs text-slate-600">{fmtDateTime(s.session_datetime)}</span>
                </div>

                <div className="mt-1 text-xs text-slate-700">{s.course_info}</div>

                <div className="mt-1">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    {s.location_mode}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== Recent Activity Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">RECENT ACTIVITY</h2>
          <span className="text-xs text-slate-500">Last {recentActivity.length} items</span>
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading activity...</p>
        ) : recentActivity.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No recent activity.</p>
        ) : (
          <ol className="mt-3 space-y-2 text-sm">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-start gap-2 border-l border-slate-300 pl-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-slate-900">{item.text}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* ===== Messages Section ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">MESSAGES</h2>
          <span className="text-xs text-slate-500">{messages.length} total</span>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages received.</p>
          ) : (
            messages.slice(0, 3).map((msg) => (
              <div
                key={msg.message_id}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{msg.sender_name}</span>
                  <span className="text-xs text-slate-600">{fmtDateTime(msg.created_at)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-700">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
