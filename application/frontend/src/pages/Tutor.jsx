// src/pages/Tutor.jsx
import { Link } from "react-router-dom";

export default function Tutor() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-bold tracking-tight">Tutor Platform</h1>
        <p className="text-slate-600 mt-2">
          Find an SFSU tutor or become one. Browse subjects, availability, and ratings.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/tutor/search"
            className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Find a Tutor
          </Link>
          <Link
            to="/tutor/apply"
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-medium shadow hover:bg-black transition"
          >
            Become a Tutor
          </Link>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Key Features">
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Search by course, skill, or availability</li>
            <li>Request sessions & in-app messaging</li>
            <li>Tutor profiles with ratings & badges</li>
          </ul>
        </Card>

        <Card title="How It Works">
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>Search tutors or post a request</li>
            <li>Match on availability & price</li>
            <li>Confirm session and meet online/on-campus</li>
          </ol>
        </Card>

        <Card title="Policies (Preview)">
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Student Code of Conduct</li>
            <li>No off-platform payments</li>
            <li>Cancellation & refund guidelines</li>
          </ul>
        </Card>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Policies & Rules (Summary)</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>
            Unregistered users may browse/search tutor profiles; contact form requires @sfsu.edu
            login.{" "}
          </li>
          <li>One-way in-site message: students can message tutors; tutors cannot reply in-app.</li>
          <li>No payments in the app; hourly rate is display-only.</li>
          <li>
            New/edited tutor profiles are visible only after admin approval; all admin actions are
            logged.
          </li>
        </ul>
        <p className="text-xs text-slate-500 mt-3">See full policy details on the Policy page.</p>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
