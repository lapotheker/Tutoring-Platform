// src/pages/RequestSession.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

export default function RequestSession() {
  const { id } = useParams(); // /tutor/request/:id
  const navigate = useNavigate();
  const { search } = useLocation(); // keep prior filters when going back

  // --- Form state ---
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  // Read demo login (set by Login.jsx) and prefill FROM with @sfsu.edu email
  const demoUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  // If not logged in (demo), redirect to login then return here via ?next=
  useEffect(() => {
    if (!demoUser) {
      const next = encodeURIComponent(`/tutor/request/${id}`);
      navigate(`/login?next=${next}`, { replace: true });
    } else if (demoUser.email && !fromEmail) {
      setFromEmail(demoUser.email);
    }
  }, [demoUser, id, navigate, fromEmail]);

  // Basic validation to match the wireframe requirements
  function validate() {
    if (!fromEmail || !/^[^@\s]+@sfsu\.edu$/i.test(fromEmail)) {
      return "FROM must be a valid @sfsu.edu email.";
    }
    if (!message.trim()) return "MESSAGE is required.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setStatus("sending");

    try {
      // Store sent message in backend
      const base = import.meta.env.VITE_API_BASE_URL || `${API_BASE_URL}`;

      const res = await fetch(`${base}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_user_id: parseInt(demoUser?.user_id || demoUser?.id, 10), // student's user ID
          recipient_user_id: parseInt(id, 10), // tutor's user_id from URL
          message: message.trim(), // backend only accepts this field
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      // Demo: simulate a short network delay
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");

      // After sending, go back to MessageSent confirmation screen
      navigate({ pathname: "/message-sent", search }, { replace: true });
    } catch (e) {
      setStatus("idle");
      setErr(e?.message || "Something went wrong.");
    }
  }

  // Simple panel + form layout to mirror the wireframe
  const input = "w-full max-w-xs rounded-xl border-2 border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all";
  const label = "text-sm font-bold text-purple-900";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50">
          {/* Back to profile/results link */}
          <Link
            to={{ pathname: `/tutors/${id}`, search }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mb-6"
          >
            ← BACK TO PROFILE
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ring-2 ring-amber-400">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Contact Form
            </h1>
          </div>

          {/* Form Block */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* FROM */}
            <div>
              <div className={label}>FROM:</div>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="you@sfsu.edu"
                className={input}
                autoComplete="email"
                required
              />
              <p className="text-xs text-purple-600 mt-1.5 font-medium">(Must use @sfsu.edu email)</p>
            </div>

            {/* MESSAGE */}
            <div>
              <div className={label}>MESSAGE:</div>

              {/* Example box (static, like the wireframe) */}
              <div className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-slate-800">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-lg">💡</span>
                  <div>
                    <div className="font-semibold text-amber-900 mb-1">Example:</div>
                    "Hi Sarah, I'm taking CSC 648 this semester and need help with the team
                    project requirements. Are you available for tutoring sessions on Wednesdays?"
                  </div>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-3 w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Write your message here…"
                required
              />
            </div>

            {/* Error message (if any) */}
            {err && (
              <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>{err}</span>
              </div>
            )}

            {/* Bottom action bar: SEND / CANCEL */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white font-bold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border-2 border-purple-300 bg-white px-6 py-3 text-purple-700 font-bold hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}