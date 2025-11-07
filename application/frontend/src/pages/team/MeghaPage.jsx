import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function MeghaPage() {
  return (
    <section className="max-w-lg mx-auto mt-8">
      <Link to="/about" className="inline-block text-blue-600 hover:underline mb-4">
        ← Back to About
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://ui-avatars.com/api/?name=Megha+Rai&size=256"
            alt="Megha Rai"
            className="h-40 w-40 rounded-full object-cover shadow-md"
          />

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Megha Rai</h1>
          <h2 className="mt-1 text-slate-500 font-medium">Front-End Developer</h2>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Hi, I’m <strong>Megha Rai</strong>. I work on front-end features and contribute to
            building user interfaces that enhance usability and deliver a smooth user experience.
          </p>

          <a
            href="mailto:mrai@sfsu.edu"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-blue-600 hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" />
            mrai@sfsu.edu
          </a>
        </div>
      </div>
    </section>
  );
}
