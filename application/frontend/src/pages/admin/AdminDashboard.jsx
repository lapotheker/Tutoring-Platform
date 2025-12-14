import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

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
        fetch(`${API_BASE_URL}/admin/pending-tutors`),
        fetch(`${API_BASE_URL}/admin/reports`),
        fetch(`${API_BASE_URL}/admin/actions?limit=20`),
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
      if (prev.size === pendingTutors.length) return new Set();
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
          fetch(`${API_BASE_URL}/admin/tutors/${id}/status`, {
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
      await fetch(`${API_BASE_URL}/admin/reports/${reportId}/status`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/tutors/${profileId}/detail`);
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
      const res = await fetch(`${API_BASE_URL}/admin/messages/${messageId}/detail`);
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

  const card = "rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-xl shadow-purple-100";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent";

  const StatusBadge = ({ value, type }) => {
    const color =
      value === "Pending" || value === "New"
        ? "bg-amber-100 text-amber-800 border-amber-300"
        : value === "Approved" || value === "Resolved"
          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
          : value === "Rejected" || value === "Dismissed" || value === "Removed"
            ? "bg-rose-100 text-rose-800 border-rose-300"
            : value === "Under Review"
              ? "bg-blue-100 text-blue-800 border-blue-300"
              : "bg-purple-100 text-purple-800 border-purple-300";
    return (
      <span className={`inline-flex rounded-full border-2 px-3 py-1 text-xs font-bold ${color}`}>
        {value} {type ? `• ${type}` : ""}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-8">
      <section className="max-w-7xl mx-auto space-y-6">
        {/* ===== Header ===== */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ring-4 ring-amber-400">
                <span className="text-2xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  SG
                </span>
              </div>
              <div>
                <div className="text-xl font-extrabold text-purple-900">Welcome, {displayName}!</div>
                <div className="text-sm text-purple-600 font-medium">Administrator</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-all"
                title="Dashboard"
              >
                &#8962;
              </Link>
            </div>
          </div>
          <h1 className={`mt-6 text-center ${bigTitle}`}>ADMIN DASHBOARD</h1>
        </div>

        {/* ===== Tutor Profile Queue ===== */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-purple-900">Tutor Profile Queue</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              {pendingTutors.length} pending
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={toggleAll}
              className="rounded-xl border-2 border-purple-300 bg-white px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              aria-pressed={allSelected}
              title={allSelected ? "Clear selection" : "Select all"}
            >
              {allSelected ? "Clear All" : "Select All"}
            </button>
            <button
              onClick={() => updateTutorStatus("Approved")}
              disabled={noneSelected}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all shadow-sm ${
                noneSelected 
                  ? "border-purple-200 bg-purple-50 text-purple-400 cursor-not-allowed" 
                  : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400"
              }`}
            >
              ✔️ Approve ({selectedIds.size})
            </button>
            <button
              onClick={() => updateTutorStatus("Rejected")}
              disabled={noneSelected}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all shadow-sm ${
                noneSelected 
                  ? "border-purple-200 bg-purple-50 text-purple-400 cursor-not-allowed" 
                  : "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-400"
              }`}
            >
              ✖️ Reject
            </button>
            <button
              onClick={() => updateTutorStatus("Removed")}
              disabled={noneSelected}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all shadow-sm ${
                noneSelected 
                  ? "border-purple-200 bg-purple-50 text-purple-400 cursor-not-allowed" 
                  : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
              }`}
            >
              🗑 Remove
            </button>
          </div>

          <div className="rounded-2xl border-2 border-purple-200 overflow-hidden">
            {loading ? (
              <p className="p-6 text-sm text-purple-600 font-medium">Loading pending tutors...</p>
            ) : pendingTutors.length === 0 ? (
              <p className="p-6 text-sm text-purple-600 font-medium">No pending tutors.</p>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y divide-purple-200">
                {pendingTutors.map((tutor) => {
                  const checked = selectedIds.has(tutor.tutor_profile_id);
                  return (
                    <li
                      key={tutor.tutor_profile_id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-purple-50 transition-colors"
                    >
                      <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                          checked={checked}
                          onChange={() => toggleOne(tutor.tutor_profile_id)}
                          aria-checked={checked}
                          aria-label={`Select ${tutor.full_name}`}
                        />
                        <span className="font-bold text-purple-900">{tutor.full_name}</span>
                      </label>
                      <span className="text-sm text-purple-700 font-semibold">{tutor.display_name}</span>
                      <span className="text-sm text-amber-600 font-bold">${tutor.hourly_rate}/hr</span>
                      <StatusBadge value={tutor.approval_status} />
                      <span className="text-xs text-purple-600">
                        {new Date(tutor.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => fetchProfileDetail(tutor.tutor_profile_id)}
                        className="ml-auto rounded-xl border-2 border-purple-300 bg-white px-4 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
                      >
                        View Details
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-purple-900">Reports</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              {reports.length} total
            </span>
          </div>
          
          <div className="rounded-2xl border-2 border-purple-200 overflow-hidden">
            {loading ? (
              <p className="p-6 text-sm text-purple-600 font-medium">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="p-6 text-sm text-purple-600 font-medium">No reports found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-amber-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">ID</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Reason</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Target</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Status</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Reporter</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.report_id} className="border-t border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-bold text-purple-900">{r.report_id}</td>
                        <td className="px-4 py-3 text-purple-700">{r.report_reason}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-purple-900">{r.target_type}</span>
                            <span className="text-xs text-purple-600">ID: {r.target_id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge value={r.status} type={r.target_type} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-purple-700">
                            {r.reporter_name}
                            <div className="text-xs text-purple-600">{r.reporter_email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateReportStatus(r.report_id, "Under Review")}
                              className="rounded-lg border-2 border-blue-300 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => updateReportStatus(r.report_id, "Resolved")}
                              className="rounded-lg border-2 border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-all"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => updateReportStatus(r.report_id, "Dismissed")}
                              className="rounded-lg border-2 border-purple-300 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all"
                            >
                              Dismiss
                            </button>
                            {r.target_type === "Tutor Profile" && (
                              <button
                                onClick={() => fetchProfileDetail(r.target_id)}
                                className="rounded-lg border-2 border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 hover:border-amber-400 transition-all"
                              >
                                View Profile
                              </button>
                            )}
                            {r.target_type === "In-Site Message" && (
                              <button
                                onClick={() => fetchMessageDetail(r.target_id)}
                                className="rounded-lg border-2 border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 hover:border-amber-400 transition-all"
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
              </div>
            )}
          </div>
        </div>

        {/* Admin Action Log */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-purple-900">Admin Action Log</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Last {actions.length} actions
            </span>
          </div>
          
          <div className="rounded-2xl border-2 border-purple-200 overflow-hidden">
            {loading ? (
              <p className="p-6 text-sm text-purple-600 font-medium">Loading actions...</p>
            ) : actions.length === 0 ? (
              <p className="p-6 text-sm text-purple-600 font-medium">No actions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-amber-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Date</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Admin</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Action</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Target</th>
                      <th className="px-4 py-3 text-left font-bold text-purple-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((a) => (
                      <tr key={a.admin_action_id} className="border-t border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3 text-purple-700">{new Date(a.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-purple-900">{a.admin_email}</td>
                        <td className="px-4 py-3 font-bold text-amber-700">{a.action_type}</td>
                        <td className="px-4 py-3 text-purple-700">
                          {a.target_type} #{a.target_id}
                        </td>
                        <td className="px-4 py-3 text-purple-600">{a.reason_notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            <div className="mt-4">
              <div className="text-sm font-bold text-purple-900 mb-2">Message</div>
              <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 text-sm text-purple-700 whitespace-pre-wrap">
                {messageDetail.message}
              </div>
            </div>
          </Modal>
        )}
      </section>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="text-sm mb-3 pb-3 border-b border-purple-100">
      <span className="font-bold text-purple-900">{label}:</span>{" "}
      <span className="text-purple-700">{value}</span>
    </div>
  );
}

function Modal({ title, onClose, children, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[min(720px,92vw)] rounded-3xl bg-white shadow-2xl border-2 border-purple-200">
        <div className="flex items-center justify-between border-b-2 border-purple-200 p-6 bg-gradient-to-r from-purple-100 to-amber-100">
          <div className="font-extrabold text-purple-900 text-lg">{title}</div>
          <button
            className="rounded-xl border-2 border-purple-300 bg-white px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? <p className="text-sm text-purple-600 font-medium">Loading...</p> : children}
        </div>
      </div>
    </div>
  );
}