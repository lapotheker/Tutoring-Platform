// src/pages/TutorPolicy.jsx
export default function TutorPolicy() {
  const updated = new Date().toLocaleDateString();

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Tutor Platform Policy</h1>
        <p className="text-slate-600 mt-2 text-sm">
          This policy summarizes the rules used in our Milestone 1 & 2 prototype: demo-only scope,
          no payments, limited access for private actions, and an admin approval workflow for tutor
          listings.
        </p>

        {/* Quick links */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href="/tutor" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
            Tutor Home
          </a>
          <a
            href="/tutor/search"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            Find a Tutor
          </a>
          <a
            href="/tutor/apply"
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black"
          >
            Become a Tutor
          </a>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Last updated: {updated} · Course Demo Only
        </div>
      </header>

      {/* Course demo banner */}
      <Card title="Course Demo Notice">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>
            This website is a <strong>CSC648/848 class demo</strong>. Features are prototypes.
          </li>
          <li>No financial transactions are supported or simulated.</li>
          <li>
            Some actions require an <code>@sfsu.edu</code> account for access control.
          </li>
        </ul>
      </Card>

      {/* Access & Accounts */}
      <Card title="Access & Accounts">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Anyone can browse and search tutor profiles (public information only).</li>
          <li>
            Private actions—such as contacting a tutor or submitting a tutor application—require
            signing in with an <code>@sfsu.edu</code> email.
          </li>
          <li>
            User data in this prototype should be treated with privacy in mind; follow standard web
            security practices (no real PII required beyond demo).
          </li>
        </ul>
      </Card>

      {/* Messaging */}
      <Card title="Messaging (One-Way)">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Students can send a single in-site request/message to a tutor.</li>
          <li>
            Tutors <strong>cannot reply in-app</strong> (one-way messaging for demo scope).
          </li>
          <li>No email integrations or third-party messaging in this demo.</li>
        </ul>
      </Card>

      {/* Payments */}
      <Card title="Payments">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>
            <strong>No in-app payments</strong>. Hourly rate is informational only.
          </li>
          <li>No checkout/cart UI or payment simulations.</li>
          <li>Off-platform payments are not allowed or encouraged in this demo.</li>
        </ul>
      </Card>

      {/* Tutor Profiles & Moderation */}
      <Card title="Tutor Profiles & Moderation">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>
            New or edited tutor profiles enter <strong>Pending Review</strong> until approved by an
            admin.
          </li>
          <li>Profiles become publicly visible only after admin approval.</li>
          <li>
            Admins may approve/reject/disable profiles; all admin actions are recorded conceptually
            with timestamp and action type (demo log).
          </li>
        </ul>
      </Card>

      {/* Reporting & Conduct */}
      <Card title="Reporting & Conduct">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Students can report a profile for issues or misconduct (UI placeholder in demo).</li>
          <li>All users must follow the Student Code of Conduct.</li>
          <li>Harassment, discrimination, and academic dishonesty are prohibited.</li>
        </ul>
      </Card>

      {/* Non-functional Notes */}
      <Card title="Non-Functional Notes">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Prototype aims for clarity/usability for course evaluation.</li>
          <li>Modern browsers are supported; graceful degradation where applicable.</li>
          <li>No analytics/tracking unless explicitly approved for class use.</li>
        </ul>
      </Card>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
