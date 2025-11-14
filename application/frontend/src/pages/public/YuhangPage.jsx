export default function YuhangPage() {
  return (
    <section className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Yuhang Wei</h1>

      <img
        src="https://ui-avatars.com/api/?name=Yuhang+Wei&size=256"
        alt="Yuhang Wei"
        className="mt-4 h-40 w-40 rounded-full object-cover shadow-md"
      />

      <p className="mt-4 text-slate-700 leading-relaxed">
        Hi, I’m <strong>Yuhang Wei</strong>, the GitHub Master of our team. I manage the repository,
        branching workflow, and pull requests. My role ensures smooth collaboration and version
        control across our project.
      </p>

      <p className="mt-4 text-slate-600">
        📧{" "}
        <a href="mailto:ywei@sfsu.edu" className="text-blue-600 hover:underline">
          ywei@sfsu.edu
        </a>
      </p>
    </section>
  );
}
