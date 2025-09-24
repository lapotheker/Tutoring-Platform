export default function JonathanPage() {
  return (
    <section className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-2xl shadow-md bg-white">
      <h1 className="text-3xl font-bold">Jonathan Tsang</h1>

      <p className="mt-4 text-slate-700 leading-relaxed">
        Hi, I’m <strong>Jonathan Tsang</strong>, and I am one of the backend developers
        for this project. I provide support for serverside logic as well as database logic 
        where needed.
      </p>

      <p className="mt-4 text-slate-600">
        📧{" "}
        <a
          href="mailto:jtsang1@sfsu.edu"
          className="text-blue-600 hover:underline"
        >
          jtsang1@sfsu.edu
        </a>
      </p>
    </section>
  );
}
