import { Link } from "react-router-dom";

export default function Iliana() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <Link to="/about" className="text-sm text-slate-500 hover:underline">
          ← Back to About
        </Link>

        <div className="mt-4 flex flex-col md:flex-row items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Iliana Gallegos</h1>
            <h2 className="text-xl text-slate-500 font-medium mt-1">Team Lead</h2>
            <p className="text-slate-700 mt-4 max-w-prose">
              Hello, my name is <strong>Iliana Gallegos</strong>. I am the Team Lead. 
              I coordinate the team, ensure milestones are met, and bridge communication 
              between front-end and back-end.
            </p>

            {/* Contact Button */}
            <a
              href="mailto:igallegos@sfsu.edu"
              className="inline-block mt-6 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}