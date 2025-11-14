// src/pages/admin/AdminDashboard.jsx
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const admin = useMemo(
    () => ({
      name: "Admin User",
      email: "admin@sfsu.edu",
    }),
    []
  );

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  const pendingProfiles = [
    { id: 1, name: "Sarah Garcia", subject: "CSC 210, CSC 220", submittedAt: "2025-11-10" },
    { id: 2, name: "Kevin Lee", subject: "MATH 226", submittedAt: "2025-11-12" },
  ];

  const reportedItems = [
    {
      id: 101,
      type: "Tutor Profile",
      target: "John Doe",
      reason: "Inappropriate description",
      reportedAt: "2025-11-13",
    },
    {
      id: 102,
      type: "Message",
      target: "Conversation #392",
      reason: "Harassment",
      reportedAt: "2025-11-13",
    },
  ];

  const actionLog = [
    {
      id: 201,
      action: "Approved tutor profile",
      by: "admin@sfsu.edu",
      target: "Sarah Garcia",
      at: "2025-11-13 09:41",
    },
    {
      id: 202,
      action: "Suspended tutor account",
      by: "admin@sfsu.edu",
      target: "Kevin Lee",
      at: "2025-11-12 17:10",
    },
  ];

  return (
    <section className="space-y-6">
      {/* ===== Back to Home ===== */}
      <div className="flex justify-start">
        <Link
          to="/"
          className="text-slate-700 hover:text-black underline underline-offset-2 font-semibold"
        >
          ← Back to Home
        </Link>
      </div>

      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-3xl">
              🛡️
            </div>
            <div>
              <div className="text-2xl font-extrabold">Admin Dashboard</div>
              <div className="text-slate-600 text-sm md:text-base">
                Signed in as <span className="font-semibold">{admin.email}</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className={`mt-4 text-center ${bigTitle}`}>SFSU TUTORING PLATFORM – ADMIN</h1>
      </div>

      {/* ===== 15.1 Moderation Queue ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">
          15.1 Moderation Queue (Pending Tutor Profiles)
        </h2>
        <p className="mt-2 text-slate-700">
          Review and approve new tutor profiles before they appear in search results.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-2">Tutor</th>
                <th className="px-3 py-2">Subjects</th>
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProfiles.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-semibold">{p.name}</td>
                  <td className="px-3 py-2">{p.subject}</td>
                  <td className="px-3 py-2">{p.submittedAt}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button className="rounded-md border px-3 py-1 text-xs font-semibold hover:bg-emerald-50">
                      APPROVE
                    </button>
                    <button className="rounded-md border px-3 py-1 text-xs font-semibold hover:bg-red-50">
                      REJECT
                    </button>
                    <button className="rounded-md border px-3 py-1 text-xs font-semibold hover:bg-slate-50">
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 15.2 Reported Items ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">15.2 Reported Items</h2>
        <p className="mt-2 text-slate-700">Handle reports submitted by students and tutors.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Target</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Reported</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportedItems.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2 font-semibold">{r.target}</td>
                  <td className="px-3 py-2">{r.reason}</td>
                  <td className="px-3 py-2">{r.reportedAt}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button className="rounded-md border px-3 py-1 text-xs font-semibold hover:bg-slate-50">
                      VIEW
                    </button>
                    <button className="rounded-md border px-3 py-1 text-xs font-semibold hover:bg-emerald-50">
                      RESOLVE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 15.3 Admin Action Log ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">15.3 Admin Action Log</h2>
        <p className="mt-2 text-slate-700">
          Audit trail of recent admin actions (for moderation transparency).
        </p>

        <div className="mt-4 space-y-2">
          {actionLog.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <div className="font-semibold">{log.action}</div>
              <div className="text-slate-600 text-xs">Target: {log.target}</div>
              <div className="text-slate-500 text-xs">
                By {log.by} · {log.at}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
