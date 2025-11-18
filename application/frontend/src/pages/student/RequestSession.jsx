// src/pages/RequestSession.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";

export default function RequestSession() {
  const { id } = useParams(); // /tutor/request/:id
  const navigate = useNavigate();
  const { search } = useLocation(); // keep prior filters when going back

  // --- Form state ---
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
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
    if (!subject.trim()) return "SUBJECT is required.";
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
      // Hook this up to your backend later:
      // const base = import.meta.env.VITE_API_BASE_URL || "";
      // const res = await fetch(`${base}/api/messages`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     toTutorId: id,
      //     fromEmail: fromEmail.trim(),
      //     subject: subject.trim(),
      //     message: message.trim(),
      //   }),
      // });
      // if (!res.ok) throw new Error("Failed to send message");

      // Demo: simulate a short network delay
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");

      // After sending, go back to results (keeps original filters), or back to profile:
      navigate({ pathname: "/results", search }, { replace: true });
    } catch (e) {
      setStatus("idle");
      setErr(e?.message || "Something went wrong.");
    }
  }

  // Simple panel + form layout to mirror the wireframe
  const input = "w-full max-w-xs rounded-md border px-3 py-2 text-sm";
  const label = "text-sm font-semibold text-slate-700";
  const panel = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";

  return (
    <section className="space-y-6">
      <div className={panel}>
        {/* Back to profile/results link (wireframe shows a simple back line) */}
        <Link
          to={{ pathname: `/tutors/${id}`, search }}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          &lt; BACK TO PROFILE
        </Link>

        <h1 className="mt-4 text-xl font-extrabold tracking-wide">Contact Form</h1>

        {/* Form Block */}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
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
            <p className="text-xs text-slate-500 mt-1">(Must use @sfsu.edu email)</p>
          </div>

          {/* SUBJECT */}
          <div>
            <div className={label}>SUBJECT:</div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., CSC 648 tutoring request"
              className={input}
              required
            />
          </div>

          {/* MESSAGE */}
          <div>
            <div className={label}>MESSAGE:</div>

            {/* Example box (static, like the wireframe) */}
            <div className="mt-2 rounded-md border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
              Example: "Hi Sarah, I'm taking CSC 648 this semester and need help with the team
              project requirements. Are you available for tutoring sessions on Wednesdays?"
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Write your message here…"
              required
            />
          </div>

          {/* Error message (if any) */}
          {err && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {err}
            </div>
          )}

          {/* Bottom action bar: SEND / CANCEL */}
          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              {status === "sending" ? "SENDING…" : "SEND"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
