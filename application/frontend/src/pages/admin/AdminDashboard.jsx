import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TUTOR_STATUS = ["Pending", "Approved", "Rejected", "Removed"];
const REPORT_STATUS = ["New", "Under Review", "Resolved", "Dismissed"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [profileDetail, setProfileDetail] = useState(null);
  const [messageDetail, setMessageDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("demoUser") || sessionStorage.getItem("demoUser");
    if (!raw) {
      navigate("/login?next=/admin", { replace: true });
      return;
    }
    try {
      const userData = JSON.parse(raw);
      setUser(userData);
      if (!userData?.user_id) {
        navigate("/login?next=/admin", { replace: true });
        return;
      }
      fetchData(userData.user_id);
    } catch {
      navigate("/login?next=/admin", { replace: true });
    }
  }, [navigate]);

  const fetchData = async (adminId) => {
    setLoading(true);
    try {
      const [tutorsRes, reportsRes, actionsRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/pending-tutors"),
        fetch("http://localhost:3000/api/admin/reports"),
        fetch("http://localhost:3000/api/admin/actions?limit=20"),
      ]);

      const tutorsData = await tutorsRes.json();
      const reportsData = await reportsRes.json();
      const actionsData = await actionsRes.json();

      if (tutorsData.success) setPendingTutors(tutorsData.data || []);
      if (reportsData.success) setReports(reportsData.data || []);
      if (actionsData.success) setActions(actionsData.data || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const allSelected = selectedIds.size === pendingTutors.length && pendingTutors.length > 0;
  const noneSelected = selectedIds.size === 0;

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === pendingTutors.length) return new Set(); // clear
      return new Set(pendingTutors.map((t) => t.tutor_profile_id));
    });
  };

  const updateTutorStatus = async (status, notes) => {
    if (noneSelected) return;
    const adminId = user?.user_id;
    if (!TUTOR_STATUS.includes(status)) return;
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`http://localhost:3000/api/admin/tutors/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, admin_user_id: adminId, notes }),
          })
        )
      );
      setSelectedIds(new Set());
      fetchData(adminId);
    } catch (err) {
      console.error("Error updating tutor status:", err);
    }
  };

  const updateReportStatus = async (reportId, status, notes) => {
    const adminId = user?.user_id;
    if (!REPORT_STATUS.includes(status)) return;
    try {
      await fetch(`http://localhost:3000/api/admin/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_user_id: adminId, notes }),
      });
      fetchData(adminId);
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  const fetchProfileDetail = async (profileId) => {
    setDetailLoading(true);
    setProfileDetail(null);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/tutors/${profileId}/detail`);
      const data = await res.json();
      if (data.success) setProfileDetail(data.data);
    } catch (err) {
      console.error("Error fetching profile detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchMessageDetail = async (messageId) => {
    setDetailLoading(true);
    setMessageDetail(null);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/messages/${messageId}/detail`);
      const data = await res.json();
      if (data.success) setMessageDetail(data.data);
    } catch (err) {
      console.error("Error fetching message detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const displayName = useMemo(() => {
    if (!user?.full_name && !user?.email) return "Admin";
    if (user.full_name) return user.full_name;
    const beforeAt = user.email?.split("@")[0] || "Admin";
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }, [user]);

  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  const StatusBadge = ({ value, type }) => {
    const color =
      value === "Pending" || value === "New"
        ? "bg-amber-100 text-amber-800"
        : value === "Approved" || value === "Resolved"
          ? "bg-emerald-100 text-emerald-800"
          : value === "Rejected" || value === "Dismissed" || value === "Removed"
            ? "bg-rose-100 text-rose-800"
            : value === "Under Review"
              ? "bg-blue-100 text-blue-800"
              : "bg-slate-100 text-slate-800";
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}>
        {value} {type ? `• ${type}` : ""}
      </span>
    );
  };

  return (
    <section className="space-y-6">
      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between">
          <div className="text-lg font-semibold">Welcome, {displayName}</div>
          <div className="flex items-center gap-3 text-xl">
            <Link to="/dashboard" className="hover:opacity-80">
              🏠
            </Link>
          </div>
        </div>
        <h1 className={`mt-2 text-center ${bigTitle}`}>ADMIN DASHBOARD</h1>
      </div>

      {/* ===== Tutor Profile Queue ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">Tutor Profile Queue</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAll}
              className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-white"
              aria-pressed={allSelected}
              title={allSelected ? "Clear selection" : "Select all"}
            >
              {allSelected ? "Clear" : "Select all"}
            </button>
            <button
              onClick={() => updateTutorStatus("Approved")}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
              }`}
            >
              ✔️ Approve ({selectedIds.size})
            </button>
            <button
              onClick={() => updateTutorStatus("Rejected")}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
              }`}
            >
              ✖️ Reject
            </button>
            <button
              onClick={() => updateTutorStatus("Removed")}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
              }`}
            >
              🗑 Remove
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200">
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading pending tutors...</p>
          ) : pendingTutors.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No pending tutors.</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-slate-200">
              {pendingTutors.map((tutor) => {
                const checked = selectedIds.has(tutor.tutor_profile_id);
                return (
                  <li
                    key={tutor.tutor_profile_id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-slate-700"
                        checked={checked}
                        onChange={() => toggleOne(tutor.tutor_profile_id)}
                        aria-checked={checked}
                        aria-label={`Select ${tutor.full_name}`}
                      />
                      <span className="font-medium">{tutor.full_name}</span>
                    </label>
                    <span className="text-sm text-slate-600">{tutor.display_name}</span>
                    <span className="text-sm text-slate-600">${tutor.hourly_rate}/hr</span>
                    <StatusBadge value={tutor.approval_status} />
                    <span className="text-xs text-slate-500">
                      {new Date(tutor.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => fetchProfileDetail(tutor.tutor_profile_id)}
                      className="ml-auto rounded-md border px-2 py-1 text-xs hover:bg-white"
                    >
                      View
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ===== Reports ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">Reports</h2>
        <div className="mt-4 rounded-xl border border-slate-200">
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No reports found.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">ID</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Reason</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Target</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Reporter</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.report_id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{r.report_id}</td>
                    <td className="px-4 py-2">{r.report_reason}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span>{r.target_type}</span>
                        <span className="text-xs text-slate-500">ID: {r.target_id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge value={r.status} type={r.target_type} />
                    </td>
                    <td className="px-4 py-2">
                      {r.reporter_name} ({r.reporter_email})
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateReportStatus(r.report_id, "Under Review")}
                          className="rounded-md border px-2 py-1 text-xs hover:bg-white"
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => updateReportStatus(r.report_id, "Resolved")}
                          className="rounded-md border px-2 py-1 text-xs hover:bg-white"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => updateReportStatus(r.report_id, "Dismissed")}
                          className="rounded-md border px-2 py-1 text-xs hover:bg-white"
                        >
                          Dismiss
                        </button>
                        {r.target_type === "Tutor Profile" && (
                          <button
                            onClick={() => fetchProfileDetail(r.target_id)}
                            className="rounded-md border px-2 py-1 text-xs hover:bg-white"
                          >
                            View Profile
                          </button>
                        )}
                        {r.target_type === "In-Site Message" && (
                          <button
                            onClick={() => fetchMessageDetail(r.target_id)}
                            className="rounded-md border px-2 py-1 text-xs hover:bg-white"
                          >
                            View Message
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Admin Action Log */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold mb-3">Admin Action Log</h2>
        <div className="rounded-xl border border-slate-200">
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading actions...</p>
          ) : actions.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No actions yet.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Admin</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Action</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Target</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((a) => (
                  <tr key={a.admin_action_id} className="border-t">
                    <td className="px-4 py-2">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{a.admin_email}</td>
                    <td className="px-4 py-2">{a.action_type}</td>
                    <td className="px-4 py-2">
                      {a.target_type} #{a.target_id}
                    </td>
                    <td className="px-4 py-2">{a.reason_notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {profileDetail && (
        <Modal
          title="Tutor Profile Detail"
          onClose={() => setProfileDetail(null)}
          loading={detailLoading}
        >
          <DetailRow label="Name" value={profileDetail.full_name} />
          <DetailRow label="Email" value={profileDetail.sfsu_email} />
          <DetailRow label="Display Name" value={profileDetail.display_name} />
          <DetailRow label="Hourly Rate" value={`$${profileDetail.hourly_rate}`} />
          <DetailRow label="Approval Status" value={profileDetail.approval_status} />
          <DetailRow label="Visibility" value={profileDetail.visibility} />
          <DetailRow label="Courses" value={profileDetail.courses || "—"} />
          <DetailRow label="Subjects" value={profileDetail.subjects || "—"} />
          <DetailRow label="Languages" value={profileDetail.languages || "—"} />
          <DetailRow label="Created" value={new Date(profileDetail.created_at).toLocaleString()} />
          {profileDetail.updated_at && (
            <DetailRow
              label="Updated"
              value={new Date(profileDetail.updated_at).toLocaleString()}
            />
          )}
        </Modal>
      )}

      {/* Message Detail Modal */}
      {messageDetail && (
        <Modal
          title="Message Detail"
          onClose={() => setMessageDetail(null)}
          loading={detailLoading}
        >
          <DetailRow
            label="From"
            value={`${messageDetail.sender_name} (${messageDetail.sender_email})`}
          />
          <DetailRow
            label="To"
            value={`${messageDetail.recipient_name} (${messageDetail.recipient_email})`}
          />
          <DetailRow label="Sent" value={new Date(messageDetail.created_at).toLocaleString()} />
          <DetailRow label="Status" value={messageDetail.message_status} />
          <div className="mt-3">
            <div className="text-sm font-semibold text-slate-800 mb-1">Message</div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm whitespace-pre-wrap">
              {messageDetail.message}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="text-sm mb-2">
      <span className="font-semibold text-slate-800">{label}:</span>{" "}
      <span className="text-slate-700">{value}</span>
    </div>
  );
}

function Modal({ title, onClose, children, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[min(720px,92vw)] rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="font-semibold text-slate-800 text-sm">{title}</div>
          <button
            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-4">
          {loading ? <p className="text-sm text-slate-600">Loading...</p> : children}
        </div>
      </div>
    </div>
  );
}
