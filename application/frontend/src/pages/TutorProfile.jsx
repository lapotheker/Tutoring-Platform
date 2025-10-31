import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Demo dataset — replace with API call later
const SAMPLE = [
  {
    id: 1,
    name: "Sarah Garcia",
    title: "Graduate Teaching Assistant",
    rate: 25,
    courses: ["CSC 648 - Software Engineering"],
    languages: ["English", "Spanish"],
    availability: [
      { label: "Monday–Friday", time: "2pm–6pm" },
      { label: "Saturday", time: "10am–2pm" },
    ],
  },
  {
    id: 2,
    name: "Namiko Turner",
    title: "Graduate Teaching Assistant",
    rate: 30,
    courses: ["CSC 648", "CSC 317"],
    languages: ["English"],
    availability: [{ label: "Weekdays", time: "Evenings" }],
  },
];

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation(); // keep previous filters (?course=...)

  const [data, setData] = useState(null);

  // Load data (demo uses SAMPLE; replace with fetch by id)
  useEffect(() => {
    const numeric = Number(id);
    const found = SAMPLE.find((t) => t.id === numeric) || null;
    setData(found);

    // Example when backend is ready:
    // (async () => {
    //   const base = import.meta.env.VITE_API_BASE_URL || "";
    //   const res = await fetch(`${base}/api/tutors/${id}`);
    //   if (res.ok) setData(await res.json());
    // })();
  }, [id]);

  const backHref = useMemo(() => ({ pathname: "/results", search }), [search]);

  if (!data) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">Tutor not found.</div>
        <div className="mt-3">
          <Link to={backHref} className="text-blue-600 hover:underline">
            Back to Results
          </Link>
        </div>
      </section>
    );
  }

  // Build contact URL: /tutor/request/:id?to=<name>&(keep prior filters)
  function goContact() {
    const params = new URLSearchParams(search); // copies existing ?subject=... etc
    params.set("to", data.name); // add tutor name for downstream pages
    navigate({ pathname: `/tutor/request/${data.id}`, search: `?${params.toString()}` });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        {/* Back */}
        <Link to={backHref} className="text-sm font-medium text-blue-600 hover:underline">
          &lt; BACK TO RESULTS
        </Link>

        {/* Header row */}
        <div className="mt-4 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-2xl">
            👤
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">{data.name.toUpperCase()}</h1>
            <div className="text-sm text-slate-700">{data.title}</div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid gap-4 max-w-2xl">
          <div>
            <div className="font-semibold">Hourly Rate</div>
            <div>${data.rate}/hour</div>
          </div>

          <div>
            <div className="font-semibold">Courses Covered</div>
            <ul className="list-disc pl-5 text-sm">
              {data.courses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold">Languages Spoken</div>
            <div className="text-sm">{data.languages.join(", ")}</div>
          </div>

          <div>
            <div className="font-semibold">Availability Summary</div>
            <ul className="list-disc pl-5 text-sm">
              {data.availability.map((a, i) => (
                <li key={i}>
                  <span className="font-medium">{a.label}:</span>{" "}
                  <span className="underline decoration-slate-400 underline-offset-2">
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6">
          <button
            onClick={goContact}
            className="rounded border px-4 py-2 font-semibold hover:bg-slate-50"
          >
            CONTACT
          </button>
        </div>
      </div>
    </section>
  );
}
