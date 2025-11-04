import { Link } from "react-router-dom";

export default function RoxanaPage() {
  return (
    <section className="max-w-2xl mx-auto p-6">
      <Link to="/about" className="inline-block text-blue-600 hover:underline mb-4">
        ← Back to About
      </Link>

      <h1 className="text-3xl font-bold">Roxana del Toro</h1>

      <img
        src="http://bit.ly/3IAdr9f"
        alt="Roxana del Toro"
        className="mt-4 h-40 w-40 rounded-full object-cover shadow-md"
      />

      <p className="mt-4 text-slate-700 leading-relaxed">
        I'm <strong>Rox</strong>, a backend developer for this website. I write Javascript and get
        our APIs working. I assist in coding, infrastructure, and deployment.
      </p>

      <p className="mt-4 text-slate-600">
        📧{" "}
        <a href="mailto:rxdt@sfsu.edu" className="text-blue-600 hover:underline">
          rxdt@sfsu.edu
        </a>
      </p>
    </section>
  );
}
