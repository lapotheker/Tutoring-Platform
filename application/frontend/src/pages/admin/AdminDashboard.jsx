import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- demo data ------------------------------------------------------------
  const pendingTutorExamples = useMemo(
    () => [
      { id: "t1", name: "Ada Lovelace", subject: "CS / Algorithms" },
      { id: "t2", name: "Alan Turing", subject: "Discrete Math" },
      { id: "t3", name: "Grace Hopper", subject: "Systems / Compilers" },
      { id: "t4", name: "Edsger Dijkstra", subject: "Graph Theory" },
      { id: "t5", name: "Katherine Johnson", subject: "Calculus" },
      { id: "t6", name: "Donald Knuth", subject: "Data Structures" },
      { id: "t7", name: "Barbara Liskov", subject: "OOP / PL" },
    ],
    []
  );


  const reportExamples = useMemo(
    () => [
      {id: "r1", name: "#AF2C1", reason: "inappropriate content", 
        link: "https://in.pinterest.com/pin/mood-board--1266706140449957/",
        type: "image",
        status: "under review"
      },
      {id: "r2", name: "#AF2C2", reason: "inappropriate content",
        link: "https://media.tenor.com/vAH8YsQznr8AAAPo/cat-cat-vibing.mp4",
        type: "gif",
        status: "under review"
      },
      {id: "r2", name: "#AF2C3", reason: "inappropriate content", 
        link: "https://i.kym-cdn.com/entries/icons/original/000/052/772/dog_closing_eyes_meme_cover.jpg",
        type: "image",
        status: "under review"
      },
    ],
    []
  );

  // --- selection state ------------------------------------------------------
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const allSelected =
    selectedIds.size === pendingTutorExamples.length && pendingTutorExamples.length > 0;
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
      if (prev.size === pendingTutorExamples.length) return new Set(); // clear
      return new Set(pendingTutorExamples.map((t) => t.id));
    });
  };

  const approveSelected = () => {
    // TODO: call your API; for now just log
    console.log("Approve:", Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const rejectSelected = () => {
    console.log("Reject:", Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const viewSelected = () => {
    console.log("View:", Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  // --- styles ---------------------------------------------------------------
  const card = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";
  const bigTitle = "text-2xl md:text-3xl font-extrabold tracking-wide";

  return (
    <section className="space-y-6">
      {/* ===== Header ===== */}
      <div className={card}>
        <div className="flex items-start justify-between"></div>
        <h1 className={`mt-4 text-center ${bigTitle}`}>ADMIN DASHBOARD</h1>
      </div>

      {/* ===== Moderation Queue ===== */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">Moderation Queue</h2>
          <div className="flex items-center gap-2">
            {/* Select all / Clear selections Button */}
            <button
              //toggles on all checkmarks on click
              onClick={toggleAll}
              className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-white"
              aria-pressed={allSelected}
              title={allSelected ? "Clear selection" : "Select all"}
            >
              {allSelected ? "Clear" : "Select all"}
            </button>
 
            {/*Approve, Reject, and view profile buttons */}
            <button
              onClick={approveSelected}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}`}
            >
              ✔️ Approve ({selectedIds.size})
            </button>
            <button
              onClick={rejectSelected}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}`}
            >
              ✖️ Reject
            </button>

            <button
              onClick={viewSelected}
              disabled={noneSelected}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${noneSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}`}
            >
              📄 View Profile
            </button>
          </div>
        </div>

        {/* Moderation queue with scrolling and checkmarks */}
        <div className="mt-4 rounded-xl border border-slate-200">
          <ul
            className="max-h-64 overflow-y-auto divide-y divide-slate-200"
            role="listbox"
            aria-label="Pending tutors"
          >
            {pendingTutorExamples.map((tutor) => {
              const checked = selectedIds.has(tutor.id);
              return (
                <li
                  key={tutor.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-within:bg-slate-50"
                >
                  {/* Checkbox for each tutor in the list*/}
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-slate-700"
                      checked={checked}
                      onChange={() => toggleOne(tutor.id)}
                      aria-checked={checked}
                      aria-label={`Select ${tutor.name}`}
                    />
                    <span className="font-medium">{tutor.name}</span>
                  </label>

                  <span className="text-sm text-slate-600">{tutor.subject}</span>

                  {/*Approve or Rejection*/}
                  <div className="ml-auto flex items-center gap-2">
                    {/*Approval Button*/}
                    <button
                      onClick={() => console.log("Approve one:", tutor.id)}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="Approve this tutor"
                    >
                      ✔️
                    </button>

                    {/*Rejection Button*/}
                    <button
                      onClick={() => console.log("Reject one:", tutor.id)}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="Reject this tutor"
                    >
                      ✖️
                    </button>

                    {/*Viewing tutor profile button*/}
                    <button
                      onClick={() => console.log("View Profile:", tutor.id)}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="View tutor Profile"
                    >
                      📄
                    </button>
                  </div>
                </li>
              );
            })}

            {pendingTutorExamples.length === 0 && (
              <li className="px-4 py-6 text-center text-slate-500">No pending tutors</li>
            )}
          </ul>
        </div>
      </div>




      {/* ===== Reports (placeholder for now ) ===== */}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold">Reports</h2>
        <p className="mt-2 text-slate-800">View system logs and recent activity.</p>

        {/* Headers for the table sections */}
        <div className="mt-4 rounded-xl border border-slate-200">
          <table className = "min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> ID</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Reason</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Type</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Status</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Actions</th>
              </tr>
            </thead>

          <tbody>
            {reportExamples.map((report) => {
              const checked = selectedIds.has(report.id);
              return (
                <tr
                  key={report.id}
                  className="border-t hover:bg-slate-50 focus-within:bg-slate-50"
                >
                  {/* Checkbox for each tutor in the list*/}
                  <td className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-slate-700"
                      checked={checked}
                      onChange={() => toggleOne(report.id)}
                      aria-checked={checked}
                      aria-label={`Select ${report.id}`}
                    />
                    <span className="font-medium">{report.name}</span>
                  </td>

                  
                  {/** ID */}
                  <td className = "px-4 py-2 align-middle font-medium">
                    {report.name}
                  </td>

                  {/** TYPE */}
                  <td className = "px-4 py-2 align-middle font-medium">
                    {report.type}
                  </td>

                  {/** REASON */}
                  <td className = "px-4 py-2 align-middle font-medium">
                    {report.reason}
                  </td>

                  {/** STATUS */}
                  <td className = "px-4 py-2 align-middle font-medium">
                    {report.status}
                  </td>


                  {/*ACTIONS*/}
                  <div className="flex items-center gap-2 justify-end">
                    {/*Approval Button*/}
                    <button
                      onClick={() => console.log("Approve one:", report.id)}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="Approve this tutor"
                    >
                      ✔️
                    </button>

                    {/*Rejection Button*/}
                    <button
                      onClick={() => console.log("Reject one:", report.id)}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="Reject this tutor"
                    >
                      ✖️
                    </button>

                    {/*Viewing tutor profile button*/}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(report.link, "_blank", "noopener,noreferrer");
                      }}
                      className="rounded-md border px-2 py-1 text-sm hover:bg-white"
                      title="View tutor Profile"
                    >
                      📄
                    </button>
                  </div>
                </tr>
              );
            })}

            {reportExamples.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No reports found
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/*Admin Action Log*/}
      <div className={card}>
        <h2 className="text-lg md:text-xl font-extrabold mb-3">Admin Action Log</h2>
        <div>
          <table>
            <thead className="className=bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Date</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Email</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Action</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Target</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700"> Resolution</th>
              </tr>
            </thead>

            <tbody>
              {/*Placeholder data for action log */}
              <tr className="border-t">
                <td className="px-4 py-2">2025-11-16 10:23</td>
                <td className="px-4 py-2">admin@sfsu.edu</td>
                <td className="px-4 py-2">Approved Tutor Profile</td>
                <td className="px-4 py-2">Tutor 1</td>
                <td className="px-4 py-2">All details verified.</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">2025-11-15 09:45</td>
                <td className="px-4 py-2">moderator@sfsu.edu</td>
                <td className="px-4 py-2">Closed Report</td>
                <td className="px-4 py-2">Report #23</td>
                <td className="px-4 py-2">No violation found.</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">2025-11-14 17:10</td>
                <td className="px-4 py-2">admin@sfsu.edu</td>
                <td className="px-4 py-2">Rejected Tutor Application</td>
                <td className="px-4 py-2">Tutor 2</td>
                <td className="px-4 py-2">Incomplete documentation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
